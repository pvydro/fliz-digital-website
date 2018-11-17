let allItems = [];
let currentItem = undefined;
let currentItemIndex = 0;
let previousItem = undefined;
let nextItem = undefined;

$(document).ready(function() {

  $(".fliz-carousel .fliz-carousel-item").each(function(index) {
    // console.log( index + ": " + $( this ).text() );
    allItems.push($(this));
  });


  // Initial setup
  currentItemIndex = 0;
  arrangeItems();

});

function arrangeItems() {
  if (nextItem !== undefined) nextItem.removeClass('fliz-next-carousel-item');
  if (previousItem !== undefined) previousItem.removeClass('fliz-previous-carousel-item');
  if (currentItem !== undefined) currentItem.removeClass('fliz-current-carousel-item');

  currentItem = allItems[currentItemIndex];
  previousItem = allItems[currentItemIndex - 1];
  nextItem = allItems[currentItemIndex + 1];

  // Active
  // Remove listeners
  currentItem.off();
  currentItem.addClass('fliz-current-carousel-item');

  // Position previous item if existent
  if (previousItem !== undefined) {
    previousItem.off();
    previousItem.addClass('fliz-previous-carousel-item');

    // Click
    previousItem.click(function() {
      cyclePreviousItem();
    });
  }
  // Next item if existent
  if (nextItem !== undefined) {
    nextItem.off();
    nextItem.addClass('fliz-next-carousel-item');

    // Click
    nextItem.on("click", function() {
      cycleNextItem();
    });
  }
}

function cycleNextItem() {
  if (nextItem === undefined) return;
  currentItemIndex++;
  arrangeItems();
}

function cyclePreviousItem() {
  if (previousItem === undefined) return;
  currentItemIndex--;
  arrangeItems();
}
