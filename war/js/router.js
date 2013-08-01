// Filename: router.js
define([
  'app'
], function(app) {

  var router = app.router;

  router.initialize({
    "": {name: "index", view: "index"},
	'data_entry': {name: 'user', view: "user", layout: 'data_entry'},
	'data_entry/:location': {name: 'location'}
  });
  

  return router;
});
