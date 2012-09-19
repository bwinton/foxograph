define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

// Base classes.

/**
 * A mockup, consisting of a title, and a list of pages.
 */
var Mockup = Backbone.Model.extend({
  defaults: {
    name: 'New Mockup'
  },

  initialize: function() {
    this.pages = new PageList();
    this.pages.url = '/mockups/' + this.id + this.pages.url;
  }

});

var MockupList = Backbone.Collection.extend({
  model: Mockup,
  url: '/mockups/'
});


/**
 * A page, containing a background image, and a list of bugs.
 */
var Page = Backbone.Model.extend({
  defaults: {
    image: '/images/default.png'
  },

  initialize: function() {
    this.bugs = new BugList();
    this.bugs.url = '/pages/' + this.id + this.bugs.url;
  }

});

var PageList = Backbone.Collection.extend({
  model: Page,
  url: '/pages'
});


/**
 * A bug, with a bug number, and an x and y position to display the bug at.
 */
var Bug = Backbone.Model.extend({
  defaults: {
    number: "0",
    position: {x: 0, y: 0}
  },

  initialize: function() {
  }
});

var BugList = Backbone.Collection.extend({
  model: Bug,
  url: '/bugs'
});


// Instances.

var mockups = new MockupList();
mockups.fetch();

return {'mockups': mockups};

});