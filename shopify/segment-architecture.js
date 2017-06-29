<script>
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
	__meow__segment  = {
		dynamicCart : true, // if cart is dynamic (meaning no refresh on cart add) set to true
		debug       : true, // if true, console messages will be displayed
		debugType	: 'object', // choose how console logs should be displayed |
		cart        : null,
		wishlist    : null,
		removeCart  : null
	};

	bindings = {
		cartTriggers      : ['#AddToCart,form[action="/cart/add"] [type="submit"],.add-to-cart,.cart-btn'],
		addCartQuantity   : ['#Quantity'],
		viewCart          : ['.cart-link'],
		removeCartTrigger : ['[href*="/cart/change"]'],
		searchTermQuery   : [purr.getURLParams('q')],
		searchPage        : ['search'],
		applyCoupon       : ['.section--reductions .btn--default'],
		couponCode		: ['.applied-reduction-code__information'],
		couponDiscount	: ['[data-reduction-form]'],
		checkoutNext      : ['.step__footer__continue-btn'],
		removeFromCart    : ['.icon-minus']
	}
}

/* 
========================================
| SETUP SEGMENT ANALYTICS ARCHITECTURE |
----------------------------------------
*/

/* Products Searched */
function productSearched(){
	var searchPage = new RegExp(__meow__segment.searchPage, "g");
	if(document.location.pathname.match(searchPage)){
		var output = { query: __meow__segment.searchTermQuery };
		purr.debug(arguments.callee.name,output);
		analytics.track('Products Searched', output);
	}
}

/* Product List Viewed */
function productListViewed(){
	{% if template contains 'collection' %}
	var output = {
		list_id  : "{{collection.title}}",
		category : "{{collection.title}}",
		products : [
		{% for product in collection.products %}{
			product_id : '{{product.id}}',
			sku        : '{{product.selected_or_first_available_variant.sku}}',
			name       : "{{product.title}}",
			price      : '{{product.price | money_without_currency | remove: ","}}',
			position   : '{{forloop.index}}',
			category   : "{{product.type}}",
		},
		{% endfor %}]
	};
	purr.debug(arguments.callee.name,output);
	analytics.track('Product List Viewed', output);
	{% endif %}
}

/* Product Viewed */
function productViewed(){
	{% if template contains 'product' %}
	var output = {
		product_id : '{{product.id}}',
		sku        : '{{product.selected_or_first_available_variant.sku}}',
		variant    : '{{product.selected_or_first_available_variant.variant}}',
		category   : "{{product.type}}",
		name       : "{{product.title}}",
		brand      : '{{shop.name}}',
		price      : '{{product.price | money_without_currency | remove: ","}}',
		currency   : '{{shop.currency}}',
	};
	purr.debug(arguments.callee.name,output);
	analytics.track('Product Viewed', output);
	{% endif %}
}

/* Product Added */
function productAdded(){
	{% if template contains 'product' %}
	$(__meow__segment.cartTriggers).on("click", function(){
		var output = {
			product_id : '{{product.id}}',
			sku        : '{{product.selected_or_first_available_variant.sku}}',
			variant    : '{{product.selected_or_first_available_variant.variant}}',
			category   : "{{product.type}}",
			name       : "{{product.title}}",
			brand      : '{{shop.name}}',
			price      : '{{product.price | money_without_currency | remove: ","}}',
			currency   : '{{shop.currency}}',
			quantity   : $(__meow__segment).val()
		};
		purr.debug(arguments.callee.name,output);
		analytics.track('Product Added', output);
	});
	{% endif %}
}

