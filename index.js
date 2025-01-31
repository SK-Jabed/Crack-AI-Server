require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/test-ai", async (req, res) => {
    const prompt = req.query?.prompt;

    if (!prompt) {
        res.send({message: "Please Provide a Prompt in Query"});
    }

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    res.send({ answer: result.response.text() });
})

app.get("/", (req, res) => {
  res.send("Let's Crack The Power of AI");
});

app.listen(port, () => {
  console.log(`Crack AI Server is running on port: ${port}`);
});