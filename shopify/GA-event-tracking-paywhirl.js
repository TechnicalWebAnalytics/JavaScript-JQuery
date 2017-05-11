// All Pages
$(document).ready(function(){
	$('[value="Next"]').on("click", function(){
		var step = $('.fit-steps--step.active p').eq(0).text();
		var stepname = $('.fit-steps--step.active p').eq(1).text();
		if(!step){
			var step = "STEP 1";
			var stepname = "FIND YOUR SIZE";
		}
		ga('send','event','Paywhirl','Next',step+": "+stepname);
	});
});

// Conversion
ga('send','event','Paywhirl','Conversion');