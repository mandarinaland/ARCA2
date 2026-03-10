// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.use(express.json());

// Limita les sol·licituds per seguretat i suavitat del flux
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minut
  max: 10, // màxim 10 requests per IP/min
});
app.use(limiter);

// Endpoint que gestiona el xat amb ARCA
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: "Missatge buit" });

    // Crida a l'API de ChatGPT
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: "Ets ARCA, la veu poètica i espiritual de Piath. Inspira sense imposar."
          },
          { role: "user", content: message }
        ],
        temperature: 0.7, // per to poètic i elevador
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "ARCA medita en silenci...";
    res.json({ reply });

  } catch (error) {
    console.error("Error al servidor ARCA:", error);
    res.status(500).json({ error: "Error intern del servidor" });
  }
});

app.listen(3000, () => console.log("Servidor ARCA actiu a http://localhost:3000"));
