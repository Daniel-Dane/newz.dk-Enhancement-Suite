﻿/**
 @name           Super newz.dk Enhancement Suite
 @url            https://raw.github.com/Daniel-Dane/newz.dk-Enhancement-Suite/master/nes.js
*/

var NES_version = "2.1.2";
var NES_loaded = NES_loaded || false;

// Følgende indsættes i indstillinger -> stylesheet
// " /><script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script><script type="text/javascript" src="https://raw.github.com/Daniel-Dane/newz.dk-Enhancement-Suite/master/nes.js"></script><link rel="stylesheet

if (!$) {
	// Rækkefølgen af scripts er ikke altid den samme (tak for lort, HTML5, IE og Webkit).
	// Når jQuery er cached, burde det ikke være noget problem.
	alert('Opdatér (F5, men IKKE Ctrl+F5) lige. Får du denne pop-up flere gange, skal du fjerne SNES og fortælle om det.');
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
			var NES_fixPostTimesCounter = 0;    // setTimeout til NES_fixPostTimes()
			$(document).ready(function () {
				NES_init();
			});
		}
	}
}

function NES_init() {
	/**
	* A Javascript object to encode and/or decode html characters
	 * @Author R Reid
	 * source: http://www.strictly-software.com/htmlencode
	 * Licence: GPL
	 */
	Encoder={EncodeType:"entity",isEmpty:function(val){if(val){return((val===null)||val.length==0||/^\s+$/.test(val))}else{return true}},arr1:new Array('&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&Aelig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&Oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&oelig;','&oelig;','&scaron;','&scaron;','&yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'),arr2:new Array('&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'),HTML2Numerical:function(s){return this.swapArrayVals(s,this.arr1,this.arr2)},NumericalToHTML:function(s){return this.swapArrayVals(s,this.arr2,this.arr1)},numEncode:function(s){if(this.isEmpty(s))return"";var e="";for(var i=0;i<s.length;i++){var c=s.charAt(i);if(c<" "||c>"~"){c="&#"+c.charCodeAt()+";"}e+=c}return e},htmlDecode:function(s){var c,m,d=s;if(this.isEmpty(d))return"";d=this.HTML2Numerical(d);arr=d.match(/&#[0-9]{1,5};/g);if(arr!=null){for(var x=0;x<arr.length;x++){m=arr[x];c=m.substring(2,m.length-1);if(c>=-32768&&c<=65535){d=d.replace(m,String.fromCharCode(c))}else{d=d.replace(m,"")}}}return d},htmlEncode:function(s,dbl){if(this.isEmpty(s))return"";dbl=dbl||false;if(dbl){if(this.EncodeType=="numerical"){s=s.replace(/&/g,"&#38;")}else{s=s.replace(/&/g,"&amp;")}}s=this.XSSEncode(s,false);if(this.EncodeType=="numerical"||!dbl){s=this.HTML2Numerical(s)}s=this.numEncode(s);if(!dbl){s=s.replace(/&#/g,"##AMPHASH##");if(this.EncodeType=="numerical"){s=s.replace(/&/g,"&#38;")}else{s=s.replace(/&/g,"&amp;")}s=s.replace(/##AMPHASH##/g,"&#")}s=s.replace(/&#\d*([^\d;]|$)/g,"$1");if(!dbl){s=this.correctEncoding(s)}if(this.EncodeType=="entity"){s=this.NumericalToHTML(s)}return s},XSSEncode:function(s,en){if(!this.isEmpty(s)){en=en||true;if(en){s=s.replace(/\'/g,"&#39;");s=s.replace(/\"/g,"&quot;");s=s.replace(/</g,"&lt;");s=s.replace(/>/g,"&gt;")}else{s=s.replace(/\'/g,"&#39;");s=s.replace(/\"/g,"&#34;");s=s.replace(/</g,"&#60;");s=s.replace(/>/g,"&#62;")}return s}else{return""}},hasEncoded:function(s){if(/&#[0-9]{1,5};/g.test(s)){return true}else if(/&[A-Z]{2,6};/gi.test(s)){return true}else{return false}},stripUnicode:function(s){return s.replace(/[^\x20-\x7E]/g,"")},correctEncoding:function(s){return s.replace(/(&amp;)(amp;)+/,"$1")},swapArrayVals:function(s,arr1,arr2){if(this.isEmpty(s))return"";var re;if(arr1&&arr2){if(arr1.length==arr2.length){for(var x=0,i=arr1.length;x<i;x++){re=new RegExp(arr1[x],'g');s=s.replace(re,arr2[x])}}}return s},inArray:function(item,arr){for(var i=0,x=arr.length;i<x;i++){if(arr[i]===item){return i}}return-1}};
	/*
	 * jQuery plugin: fieldSelection - v0.1.0 - last change: 2006-12-16
	 * (c) 2006 Alex Brem <alex@0xab.cd> - http://blog.0xab.cd
	 */
	(function(){var a={getSelection:function(){var a=this.jquery?this[0]:this;return("selectionStart"in a&&function(){var b=a.selectionEnd-a.selectionStart;return{start:a.selectionStart,end:a.selectionEnd,length:b,text:a.value.substr(a.selectionStart,b)}}||document.selection&&function(){a.focus();var b=document.selection.createRange();if(b==null){return{start:0,end:a.value.length,length:0}}var c=a.createTextRange();var d=c.duplicate();c.moveToBookmark(b.getBookmark());d.setEndPoint("EndToStart",c);return{start:d.text.length,end:d.text.length+b.text.length,length:b.text.length,text:b.text}}||function(){return{start:0,end:a.value.length,length:0}})()},replaceSelection:function(){var a=this.jquery?this[0]:this;var b=arguments[0]||"";return("selectionStart"in a&&function(){a.value=a.value.substr(0,a.selectionStart)+b+a.value.substr(a.selectionEnd,a.value.length);return this}||document.selection&&function(){a.focus();document.selection.createRange().text=b;return this}||function(){a.value+=b;return this})()}};jQuery.each(a,function(a){jQuery.fn[a]=this})})();
	
	// NES-indstillingsboksen
	$('<div class="secondary_column" style="font-size: 1.2em; margin: 16px auto auto; float: none; padding: 0; width: 600px;" id="NES-menu" />').insertAfter('#nmTopBar')
	.html(' \
	<h3 style=\'background: url("http://newz.dk.css.zfour.dk/gfx/default/bg_h3.png") repeat-x scroll 100% 0 transparent;\'><span>Super newz.dk Enhancement Suite (SNES)</span></h3> \
	<div style="text-align: left; padding-left: 12px;"> \
		<div style="float: right;"> \
			<button id="sortRating">Sorter indlæg efter rating</button><br> \
			<br><span style="float: right">pewbe mode: &nbsp;</span><br><select id="pewbeMode" style="float: right;"><option value="1">informativ</option><option value="2">interessant</option><option value="4">relevant</option><option value="3">sjov</option><option selected="selected" value="0">neutral</option><option value="5">gentagelse</option><option value="6">irrelevant</option><option value="7">flamebait</option></select> \
		</div> \
		<input type="checkbox" id="addLinkToPostReference" name="addLinkToPostReference"><label for="addLinkToPostReference"> "#tal"-henvisninger får et link</label><br> \
		<div id="addLinkToPostReferenceSub" style="padding-left: 16px;"> \
			<input type="checkbox" id="showPostOnMouseOverReference" name="showPostOnMouseOverReference"><label for="showPostOnMouseOverReference"> Vis det refererede indlæg ved mouseover</label><br> \
			<div id="showPostOnMouseOverReferenceSub" style="padding-left: 16px;"> \
				<input type="checkbox" id="showPostOnMouseOverReferenceLeft" name="showPostOnMouseOverReferenceLeft"><label for="showPostOnMouseOverReferenceLeft"> Vis det refererede indlæg på venstre side i stedet</label><br> \
				<input type="checkbox" id="showPostOnMouseOverReferenceMini" name="showPostOnMouseOverReferenceMini"><label for="showPostOnMouseOverReferenceMini"> Vis kun brødtekst af indlægget</label> \
			</div> \
		</div> \
		<input type="checkbox" id="improvedQuoteSetting" name="improvedQuoteSetting"><label for="improvedQuoteSetting"> Forbedret citering af indlæg</label><br> \
		<input type="checkbox" id="applyTargetBlank" name="applyTargetBlank"><label for="applyTargetBlank"> Åbn alle links i ny fane</label><br> \
		<div id="applyTargetBlankSub" style="padding-left: 16px;"> \
			<input type="checkbox" id="applyTargetBlankOnlyOutgoing" name="applyTargetBlankOnlyOutgoing"><label for="applyTargetBlankOnlyOutgoing"> ... men kun udgående</label><br> \
		</div> \
		<input type="checkbox" id="fixFailTagsSetting" name="fixFailTagsSetting"><label for="fixFailTagsSetting"> Ret overflødige BB-tags i indlæg (NB: Læs om funktionen på kynz inden ibrugtagen)</label><br> \
		<input type="checkbox" id="showUrlImages" name="showUrlImages"><label for="showUrlImages"> Vis billeder i indlæg</label><br> \
		<input type="checkbox" id="embedYouTubeUrls" name="embedYouTubeUrls"><label for="embedYouTubeUrls"> Omdan YouTube-links til embedded video</label><br> \
		<div id="embedYouTubeUrlsSub" style="padding-left: 16px;"> \
			<input type="checkbox" id="embedYouTubeUrlsNotInQuote" name="embedYouTubeUrlsNotInQuote"><label for="embedYouTubeUrlsNotInQuote"> ... bare ikke i citater</label><br> \
		</div> \
		<input type="checkbox" id="narrowSite" name="narrowSite"><label for="narrowSite"> Gør newz.dk lidt smallere (til opløsninger med 1024 i bredde)</label> \
		<div style="margin-top: 12px;"> \
			<hr> \
			Ændringerne sættes i kraft ved næste indlæsning. Lær alt om SNES på <a href="http://www.knowyournewz.dk/index.php?title=Super_newz.dk_Enhancement_Suite">kynz</a>! Version ' + NES_version + '. \
		</div> \
	</div> \
	').hide();
	
	// "NES-indstillinger"-knappen
	$('#nmSiteSelect').next().find('a:last').before('<a href="#" id="NES-toggle">SNES-indstillinger</a> | ');
	$('#NES-toggle').click(function (e) {
		e.preventDefault();
		$('#NES-menu').toggle();
		return false;
	});
	
	// Henter indstillinger
	addLinkToPostReference = (localStorage["addLinkToPostReference"] == "true");
	showPostOnMouseOverReferenceMini = (localStorage["showPostOnMouseOverReferenceMini"] == "true");
	showPostOnMouseOverReference = (localStorage["showPostOnMouseOverReference"] == "true");
	improvedQuoteSetting = (localStorage["improvedQuoteSetting"] == "true");
	applyTargetBlank = (localStorage["applyTargetBlank"] == "true");
	applyTargetBlankOnlyOutgoing = (localStorage["applyTargetBlankOnlyOutgoing"] == "true");
	fixFailTagsSetting = (localStorage["fixFailTagsSetting"] == "true");
	showUrlImages = (localStorage["showUrlImages"] == "true");
	embedYouTubeUrls = (localStorage["embedYouTubeUrls"] == "true");
	embedYouTubeUrlsNotInQuote = (localStorage["embedYouTubeUrlsNotInQuote"] == "true");
	if (narrowSite = (localStorage["narrowSite"] == "true")) {
		$('body,#center,#nmContainer').css('width',1000+'px');
	}
	
	// Event handlers til knapperne
	var handlerList = ['addLinkToPostReference', 'showPostOnMouseOverReference', 'showPostOnMouseOverReferenceLeft', 'showPostOnMouseOverReferenceMini', 'improvedQuoteSetting',
					   'applyTargetBlank', 'applyTargetBlankOnlyOutgoing', 'fixFailTagsSetting', 'showUrlImages', 'embedYouTubeUrls', 'embedYouTubeUrlsNotInQuote', 'narrowSite'];
	for (var i = 0; i < handlerList.length; i++) {
		$("#" + handlerList[i]).bind("click", function() {
			localStorage[this.id] = this.checked ? 'true' : 'false';
			NES_updateSettingsSub();
			localStorage["NES_statistik2"] = 'false';
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
	
	// Styles til fix af newz.dk samt til nogle af SNES' features.
	$("<style type='text/css'> \
	.text_content { \
		width: 381px; /* Fikser bredden af indlæg, så [list] ikke sniger sig ind over højresiden af indlæggene */ \
	} \
	.indexsection ul li { \
		width: inherit !important; /* Fikser nyhedslisten, så teksten ikke går for langt og ikke kan læses */ \
	} \
	.NES_postReferenceLink { \
		color: green !important; \
	} \
	 \
	" + (showPostOnMouseOverReference ? ".NES_cite{z-index: 9000; width: " + (showPostOnMouseOverReferenceMini ? '381' : '651') + "px; position: fixed; background-color: white; border: 1px solid black; padding: 10px 5px 1px 5px; top: 0; " + ((localStorage["showPostOnMouseOverReferenceLeft"] == "true") ? 'left: 0;' : 'right: 0') + '}' : '') + "\
	.listtag { \
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAIAAADUsmlHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFuSURBVDhPlVTNToNAEGZJoAlX0y6esI1PoInUpL6O0RfwETTxBfR9PKgHvWrVSPCAgIZeALkAfjB2u/zU6GQzmZl+8/PNLmVRFH2GgfvmKJCyVBhrGJXTlBpjWePhyGRP84cweLf3DwBhjJVlSbrryjVurq8431Rd19mbzoCG5HkOXRQFuWQIl4Ik9nSGRFWuNxic6fopTnfY3ogKnqKPQFA3vU9W4FJRQVQMI5Jp2q+OZFlGYOxFYUiud0Ot0vSEjkxPtgETi0BWg7NhnNP5M2fG5GKURhGjT4gRwTC2AmpxHKdpKhrCTpIk7BPEBRhjV5ypXhAc+/4RtHzDHTsXPRqcOb8wzUvof3AmKJq3rso0Tc55S+OaJM71kxa+XMjrE2KxXNiyHUKed0hHHqR6D2uk4ozvQdO0Xx5G6yeAqSJ7nj++Oi87u7Zc/ecBrt/b/d3tZLzNFovFR+jj+1ohwUhMSn8PnciWNdkYjr4BVz/GG5kJW6UAAAAASUVORK5CYII=); \
	} \
	.listtag:hover { \
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAIAAADUsmlHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF3SURBVDhPjVRNb4JAEGUJ4d74caJi4lkQSfwb/bj3t7WJSeupHz+htb00qSAmcrK2xl7U9k4i0gdDFuiqdbJZdl7mzczbDMvG4/HPajn/mkmwSJJY/M0OiVewJEbTaqVylT33H1fLhWV3EMEYi6KIdtHNpxi8vVYqVXk+nxETttls4qoJkx+4mye37Q6Ich6q1690/RJLbHYrIkMecsOoLG8BiL7NsuBIkqGe/Hx7lOtdsOl0SpG4FxDjyqQW0GRyQYun+3NAGEVSmwXNjUaX1sGaWVpW1NzYZvnbYb3rbtNsr9dryDCMW6rpeed7ioOvKMrIG6RtU77h8Mx1T7FzYYQX95DnLWg2zbtW6x77gZqVdJhzg0WzBbMsS8ziui66IZz1brqGaQdBAMeyHgh1nJP9xVVVzTRzDmj/MguawzDE7e0aDBFHcDxhaPul//Q5+2gaBXnpAO5ufeQ5eq3OfN//Xi3wf2WR/EmIry55HgTkWNOPSuVffwRjRQhoys0AAAAASUVORK5CYII=); \
	} \
	/*.img { \
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAIAAADUsmlHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJtSURBVDhPjVTfT9NQFO6tHePHcOjGBiMRGT6gxsQAcTNBH/0b/KN89V/xQd/gASFBZc79wLGxYmDtura362277rb1lDtrgZh4c9Pcc3LOPd/3nXOLVFVVZKkrdjhYQcAhdO0QGtfXVczq6tpibgmdNOuydFl6+QpCEEJBELDvbTN+x+f9vXx+me92Oy/KOxANy/M8+Pq+z0x2iEzmZKtU3oFE/jau//cIwJOBhO+7XQ0OlPosXxD4KQEZZMTMoekS13v/do0FcwHHA9EIzGAcOH5AecQ2nA3XJz5im07zybsJFgy6cAiSr8oyYk8KcyuZmYX0dOb+LOznK3Ov1+ffPMtuPkgtz0+x+pEQIbQ4w42sIOn06RwqpEO/O7T2vvcUMi6u5x6nR8uCe0MOAWBHeta+nemY0nyiZY5F1SoWkp4fiK0L1yZLmZnUwqxuThrB86HSIBhn2zalFGhUmxK48vfSfWwYDjqoarWumU+NEiL+dcpvlzcWs2lCCBAUhBAaXDCRGurDdb7vDYl9h6NYHux/7akY9xWj28Ou6540xNpxG6YhAn+tz4eV1mn7vNPt79bFwx8K742FABFCNYNIhuMYuFJtx2mHrWI2gNEUXVHUo+OzRkV2zIHn6pytOQRbFjGx3rrQB/oQ2gQYWUpYGdgye6gplxdSvXFuYpVgVZYHqmKZ2PCpZ1vWaDT2w2ENNWPJ6NPHD1vbZcdxbrQhMqN3Eg9IJpNfjg7CyvAeEonJ6MSnP/484n4IDicMKv9sNtqd1uZWKX7xZAD/BYbjoGxx7RHSNK0v9+B9/Y0ERhMR//webnkerhYzi7nfHkPravic/L8AAAAASUVORK5CYII=); \
	} \
	.img:hover { \
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAIAAADUsmlHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJgSURBVDhPjVRtb9JQFObWwthgssmbY8jM9mVqNt0wi5/0m7/Kf2OM/g2HxkiyzQECKmOjQ4S2lN7Slrbctp7bko5l8eXkpj3n5Lw+59yL6vW6JArdn1wIyA2FEP1fMZ50jTybfL6QTGXQh9J7UeD3igdggRByXdf/3hTnQxwfldPpDNPtcr4nkOM4NKvnGTCBOO+8XzwAR+ZmXf+vYaE9PzZ83/yIAkMIzQ/EskyERYpm+uJYtTTLfvWC2lAXN8RA98D5NJy6huMSBvkHeMVyNAf5h0SZhdth3xJwAUeGAut1C6qHudh6cnElEU3eWYLzZD32fGv55U5qvxBfW44EuICljw473+F2ih3I5FEM5RJUb431UrUvatPNrcyDhLnGWp7xLIrnjGZpIV79y7mMCcmGW+qUk/TN3ILtuFyrZ020u8nF+MqSrNICgRiGIk0BMwyDEAJt1L4JoMquJgSsKAb6XBvVO2o2boY53D1jnj7bTqcSuq6DM8vS0maj8tuAcI5jj7XJrRDB/PDTSV/CWBCVTh9blvW9ydVP265rB51em3O50jprX553hMMGV/4qMvaUdZGmkZGiDRTDUHCl1p7HiI7KJ0g+EmVRlI5OL5oV3lCHtiWHJiNDw7quqVhu9eShPIYx+VDPyg6WeTwSf/UGjealiiUNSzw/lERdxYpD7Imum+bUcSlgQXL07u3r3cdF05yt0XxVf+EjkUi1ckx7tm0b0Av27J8MGNMNg1v4sXTY4S52dvfm88wW8M+pq5WTjcJ91Gg0hiIP9+vKMngSKIze83BDcy+/sZpM/QYQArdSDStcjQAAAABJRU5ErkJggg==); \
	}*/ \
	.NES_urlImg { \
	max-height: 381px; \
	} \
	</style>").appendTo("head");
	
	$(document).ajaxSuccess(function(event, xhr, options) {
		// Behandling af AJAX-sideskift
		if (options.url.match('class=Z4_Forum_Item&action=page') !== null) {
			var href = NES_getUrl();
			
			if (window._pageId > window._lastPage) {
				// Hvis man får et link med en henvisning til et indlæg, som ikke findes endnu
				NES_startHash = '';
				$('#postcontainer').prepend('Hopper lige til den rigtige side...');
				history.replaceState({page: _lastPage}, '', href + '/page' + _lastPage);
				NES_fetchPage(_lastPage, 0);
			} else {
				if (NES_startHash != '') {
					$(window).scrollTop($('.comment h2:has(a[name=' + NES_startHash.substr(1) + '])').offset().top);
					history.replaceState({page: _pageId}, '', href + '/page' + _pageId + NES_startHash);
					NES_startHash = '';
				}
				
				// Retter newz.dk's buggede AJAX.
				$(".pagination a").each(function() {
					$(this).attr('href', href + '/page' + /#page(\d+)/.exec($(this).attr('href'))[1]);
				});
				
				//
				NES_fixTitle();
				NES_insertLoadingGif();
				NES_fixPosts();
				$("#sortRating").attr('disabled', false).text('Sorter indlæg efter rating');
			}
		}
		
		// fixPosts() af det indsendte indlæg. (Der SKAL bruges options.data, da det er POST!)
		// samt
		// fixPosts() efter den løbende AJAX-indhentning af nye indlæg.
		if ((options.data.match('class=Z4_Forum_Item&action=usersave') !== null) || (options.url.match('class=Z4_Forum_Item&action=new') !== null)) {
			var a = $('#comments > div:last');
			if ($.trim(a.text()) != '')
				NES_fixPosts(a);
		}
		
		// fixPosts() af Preview. (Slået fra, når man opretter en tråd.)
		if ((options.data.match('class=Z4_Forum_Item&action=preview') !== null) && (location.href.indexOf('/opret') == -1)) {
			NES_fixPosts($('#post_preview .content'), false, true);
			$("#NES_button_edit").focus(); // Hører til fiks af resize af kommentarfeltet efter Preview
		}
		
		// fixPosts() af indlæg efter endt redigering (rettelse)
		if (options.data.match('class=Z4_Forum_Item&action=edit') !== null)
			NES_fixPosts($('#post' + /&id=(\d+)&/.exec(options.data)[1]), true);
		
		// Efter tryk på "Ret indlæg" og indlægget er hentet og forberedt.
		if (options.data.match('class=Z4_Forum_Item&action=getRaw') !== null && options.data.match('&jstimestamp') !== null) {
			NES_addToToolbar(true);
		}
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
		if (a == null)
			history.replaceState({page: window._pageId}, '', location.href);
		else {
			if (a.page == _pageId)
				return;
			//console.log('onpopstate: page = ' + a.page);
			NES_fetchPage(a.page, 3);
		}
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
	
	// Indholdet af kommentarfeltet gemmes løbende, så det kan gendannes. Feltet til skrivning af trådbrødtekst er også inkluderet.
	$("#id_comment,#id_forumcontent").keyup(function() {
		a = $("#id_comment,#id_forumcontent").val();
		if ($.trim(a).length > 1) {
			localStorage['commentHistory0'] = a;
			a = Encoder.htmlEncode(a);
			var l = a.length;
			if (l > 119)
				a = a.substr(0, 60) + ' [...] ' + a.substr(l - 60, l - 60);
			$('#commentStorage select option[value=0]').html(a);
		}
	});
	
	// Til gemning af kommentarfeltet
	$('.toolbar').append('<ul><li style="font-size: small;" id="commentStorage"></li></ul>');
	NES_updateCommentList();
	
	// Resizer kommentarfeltet, når der trykkes på Rediger (inde i Preview)
		// Skal omdøbes, så den originale bind ikke kommer på. Hvis den allerede er på, sørger unbind() for at fjerne den.
		// Rækkefølgen af scripts er ikke altid den samme (tak for lort, HTML5, IE og Webkit).
	$("#button_edit").unbind().attr('id', 'NES_button_edit').bind("click", function(e) {
		// Original newz.dk-kode
		$("#post_preview").hide();
		$("#post_form").show();
		StartAutoUpdate();
		
		// SNES' tilføjelse
		$('#id_comment').keyup();
		
		// Original newz.dk-kode
		e.preventDefault();
		return false;
	});
	
	/*
	// Virker ikke, da den bindes FØR de andre funktioner, så kommentarfeltet resizes, INDEN indhold tilføjes.
	// Kommentarfeltet resizes, når
	$('.comment_left .toolbar').delegate('a', 'click', function() {
		$(domain).keyup();
	});
	*/
	
	//
	NES_fixTitle();
	NES_ajaxPageChange();
	NES_updateSettingsSub();
	NES_addToToolbar();
	
	// I store tråde ender man nogle gange (hvis den sidste side er på 50 indlæg) en side for langt
	if (window._pageId > window._lastPage) {
		var href = NES_getUrl();
		NES_startHash = '';
		$('#postcontainer').prepend('Hopper lige til den rigtige side...');
		history.replaceState({page: _lastPage}, '', href + '/page' + _lastPage);
		NES_fetchPage(_lastPage, 0);
	} else if (window._pageId) {
		history.replaceState({page: _pageId}, '', location.href);
		NES_fixPosts();
	}
	
	// Statistik
	if (localStorage["NES_statistik2"] != "true") {
		localStorage["NES_statistik2"] = 'true';
		uploadStatistik();
	}
}

function uploadStatistik() {
	//$.getScript('http://d9projects.com/NES_stats.php?NES&hash='+localStorage["NES_statHash2"]+'&addLinkToPostReference='+ +addLinkToPostReference+'&showPostOnMouseOverReference='+ +showPostOnMouseOverReference+'&showPostOnMouseOverReferenceLeft='+ +(localStorage["showPostOnMouseOverReferenceLeft"] == "true")+'&showPostOnMouseOverReferenceMini='+ +showPostOnMouseOverReferenceMini+'&improvedQuoteSetting='+ +improvedQuoteSetting+'&applyTargetBlank='+ +applyTargetBlank+'&applyTargetBlankOnlyOutgoing='+ +applyTargetBlankOnlyOutgoing+'&fixFailTagsSetting='+ +fixFailTagsSetting+'&showUrlImages='+ +showUrlImages+'&embedYouTubeUrls='+ +embedYouTubeUrls+'&embedYouTubeUrlsNotInQuote='+ +embedYouTubeUrlsNotInQuote+'&narrowSite='+ +narrowSite, function(){});
}

function NES_updateSettingsSub() {
	$('#addLinkToPostReferenceSub > input').attr('disabled', !$('#addLinkToPostReference').attr('checked'));
	$('#showPostOnMouseOverReferenceSub input').attr('disabled', (!$('#showPostOnMouseOverReference').attr('checked') || !$('#addLinkToPostReference').attr('checked')));
	$('#embedYouTubeUrlsSub input').attr('disabled', !$('#embedYouTubeUrls').attr('checked'));
	$('#applyTargetBlankSub input').attr('disabled', !$('#applyTargetBlank').attr('checked'));
}

//
function NES_addToToolbar(editArea) {
	if (editArea === true) {
		var domain = '#edit_area';
		var area   = '.text_content .comment_form';
	} else {
		var domain = '#id_comment,#id_forumcontent';
		var area   = undefined;
	}
	
	// Til [list]
	$('li.strikethrough', area).after('<li><span><a class="listtag" title="[list][li]liste1[/li][li]liste2[/li][li]liste3[/li][/list]" href="#"></a></span></li>');
	$('.listtag', area).bind('click', function(e) {
		e.preventDefault();
		$(domain).replaceSelection('[list]\n[li]liste1[/li]\n[li]liste2[/li]\n[li]liste3[/li]\n[/list]');
		return false;
	});
	
	/*
	// Til URL-billeder
	$('li.url', area).after('<li><span><a class="img" title="[url=billede-url]billede-url (billede)[/url]" href="#"></a></span></li>');
	$('.img', area).bind('click', function(e) {
		e.preventDefault();
		var imgurl = prompt("URL til billedet:");
		if (imgurl !== null)
			$(domain).replaceSelection('[url=' + imgurl + ']' + imgurl + ' (billede)[/url]');
		return false;
	});
	*/
}

// Køres ved indlæsning, AJAX-sideskift, indsendelse af indlæg, ved den løbende AJAX-indhentning af nye indlæg, ved Preview og ved rettelse af indlæg
function NES_fixPosts(object, afterEdit, isPreview) {
	// Køres kun én per indlæg
	if (afterEdit !== true) {
		NES_improvedQuote(object);
		NES_addPermLink(object);
		NES_addMiniQuote(object);
		NES_fixPostTimes(object);
		NES_reportSpam(object);
	}
	
	isPreview = (isPreview === true);
	// Køres kun én per indlæg (men også når indlægget er blevet rettet)
	NES_addLinkToPostReferenceFunc(object, isPreview);
	NES_urlToImg(object);
	NES_fixFailTags(object);
	NES_fixSpoilers(object);
	NES_embedYouTubeUrlsFunc(object);
	
	NES_applyTargetBlankFunc(object);
}

// Advarsel: Tåler ikke at blive kørt flere gange for samme indlæg, men det burde ikke være noget problem endnu
function NES_reportSpam(object) {
	$('.comment_rating li:first-child', object).before('<li><a title="Rapportér spam" class="reportSpam" href="#"><span></span>Rapportér spam</a></li>');
	$('.reportSpam', object).bind('click', function(e) {
		e.preventDefault();
		
		if (confirm("Er du sikker på, at dette er spam, som skal rapporteres? Du ender med selv at spamme, hvis dette ikke er spam.")) {
			var $this = $(this);
			$this.html('Rolling...').removeAttr("href").unbind();
			
			var postParent = $this.parents('.comment').find('h2');
			var userLink   = $('a:last', postParent)[0].href.replace('%7E', '~');
			var userName   = $('a:last', postParent).text();
			var postId     = $('a:nth-child(2)', postParent).attr('name').substr(2);
			var postLink   = $('a:nth-child(3)', postParent).attr('href');
			
			$.get("/z4/action.php", {"class":"Z4_Forum_Item", "action":"getRaw", "id":postId}, function(xml) {
				var text = encodeURIComponent("Automatisk spamrapport.\nBrugernavn: [url=" + userLink + "]" + userName + "[/url]\nURL: " + postLink + "\n\nEksempel på spam:\n[quote]" + $.trim($("Response", xml).text().replace("\n\n\n\n", "\n\n")) + "[/quote]");
				
				// Jeg har byttet om på action og class, så fixPosts() ikke køres. Skide smart, Daniel.
				$.get("/z4/action.php", {"action":"usersave", "class":"Z4_Forum_Item", "thread_id":119686, "lastId":99999999999999999, "comment":text}, function(xml) {
					$this.html('Succes!');
				}, "xml");
				
			}, "xml");
		}
		
		return false;
	});
}

function NES_embedYouTubeUrlsFunc(object) {
	if (embedYouTubeUrls) {
		var re = /(?:http:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/watch\?.*v=)(.{11})[^ .,\?!:]*/gmi;
		$('.text_content p:contains("youtu"),.text_content p:has(a[href*="youtu"])', object).each(function() {
			$(this.childNodes).each(function() {
				var w = parseInt($(this).parent().css('width'));
				if (this.nodeType == 3)
					var a = this.nodeValue;
				else if (this.nodeType == 1)
					var a = this.href;
				if (typeof a !== 'undefined' && (!embedYouTubeUrlsNotInQuote || (embedYouTubeUrlsNotInQuote && w === 381)) && re.test(a)) {
					$(this).replaceWith(a.replace(re, function(str, a) {
						return '<iframe data="'+str+'" width="'+(w-1)+'" height="'+((w-1)*(3/4))+'" frameborder="0" allowfullscreen="" src="http://www.youtube.com/embed/' + a + '"></iframe>';
					}).replace(/&/gm, '&amp;'));
				}
			});
		});
	}
}

function NES_fixSpoilers(object) {
	$('.spoiler', object).remove();
	// Skal omdøbes, så den originale bind ikke kommer på. Hvis den allerede er på, sørger unbind() for at fjerne den.
	// Rækkefølgen af scripts er ikke altid den samme (tak for lort, HTML5, IE og Webkit).
	$('.open_spoiler', object).unbind().attr('class', 'NES_open_spoiler').click(function(e) {
		e.preventDefault();
		$(this).replaceWith(this.id);
		return false;
	})
}

function NES_fixPostTimes(object) {
	var a = $('.comment_date:contains("min siden")', object);
	var b = $('.comment_date:contains("sek siden")', object);
	var c = $('.comment_date:contains("nu")', object);
	var d = $('.comment_date:contains("i dag"):not(:contains("."))', object);
	
	d.each(function() {
		var e = $(this);
		e.html(e.attr('title') + ' (i dag)');
	});
	
	if (b.length > 0 || c.length > 0)
		var l = 1000;
	else if (a.length > 0)
		var l = 1000 * (61 - (new Date()).getSeconds()); // Så starter den altid, når klokken slår et nyt minut. Tøhø.
	else
		return;
	
	c.each(function() {
		var e = $(this);
		e.html(e.attr('title') + ' (1 sek siden)');
	});
	
	b.each(function() {
		var e = $(this);
		var s = +e.html().match(/(\d+) sek siden/)[1] + 1;
		if (s >= 60)
			$(this).html(e.attr('title') + ' (1 min siden)');
		else
			$(this).html(e.attr('title') + ' (' + s + ' sek siden)');
	});
	
	a.each(function() {
		var e = $(this);
		var m = {'jan':0,'feb':1,'mar':2,'apr':3,'maj':4,'jun':5,'jul':6,'aug':7,'sep':8,'okt':9,'nov':10,'dec':11};
		var s = /(\d+)\. ([a-z]+)\. (\d+) (\d+):(\d+)/.exec(e.attr('title'));
		var d = new Date(s[3], m[s[2]], s[1], s[4], s[5], 0, 0);
		var v = Math.round(((new Date()) - d)/(60000));
		if (v >= 60)
			e.html(e.attr('title') + ' (i dag)');
		else
			e.html(e.attr('title') + ' (' + v + ' min siden)');
	});
	
	clearTimeout(NES_fixPostTimesCounter);
	NES_fixPostTimesCounter = setTimeout("NES_fixPostTimes()", l);
}

function NES_applyTargetBlankFunc(object) {
	if (applyTargetBlank) {
		if (applyTargetBlankOnlyOutgoing) {
			var href = location.protocol + "//" + location.hostname + "/";
			$('a:not([href^="#"])', object).filter(function() {
				return (this.href.substring(0, href.length) != href);
			}).attr('target', '_blank');
		} else {
			$('a:not([href^="#"])', object).attr('target', '_blank');
		}
	}
}

function NES_fixFailTags(object) {
	if (fixFailTagsSetting) {
		var a = ['b',            'u',       'i',        's'      ];
		var b = {'b': 'strong>', 'u': 'u>', 'i': 'em>', 's': 's>'};

		$('.text_content', object).each(function() {
			var e = $(this);
			for (i in a) {
				var x = e.html().indexOf('[' + a[i] + ']');
				
				if (x !== -1) {
					e.html(e.html().substr(0, x) + e.html().substr(x).replace(new RegExp('<(\/)?' + b[a[i]], 'g'), '').replace(new RegExp('\\[' + a[i] + '\\]', 'g'), '</' + b[a[i]]));
				}
				
				/*var x = e.html().indexOf('[/' + a[i].toUpperCase() + ']');
				
				if (x !== -1) {
					e.html(e.html().substr(0, x) + e.html().substr(x).replace(new RegExp('<(\/)?' + b[a[i]], 'g'), '').replace(new RegExp('\\[/' + a[i].toUpperCase() + '\\]', 'g'), '</' + b[a[i]]));
				}*/
			}
		});
	}
}

function NES_urlToImg(object) {
	if (showUrlImages) {
		$('.text_content a:not([href^="#"])', object).filter(function() {
			return (/\.(png|gif|jp(e)?g)$/i.test(this.href) && $(this).attr('data') === undefined);
		}).each(function() {
			var e = $(this);
			var b = this.href;
			var c = e.text();
			if (b == c)
				var c = $('<div><a href="'+b+'">'+b+'</a></div>').linkShorten().find('a').text();
			e.replaceWith('<a data="NES_img" title="'+c+'" href="'+b+'"><img title="'+c+'" alt="'+c+'" class="NES_urlImg" style="max-width: ' + e.parent().css('width') + ';" src="' + b + '" /></a>');
		});
	}
}

// Skal køres EFTER NES_improvedQuote().
// Advarsel: Tåler ikke at blive kørt flere gange for samme indlæg, men det burde ikke være noget problem endnu
function NES_addMiniQuote(object) {
	$('.NES_quoteitem', object).after(' (<a href="#" class="miniquote">miniquote</a>)');
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

function NES_addLinkToPostReferenceFunc(object, isPreview) {
	if (addLinkToPostReference) {
		$('.text_content p:contains("#")', object).each(function() {
			//if ($(this).parents('#post_preview').length == 1) {
			if (isPreview) {
				var postNum = $('h2 a:first', '.comment:not([id=]):last').attr('name');
				var p = 'post_preview';
			} else {
				var postNum = $(this).parents('.comment').find('h2 a:first').attr('name');
				var p = $(this).parents('.comment').attr('id');
			}
			
			$(this.childNodes).each(function() {
				if (this.nodeType == 3) {
					// #tal efterfulgt af enten mellemrum, linjeknæk, kolon, komma, punktum, spørgsmålstegn, udråbstegn eller parentes-slut samt ved afsluttet afsnit eller linje
					$(this).replaceWith(this.nodeValue.replace(/#(\d+)( |<br>|:|,|\.|\?|!|\)|<\/p>|$)/gm, function(str, a, b) {
						if (a < 100 && _pageId > 20) { // Fra indlæg #1001 vil #99 betyder #999 osv.
							c = Math.floor((50 * (_pageId - 1)) / 100) * 100 + +a;
							if (c > postNum)
								c -= 100;
						} else
							c = +a;
						if (a == 0 || (c == postNum && p != 'post_preview'))
							return '#' + a + b;
						var him = $('.comment:has(a[name=' + c + '])').attr('id');
						return '<a data="NES_ref" class="NES_postReferenceLink"' + (((showPostOnMouseOverReference) && ((c > 50 * (_pageId - 1)) && (c <= 50 * (_pageId - 1) + 50))) ? ' onclick="NES_goToPost(\'' + him + '\')" onmouseout="NES_hidePost();" onmouseover="NES_showPost(\'' + p + '\', \'' + him + '\')"' : '') + ' href="#' + c + '">#' + a + '</a>' + b;
					}).replace(/&/gm, '&amp;'));
				}
			});
		});
	}
}

function NES_showPost(me, him) {
	var q = $("#" + him).clone().attr('id', '').addClass("NES_cite").prependTo('#comments');
	if (showPostOnMouseOverReferenceMini)
		q.find('.comment_right').remove();
	//q.css("top", $("#" + me).offset().top - q.offset().top + "px");
}

function NES_hidePost() {
	//$("#" + him).css("top", "").removeClass("NES_cite");
	$('.NES_cite').remove();
}

function NES_goToPost(him) {
	NES_hidePost();
	//var a = parseFloat($("#" + him).css("top"));
	//if (isNaN(a))
	//	a = 0;
	//$(window).scrollTop($("#" + him ).offset().top - a + 12);
}

function NES_addPermLink(object) {
	href = NES_getUrl();
	
	$('h2', object).each(function() {
		var a = $(this).html();
		a = a.replace(/#(\d+):/, '<a href="' + href + '/page' + _pageId + '#$1">#$1:</a>')
		$(this).html(a);
	});	
}

// Advarsel: Tåler ikke at blive kørt flere gange for samme indlæg, men det burde ikke være noget problem endnu
// Sætter event handler på "Citer indlæg" - Sakset direkte fra newz.dk med vigtige ændringer. Jeg har ladet mine kommentarer fra newz.dk's script lade blive.
function NES_improvedQuote(object) {
	// Skal omdøbes, så den originale bind ikke kommer på. Hvis den allerede er på, sørger unbind() for at fjerne den.
	// Rækkefølgen af scripts er ikke altid den samme (tak for lort, HTML5, IE og Webkit).
	$(".quoteitem", object).unbind().attr('class', 'NES_quoteitem').bind("click", function(e) {
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
				var container = document.createElement("div");
				container.appendChild(getSelection().getRangeAt(0).cloneContents());
				var text = container.innerHTML;
				
				if (text != '') {
					hentFraServer = false;
				
					function parse(givenQuotePos) {
						function parseTag(tag) {
							// tag = '<tag attr=value attr2=value2>' (u.s.w. med attr'erne)
							// eller '<tag>'
							var tagmatch = /^<([a-z]+)>/.exec(tag);
							// Har attr, else har ikke
							if (tagmatch == null) {
								var tag2 = tag.substr(tag.indexOf(' ') + 1).substr(0, tag.length - 1),
									regmatch, tagattrs = {},
									tagreg = /([^= ]+)="([^"]+)"/g;
								while (regmatch = tagreg.exec(tag2)) {
									tagattrs[regmatch[1]] = regmatch[2];
								}
								return {
									tag: /^<([a-z]+) /.exec(tag)[1],
									attr: tagattrs
								}
							} else {
								return {
									tag: tagmatch[1],
									attr: null
								}
							}
						}
						
						if (typeof givenQuotePos === 'undefined')
							givenQuotePos = -1;
						
						while (true) {
							// Hvis nået slutningen
							if (i >= len)
								return;
							
							s = text.substr(i);
							l = s.indexOf('<');
							
							// Hvis løbet tør for HTML
							if (l === -1) {
								t += s;
								return;
							}
							
							t += text.substr(i, l);
							i += s.indexOf('>') + 1;
							
							// Hvis nået et end-tag, else hvis nået et start-tag
							if (s.substr(l + 1, 1) === '/') {
								if (givenQuotePos === -1)
									return;
								else
									return false;
							} else {
								var obj = parseTag(s.substr(l, s.indexOf('>') + 1));
								switch (obj.tag) {
									case 'strong':
										t += '[b]';
										parse();
										t += '[/b]'
										break;
									case 'u':
										t += '[u]';
										parse();
										t += '[/u]'
										break;
									case 'em':
										t += '[i]';
										parse();
										t += '[/i]'
										break;
									case 's':
										t += '[s]';
										parse();
										t += '[/s]'
										break;
									case 'code':
										t += '[code]';
										parse();
										t += '[/code]'
										break;
									case 'ul':
										t += '[list]';
										parse();
										t += '[/list]'
										break;
									case 'li':
										t += '[li]';
										parse();
										t += '[/li]'
										break;
									case 'a':
										switch (obj.attr.data) {
											case 'NES_img':
												s = $('<div><a href="'+obj.attr.href+'">'+obj.attr.href+'</a></div>').linkShorten().find('a').text();
												if (s === obj.attr.title || s.substr(7) === obj.attr.title)
													t += obj.attr.href;
												else
													t += '[url=' + obj.attr.href + ']' + obj.attr.title + '[/url]';
												i += 4;
												break;
											case 'NES_ref':
												t += obj.attr.href;
												i += text.substr(i).indexOf('>') + 1;
												break;
											default:
												l = s.indexOf('</');
												var tmp1 = $('<div><a href="'+obj.attr.href+'">'+obj.attr.href+'</a></div>').linkShorten().find('a').text(),
													tmp2 = s.substring(s.indexOf('>') + 1, l);
												// a uden [url], else a med [url]
												if (s.substr(l, 4) === '</a>' && (tmp1 === tmp2 || tmp1.substr(7) === tmp2)) {
													t += obj.attr.href;
													i += text.substr(i).indexOf('</a>') + 4;
												} else {
													t += '[url=' + obj.attr.href + ']';
													parse();
													t += '[/url]';
												}
												break;
										}
										break;
									case 'blockquote':
										t += '[quote';
										var quotePos = t.length;
										if (parse(t.length) === false) {
											t = t.substr(0, quotePos) + ']' + t.substr(quotePos);
										}
										t += '[/quote]';
										break;
									case 'cite':
										if (givenQuotePos === -1) {
											i += text.substr(i).indexOf('</cite>') + 7;
											break;
										}
										
										s = text.substr(i);
										var rem = s.match(/^<a href="([^"]+)">([^<]+)<\/a><\/cite>/);
										
										// Ingen kilde, else kilde/#-reference
										if (rem === null) {
											s = /([^<]+)</.exec(s)[1];
										} else {
											switch (rem[2]) {
												// URL
												case 'Kilde':
													s = rem[1];
													break;
												// #1-reference
												case rem[1]:
													s = rem[1].substr(1);
													break;
												// Brugernavn (#1)-reference
												default:
													s = rem[2].lastIndexOf('#');
													s = rem[2].substr(0, s) + rem[2].substr(s + 1);
													break;
											}
										}
										t = t.substr(0, givenQuotePos) + '=' + s + ']' + t.substr(givenQuotePos);
										i += text.substr(i).indexOf('</cite>') + 7;
										givenQuotePos = -1;
										break;
									case 'iframe':
										t += obj.attr.data;
										i += text.substr(i).indexOf('</iframe>') + 9;
										break;
									default:
										console.log('NES: Parse fejlede. Data:');
										console.log(obj);
										return;
								}
							}
						}
					}
					
					text = text.replace(/<\/p><p>/g, '\n\n').replace(/<p><\/p>/g, '\n').replace(/<\/p>|<p>/g, '').replace(/<img [^>]+>/g, '').replace(/<br>/g, '\n');
					var t = '',
						s = '',
						i = 0,
						l = 0,
						len = text.length;
					if (text.indexOf('<li>') === 0) {
						t = '[list]';
						parse();
						t += '[/list]';
					} else
						parse();
					text = t;
					
					// Entity decode
					text = $.trim(Encoder.htmlDecode(text));
					
					// Finder kommentarfeltet og indsætter et linjeknæk før det citerede indlæg, hvis feltet ikke er tomt
					var comment = $("#id_comment").val();
					if (comment.length > 0) {
						comment += "\n\n";
					}
					
					// Sætter indlægget ind i en quote, som vi kender den
					comment += "[quote=" + username + " (" + itemId + ")]" + text + "[/quote]" + "\n\n";
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
	var a = $('<select onchange="if ($(this).val() == -1) return(false); $(\'#id_comment\').val(localStorage[\'commentHistory\' + $(this).val()]).keyup();" style="width: 130px">')
		.appendTo('#commentStorage');
	a.append('<option value="-1">Tidligere indlæg</option>');
	for (var i = 0; i < 6; i++) {
		var b = Encoder.htmlEncode(localStorage['commentHistory' + i]);
		var l = b.length;
		if (l > 119)
			b = b.substr(0, 60) + ' [...] ' + b.substr(l - 60, l - 60);
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
	// Hvis kommentarfeltet mangler, er man sikkert ikke i en tråd/nyhed (det eneste sted, hvor man kan skifte side med AJAX)
	if (typeof _threadId == 'undefined' || _threadId == 0)
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
	$('.pagination').hide();
	$(".loading").show();
	
	$.ajax({
		dataType: 'xml',
		url: "/z4/action.php",
		data: {"class":"Z4_Forum_Item", "action":"page", "id":_threadId, "offset":pageNo},
		success: function (xml) {
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
			
			switch (state) {
				case 1:
					$(window).scrollTop(0);
					break;
				case 2:
					$(window).scrollTop($('.comment h2:has(a[name=' + hash + '])').offset().top);
					break;
			}
			
			// (Gen)aktiverer js for "Yderligere information", etc. ved at sætte event handlers igen (newz.dk-funktion)
			UpdatePosts();
		},
		complete: function() {
			$(".loading").hide();
			$('.pagination').show();
		}
	});
}

// URL uden /page eller #
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