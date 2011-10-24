// ==UserScript==
// @name          newz.dk Enhancement Suite
// @namespace     https://github.com/Daniel-Dane/newz.dk-Enhancement-Suite/raw/master/nes.user.js
// @description   newz.dk er nu endnu mere perfekt!
// @include       http://newz.dk/*
// @include       http://*.newz.dk/*
// @exclude       http://newz.dk/banner/*
// @exclude       http://*.newz.dk/banner/*
// @version       1.1.2
// ==/UserScript==

try {
	newz = function() {
		var el = document.createElement('p');
		el.setAttribute('onclick', 'return window;');
		return el.onclick();
	}();
} catch(e) {
	newz = unsafeWindow; //unsafeWindow er kun for Greasemonkey(Firefox)
}
// Chrome understøtter ikke @include, @exclude eller @match i userscripts
if (/^http:\/\/(.+\.)?newz\.dk(?!\/banner).*$/.test(location.href)) {
	var startHash = location.hash; // Gemmer hash, hvis newz.dk AJAX'er til den rigtige side, så vi kan hoppe til det rigtige indlæg
	var startPage = newz._pageId; // Bruges af "Sideskift ved henvisning til indlæg på anden side"
	var startScroll = 0;          // Bruges også af ovenstående
	var postSortByRating = false;
	var nesVersion = 112; // Ændres her, nedenunder, i @version og "version.info"
	var nesVersionString = '1.1.2'; // Så doven er jeg...
	var lastUpdateCheck = 0;
	loadScripts();
	$(document).ready(function() {
		init();
	});
}

