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
  
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
  
      const request = {
        model: "gpt-5-mini",
        input: message,
        stream: true,
      };
  
      if (previousResponseId) {
        request.previous_response_id = previousResponseId;
      }
  
      const stream = await client.responses.create(request);
  
      let responseId = null;
  
      for await (const event of stream) {
        if (event.type === "response.created") {
          responseId = event.response.id;
        }
  
        if (event.type === "response.output_text.delta") {
          res.write(event.delta);
        }
      }
  
      res.setHeader("X-Response-Id", responseId || "");
      res.end();
    } catch (error) {
      console.error(error);
  
      if (!res.headersSent) {
        res.status(500).json({
          error: "Something went wrong.",
        });
      } else {
        res.end();
      }
    }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});