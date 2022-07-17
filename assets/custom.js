
$(document).ready(function() {
	
  $('.rte.clearfix.truncated .read-more').click(function() {
	console.log("here custom js");
        $('.truncated + .rte.clearfix p').addClass('show');
  })
})