function init() {
	lastUpdateCheck = $.Storage.get("lastUpdateCheck");
	if (lastUpdateCheck == undefined)
		$.Storage.set("lastUpdateCheck", (lastUpdateCheck = new Date(0))+'');
	
	lastUpdateCheck = new Date(lastUpdateCheck);
	
	// NES-indstillingsboksen
	$('<div class="secondary_column" style="font-size: 1.2em; margin: 16px auto auto; float: none; padding: 0; width: 600px;" id="NES-menu" />').insertAfter('#nmTopBar')
	.html(' \
	<h3 style=\'background: url("http://newz.dk.css.zfour.dk/gfx/default/bg_h3.png") repeat-x scroll 100% 0 transparent;\'><span>newz.dk Enhancement Suite (NES)</span></h3> \
	<div style="text-align: left; padding-left: 12px;"> \
		<div style="float: right;"> \
			<button id="sortRating">Sorter indlæg efter rating</button><br> \
			<br><span style="float: right">pewbe mode: &nbsp;</span><br><select id="pewbeMode" style="float: right;"><option value="1">informativ</option><option value="2">interessant</option><option value="4">relevant</option><option value="3">sjov</option><option selected="selected" value="0">neutral</option><option value="5">gentagelse</option><option value="6">irrelevant</option><option value="7">flamebait</option></select> \
		</div> \
		<input type="checkbox" id="fixTitleSetting" name="fixTitleSetting"><label for="fixTitleSetting"> Bedre overskrifter</label><br> \
		<input type="checkbox" id="ajaxPageChange" name="ajaxPageChange"><label for="ajaxPageChange"> AJAX-sideskfit</label> \
		<div id="ajaxPageChangeSub" style="padding-left: 16px;"> \
			<input type="checkbox" id="ajaxPageChangeGoToTop" name="ajaxPageChangeGoToTop"><label for="ajaxPageChangeGoToTop"> Hop til top ved AJAX-sideskift</label><br> \
			<input type="checkbox" id="ajaxPageChangeAwesomePostChange" name="ajaxPageChangeAwesomePostChange"><label for="ajaxPageChangeAwesomePostChange"> Sideskift ved henvisning til indlæg på anden side</label> \
		</div> \
		<input type="checkbox" id="addLinkToPostReference" name="addLinkToPostReference"><label for="addLinkToPostReference"> "#tal"-henvisninger får et link (understøtter ikke <a href="http://newz.dk/~chewy">Chewy</a>)</label><br> \
		<div id="addLinkToPostReferenceSub" style="padding-left: 16px;"> \
			<input type="checkbox" id="showPostOnMouseOverReference" name="showPostOnMouseOverReference"><label for="showPostOnMouseOverReference"> Vis det refererede indlæg ved mouseover (beta)</label><br> \
			<div id="showPostOnMouseOverReferenceSub" style="padding-left: 16px;"> \
				<input type="checkbox" id="showPostOnMouseOverReferenceLeft" name="showPostOnMouseOverReferenceLeft"><label for="showPostOnMouseOverReferenceLeft"> Vis det refererede indlæg på venstre side i stedet</label><br> \
			</div> \
		</div> \
		<input type="checkbox" id="improvedQuoteSetting" name="improvedQuoteSetting"><label for="improvedQuoteSetting"> Forbedret citering af indlæg (beta)</label><br> \
		<input type="checkbox" id="applyTargetBlank" name="applyTargetBlank"><label for="applyTargetBlank"> Åbn alle links i ny fane</label> \
		<div style="margin-top: 12px;"> \
			<hr> \
			Ændringerne sættes i kraft ved næste indlæsning. Lær alt om NES på <a href="http://www.knowyournewz.dk/index.php?title=Newz.dk_Enhancement_Suite">kynz</a>! \
			<br> \
			Version ' + nesVersionString + '.<span id="updateMsg"> Sidste opdateringscheck: ' + ((lastUpdateCheck - (new Date(0)) == 0) ? 'NEVER' : lastUpdateCheck.toUTCString()) + '. <a id="updateCheck" href="#">Check efter nye opdateringer.</a></span> \
		</div> \
		<div id="updateNote" style="display: none; color: red; font-weight: bold; font-style: italic; margin-bottom: 0px; padding-bottom: 0px; text-decoration: underline; margin-left: -12px; font-size: 15px;">Ny opdatering! Ny opdatering! Ny opdatering! Ny opdatering! Ny opdatering! Ny opda</div> \
	</div> \
	').hide();
	
	// Knappen til at vise/skjule indstillingerne
	$('#nmSiteSelect').next().find('a:last').before('<a href="#" id="NES-toggle">NES-indstillinger</a> | ');
	$('#NES-toggle').click(function(e) {
		e.preventDefault();
		$('#NES-menu').toggle();
		return false;
	});
	
	// Henter indstillinger
	if (fixTitleSetting = ($.Storage.get("fixTitleSetting") == "true"))
		fixTitle();
	if (ajaxPageChangeSetting = ($.Storage.get("ajaxPageChange") == "true"))
		ajaxPageChange();
	ajaxPageChangeGoToTop = ($.Storage.get("ajaxPageChangeGoToTop") == "true");
	ajaxPageChangeAwesomePostChange = (($.Storage.get("ajaxPageChangeAwesomePostChange") == "true") && (ajaxPageChangeSetting));
	
	addLinkToPostReference = ($.Storage.get("addLinkToPostReference") == "true");
	if (showPostOnMouseOverReference = ($.Storage.get("showPostOnMouseOverReference") == "true")) {
	$("<style type='text/css'>.NES_cite{z-index: 9000; width: 651px; background-color: white; border: 1px solid black; padding: 10px 5px 1px 5px; " + (($.Storage.get("showPostOnMouseOverReferenceLeft") == "true") ? 'right: 680px;' : 'left: 400px') + "}</style>").appendTo("head");
		$('head').append($('<script>').html(' \
			function NES_showPost(me, him) { \
				var q = $("#" + him); \
				q.css("top", b = $("#" + me).offset().top - q.offset().top + "px").addClass("NES_cite"); \
			} \
			function NES_hidePost(him) { \
				$("#" + him).css("top", "").removeClass("NES_cite"); \
			} \
			function NES_goToPost(him) { \
				NES_hidePost(him); \
				var a = parseFloat($("#" + him).css("top")); \
				if (isNaN(a)) \
					a = 0; \
				$(window).scrollTop($("#" + him ).offset().top - a + 12); \
			} \
		'));
	}
	
	improvedQuoteSetting = ($.Storage.get("improvedQuoteSetting") == "true");
	if (applyTargetBlank = ($.Storage.get("applyTargetBlank") == "true"))
		$('a').attr('target', '_blank');
	
	// Event handlers til knapperne
	handlerList = ['fixTitleSetting', 'ajaxPageChange', 'ajaxPageChangeGoToTop', 'ajaxPageChangeAwesomePostChange', 'addLinkToPostReference', 'showPostOnMouseOverReference', 'showPostOnMouseOverReferenceLeft', 'improvedQuoteSetting', 'applyTargetBlank'];
	for (var i = 0; i < handlerList.length; i++) {
		$("#" + handlerList[i]).bind("click", function() {
			$.Storage.set(this.id, this.checked ? 'true' : 'false');
			updateSettingsSub();
		}).attr('checked', ($.Storage.get(handlerList[i]) == 'true'));
	}
	
	$("#sortRating").bind("click", function() {
		postSortByRating = true;
		$('.comments_new').remove();
		$(this).attr('disabled', true).text('* POOF *');
	});
	
	// Skal gøres således pga. Chrome-bug, som gør, at events (.change, .click, etc.) ikke bindes/affyres korrekt.
	$('head').append($('<script>').html(' \
		$("#sortRating").bind("click", function() { \
			$(".comment").each(function() { \
				if ($(this).find(".comment_rating_details").css("display") == "none") \
					$(this).find(".information").click(); \
			}); \
		}); \
	'));
	
	// Skal gøres således pga. Chrome-bug, som gør, at events (.change, .click, etc.) ikke bindes/affyres korrekt.
	$('head').append($('<script>').html(' \
		$("#pewbeMode").bind("change", function() { \
			var a = this.selectedIndex; \
			$(".comment_rate").each(function() { \
				this.selectedIndex = a; \
				$(this).change(); \
			}); \
		}); \
	'));
		
	$("#updateCheck").bind("click", function(e) {
		e.preventDefault();
		checkForUpdate(true);
		return false;
	});
	
	updateSettingsSub();
	
	$("<style type='text/css'>.text_content{width: 381px;}</style>").appendTo("head");
	
	
	$(document).ajaxSuccess(function(event, xhr, options) {
		// Fikser newz.dk's buggede AJAX
		if (options.url.match('class=Z4_Forum_Item&action=page') !== null) {
			if (startHash != '') {
				if ((ajaxPageChangeAwesomePostChange) && (startPage == newz._pageId))
					$(newz).scrollTop(startScroll);
				else {
					$(newz).scrollTop($('.comment a[name=' + startHash + ']').offset().top);
					location.hash = startHash;
				}
				
				startHash = '';
			} else {
				if (ajaxPageChangeGoToTop)
					$(newz).scrollTop(0);
				
				// Sætter hash til første indlæg, så man kan kopiere link til den rette side
				var firstChild = $("#comments > div:first-child h2 a:first-child");
				var firstChildName = firstChild.attr('name');
				firstChild.attr('name', '');
				location.hash = firstChildName;
				firstChild.attr('name', firstChildName);
			}
			
			$(".loading").hide();
			$('.pagination').show();
			
			href = getUrl();
			
			$(".pagination a").each(function() {
				$(this).attr('href', href + '/page' + /#page(\d+)/.exec($(this).attr('href'))[1]);
			});
			
			if (fixTitleSetting)
				fixTitle();
			if (ajaxPageChangeSetting)
				insertLoadingGif();
			fixPosts();
			
			$("#sortRating").attr('disabled', false).text('Sorter indlæg efter rating');
		}
		
		// Sætter fix og such til det umiddelbart indsendte indlæg. Der _skal_ bruges options.data, da det er POST
		// ||
		// Efter den løbende AJAX-indhentning af nye indlæg
		if ((options.data.match('class=Z4_Forum_Item&action=usersave') !== null) || (options.url.match('class=Z4_Forum_Item&action=new') !== null)) {
			var a = $('#comments > div:last');
			if (a.text().trim() != '')
				fixPosts(a);
		}
		
		// Preview
		if (options.data.match('class=Z4_Forum_Item&action=preview') !== null)
			fixPosts($('#post_preview .content'))
	});

	$(document).ajaxStop(function() {
		if (postSortByRating) {
			postSortByRating = false;
			var point = new Array();
			point[1] = 2;
			point[2] = 1;
			point[4] = 1;
			point[3] = 0;
			point[5] = 0;
			point[6] = -1;
			point[7] = -2;
			
			var el = $('#comments');
			var list = $('.comment');
			var rating = new Array();
			
			$('.comment').each(function() {
				var p = 0;
				$(this).find('.comment_rating_details tbody tr').each(function() {
					p += point[+this.id.substr(7)]
				});
				$(this).find('.rating_name').append(' (' + p + ')');
				rating[this.id] = p;
			});
			
			list.sort(function(a, b) {
				return (rating[a.id] == rating[b.id]) ? 0 : ((rating[a.id] < rating[b.id]) ? 1 : -1);
			});
			
			el.append(list);
			
			$('.comment').each(function() {
				if ($(this).find('.comment_rating_details').css('display') != 'none')
					$(this).find('.information').click();
			});
		}
	});
	
	if (ajaxPageChangeAwesomePostChange) {
		$(newz).bind('hashchange', function() {
			if ((location.hash == '') || (location.hash == '#new'))
				var a = 50 * (startPage - 1) + 1;
			else	
				var a = +location.hash.substr(1);
			
			if (!isNaN(a) && (a > 0) && (a <= 50 * (newz._lastPage - 1) + 50) && ((a <= 50 * (newz._pageId - 1)) || (a > 50 * (newz._pageId - 1) + 50))) {
				if (startPage == newz._pageId)
					startScroll = $(newz).scrollTop();
				
				// Hopper til top, så brugeren ved, at der skiftes side
				$(newz).scrollTop(0);
				
				$('.pagination').hide();
				$(".loading").show();
				
				// Sørger for, at ajaxSuccess ikke hopper forkert
				startHash = a;
				
				// Copypasta fra ajaxPageChange() med <s>modifikationer</s> én modifikation... Hmm... Jeg laver det nok om til en funktion senere hen
				$.ajax({
					dataType: 'xml',
					url: "/z4/action.php",
					data: {"class":"Z4_Forum_Item", "action":"page", "id":newz._threadId, "offset":Math.ceil(a / newz._pageSize)},
					success: function (xml) {
						$("#postcontainer").html($("Response", xml).text());
						
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
							newz._updateFrequency = 10000;
							newz.StartAutoUpdate();
						} else
							newz.PauseAutoUpdate();
						
						// (Gen)aktiverer js for "Yderligere information", etc. ved at sætte event handlers igen (newz.dk-funktion)
						newz.UpdatePosts();
					}
				});
			}
		});
	}
	
	// I store tråde ender man nogle gange (hvis den sidste side er på 50 indlæg) en side for langt
	if (newz._pageId > newz._lastPage)
		newz.ReceiveData(newz._lastPage);
	else
		fixPosts();
	
	checkForUpdate(false);
	
	/*
	// Det virker sgu. HUSK: Scope er i window (altså uden for nes).
	$('head').append($('<script>').html(' \
		OldSubmitPost = SubmitPost; \
		SubmitPost = function(instantSubmitNew) {alert(instantSubmitNew); OldSubmitPost(instantSubmitNew)} \
	'));
	*/
	
	// Fix af "Sorter indlæg efter rating", så den finder det nyeste indlæg det rigtige sted.
	$('head').append($('<script>').html(' \
		if (typeof GetLastPostId != "undefined") { \
			OldGetLastPostId = GetLastPostId; \
			GetLastPostId = function() { \
				if ($("#sortRating").text() == "* POOF *") { \
					var maxid = 0; \
					$(".comment").each(function() { \
						var id = this.id.substr(4); \
						if (id > maxid) \
							maxid = id; \
					}); \
					return maxid; \
				} else \
					return OldGetLastPostId(); \
			} \
		} \
	'));
}

