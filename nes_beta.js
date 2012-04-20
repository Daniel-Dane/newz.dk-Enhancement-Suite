/**
 @name           Super newz.dk Enhancement Suite (SNES)
 @url            https://raw.github.com/Daniel-Dane/newz.dk-Enhancement-Suite/master/nes.js
*/

// Følgende (FRA OG MED CITATIONSTEGNET TIL SLUT) indsættes i indstillinger -> stylesheet for at installere SNES
// " /><script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script><script type="text/javascript" src="https://raw.github.com/Daniel-Dane/newz.dk-Enhancement-Suite/master/nes.js"></script><link rel="stylesheet

var SNES_version = "2.2 beta";
var SNES_loaded = SNES_loaded || false;

if (!$) {
	// Rækkefølgen af scripts er ikke altid den samme (tak for lort, HTML5, IE og Webkit).
	// Når jQuery er cached, burde det ikke være noget problem.
	alert('Opdatér (F5, men IKKE Ctrl+F5) lige. Får du denne pop-up flere gange, skal du fjerne SNES og fortælle om det.');
} else {
	if ((typeof localStorage === 'undefined') || (typeof window.history.pushState === 'undefined')) {
		$(document).ready(function () {
			$('#nmSiteSelect').next().find('a:last').before('Failbrowser. SNES kan ikke køre her. | ');
		});
	} else {
		if ((/^http:\/\/(.+\.)?newz\.dk(?!\/banner).*$/.test(location.href)) && (!SNES_loaded)) {
			SNES_loaded = true;
			var SNES_startHash = location.hash;   // Gemmer hash, hvis newz.dk AJAX'er til den rigtige side, så vi kan hoppe til det rigtige indlæg
			var SNES_postSortByRating = false;    // true, når der er trykket på "Sorter indlæg efter rating"
			var SNES_fixPostTimesCounter = 0;     // setTimeout til SNES_fixPostTimes()
			var SNES_flashFaviconCounter = 0;     //setInterval til SNES_flashFavicon(), som startes fra "SNES_flashFavicon() #2" (TAG)
			var SNES_flashFaviconBoolean = false; // Hører også til SNES_flashFavicon()
			$(document).ready(function () {
				$.fn.reverse = [].reverse;
				SNES_init();
			});
		}
	}
}

