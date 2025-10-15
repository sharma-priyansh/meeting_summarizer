import React, { useState, useCallback, useEffect } from 'react';

// --- SVG Icon Components ---
const UploadIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-gray-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg> );
const FileIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg> );
const SummaryIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><rect width="8" height="8" x="3" y="3" rx="2" /><path d="M7 11h10" /><path d="M7 15h10" /><path d="M3 11h2" /><path d="M3 15h2" /></svg> );
const DecisionsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg> );
const ActionsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M6 9h6" /><path d="M6 13h8" /><path d="M6 17h10" /><path d="m18 9-3-3 3-3" /><path d="m18 13-3-3 3-3" /></svg> );
const TranscriptIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg> );
const CheckCircle = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> );
const LoadingCircle = ({ className }) => ( <svg className={`${className} animate-spin`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> );
const DotCircle = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1" /></svg> );

// --- UI Components ---

const ErrorDisplay = ({ message, onClear }) => (
    <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
        <button onClick={onClear} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-red-600" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
        </button>
    </div>
);

const ProgressBar = ({ status }) => {
    const steps = ['Uploading', 'Transcribing', 'Summarizing', 'Complete'];
    const currentStepIndex = steps.indexOf(status.charAt(0).toUpperCase() + status.slice(1));

    return (
        <div className="w-full px-4 sm:px-8">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCompleted = index < currentStepIndex || status === 'Complete';
                    const isLoading = index === currentStepIndex && status !== 'Complete';

                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center">
                                <div className={`relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    {isCompleted ? <CheckCircle className="h-6 w-6 text-white" /> : isLoading ? <LoadingCircle className="h-6 w-6 text-white" /> : <DotCircle className="h-6 w-6 text-gray-400" />}
                                </div>
                                <p className={`mt-2 text-xs font-semibold text-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-auto border-t-2 transition-all duration-500 ${isCompleted ? 'border-blue-600' : 'border-gray-300'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const TabButton = ({ isActive, onClick, children }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        {children}
    </button>
);

// --- Main App Component ---

export default function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [transcriptText, setTranscriptText] = useState('');
    const [summaryResult, setSummaryResult] = useState(null);
    const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'transcribing', 'summarizing', 'completed', 'error'
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('transcript');
    const [isDragOver, setIsDragOver] = useState(false);

    const backendUrl = 'http://localhost:3001';

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            resetState();
        }
    };
    
    const handleDragEvents = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragOver(true);
        } else if (e.type === "dragleave") {
            setIsDragOver(false);
        }
    };

    const handleDrop = (e) => {
        handleDragEvents(e);
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            resetState();
        }
    };

    const resetState = (clearFile = false) => {
        if(clearFile) {
            setSelectedFile(null);
            setFileName('');
        }
        setTranscriptText('');
        setSummaryResult(null);
        setError(null);
        setStatus('idle');
        setActiveTab('transcript');
    };

    const pollForTranscript = useCallback(async (id) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${backendUrl}/api/transcript/${id}`);
                const data = await response.json();
                if (data.status === 'completed') {
                    clearInterval(interval);
                    setTranscriptText(data.text || "The audio file was empty or contained no speech.");
                    setStatus('summarizing');
                    await handleSummarize(data.text);
                } else if (data.status === 'failed') {
                    clearInterval(interval);
                    setError('Transcription failed. The audio format might be unsupported or the file could be corrupt.');
                    setStatus('error');
                }
            } catch (err) {
                clearInterval(interval);
                setError(`An error occurred while polling for transcript: ${err.message}`);
                setStatus('error');
            }
        }, 3000);
    }, [backendUrl]);

    const handleTranscribe = async () => {
        if (!selectedFile) return;
        resetState();
        setStatus('uploading');
        const formData = new FormData();
        formData.append('audio', selectedFile);

        try {
            const response = await fetch(`${backendUrl}/api/transcribe`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Failed to start transcription.');
            const data = await response.json();
            setStatus('transcribing');
            await pollForTranscript(data.transcriptId);
        } catch (err) {
            setError(`Transcription request failed: ${err.message}`);
            setStatus('error');
        }
    };

    const handleSummarize = async (text) => {
        if (!text) {
             setStatus('completed'); // Skip summarizing if transcript is empty
             return;
        }
        setStatus('summarizing');
        try {
            const response = await fetch(`${backendUrl}/api/summarize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: text }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Summarization failed.');
            }
            const data = await response.json();
            setSummaryResult(data);
            setStatus('completed');
        } catch (err) {
            setError(`Summarization failed: ${err.message}`);
            setStatus('error');
        }
    };

    const isProcessing = ['uploading', 'transcribing', 'summarizing'].includes(status);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 font-sans p-4">
            <div className="w-full max-w-4xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800 pb-2">
                        AI Meeting Summarizer
                    </h1>
                    <p className="text-gray-500 mt-2">Transform your meeting audio into structured, actionable summaries.</p>
                </header>

                <main className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
                    {status === 'idle' && !selectedFile && (
                        <div 
                            onDragEnter={handleDragEvents} 
                            onDragOver={handleDragEvents} 
                            onDragLeave={handleDragEvents} 
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-all duration-300 ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        >
                            <UploadIcon />
                            <p className="mt-4 text-lg font-semibold text-gray-700">Drag & drop your audio file here</p>
                            <p className="text-gray-500 mt-1">or</p>
                            <label htmlFor="audio-upload" className="mt-2 cursor-pointer bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
                                Choose a File
                            </label>
                            <input id="audio-upload" type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
                            <p className="text-xs text-gray-500 mt-4">Supports MP3, WAV, M4A, and more.</p>
                        </div>
                    )}

                    {(selectedFile) && (
                        <div className="space-y-6">
                             <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-4 sm:mb-0">
                                    <FileIcon/>
                                    <span className="ml-3 font-medium text-gray-700 truncate">{fileName}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                     <button onClick={() => resetState(true)} className="text-sm text-gray-500 hover:text-gray-800 transition">Change File</button>
                                     <button onClick={handleTranscribe} disabled={isProcessing} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200">
                                        {isProcessing ? 'Processing...' : 'Analyze'}
                                    </button>
                                </div>
                             </div>

                             {error && <ErrorDisplay message={error} onClear={() => setError(null)} />}

                             {isProcessing || status === 'completed' ? (
                                <div className="space-y-6">
                                    <ProgressBar status={status === 'completed' ? 'Complete' : status} />
                                    {status === 'completed' && (
                                        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-center sm:justify-start space-x-2 border-b border-gray-200 mb-4 pb-3">
                                                <TabButton isActive={activeTab === 'transcript'} onClick={() => setActiveTab('transcript')}><TranscriptIcon/>Transcript</TabButton>
                                                <TabButton isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')}><SummaryIcon/>Summary</TabButton>
                                                <TabButton isActive={activeTab === 'decisions'} onClick={() => setActiveTab('decisions')}><DecisionsIcon/>Decisions</TabButton>
                                                <TabButton isActive={activeTab === 'actions'} onClick={() => setActiveTab('actions')}><ActionsIcon/>Actions</TabButton>
                                            </div>
                                            <div className="text-gray-700">
                                                {activeTab === 'summary' && <p className="leading-relaxed">{summaryResult?.summary || "No summary could be generated."}</p>}
                                                {activeTab === 'decisions' && <ul className="list-disc list-inside space-y-2">{summaryResult?.keyDecisions?.length > 0 ? summaryResult.keyDecisions.map((item, i) => <li key={i}>{item}</li>) : <li>No key decisions identified.</li>}</ul>}
                                                {activeTab === 'actions' && <ul className="list-disc list-inside space-y-2">{summaryResult?.actionItems?.length > 0 ? summaryResult.actionItems.map((item, i) => <li key={i}>{item}</li>) : <li>No action items identified.</li>}</ul>}
                                                {activeTab === 'transcript' && <textarea readOnly value={transcriptText} className="w-full h-64 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                             ) : null}
                        </div>
                    )}
                </main>

                <footer className="text-center mt-8 text-gray-500 text-sm">
                    <p>Powered by AssemblyAI & Gemini</p>
                </footer>
            </div>
        </div>
    );
}

