define(['jquery'], function($) {
"use strict";

$(function () {
  $("#loginButton").click(function() {
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
            $("#loginButton").hide();
            $("#personaId").text("Hello "+data.email).show();
          } else {
            console.log("Login failed because " + data.reason);
          }
        } catch (ex) {
          // oh no, we didn't get valid JSON from the server
          console.log(ex + this.response);
        }
      }, false);
      xhr.send(JSON.stringify({
        assertion: assertion
      }));
    });
  });
});

});