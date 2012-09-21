define(function (require) {
  var $ = require("jquery");
  var models = require("./models");
  var views = require("./views");

  var appView = new views.AppView({model: models.mockups});
});