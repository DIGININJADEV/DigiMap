$(document).ready(function(){
	$captures = [],
	selectedImgID = '',
	toggleCaptures = true,
	allowScreenCapture = true,
	h = window.innerHeight,
	angle = 0;

	// Digital Globe:22.3040407, 114.2018156
	$latlng = { 
    Lat: '39.9157729',
    Lng: '-104.9838554'
  }

  $alertMsgs = {
  	click: true,
  	search: true,
  	zoom: true,
  	zoomclick: true,
  	draw: true,
  	select: true,
  	adjust: true
  }

	initalize();
});

function initalize(){
	logMsg('Click','Click the camera icon or press [Spacebar] to take a screen shot of the map.');
	addListeners();
	buildLibrary();
}

function addListeners(){
	$('#captureIcon').click(function(){
		mapScreenCapture($latlng);
	});	
}

function buildLibrary(){

        var latlng = new google.maps.LatLng($latlng.Lat,$latlng.Lng);  
        var mapOpts = {
          zoom: 20,
          center: latlng,
          scrollwheel: true,
          scaleControl: false,
          navigationControl: false,
          draggable: true,
          zoomControl: true,
          rotateControl: false,
          panControl: false,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          streetViewControl: false,
          mapTypeControl: false
        };

        map = new google.maps.Map(document.getElementById("map_canvas"), mapOpts);
        var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));

        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();

        if (!place.geometry) {
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(25);
        }
       

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        $latlng = { 
    			Lat: place.geometry.location.k,
    			Lng: place.geometry.location.A
  			}

      });  

        // Make the map selectable.
        $('#map_canvas').xselectable({

            // Selection is initially disabled.
            disabled: true,

            // Make all map markers selectable
            filter: '.marker',

            // Define a custom scroller that will work together with the
            // underyling Google Map
            scroller: function(el) {
              var offset = {
                'top' : 0,
                'left': 0
              };

              return {

                // The map is scrollable limitless in all directions
                getScrollableDistances: function() {
                  return [
                    Number.MAX_VALUE, Number.MAX_VALUE,
                    Number.MAX_VALUE, Number.MAX_VALUE
                  ];
                },

                // Scroll the underlying map when a scroll request is received.
                scroll: function(axis, shift) {
                  if (axis == 'vertical') {
                    map.panBy(0, shift);
                    offset.top -= shift;
                  } else {
                    map.panBy(shift, 0);
                    offset.left -= shift;
                  }
                },

                // Keep track of how far we have scrolled, so that overlaps
                // between the selection box and selectable markers can be
                // computed accordingly.
                getScrollOffset: function() {
                  return offset;
                }
              }
            },

            // Define a custom positioner. Returns the correct pixel positions
            // of selectable markers, with respect to the current map projection.
            positioner: function(el) {
              var pos = overlay.getProjection().fromLatLngToContainerPixel(
                $(el).data('latlng'));
              return {
                'top': pos.y - 37,  // 37=vertical offset of the marker icon
                                    //    to have it point to the exact latlng
                                    //    coordinate the marker points to
                'left': pos.x - 16,  // 16=horizontal offset of the marker icon
                                     //    to have it point to the exact latlng
                                     //    coordinate the marker points to
                'width': el.offsetWidth,
                'height': el.offsetHeight
              }
            }

        // Bind a few events to keep track of selected items.
        }).bind('xselectablestart', function() {
          $('#selectedList').children().remove();
        }).bind('xselectableselecting', function(ev, ui) {
          var li = $('<li />').text($(ui.selecting).data('address')).appendTo(
            $('#selectedList'));
          $(ui.selecting).data('listItem', li);
        }).bind('xselectableunselecting', function(ev, ui) {
          $(ui.unselecting).data('listItem').remove();
        });

        // Let the user add markers to the map based on addresses of his choice.
        var geocoder = new google.maps.Geocoder();
        $('#geocode').submit(function(evt) {
          geocoder.geocode({ 'address': $('#address').val()}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              overlay.addMarker(
                  results[0].geometry.location,
                  results[0].formatted_address);
              map.setCenter(results[0].geometry.location);
              overlay.draw();
              $('#address').val('');
            } else {
              alert("Geocode was not successful for the following reason: " + status);
            }
          });
          evt.preventDefault();
        });

        // Let the user add random markers to the map.
        $('#add_random').click(function(evt) {
          var centroid = {
            lat: Math.random() * 120 - 60,
            lng: Math.random() * 360 - 180
          }, sw = {
            lat: Number.MAX_VALUE,
            lng: Number.MAX_VALUE
          }, ne = {
            lat: Number.MIN_VALUE,
            lng: Number.MIN_VALUE
          };

          for (var i = 0; i < 10; i++) {
            var lat = centroid.lat + Math.random()*20;
            var lng = centroid.lng + Math.random()*30;

            sw.lat = Math.min(sw.lat, lat);
            sw.lng = Math.min(sw.lng, lng);

            ne.lat = Math.max(ne.lat, lat);
            ne.lng = Math.max(ne.lng, lng);

            overlay.addMarker(
              new google.maps.LatLng(lat, lng),
              "Lat: " + lat.toFixed(2) + ", Lng: " + lng.toFixed(2));
          }
          map.fitBounds(new google.maps.LatLngBounds(
              new google.maps.LatLng(sw.lat, sw.lng),
              new google.maps.LatLng(ne.lat, ne.lng)
          ));
          overlay.draw();
          evt.preventDefault();
        });
}


