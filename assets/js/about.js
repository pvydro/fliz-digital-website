$(document).ready(function() {
	$('.about-container .topic-text').hover(
	  function() {
	    $(this).addClass("hovered");
			// css('border-color', 'red');//.addClass("topic-text-border-hovered");
			console.log('hovered');
	  }, function() {
	    $(this).removeClass("hovered");
			console.log('unhovered');
	  }
	);
});
