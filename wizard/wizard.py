import sys
from joblib import load


# interactive loop
def wizard(model, weight, wind_degrees, wind_speed, speed=37):
    setups = ["X", "S1", "SO2", "SN2", "S3", "S1 S3", "SO2 S3", "SN2 S3",
              "S1 SN2 S3", "SO2 SN2 S3", "SN2 SN2 S3", 10, 20, 30, 40, 50, 60, 70]

    rider_data = [weight, wind_degrees, wind_speed, speed]
    # weight, wind direction, wind speed, arrival speed
    test = model.predict([rider_data])
    print(
        f"Prediction for {rider_data[0]}kg @ {rider_data[3]}mph, with {rider_data[2]}mph {rider_data[1]}deg wind: {setups[test[0]]}")


if __name__ == "__main__":
    if len(sys.argv) == 6:
        wizard(load(sys.argv[1]), int(sys.argv[2]),
               int(sys.argv[3]), float(sys.argv[4]), int(sys.argv[5]))
    else:
        wizard(load(sys.argv[1]), int(sys.argv[2]),
               int(sys.argv[3]), float(sys.argv[4]))
