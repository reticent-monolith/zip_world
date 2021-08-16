from repos.mysql import MySQLDispatchRepo, MySQLUserRepo
from models.dispatch import Dispatch
from models._rider import Rider

repo = MySQLDispatchRepo()

repo.update(Dispatch(
    112, 18.9, "Tom", "Ben", "2021-08-15", "12:45:23", riders={
        "4": Rider(69, 123, front="BLACK"),
        "2": Rider(112, 289, front="OLD_RED", rear="YELLOW"),
        "1": Rider(112, 289, front="OLD_RED", rear="YELLOW"),
        "3": Rider(112, 289, front="OLD_RED", rear="YELLOW")
    }, _id=3,
))

all = repo.by_date("2021-08-15")
print(all)
