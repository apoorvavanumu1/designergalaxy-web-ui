"""
main.py — Entry point to run the Designer Galaxy website locally.

This starts a simple local HTTP server that serves index.html along with
the linked css/ (style.css) and js/ (script.js) assets, then opens the
site in your default web browser.

Usage:
    python main.py
"""

import http.server
import socketserver
import webbrowser
import os
import threading

PORT = 5501
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def open_browser(port):
    webbrowser.open(f"http://localhost:{port}")


def find_available_port(start_port, max_tries=10):
    port = start_port
    for _ in range(max_tries):
        try:
            with ReusableTCPServer(("", port), Handler):
                return port
        except OSError:
            port += 1
    raise OSError(f"Could not find an available port after {max_tries} tries starting at {start_port}.")


def main():
    port = find_available_port(PORT)

    with ReusableTCPServer(("", port), Handler) as httpd:
        print(f"Serving Designer Galaxy website at http://localhost:{port}")
        if port != PORT:
            print(f"(Port {PORT} was busy, so port {port} was used instead.)")
        print("Press Ctrl+C to stop the server.")

        threading.Timer(1.0, open_browser, args=(port,)).start()

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server...")
            httpd.shutdown()


if __name__ == "__main__":
    main()
