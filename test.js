import OpenAI from "openai";
import dotenv from "dotenv";
import readlineSync from "readline-sync";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  console.log("AI Chatbot started!");
  console.log("Type 'exit' to stop.\n");

  let previousResponseId = null;

  while (true) {
    const userMessage = readlineSync.question("You: ");

    if (userMessage.toLowerCase() === "exit") {
      console.log("Chatbot: Goodbye!");
      break;
    }

    try {
      const request = {
        model: "gpt-5-mini",
        input: userMessage,
      };

      if (previousResponseId) {
        request.previous_response_id = previousResponseId;
      }

      const response = await client.responses.create(request);

      console.log(`Chatbot: ${response.output_text}\n`);

      previousResponseId = response.id;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

main();