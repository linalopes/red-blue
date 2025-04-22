# Creature Fusion Lab

**Creature Fusion Lab** is a creative experiment that fuses web-based generative art, AI, and storytelling into a playful prompt-to-image pipeline. It lets you combine an animal and a household object to generate surreal Frankenstein-style cyborg creatures — complete with names, poetic descriptions, and AI-generated illustrations.

---

## Features

- **p5.js** frontend for playful interaction and kinetic text animation
- **Ollama** running a local LLM to generate:
  - A name for the creature
  - A creative image prompt
- **Replicate API** (via a local Node.js proxy) to generate images using:
  - Stable Diffusion 1.5 (or any other available model)
- **Node.js proxy server** with `.env`-protected API keys
- **Kinetic glitch animation** for creature names while the AI "thinks"
- Designed for creative learning, artistic AI exploration, or workshop prototypes

---

## How it works

1. The user selects two concepts (an animal + an object) from dropdowns.
2. A local LLM running with **Ollama** generates:
   - A fictional creature name
   - A detailed prompt for image generation
3. The prompt is sent to the **Replicate API** through a local Node.js proxy.
4. The image is generated using **Stable Diffusion**, and returned to the browser.
5. The result is displayed using **p5.js** with animated text and image.

---

## Requirements

- Node.js (v18+ recommended)
- Ollama (running locally with a model like `llama3`)
- A [Replicate account](https://replicate.com) with API access
- p5.js loaded in your frontend

---

## Setup

1. Clone the repository:

```bash
git clone https://github.com/linalopes/red-blue.git
cd red-blue/hybrid-monsters
```

2. Install dependencies:

```bash
npm install express cors dotenv replicate
```

3. Create a .env file:

```
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

4. Make sure .env is included in your .gitignore to avoid leaking secrets.

5. Start the Node.js proxy server:

```bash
node replicate-proxy.js
```

6. In other terminal window, serve the frontend (e.g. using http-server):

```bash
http-server
```

7. Visit http://localhost:8080/hybrid-monsters

## About the Replicate Proxy

The Replicate API **cannot be called directly from the browser** due to CORS and security restrictions.
We use a local **Express server** (`replicate-proxy.js`) to forward prompts securely to the Replicate API and return the image URL.

The proxy uses the official [replicate NPM package](https://github.com/replicate/replicate-javascript) and handles asynchronous image generation using `predictions.create()` and polling with `predictions.get()` until completion.

---

## Notes & Limitations

- There is a **delay** between prompt generation and image rendering due to:
  - Local LLM (Ollama)
  - External API image generation (Replicate)
- Currently, the previous image may persist while the new one is loading.
- Image prompts may be too long or poetic for some models — editing prompt format is encouraged.
- This is **an experimental playground**, not a production tool.

---

## Future Ideas

- Add animated letter transitions while waiting for the creature to be born
- Display loading states with visual cues or audio
- Support additional LLMs (OpenAI, Claude, etc.)
- Swap image model (e.g., SDXL, OpenJourney, AnythingV5)
- Generate multiple creatures and display them in a grid or storybook
- Save creature cards locally or as a zine-style PDF

---

## Why this project matters

This is a base for exploring **creative AI pipelines**:
- Natural language prompt crafting
- Local AI + external services
- Visual feedback and kinetic interaction
- p5.js as a live canvas for speculative imagination

It can be forked and adapted for:
- Workshops
- Educational AI demos
- Creative writing tools
- Experimental games