function SNES_init() {
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
	
	// ----------------------------------------------------------------------------
	// markItUp! Universal MarkUp Engine, JQuery plugin
	// v 1.1.x
	// Dual licensed under the MIT and GPL licenses.
	// ----------------------------------------------------------------------------
	// Copyright (C) 2007-2011 Jay Salvat
	// http://markitup.jaysalvat.com/
	// ----------------------------------------------------------------------------
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	// 
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	// 
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	// ----------------------------------------------------------------------------
	(function($){$.fn.markItUp=function(settings,extraSettings){var options,ctrlKey,shiftKey,altKey;ctrlKey=shiftKey=altKey=false;options={id:"",nameSpace:"",root:"",previewInWindow:"",previewAutoRefresh:true,previewPosition:"after",previewTemplatePath:"~/templates/preview.html",previewParser:false,previewParserPath:"",previewParserVar:"data",resizeHandle:true,beforeInsert:"",afterInsert:"",onEnter:{},onShiftEnter:{},onCtrlEnter:{},onTab:{},markupSet:[{}]};$.extend(options,settings,extraSettings);if(!options.root){$("script").each(function(a,b){miuScript=$(b).get(0).src.match(/(.*)jquery\.markitup(\.pack)?\.js$/);if(miuScript!==null){options.root=miuScript[1]}})}return this.each(function(){function keyPressed(a){shiftKey=a.shiftKey;altKey=a.altKey;ctrlKey=!(a.altKey&&a.ctrlKey)?a.ctrlKey||a.metaKey:false;if(a.type==="keydown"){if(ctrlKey===true){li=$('a[accesskey="'+String.fromCharCode(a.keyCode)+'"]',header).parent("li");if(li.length!==0){ctrlKey=false;setTimeout(function(){li.triggerHandler("mouseup")},1);return false}}if(a.keyCode===13||a.keyCode===10){if(ctrlKey===true){ctrlKey=false;markup(options.onCtrlEnter);return options.onCtrlEnter.keepDefault}else if(shiftKey===true){shiftKey=false;markup(options.onShiftEnter);return options.onShiftEnter.keepDefault}else{markup(options.onEnter);return options.onEnter.keepDefault}}if(a.keyCode===9){if(shiftKey==true||ctrlKey==true||altKey==true){return false}if(caretOffset!==-1){get();caretOffset=$$.val().length-caretOffset;set(caretOffset,0);caretOffset=-1;return false}else{markup(options.onTab);return options.onTab.keepDefault}}}}function writeInPreview(a){if(previewWindow.document){try{sp=previewWindow.document.documentElement.scrollTop}catch(b){sp=0}previewWindow.document.open();previewWindow.document.write(a);previewWindow.document.close();previewWindow.document.documentElement.scrollTop=sp}}function renderPreview(){var a;if(options.previewParser&&typeof options.previewParser==="function"){var b=options.previewParser($$.val());writeInPreview(localize(b,1))}else if(options.previewParserPath!==""){$.ajax({type:"POST",dataType:"text",global:false,url:options.previewParserPath,data:options.previewParserVar+"="+encodeURIComponent($$.val()),success:function(a){writeInPreview(localize(a,1))}})}else{if(!template){$.ajax({url:options.previewTemplatePath,dataType:"text",global:false,success:function(a){writeInPreview(localize(a,1).replace(/<!-- content -->/g,$$.val()))}})}}return false}function refreshPreview(){renderPreview()}function preview(){if(!previewWindow||previewWindow.closed){if(options.previewInWindow){previewWindow=window.open("","preview",options.previewInWindow);$(window).unload(function(){previewWindow.close()})}else{iFrame=$('<iframe class="markItUpPreviewFrame"></iframe>');if(options.previewPosition=="after"){iFrame.insertAfter(footer)}else{iFrame.insertBefore(header)}previewWindow=iFrame[iFrame.length-1].contentWindow||frame[iFrame.length-1]}}else if(altKey===true){if(iFrame){iFrame.remove()}else{previewWindow.close()}previewWindow=iFrame=false}if(!options.previewAutoRefresh){refreshPreview()}if(options.previewInWindow){previewWindow.focus()}}function get(){textarea.focus();scrollPosition=textarea.scrollTop;if(document.selection){selection=document.selection.createRange().text;if($.browser.msie){var a=document.selection.createRange(),b=a.duplicate();b.moveToElementText(textarea);caretPosition=-1;while(b.inRange(a)){b.moveStart("character");caretPosition++}}else{caretPosition=textarea.selectionStart}}else{caretPosition=textarea.selectionStart;selection=textarea.value.substring(caretPosition,textarea.selectionEnd)}return selection}function set(a,b){if(textarea.createTextRange){if($.browser.opera&&$.browser.version>=9.5&&b==0){return false}range=textarea.createTextRange();range.collapse(true);range.moveStart("character",a);range.moveEnd("character",b);range.select()}else if(textarea.setSelectionRange){textarea.setSelectionRange(a,a+b)}textarea.scrollTop=scrollPosition;textarea.focus()}function insert(a){if(document.selection){var b=document.selection.createRange();b.text=a}else{textarea.value=textarea.value.substring(0,caretPosition)+a+textarea.value.substring(caretPosition+selection.length,textarea.value.length)}}function fixIeBug(a){if($.browser.msie){return a.length-a.replace(/\r*/g,"").length}return 0}function fixOperaBug(a){if($.browser.opera){return a.length-a.replace(/\n*/g,"").length}return 0}function markup(a){var b,c,d,e;hash=clicked=a;get();$.extend(hash,{line:"",root:options.root,textarea:textarea,selection:selection||"",caretPosition:caretPosition,ctrlKey:ctrlKey,shiftKey:shiftKey,altKey:altKey});prepare(options.beforeInsert);prepare(clicked.beforeInsert);if(ctrlKey===true&&shiftKey===true||a.multiline===true){prepare(clicked.beforeMultiInsert)}$.extend(hash,{line:1});if(ctrlKey===true&&shiftKey===true){lines=selection.split(/\r?\n/);for(c=0,d=lines.length,e=0;e<d;e++){if($.trim(lines[e])!==""){$.extend(hash,{line:++c,selection:lines[e]});lines[e]=build(lines[e]).block}else{lines[e]=""}}string={block:lines.join("\n")};start=caretPosition;b=string.block.length+($.browser.opera?d-1:0)}else if(ctrlKey===true){string=build(selection);start=caretPosition+string.openWith.length;b=string.block.length-string.openWith.length-string.closeWith.length;b=b-(string.block.match(/ $/)?1:0);b-=fixIeBug(string.block)}else if(shiftKey===true){string=build(selection);start=caretPosition;b=string.block.length;b-=fixIeBug(string.block)}else{string=build(selection);start=caretPosition+string.block.length;b=0;start-=fixIeBug(string.block)}if(selection===""&&string.replaceWith===""){caretOffset+=fixOperaBug(string.block);start=caretPosition+string.openWith.length;b=string.block.length-string.openWith.length-string.closeWith.length;caretOffset=$$.val().substring(caretPosition,$$.val().length).length;caretOffset-=fixOperaBug($$.val().substring(0,caretPosition))}$.extend(hash,{caretPosition:caretPosition,scrollPosition:scrollPosition});if(string.block!==selection&&abort===false){insert(string.block);set(start,b)}else{caretOffset=-1}get();$.extend(hash,{line:"",selection:selection});if(ctrlKey===true&&shiftKey===true||a.multiline===true){prepare(clicked.afterMultiInsert)}prepare(clicked.afterInsert);prepare(options.afterInsert);if(previewWindow&&options.previewAutoRefresh){refreshPreview()}shiftKey=altKey=ctrlKey=abort=false}function build(a){var b=prepare(clicked.openWith);var c=prepare(clicked.placeHolder);var d=prepare(clicked.replaceWith);var e=prepare(clicked.closeWith);var f=prepare(clicked.openBlockWith);var g=prepare(clicked.closeBlockWith);var h=clicked.multiline;if(d!==""){block=b+d+e}else if(selection===""&&c!==""){block=b+c+e}else{a=a||selection;var i=[a],j=[];if(h===true){i=a.split(/\r?\n/)}for(var k=0;k<i.length;k++){line=i[k];var l;if(l=line.match(/ *$/)){j.push(b+line.replace(/ *$/g,"")+e+l)}else{j.push(b+line+e)}}block=j.join("\n")}block=f+block+g;return{block:block,openWith:b,replaceWith:d,placeHolder:c,closeWith:e}}function prepare(a){if($.isFunction(a)){a=a(hash)}return magicMarkups(a)}function magicMarkups(a){if(a){a=a.toString();a=a.replace(/\(\!\(([\s\S]*?)\)\!\)/g,function(a,b){var c=b.split("|!|");if(altKey===true){return c[1]!==undefined?c[1]:c[0]}else{return c[1]===undefined?"":c[0]}});a=a.replace(/\[\!\[([\s\S]*?)\]\!\]/g,function(a,b){var c=b.split(":!:");if(abort===true){return false}value=prompt(c[0],c[1]?c[1]:"");if(value===null){abort=true}return value});return a}return""}function dropMenus(markupSet){var ul=$("<ul></ul>"),i=0;$("li:hover > ul",ul).css("display","block");$.each(markupSet,function(){var button=this,t="",title,li,j;title=button.key?(button.name||"")+" [Ctrl+"+button.key+"]":button.name||"";key=button.key?'accesskey="'+button.key+'"':"";if(button.separator){li=$('<li class="markItUpSeparator">'+(button.separator||"")+"</li>").appendTo(ul)}else{i++;for(j=levels.length-1;j>=0;j--){t+=levels[j]+"-"}li=$('<li class="markItUpButton markItUpButton'+t+i+" "+(button.className||"")+'"><a href="" '+key+' title="'+title+'">'+(button.name||"")+"</a></li>").bind("contextmenu",function(){return false}).click(function(){return false}).bind("focusin",function(){$$.focus()}).mouseup(function(){if(button.call){eval(button.call)()}setTimeout(function(){markup(button)},1);return false}).hover(function(){$("> ul",this).show();$(document).one("click",function(){$("ul ul",header).hide()})},function(){$("> ul",this).hide()}).appendTo(ul);if(button.dropMenu){levels.push(i);$(li).addClass("markItUpDropMenu").append(dropMenus(button.dropMenu))}}});levels.pop();return ul}function init(){id="";nameSpace="";if(options.id){id='id="'+options.id+'"'}else if($$.attr("id")){id='id="markItUp'+$$.attr("id").substr(0,1).toUpperCase()+$$.attr("id").substr(1)+'"'}if(options.nameSpace){nameSpace='class="'+options.nameSpace+'"'}$$.wrap("<div "+nameSpace+"></div>");$$.wrap("<div "+id+' class="markItUp"></div>');$$.wrap('<div class="markItUpContainer"></div>');$$.addClass("markItUpEditor");header=$('<div class="markItUpHeader"></div>').insertBefore($$);$(dropMenus(options.markupSet)).appendTo(header);footer=$('<div class="markItUpFooter"></div>').insertAfter($$);if(options.resizeHandle===true&&$.browser.safari!==true){resizeHandle=$('<div class="markItUpResizeHandle"></div>').insertAfter($$).bind("mousedown",function(a){var b=$$.height(),c=a.clientY,d,e;d=function(a){$$.css("height",Math.max(20,a.clientY+b-c)+"px");return false};e=function(a){$("html").unbind("mousemove",d).unbind("mouseup",e);return false};$("html").bind("mousemove",d).bind("mouseup",e)});footer.append(resizeHandle)}$$.keydown(keyPressed).keyup(keyPressed);$$.bind("insertion",function(a,b){if(b.target!==false){get()}if(textarea===$.markItUp.focused){markup(b)}});$$.focus(function(){$.markItUp.focused=this})}function localize(a,b){if(b){return a.replace(/("|')~\//g,"$1"+options.root)}return a.replace(/^~\//,options.root)}var $$,textarea,levels,scrollPosition,caretPosition,caretOffset,clicked,hash,header,footer,previewWindow,template,iFrame,abort;$$=$(this);textarea=this;levels=[];abort=false;scrollPosition=caretPosition=0;caretOffset=-1;options.previewParserPath=localize(options.previewParserPath);options.previewTemplatePath=localize(options.previewTemplatePath);init()})};$.fn.markItUpRemove=function(){return this.each(function(){var a=$(this).unbind().removeClass("markItUpEditor");a.parent("div").parent("div.markItUp").parent("div").replaceWith(a)})};$.markItUp=function(a){var b={target:false};$.extend(b,a);if(b.target){return $(b.target).each(function(){$(this).focus();$(this).trigger("insertion",[b])})}else{$("textarea").trigger("insertion",[b])}}})(jQuery)
	
	// SNES-indstillingsboksen
	$('<div class="secondary_column" style="font-size: 1.2em; margin: 16px auto auto; float: none; padding: 0; width: 600px;" id="SNES-menu" />').insertAfter('#nmTopBar')
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
			<input type="checkbox" id="applyTargetBlankOnlyOutgoing" name="applyTargetBlankOnlyOutgoing"><label for="applyTargetBlankOnlyOutgoing"> Men kun udgående (inkl. newz.dk\'s underdomæner)</label><br> \
		</div> \
		<input type="checkbox" id="fixFailTagsSetting" name="fixFailTagsSetting"><label for="fixFailTagsSetting"> Ret overflødige BB-tags i indlæg (NB: Læs om funktionen på kynz inden ibrugtagen)</label><br> \
		<input type="checkbox" id="showUrlImages" name="showUrlImages"><label for="showUrlImages"> Vis billeder i indlæg</label><br> \
		<input type="checkbox" id="showUrlVideos" name="showUrlVideos"><label for="showUrlVideos"> Vis film i indlæg</label><br> \
		<input type="checkbox" id="embedYouTubeUrls" name="embedYouTubeUrls"><label for="embedYouTubeUrls"> Omdan YouTube-links til embedded video</label><br> \
		<div id="embedYouTubeUrlsSub" style="padding-left: 16px;"> \
			<input type="checkbox" id="embedYouTubeUrlsNotInQuote" name="embedYouTubeUrlsNotInQuote"><label for="embedYouTubeUrlsNotInQuote"> Men ikke i citater</label><br> \
			<!--<input type="checkbox" id="embedYouTubeUrlsNewOnly" name="embedYouTubeUrlsNewOnly"><label for="embedYouTubeUrlsNewOnly"> Kun i ulæste indlæg (indlæg efter "Indlæg skrevet siden sidste besøg i denne tråd."-bjælken)</label><br>--> \
			<label for="embedYouTubeUrlsCount">Kun de sidste </label><input style="width: 20px;" type="text" id="embedYouTubeUrlsCount" name="embedYouTubeUrlsCount"><label for="embedYouTubeUrlsCount"> links konverteres (0 = ∞)</label> \
		</div> \
		<input type="checkbox" id="narrowSite" name="narrowSite"><label for="narrowSite"> Gør newz.dk lidt smallere (til opløsninger med 1024 i bredde)</label><br> \
		<input type="checkbox" id="updateFaviconOnNewPosts" name="updateFaviconOnNewPosts"><label for="updateFaviconOnNewPosts"> Informér mig om nye indlæg, når jeg befinder mig på /forum, ved at skifte favicon</label><br> \
		<div id="updateFaviconOnNewPostsSub" style="padding-left: 16px;"> \
			<input type="checkbox" id="updateFaviconOnNewPostsBlink" name="updateFaviconOnNewPostsBlink"><label for="updateFaviconOnNewPostsBlink"> Blink for mig!</label><br> \
		</div> \
		<div style="margin-top: 12px;"> \
			<hr> \
			Ændringerne sættes i kraft ved næste indlæsning. Lær alt om SNES på <a href="http://www.knowyournewz.dk/index.php?title=Super_newz.dk_Enhancement_Suite">kynz</a>! Version ' + SNES_version + '. \
		</div> \
	</div> \
	').hide();
	
	// "SNES-indstillinger"-knappen
	$('#nmSiteSelect').next().find('a:last').before('<a href="#" id="SNES-toggle">SNES-indstillinger</a> | ');
	$('#SNES-toggle').click(function (e) {
		e.preventDefault();
		$('#SNES-menu').toggle();
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
	showUrlVideos = (localStorage["showUrlVideos"] == "true");
	embedYouTubeUrls = (localStorage["embedYouTubeUrls"] == "true");
	embedYouTubeUrlsNotInQuote = (localStorage["embedYouTubeUrlsNotInQuote"] == "true");
	//embedYouTubeUrlsNewOnly = (localStorage["embedYouTubeUrlsNewOnly"] == "true");
	$('#embedYouTubeUrlsCount').val(embedYouTubeUrlsCount = +localStorage["embedYouTubeUrlsCount"]);
	if (narrowSite = (localStorage["narrowSite"] == "true")) {
		$('body,#center,#nmContainer').css('width','1000px');
	}
	updateFaviconOnNewPosts = (localStorage["updateFaviconOnNewPosts"] == "true");
	updateFaviconOnNewPostsBlink = (localStorage["updateFaviconOnNewPostsBlink"] == "true");
	
	// Event handlers til knapperne
	var handlerList = ['addLinkToPostReference', 'showPostOnMouseOverReference', 'showPostOnMouseOverReferenceLeft', 'showPostOnMouseOverReferenceMini', 'improvedQuoteSetting',
					   'applyTargetBlank', 'applyTargetBlankOnlyOutgoing', 'fixFailTagsSetting', 'showUrlImages', 'showUrlVideos', 'embedYouTubeUrls', 'embedYouTubeUrlsNotInQuote',
					   'narrowSite', 'updateFaviconOnNewPosts', 'updateFaviconOnNewPostsBlink'];
	for (var i = 0; i < handlerList.length; i++) {
		$("#" + handlerList[i]).bind("click", function() {
			localStorage[this.id] = this.checked ? 'true' : 'false';
			SNES_updateSettingsSub();
		}).attr('checked', (localStorage[handlerList[i]] == 'true'));
	}
	$("#sortRating").bind("click", function() {
		SNES_postSortByRating = true;
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
	$('#embedYouTubeUrlsCount').change(function() {
		var a = +$(this).val();
		if (isNaN(a))
			a = 0;
		$(this).val(localStorage["embedYouTubeUrlsCount"] = a);
	});
	
	// Styles til fix af newz.dk samt til nogle af SNES' features.
	$("<style type='text/css'> \
	.text_content { \
		width: 381px; /* Fikser bredden af indlæg, så [list] ikke sniger sig ind over højresiden af indlæggene */ \
	} \
	.indexsection ul li { \
		width: inherit !important; /* Fikser nyhedslisten, så teksten ikke går for langt og ikke kan læses */ \
	} \
	.SNES_postReferenceLink { \
		color: green !important; \
	} \
	 \
	" + (showPostOnMouseOverReference ? ".SNES_cite{z-index: 9000; width: " + (showPostOnMouseOverReferenceMini ? '381' : '651') + "px; position: fixed; background-color: white; border: 1px solid black; padding: 10px 5px 1px 5px; top: 0; " + ((localStorage["showPostOnMouseOverReferenceLeft"] == "true") ? 'left: 0;' : 'right: 0') + '}' : '') + "\
	.SNES_urlImg { \
	max-height: 381px; \
	} \
	.markItUp .markItUpButton1 a	{ \
		background-image:url(http://login.newz.dk/markitup/sets/bbcodenewz/images/bold.png); \
	} \
	.markItUp .markItUpButton2 a	{ \
		background-image:url(http://login.newz.dk/markitup/sets/bbcodenewz/images/italic.png); \
	} \
	.markItUp .markItUpButton3 a	{ \
		background-image:url(http://login.newz.dk/markitup/sets/bbcodenewz/images/underline.png); \
	} \
	.markItUp .markItUpButton4 a	{ \
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACfSURBVCjPY/jPgB8yUFNBiWDBzOy01PKEmZG7sSrIe5dVDqIjygP/Y1GQm5b2P7kDwvbAZkK6S8L/6P8hM32N/zPYu2C1InJ36P/A/x7/bc+YoSooLy3/D4Px/23+SyC5G8kEf0EIbZSmfdfov9wZDCvc0uzLYWyZ/2J3MRTYppn/14eaIvKOvxxDgUma7ju1M/LlkmnC5bwdNIoL7BAAWzr8P9A5d4gAAAAASUVORK5CYII=); \
	} \
	.markItUp .markItUpButton5 a	{ \
		background-image:url(http://login.newz.dk/markitup/sets/bbcodenewz/images/list-bullet.png); \
	} \
	.markItUp .markItUpButton6 a	{ \
		background-image:url(http://login.newz.dk/markitup/sets/bbcodenewz/images/list-numeric.png); \
	} \
	.markItUp .markItUpButton7 a	{ \
		background-image:url(http://login.newz.dk/markitup/sets/bbcodenewz/images/list-item.png); \
	} \
	.markItUp .markItUpButton8 a	{ \
		background-image:url(http://login.newz.dk/markitup/sets/bbcodenewz/images/link.png); \
	} \
	.markItUp .markItUpButton9 a	{ \
		background-image:url(http://login.newz.dk/markitup/sets/bbcodenewz/images/code.png); \
	} \
	.markItUp .markItUpButton10 a	{ \
		background-image:url(http://login.newz.dk/markitup/sets/bbcodenewz/images/quotes.png); \
	} \
	.markItUp a:link, \
	.markItUp a:visited, \
	.markItUp a:active, \
	.markItUp a:hover { \
		color:#000; \
		text-decoration:none; \
		background-color: white; \
	} \
	/***************************************************************************************/ \
	/* first row of buttons */ \
	.markItUpHeader ul li	{ \
		list-style:none; \
		float:left; \
		position:relative; \
	} \
	.markItUpHeader ul li:hover > ul{ \
		display:block; \
	} \
	.markItUpHeader ul .markItUpDropMenu { \
		background:transparent url(images/menu.png) no-repeat 115% 50%; \
		margin-right:5px; \
	} \
	.markItUpHeader ul .markItUpDropMenu li { \
		margin-right:0px; \
	} \
	/* next rows of buttons */ \
	.markItUpHeader ul ul { \
		display:none; \
		position:absolute; \
		top:18px; left:0px;	 \
		background:#FFF; \
		border:1px solid #000; \
	} \
	.markItUpHeader ul ul li { \
		float:none; \
		border-bottom:1px solid #000; \
	} \
	.markItUpHeader ul ul .markItUpDropMenu { \
		background:#FFF url(images/submenu.png) no-repeat 100% 50%; \
	} \
	.markItUpHeader ul .markItUpSeparator { \
		margin:0 10px; \
		width:1px; \
		height:16px; \
		overflow:hidden; \
		background-color:#CCC; \
	} \
	.markItUpHeader ul ul .markItUpSeparator { \
		width:auto; height:1px; \
		margin:0px; \
	} \
	/* next rows of buttons */ \
	.markItUpHeader ul ul ul { \
		position:absolute; \
		top:-1px; left:150px;  \
	} \
	.markItUpHeader ul ul ul li { \
		float:none; \
	} \
	.markItUpHeader ul a { \
		display:block; \
		width:16px; height:16px; \
		text-indent:-10000px; \
		background-repeat:no-repeat; \
		padding:3px; \
		margin:0px; \
	} \
	.markItUpHeader ul ul a { \
		display:block; \
		padding-left:0px; \
		text-indent:0; \
		width:120px;  \
		padding:5px 5px 5px 25px; \
		background-position:2px 50%; \
	} \
	.markItUpHeader ul ul a:hover  { \
		color:#FFF; \
		background-color:#000; \
	} \
	.comment_content ul, .comment_content ol { \
    padding: 0 !important; \
	} \
	</style>").appendTo("head");
	
	$(document).ajaxSuccess(function(event, xhr, options) {
		// Behandling af AJAX-sideskift
		if (options.url.match('class=Z4_Forum_Item&action=page') !== null) {
			var href = SNES_getUrl();
			
			if (window._pageId > window._lastPage) {
				// Hvis man får et link med en henvisning til et indlæg, som ikke findes endnu
				SNES_startHash = '';
				$('#postcontainer').prepend('Hopper lige til den rigtige side...');
				history.replaceState({page: _lastPage}, '', href + '/page' + _lastPage);
				SNES_fetchPage(_lastPage, 0);
			} else {
				if (SNES_startHash != '') {
					$(window).scrollTop($('.comment h2:has(a[name=' + SNES_startHash.substr(1) + '])').offset().top);
					history.replaceState({page: _pageId}, '', href + '/page' + _pageId + SNES_startHash);
					SNES_startHash = '';
				}
				
				// Retter newz.dk's buggede AJAX.
				$(".pagination a").each(function() {
					$(this).attr('href', href + '/page' + /#page(\d+)/.exec($(this).attr('href'))[1]);
				});
				
				//
				SNES_fixTitle();
				SNES_insertLoadingGif();
				SNES_fixPosts();
				if (location.hash.length > 1) {
					location.hash = location.hash;
					history.replaceState({page: _pageId}, '', location.href);
				}
				$("#sortRating").attr('disabled', false).text('Sorter indlæg efter rating');
			}
		}
		
		if (options.data) {
			// fixPosts() af det indsendte indlæg. (Der SKAL bruges options.data, da det er POST!)
			// samt
			// fixPosts() efter den løbende AJAX-indhentning af nye indlæg.
			if ((options.data.match('class=Z4_Forum_Item&action=usersave') !== null) || (options.url.match('class=Z4_Forum_Item&action=new') !== null)) {
				var a = $('#comments > div:last');
				if ($.trim(a.text()) != '')
					SNES_fixPosts(a);
			}
			
			// fixPosts() af Preview. (Slået fra, når man opretter en tråd.)
			if ((options.data.match('class=Z4_Forum_Item&action=preview') !== null) && (location.href.indexOf('/opret') == -1)) {
				SNES_fixPosts($('#post_preview .content'), false, true);
				$("#SNES_button_edit").focus(); // Hører til fiks af resize af kommentarfeltet efter Preview
			}
			
			// fixPosts() af indlæg efter endt redigering (rettelse)
			if (options.data.match('class=Z4_Forum_Item&action=edit') !== null)
				SNES_fixPosts($('#post' + /&id=(\d+)&/.exec(options.data)[1]), true);
			
			// Efter tryk på "Ret indlæg" og indlægget er hentet og forberedt.
			if (options.data.match('class=Z4_Forum_Item&action=getRaw') !== null && options.data.match('&jstimestamp') !== null) {
				SNES_fixToolbar();
			}
			
			// TAG: "SNES_flashFavicon() #2"
			// Starter SNES_flashFavicon(), som blinker favicon, når der er ulæste tråde i /forum efter den 30-sekunders opdatering
			if (updateFaviconOnNewPosts && options.data.match('class=Z4_Forum_Thread&action=mine') !== null) {
				if ($('.unread', $('<div>').html($("Response", xhr.responseXML).text())).length > 0) {
					if (updateFaviconOnNewPostsBlink) {
						clearInterval(SNES_flashFaviconCounter);
						SNES_flashFaviconCounter = setInterval('SNES_flashFavicon()', 1000);
					} else {
						$('link[type="image/x-icon"]').remove();
						$('head').append($('<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,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h/+BhYj/eX2A/21xc/+BhYj/gYWI/4CEh/+AhIf/gISH/4CEh/+AhIf/gISH/4CEh/+AhIf/gISH/4CEh/+Chon/c3d5/1lgYv+ru8D/qLi9/6e4vf+tvcL/AAAAAAAAAAAAAAAAqbm+/6m5vv+rusD/orK3/290d/+AhIf/gISH/4CEh/+AhIf/gISH/4SIi/9jZ2n/XmZp/25ydf9/g4b/gYWI/4CEh/+AhIf/gISH/4CEh/+AhIf/gISH/4CEh/+AhIf/gISH/4SIi/9dYGP/h5WZ/66/xP+pub7/qbm+/66+w/8AAAAAAAAAAAAAAACpub7/qbm+/6q6v/+jsrf/b3R3/4KFif+BhYj/gYWI/4GFiP+BhYj/hYmM/11fYv+Aio7/lKGl/2hsbv98f4L/g4eK/4CEh/+AhIf/gISH/4CEh/+AhIf/gISH/4GFiP+EiIv/Y2dp/250d/+wwMX/qbm+/6m5vv+pub7/r77D/wAAAAAAAAAAAAAAAKu6wP+rusD/rLzB/6SzuP9obG7/dnl8/3Z5fP92eXz/dnl8/3Z5fP98f4L/U1ZY/3iDh/+3yM7/maes/2pucP9qbnD/fH+C/3+Dhv+BhYj/goaJ/4KGif9/g4b/dnl8/1pdX/90foH/rLzB/6y8wv+rusD/q7rA/6u6wP+xv8T/AAAAAAAAAAAAAAAArLzB/629wv+tvcL/qrq//4KOkv9+iY3/gIqO/4CKjv+Aio7/gIqO/4CKjv92gYT/lqWq/6/Axf+wwcb/p7i9/4SRlf96hYj/bnR3/2RqbP9kamz/ZGps/250d/94g4f/i5md/6/Axf+uvsP/rLzB/6y8wf+tvcL/rLzB/7PCxv8AAAAAAAAAAAAAAACtvcL/rb3C/66+w/+uvsP/ssPI/7LDyP+yw8j/ssPI/7LDyP+yw8j/ssPI/7PFyv+wwcb/rb3C/629wv+uv8T/ssPI/7HCx/+ru8D/o7O4/6Gxtv+js7j/q7zA/7LDyP+yw8j/rr7D/629wv+tvcL/rr7D/66+w/+tvcL/s8LG/wAAAAAAAAAAAAAAAK6+w/+uvsP/rr7D/66/w/+vv8P/rr7D/66/w/+uv8P/rr7D/66+w/+uvsP/rr7D/66/w/+uv8P/rr/E/66/w/+uvsP/rr/D/66/xP+wwMX/sMHG/7DAxf+uv8T/rr7D/66/w/+uvsP/rr7D/66+w/+uv8P/rr/D/66/w/+0w8f/AAAAAAAAAAAAAAAAr8DF/6/Axf+vwMX/sMDF/6/Axf+vwMX/r8DF/6/Axf+wwMX/sMDF/6/Axf+vwMX/r8DF/6/Axf+vwMX/r8DF/7DAxf+wwMX/r8DF/7DAxf+wwMX/sMDF/6/Axf+wwMX/r8DF/7DAxf+wwMX/r8DF/6/Axf+vwMX/r8DF/7bEyf8AAAAAAAAAAAAAAAD/////4AAAAAAAAADgAAAAAAAAAOAAAAAAAAAA4AAAAAAAAADgAAAAAAAAAOAAAAAAAAAAYAAAAAAAAABgAAAAAAAAACAAAAAAAAAAIAAAAAAAAAAgAAAAAAAAACAAAAAAAAAAIAAAAAAAAAAgAAAAAAAAACAAAAAAAAAAIAAAAAAAAAAgAAAAAAAAAGAAAAAAAAAAYAAAAAAAAADgAAAAAAAAAOAAAAAAAAAA4AAAAAAAAADgAAAAAAAAAOAAAAAAAAAA4AAAAAAAAADgAAAAAAAAAOAAAAAAAAAA4AAAAAAAAADgAAAAAAAAAOAAAAAAAAAA4AAAAAAAAADgAAAAAAAAAOAAAAA=">'));
					}
				} else {
					clearInterval(SNES_flashFaviconCounter);
					$('link[type="image/x-icon"]').remove();
					$('head').append($('<link rel="icon" type="image/x-icon" href="/gfx/newz.dk.favicon.ico">'));
				}
			}
		}
	});
	
	$(document).ajaxStop(function() {
		if (SNES_postSortByRating) {
			SNES_postSortByRating = false;
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
			
			var href = SNES_getUrl();
			SNES_startHash = '';
			var p = Math.ceil(a / _pageSize);
			history.replaceState({page: p}, '', href + '/page' + p + '#' + a);
			SNES_fetchPage(p, 2, a);
		}
	});
	
	window.onpopstate = function(e) {
		var a = e.state;
		if (a == null)
			history.replaceState({page: window._pageId}, '', location.href);
		else {
			if (a.page == _pageId)
				return;
			SNES_fetchPage(a.page, 3);
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
		
		SNES_updateCommentList();
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
	
	// Indstillinger til den nye toolbar. Se SNES_fixToolbar().
	toolbarSettings = {
		markupSet: [
			{name:'[b]fed tekst[/b]', key:'B', openWith:'[b]', closeWith:'[/b]'},
			{name:'[i]kursiv tekst[/i]', key:'I', openWith:'[i]', closeWith:'[/i]'},
			{name:'[u]understreget tekst[/u]', key:'U', openWith:'[u]', closeWith:'[/u]'},
			{name:'[s]gennemstreget tekst[/s]', key:'S', openWith:'[s]', closeWith:'[/s]'},
			{separator:'---------------' },
			{name:'Punktopstilling', openWith:'[list]\n', closeWith:'\n[/list]'},
			{name:'Numerisk liste', openWith:'[list=1]\n', closeWith:'\n[/list]'}, 
			{name:'Listeelement', openWith:'[li]', closeWith:'[/li]'},
			{separator:'---------------' },
			{
				name:"[url=http://newz.dk/]newz.dk[/url]",
				openWith: '[url=',
				replaceWith: function(e) {
					SNES_selstart = 0, SNES_selend = 0;
					if (e.selection.substr(0, 7) == 'http://' || e.selection.substr(0, 8) == 'https://') {
						SNES_selstart = e.textarea.selectionStart + e.selection.length + 6;
						SNES_selend   = e.textarea.selectionEnd   + e.selection.length + 6;
						return e.selection + ']' + e.selection;
					} else {
						SNES_selstart = e.textarea.selectionStart + 5;
						SNES_selend   = e.textarea.selectionEnd   + 12;
						return 'http://' + e.selection + ']' + e.selection;
					}
				},
				closeWith: '[/url]',
				afterInsert: function(e) {
					e.textarea.setSelectionRange(SNES_selstart, SNES_selend);
					e.textarea.focus();
					return false;
				} 
			},
			{separator:'---------------' },
			{name:'[code]kode[/code]', openWith:'[code]', closeWith:'[/code]'},
			{
				name:'[quote]citat[/quote]',
				openWith: '[quote',
				replaceWith: function(e) {
					var quotewho = prompt("Skriv venligst et navn eller en URL til der hvor quotet er fra") || '';
					
					SNES_selstart2 = 0, SNES_selend2 = 0;
					SNES_selstart2 = e.textarea.selectionStart + 7 + (quotewho.length > 0 ? 1 + quotewho.length : 0);
					SNES_selend2   = e.textarea.selectionEnd   + 7 + (quotewho.length > 0 ? 1 + quotewho.length : 0);
					
					return (quotewho.length > 0 ? "=" + quotewho : "") + "]" + e.selection;
				},
				closeWith: '[/quote]',
				afterInsert: function(e) {
					e.textarea.setSelectionRange(SNES_selstart2, SNES_selend2);
					e.textarea.focus();
					return false;
				} 
			}
		]
	}
	
	// Resizer kommentarfeltet, når der trykkes på Rediger (inde i Preview)
	// Skal omdøbes, så den originale bind ikke kommer på. Hvis den allerede er på, sørger unbind() for at fjerne den.
	// Rækkefølgen af scripts er ikke altid den samme (tak for lort, HTML5, IE og Webkit).
	$("#button_edit").unbind().attr('id', 'SNES_button_edit').bind("click", function(e) {
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
	SNES_ajaxPageChange();
	SNES_updateSettingsSub();
	SNES_fixToolbar();
	
	// Til gemning af kommentarfeltet
	$('.markItUpHeader').append('<ul><li style="font-size: small;" id="commentStorage"></li></ul>');
	SNES_updateCommentList();
	
	// Fjerner også tråden fra listen over overvågede tråde, når man trykker på "Ignorer denne tråd"
	$('a[title="Ignorer denne tråd"]').unbind().click(function(e) {
		e.preventDefault();
		var id = this.href.match(/\d+$/)[0];
		$(this).replaceWith('<div id="SNES_ignorethread">');
		var me = $('#SNES_ignorethread');
		$.ajax({
			url: '/forum/track/delete/' + id,
			success: function() {
				me.html('<br>[✓] Fjernet fra listen over overvågede tråde');
			},
			error: function() {
				me.html('<br>[X] Fjernelse fra listen over overvågede tråden fejlede');
			},
			complete: function() {
				$.ajax({
					url: '/forum/ignore/add/' + id,
					success: function() {
						me.html(me.html() + '<br>[✓] Tråd ignoreret');
					},
					error: function() {
						me.html(me.html() + '<br>[X] Fjernelse fra listen over overvågede tråden fejlede');
					},
				});
			}
		});
		return false;
	});
	
	// I store tråde ender man nogle gange (hvis den sidste side er på 50 indlæg) en side for langt
	if (window._pageId > window._lastPage) {
		var href = SNES_getUrl();
		SNES_startHash = '';
		$('#postcontainer').prepend('Hopper lige til den rigtige side...');
		history.replaceState({page: _lastPage}, '', href + '/page' + _lastPage);
		SNES_fetchPage(_lastPage, 0);
	} else if (window._pageId) {
		SNES_fixTitle();
		SNES_fixPosts();
		if (location.hash.length > 1)
			history.replaceState({page: _pageId}, '', location.href);
		else {
			if (location.href.substr(-1) == '#')
				var href = location.href + 'new';
			else
				var href = location.href + '#new';
			history.replaceState({page: _pageId}, '', href);
		}
		location.hash = location.hash;
		history.replaceState({page: _pageId}, '', location.href);
	}
	
	// Smider genveje til underdomænernes fora ind.
	$('.links:first').before('<div style="float: left; padding: 3px;">Genveje: <a href="http://newz.dk/forum">newz.dk-forum</a> | <a href="http://railgun.newz.dk/forum">Railgun-forum</a> | <a href="http://macnation.newz.dk/forum">MacNation-forum</a> | <a href="http://raid1.newz.dk/forum">RAID1-forum</a></div>');
}

// Sørger for, at underindstillingerne bliver grå, når featuren er slået fra.
function SNES_updateSettingsSub() {
	$('#addLinkToPostReferenceSub > input').attr('disabled', !$('#addLinkToPostReference').attr('checked'));
	$('#showPostOnMouseOverReferenceSub input').attr('disabled', (!$('#showPostOnMouseOverReference').attr('checked') || !$('#addLinkToPostReference').attr('checked')));
	$('#embedYouTubeUrlsSub input').attr('disabled', !$('#embedYouTubeUrls').attr('checked'));
	$('#applyTargetBlankSub input').attr('disabled', !$('#applyTargetBlank').attr('checked'));
}

// Den nye BB-toolbar
function SNES_fixToolbar() {
	$('.toolbar + textarea,.toolbar + div textarea').markItUp(toolbarSettings);
	$('.toolbar').remove();
}

// Køres ved indlæsning, AJAX-sideskift, indsendelse af indlæg, ved den løbende AJAX-indhentning af nye indlæg, ved Preview og ved rettelse af indlæg
function SNES_fixPosts(object, afterEdit, isPreview) {
	// Køres kun én per indlæg
	if (afterEdit !== true) {
		SNES_improvedQuote(object);
		SNES_addPermLink(object);
		SNES_fixPostTimes(object);
		SNES_reportSpam(object);
	}
	
	// Køres kun én per indlæg (men også når indlægget er blevet rettet)
	SNES_addLinkToPostReferenceFunc(object, (isPreview === true));
	SNES_urlToImg(object);
	SNES_urlToVid(object);
	SNES_fixFailTags(object);
	SNES_fixSpoilers(object);
	SNES_embedYouTubeUrlsFunc(object);
	
	SNES_applyTargetBlankFunc(object);
}

// Blinker favicon, når der er ulæste tråde i /forum efter den 30-sekunders opdatering
// Startes fra "SNES_flashFavicon() #2" (TAG)
function SNES_flashFavicon() {
	$('link[type="image/x-icon"]').remove();
	
	(SNES_flashFaviconBoolean = !SNES_flashFaviconBoolean)
		? $('head').append($('<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARASURBVEhLjZbLUhNREIbPs7jXKheKQpBADATIlYSEEAIKGhUUwUsChItIgSCIoOVdC0XwVqArn0JXWiULF16q3OMT6DfTMMLM5JTUX1Pn9Pzdf5/uPhNUeVV0G5Eda4xsbRZhWnZZCMd67nI5WFGvPNWxLXhjHm/UWBuLbaO8NS0Vlt1cE/TwEUPAsAtnVyjDcsjTqCprmoC8K/OEnDhQHiSQ0IgF4VBluOpooi7YVh9u51nlS4gXEXZGY324MqiO+OJi9fqbz/WPXMiP918e24ni6Exz6xnqgExNXUt3b7EwNDk9u3j7ziMB64Hha525S3DQIKDE5GkIVPkTgE1dMLN4+97E1MxOjFyZePl6Df/9ZYF4S+7m4h2AcXD4SmFoND84Aljj8nR5dXR81gjti0tMUOENq+raJCD9QKhtenYhPzSCp4WL+aEnT5c5UGt7D/KEvjwwPFAcswH+pULx7v3HnIauSEzgqY5uCaAWCGURsHmK290Hz67fWJSsndEtC+THS8u57gFatS0QU5QVeP1JOmZUc3d2RBy7OjU3f0vOpInOK8o1NT33ZOkFI1BTlyIsnVC+QBqwaYwecwrgJrVmQXHIkbU8XcXg0LNUpoeMCUtL1NH6NGATjHW4CkgggtJenMHy6iu66toMjPcfLjFRNJWwHEX5G1oBm2DsOAKudcCNTnB2PKPNJ6gyXUHDeQ6YzAIEBAjLU3FTQG1jJhzvchUgyszsPIlTRlqHG3kl0qfJtJQAd4UeEJanTWCBFGS6LTCpzAZ3kHQkG0BJmfri6LiTTCV3CTCdgFsWSXTxjpmxgdlHIJ7KcUohA07DfWZmnGSKaQq0QPMFkqo+nAUI0OQvG183N3878enzBllzExll4VOlB49WXMkY+d5QHMiGQDjeCegw3fvx89cftz+ECSpMASV6trLmSsbI4cgYGjkpKhNJnAg1dcaSJ0sJcALSMZlboNUaAb5d1AcyaSkSB4xQU0on0BDpEKbA35jRC5AQtIZIVpE4QI2PpeYE3HNhCmi4XoCEoOGlSBygxmhrBBgBHIQMKLFGgJ8QQkPDS5E4wJlfFY1AqMlwEDKgxM9X10s1GQFCQ8NLkThgk8x0awRokjAFVGDlxVuNAKGhMUiKxAECqbYejQBNEiYgFSqgEeCSExomXgo2YNOSLSnAPaBJwhRwb/QChCZjvBRxWeGTbj+ruWg0ABoQPvdGL0BTYcaSXYq4AJ+2Y+e55aVuMt8iYQpoyZv196V6MD65gAA00lKtHecAGwT4ypOXE/xvQgYms1eelJRCu5Ix8rEz+b20VhEXZI/38TTGKZWzYMyluW1OnxKCBbaEsAg2F9IVPo6KVbazz3hqAEHDKf2Kg6p3ed//ovAfTBun4FMfCvs+5PcKPrKW7bbRafn31nK0vMSxsA8vw9GMqb4X9oBvJmRtg9htBItcyssK8hcq2z9GxOB6tAAAAABJRU5ErkJggg==">'))
		: $('head').append($('<link rel="icon" type="image/x-icon" href="/gfx/newz.dk.favicon.ico">'));
}

// Advarsel: Tåler ikke at blive kørt flere gange for samme indlæg, men det burde ikke være noget problem endnu
function SNES_reportSpam(object) {
	$('.comment_rating li:first-child', object).before('<li><a title="Rapportér spam" class="reportSpam" href="#"><span></span>Rapportér spam</a></li>');
	$('.reportSpam', object).bind('click', function(e) {
		e.preventDefault();
		
		if (confirm("Er du sikker på, at dette er spam, som skal rapporteres? Du ender med selv at spamme, hvis dette ikke er spam.\n\nDet er forresten ikke nødvendigt at rapportere samtlige indlæg i en tråd, hvis de er på hinanden følgende.")) {
			var $this = $(this);
			$this.html('Rolling...').removeAttr("href").unbind();
			
			var postParent = $this.parents('.comment').find('h2');
			var userLink   = $('a:last', postParent)[0].href.replace('%7E', '~');
			var userName   = $('a:last', postParent).text();
			var postId     = $('a:nth-child(2)', postParent).attr('name').substr(2);
			var postLink   = $('a:nth-child(3)', postParent).attr('href');
			
			$.get("/z4/action.php", {"class":"Z4_Forum_Item", "action":"getRaw", "id":postId}, function(xml) {
				var text = encodeURIComponent("Automatisk spamrapport.\nBrugernavn: [url=" + userLink + "]" + userName + "[/url]\nURL: " + postLink + "\n\nEksempel på spam:\n[quote]" + $.trim($("Response", xml).text().replace("\n\n\n\n", "\n\n").replace(/www\./gmi, '').replace(/https?:\/\//gmi, '').replace(/\[url=.+?\]/gm, '').replace(/\[\/url\]/gm, '')) + "[/quote]");
				
				// Jeg har byttet om på action og class (rækkefølgen), så fixPosts() ikke køres. Skide smart, Daniel.
				$.get("/z4/action.php", {"action":"usersave", "class":"Z4_Forum_Item", "thread_id":119686, "lastId":99999999999999999, "comment":text}, function(xml) {
					$this.html('Succes!');
				}, "xml");
				
			}, "xml");
		}
		
		return false;
	});
}

function SNES_embedYouTubeUrlsFunc(object) {
	function ttotime(s) {
		s = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)(?:s)?)?$/.exec(s);
		return (typeof s[1] === "undefined" ? 0 : +s[1])*3600 + (typeof s[2] === "undefined" ? 0 : +s[2])*60 + (typeof s[3] === "undefined" ? 0 : +s[3]);
	}
	
	if (embedYouTubeUrls) {
		if (embedYouTubeUrlsCount > 0)
			var count = 0;
	
		//if (embedYouTubeUrlsNewOnly && object == undefined)
		//	object = $('.comments_new').nextAll();
		
		$('.text_content a[href*="youtu"]', object).reverse().each(function() {
			var w = parseInt($(this).parent().css('width'));
			var res = /(?:youtu\.be\/|youtube\.com\/watch\?.*v=)(.{11})/gmi.exec(this.href);
			if (typeof this.href !== 'undefined' && res != null && (!embedYouTubeUrlsNotInQuote || (embedYouTubeUrlsNotInQuote && w === 381))) {
				var q = '';
				var t = 0;
				if (this.hash.length > 1 && (q = splitquery(this.hash))) {
					if (typeof q.t !== "undefined")
						t = ttotime(q.t);
					else if (typeof q.at !== "undefined")
						t = ttotime(q.at);
				} else if (this.search.length > 1 && (q = splitquery(this.search)) && (typeof q.t !== "undefined"))
					t = ttotime(q.t);
				$(this).replaceWith('<iframe data="'+this.href+'" width="'+(w-1)+'" height="'+((w-1)*(3/4))+'" frameborder="0" allowfullscreen="" src="http://www.youtube.com/embed/' + res[1] + '?rel=0&start=' + t + '"></iframe>'.replace(/&/gm, '&amp;'));
				
				if (embedYouTubeUrlsCount > 0 && ++count >= embedYouTubeUrlsCount)
					return false;
			}
		});
	}
}

function SNES_fixSpoilers(object) {
	$('.spoiler', object).remove();
	// Skal omdøbes, så den originale bind ikke kommer på. Hvis den allerede er på, sørger unbind() for at fjerne den.
	// Rækkefølgen af scripts er ikke altid den samme (tak for lort, HTML5, IE og Webkit).
	$('.open_spoiler', object).unbind().attr('class', 'SNES_open_spoiler').click(function(e) {
		e.preventDefault();
		$(this).replaceWith(Encoder.htmlEncode(this.id));
		return false;
	})
}

function SNES_fixPostTimes(object) {
	var a = $('.comment_date:contains("min siden")', object);
	var b = $('.comment_date:contains("sek siden")', object);
	var c = $('.comment_date:contains("nu")', object);
	var d = $('.comment_date:contains("i dag"):not(:contains("."))', object);
	
	d.each(function() {
		var e = $(this);
		e.html(e.attr('title') + ' (i dag)');
	});
	
	if (b.length > 0 || c.length > 0)
		var l = 980;
	else if (a.length > 0)
		var l = 1000 * (61 - (new Date()).getSeconds()); // Så starter den altid, når klokken slår et nyt minut.
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
	
	clearTimeout(SNES_fixPostTimesCounter);
	SNES_fixPostTimesCounter = setTimeout("SNES_fixPostTimes()", l);
}

function SNES_applyTargetBlankFunc(object) {
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

function SNES_fixFailTags(object) {
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
				
				// Til store BB-tags ([B], etc.), hvis nogen nogensinde lyster det.
				/*var x = e.html().indexOf('[/' + a[i].toUpperCase() + ']');
				
				if (x !== -1) {
					e.html(e.html().substr(0, x) + e.html().substr(x).replace(new RegExp('<(\/)?' + b[a[i]], 'g'), '').replace(new RegExp('\\[/' + a[i].toUpperCase() + '\\]', 'g'), '</' + b[a[i]]));
				}*/
			}
		});
	}
}

function SNES_urlToImg(object) {
	if (showUrlImages) {
		$('.text_content a:not([href^="#"])', object).filter(function() {
			return (/\.(png|gif|jp(e)?g)$/i.test(this.href) && $(this).attr('data') === undefined);
		}).each(function() {
			var e = $(this);
			var b = this.href;
			var c = e.text();
			if (b == c)
				var c = $('<div><a href="'+b+'">'+b+'</a></div>').linkShorten().find('a').text();
			e.replaceWith('<a data="SNES_img" title="'+c+'" href="'+b+'"><img title="'+c+'" alt="'+c+'" class="SNES_urlImg" style="max-width: ' + e.parent().css('width') + ';" src="' + b + '" /></a>');
		});
	}
}

function SNES_urlToVid(object) {
	if (showUrlVideos) {
		$('.text_content a:not([href^="#"])', object).each(function() {
			var reg;
			if (reg = /\.(og(?:g|v|a|x)|spx|mp4)$/i.exec(this.href))
				$(this).replaceWith('<video width="380" height="285" controls="controls"><source src="'+this.href+'" type="video/'+reg[1]+'" /></video>');
		});
	}
}

function SNES_addLinkToPostReferenceFunc(object, isPreview) {
	if (addLinkToPostReference) {
		$('.text_content p:contains("#")', object).each(function() {
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
						return '<a data="SNES_ref" class="SNES_postReferenceLink"' + (((showPostOnMouseOverReference) && ((c > 50 * (_pageId - 1)) && (c <= 50 * (_pageId - 1) + 50))) ? ' onclick="SNES_goToPost(\'' + him + '\')" onmouseout="SNES_hidePost();" onmouseover="SNES_showPost(\'' + p + '\', \'' + him + '\')"' : '') + ' href="#' + c + '">#' + a + '</a>' + b;
					}).replace(/&/gm, '&amp;'));
				}
			});
		});
	}
}

function SNES_showPost(me, him) {
	var q = $("#" + him).clone().attr('id', '').addClass("SNES_cite").prependTo('#comments');
	if (showPostOnMouseOverReferenceMini)
		q.find('.comment_right').remove();
}

function SNES_hidePost() {
	$('.SNES_cite').remove();
}

function SNES_goToPost(him) {
	SNES_hidePost();
}

function SNES_addPermLink(object) {
	href = SNES_getUrl();
	
	$('h2', object).each(function() {
		var a = $(this).html();
		a = a.replace(/#(\d+):/, '<a href="' + href + '/page' + _pageId + '#$1">#$1:</a>')
		$(this).html(a);
	});	
}

// Advarsel: Tåler ikke at blive kørt flere gange for samme indlæg, men det burde ikke være noget problem endnu
// Sætter event handler på "Citer indlæg" - Sakset direkte fra newz.dk med vigtige ændringer. Jeg har ladet mine kommentarer fra newz.dk's script lade blive.
function SNES_improvedQuote(object) {
	// Laver citeringslinjen om, så den indeholder "citer indlæg, nummer, svar".
	$('.quoteitem', object).parent().html('Citer <a class="SNES_quoteitem" href="#">indlæg</a> | <a class="miniquote" href="#">nummer</a>');
	$('.text_content', object).filter(function() { var a = $(this).children(); return($('>blockquote', this).length === 1 && a[1].tagName === 'BLOCKQUOTE' && a[0].tagName === 'P' && $(a[0]).text() === ''); }).each(function() {
		 var a = $('.SNES_quoteitem', $(this).parents('.comment')).parent();
		 a.html(a.html() + ' | <a class="responsequote" href="#">svar</a>');
	});
	
	// "svar"-citering
	$('.responsequote', object).click(function(e) {
		e.preventDefault();
		
		// Hvis dette ligner noget kode fra newz.dk, så er det, fordi det er. Der er lige en enkelt tilføjelse.
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
		$.get("/z4/action.php", {"class":"Z4_Forum_Item", "action":"getRaw", "id":postId}, function(xml) {
			var text = $.trim($("Response", xml).text()).replace(/\[quote(?:.|\n)*\[\/quote\]/, '');
			
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
		}, "xml");
		
		$('#id_comment').keyup();
		return false;
	});
	
	// "nummer"-citering
	$('.miniquote', object).click(function(e) {
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
	
	// Almindelig citering med SNES' forbedring, hvis slået til
	$(".SNES_quoteitem", object).click(function(e) {
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
											case 'SNES_img':
												s = $('<div><a href="'+obj.attr.href+'">'+obj.attr.href+'</a></div>').linkShorten().find('a').text();
												if (s === obj.attr.title || s.substr(7) === obj.attr.title)
													t += obj.attr.href;
												else
													t += '[url=' + obj.attr.href + ']' + obj.attr.title + '[/url]';
												i += 4;
												break;
											case 'SNES_ref':
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
										console.log('SNES: Parse fejlede. Data:');
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

function SNES_updateCommentList() {
	$('#commentStorage').empty();
	var a = $('<select onchange="if ($(this).val() == -1) return(false); $(\'#id_comment\').val(localStorage[\'commentHistory\' + $(this).val()]).keyup();" style="width: 100px">')
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
function SNES_fixTitle() {
	if (window._lastPage > 1) {
		var regexMatch;
		if (regexMatch = /(Side \d+ » )*([^»]+) ».+/.exec(document.title))
			$("#container div h1").html('Side ' + _pageId + ' » ' + regexMatch[2]);

		if (/Side \d+/.test(document.title))
			document.title = document.title.replace(/Side \d+/, "Side " + _pageId);
		else
			document.title = "Side " + _pageId + " » " + document.title;
	} else if (window._lastPage == 1 && /^Side \d+$/.test($("#container div h1").text())) {
		var regexMatch;
		if (regexMatch = /(Side \d+ » )*([^»]+) ».+/.exec(document.title))
			$("#container div h1").html(regexMatch[2]);
	}
}

// Indsætter en loading.gif til AJAX-sideskift
function SNES_insertLoadingGif() {
	$('<span/>').insertAfter('.pagination').html('<div class="loading" style="float: left; margin: -2px 10px; padding: 5px; position: relative; width: 330px;"><p><img src="data:image/gif;base64,R0lGODlhEAAQAPYAAP///zMzM/r6+qenp5+fn/Hx8dLS0t/f37GxsTMzM6SkpNHR0VpaWnR0dO/v77e3t6mpqfT09JqamklJScHBwba2tq6urvb29vn5+bm5udfX12lpaTw8PH9/f+Tk5Ozs7MnJyVRUVF5eXmpqatzc3M/Pz2JiYnFxcWRkZGxsbNnZ2dTU1Hp6esLCwu7u7oyMjLy8vMbGxsfHx35+fnx8fIGBgZ6enubm5peXl/z8/LS0tEZGRlZWVnd3dzY2NnJyctbW1l9fX3l5eUdHR/Ly8t7e3q+vr+fn5+rq6mZmZrq6uk9PT0xMTL6+vo6Ojm5ublxcXIeHh9ra2szMzFFRUZaWlmdnZ3Z2djo6Ojk5Ob+/v+np6W9vb/f398TExISEhIaGhuLi4rKyskFBQU5OTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/h1CdWlsdCB3aXRoIEdJRiBNb3ZpZSBHZWFyIDQuMAAh/hVNYWRlIGJ5IEFqYXhMb2FkLmluZm8AIfkECQoAAAAsAAAAABAAEAAAB2iAAIKDICImJYOJAAsSGgAhCQkoioIGDAkbHpcJKYIRiQSRHBYLIycqABgZn4IHDRMdH5QYig4UBZSKAggPuZQDkRW+ACSIoQkWw8UABQoQF8PR0qm+tIkRGdaJqqyD3SQk3tEliNPRgQAh+QQJCgAAACwAAAAAEAAQAAAHa4AAgoMHNDU3g4mKMwkJLzk6PRk5gysvGhcvjTgQOwk7MIMsCQ0yLhI2BSGNCTWDLSkxBYkVPD48MoMuMLOKMD8gisLDACUkxIIkJYLGyADKztHSgxjE1YkRGdeJGBkRit/Jx4LhxCXL08iBACH5BAkKAAAALAAAAAAQABAAAAdogACCgwIID4OIiQADCQkVACUSKokRggSNFkBBCSZFgxEZGAAFChAXOD6NRoiiiR5CQzRHiooOFES0tCAiJiWQJLkAIY0ov8EMjSnBgwsjJ5PLua2K04Kg1YIYGZWI3AAkwNbLJb7R0YEAIfkECQoAAAAsAAAAABAAEAAAB2eAAIKDhIWGgiUlh4MRgyQkAEQLTlKEERkYhQ9JCVGFmYVISk9Ti4UfMAWmhQc0NTcAJZCLMwkJL7Gzhy+2OKuCLhI2qqtGUA+fhhBLCUwwjJiFIbYJNZaOkBVMCVQyi4mCTVHev4aBACH5BAkKAAAALAAAAAAQABAAAAdogACCg4SFhoIlJYeDEYMkJIyFERkYhhgZjYSVh5uLnp+CAggPiJCLAwkJFQAlpocEqRagAAUKEBegC05FhZ2DK1ZYVryCk5UgIiYlVT6pRoSZIakoR1dZQluHDKkpAEdaH4sLIycqhoEAIfkECQoAAAAsAAAAABAAEAAAB2eAAIKDhIWGgiUlh4MRgyQkjIURGRiGGBmNhJWHm4uen4clkJ4kigCin6WgixZQD4ZdIF2DRhMJIRmERFMsGoNcCcEpBzQ1Nw9JCWCDGUMJPDIzwS8fXl8LhE1RMgAvwTirLhI2BYaBACH5BAkKAAAALAAAAAAQABAAAAdngACCg4SFhoIlJYeDEYMkJIyFERkYhhgZjYSVh5uLniAiJoqegiEJCSieJIoMpymqigsjJyqkhCtOUrYABkEcT2GWhDanHBYCCA+Cl5kAYVxZMw4DpxWCzYJbWkgABKcWuwUKEBeGgQAh+QQJCgAAACwAAAAAEAAQAAAHaIAAgoOEhYICYj1KgiUlhoJGYwlMGQAkJIMRhFwJnU+FGBmaghlkPiIyhhiFMD8xj4QHNDU3sIQznS+2JI4vnTi7ji4SNgW2hREyAseDJUIrXaqFLAkNr4Sho4JTX1NElpiC2o+NzOaBADsAAAAAAAAAAAA=" /> Skifter side...</p></div>');
	$(".loading").hide();
}

// Forbereder AJAX-sideskift
function SNES_ajaxPageChange() {
	if (typeof _threadId == 'undefined' || _threadId == 0)
		return;

	SNES_insertLoadingGif();
	
	$('.pagination a').live('click', function(e) {
		e.preventDefault();
		SNES_startHash = '';
		var p = +/page(\d+)$/.exec(this.href)[1];
		SNES_fetchPage(p, 1);
		return false;
	});
}

// pageNo: sidenummer
//  state: 0 = replaceState (fikser nuværende side), 1 = pushState (skifter side), 2 = hopper til side, hvorpå indlægget ligger, 3 = ingen ændring i historien (skifter side pga. hop i historien)
//   hash: Hvis der skal hoppes til et bestemt indlæg
function SNES_fetchPage(pageNo, state, hash) {
	$('.pagination').hide();
	$(".loading").show();
	
	$.ajax({
		dataType: 'xml',
		url: "/z4/action.php",
		data: {"class":"Z4_Forum_Item", "action":"page", "id":_threadId, "offset":pageNo},
		success: function (xml) {
			$("#postcontainer").html($("Response", xml).text());
			
			// Opdaterer newz.dk's variable, så den kun henter nye indlæg, når man er på sidste side
			$('a,span', '.pagination:first').each(function() {
				var v = +$(this).text();
				if (v > _lastPage)
					_lastPage = v;
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
					var href = SNES_getUrl();
					history.pushState({page: _pageId}, '', href + '/page' + _pageId);
					break;
				case 2:
					$(window).scrollTop($('.comment h2:has(a[name=' + hash + '])').offset().top);
					break;
			}
			
			// Sætter "ret indlæg" på det sidste af brugerens indlæg på siden, hvis tidsstemplet passer med minutpræcision samt er yngre end ti minutter.
			// Det kan ikke vides, om der er et nyere (inden for samme minut) indlæg på næste side, men det går nok.
			// Datokonverteringen er nuppet fra SNES_fixPostTimes().
			var a = $('.comment:not(:has(.comment_rate)):last');
			if (a.length > 0) {
				var e = $('.comment_date', a);
				var m = {'jan':0,'feb':1,'mar':2,'apr':3,'maj':4,'jun':5,'jul':6,'aug':7,'sep':8,'okt':9,'nov':10,'dec':11};
				var s = /(\d+)\. ([a-z]+)\. (\d+) (\d+):(\d+)/.exec(e.attr('title'));
				var d = (new Date(s[3], m[s[2]], s[1], s[4], s[5], 0, 0)).getTime();
				var s = _lastPostTime - (d/1000);
				var s2= Math.round(((new Date()).getTime() / 1000) - _lastPostTime)/60;
				if (s>=0 && s<60 && s2<10)
					$('.position', a).parents('li').next().after('<li><a title="Ret indlæg" class="edititem" href="#"><span></span>Ret indlæg ('+Math.round(10-s2)+' min)</a></li>');
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
function SNES_getUrl() {
	var a = 0;
	
	if ((a = location.href.indexOf('#')) == -1)
		var href = location.href;
	else
		var href = location.href.substr(0, a);
	
	if ((a = href.indexOf('/page')) != -1)
		var href = href.substr(0, a);
	
	return href;
}

// Splitter en '?hest=ko&ged=larve'
function splitquery(q) {
	q = q.substr(1).split('&');
	var u = {};
	for (var i = 0; i < q.length; i++) {
		var t = q[i].split('=');
		u[t[0]] = t[1];
	};
	return u;
}


/*
	$('.text_content').filter(function() { var a = $(this).children(); return($('>blockquote', this).length === 1 && a[1].tagName === 'BLOCKQUOTE' && a[0].tagName === 'P' && $(a[0]).text() === ''); })

	$('.SNES_quoteitem').parent().html('Citer <a class="SNES_quoteitem" href="#">indlæg</a> | <a class="miniquote" href="#">nummer</a> | <a class="responsequote" href="#">svar</a>')

	a = $("#id_comment").val()
	a.replace(/\[quote(?:.|\n)*\[\/quote\]/, '').trim()
*/