let template = "The [adj] [noun1] will [verb] the [noun2] tonight.";
let words = {
  adj: null,
  noun1: null,
  verb: null,
  noun2: null,
};
let finalLine = "";
let currentStep = 0;
let themeInput, button, outputP;

function setup() {
  noCanvas();

  createSpan("Theme: ").parent("interface");
  themeInput = createInput("space").parent("interface");

  createElement("br").parent("interface");

  button = createButton("Generate Poem").parent("interface");
  button.mousePressed(startMadLibs);

  outputP = createP("").parent("interface").style("font-size", "1.3em").style("margin-top", "2em");
}

function startMadLibs() {
  currentStep = 0;
  outputP.html(""); // clear

  words = { adj: null, noun1: null, verb: null, noun2: null };

  const theme = themeInput.value();

  const prompt = `Give me one adjective, two nouns, and one verb related to the theme "${theme}". Respond in JSON like this: {"adj":"...", "noun1":"...", "verb":"...", "noun2":"..."}`;

  fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt: prompt,
      stream: false,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      try {
        const jsonStart = data.response.indexOf("{");
        const jsonStr = data.response.substring(jsonStart).trim();
        const result = JSON.parse(jsonStr);

        words = result;

        revealWordByWord();
      } catch (e) {
        outputP.html("⚠️ Couldn't parse LLM response. Try again.");
        console.error(e);
      }
    });
}

function revealWordByWord() {
  const parts = template.split(/(\[.*?\])/); // split into text and tokens

  finalLine = ""; // reset
  let i = 0;

  function step() {
    if (i >= parts.length) return;

    const part = parts[i];

    if (part.startsWith("[") && part.endsWith("]")) {
      const key = part.replace("[", "").replace("]", "");

      const source = "llm";
      const word = words[key] || RiTa.randomWord({ pos: partOfSpeech(key) });

      finalLine += `<span class="token ${source}">${word}</span>`;
    } else {
      finalLine += part;
    }

    outputP.html(finalLine);
    i++;
    if (i <= parts.length) setTimeout(step, 500);
  }

  step();
}

function partOfSpeech(key) {
  if (key.includes("noun")) return "n";
  if (key.includes("verb")) return "v";
  if (key.includes("adj")) return "a";
  return "n";
}
