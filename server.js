import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Please enter a message.",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: userMessage,
    });

    res.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});