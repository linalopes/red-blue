let handPose;
let video;
let hands = [];

let words = ["metadesign", "data", "information", "knowledge", "another word"];
let currentWord = "";
let currentQuestion = "";
let isGenerating = false; // Avoid duplicate calls

let lastLeftTriggerTime = 0; // Timestamp in millis()
const cooldownTime = 2000;  // 10 seconds in milliseconds

// Replace with your OpenAI API Key
const OPENAI_API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Load the handpose model
function preload() {
  handPose = ml5.handPose({ flipHorizontal: true });
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);
}

function gotHands(results) {
  hands = results;
}

function draw() {
  background(0);

  // Mirror the video horizontally
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  let leftDetected = false;
  let rightDetected = false;

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let handedness = hand.handedness;

    if (handedness === "Left") {
      leftDetected = true;
    }

    if (handedness === "Right") {
      rightDetected = true;
    }
  }

  // Word appears if left hand is detected and cooldown has passed
  let now = millis();
  if (leftDetected && now - lastLeftTriggerTime > cooldownTime) {
    currentWord = random(words);
    currentQuestion = ""; // reset last question
    speakWord(currentWord);
    lastLeftTriggerTime = now;
  }

  // Generate a question using OpenAI when the right hand appears
  if (rightDetected && currentWord !== "" && currentQuestion === "" && !isGenerating) {
    isGenerating = true;
    generateQuestion(currentWord);
  }

  // Show current word and question on screen
  if (currentWord !== "") {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text(currentWord, width / 2, height / 2 - 100);
  }

  if (currentQuestion !== "") {
    fill(34, 17, 62); // #22113E in RGB
    noStroke();
    rectMode(CENTER);
    let textWidth = width; // 80% of screen width
    let textHeight = 80;
    rect(width/2, height/2 + 200, textWidth, textHeight); // rounded rectangle with 10px radius
    fill(234, 125, 255); // #EA7DFF in RGB
    textAlign(CENTER, CENTER);
    textSize(14);
    text(currentQuestion, width / 2, height / 2 + 200);
  }
}

// Text-to-speech with browser
function speakWord(word) {
  let utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// Call OpenAI API to generate a provocative question
async function generateQuestion(word) {
  const prompt = `Create a short and provocative philosophical question inspired by the word "${word}".`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
      temperature: 0.9
    })
  });

  const data = await response.json();
  const question = data.choices[0].message.content.trim();
  currentQuestion = question;
  isGenerating = false;

  playQuestionWithOpenAITTS(question);
}

// Call OpenAI's TTS API to read the question aloud
function playQuestionWithOpenAITTS(text) {
  fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text,
      voice: "nova"
    })
  })
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    });
}
