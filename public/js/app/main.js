window.pageObjects = {};

define(function (require) {
  var $ = require("jquery");
  require("persona");
  var models = require("./models");
  var views = require("./views");

  var appView = new views.AppView({model: models.mockups}, models.user);

});
