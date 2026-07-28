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
      const { message, previousResponseId } = req.body;
  
      if (!message || typeof message !== "string") {
        return res.status(400).json({
          error: "Please enter a valid message.",
        });
      }
  
      const request = {
        model: "gpt-5-mini",
        input: message,
      };
  
      if (previousResponseId) {
        request.previous_response_id = previousResponseId;
      }
  
      const response = await client.responses.create(request);
  
      res.json({
        reply: response.output_text,
        responseId: response.id,
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