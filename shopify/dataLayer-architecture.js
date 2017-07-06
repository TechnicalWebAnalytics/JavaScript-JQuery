/*
===================================
| DATALAYER ARCHITECTURE: SHOPIFY |
-----------------------------------

EXTERNAL DEPENDENCIES:
* jQuery

DataLayer Architecture: Shopify v2.0
COPYRIGHT 2016
LICENSES: MIT ( https://opensource.org/licenses/MIT )
AUTHORS: mechellewarneke@gmail.com | mechelle@bvaccel.com
*/

/* 
=====================================
| APPLY CONFIGS FOR DYNAMIC CONTENT |
-------------------------------------
*/

function config(){

	__meow__dataLayer = {
		dynamicCart: true,  // if cart is dynamic (meaning no refresh on cart add) set to true
		debug: true, // if true, console messages will be displayed
		cart: null,
		wishlist: null,
		removeCart: null
	};

	bindings = {
		cartTriggers                : ['form[action="/cart/add"] [type="submit"],.add-to-cart,.cart-btn'],
		viewCart                    : ['form[action="/cart"],.my-cart,.trigger-cart,#mobileCart'],
		removeCartTrigger           : ['[href*="/cart/change"]'],
		cartVisableSelector         : ['.inlinecart.is-active,.inline-cart.is-active'],
		promoSubscriptionsSelectors : [],
		promoSuccess                : [],
		ctaSelectors                : [],
		newsletterSelectors         : ['input.contact_email'],
		newsletterSuccess           : ['.success_message'],
		searchPage                  : ['search'],
		wishlistSelector            : [],
		removeWishlist              : [],
		wishlistPage                : []
	}
}

/* 
================================
| SETUP DATALAYER ARCHITECTURE |
--------------------------------
*/

function beginDataLayer(){
	var output = {
		'template'        :"{{template}}",
		'themeName'       : Shopify.theme.name,
		'themeId'         : Shopify.theme.id,
		'shopifyShopName' : Shopify.shop,
		'event'           : 'Begin DataLayer'
	}	
	__meow__dataLayer.purr.debug(arguments.callee.name,output);
	window.dataLayer = window.dataLayer || [];
	dataLayer.push(output);
}

function landingPage(){
	if (Cookies.get('landingPage') === undefined || Cookies.get('landingPage').length === 0) {
		var landingPage = true;
		Cookies.set('landingPage', 'landed', { expires: .5 });
	} else {
		var landingPage = false;
		Cookies.set('landingPage', 'refresh', { expires: .5 });
	}
}

/* 
===================================
| LOAD LIBRARIES AND DEPENDENCIES |
-----------------------------------
*/

/* Load libraries */
function jQueryReady(){
	if(!window.jQuery){
		var jqueryScript=document.createElement('script');
		jqueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js');
		document.head.appendChild(jqueryScript)
	}
	return typeof window.jQuery !== 'undefined';
}

function googleAnalyticsReady(){
	return typeof window.ga !== 'undefined';
}

/* Check if libraries are loaded */
function isReady(){
	return jQueryReady() && googleAnalyticsReady();
}

/* Interval to check library load */
function backoff(test, callback, delay){
	function getNewDelay(){
		if (!delay){
			return 1;
		}

		return (delay >= Number.MAX_VALUE) ? delay : delay * 2;
	}

	if (test()){
		callback();
	} else {
		setTimeout(function (){
			backoff(test, callback, getNewDelay());
		}, Math.log(getNewDelay()) * 100);
	}
}

/* 
==========================
| LOAD UTILITY FUNCTIONS |
--------------------------
Apply any reusable functions here
invoke 'purr' to get complete list of utilities in console
*/

function loadUtilities(){

	this.debug = function(funcname,output){
		if(__meow__dataLayer.debug == true ){
			if(__meow__dataLayer.debugType === 'object'){
				console.log("Data Layer: "+funcname, output); 
			}else if(__meow__dataLayer.debugType === 'text'){
				console.log("Data Layer: "+funcname+" :"+JSON.stringify(output, null, " "));
			}else{
				console.log("Data Layer: "+funcname, output); 
				console.log("Data Layer: "+funcname+" :"+JSON.stringify(output, null, " "));
			}
		}
	}


	this.getURLParams = function(name, url){
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	this.getProductData = function(url){
		return jQuery.getJSON(url, function (response) {
			var data = response.product;
			__meow__dataLayer.data = {
				product_id : data.id,
				sku        : data.variants[0].sku,
				category   : data.product_type,
				name       : data.title,
				brand      : data.vendor,
				price      : data.variants[0].price,
				variant    : data.variants[0]     
			}
		});
	}

	this.getProductArrayData = function(url,callback){
		return jQuery.getJSON(url).then(function (response) {
			data = response;
			__meow__dataLayer.data  = {
				'products': data.items.map(function (line_item) {
					return {
						product_id : line_item.id,
						sku        : line_item.sku,
						category   : line_item.product_type,
						name       : line_item.title,
						brand      : line_item.vendor,
						price      : (line_item.price/100),
						variant    : line_item.variant_id 
					}
				})        
			};
		})
		return __meow__dataLayer.data;
	}

	this.removeFromCart = function(originalCart,newCart){
		function arr_diff (a1, a2) {
			var a = [], diff = [];
			for (var i = 0; i < a1.length; i++) {
				a[a1[i]] = true;
			}
			for (var i = 0; i < a2.length; i++) {
				if (a[a2[i]]) {
					delete a[a2[i]];
				} else {
					a[a2[i]] = true;
				}
			}
			for (var k in a) {
				diff.push(k);
			}
			return diff;
		};
		var cartIDs = [];
		var removeIDs = [];
		var removeCart = [];
		for(var i=originalCart.length-1;i>=0;i--){var x=parseFloat(originalCart[i].variant);cartIDs.push(x)}for(var i=newCart.length-1;i>=0;i--){var x=parseFloat(newCart[i].variant);removeIDs.push(x)}function arr_diff(b,c){var a=[],diff=[];for(var i=0;i<b.length;i++){a[b[i]]=true}for(var i=0;i<c.length;i++){if(a[c[i]]){delete a[c[i]]}else{a[c[i]]=true}}for(var k in a){diff.push(k)}return diff};var x=arr_diff(cartIDs,removeIDs)[0];for(var i=originalCart.length-1;i>=0;i--){if(originalCart[i].variant==x){removeCart.push(originalCart[i])}}
			return removeCart;
	}

	!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var f="";for(var s in i)i[s]&&(f+="; "+s,!0!==i[s]&&(f+="="+i[s]));return document.cookie=n+"="+r+f}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");'"'===C.charAt(0)&&(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
}

/* 
==========================
| STITCH CONFIG BINDINGS |
--------------------------
*/

function stichConfig(){

	config();

	// stitch bindings
	objectArray = bindings;
	outputObject = __meow__dataLayer;

	function applyBindings(objectArray, outputObject){
		for (var x in objectArray){  
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

	applyBindings(bindings, __meow__dataLayer);
}

/*
=================
| FINALIZE LOAD |
-----------------
*/

/* SETUP ARCHITECTURE */
function setup(){
	console.log('Segment Analytics Loaded');
	__meow__dataLayer.purr = (new loadUtilities());
	stichConfig();
	productSearched();
	productListViewed();
	productViewed();
	checkoutStarted()
	checkout();
	orderCompleted();

	$(document).ready(function(){
		productAdded();
		cartViewed();
		couponApplied();
		productRemoved();
	});
}

/* LOAD ARCHITECTURE */
function init(){
	backoff(isReady, setup);
}

init();