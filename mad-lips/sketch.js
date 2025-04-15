let template = "The [adj] [noun1] will [verb] the [noun2] tonight.";

function setup() {
  noCanvas();

  const button = select("#generate-btn");
  button.mousePressed(startMadLibs);
}

function startMadLibs() {
  const theme = select("#theme-input").value();

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

        revealPoem(template, result);
      } catch (e) {
        const errorMsg = createP("⚠️ Couldn't parse LLM response. Try again.")
          .addClass("text-danger fst-italic")
          .parent("poem-container");
        console.error(e);
      }
    });
}

function revealPoem(template, words) {
  const parts = template.split(/(\[.*?\])/);
  let finalLine = "";
  let i = 0;

  const poemLine = createP("").parent("poem-container").addClass("poem-line");

  function step() {
    if (i >= parts.length) return;

    const part = parts[i];

    if (part.startsWith("[") && part.endsWith("]")) {
      const key = part.replace("[", "").replace("]", "");
      const word = words[key] || RiTa.randomWord({ pos: partOfSpeech(key) });
      const source = words[key] ? "llm" : "rita";

      finalLine += `<span class="token ${source}">${word}</span>`;
    } else {
      finalLine += part;
    }

    poemLine.html(finalLine);
    i++;
    if (i <= parts.length) setTimeout(step, 400);
  }

  step();
}

function partOfSpeech(key) {
  if (key.includes("noun")) return "n";
  if (key.includes("verb")) return "v";
  if (key.includes("adj")) return "a";
  return "n";
}
