from quart import Quart, request, jsonify, make_response, url_for
from quart.utils import redirect
from quart_cors import cors
from quart_session import Session
from repos.pgsql import PgSQLDispatchRepo, PgSQLUserRepo
from models.dispatch import Dispatch
import os
from dotenv import load_dotenv
import uuid
import logging
import asyncio
import aiomcache
from pprint import pprint
load_dotenv()
#----------------------------------------------------------------------------------------------#
# Constants
BACKEND_URL = os.environ['BACKEND_URL']
BIGBASE_URL=os.environ["BIGBASE_URL"]
WINDS_DB_HOSTNAME = os.environ["WINDS_DB_HOSTNAME"]
WINDS_DB_PORT = os.environ["WINDS_DB_PORT"]
TOKEN_LIFESPAN = 1800
#----------------------------------------------------------------------------------------------#
# Quart app config
app = Quart(__name__)
app.secret_key = uuid.uuid4().hex
app = cors(app, allow_origin=BIGBASE_URL, allow_headers="content-type", allow_credentials=True)
#----------------------------------------------------------------------------------------------#
# Quart-Session config
app.config['SESSION_TYPE'] = 'memcached'
Session(app)
cache = app.session_interface
#----------------------------------------------------------------------------------------------#
# Logging
log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
fhandler = logging.FileHandler("./logs/app.log")
log.addHandler(handler)
log.addHandler(fhandler)
#----------------------------------------------------------------------------------------------#
# Database connections
dispatch_repo = PgSQLDispatchRepo(host=WINDS_DB_HOSTNAME, port=WINDS_DB_PORT)
user_repo = PgSQLUserRepo(host=WINDS_DB_HOSTNAME, port=WINDS_DB_PORT)
#----------------------------------------------------------------------------------------------#
# Helper functions
async def refresh_session():
    await cache.set("token", uuid.uuid4().hex, expiry=TOKEN_LIFESPAN)
    token = await cache.get("token")
    logging.debug(f"Refreshing token as {token}")
    return token
#----------------------------------------------------------------------------------------------#
# Dispatch routes
@app.route('/bydate')
async def by_date():
    """
    Return all dispatches from given date.
    """
    token = (await request.values).get("token", "")
    stored_token = (await cache.get("token", "")).decode("utf-8")
    date = (await request.values).get("date")
    try:
        if token == stored_token:
            new_token = await refresh_session()
            dispatches = [dispatch.as_dict() for dispatch in dispatch_repo.by_date(date)]
            logging.debug(f"Dispatches: {dispatches}")
            pprint(dispatches)
            response = make_response(jsonify({
                "token": new_token.decode("utf-8"), # json can't serialize bytes...
                "dispatches":dispatches
            }), 200,)
            return await response
        elif token == "null":
            return await make_response(jsonify({
                "error": "no_session"}), 
                200
                )
        else:
            return await make_response(jsonify({
                "error": "session_expired"}), 
                200
                )
    except Exception as e:
        logging.exception("Exception in /bydate: ")
        return redirect(url_for("logout"))

@app.route('/add', methods=['POST', 'OPTIONS'])
async def add():
    """
    Add a dispatch to the database.
    """
    token = (await request.values).get("token")
    stored_token = (await cache.get("token", "")).decode("utf-8")
    if request.method == 'POST':
        try:
            if token == stored_token:
                body = await request.json
                dispatch = Dispatch.from_dict(body)
                try:
                    dispatch_repo.add(dispatch)
                except Exception as e:
                    return await make_response(
                        f"{e} when adding {dispatch} to the database", 
                        501
                        )
                response = make_response("", 200)
                return await response
            else:
                return await make_response(jsonify({
                    "error": "Incorrect session token"}), 
                    200
                    )
        except Exception as e:
            logging.exception("Exception in /add: ")
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
    stored_token = (await cache.get("token", "")).decode("utf-8")
    if request.method == 'POST':
        try:
            if token == (await cache.get("token")).decode("utf-8"):
                id = await request.get_data()
                try:
                    dispatch_repo.delete(id)
                except Exception as e:
                    logging.exception("Exception in repo.delete(): ")
                    response =  make_response(
                        f"{e} when deleting dispatch with id {id} from the database", 
                        501
                        )
                    return await response
                response = make_response("", 200)
                return await response
            else:
                return await make_response(jsonify({
                    "error": "Incorrect session token"}), 
                    200
                    )
        except Exception as e:
            logging.exception("Exception in /delete: ")
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
                    response =  make_response(
                        f"{e} when updating dispatch with id {id}", 
                        501
                        )
                    return await response
                response = make_response("", 200)
                return await response
            else:
                return await make_response(jsonify({
                    "error": "Incorrect session token"}), 
                    200
                    )
        except Exception as e:
            logging.exception("Exception in /update: ")
            return redirect(url_for("logout"))
    elif request.method == 'OPTIONS':
        response = make_response("", 200)
        return await response
#----------------------------------------------------------------------------------------------#
# Auth routes
@app.route("/login", methods=['POST', 'OPTIONS'])
async def login():
    if request.method == "POST":
        sent_details = await request.json
        try:
            user = user_repo.get_user(sent_details["username"])
            if sent_details["password_hash"] == user["password_hash"]:
                new_token = uuid.uuid4().hex
                await cache.set("token", new_token, expiry=TOKEN_LIFESPAN)
                logging.debug(f"Token initially set during login as {new_token}")
                return await make_response(jsonify({
                    "name": user["first_name"],
                    "email": user["email"],
                    "token": (await cache.get("token")).decode("utf-8")
                }), 200)
            else:
                raise Exception("Bad credentials")
        except Exception as e:    
            logging.exception("Exception in /login: ")
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
        logging.exception("Exception in /logout: ")
    return await make_response(jsonify({
        "loggedOut": True
    }), 200)
