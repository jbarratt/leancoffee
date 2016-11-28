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
        item = m.Coffee.get(self.c_id, consistent_read=True)
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
        topics = m.Topic.query(self.c_id, consistent_read=True)
        epoch_time = pytz.utc.localize(datetime.utcfromtimestamp(0))
        user_votes = [] if self.user.votes is None else self.user.votes

        # Create a full list of topics in order
        # Then, split them by state, so each state is in order
        topic_list = [
            {
                "title": t.title,
                "description": t.description,
                "id": t.topic_id,
                "votes": 0 if t.votes is None else len(t.votes),
                "users_voting": [] if t.votes is None else list(t.votes),
                "user_voted": t.topic_id in user_votes,
                "state": t.state,
                "end_time": (t.endtime - epoch_time).total_seconds()
            } for t in topics
        ]
        topic_list = sorted(topic_list, key=lambda k: k['votes'], reverse=True)
        topic_states = {'to_discuss': [], 'discussing': [], 'discussed': []}
        for t in topic_list:
            topic_states[t['state']].append(t)
        return topic_states

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
        coffee.update_item('state', newstate, action="PUT")
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
            topic.update_item('state', newstate, action="PUT")
            return True

        # title and description can be edited by creator
        if not (topic.creator_id == self.user.user_id or
                coffee.creator_id == self.user.user_id):
            return False

        if field == "title":
            if oldstate is not None and topic.title != oldstate:
                return False
            topic.update_item('title', newstate, action="PUT")
            return True

        if field == "description":
            if oldstate is not None and topic.description != oldstate:
                return False
            topic.update_item('description', newstate, action="PUT")
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

    @staticmethod
    def set_add(orig, new):
        if orig is None:
            return set([new])
        else:
            return set(orig) | set([new])

    @staticmethod
    def set_remove(orig, removed):
        if orig is None:
            return None
        new = set(orig) - set([removed])
        if len(new) == 0:
            return None
        return new

    def vote(self, topic_id, op):
        """ Update the vote on a topic
            'op' may be add or remove
            Returns True if the vote was cast,
            False on error (typically user has used available votes)
        """
        topic = m.Topic.get(self.c_id, topic_id)
        coffee = m.Coffee.get(self.c_id)
        self.load_user()

        print "Trying to '{}' on topic {}".format(op, topic_id)

        if op == "add" and self.user.votes \
                and len(self.user.votes) > coffee.votes_per_user:
            print "Can't add when {} > {}".format(len(self.user.votes),
                                                  coffee.votes_per_user)
            return False

        if not topic.votes or self.user.user_id not in topic.votes:
            if op == "add":
                topic.update_item('votes', self.set_add(topic.votes,
                                                        self.user.user_id),
                                  action="PUT")
                self.user.update_item(
                    'votes', self.set_add(self.user.votes, topic_id),
                    action="PUT")
                return True
            else:
                print "Can't remove when user has not voted"
                return False
        else:
            if op == "remove":
                new_val = self.set_remove(topic.votes, self.user.user_id)
                if new_val is None:
                    topic.update_item('votes', action="DELETE")
                else:
                    topic.update_item('votes', new_val, action="PUT")
                new_val = self.set_remove(self.user.votes, topic_id)
                if new_val is None:
                    self.user.update_item('votes', action="DELETE")
                else:
                    self.user.update_item('votes', new_val, action="PUT")
                return True
        print "Vote function bail out point"
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
