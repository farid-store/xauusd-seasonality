// api/search-news.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// 🚨 PERINGATAN: GANTI PLACEHOLDER INI DENGAN KUNCI GEMINI API ANDA YANG SEBENARNYA!
// Menyimpan kunci secara langsung di file SANGAT TIDAK AMAN.
const apiKey = "YOUR_ACTUAL_GEMINI_API_KEY_HERE"; 

export default async function handler(req, res) {
    // 1. Pemeriksaan Metode dan API Key
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    // Pengecekan Kunci Inline
    if (!apiKey || apiKey === "YOUR_ACTUAL_GEMINI_API_KEY_HERE") {
        // Pesan error diubah untuk mencerminkan masalah kunci hardcoded
        return res.status(500).json({ 
            message: 'Internal Server Error: API Key Gemini tidak ditemukan atau tidak valid. Harap ganti placeholder "YOUR_ACTUAL_GEMINI_API_KEY_HERE" di file api/search-news.js.',
            details: 'Authentication failed due to missing or placeholder API Key.'
        });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Pemeriksaan Query
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ message: 'Missing query parameter in request body.' });
    }
    
    // 3. Prompt untuk Analisis Berita Emas
    const prompt = `Anda adalah Analis Pasar Emas (XAU/USD). Berikan ringkasan dan analisis singkat (maksimal 300 kata) berdasarkan berita terbaru terkait kata kunci "${query}". 
    Fokuskan hasilnya pada implikasi terhadap pergerakan harga XAU/USD (Bullish, Bearish, atau Ranging). 
    Sertakan poin-poin utama dan prediksi ringkas. Jawablah dalam Bahasa Indonesia.`;

    try {
        // Mengaktifkan Google Search untuk Grounding (Mendapatkan Berita Terbaru)
        const response = await model.generateContent({
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }], // PENTING: Mengaktifkan Google Search
            }
        });

        res.status(200).json({ 
            result: response.text 
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        
        // Logika error handling disederhanakan
        let errorMessage = "Internal Server Error saat memproses AI.";
        if (error.message.includes('API key is not valid')) {
             errorMessage = "API Key Gemini tidak valid. Cek nilai variabel 'apiKey' di file.";
        } else if (error.message.includes('quota')) {
             errorMessage = "Kuota API Gemini habis.";
        }

        res.status(500).json({ 
            message: errorMessage,
            details: error.message 
        });
    }
}
