$('.search-input').keypress(function(e) {
	if(e.which == 13) {
		$('.search-btn').click();
	}
});
$('.search-btn').click(function() {
	window.location.href = "/search#k=" + $('.search-input').val();
});
if (window.location.pathname == "/search") {
	$('.search-field').hide();
}