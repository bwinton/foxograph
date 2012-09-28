define(['jquery', 'underscore', 'backbone', 'bootstrap'],
       function($, _, Backbone) {

// Base classes.

// Page View

var PageView = Backbone.View.extend({
  el: '#page',

  template: _.template($('#page-template').html()),

  initialize: function() {
    var self = this;
    this.model.fetch({success: function(model, response) {
      self.render();
    }});

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
    this.model.fetch({success: function(model, response) {
      if (model.get('pages').length === 0)
        model.get('pages').create({mockup: model.id},
          {success: function(){
            self.render();
          }});
    }});
    window.mockupView = this;
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
  el: 'body',

  template: _.template($('#mockups-template').html()),

  events: {
    'click #addMockup': 'showNewForm',
    'click #mockup-list a[id!="addMockup"]': 'clickMockup',
    'click #createMockup': 'createMockup',
    'click #cancelMockup': 'hideNewForm'
  },

  initialize: function() {
    this.menu = this.$('#mockup-list');
    this.subview = null;
    var self = this;
    this.model.on('reset', this.render, this);
    this.model.fetch();
  },

  render: function() {
    var self = this;
    var menu = '<li><a id="addMockup" href="#">Add a new mockup…</a></li>';
    if (this.model.length)
      menu += '<li class="divider"></li>';
    this.model.each(function(model, i, l) {
      menu += self.template(model);
    });
    this.menu.html(menu);
    return this;
  },


  // Utility Methods.

  showMockup: function(mockup) {
    if (!mockup)
      return;

    $('#mockup').show();
    this.hideNewForm();
    this.subview = new MockupView({model: mockup});
    this.subview.setPage(0);
    this.render();
  },


  // Event Handlers.

  showNewForm: function(e) {
    if (e) e.preventDefault();
    $('#mockup').hide();
    $('#newMockup').show();
  },

  clickMockup: function(e) {
    e.preventDefault();
    var id = $(e.currentTarget).data('id');
    var mockup = this.model.getByCid(id);
    this.showMockup(mockup);
  },

  hideNewForm: function(e) {
    if (e) e.preventDefault();
    $('#inputName').val('');
    $('#newMockup').hide();
  },

  createMockup: function(e) {
    e.preventDefault();
    // Create a new mockup, and add it.
    if (!$('#inputName').val())
      return;
    var mockup = this.model.create({'name': $('#inputName').val()});
    this.model.create({'name': $('#inputName').val()});
  }

});


// Instances.

return {'AppView': AppView};

});
