
var landingClosed = false;
var newLoc = "index.html";

$(document).ready(function() {
  $('.overlay').css('opacity', '0');
  setTimeout(removeOverlay, 250);
});

function removeOverlay() {
  $('.overlay').css('visibility', 'hidden');
}

function closePage(newLocation) {
  if (landingClosed) {
    return;
  }

  newLoc = newLocation;
  landingClosed = true;

  // Set position
  $('.overlay').css({'opacity': '1.0', 'visibility': 'visible', 'z-index': '999'});
  $('#loader .cssload-loader').css('opacity', '1.0');

  setTimeout(hideLoading, 500);

  setTimeout(enterLocation, 1000);
}

function hideOverlay() {
  console.log('unloaded')
  $('.overlay').css({'opacity': '0.0', 'visibility': 'hidden', 'z-index': '-999'});
  $('#loader .cssload-loader').css('opacity', '0.0');
}

function hideLoading() {
  $('.cssload-loader').css('opacity', '0');
}

function enterLocation() {
  window.location.href = newLoc;
}
