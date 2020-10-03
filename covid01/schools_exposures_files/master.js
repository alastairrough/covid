var url = "";
var list = "Social Media Links";
var urlParams;

// grab all query string parameters and save it to a variable called urlParams
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

$(document).ready(function() {
	$(".secondary-nav li:last").addClass("highlight");
	$("div.container").addClass($.trim($(".page-layout-type").text()));
	createSocialMediaLinks();
	hideEmptySubNavigation();
	createMobileMainNavigation();
	createMobileSubNavigation();
	hideDefaultMicrositeLogo();
	fixImageAltText();
	showToolbarAlerts();
	showMobileAlertsLogoText();
	createTicker();
	timeNow();
	showInternalNavList();
	// if a query string parameter 'subid' exists, pass it to the first iframe found
	var subid = urlParams["subid"];
	if (subid != null) {
		addQueryStringToAppRedirect("subid", subid);
	}
	
	//If IE7, search icon fix
	if (document.all && !document.querySelector) {
		$(".ms-srch-sb-searchLink").html("m");
	}
	
});
function showInternalNavList(){
	if($("#internal-nav-list li").length != 0){
		$(".internal-nav-list__trigger").css("display", "block");
	}
} 
// Google Analytics for documents
(function ($) {
	var extensions = ['.doc', '.docx', '.ppt', '.pptx', '.pdf'];

	$(document.body)
		// Link with DocIdRedir.aspx in href
		.on('click', 'a[href*="DocIdRedir.aspx?"]', function () {
			if (typeof(ga) == 'function') {
				ga('send', 'pageview', this.href);
				ga('agencyTracker.send', 'pageview', this.href);
			}
		})
		// Link with the above extensions
		.on('click', $.map(extensions, function (ext) { return 'a[href$="' + ext + '"]'; }).join(','), function () {
			if (typeof(ga) == 'function') {
				ga('send', 'pageview', this.href);
				ga('agencyTracker.send', 'pageview', this.href);
			}
		});
}(jQuery));

function getListItems(list, success) {
	url = $.trim($(".site-url").text());
	var restUrl = "";
	var guidPattern = new RegExp(".{8}-.{4}-.{4}-.{4}-.{12}");
	var restEndpointSnippet = "/getbytitle";
	if (guidPattern.test(list) == true) {
		restEndpointSnippet = "";
	}
	
	if ($(".microsite").length == 1) {
		restUrl = url + "_api/web/lists" + restEndpointSnippet + "('" + list + "')/items";
	} else {
		restUrl = url + "_api/lists" + restEndpointSnippet + "('" + list + "')/items";
	}
	$.ajax({
		url: restUrl, 
		type: "GET", 
		cache: true,
		headers: { "accept": "application/json;odata=verbose" },
		success: function(data){
			success(data.d.results);
		}
	});
}

function addQueryStringToAppRedirect(parameter, value) {
	// add a query string parameter and value to the app redirect URL of a Sharepoint app
	var iframeSource = $("iframe").attr("src");
	var indexOfEncodedQuestionMark = iframeSource.indexOf("%3F");
	
	iframeSource = [iframeSource.slice(0, indexOfEncodedQuestionMark + 3), parameter + "%3D" + value + "%26", iframeSource.slice(indexOfEncodedQuestionMark + 3)].join('');
	$("iframe").attr("src", iframeSource);
}

