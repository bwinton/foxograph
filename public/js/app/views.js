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
        self.model.save();
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
    this.subview = null;

    // Debug events.
    this.model.get('pages').on('all', this.debugPages, this);
    this.model.on('all', this.debug, this);

    this.model.on('sync', this.render, this);
    this.model.get('pages').on('add', this.setPage, this);

    var self = this;
    this.model.get('pages').fetch({success: function() {
      var pages = self.model.get('pages');
      if (pages.length === 0)
        pages.create({'mockup': self.model.id}, {wait: true});
      else
        self.setPage(pages.at(0));
    }});

    return this;
  },

  debug: function(eventName, extra) {
    console.log('MockupView sent '+eventName+'.  '+JSON.stringify(extra));
  },

  debugPages: function(eventName, extra) {
    console.log('MockupView.Pages sent '+eventName+'.  '+JSON.stringify(extra));
  },

  render: function() {
    $(this.el).html(this.template(this.model));
    return this;
  },

  setPage: function(page) {
    this.page = page;
    this.subview = new PageView({model: page});
    this.render();
  }
});


// App View.

var AppView = Backbone.View.extend({
  el: 'body',

  template: _.template($('#mockups-template').html()),

  events: {
    'click option[value="addMockup"]': 'showNewForm',
    'click option[data-id]': 'clickMockup',
    'click #createMockup': 'createMockup',
    'click #cancelMockup': 'hideNewForm'
  },

  initialize: function() {
    this.menu = this.$('#mockup-list');
    this.subview = null;
    this.mockup = null;

    this.model.on('reset', this.render, this);
    this.model.on('add', this.setMockup, this);

    // Debug events.
    this.model.on('all', this.debug, this);

    this.model.fetch();
    return this;
  },

  debug: function(eventName, extra) {
    console.log('AppView sent '+eventName+'.  '+JSON.stringify(extra));
  },

  render: function() {
    var self = this;
    var menu = '<option value="addMockup">Add a new mockup…</option>';
    if (this.model.length)
      menu += '<optgroup label="---"></optgroup>';
    this.model.each(function(model, i, l) {
      menu += self.template(model);
    });
    this.menu.html(menu);
    if (this.subview)
      $("option[data-id='"+this.subview.model.cid+"']").attr("selected", true);
    return this;
  },


  // Utility Methods.

  setMockup: function(mockup) {
    this.mockup = mockup;
    $('#mockup').show();
    $('#page').show();
    this.hideNewForm();
    this.subview = new MockupView({model: this.mockup});
    this.render();
  },


  // Event Handlers.

  showNewForm: function(e) {
    $('#mockup').hide();
    $('#page').hide();
    $('#newMockup').show();
  },

  clickMockup: function(e) {
    var id = $(e.currentTarget).data('id');
    var mockup = this.model.getByCid(id);
    this.setMockup(mockup);
  },

  hideNewForm: function(e) {
    if (e) e.preventDefault();
    $('#inputName').val('');
    $('#newMockup').hide();
  },

  createMockup: function(e) {
    e.preventDefault();
    if (!$('#inputName').val())
      return;
    this.model.create({'name': $('#inputName').val()}, {wait: true});
  }

});


// Instances.

return {'AppView': AppView};

});
