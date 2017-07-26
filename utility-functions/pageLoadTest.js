(function(){
var checkPageLoad = true; // set to true if you want to check page load via console log
if(checkPageLoad = true){
	function msToTime(duration) {
		var milliseconds = parseInt((duration%1000)/100)
		, seconds = parseInt((duration/1000)%60)
		, minutes = parseInt((duration/(1000*60))%60)
		, hours = parseInt((duration/(1000*60*60))%24);
		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;
		return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
	}
	checkLoadDiff = function (time,difference){
		var a = time.split(':'); // split it at the colons
		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		var ms = ((+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]))*1000;  
		var change = ms + difference;
		var result = msToTime(change);
		var load = { "updated pageload (HH:MM:SS)" : result };
		console.log(load);
	}
	var startTime = new Date();
	window.onload = function(){
		var endTime = new Date();
		var duration = (endTime - startTime);
		var result = msToTime(duration);
		var load = { "pageload (HH:MM:SS)" : result };
		console.log(load, "use checkLoadDiff('"+result+"',Time difference MS) for any compensation time as integer");
	}
}
})();