function createSocialMediaLinks() {
	if ($('.social').length > 0) {
		function createLinks(data) {
			$.each(data, function(index, value) {
				var li = document.createElement("li");
				var anchor = document.createElement("a");
				anchor.setAttribute("href", value.Title);
				anchor.setAttribute("target", "_blank");
				var icon = document.createElement("i");
				icon.setAttribute("class", "icon icon-" + value.Category.toLowerCase());
				//If IE7
				if (document.all && !document.querySelector) {
					var categoryValue = value.Category.toLowerCase();
					if(categoryValue == "facebook") {
						icon.innerHTML = "e";
					}
					else if(categoryValue == "linkedin") {
						icon.innerHTML = "s";
					}
					else if(categoryValue == "instagram") {
						icon.innerHTML = "r";
					}
					else if(categoryValue == "twitter") {
						icon.innerHTML = "p";
					}
					else if(categoryValue == "youtube") {
						icon.innerHTML = "n";
					}
					else if(categoryValue == "flickr") {
						icon.innerHTML = "\ue000";
					}
					else if(categoryValue == "rss") {
						icon.innerHTML = "\ue002";
					}
				}
				anchor.appendChild(icon);
				li.appendChild(anchor);
				$(".social ul").not(".site-footer .social ul").append(li);
			});
			$(".social ul li .icon").attr("style", "font-family: 'phsa-icons'; font-style: normal;");
			if ($(".social ul li").not(".site-footer .social ul li").length != 0) {
				$(".social").not(".site-footer .social").prepend("<span>Follow us</span>");
			}
		}
		getListItems(list, createLinks);
	}
}

function fixImageAltText() {
	$("img").each(function() {
		var altText = $(this).attr('alt');
		if (altText != "")
		{
			$(this).attr('title', altText);
		}
    	
	});
}

function hideEmptySubNavigation() {
	var subNav = $(".accordion-nav > ul").not(".top-accordion-nav > ul");
	if (subNav.find("li").length == 0) {
		$(".accordion-nav").not(".top-accordion-nav").remove();
	}
}

function createMobileMainNavigation() {
	function cleanString(str) {
	  return str.replace(/[.,*+?^$&{}()|[\]\\]/g, '').replace(/ /g, '-');
	}

	$('.external-accordion-nav ul ul').each(function(index, object) {
		var sibling = $(object).prev('a.static');
		var childrenId = cleanString($(sibling).find('.menu-item-text').text());
		$(object).attr('id', childrenId);
		$(object).addClass('collapse');
		$(object).siblings().append('<i data-toggle="collapse" class="icon icon-accord collapsed" href="#' + childrenId + '"></i>');
	})
}

function createMobileSubNavigation() {
	var subNav = $(".accordion-nav > ul").not(".top-accordion-nav > ul");
	if (subNav.length > 0) {
		$(".top-accordion-nav").show().addClass("visible-xs visible-sm");
	}
}

function hideDefaultMicrositeLogo() {
	if ($(".micro-logo-container img").length > 0) {
		if ($(".micro-logo-container img").attr("src").indexOf("/_layouts/15/images/siteIcon.png") != -1) {
			$(".micro-logo-container").hide();
		}
	}
}

function showToolbarAlerts() {
	if ($(".health-alerts ul li").length != 0) {
		$(".phsa-banner").show();
	}
}

function showMobileAlertsLogoText() {
	if ($(".mob-alerts ul").length != 0) {
		var li = document.createElement("li");
		$("a.banner-toggle").clone().appendTo($(li));
		$(".mob-alerts ul").append(li);
	}
	else {
		var ul = document.createElement("ul");
		var li = document.createElement("li");
		$(ul).addClass("list-unstyled").append(li);
		$("a.banner-toggle").clone().appendTo($(li));
		$(".mob-alerts").append(ul);
	}
}

