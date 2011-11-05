/**
 @name           newz.dk Enhancement Suite
 @url            https://raw.github.com/Daniel-Dane/newz.dk-Enhancement-Suite/master/nes.js
*/
var NES_version = "2.0 beta";
var NES_loaded = NES_loaded || false;

// Følgende indsættes i indstillinger -> stylesheet
// " /><script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script><script type="text/javascript" src="https://raw.github.com/Daniel-Dane/newz.dk-Enhancement-Suite/master/nes.js"></script><link rel="stylesheet

if (!$) {
	// Rækkefølgen af scripts er ikke altid den samme (tak for lort, HTML5, IE og Webkit).
	// Når jQuery er cached, burde det ikke være noget problem.
	alert('Opdatér (F5, men IKKE Ctrl+F5) lige. Får du denne pop-up flere gange, skal du fjerne NES og fortælle os det.');
} else {
	if ((typeof localStorage === 'undefined') || (typeof window.history.pushState === 'undefined')) {
		$(document).ready(function () {
			$('#nmSiteSelect').next().find('a:last').before('Failbrowser. NES kan ikke køre her. | ');
		});
	} else {
		if ((/^http:\/\/(.+\.)?newz\.dk(?!\/banner).*$/.test(location.href)) && (!NES_loaded)) {
			NES_loaded = true;
			var NES_startHash = location.hash;  // Gemmer hash, hvis newz.dk AJAX'er til den rigtige side, så vi kan hoppe til det rigtige indlæg
			var NES_postSortByRating = false;   // true, når der er trykket på "Sorter indlæg efter rating"
			$(document).ready(function () {
				NES_init();
			});
		}
	}
}

