// Filename: module.js
define(function(app) {

  var User = {};
  User.Model = Backbone.Model.extend({
    urlRoot: '/users'
  });
  
  User.List = Backbone.Collection.extend({
    url: '/users'
  });

  return User;
});