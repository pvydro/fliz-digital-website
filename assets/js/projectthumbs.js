$(document).ready(function() {
  // Hover on project container
  $(".project-container").mousemove(function(e) {
    let centerX = $(this).offset().left + ($(this).width() / 2);
    let centerY = $(this).offset().top + ($(this).height() / 2);

    let mouseX = e.pageX;
    let mouseY = e.pageY;

    let distanceX = mouseX - centerX;

    let newScaleX = -(distanceX / 10000);
    let absoluteNewScaleX = 1 + Math.abs(newScaleX);
    newScaleX += 1;

    // Apply scaling
    $(this).css({
      'transition': '.2s',
      'transition-timing-function': 'ease-out',
      'transform': 'translateX(-' + (newScaleX * 50) + '%)' + ' scale(' + absoluteNewScaleX + ', 1.0)'
    });
  });
  $(".project-container").mouseout(function() {
    $(this).css({
      'transition': '.4s',
      'transition-timing-function': 'cubic-bezier(.1, .7, 0.3,2.0)',
      'transform': 'translateX(-50%) scale(1.0)'
    });
  })
});