function mapScreenCapture(coords){
$numThumbs = $("div.capturedImg");
if($numThumbs.length >= 4){
	allowScreenCapture = false;
	alertify.set({ delay: 10000 });
	alertify.error("You have taken the maximum number of captures. Delete one or more to free space.");
}else{
	allowScreenCapture = true;
}
if(allowScreenCapture){
	$tomnodCaptureURL = 'http://dev1.tomnod.com/chip_api/chip/lat/'+coords.Lat+'/lng/'+coords.Lng; 
	$UID = Date.now();
	$captureObj = {
		ID:  $UID,
		URL: $tomnodCaptureURL,
		Lat: coords.Lat,
		Lng: coords.Lng
	};

	$captures.push($captureObj);

	var preloadImg = new Image();
  preloadImg.src = $tomnodCaptureURL,
  preloadImg.id  = $UID;
  $captureImg = '<div class="capturedImg"><img id="'+$UID+'" src="css/images/loading.gif" id="" ><div class="btn-close"></div></div>';
	setTimeout(function(){
		$preloadPanel = '<div class="capturedImg"><div class="btn-close"></div></div>';
		$("#captures div").eq(0).remove();
		$("#captures").prepend($preloadPanel);
		$("#captures div").eq(0).prepend(preloadImg);
		logMsg('Search','Search for another location or view your screen shot by clicking the thumbnail.');
		allowScreenCapture = true;
		addImageListeners();
	},5000);
	$("#captures").prepend($captureImg);
	if(toggleCaptures === true){
		$("#captures").slideToggle( "slow", function() {
		    toggleCaptures = false;
		  });
	}
	allowScreenCapture = false;

}
}

function addImageListeners(){
	$("#captures .btn-close").off();
	$("#captures .btn-close").on( "click", function() {
		$imgID = $(this).parent().find('img').attr('id');
		$(this).parent().remove();
		deleteSelections($imgID);
	});

  // Zoom Listeners
	$(".zoomImg").off();
  $(".zoomImg").on( "click", function() {

  });

	$("#captures img").off();
	$("#captures img").eq(0).on( "click", function() {

		$(this).addClass('activeCapture');
		selectedImgID = $(this).attr('id');
		selectedImgSrc = $(this).attr('src');

		$.magnificPopup.open({
	  items: {
	    src: selectedImgSrc
	  },
	  type: 'image',
	  callbacks: {
	  			open: function(){
	  				loadCapture(selectedImgID);
	  			},
				  imageLoadComplete: function() {
				    logMsg('Zoom','Move the cursor around the image to magnify it.');
				    setTimeout(function(){
				    	logMsg('ZoomClick', 'Click on the map to select a location');
				    },2500);
				    $('.mfp-bg').animate({'opacity': 1}, 1000)				    
				  },
				  close: function() {
				  	$("#captures img").each(function(){$(this).removeClass('activeCapture')});
				  	$('.mfp-bg').animate({'opacity': .8}, 1000)
      			updateSelections(selectedImgID);
    			}
			  }
		});

		
		$('figure').off();
		$('figure').on("click", function(){

		var top = '0px',
				left = '0px';

	 	
	 	if($(".zoomImg").length){

	 	logMsg('Draw','Left-click and drag the cursor to  draw boxes around objects on the map, such as; buildings, cars, ships.');

	 	$zoomedImg = $(".zoomImg");
	 	var position = $zoomedImg.position();
	 		top = position.top+'px';
	 		left = position.left+'px';
	 		$('figure img').eq(0).css({
  		"position":   'absolute',
  		"width":      '1600px',
  		"max-width":  'none',
  		"height":     '1600px',
  		"max-height": 'none',
  		"top":         top,
  		"left":        left});

  	$uid = Date.now();
  	$zoomContainer = $(
      '<div />', {
        'class': 'zoomContainer'
      }).css({
      'position': 'relative',
      'height': '800px',
      'width': '800px',
      'overflow': 'hidden'}).appendTo('figure');   

  	$('figure img').eq(1).remove();
  	$('figure .mfp-img').appendTo('.zoomContainer');
  	storeCapture($('figure .mfp-img'),selectedImgID);

	 	}  	
		$('figure').xselectable();
		});

		loadSelections(selectedImgID);
	});
}

