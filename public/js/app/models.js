/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, define:true */

define(['backbone'], function (Backbone) {

  "use strict";

  /**
   * A bug, with a bug number, and an x and y position to display the bug at.
   */
  var Bug = Backbone.Model.extend({
    defaults: {
      type: 'Bug',
      number: '0',
      x: 0,
      y: 0,
      page: ''
    },

    idAttribute: '_id',
    urlRoot : '/bugs/',

    initialize: function Bug_initialize() {
    }
  });

  var BugList = Backbone.Collection.extend({
    model: Bug,

    setParent: function Bug_setParent(parent) {
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

    idAttribute: '_id',
    urlRoot : '/pages/',

    initialize: function Page_initialize() {
      if (!this.get('bugs'))
        this.set('bugs', new BugList());
      this.get('bugs').setParent(this);
    }

  });

  var PageList = Backbone.Collection.extend({
    model: Page,

    setParent: function Page_setParent(parent) {
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
      name: '',
      creationDate: '',
      user: 'unsetUser'
    },

    idAttribute: '_id',
    urlRoot : '/mockups/',

    initialize: function Mockup_initialize() {
      if (!this.get('pages'))
        this.set('pages', new PageList());
      this.get('pages').setParent(this);
    }

  });

  var MockupList = Backbone.Collection.extend({
    model: Mockup,
    url: '/mockups/',

    comparator: function MockupList_comparator(mockup) {
      return mockup.get('user') + '-' + mockup.get('name');
    }
  });

  var User = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot : '/user',

    initialize: function User_initialize() {
    }
  });

  // Instances.

  var mockups = new MockupList();
  var user = new User();

  return {
    'mockups': mockups,
    'user': user,
    'Mockup': Mockup
  };

});