const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Replicate = require("replicate");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Waits until the prediction finishes
async function waitForPrediction(prediction) {
  let status = prediction.status;
  while (status !== "succeeded" && status !== "failed" && status !== "canceled") {
    console.log("⏳ Waiting for prediction...", status);
    await new Promise(resolve => setTimeout(resolve, 1500)); // wait 1.5 seconds
    prediction = await replicate.predictions.get(prediction.id);
    status = prediction.status;
  }
  return prediction;
}

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log("➡️ Prompt received:", prompt);

    const prediction = await replicate.predictions.create({
      version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // SD 1.5
      input: {
        prompt: `${prompt}, concept art, hd, dramatic lighting`,
        scheduler: "K_EULER"
      }
    });

    const finalResult = await waitForPrediction(prediction);
    console.log("✅ Prediction complete:", finalResult.status);

    if (!finalResult.output || !Array.isArray(finalResult.output)) {
      throw new Error("Invalid output received from Replicate");
    }

    res.json({ output: finalResult.output });
  } catch (err) {
    console.error("❌ Error generating image:", err);
    res.status(500).json({ error: "Error generating image", details: err.message });
  }
});

app.listen(3000, () => {
  console.log("🟢 Replicate proxy running on http://localhost:3000");
});
