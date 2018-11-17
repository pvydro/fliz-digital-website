$(document).ready(function() {
  $('.back-button').hover(function() {
    $(this + 'span p').addClass("anim-typewriter");
  }, function() {
    $(this + 'span p').removeClass("anim-typewriter");
  })
});
