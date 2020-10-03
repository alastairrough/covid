var g_directoryID = getQueryVar("res_id"); 
var g_isDirectoryPage = location.href.toLowerCase().indexOf("result?") > 0;
var siteUrl;
var g_directoryTitle = "";

_spBodyOnLoadFunctionNames.push("loadSubpages");

function loadSubpages(){

	var pageItemId;  // find the subpages by id to build on-the-fly side menu
	if(_spPageContextInfo){
		pageItemId = _spPageContextInfo.pageItemId;
	}

	siteUrl = _spPageContextInfo.siteAbsoluteUrl;
	if(g_directoryID){	// provide the navigation menu when visitors arrive from the directory search
		getItems("Locations and Services", retrivePages, 
			"?$select=Specific_x0020_Title,Subpages/ID,Subpages/Title&$expand=Subpages&$filter=ID eq " 
			+ g_directoryID);
	}
	else{  // provide the navigation menu when a sub page is accessed from site-search results (ELU:12/15/2017)
		var pageTitle = document.title.split('-');
		if(pageItemId){
		//if(pageTitle && pageTitle[0]){
			//var pageTitleToken = pageTitle[0].trim();
			// escape the single quotation in the name
			//pageTitleToken = pageTitleToken.replace("'", "''");

			getItems("Locations and Services", retrivePages, 
				"?$select=ID,Specific_x0020_Title,Subpages/ID,Subpages/Title&$expand=Subpages\
				&$filter=(Subpages/ID eq "+pageItemId+")");
		}			

	}
}


function getItems(list, success, condition) {

    var restUrl = siteUrl + "/_api/lists/getbytitle" + "('" + list + "')/items";

    if (condition != null) {
        restUrl += condition;
    }

	$.ajax({
		url: restUrl,
		type: "GET",
		cache: true,
		headers: { "accept": "application/json;odata=verbose" },
		success: function (data) {
			success(data.d.results);
		},
		failure: function (data){
			//console.log("Can't find the list");
		}
	});

}


function retrivePages(data){

	if(!data || !data[0] || !data[0].Subpages || data[0].Subpages.results.length <= 0){
		return;
	}

	if(!g_directoryID){
		g_directoryID = data[0].ID;
	}
	
	var filter = "";
	pages = data[0].Subpages.results;
	g_directoryTitle = data[0].Specific_x0020_Title;
	
	//$.each(data, function (index, value) {
	for(var i = 0; i< pages.length; i++){
		filter += "(ID eq " + pages[i].ID + ") or ";
	}
	//});	
	
    if (filter.length > 0) {
        filter = filter.substring(0, filter.length - 3);
        filter = "?$filter=" + filter;
        //console.log(filter); 
    }	
	
	filter += "&$select=Id,Title,FileRef&$orderby=SubpageSequence";
	
	getItems("Pages", buildNav, filter);
	buildBreadcrumb();
}

function buildNavMobile(data){

		
	
	var $navListDiv = $("#internal-nav-list");

	var $navList = $("<ul/>", createList("external-accordion-nav", ""));
	$navList.appendTo($navListDiv);

	if(data.length <= 0){
		$navListDiv.hide();
		return;
	}	
	
	var currentPageUrl = g_isDirectoryPage ? 
		location.href : (siteUrl + "/locations-services/result?res_id=" + g_directoryID); //data[0].Link;
	var currentPageTitle = g_isDirectoryPage ? 
		$(".page-title").text().trim() : g_directoryTitle; //data[0].Title;
	var currentPageTarget = "level2-side";
	var $activeItem = $("<li/>", createLinkItem(""));
	var $activeLink = $("<a/>", createLink(currentPageTitle, currentPageUrl));
	var $activeIcon = $("<i/>", createIcon("icon icon-accord", "collapse", "#" + currentPageTarget)); 	
	$activeIcon.appendTo($activeLink);
	$activeLink.appendTo($activeItem);
	$activeItem.appendTo($navList);	
	
	
	$subpageList = $("<ul/>", createList("collapse in", currentPageTarget));
	
	if(data.length > 0){
		for(var i = 0; i < data.length; i++){
			var title = data[i].Title;

			var link = data[i].FileRef + "?res_id=" + g_directoryID ;

			var $subpageItem = $("<li/>", createLinkItem(""));
			var $subpageLink = $("<a/>", createLink(title, link));
			$subpageLink.appendTo($subpageItem);
			$subpageItem.appendTo($subpageList);
		}	
		
		$subpageList.appendTo($activeItem);
		
		$("a.internal-nav-list__trigger").css("visibility", "visible");
	}
	else{
		$("a.internal-nav-list__trigger").css("visibility", "hidden");
	}
}

