// api/search.js

import { GoogleGenAI } from '@google/genai';

// Inisialisasi GoogleGenAI.
const ai = new GoogleGenAI({});

// Model yang lebih disukai untuk pencarian teks yang kompleks dan akurat.
const MODEL = "gemini-2.5-pro"; 

export default async function handler(req, res) {
  // Hanya proses POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt, outputLanguage } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Missing required field: prompt.' });
    }

    // Prompt untuk Gemini, menggunakan Google Search Tool
    const systemInstruction = `You are an expert AI providing comprehensive global insights on geopolitics, macroeconomics, finance, and global conflicts. Answer the user's question accurately and thoroughly, citing current data using the provided tools. Structure your answer clearly using markdown headers and lists. The entire response MUST be in the language: ${outputLanguage}.`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
      tools: [{ googleSearch: {} }] // Aktifkan Google Search Tool untuk jawaban yang lebih terkini
    });
    
    const insightText = response.text;

    res.status(200).json({ 
      analysis: insightText, // Kirim output teks langsung
      message: 'Global insight search successful' 
    });

  } catch (error) {
    console.error('API Global Insight Search Error:', error);
    res.status(500).json({ 
      message: 'Failed to process global insight search request.',
      details: error.message 
    });
  }
}
