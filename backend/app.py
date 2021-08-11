from starlette.applications import Starlette
from starlette.responses import JSONResponse, PlainTextResponse, FileResponse
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles

async def homepage(request):
    return FileResponse(path="./static/index.html")


app = Starlette(debug=True, routes=[
    Route("/", endpoint=homepage)
])