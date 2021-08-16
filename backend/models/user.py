from pprint import pprint
import hashlib
import bson

class User:
    """
    A class for users of the winds system, with password functionality
    and stat tracking.
    """

    def __init__(self, name, password_hash, email, _id=None, stats={
        "avg_arrival": 0,
        "fastest": 0,
        "slowest": 0,
        "dispatches_sent": 0,
        "riders_sent": 0,
        "in_the_zone": 0,
    }):
        self.name = name
        self.password_hash = password_hash
        self.stats = stats
        self.email = email
        self._id = _id if _id else None

    def __repr__(self):
        return pprint.pformat(self.as_dict())

    def as_dict(self) -> dict:
        return {
            "name": self.name,
            "password-hash": self.password_hash,
            "email": self.email,
            "stats": self.stats
        }

    @classmethod
    def from_dict(cls, u):
        return cls(
            name=u["name"],
            password_hash=u["password-hash"],
            email=u["email"],
            _id=bson.ObjectId(
                u['_id']) if '_id' in u.keys() else bson.ObjectId(),
            stats=u["stats"]
        )

    @staticmethod
    def hash_password(password: str) -> bytearray:
        return hashlib.sha256(password.encode()).hexdigest()

    def change_password(self, new_password: str):
        """
        Method to change the hashed password
        """
        self.password_hash = User.hash_password(new_password)