function createTicker() {
	if($(".content-ticker").length > 0) {
		function maxHeightOfList(list) {
			var itemHeight = 0;
			$(list).find("li").each(function() {
				$(this).height("auto");
				if (itemHeight < $(this).height()) {
					itemHeight = $(this).height();
				}
			});
			return itemHeight;
		}
	
		var url = $.trim($(".site-url").text());
		var restString = "_api/web/lists/GetByTitle('Thank a Paramedic')/items?$filter=OData__ModerationStatus eq 0&$orderby=Modified desc&$top=5";
		var ajaxUrl = "_api/web/Lists(guid'" + "CF8A750A-0A49-4B31-A718-CEB29C8F7252" + "')/items?$filter=OData__ModerationStatus eq 0&$orderby=Modified desc&$top=5";
		$.ajax({
			url: url + restString,
			method: "GET",
			headers: { "Accept": "application/json; odata=verbose"},
			data: {},
			success: function (data) {
				var stringer = ""
				$.each(data.d.results, function(index, value)
				{
					stringer += "<li><div style='color:#777;'>&quot;" + value.GenericMultiColumn1 + "&quot;</div><br/><strong class='author' style='color:#CD1F2E;'>" + value.Title + "</strong></li>";
				});
				stringer = "<ul class='list-unstyled'>" + stringer + "</ul>";
				$(".content-ticker").html(stringer);
				
				var list = $(".content-ticker").find("ul");
				//var itemWidth = $(".content-ticker").width();
				$(".content-ticker").each(function(index) {
					/*var itemHeight = 0;
					$(this).find("li").each(function() {
						$(this).height("auto");
						if (itemHeight < $(this).height()) {
							itemHeight = $(this).height();
						}
					});*/
					var itemHeight = maxHeightOfList(this)
					$(this).find("li").height(itemHeight);
					$(this).height(itemHeight);
					
					var tickerTimeout = 0;
					$(this).mouseenter(function() {
						clearTimeout(tickerTimeout);
					}).mouseleave(function() {
						startTickerAnimation();
					});
					startTickerAnimation();
					
					function startTickerAnimation() {
						tickerTimeout = setTimeout(function() {
							/*list.animate({
								left: -itemWidth,
								width: itemWidth
							}, 1000, function() {
								list.append(list.find("li").first());
								list.css("left", "0");
								list.css("width", itemWidth)
							});*/
							list.fadeOut("slow", function() {
								var firstItem = list.find("li").first();
								list.append(firstItem);
								list.fadeIn("slow")
							})
							startTickerAnimation();
						}, 6000);
					}
					/*$(this).resize(function() {
						itemWidth = $(".content-ticker").width();
						$(this).find("ul").width(itemWidth)
					})*/
					$(window).resize(function() {
						itemHeight = maxHeightOfList(list)
						list.find("li").height(itemHeight);
						list.parent(".content-ticker").height(itemHeight);
					})
				});
			},
			error: function (data) {
				console.log("Failue");
			}

		});
	}
}

function timeNow() {
	var currentTime = new Date();
	$("#windowPath").text(window.location.href);
	$("#fullDate").text(currentTime.toLocaleDateString(['en-CA', 'en-US']));
	$("#yearDate").text(currentTime.getFullYear());
}

function dateFromISO8601(isoDateString) {
	if (isoDateString == null) {
		return new Date(null);
	}
	var parts = isoDateString.match(/\d+/g);
	var isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
	var isoDate = new Date(isoTime);

	return isoDate;
}

function goToTop() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	window.parent.$("#s4-workspace").scrollTop(0);
}

//Methods for receiving message and sending message back to app part with the url of the hosting page
$(function() {
	function verifyMessage(messageData) {
		if (messageData.message == 'getHostPageInfo') {
			senderIndex = messageData.senderId.substring(8);
			
			if(senderIndex >= spAppIFrameSenderInfo.length)
				return false;

			if(spAppIFrameSenderInfo[senderIndex][0] != messageData.senderId)
				return false;
		
			return true;
		}
		else if (messageData.message == 'goToTop') {
			goToTop();
		}
		else {
			return false;
		}
	}

    var sendHostPageInfoListener = function (e) {
 
        var messageData;
 
        try
        {
            messageData = JSON.parse(e.data);
        }
        catch (error)
        {
            //console.log("Could not parse the message response.");
            return;
        }
 
		if(verifyMessage(messageData)) {
			// Construct the return data to send to the app part
			var returnData = {};
			returnData.senderId = messageData.senderId;
			returnData.hostPageURL = window.location.href;
			returnData.inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value == "1";
			returnData.message = "respondHostPageInfo"
			var returnDataString = JSON.stringify(returnData);
	 
			e.source.postMessage(returnDataString, e.origin);
			//console.log("Sent app part iframe message: " + returnDataString); 
		}
    };
 
    // Register the listener
    if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('message', sendHostPageInfoListener, false);
    }
    else if (typeof window.attachEvent !== 'undefined') {
        window.attachEvent('onmessage', sendHostPageInfoListener);
    }
})