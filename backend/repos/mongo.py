import pymongo
from models.dispatch import Dispatch
from models.user import User
from pprint import pprint


class MongoDispatchRepo:
    def __init__(self, conn_str):
        self._conn = pymongo.MongoClient(
            conn_str, serverSelectionTimeoutMS=5000)
        self._db = self._conn.zw
        self._collection = self._db.winds

    def get_all(self) -> list:
        from_db = list(self._collection.find())
        return [Dispatch.from_dict(x) for x in from_db]

    def by_id(self, _id) -> Dispatch:
        return Dispatch.from_dict(self._collection.find_one({'_id': _id}))

    def by_date(self, date: str) -> Dispatch:
        from_db = list(self._collection.find({'date': date}))
        return [Dispatch.from_dict(x) for x in from_db]

    def delete(self, id):
        self._collection.delete_one({'_id': id})

    def update(self, dispatch: Dispatch):
        new = dispatch.as_dict()
        pprint(dispatch._id)
        self._collection.find_one_and_replace({'_id': new["_id"]}, new)

    def add(self, dispatch: Dispatch) -> int:
        self._collection.insert_one(dispatch.as_dict())

class MongoUserRepo:
    def __init__(self, conn_str):
        self._conn = pymongo.MongoClient(
            conn_str, serverSelectionTimeoutMS=5000)
        self._db = self._conn.zw
        self._collection = self._db.users

    def get_all(self) -> list:
        from_db = list(self._collection.find())
        return [User.from_dict(x) for x in from_db]

    def by_email(self, email) -> User:
        return User.from_dict(self._collection.find_one({'email': email}))

    def by_date(self, date: str) -> User:
        from_db = list(self._collection.find({'date': date}))
        return [User.from_dict(x) for x in from_db]

    def delete(self, id):
        self._collection.delete_one({'_id': id})

    def update(self, user: User):
        new = user.as_dict()
        pprint(user._id)
        self._collection.find_one_and_replace({'_id': new["_id"]}, new)

    def add(self, user: User) -> int:
        self._collection.insert_one(user.as_dict())
