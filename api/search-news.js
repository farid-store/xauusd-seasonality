// Install library: npm install @google/genai
import { GoogleGenAI } from "@google/genai";

// Pastikan Vercel telah mengatur process.env.GEMINI_API_KEY
// Kunci ini tidak akan pernah terekspos ke sisi klien/browser
const apiKey = process.env.GEMINI_API_KEY;

// Inisialisasi GoogleGenAI, hanya jika API Key tersedia
let ai = null;
if (apiKey) {
    ai = new GoogleGenAI(apiKey);
}

// Fungsi handler untuk Serverless Function Vercel
export default async function handler(req, res) {
    // 1. Pemeriksaan Metode
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 2. Pemeriksaan API Key (Awal)
    if (!apiKey || !ai) {
        return res.status(500).json({ 
            message: 'Internal Server Error: GEMINI_API_KEY tidak ditemukan. Harap atur di Environment Variables Vercel.',
            details: 'Authentication failed.'
        });
    }

    // 3. Pemeriksaan Query
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ message: 'Missing query parameter in request body.' });
    }
    
    // Prompt yang spesifik dan terstruktur untuk Gemini
    const prompt = `Anda adalah seorang Analis Pasar Emas (XAU/USD). Berikan ringkasan dan analisis singkat (maksimal 300 kata) berdasarkan berita terbaru dan terpercaya terkait kata kunci "${query}". 
    
    Fokuskan hasilnya pada implikasi terhadap pergerakan harga XAU/USD (Bullish, Bearish, atau Ranging). 
    
    Sertakan poin-poin utama dalam format yang mudah dibaca. Jawablah dalam Bahasa Indonesia.`;

    try {
        // Menggunakan model Gemini 2.5 Flash untuk respons cepat
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        // Mengembalikan teks hasil AI ke frontend
        res.status(200).json({ 
            result: response.text 
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        
        // Menangkap error spesifik dari API seperti kunci tidak valid atau kuota habis
        let errorMessage = "Internal Server Error saat memproses AI.";
        if (error.message.includes('API key is not valid')) {
             errorMessage = "API Key Gemini tidak valid. Cek Environment Variables Anda.";
        } else if (error.message.includes('quota')) {
             errorMessage = "Kuota API Gemini habis atau dibatasi. Cek penggunaan di Google AI Studio.";
        }


        res.status(500).json({ 
            message: errorMessage,
            details: error.message 
        });
    }
}
