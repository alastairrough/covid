
var siteUrl = "";
var isDirectoryPage = location.href.toLowerCase().indexOf("?res_id=") > 0;
var isEditMode;

// pre init
_spBodyOnLoadFunctionNames.push("documentReady");

$("<li><a href='/'>Home</a></li>").insertBefore($("div.breadcrumb:not(.nohome) ul li:first-child"));
$(".breadcrumb ul").fadeIn();	
var pageTitle = $("h1.page-title").html();
if(pageTitle){
	pageTitle = pageTitle.trim();
	pageTitle = decodeEntities(pageTitle) + " - Vancouver Coastal Health";
	$(document).prop('title', pageTitle);	

}
// pre init ends

// show the page upon loading the web font
try{
	Typekit.load({ 
		async: false,
		loading: function() {
		},
		active: function() {
			$('div#s4-bodyContainer').show();
		},
		inactive: function() {
		}		
	});
}
catch(e){
	$('div#s4-bodyContainer').show();
}

function documentReady() {
	siteUrl = _spPageContextInfo.siteAbsoluteUrl; 
	isEditMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value === '1' ? true : false;
	
	addHeaderTools();
	
	removeBlankWebpart();
	
	bindEventHandlers();		

	decrorations(); 

	addMobileMenuItems(); 
	
	misc(); 
}

createSocialMediaLinks = function(a){};

function misc(){
	$('div#s4-bodyContainer').show();
	
	// site-wide alert
	getMasterItems("Alerts", siteAlert, "?$filter=startswith(Active, 'Active')");
	
	// a float subpages menu for mobile only
	if(!isDirectoryPage){
		$(".internal-nav-list__trigger").css("visibility", "hidden");
	}
	
	// shortcut for configuring search widget
	$("#lnkSearchWidget").attr("href", siteUrl 
		+ "/Pages/Forms/EditForm.aspx?ID=" 
		+ _spPageContextInfo.pageItemId);	
		
	$(".site-logo img").attr("alt", "VCH homepage");
	
	// resize video if applicable
	if($(".content-body").find("iframe").length > 0){
		$(".content-body").find("iframe").each(function(){
			var src = $(this).attr("src");
			if(src){
				src = src.toLowerCase();
				if(src.indexOf("youtube") >= 0 || src.indexOf("youtu.be") >= 0){
					//$(this).parent("div").width("100%");
					//$(this).width("100%");
					//var height = $(this).width() / 1.78; //magic ratio obtained from previous video attributes
					//$(this).height(height);
					$(this).addClass('embed-responsive-item');
					$(this).parent().addClass('embed-responsive embed-responsive-16by9');
				}
			}
		});

	}

}

function siteAlert(data){
	if(data && data.length > 0){
		
		
		var url = data[0].Link;
		var content = data[0].Content;
		if(url){
			content = "<a href=http://" + url+ ">" + content + "</a>";
		}
			
		
		if($(".alert-banner li").length > 0){
			$(".alert-banner li:first-child").html(content);
		}
		else{
			var $list = $("<ul/>", {"class":"list-unstyling"});
			var $alert = $("<li/>", {"html": content});
			$alert.appendTo($list);
			$list.appendTo($(".alert-banner")); 
		}
		$(".alert-row").fadeIn();
	}
}


function removeBlankWebpart(){
	
	if($("div.imgContainer").find("img").length <= 0){
		$("div.imgContainer").hide(); 
	}
	
	//console.log($("div.imgContainer").find("img").length); 
	//$("a#lnkSearchWidget").attr("href", "/pages/forms/EditForm.aspx?ID=" + _spPageContextInfo.pageItemId);
	
	
}

function decrorations(){
	//$("nav.site-nav > ul").addClass("row");
	//$("nav.site-nav > ul > li").addClass("col-lg-2");	
	
	$("img.ms-asset-icon").attr({"src":"/_catalogs/masterpage/custom/images/pdf.jpg","alt":" "});

	if (!isEditMode) {
		$("div.home .newsItem").each(function(){
			var url = $(this).find("a").attr("href");
			var $newATag = $("<a/>", {"href": url});
			var $img = $(this).find(".homeContentBlock img")
			var $imgParent = $img.parent();
			$img.appendTo($newATag);
			$newATag.appendTo($imgParent);
		});
	}

	
	// make the accoridions accessible 
	$(".panel-heading a").each(function(){
		
		if(!$(this).hasClass("collapsed")){
			$(this).attr("aria-expanded", "true");
			$(this).closest(".panel").find(".panel-body").attr("aria-hidden", "false");
		}
		else{
			$(this).attr("aria-expanded", "false");
			$(this).closest(".panel").find(".panel-body").attr("aria-hidden", "true");			
		}
	});	
	
	$(".panel-group").addClass("accordion-controls");
	$(".panel-group").attr("aria-label", "Accordion Control Group Buttons"); 
}

