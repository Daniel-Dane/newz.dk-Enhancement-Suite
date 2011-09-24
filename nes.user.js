// ==UserScript==
// @name          newz.dk Enhancement Suite
// @namespace     http://www.example.com/gmscripts dunno skiftes
// @description   newz.dk er nu endnu mere perfekt!
// @include       http://newz.dk/*
// @include       http://*.newz.dk/*
// @exclude       http://newz.dk/banner/*
// @exclude       http://*.newz.dk/banner/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require       http://sites.google.com/site/daveschindler/jquery-html5-storage-plugin/jquery.Storage.js
// @version       0.1
// ==/UserScript==

// Reference til window (alle globale variable samt funktioner), som virker i Firefox og Chrome (needs Opera check)
(newz = unsafeWindow) || (
	newz = function() {
		var el = document.createElement('p');
		el.setAttribute('onclick', 'return window;');
		return el.onclick();
	}()
);

// Sætter en ordentlig overskrift på tråden
// newz.dk sætter normalt kun side-nr. ind i <h1>, når man skifter side, tsk tsk
function fixTitle() {
	$("#container div h1").html('Side ' + newz._pageId + ' » ' + /(Side \d+ » )*([^»]+) ».+/.exec(document.title)[2]);
	if (/Side \d+/.exec(document.title))
		document.title = document.title.replace(/Side \d+/, "Side " + newz._pageId)
	else
		document.title = "Side " + newz._pageId + " » " + document.title;
}

function init() {
	// Røvstor streng liiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiige HER:
	$('<div/>').insertAfter('#nmTopBar').css('font-size', '1.2em').html('<input type="checkbox" id="ajaxPageChange" name="ajaxPageChange"><label for="ajaxPageChange"> ajaxPageChange</label>');
	
	$("#ajaxPageChange").bind("click", function() {
		$.Storage.set("ajaxPageChange", this.checked ? 'true' : 'false')
	})
	.attr('checked', ($.Storage.get("ajaxPageChange") == 'true'));
	
	if ($.Storage.get("ajaxPageChange") == "true")
		ajaxPageChange();
}

	function insertLoadingGif() {
		// Indsætter en loading.gif
		$('<span/>').insertAfter('.pagination').html('<div class="loading" style="float: left; margin: -2px 10px; padding: 5px; position: relative; width: 330px;"><p><img src="http://d9projects.com/loading.gif" /> Weeeeeeeeee.</p></div>');
		$(".loading").ajaxStart(function() {
			$('.pagination').hide();
			$(this).show();
		}).ajaxStop(function() {
			$(this).hide();
			$('.pagination').show();
		}).hide();
	}

function ajaxPageChange() {
	insertLoadingGif();
	
	$('.pagination a').live('click', function() {
		$.ajax({
			dataType: 'xml',
			url: "/z4/action.php",
			data: {"class":"Z4_Forum_Item", "action":"page", "id":newz._threadId, "offset":/.+\/page(\d+)/.exec(this.href)[1]},
			success: function (xml) {
				data = $("Response", xml).text();
				$("#postcontainer").html(data);
				
				// Fixer newz.dk's buggede AJAX
				$(".pagination a").each(function() {
					$(this).attr('href', /(.+)(\/page)*/.exec(window.location.href)[1] + '/page' + /\d+/.exec($(this).attr('href')));
				});
				
				// Sætter hash til første indlæg, så man kan kopiere link til den rette side -- irriterende, så nvm
				//window.location.hash = $("#comments > div:first-child h2 a:first-child").attr('name');

				// Opdaterer newz.dk's variable, så den kun henter nye indlæg, når man er på sidste side
				$(".pagination a").each(function(i) {
					// Sakset fra newz.dk's egen kode. _lastPage returneres ikke fra AJAX, så hmn kigger simpelthen alle <a>'erne igennem
					pageId = (+(this.href.substring(this.href.indexOf("page")+4)));
					if (typeof pageId != 'undefined' && pageId > newz._lastPage) {
						newz._lastPage = pageId;
					}
				});
				newz._pageId = +(/offset=(\d+)/.exec(this.url)[1]);
				if (newz._pageId == newz._lastPage) {
					newz._updateFrequency = 10000
					newz.StartAutoUpdate()
				} else
					newz.PauseAutoUpdate();
				
				// (Gen)aktiverer js for "Yderligere information", etc. ved at sætte event handlers igen (newz.dk-funktion)
				newz.UpdatePosts();
				
				fixTitle();
				insertLoadingGif();
			}
		});
		return false;
	});
}

fixTitle();
init();