// Filename: router.js
define([
  'app',
  'models/index'
], function(app, models) {
  console.log("Loading router...");

  var router = app.router;

  router.initialize({
    "": {name: "index", view: "index", layout: "main"}
  });

  return router;
});
