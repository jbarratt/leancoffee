(function() {
  /*
    * set up localStorage
    * figure out the mode of the system
    * When we are given an ID to connect to, start a reload loop
    * Use the state of that to fix up the DOM state
  */

  function switch_displayed(id1, id2) {
    var old_elem = document.getElementById(id1);
    var new_elem = document.getElementById(id2);
    old_elem.style.display = "none";
    new_elem.style.animation = "pulse 0.5s linear 1";
    new_elem.style.display = "block"
  }

  var userId = localStorage.getItem("coffee-userid");
  if(userId == null) {
    userId = Math.random().toString(36).substr(2, 17);
    localStorage.setItem("coffee-userid", userId);
  }

  // Event handler for 'new coffee' link
  var newcoffee_link = document.getElementById("newcoffee");
  newcoffee_link.addEventListener('click', function(e) {
    e.preventDefault();
    switch_displayed("landing-view", "coffee-setup-view");
  })

  // Event handler for 'create coffee' button
  var createcoffee_btn = document.getElementById("createcoffee");
  createcoffee_btn.addEventListener('click', function(e) {
    e.preventDefault();
    switch_displayed("coffee-setup-view", "app-main-view");
  })

}())
