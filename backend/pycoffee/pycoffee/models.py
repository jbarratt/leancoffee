import os
import datetime
from pynamodb.models import Model
from pynamodb.attributes import (
    UnicodeAttribute, NumberAttribute, UTCDateTimeAttribute,
    UnicodeSetAttribute
)

# FIXME turn this off after bug hunt
import logging
logging.basicConfig()
log = logging.getLogger("pynamodb")
log.setLevel(logging.DEBUG)
log.propagate = True


class Coffee(Model):

    class Meta:
        table_name = 'coffees'
        read_capacity_units = 3
        write_capacity_units = 3
        if 'PYCOFFEE_DEV' in os.environ:
            host = "http://local.docker:8000"
        else:
            region = "us-west-2"

    coffee_id = UnicodeAttribute(hash_key=True)
    creator_id = UnicodeAttribute()
    state = UnicodeAttribute(default="setup")
    created = UTCDateTimeAttribute()
    title = UnicodeAttribute(default="Lean Coffee")
    seconds_per_topic = NumberAttribute(default=300)
    votes_per_user = NumberAttribute(default=2)


class Topic(Model):

    class Meta:
        table_name = 'topics'
        read_capacity_units = 10
        write_capacity_units = 10
        if 'PYCOFFEE_DEV' in os.environ:
            host = "http://local.docker:8000"
        else:
            region = "us-west-2"

    coffee_id = UnicodeAttribute(hash_key=True)
    topic_id = UnicodeAttribute(range_key=True)
    creator_id = UnicodeAttribute()
    title = UnicodeAttribute(default="")
    description = UnicodeAttribute(default="")
    votes = UnicodeSetAttribute()
    state = UnicodeAttribute(default="to_discuss")
    endtime = UTCDateTimeAttribute(default=datetime.datetime.utcnow())

# TODO factor votes out into a separate TopicVotes model or something


class User(Model):

    class Meta:
        table_name = 'users'
        read_capacity_units = 3
        write_capacity_units = 3
        if 'PYCOFFEE_DEV' in os.environ:
            host = "http://local.docker:8000"
        else:
            region = "us-west-2"

    coffee_id = UnicodeAttribute(hash_key=True)
    user_id = UnicodeAttribute(range_key=True)
    session_key = UnicodeAttribute(default="")
    votes = UnicodeSetAttribute()
