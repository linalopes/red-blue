const URL = "https://teachablemachine.withgoogle.com/models/5-D16kgAs/";
let model, webcam, ctx, labelContainer, maxPredictions;
let p5Canvas;
let predictedLabel = ""; // Store the current pose prediction

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load Teachable Machine Pose Model
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Webcam setup
    const size = 400;
    const flip = true; // Flip webcam
    webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Canvas for webcam
    const canvas = document.getElementById("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");

    // Label container
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    // Initialize p5.js after model starts
    p5Canvas = new p5(p5Sketch);
}

// Animation loop for pose estimation
async function loop(timestamp) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// Predict pose classification
async function predict() {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // Get the label with the highest probability
    let maxProb = 0;
    for (let pred of prediction) {
        if (pred.probability > maxProb) {
            maxProb = pred.probability;
            predictedLabel = pred.className; // Store the label
        }
    }

    drawPose(pose);
}

// Draw the pose keypoints and skeleton
function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

// ✅ p5.js sketch to overlay colors
const p5Sketch = (p) => {
    p.setup = function () {
        const colors = document.getElementById('colors');
        const canvas = p.createCanvas(400, 400);
        canvas.parent(colors);
        p.noStroke();
    };

    p.draw = function () {
        //p.clear(); // Clear previous frames

        if (predictedLabel === "Red") {
            p.fill(255, 0, 0, p.random(255)); // Red overlay
            p.rect(p.random(400), p.random(400), 50, 50);
        } else if (predictedLabel === "Blue") {
            p.fill(0, 0, 255, p.random(255)); // Blue overlay
            p.rect(p.random(400), p.random(400), 50, 50);
        }

        // Display label text
        p.fill(255);
        p.textSize(24);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(predictedLabel, p.width / 2, p.height - 20);
    };
};
