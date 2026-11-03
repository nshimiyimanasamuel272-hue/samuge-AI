require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.MODEL || "claude-sonnet-5-5";

const SYSTEM_PROMPT =
  "Uri SamugeAI, umufasha wa AI w'Umunyarwanda. " +
  "Subiza mu Kinyarwanda keretse umukoresha yanditse mu Cyongereza, icyo gihe subiza mu Cyongereza. " +
  "Koresha Ikinyarwanda cyoroshye kandi cyumvikana. Subiza mu magambo make kandi neza. " +
  "Ufasha mu kwiga, kwandika, gusobanura, guhanga udushya n'ibibazo bya buri munsi. " +
  "Niba utazi igisubizo, vuga ko utakizi aho kugihimba.";

// Health check (Render uses this to see the service is alive)
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "samuge-AI backend" });
});
app.get("/health", (req, res) => res.json({ status: "ok" }));

async function handleChat(req, res) {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "ANTHROPIC_API_KEY ntiragaragara muri Render (Environment).",
      });
    }

    const body = req.body || {};
    // Accept several common field names so the frontend works either way
    const message = body.message || body.prompt || body.text || body.question || body.input;
    const history = body.history || body.messages;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Andika ubutumwa mbere yo kohereza." });
    }

    const past = Array.isArray(history)
      ? history
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string" &&
              m.content.trim()
          )
          .slice(-20)
      : [];

    // The API requires the first message to be from the user
    while (past.length && past[0].role !== "user") past.shift();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [...past, { role: "user", content: message.trim() }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("AI API error:", JSON.stringify(data));
      return res.status(502).json({ error: "Habaye ikibazo kuri serivisi ya AI. Ongera ugerageze." });
    }

    const reply = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    // Return the answer under several common names for frontend compatibility
    res.json({ reply, response: reply, answer: reply, message: reply, text: reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Habaye ikibazo muri server. Ongera ugerageze." });
  }
}

app.post("/chat", handleChat);
app.post("/api/chat", handleChat);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`samuge-AI backend listening on port ${PORT}`);
});
