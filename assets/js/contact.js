var divs,
    i = 0;

$(document).ready(function() {
  divs = $('div[id^="rollingword-"]').hide();
  (function cycle() {

    divs.eq(i).fadeIn(100)
              .delay(500)
              .fadeOut(200, cycle)

    i = ++i % divs.length;
  })();
});
