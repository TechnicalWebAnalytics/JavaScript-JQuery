ga('require', 'ec');
function shopifyCheckout(step,name){
	if(Shopify.Checkout.step && Shopify.Checkout.step === name){
		ga('ec:setAction','checkout', {
			'step': step
		});
		ga('send','event','Checkout Funnel','Step: '+step+' | '+name);
	}
}

shopifyCheckout('1',"contact_information");
shopifyCheckout('2',"shipping_method");
shopifyCheckout('3',"payment_method");