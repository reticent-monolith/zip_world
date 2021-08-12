from quart import Quart, render_template
from quart_cors import cors

app = Quart(__name__)
app = cors(app, allow_origin="*")

@app.route("/api/hello")
async def api_root():
    return await render_template("hello.html")