require("dotenv").config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;



app.get("/", (req, res) => {
  res.send("Let's Crack The Power of AI");
});

app.listen(port, () => {
  console.log(`Crack AI Server is running on port: ${port}`);
});