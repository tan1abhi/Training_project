import yfinance as yf
import pandas as pd
import numpy as np
import sys
import json

def analyze_portfolio(assets):
    # -------------------------------
    # Step 1: Convert holdings → weights
    # -------------------------------
    values = []
    symbols = []

    for asset in assets:
        symbol = asset["assetSymbol"]
        qty = float(asset["quantity"])
        price = float(asset["price"])
        value = qty * price

        symbols.append(symbol)
        values.append(value)

    total_value = sum(values)
    weights = np.array([v / total_value for v in values])

    # -------------------------------
    # Step 2: Fetch 1 year historical prices
    # -------------------------------
    data = yf.download(symbols, period="1y")

    if isinstance(data.columns, pd.MultiIndex):
        if "Adj Close" in data.columns.get_level_values(0):
            prices = data["Adj Close"]
        else:
            prices = data["Close"]
    else:
        prices = data

    if isinstance(prices, pd.Series):
        prices = prices.to_frame()

    # -------------------------------
    # Step 3: Daily returns
    # -------------------------------
    returns = prices.pct_change().dropna()
    portfolio_returns = returns.dot(weights)

    # -------------------------------
    # Step 4: Volatility trend
    # -------------------------------
    vol_10 = portfolio_returns.rolling(10).std().iloc[-1]
    vol_30 = portfolio_returns.rolling(30).std().iloc[-1]
    vol_ratio = vol_10 / vol_30 if vol_30 != 0 else 0

    # -------------------------------
    # Step 5: Diversification
    # -------------------------------
    corr_matrix = returns.corr()
    upper_triangle = corr_matrix.where(
        np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)
    )
    avg_corr = upper_triangle.stack().mean()

    # -------------------------------
    # Step 6: Risk classification
    # -------------------------------
    warnings = []

    if vol_ratio > 1.5:
        risk_level = "HIGH"
        warnings.append("Recent volatility spike detected.")
        volatility_msg = "Market movements have increased sharply in the last few days."
    elif vol_ratio > 1.1:
        risk_level = "MEDIUM"
        warnings.append("Volatility is rising.")
        volatility_msg = "Market fluctuations are higher than usual recently."
    else:
        risk_level = "LOW"
        warnings.append("Market volatility stable.")
        volatility_msg = "Market movements are stable and within normal range."

    if avg_corr and avg_corr > 0.75:
        warnings.append("Assets are highly correlated. Poor diversification.")
        diversification_msg = "Your investments tend to move together, which may increase risk during market drops."
    elif avg_corr and avg_corr < 0.3:
        diversification_msg = "Your investments move differently from each other, providing good diversification."
    else:
        diversification_msg = "Your portfolio has moderate diversification."

    # -------------------------------
    # Step 7: Investor-friendly summary
    # -------------------------------
    summary = (
        f"Your portfolio risk level is {risk_level}. "
        f"{volatility_msg} {diversification_msg}"
    )

    # -------------------------------
    # Final Output
    # -------------------------------
    return {
        "predicted_risk_level": risk_level,
        "volatility_ratio": float(vol_ratio),
        "average_correlation": float(avg_corr) if avg_corr else 0,
        "warnings": warnings,
        "investor_summary": summary,
        "volatility_explanation": volatility_msg,
        "diversification_explanation": diversification_msg
    }


# -------------------------------
# Entry point for Spring Boot
# -------------------------------
if __name__ == "__main__":
    try:
        input_json = sys.argv[1]
        payload = json.loads(input_json)
        assets = payload["assets"]

        result = analyze_portfolio(assets)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
