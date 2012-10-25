window.pageObjects = {};

define(function (require) {
  var $ = require("jquery");
  require("persona");
  var models = require("./models");
  var views = require("./views");

  var appView = new views.AppView({model: models.mockups});

  $("#loginButton")[0].addEventListener("click", function() {
    navigator.id.get(function(assertion) {
      if (!assertion) {
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/persona/verify", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("loadend", function(e) {
        try {
          var data = JSON.parse(this.response);
          if (data.status === "okay") {
            // the email address the user logged in with
            console.log(data.email);
          } else {
            console.log("Login failed because " + data.reason);
          }
        } catch (ex) {
          // oh no, we didn't get valid JSON from the server
        }
      }, false);
      xhr.send(JSON.stringify({
        assertion: assertion
      }));
    });
  }, false);
});
