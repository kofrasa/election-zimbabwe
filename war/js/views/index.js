define([
  'app',
  'text!templates/map.html'
], function (app, template) {
  
  var AppView = Backbone.View.extend({
    
    render: function () {
      var out = app.renderTemplate(template);
      $("#container").append(out);
            
    },
    
    events: {
    	
    }
  });
  
  return AppView;
});

