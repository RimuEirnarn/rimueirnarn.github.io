#!/usr/local/bin/python3.11

# Let this be here, it was needed by my other hidden scripts.
from os import chdir
from pathlib import Path
from flask import Flask, send_file, abort
from argh import arg, dispatch_command
from os.path import realpath, commonpath, join

app = Flask(__name__)
ROOT_DIR = realpath(__file__+'/../')

@app.errorhandler(404)
def error_handler404(e):
    with open('404.html') as f:
        return f.read(), 404

@app.get("/")
def root():
    return send_file("index.html")

@app.get("/<path:filename>")
def files(filename=""):
    if filename == "":
        filename = "index.html"
    true_filename = realpath(filename)
    prefix = commonpath(ROOT_DIR, true_filename)
    if prefix != ROOT_DIR:
        return abort(403)

    path = Path(filename)
    if path.is_dir():
        path = path / "index.html"
        if not path.exists():
            return abort(404)
    if not path.exists():
        return abort(404)
    return send_file(join(base, true_filename)

@arg("--host", "-H", help="""The host to bind to, for example 'localhost'.
    Can be a domain, IPv4 or IPv6 address, or file path starting
    with unix:// for a Unix socket.""")
@arg("--port", '-p', help="""The port to bind to, for example 8080. Using 0
        tells the OS to pick a random free port.""")
@arg("--debug", "-d", help="if given, enable or disable debug mode.")
@arg("--threaded", "-t", help="""Handle concurrent requests using threads. Cannot be
        used with --processes.""")
@arg("--processes", "-P", help="""Handle concurrent requests using up to this number
        of processes. Cannot be used with ``threaded``.""")
@arg("--ssl-context", "-s", help="""Configure TLS to serve over HTTPS.
        The structure is cert_file:key_file""")
@arg("-D", "--directory", help="Directory for to serve")
def main(host: str = "127.0.0.1", port: int = 0, debug: bool = False, threaded: bool = True, processes: int = 1, ssl_context: str = "", directory: str = ""):
    """Serve your files in HTTP(s)"""
    global DIRECTORY
    ssl = None
    if ":" in ssl_context:
        ssl = tuple(ssl_context.split(':', 1))
    if threaded and processes > 1:
        return "Cannot use --threaded and --processes at the same time"
    #print(f"{host = }, {port = }, {debug =}, {threaded = }, {processes = }, {ssl_context = }, {ssl = }")
    if not directory:
        return "Must use --directory, hehe"
    chdir(directory)
    return app.run(host, port, debug=debug, threaded=threaded, processes=processes, ssl_context=ssl)

if __name__ == '__main__':
    dispatch_command(main)
