function fuelxCheckoutProducts(data){
	var x = data;
	var y = x.map(function(elem){
	    return elem.id;
	}).join(";");
	return y;
}