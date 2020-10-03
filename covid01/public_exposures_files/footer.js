$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/_layouts/15/CUSTOM/footer.xml",
        data: {},
        dataType: "xml",
        success: function (data) {
            xmlInsert(data);
            $("#socialFooterList a").each(function () {
                $(this).attr("target", "_blank");
            })
            if (typeof authenticated != 'undefined' && authenticated == true) {
                redirectFooterLink();
            }
        }
    });

});

function xmlInsert(xmlFile) {

    var topFooterList = toHtml($(xmlFile).find('topFooterList'));
    var socialFooterList = toHtml($(xmlFile).find('socialFooterList'));
    var agencyFooterList1 = toHtml($(xmlFile).find('agencyFooterList1'));
    var agencyFooterList2 = toHtml($(xmlFile).find('agencyFooterList2'));
    var legalFooterList = toHtml($(xmlFile).find('legalFooterList'));

    $("#topFooterList").html(topFooterList);
    $("#socialFooterList").html(socialFooterList);
    $("#agencyFooterList1").html(agencyFooterList1);
    $("#agencyFooterList2").html(agencyFooterList2);
    $("#legalFooterList").html(legalFooterList);

    replaceAgencyLinks();

    if ($("#agencyLink").length > 0) {
        $("#agencyLink").appendTo($("#legalFooterList"));
    }
}

function toHtml(xmlElement) {
    var tempString = "";

    $(xmlElement).find('li').each(function () {
        var href = $(this).find('href').text();
        var display = $(this).find('display').text();
        var target = " ";

        if (href.indexOf(window.location.host) == -1) {
            target = " target=_blank ";
        }

        tempString += "<li><a" + target + "href='" + href + "'>" + display + "</a></li>";
    });

    return tempString;

}

function redirectFooterLink() {
    if (window.location.hostname == "ewiauthor.phsa.ca" || window.location.hostname == "editphsa.phsa.ca") {
        var staffResources = $("a[href='http://www.phsa.ca/staff-resources']");
        var staffResourcesLink = staffResources.attr("href");
        staffResourcesLink = staffResourcesLink.replace("http://www.", "https://ewiauthor.");
        staffResources.attr("href", staffResourcesLink);
    }
}

function replaceAgencyLinks() {
	var footerText = '<div class="row"><div class="col-sm-12">PHSA plans, manages and evaluates specialized health care services in partnership with other B.C. health authorities. We deliver these services to communities around the province on the traditional and ancestral lands of many Indigenous peoples. <a href="http://www.phsa.ca/our-services" target="_blank">Learn about our services.</a></div></div>';
    $('body.agency .site-footer .agencies').html(footerText);
    $('body.agency .site-footer .agencies').removeClass('hidden-xs');
}

