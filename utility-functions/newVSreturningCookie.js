(function(){
/**
===========================
| New vs Returning Cookie |
---------------------------
* Establishes a new vs returning cookie based on purchases
* Call function using purr.newvsreturning.check(
* 		newCustomerInput, // optional: any conditionals to detect new users | pass as a function
*		returningCustomerInput, // optional: any conditionals to detect returning users | pass as a function
*		newCustomer_additionalCode, // code to fire on new user
*		returningCustomer_additionalCode){ // code to fire on returning user
*		);
*/

/*
==================
| Load Libraries |
------------------
*/

window.purr = window.purr || {}; // load global object variable

// Check for Javascript Cookie Library
function loadNewVsReturning(){
	if(typeof Cookies === "undefined"){
		loadCookieLibrary();
		finalize();
	}else{
		finalize();
	}
};

function loadCookieLibrary(){
	!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var f="";for(var s in i)i[s]&&(f+="; "+s,!0!==i[s]&&(f+="="+i[s]));return document.cookie=n+"="+r+f}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");'"'===C.charAt(0)&&(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
};

function finalize(){
	events();
	purr.newvsreturning = (new events());
	// console.log('purr_newvsreturning: purr_newvsreturning.functions();');
}

/*
================
| Cookie Event |
----------------
* You will need to use your own event logic. 
* This is where you will add this code. 
*/

function events(){
	this.check = function(
		newCustomerInput, // optional: any conditionals to detect new users | pass as a function
		returningCustomerInput, // optional: any conditionals to detect returning users | pass as a function
		newCustomer_additionalCode, // code to fire on new user
		returningCustomer_additionalCode){ // code to fire on returning user
		if(Cookies.get('newVreturning') === 'returning' || returningCustomerInput() ){
			Cookies.set('newVreturning', 'returning', { expires: 36500 });
				returningCustomer_additionalCode();

		}else	if(Cookies.get('newVreturning') !== 'returning' || newCustomerInput() ){
			Cookies.set('newVreturning', 'returning', { expires: 36500 });
				newCustomer_additionalCode();
		};
	};
};

/*
=================
| FINALIZE LOAD |
-----------------
*/

loadNewVsReturning();

})();