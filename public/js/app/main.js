window.pageObjects = {};

define(function (require) {
  var $ = require("jquery");
  require("persona");
  require("./personaId");
  var models = require("./models");
  var views = require("./views");

  var appView = new views.AppView({model: models.mockups});

});