// Køres ved indlæsning, AJAX-sideskift, indsendelse af indlæg og ved den løbende AJAX-indhentning af nye indlæg
function fixPosts(object) {
	if (typeof object == "undefined")
		object = document;
	
	improvedQuote(object);
	addPermLink(object);
	if (applyTargetBlank)
		$('a', object).attr('target', '_blank');
	addMiniQuote(object);
	addLinkToPostReferenceFunc(object);
}

// Advarsel: Tåler ikke at blive kørt flere gange for samme indlæg, men det burde ikke være noget problem endnu
function addMiniQuote(object) {
	$('.quoteitemNES', object).after(' (<a href="#" class="miniquote">miniquote</a>)');
	$('.miniquote', object).bind('click', function(e) {
		e.preventDefault();
		
		// Hvis dette ligner noget kode fra newz.dk, så er det, fordi det er.
		var comment = $("#id_comment").val();
		if (comment.length > 0) {
			comment += "\n\n";
		}
		
		comment += "#" + $(this).parents(".comment").find("h2 a").attr("name") + "\n";
		$("#id_comment").val(comment);
		
		$('#id_comment').keyup();
		return false;
	});	
}

function addLinkToPostReferenceFunc(object) {
	if (addLinkToPostReference) {
		$('.comment .text_content p:contains("#")', object).each(function() {
			$(this.childNodes).each(function() {
				if (this.nodeType == 3) {
					var p = $(this).parents('.comment').attr('id');
					if ($(this).parents('#post_preview').length == 1)
						p = 'post_preview';
					// #tal efterfulgt af enten mellemrum, linjeknæk, kolon, komma eller punktum samt ved afsluttet afsnit eller linje
					$(this).replaceWith(this.nodeValue.replace(/#(\d+)( |<br>|:|,|\.|<\/p>|$)/gm, function(str, a, b) {
						if (a < 100)
							c = Math.floor((50 * (newz._pageId - 1)) / 100) * 100 + +a;
						else
							c = a;
						var him = $('.comment:has(a[name=' + c + '])').attr('id');
						return '<a' + (((showPostOnMouseOverReference) && ((c > 50 * (newz._pageId - 1)) && (c <= 50 * (newz._pageId - 1) + 50))) ? ' onclick="NES_goToPost(\'' + him + '\')" onmouseout="NES_hidePost(\'' + him + '\')" onmouseover="NES_showPost(\'' + p + '\', \'' + him + '\')"' : ' onclick="return true;"') + ' href="#' + c + '">#' + a + '</a>' + b;
					}).replace(/&/gm, '&amp;'));
				}
			});
		});
	}
}

