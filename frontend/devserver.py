#!/usr/bin/env python3

from http.server import SimpleHTTPRequestHandler, HTTPServer
import re

SPA_PATT = r'/[A-Za-z0-9]+/?$'


class SPAReqHandler(SimpleHTTPRequestHandler):

    def do_GET(self):
        # Mangle all the fake routes the SPA wants to create
        # So they will load '/' content
        if re.match(SPA_PATT, self.path):
            self.path = '/'
        return super().do_GET()


def run():
    server_address = ('127.0.0.1', 8199)
    httpd = HTTPServer(server_address, SPAReqHandler)
    httpd.serve_forever()

if __name__ == '__main__':
    run()
