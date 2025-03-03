// Function for first canvas
function sketch1(p) {
  p.setup = function () {
    let cnv1 = p.createCanvas(300, 300);
    cnv1.parent("canvas1");
    p.background(0);
  };
  p.draw = function () {
    p.circle(p.mouseX, p.mouseY, 50);
  };
}

// Run first p5 instance
new p5(sketch1);

// Function for second canvas
function sketch2(p) {
  p.setup = function () {
    let cnv2 = p.createCanvas(400, 400);
    cnv2.parent("canvas2");
    p.background(255);
    p.fill(0);
    p.stroke(255);
  };
  p.draw = function () {
    p.square(p.mouseX, p.mouseY, 50);
  };
}

// Run second p5 instance
new p5(sketch2);