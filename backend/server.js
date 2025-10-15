require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = 3001; // Port for the backend server

// --- Middleware ---
app.use(cors()); // Allow requests from the React frontend
app.use(express.json());

// Setup multer for file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- API Keys ---
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // The environment will provide this

if (!ASSEMBLYAI_API_KEY) {
    console.error("FATAL ERROR: ASSEMBLYAI_API_KEY is not defined in the .env file.");
    process.exit(1);
}

// Add a check for the Gemini API key to ensure it's available at startup
if (!GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not being provided by the environment.");
    process.exit(1);
}

const assemblyai = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
    },
});

// --- API Endpoints ---

/**
 * 1. Transcribe Endpoint
 * Receives an audio file, uploads it to AssemblyAI, and starts the transcription process.
 */
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No audio file uploaded.' });
    }

    try {
        // Step 1: Upload the file to AssemblyAI's hosting service
        const uploadResponse = await assemblyai.post('/upload', req.file.buffer);
        const upload_url = uploadResponse.data.upload_url;

        // Step 2: Submit the uploaded file for transcription
        const transcribeResponse = await assemblyai.post('/transcript', {
            audio_url: upload_url,
        });
        
        const transcriptId = transcribeResponse.data.id;
        res.json({ transcriptId });

    } catch (error) {
        console.error("Error in /api/transcribe:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to start transcription.' });
    }
});

/**
 * 2. Get Transcript Status/Result Endpoint
 * Polls AssemblyAI to check if the transcription is complete and returns the result.
 */
app.get('/api/transcript/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await assemblyai.get(`/transcript/${id}`);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching transcript ${id}:`, error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch transcript.' });
    }
});


/**
 * 3. Summarize Endpoint
 * Receives transcript text and uses Gemini to generate a summary.
 */
app.post('/api/summarize', async (req, res) => {
    const { transcript } = req.body;

    if (!transcript) {
        return res.status(400).json({ error: 'Transcript text is required.' });
    }
    
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemPrompt = "You are an expert meeting assistant. Your task is to analyze a meeting transcript and provide a structured summary. The output must be a valid JSON object with the following keys: 'summary', 'keyDecisions', and 'actionItems'. 'summary' should be a concise paragraph. 'keyDecisions' should be an array of strings. 'actionItems' should be an array of strings, each being a clear, actionable task.";
    const userQuery = `Here is the meeting transcript:\n\n${transcript}`;

    const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userQuery }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    summary: { type: "STRING" },
                    keyDecisions: { type: "ARRAY", items: { type: "STRING" } },
                    actionItems: { type: "ARRAY", items: { type: "STRING" } }
                },
                required: ["summary", "keyDecisions", "actionItems"]
            }
        }
    };

    try {
        const response = await axios.post(geminiApiUrl, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        const candidate = response.data.candidates?.[0];
        if (candidate && candidate.content?.parts?.[0]?.text) {
             res.json(JSON.parse(candidate.content.parts[0].text));
        } else {
            throw new Error("Invalid response structure from Gemini API.");
        }

    } catch (error) {
        console.error("Error in /api/summarize:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate summary.' });
    }
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});