function addMobileMenuItems(){
	
	var lnkCareer = "http://careers.vch.ca";
	$("<li/>", {'html': '<a href="' + lnkCareer + '">Careers</a>'}).appendTo($("ul[id$='mobileNav']"));
	
	var lnkContact = "/about-us/contact-us";
	$("<li/>", {'html': '<a href="' + lnkContact + '">Contact</a>'}).appendTo($("ul[id$='mobileNav']"));	
}


function addHeaderTools(){
	var $headerTools = $("#header-tools");
	$("<div/>", {"class": "resizer", "id":"decreaser", text:"A"}).appendTo($headerTools);
	$("<div/>", {"class": "resizer", "id":"increaser", text:"A"}).appendTo($headerTools);

	$("<div/>", {"href": "http://www.addthis.com/bookmark.php?v=300&amp;pub=ra-51c9bfb619aba3d5",
		"onclick": "return addthis_sendto()",
		id: "btnShare",
		"class": "regularButton",
		"text": "Share",
		"onmouseover": "return addthis_open(this, '', '[URL]', '[TITLE]')",
		"onmouseout": "addthis_close()"}).appendTo($headerTools); 
	

	$("<div/>", {"class": "regularButton", id:"btnPrint", text:"Print"}).appendTo($headerTools);
}

function resize(bIncrease){
	$('.body-content h1, .body-content h2, .body-content h3, \
	.body-content h4, .body-content h5, .body-content p, \
	.body-content a, .body-content li').each(function(){
		
		var k =  parseInt($(this).css('font-size')); 
		var newSize = bIncrease ? ((k*110)/100) : ((k*90)/100);
		newSize = newSize + "px"; 
		$(this).css('font-size', newSize); 
		
		if($(this).is("h1") || $(this).is("h2")){
			//$(this).css('line-height', newSize, "important"); 
			$(this).attr("style", "line-height:" + newSize + " !important;font-size:" + newSize);
		}
	});
   

}

function bindEventHandlers(){
	$("div#decreaser").click(function(){
		resize(false);
	});
	
	$("div#increaser").click(function(){
		resize(true);
	});	
	
	$("#btnPrint").click(function(){
		window.print();
	});
	

	$(".socialLinks img").on({
	 "mouseover" : function() {
		var src = $(this).attr("src"); 
		this.src = src.replace(".png", "-2.png");
	  },
	  "mouseout" : function() {
		var src = $(this).attr("src"); 
		this.src = src.replace("-2.png", ".png");
	  }
	});		
	
	$('input#site-search').keypress(function(e) {
		if(e.which == 13) {
			window.location.href = "/search#k=" + $(this).val();
		}
	});
	
	$("input#site-search-long").keypress(function(e) {
		if(e.which == 13) {
			window.location.href = "/search#k=" + $(this).val();
		}
	});
	$('#btnSearch').click(function() {
		window.location.href = "/search#k=" + $(this).prev('input').val();
		$(".site-search-filter").removeClass("selected");
		$(".site-search-filter:first-child").addClass("selected");
	});		
	
	$("input.ms-srch-sbLarge-fullWidth").keypress(function(e) {
		if(e.which == 13) {
			$(".site-search-filter").removeClass("selected");
		}
	});
	
	$(".site-search-filter").each(function(idx){
		$(this).click(function(e){
			$(".site-search-filter").removeClass("selected");
			$(this).addClass("selected");
			var searchText = $(".ms-srch-sbLarge > input").val();		
			if(idx === 0){  // ALL
				window.location.href = "/search#k=" + searchText;
			}
			else if(idx === 1){ // FILES
				window.location.href =
						'/search#Default={"k":"' + searchText 
						+'","r":[{"n":"FileType","t":["equals(pdf)"],"o":"or","k":false,"m":null}]}';			
			}
			else if (idx === 2){  // DIRECTORY ITEMS
				window.location.href =
						'/search#Default={"k":"'+searchText
						+'","r":[{"n":"SPContentType","t":["ǂǂ4469726563746f7279204974656d"],"o":"or","k":false,"m":null}]}';	
						//+'","r":[{"n":"ConentTypeId","t":[""0x0100976D1BB06668024BB5D8E78B51D87B94""],"o":"or","k":false,"m":null}]}';	
			}
			else if(idx === 3){  // REGULAR PAGES
				window.location.href =
						'/search#Default={"k":"'+searchText
						+'","r":[{"n":"FileType","t":["equals(html)"],"o":"or","k":false,"m":null}]}';				
			}			
			
		});
		
	});

	$(".panel-heading a").click(function(){
		
		if($(this).hasClass("collapsed")){
			$(this).attr("aria-expanded", "true");
			$(this).closest(".panel").find(".panel-body").attr("aria-hidden", "false");
		}else{
			$(this).attr("aria-expanded", "false");
			$(this).closest(".panel").find(".panel-body").attr("aria-hidden", "true");			
		}
	});	
	
}

function getMasterItems(list, success, condition) {

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
		}
	});

}

function decodeEntities(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}