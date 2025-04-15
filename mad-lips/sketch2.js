let template = "The [adj] [noun1] will [verb] the [noun2] tonight.";
let filled = "";
let themeInput, button;

function setup() {
  noCanvas();

  // Create input for theme
  createSpan('Enter a theme (e.g. "space", "ocean", "dreams"): ').parent("interface");
  themeInput = createInput().parent("interface");

  // Create button
  button = createButton("Generate Poem").parent("interface");
  button.mousePressed(generatePoem);

  // Display area
  createP('').id('poem').style("font-size", "1.3em").parent("interface");
}

function generatePoem() {
  let theme = themeInput.value();
  const prompt = `Give me one adjective, two nouns, and one verb related to the theme: "${theme}". Respond in JSON like this: {"adj":"...", "noun1":"...", "verb":"...", "noun2":"..."}`;

  fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3", // ou "mistral", "phi", etc
      prompt: prompt,
      stream: false
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      try {
        const jsonStart = data.response.indexOf('{');
        const jsonStr = data.response.substring(jsonStart).trim();
        const obj = JSON.parse(jsonStr);

        // Preencher o template
        filled = template
          .replace("[adj]", obj.adj)
          .replace("[noun1]", obj.noun1)
          .replace("[verb]", obj.verb)
          .replace("[noun2]", obj.noun2);

        select("#poem").html("🌟 " + filled);
      } catch (err) {
        select("#poem").html("⚠️ Could not parse response: " + data.response);
        console.error(err);
      }
    });
}
