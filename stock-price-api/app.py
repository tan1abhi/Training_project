from flask import Flask, jsonify, request
import yfinance as yf

app = Flask(__name__)

# ✅ Allowed periods (prevents API misuse)
ALLOWED_PERIODS = ["5d", "1mo", "3mo", "6mo", "1y"]

@app.route("/stock/<ticker>", methods=["GET"])
def get_stock_data(ticker):

    try:
        # ✅ Read period from query param
        period = request.args.get("period", "3mo")

        # ✅ Validate period
        if period not in ALLOWED_PERIODS:
            return jsonify({
                "error": f"Invalid period. Allowed values: {ALLOWED_PERIODS}"
            }), 400

        stock = yf.Ticker(ticker)

        # ✅ Fetch metadata
        info = stock.info

        response_data = {
            "ticker": ticker.upper(),
            "companyName": info.get("longName"),
            "sector": info.get("sector"),
            "currency": info.get("currency"),
            "industry": info.get("industry"),
            "exchange": info.get("exchange"),
        }


        # ✅ Fetch historical data
        history = stock.history(period=period)

        if history.empty:
            return jsonify({"error": "Invalid ticker or no data available"}), 404

        historical_data = []

        for date, row in history.iterrows():
            historical_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"])
            })

        latest_price = historical_data[-1]["close"]

        # ✅ BONUS — Calculate return %
        first_price = historical_data[0]["close"]
        return_percent = round(
            ((latest_price - first_price) / first_price) * 100, 2
        )

        response = {
            "metadata": response_data,
            "latestPrice": latest_price,
            "period": period,
            "historicalData": historical_data,
            "returnPercentage": return_percent,
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
