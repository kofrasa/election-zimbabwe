requirejs.config({
  paths: {
    // libraries
    lib: 'lib',    
    text: 'lib/text',
    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: '../templates',
    // path to views folder
    views: 'views',
    // path to layouts folder
    layouts: 'views/layout',
    // path to backapp folder
    backapp: 'lib/backapp'
  }
});

function T( name, args ) {
	if( ! T.templates[name] ) {
		T.templates[name] = compileTemplate( templates[name] );
	}
	return T.templates[name]( args, { variable: 'v' } );
}

function loadStrings( strings ) {
	// There are more strings than templates, so copy templates to strings
	// but let strings override templates
	_.defaults( strings, templates );
	templates = strings;
	_.templateSettings.variable = 'v';
}

require([
  'app',
  'router'
], function(app, router) {

  console.log("Initializing application...");
  
  var g = app.g,
      config = app.config;

  // application configuration
  // could also be a function. MUST return an object
  app.configure({
      debug: true,
      appUrl: 'http://elections-zimbabwe.appspot.com',
  });
  
  app.on("reset", function () {
    // register reset callback
    // invoked with app.reset()
  });

  // initialize global variables
  app.initGlobals({
    user: null,
    map: null
  });
  
  // setup global events. attached to each view
  app.setupEvents({
    
  });
  
  // use Jinja Style for escaping
  _.templateSettings = {
    interpolate: /\{\{([\s\S]+?)\}\}/g,
    escape: /\{\{\-([\s\S]+?)\}\}/g,
    evaluate: /<%([\s\S]+?)%>/g
  };
  
  // run application
  app.run();
});
