from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import yfinance as yf
import numpy as np

app = Flask(__name__)
CORS(app)  # 🔥 allow React to call Flask


# =========================
# DB
# =========================
def fetch_transactions_from_db():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="n3u3da!",
        database="portfoliodb"
    )

    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT ticker, quantity, buy_price
        FROM portfolio_items
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows


# =========================
# TRANSACTIONS → POSITIONS
# =========================
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


# =========================
# RISK ENGINE
# =========================
def analyze_portfolio(assets):
    values, symbols = [], []

    for a in assets:
        values.append(a["quantity"] * a["price"])
        symbols.append(a["assetSymbol"])

    data = yf.download(symbols, period="1y", progress=False)
    prices = data["Adj Close"] if "Adj Close" in data else data["Close"]

    valid = prices.columns.tolist()

    aligned_values = []
    aligned_symbols = []

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

    if ratio > 1.5:
        risk = "HIGH"
    elif ratio > 1.1:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "risk": risk,
        "volatility_ratio": round(float(ratio), 4),
        "assets": aligned_symbols
    }


# =========================
# API ROUTE
# =========================
@app.route("/api/portfolio/risk", methods=["GET"])
def get_portfolio_risk():
    transactions = fetch_transactions_from_db()
    assets = build_assets(transactions)

    if not assets:
        return jsonify({"error": "No assets"}), 400

    result = analyze_portfolio(assets)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True , port=4000)
