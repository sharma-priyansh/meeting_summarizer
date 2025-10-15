AI Meeting Summarizer - Full Stack
This project is a full-stack application that allows users to upload an audio file of a meeting, get it transcribed by AssemblyAI, and then generate a structured summary using the Gemini API.

Project Structure
.
├── backend/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── package.json
    └── src/
        └── App.jsx

How to Set Up and Run
You need to run two separate processes: one for the backend server and one for the React frontend development server.

1. Backend Setup
Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Create your environment file:
Make sure you have a file named .env inside the backend directory.

Add your API Key:
Open the .env file and add your AssemblyAI API key. You can get your free key from assemblyai.com.

ASSEMBLYAI_API_KEY=YOUR_ASSEMBLYAI_API_KEY_HERE

Start the backend server:

npm start

The server will start on http://localhost:3001. Keep this terminal window open.

2. Frontend Setup
Open a new terminal window.

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the React development server:

npm run dev

The React application will open in your browser, usually at http://localhost:5173.

3. Using the App
Open the frontend URL in your browser.

Click "Choose an audio file..." and select an audio file (e.g., .mp3, .wav, .m4a).

Click "Transcribe Audio". You will see the status change to "Uploading..." and then "Transcribing...".

Wait for the transcription to complete. This can take some time depending on the length of the audio.

Once complete, the transcript will appear.

Click "Generate Summary" to get the AI-powered summary, key decisions, and action items.