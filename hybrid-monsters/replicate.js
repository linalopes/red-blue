async function generateImageFromPrompt(prompt) {
  const response = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const result = await response.json();
  console.log("🔁 Resposta do proxy:", result);

  // Defensive: make sure it's a string URL
  const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;

  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("❌ Image generation failed: invalid output");
  }

  return imageUrl;
}
