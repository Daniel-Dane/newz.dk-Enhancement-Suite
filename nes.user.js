// ==UserScript==
// @name          newz.dk Enhancement Suite
// @namespace     http://www.example.com/gmscripts dunno skiftes
// @description   newz.dk er nu endnu mere perfekt!
// @include       http://newz.dk/*
// @include       http://*.newz.dk/*
// @exclude       http://newz.dk/banner/*
// @exclude       http://*.newz.dk/banner/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @version       0.1
// ==/UserScript==

function init() {	
	$('<div/>').insertAfter('#nmTopBar').css('font-size', '12pt').html('<input type="checkbox" id="kage" name="kage"><label for="kage"> test</label>');

	//if $.Storage.get("ajaxPageChange")
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
			url: $(this).attr('href'),
			success: function (data) {
				// Henter title (side og titel på tråd), som indsættes i <title> og <h1>
				// newz.dk sætter normalt kun side ind i <h1>, når man skifter side, tsk tsk
				re = /<title>(.+)&raquo;.+&raquo;.+<\/title>/;
				a = re.exec(data)[1];
				$("#container div h1").html(a);
				$("title").html(a);
				$("#postcontainer").html($(data).find("#postcontainer").html());
				
				// Sætter hash til første indlæg, så man kan kopiere link til den rette side -- irriterende, så nvm
				//window.location.hash = $("#comments > div:first-child h2 a:first-child").attr('name');
				
				// Opdaterer newz.dk's variable, så den kun henter nye indlæg, når man er på sidste side
				re = /_pageId = (\d+);/;
				_pageId = +(re.exec(data)[1]);
				re = /_lastPage = (\d+);/;
				_lastPage = +(re.exec(data)[1]);
				if (_pageId != _lastPage)
					location.href = "javascript:void(PauseAutoUpdate());";
				else
					location.href = "javascript:void(StartAutoUpdate());";

				// (Gen)aktiverer js for "Yderligere information", etc. ved at sætte event handles igen (newz.dk-funktion)
				location.href = "javascript:void(UpdatePosts());";
				
				insertLoadingGif();
			}
		});
		return false;
	});
}

init();