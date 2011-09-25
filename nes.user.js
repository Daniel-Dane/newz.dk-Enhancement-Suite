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
	var regexMatch;
	if (regexMatch = /(Side \d+ » )*([^»]+) ».+/.exec(document.title))
		$("#container div h1").html('Side ' + newz._pageId + ' » ' + regexMatch[2]);

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
		$('<span/>').insertAfter('.pagination').html('<div class="loading" style="float: left; margin: -2px 10px; padding: 5px; position: relative; width: 330px;"><p><img src="data:image/gif;base64,R0lGODlhEAAQAPYAAP///zMzM/r6+qenp5+fn/Hx8dLS0t/f37GxsTMzM6SkpNHR0VpaWnR0dO/v77e3t6mpqfT09JqamklJScHBwba2tq6urvb29vn5+bm5udfX12lpaTw8PH9/f+Tk5Ozs7MnJyVRUVF5eXmpqatzc3M/Pz2JiYnFxcWRkZGxsbNnZ2dTU1Hp6esLCwu7u7oyMjLy8vMbGxsfHx35+fnx8fIGBgZ6enubm5peXl/z8/LS0tEZGRlZWVnd3dzY2NnJyctbW1l9fX3l5eUdHR/Ly8t7e3q+vr+fn5+rq6mZmZrq6uk9PT0xMTL6+vo6Ojm5ublxcXIeHh9ra2szMzFFRUZaWlmdnZ3Z2djo6Ojk5Ob+/v+np6W9vb/f398TExISEhIaGhuLi4rKyskFBQU5OTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/h1CdWlsdCB3aXRoIEdJRiBNb3ZpZSBHZWFyIDQuMAAh/hVNYWRlIGJ5IEFqYXhMb2FkLmluZm8AIfkECQoAAAAsAAAAABAAEAAAB2iAAIKDICImJYOJAAsSGgAhCQkoioIGDAkbHpcJKYIRiQSRHBYLIycqABgZn4IHDRMdH5QYig4UBZSKAggPuZQDkRW+ACSIoQkWw8UABQoQF8PR0qm+tIkRGdaJqqyD3SQk3tEliNPRgQAh+QQJCgAAACwAAAAAEAAQAAAHa4AAgoMHNDU3g4mKMwkJLzk6PRk5gysvGhcvjTgQOwk7MIMsCQ0yLhI2BSGNCTWDLSkxBYkVPD48MoMuMLOKMD8gisLDACUkxIIkJYLGyADKztHSgxjE1YkRGdeJGBkRit/Jx4LhxCXL08iBACH5BAkKAAAALAAAAAAQABAAAAdogACCgwIID4OIiQADCQkVACUSKokRggSNFkBBCSZFgxEZGAAFChAXOD6NRoiiiR5CQzRHiooOFES0tCAiJiWQJLkAIY0ov8EMjSnBgwsjJ5PLua2K04Kg1YIYGZWI3AAkwNbLJb7R0YEAIfkECQoAAAAsAAAAABAAEAAAB2eAAIKDhIWGgiUlh4MRgyQkAEQLTlKEERkYhQ9JCVGFmYVISk9Ti4UfMAWmhQc0NTcAJZCLMwkJL7Gzhy+2OKuCLhI2qqtGUA+fhhBLCUwwjJiFIbYJNZaOkBVMCVQyi4mCTVHev4aBACH5BAkKAAAALAAAAAAQABAAAAdogACCg4SFhoIlJYeDEYMkJIyFERkYhhgZjYSVh5uLnp+CAggPiJCLAwkJFQAlpocEqRagAAUKEBegC05FhZ2DK1ZYVryCk5UgIiYlVT6pRoSZIakoR1dZQluHDKkpAEdaH4sLIycqhoEAIfkECQoAAAAsAAAAABAAEAAAB2eAAIKDhIWGgiUlh4MRgyQkjIURGRiGGBmNhJWHm4uen4clkJ4kigCin6WgixZQD4ZdIF2DRhMJIRmERFMsGoNcCcEpBzQ1Nw9JCWCDGUMJPDIzwS8fXl8LhE1RMgAvwTirLhI2BYaBACH5BAkKAAAALAAAAAAQABAAAAdngACCg4SFhoIlJYeDEYMkJIyFERkYhhgZjYSVh5uLniAiJoqegiEJCSieJIoMpymqigsjJyqkhCtOUrYABkEcT2GWhDanHBYCCA+Cl5kAYVxZMw4DpxWCzYJbWkgABKcWuwUKEBeGgQAh+QQJCgAAACwAAAAAEAAQAAAHaIAAgoOEhYICYj1KgiUlhoJGYwlMGQAkJIMRhFwJnU+FGBmaghlkPiIyhhiFMD8xj4QHNDU3sIQznS+2JI4vnTi7ji4SNgW2hREyAseDJUIrXaqFLAkNr4Sho4JTX1NElpiC2o+NzOaBADsAAAAAAAAAAAA=" /> Weeeeeeeeee.</p></div>');
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