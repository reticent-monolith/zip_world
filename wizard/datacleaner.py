#! /usr/bin/python

# Combine all lines into one 'line', duplicating the wind data across them
import csv, os, sys, shutil


def get_data(csv_files) -> list:
    data = []
    for f in csv_files:
        with open(f) as file:
            r = csv.DictReader(file)
            for d in r:
                d = {x: y.strip() for x, y in d.items()}
                if not (d["weight4"] == "" and
                        d["weight3"] == "" and
                        d["weight2"] == "" and
                        d["weight1"] == ""):
                    data.append(d)
    return data
        
# remove riders with test weights or no rider

def swap_setup_and_strip(setup):
    setup = setup.strip()
    if setup in ["S3 SN2", "SN2S3"]:
        return "SN2 S3"
    elif setup in ["S3 S1", "S1S3"]:
        return "S1 S3"
    elif setup in ["S3 S02", "S3 SO2"]:
        return "SO2 S3"
    elif setup in ["S02"]:
        return "SO2"
    elif setup in ["SN2X2 S3", "SN2 X2 S3", "S3 SN2 SN2", "S3 SN2X2", "S3 SN2 X2", "S3SN2X2", "SN2 X2 S3 A", "SN2X2S3A", "SN2X2S3"]:
        return "SN2 SN2 S3"
    elif setup in ["S3 SN2 SO2", "S3 SN2 S02", "S3SN2SO2", "SO2SN2S3"]:
        return "SO2 SN2 S3"
    elif setup in ["S3 SN2 S1", "S3SN2S1", "S1SN2S3"]:
        return "S1 SN2 S3"
    else:
        return setup

def write_to_file(data):
    with open("./cleaned/cleaned.csv", 'w') as file:
        dw = csv.DictWriter(file, fieldnames=["weight","setup","speed","wind_dir","wind_speed"])
        dw.writeheader()
        for d in data:
            dw.writerow(d)

def clean(files):
    data = get_data(files)
    singled_data = []
    failed = 0
    setups = ["X", "S1", "SO2", "SN2", "S3", "S1 S3", "SO2 S3", "SN2 S3", "S1 SN2 S3", "SO2 SN2 S3", "SN2 SN2 S3", 10, 20, 30, 40, 50, 60, 70]
    # TODO add 60 and 70 back in to setups when Guy gives us more data
    if os.path.exists("./cleaned/"):
        shutil.rmtree("./cleaned/")
    os.mkdir("cleaned")
    error_log = open("./cleaned/errors.log", 'a')
    for d in data:
        for n in range(1,5):
            if (d[f"weight{n}"] not in ["TW50", "X"]):
                setup = None
                try: 
                    setup = int(d[f"setup{n}"])-int(d[f"weight{n}"])
                    if setup not in setups:
                        error_log.write(f"""Added weight invalid: {d[f"weight{n}"]} {d[f"setup{n}"]}\n""")
                        raise Exception()
                except:
                    setup = swap_setup_and_strip(d[f"setup{n}"])
                try:
                    speed = int(d[f"speed{n}"])
                    # if not (speed >= 25 and speed <= 50):
                    #     # error_log.write(f"""Speed outside of correct range: {d[f"weight{n}"]} {d[f"setup{n}"]}""")
                    #     raise Exception("Speed outside of correct range")
                    singled_data.append({
                        "weight": int(d[f"weight{n}"]),
                        "setup": setups.index(setup),
                        "speed": speed,
                        "wind_dir": int(d["wind_dir"]),
                        "wind_speed": float(d["wind_speed"])
                    })
                except Exception as e:
                    error_log.write(f"{e} || ")
                    error_log.write(f"""{d[f"weight{n}"]} {d[f"setup{n}"]} {d[f"speed{n}"]} {d["wind_dir"]} {d["wind_speed"]}\n""")
                    failed += 1
    error_log.write(f"Did not use {failed} riders")        
    error_log.close()
    return singled_data


if __name__=="__main__":
    write_to_file(clean(sys.argv[1:]))
    
    
