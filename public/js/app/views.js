/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, define:true */

define(['jquery', 'underscore', 'backbone', './bugzillaMockup', 'bootstrap'],
       function ($, _, Backbone, bugzillaMockup) {

  "use strict";

  var models;
  var appView;
  var userView;
  var mockupView;
  var pageView;


  function loadImage(imageSrc, callback)
  {
    var img = new Image();
    img.src = imageSrc;
    if (img.complete) {
      callback(img);
      img.onload = function () {};
    } else {
      img.onload = function () {
        callback(img);
        // clear onLoad, IE behaves erratically with animated gifs otherwise
        img.onload = function () {};
      };
      img.onerror = function () {
        alert('Could not load image.');
      };
    }

  }

  // Bug View

  var BugView = Backbone.View.extend({
    tagName: 'div',
    className: 'bug',

    events: {
      'click .deleteBug': 'deleteBug',
    },

    initialize: function BugView_initialize() {
      // Debug events.
      this.model.on('all', this.debug, this);
    },

    debug: function BugView_debug(eventName, extra) {
      console.log('BugView sent ' + eventName + '.  ' + JSON.stringify(extra));
    },

    deleteBug: function BugView_deleteBug(e) {
      if (mockupView.model.get('user') !== userView.model.get('email')) return;

      this.model.destroy({wait: true});
      return false;
    },

    render: function BugView_render() {
      this.$el.attr('id', 'bug-' + this.model.get('number'))
          .css({'top': this.model.get('y'),
                'left': this.model.get('x')})
          .appendTo($('#page'));
      if (mockupView.model.get('user') === userView.model.get('email'))
        this.$el.attr('owned', 'true');
      bugzillaMockup.run();
    }
  });


  // Page View

  var PageView = Backbone.View.extend({
    el: '#page',

    events: {
      'click': 'clickBackground',
      'dragover': 'dragOver',
      'dragleave': 'dragLeave',
      'drop': 'drop'
    },


    initialize: function PageView_initialize() {
      var self = this;
      this.ctx = document.getElementById('background-canvas').getContext('2d');

      this.subViews = [];
      this.render();

      return this;
    },

    debug: function PageView_debug(eventName, extra) {
      console.log('PageView sent ' + eventName + '.  ' + JSON.stringify(extra));
    },

    debugBugs: function PageView_debugBugs(eventName, extra) {
      console.log('PageView.Bugs sent ' + eventName + '.  ' + JSON.stringify(extra));
    },

    setModel: function PageView_setModel(model) {
      // Clear out the old stuff.

      this.model = model;
      if (!this.model)
        return;

      // Debug events.
      this.model.get('bugs').on('all', this.debugBugs, this);
      this.model.on('all', this.debug, this);

      this.model.on('change:image', this.changeBackground, this);
      this.model.on('sync', this.render, this);
      this.model.get('bugs').on('add', this.addBug, this);
      this.model.get('bugs').on('reset', this.resetBugs, this);
      this.model.get('bugs').on('error', this.bugError, this);

      this.model.get('bugs').fetch();
    },

    clickBackground: function PageView_clickBackground(e) {
      if ((this.model.get('image') === '/images/default.png')) return;
      if (mockupView.model.get('user') !== userView.model.get('email')) return;

      var bug = prompt('Please enter a bug number');
      if (!bug) return;

      var page_id = this.model.id;
      var model = this.model;

      function bugExists() {
        model.get('bugs').create({'number': bug, 'x': e.pageX, 'y': e.pageY - 60,
                                  'page': page_id});
      }

      function bugDoesNotExist() {
        alert('The bug number entered is not valid.\nPlease try again.');
      }

      //TODO this is not ideal, as it calls getBug twice, once to see if the bug exists, another time to populate the bug info
      window.pageObjects.bugzilla.getBug(bug, bugExists, bugDoesNotExist);
    },

    dragOver: function PageView_ondragover() {
      this.$el.addClass('hover');
      return false;
    },

    dragLeave: function PageView_ondragover() {
      this.$el.removeClass('hover');
      return false;
    },

    drop: function PageView_ondragover(e) {
      var self = this;
      this.$el.removeClass('hover');

      var file = e.originalEvent.dataTransfer.files[0];
      var reader = new FileReader();
      reader.onload = function (event) {
        self.model.set('image', event.target.result);
        self.model.save();
      };
      reader.readAsDataURL(file);

      return false;
    },

    bugError: function PageView_bugError(bug) {
      this.model.get('bugs').fetch();
    },

    resetBugs: function PageView_resetBugs(bugs, extra, a) {
      var self = this;
      _.each(this.subViews, function (subView) {
        subView.remove();
      });
      this.subViews = [];
      bugs.each(function (bug) {
        self.addBug(bug);
      });
      this.render();
    },

    addBug: function PageView_addBugs(bug) {
      var bugView = new BugView({model: bug});
      this.subViews.push(bugView);
      bugView.render();
    },

    render: function PageView_render() {
      var self = this;
      this.changeBackground(this.model);

      // Since we've replaced the whole page, we should re-render all the bugs, too.
      _.each(this.subViews, function (view, i, l) {
        view.render();
      });

      return this;
    },

    changeBackground: function PageView_changeBackground(model) {
      $('#background-canvas').show();
      var ctx = this.ctx;
      var self = this;

      if (!this.model)
        return;

      this.$el.removeClass('hover')
            .css({'background-image': 'url("' + self.model.get('image') + '")'});
      loadImage(model.get('image'), function  PageView_loadImage(img) {
        self.$el.css({'height': img.height, 'width': img.width});
        if (self.model.get('image') === '/images/default.png')
          self.$el.css({'width': '', 'height': '', 'background-position': 'center'});
        ctx.drawImage(img, 1 - img.width, 1 - img.height);
        var imgData = ctx.getImageData(0, 0, 1, 1);
        var pixel = 'rgb(' + imgData.data[0] + ',' + imgData.data[1] + ',' + imgData.data[2] + ')';
        $('body').css({'background-color': pixel});
        $('#background-canvas').hide();
      });
    }
  });



  // Mockup View

  var MockupView = Backbone.View.extend({
    el: '#mockup',

    template: _.template($('#mockup-template').html()),

    events: {
      'click #deleteMockup': 'deleteMockup',
    },

    initialize: function MockupView_initialize() {
      this.setModel(this.model);
      this.render();
      return this;
    },

    debug: function MockupView_debug(eventName, extra) {
      console.log('MockupView sent ' + eventName + '.  ' + JSON.stringify(extra));
    },

    debugPages: function MockupView_debugPages(eventName, extra) {
      console.log('MockupView.Pages sent ' + eventName + '.  ' + JSON.stringify(extra));
    },

    render: function MockupView_render() {
      var data = this.model || new models.Mockup();
      data.set('owner', data.get('user') === userView.model.get('email'));
      $(this.el).html(this.template(data));
      return this;
    },

    setModel: function MockupView_setModel(model) {
      // Clear out the old stuff.

      this.model = model;
      if (!this.model)
        return;

      // Debug events.
      this.model.get('pages').on('all', this.debugPages, this);
      this.model.on('all', this.debug, this);

      this.model.on('sync', this.render, this);
      this.model.get('pages').on('add', this.setPage, this);

      var self = this;
      this.model.get('pages').fetch({success: function MockupView_getPages() {
        var pages = self.model.get('pages');
        if (pages.length === 0)
          pages.create({'mockup': self.model.id}, {wait: true});
        else
          self.setPage(pages.at(0));
      }});
    },

    setPage: function MockupView_setPage(page) {
      pageView.setModel(page);
      this.render();
    },

    deleteMockup: function MockupView_deleteMockup(e) {
      this.model.destroy({wait: true});
      return false;
    }
  });


  // User View.

  var UserView = Backbone.View.extend({
    el: '#user',

    userTemplate: _.template($('#user-template').html()),
    emptyTemplate: _.template($('#nouser-template').html()),

    initialize: function UserView_initialize() {

      // Debug events.
      this.model.on('all', this.debug, this);
      this.model.on('change', this.render, this);

      var self = this;

      navigator.id.watch({
        onlogin: function UserView_onLogin(assertion) {
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "/persona/verify", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.addEventListener("loadend", function UserView_onLogin_loadEnd(e) {
            self.model.fetch();
          }, false);

          xhr.send(JSON.stringify({
            assertion: assertion
          }));
        },
        onlogout: function UserView_onLogout() {
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "/persona/logout", true);
          xhr.addEventListener("loadend", function UserView_onLogout_loadEnd(e) {
            self.model.fetch();
          });
          xhr.send();
        }
      });

      $(this.el).click(function UserView_click() {
        if (self.model.get('email') === '') {
          navigator.id.request();
        } else {
          navigator.id.logout();
        }
      });

      return this;
    },

    debug: function UserView_debug(eventName, extra) {
      console.log('UserView sent ' + eventName + '.  ' + JSON.stringify(extra));
    },

    debugPages: function UserView_debugPages(eventName, extra) {
      console.log('UserView.Pages sent ' + eventName + '.  ' + JSON.stringify(extra));
    },

    render: function UserView_render() {
      var email = '';
      if (this.model)
        email = this.model.get('email');
      console.log('email = ' + email);
      var template = this.userTemplate;
      if (email === '')
        template = this.emptyTemplate;
      $(this.el).html(template(this.model));

      return this;
    },

  });


  // App View.

  var AppView = Backbone.View.extend({
    el: 'body',

    template: _.template($('#mockups-template').html()),

    events: {
      'click option[value="addMockup"]': 'clickNewForm',
      'click option[data-id]': 'clickMockup',
      'click #createMockup': 'createMockup',
      'click #cancelMockup': 'hideNewForm'
    },

    initialize: function AppView_initialize(options, user, router) {
      var self = this;
      this.user = user;
      this.router = router;
      this.menu = this.$('#mockup-list');

      this.model.on('reset', this.render, this);
      this.model.on('remove', this.removeMockup, this);
      this.model.on('add', this.addMockup, this);
      this.user.on('change', this.render, this);
      this.router.on('route:default', function () {
        if (self.menu) {
          self.menu.children('option[data-id]').first().click();
          self.render();
        }
      });
      this.router.on('route:getMockup', function AppView_getMockup(mid) {
        self.model.fetch({'success': function AppView_getMockup_success(model, response, options) {
          self.setMockup(self.model.get(mid));
        }});
      });
      this.router.on('route:newMockup', function AppView_newMockups() {
        self.showNewForm();
      });

      // Debug events.
      this.model.on('all', this.debug, this);

      this.model.fetch();
      this.user.fetch();

      return this;
    },

    debug: function AppView_debug(eventName, extra) {
      console.log('AppView sent ' + eventName + '.  ' + JSON.stringify(extra));
    },

    render: function AppView_render() {
      var self = this;
      var menu = '';
      if (this.user.get('email') !== '') {
        menu += '<option value="addMockup">Add a new mockup…</option>';
        if (this.model.length)
          menu += '<optgroup label="---"></optgroup>';
      }
      this.model.each(function AppView_eachModel(model, i, l) {
        model.set('shortuser', model.get('user').replace("@mozilla.com", ""));
        menu += self.template(model);
      });
      this.menu.html(menu);
      if (mockupView.model)
        $('option[data-id="' + mockupView.model.cid + '"]').attr('selected', true);
      else if (document.location.pathname === '/')
        this.menu.children('option[data-id]').first().click();
      return this;
    },


    // Utility Methods.

    setMockup: function AppView_setMockup(mockup) {
      $('#page').show();
      this.hideNewForm();
      mockupView.setModel(mockup);
      this.render();
    },


    // Event Handlers.

    showNewForm: function AppView_showNewForm() {
      $('#mockup').html('<h1>Create a new Mockup</h1>');
      $('#page').hide();
      $('body').css({'background-color': ''});
      $('#newMockup').show();
    },

    addMockup: function AppView_addMockup(mockup) {
      this.router.navigate("m/" + mockup.id, {'trigger': true});
    },

    removeMockup: function AppView_removeMockup(mockup) {
      this.router.navigate("/", {'trigger': true});
    },

    clickMockup: function AppView_clickMockup(e) {
      var id = $(e.currentTarget).data('id');
      var mockup = this.model.getByCid(id);
      var url = "/";
      if (mockup)
        url = "m/" + mockup.id;
      this.router.navigate(url, {'trigger': true});
    },

    clickNewForm: function AppView_clickNewForm(e) {
      this.router.navigate("m/new", {'trigger': true});
    },

    hideNewForm: function AppView_hideNewForm(e) {
      if (e) e.preventDefault();
      $('#inputName').val('');
      $('#newMockup').hide();
    },

    createMockup: function AppView_createMockup(e) {
      e.preventDefault();
      if (!$('#inputName').val())
        return;
      this.model.create({'name': $('#inputName').val()}, {wait: true});
    }

  });


  function init(aModels, routes) {
    models = aModels;
    userView = new UserView({model: models.user});
    pageView = new PageView();
    mockupView = new MockupView();
    appView = new AppView({model: models.mockups}, models.user, routes.router);

    Backbone.history.start({'pushState': true});
  }

  // Instances.
  return {'init': init};

});
