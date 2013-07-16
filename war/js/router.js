// Filename: router.js
define([
  'app'
], function(app) {

  var router = app.router;

  router.initialize({
    "": {name: "index", view: "index"}
  });

  return router;
});
