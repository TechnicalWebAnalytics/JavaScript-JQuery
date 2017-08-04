(function(){
/**
========================
| Cookie Split Testing |
------------------------
* Sets a cookie for A/B testing if one isn't available
* Integrates rule that only allows set cookies to fire for a respective variant
* Allows integration of an external conditional
*
* To run the script use:
* purr.splitTesting.run(
			initialConditional, // apply any initial conditional that may not be included in the standard detection ( is pixel available if not set it )
			initialCode, // any code that should be included if the initial conditional is true
			codeIfCookieIsSet, // if cookie is set run this code
			codeIfCookieIsNotSet, // if cookie is not set run this code
			cookieSplitName, // name of the split cookie
			cookieSplitValue // name of the split cookie value
			);
*/

/*
=============
| Load Vars |
-------------
*/

var finalizeLoadCode = function(){ 
	// any initialization code can go here
	dataLayer.push({'event': 'Split Test Cookie Script Loaded'}); 
};

/*
==================
| Load Libraries |
------------------
*/

window.purr = window.purr || {}; // load global object variable

// Check for Javascript Cookie Library
function loadCookieSplitTest(){
	if(typeof Cookies === "undefined"){
		loadCookieLibrary();
		finalize();
	}else{
		finalize();
	};
};

function loadCookieLibrary(){
	!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var f="";for(var s in i)i[s]&&(f+="; "+s,!0!==i[s]&&(f+="="+i[s]));return document.cookie=n+"="+r+f}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");'"'===C.charAt(0)&&(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
};

function finalize(){
	events();
	purr.splitTesting = (new events());
	finalizeLoadCode();
}

/*
==================
| Load Utilities |
------------------
*/

getQueryVariable = function(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	console.log('Query variable %s not found', variable);
}

runVariation = function(numberOfVariations){
	// < 0.5*2147483647
	
}

/*
==================
| Session Events |
------------------
* You will need to use your own event logic. 
* This is where you will add this code. 
*/

function events(){
	// add to cart
	this.run = function(
		initialConditional, // apply any initial conditional that may not be included in the standard detection ( is pixel available if not set it )
		initialCode, // any code that should be included if the initial conditional is true
		codeIfCookieIsSet, // if cookie is set run this code
		codeIfCookieIsNotSet, // if cookie is not set run this code
		cookieSplitName, // name of the split cookie
		cookieSplitValue // name of the split cookie value
		){ 
		var x = cookieSplitName;
		var y = cookieSplitValue;
		if(Cookies.get(x) === undefined && initialConditional()){ // if conditional is met
			intialCode();
			Cookies.set(x, y, { expires: 730 });
		}else if(Cookies.get(x) === undefined){ // if cookie is not set
			codeIfCookieIsNotSet();
			Cookies.set(x, y, { expires: 730 }); // if cookie is set
		}else if(Cookies.get(x) == y){
			codeIfCookieIsSet();
		};
	};

	this.example = function(cookieName,cookieValue,reset){

		function initialConditional(){
			if(getQueryVariable('utm_medium') == 'test'){
				return true;
			}
		}
		function initialCode(){
			console.log('utm_detected');
		}
		function codeIfCookieIsSet(){
			console.log('fireIfCookieSet');
		}
		function codeIfCookieIsNotSet(){
			console.log('fireIfCookieNotSet');
		}
		var cookieSplitName = 'test1';
		var cookieSplitValue = 'testresult1';

		purr.splitTesting.run(
			initialConditional, // apply any initial conditional that may not be included in the standard detection ( is pixel available if not set it )
			initialCode, // any code that should be included if the initial conditional is true
			codeIfCookieIsSet, // if cookie is set run this code
			codeIfCookieIsNotSet, // if cookie is not set run this code
			cookieSplitName, // name of the split cookie
			cookieSplitValue // name of the split cookie value
			);

		if(reset == true){
			Cookies.remove(cookieSplitName);
		};
	};
};

/*
=================
| FINALIZE LOAD |
-----------------
*/

loadCookieSplitTest();

/*
============
| Examples |
------------
*/

// example('mew','test',true);

})();