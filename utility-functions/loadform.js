<script>
/* ------- Load Form ------- */
// run a script to capture form submits and push an event
// to append to a trigger for paid conversion scripts / events

// clickElement: clicked to trigger the form submit
// successElement: that displays success message
// additionalCode: message you want to push to the dataLayer

if(!$){ $ = jQuery };

$(function(){
/* ------- Dynamic Dependencies |  DO NOT EDIT ------- */
var loadform_uniqueID = Math.floor(Math.random()*100000);

/* ------- Dynamic Dependencies | EDIT ------- */
var clickElement   = $('.your-click-element'); // clicked to trigger the form submit
var successElement = $('.your-success-element'); // that displays success message
function additionalCode(){ dataLayer.push({'event':'example'}) }; // message you want to push to the dataLayer
var debug          = true; // if true will display console messages

/* ------- Build | DO NOT EDIT ------- */
window[loadform_uniqueID+'fire']=0;window[loadform_uniqueID+'firstClick']=true;clickElement.on("click",function(){if(window[loadform_uniqueID+'firstClick']==true){window[loadform_uniqueID+'firstClick']=false;if(debug===true){console.log("click")}if(window[loadform_uniqueID+'fire']==0){window[loadform_uniqueID+'fire']=1;interval=setInterval(function(){console.log("interval set");if(successElement.length>0&&successElement.is(":visible")){clearInterval(interval);additionalCode();window[loadform_uniqueID+'fire']=0;if(debug==true){console.log("success")}}},500);setTimeout(function(){interval},1000)}};});
});
</script>