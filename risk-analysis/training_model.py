
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

np.random.seed(42)
data_size = 2000

vol_ratio = np.random.uniform(0.7, 2.8, data_size)
correlation = np.random.uniform(0.1, 1.0, data_size)
var = np.random.uniform(-0.15, -0.01, data_size)
mc_worst = np.random.uniform(-0.60, -0.02, data_size)

X = np.column_stack((vol_ratio, correlation, var, mc_worst))

y = []
for v, c, va, mc in X:
    risk_score = (v * 0.3) + (c * 0.25) + (abs(va) * 4) + (abs(mc) * 3)
    
    if risk_score > 1.2:  
        y.append("HIGH")
    elif risk_score > 0.7:  
        y.append("MEDIUM")
    else:
        y.append("LOW")

y = np.array(y)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X, y)

joblib.dump(model, "risk_model_new.pkl")
print("✅ Risk model trained and saved as risk_model.pkl")

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Classification Report:")
print(classification_report(y_test, y_pred))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
