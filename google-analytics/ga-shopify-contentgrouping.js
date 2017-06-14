if(document.location.pathname == "/"){
	ga('set', 'contentGroup1', 'Homepage'); 
}

(function(){
	function toTitleCase(str)
	{
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

	if( document.location.pathname.match(/.*collections.*/g) ){
		var path = document.location.pathname;
		var x = path.split("/").splice(2,1);
		var group = x[0].split("-").join(" ");
		group = toTitleCase(group);
		ga('set', 'contentGroup2', group);
	}else if( document.location.pathname.match(/.*products.*/g) ){
		var path = document.location.pathname;
		var x = path.split("/").splice(2,1);
		var group = x[0].split("-").join(" ");
		group = toTitleCase(group);
		ga('set', 'contentGroup3', group);
	}
})();