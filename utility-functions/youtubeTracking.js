<script type="text/javascript" id="gtm-youtube-tracking">
(function() {

    /**
     * =============================
     * QUICK STITCH YOUTUBE TRACKING
     * -----------------------------

     * A quick stitch library that tracks youtube videos. 
     * There are many external APIs out there but after too many headaches and not enough shots later wanted to pust something simple together. 
     * Should be straightforward, there are some dynamic considerations but that is outside the functionality of the main library.

     * If it's sloppy feel free to call me out and run a pull request.
     
     * DO WHAT THE F*CK YOU WANT TO PUBLIC LICENSE ( http://www.wtfpl.net/about/ )
     * VER 1.0
     */

    function config() {
        clickElement = $('.video-play');
        youtubeIframe = $('.modal.active .youtube iframe');
        iframeSrcAttr = 'data-src'; // leave blank unless using a different attr for src=""
        dynamicYT = true;
    }

    // === [ YOUTUBE API LIBRARY ] === //
    function YTlibrary(iframeID) {
    	if(!$('html').html().match(/.*www\.youtube\.com\/iframe\_api.*/g)){
	        // This code loads the IFrame Player API code asynchronously
	        var tag = document.createElement('script');
	        tag.src = "http://www.youtube.com/iframe_api";
	        var firstScriptTag = document.getElementsByTagName('script')[0];
	        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    	}
        // This code is called by the YouTube API to create the player object
        function onYouTubeIframeAPIReady(event) {
            player = new YT.Player(iframeID, {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
        var pauseFlag = false;
        /* UPCOMING CHANGES
        - Gtag and GTM capability 
        - Debugger
        > Last Update 09.27.17 
        */
        function onPlayerReady(event) {
        	YTduration = player.getDuration();
            ga('send', 'event', 'YouTube Started', 'URL ' + player.getVideoUrl());
        }

        function onPlayerStateChange(event) {
            // track when user clicks to Play
            if (event.data == YT.PlayerState.PLAYING) {
                ga('send', 'event', 'YouTube Play', 'URL ' + player.getVideoUrl(), 'Duration ' + (player.getCurrentTime()).toFixed(0)+' sec');
                pauseFlag = true;
            }
            // track when user clicks to Pause
            if (event.data == YT.PlayerState.PAUSED && pauseFlag) {
                ga('send', 'event', 'YouTube Pause', 'URL ' + player.getVideoUrl(), 'Duration ' + (player.getCurrentTime()).toFixed(0)+' sec');
                pauseFlag = false;
            }
            // track when video ends
            if (event.data == YT.PlayerState.ENDED) {
                ga('send', 'event', 'YouTube Finished', 'URL ' + player.getVideoUrl(), 'Duration ' + (player.getCurrentTime()).toFixed(0)+' sec');
            }
        }
        onYouTubeIframeAPIReady();
    }

    // === [ SETUP YT API WORKLOAD ] === //
    function checkIframeSrc(iframeSrcAttr, youtubeIframe) {
    	iframeID = (Math.random() * 69696969).toFixed(0);
        if (iframeSrcAttr === '' || iframeSrcAttr === undefined) {
            iframeSrcAttr = 'src';
        }
        videoUrl = youtubeIframe.attr(iframeSrcAttr);
        if (videoUrl.indexOf('origin') === -1) {
            origin = window.location.protocol + '//' + window.location.hostname;
            videoUrl += '&amp;origin=' + encodeURIComponent(origin);
        }
        if (videoUrl.indexOf('enablejsapi') === -1) {
            videoUrl += '&enablejsapi=1';
        }
        youtubeIframe.attr('src', window.location.protocol + videoUrl);
        youtubeIframe.attr('id', iframeID);
        YTlibrary(iframeID);
    }

    function dynamicVideos(clickElement) {
    	if(dynamicYT === true){
	        $('.video-play').on("click", function() {
	        	console.log('click');
	            setTimeout(function() {
	            	config(); // refresh config
	                checkIframeSrc(iframeSrcAttr,youtubeIframe);
	            }, 1000);
	        });
    	}else{
    		checkIframeSrc(iframeSrcAttr,youtubeIframe);
    	}
    }

    // === [ DEPENDENCIES ] === //
    function dependencies() {
        YTLoadArray = [];
        if (!window.jQuery) {
            var jqueryScript = document.createElement('script');
            jqueryScript.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js');
            document.head.appendChild(jqueryScript);
            $ = jQuery;
            YTLoadArray.push(true);
        } else if (window.jQuery) {
            YTLoadArray.push(true);
            if (!$) {
                $ = jQuery;
            }
        } else {
            YTLoadArray.push(false);
        }
        return YTLoadArray;
    }

    /* === [ LOAD HANDLING ] === */
    function backoff(test, callback, delay) {
        function getNewDelay() {
            if (!delay) {
                return 1;
            }
            return (delay >= Number.MAX_VALUE) ? delay : delay * 2;
        }
        if (test()) {
            callback();
        } else {
            setTimeout(function() {
                backoff(test, callback, getNewDelay());
            }, Math.log(getNewDelay()) * 100);
        }
    }

    function isReady() {
        if (dependencies().includes(false)) {
            return false
        } else {
            return true
        };
    }

    function setup() {
        config();
        dynamicVideos(clickElement);
    }

    function init() {
        // Wait for GA, Shopify and Flow to be ready.
        backoff(isReady, setup);
    }
    init();
})(document, window);
</script>