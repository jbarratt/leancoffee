The ./devserver.py script runs a simple python HTTP server.
If paths come in that look like they might be routes from the SPA, it serves up index.html instead.
In production cloudfront will be configured the same way to respond to 404's.