function buildNav(data){
	
	if(!data){
		return;
	}

	//buildNavMobile(data);

	var $mobileNav = $("#internal-nav-list");
	var $mobileNavList = $("<ul/>", createList("external-accordion-nav", ""));
	$mobileNavList.appendTo($mobileNav);
	
	var $nav = $("<nav/>", {"class":"accordion-nav"});
	var $navList = $("<ul/>", createList("", "directory_leftNav"));
	$navList.appendTo($nav);

	
	var $rootItem = $("<li/>", createLinkItem("parent-link"));
	var $rootLink = $("<a/>", createLink("Locations & services", "/locations-services"));
	$rootItem.appendTo($navList);
	$rootItem.clone().appendTo($mobileNavList);
	$rootLink.appendTo($rootItem);
	
	var currentPageUrl = g_isDirectoryPage ? 
		location.href : (siteUrl + "/locations-services/result?res_id=" + g_directoryID); //data[0].Link;
	var currentPageTitle = g_isDirectoryPage ? 
		$(".page-title").text().trim() : g_directoryTitle; //data[0].Title;
	var currentPageTarget = "level2-side";
	var $activeItem = $("<li/>", createLinkItem(""));
	var $activeLink = $("<a/>", createLink(currentPageTitle, currentPageUrl));
	var $activeIcon = $("<i/>", createIcon("icon icon-accord", "collapse", "#" + currentPageTarget)); 
	$activeIcon.appendTo($activeLink);
	$activeLink.appendTo($activeItem);
	$activeItem.appendTo($navList);
	$mobileActiveItem = $activeItem.clone();
	$mobileActiveItem.appendTo($mobileNavList);
	
	$subpageList = $("<ul/>", createList("collapse in", currentPageTarget));
	
	for(var i = 0; i < data.length; i++){
		var title = data[i].Title;

		//var link = "/pages/" + data[i].Title.replace(/ /g, '-').replace(/\./g, '-')
		var link = data[i].FileRef + "?res_id=" + g_directoryID ;

		//data[i].Link + "?res_id=" + g_directoryID;
		
		var $subpageItem = $("<li/>", createLinkItem(""));
		var $subpageLink = $("<a/>", createLink(title, link));
		$subpageLink.appendTo($subpageItem);
		$subpageItem.appendTo($subpageList);
	}
	
	$subpageList.appendTo($activeItem);
	$subpageList.clone().appendTo($mobileActiveItem);
	
	$nav.appendTo($(".left-navigation")); 
	
	if(g_isDirectoryPage){
		$("li.parent-link").next("li").addClass("active");
	}
	else{
		// style the navigation menu when a sub page is accessed from site-search results (ELU:03/02/2017)
		
		$("ul#directory_leftNav a[href*='" + location.pathname + "']").parent("li").addClass("active");
		//$("ul#directory_leftNav ul a[href*='" + g_directoryID + "']").parent("li").addClass("active");
		$("ul.external-accordion-nav a[href*='"+location.pathname+"']").parent("li").addClass("active");
	}
	
	$(".left-navigation").show();
}

function createLink(txt, url){
	return {"href":url,"text":txt};
}

function createLinkItem(className){
	return {"class": className};
	
}

function createIcon(className, toggle, target){
	return {"class":className, "data-toggle":toggle, "href":target};
}

function createList(className, id){
	return {"id": id, "class":className};
}

function getQueryVar(varName){
    // Grab and unescape the query string - appending an '&' keeps the RegExp simple
    // for the sake of this example.
    var queryStr = unescape(window.location.search) + '&';

    // Dynamic replacement RegExp
    var regex = new RegExp('.*?[&\\?]' + varName + '=(.*?)&.*');

    // Apply RegExp to the query string
    val = queryStr.replace(regex, "$1");

    // If the string is the same, we didn't find a match - return false
    return val == queryStr ? false : val;
}

function buildBreadcrumb(){
	if(g_isDirectoryPage){

		var $link = $("<a/>", createLink($(".page-title").text().trim(), location.href));
		var $linkItem = $("<li/>", createLinkItem(""));
		$link.appendTo($linkItem);
		$linkItem.appendTo($("div.breadcrumb ul"));
	}
	else{
		if($("div.breadcrumb ul li").length > 0){
			$("div.breadcrumb ul li").remove();
		}
		
		var $link = $("<a/>", createLink("Home", "/"));
		var $linkItem = $("<li/>", createLinkItem(""));		
		$link.appendTo($linkItem);
		$linkItem.appendTo($("div.breadcrumb ul"));	
		
		$link = $("<a/>", createLink("Locations and services", "/locations-services"));
		$linkItem = $("<li/>", createLinkItem(""));		
		$link.appendTo($linkItem);
		$linkItem.appendTo($("div.breadcrumb ul"));	
		
		$link = $("<a/>", createLink(g_directoryTitle, "/locations-services/result?res_id=" + g_directoryID));
		$linkItem = $("<li/>", createLinkItem(""));		
		$link.appendTo($linkItem);
		$linkItem.appendTo($("div.breadcrumb ul"));	
		
		$link = $("<a/>", createLink($(".page-title").text().trim(), location.href));
		$linkItem = $("<li/>", createLinkItem(""));
		$link.appendTo($linkItem);
		$linkItem.appendTo($("div.breadcrumb ul"));	
	
	}
}



