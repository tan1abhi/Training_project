from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import yfinance as yf
import numpy as np
import joblib
import os
import mysql.connector
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
    mean_return = np.mean(portfolio_returns)
    std_dev = np.std(portfolio_returns)

    results = []
    for _ in range(simulations):
        simulated = np.random.normal(mean_return, std_dev, days)
        cumulative = np.prod(1 + simulated) - 1
        results.append(cumulative)

    return results


def calculate_var(portfolio_returns, confidence=0.95):
    sorted_returns = np.sort(portfolio_returns)
    index = int((1 - confidence) * len(sorted_returns))
    return sorted_returns[index]


def analyze_portfolio(assets):
    values, symbols = [], []

    for a in assets:
        values.append(a["quantity"] * a["price"])
        symbols.append(a["assetSymbol"])

    data = yf.download(symbols, period="1y", progress=False)
    prices = data["Adj Close"] if "Adj Close" in data else data["Close"]

    valid = prices.columns.tolist()
    aligned_symbols = []
    aligned_values = []

    for a in assets:
        if a["assetSymbol"] in valid:
            aligned_symbols.append(a["assetSymbol"])
            aligned_values.append(a["quantity"] * a["price"])

    weights = np.array(aligned_values) / sum(aligned_values)
    returns = prices[aligned_symbols].pct_change().dropna()
    portfolio_returns = returns.dot(weights)

    vol_10 = portfolio_returns.rolling(10).std().iloc[-1]
    vol_30 = portfolio_returns.rolling(30).std().iloc[-1]
    ratio = vol_10 / vol_30 if vol_30 != 0 else 0

    mc_results = monte_carlo_simulation(portfolio_returns)
    best_case = np.percentile(mc_results, 95)
    worst_case = np.percentile(mc_results, 5)
    expected_case = np.mean(mc_results)

    var_95 = calculate_var(portfolio_returns, 0.95)
    avg_corr = returns.corr().values[np.triu_indices(len(aligned_symbols), k=1)].mean()

    feature_vector = np.array([[ratio, avg_corr, var_95, worst_case]])
    risk = risk_model.predict(feature_vector)[0]

    vol_msg = "Recent market movement is stable." if ratio < 1.1 else "Recent market volatility has increased."

    mc_msg = (
        f"In a good market scenario, your portfolio might gain about {round(best_case*100,2)}% "
        f"next month. In a bad scenario, it could drop about {round(worst_case*100,2)}%."
    )

    var_msg = (
        f"There is only a 5% chance your portfolio could lose more than "
        f"{round(abs(var_95)*100,2)}% in a single day."
    )

    summary = f"Overall portfolio risk is {risk}. {vol_msg} {mc_msg} {var_msg}"

    return {
        "risk_level": risk,
        "volatility_ratio": round(float(ratio), 4),
        "average_correlation": round(float(avg_corr), 4),
        "monte_carlo": {
            "best_case_return": round(float(best_case), 4),
            "expected_return": round(float(expected_case), 4),
            "worst_case_return": round(float(worst_case), 4)
        },
        "value_at_risk_95": round(float(var_95), 4),
        "investor_summary": summary,
        "assets_analyzed": aligned_symbols
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
