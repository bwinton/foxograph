define(['jquery', 'underscore', 'backbone', 'bootstrap'], function($, _, Backbone) {

// Base classes.

var AppView = Backbone.View.extend({
  el: '#mockups',

  template: _.template( $('#mockups-template').html() ),

  initialize: function() {
    this.button = this.$('#current-mockup');
    this.menu = this.$('#mockup-list');

    this.model.on('reset', this.render, this);
    this.model.fetch();
  },

  render: function() {
    this.menu.html( this.template( {"mockups": this.model.toJSON()} ) );
    $('.dropdown-toggle').dropdown();
    return this;
  }

});


// Instances.

return {'AppView': AppView};

});