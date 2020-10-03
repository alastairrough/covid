
	$('.show-more').click(function() {
		$('.agencies').toggleClass('hidden-xs');
	});	
	if ($('.content-body .step').length > 0) {
		$('.content-body').addClass('indent');
	}
	if ($('.left-navigation .accordion-nav').length > 0)
	{
		$('.left-navigation').show();
	}
	$('.ms-webpartzone-cell .slm-layout-main').closest('.ms-webpartzone-cell').each(function() {
		if ($(this).prev('.ms-webpartzone-cell') != null) {
			$(this).addClass('summary-link-webpart');
		}
	})
