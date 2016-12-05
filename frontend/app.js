(function() {
  "use strict";

  var api_url = "https://jnraqwtne1.execute-api.us-west-2.amazonaws.com/dev/"
  var coffee_id = null;
  var state_updated_ts = 0;
  var last_state = {};

  var user_id = localStorage.getItem("coffee-userid");
  if(user_id == null) {
    user_id = Math.random().toString(36).substr(2, 17);
    localStorage.setItem("coffee-userid", user_id);
  }

  function switch_displayed(id1, id2) {
    // always kill the header, that's only for the landing page.
    document.getElementById('header').style.display = "none";
    var old_elem = document.getElementById(id1);
    var new_elem = document.getElementById(id2);
    old_elem.style.display = "none";
    new_elem.style.animation = "pulse 0.5s linear 1";
    new_elem.style.display = "block"
  }

  function status(response) {
    if(response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function json(response) {
    return response.json();
  }

  function add_click_handler(id, callback) {
    var button = document.getElementById(id);
    if(button) {
      button.addEventListener('click', callback);
    }
  }

  function add_class_click_handler(klass, callback) {
    var buttons = document.getElementsByClassName(klass);
    for(var i = 0; i < buttons.length; i++) {
      buttons.item(i).addEventListener('click', callback);
    }
  }

  function render_coffee_state(state) {
    var desired_path = "/" + state["data"]["id"];
    if(window.location.pathname != desired_path) {
      history.pushState({}, null, desired_path);
    }
    // janky, but this object needs decoratin before passing to the view
    // and the object comes in as a reference. Make a clone so we can compare
    // and decide if the view needs updating.
    var view_data = JSON.parse(JSON.stringify(state['data']));
    view_data['applink'] = window.location.href;

    var elem = document.getElementById("app-main-view");
    elem.innerHTML = nunjucks.render('templates/app_view.njk', view_data)

    add_click_handler("nextstate", nextstate_handler);
    add_click_handler("submittopic", submittopic_handler);
    add_click_handler("nexttopic", nexttopic_handler);
    add_class_click_handler("votebutton", votetopic_handler);
  }


  var newcoffee_link = document.getElementById("newcoffee");
  newcoffee_link.addEventListener('click', function(e) {
    e.preventDefault();
    switch_displayed("landing-view", "coffee-setup-view");
    // TODO if you hit back this will fail
    // history.pushState({state: "setup"}, null, "/setup")
  })

  function default_response_handler(response) {
    state_updated_ts = Date.now();
    console.log('Request succeeded with json response ', response)
    coffee_id = response['data']['id']
    // Only do any redrawing if state of the system has actually changed
    if(JSON.stringify(response) !== JSON.stringify(last_state)) {
      console.log("Rendering new state, last_state differed from response")
      console.log(JSON.stringify(last_state))
      console.log(JSON.stringify(response))
      last_state = response;
      render_coffee_state(response)
    } else {
      console.log("Not updating state, it's the same as it ever was.")
    }
  }

  function default_error_handler(error) {
    console.log('request failed', error)
  }

  function coffee_client(method, path, payload, response_handler, error_handler) {
    // TODO There is a better way to do this.
    // Allow some client use cases to override the response and error handlers
    // else use the defaults
    if(typeof error_handler === 'undefined') {
      console.log("No error handler, using default")
      error_handler = default_error_handler;
    }
    if(typeof response_handler === 'undefined') {
        console.log("No response handler defined, using default")
        response_handler = default_response_handler;
    }

    console.log("Contacting coffee backend " + method + ", " + path + ", " + payload)
    var fetch_args = {
      method: method,
      mode: 'cors',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-Api-Key': user_id
      }
    }
    if(payload && method != "GET") {
      fetch_args['body'] = JSON.stringify(payload);
    }
    console.log(fetch_args)

    fetch(api_url + path, fetch_args)
    .then(status)
    .then(json)
    .then(response_handler)
    .catch(error_handler);
  }

  function form_get(id, cast) {
    if(!cast) {
      cast = String;
    }
    var value = undefined;
    try {
      value = cast(document.getElementById(id).value);
    } catch (error) {
      console.log("Unable to read value for " + id + ": " + error)
    }
    return value;
  }

  // Event handler for 'create coffee' button
  var createcoffee_btn = document.getElementById("createcoffee");
  createcoffee_btn.addEventListener('click', function(e) {
    e.preventDefault();
    // TODO:
    // 1. switch buttons to the HREF style
    // 2. disable the button until a valid coffee topic has been entered
    switch_displayed("coffee-setup-view", "app-main-view");
    var data = {};
    data["title"] = form_get("coffeetopic", String);
    data["seconds_per_topic"] = form_get("duration", parseInt) * 60;
    data["votes_per_user"] = form_get("votesperuser", parseInt)
    var payload = JSON.stringify(data);
    console.log("Creating a new coffee: " + payload)

    coffee_client('POST', 'coffees', data)

  })

// Should be able to use e.target.dataset['topic'] if data-topic defined on element

  var votetopic_handler = function(e) {
    e.preventDefault();
    var data = e.target.dataset;
    coffee_client("PUT", data['topiclink'], {'field': 'votes', 'op': data['action']})
  }

  var nexttopic_handler = function(e) {
    e.preventDefault();
    var to_discuss = last_state['data']['topics']['to_discuss'];
    if(to_discuss.length > 0) {
      coffee_client("PUT", to_discuss[0]['link'], {'field': 'state', 'to': 'discussing'})
    }
  }

  var nextstate_handler = function(e) {
    console.log("Going to next state, event: " + e);
    console.log("Event came from: " + e.target);
    e.preventDefault();
    var current_state = last_state["data"]["state"];
    var state_map = {
      "setup": "topics",
      "topics": "voting",
      "voting": "discussing",
      "discussing": "over"
    }
    var next_state = state_map[current_state];
    coffee_client("PUT", last_state["links"]["self"], {'field': 'state', 'to': next_state});
  }

  var submittopic_handler = function(e) {
    e.preventDefault();
    var data = {};
    data["title"] = form_get("topictitle");
    data["description"] = form_get("topicdescription");
    coffee_client("POST", last_state["links"]["self"] + "/topics", data)
  }

  var joincoffee_btn = document.getElementById("joincoffee");
  var joincoffee_handler = function(e) {
    // 1. set up this handler
    e.preventDefault();
    var popup = document.getElementById("join-status-popup");
    popup.style.visiblity = "hidden";

    var wanted_coffee_id = form_get("coffeetojoin")
    var exists_handler = function(response) {
      console.log("Coffee existed.")
      switch_displayed("landing-view", "app-main-view");
      coffee_id = wanted_coffee_id
      default_response_handler(response)
    }
    var doesnt_exist_handler = function(error) {
      console.log("Coffee Did not exist:" + error)
      popup.style.visibility = "visible";
      setTimeout(function() {
        popup.style.visibility = "hidden";
      }, 3000);
    }
    coffee_client("GET", "coffees/" + wanted_coffee_id, {}, exists_handler, doesnt_exist_handler)
  }
  joincoffee_btn.addEventListener('click', joincoffee_handler);

  // All we need to do the initial 'routing'
  if(window.location.pathname != '/' && coffee_id === null) {
    switch_displayed("landing-view", "app-main-view");
    coffee_id = window.location.pathname.substring(1);
    console.log("Detected a coffee id in browser that is not loaded, loading " + coffee_id)
    coffee_client("GET", "coffees/" + coffee_id)
  } else {
    console.log("Not loading. coffee_id == " + coffee_id)
  }

  // Set up the recurring state refresh process
  setInterval(function() {
    // Every second, see if we should have a server state to render, and if
    // it has not been updated for more than 3 seconds, fetch and re-render
    if(coffee_id != null && (Date.now() - state_updated_ts) > 3000) {
      coffee_client("GET", "coffees/" + coffee_id)
    }
  }, 5000);


}())
