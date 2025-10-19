import { GoogleGenAI } from "@google/genai";

// Kunci ini hanya akan tersedia di lingkungan Vercel, bukan di browser
const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
    // 1. Pemeriksaan API Key (PENTING!)
    if (!apiKey) {
        // Jika kunci API TIDAK ADA, langsung kirim error 500 dengan pesan yang jelas
        return res.status(500).json({ 
            message: 'Internal Server Error: GEMINI_API_KEY tidak ditemukan. Harap atur di Environment Variables Vercel.',
            details: 'Authentication failed.'
        });
    }
    
    // Inisialisasi hanya jika API Key tersedia
    const ai = new GoogleGenAI(apiKey);

    // 2. Pemeriksaan Metode dan Query
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ message: 'Missing query parameter in request body.' });
    }
    
    const prompt = `Anda adalah Analis Pasar Emas (XAU/USD). Berikan ringkasan dan analisis singkat (maksimal 300 kata) berdasarkan berita terbaru dan terpercaya terkait kata kunci "${query}". 
    Fokuskan hasilnya pada implikasi terhadap pergerakan harga XAU/USD (Bullish, Bearish, atau Ranging). 
    Sertakan poin-poin utama dalam format yang mudah dibaca. Jawablah dalam Bahasa Indonesia.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        res.status(200).json({ 
            result: response.text 
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        
        let errorMessage = "Internal Server Error saat memproses AI.";
        if (error.message.includes('API key is not valid')) {
             errorMessage = "API Key Gemini tidak valid.";
        } else if (error.message.includes('quota')) {
             errorMessage = "Kuota API Gemini habis.";
        }

        res.status(500).json({ 
            message: errorMessage,
            details: error.message 
        });
    }
}
