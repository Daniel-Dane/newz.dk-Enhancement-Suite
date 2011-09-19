// ==UserScript==
// @name          newz.dk Enhancement Suite
// @namespace     http://www.example.com/gmscripts dunno skiftes
// @description   newz.dk er nu endnu mere perfekt!
// @include       http://newz.dk/*
// @include       http://*.newz.dk/*
// @require       http://sites.google.com/site/daveschindler/jquery-html5-storage-plugin/jquery.Storage.js
// @version       0.1
// ==/UserScript==

function init() {
	content = '<div style="font-size: 12pt"><input type="checkbox" id="kage" name="kage"><label for="kage"> test</label></div>';
	
	$(content).insertAfter('#nmTopBar');

	if $.Storage.get("ajaxPageChange")
		ajaxPageChange();
}

function ajaxPageChange() {
	$('.pagination a').click(function(){
		$.ajax({
			url: $(this).attr('href'),
			success: function (data) {
				//window.testa = data;
				
				// Henter title (side og titel p� tr�d), som inds�ttes i <title> og <h1>
				// newz.dk s�tter normalt kun side ind i <h1>, n�r man skifter side, tsk tsk
				re = /<title>(.+)&raquo;.+&raquo;.+<\/title>/;
				a = re.exec(data)[1];
				$("#container div h1").html(a);
				$("title").html(a);
				$("#postcontainer").html($(data).find("#postcontainer").html());
				
				// (Gen)aktiverer js for "Yderligere information", etc. ved at s�tte event handlers igen (newz.dk-funktion)
				UpdatePosts();
				
				// Opdaterer newz.dk's variable, s� den kun henter nye indl�g, n�r man er p� sidste side
				re = /_pageId = (\d);/;
				_pageId = re.exec(data)[1];
				re = /_lastPage = (\d);/;
				_lastPage = re.exec(data)[1];
				
				if (_pageId != _lastPage)
					PauseAutoUpdate()
				else
					StartAutoUpdate();
				
				// S�tter event handles for de nye knapper
				ajaxPageChange();
			}
		});
		return false;
	});
}

init();