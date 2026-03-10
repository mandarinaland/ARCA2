import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Rate limiting per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});
app.use(limiter);

// Servir fitxers estàtics (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Endpoint de xat ARCA
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Missatge buit" });

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
            content: "Ets ARCA, la veu poètica i espiritual de Piath. Inspira sense imposar, guia amb ponts de llum."
          },
          { role: "user", content: message }
        ],
        temperature: 0.7,
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
