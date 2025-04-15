# Mad Libs Poetry Generator (p5.js + RiTa.js + Ollama)
This project is a creative writing interface that combines rule-based linguistic play (via RiTa.js) with modern generative AI (via Ollama, running LLMs like LLaMA3) — inspired by the classic Mad Libs word game.

Users input a theme (like “space” or “dreams”), and the system generates a short poetic line by filling in structured blanks with themed words, blending symbolic NLP and neural LLM output.

---

## 🧠 Conceptual Overview

This sketch explores the convergence of **two NLP paradigms**:

### 1. **RiTa.js** – symbolic, rule-based NLP

- RiTa is a JavaScript library for **linguistic creativity**, inspired by the pre-deep-learning era of NLP.
- It operates with **Part-of-Speech (PoS) tagging**, word morphology, syllabification, rhymes, and tokenization at the word level.
- It does **not use embeddings** or machine learning — instead, it relies on **formal linguistic structures**, similar to the **pre-Word2Vec** statistical NLP era (e.g., bag-of-words, n-grams).

#### RiTa is great for:
- Structured poetic forms
- Grammatical manipulation
- Controlled, transparent language generation

### 2. **Ollama** – modern, local LLMs

- Ollama runs large language models (LLMs) **locally** on your machine.
- It supports models like `llama3`, `mistral`, `phi`, `gemma`, and others.
- These models use **tokenization** via subword units (e.g., BPE or WordPiece) and represent language with **dense vector embeddings** trained on massive corpora.
- They are capable of **contextual semantic understanding**, **text generation**, and **instruction following**.

---

## ✍️ How it Works

1. A **sentence template** is pre-defined with placeholders:
   `"The [adj] [noun1] will [verb] the [noun2] tonight."`

2. The user provides a **theme** (e.g., `"space"`).

3. A `POST` request is sent to the **Ollama API**, prompting the LLM to return:
   ```json
   {
     "adj": "cosmic",
     "noun1": "meteor",
     "verb": "ignite",
     "noun2": "horizon"
   }

4. The template is filled in, word by word, **with a visual** reveal in the browser.

5. If the LLM fails to return a word, **RiTa fills in the blank** using its PoS tools.

---

## 🧰 Technologies Used

- [p5.js](https://p5js.org/) – for rendering and UI logic
- [RiTa.js](https://rednoise.org/rita/) – rule-based NLP library
- [Ollama](https://ollama.com) – local LLM runner with API access
- [Bootstrap](https://getbootstrap.com/) – layout and style
- Native JavaScript (`fetch`) – to call the API

---

## ⚙️ Installation & Setup

### 1. Clone this repository

```bash
git clone https://github.com/linalopes/red-blue.git
cd red-blue/mad-lips
```

### 2. Install Ollama

Visit: [https://ollama.com](https://ollama.com)

Or use Homebrew on macOS:

```bash
brew install ollama
```

3. Run a model (e.g. llama3)

```bash
ollama run llama3
```

4. Start Ollama server (if not running)

```bash
ollama serve
```

### 🔗 The Ollama API
Once Ollama is running, it exposes a local API at:

```bash
http://localhost:11434
```

#### Endpoint: `/api/generate`
**Method**: `POST`
**Content-Type**: `application/json`

#### Request body:
The request sent to the Ollama API is a `POST` with a JSON payload containing:

- `"model"` – the name of the model you want to use (e.g. `"llama3"`)
- `"prompt"` – a structured instruction asking for specific words
- `"stream"` – set to `false` to receive the full result at once

### Example:

The following request asks the model to return one adjective, two nouns, and one verb related to a given theme:


```json
{
  "model": "llama3",
  "prompt": "Give me one adjective, two nouns, and one verb related to the theme \"space\". Respond in JSON like this: {\"adj\":\"...\", \"noun1\":\"...\", \"verb\":\"...\", \"noun2\":\"...\"}",
  "stream": false
}
```

### Expected response format:

The API will return a string that looks like this:
```json
{
  "response": "{\"adj\":\"cosmic\",\"noun1\":\"comet\",\"verb\":\"ignite\",\"noun2\":\"sky\"}"
}
```
You can then parse the `"response"` string into a usable JSON object in JavaScript.

---

## ✨ Example Output

If the user enters the theme `"space"`, the final poetic line generated might be:

```
The cosmic comet will ignite the sky tonight.
```

Each word appears one by one with color highlights — showing whether it came from the LLM or was filled by RiTa.

---

## 📚 Educational Value

This sketch introduces key NLP concepts in action:

- **Tokenization differences** (word-based in RiTa vs. subword in LLMs)
- **Grammatical structure vs. semantic creativity**
- **JSON APIs and POST requests** as a way to interface with local AI models
- **Visual mapping** between structure and content generation

Perfect for workshops or classrooms where **form meets computation**.

---

## 🧪 Try Customizing

- Change the sentence template
- Add different structures (e.g., haikus or rap verses)
- Add UI to switch between RiTa-only and LLM-only mode
- Use multiple themes or prompt chaining

---

## 📄 License

MIT License
This project is open-source and intended for educational and creative use.
