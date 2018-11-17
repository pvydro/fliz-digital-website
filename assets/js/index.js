SideOptions = {
  ABOUT: 0
};

var leftSidebarOpened = false;

$(document).ready(function() {
  $('.overlay').css('opacity', '0');
  setTimeout(removeOverlay, 250);
});

function removeOverlay() {
  $('.overlay').css('visibility', 'hidden');
}

function openLeftSidebar(sideOption) {
  leftSidebarOpened = true;
  // Slide open side piece
  $('#left-sidebar').css({'margin-left': '0%', 'opacity': '1'});
  $('#left-sidebar .left-sidebar-background').css('transform', 'rotate(-10deg)');
  $('.darkness-overlay').css({'opacity': '0.75', 'visibility': 'visible'});

  // Add click to close
  $( ".darkness-overlay" ).click(closeLeftSidebar);

  // Hide all HRs
  $('#main hr').each(function(i, ele) {
    $(this).css('opacity', '0');
  });

  // Apply side option text
  switch (sideOption) {
    case SideOptions.ABOUT:
      $('.left-sidebar-content').html(
        '<br><br><br>' +
        '<h1 class="left-sidebar-header">About</h1>' +
        '<h4 class="left-sidebar-subheader">A team inspired by creation and success.</h4>' +
        '<h3 style="text-align: center;">We Bring You Customers. Simple.</h3>' +
        '<h1 style="text-align: center">-</h1>' +
        '<h4>What We Do</h4>' +
        '<p class="left-sidebar-paragraph">We create games with the intention of ' +
        'brand growth or advertisement. We offer a range of options, from Facebook ' +
        'Instant Games, to full fledged published branded games.' +
        '<br><br>' +
        'Our main goal is to bring your idea to life, but if you don\'t have an ' +
        'idea we can make one. The team is a handful of creative, skilled professionals ' +
        'with open minds and clever tactics</p>' +
        '<h1 style="text-align: center">-</h1>' +
        '<h4>Value</h4>' +
        '<p class="left-sidebar-paragraph">Our business brings value to yours. ' +
        'We grow your brand, and your customer base, at a rapid pace.' +
        '<br><br>' +
        'Our team has experience with not only game development & design, but also with ' +
        'marketing and retention. An interactive advertisement has major ' +
        'effects on users. People hate ads. We make people love them and they don\'t even know it.' +
        '</p>' +
        '<h1 style="text-align: center">-</h1>' +
        '<h4>How</h4>' +
        '<p class="left-sidebar-paragraph">People love games. Even we love games. ' +
        'We get addicted to our own games, but that\'s besides the point.'
      );
    break;
  }
}

function closeLeftSidebar() {
  // Swipe out
  var newMargin = window.innerWidth > 768 ? '-100%' : '-200%';
  $('#left-sidebar').css({'margin-left': newMargin, 'opacity': '0'});
  $('#left-sidebar .left-sidebar-background').css('transform', 'rotate(20deg)');
  // Remove darkness overlay
  $('.darkness-overlay').css({'opacity': '0', 'visibility': 'hidden'});
  // Show all HRs
  $('#main hr').each(function(i, ele) {
    $(this).css('opacity', '1.0');
  });
}
