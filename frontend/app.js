(function() {
  "use strict";
  /*
    * set up localStorage
    * figure out the mode of the system
    * When we are given an ID to connect to, start a reload loop
    * Use the state of that to fix up the DOM state
  */
  var api_url = "https://jnraqwtne1.execute-api.us-west-2.amazonaws.com/dev/"
  var coffee_id = null;
  var last_state = {};

  var user_id = localStorage.getItem("coffee-userid");
  if(user_id == null) {
    user_id = Math.random().toString(36).substr(2, 17);
    localStorage.setItem("coffee-userid", user_id);
  }

  function switch_displayed(id1, id2) {
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

  function render_coffee_state(state) {
    var desired_path = "/" + state["data"]["id"];
    if(window.location.pathname != desired_path) {
      history.pushState({}, null, desired_path);
    }
    state['data']['applink'] = window.location.href;
    // render out the coffee state, as a function of the
    var elem = document.getElementById("app-main-view");
    elem.innerHTML = nunjucks.render('templates/app_view.njk', state['data'])

    var nextstate_btn = document.getElementById("nextstate");
    if(nextstate_btn) {
      nextstate_btn.addEventListener('click', nextstate_handler);
    }
    var submittopic_btn = document.getElementById("submittopic");
    if(submittopic_btn) {
      submittopic_btn.addEventListener('click', submittopic_handler);
    }
    // TODO set a timer to fetch & re-render
  }


  var newcoffee_link = document.getElementById("newcoffee");
  newcoffee_link.addEventListener('click', function(e) {
    e.preventDefault();
    switch_displayed("landing-view", "coffee-setup-view");
    // TODO if you hit back this will fail
    // history.pushState({state: "setup"}, null, "/setup")
  })

  function coffee_client(method, path, payload) {
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
    if(payload) {
      fetch_args['body'] = JSON.stringify(payload);
    }
    console.log(fetch_args)

    fetch(api_url + path, fetch_args)
    .then(status)
    .then(json)
    .then(function (response) {
      console.log('Request succeeded with json response ', response)
      coffee_id = response['data']['id']
      last_state = response;
      render_coffee_state(response)
    })
    .catch(function (error) {
      console.log('request failed', error)
    });
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
    switch_displayed("coffee-setup-view", "app-main-view");

    var data = {};
    data["title"] = form_get("coffeetopic", String);
    data["seconds_per_topic"] = form_get("duration", parseInt);
    data["votes_per_user"] = form_get("votesperuser", parseInt)
    var payload = JSON.stringify(data);
    console.log("Creating a new coffee: " + payload)

    coffee_client('POST', 'coffees', data)

  })

// Should be able to use e.target.dataset['topic'] if data-topic defined on element

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

  // All we need to do the initial 'routing'
  if(window.location.pathname != '/' && coffee_id === null) {
    switch_displayed("landing-view", "app-main-view");
    coffee_id = window.location.pathname.substring(1);
    console.log("Detected a coffee id in browser that is not loaded, loading " + coffee_id)
    coffee_client("GET", "coffees/" + coffee_id)
  } else {
    console.log("Not loading. coffee_id == " + coffee_id)
  }


}())
