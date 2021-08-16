import mysql.connector
from models.dispatch import Dispatch
from models._rider import Rider
import datetime

def dispatches_from(cursor) -> list:
    return [Dispatch(
            wind_deg=winddegrees,
            wind_spd=windspeed,
            inst=instructor,
            bt=btradio,
            comment=comment,
            _id=_id,
            date=dt.date(),
            time=dt.time(),
            riders={
                '4': Rider(weight4, trolley4, front4, middle4, rear4, added4, speed4),
                '3': Rider(weight3, trolley3, front3, middle3, rear3, added3, speed3),
                '2': Rider(weight2, trolley2, front2, middle2, rear2, added2, speed2),
                '1': Rider(weight1, trolley1, front1, middle1, rear1, added1, speed1)
            }
        ) for (
            _id, dt, 
            weight4, front4, middle4, rear4, added4, speed4, trolley4,
            weight3, front3, middle3, rear3, added3, speed3, trolley3,
            weight2, front2, middle2, rear2, added2, speed2, trolley2,
            weight1, front1, middle1, rear1, added1, speed1, trolley1,
            windspeed, winddegrees,
            instructor, btradio,
            comment
        ) in cursor.fetchall()]

class MySQLDispatchRepo:
    def __init__(self, conn_str="127.0.0.1"):
        self.conn = mysql.connector.connect(
            user="zw_admin",
            password="zw_pass",
            host=conn_str,
            database="zw_db"
        )

    def close_connection(self):
        self.conn.close()

    def get_all(self) -> list:
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM windsData")
        results = dispatches_from(cursor)
        cursor.close()
        return results

        
    def by_id(self, _id) -> Dispatch:
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM windsData WHERE id = %s", (_id,))
        results = dispatches_from(cursor)
        cursor.close()
        return results

    def by_date(self, date: str) -> Dispatch:
        start = datetime.datetime.fromisoformat(f"{date} 00:00:00")
        end = datetime.datetime.fromisoformat(f"{date} 23:59:59")
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM windsData WHERE datetime >= %s AND datetime < %s", (start, end))
        results = dispatches_from(cursor)
        cursor.close()
        return results
        

    def delete(self, id) -> None:
        cursor = self.conn.cursor()
        cursor.execute("DELETE FROM windsData WHERE id = %s", (id,))
        cursor.close()

    def update(self, d: Dispatch):
        cursor = self.conn.cursor()
        cursor.execute((
            "UPDATE windsData SET "
            "weight4=%s,front4=%s,middle4=%s,rear4=%s,added4=%s,speed4=%s,trolley4=%s,"
            "weight3=%s,front3=%s,middle3=%s,rear3=%s,added3=%s,speed3=%s,trolley3=%s,"
            "weight2=%s,front2=%s,middle2=%s,rear2=%s,added2=%s,speed2=%s,trolley2=%s,"
            "weight1=%s,front1=%s,middle1=%s,rear1=%s,added1=%s,speed1=%s,trolley1=%s,"
            "windSpeed=%s,windDirection=%s,windsInstructor=%s,bigTopInstructor=%s,comment=%s "
            "WHERE id = %s"
            ), (
                d.riders["4"].weight          if d.riders["4"] else None,
                d.riders["4"].frontSlider     if d.riders["4"] else None,
                d.riders["4"].middleSlider    if d.riders["4"] else None,
                d.riders["4"].rearSlider      if d.riders["4"] else None,
                d.riders["4"].addedWeight     if d.riders["4"] else None,
                d.riders["4"].speed           if d.riders["4"] else None,
                d.riders["4"].trolley         if d.riders["4"] else None,
                d.riders["3"].weight          if d.riders["3"] else None,
                d.riders["3"].frontSlider     if d.riders["3"] else None,
                d.riders["3"].middleSlider    if d.riders["3"] else None,
                d.riders["3"].rearSlider      if d.riders["3"] else None,
                d.riders["3"].addedWeight     if d.riders["3"] else None,
                d.riders["3"].speed           if d.riders["3"] else None,
                d.riders["3"].trolley         if d.riders["3"] else None,
                d.riders["2"].weight          if d.riders["2"] else None,
                d.riders["2"].frontSlider     if d.riders["2"] else None,
                d.riders["2"].middleSlider    if d.riders["2"] else None,
                d.riders["2"].rearSlider      if d.riders["2"] else None,
                d.riders["2"].addedWeight     if d.riders["2"] else None,
                d.riders["2"].speed           if d.riders["2"] else None,
                d.riders["2"].trolley         if d.riders["2"] else None,
                d.riders["1"].weight          if d.riders["1"] else None,
                d.riders["1"].frontSlider     if d.riders["1"] else None,
                d.riders["1"].middleSlider    if d.riders["1"] else None,
                d.riders["1"].rearSlider      if d.riders["1"] else None,
                d.riders["1"].addedWeight     if d.riders["1"] else None,
                d.riders["1"].speed           if d.riders["1"] else None,
                d.riders["1"].trolley         if d.riders["1"] else None,
                d.wind_speed, d.wind_degrees,
                d.winds_instructor, d.bt_radio,
                d.comment,
                d._id
            ))

    def add(self, d: Dispatch) -> int:
        cursor = self.conn.cursor()
        cursor.execute(f"INSERT INTO windsData VALUES ({'%s,'*34}%s)", (
            None,
            datetime.datetime.fromisoformat(f"{d.date} {d.time}"),
            d.riders["4"].weight          if d.riders["4"] else None,
            d.riders["4"].frontSlider     if d.riders["4"] else None,
            d.riders["4"].middleSlider    if d.riders["4"] else None,
            d.riders["4"].rearSlider      if d.riders["4"] else None,
            d.riders["4"].addedWeight     if d.riders["4"] else None,
            d.riders["4"].speed           if d.riders["4"] else None,
            d.riders["4"].trolley         if d.riders["4"] else None,
            d.riders["3"].weight          if d.riders["3"] else None,
            d.riders["3"].frontSlider     if d.riders["3"] else None,
            d.riders["3"].middleSlider    if d.riders["3"] else None,
            d.riders["3"].rearSlider      if d.riders["3"] else None,
            d.riders["3"].addedWeight     if d.riders["3"] else None,
            d.riders["3"].speed           if d.riders["3"] else None,
            d.riders["3"].trolley         if d.riders["3"] else None,
            d.riders["2"].weight          if d.riders["2"] else None,
            d.riders["2"].frontSlider     if d.riders["2"] else None,
            d.riders["2"].middleSlider    if d.riders["2"] else None,
            d.riders["2"].rearSlider      if d.riders["2"] else None,
            d.riders["2"].addedWeight     if d.riders["2"] else None,
            d.riders["2"].speed           if d.riders["2"] else None,
            d.riders["2"].trolley         if d.riders["2"] else None,
            d.riders["1"].weight          if d.riders["1"] else None,
            d.riders["1"].frontSlider     if d.riders["1"] else None,
            d.riders["1"].middleSlider    if d.riders["1"] else None,
            d.riders["1"].rearSlider      if d.riders["1"] else None,
            d.riders["1"].addedWeight     if d.riders["1"] else None,
            d.riders["1"].speed           if d.riders["1"] else None,
            d.riders["1"].trolley         if d.riders["1"] else None,
            d.wind_speed, d.wind_degrees,
            d.winds_instructor, d.bt_radio,
            d.comment
        ))
        self.conn.commit()
        cursor.close()


class MySQLUserRepo:
    def __init__(self, conn_str="127.0.0.1"):
        self.conn = mysql.connector.connect(
            user="zw_admin",
            password="zw_pass",
            host=conn_str,
            database="zw_db"
        )