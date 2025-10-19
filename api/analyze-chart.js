// api/analyze-chart.js

import { GoogleGenAI } from '@google/genai';

// Inisialisasi GoogleGenAI.
// Kunci API akan otomatis diambil dari environment variable GEMINI_API_KEY di Vercel.
const ai = new GoogleGenAI({});

// Model yang direkomendasikan untuk analisis gambar dan teks.
const MODEL = "gemini-2.5-flash"; 
// Batas ukuran gambar sekitar 5MB (sekitar 5 * 1024 * 1024 byte)

/**
 * Helper untuk mengkonversi Base64 menjadi part object yang diperlukan Gemini.
 * @param {string} base64Data - String base64 data gambar (tanpa header 'data:image/...')
 * @param {string} mimeType - Tipe MIME file (misalnya 'image/png')
 * @returns {object} Objek Part Gemini
 */
function fileToGenerativePart(base64Data, mimeType) {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
}

export default async function handler(req, res) {
  // Hanya proses POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { image, assetType, timeframe, additionalNotes, outputLanguage } = req.body;

    if (!image || !assetType || !timeframe) {
      return res.status(400).json({ message: 'Missing required fields (image, assetType, or timeframe).' });
    }

    // Tentukan mimeType (asumsi dari frontend hanya mengirim JPEG/PNG)
    // Untuk penyederhanaan, kita asumsikan PNG. Anda bisa deteksi lebih lanjut jika perlu.
    const mimeType = 'image/png'; 
    
    const imagePart = fileToGenerativePart(image, mimeType);
    
    // Prompt untuk Gemini, diformat untuk menghasilkan JSON output yang konsisten.
    const systemInstruction = `You are a highly skilled financial market analysis AI. Analyze the provided ${assetType} chart on the ${timeframe} timeframe based on the image and context. Your response must be in the language: ${outputLanguage}. Output the result strictly in JSON format with the following keys: "direction" (e.g., "Bullish", "Bearish", "Consolidation"), "rationale" (detailed explanation), "support" (estimated support level/area), "resistance" (estimated resistance level/area), and "riskWarning" (a brief disclaimer on trading risks).`;

    const userPrompt = `Analyze this chart:
    - Asset Type: ${assetType}
    - Timeframe: ${timeframe}
    - Additional Notes: ${additionalNotes || 'None'}
    - Based on the visual evidence, what is the most likely market direction?`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [imagePart, { text: userPrompt }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json", // Minta output dalam format JSON
      }
    });

    // Pastikan response.text adalah string JSON yang valid
    let jsonText = response.text.trim();
    
    // Hapus karakter markdown (```json ... ```) yang mungkin ditambahkan oleh model
    if (jsonText.startsWith('```json') && jsonText.endsWith('```')) {
      jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    }
    
    const analysisResult = JSON.parse(jsonText);

    res.status(200).json({ 
      analysis: analysisResult,
      message: 'Chart analysis successful' 
    });

  } catch (error) {
    console.error('API Chart Analysis Error:', error);
    res.status(500).json({ 
      message: 'Failed to process chart analysis request.',
      details: error.message 
    });
  }
}
