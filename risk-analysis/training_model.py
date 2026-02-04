import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

np.random.seed(42)
data_size = 2000

vol_ratio = np.random.uniform(0.7, 2.0, data_size)
correlation = np.random.uniform(0.1, 0.9, data_size)
var = np.random.uniform(-0.08, -0.01, data_size)
mc_worst = np.random.uniform(-0.25, -0.02, data_size)

X = np.column_stack((vol_ratio, correlation, var, mc_worst))

y = []
for v, c, va, mc in X:
    risk_score = (v * 0.4) + (c * 0.3) + (abs(va) * 5) + (abs(mc) * 2)
    if risk_score > 2.2:
        y.append("HIGH")
    elif risk_score > 1.4:
        y.append("MEDIUM")
    else:
        y.append("LOW")

y = np.array(y)

model = RandomForestClassifier(n_estimators=200)
model.fit(X, y)

joblib.dump(model, "risk_model.pkl")
print("✅ Risk model trained and saved as risk_model.pkl")
