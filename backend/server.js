import 'dotenv/config';
import express from "express";
import OpenAI from "openai";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = "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";

const groq = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Multer for image uploads
const upload = multer({ storage: multer.memoryStorage() });

// Text comparison endpoint
app.post("/api/compare/text", async (req, res) => {
  const { text1, text2 } = req.body;
  if (!text1 || !text2) return res.status(400).json({ error: "Both texts required" });

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "Compare Text1 and Text2 and determine which is better." },
        { role: "user", content: `Text1: ${text1}\nText2: ${text2}` }
      ]
    });
    const aiText = response.choices[0].message.content;
    const winner = aiText.includes("Text1") ? "Text 1" : aiText.includes("Text2") ? "Text 2" : null;
    res.json({ winner, reason: aiText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Image comparison endpoint
app.post("/api/compare/image", upload.array("images", 2), async (req, res) => {
  const [img1, img2] = req.files;
  if (!img1 || !img2) return res.status(400).json({ error: "Both images required" });

  // Convert images to base64
  const img1Base64 = img1.buffer.toString("base64");
  const img2Base64 = img2.buffer.toString("base64");

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "Compare two images and decide which is visually better." },
        { role: "user", content: `Image1(Base64): ${img1Base64}\nImage2(Base64): ${img2Base64}` }
      ]
    });

    const aiText = response.choices[0].message.content;
    const winner = aiText.includes("Image1") ? "Image 1" : aiText.includes("Image2") ? "Image 2" : null;
    res.json({ winner, reason: aiText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Groq AI backend running on port 5000"));
