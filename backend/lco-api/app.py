from chalice import Chalice, BadRequestError, ChaliceViewError, NotFoundError
import pycoffee as pc

app = Chalice(app_name='lco-api')
app.debug = True
pc.init_models()

# TODO sanitize all input text like CRAZY.
# This thing is waiting for an XSS right now.


def format_state(coffee):
    data = coffee.state()
    for topic in data['topics']:
        topic['link'] = '/coffees/{}/topics/{}'.format(data['id'],
                                                       topic['id'])
    return {
        "links": {"self": "/coffees/{}".format(data['id'])},
        "data": data
    }


def check_headers():
    if 'X-CoffeeUser' not in app.current_request.headers:
        raise BadRequestError("All requests need X-CoffeeUser header set")


@app.route('/coffees', methods=['POST'], cors=True)
def create_coffee():
    check_headers()
    req = app.current_request
    uid = req.headers['X-CoffeeUser']
    body = req.json_body or {}

    if 'title' not in body:
        raise BadRequestError("Unable to create without a title")

    kwargs = {}
    if 'title' in body:
        kwargs['title'] = body['title']
    for int_arg in ['seconds_per_topic', 'votes_per_user']:
        if int_arg in body:
            kwargs[int_arg] = int(body[int_arg])

    c = pc.new_coffee(uid=uid, **kwargs)
    return format_state(c)


@app.route('/coffees/{c_id}', methods=['GET', 'PUT'], cors=True)
def get_coffee(c_id):
    check_headers()
    req = app.current_request
    uid = req.headers['X-CoffeeUser']
    body = req.json_body or {}

    try:
        c = pc.load_coffee(coffee_id=c_id, uid=uid)
    except:
        # TODO fix library to raise better exceptions
        raise NotFoundError("No coffee found for that ID")

    # Chalice doesn't support DELETE yet. Or PATCH. Odd.
    # if req.method == 'DELETE':
    #     if c.delete_coffee():
    #         return {'data': 'ok'}
    #     else:
    #         raise ChaliceViewError("Unable to delete")

    if req.method == 'PUT':
        if 'field' in body and body['field'] == "state":
            # temporary workaround
            if 'to' in body and body['to'] == "deleted":
                if c.delete_coffee():
                    return {'data': 'ok'}
                else:
                    raise ChaliceViewError("Unable to Delete")
            if 'from' in body:
                c.update_state(oldstate=body['from'], newstate=body['to'])
            else:
                c.update_state(newstate=body['to'])
    return format_state(c)


@app.route('/coffees/{c_id}/topics', methods=['POST'], cors=True)
def create_topic(c_id):
    check_headers()
    req = app.current_request
    uid = req.headers['X-CoffeeUser']
    body = req.json_body or {}

    if 'title' not in body or 'description' not in body:
        raise BadRequestError("'title' and 'description' Required")

    try:
        c = pc.load_coffee(coffee_id=c_id, uid=uid)
    except:
        # TODO fix library to raise better exceptions
        raise NotFoundError("No coffee found for that ID")

    print body
    c.create_topic(body['title'], body['description'])

    return format_state(c)


@app.route('/coffees/{c_id}/topics/{t_id}', methods=['PUT'], cors=True)
def modify_topic(c_id, t_id):
    check_headers()
    req = app.current_request
    uid = req.headers['X-CoffeeUser']
    body = req.json_body or {}

    if 'field' not in body:
        raise BadRequestError("'field' Required")

    try:
        c = pc.load_coffee(coffee_id=c_id, uid=uid)
    except:
        # TODO fix library to raise better exceptions
        raise NotFoundError("No coffee found for that ID")

    if body['field'] == 'votes':
        if 'op' not in body or body['op'] not in ('add', 'remove'):
            raise BadRequestError("'op' Required and must be add|remove")
        c.vote(t_id, body['op'])
        return format_state(c)

    if 'to' not in body:
        raise BadRequestError("At least a 'to' value is required")

    # TODO you know errors CAN happen, right?
    if 'from' in body:
        rv = c.update_topic(t_id, body['field'], body['to'], body['from'])
    else:
        rv = c.update_topic(t_id, body['field'], body['to'])
    if not rv:
        raise ChaliceViewError("Unknown Error updating the topic")
    return format_state(c)
