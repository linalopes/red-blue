let currentAnimation = 1; // Variable to control the current animation

function sketch(p) {
    p.setup = function () {
        let cnv2 = p.createCanvas(400, 400);
        cnv2.parent("canvas2");
        p.background(255);
        p.noStroke();
    };

    p.draw = function () {
        // p.background(255);

        if (currentAnimation === 1) {
            animation1(p); // Animation 1: Circles growing from the center
        } else if (currentAnimation === 2) {
            animation2(p); // Animation 2: Another animation
        } else if (currentAnimation === 3) {
            animation3(p); // Animation 3: Rectangles in black and white
        }
    };

    p.keyPressed = function () {
        if (p.key === '1') {
            currentAnimation = 1; // Switch to animation 1
        } else if (p.key === '2') {
            currentAnimation = 2; // Switch to animation 2
        } else if (p.key === '3') {
            currentAnimation = 3; // Switch to animation 3
        }
    };
}

// Animation 1: Circles growing from the center
function animation1(p) {
    let circleSize = p.frameCount % 200; // Circle size increases over time
    if (predictedLabel === "Red") {
        p.fill(255, 0, 0, 100); // Red with transparency
    } else if (predictedLabel === "Blue") {
        p.fill(0, 0, 255, 100); // Blue with transparency
    }
    p.ellipse(p.width / 2, p.height / 2, circleSize, circleSize); // Draw the circle in the center
}

// Animation 2: Another animation (example: lines that move)
function animation2(p) {
    if (predictedLabel === "Red") {
        p.stroke(255, 0, 0); // Lines in red
    } else if (predictedLabel === "Blue") {
        p.stroke(0, 0, 255); // Lines in blue
    }
    p.line(p.frameCount % p.width, 0, p.frameCount % p.width, p.height); // Line that moves horizontally
}

// Animation 3: Rectangles in red and blue
function animation3(p) {
    if (predictedLabel === "Red") {
        p.fill(255, 0, 0, p.random(255)); // Red overlay
        p.rect(p.random(400), p.random(400), 50, 50);
    } else if (predictedLabel === "Blue") {
        p.fill(0, 0, 255, p.random(255)); // Blue overlay
        p.rect(p.random(400), p.random(400), 50, 50);
    }
}

// Run second p5 instance
new p5(sketch);