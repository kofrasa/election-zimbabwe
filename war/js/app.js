define(['backapp'], function (app) {
	
  // setup application specific extensions
	function parseQuery( query ) {
		if( query === null ) return {};
		if( typeof query !== 'string' ) return query;
	
		var params = {};
		if( query ) {
			var array = query.replace( /^[#?]/, '' ).split( '&' );
			for( var i = 0, n = array.length;  i < n;  ++i ) {
				var p = array[i].split( '=' ),
					key = decodeURIComponent( p[0] ),
					value = decodeURIComponent( p[1] );
				if( key ) params[key] = value;
			}
		}
		return params;
	}
	
	function setLanguage() {
		var defaultLanguage = 'en';
		var supportedLanguages = {
			en: true,
			es: true
		};
		var hl = ( params.hl || '' ).toLowerCase();
		if( ! hl  &&  acceptLanguageHeader != '{{acceptLanguageHeader}}' ) {
			var langs = acceptLanguageHeader.split(';')[0].split(',');
			for( var lang, i = -1;  lang = langs[++i]; ) {
				hl = lang.split('-')[0].toLowerCase();
				if( hl in supportedLanguages )
					break;
			}
		}
		if( !( hl in supportedLanguages ) )
			hl = defaultLanguage;
		params.hl = hl;
	}
	var params = parseQuery(location.search);
	setLanguage();
	
  return app;
  
});