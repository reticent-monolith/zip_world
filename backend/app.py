from models.user import User
from quart import Quart, request, jsonify, make_response
from repos.mysql import MySQLDispatchRepo, MySQLUserRepo
from models.dispatch import Dispatch
from pprint import pprint

app = Quart(__name__)
dispatch_repo = MySQLDispatchRepo()
user_repo = MySQLUserRepo()

# DISPATCH ROUTES
@app.route('/bydate/<date>')
def by_date(date):
    """
    Return all dispatches from given date.
    """
    dispatches = [dispatch.as_dict() for dispatch in dispatch_repo.by_date(date.replace('-', '/'))]
    response = make_response(jsonify(dispatches), 200,)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.route('/add', methods=['POST', 'OPTIONS'])
def add():
    """
    Add a dispatch to the database.
    """
    if request.method == 'POST':
        body = request.json
        dispatch = Dispatch.from_dict(body)
        try:
            dispatch_repo.add(dispatch)
        except Exception as e:
            return make_response(f"{e} when adding {dispatch} to the database", 501)
        response = make_response("", 200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        response.headers['Access-Control-Allow-Headers'] = 'content-type'
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

@app.route('/delete', methods=['POST', 'OPTIONS'])
def delete():
    """
    Delete a dispatch from the database.
    """
    if request.method == 'POST':
        id = request.get_data().decode("utf-8")
        try:
            dispatch_repo.delete(id)
        except Exception as e:
            response =  make_response(f"{e} when deleting dispatch with id {id} from the database", 501)
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        response = make_response("", 200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        response.headers['Access-Control-Allow-Headers'] = 'content-type'
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

@app.route('/update', methods=['POST', 'OPTIONS'])
def update():
    """
    Update a dispatch in the database.
    """
    if request.method == 'POST':
        body = request.json
        dispatch = Dispatch.from_dict(body)
        try:
            dispatch_repo.update(dispatch)
        except Exception as e:
            print(e)
            response =  make_response(f"{e} when updating dispatch with id {id}", 501)
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        response = make_response("", 200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        response.headers['Access-Control-Allow-Headers'] = 'content-type'
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

# USER AUTH ROUTES
@app.route("/adduser", methods=["GET", "POST"])
def add_user():
    """
    Add a new user
    """
    if request.method == "POST":
        new_user = request.json
        user = User.from_dict(new_user)
        try:
            user_repo.add(user)
        except Exception as e:
            print(e)
            response = make_response(
                f"{e} when adding user to database", 501)
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        response = make_response("", 200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        response.headers['Access-Control-Allow-Headers'] = 'content-type'
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

@app.route("/authorise", methods=["GET", "POST"])
def authorise():
    """
    Authorise a user's login
    """
    request_details = request.json
    user = User.from_dict(user_repo.by_email(request_details["email"]))
    if user.password_hash == request_details["password-hash"]:
        response = make_response("allow", 200)
    else:
        response = make_response("deny", 200)
    return response