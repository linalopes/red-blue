let animals = [
  "Ant", "Bat", "Cat", "Dog", "Elephant", "Frog", "Giraffe", "Horse", "Iguana", "Jaguar",
  "Kangaroo", "Lion", "Monkey", "Newt", "Octopus", "Penguin", "Quail", "Rabbit", "Snake", "Tiger"
];

let objects = [
  "Backpack", "Chair", "Desk", "Envelope", "Fork", "Glove", "Hammer", "Iron", "Jar", "Kettle",
  "Lamp", "Mirror", "Notebook", "Oven", "Pillow", "Quilt", "Ruler", "Spoon", "Toaster", "Umbrella"
];

let selectedAnimal = "";
let selectedObject = "";
let glitchLetters = [];
let canvas;
let typingText = "";
let displayText = "";
let charIndex = 0;
let typingSpeed = 15;
let lastTyped = 0;

let generatedImage;          // Holds the image object
let imageLoaded = false; // Used to check before drawing it

function setup() {
  canvas = createCanvas(800, 400);
  canvas.parent("canvas-container");

  textSize(64);
  textAlign(CENTER, CENTER);
  fill(255);

  populateDropdown("animalSelect", animals);
  populateDropdown("objectSelect", objects);
  noLoop();
}

function populateDropdown(id, list) {
  list.sort();
  let select = document.getElementById(id);
  list.forEach(item => {
    let option = document.createElement("option");
    option.value = item;
    option.text = item;
    select.appendChild(option);
  });
}

function createCreature() {
  selectedAnimal = document.getElementById("animalSelect").value;
  selectedObject = document.getElementById("objectSelect").value;

  generateLetters(selectedAnimal + selectedObject);
  fetchNameAndPrompt(selectedAnimal, selectedObject);

  charIndex = 0;
  displayText = "";
  lastTyped = millis();

  loop(); // enable draw loop
}

function generateLetters(combined) {
  glitchLetters = [];
  for (let i = 0; i < combined.length; i++) {
    let x = width / 2 + (i - combined.length / 2) * 36;
    let y = height / 2 - 50;
    glitchLetters.push({
      char: combined[i],
      baseX: x,
      baseY: y,
      offsetX: random(-5, 5),
      offsetY: random(-5, 5)
    });
  }
}

async function fetchNameAndPrompt(animal, object) {
  const promptText = `
Respond only in English.
Give a name for a Frankenstein-style cyborg that combines a ${animal.toLowerCase()} and a ${object.toLowerCase()}. Return only the name, no Name: or anything else.
Then, in a new line, write an image generation prompt to visualize this creature. Don't include extra commentary or explanation. Return only the prompt.
`.trim();

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama3',
      prompt: promptText,
      stream: false
    })
  });

  const data = await response.json();
  const raw = data.response.trim();

  // Expecting something like:
  // MechaToad
  // A half-metallic, glowing-eyed toad fused with kitchen blender blades, etc.

  const lines = raw.split("\n").filter(l => l.trim() !== "");

  const nameLine = lines[0] || "Unknown Creature";
  const promptLine = lines[1] || "(no image prompt)";

  // Start typing immediately with the name
  typingText = `${nameLine}\n${promptLine}`;


  const imageUrl = await generateImageFromPrompt(promptLine);
  console.log("🖼️ URL da imagem:", imageUrl);
  loadImage(imageUrl, img => {
    generatedImage = img;
    imageLoaded = true;
  });

}


function draw() {
  background(10);

  // Draw glitch letters
  for (let letter of glitchLetters) {
    letter.offsetX += random(-1, 1);
    letter.offsetY += random(-1, 1);
    letter.offsetX = constrain(letter.offsetX, -10, 10);
    letter.offsetY = constrain(letter.offsetY, -10, 10);
    text(letter.char, letter.baseX + letter.offsetX, letter.baseY + letter.offsetY);
  }

  // Draw typewriter text
  drawTypingText();

  if (imageLoaded && generatedImage) {
    imageMode(CENTER);
    image(generatedImage, width / 2, height - 260, 256, 256);
  }
}

function drawTypingText() {
  fill(200);
  textSize(16);
  textAlign(LEFT, TOP);
  let margin = 40;
  let maxWidth = width - margin * 2;
  let y = height - 120;

  if (millis() - lastTyped > 1000 / typingSpeed && charIndex < typingText.length) {
    displayText += typingText.charAt(charIndex);
    charIndex++;
    lastTyped = millis();
  }

  text(displayText, margin, y, maxWidth, 100);
}
