import pycoffee as pc
import uuid
import pytest

pc.init_models()


def test_create():

    uid = uuid.uuid4().hex
    coffee = pc.new_coffee(uid=uid, title="test coffee")
    state = coffee.state()
    assert state['is_presenter'] is True
    assert len(state['topics']) == 0
    assert state['settings']['seconds_per_topic'] == 300

    uid2 = uuid.uuid4().hex
    coffee2 = pc.load_coffee(coffee.c_id, uid=uid2)
    assert coffee2.state()['is_presenter'] is False

    assert coffee2.delete_coffee() is False
    assert coffee.delete_coffee() is True

    with pytest.raises(Exception):
        coffee2 = pc.load_coffee(coffee.c_id, uid=uid2)


def test_update_state():

    uid = uuid.uuid4().hex
    coffee = pc.new_coffee(uid=uid, title="test coffee")

    assert coffee.update_state("topics", "setup") is True
    assert coffee.update_state("topics", "setup") is False
    assert coffee.update_state("fakestate") is False
    assert coffee.update_state("over") is True


def test_add_topic():
    uid = uuid.uuid4().hex
    coffee = pc.new_coffee(uid=uid, title="test coffee")

    topic_id = coffee.create_topic(title="test topic",
                                   description="tweet sized description")

    state = coffee.state()
    assert len(state['topics']) == 1
    assert state['topics'][0]['title'] == "test topic"
    assert state['topics'][0]['description'].startswith("tweet")
    assert state['topics'][0]['votes'] == 0

    coffee.vote(topic_id, "add")
    state = coffee.state()
    assert state['topics'][0]['votes'] == 1

    # can't add more than one vote per user
    coffee.vote(topic_id, "add")
    state = coffee.state()
    assert state['topics'][0]['votes'] == 1

    uid2 = uuid.uuid4().hex
    coffee2 = pc.load_coffee(coffee.c_id, uid=uid2)
    coffee2.vote(topic_id, "add")
    state = coffee.state()
    assert state['topics'][0]['votes'] == 2

    coffee.vote(topic_id, "remove")
    state = coffee.state()
    assert state['topics'][0]['votes'] == 1

    # test sorting, lower voted items should go last
    coffee.create_topic(title="test topic 2",
                        description="tweet sized description")

    state = coffee.state()
    assert state['topics'][1]['title'] == "test topic 2"


def test_update_topic():

    uid = uuid.uuid4().hex
    coffee = pc.new_coffee(uid=uid, title="test coffee")

    topic_id = coffee.create_topic(title="test topic",
                                   description="tweet sized description")

    coffee.update_topic(topic_id, "description", "foo")
    state = coffee.state()
    assert state['topics'][0]['description'] == "foo"

    coffee.update_topic(topic_id, "description", "bar", "baz")
    state = coffee.state()
    assert state['topics'][0]['description'] == "foo"

    coffee.update_topic(topic_id, "description", "bar", "foo")
    state = coffee.state()
    assert state['topics'][0]['description'] == "bar"

    coffee.update_topic(topic_id, "state", "discussing", "to_discuss")
    state = coffee.state()
    assert state['topics'][0]['state'] == "discussing"