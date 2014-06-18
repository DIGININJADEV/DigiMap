$(document).ready(function(){
	$captures = [],
	selectedImgID = '';
});

function mapScreenCapture(lat,lng){
	$tomnodCaptureURL = 'http://dev1.tomnod.com/chip_api/chip/lat/'+lat+'/lng/'+lng; 
	$UID = Date.now();
	$captureObj = {
		ID:  $UID,
		URL: $tomnodCaptureURL,
		Lat: lat,
		Lng: lng
	};

	$captures.push($captureObj);
	console.log($captureObj);

	$captureImg = '<img id="'+$UID+'" src="'+$tomnodCaptureURL+'" id="" >';
	$("#captures").prepend($captureImg);
	addImageListeners();
	//console.log('Taking Screen Shot of [lat]:'+lat+' | [lng]:'+lng+' at: ' + tomnodCaptureURL);
}

function addImageListeners(){
	$("#captures img").off();
	$("#captures img").on( "click", function() {
		selectedImgID = $(this).attr('id');
		
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
		$('figure').xselectable();
		loadSelections(selectedImgID);
	});
}

function storeSelections(selections){
	// Each of $('.xselectable-box')
	console.log('Selected Image Is: ' + selectedImgID);
	console.log(selections);
	for(i=0;i<selections.length;i++){
		console.log(selections[i].uid);
		selections[i].imgID = selectedImgID;
		var UID = selections[i].uid;
		localStorage['digimap-'+UID] = JSON.stringify(selections[i]);
	}
}

function loadSelections(imgID){
	console.log('Loading selections from local storage for img:'+imgID);
	for(i=0;i<localStorage.length;i++){
		console.log(localStorage.getItem(localStorage.key(i)));
	}
}

function createSelection(selection){
	/*
	$('.xselectable-glass').each(function(index){
      $(this).remove();      
    });

    for(i=0;i<selectionsArr.length;i++){
      $uid = Date.now();
      $currentSelection = selectionsArr[i];
      $selection = $(
      '<div />', {
        'class': 'xselectable-box',
        'id'   : $currentSelection.uid
      }).css({
      'position': 'absolute',
      'top': $currentSelection.top,
      'left': $currentSelection.left,
      'height': $currentSelection.height,
      'width': $currentSelection.width,
      'overflow': 'hidden'}).appendTo("figure");   
    }


    $('.xselectable-box').each(function(index){
      $(this).click(function(){
        $('.xselectable-box').each(function(index){
          $(this).removeClass('xselectable-box-selected');
        });
        $(this).addClass('xselectable-box-selected');

      });

    });
	*/
}
