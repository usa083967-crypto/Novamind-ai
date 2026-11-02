import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.post('/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY missing in Vercel settings.' });
    }
    const { message, model } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const selectedModel = model || 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: message,
    });
    res.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default app;
