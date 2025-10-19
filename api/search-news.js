// api/search-news.js
import { GoogleGenerativeAI } from '@google/generative-ai';
// Hapus import 'formidable' dan 'fs' karena tidak diperlukan untuk pencarian teks sederhana

// Kunci ini hanya akan tersedia di lingkungan Vercel
const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
    // 1. Pemeriksaan Metode dan API Key (PENTING!)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    if (!apiKey) {
        // Jika kunci API TIDAK ADA, segera kembalikan error 500
        return res.status(500).json({ 
            message: 'Internal Server Error: GEMINI_API_KEY tidak ditemukan. Harap atur di Environment Variables Vercel.',
            details: 'Authentication failed.'
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
        const response = await model.generateContent({
            contents: prompt // Mengirim prompt sebagai string
        });

        res.status(200).json({ 
            result: response.text 
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        
        let errorMessage = "Internal Server Error saat memproses AI.";
        if (error.message.includes('API key is not valid')) {
             errorMessage = "API Key Gemini tidak valid. Cek Vercel Environment Variables.";
        } else if (error.message.includes('quota')) {
             errorMessage = "Kuota API Gemini habis. Hubungi Google AI.";
        }

        res.status(500).json({ 
            message: errorMessage,
            details: error.message 
        });
    }
}
