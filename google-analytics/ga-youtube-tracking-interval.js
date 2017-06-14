// use in replacement of original script if video loads dynamically
$(function () {
	fire = 0;
	if(fire == 0){
		fire = 1;
		youtube_interval = setInterval(function(){
			// console.log('interval');
		   	for (var e = document.getElementsByTagName('iframe'), x = e.length; x--;)
		   	if (/youtube.com\/embed/.test(e[x].src)){
			   	dataLayer.push({'event':'Youtube True'});
				clearInterval(youtube_interval);
			   	return true;
			   	// console.log('success');
		   }
		   return false;
		}, 500) 
	}
});