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
    const canvas = document.getElementById("canvas1");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");

    // Label container
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
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