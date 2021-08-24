from quart import Quart, request, jsonify, make_response, session, redirect
from quart_cors import cors
from repos.pgsql import PgSQLDispatchRepo, PgSQLUserRepo
from models.dispatch import Dispatch
from pprint import pprint
import requests

app = Quart(__name__)
app.secret_key = "aejtXNCRZcfevq6SkqzC7cBtV-fVCDhDFNDHmokoCdc"
app = cors(app, allow_origin="http://localhost:3000", allow_headers="content-type", allow_credentials=True)
dispatch_repo = PgSQLDispatchRepo()

# TODO move these constants elsewhere
HOST = "localhost"
CLIENT_ID = "0efb7be0-cf63-4ab4-af11-3e7e32d8d25f"
CLIENT_SECRET = "aejtXNCRZcfevq6SkqzC7cBtV-fVCDhDFNDHmokoCdc"
REDIRECT_URI = f"http://{HOST}:5000/api/oauth-redirect"
APPLICATION_ID = "0efb7be0-cf63-4ab4-af11-3e7e32d8d25f"
API_KEY = "Bvkdd3asxZuy8dsGbjQIZhOLI95biFHWKbTGXGeILobKdsZauyjxce3I"
FRONT_PORT = 3000
SERVER_PORT = 5000
FUSIONAUTH_PORT = 9011


# DISPATCH ROUTES
@app.route('/api/bydate/<date>')
async def by_date(date):
    """
    Return all dispatches from given date.
    """
    dispatches = [dispatch.as_dict() for dispatch in dispatch_repo.by_date(date)]
    response = make_response(jsonify(dispatches), 200,)
    return await response

@app.route('/api/add', methods=['POST', 'OPTIONS'])
async def add():
    """
    Add a dispatch to the database.
    """
    if request.method == 'POST':
        body = await request.json
        dispatch = Dispatch.from_dict(body)
        try:
            dispatch_repo.add(dispatch)
        except Exception as e:
            print(e)
            return await make_response(f"{e} when adding {dispatch} to the database", 501)
        response = make_response("", 200)
        return await response
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        return await response

@app.route('/api/delete', methods=['POST', 'OPTIONS'])
async def delete():
    """
    Delete a dispatch from the database.
    """
    if request.method == 'POST':
        id = await request.get_data()
        try:
            dispatch_repo.delete(id)
        except Exception as e:
            response =  make_response(f"{e} when deleting dispatch with id {id} from the database", 501)
            return await response
        response = make_response("", 200)
        return await response
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        return await response

@app.route('/api/update', methods=['POST', 'OPTIONS'])
async def update():
    """
    Update a dispatch in the database.
    """
    if request.method == 'POST':
        body = await request.json
        dispatch = Dispatch.from_dict(body)
        try:
            dispatch_repo.update(dispatch)
        except Exception as e:
            print(e)
            response =  make_response(f"{e} when updating dispatch with id {id}", 501)
            return await response
        response = make_response("", 200)
        return await response
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        return await response


# AUTH ROUTES
@app.route("/api/login")
async def login():
    return redirect(f"http://{HOST}:{FUSIONAUTH_PORT}/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code")

@app.route("/api/logout")
async def logout():
    session.clear()
    return redirect(f"http://{HOST}:{FUSIONAUTH_PORT}/oauth2/logout?client_id={CLIENT_ID}")

@app.route("/api/user")
async def user():
    if session.get("token"):
        user_info = requests.post(
            f"http://{HOST}:{FUSIONAUTH_PORT}/oauth2/introspect",
            {
                "client_id": CLIENT_ID,
                "token": session.get("token")
            }
        ).json()
        if user_info.get("active") == True:
            body = requests.get(
                f"http://{HOST}:{FUSIONAUTH_PORT}/api/user/{user_info.get('sub')}/{APPLICATION_ID}",
                headers={"Authorization": API_KEY}
            )
            body = body.json() | {"token": session.get("token")}
            return await make_response(jsonify(body), 200)
        else:
            print("NOT ACTIVE")
            return await make_response(jsonify({}), 200)
    else:
        print("NO TOKEN")
        return await make_response(jsonify({}), 200)

@app.route("/api/oauth-redirect")
async def callback():
    code = (await request.values).get("code")
    print(f"Code = {code}")
    token = requests.post(
        f"http://{HOST}:{FUSIONAUTH_PORT}/oauth2/token",
        {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": REDIRECT_URI
        }
    ).json().get("access_token")
    print(f"Token = {token}")
    session["token"] = token
    return redirect(f"http://localhost:{FRONT_PORT}")
