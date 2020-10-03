$(document).ready(function() {
	/* disable default behavior of initiatives top navigation */
	$(".secondary-nav__trigger").click(function() { return false; })
	
	overviewPageFixes();

	$(".block-cta .phsa-rteElement-Button-Delta").addClass("cta");
	$(".block-cta .phsa-rteElement-Button").addClass("cta");
	$(".ms-rtestate-field").removeClass("ms-rtestate-field");
	/* Add Top Border */
	$(".ms-webpart-chrome-title").not(".errands .ms-webpart-chrome-title").parent().addClass("content-block");
	$("aside .ms-webpartzone-cell + .ms-webpartzone-cell .ms-webpart-chrome-title").closest(".ms-webpartzone-cell").addClass("webpart-spacing");
	/* End Add Top Border */

    if ($(".page-hero img").length != 0 && $(".page-hero img").attr("src") != null) {
        $(".container").addClass("hero-img-present");
    } else {
		$(".page-hero").removeClass("page-hero");
	}
	
	$(".button-delta-replace a").addClass("button-delta");
    if ($(".button-delta-replace a").length == 0) {
        $(".button-delta-replace").hide();
    }
	$(".button-replace a").addClass("button");
    if ($(".button-replace a").length == 0) {
        $(".button-replace").hide();
    }

    if ($(".meta-info").length > 0 && $(".meta-info .ms-formfieldcontainer").length == 0){
		metadataLinks("Tags");
		metadataLinks("Categories");
	}
	
	if ($("time").length > 0 && $(".ms-dtinput").length == 0){
		$("time").html(timeFormat($("time").text(), false));
	}
	
	if ($(".lead").length > 0) {
		var bylineText = $.trim($(".lead").text());
		if (bylineText == "" || bylineText == "&nbsp;") {
			$(".lead").hide();
		}
	}

	if (($("#dateModified").length > 0) && ($.trim($("#timeBool").text()) == "Yes")) {
		var dateAndTime = timeFormat($("#dateModified").text(), true);
		$("#dateModified").html("Last Updated: " +dateAndTime);
		$("#dateModified").css("display", "block");
	}

	if (($.trim($("#image-checkbox").text()) == "Use this image only for News listings") && ($(".ms-dtinput").length == 0))
	{
		$(".full-width").hide();
		$(".article-image-block").hide();
	}
	
	$(".news-feed").closest(".ms-webpartzone-cell").addClass("news-webpart");

	if ($.trim($("#emailAddress").text()).length > 0)
	{
		var address = $.trim($("#emailAddress").text());
		var link = '<a href="mailto:' + address + '">' + address + "</a>";
		$("#emailLink").html(link);
	}

	/* Fix extra accordion spacing */
	try {
	$(".panel").each(function() {
		var panelHeading = $(this).find(".panel-heading");
		$(panelHeading).html($(panelHeading).html().replace(/&nbsp;/g, ""));	
		$(this).html($(this).html().replace(new RegExp('&nbsp;$'), ''));
	})
	}
	catch(err) {}
	/* END */


	/* Enable custom stylesheet prefix for CEWP */
	ExecuteOrDelayUntilScriptLoaded(function() {
		$("div[RteRedirect]").each(function() {
			var id = $(this).attr("RteRedirect"),
			editSettings = $("#" + id);
			if(editSettings.length > 0 && editSettings[0].PrefixStyleSheet != 'phsa-rte') {
				editSettings[0]['PrefixStyleSheet'] = 'phsa-rte';
			}
		});
	}, "sp.ribbon.js");
	/* END */
});

function overviewPageFixes() {
	if ($(".overview")) {
		$(".overview .block-cta .button-delta-replace a").addClass("cta");
		var blockCtaHasNoChildren = $(".overview .block-cta .col-xs-12 div").children().length == 0;
		var blockCtaHasNoButton = $(".overview .block-cta .button-delta-replace a").length == 0;
		if (blockCtaHasNoChildren && blockCtaHasNoButton) {
			if ($(".overview .block-cta img").length == 0) {
				$(".overview .block-cta.content-block").removeClass("content-block");
			}
			$(".overview .block-cta").removeClass("block-cta");
		}
	}
}

function metadataLinks(listName) {
	var termArray = [];
	var attributeString = "Page Field: Article " + listName;
	var classString = ".meta-info-" + listName.toLowerCase();
	var searchUrlSnippet = "/Pages/Search.aspx?k=";

	$("[data-name='"+attributeString+"'] span").each(function(){
		termArray[termArray.length] = ($(this).html());
	});
	
 	var divContent = '';

 	$.each(termArray, function () {
 		divContent+= "<li><a href=\"" + searchUrlSnippet + this + "\">" + this+ "</a></li>";
 	});

 	divContent = "<span>" + listName + ":</span><ul class=\"list-inline\">" + divContent + "</ul>";
 	$(classString).html(divContent);
}

function timeFormat(sharePointDateString, trimTime){
	var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var spDateArray = sharePointDateString.split("/");
	var month = spDateArray[1] - 1;
	var date = spDateArray[0];
	var year = spDateArray[2];
	if (trimTime == true) {
		year = year.split(" ")[0];
	}
    
	var timeString = monthArray[month] + " " + date + ", " + year;
	return timeString;
}
