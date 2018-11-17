var navOpen = false;

$(document).ready(function() {
  $('#navbar .navbar-content .nav-link').each(function(i, ele) {
    if ($(this).hasClass("active")) return;
    $(this).mouseenter(function (){
      $(this).find('.left-selector').css({'margin-right': '2rem', 'opacity': '1'});
      $(this).find('.right-selector').css({'margin-left': '2rem', 'opacity': '1'});
    }).mouseleave(function() {
      $(this).find('.left-selector').css({'margin-right': '7rem', 'opacity': '0'});
      $(this).find('.right-selector').css({'margin-left': '7rem', 'opacity': '0'});
    });
  });
});

function openNav() {
  nextNavBtn();
  if (!navOpen) {
    closeNav();
    return
  }

  // Swipe main
  $('#main').css({
    'transition-delay': '0s',
    'opacity': '0',
  });
  // Disable scroll
  $('body').css('overflow', 'hidden');
  // Show Navbar
  $('#navbar').css({
    'transition-delay': '0.3s',
    'opacity': '1',
    'visibility': 'visible'
  });
}

function closeNav() {
  // Swipe main
  $('#main').css({
    'transition-delay': '0.3s',
    'opacity': '1'
  });
  // Enable scroll
  $('body').css('overflow', 'scroll');
  // Hide Navbar
  $('#navbar').css({
    'transition-delay': '0s',
    'opacity': '0',
    'visibility': 'hidden'
  });
}

function nextNavBtn() {
  navOpen = !navOpen
  // Change hamburger
  if (navOpen) {
    $(".hamburger").addClass("is-active");
  } else {
    $(".hamburger").removeClass("is-active");
  }
}
