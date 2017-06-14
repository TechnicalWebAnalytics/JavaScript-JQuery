$(function(){

// Universal script to capture impressions and clicks
// already has GA addPromos appended to capture the CTR and Revenue

// INSTRUCTIONS
// you will currently need to update 4 areas ( we are working on centralizing these )
// the first area is the _customBindings__ below
// the 2nd, 3rd and 4th have annotations of UPDATE ATTRIBUTES with a number in front. ( ex: 1. UPDATE ATTRIBUTES )
// follow instructions for each section and you should be good to go

	/* IMPRESSION TRACKING */
	// stage placeholder variables for impression tracking
	__customBindings__ = {
		'impressionName' : ['homepage-hero'], // name of the promo
		'primaryElement' : ['.hero-slide'], // capture all elements
		'newElement'     : ['.hero-slide.slick-active'], // visible element
	}

	/* ------ DO NOT EDIT ------ */ 
	__get__ = {
		'uniqueID'     : Math.floor(Math.random()*100000)
	}
	
	// stitch bindings
	function applyBindings(objectArray, outputObject){
		for (var x in objectArray) {  
			var key = x;
			var objs = objectArray[x]; 
			values = [];    
			if(objs.length > 0){    
				values.push(objs) 
				if(key in outputObject){              
					values.push(outputObject[key]); 
					outputObject[key] = values.join(", "); 
				}else{        
					outputObject[key] = values.join(", ");
				}   
			}  
		}
	}

	applyBindings(__customBindings__,__get__);

	window[__get__.uniqueID+'elementarray'] = []; // used to store the element indices [ KEEP BLANK ]
	window[__get__.uniqueID+'increment']    = []; // used to store increments [ KEEP BLANK]
	/* ------ END DO NOT EDIT ------ */ 

	window["ga_interval"+__get__.uniqueID] = setInterval(function(){
	// ---------------------------------- make sure the GA library has loaded
	if(typeof ga !== "undefined"){
	// --------------------------- when and if GA has loaded
		clearInterval(window["ga_interval"+__get__.uniqueID]); // remove GA check interval
		ga('require', 'ec') // load ga ecom plugin ( in case it is needed for tracking )

		impression_count = 0;

		$(__get__.primaryElement).each(function(){ // banner element goes here [UPDATE]
			window[__get__.uniqueID+'increment'].push(impression_count); // push the increment to stage for the banner impression impression_count
			
			// 1. ------ UPDATE ATTRIBUTES ------ //
			// these are the attributes for the primary element
			// we want to capture this to store for later extraction
			var link = $(this).attr("href");
			var img = $(this).css('background-image').replace('url("',"").replace('")',"");
			// ------ END UPDATE ATTRIBUTES ------ //
		
			impression_count += 1;

			// stage page and img link to capture for later
			// will also use impression_count for the index and increment array and position
			// the increment array is used as a failsafe to prevent impression_counting multiple impressions on a single page load
			window[__get__.uniqueID+'elementarray'].push({index:impression_count,url:link,img:img});  
			$(this).attr("promo-impression-position",impression_count);
			$(this).attr("promo-impression-id", __get__.impressionName+impression_count);
		});

		getdefaultbanner = true // stage to begin increment impression_count

		window["promo_interval"+__get__.uniqueID] = setInterval(function(){
		// ------------------------------------- begin promo interval
			
			// capture first slide and set defaults to false
			if(getdefaultbanner == true){
				currentbanner = "";
				getdefaultbanner = false;
			}

			// 2. ------ UPDATE ATTRIBUTES ------ //
			// any attr that will distinguish all elements from each other
			// the href is usually the best use case
			newbanner = $(__get__.newElement).attr("href"); // visible banner goes here [UPDATE]
			// ------ END UPDATE ATTRIBUTES ------ //

			if( newbanner != currentbanner ){
			// ------------------------------ if current banner doesn't match newbanner reset current banner and begin impression tracking
			currentbanner = newbanner; 
			for (var i = window[__get__.uniqueID+'elementarray'].length - 1; i >= 0; i--) {
			// ------------------------------------------------ for how many banners there are
				if(window[__get__.uniqueID+'elementarray'][i].url == currentbanner){
				// ------------------------------------- run through banner array to match url to current banner
					if( $.inArray(i, window[__get__.uniqueID+'increment']) != -1 ){
					// ------------------------------------- if banner position exists in increment array
						ga('ec:addPromo', {
							'name': window[__get__.uniqueID+'elementarray'][i].url, // Link
							'creative': window[__get__.uniqueID+'elementarray'][i].img, // Image
							'position': window[__get__.uniqueID+'elementarray'][i].index, // Position
							'id': "PROMO_homepage_hero_image_"+window[__get__.uniqueID+'elementarray'][i].index // change name of ID to reflect what you are tracking [UPDATE]
						});

						ga('send','event','banner','impression',window[__get__.uniqueID+'elementarray'][i].url,{ nonInteraction: true });
						var sIndex = $.inArray(i, window[__get__.uniqueID+'increment']);
						window[__get__.uniqueID+'increment'].splice(sIndex, 1);

					// ------------------------------------- if banner position exists in increment array
					}else{
					clearInterval(window["promo_interval"+__get__.uniqueID]); 
					}
				// ------------------------------------- run through banner array to match url to current banner
				}
			// ------------------------------------------------ for how many banners there are
			}
		// ------------------------------ if current banner doesn't match newbanner reset current banner
		}
		// ------------------------------------- begin promo interval
		}, 500); 

		/* CLICK TRACKING */
		$(__get__.primaryElement).click(function(){ // banner element goes here [UPDATE] 

			// 3. ------ UPDATE ATTRIBUTES ------ //
			// this is usually the same as the 1st attributes
			// we are just capturing the primary element info
			var link = $(this).attr("href");
			var img = $(this).css('background-image').replace('url("',"").replace('")',"");
			// ------ END UPDATE ATTRIBUTES ------ //
			
			var position = $(this).attr("promo-impression-position");
			var id = $(this).attr("promo-impression-id");

			ga('ec:addPromo', {
				'name': link,
				'creative': img, //Promotion Creative ( string ）
				'position': position, //Promotion Position ( string ）
				'id': id
			});
			ga('ec:setAction', 'promo_click');
			ga('send','event','banner','click', link);
		});
	// --------------------------- when and if GA has loaded
	}
	// ---------------------------------- make sure the GA library has loaded
	}, 500);
});