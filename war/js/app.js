define(['backapp'], function (app) {
	
  // setup application specific extensions

	app.resizeViewOnly = function () {
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
		}
		else {
			var topbarHeight = $('#topbar').height() + 1;
			mapTop = topbarHeight;
			mapHeight -= mapTop;
		}
		mapPixBounds = $('#map').css({
			position: 'absolute',
			left: mapLeft,
			top: mapTop,
			width: mapWidth,
			height: mapHeight
		}).bounds();
	};

  return app;
  
});