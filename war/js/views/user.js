
define([
 'app'        
], function (app) {
	
	var UserList = Backbone.View.extend({
		el: '.tab-filter',
		render: function() {
			console.log("User List");
			this.$el.html('<label>By Role:</label>');
			
			//$('.tab-filter').html('<label>By Role:</label>');
		}
	});
	
	return UserList;
	
});
