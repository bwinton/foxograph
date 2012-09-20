define(['jquery', 'underscore', 'backbone', 'bootstrap'], function($, _, Backbone) {

// Base classes.

var AppView = Backbone.View.extend({
  el: '#mockups',

  template: _.template( $('#mockups-template').html() ),

  initialize: function() {
    this.model.on('reset', this.render, this);
  },

  render: function() {
    this.$el.html( this.template( {"mockups": this.model.toJSON()} ) );
    $('.dropdown-toggle').dropdown();
    return this;
  }

});


// Instances.

return {'AppView': AppView};

});