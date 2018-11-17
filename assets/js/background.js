var canvas;
var ctx;

var rects = new Array();
var totalRects = 15;
var scrollHorizontalStrength = .4;


/* Load */
$(document).ready(function() {
  // Get canvas
  canvas = document.getElementById("background-canvas");;
  ctx = canvas.getContext("2d");
  // Set canvas size
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Create rectangles
  for (var i = 0; i < totalRects; i++) {
    createNewRect();
  }

  // Do update
  setInterval(loop, 1000/60);
});

/* Loop */
function loop() {
  /* Assign canvas size */
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  /* Updates */
  updateSquares();

  /* Draws */
  drawSquares();
}

/* Updates all squares */
function updateSquares() {
  for (var i = 0; i < rects.length; i++) {
    rects[i].update();
  }
}

/* Draws all squares */
function drawSquares() {
  for (var i = 0; i < rects.length; i++) {
    rects[i].draw();
  }
}

function createNewRect() {
  var rect = {
    size: Math.floor(Math.random() * 200),
    speed: (Math.floor(Math.random() * 5) + 3) * 2.5,
    x: Math.floor(Math.random() * canvas.width) - (document.documentElement.scrollTop * scrollHorizontalStrength),
    y: canvas.height + Math.floor(Math.random() * 100),

    draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000e14";
      ctx.rect(this.x + (document.documentElement.scrollTop * scrollHorizontalStrength), this.y, this.size, this.size);
      ctx.fill();
    },

    update() {
      this.y -= this.speed;

      if (this.y < 0 - this.size) {
        createNewRect();
        rects.splice(rects.indexOf(this), 1);
      }
    }
  }

  rects.push(rect);
}
