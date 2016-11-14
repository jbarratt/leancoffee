# Lean Coffee Facilitator

## Short term todo

* build out functional test suite
* add an env var so dev goes to deletable tables

Primitive Auth:
- before connecting to API, generate a uuid and shove it in localstorage
- submit that in the headers with every request (X-CoffeeUser)

## High Level / UX Design

Goals:

* Allow anonymous contributors. (Organizers may eventually need Google/FB/Twitter login.)
* Work great on mobile, laptop-free is nice
* realtime all the things

Ideal workflow

* go to leancoffee.online
* Offer 'join a coffee' or 'start a coffee'
* On start, allow entry of a title
* Given a code to share (or just use the link)
* MVP: leancoffee.online/m/(uniquestring)

On visit everyone gets a JWT or just a bare ID

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

    # This is a logical PATCH; it will be PUT because PATCH is not supported
    PATCH /coffees/{}
        {'field': 'state', 'from': 'setup', 'to': 'topics'}

    POST /coffees/{}/topics
        {title, description}

    # This is a logical PATCH; it will be PUT because PATCH is not supported
    PATCH /coffees/{}/topics/{}
        {'field': 'state', 'from': 'discussing', 'to': 'discussed'}

    POST /coffees/{}/topics/{}
        {'field': 'votes', 'op': 'add|remove' }

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

# Revised Minimalist Frontend Strategy

https://slack-files.com/T03JT4FC2-F151AAF7A-13fe6f98da
http://joakim.beng.se/blog/posts/a-javascript-router-in-20-lines.html
http://handlebarsjs.com/

    {
      ...
      "scripts": {
        "build": "babel src -d dist & stylus src/styles -o dist/styles & cp src/index.html dist/index.html",
        "dev": "watch 'npm run build' ./src"
      }
      ...
    }

Try and use as much native browser goodness as possible.

On startup, the landing page should say

    (START) (JOIN) [ ... ]

    About Lean Coffees...

if the route is /.

Meanwhile, in the background, an app is loading, and attaching itself to the window, a la the halloween party thing.

* if you don't have a userid in localStorage, make one and save it
* If the 'route' is a coffee ID, hide the intro div. Based on the state of the app, pick which one to show. Also spin up a 3 second state refresh loop. Make sure to tell people what link to copy or what code to type in.
* If the admin is the admin, also show the nav bar, which lets them select things like the next state

Creating Topics:

Title:
Description:
Submit
(scrollable list of other topics)

Admin hits "Start Voting"

Everyone sees "Voting. Select only 2"
Scrollable list now has thumbs up icons.
If you have no votes left, the others get grayed out.

Admin hits Discussing
Display becomes front and center Title / Topic, w/ "up next"

Admin can hit Next or Over
Page view becomes scrollable (printable) list of all topics (with a discussion duration on each? At least if it was gotten to or not.)

UUID making:

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };
