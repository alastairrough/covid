
//var isDirectoryPage = location.href.toLowerCase().indexOf("locations-services") > 0;
_spBodyOnLoadFunctionNames.push("docReady");
	
function docReady() {

	/* Apply fancybox to multiple items */

	processImages();
	
	$("a.img-group").fancybox({
		'speedIn'		:	50, 
		'speedOut'		:	100, 
		'overlayShow'	:	true,
		'showNavArrows'	: 	true,
		'titlePosition'  : 'inside',
		helpers : {
			overlay : {
				locked : false
			}
		}		
	});
	/* fancybox ends */
}

function processImages(){
	var prevParent = null;
	var imgGroupCounter = 0;
	var imgIndex = 0;
	if($('a.img-group').length === 0) {
		$("div[id$='RichHtmlField'] img, div#divDesc img, .panel-group img").each(function(index){
			
			var imgHref = $(this).attr("src");
			if(imgHref.indexOf("RenditionID") < 0){
				return;
			}
			
			var currentParent = $(this).closest("div[class*=External]").attr("class");
			
			if(!currentParent){
				currentParent = $(this).closest("div[id$='RichHtmlField']").attr("class");
			}
			
			if(currentParent != prevParent){
				imgGroupCounter++;
				prevParent = currentParent;
				imgIndex = 0;
			}
			else{
				imgIndex++; 
			}
			
			var imgClass = "img-group";
			var imgRel = "img-group-" + imgGroupCounter;
			
			imgHref = imgHref.substr(0, imgHref.indexOf('?'));

			
			var $aTag = $("<a/>", 
			{	"class":imgClass, 
				"rel":imgRel, 
				"href":imgHref,
				"title":$(this).attr("alt")
			});
			
			$(this).wrapAll($aTag[0].outerHTML); 
			$(this).attr("index", imgIndex);
			$aTag.attr("index", imgIndex);
		});	
	}
}
