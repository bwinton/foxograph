define(['jquery', 'underscore', 'backbone', 'bootstrap'],
       function($, _, Backbone) {

// Base classes.


// Mockup View

var MockupView = Backbone.View.extend({
  el: '#mockup',

  template: _.template($('#mockup-template').html()),

  initialize: function() {
    var self = this;
    window.mockupView = this;
    return this;
  },

  render: function() {
    var self = this;
    $(this.el).html(this.template(this.model));
    return this;
  },
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
    this.subview = new MockupView({model: mockup}).render();
    this.render();
  }

});


// Instances.

return {'AppView': AppView};

});
