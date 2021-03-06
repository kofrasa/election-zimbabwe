define([
  'app',
  'text!templates/main.html'
], function(app, mainTmpl) {

  var g = app.g;

  var AppView = Backbone.View.extend({
	  
    el: "body",
    
    render: function() {
    	
      var out = app.renderTemplate(mainTmpl);
      this.$el.html(out);
      
      // window global variables
      $body = $('body');
      $window = $(window), ww = $window.width(), wh = $window.height();
      sidebarWidth = 340;
      useSidebar = true;

      var mapStyles = [
        {
          stylers: [{saturation: -25}]
        }, {
          featureType: "road",
          elementType: "labels",
          stylers: [{visibility: "off"}]
        }, {
          featureType: "road",
          elementType: "geometry",
          stylers: [{lightness: 50}, {saturation: 10}, {visibility: "simplified"}]
        }, {
          featureType: "transit",
          stylers: [{visibility: "off"}]
        }, {
          featureType: "landscape",
          stylers: [{lightness: 100}, {saturation: -100}]
        }, {
          featureType: "administrative",
          elementType: "geometry",
          stylers: [{visibility: "off"}]
        }, {
          featureType: "administrative.country",
          elementType: "labels",
          stylers: [{visibility: "off"}]
        }, {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{lightness: 60}]
        }
      ];

      $('#map').show();
      mapPixBounds = $('#map').bounds();
      
      var mapOptions = {
        mapTypeControl: false,
        mapTypeId: 'simple',
        streetViewControl: false,
        panControl: false,
        rotateControl: false,
        zoomControl: false,
        draggable: true,
        scrollWheel: true,
        disableDoubleClickZoom: false,
        zoom: 7,
        center: new google.maps.LatLng(-19.0154380, 29.1548570)
      };
      
      // create map object
      g.map = new google.maps.Map($("#map")[0], mapOptions);
      var mapType = new google.maps.StyledMapType(mapStyles);
      g.map.mapTypes.set('simple', mapType);
      
      $window.bind('resize', app.resizeViewOnly );
      app.resizeViewOnly();
    }
  
  });

  return AppView;
});

