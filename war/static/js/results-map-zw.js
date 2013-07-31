var times = {
	gadgetLoaded: now(),
	offset: 0
};

params.year = params.year || '2013';
params.contest = params.contest || 'president';

function cacheUrl( url ) {
	return opt.nocache ? S( url, '?q=', times.gadgetLoaded ) : url;
}

function imgUrl( name ) {
	return cacheUrl( 'static/images/' + name );
}

document.write(
	'<style type="text/css">',
		'html, body { margin:0; padding:0; border:0 none; }',
	'</style>'
);

//Analytics
var _gaq = _gaq || [];
_gaq.push([ '_setAccount', 'UA-36902519-1' ]);
//_gaq.push([ '_setDomainName', '.election-maps.appspot.com' ]);
_gaq.push([ '_trackPageview' ]);

var $body = $('body');
var $window = $(window), ww = $window.width(), wh = $window.height();
var mapPixBounds;
var sidebarWidth = 340;
var map;

var gm = google.maps, gme = google.maps.event;
opt.fontsize = '15px';
opt.reloadTime = 10 * 1000;

document.write(
	'<style type="text/css">',
		'html, body { width:', ww, 'px; height:', wh, 'px; margin:0; padding:0; overflow:hidden; color:#222; background-color:white; }',
		'#sidebar, #maptip, #testlabel, a.button { font-family: Arial,sans-serif; font-size: ', opt.fontsize, '; }',
		'a { font-size:13px; text-decoration:none; color:#1155CC; }',
		'a:hover { text-decoration:underline; }',
		//'a:visited { color:#6611CC; }',
		'a.button { display:inline-block; cursor:default; background-color:whiteSmoke; background-image:linear-gradient(top,#F5F5F5,#F1F1F1); border:1px solid #DCDCDC; border:1px solid rgba(0,0,0,0.1); border-radius:2px; box-shadow:none; color:#444; font-weight:bold; font-size:12px; height:27px; line-height:27px; padding:0 8px; -webkit-transition: all .218s; -moz-transition: all .218s; transition: all .218s;}',
		'a.button.hover, a.button:hover { background-color: #F6F6F6; background-image:linear-gradient(top,#F8F8F8,#F1F1F1); border:1px solid #C6C6C6; box-shadow:0px 1px 1px rgba(0,0,0,0.1); color:#222; z-index: 2; text-decoration: none !important; }',
		'a.button.selected { background-color: #EEE; background-image:linear-gradient(top,#EEE,#E0E0E0); border:1px solid #CCC; box-shadow:inset 0px 1px 2px rgba(0,0,0,0.1); color:#333; z-index: 2; }',
	        'a.segmented.button { border-radius: 0; text-align: center; padding: 0 8px; width: 80px; }',
	        'a.segmented.button.left { border-radius: 2px 0 0 2px; }',
	        'a.segmented.button.right { border-radius: 0 2px 2px 0; }',
	        'a.segmented.button.left + a.segmented.button, a.segmented.button + a.segmented.button, a.segmented.button.right { margin-left: -1px; }',
		'#outer {}',
		'.barvote { font-weight:bold; color:white; }',
		'div.topbar-header, div.sidebar-header { padding:3px; }',
		'div.title-text { font-size:16px; }',
		'div.subtitle-text { font-size:11px; color:#777; padding-left:3px;}',
		'div.body-text, div.body-text label { font-size:13px; }',
		'div.faint-text { font-size:12px; color:#777; }',
		'div.small-text, a.small-text { font-size:11px; }',
		'div.topbar-delegates { font-size:21px; line-height:21px; font-weight:bold; }',
		'body.narrow #topbar div.candidate-name { display:none; }',
		'#auto-update, #percent-reporting { margin: 0px 0px 8px 2px; }',
		'.content table { xwidth:100%; }',
		'.content .contentboxtd { width:7%; }',
		'.content .contentnametd { xfont-size:24px; xwidth:18%; }',
		'.content .contentbox { height:24px; width:24px; xfloat:left; margin-right:4px; }',
		'.content .contentname { white-space:pre; }',
		'.content .contentvotestd { text-align:right; width:5em; }',
		'.content .contentpercenttd { text-align:right; width:2em; }',
		'.content .contentvotes, .content .contentpercent { xfont-size:', opt.fontsize, '; margin-right:4px; }',
		'.content .contentclear { clear:left; }',
		'.content .contentreporting { margin-bottom:8px; }',
		'.content .contentreporting * { xfont-size:20px; }',
		'.content {}',
		'div.scroller { overflow:scroll; overflow-x:hidden; }',
		'div.scroller::-webkit-scrollbar-track:vertical { background-color:#f5f5f5; margin-top:2px; }',
		'div.scroller::-webkit-scrollbar { height:16px; width:16px; }',
		'div.scroller::-webkit-scrollbar-button { height:0; width:0; }',
		'div.scroller::-webkit-scrollbar-button:start:decrement, div.scroller::-webkit-scrollbar-button:end:increment { display:block; }',
		'div.scroller::-webkit-scrollbar-button:vertical:start:increment, div.scroller::-webkit-scrollbar-button:vertical:end:decrement { display:none; }',
		'div.scroller::-webkit-scrollbar-track:vertical, div.scroller::-webkit-scrollbar-track:horizontal, div.scroller::-webkit-scrollbar-thumb:vertical, div.scroller::-webkit-scrollbar-thumb:horizontal { border-style:solid; border-color:transparent; }',
		'div.scroller::-webkit-scrollbar-track:vertical { background-clip:padding-box; background-color:#fff; border-left-width:5px; border-right-width:0; }',
		'div.scroller::-webkit-scrollbar-track:horizontal { background-clip:padding-box; background-color:#fff; border-bottom-width:0; border-top-width:5px; }',
		'div.scroller::-webkit-scrollbar-thumb { -webkit-box-shadow:inset 1px 1px 0 rgba(0,0,0,.1),inset 0 -1px 0 rgba(0,0,0,.07); background-clip:padding-box; background-color:rgba(0,0,0,.2); min-height:28px; padding-top:100px; }',
		'div.scroller::-webkit-scrollbar-thumb:hover { -webkit-box-shadow:inset 1px 1px 1px rgba(0,0,0,.25); background-color:rgba(0,0,0,.4); }',
		'div.scroller::-webkit-scrollbar-thumb:active { -webkit-box-shadow:inset 1px 1px 3px rgba(0,0,0,.35); background-color:rgba(0,0,0,.5); }',
		'div.scroller::-webkit-scrollbar-thumb:vertical { border-width:0; border-left-width:5px; }',
		'div.scroller::-webkit-scrollbar-thumb:horizontal { border-width:0; border-top-width:5px; }',
		'div.scroller::-webkit-scrollbar-track:vertical { border-left-width:6px; border-right-width:1px; }',
		'div.scroller::-webkit-scrollbar-track:horizontal { border-bottom:1px; border-top:6px; }',
		'div.scroller::-webkit-scrollbar-thumb:vertical { border-width:0; border-left-width:6px; border-right-width:1px; }',
		'div.scroller::-webkit-scrollbar-thumb:horizontal { border-width:0; border-bottom:1px; border-top:6px; }',
		'div.scroller::-webkit-scrollbar-track:hover { -webkit-box-shadow:inset 1px 0 0 rgba(0,0,0,.1); background-color:rgba(0,0,0,.05); }',
		'div.scroller::-webkit-scrollbar-track:active { -webkit-box-shadow:inset 1px 0 0 rgba(0,0,0,.14),inset -1px -1px 0 rgba(0,0,0,.07); background-color:rgba(0,0,0,.05); }',
		'#maptip { position:absolute; z-index:10; border:1px solid #333; background:white; color:#222; white-space: nowrap; display:none; width:300px; }',
		'div.candidate-name { line-height:1em; }',
		'div.first-name { font-size:85%; }',
		'div.first-namep { font-size:100%; }',
		'#election-title { padding-left:3px; }',
		'body.tv #election-title { font-size:24px; font-weight:bold; }',
		'body.tv #election-date { font-size:16px; color:#222; }',
		'body.tv #percent-reporting { font-size:20px; }',
		'body.tv div.candidate-name { margin-right:20px; }',
		'body.tv div.candidate-name div { line-height:1.1em; }',
		'body.tv div.first-name { font-size:20px; }',
		'body.tv div.last-name { font-size:24px; font-weight:bold; }',
		'body.tv #maptip { border:none; }',
		'body.tv #map { border-left:1px solid #333; }',
		'body.tv span.tiptitletext { font-size:28px; }',
		'body.tv div.tipreporting { font-size:20px; }',
		'body.tv table.candidates td { padding:4px 0; }',
		'.tiptitlebar { padding:4px 8px; border-bottom:1px solid #AAA; }',
		'.tiptitletext { font-weight:bold; font-size:120%; }',
		'.tipcontent { padding:4px 8px 8px 8px; border-bottom:1px solid #AAA; }',
		'.tipreporting { font-size:80%; padding:2px 0; }',
			//'#selectors { background-color:#D0E3F8; }',
			// '#selectors, #selectors * { font-size:14px; }',
		'#selectors label { font-weight:bold; }',
		'#selectors, #legend { width:100%; }',
		'#selectors option.disabled { color:#BBB; }',
		'body.sidebar { background-color:white; }',
		'body.tv #legend { margin-top:8px; }',
		'body.sidebar #selectors, body.sidebar #legend { width:', sidebarWidth, 'px; }',
		'#sidebar table.candidates { width:100%; }',
	         '#sidebar td.right { width: 30%; }',
		'table.candidates td { border-top:1px solid #E7E7E7; }',
		'table.candidates tr.zero { display:none; }',
		'#maptip table.candidates { width:100%; }',
		'#maptip table.candidates tr.first td { border-top:none; }',
		'#maptip div.candidate-delegates { font-size:120%; }',
		'#maptip div.candidate-percent { font-weight:bold; }',
		'#maptip div.candidate-votes { font-size:80%; }',
		'#maptip div.click-for-local { padding:4px; }',
		'body.tv #maptip div.candidate-percent { font-size:20px; font-weight:bold; }',
		'#sidebar-scroll { padding:0 4px; }',
	        '#sidebar #legend-candidate-top div.legend-candidate { color: #777; font-size: 11px; }',
		'tr.legend-candidate td, tr.legend-filler td { border:1px solid white; }',
		'div.legend-candidate, div.legend-filler { font-size:13px; padding:6px 4px; }',
			//'body.tv div.legend-candidate, body.tv div.legend-filler { font-size:22px; }',
		'body.web div.legend-candidate { color:#333; }',
		'body.tv div.legend-candidate, body.tv div.legend-filler { font-size:21px; font-weight:bold; }',
		'td.legend-filler { border-color:transparent; }',
		//'tr.legend-candidate td { width:20%; }',	
		'tr.legend-candidate td { cursor:pointer; }',
		'tr.legend-candidate.hover td, tr.legend-candidate:hover td { background-color:#F6F6F6; border: 1px solid #F6F6F6; border-top:1px solid #D9D9D9; border-bottom: 1px solid #D9D9D9; -webkit-transition: all 0.218s; -moz-transition: all 0.218s; transition: all 0.218s; }',
		'tr.legend-candidate.hover td.left, tr.legend-candidate:hover td.left { border-left: 1px solid #D9D9D9; -webkit-transition: all 0.218s; -moz-transition: all 0.218s; transition: all 0.218s; }',
		'tr.legend-candidate.hover td.right, tr.legend-candidate:hover td.right { border-right: 1px solid #D9D9D9; -webkit-transition: all 0.218s; -moz-transition: all 0.218s; transition: all 0.218s; }',
		'tr.legend-candidate.selected td { background-color: #EEE; border: 1px solid #EEE; border-top: 1px solid #CCC; border-bottom: 1px solid #CCC; -webkit-transition: all 0.218s; -moz-transition: all 0.218s; transition: all 0.218s; }',
		'tr.legend-candidate.selected td.left { border-left: 1px solid #CCC; }',
		'tr.legend-candidate.selected td.right { border-right: 1px solid #CCC; }',
	        'div.legend-candidate-bar { margin-top: -1px; }',
	        'div.legend-candidate-bar-outline { border: 1px solid #D4D4D4; background-color: #fff; }',
	        'div.legend-candidate-bar-fill { height: 7px; }',
	        'div.legend-candidate-primary { font-size: 15px; color: #777; }',
	        'tr.legend-candidate.selected div.legend-candidate-primary { color: #444; }',
	        'div.legend-candidate-secondary { font-size: 11px; color: #777; }',
	        'tr.legend-candidate.selected div.legend-candidate-secondary { color: #444; }',
	        'div.legend-candidate-primary + div.legend-candidate-secondary { margin-top: -2px; }',
	        'div.legend-candidate-secondary + div.legend-candidate-primary { margin-top: -2px; }',
	        '#sidebar td.right div.legend-candidate-primary { margin-top: -1px; padding-bottom: 2px; }',
	        '#sidebar td.winner div { padding: 0 };',
		'span.legend-candidate-color { font-size:15px; }',
		'#sidebar span.legend-candidate-color { font-size:16px; }',
		'body.tv span.legend-candidate-color { font-size:18px; }',
		'#centerlabel, #centerlabel * { font-size:12px; xfont-weight:bold; }',
		'#spinner { z-index:999999; position:absolute; left:', Math.floor( ww/2 - 64 ), 'px; top:', Math.floor( wh/2 - 20 ), 'px; }',
		'#error { z-index:999999; position:absolute; left:4px; bottom:4px; border:1px solid #888; background-color:#FFCCCC; font-weight:bold; padding:6px; }',
		'a.logo { position:absolute; bottom:24px; width:48px; height:48px;}',
		'#gop-logo { right:64px; width:48px; background: url(', imgUrl('gop-nv-48.png'), ') no-repeat; }',
		'body.source-ap #gop-logo { display:none; }',
		'#ap-logo { right:64px; width:41px; background: url(', imgUrl('ap-logo-48x41.png'), ') no-repeat; }',
		'body.source-gop #ap-logo { display:none; }',
		//'#google-logo { right:4px; background: url(', imgUrl('google-politics-48.png'), ') no-repeat; }',
		'#gop-logo { right:64px; width:48px; background: url(', imgUrl('gop-nv-48.png'), ') no-repeat; }',
		'body.hidelogo #gop-logo, body.hidelogo #ap-logo { right:4px; }',
		'body.hidelogo #google-logo { display:none; }',
		'body.ie7 #gop-logo, body.ie7 #ap-logo { right:4px; }',
		'body.ie7 #google-logo, body.ie7 #linkToMap { display:none; }',
		'#testlabel { position:absolute; left: ', sidebarWidth + 32, 'px; top: 2px; font-size: 24px; font-weight:bold; color:red; text-shadow: 0 0 4px white, 0 0 8px white, 0 0 12px white, 0 0 12px white; }',
		 // custom layouts
		//'#subregion_list { width:100%; overflow:auto; overflow-x:hidden; }',
		//'.candidate-area-patch { border-radius:30px;-webkit-border-radius:30px;-moz-border-radius:30px; }',
		'tr.candidate-row:hover { background-color: #eeeeee; }',
		'#subregion_div { max-width:815px; font-family:Helvetica; font-size:14px; display: none;',
		'position:absolute; background:#fff; z-index:1001;}',
		'#subregion_title { padding: 10px; padding-left:15px; }',
		'#subregion_title a { text-decoration:none; color:#111;}',
		'#subregion_title a:hover { text-decoration:underline; }',
		'#subregion ul { list-style:none; float:left; padding:0px 15px; margin-top:5px;',
			'border-right: solid #eeeeee thin; width:240px;}',
		'#subregion li { list-style: none; word-wrap:break-word; padding:5px 5px; color:#bbb; }',
		'#subregion li.active-region { color: #08C; }',
		'#subregion li:hover { background-color:#eee; cursor: pointer;}',
		'#subregion li.selected-region:hover,',
		'#subregion li.selected-region { background-color:#08C; font-weight:bold; cursor: auto;}',
		'#subregion li.selected-region.active-region {color:#fff;}',
		'#lightbox { display: none; position:absolute; left:0; top:0; z-index: 1000;',
		'min-width:100%; min-height: 100%; background-color: #000;opacity: 0.8;filter:alpha(opacity=90);}',
		'#zoom-btn {position:absolute;left:', sidebarWidth + 50, 'px;top:5px;font-size:16px;z-index:10;background:#efefef;',
	    'font-family: Arial, Helvetica, sans-serif;padding: 3px 5px 2px 5px;border: 1px solid #aaa;color:#000;}',
	    '#zoom-btn.disable {color:#aaa;}',
	'</style>'
);