/* Product Removed */
function productRemoved(){
	function stageRemove(){
		purr.getProductArrayData('/cart.js').then(function(response){
			Cookies.get('segmentCart');
			__meow__segmentstageRemove = __meow__segment.data.products;
			Cookies.set('segmentCart',__meow__segmentstageRemove);
		});
	}
	function checkStageRemove(){
		Cookies.get('segmentCart');
		purr.getProductArrayData('/cart.js').then(function(response){
			__meow__checkStageRemove = __meow__segment.data.products;
		});
	}
	function removeProduct(){
		fireRemoveProduct = 0;
		if(JSON.parse(Cookies.get('segmentCart')).length != __meow__checkStageRemove.length && fireRemoveProduct == 0){
			Cookies.get('segmentCart');
			purr.getProductArrayData('/cart.js').then(function(response){
				fireRemoveProduct = 1;
				removeoutput = purr.removeFromCart(JSON.parse(Cookies.get('segmentCart')),__meow__segment.data.products);
				if(removeoutput.length > 0){
					purr.debug('productRemoved',removeoutput);
					analytics.track('Product Removed', removeoutput);
					stageRemove();
					fireRemoveProduct = 0;
				}
			});
		}
	}
	setInterval(function(){
		checkStageRemove();
		if(Cookies.get('segmentCart') == undefined){
			stageRemove();
		}else if(typeof(__meow__checkStageRemove) !== 'undefined'){
			removeProduct();
		}
	},1500);
}

/* Cart Viewed */
function cartViewed(){
	$(__meow__segment.viewCart).on("click",function(){
		purr.getProductArrayData('/cart.js').then(function(response){
			var output = {
				products: __meow__segment.data.products
			};
			purr.debug('cartViewed',output);
			analytics.track('Cart Viewed', output);
		});
	});
	if(document.location.pathname.match(/.*cart.*/g)){
		purr.getProductArrayData('/cart.js').then(function(response){
			var output = {
				products: __meow__segment.data.products
			};
			purr.debug('cartViewed',output);
			analytics.track('Cart Viewed', output);
		});
	}
}

/* Checkout Started */
function checkoutStarted(){
	if(Shopify.Checkout){
		if (Shopify.Checkout.step === 'contact_information'){
			purr.getProductArrayData('/cart.js').then(function(){
				var output = {
					order_id    : '{{checkout.order_number}}',
					affiliation : '{{shop.name}}',
					value       : '{{checkout.total_price |  money_without_currency| remove: ","}}',
					revenue     : '{{checkout.subtotal_price |  money_without_currency| remove: ","}}',
					shipping    : '{{checkout.shipping_price |  money_without_currency| remove: ","}}',
					tax         : '{{checkout.tax_price |  money_without_currency| remove: ","}}',
					{% for discount in checkout.discounts %}
					discount    :  '{{discount.amount | money_without_currency}}',
					coupon      :  '{{discount.code}}',
					{% endfor %}
					currency    : '{{shop.currency}}',
					products    : __meow__segment.data.products
				};
				purr.debug('checkoutStarted',output);
				analytics.track('Checkout Started', output);
			});
		}
	}
}

/* Checkout Step Viewed | Completed */
function checkout(){
	if(Shopify.Checkout){
		function stepcomplete(step){
			$(__meow__segment.checkoutNext).on('click',function(){
				var output = {
					step: step
				};
				purr.debug('Checkout Step Completed',output);
				analytics.track('Checkout Step Completed', output);
			})
		}
		if (Shopify.Checkout.step === 'contact_information'){
			var output = {
				step: 1
			};
			purr.debug(arguments.callee.name,output);
			analytics.track('Checkout Step Viewed', output);
			stepcomplete('1');
		}else if (Shopify.Checkout.step === 'shipping_method'){
			var output = {
				step: 2
			};
			purr.debug(arguments.callee.name,output);
			analytics.track('Checkout Step Viewed', output);
			stepcomplete('2');
		}else if( Shopify.Checkout.step === "payment_method" ){
			var output = {
				step: 3
			};
			purr.debug(arguments.callee.name,output);
			analytics.track('Checkout Step Viewed', output);
			stepcomplete('3');
		}
	}
}

/* Payment Info Entered - In iFrame - cannot be accessed*/

