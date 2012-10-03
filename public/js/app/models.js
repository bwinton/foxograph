define(['backbone'], function(Backbone) {

// Base classes.

/**
 * A bug, with a bug number, and an x and y position to display the bug at.
 */
var Bug = Backbone.Model.extend({
  defaults: {
    type: 'Bug',
    number: "0",
    x: 0,
    y: 0,
    page: ''
  },

  idAttribute: "_id",
  urlRoot : '/bugs/',

  initialize: function() {
  }
});

var BugList = Backbone.Collection.extend({
  model: Bug,

  setParent: function(parent) {
    this.parent = parent;
    this.url = function () {
      var url = parent.url() + '/bugs/';
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
    image: '/images/default.png',
    mockup: ''
  },

  idAttribute: "_id",
  urlRoot : '/pages/',

  initialize: function() {
    if (!this.get('bugs'))
      this.set('bugs', new BugList());
    this.get('bugs').setParent(this);
    //this.set('mockup', this.collection.parent.id);
  }

});

var PageList = Backbone.Collection.extend({
  model: Page,

  setParent: function(parent) {
    this.parent = parent;
    this.url = function () {
      var url = parent.url() + '/pages/';
      if (this.id)
        url += this.id;
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
  },

  idAttribute: "_id",

  initialize: function() {
    if (!this.get('pages'))
      this.set('pages', new PageList());
    this.get('pages').setParent(this);
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