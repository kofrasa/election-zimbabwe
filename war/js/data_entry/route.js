var Router = Backbone.Router.extend({
	routes: {
		'': 'user',
		'polling': 'polling',
		'ward': 'ward',
		'constituency': 'constituency',
		'province': 'province'
	}
});


var router = new Router();

router.on('route:user', function() {
	var userList = new UserList();
	console.log('User');
	userList.render();
});

router.on('route:polling', function() {
	console.log("Polling");
});

Backbone.history.start();
//Backbone.fragment = "_jhg";
//router.navigate("",{trigger:true});