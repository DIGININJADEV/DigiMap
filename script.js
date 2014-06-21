$(document).ready(function(){
	$captures = [],
	selectedImgID = '',
	toggleCaptures = true,
	allowScreenCapture = true,
	h = window.innerHeight;
	adjustViewport(h);
	addListeners();
});

function adjustViewport(height){
	var padding = ((parseInt(height) - 760) / 2);
	console.log('Height:'+height);
	console.log('Padding:'+padding);
	$('#container').css('top',padding+'px');
}

function mapScreenCapture(coords){
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
		console.log($captureObj);


		var preloadImg = new Image();
	  preloadImg.src = $tomnodCaptureURL,
	  preloadImg.id  = $UID;
	  $captureImg = '<img id="'+$UID+'" src="css/images/loading.gif" id="" >';
		setTimeout(function(){
			console.log('Changing Image');
			console.log(preloadImg);
			$("#captures img").eq(0).remove();
			$("#captures").prepend(preloadImg);
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
		//console.log('Taking Screen Shot of [lat]:'+lat+' | [lng]:'+lng+' at: ' + tomnodCaptureURL);
	}
}

function addImageListeners(){
	$("#captures img").off();
	$("#captures img").on( "click", function() {
		selectedImgID = $(this).attr('id');
		selectedImgSrc = $(this).attr('src');
		console.log('[selectedImgID]'+selectedImgID);

		$.magnificPopup.open({
	  items: {
	    src: selectedImgSrc
	  },
	  type: 'image'
		});

		/*
		var tempArr = [];
		for(i=($captures.length - 1);i>-1;i--){
			var tempObj = {
				UID: $captures[i].ID,
				src: $captures[i].URL
			}
			tempArr.push(tempObj);			
		}
		console.log(tempArr);
		$.magnificPopup.open({
		    items: tempArr,
		    gallery: {
		      enabled: false
		    },
		    callbacks: {
				  open: function() {
				   	console.log('Opened');
				    loadSelections(this.currItem.data.UID);
				  }
			    // e.t.c.
			  },
		    type: 'image' 
		});
		*/
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
		$currentSelection = localStorage.getItem(localStorage.key(i));
		$currentSelection = JSON.parse($currentSelection);
		if($currentSelection.imgID == imgID){
			console.log('Match with: '+$currentSelection.imgID);
			createSelection($currentSelection);
		}
		
	}
}

function createSelection(selection){
  console.log('Creating Selection');
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

function addListeners(){
	$('#captureIcon').click(function(){
		mapScreenCapture($latlng);
	});	
}
