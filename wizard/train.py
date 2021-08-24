import scipy as sp
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
import matplotlib.pyplot as plt
import pandas as pd
from joblib import dump, load
import os, datetime, sys
import datacleaner as dc

# clean the csvs and build a DataFrame from them
dispatches = pd.DataFrame(dc.clean(sys.argv[1:]))

# Build features and targets
X = dispatches[["weight", "wind_dir", "wind_speed", "speed"]].to_numpy()
y = dispatches["setup"].to_numpy()
(X_train, X_test, y_train, y_test) = train_test_split(X, y, test_size=0.28)

# fit model
print("Training KNN21")
model_knn21 = KNeighborsClassifier(n_neighbors=21, weights='distance', algorithm='ball_tree').fit(X_train, y_train)
# print("Training Log_Reg")
# model_log_reg = LogisticRegression(max_i
# ter=1000000000000, n_jobs=-1, C=0.01).fit(X_train, y_train)

# test accuracy
pred_knn21 = model_knn21.predict(X_test)
# pred_log_reg = model_log_reg.predict(X_test)

acc_knn21 = round(accuracy_score(y_test, pred_knn21)*100)
# acc_log_reg = round(accuracy_score(y_test, pred_log_reg)*100)

if not os.path.exists("./models/"): os.mkdir("models")

dump(model_knn21, f"./models/wind_wizard_acc-{acc_knn21}_{datetime.datetime.now().date()}.model")
# dump(model_log_reg, f"./models/wind_wizard_{acc_log_reg}_{datetime.datetime.now().date()}.logreg")

print(f"Models written to models directory.")