function NES_init() {
	// NES-indstillingsboksen
	$('<div class="secondary_column" style="font-size: 1.2em; margin: 16px auto auto; float: none; padding: 0; width: 600px;" id="NES-menu" />').insertAfter('#nmTopBar')
	.html(' \
	<h3 style=\'background: url("http://newz.dk.css.zfour.dk/gfx/default/bg_h3.png") repeat-x scroll 100% 0 transparent;\'><span>newz.dk Enhancement Suite (NES)</span></h3> \
	<div style="text-align: left; padding-left: 12px;"> \
		<div style="float: right;"> \
			<button id="sortRating">Sorter indlæg efter rating</button><br> \
			<br><span style="float: right">pewbe mode: &nbsp;</span><br><select id="pewbeMode" style="float: right;"><option value="1">informativ</option><option value="2">interessant</option><option value="4">relevant</option><option value="3">sjov</option><option selected="selected" value="0">neutral</option><option value="5">gentagelse</option><option value="6">irrelevant</option><option value="7">flamebait</option></select> \
		</div> \
		<input type="checkbox" id="addLinkToPostReference" name="addLinkToPostReference"><label for="addLinkToPostReference"> "#tal"-henvisninger får et link</label><br> \
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
			Ændringerne sættes i kraft ved næste indlæsning. Lær alt om NES på <a href="http://www.knowyournewz.dk/index.php?title=Newz.dk_Enhancement_Suite">kynz</a>! Version ' + NES_version + '. \
		</div> \
	</div> \
	').hide();
	
	// "NES-indstillinger"-knappen
	$('#nmSiteSelect').next().find('a:last').before('<a href="#" id="NES-toggle">NES-indstillinger</a> | ');
	$('#NES-toggle').click(function (e) {
		e.preventDefault();
		$('#NES-menu').toggle();
		return false;
	});
	
	// Henter indstillinger
	addLinkToPostReference = (localStorage["addLinkToPostReference"] == "true");
	if (showPostOnMouseOverReference = (localStorage["showPostOnMouseOverReference"] == "true")) {
		$("<style type='text/css'>.NES_cite{z-index: 9000; width: 651px; background-color: white; border: 1px solid black; padding: 10px 5px 1px 5px; " + ((localStorage["showPostOnMouseOverReferenceLeft"] == "true") ? 'right: 680px;' : 'left: 400px') + "}</style>").appendTo("head");
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
	if (improvedQuoteSetting = (localStorage["improvedQuoteSetting"] == "true")) {
		/**
		 * A Javascript object to encode and/or decode html characters
		 * @Author R Reid
		 * source: http://www.strictly-software.com/htmlencode
		 * Licence: GPL
		 */
		Encoder={EncodeType:"entity",isEmpty:function(val){if(val){return((val===null)||val.length==0||/^\s+$/.test(val))}else{return true}},arr1:new Array('&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&Aelig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&Oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&oelig;','&oelig;','&scaron;','&scaron;','&yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'),arr2:new Array('&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'),HTML2Numerical:function(s){return this.swapArrayVals(s,this.arr1,this.arr2)},NumericalToHTML:function(s){return this.swapArrayVals(s,this.arr2,this.arr1)},numEncode:function(s){if(this.isEmpty(s))return"";var e="";for(var i=0;i<s.length;i++){var c=s.charAt(i);if(c<" "||c>"~"){c="&#"+c.charCodeAt()+";"}e+=c}return e},htmlDecode:function(s){var c,m,d=s;if(this.isEmpty(d))return"";d=this.HTML2Numerical(d);arr=d.match(/&#[0-9]{1,5};/g);if(arr!=null){for(var x=0;x<arr.length;x++){m=arr[x];c=m.substring(2,m.length-1);if(c>=-32768&&c<=65535){d=d.replace(m,String.fromCharCode(c))}else{d=d.replace(m,"")}}}return d},htmlEncode:function(s,dbl){if(this.isEmpty(s))return"";dbl=dbl||false;if(dbl){if(this.EncodeType=="numerical"){s=s.replace(/&/g,"&#38;")}else{s=s.replace(/&/g,"&amp;")}}s=this.XSSEncode(s,false);if(this.EncodeType=="numerical"||!dbl){s=this.HTML2Numerical(s)}s=this.numEncode(s);if(!dbl){s=s.replace(/&#/g,"##AMPHASH##");if(this.EncodeType=="numerical"){s=s.replace(/&/g,"&#38;")}else{s=s.replace(/&/g,"&amp;")}s=s.replace(/##AMPHASH##/g,"&#")}s=s.replace(/&#\d*([^\d;]|$)/g,"$1");if(!dbl){s=this.correctEncoding(s)}if(this.EncodeType=="entity"){s=this.NumericalToHTML(s)}return s},XSSEncode:function(s,en){if(!this.isEmpty(s)){en=en||true;if(en){s=s.replace(/\'/g,"&#39;");s=s.replace(/\"/g,"&quot;");s=s.replace(/</g,"&lt;");s=s.replace(/>/g,"&gt;")}else{s=s.replace(/\'/g,"&#39;");s=s.replace(/\"/g,"&#34;");s=s.replace(/</g,"&#60;");s=s.replace(/>/g,"&#62;")}return s}else{return""}},hasEncoded:function(s){if(/&#[0-9]{1,5};/g.test(s)){return true}else if(/&[A-Z]{2,6};/gi.test(s)){return true}else{return false}},stripUnicode:function(s){return s.replace(/[^\x20-\x7E]/g,"")},correctEncoding:function(s){return s.replace(/(&amp;)(amp;)+/,"$1")},swapArrayVals:function(s,arr1,arr2){if(this.isEmpty(s))return"";var re;if(arr1&&arr2){if(arr1.length==arr2.length){for(var x=0,i=arr1.length;x<i;x++){re=new RegExp(arr1[x],'g');s=s.replace(re,arr2[x])}}}return s},inArray:function(item,arr){for(var i=0,x=arr.length;i<x;i++){if(arr[i]===item){return i}}return-1}}
	}
	applyTargetBlank = (localStorage["applyTargetBlank"] == "true");
	
	// Event handlers til knapperne
	handlerList = ['addLinkToPostReference', 'showPostOnMouseOverReference', 'showPostOnMouseOverReferenceLeft', 'improvedQuoteSetting', 'applyTargetBlank'];
	for (var i = 0; i < handlerList.length; i++) {
		$("#" + handlerList[i]).bind("click", function() {
			localStorage[this.id] = this.checked ? 'true' : 'false';
			NES_updateSettingsSub();
		}).attr('checked', (localStorage[handlerList[i]] == 'true'));
	}
	$("#sortRating").bind("click", function() {
		NES_postSortByRating = true;
		$('.comments_new').remove();
		$(this).attr('disabled', true).text('* POOF *');
		
		$(".comment").each(function() {
			if ($(this).find(".comment_rating_details").css("display") == "none")
				$(this).find(".information").click();
		});
	});
	$("#pewbeMode").bind("change", function() {
		var a = this.selectedIndex;
		$(".comment_rate").each(function() {
			this.selectedIndex = a;
			$(this).change();
		});
	});
	
	// Fikser bredden af indlæg, så [list] ikke sniger sig ind over højresiden af indlæggene samt nyhedslisten, så teksten ikke går for langt og ikke kan læses
	$("<style type='text/css'>.text_content{width: 381px;} .indexsection ul li {width: inherit !important;} .NES_postReferenceLink {color: green !important;}</style>").appendTo("head");
	
	$(document).ajaxSuccess(function(event, xhr, options) {
		// Retter newz.dk's buggede AJAX
		if (options.url.match('class=Z4_Forum_Item&action=page') !== null) {
			var href = NES_getUrl();
			
			if (NES_startHash != '') {
				$(window).scrollTop($('.comment h2:has(a[name=' + NES_startHash.substr(1) + '])').offset().top);
				history.replaceState({page: _pageId}, '', href + '/page' + _pageId + NES_startHash);
				NES_startHash = '';
			}
			
			$(".loading").hide();
			$('.pagination').show();
			
			$(".pagination a").each(function() {
				$(this).attr('href', href + '/page' + /#page(\d+)/.exec($(this).attr('href'))[1]);
			});
			
			NES_fixTitle();
			NES_insertLoadingGif();
			NES_fixPosts();
			
			$("#sortRating").attr('disabled', false).text('Sorter indlæg efter rating');
		}
		
		// Sætter fix og such til det umiddelbart indsendte indlæg. Der _skal_ bruges options.data, da det er POST
		// samt
		// Efter den løbende AJAX-indhentning af nye indlæg
		if ((options.data.match('class=Z4_Forum_Item&action=usersave') !== null) || (options.url.match('class=Z4_Forum_Item&action=new') !== null)) {
			var a = $('#comments > div:last');
			if (a.text().trim() != '')
				NES_fixPosts(a);
		}
		
		// Preview (slået fra, når man opretter en tråd)
		if ((options.data.match('class=Z4_Forum_Item&action=preview') !== null) && (location.href.indexOf('/opret') == -1))
			NES_fixPosts($('#post_preview .content'))
	});
	
	$(document).ajaxStop(function() {
		if (NES_postSortByRating) {
			NES_postSortByRating = false;
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
	
	$(window).bind('hashchange', function() {
		var a = +location.hash.substr(1);
		
		// Indlægget befinder sig på en anden side
		if (!isNaN(a) && (a > 0) && (a <= 50 * (_lastPage - 1) + 50) && ((a <= 50 * (_pageId - 1)) || (a > 50 * (_pageId - 1) + 50))) {
			// Hopper til top, så brugeren ved, at der skiftes side
			$(window).scrollTop(0);
			
			var href = NES_getUrl();
			NES_startHash = '';
			var p = Math.ceil(a / _pageSize);
			history.replaceState({page: p}, '', href + '/page' + p + '#' + a);
			NES_fetchPage(p, 2, a);
		}
	});
	
	window.onpopstate = function(e) {
		var a = e.state;
		if (a == null || a.page == _pageId)
			return;
		console.log('onpopstate: page = ' + a.page);
		NES_fetchPage(a.page, 3);
	};
	
	// Fix af "Sorter indlæg efter rating", så den finder det nyeste indlæg det rigtige sted.
	if (typeof GetLastPostId != "undefined") {
		OldGetLastPostId = GetLastPostId;
		GetLastPostId = function() {
			if ($("#sortRating").text() == "* POOF *") {
				var maxid = 0;
				$(".comment").each(function() {
					var id = this.id.substr(4);
					if (id > maxid)
						maxid = id;
				});
				return maxid;
			} else
				return OldGetLastPostId();
		}
	}
	
	// Gemmer de sidste fem indlæg
	// Skal omdøbes, så den originale bind ikke kommer på. Hvis den allerede er på, sørger unbind() for at fjerne den.
	// Rækkefølgen af scripts er ikke altid den samme (tak for lort, HTML5, IE og Webkit).
	$("#id_commentpost").unbind().attr('id', 'id_commentpost2').bind("click", function(e) {
		e.preventDefault();
		
		var a = $("#id_comment").val();
		if ($.trim(a).length > 1) {
			for (var i = 5; i > 1; i--) {
				localStorage['commentHistory' + i] = function(v) {
					var r = localStorage['commentHistory' + v];
					return (r == null) ? '' : r;
				}(i - 1);
			}
			localStorage['commentHistory1'] = a;
		}
		
		NES_updateCommentList();
		SubmitPost(true);
		return false;
	});
	
	// Indholdet af kommentarfeltet gemmes løbende, så det kan gendannes (hvert 5. sekund)
	$("#id_comment").keyup(function() {
		a = $("#id_comment").val();
		if ($.trim(a).length > 1) {
			localStorage['commentHistory0'] = a;
			$('#commentStorage select option[value=0]').html(a);
		}
	});
	
	$('.toolbar').append('<ul><li style="font-size: small;" id="commentStorage"></li></ul>');
	NES_updateCommentList();
	
	NES_fixTitle();
	NES_ajaxPageChange();
	NES_updateSettingsSub();
	
	// I store tråde ender man nogle gange (hvis den sidste side er på 50 indlæg) en side for langt
	if (window._pageId > window._lastPage) {
		var href = NES_getUrl();
		$('#postcontainer').prepend('Hopper lige til den rigtige side...');
		history.replaceState({page: _lastPage}, '', href + '/page' + _lastPage);
		NES_fetchPage(_lastPage, 0);
	} else if (window._pageId) {
		history.replaceState({page: _pageId}, '', location.href);
		NES_fixPosts();
	}
}

function NES_updateSettingsSub() {
	$('#addLinkToPostReferenceSub > input').attr('disabled', !$('#addLinkToPostReference').attr('checked'));
	$('#showPostOnMouseOverReferenceSub input').attr('disabled', (!$('#showPostOnMouseOverReference').attr('checked') || !$('#addLinkToPostReference').attr('checked')));
}

// Køres ved indlæsning, AJAX-sideskift, indsendelse af indlæg og ved den løbende AJAX-indhentning af nye indlæg
// MANGLER: Efter endt redigering
function NES_fixPosts(object) {
	if (typeof object == "undefined")
		object = document;
	
	NES_improvedQuote(object);
	NES_addPermLink(object);
	if (applyTargetBlank)
		$('a', object).attr('target', '_blank');
	NES_addMiniQuote(object);
	NES_addLinkToPostReferenceFunc(object);
}

// Advarsel: Tåler ikke at blive kørt flere gange for samme indlæg, men det burde ikke være noget problem endnu
function NES_addMiniQuote(object) {
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

function NES_addLinkToPostReferenceFunc(object) {
	if (addLinkToPostReference) {
		$('.comment .text_content p:contains("#")', object).each(function() {
			if ($(this).parents('#post_preview').length == 1) {
				var postId = $('h2 a:first', '.comment:not([id=]):last').attr('name');
				p = 'post_preview';
			} else {
				var postId = $(this).parents('.comment').find('h2 a:first').attr('name');
				var p = $(this).parents('.comment').attr('id');
			}
			
			$(this.childNodes).each(function() {
				if (this.nodeType == 3) {
					// #tal efterfulgt af enten mellemrum, linjeknæk, kolon, komma eller punktum samt ved afsluttet afsnit eller linje
					$(this).replaceWith(this.nodeValue.replace(/#(\d+)( |<br>|:|,|\.|\?|!|<\/p>|$)/gm, function(str, a, b) {
						if (a < 100 && _pageId > 20) { // Fra indlæg #1001 vil #99 betyder #999 osv.
							c = Math.floor((50 * (_pageId - 1)) / 100) * 100 + +a;
							if (c > postId)
								c -= 100;
						} else
							c = a;
						var him = $('.comment:has(a[name=' + c + '])').attr('id');
						return '<a class="NES_postReferenceLink"' + (((showPostOnMouseOverReference) && ((c > 50 * (_pageId - 1)) && (c <= 50 * (_pageId - 1) + 50))) ? ' onclick="NES_goToPost(\'' + him + '\')" onmouseout="NES_hidePost(\'' + him + '\')" onmouseover="NES_showPost(\'' + p + '\', \'' + him + '\')"' : ' onclick="return true;"') + ' href="#' + c + '">#' + a + '</a>' + b;
					}).replace(/&/gm, '&amp;'));
				}
			});
		});
	}
}

function NES_addPermLink(object) {
	href = NES_getUrl();
	
	$('.comment h2', object).each(function() {
		var a = $(this).html();
		a = a.replace(/#(\d+):/, '<a href="' + href + '/page' + _pageId + '#$1">#$1:</a>')
		$(this).html(a);
	});	
}

// Advarsel: Tåler ikke at blive kørt flere gange for samme indlæg, men det burde ikke være noget problem endnu
// Sætter event handler på "Citer indlæg" - Sakset direkte fra newz.dk med vigtige ændringer. Jeg har ladet mine kommentarer fra newz.dk's script lade blive.
function NES_improvedQuote(object) {
	// newz.dk unbinder selv efterfølgende, så vi bliver nødt til at omdøbe class (faktisk fjerne den pga. Chrome-bug)
	$(".quoteitem", object).replaceWith('<a href="#" class="quoteitemNES">Citer indlæg</a>');
	$(".quoteitemNES", object).bind("click", function(e) {
		e.preventDefault();
		
		// Finder indlæggets id (ikke nummer)
		var $post = $(this).parents(".comment");
		var postId = $post.attr("id").substring(4);
		
		// Finder indlæggets nummer (ikke id)
		var itemId = $post.find("h2 a").attr("name");
		
		// Finder indlæggets ejermand
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
			if ((getSelection().rangeCount > 0) && ($(getSelection().getRangeAt(0).commonAncestorContainer).parents('#' + $post.attr("id")).length > 0)) {
				// Dette kan sikkert reduceres til noget pænere...
				sel = getSelection();
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
				if (typeof (getSelection) != 'undefined') {
					var select_string = getSelection();
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

function NES_updateCommentList() {
	$('#commentStorage').empty();
	var a = $('<select onchange="if ($(this).val() == -1) return(false); $(\'#id_comment\').val(localStorage[\'commentHistory\' + $(this).val()]).keyup();" style="max-width: 150px">')
		.appendTo('#commentStorage');
	a.append('<option value="-1">Tidligere indlæg</option>');
	for (var i = 0; i < 6; i++) {
		var b = localStorage['commentHistory' + i];
		var l = b.length;
		if (l > 79)
			b = b.substr(0, 40) + ' [...] ' + b.substr(l - 40, l - 40);
		a.append('<option value="' + i + '">' + b + '</option>');
	}
}

// Sætter en ordentlig overskrift på tråden
// newz.dk sætter normalt kun side-nr. ind i <h1>, når man skifter side, tsk tsk
function NES_fixTitle() {
	if (window._lastPage > 1) {
		var regexMatch;
		if (regexMatch = /(Side \d+ » )*([^»]+) ».+/.exec(document.title))
			$("#container div h1").html('Side ' + _pageId + ' » ' + regexMatch[2]);

		if (/Side \d+/.test(document.title))
			document.title = document.title.replace(/Side \d+/, "Side " + _pageId);
		else
			document.title = "Side " + _pageId + " » " + document.title;
	}
}

function NES_insertLoadingGif() {
	// Indsætter en loading.gif
	$('<span/>').insertAfter('.pagination').html('<div class="loading" style="float: left; margin: -2px 10px; padding: 5px; position: relative; width: 330px;"><p><img src="data:image/gif;base64,R0lGODlhEAAQAPYAAP///zMzM/r6+qenp5+fn/Hx8dLS0t/f37GxsTMzM6SkpNHR0VpaWnR0dO/v77e3t6mpqfT09JqamklJScHBwba2tq6urvb29vn5+bm5udfX12lpaTw8PH9/f+Tk5Ozs7MnJyVRUVF5eXmpqatzc3M/Pz2JiYnFxcWRkZGxsbNnZ2dTU1Hp6esLCwu7u7oyMjLy8vMbGxsfHx35+fnx8fIGBgZ6enubm5peXl/z8/LS0tEZGRlZWVnd3dzY2NnJyctbW1l9fX3l5eUdHR/Ly8t7e3q+vr+fn5+rq6mZmZrq6uk9PT0xMTL6+vo6Ojm5ublxcXIeHh9ra2szMzFFRUZaWlmdnZ3Z2djo6Ojk5Ob+/v+np6W9vb/f398TExISEhIaGhuLi4rKyskFBQU5OTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/h1CdWlsdCB3aXRoIEdJRiBNb3ZpZSBHZWFyIDQuMAAh/hVNYWRlIGJ5IEFqYXhMb2FkLmluZm8AIfkECQoAAAAsAAAAABAAEAAAB2iAAIKDICImJYOJAAsSGgAhCQkoioIGDAkbHpcJKYIRiQSRHBYLIycqABgZn4IHDRMdH5QYig4UBZSKAggPuZQDkRW+ACSIoQkWw8UABQoQF8PR0qm+tIkRGdaJqqyD3SQk3tEliNPRgQAh+QQJCgAAACwAAAAAEAAQAAAHa4AAgoMHNDU3g4mKMwkJLzk6PRk5gysvGhcvjTgQOwk7MIMsCQ0yLhI2BSGNCTWDLSkxBYkVPD48MoMuMLOKMD8gisLDACUkxIIkJYLGyADKztHSgxjE1YkRGdeJGBkRit/Jx4LhxCXL08iBACH5BAkKAAAALAAAAAAQABAAAAdogACCgwIID4OIiQADCQkVACUSKokRggSNFkBBCSZFgxEZGAAFChAXOD6NRoiiiR5CQzRHiooOFES0tCAiJiWQJLkAIY0ov8EMjSnBgwsjJ5PLua2K04Kg1YIYGZWI3AAkwNbLJb7R0YEAIfkECQoAAAAsAAAAABAAEAAAB2eAAIKDhIWGgiUlh4MRgyQkAEQLTlKEERkYhQ9JCVGFmYVISk9Ti4UfMAWmhQc0NTcAJZCLMwkJL7Gzhy+2OKuCLhI2qqtGUA+fhhBLCUwwjJiFIbYJNZaOkBVMCVQyi4mCTVHev4aBACH5BAkKAAAALAAAAAAQABAAAAdogACCg4SFhoIlJYeDEYMkJIyFERkYhhgZjYSVh5uLnp+CAggPiJCLAwkJFQAlpocEqRagAAUKEBegC05FhZ2DK1ZYVryCk5UgIiYlVT6pRoSZIakoR1dZQluHDKkpAEdaH4sLIycqhoEAIfkECQoAAAAsAAAAABAAEAAAB2eAAIKDhIWGgiUlh4MRgyQkjIURGRiGGBmNhJWHm4uen4clkJ4kigCin6WgixZQD4ZdIF2DRhMJIRmERFMsGoNcCcEpBzQ1Nw9JCWCDGUMJPDIzwS8fXl8LhE1RMgAvwTirLhI2BYaBACH5BAkKAAAALAAAAAAQABAAAAdngACCg4SFhoIlJYeDEYMkJIyFERkYhhgZjYSVh5uLniAiJoqegiEJCSieJIoMpymqigsjJyqkhCtOUrYABkEcT2GWhDanHBYCCA+Cl5kAYVxZMw4DpxWCzYJbWkgABKcWuwUKEBeGgQAh+QQJCgAAACwAAAAAEAAQAAAHaIAAgoOEhYICYj1KgiUlhoJGYwlMGQAkJIMRhFwJnU+FGBmaghlkPiIyhhiFMD8xj4QHNDU3sIQznS+2JI4vnTi7ji4SNgW2hREyAseDJUIrXaqFLAkNr4Sho4JTX1NElpiC2o+NzOaBADsAAAAAAAAAAAA=" /> Weeeeeeeeee.</p></div>');
	$(".loading").hide();
}

function NES_ajaxPageChange() {
	if (
		(location.pathname.indexOf('/om-os/statistik/') == 0) ||            // Slå fra under statistikker
		(/^.*newz.dk(\/)?(page\d+)?$/.test(location.href)) ||               // Slå fra på forsiden
		(/\/rating(time|selftime|total|self)\//.test(location.pathname)) || // Slå fra under vurderingsfordelingslisterne
		(location.pathname.indexOf('/news/queue') == 0) ||                  // Slå fra under nyhedskø
		(location.pathname.indexOf('/news/deleted') == 0)                   // Slå fra under listen over slettede nyheder
	)
		return;

	NES_insertLoadingGif();
	
	$('.pagination a').live('click', function(e) {
		e.preventDefault();
		NES_startHash = '';
		var p = /page(\d+)$/.exec(this.href)[1];
		var href = NES_getUrl();
		history.pushState({page: p}, '', href + '/page' + p);
		NES_fetchPage(p, 1);
		return false;
	});
}

// pageNo: sidenummer
//  state: 0 = replaceState (fikser nuværende side), 1 = pushState (skifter side), 2 = hopper til side, hvorpå indlægget ligger, 3 = ingen ændring i historien (skifter side pga. hop i historien)
//   hash: Hvis der skal hoppes til et bestemt indlæg
function NES_fetchPage(pageNo, state, hash) {
	var successFunc = function(pageNo, state, hash) {
		return function (xml) {
			$("#postcontainer").html($("Response", xml).text());
			
			// Opdaterer newz.dk's variable, så den kun henter nye indlæg, når man er på sidste side
			$(".pagination a").each(function(i) {
				// Sakset fra newz.dk's egen kode. _lastPage returneres ikke fra AJAX, så hmn kigger simpelthen alle <a>'erne igennem
				var pageId = +(this.href.substring(this.href.indexOf("page") + 4));
				if (typeof pageId != 'undefined' && pageId > _lastPage)
					_lastPage = pageId;
			});
			_pageId = pageNo;
			if (_pageId == _lastPage) {
				_updateFrequency = 10000;
				StartAutoUpdate();
			} else
				PauseAutoUpdate();
			
			href = NES_getUrl();
			
			if (state == 1) {
				$(window).scrollTop(0);
			} else if (state == 2) {
				$(window).scrollTop($('.comment h2:has(a[name=' + hash + '])').offset().top);
			}
			
			// (Gen)aktiverer js for "Yderligere information", etc. ved at sætte event handlers igen (newz.dk-funktion)
			UpdatePosts();
		}
	}
	
	$('.pagination').hide();
	$(".loading").show();
	
	$.ajax({
		dataType: 'xml',
		url: "/z4/action.php",
		data: {"class":"Z4_Forum_Item", "action":"page", "id":_threadId, "offset":pageNo},
		success: successFunc(pageNo, state, hash)
	});
}

// URL uden /page samt #
function NES_getUrl() {
	var a = 0;
	
	if ((a = location.href.indexOf('#')) == -1)
		var href = location.href;
	else
		var href = location.href.substr(0, a);
	
	if ((a = href.indexOf('/page')) != -1)
		var href = href.substr(0, a);
	
	return href;
}