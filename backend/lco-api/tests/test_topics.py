import requests

# BASE_URL = "http://localhost:8000"
BASE_URL = "https://jnraqwtne1.execute-api.us-west-2.amazonaws.com/dev/"
admin_header = {"X-Api-Key": "testadmin"}
user_header = {"X-Api-Key": "testuser"}


def test_topics_basic():

    r = requests.post(BASE_URL + "/coffees", headers=admin_header,
                      json={"title": "Test Coffee"})
    assert r.status_code == 200
    link = r.json()["links"]["self"]

    # Create a new topic
    r = requests.post(BASE_URL + link + "/topics", headers=user_header,
                      json={'title': 'Test Topic',
                            'description': 'Pretty Much That'})
    assert r.status_code == 200
    t_link = r.json()['data']['topics'][0]['link']

    # update the description
    r = requests.put(BASE_URL + t_link, headers=user_header,
                     json={'field': 'description', 'to': 'Some Other'})

    assert r.status_code == 200
    assert 'Other' in r.json()['data']['topics'][0]['description']
    assert r.json()['data']['topics'][0]['votes'] == 0

    r = requests.put(BASE_URL + t_link, headers=user_header,
                     json={'field': 'votes', 'op': 'add'})

    assert r.status_code == 200
    assert r.json()['data']['topics'][0]['votes'] == 1

    r = requests.put(BASE_URL + t_link, headers=admin_header,
                     json={'field': 'votes', 'op': 'add'})

    assert r.status_code == 200
    assert r.json()['data']['topics'][0]['votes'] == 2

    r = requests.put(BASE_URL + t_link, headers=admin_header,
                     json={'field': 'votes', 'op': 'remove'})

    assert r.status_code == 200
    assert r.json()['data']['topics'][0]['votes'] == 1

    r = requests.put(BASE_URL + t_link, headers=user_header,
                     json={'field': 'votes', 'op': 'remove'})

    assert r.status_code == 200
    assert r.json()['data']['topics'][0]['votes'] == 0

    # Clean up the coffee
    # r = requests.delete(BASE_URL + link, headers=admin_header)
    r = requests.put(BASE_URL + link, headers=admin_header,
                     json={'field': 'state', 'to': 'deleted'})
    assert r.status_code == 200
