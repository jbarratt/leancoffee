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

    # TODO fix code smell of duplicating defaults. For some reason
    # kwarg sqashing was not setting title properly.
    c = pc.new_coffee(uid=uid, title=body.get('title', "Lean Coffee"),
                      seconds_per_topic=int(body.get('seconds_per_topic',
                                                     300)),
                      votes_per_user=int(body.get('votes_per_user', 2)))
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
