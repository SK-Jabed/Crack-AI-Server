require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 6000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a robot and your name is crackaipie. You are powerful and you can help or assist people for make any decision.",
});

app.get("/test-ai", async (req, res) => {
  const prompt = req.query?.prompt;

  if (!prompt) {
    res.send({ message: "Please provide a prompt in query" });
    return;
  }

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  res.send({ answer: result.response.text() });
});

app.get("/rumor-detector", async (req, res) => {
  const prompt = req.query?.prompt;

  if (!prompt) {
    res.send({ message: "Please provide a prompt in query" });
    return;
  }

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: "When I give you any text, you have to tell me the rumor percentage of the text",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Okay. Tell me" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "Bangladesh is secretly building a floating city in the Bay of Bengal powered entirely by solar energy and AI-driven technology!",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Rumor percentage 99%" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "Human can't fly",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Rumor percentage 100%" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "Human drink water",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Rumor percentage 100%" }],
      },
    ],
  });

  let result = await chat.sendMessage(prompt);
  const answer = result.response.text();
  res.send({ rumorStatus: answer });
});

app.get("/generate-json", async (req, res) => {
  const prompt = req.query?.prompt;

  if (!prompt) {
    res.send({ message: "Please provide a prompt in query" });
    return;
  }

  const finalPrompt = `Generate some data from this prompt ${prompt} using this JSON schema:
  data = {'datatype': output}
  Return: Array<Recipe>`;

  const result = await model.generateContent(finalPrompt);
  const output = result.response.text().slice(7, -4);
  const jsonData = JSON.parse(output);
  res.send(jsonData);
});

app.get("/generate-detail", async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    res.send({ message: "Please provide a prompt in query" });
    return;
  }

  const response = await axios.get(prompt, { responseType: "arraybuffer" });

  const responseData = {
    inlineData: {
      data: Buffer.from(response.data).toString("base64"),
      mimeType: "image/png",
    },
  };

  const result = await model.generateContent([
    "Tell the detail of the image",
    responseData,
  ]);

  console.log(result.response.text());

  res.send({ detail: result.response.text() });
});

app.get("/", (req, res) => {
  res.send("Let's Crack The Power of AI...");
});

app.listen(port, () => {
  console.log(`Crack AI Server is running on port: ${port}`);
});