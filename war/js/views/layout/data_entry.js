
define([
 'app',
 'text!templates/data_entry.html'
], function (app, layoutTmpl) {
	
	var Layout = Backbone.View.extend({
		el: 'body',
		render: function() {
			
			var out = app.renderTemplate(layoutTmpl, {user_email: "", user_signout_url:""});
			this.$el.html(out);
		}
	});
	
	return Layout;
	
});