function checkForUpdate(userCalled) {
	var checkDate = new Date();
	checkDate.setDate(checkDate.getDate() - 1); // 1 dag
	
	if ((userCalled) || (checkDate > lastUpdateCheck)) {
		$.Storage.set("lastUpdateCheck", (lastUpdateCheck = new Date())+'');
		// Hvis der aldrig er blevet checket efter en opdatering, vil det selvfølgelig gøres nu, og i så fald vil "NEVER" aldrig dukke op, hvis auto-update-check virker.
		$('#updateMsg').text(' Sidste opdateringscheck: ' + lastUpdateCheck.toUTCString() + '.');

		$.getScript('https://raw.github.com/Daniel-Dane/newz.dk-Enhancement-Suite/master/version.info', function() {
			if (newz.nes_version > nesVersion) {
				$('#updateNote').attr('direction', 'up').show().attr('direction', 'right');
				$('#updateMsg').html(' <a href="https://github.com/Daniel-Dane/newz.dk-Enhancement-Suite/raw/master/nes.user.js">HENT MIG, HENT MIG, HENT MIG, HENT MIG, HENT MIG, HENT MIG, HENT MIG.</a>');
				if (!userCalled)
					$('#NES-menu').show();
			} else {
				if (userCalled)
					$('#updateMsg').text(' Nyeste version.');
			}
		});
	}
}

