import requests
# BASE_URL = "http://localhost:8000"
BASE_URL = "https://jnraqwtne1.execute-api.us-west-2.amazonaws.com/dev/"
admin_header = {"X-Api-Key": "testadmin"}
user_header = {"X-Api-Key": "testuser"}


def test_missing_data():
    r = requests.post(BASE_URL + "/coffees")
    # should be a bad request
    assert r.status_code == 400
    assert "X-Api-Key" in r.text

    r = requests.post(BASE_URL + "/coffees", headers=admin_header)
    assert r.status_code == 400
    assert "title" in r.text


def test_basic_crud():
    # basic creation works
    r = requests.post(BASE_URL + "/coffees", headers=admin_header,
                      json={"title": "Test Coffee"})

    print r.text
    assert r.status_code == 200
    link = r.json()["links"]["self"]

    # Getting from the link to the POST returns an identical
    # payload
    get_r = requests.get(BASE_URL + link, headers=admin_header)

    assert get_r.json() == r.json()

    # Make a change

    r = requests.put(BASE_URL + link, headers=admin_header,
                     json={'field': 'state', 'to': 'topics'})
    assert r.status_code == 200
    assert r.json()['data']['state'] == 'topics'

    # make sure that it's gone
    # r = requests.delete(BASE_URL + link, headers=admin_header)
    r = requests.put(BASE_URL + link, headers=admin_header,
                     json={'field': 'state', 'to': 'deleted'})
    assert r.status_code == 200

    # If I get one that's not there, it's a 404
    r = requests.get(BASE_URL + link, headers=admin_header)
    assert r.status_code == 404


def test_custom_name():
    r = requests.post(BASE_URL + "/coffees", headers=admin_header,
                      json={"title": "Test Coffee",
                            "coffee_id": "testingcoffee"})

    print r.text
    assert r.status_code == 200
    link = r.json()["links"]["self"]

    assert 'testingcoffee' in link

    # delete it
    r = requests.put(BASE_URL + link, headers=admin_header,
                     json={'field': 'state', 'to': 'deleted'})
    assert r.status_code == 200
