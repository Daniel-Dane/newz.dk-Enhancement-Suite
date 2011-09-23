// ==UserScript==
// @name          newz.dk Enhancement Suite
// @namespace     http://www.example.com/gmscripts dunno skiftes
// @description   newz.dk er nu endnu mere perfekt!
// @include       http://newz.dk/*
// @include       http://*.newz.dk/*
// @require       jQuery
// @version       0.1
// ==/UserScript==

function init() {
	content = '<div style="font-size: 12pt"><input type="checkbox" id="kage" name="kage"><label for="kage"> test</label></div>';
	
	$(content).insertAfter('#nmTopBar');

	//if $.Storage.get("ajaxPageChange")
		ajaxPageChange();
}

function ajaxPageChange() {
	// Indsætter en loading.gif
	// Forsvinder efter første fAJAX, da den ikke er .live (jeg retter det senere)
	content = '<div class="loading" style="float: left; margin: -2px 10px; padding: 5px; position: relative; width: 330px;"><p><img src="http://d9projects.com/loading.gif" /> Weeeeeeeeee.</p></div>';
	$(content).insertAfter('.pagination');
	$(".loading").ajaxStart(function(){
		$('.pagination').hide();
		$(this).show();
	}).ajaxStop(function(){
		$(this).hide();
		$('.pagination').show();
	}).hide();
	
	$('.pagination a').live('click', function(){
		$.ajax({
			url: $(this).attr('href'),
			success: function (data) {
				//window.testa = data; // debug
				
				// Henter title (side og titel på tråd), som indsættes i <title> og <h1>
				// newz.dk sætter normalt kun side ind i <h1>, når man skifter side, tsk tsk
				re = /<title>(.+)&raquo;.+&raquo;.+<\/title>/;
				a = re.exec(data)[1];
				$("#container div h1").html(a);
				$("title").html(a);
				$("#postcontainer").html($(data).find("#postcontainer").html());
				
				// Sætter hash til første indlæg, så man kan kopiere link til den rette side
				window.location.hash = $("#comments > div:first-child h2 a:first-child").attr('name');
				
				// Opdaterer newz.dk's variable, så den kun henter nye indlæg, når man er på sidste side
				re = /_pageId = (\d+);/;
				_pageId = parseInt(re.exec(data)[1]);
				re = /_lastPage = (\d+);/;
				_lastPage = parseInt(re.exec(data)[1]);
				if (_pageId != _lastPage)
					PauseAutoUpdate()
				else
					StartAutoUpdate();
				
				// (Gen)aktiverer js for "Yderligere information", etc. ved at sætte event handlers igen (newz.dk-funktion)
				UpdatePosts();
				
				// Sætter event handles for de nye knapper -- lige meget med .live
				//ajaxPageChange();
			}
		});
		return false;
	});
}

init();