// file: app.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Global ---
    const langEnBtn = document.getElementById('langEnBtn');
    const langIdBtn = document.getElementById('langIdBtn');
    const messageBox = document.getElementById('message');
    const analysisResultDiv = document.getElementById('analysisResult');
    const placeholderAnalysis = document.getElementById('placeholderAnalysis');

    // --- Elemen Chart Predictor ---
    const chartAnalysisForm = document.getElementById('chartAnalysisForm');
    const chartImageInput = document.getElementById('chartImageInput');
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const assetTypeSelect = document.getElementById('assetType');
    const timeframeSelect = document.getElementById('timeframe');
    const additionalNotesTextarea = document.getElementById('additionalNotes');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resetChartBtn = document.getElementById('resetChartBtn');

    // --- Elemen Global Insight Search ---
    const globalSearchForm = document.getElementById('globalSearchForm');
    const searchPromptTextarea = document.getElementById('searchPrompt');
    const searchBtn = document.getElementById('searchBtn');
    const searchButtonText = document.getElementById('searchButtonText');
    const searchLoadingSpinner = document.getElementById('searchLoadingSpinner');
    const resetSearchBtn = document.getElementById('resetSearchBtn');
    
    let uploadedFile = null;
    let currentLang = localStorage.getItem('appLang') || 'en';

    // --- Terjemahan (Translations) ---
    const translations = {
        en: {
            headerTitle: "AI Market & Global Insight Predictor",
            headerSubtitle: "Upload charts or ask specific questions about geopolitics, economy, and finance using Gemini AI.",
            inputSectionTitle: "Market Chart Predictor",
            labelAssetType: "Asset Type:",
            selectAssetType: "Select Asset Type",
            labelTimeframe: "Timeframe:",
            selectTimeframe: "Select Timeframe",
            labelAdditionalNotes: "Additional Context/Notes (Optional):",
            placeholderNotes: "e.g., 'Looking for resistance levels', 'Is this a bullish setup?'",
            labelUploadChart: "Upload Chart Screenshot (Max 5MB):",
            uploadAreaText: `<i class="fas fa-upload"></i> Drag & drop your image here, or click to browse`,
            analyzeButton: "Analyze Chart",
            analyzingButton: "Analyzing...",
            resetChartText: "Reset Chart",
            
            searchSectionTitle: "AI Global Insight",
            labelSearchPrompt: "Your Question (Geopolitics, Economy, Finance, Conflict):",
            placeholderSearch: "e.g., 'Analyze the impact of US inflation on global commodity prices.'",
            searchButton: "Search Insight",
            searchingButton: "Searching...",
            resetSearchText: "Reset Search",

            outputSectionTitle: "Analysis Results",
            placeholderAnalysis: "Upload a chart/enter a question and click the appropriate button to see the AI's prediction/insight here.",
            footerText: "&copy; 2025 AI Market Predictor. Powered by Gemini API. All rights reserved.",
            
            msgUploadImage: "Please upload an image file (e.g., JPG, PNG).",
            msgFileSize: "Image file size exceeds 5MB. Please upload a smaller image.",
            msgNoImageUploaded: "Please upload a chart screenshot.",
            msgSelectAssetTimeframe: "Please select Asset Type and Timeframe.",
            msgNoSearchPrompt: "Please enter a question to search for insight.",
            msgAnalysisComplete: "Analysis complete!",
            msgSearchComplete: "Search complete!",
            msgServerError: "Server error during analysis. Please try again.",
            msgFailedAnalysis: "Failed to get analysis.",
            msgErrorPrefix: "Error: ",
            
            direction: "Market Direction",
            rationale: "Rationale",
            support: "Support Level",
            resistance: "Resistance Level",
            riskWarning: "Risk Warning",
        },
        id: {
            headerTitle: "Prediktor Pasar & Wawasan Global AI",
            headerSubtitle: "Unggah grafik atau ajukan pertanyaan spesifik tentang geopolitik, ekonomi, dan keuangan menggunakan AI Gemini.",
            inputSectionTitle: "Prediktor Grafik Pasar",
            labelAssetType: "Jenis Aset:",
            selectAssetType: "Pilih Jenis Aset",
            labelTimeframe: "Jangka Waktu:",
            selectTimeframe: "Pilih Jangka Waktu",
            labelAdditionalNotes: "Konteks/Catatan Tambahan (Opsional):",
            placeholderNotes: "cth: 'Mencari level resistensi', 'Apakah ini setup bullish?'",
            labelUploadChart: "Unggah Tangkapan Layar Grafik (Maks 5MB):",
            uploadAreaText: `<i class="fas fa-upload"></i> Seret & lepas gambar Anda di sini, atau klik untuk mencari`,
            analyzeButton: "Analisis Grafik",
            analyzingButton: "Menganalisis...",
            resetChartText: "Reset Grafik",

            searchSectionTitle: "Wawasan Global AI",
            labelSearchPrompt: "Pertanyaan Anda (Geopolitik, Ekonomi, Keuangan, Konflik):",
            placeholderSearch: "cth: 'Analisis dampak inflasi AS terhadap harga komoditas global.'",
            searchButton: "Cari Wawasan",
            searchingButton: "Mencari...",
            resetSearchText: "Reset Pencarian",

            outputSectionTitle: "Hasil Analisis",
            placeholderAnalysis: "Unggah grafik/masukkan pertanyaan dan klik tombol yang sesuai untuk melihat prediksi/wawasan AI di sini.",
            footerText: "&copy; 2025 Prediktor Pasar AI. Didukung oleh Gemini API. Semua Hak Dilindungi.",

            msgUploadImage: "Mohon unggah file gambar (misal: JPG, PNG).",
            msgFileSize: "Ukuran file gambar melebihi 5MB. Mohon unggah gambar yang lebih kecil.",
            msgNoImageUploaded: "Mohon unggah tangkapan layar grafik.",
            msgSelectAssetTimeframe: "Mohon pilih Jenis Aset dan Jangka Waktu.",
            msgNoSearchPrompt: "Mohon masukkan pertanyaan untuk mencari wawasan.",
            msgAnalysisComplete: "Analisis selesai!",
            msgSearchComplete: "Pencarian selesai!",
            msgServerError: "Terjadi kesalahan server saat analisis. Mohon coba lagi.",
            msgFailedAnalysis: "Gagal mendapatkan analisis.",
            msgErrorPrefix: "Kesalahan: ",

            direction: "Arah Pasar",
            rationale: "Alasan",
            support: "Level Dukungan",
            resistance: "Level Resistensi",
            riskWarning: "Peringatan Risiko",
        }
    };

    const assetTypes = {
        '': { en: 'Select Asset Type', id: 'Pilih Jenis Aset' },
        'Crypto': { en: 'Crypto', id: 'Kripto' },
        'Forex': { en: 'Forex', id: 'Forex' },
        'Commodity': { en: 'Commodity', id: 'Komoditas' },
        'Stock': { en: 'Stock', id: 'Saham' }
    };

    const timeframes = {
        '': { en: 'Select Timeframe', id: 'Pilih Jangka Waktu' },
        '1H': { en: '1 Hour', id: '1 Jam' },
        '4H': { en: '4 Hour', id: '4 Jam' },
        '1D': { en: '1 Day', id: '1 Hari' },
        '1W': { en: '1 Week', id: '1 Minggu' },
        '1M': { en: '1 Month', id: '1 Bulan' }
    };

    // --- Helper Functions UI/UX ---

    function populateSelectOptions(selectElement, optionsData, selectedValue) {
        selectElement.innerHTML = ''; 
        for (const value in optionsData) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = optionsData[value][currentLang];
            if (value === selectedValue) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        }
    }

    function updateUI() {
        // Simpan nilai saat ini sebelum update
        const selectedAsset = assetTypeSelect.value;
        const selectedTimeframe = timeframeSelect.value;
        
        const t = translations[currentLang];

        // Header & Footer
        document.getElementById('headerTitle').textContent = t.headerTitle;
        document.getElementById('headerSubtitle').textContent = t.headerSubtitle;
        document.getElementById('footerText').innerHTML = t.footerText;

        // Chart Predictor Section
        document.getElementById('inputSectionTitle').innerHTML = `<i class="fas fa-chart-line"></i> ${t.inputSectionTitle}`;
        document.getElementById('labelAssetType').textContent = t.labelAssetType;
        document.getElementById('labelTimeframe').textContent = t.labelTimeframe;
        document.getElementById('labelAdditionalNotes').textContent = t.labelAdditionalNotes;
        additionalNotesTextarea.placeholder = t.placeholderNotes;
        document.getElementById('labelUploadChart').textContent = t.labelUploadChart;
        document.getElementById('uploadAreaText').innerHTML = t.uploadAreaText;
        buttonText.textContent = t.analyzeButton;
        document.getElementById('resetChartText').textContent = t.resetChartText;

        // Global Insight Section
        document.getElementById('searchSectionTitle').innerHTML = `<i class="fas fa-globe"></i> ${t.searchSectionTitle}`;
        document.getElementById('labelSearchPrompt').textContent = t.labelSearchPrompt;
        searchPromptTextarea.placeholder = t.placeholderSearch;
        searchButtonText.textContent = t.searchButton;
        document.getElementById('resetSearchText').textContent = t.resetSearchText;

        // Output Section
        document.getElementById('outputSectionTitle').innerHTML = `<i class="fas fa-brain"></i> ${t.outputSectionTitle}`;
        placeholderAnalysis.textContent = t.placeholderAnalysis;

        // Update select options
        populateSelectOptions(assetTypeSelect, assetTypes, selectedAsset);
        populateSelectOptions(timeframeSelect, timeframes, selectedTimeframe);

        // Update active language button style
        langEnBtn.classList.toggle('active', currentLang === 'en');
        langIdBtn.classList.toggle('active', currentLang === 'id');
        
        // Cek status loading untuk update tombol
        if (analyzeBtn.disabled) {
            buttonText.textContent = t.analyzingButton;
        }
        if (searchBtn.disabled) {
            searchButtonText.textContent = t.searchingButton;
        }
        // Clear message box if needed, but keep logic simple by relying on submit/reset
    }
    
    function showMessage(msg, type) {
        messageBox.textContent = msg;
        messageBox.className = `message-box ${type}-message`;
        messageBox.style.display = 'block';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function setLoadingState(isLoading, formType) {
        if (formType === 'chart') {
            analyzeBtn.disabled = isLoading;
            buttonText.textContent = isLoading ? translations[currentLang].analyzingButton : translations[currentLang].analyzeButton;
            loadingSpinner.style.display = isLoading ? 'inline-block' : 'none';
            resetChartBtn.disabled = isLoading;
        } else if (formType === 'search') {
            searchBtn.disabled = isLoading;
            searchButtonText.textContent = isLoading ? translations[currentLang].searchingButton : translations[currentLang].searchButton;
            searchLoadingSpinner.style.display = isLoading ? 'inline-block' : 'none';
            resetSearchBtn.disabled = isLoading;
        }
    }

    function displayAnalysisResults(analysis) {
        let htmlContent = '';
        const t = translations[currentLang];

        if (typeof analysis === 'string') {
            // Jika respons adalah string biasa (untuk hasil search/gemini)
            const formattedText = analysis.replace(/\n/g, '<br>');
            htmlContent = `<p>${formattedText}</p>`;
        } else if (typeof analysis === 'object' && analysis.direction) {
            // Jika respons adalah objek JSON terstruktur (untuk hasil chart predictor)
            
            // Arah Pasar
            htmlContent += `<div class="result-item"><h3>${t.direction}:</h3><p><strong>${analysis.direction || 'N/A'}</strong></p></div>`;
            
            // Alasan
            if (analysis.rationale) {
                 htmlContent += `<div class="result-item"><h3>${t.rationale}:</h3><p>${analysis.rationale}</p></div>`;
            }
            
            // Level Dukungan
            if (analysis.support) {
                htmlContent += `<div class="result-item"><h3>${t.support}:</h3><p>${analysis.support}</p></div>`;
            }
            
            // Level Resistensi
            if (analysis.resistance) {
                htmlContent += `<div class="result-item"><h3>${t.resistance}:</h3><p>${analysis.resistance}</p></div>`;
            }

            // Peringatan Risiko
            if (analysis.riskWarning) {
                // Catatan: Warna kuning harus didefinisikan di CSS :root atau langsung di sini
                htmlContent += `<div class="result-item warning-message"><h3 style="color: var(--warning-color);">${t.riskWarning}:</h3><p>${analysis.riskWarning}</p></div>`;
            }
        } else {
            htmlContent = `<p class="placeholder-text">${t.placeholderAnalysis}</p>`;
        }
        
        analysisResultDiv.innerHTML = htmlContent;
    }


    // --- Event Listeners ---

    // Initial UI update
    updateUI();

    // Language Switcher Event Listeners
    langEnBtn.addEventListener('click', () => {
        currentLang = 'en';
        localStorage.setItem('appLang', 'en');
        updateUI();
    });

    langIdBtn.addEventListener('click', () => {
        currentLang = 'id';
        localStorage.setItem('appLang', 'id');
        updateUI();
    });
    
    // Reset Buttons
    resetChartBtn.addEventListener('click', () => {
        chartAnalysisForm.reset();
        uploadedFile = null;
        imagePreview.style.display = 'none';
        imagePreview.src = '';
        fileNameDisplay.style.display = 'none';
        uploadArea.classList.remove('file-ready');
        analysisResultDiv.innerHTML = `<p class="placeholder-text">${translations[currentLang].placeholderAnalysis}</p>`;
        hideMessage();
        updateUI(); // Memastikan select options kembali ke default text
    });
    
    resetSearchBtn.addEventListener('click', () => {
        globalSearchForm.reset();
        analysisResultDiv.innerHTML = `<p class="placeholder-text">${translations[currentLang].placeholderAnalysis}</p>`;
        hideMessage();
    });


    // --- File Upload Logic (Drag & Drop) ---
    uploadArea.addEventListener('click', () => chartImageInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    chartImageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        hideMessage(); 
        uploadArea.classList.remove('file-ready');

        if (!file.type.startsWith('image/')) {
            showMessage(translations[currentLang].msgUploadImage, 'error');
            imagePreview.style.display = 'none';
            fileNameDisplay.style.display = 'none';
            uploadedFile = null;
            return;
        }
        // 5 MB limit
        if (file.size > 5 * 1024 * 1024) { 
            showMessage(translations[currentLang].msgFileSize, 'error');
            imagePreview.style.display = 'none';
            fileNameDisplay.style.display = 'none';
            uploadedFile = null;
            return;
        }

        uploadedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            fileNameDisplay.textContent = file.name;
            fileNameDisplay.style.display = 'block';
            uploadArea.classList.add('file-ready'); // Konfirmasi visual
        };
        reader.readAsDataURL(file);
    }

    // --- 1. Form Submission Logic: Chart Predictor ---
    chartAnalysisForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        analysisResultDiv.innerHTML = `<p class="placeholder-text">${translations[currentLang].analyzingButton}...</p>`;
        hideMessage();

        if (!uploadedFile) {
            showMessage(translations[currentLang].msgNoImageUploaded, 'error');
            return;
        }
        if (!assetTypeSelect.value || !timeframeSelect.value) {
            showMessage(translations[currentLang].msgSelectAssetTimeframe, 'error');
            return;
        }

        setLoadingState(true, 'chart');

        // Note: Anda harus mengubah kode ini agar mengirim gambar dalam Base64 
        // jika Anda tidak ingin menggunakan library form-data di Vercel,
        // atau gunakan FormData seperti ini jika backend Anda mendukungnya.
        
        // CONTOH pengiriman Base64 (lebih mudah di backend Serverless)
        const base64Image = await convertFileToBase64(uploadedFile); 
        
        const dataToSend = {
            image: base64Image,
            assetType: assetTypeSelect.value,
            timeframe: timeframeSelect.value,
            additionalNotes: additionalNotesTextarea.value,
            outputLanguage: currentLang, 
            modelPurpose: 'chart_analysis'
        };

        try {
            // Panggil Vercel Serverless Function Anda
            const response = await fetch('/api/analyze-chart', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || translations[currentLang].msgServerError);
            }

            const data = await response.json();
            displayAnalysisResults(data.analysis); 
            showMessage(translations[currentLang].msgAnalysisComplete, 'success');

        } catch (err) {
            console.error('Chart Analysis error:', err);
            analysisResultDiv.innerHTML = `<p class="placeholder-text">${translations[currentLang].msgFailedAnalysis}</p>`;
            showMessage(`${translations[currentLang].msgErrorPrefix} ${err.message}`, 'error');
        } finally {
            setLoadingState(false, 'chart');
        }
    });

    // Helper untuk konversi File menjadi Base64 string
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Ambil hanya Base64 string tanpa header
            reader.onerror = error => reject(error);
        });
    }
    
    
    // --- 2. Form Submission Logic: Global Insight Search ---
    globalSearchForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const prompt = searchPromptTextarea.value.trim();
        if (!prompt) {
            showMessage(translations[currentLang].msgNoSearchPrompt, 'error');
            return;
        }
        
        analysisResultDiv.innerHTML = `<p class="placeholder-text">${translations[currentLang].searchingButton}...</p>`;
        hideMessage();
        setLoadingState(true, 'search');

        // Siapkan data untuk dikirim ke Vercel Serverless Function
        const dataToSend = {
            prompt: prompt,
            outputLanguage: currentLang,
            modelPurpose: 'global_insight' 
        };

        try {
            // Panggil Vercel Serverless Function Anda
            const response = await fetch('/api/search', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || translations[currentLang].msgServerError);
            }

            const data = await response.json();
            displayAnalysisResults(data.analysis); 
            showMessage(translations[currentLang].msgSearchComplete, 'success');

        } catch (err) {
            console.error('Global Search error:', err);
            analysisResultDiv.innerHTML = `<p class="placeholder-text">${translations[currentLang].msgFailedAnalysis}</p>`;
            showMessage(`${translations[currentLang].msgErrorPrefix} ${err.message}`, 'error');
        } finally {
            setLoadingState(false, 'search');
        }
    });
});
