define(['backbone'], function(Backbone) {

  var AppRouter = Backbone.Router.extend({
      routes: {
          "m/new": "newMockup",
          "m/:mid": "getMockup",
          "m/:mid/p/:pid": "getPage"
      }
  });

  // Instantiate the router
  var router = new AppRouter();

  return {'router': router};
});