document.write(
	'<div id="outer">',
	'</div>',
	'<div id="maptip">',
	'</div>',
	'<a id="google-logo" class="logo" target="_blank" href="http://www.google.com.gh/elections/ed/zw" title="', T('googlePoliticsTitle'), '">',
	'</a>',
	'<div id="error" style="display:none;">',
	'</div>',
	'<div id="testlabel" style="display:none;">',
		T('testData'),
	'</div>',
	'<div id="spinner">',
		'<img border="0" style="width:128px; height:128px;" src="', imgUrl('spinner-124.gif'), '" />',
	'</div>'
);

// NB: DO NOT REMOVE THIS.
var presidentialResult = {"Matebeleland North":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}],"Midlands":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}],"Mashonaland West":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}],"Mashonaland Central":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}],"Bulawayo":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}],"Matebeleland South":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}],"MASVINGO":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}],"Mashonaland East":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}],"Manicaland":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}],"Harare":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":0}]}; 
var presidentialConstituency = {"Gwanda North":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Bulilima West":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Insiza North":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Hwange West":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Nkayi North":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Beitbridge West":[{"ZDP":0,"MDC":500,"ZAPU":0,"Zanu-PF":30,"MDC-T":70},{"REPORTED":0,"TOTAL":10}],"Bulilima East":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Nkayi South":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Lupane East":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Hwange East":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Umguza":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Beitbridge East":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Binga North":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Gwanda Central":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Bubi":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Umzingwane":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Matobo North":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Tsholotsho North":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Gwanda South":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Lupane West":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Hwange Central":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Tsholotsho South":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Mangwe":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Binga South":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Insiza South":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}],"Matobo South":[{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}]}; 
var paliamentaryResult = {"Matebeleland North":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Midlands":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Mashonaland West":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Mashonaland Central":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Bulawayo":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Matebeleland South":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"MASVINGO":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Mashonaland East":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Manicaland":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Harare":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0}};
var parliamentaryConstituency = {"Matebeleland North":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Midlands":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Mashonaland West":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Mashonaland Central":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Bulawayo":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Matebeleland South":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"MASVINGO":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Mashonaland East":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Manicaland":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},"Harare":{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0}};
//{"BIMBILLA":{"NDC":[0,"ALHAJI MOHAMMED IBN ABASS"],"NPP":[0,"NTIWILL BINGAB ADONA DOMINIC"],"PPP":[0,"IDDISAH ZAHARATU"],"CPP":[0,"ALHASSAN SOMED DASANA"],"DPP":[0,"RASHID ABDUL"],"NDP":[0,"ABDUL HAFIZ IMORO"],"INDP":[0,"MOHAMMED SADICK"]},"BOLE/BAMBOI":{"NDC":[0,"JOSEPH AKATI SAAKA"],"NPP":[0,"SULEMANA ADAMS ACHANSO"],"PPP":[0,"JAJA EMMANUEL DAPAA"],"NDP":[0,"LIGBOULI GEORGE ROY"],"UFP":[0,"MANYIMA IDDRISU"]},"BUNKPURUGU":{"NDC":[0,"DUUT BONCHEL ABDULAI"],"NPP":[0,"SOLOMON NAMLIIT BOAR"],"IPP":[0,"DUUT BANAM TATUKA"],"INDP":[0,"LABIK JOSEPH YAANI"]},"CHEREPONI":{"NDC":[0,"SAMUEL ABDULAI"],"NPP":[0,"AZUMAH NAMORO SANDA"],"PPP":[0,"MOHAMMED HAMZA"],"CPP":[0,"REBECCA NAMANA JABARI"],"NDP":[0,"ALHASSAN ALIWU"]},"DABOYA / MANKARIGU":{"NDC":[0,"BAANI ABUDU NELSON"],"NPP":[0,"TIKA SAMUEL YEYU"],"PPP":[0,"MOHAMMED SULEMANA"],"PNC":[0,"HAMZA A MUGIS"],"CPP":[0,"ALIDU MAHAMA"],"NDP":[0,"ALHASSAN SAMMED SUALISU"]},"DAMONGO":{"NDC":[9718,"ADAM MUTAWAKILU"],"NPP":[7041,"ALBERT KASSIM DIWURA"],"CPP":[60,"FORGOR ABUBAKAR"],"PNC":[61,"LIMAANE SEIDU IBRAHIM"],"NDP":[80,"ABDUL AZIZ SHIRAZ"]},"GUSHEGU":{"NDC":[0,"THOMAS KWESI NASAH"],"NPP":[0,"RITA TANI IDDI"],"PPP":[0,"MAHAMA BABA"],"UFP":[0,"MANYIMAN BABA"]},"KARAGA":{"NDC":[0,"ALHASSAN SUALIHU DANDAAWA"],"NPP":[0,"BABA WAHAB"],"PPP":[0,"FUSHEINI ZIBLIM YAKUBU (AGYEKUM)"],"PNC":[0,"ADAM YUSSIF"],"INDP":[0,"ABDULAI MAHAMADU SANDOW"]},"KPANDAI":{"NDC":[0,"LIKPALIMOR KWAJO TAWIAH"],"NPP":[0,"MATTHEW NYINDAM"],"PPP":[0,"MBOKO NKRAJIMAMO YAW"],"CPP":[0,"BUMARCK BRAIMAH FRIKO"],"NDP":[0,"ANIWABA KWAKU BEDIAKO JEREMIAH"],"INDP":[0,"ALFRED DONKOR ODZIDZATOR"]},"KUMBUNGU":{"NDC":[0,"MOHAMMED MUMUNI"],"NPP":[0,"ABDULAI MOHAMMED SAANI"],"PPP":[0,"ALHASSAN ABUBAKAR"],"CPP":[0,"AMADU MOSES YAHAYA"],"NDP":[0,"IMORO ISSAHAKU"]},"MION":{"NDC":[0,"HON DR ALHASSAN AHMED YAKUBU"],"NPP":[0,"ALHASSAN SHAIBU"],"INDP":[0,"ALHAJI ALABIRA IBRAHIM"],"CPP":[0,"MAKAMBA DANIEL TAMANJA"],"NDP":[0,"IDDRISU RASHAD KPABIYI"],"INDP":[0,"JABAB DANIEL ULENBI"]},"NALERIGU/ GAMBAGA":{"NDC":[0,"HON. DR. TIA SUGRI ALFRED"],"NPP":[0,"PETER WUNI"],"PPP":[0,"HAMIDU NAPOLEON DAWUNI"],"CPP":[0,"ABDULAI ISSIFU JOSEPH"]},"NANTON":{"NDC":[0,"IBRAHAM MURITALA MUHAMMED"],"NPP":[0,"ALHAJI ABDU- KAREEM IDDRISU"],"PPP":[0,"IDDI ALHASSAN SHITOBU"]},"SABOBA":{"NDC":[0,"BUKARI NIKPE JOSEPH"],"NPP":[0,"BINIPOM CHARLES BINTIN"],"PPP":[0,"GABULJA JOHN KINYORBAAN"]},"SAGNARIGU":{"NDC":[0,"ALHASSAN BASHIR FUSENI"],"NPP":[0,"YAJUBU ABDUL-KAREEM"],"PPP":[0,"ABDUL JAMALDEEN"],"CPP":[0,"ALHASSAN A SUHUYINI"]},"SALAGA NORTH":{"NDC":[0,"ALHASSAN MUMUNI"],"NPP":[0,"MOHAMMED KAMARUNDEEN"],"INDP":[0,"ABDUL- FATAW ABDUL- WAHAB"]},"SAVELUGU":{"NDC":[0,"MARY SALIFU"],"NPP":[0,"MUHAMMED ABDUL-SAMED"],"PPP":[0,"MUNIRU HARDI"],"PNC":[0,"MAHAMA IDDRISU"],"CPP":[0,"MUSAH OSMAN"]},"SALAGA SOUTH":{"NDC":[0,"HON. ALHAJI IBRAHIM DEY ABUBAKARI"],"NPP":[0,"ABU-BAKAR SADDIQUE BONIFACE"],"PPP":[0,"JANDA YAHUZU MAHAMA"],"PNC":[0,"MUNTARI ABDUL JALILU"],"NDP":[0,"LAMINU ZAKARI"]},"SAWLA TUNA KALBA":{"NDC":[0,"DONALD DARI SODITEY"],"NPP":[0,"JOSEPH NONGIRI NAAH VUGU"],"PPP":[0,"SEIDU KIPO BENJAMIN"],"PNC":[0,"YAAPO KWABENA EDWARD"],"NDP":[0,"JOSEPH TRUMAH BAYEL"]},"TAMALE CENTRAL":{"NDC":[0,"INUSAH FUSENI"],"NPP":[0,"IDDRISI MUSAH"],"PPP":[0,"ADAM MARIAMA"],"PNC":[0,"SALIFU IDDRISU"],"CPP":[0,"HARUNA IDDRISU"],"NDP":[0,"ABDUL RASHAS MAMDUHU"],"DPP":[0,"AMIDU ARAMATA"],"INDP":[0,"MAHATA SETH SAYIBU"],"INDP":[0,"ABDUL-AMINU IBRAHIM"]},"TAMALE NORTH":{"NDC":[0,"ABUBAJARI SUMANI"],"NPP":[0,"ALIKU SAYIBU"],"PPP":[0,"IDDRISU MASHD"],"PNC":[0,"SEIDU ABDULAI NAPODOO"],"CPP":[0,"FAIZ AOUNI MOUTRAGE"],"INDP1":[0,"ADAM GAMEL NASSER"],"INDP2":[0,"ISSAH AHMED"],"INDP3":[0,"ALHASSAN DAHAMANI"]},"TAMALE SOUTH":{"NDC":[0,"IDDRISU HARUNA"],"NPP":[0,"ABDALLAH PEGU SHAMSUDEEN"],"PPP":[0,"MOHAMMED ABDUL-KARIM"],"PNC":[0,"ALIDU MOHAMMED NASIR-DEEN"],"CPP":[0,"ABDUL RAHMAN"],"NDP":[0,"SEIDU UMAR FAROUK"],"DPP":[0,"IBRAHIM MARIAM"]},"TATALE / SANGULI":{"NDC":[0,"JAGRI MOHAMMED"],"NPP":[0,"JAMES C YANWUBE"],"CPP":[0,"TISERE JOHN"],"INDP":[0,"THOMAS BREMPONG LAREN"]},"TOLON":{"NPP":[18113,"WAHAB SUHIYNI WUMBEI"],"PPP":[398,"ZIBLILA BABA ISSFU"],"CPP":[361,"ALAHASSAN ADAM DAMBA"],"NDP":[568,"MAHAMADU IBRAHIM"],"INDP":[2478,"KASS ABDUL-LATIF TUAHIR"],"NDC":[1569,"ABDUL -RAZAQ A UMAR"]},"WALWALE":{"NDC":[0,"AZORTIBAH JAMES"],"NPP":[0,"SAGRE BAMBANGI"],"PPP":[0,"BAGMARIGU SIMON"],"PNC":[0,"ABDALLAHH ABUBAKAR"],"NDP":[0,"SOALISU AHAIBU"]},"WULENSI":{"NDC":[0,"LALIRI GEORGE MABAN"],"NPP":[0,"THOMAS DONKOR OGAJAH"],"PPP":[0,"ISSAH DAMBA"],"CPP":[0,"HARUNA MUSAH"],"INDP1":[0,"MOHAMMED ADAM"],"INDP2":[0,"NLENKIBA ABRAHAM NJONAAN"]},"YAGABA/KUBORI":{"NDC":[0,"IBRAHIM ABDUL RAUF TANKO"],"NPP":[0,"USSIF MUSTAPHA"]},"YAPEI- KUSAWGU":{"NDC":[0,"AMADU SEIDU"],"NPP":[0,"ZAKARIAH YAKUBU"],"PPP":[0,"ABUKARI ADAM MUSAH"],"NDP":[0,"IDDRISU IBRAHIM"]},"YENDI":{"NDC":[0,"IDDRISU SULEMANA IBUN"],"NPP":[0,"MOHAMMED HABIBU TIJANI"],"PPP":[0,"M A YUSSIF NAMBILI"],"NDP":[0,"ABUBAKARI SADIK MAJEED"],"INDP":[0,"ABUKARI MOHAMMED MAHAMOUD"],"INDP":[0,"ABDUL- RAHMAN M MAWONG GBANDE"],"INDP":[0,"SHANI MOHAMMED KAMIL"]},"YUNYOO":{"NDC":[9591,"NAABU JOSEPH BIPOBA"],"NPP":[4318,"ALHASSAN JOHN"],"PPP":[777,"WALIBE AMOS"]},"ZABZUGU":{"NDC":[0,"ALHGASSAN UMAR"],"NPP":[0,"JABAAH JOHN BENNAM"],"PPP":[0,"ADAM AZIMA"],"INDP":[0,"ABDULAI DRAMANI"]}};
var wardResult = {"20":{"Prince and Princess Pre-School":{},"Mgoqo Primary School B":{},"Nkulumane Library ":{},"Mgoqo Primary School A":{},"Nkulumane 2 Secondary School ":{},"Zesa Office ":{},"Nkulumane 12 Terminus ":{},"Nkulumane Engen Garage":{},"Nkulumane 15 Emasimini":{}},"23":{"Mgombane Primary School A":{},"Queen Elizabeth Primary School A":{},"Nkulumane 12 Entabeni ":{},"Mgombane Primary School B":{},"Queen Elizabeth Primary School B":{},"Nkulumane 10 Bus Terminus ":{},"Nkulumane 10 Water Reservour ":{}},"22":{"Mafela Primary School A":{},"The Salvation Army":{},"Amaveni Primary School B":{},"Amaveni Primary School A":{},"Mtshane Primary School B":{},"Mafela Primary School B":{},"Mtshane Primary School A":{},"Mandwandwe Secondary School A":{},"Nkulumane Hall A":{},"Mandwandwe Secondary School B":{},"Nkulumane Hall B":{},"Sigombe Primary School B":{},"One -Way ":{},"Bretheren in Christ ":{},"Sigombe Primary School A":{}}};


//////////////////////////////////////////////////
var resultCache = {};
var baseUrl = 'http://election-zw.appspot.com';
var currentFeature, prevFeature, candidates, stats;
var useSidebar;
var scope = "overview";

function getTestData(scope) {
	if (params.contest == "president") {
		if ( scope == "overview" ) {
			return presidentialResult;
		} else if (scope == "constituency") {
			var constituencies = g.provinceData[g.current_province].constituencies;
			var result = {};
			for (var i=0; i < constituencies.length; i++) {
				result[constituencies[i]] = [{"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10}];
			}
			return result;
		} else if (scope == "ward") {
			return wardResult;
		}
	} else {
		if (scope == "overview") {
			return paliamentaryResult;
		} else if ( scope == "constituency" ){
			var constituencies = g.provinceData[g.current_province].constituencies;
			var result = {};
			for (var i=0; i < constituencies.length; i++) {
				result[constituencies[i]] = {"ZAPU":0,"ZANU-PF":0,"ZDP":0,"MDC":0,"MDC-T":0},{"REPORTED":0,"TOTAL":10};
			}
			return result;
		} else if ( scope == "ward" ) {
			return wardResult;
		}
	}
}

function getResultJSON( url, onSuccess, onError ) {
	var timeout = 15 * 1000;
	$('#spinner').show();
	$.ajax({
		url: url,
		dataType: 'json',
		timeout: timeout,
		success: function (data) {
			onSuccess(data);
			$('#spinner').hide();
		},
		error: function( jqXHR, status ) {
			if( status == 'timeout' ) {
				getResultJSON( url , onSuccess, onError);
			}
			else if (opt.debug) {
				onError();
				$('#spinner').hide();
			} else {
				setTimeout( function() {
					getResultJSON( url, onSuccess, onError );
				}, timeout );
			}
		}
	});
}

function getName(feature) {
	if (_.isEmpty(feature)) return null;
	if (_.has(feature.geojsonProperties, "PROVINCE_N")) {
		return feature.geojsonProperties.PROVINCE_N;
	} else if (_.has(feature.geojsonProperties, "constit")) {
		// use the name defined in the array for the current province
		var constituencies = g.provinceData[g.current_province].constituencies;
		for (var i = 0; i < constituencies.length; i++) {
			if (constituencies[i].toUpperCase() == feature.geojsonProperties.constit) {
				return constituencies[i];
			}
		}
		return feature.geojsonProperties.constit;
	}
	return null;
}

function getType(feature) {
	if (_.isEmpty(feature)) return null;
	if (_.has(feature.geojsonProperties, "PROVINCE_N")) {
		return "provincial";
	} else if (_.has(feature.geojsonProperties, "constit")) {
		return "constituency";
	}
	return null;
}

function loadResult( scope, callback ) {

	var testResult;
	var query;

	callback = callback || region || scope;	
	if ( typeof callback !== "function" ) return;
	
	if ( scope == "overview" ) {
		query = "/province?";
	} else if ( scope == "constituency" ) {
		 query = "/constituency?";
	} else if (scope == "ward") {
		query = "/ward?"
	}
		
	if ( params.contest == "president" ) {
		query = S(query, "result=presidential");
		if (scope == "constituency") {
			query = S(query, "&province=", encodeURIComponent(g.current_province));
		} else if (scope == "ward") {
			query = S(query, "&constituency_name=", encodeURIComponent(g.current_constituency));
		}
	} else {
		query = S(query, "result=house");
		if (scope == "constituency") {
			query = S(query, "&province=", encodeURIComponent(g.current_province));
		} else if (scope == "ward") {
			query = S(query, "&constituency_name=", encodeURIComponent(g.current_constituency));
		}
	}

	if ( resultCache[query] ) {
		callback(resultCache[query]);
		return;
	}
	
	if (opt.debug) {		
		resultCache[query] = testResult = getTestData(scope);
		callback(testResult);
		return;
	}
	
	wait();

	getResultJSON( 
		baseUrl + query, // url
		function( data ) { // success
			resume();
			resultCache[query] = data;
			callback(data);	
		},
		function( jqXHR, status ) { // error
			resume();
			console.error("Could not load data from server");
			// show error message
			if (opt.debug) {			
				resultCache[query] = testResult;
				callback(testResult);
				return;
			}
		}
	);
}

function analytics( category, action, label, value, noninteraction ) {
	//analytics.seen = analytics.seen || {};
	//if( analytics.seen[path] ) return;
	//analytics.seen[path] = true;
	_gaq.push([ '_trackEvent',
		category, action, label, value, noninteraction
	]);
}

function contentTable() {
	function button( contest, index, contests ) {
		return S(
			'<a class="segmented button', 
                                index == 0 ? ' left' : '',
                                index == contests.length - 1 ? ' right' : '',
				params.contest == contest ? ' selected' : '',
				'" id="btn-', contest,
				'" title="', T( 'clickFor-' + contest ),
			'">',
				T( contest + 'Button' ),
			'</a>'
		);
	}
	return S(
		'<div>',
			'<div id="selectors">',
				'<div style="margin:0; padding:4px;">',
					_.map( [ 'president', 'house' ], button ).join(''),
				'</div>',
			'</div>',
			'<div id="legend">',
			'<div id="sidebar" style="border-right:solid #dddddd 1px">',
			'<div class="sidebar-header">',
				'<div id="election-title" class="title-text">',
					T('title'),
				'</div>',
				'<div id="auto-update" class="subtitle-text">',	
					T('subtitle'),
				'</div>',
				'<div id="sidebar-results-header" class="scroller">',
				'<div id="auto-update" class="subtitle-text">This page updates automatically</div>',
				'<div id="candidate-total"></div>',
				'<br><div id="disclaimer" class="subtitle-text">', T('disclaimer'), '</div>',
				'</div>',
			'</div>',
			'<div id="sidebar-scroll">', //-- class="scroller"				
				'<div id="map-link" class="small-text" style="padding:8px 4px 4px 4px;">',					
				'</div>',
			'</div>',
		'</div>',
			
			'</div>',
			'<div style="width:100%;">',
			'<a id="zoom-btn" class="button disable">Overview</a>',
				'<div id="map" style="width:100%; height:100%;">',
				'</div>',
			'</div>',
		'</div>'
	);
}

$('#outer').html( contentTable() );

function formatLegendTable( cells ) {
	function filler() {
		return S(
			'<td class="legend-filler">',
				'<div class="legend-filler">',
					'&nbsp;',
				'</div>',
			'</td>'
		);
	}
	function row( cells ) {
		return S(
			'<tr>',
				cells.length ? cells.join('') : filler(),
			'</tr>'
		);
	}
	return S(
		'<table cellpadding="0" cellspacing="0" style="width:100%; vertical-align:middle;">',
			row( cells.slice( 0, 5 ) ),
			row( cells.slice( 5 ) ),
		'</table>'
	);
}

function renderConstituencyWards( result ) {

//	var names = [];
//	var state = {};
//	for (var k in result) {
//		var temp = 0;
//		for (var q in result[k]) {
//			if (params.contest === 'president') {
//				temp += result[k][q];
//			} else {				
//				temp += result[k][q][0];
//			}			
//		}
//		state[k] = temp > 0? 'active-region' : '';
//		names.push(k);
//	}	
//	names.sort(function(a, b){
//	    /* 
//	       We avoid reuse of arguments variables in a sort
//	       comparison function because of a bug in IE <= 8.
//	       See http://www.zachleat.com/web/array-sort/
//	    */
//	    var va = (a === null) ? "" : "" + a;
//	    var vb = (b === null) ? "" : "" + b;
//	    return va > vb ? 1 : ( va === vb ? 0 : -1 );
//	});
	var region = getName(currentFeature);

	var contentString = S(
		'<div id="lightbox" class="close-box"></div>',
		'<div id="subregion_div" style="outline:thin black solid">',
			'<div id="subregion_title">',
				'<div style="float:left; padding: 0px 20px;display: none;">',
					'<a id="ward-list" href="#">Back</a>',
				'</div>',
				'<div id="subregion_label" style="display:inline-block;font-weight:bold;border-bottom:solid thin #ccc;">',
					'Polling Station Results for ', region, '<span class="current-ward"></span>',
				'</div>',
				'<div style="float:right; padding: 0px 20px;">',
					'<a class="close-box" href="#">Click to Close</a>',
				'</div>',
			'</div>',
			'<div id="subregion">',
			'<div style="clear:both;padding-left:15px;font-weight:bold;" class="active-region">Wards</div>',
			'<div id="subregion_list">'
	);
	
	contentString = S(contentString, "<ul class='ward-list'>");	
	for (var k in result) {
		var tt = _.isEmpty(result[k])? "ward" : "ward active-region";
		contentString = S(contentString, '<li class="', tt,'" data-num="', k, '">Ward ', k, "</li>");
	}

	contentString = S(contentString, '</ul></div></div>');
	$body.append( contentString );
	initWardEvents( region, result );
}

function initWardEvents( region, result ) {	
	$('#subregion_list ul:last').css('border','none');
	$(".ward-list li").on('click', function (e) {
		var $ward  = $(this);	
		if (!$ward.hasClass("active-region")) {
			alert("No polling station results for Ward " + $ward.data("num") + " yet.");
			return;
		}		
		$(".ward-list").hide();
		$("#subregion").children().first().html("Go to Wards");
		renderPollingStations( $ward.data("num") );
	});
	
	function renderPollingStations( wardNumber ) {
		var wardResult = result[wardNumber];
		var names = [];
		var state = {};
		for (var k in wardResult) {
			var temp = 0;
			for (var q in wardResult[k]) {
				if (params.contest === 'president') {
					temp += wardResult[k][q];
				} else {				
					temp += wardResult[k][q][0];
				}
			}
			state[k] = temp > 0? 'active-region' : '';
			names.push(k);
		}
		names.sort(function(a, b) {
		    /* 
		       We avoid reuse of arguments variables in a sort
		       comparison function because of a bug in IE <= 8.
		       See http://www.zachleat.com/web/array-sort/
		    */
		    var va = (a === null) ? "" : "" + a;
		    var vb = (b === null) ? "" : "" + b;
		    return va > vb ? 1 : ( va === vb ? 0 : -1 );
		});
		
		var contentString = "<div class='polling-list'>";

		// generate list of constituencies
		for (var i=0; i < names.length; i++) {
			if ((i % 12) === 0) {
				if (i !== 0) {
					contentString = S(contentString, '</ul>');
				}
				contentString = S(contentString,'<ul class="sublist">');
			}
			contentString = S(contentString, '<li class="',state[names[i]],'">',names[i],'</li>');
		}
		contentString = S(contentString,  "</div>");
		
		$("#subregion_list").append(contentString);
		$('#subregion_list ul:last').css('border','none');
		
		// render results
		$(".polling-list li").on('click', function (e) {
			
			var $sidebar = $('<ul></ul>');
			var $currentItem = $(this);
			
			$(".polling-list li").each(function (index, value) {
				$sidebar.append(value);
				$(value).off('click').on('click', function (e) {
					var $value = $(this);
					$(".polling-list li").removeClass('selected-region');
					$value.addClass('selected-region');	
					
					var $result_div = $('#polling-station-result').empty().hide();				
					var content;
					if (params.contest === 'president') {
						var candidates = getTopCandidates(convertToCandidates(wardResult[$value.text()]), 'votes', 24);					
						content = createInfoContent($value.text(), candidates, null);
					} else {
						content = createParliamentaryConstituencyInfo( $value.text(), wardResult[$value.text()] );			
					}	
					$result_div.html(content);
					$result_div.find('td').css({'border':'none'});
					$result_div.find('.click-for-local').empty();
					$result_div.find('.tiptitletext').text($value.text()).parent().css({
						'float':'none', 'text-align':'center', 'padding-bottom':'10px'					
					});
					$result_div.find('.tiptitlebar').css('border-bottom','none');
					$result_div.find('table').css('width','100%');				
					$result_div.css({
						'width': '450px',
						'margin-left': '20px',
						'margin-top': '10px',
						'font-size': '14px'
					});
					$result_div.show();
				});			
			});
	
			$('#subregion_div').css({'width':'815px'});
			$('ul.sublist').remove();
			$sidebar.css({'height': '400px','width':'250px', 'overflow': 'auto',
				'border':'thin outset #ccc', 'margin-left':'10px','float':'left','display':'inline-block'});		
			
			// replace subregion content
			$('.polling-list').html($sidebar)
				.append('<div id="polling-station-result" style="float:left"></div>')
				.append('<div style="clear:both"></div>');						
			
			var padding = 200; // total padding
			$sidebar.animate({scrollTop: $currentItem.offset().top-padding},'slow');
			$currentItem.trigger('click');		
			positionDiv();
		});
	}

	// setup light box
	$('.close-box').click( function(e) {
		e.preventDefault();
		$("#lightbox, #subregion_div").fadeOut(300, function () {	
			$("#subregion li").off();
			$('#lightbox, #subregion_div').off().remove();
		});
	});
	
	// set correct window labels
	if ( params.contest == 'president') {
		$('#subregion_title div').first().html('Presidential Results for ' + region.toUpperCase() + ' Constituency');
	} else {
		$('#subregion_title div').first().html('House Results for ' + region.toUpperCase() + ' Constituency');
	}

	// load and show
	function positionDiv() {
		var $subregion_div = $('#subregion_div');
		var top = ($(window).height() - $subregion_div.height()) / 3;
		var left = ($(window).width() - $subregion_div.width()) / 2;
		top = top + "px";
		left = left + "px";
		$subregion_div.css({'top':top, 'left':left});
	}
	positionDiv();
	$("#subregion_div, #lightbox").fadeIn(300);
}

function renderConstituencies(region, result) {	
	
	var names = [];
	var state = {};
	for (var k in result) {
		var temp = 0;
		for (var q in result[k]) {
			if (params.contest === 'president') {
				temp += result[k][q];
			} else {				
				temp += result[k][q][0];
			}			
		}
		state[k] = temp > 0? 'active-region' : '';
		names.push(k);
	}	
	names.sort(function(a, b){
	    /* 
	       We avoid reuse of arguments variables in a sort
	       comparison function because of a bug in IE <= 8.
	       See http://www.zachleat.com/web/array-sort/
	    */
	    var va = (a === null) ? "" : "" + a;
	    var vb = (b === null) ? "" : "" + b;
	    return va > vb ? 1 : ( va === vb ? 0 : -1 );
	});

	var contentString = S(
		'<div id="lightbox"></div>',
		'<div id="subregion_div" style="outline:thin black solid">',
			'<div id="subregion_title">',
				'<div id="subregion_label" style="display:inline-block;font-weight:bold;border-bottom:solid thin #ccc;">',
					'Wards for ', region,
				'</div>',
				'<div style="float:right; padding: 0px 20px;">',
					'<a href="#">Click to Close</a>',
				'</div>',
			'</div>',
			'<div id="subregion">',
			'<div style="clear:both;padding-left:15px;font-weight:bold;">Wards</div>',
			'<div id="subregion_list">'
	);

	// generate list of constituencies
	for (var i=0; i < names.length; i++) {
		if ((i % 12) === 0) {
			if (i !== 0) {
				contentString = S(contentString, '</ul>');
			}
			contentString = S(contentString,'<ul class="sublist">');
		}
		contentString = S(contentString, '<li class="',state[names[i]],'">',names[i],'</li>');
	}
	contentString = S(contentString, '</ul></div></div>');
	$body.append( contentString );
	initConstituencyEvents( result );
}

function initConstituencyEvents( region, result ) {	
	$('#subregion_list ul:last').css('border','none');
	$("#subregion_list li").bind('click', function (e) {
		var $currentItem  = $(this);				
		var $sidebar = $('<ul></ul>');
		var items = $("#subregion li");	

		$.each(items, function (key,value) {
			$sidebar.append(value);
			$(value).unbind('click').bind('click', function (e) {
				var $value = $(this);
				$("#subregion li").removeClass('selected-region');
				$value.addClass('selected-region');	
				
				var $result_div = $('#constituency_result_div').empty().hide();				
				var content;
				if (params.contest === 'president') {
					var candidates = getTopCandidates(convertToCandidates(result[$value.text()]), 'votes', 24);					
					content = createInfoContent($value.text(), candidates, null);
				} else {
					content = createParliamentaryConstituencyInfo( $value.text(), result[$value.text()] );			
				}	
				$result_div.html(content);
				$result_div.find('td').css({'border':'none'});
				$result_div.find('.click-for-local').empty();
				$result_div.find('.tiptitletext').text($value.text()).parent().css({
					'float':'none', 'text-align':'center', 'padding-bottom':'10px'					
				});
				$result_div.find('.tiptitlebar').css('border-bottom','none');
				$result_div.find('table').css('width','100%');				
				$result_div.css({
					'width': '450px',
					'margin-left': '20px',
					'margin-top': '10px',
					'font-size': '14px'
				});
				$result_div.show();
			});			
		});

		$('#subregion_div').css({'width':'815px'});
		$('ul.sublist').remove();
		$sidebar.css({'height': '400px','width':'250px', 'overflow': 'auto',
			'border':'thin outset #ccc', 'margin-left':'10px','float':'left','display':'inline-block'});		
		
		// replace subregion content
		$('#subregion_list').html($sidebar)
			.append('<div id="constituency_result_div" style="float:left"></div>')
			.append('<div style="clear:both"></div>');
		
		var padding = 200; // total padding
		$sidebar.animate({scrollTop: $currentItem.offset().top-padding},'slow');
		$currentItem.trigger('click');		
		positionDiv();
	});	

	// setup light box
	$('#lightbox, #subregion_title a').click( function(e) {
		e.preventDefault();
		$("#lightbox, #subregion_div").fadeOut(300, function () {	
			$("#subregion li").unbind();
			$('#lightbox, #subregion_div').unbind().remove();
		});
	});
	
	// set correct window labels
	if ( params.contest === 'president') {
		$('#subregion_title div').first().html('Presidential Results for ' + region.toUpperCase() + ' Constituency');
	} else {
		$('#subregion_title div').first().html('House Results for ' + region.toUpperCase() + ' Constituency');
	}

	// load and show
	function positionDiv() {
		var $subregion_div = $('#subregion_div');
		var top = ($(window).height() - $subregion_div.height()) / 3;
		var left = ($(window).width() - $subregion_div.width()) / 2;
		top = top + "px";
		left = left + "px";
		$subregion_div.css({'top':top, 'left':left});
	}
	positionDiv();
	$("#subregion_div, #lightbox").fadeIn(300);
}


function formatCandidatesConstituency() {
	// TODO: perform calculations and get results in correct format
	loadResult('ward', function (result) {
		// aggregate results for each constituency	
//		analytics( params.contest, g.current_constituency, 'region');
//		var region = getName(currentFeature);
		renderConstituencyWards(result);
//		renderConstituencies(region, result);
	});	
}


function createParliamentaryConstituencyInfo( region, results ) {
	var candidates = [];	
	for (var k in results) {
		candidates.push(new Candidate(k, results[k][1], results[k][0]));
	}
	candidates = getTopCandidates(candidates, 'votes', 24);
	
	var contentString = S(
		'<div class="tiptitlebar">',
		'<div style="text-align:center;padding-bottom:10px;">',
		'<span class="tiptitletext">'+region+'</span>',
		'</div><div style="clear:left;">',
		'</div><div class="tipreporting"></div>',
		'<table class="candidates" cellpadding="0" cellspacing="0">',
		'<tbody><tr><th style="text-align:left; padding-bottom:4px;width:60%;">Candidate</th>',
		'<th style="text-align:center; padding-bottom:4px;">Party</th>',
		'<th style="text-align:right; padding-bottom:4px;">Votes</th></tr>'
	);
	
	var fname,lname,shade = '#fff';	
	for(var c in candidates) {  
		fname = candidates[c].constituency.split(' ');
		lname = fname.pop();
		fname = join(fname, ' ');
		
		shade = (c % 2 === 0)? '#eee':'#fff';
		contentString = S(
			contentString,
			'<tr class="legend-candidate first" id="legend-candidate-', fname, '" ',
				'style="background-color:',shade, '">',
			'<td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;"><div class="first-name">',fname,'</div>',
			'<div class="last-name" style="font-weight:bold;">',lname,'</div></div></td>',
			'<td style="text-align:center;">',candidates[c].party,'</td>',
			'<td style="text-align:right; padding-left:6px;">',
			'<div class="candidate-votes">',formatNumber(candidates[c].votes),'</div></td></tr>'	
		);
	}
	contentString = S(contentString, '</tbody></table></div><div class="click-for-local faint-text"></div>');
	return contentString;
}

function getParties(resultsJson){
	var parties = {};
	
	for (var k in resultsJson) {
		if(params.contest === 'president'){
			region = resultsJson[k][0];
		} else {
			region = resultsJson[k];
		}
		for(var p in region){
			parties[p] = 0;
		}
	}
	return parties;
}

function formatCandidatesTotal(resultsJson) {
	
	var parties = getParties(resultsJson);
	var total = 0;
	var reported = 0;
	var region;
	
	// aggregate votes per party
	for (var k in resultsJson) {
		if(params.contest === 'president'){
			region = resultsJson[k][0];
			total += resultsJson[k][1]['TOTAL'];
			reported += resultsJson[k][1]['REPORTED'];
		}else{
			region = resultsJson[k];
		}
		for (var p in region) {
			parties[p] = parties[p] + region[p];
		}
	}
	
	cand = getTopCandidates(convertToCandidates(parties),'votes',0);	
	if(params.contest === 'president') {
		if (total) {
			total = S(formatPercent(reported/total),
					' reporting (', reported, ' / ', total , ')');					
		}
		var contentString = S(
			'<div class="tipreporting" style="padding-left:5px;">', total || '', '</div>',
			'<table class="candidates" cellpadding="8px" cellspacing="0">',
				'<tbody><tr><th style="text-align:left; padding-bottom:4px;">Candidate</th>',
				'<th style="text-align:right; padding-bottom:4px;"></th>',
				'<th style="text-align:center; padding-bottom:4px;">Votes</th></tr>'
		);
	
		for(var c in cand) {
			var candidateInfo = candidatesInfo[cand[c].party];	   
			contentString = S(
					contentString,
					'<tr class="left candidate-row">',
					'<td>',
						'<div style="float:left; padding-right:10px; margin-top:8px">', formatDivColorPatch(cand[c].color, 14, 14, 1), '</div>',
						'<div style="float:left" class="candidate-name" style="margin-top:4px; margin-bottom:4px;">',
							'<div class="first-name">',candidateInfo.firstName,'</div>',
							'<div class="last-name" style="font-weight:bold;">',candidateInfo.lastName,'</div>',
							'</div>',
							'</td>',
						'<td align="left"><b>',cand[c].party,'</b></td>',
					'<td align="center">',
						'<div class="candidate-percent">',formatPercent(cand[c].vsAll),'</div>',
						'<div class="candidate-votes">',formatNumber(cand[c].votes),'</div>',
					'</td>',
					'</tr>'				
			);	
		}		
	} else {
		var contentString = S(
				'<table class="candidates" cellpadding="8px" cellspacing="0">',
					'<tbody><tr><th style="text-align:left; padding-bottom:4px;">Party</th>',
					'<th style="text-align:right; padding-bottom:4px;"></th>',
					'<th style="text-align:center; padding-bottom:4px;">Seats</th></tr>'
			);
		
		for(var c in cand) {
			var candidateInfo = candidatesInfo[cand[c].party];	   
			contentString = S(
					contentString,
					'<tr class="left candidate-row">',
					'<td>',					
						'<div style="float:left; padding-right:10px; margin-top:0px">', formatDivColorPatch(cand[c].color, 14, 14, 1), '</div>',
						'<div style="float:left" class="candidate-name" style="margin-top:4px; margin-bottom:4px;">',
							'<div class="first-namep"><b>',cand[c].party,'</b></div>',
							//'<div class="last-name" style="font-weight:bold;">',candidateInfo.lastName,'</div>',
							'</div>',
							'</td>',
						'<td align="left"><b></b></td>',
					'<td align="center">',
						//'<div class="candidate-percent">',formatPercent(cand[c].vsAll),'</div>',
						'<div class="candidate-votes" style="font-weight:bold">',formatNumber(cand[c].votes),'</div>',
					'</td>',
					'</tr>'				
			);	
		}		
	}
	contentString = S(contentString, '</tbody></table>');
	return contentString;
}

function getScript( url ) {
	var timeout = 15 * 1000;
	$.ajax({
		url: url,
		dataType: 'script',
		cache: true,
		timeout: timeout,
		error: function( jqXHR, textStatus, errorThrown ) {
			if( textStatus == 'timeout' ) {
				getScript( url );
			}
			else {
				setTimeout( function() {
					getScript( url );
				}, timeout );
			}
		}
	});
}

function getGeoJSON( url ) {
	reloadTimer.clear();
	$('#spinner').show();
	getScript( cacheUrl( url ) );
}

function formatCandidateAreaPatch( candidate, max ) {
	var vsTop = candidate.vsTop;
	if(isNaN(vsTop)) vsTop = 0;
	var size = Math.round( Math.sqrt( vsTop ) * max );
	var margin1 = Math.floor( ( max - size ) / 2 );
	var margin2 = max - size - margin1;
	
	var color = candidate.color || '#FFFFFF';  // TEMP
	return S(
		'<div style="margin:', margin1, 'px ', margin2, 'px ', margin2, 'px ', margin1, 'px;"','>',
			formatDivColorPatch( color, size, size ),
		'</div>'
	);
}

function formatDivColorPatch( color, width, height, border ) {
	border = border || '1px solid #C2C2C2';
	return S(
		'<div class="candidate-area-patch" style="background:', color, '; width:', width, 'px; height:', height, 'px; border:', border, '">',
		'</div>'
	);
}

function formatPercent( n ) {
	if(isNaN(n)) n = 0;
	return percent1( n, T('decimalSep') );
}

function formatNumber( nStr ) {
	var dsep = T('decimalSep'), tsep = T('thousandsSep');
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? dsep + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while( rgx.test(x1) ) {
		x1 = x1.replace( rgx, '$1' + tsep + '$2' );
	}
	return x1 + x2;
}

function createInfoContent(region, candidates, stats){
	if ( params.contest === 'president' ){
		if (stats) {
			stats = S(formatPercent(stats["REPORTED"]/stats["TOTAL"]),
					' reporting (', stats["REPORTED"], ' / ', stats["TOTAL"] , ')');					
		}
		var contentString = S(
			'<div class="tiptitlebar">',
			'<div style="float:left;">',
			'<span class="tiptitletext">', region, '</span>',
			'</div><div style="clear:left;">',
			'</div><div class="tipreporting">', stats || '', '</div>',
			'<table class="candidates" cellpadding="0" cellspacing="0">',
			'<tbody><tr><th colspan="3" style="text-align:left; padding-bottom:4px;">Candidate</th>',
			'<th style="text-align:right; padding-bottom:4px;">Votes</th>',
			'<th style="text-align:right; padding-bottom:4px;"></th></tr>'
		);
		
		for(var c in candidates) {
			var candidateInfo = candidatesInfo[candidates[c].party];	    	
			contentString = S(
				contentString,
				'<tr class="legend-candidate first" id="legend-candidate-"', candidateInfo.fullName, '><td class="left"></td>',	    	
				'<td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;"><div class="first-name">',candidateInfo.firstName+'</div>',
				'<div class="last-name" style="font-weight:bold;">', candidateInfo.lastName, '</div></div></td>',
				'<td style="text-align:center;">', formatCandidateAreaPatch(candidates[c], 24),
				'</td><td style="text-align:right; padding-left:6px;"><div class="candidate-percent">',formatPercent(candidates[c].vsAll),'</div>',
				'<div class="candidate-votes">',formatNumber(candidates[c].votes),'</div></td><td class="right" style="text-align:right; padding-left:6px;">',
				'<div class="candidate-delegates"></div></td></tr>'	
			);
		}
	} else {
		var contentString = S(
				'<div class="tiptitlebar">',
				'<div style="float:left;">',
				'<span class="tiptitletext">', region, '</span>',
				'</div><div style="clear:left;">',
				'</div><div class="tipreporting"></div>',
				'<table class="candidates" cellpadding="0" cellspacing="0">',
				'<tbody><tr><th colspan="3" style="text-align:left; padding-bottom:4px;">Party</th>',
				'<th style="text-align:right; padding-bottom:4px;">Seats</th>',
				'<th style="text-align:right; padding-bottom:4px;"></th></tr>'
			);
			
			for(var c in candidates) {				    	
				contentString = S(
					contentString,
					'<tr class="legend-candidate first" id="legend-candidate-"', candidates[c].party, '><td class="left"></td>',	    	
					'<td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px; font-size:100%"><div class="first-name"><b>',candidates[c].party+'</b></div>',
					//'<div class="last-name" style="font-weight:bold;">', candidates[c].party, '</div></div></td>',
					'<td style="text-align:center;">', formatCandidateAreaPatch(candidates[c], 24),
					'</td><td style="text-align:right; padding-left:6px;">',
					'<div class="candidate-votes" style="font-weight:bold; font-size:100%;margin-right:10px">',formatNumber(candidates[c].votes),'</div></td><td class="right" style="text-align:right; padding-left:6px;">',
					'<div class="candidate-delegates"></div></td></tr>'	
				);
			}
	}
	contentString = S(contentString, '</tbody></table></div><div class="click-for-local faint-text">Click for detailed results</div>');	    
	return contentString;
}

function getRegionJSON(region){
	for(var k in results){
		if(k.toString().toLowerCase().indexOf(region.toLowerCase()) !== -1){
			return results[k];			
		}
	}
}

var tipOffset = { x:10, y:20 };
var $maptip = $('#maptip'), tipHtml;

function formatTip() {
	var scope = "overview";
	if (g.current_level == "constituency") {
		scope = "constituency";
	}
	var name = getName(currentFeature);
	loadResult(scope, function (result) {
		if (currentFeature != prevFeature) {
			if ( params.contest == 'president' ) {
				result = result[name][0];
				
			} else {
				result = result[name];
			}		
			candidates = getTopCandidates(convertToCandidates(result), 'votes', 24);
			stats = result;
		}
	});
	return createInfoContent(name, candidates, stats);
}

function moveTip( event ) {	
	
	if( ! showTip() ) return;
	
	var x = event.pageX, y = event.pageY;
	x += tipOffset.x;
	y += tipOffset.y;
	var pad = 2;
	var width = $maptip.width(), height = $maptip.height();
	var offsetLeft = width + tipOffset.x * 2;
	var offsetTop = height + tipOffset.y * 2;
	
	if( x + width > ww - pad ) {
		x -= width + pad + tipOffset.x * 2;
	}
	if( x < pad ) {
		x = pad;
	}
	
	if( y + height > wh - pad )
		y -= height + pad + tipOffset.y * 2;
	if( y < pad )
		y = wh - pad - height - tipOffset.y * 2;
	
	$maptip.css({ left:x, top:y });
}

function showTip() {
	
	if( currentFeature !== null) {
		candidates = null;
		tipHtml = formatTip();
		$maptip.html( tipHtml ).show();
		return true;
	}
	else {
		$maptip.hide();
		return false;
	}
}

var reloadTimer = {
	timer: null,
	
	clear: function() {
		clearInterval( this.timer );
		this.timer = null;
	},
	
	set: function( fn, time ) {
		this.clear();
		this.timer = setInterval( fn, time );
	},
	
	disable: function() {
		this.clear();
		opt.resultCacheTime = Infinity;
		opt.reloadTime = false;
	}
};

function loadView() {
	reloadTimer.clear();
	loadResult(scope, function (result) {
		clearFeatures(true);
		if (scope == "overview") {
			drawProvincial(result);
		} else {
			drawConstituency(result);
		}	
	});
}

function setSidebar() {
	//useSidebar = ( state != stateUS );
	useSidebar = true;
	$body.toggleClass( 'sidebar', useSidebar );
}

setSidebar();

function resizeViewOnly() {
	// TODO: refactor with duplicate code in geoReady()
	ww = $window.width();
	wh = $window.height();
	$body
		.css({ width: ww, height: wh })
		.toggleClass( 'hidelogo', mapWidth < 140 )
		.toggleClass( 'narrow', ww < 770 );
	
	$('#spinner').css({
		left: Math.floor( ww/2 - 64 ),
		top: Math.floor( wh/2 - 20 )
	});
	
	var mapLeft = 0, mapTop = 0, mapWidth = ww, mapHeight = wh;
	if( useSidebar ) {
		mapLeft = sidebarWidth;
		mapWidth -= mapLeft;
		var $sidebarScroll = $('#sidebar-scroll');
		$sidebarScroll.height( wh - $sidebarScroll.offset().top );
	} else {
		var topbarHeight = $('#topbar').height() + 1;
		mapTop = topbarHeight;
		mapHeight -= mapTop;
	}
	mapPixBounds = $('#map')
		.css({
			position: 'absolute',
			left: mapLeft,
			top: mapTop,
			width: mapWidth,
			height: mapHeight
		})
		.bounds();
	
	gme.trigger(map, 'resize');
	initMap();
}

function loadFeatures(json, style, result) {
	var feature_collection;
	style = style || g.default_style;
	
	if (_.isEmpty(json)) {
		feature_collection = g.featureArray;
		clearFeatures(true);
	} else {
		feature_collection = new GeoJSON(json, style);
	}

	if (!_.isArray(feature_collection)) {
		feature_collection = [ feature_collection ];
	}
	
	if (scope !== "overview") {
		loadResult('overview', function (result) {
			$("#candidate-total").html(formatCandidatesTotal( result ));
		})
	} else {
		$("#candidate-total").html(formatCandidatesTotal( result ));
	}	
	
	var feature, cand, color, region, jsonData;

	for ( var i = 0; i < feature_collection.length; i++) {
		
		feature = feature_collection[i];

		(function(feature, style, result) {	
			
			var prop = feature.geojsonProperties;
			style = feature.geojsonProperties["style"] || style;
			var fillColor = style.fillColor;
			var strokeColor = style.strokeColor;
			var name = getName(feature);
			var type = getType(feature);
			var region = name.replace(/\s+/g, "_").toUpperCase();
			
			if (type === g.current_level) {
				
				if (params.contest === 'president') {					
					jsonData = result[name][0];
				} else {
					jsonData = result[name];
				}				
				cand = getTopCandidates(convertToCandidates(jsonData), 'votes', 24);
				fillColor = (cand[0].votes && cand[0].votes > 0) ? cand[0].color : g.default_style.fillColor;
								
				// on click
				google.maps.event.addListener(feature, 'click', function(e) {
					if (type == "provincial") {
						// load constituency
						g.current_province = name;						
						geo = g.provinceData[name].geometry;
						zoomIn();
					} else if (type == "constituency") {
						g.current_constituency = name;
						formatCandidatesConstituency();
					}
				});
				
				// on mouseover
				google.maps.event.addListener(feature, 'mouseover', function(e) {
					this.set('fillColor', "#D3881F");
					this.set('strokeWeight', 2);
					prevFeature = currentFeature;
					currentFeature = this;
					moveTip(e);
				});

				// on mouseout
				google.maps.event.addListener(feature, 'mouseout', function(e) {
					this.set('fillColor', fillColor);
//					this.set('strokeColor', strokeColor);
					this.set('strokeWeight', 1);					
					currentFeature = null; 
				});
				
				$body.bind( 'mousemove', moveTip );		
				
				if (params.contest === 'president') {				
			 		if (!cand[0].vsAll) {
			 			// no results
			 			feature.set('fillColor', g.default_style.fillColor);
			 			feature.set('fillOpacity', g.default_style.fillOpacity);
			 		} else {		 		
				 		var op = result[name][1];
				 		var weight = op['REPORTED'] / op['TOTAL'];
				 		op = cand[0].vsAll * weight;
				 		op = (op < 0.03) ? 0.03 : op;
				 		feature.set('fillColor', fillColor);
				 		feature.set('fillOpacity', op);
			 		}
			 	} else {		
			 		if (!cand[0].vsAll) {
			 			feature.set('fillColor', g.default_style.fillColor);
			 			feature.set('fillOpacity', g.default_style.fillOpacity);
			 		} else {
			 			var seats = presidentialResult[name][1]['TOTAL'];
			 			var op = cand[0].votes / seats;
			 			op = (op < 0.03) ? 0.03 : op;
			 			feature.set('fillColor', fillColor);
				 		feature.set('fillOpacity', op);
			 		}	 		
			 	}
			}		
			
			feature.geojsonProperties["style"] = style;
//			feature.geojsonProperties['ID'] = region;
			feature.setMap(map);
			g.featureArray.push(feature);						

		})(feature, style, result);
	}
	
	resizeViewOnly();
	 reloadTimer.set( function () {
		 resultCache = {}; // clear cache
		 loadView();
	 }, opt.reloadTime );
}

function clearFeatures(clean) {		
	_.each(g.featureArray, function (feature) {
		google.maps.event.clearInstanceListeners(feature);
		feature.setMap(null);
	});
	
	if (clean === true) {
		g.featureArray = [];
		currentFeature = null;
	}	
	$body.unbind();
}

function zoomIn() {
	scope = "constituency";
	g.current_level = "constituency";
	
	$("#zoom-btn").off('click').on('click', function () {
		zoomOut();
		$(this).off('click');
	}).removeClass("disable");
	
	loadView();	
}

function zoomOut() {
	scope = "overview";
	geo = g.default_geometry;
	g.current_province = null;
	g.current_level = "provincial";
	$("#zoom-btn").removeClass("disable").addClass("disable");
	loadView();
}

function loadShape(fileName, onSuccess, onError) {
	if (Cache.has(fileName)) {
		if (_.isFunction(onSuccess)) {
			onSuccess(Cache.get(fileName));
		}
	} else {
		$.ajax({
			cache: true,
			url: "/static/shapes/" + fileName + ".json", 
			success: function (data) {	
				Cache.set(fileName, data);
				if (_.isFunction(onSuccess)) {
					onSuccess(Cache.get(fileName));	
				}
	 		}, error: function () {
	 			if (_.isFunction(onError)) {
	 				onError();	
				}
	 		}
		});
	}
}

function drawProvincial(result) {
	wait();
	loadShape("provincial", function (json) {
		loadFeatures(json, null, result);
		resume();
	});
}

// draw a constituency to the map for the current_province
function drawConstituency(result) {
	if (g.current_province !== null) {
		
		wait();
		
		loadShape("provincial", function (json) {
			// grey out all provinces
			loadFeatures(json, {
				fillColor: "#ccc",
				fillOpacity: "0.5",
				strokeColor: "#aaa",
				strokeWeight: 1
			});
			
			scheduleProcess(function () {
				// when all provinces have loaded
				return g.featureArray.length === g.regionCount["provincial"];
			}, function () {
				// remove the current one from the map
				var temp = [];
				_.each(g.featureArray, function (feature) {
					var provName = feature.geojsonProperties["PROVINCE_N"];
					provName = provName.replace(/\s+/g, "_").toUpperCase();
					google.maps.event.clearInstanceListeners(feature);
					if (provName === g.current_province) {	
						feature.setMap(null);
					} else {
						temp.push(feature);
					}
				});
				// now draw constituencies
				g.featureArray = temp;
				
				var province = g.provinceData[g.current_province];
				var constituencyNames = province.constituencies;
				var count = constituencyNames.length;
				_.each(constituencyNames, function (c) {
					loadShape("constituency/" + c.replace(/\s+/g, "_").replace(/('|\.)/g,'').toUpperCase(), function (json) {
						json.properties['name'] = c;
						loadFeatures(json, {
							fillColor: "#777",
							fillOpacity: "0.5",
							strokeColor: "#000",
							strokeWeight: "1"
						}, result);
						if (--count === 0) {
							resume();
						}
					}, function () {
						if (--count === 0) {
							resume();
						}
					});
				});
																
			}, 500, 20);					
		});	
	}
}

function getBoundsZoomLevel() {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;
    var map = $("#map");
    var mapDim = {width: map.width(), height: map.height()};
    var bounds = geo.bounds;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.northeast;
    var sw = bounds.southwest;

    var latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;

    var lngDiff = ne.lng - sw.lng;
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);
    
    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}


function wait() {
	$("#spinner").show();
}

function resume() {
	$("#spinner").hide();
}

function scheduleProcess(condition, onSuccess, timeout, retries) {
	if (condition()) {
		onSuccess();
	} else {
		var id = setInterval(function () {
			if (condition()) {
				clearInterval(id);
				onSuccess();
			} 				
			if (!_.isEmpty(retries)) {
				retries--;
				if (retries < 1){
					clearInterval(id);
				}
			}
		}, timeout);
	}
}

var mapStyles = [
 {
     stylers: [ { saturation: -25 } ]
 },{
     featureType: "road",
     elementType: "labels",
     stylers: [ { visibility: "off" } ]
 },{
      featureType: "road",
      elementType: "geometry",
      stylers: [ { lightness: 50 }, { saturation: 10 }, { visibility: "simplified" } ]
 },{
      featureType: "transit",
      stylers: [ { visibility: "off" } ]
  },{
      featureType: "landscape",
      stylers: [ { lightness: 100 }, { saturation: -100 } ]
  },{
      featureType: "administrative",
      elementType: "geometry",
      stylers: [ { visibility: "off" } ]
  },{
      featureType: "administrative.country",
      elementType: "labels",
      stylers: [ { visibility: "off" } ]    
  },{
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ lightness: 60 }]
  }
];

function initMap() {
	
	var $map = $("#map");
	mapPixBounds = $map.show().bounds();
	
	var mapOptions = {
		mapTypeControl : false,
		mapTypeId : 'simple',
		streetViewControl : false,
		panControl : false,
		rotateControl : false,
		zoomControl : true,
		draggable : true,
		scrollWheel : true,
		disableDoubleClickZoom : false,
		zoom : getBoundsZoomLevel(),
		minZoom : 5,
		center : new google.maps.LatLng(geo.location.lat, geo.location.lng)
	};	
	
	if (_.isEmpty(map)) {
		// create map object
		var mapType = new google.maps.StyledMapType(mapStyles);
		map = new google.maps.Map($map[0], mapOptions);
		map.mapTypes.set('simple', mapType);
	} else {
		map.setOptions(mapOptions);
	}	
}

var $selectors;
function initSelectors() {	
	if (!$selectors) {
		$selectors = $('#selectors a.button');
		$selectors.bind('click', function( event ) {				
			$selectors.removeClass( 'selected' );
			$(this).addClass( 'selected' );
			params.contest = this.id.split('-')[1];
			analytics( params.contest, 'contest');
			loadView();
		});
		
		// setup light box
//		$('#lightbox, #subregion_title a').click( function(e) {
//			e.preventDefault();
//			$("#lightbox, #subregion_div").fadeOut(300, function () {	
//				$("#subregion li").unbind();
//				$('#lightbox, #subregion_div').unbind().remove();
//			});
//		});
//		$("#subregion_div, #lightbox").fadeIn(300);
	}
}

// start application
initSelectors();
initMap();
resizeViewOnly();
loadView();

$window.bind( 'resize', resizeViewOnly );

//start loading constituency shapes
scheduleProcess(function () {
	return Cache.has("provincial");
}, function () {
	for (var key in g.provinceData) {
		_.each(g.provinceData[key].constituencies, function (c) {
			var timer = setTimeout(function () {
				loadShape("constituency/" + c.trim().replace(/\s+/g, "_").replace(/('|\.)/g,'').toUpperCase(), 
				function (json) {
					clearTimeout(timer);
				});
			}, 50);
		});
	}
}, 1000);


//getScript( S(
//location.protocol == 'https:' ? 'https://ssl' : 'http://www',
//'.google-analytics.com/',
//opt.debug ? 'u/ga_debug.js' : 'ga.js'
//) );
//
//analytics( 'map', 'load' );
