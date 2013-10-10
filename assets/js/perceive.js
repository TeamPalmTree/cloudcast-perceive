// Closure for safety
function perceive() {
	// Local variables
	var arrangementIsVertical = true
	, logoMinHeight = 200
	, logoMinWidth = 200;

	// DOM Elements
	var  logoContainer = $('#logo')
	, logoTop = $('#lgtop')
	, logoTopContainer = $('#lgtopcntr')
	, logoBtm = $('#lgbtm')
	, logoBtmContainer = $('#lgbtmcntr')
	, player = $('#jquery_jplayer_1')
	, playerContainer = $('#jp_container_1')
	, playerControls = $('.jp-controls a')
	, statusArtist = $('#stata')
	, statusSong = $('#stats')
	, title = $('title');
	
	// Audio Setup
	player.jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "http://icecast.gdmradio.com:8000/128.mp3",
			});
		},
		swfPath: "/",
		supplied: "mp3",
		preload: "auto"
	});
	
	// Event Wiring
	$(window).resize(onResize);
	
	// Functions
	
	// Updates the current song/artist status, reschedules itself
	function updateStatus() {
		$.ajax("http://cloudcast.gdmradio.com/engine/status.json")
			.done(onStatusUpdateAjaxComplete);
		
		setTimeout(updateStatus, 5000);
	}
	
	function onStatusUpdateAjaxComplete(data) {
		var status;
		try {
			status = eval("(" + data +")");
		} catch (err) {
			// Alex probably broke something
		}
		if (status) {
			var song = status["current_file_title"];
			var artist = status["current_file_artist"];
			statusArtist.html(artist);
			statusArtist.attr('title', artist);
			statusSong.html(song);			
			statusSong.attr('title', song);
			title.html('GDM Radio - ' + song + ' - ' + artist);
		}
	}
	
	//On window resize, fix arrangement and size of the logos and player controls
	function onResize() {
		//Arrangement
		if ($(window).height() < 500 && $(window).width() > 600) {
			if (arrangementIsVertical) setArrangementHorizontal();
		}
		else if (!arrangementIsVertical) {
			setArrangementVertical();
		}
		
		//Size
		logoTop.height($(window).height() * (arrangementIsVertical ? .5 : .9));
		logoTop.width(logoTop.height());
		logoBtm.width(arrangementIsVertical ? logoTop.width() : logoTop.height());
		logoBtm.height(logoBtm.width() * .4);
		if (arrangementIsVertical) {
			playerContainer.width(logoTop.width());
			playerContainer.height("auto");
			logoTop.css('max-width', 'none');
			logoTop.css('max-height', 'none');
			logoBtm.css('max-width', 'none');
			playerControls.height(logoTop.height() * .15);
			playerControls.width(playerControls.height());
		}
		else {
			playerContainer.height(logoTop.height());
			playerContainer.width("35%")
			logoTop.css('max-width', $(window).width() * .25);
			logoTop.css('max-height', logoTop.css('max-width'));
			logoBtm.css('max-width', logoTop.css('max-width'));
			playerControls.height(logoTop.height() * .25);
			playerControls.width(playerControls.height());
		}
	}
	
	//Switch logo to "vertical" style - logo elements are stacked vertically
	function setArrangementVertical() {
		logoTopContainer.addClass('lgvert');
		logoBtmContainer.addClass('lgvert');
		logoContainer.removeClass('lgcntrhorz');
		playerContainer.addClass('plvert');
		playerContainer.removeClass('plhorz');
		arrangementIsVertical = true;
	}
	
	//Switch logo to "horizontal" style - logo elements are arranged side by side
	function setArrangementHorizontal() {
		logoTopContainer.removeClass('lgvert');
		logoBtmContainer.removeClass('lgvert');
		logoContainer.addClass('lgcntrhorz');
		playerContainer.addClass('plhorz');
		playerContainer.removeClass('plvert');
		arrangementIsVertical = false;
	}
	
	// OnLoad
	onResize();
	updateStatus();
}

$(document).ready(perceive);