/* Coupon Applied */
function couponApplied(){
	// check if promo is already applied on Payment method page
	if( Shopify.Checkout && Shopify.Checkout.step === "payment_method" ){
		{% for discount in checkout.discounts %}
		console.log('initial');
		var output = {
			order_id    : '{{checkout.order_number}}',
			coupon_name : '{{discount.title}}',
			discount    : '{{discount.amount | money_without_currency | remove: ","}}'
		};
		if('{{discount.title}}'){
			purr.debug(arguments.callee.name,output);
			analytics.track('Coupon Applied', output);
		}
		{% endfor %}
	}
	// detect if a promo code is entered
	firecouponApplied = 0;
	if(firecouponApplied != 1){
		$(document).on("click",__meow__segment.applyCoupon,function(){ 
			firecouponApplied = 1;
			var check = setInterval(function(){
				console.log('interval');

				var couponName = $(__meow__segment.couponCode).html();
				var couponPrice = parseFloat($(__meow__segment.couponDiscount).text().split('$').pop().replace(/\,/gi,"")).toFixed(2); 
				if(couponName && $('.btn-loading').length == 0){
					console.log('success');
					clearInterval(check);
					var output = {
						order_id    : '{{checkout.order_number}}',
						coupon_name : couponName,
						discount    : couponPrice
					};
					purr.debug(arguments.callee.name,output);
					analytics.track('Coupon Applied', output);
				}
			}, 1000);
			check;
			setTimeout(function( ) { clearInterval( check ); }, 50000);
		});
	};
}

/* Order Cancelled - customer has to call to cancel - no cancellation page */
/* Order Refunded - customer has to call for refund - no refund page */

/* Order Completed */
function orderCompleted(){
	if(Shopify.Checkout){
		if(Shopify.Checkout.page == "thank_you" || document.location.pathname.match(/.*order.*/g)){
			var output = {
				order_id    : '{{checkout.order_number}}',
				affiliation : "{{shop.name}}",
				total       : '{{checkout.total_price |  money_without_currency| remove: ","}}',
				revenue     :'{{checkout.subtotal_price |  money_without_currency| remove: ","}}',
				shipping    : '{{checkout.shipping_price |  money_without_currency| remove: ","}}',
				tax         : '{{checkout.tax_price |  money_without_currency| remove: ","}}',
				{% for discount in checkout.discounts %}
				discount : '{{discount.amoun t | money_without_currency}}',
				coupon   : '{{discount.code}}',
				{% endfor %}
				currency : '{{shop.currency}}',
				products : [{% for line_item in checkout.line_items %}
				{
					product_id : '{{line_item.product_id}}',
					sku        : '{{line_item.sku}}',
					name       : "{{line_item.title}}",
					price      : '{{line_item.price | money_without_currency| remove: ","}}',
					quantity   : '{{line_item.quantity}}',
					category   : "{{line_item.product.type}}",
				},
				{% endfor %}]
			};
			purr.debug(arguments.callee.name,output);
			analytics.track('Order Completed', output);
		}
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

function segmentReady(){
	return typeof window.analytics !== 'undefined';
}

/* Check if libraries are loaded */
function isReady(){
	return jQueryReady() && segmentReady();
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
		if(__meow__segment.debug == true ){
			if(__meow__segment.debugType === 'object'){
				console.log("Segment "+funcname, output); 
			}else if(__meow__segment.debugType === 'text'){
				console.log("Segment "+funcname+" :"+JSON.stringify(output, null, " "));
			}else{
				console.log("Segment "+funcname, output); 
				console.log("Segment "+funcname+" :"+JSON.stringify(output, null, " "));
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
			__meow__segment.data = {
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
			__meow__segment.data  = {
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
		return __meow__segment.data;
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
	outputObject = __meow__segment;

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

	applyBindings(bindings, __meow__segment);
}

/*
=================
| FINALIZE LOAD |
-----------------
*/

/* SETUP ARCHITECTURE */
function setup(){
	console.log('Segment Analytics Loaded');
	purr = (new loadUtilities());
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
</script>