// Install library: npm install @google/genai
import { GoogleGenAI } from "@google/genai";

// Mengambil API Key dari Environment Variable Vercel (PENTING!)
// Kunci ini tidak akan pernah terekspos ke sisi klien/browser
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Fungsi handler untuk Serverless Function Vercel
export default async function handler(req, res) {
    // Memastikan hanya menerima metode POST dari frontend
    if (req.method !== 'POST') {
        // Status 405 Method Not Allowed
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { query } = req.body;
    
    if (!query) {
        // Status 400 Bad Request
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
        // Status 200 OK
        res.status(200).json({ 
            result: response.text 
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        
        let errorMessage = "Internal Server Error saat memproses AI.";
        if (error.message.includes('API key is not valid')) {
             errorMessage = "API Key Gemini tidak valid atau belum diatur di Environment Variable Vercel.";
        }

        // Status 500 Internal Server Error
        res.status(500).json({ 
            message: errorMessage,
            details: error.message 
        });
    }
}
