let handPose;
let video;
let hands = [];

// List of words to display
let words = ["metadesign", "data", "information", "knowledge"];
let currentWord = "";

function preload() {
    // Load the handpose model
    handPose = ml5.handPose({ flipHorizontal: true });
}

function setup() {
    createCanvas(640, 480);

    // Create a video capture from the webcam and hide it
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    // Start the detection of hands from  the webcam
    handPose.detectStart(video, gotHands);
}

// Callback function when hands are detected
function gotHands(results) {
    // Save the results in the hands array
    hands = results;
}

function draw() {
    // Mirror the video horizontally
    push(); // Save the current state of the drawing
    translate(width, 0); // Move the origin to the right edge of the canvas
    scale(-1, 1); // Invert the x-axis
    image(video, 0, 0, width, height); // Draw the video
    pop(); // Restore the previous state of the drawing

    let leftDetected = false;
  let rightDetected = false;

    // Draw all the tracked hand points
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        let handedness = hand.handedness; // "Left" or "Right"

        if (handedness === "Left") {
            leftDetected = true;
        }

        if (handedness === "Right") {
            rightDetected = true;
        }
    }
    // If left hand is detected and no word is currently shown, pick a word
    if (leftDetected && currentWord === "") {
        currentWord = random(words);
        speakWord(currentWord); // Say the word using speech synthesis
    }

    // If right hand is detected, clear the word
    if (rightDetected) {
        currentWord = "";
    }

    // Draw the word in the center of the canvas
    if (currentWord !== "") {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(60);
        text(currentWord, width / 2, height / 2);
    }
}

function speakWord(word) {
    let utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US"; // You can change to "pt-BR" if needed
    speechSynthesis.speak(utterance);
}