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
		$src = $(this).attr('src');
		
		/*
		$.magnificPopup.open({
	  items: {
	    src: $src
	  },
	  type: 'image'
		});
		*/

		var tempArr = [];
		for(i=($captures.length - 1);i>-1;i--){
			var tempObj = {
				src: $captures[i].URL
			}
			tempArr.push(tempObj);			
		}
		console.log(tempArr);
		$.magnificPopup.open({
		    items: tempArr,
		    gallery: {
		      enabled: true
		    },
		    type: 'image' 
		});
		
	});
}
