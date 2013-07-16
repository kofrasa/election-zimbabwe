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
    // path to backapp folder
    backapp: 'lib/backapp'
  }
});

function T( name, args ) {
	return name;
//	if( ! T.templates[name] ) {
//		T.templates[name] = compileTemplate( templates[name] );
//	}
//	return T.templates[name]( args, { variable: 'v' } );
}

function loadStrings( strings ) {
	// There are more strings than templates, so copy templates to strings
	// but let strings override templates
	_.defaults( strings, templates );
	templates = strings;
	_.templateSettings.variable = 'v';
}

jQuery.extend( jQuery.fn, {
	bindSelector: function( events, listener, delay ) {
		var timer;
		this.bind( events, function() {
			var self = this, args = arguments;
			if( timer ) clearTimeout( timer );
			timer = setTimeout( function() {
				timer = null;
				listener.apply( self, args );
			}, delay || 50 );
		});
	},
	
	bounds: function() {
		if( ! this.length ) return {
			left: 0, right: 0, top: 0, bottom: 0
		}
		var offset = this.offset();
		return {
			left: offset.left,
			right: offset.left + this.width(),
			top: offset.top,
			bottom: offset.top + this.height()
		};
	}
});

require([
  'app',
  'router'
], function(app, router) {
  
  var g = app.g,
      config = app.config;

  // application configuration
  // could also be a function. MUST return an object
  app.configure({
      debug: true,
      appUrl: 'http://election-zw.appspot.com'
  });

  // initialize global variables
  app.initGlobals({
    user: null,
    map: null
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
