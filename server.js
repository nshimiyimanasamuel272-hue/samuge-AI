
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Test backend
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "samuge-AI backend"
  });
});

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Andika ikibazo cyawe."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Ikibazo ni kirekire cyane."
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5.5",
      instructions: `
        You are Samuge-AI, a helpful and intelligent assistant.
        Answer clearly and accurately.
        Respond in the same language as the user.
        If the user writes in Kinyarwanda, respond in Kinyarwanda.
      `,
      input: message
    });

    res.json({
      status: "success",
      reply: response.output_text
    });

  } catch (error) {
    console.error("AI error:", error.message);

    res.status(500).json({
      error: "Samuge-AI ntiyabashije gusubiza. Ongera ugerageze."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Samuge-AI running at http://localhost:${PORT}`);
});
