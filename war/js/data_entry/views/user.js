$.ajaxPrefilter(function( options, originalOptions, jqXHR ){
	options.url = 'http://www.election-zw.appspot.com' + options.url;
})

var Users = Backbone.Collection.extend({
	url: '/user'
});

var UserList = Backbone.View.extend({
	el: '#tab-body',
	render: function() {
		var that = this;	
		
		var users = new Users();
		users.fetch({
			success: function(){
				var template = _.template($('#user-list-template').html(), {users: users.models});
				that.$el.html(template);
			}
		})		
	}
});