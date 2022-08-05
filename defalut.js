var $wbr =getBrowsertInfo();
var wsize = null;	
var psize = null;
var lowIeChk = {old_w:0,old_h:0 }
var _thisSite = {};	
var _thisPage = {};
var _isMobile_ = false;
var _isLowBr_ = false 
function getWindowSizeObj(){
		var sizeObj = {
		scr : {w:screen.width,h:screen.height},
		availscr : {w:screen.availWidth,h:screen.availHeight},
		win : (_isLowBr_)? {w:$(window).width(),h:$(window).height()}: {w:window.innerWidth,h:window.innerHeight}
	}
	return sizeObj;
}
function getPageSizeObj(){
	var sizeObj = {
		doc : {w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight},
		scroll : {x:document.documentElement.scrollLeft,y:document.documentElement.scrollTop,top:$(window).scrollTop(),left:$(window).scrollLeft()}
		, header:{h:$("#header-wrap").height()}, footer:{h:$("#footer-wrap").height() + 1}
	};
	return sizeObj;
}
function getWindowSize(){
	wsize =getWindowSizeObj();
}
function getPageSize(){
	psize = getPageSizeObj();
	printWinSizeInfo();
}
function printWinSizeInfo(){
	var str = "";
	str +="window [w : "+wsize.win.w+", h:"+wsize.win.h+"] ";		
	str +="doc [w : "+psize.doc.w+", h:"+psize.doc.h+"]<br/>";
}
var docChkTimer = null;var DOC_COMPLET = null;
function docLoading(loadFunc){
	clearTimeout(docChkTimer);
	if(document.readyState=="loaded" || document.readyState=="complete"){
		DOC_COMPLET = true;
		if(loadFunc!=undefined) loadFunc();
	}
	else{
		docChkTimer = setTimeout(function(){docLoading(loadFunc);},500);
	}
}
function getBrowsertInfo(){
	var $agent = navigator.userAgent;
	var $s = "";
	var $br = {browser:"",browserType:"",browserVer:[]};
    if ((/msie 5.0[0-9]*/i).test($agent))         { $s = "MSIE 5.0"; }
    else if((/msie 5.5[0-9]*/i).test($agent))     { $s = "MSIE 5.5"; }
    else if((/msie 6.0[0-9]*/i).test($agent))     { $s = "MSIE 6.0"; }
    else if((/msie 7.0[0-9]*/i).test($agent))     { $s = "MSIE 7.0"; }
    else if((/msie 8.0[0-9]*/i).test($agent))     { $s = "MSIE 8.0"; }
    else if((/msie 9.0[0-9]*/i).test($agent))     { $s = "MSIE 9.0"; }
	else if((/msie 10.0[0-9]*/i).test($agent))     { $s = "MSIE 10.0"; }
	else if((/windows*/i).test($agent) && (/rv:11.0[0-9]*/i).test($agent))     { $s = "MSIE 11.0"; }
    else if((/msie 4.[0-9]*/i).test($agent))      { $s = "MSIE 4.x"; }
    else if((/firefox/i).test($agent))            { $s = "FireFox"; }
    else if((/safari/i).test($agent))            { $s = "FireFox"; }
    else if((/x11/i).test($agent))                { $s = "Netscape"; }
    else if((/opera/i).test($agent))              { $s = "Opera"; }
    else if((/gec/i).test($agent))                { $s = "Gecko"; }
    else if((/bot|slurp/i).test($agent))          { $s = "Robot"; }
    else if((/internet explorer/i).test($agent))  { $s = "IE"; }
    else if((/mozilla/i).test($agent))            { $s = "Mozilla"; }
    else { $s = ""; }
	$br.browser = $s;
	if((/msie/i).test($s)){
		$br.browserType = "IE";
		$br.browserVer =  $s.replace("MSIE " ,"").split(".");
	}
	return $br;
}

if('onorientationchange' in window){window.addEventListener('onorientationchange', setWindowRotation, false);}
$(document).ready(function(){
	try{initPageCssFiles();}catch(e){}
	try{initPageJavascript();}catch(e){}

	try{getWindowSize();}catch(e){ alert(e);}
	try{getPageSize();}catch(e){}
	
	try{setLowBrowser();}catch(e){	}
	try{initPageLayout();}catch(e){	}
	try{setMediaObjectFunc();}catch(e){	}
	
	try{_thisLayout_style = getPageStyle(); }catch(e){}
	docLoading(function(){
	});
});
$(window).load(function(){
	try{initImgSizeInfo();}catch(e){	}
	setPageLayout();	
});
$(window).resize(function(e){
	var resizeTimeGap = 10;
	if(_isLowBr_) resizeTimeGap=100;
	clearTimeout(window.resizeEvt);
	window.resizeEvt = setTimeout(function()
	{
		getWindowSize();getPageSize();
		try{
		if(old_wsize.win== undefined ||  wsize.win.w!=old_wsize.win.w){
			resetPageLayout();
		}else{
			resizePageLayoutHeight();
		}
		}catch(e){
			resetPageLayout();
		}
		try{ $(msgPopArr).each(function(k,pp){
			pp._resize();
			});		
		}catch(e){}
	}, resizeTimeGap);
});
$(window).scroll(function(){
	var scrTimeGap = 10;
	if(_isLowBr_) scrTimeGap=100;
	clearTimeout(window.scrollEvt);
	window.scrollEvt = setTimeout(function()
	{
		try{ setScrollEndLayout();}catch(e){}
	}, scrTimeGap);
	clearTimeout(window.scrollAfterEvt);
	window.scrollAfterEvt = setTimeout(function()
	{
		try{ setScrollAfertLayout();}catch(e){}
	}, 5000);
});
function initPageLayout(){
	initNavigation();
	NaviHeight_()
	if(_thisPage.initAction!=undefined && _thisPage.initAction.length>0){
		$(_thisPage.initAction).each(function(i,func){try{func();}catch(e){ alert(e);}});
	}
}
function setPageLayout(){
	//if($(".content-bg").length<1) $("<div class='content-bg'/>").appendTo($("#contents")).hide();
	if(_thisPage.initAction!=undefined && _thisPage.initAction.length>0){
		$(_thisPage.initAction).each(function(i,func){try{func();}catch(e){ alert(e);}});
	}
	try{ thisPageResizeAction(); }catch(e){}
	
	
	
}
function resetPageLayout(){
	mainNavi._reset();
	NaviHeight_()
	//if($(".content-bg").length<1) $("<div class='content-bg'/>").appendTo($("contents")).hide();
	if(_thisPage.resizeAction!=undefined && _thisPage.resizeAction.length>0){
		$(_thisPage.resizeAction).each(function(i,func){try{func();}catch(e){ alert(e);}});
	}
	try{ thisPageResizeAction(); }catch(e){}
}
function resizePageLayoutHeight(){}
function setScrollEndLayout(){
	var scrTop = $(window).scrollTop();	
	if(_thisPage.scrollAction!=undefined && _thisPage.scrollAction.length>0){$(_thisPage.scrollAction).each(function(i,func){try{func();}catch(e){ alert(e);}});}
}
function setScrollAfertLayout(){}
function setWindowRotation(){
	if(typeof(thisPageRotation)=="function" && thisPageRotation!=undefined){ thisPageRotation();}
	else {
	}
}

function NaviHeight_(){
	var bodyHeight = document.documentElement.clientHeight;
	
}

function clearText(thefield) {
  if (thefield.defaultValue==thefield.value) {
    thefield.value="";
  }
} 
function defaultText(thefield) {
  if (thefield.value=="") {
    thefield.value=thefield.defaultValue;
  }
}
