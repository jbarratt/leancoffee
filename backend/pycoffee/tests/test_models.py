from pycoffee.models import Coffee, Topic, User
from datetime import datetime


def test_basic_coffee():

    if not Coffee.exists():
        Coffee.create_table(wait=True)

    coffee = Coffee('abcd', creator_id="dave", state="setup",
                    created=datetime.now())
    coffee.save()

    coffee.votes_per_user = 3

    coffee.save()

    coffee_item = Coffee.get('abcd')
    assert(coffee_item.votes_per_user == 3)


def test_basic_topic():

    if not Topic.exists():
        Topic.create_table(wait=True)

    topic = Topic('abcd', 'asdf', creator_id="dave",
                  title="thing I want to discuss", description="more on that")
    topic.save()

    topic_2 = Topic('abcd', 'quert', creator_id="notdave",
                    title="notdaves_idea", description="lots to say")
    topic_2.save()

    topic_3 = Topic('fadf', 'eeee', creator_id="dave",
                    title="different_coffee_idea", description="lots to say")
    topic_3.save()

    topics = list(Topic.query('abcd'))
    assert(len(topics) == 2)
    for t in topics:
        assert(t.coffee_id == 'abcd')


def test_basic_user():

    if not User.exists():
        User.create_table(wait=True)

    user = User('abcd', '1234', session_id="25", votes={'quert'})
    user.save()
