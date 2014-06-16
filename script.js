$(document).ready(function(){
	$captures = [];
});

function mapScreenCapture(lat,lng){
	$tomnodCaptureURL = 'http://dev1.tomnod.com/chip_api/chip/lat/'+lat+'/lng/'+lng; 
	$captureObj = {
		URL: $tomnodCaptureURL,
		Lat: lat,
		Lng: lng
	};

	$captures.push($captureObj);
	console.log($captureObj);

	$captureImg = '<img src="'+$tomnodCaptureURL+'" id="" >';
	$("#captures").prepend($captureImg);
	addImageListeners();
	//console.log('Taking Screen Shot of [lat]:'+lat+' | [lng]:'+lng+' at: ' + tomnodCaptureURL);
}

function addImageListeners(){
	$("#captures img").off();
	$("#captures img").on( "click", function() {
		console.log($captures);
		$src = $(this).attr('src');
		console.log('Ive been clicked: '+$src);
		/*
		$.magnificPopup.open({
	  items: {
	    src: $src
	  },
	  type: 'image'
		});
		*/

		var testArr = [
		      {
		        src: 'http://dev1.tomnod.com/chip_api/chip/lat/39.91592439575713/lng/-104.98388707637787'
		      },
		      {
		        src: 'http://dev1.tomnod.com/chip_api/chip/lat/39.91582547788627/lng/-102.98382806777954',
		      },
		    ];

		$.magnificPopup.open({
		    items: testArr,
		    gallery: {
		      enabled: true
		    },
		    type: 'image' // this is default type
		});
		
	});
}
