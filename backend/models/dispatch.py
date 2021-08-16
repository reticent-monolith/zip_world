import pprint
from models._rider import Rider

class Dispatch:
    def __init__(self, wind_deg, wind_spd, bt, inst, date, time, comment="", riders={}, _id=None):
        self.riders = {'1': None, '2': None, '3': None, '4': None} | riders
        self.date = date
        self.time = time
        self._id = _id if _id else None
        self.wind_degrees = wind_deg
        self.wind_speed = wind_spd
        self.bt_radio = bt
        self.winds_instructor = inst
        self.comment = comment

    def __repr__(self):
        return pprint.pformat(self.as_dict())

    def as_dict(self):
        return {
            'riders': {line: rider.__dict__ for line, rider in self.riders.items()},
            'windDegrees': self.wind_degrees,
            'windSpeed': self.wind_speed,
            'date': self.date.isoformat(),
            'time': self.time.isoformat(),
            'btRadio': self.bt_radio,
            'windsInstructor': self.winds_instructor,
            'comment': self.comment,
            '_id': str(self._id)
        }

    @classmethod
    def from_dict(cls, d):
        """
        Dispatch factory from supplied dictionary obtained from database or frontend
        """
        return cls(
            wind_deg=d['windDegrees'],
            wind_spd=d['windSpeed'],
            bt=d['btRadio'],
            inst=d['windsInstructor'],
            date=d['date'],
            time=d['time'],
            comment=d['comment'],
            riders={line: Rider.from_dict(rider)
                    for line, rider in d['riders'].items()},
            _id=d['_id'] if '_id' in d.keys() else None
        )
