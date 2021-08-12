from quart import Quart
from quart_cors import cors

app = Quart(__name__)
app = cors(app, allow_origin="*")

@app.route("/api")
def api_root():
    return "Hello"