function updateSettingsSub() {
	$('#ajaxPageChangeSub input').attr('disabled', !$('#ajaxPageChange').attr('checked'));
	$('#addLinkToPostReferenceSub > input').attr('disabled', !$('#addLinkToPostReference').attr('checked'));
	$('#showPostOnMouseOverReferenceSub input').attr('disabled', (!$('#showPostOnMouseOverReference').attr('checked') || !$('#addLinkToPostReference').attr('checked')));
}

function addPermLink(object) {
	href = getUrl();
	
	$('.comment h2', object).each(function() {
		var a = $(this).html();
		a = a.replace(/#(\d+):/, '<a href="' + href + '/page' + newz._pageId + '#$1">#$1:</a>')
		$(this).html(a);
	});	
}

// Advarsel: Tåler ikke at blive kørt flere gange for samme indlæg, men det burde ikke være noget problem endnu
// Sætter event handler på "Citer indlæg" - Sakset direkte fra newz.dk med vigtige ændringer. Jeg har ladet mine kommentarer fra newz.dk's script lade blive.
function improvedQuote(object) {
	// newz.dk unbinder selv efterfølgende, så vi bliver nødt til at omdøbe class (faktisk fjerne den pga. Chrome-bug)
	$(".quoteitem", object).replaceWith('<a href="#" class="quoteitemNES">Citer indlæg</a>');
	$(".quoteitemNES", object).bind("click", function(e) {
		e.preventDefault();
		
		// Finder indlæggets id (ikke nummer)
		var $post = $(this).parents(".comment");
		var postId = $post.attr("id").substring(4);
		
		// Finder indlæggets nummer (ikke id)
		var itemId = $post.find("h2 a").attr("name");
		
		// Finder indlæggets ejermand (den som prutten ikke lugte kan)
		var username = $post.find("h2 a:last").html();
		
		// Hvis den ikke kunne findes, prøv et andet sted (dunno hvor)
		if (!username) {
			username = $post.find('.right_box a:last').html();
		}
		
		// Bliver false, hvis improvedQuoteSetting eller den originale synes, at den sagtens kan klare markeringen
		var hentFraServer = true;
		
		// Jeg bruger ikke document.selection, som andre browsere (IE, gammel IE, Opera?) bruger, så det må du ordne, m910q.
		// Checker, om markeringen er inden for indlæggets tekst. Virker i Firefox og Chrome.
		if (improvedQuoteSetting) {
			if ((newz.getSelection().rangeCount > 0) && ($(newz.getSelection().getRangeAt(0).commonAncestorContainer).parents('#' + $post.attr("id")).length > 0)) {
				// Dette kan sikkert reduceres til noget pænere...
				sel = newz.getSelection();
				var container = document.createElement("div");
				container.appendChild(sel.getRangeAt(0).cloneContents());
				html = container.innerHTML;
				
				if (html != '') {
					hentFraServer = false;
				
					html = html.replace(/\<\/p\>\<p\>/g, "\n\n");
					html = html.replace(/\<br\>/g, "\n");
					
					html = html.replace(/\<strong\>/g, "[b]");
					html = html.replace(/\<\/strong\>/g, "[/b]");
					
					html = html.replace(/\<em\>/g, "[i]");
					html = html.replace(/\<\/em\>/g, "[/i]");
					
					html = html.replace(/\<u\>/g, "[u]");
					html = html.replace(/\<\/u\>/g, "[/u]");
					
					html = html.replace(/\<s\>/g, "[s]");
					html = html.replace(/\<\/s\>/g, "[/s]");
					
					// Denne del skal stadig forbedres
					html = html.replace(/\<code\>/g, "\n"); // Skal laves om til en ordentlig [code]
					html = html.replace(/\<blockquote\>/g, "\n"); // Skal laves om til en ordentlig [quote] -- Stort arbejde. Jeg har prøvet.
					// Denne del skal stadig forbedres
					
					// Skal være efter [quote]
					html = html.replace(/\<a href="(.+?)"\>(.+?)(\.\.)?\<\/a\>/g, '[url=$1]$2[/url]') // til url i [url]
					// Ovenstående matcher også url uden [url] og giver dem en [url]. Det skal ændres. Jeg har prøvet.
					
					// Stripper resten af html'et
					html = html.replace(/\<(.*?)\>/g, "");
					html = html.replace(/\<\/(.*?)\>/g, "");
					
					// Entity decode
					html = Encoder.htmlDecode(html);
					
					// Finder kommentarfeltet og indsætter et linjeknæk før det citerede indlæg, hvis feltet ikke er tomt
					var comment = $("#id_comment").val();
					if (comment.length > 0) {
						comment += "\n\n";
					}
					
					// Sætter indlægget ind i en quote, som vi kender den
					comment += "[quote=" + username + " (" + itemId + ")]" + html + "[/quote]" + "\n\n";
					$("#id_comment").val(comment);
				}
			}
		} else {
			// Finder ud af, om der er noget, som er markeret
			try {
				if (typeof (newz.getSelection) != 'undefined') {
					var select_string = newz.getSelection();
				} else if (document.selection) {
					var select_string = document.selection.createRange().text;
				} else {
					var select_string = '';
				}
			}
			catch(e) {
				var select_string = '';
			}
			
			// Læg venligst mærke til, at konvertering til [b] og deslige er udeladt (WTF)
			var posttext = $post.find('.comment_content').html();
			posttext = posttext.replace(/\<\/p\>\<p\>/g, "\n\n");
			posttext = posttext.replace(/\<br\>/g, "\n");
			posttext = posttext.replace(/\<code\>/g, "\n");
			posttext = posttext.replace(/\<blockquote\>/g, "\n");
			posttext = posttext.replace(/\<([a-z]+)\>/g, "");
			posttext = posttext.replace(/\<\/([a-z]+)\>/g, "");
			
			if (select_string != '' && posttext.indexOf(select_string) == -1) {
				select_string = '';
			}
			
			if (select_string != '')  {
				hentFraServer = false;
			
				var comment = $("#id_comment").val();
				if (comment.length > 0) {
					comment+="\n\n";
				}
				comment += "[quote=" + username + " (" + itemId + ")]" + select_string + "[/quote]" + "\n\n";
				$("#id_comment").val(comment);
			}
		}
		
		if (hentFraServer) {
			$.get("/z4/action.php", {"class":"Z4_Forum_Item", "action":"getRaw", "id":postId}, function(xml) {
				var text = $.trim($("Response", xml).text());
				
				// Fjerner flere end ét efter hinanden følgende linjeknæk
				text = $.trim(text.replace("\n\n\n\n", "\n\n"));
				
				// Finder kommentarfeltet og indsætter et linjeknæk før det citerede indlæg, hvis feltet ikke er tomt
				var comment = $("#id_comment").val();
				if (comment.length > 0) {
					comment += "\n\n";
				}
				
				// Sætter indlægget ind i en quote, som vi kender den
				comment += "[quote=" + username + " (" + itemId + ")]" + text + "[/quote]" + "\n\n";
				$("#id_comment").val(comment);
				
				$('#id_comment').keyup();
			}
			, "xml");
		}
		
		$('#id_comment').keyup();
		return false;
	});
}

// Sætter en ordentlig overskrift på tråden
// newz.dk sætter normalt kun side-nr. ind i <h1>, når man skifter side, tsk tsk
function fixTitle() {
	if (newz._lastPage > 1) {
		var regexMatch;
		if (regexMatch = /(Side \d+ » )*([^»]+) ».+/.exec(document.title))
			$("#container div h1").html('Side ' + newz._pageId + ' » ' + regexMatch[2]);

		if (/Side \d+/.test(document.title))
			document.title = document.title.replace(/Side \d+/, "Side " + newz._pageId);
		else
			document.title = "Side " + newz._pageId + " » " + document.title;
	}
}

function insertLoadingGif() {
	// Indsætter en loading.gif
	$('<span/>').insertAfter('.pagination').html('<div class="loading" style="float: left; margin: -2px 10px; padding: 5px; position: relative; width: 330px;"><p><img src="data:image/gif;base64,R0lGODlhEAAQAPYAAP///zMzM/r6+qenp5+fn/Hx8dLS0t/f37GxsTMzM6SkpNHR0VpaWnR0dO/v77e3t6mpqfT09JqamklJScHBwba2tq6urvb29vn5+bm5udfX12lpaTw8PH9/f+Tk5Ozs7MnJyVRUVF5eXmpqatzc3M/Pz2JiYnFxcWRkZGxsbNnZ2dTU1Hp6esLCwu7u7oyMjLy8vMbGxsfHx35+fnx8fIGBgZ6enubm5peXl/z8/LS0tEZGRlZWVnd3dzY2NnJyctbW1l9fX3l5eUdHR/Ly8t7e3q+vr+fn5+rq6mZmZrq6uk9PT0xMTL6+vo6Ojm5ublxcXIeHh9ra2szMzFFRUZaWlmdnZ3Z2djo6Ojk5Ob+/v+np6W9vb/f398TExISEhIaGhuLi4rKyskFBQU5OTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/h1CdWlsdCB3aXRoIEdJRiBNb3ZpZSBHZWFyIDQuMAAh/hVNYWRlIGJ5IEFqYXhMb2FkLmluZm8AIfkECQoAAAAsAAAAABAAEAAAB2iAAIKDICImJYOJAAsSGgAhCQkoioIGDAkbHpcJKYIRiQSRHBYLIycqABgZn4IHDRMdH5QYig4UBZSKAggPuZQDkRW+ACSIoQkWw8UABQoQF8PR0qm+tIkRGdaJqqyD3SQk3tEliNPRgQAh+QQJCgAAACwAAAAAEAAQAAAHa4AAgoMHNDU3g4mKMwkJLzk6PRk5gysvGhcvjTgQOwk7MIMsCQ0yLhI2BSGNCTWDLSkxBYkVPD48MoMuMLOKMD8gisLDACUkxIIkJYLGyADKztHSgxjE1YkRGdeJGBkRit/Jx4LhxCXL08iBACH5BAkKAAAALAAAAAAQABAAAAdogACCgwIID4OIiQADCQkVACUSKokRggSNFkBBCSZFgxEZGAAFChAXOD6NRoiiiR5CQzRHiooOFES0tCAiJiWQJLkAIY0ov8EMjSnBgwsjJ5PLua2K04Kg1YIYGZWI3AAkwNbLJb7R0YEAIfkECQoAAAAsAAAAABAAEAAAB2eAAIKDhIWGgiUlh4MRgyQkAEQLTlKEERkYhQ9JCVGFmYVISk9Ti4UfMAWmhQc0NTcAJZCLMwkJL7Gzhy+2OKuCLhI2qqtGUA+fhhBLCUwwjJiFIbYJNZaOkBVMCVQyi4mCTVHev4aBACH5BAkKAAAALAAAAAAQABAAAAdogACCg4SFhoIlJYeDEYMkJIyFERkYhhgZjYSVh5uLnp+CAggPiJCLAwkJFQAlpocEqRagAAUKEBegC05FhZ2DK1ZYVryCk5UgIiYlVT6pRoSZIakoR1dZQluHDKkpAEdaH4sLIycqhoEAIfkECQoAAAAsAAAAABAAEAAAB2eAAIKDhIWGgiUlh4MRgyQkjIURGRiGGBmNhJWHm4uen4clkJ4kigCin6WgixZQD4ZdIF2DRhMJIRmERFMsGoNcCcEpBzQ1Nw9JCWCDGUMJPDIzwS8fXl8LhE1RMgAvwTirLhI2BYaBACH5BAkKAAAALAAAAAAQABAAAAdngACCg4SFhoIlJYeDEYMkJIyFERkYhhgZjYSVh5uLniAiJoqegiEJCSieJIoMpymqigsjJyqkhCtOUrYABkEcT2GWhDanHBYCCA+Cl5kAYVxZMw4DpxWCzYJbWkgABKcWuwUKEBeGgQAh+QQJCgAAACwAAAAAEAAQAAAHaIAAgoOEhYICYj1KgiUlhoJGYwlMGQAkJIMRhFwJnU+FGBmaghlkPiIyhhiFMD8xj4QHNDU3sIQznS+2JI4vnTi7ji4SNgW2hREyAseDJUIrXaqFLAkNr4Sho4JTX1NElpiC2o+NzOaBADsAAAAAAAAAAAA=" /> Weeeeeeeeee.</p></div>');
	$(".loading").hide();
}

function ajaxPageChange() {
	if (
		(location.pathname.indexOf('/om-os/statistik/') == 0) ||         // Slå fra under statistikker
		(/^.*newz.dk(\/)?(page\d+)?$/.test(location.href)) ||            // Slå fra på forsiden
		(/\/rating(time|selftime|total|self)\//.test(location.pathname)) // Slå fra under vurderingsfordelingslisterne
	)
		return;

	insertLoadingGif();
	
	$('.pagination a').live('click', function(e) {
		e.preventDefault();
		$('.pagination').hide();
		$(".loading").show();
		
		startHash = '';
		
		$.ajax({
			dataType: 'xml',
			url: "/z4/action.php",
			data: {"class":"Z4_Forum_Item", "action":"page", "id":newz._threadId, "offset":/page(\d+)$/.exec(this.href)[1]},
			success: function (xml) {
				$("#postcontainer").html($("Response", xml).text());
				
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
					newz._updateFrequency = 10000;
					newz.StartAutoUpdate();
				} else
					newz.PauseAutoUpdate();
				
				// (Gen)aktiverer js for "Yderligere information", etc. ved at sætte event handlers igen (newz.dk-funktion)
				newz.UpdatePosts();
			}
		});
		return false;
	});
}

function getUrl() {
	if ((a = location.href.indexOf('#')) == -1)
		var href = location.href;
	else
		var href = location.href.substr(0, a);
	
	if ((a = href.indexOf('/page')) != -1)
		var href = href.substr(0, a);
	
	return href;
}

//
// Eksterne scripts
//
function loadScripts() {
	$ = newz.$;
	jQuery = newz.jQuery;
	
	/**
	 * Storage plugin
	 * @author Dave Schindler
	 *
	 * Distributed under the MIT License
	 *
	 * Copyright (c) 2010 Dave Schindler
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
	 with (newz) {
		(function($) {
			var isLS=typeof window.localStorage!=='undefined';
			function wls(n,v){var c;if(typeof n==="string"&&typeof v==="string"){localStorage[n]=v;return true;}else if(typeof n==="object"&&typeof v==="undefined"){for(c in n){if(n.hasOwnProperty(c)){localStorage[c]=n[c];}}return true;}return false;}
			function wc(n,v){var dt,e,c;dt=new Date();dt.setTime(dt.getTime()+31536000000);e="; expires="+dt.toGMTString();if(typeof n==="string"&&typeof v==="string"){document.cookie=n+"="+v+e+"; path=/";return true;}else if(typeof n==="object"&&typeof v==="undefined"){for(c in n) {if(n.hasOwnProperty(c)){document.cookie=c+"="+n[c]+e+"; path=/";}}return true;}return false;}
			function rls(n){return localStorage[n];}
			function rc(n){var nn, ca, i, c;nn=n+"=";ca=document.cookie.split(';');for(i=0;i<ca.length;i++){c=ca[i];while(c.charAt(0)===' '){c=c.substring(1,c.length);}if(c.indexOf(nn)===0){return c.substring(nn.length,c.length);}}return null;}
			function dls(n){return delete localStorage[n];}
			function dc(n){return wc(n,"",-1);}

			$.extend({
				Storage: {
					set: isLS ? wls : wc,
					get: isLS ? rls : rc,
					remove: isLS ? dls :dc
				}
			});
		})(jQuery);
	}
	
	/**
	 * A Javascript object to encode and/or decode html characters
	 * @Author R Reid
	 * source: http://www.strictly-software.com/htmlencode
	 * Licence: GPL
	 * 
	 * Revision:
	 *  2011-07-14, Jacques-Yves Bleau: 
	 *       - fixed conversion error with capitalized accentuated characters
	 *       + converted arr1 and arr2 to object property to remove redundancy
	 */
	if ($.Storage.get("improvedQuoteSetting") == "true") {
		Encoder={EncodeType:"entity",isEmpty:function(val){if(val){return((val===null)||val.length==0||/^\s+$/.test(val))}else{return true}},arr1:new Array('&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&Aelig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&Oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&oelig;','&oelig;','&scaron;','&scaron;','&yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'),arr2:new Array('&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'),HTML2Numerical:function(s){return this.swapArrayVals(s,this.arr1,this.arr2)},NumericalToHTML:function(s){return this.swapArrayVals(s,this.arr2,this.arr1)},numEncode:function(s){if(this.isEmpty(s))return"";var e="";for(var i=0;i<s.length;i++){var c=s.charAt(i);if(c<" "||c>"~"){c="&#"+c.charCodeAt()+";"}e+=c}return e},htmlDecode:function(s){var c,m,d=s;if(this.isEmpty(d))return"";d=this.HTML2Numerical(d);arr=d.match(/&#[0-9]{1,5};/g);if(arr!=null){for(var x=0;x<arr.length;x++){m=arr[x];c=m.substring(2,m.length-1);if(c>=-32768&&c<=65535){d=d.replace(m,String.fromCharCode(c))}else{d=d.replace(m,"")}}}return d},htmlEncode:function(s,dbl){if(this.isEmpty(s))return"";dbl=dbl||false;if(dbl){if(this.EncodeType=="numerical"){s=s.replace(/&/g,"&#38;")}else{s=s.replace(/&/g,"&amp;")}}s=this.XSSEncode(s,false);if(this.EncodeType=="numerical"||!dbl){s=this.HTML2Numerical(s)}s=this.numEncode(s);if(!dbl){s=s.replace(/&#/g,"##AMPHASH##");if(this.EncodeType=="numerical"){s=s.replace(/&/g,"&#38;")}else{s=s.replace(/&/g,"&amp;")}s=s.replace(/##AMPHASH##/g,"&#")}s=s.replace(/&#\d*([^\d;]|$)/g,"$1");if(!dbl){s=this.correctEncoding(s)}if(this.EncodeType=="entity"){s=this.NumericalToHTML(s)}return s},XSSEncode:function(s,en){if(!this.isEmpty(s)){en=en||true;if(en){s=s.replace(/\'/g,"&#39;");s=s.replace(/\"/g,"&quot;");s=s.replace(/</g,"&lt;");s=s.replace(/>/g,"&gt;")}else{s=s.replace(/\'/g,"&#39;");s=s.replace(/\"/g,"&#34;");s=s.replace(/</g,"&#60;");s=s.replace(/>/g,"&#62;")}return s}else{return""}},hasEncoded:function(s){if(/&#[0-9]{1,5};/g.test(s)){return true}else if(/&[A-Z]{2,6};/gi.test(s)){return true}else{return false}},stripUnicode:function(s){return s.replace(/[^\x20-\x7E]/g,"")},correctEncoding:function(s){return s.replace(/(&amp;)(amp;)+/,"$1")},swapArrayVals:function(s,arr1,arr2){if(this.isEmpty(s))return"";var re;if(arr1&&arr2){if(arr1.length==arr2.length){for(var x=0,i=arr1.length;x<i;x++){re=new RegExp(arr1[x],'g');s=s.replace(re,arr2[x])}}}return s},inArray:function(item,arr){for(var i=0,x=arr.length;i<x;i++){if(arr[i]===item){return i}}return-1}}
	}
}