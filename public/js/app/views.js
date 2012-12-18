define(['jquery', 'underscore', 'backbone', './bugzillaMockup', 'bootstrap'],
       function($, _, Backbone, bugzillaMockup) {

// Base classes.

function loadImage(imageSrc, callback)
{
  var img = new Image();
  img.src = imageSrc;
  if (img.complete) {
    callback(img);
    img.onload=function(){};
  } else {
    img.onload = function() {
      callback(img);
      // clear onLoad, IE behaves erratically with animated gifs otherwise
      img.onload=function(){};
    };
    img.onerror = function() {
      alert('Could not load image.');
    };
  }

}

// Bug View

var BugView = Backbone.View.extend({
  tagName: 'div',
  className: 'bug',

  initialize: function BugView_initialize() {
    // Debug events.
    this.model.on('all', this.debug, this);
  },

  debug: function BugView_debug(eventName, extra) {
    console.log('BugView sent '+eventName+'.  '+JSON.stringify(extra));
  },

  render: function BugView_render() {
    this.$el.attr('id', 'bug-'+this.model.get('number'))
        .css({'top': this.model.get('y'),
              'left': this.model.get('x')})
        .appendTo($('#page'));
    bugzillaMockup.run();
  }
});


// Page View

var PageView = Backbone.View.extend({
  el: '#page',

  template: _.template($('#page-template').html()),

  events: {
    'click .background': 'clickBackground'
  },


  initialize: function PageView_initialize() {
    var self = this;
    this.ctx = document.getElementById('background-canvas').getContext('2d');

    // Debug events.
    this.model.get('bugs').on('all', this.debugBugs, this);
    this.model.on('all', this.debug, this);

    this.model.on('change:image', this.changeBackground, this);
    this.model.on('sync', this.render, this);
    this.model.get('bugs').on('add', this.addBug, this);
    this.model.get('bugs').on('reset', this.resetBugs, this);

    this.model.get('bugs').fetch();

    this.subViews = [];
    this.render();

    return this;
  },

  debug: function PageView_debug(eventName, extra) {
    console.log('PageView sent '+eventName+'.  '+JSON.stringify(extra));
  },

  debugBugs: function PageView_debugBugs(eventName, extra) {
    console.log('PageView.Bugs sent '+eventName+'.  '+JSON.stringify(extra));
  },


  clickBackground: function PageView_clickBackground(e) {
    var bug = prompt('Please enter a bug number');

    if (!bug || (this.model.get('image') == '/images/default.png')) return;

    var page_id = this.model.id;
    var model = this.model;

    function bugExists()
    {
        model.get('bugs').create({'number': bug, 'x': e.pageX, 'y': e.pageY,
                                   'page': page_id});
    }

    function bugDoesNotExist()
    {
        alert('The bug number entered is not valid.\nPlease try again.');
    }

    //TODO this is not ideal, as it calls getBug twice, once to see if the bug exists, another time to populate the bug info
    pageObjects.bugzilla.getBug(bug, bugExists, bugDoesNotExist);
  },

  resetBugs: function PageView_resetBugs(bugs, extra, a) {
    var self = this;
    this.subViews = [];
    bugs.each(function(bug) {
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
    $(this.el).html(this.template(this.model));
    var holder = $('.background');

    holder[0].ondragover = function  PageView_ondragover() { holder.addClass('hover'); return false; };
    holder[0].ondragleave = function  PageView_ondragleave() { holder.removeClass('hover'); return false; };
    holder[0].ondrop = function  PageView_ondrop(e) {
      e.preventDefault();

      var file = e.dataTransfer.files[0],
          reader = new FileReader();
      reader.onload = function (event) {
        self.model.set('image', event.target.result);
        self.model.save();
      };
      reader.readAsDataURL(file);

      return false;
    };
    this.changeBackground(this.model);

    // Since we've replaced the whole page, we should re-render all the bugs, too.
    _.each(this.subViews, function(view, i, l) {
      view.render();
    });

    return this;
  },

  changeBackground: function PageView_changeBackground(model) {
    var holder = $('.background');
    $('#background-canvas').show();
    var ctx = this.ctx;

    holder.removeClass('hover')
          .css({'background-image': 'url("' + model.get('image') + '")'});
    loadImage(model.get('image'), function  PageView_loadImage(img) {
      holder.css({'height': img.height, 'width': img.width});
      if (model.get('image') == '/images/default.png')
        holder.css({'width': '100%', 'height': '100%', 'background-position': '45%'});
      ctx.drawImage(img, 1-img.width, 1-img.height);
      var imgData = ctx.getImageData(0, 0, 1, 1);
      var pixel = 'rgb('+imgData.data[0]+','+imgData.data[1]+','+imgData.data[2]+')';
      $('body').css({'background-color': pixel});
      $('#background-canvas').hide();
    });
  }
});



// Mockup View

var MockupView = Backbone.View.extend({
  el: '#mockup',

  template: _.template($('#mockup-template').html()),

  initialize: function MockupView_initialize() {
    this.subview = null;

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

    return this;
  },

  debug: function MockupView_debug(eventName, extra) {
    console.log('MockupView sent '+eventName+'.  '+JSON.stringify(extra));
  },

  debugPages: function MockupView_debugPages(eventName, extra) {
    console.log('MockupView.Pages sent '+eventName+'.  '+JSON.stringify(extra));
  },

  render: function MockupView_render() {
    $(this.el).html(this.template(this.model));
    return this;
  },

  setPage: function MockupView_setPage(page) {
    this.page = page;
    this.subview = new PageView({model: page});
    this.render();
  }
});


// User View.

var UserView = Backbone.View.extend({
  el: '#user',

  template: _.template($('#user-template').html()),

  initialize: function UserView_initialize() {
    this.subview = null;

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
    console.log('UserView sent '+eventName+'.  '+JSON.stringify(extra));
  },

  debugPages: function UserView_debugPages(eventName, extra) {
    console.log('UserView.Pages sent '+eventName+'.  '+JSON.stringify(extra));
  },

  render: function UserView_render() {
    console.log('email = ' + this.model.get('email'));
    if (this.model.get('email') === '') {
      $(this.el).html(this.template(this.model));
      $(this.el).removeAttr('title');
    } else {
      $(this.el).text('Hello ' + this.model.escape('email') + '.');
      $(this.el).attr('title', 'Click to sign out.');
    }

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
    this.subview = null;
    this.mockup = null;

    this.model.on('reset', this.render, this);
    this.model.on('add', this.setMockup, this);
    this.user.on('change', this.render, this);
    this.router.on('route:getMockup', function AppView_getMockup(mid) {
      self.model.fetch({'success': function AppView_getMockup_success(model, response, options){
        self.setMockup(self.model.get(mid));
      }});
    });
    this.router.on('route:newMockup', function AppView_newMockups() {
      self.showNewForm();
    })

    // Debug events.
    this.model.on('all', this.debug, this);

    this.model.fetch();
    this.user.fetch();
    this.userView = new UserView({model: this.user});

    return this;
  },

  debug: function AppView_debug(eventName, extra) {
    console.log('AppView sent '+eventName+'.  '+JSON.stringify(extra));
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
    if (this.subview)
      $('option[data-id="'+this.subview.model.cid+'"]').attr('selected', true);
    else if (document.location.pathname === '/')
      this.menu.children('option[data-id]').first().click();
    return this;
  },


  // Utility Methods.

  setMockup: function AppView_setMockup(mockup) {
    this.mockup = mockup;
    $('#page').show();
    this.hideNewForm();
    this.subview = new MockupView({model: this.mockup});
    this.render();
  },


  // Event Handlers.

  showNewForm: function AppView_showNewForm() {
    $('#mockup').html('<h1>Create a new Mockup</h1>');
    $('#page').hide();
    $('body').css({'background-color': ''});
    $('#newMockup').show();
  },

  clickMockup: function AppView_clickMockup(e) {
    var id = $(e.currentTarget).data('id');
    var mockup = this.model.getByCid(id);
    this.router.navigate("m/" + mockup.id, {'trigger': true});
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


// Instances.

return {'AppView': AppView};

});
