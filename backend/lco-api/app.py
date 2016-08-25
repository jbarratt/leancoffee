from chalice import Chalice
import pycoffee as pc

app = Chalice(app_name='lco-api')
app.debug = True
pc.init_models()


@app.route('/coffees', methods=['POST'])
def create_coffee():

    req = app.current_request
    uid = req.headers['X-CoffeeUser']
    body = req.json_body

    kwargs = {}
    if 'title' in body:
        kwargs['title'] = body['title']
    for int_arg in ['seconds_per_topic', 'votes_per_user']:
        if int_arg in body:
            kwargs[int_arg] = int(body[int_arg])

    c = pc.new_coffee(uid=uid, **kwargs)
    return c.state()

# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
# '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users/', methods=['POST'])
# def create_user():
# This is the JSON body the user sent in their POST request.
#     user_as_json = app.json_body
# Suppose we had some 'db' object that we used to
# read/write from our database.
# user_id = db.create_user(user_as_json)
#     return {'user_id': user_id}
#
# See the README documentation for more examples.
#
