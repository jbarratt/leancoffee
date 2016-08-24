""" Core Coffee Functionality """

import string
import random
import pytz
from datetime import datetime
from . import models as m


class Coffee(object):

    """ Core coffee class & client """

    C_STATES = {'setup', 'topics', 'voting', 'discussing', 'over'}
    T_STATES = {'to_discuss', 'discussing', 'discussed'}

    def __init__(self, uid, c_id=None, title="Lean Coffee",
                 seconds_per_topic=300, votes_per_user=2):
        """ Initialize a new coffee object with required uid and optional id.
            If id is none, this means create a new coffee.
        """
        self.uid = uid
        if c_id is None:
            self.c_id = self.shortid()
            c = m.Coffee(
                self.c_id,
                creator_id=uid,
                title=title,
                state="setup",
                created=datetime.now(),
                seconds_per_topic=seconds_per_topic,
                votes_per_user=votes_per_user)
            c.save()
        else:
            self.c_id = c_id
            # check to ensure it is extant
            m.Coffee.get(self.c_id)
        self.load_user()

    def state(self):
        """ Return a serializable (dict) representation of current state,
            tuned to the current user.
        """
        item = m.Coffee.get(self.c_id)
        return {
            'id': self.c_id,
            'state': item.state,
            'is_presenter': item.creator_id == self.uid,
            'settings': {
                'title': item.title,
                'seconds_per_topic': item.seconds_per_topic,
                'votes_per_user': item.votes_per_user,
            },
            'topics': self.load_topics()
        }

    def load_topics(self):
        """ Returns a serialized list of the topics in the coffee,
            through the lens of the current user """
        topics = m.Topic.query(self.c_id)
        epoch_time = pytz.utc.localize(datetime.utcfromtimestamp(0))
        topic_list = [
            {
                "title": t.title,
                "description": t.description,
                "id": t.topic_id,
                "votes": len(t.votes),
                "user_voted": t.topic_id in self.user.votes,
                "state": t.state,
                "end_time": (t.endtime - epoch_time).total_seconds()
            } for t in topics
        ]
        return sorted(topic_list, key=lambda k: k['votes'])

    def update_state(self, newstate, oldstate=None):
        """ Update the coffee state from oldstate to newstate.
            If oldstate is not provided then newstate is forced, regardless
            of current state.
            returns True if successful, False if failure.
        """
        coffee = m.Coffee.get(self.c_id)
        if self.user.user_id != coffee.creator_id:
            return False
        if newstate not in self.C_STATES:
            return False
        coffee = m.Coffee.get(self.c_id)
        if oldstate is not None and coffee.state != oldstate:
            return False
        coffee.state = newstate
        coffee.save()
        return True

    def create_topic(self, title=None, description=None):
        """ Add a discussion topic """
        topic = m.Topic(coffee_id=self.c_id, topic_id=self.shortid(),
                        creator_id=self.user.user_id, title=title,
                        description=description,
                        endtime=datetime.utcnow())
        topic.save()
        return topic.topic_id

    def update_topic(self, topic_id, field, newstate, oldstate=None):
        """ Update a field of the topic
                oldstate is optional but allows for limiting races.
                    values will only be modified if they are the expected
                    source value.
                Supported fields:
                    state => (old state) =-> discussing, discussed
                    title => old title, new title
                    description => old description, new description
            Returns a boolean to indicate if the change was applied
        """
        topic = m.Topic.get(self.c_id, topic_id)
        coffee = m.Coffee.get(self.c_id)

        # state can only be managed by the admin
        if field == "state":
            if self.user.user_id != coffee.creator_id:
                return False
            if newstate not in self.T_STATES:
                return False
            if oldstate is not None and topic.state != oldstate:
                return False
            topic.state = newstate
            topic.save()
            return True

        # title and description can be edited by creator
        if topic.creator_id != self.user.user_id or \
                coffee.creator_id != self.user.user_id:
            return False

        if field == "title":
            if oldstate is not None and topic.title != oldstate:
                return False
            topic.title = newstate
            topic.save()
            return True

        if field == "description":
            if oldstate is not None and topic.description != oldstate:
                return False
            topic.description = newstate
            topic.save()
            return True

    def delete_topic(self, topic_id):
        """ Delete a topic. Delete is only available to the creator of the topic
            or the creator of the Coffee.
        """
        topic = m.Topic.get(self.c_id, topic_id)
        coffee = m.Coffee.get(self.c_id)
        if topic.creator_id == self.user.user_id or \
                coffee.creator_id == self.user.user_id:
            topic.delete()
            return True
        return False

    def vote(self, topic_id, op):
        """ Update the vote on a topic
            'op' may be add or remove
            Returns True if the vote was cast,
            False on error (typically user has used available votes)
        """
        topic = m.Topic.get(self.c_id, topic_id)
        coffee = m.Coffee.get(self.c_id)
        self.load_user()

        if op == "add" and len(self.user.votes) > coffee.votes_per_user:
            return False

        if self.user.user_id not in topic.votes:
            if op == "add":
                topic.votes.add(self.user.user_id)
                topic.save()
                self.user.votes.add(topic_id)
                self.user.save()
                return True
            else:
                return False
        else:
            if op == "remove":
                topic.votes.remove(self.user.user_id)
                topic.save()
                self.user.votes.remove(topic_id)
                self.user.save()
                return True
        return False

    def delete_coffee(self):
        """ Delete the whole coffee and all associated data """
        coffee = m.Coffee.get(self.c_id)
        if self.user.user_id != coffee.creator_id:
            return False
        topics = m.Topic.query(self.c_id)
        for topic in topics:
            topic.delete()
        users = m.User.query(self.c_id)
        for user in users:
            user.delete()
        coffee.delete()
        return True

    def load_user(self):
        """ initializes internal user, refreshing if needed """
        try:
            user = m.User.get(self.c_id, self.uid)
        except m.User.DoesNotExist:
            user = m.User(self.c_id, self.uid)
            user.save()
        self.user = user

    @staticmethod
    def shortid():
        return ''.join(random.choice(string.ascii_uppercase + string.digits)
               for _ in range(6))


def init_models():
    """ Conditionally initialize all the models in dynamodb """

    if not m.Coffee.exists():
        m.Coffee.create_table(wait=True)

    if not m.User.exists():
        m.User.create_table(wait=True)

    if not m.Topic.exists():
        m.Topic.create_table(wait=True)


def new_coffee(
        uid=None,
        title=None,
        seconds_per_topic=300,
        votes_per_user=2):
    """ Factory method to return a new Coffee instance """

    return Coffee(uid=uid, title=title, seconds_per_topic=seconds_per_topic,
                  votes_per_user=votes_per_user)


def load_coffee(coffee_id=None, uid=None):
    """ Factory method to return an existing class instance """
    return Coffee(uid=uid, c_id=coffee_id)
