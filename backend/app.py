from quart import Quart, request, jsonify, make_response, url_for
from quart.utils import redirect
from quart_cors import cors
from quart_session import Session
from repos.pgsql import PgSQLDispatchRepo
from models.dispatch import Dispatch
import os
from dotenv import load_dotenv

load_dotenv()
BACKEND_URL = os.environ['BACKEND_URL']
FUSIONAUTH_URL = os.environ['FUSIONAUTH_URL']
BIGBASE_URL=os.environ["BIGBASE_URL"]
CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
APPLICATION_ID = os.environ['APPLICATION_ID']
API_KEY = os.environ['API_KEY']
REDIRECT_URI = f"{BACKEND_URL}/oauth-redirect"
WINDS_DB_HOSTNAME = os.environ["WINDS_DB_HOSTNAME"]
WINDS_DB_PORT = os.environ["WINDS_DB_PORT"]

TOKEN_LIFESPAN = 1800

app = Quart(__name__)
app.secret_key = CLIENT_SECRET
app = cors(app, allow_origin=BIGBASE_URL, allow_headers="content-type", allow_credentials=True)
app.config['SESSION_TYPE'] = 'memcached'
Session(app)

cache = app.session_interface
async def refresh_session():
    print("Refreshing session...")
    await cache.set("token", "TOKEN", expiry=TOKEN_LIFESPAN)

# TODO this should be in a database, hashed
dev_user = {
    "username": "dev",
    "password": "pass",
    "name": "Ben",
    "email": "dev@winds.com"
}

dispatch_repo = PgSQLDispatchRepo(host=WINDS_DB_HOSTNAME, port=WINDS_DB_PORT)

# DISPATCH ROUTES
@app.route('/bydate')
async def by_date():
    """
    Return all dispatches from given date.
    """
    token = (await request.values).get("token")
    stored_token = (await cache.get("token"))
    if stored_token:
        stored_token = stored_token.decode("utf-8")
    else:
        stored_token = ""
    date = (await request.values).get("date")
    try:
        if token == stored_token:
            await refresh_session()
            dispatches = [dispatch.as_dict() for dispatch in dispatch_repo.by_date(date)]
            response = make_response(jsonify(dispatches), 200,)
            return await response
        elif token == "null":
            print(f"No session")
            return await make_response(jsonify({"error": "no_session"}), 200)
        else:
            print(f"Invalid session: {token} != {stored_token}")
            return await make_response(jsonify({"error": "session_expired"}), 200)
    except Exception as e:
        print(e)
        return redirect(url_for("logout"))

@app.route('/add', methods=['POST', 'OPTIONS'])
async def add():
    """
    Add a dispatch to the database.
    """
    token = (await request.values).get("token")
    if request.method == 'POST':
        try:
            if token == (await cache.get("token")).decode("utf-8"):
                body = await request.json
                dispatch = Dispatch.from_dict(body)
                try:
                    dispatch_repo.add(dispatch)
                except Exception as e:
                    print(e)
                    return await make_response(f"{e} when adding {dispatch} to the database", 501)
                response = make_response("", 200)
                return await response
            else:
                print(f"Invalid session: {token} != {(await cache.get('token')).decode('utf-8')}")
                return await make_response(jsonify({"error": "Incorrect session token"}), 200)
        except Exception as e:
            print(e)
            return redirect(url_for("logout"))
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        return await response

@app.route('/delete', methods=['POST', 'OPTIONS'])
async def delete():
    """
    Delete a dispatch from the database.
    """
    token = (await request.values).get("token")
    if request.method == 'POST':
        try:
            if token == (await cache.get("token")).decode("utf-8"):
                id = await request.get_data()
                try:
                    dispatch_repo.delete(id)
                except Exception as e:
                    response =  make_response(f"{e} when deleting dispatch with id {id} from the database", 501)
                    return await response
                response = make_response("", 200)
                return await response
            else:
                print(f"Invalid session: {token} != {(await cache.get('token')).decode('utf-8')}")
                return await make_response(jsonify({"error": "Incorrect session token"}), 200)
        except Exception as e:
            print(e)
            return redirect(url_for("logout"))
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        return await response

@app.route('/update', methods=['POST', 'OPTIONS'])
async def update():
    """
    Update a dispatch in the database.
    """
    token = (await request.values).get("token")
    if request.method == 'POST':
        try:
            if token == (await cache.get("token")).decode("utf-8"):
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
            else:
                print(f"Invalid session: {token} != {(await cache.get('token')).decode('utf-8')}")
                return await make_response(jsonify({"error": "Incorrect session token"}), 200)
        except Exception as e:
            print(e)
            return redirect(url_for("logout"))
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        return await response

@app.route("/login", methods=['POST', 'OPTIONS'])
async def login():
    if request.method == "POST":
        sent_details = await request.json
        if sent_details["password"] == dev_user["password"]:
            await cache.set("token", "TOKEN", expiry=TOKEN_LIFESPAN)
            return await make_response(jsonify({
                "name": dev_user["name"],
                "email": dev_user["email"],
                "token": (await cache.get("token")).decode("utf-8")
            }), 200)
        else:
            return await make_response(jsonify({
                "error": "Incorrect username or password"
            }), 200)
    elif request.method == "OPTIONS":
        return await make_response("", 200)

@app.route("/logout")
async def logout():
    try:
        await cache.delete("token")
    except Exception as e:
        print("Tried deleting token from cache, no token present")
    return await make_response(jsonify({
        "loggedOut": True
    }), 200)









# Fusionauth routes
# @app.route("/loginf")
# async def loginf():
#     return redirect(f"{FUSIONAUTH_URL}/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code")

# @app.route("/logoutf")
# async def logoutf():
#     session.clear()
#     return redirect(f"{FUSIONAUTH_URL}/oauth2/logout?client_id={CLIENT_ID}")

# @app.route("/user")
# async def user():
#     if session.get("token"):
#         user_info = requests.post(
#             f"{FUSIONAUTH_URL}/oauth2/introspect",
#             {
#                 "client_id": CLIENT_ID,
#                 "token": session.get("token")
#             }
#         ).json()
#         print(user_info)
#         if user_info.get("active") == True:
#             body = requests.get(
#                 f"{FUSIONAUTH_URL}/user/{user_info.get('sub')}/{APPLICATION_ID}",
#                 headers={"Authorization": API_KEY}
#             )
#             print(body)
#             body = body.json() | {"token": session.get("token")}
#             return await make_response(jsonify(body), 200)
#         else:
#             print("NOT ACTIVE")
#             return await make_response(jsonify({}), 200)
#     else:
#         print("NO TOKEN")
#         return await make_response(jsonify({}), 200)

# @app.route("/oauth-redirect")
# async def callback():
#     code = (await request.values).get("code")
#     print(f"Code = {code}")
#     token = requests.post(
#         f"{FUSIONAUTH_URL}/oauth2/token",
#         {
#             "client_id": CLIENT_ID,
#             "client_secret": CLIENT_SECRET,
#             "code": code,
#             "grant_type": "authorization_code",
#             "redirect_uri": REDIRECT_URI
#         }
#     ).json().get("access_token")
#     print(f"Token = {token}")
#     session["token"] = token
#     return redirect(BIGBASE_URL)


