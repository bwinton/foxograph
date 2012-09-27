define(['jquery', 'underscore', 'backbone', 'bootstrap'],
       function($, _, Backbone) {

// Base classes.

var oldSync = Backbone.sync;

Backbone.sync = function(method, model, options) {
  alert(method + ": " + JSON.stringify(model) + " - " + JSON.stringify(options));
  return oldSync(method, model, options);
};


// Page View

var PageView = Backbone.View.extend({
  el: '#page',

  template: _.template($('#page-template').html()),

  initialize: function() {
    var self = this;
    this.currentPage = this.$('#current-page');
    return this;
  },

  render: function() {
    var self = this;
    $(this.el).html(this.template(this.model));
    var holder = $('.background');

    holder[0].ondragover = function () { holder.addClass('hover'); return false; };
    holder[0].ondragend = function () { holder.removeClass('hover'); return false; };
    holder[0].ondrop = function (e) {
      e.preventDefault();

      var file = e.dataTransfer.files[0],
          reader = new FileReader();
      reader.onload = function (event) {
        console.log(event.target.result);
        self.model.set('image', event.target.result);
        //self.model.save();
        self.render();
      };
      console.log(file.name);
      reader.readAsDataURL(file);

      return false;
    };
    return this;
  },
});



// Mockup View

var MockupView = Backbone.View.extend({
  el: '#mockup',

  template: _.template($('#mockup-template').html()),

  initialize: function() {
    var self = this;
    this.currentPage = this.$('#current-page');
    window.mockupView = this;
    this.model.fetch();
    this.model.get('pages').fetch();
    return this;
  },

  render: function() {
    var self = this;
    $(this.el).html(this.template(this.model));
    return this;
  },

  setPage: function(page) {
    this.render();
    this.subview = new PageView({model: this.model.get('pages').at(page)}).render();
  }
});


// App View.

var AppView = Backbone.View.extend({
  el: '#mockups',

  template: _.template($('#mockups-template').html()),

  events: {
    'click #addMockup': 'showNewForm',
    'click #mockup-list a': 'clickMockup'
  },

  initialize: function() {
    this.button = this.$('#current-mockup');
    this.menu = this.$('#mockup-list');
    this.subview = null;
    var self = this;

    $('#createMockup').click(function() {self.createMockup();});
    $('#cancelMockup').click(function() {self.hideNewForm();});

    this.model.on('reset', this.render, this);
    this.model.fetch();
  },

  render: function() {
    var self = this;
    this.menu.html('');
    this.model.each(function(model, i, l) {
      self.menu.append(self.template(model));
    });
    if (this.model.length)
      this.menu.prepend($('<li class="divider"></li>'));
    this.menu.prepend($('<li><a id="addMockup" href="#">Add a new mockup…</a></li>'));
    return this;
  },

  showNewForm: function() {
    $('#mockup').hide();
    $('#newMockup').show();
  },

  hideNewForm: function() {
    $('#inputName').val('');
    $('#newMockup').hide();
  },

  createMockup: function() {
    // Create a new mockup, and add it.
    if (!$('#inputName').val())
      return;
    var x = this.model.create({'name': $('#inputName').val()});
    window.views = this;
    x.get('pages').create({});
    this.showMockup(x);
  },

  clickMockup: function(e) {
    e.preventDefault();
    var id = $(e.currentTarget).data('id');
    var mockup = this.model.getByCid(id);
    this.showMockup(mockup);
  },

  showMockup: function(mockup) {
    if (!mockup)
      return;

    $('#mockup').show();
    this.hideNewForm();
    this.subview = new MockupView({model: mockup});
    this.subview.setPage(0);
    this.render();
  }

});


// Instances.

return {'AppView': AppView};

});
