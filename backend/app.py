from models.user import User
from quart import Quart, request, jsonify, make_response
from quart_cors import cors
from repos.pgsql import PgSQLDispatchRepo, PgSQLUserRepo
from models.dispatch import Dispatch
from pprint import pprint

app = Quart(__name__)
app = cors(app, allow_origin="*", allow_headers="content-type")
dispatch_repo = PgSQLDispatchRepo()
# user_repo = PgSQLUserRepo()

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

