from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os
from pathlib import Path
os.chdir(Path(__file__).resolve().parents[2])
class Handler(SimpleHTTPRequestHandler):
    extensions_map={**SimpleHTTPRequestHandler.extensions_map,'.mjs':'application/javascript','.js':'application/javascript','.css':'text/css'}
ThreadingHTTPServer(('127.0.0.1',4188),Handler).serve_forever()
