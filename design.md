# Lean Coffee Facilitator

## High Level / UX Design

Goals:

* Allow anonymous contributors. (Organizers may need Google/FB/Twitter login.)
* Work great on mobile, laptop-free is nice
* realtime all the things

Ideal workflow

* go to leancoffee.online
* Offer 'join a coffee' or 'start a coffee'
* On start, allow entry of a title
* Given a code to share (or just use the link)
* MVP: leancoffee.online/#uniquestring

On visit everyone gets a JWT

As organizer, your screen has a control for phases

* Settings
    - meeting length
    - votes each
    - brainstorm time
    - voting time
    - time per topic
* Start! (starts timer)
* Gather Topics
* Voting
* Discussing

Each phase has a different display.

Topic gathering looks like:

Add topic:
   Title:  (short)
   Description: (textbox)

Submitted Topics:
(scrollbox)


Voting:

Choose the N topics you'd like to discuss
Votes Remaining: N

Collapsed view:
( :+1: ) ( Title ) ( \/ )

Discussing:

Title
Description
[ Progress Bar w/ time left ]

Up next:
* topic
* topic

Presenter has options for back/next/extend

## Architecture options

Goals:

- single page app
- realtime comm means probably websockets, which means not cloud native
- build out in golang or node
- data backend in redis?

Data model:

Coffees
    - id
    - clients
    - topics
    - state in (setup, topics, voting, discussing, over)
    - start_time
    - active_topic
    - option vars
Clients
    - uuid
    - organizer?
    - active_topic
    - votes_left
Topics
    - id (entry point)
    - title
    - description
    - votes

# Sample State delivered to the SPA

{
    'id': '<license plate>'
    'state': '(setup|topics|voting|discussing|over)',
    'is_presenter': true/false,
    'settings': {
        'title': "What's the coffee about?",
        'seconds_per_topic': 300,
        'votes_per_user': 2,
    },
    'topics': [
        { 'title': "",
          'description': "",
          'id': "",
          'votes': 3,
          'user_voted': (bool)
          'state': '(to discuss|discussing|discussed)',
          'end_time': <epoch seconds>
        }, ...
    ],
}

# RESTful endpoints

    POST /coffees/
        { title, seconds_per_topic, votes_per_user }
        Redirects to /coffees/{}

    GET /coffees/{}
        Returns -> above state

    PATCH /coffees/{}
        {'field': 'state', 'from': 'setup', 'to': 'topics'}

    POST /coffees/{}/topics
        {title, description}

    PATCH /coffees/{}/topics/{}
        {'field': 'state', 'from': 'discussing', 'to': 'discussed'}
    
    DELETE /coffees/{}/topics/{}
        {'field': 'state', 'from': 'discussing', 'to': 'discussed'}

    PATCH /coffees/{}/topics/{}
        {'field': 'votes', 'op': 'inc|dec' }

# Python API

import pycoffee as pc

coffee = pc.new_coffee(uid, title, seconds_per_topic, votes_per_user)
coffee = pc.load_coffee(coffee_id, uid)

coffee.state() # returns above dict
coffee.update_state(oldstate, newstate)
topic_id = coffee.new_topic(title, description)
coffee.update_topic(topic_id, oldstate, newstate)
coffee.delete_topic(topic_id)
coffee.update_vote(topic_id, op)



# Local dynamo

docker run -d -p 8000:8000 tray/dynamodb-local -inMemory -port 8000

# Dynamo Tables/Attributes/Items

    Coffees

    - CoffeeId
    - CreatorId
    - State (setup|topics|voting|discussing|over)
    - Created (timestamp)
    - Settings: {
       Title
       SecondsPerTopic
       VotesPerUser
    }

    Topics

    - CoffeeId
    - TopicId
    - CreatorId
    - Title
    - Description
    - Votes: (counter) 
    - State (to discuss|discussing|discussed)
    - EndTime //once discussion starts, endtime is set per ticket.

    Users
    
    - CoffeeId
    - UserId
    - SessionKey
    - Votes: [TopicId]

# Tech options

We can on login, if JWT is not set, set one.
Add to claims that it be fore the specified coffee ID, so it will re-log you in if needed
https://pyjwt.readthedocs.io/en/latest/

https://github.com/basecamp/trix
https://github.com/justone/go-minibus/blob/master/sample-app/main.go
https://github.com/justone/go-minibus



Nate Jones [9:29 AM] 
I’ve heard that Redux and Immutable js work well
got a buddy who’s been using them
says they’re a little bit tough to set up
but they work well after that
he’s also working on a system architecture that might work for you
each client gets a websocket for real time updates
and changes are done out of band with post requests
post a change, and any changes relevant to you stream down the  websocket

Also, Angular 2

https://github.com/olebedev/go-starter-kit
https://blog.diacode.com/trello-clone-with-phoenix-and-react-pt-6, https://github.com/bigardone/phoenix-trello
http://css-burrito.com/
https://github.com/koistya/react-static-boilerplate
https://github.com/raisemarketplace/redux-loop


We'll need to have a channel per coffee that all the users connect to.