function storeCapture($capture,$imgID){
	$key = 'digimap-'+$uid;
	var tempCapture = {
		uid: $imgID,
		top: $capture.position().top,
		left: $capture.position().left
	}
	localStorage[$key] = JSON.stringify(tempCapture);
}

function loadCapture($imgID){
	var matched = false;
	for(var key in localStorage) {
			$checkKey = key.indexOf('digimap-');
			if($checkKey !== -1){
				$current = localStorage.getItem(key);
		  	$current = JSON.parse($current);
				if($current.uid == $imgID){
					$match = $current;
					$zoomContainer = $(
		      '<div />', {
		        'class': 'zoomContainer'
		      }).css({
		      'position': 'relative',
		      'height': '800px',
		      'width': '800px',
		      'overflow': 'hidden'}).appendTo('figure');  

					$('figure .mfp-img').css({
		  		"position":   'absolute',
		  		"width":      '1600px',
		  		"max-width":  'none',
		  		"height":     '1600px',
		  		"max-height": 'none',
		  		"top":         $match.top+'px',
		  		"left":        $match.left+'px'});

		  		$('figure .mfp-img').appendTo('.zoomContainer');
		  		matched = true;	
			}
		}
	}

	if(!matched){
		$('figure').zoom({ magnify:'2', duration: '240' });
	}

	
}

function addSelectionListeners(){
	$('.xselectable-box-selected').off();
	$('.xselectable-box-selected').on( "click", function() { 
		logMsg('Adjust','You can adjust the position the box with the arrow keys. Delete the box with the [Del] key.');
	});
}

function createSelection(selection){
  $selection = $(
  '<div />', {
    'class': 'xselectable-box',
    'id'   : selection.uid
  }).css({
  'position': 'absolute',
  'top': selection.top,
  'left': selection.left,
  'height': selection.height,
  'width': selection.width,
  'overflow': 'hidden'}).appendTo("figure");   
}

function storeSelections(selections){
	for(i=0;i<selections.length;i++){
		selections[i].imgID = selectedImgID;
		var UID = selections[i].uid;
		localStorage['digimap-'+UID] = JSON.stringify(selections[i]);
	}
}

function loadSelections(imgID){
	for(i=0;i<localStorage.length;i++){
		$currentSelection = localStorage.getItem(localStorage.key(i));
		$currentSelection = JSON.parse($currentSelection);
		if($currentSelection.imgID == imgID){
			createSelection($currentSelection);
		}
		
	}
}

function updateSelections(imgID){
	for(var key in localStorage) {
  	$checkKey = key.indexOf('digimap-');
		if($checkKey !== -1){
			$currentSelection = localStorage.getItem(key);
	  	$currentSelection = JSON.parse($currentSelection);
			if($currentSelection.imgID == imgID){
				$key = key.split('-');
				$id = $key[1];

				$this = $('#'+$id);
				$position = $this.position();
	      $top = $position.top;
	      $left = $position.left;

	      $currentSelection.top    = $top,
	      $currentSelection.left   = $left,

	      localStorage[key] = JSON.stringify($currentSelection);
			}
		}
	}
}

function deleteSelections(imgID){
	for(var key in localStorage) {
		$checkKey = key.indexOf('digimap-');
		if($checkKey !== -1){
			$currentSelection = localStorage.getItem(key);
	  	$currentSelection = JSON.parse($currentSelection);
			if($currentSelection.imgID == imgID){
				localStorage.removeItem(key);
			}
		}
	}
}

function logMsg(title,msg){
	
	alertify.set({ delay: 15000 });
	if(title === 'Click'){
		if($alertMsgs.click)
			alertify.log(msg);
		$alertMsgs.click = false;
	}else if(title === 'Search'){
		if($alertMsgs.search)
			alertify.log(msg);
		$alertMsgs.search = false;
	}else if(title === 'Zoom'){
		if($alertMsgs.zoom)
			alertify.log(msg);
		$alertMsgs.zoom = false;
	}else if(title === 'ZoomClick'){
		if($alertMsgs.zoomclick)
			alertify.log(msg);
		$alertMsgs.zoomclick = false;
	}else if(title === 'Draw'){
		if($alertMsgs.draw)
			alertify.log(msg);
		$alertMsgs.draw = false;
	}else if(title === 'Select'){
		if($alertMsgs.select)
			alertify.log(msg);
		$alertMsgs.select = false;
	}else if(title === 'Adjust'){
		if($alertMsgs.adjust)
			alertify.log(msg);
		$alertMsgs.adjust = false;
	}
	
}

function rotateCapture(angle){
	$('.mfp-img').css('transform','rotate('+angle+'deg)');
}