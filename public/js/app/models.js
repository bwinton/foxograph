define(['backbone'], function(Backbone) {

// Base classes.

/**
 * A bug, with a bug number, and an x and y position to display the bug at.
 */
var Bug = Backbone.Model.extend({
  defaults: {
    type: 'Bug',
    number: "0",
    position: {x: 0, y: 0}
  },

  initialize: function() {
  }
});

var BugList = Backbone.Collection.extend({
  model: Bug,

  setParent: function(parent) {
    this.url = function () {
      var url = parent.url() + parent.get('_id') + '/bugs/';
      if (this.get('_id'))
        url += this.get('_id');
      return url;
    };
  }
});


/**
 * A page, containing a background image, and a list of bugs.
 */
var Page = Backbone.Model.extend({
  defaults: {
    type: 'Page',
    image: '/images/default.png'
  },

  initialize: function() {
    this.bugs = new BugList();
    this.bugs.setParent(this);
  }

});

var PageList = Backbone.Collection.extend({
  model: Page,

  setParent: function(parent) {
    this.url = function () {
      var url = parent.url() + parent.get('_id') + '/pages/';
      if (this.get('_id'))
        url += this.get('_id');
      return url;
    };

  }
});


/**
 * A mockup, consisting of a title, and a list of pages.
 */
var Mockup = Backbone.Model.extend({
  defaults: {
    type: 'Mockup',
    name: 'New Mockup',
    pages: new PageList()
  },

  initialize: function() {
    this.get('pages').setParent(this);
    this.get('pages').fetch();
  }

});

var MockupList = Backbone.Collection.extend({
  model: Mockup,
  url: '/mockups/'
});


// Instances.

var mockups = new MockupList();

return {
  'mockups': mockups,
};

});