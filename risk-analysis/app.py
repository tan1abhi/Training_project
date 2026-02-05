from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import yfinance as yf
import numpy as np
import joblib
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

risk_model = joblib.load("risk_model.pkl")


def fetch_transactions_from_db():
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT ticker, quantity, buy_price FROM portfolio_items")
    rows = cursor.fetchall()
    conn.close()
    return rows


def build_assets(rows):
    positions = {}

    for r in rows:
        symbol = r["ticker"]
        qty = float(r["quantity"])
        price = float(r["buy_price"])

        if qty <= 0 or price <= 0:
            continue

        if symbol not in positions:
            positions[symbol] = {"qty": 0.0, "value": 0.0}

        positions[symbol]["qty"] += qty
        positions[symbol]["value"] += qty * price

    assets = []
    for symbol, data in positions.items():
        assets.append({
            "assetSymbol": symbol,
            "quantity": data["qty"],
            "price": data["value"] / data["qty"]
        })

    return assets



def monte_carlo_simulation(portfolio_returns, days=30, simulations=1000):
    mean_return = portfolio_returns.mean()
    std_dev = portfolio_returns.std()

    results = []
    for _ in range(simulations):
        simulated = np.random.normal(mean_return, std_dev, days)
        cumulative = np.prod(1 + simulated) - 1
        results.append(cumulative)

    return np.array(results)


def calculate_var(returns, confidence=0.95):
    return np.percentile(returns, (1 - confidence) * 100)



def analyze_portfolio(assets):
    symbols = []
    values = []

    for a in assets:
        symbols.append(a["assetSymbol"])
        values.append(a["quantity"] * a["price"])

    
    data = yf.download(symbols, period="1y", progress=False)
    prices = data["Adj Close"] if "Adj Close" in data else data["Close"]

    aligned_symbols = prices.columns.tolist()
    aligned_values = [v for s, v in zip(symbols, values) if s in aligned_symbols]

    weights = np.array(aligned_values) / sum(aligned_values)
    returns = prices[aligned_symbols].pct_change().dropna()


    portfolio_returns = returns.dot(weights)

    vol_10 = portfolio_returns.rolling(10).std().iloc[-1]
    vol_30 = portfolio_returns.rolling(30).std().iloc[-1]
    volatility_ratio = vol_10 / vol_30 if vol_30 != 0 else 0

    avg_corr = returns.corr().values[np.triu_indices(len(aligned_symbols), k=1)].mean()

    mc_results = monte_carlo_simulation(portfolio_returns)
    best_case = np.percentile(mc_results, 95)
    worst_case = np.percentile(mc_results, 5)
    expected_case = mc_results.mean()

    var_95 = calculate_var(portfolio_returns, 0.95)

   
    portfolio_features = np.array([[
        volatility_ratio,
        avg_corr,
        var_95,
        worst_case
    ]])

    portfolio_risk_label = risk_model.predict(portfolio_features)[0]

    
    asset_vol = returns.std()
    asset_var = returns.quantile(0.05)

    cov_matrix = returns.cov().values
    portfolio_variance = weights.T @ cov_matrix @ weights

    marginal_contrib = cov_matrix @ weights
    risk_contrib = weights * marginal_contrib / portfolio_variance
    risk_contrib_norm = risk_contrib / risk_contrib.sum()

    per_asset_risk = []

    for i, symbol in enumerate(aligned_symbols):
        asset_features = np.array([[
            asset_vol[symbol] / vol_30 if vol_30 != 0 else 0,
            avg_corr,
            asset_var[symbol],
            asset_var[symbol]
        ]])

        asset_label = risk_model.predict(asset_features)[0]

        per_asset_risk.append({
            "ticker": symbol,
            "weight": round(float(weights[i]), 4),
            "volatility": round(float(asset_vol[symbol]), 4),
            "var_95": round(float(asset_var[symbol]), 4),
            "risk_contribution": round(float(risk_contrib_norm[i]), 4),
            "risk_label": asset_label
        })
    vol_msg = (
        "Recent market movement is stable."
        if volatility_ratio < 1.1
        else "Recent market volatility has increased."
    )

    summary = (
        f"Overall portfolio risk is {portfolio_risk_label}. "
        f"{vol_msg} "
        f"In a good market scenario, your portfolio might gain about {round(best_case * 100, 2)}% "
        f"next month. In a bad scenario, it could drop about {round(worst_case * 100, 2)}%. "
        f"There is only a 5% chance your portfolio could lose more than "
        f"{round(abs(var_95) * 100, 2)}% in a single day."
    )

    
    return {
        "assets_analyzed": aligned_symbols,
        "portfolio_risk": {
            "risk_level": portfolio_risk_label,
            "volatility_ratio": round(float(volatility_ratio), 4),
            "average_correlation": round(float(avg_corr), 4),
            "value_at_risk_95": round(float(var_95), 4),
            "monte_carlo": {
                "best_case_return": round(float(best_case), 4),
                "expected_return": round(float(expected_case), 4),
                "worst_case_return": round(float(worst_case), 4)
            },
            "investor_summary": summary
        },
        "per_asset_risk": per_asset_risk
    }

@app.route("/api/portfolio/risk", methods=["GET"])
def get_portfolio_risk():
    transactions = fetch_transactions_from_db()
    assets = build_assets(transactions)

    if not assets:
        return jsonify({"error": "No assets found in portfolio"}), 400

    result = analyze_portfolio(assets)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=4000)
