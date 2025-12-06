import React, { useState, useRef } from 'react';
import { Shield, MapPin, CheckCircle2, X, Upload, AlertTriangle, Activity, Eye } from 'lucide-react';
import Map from '../components/Map';

function ClientView() {
  const [status, setStatus] = useState('IDLE'); // IDLE, ACTIVE
  const [progress, setProgress] = useState(0);
  const pressTimer = useRef(null);

  // Analysis State
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("Describe the safety situation in this video. Identify any potential hazards or security breaches.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const startPress = () => {
    if (status === 'ACTIVE') return;
    pressTimer.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (pressTimer.current) clearInterval(pressTimer.current);
          setStatus('ACTIVE');
          return 100;
        }
        return prev + 2; // Adjust speed here
      });
    }, 20);
  };

  const endPress = () => {
    if (status === 'ACTIVE') return;
    if (pressTimer.current) clearInterval(pressTimer.current);
    setProgress(0);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSystem = () => {
    setStatus('IDLE');
    setFile(null);
    setResult(null);
    setError(null);
    setLoading(false);
    setProgress(0);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 relative overflow-hidden bg-background text-foreground font-sans">
      
      {/* Header */}
      <div className="w-full flex justify-between items-center z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Valkyrie <span className="text-muted-foreground font-normal">/ Sky Command</span>
          </h1>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border border-white/5 ${status === 'ACTIVE' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
          <div className={`w-2 h-2 rounded-full ${status === 'ACTIVE' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          {status === 'ACTIVE' ? 'SURVEILLANCE ACTIVE' : 'SYSTEM ONLINE'}
        </div>
      </div>

      {/* Map Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Map />
      </div>
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-background/80 via-transparent to-background/90" />

      {/* Content */}
      <div className="z-10 flex flex-col items-center justify-center w-full flex-1 gap-8 max-w-4xl mx-auto">
        {status === 'IDLE' ? (
          <>
            <div className="text-center space-y-1 animate-in fade-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 backdrop-blur-sm mb-4 border border-white/10">
                <MapPin className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Sveavägen 24, Stockholm</p>
              <p className="text-xs text-muted-foreground">59.3293° N, 18.0686° E</p>
            </div>

            <button
              onMouseDown={startPress}
              onMouseUp={endPress}
              onMouseLeave={endPress}
              onTouchStart={startPress}
              onTouchEnd={endPress}
              className="relative w-64 h-64 rounded-full flex items-center justify-center group active:scale-95 transition-all duration-200 cursor-pointer bg-card/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 select-none"
            >
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 - (progress / 100) * 301.59}
                  className="text-primary transition-all duration-75 ease-linear"
                />
              </svg>
              
              <div className="text-center select-none z-10">
                <Eye className={`w-12 h-12 mx-auto mb-3 transition-colors ${progress > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="block font-semibold text-lg tracking-tight">Initialize</span>
                <span className="text-xs mt-1 block text-muted-foreground">Hold 3 Seconds</span>
              </div>
              
              {/* Glow effect on press */}
              <div 
                className="absolute inset-0 rounded-full bg-primary/5 transition-opacity duration-200"
                style={{ opacity: progress > 0 ? 1 : 0 }}
              />
            </button>
          </>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-10 duration-500">
            
            {/* Left Column: Status & Controls */}
            <div className="space-y-4">
              <div className="bg-card/90 backdrop-blur-xl border border-danger/20 rounded-2xl p-6 shadow-2xl shadow-danger/5 text-center space-y-6">
                <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  {loading ? (
                    <Activity className="w-8 h-8 text-danger animate-spin" />
                  ) : result ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-danger" />
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {loading ? 'Analyzing Feed...' : result ? 'Analysis Complete' : 'Surveillance Active'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {loading ? 'Gemini 3.0 Processing Video Data' : result ? 'Threat Assessment Ready' : 'Waiting for Video Source'}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 space-y-3 text-sm text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">System Status</span>
                    <span className="font-medium text-primary">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">AI Model</span>
                    <span className="font-mono text-xs bg-background px-2 py-1 rounded border border-muted">GEMINI-1.5-PRO</span>
                  </div>
                  {file && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Source</span>
                      <span className="font-medium truncate max-w-[150px]">{file.name}</span>
                    </div>
                  )}
                </div>

                {!loading && !result && file && (
                  <button 
                    onClick={handleAnalyze}
                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/20"
                  >
                    Start Analysis
                  </button>
                )}
              </div>

              <button 
                onClick={resetSystem}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-white/5"
              >
                <X className="w-4 h-4" />
                Terminate Session
              </button>
            </div>

            {/* Right Column: Feed / Result */}
            <div className="space-y-4">
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative border border-muted shadow-lg group">
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded uppercase tracking-wider z-20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live Feed
                </div>
                
                {file ? (
                  <div className="w-full h-full relative">
                    <video 
                      src={URL.createObjectURL(file)} 
                      className="w-full h-full object-cover opacity-80"
                      controls
                    />
                    {/* Overlay when analyzing */}
                    {loading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-primary font-mono text-sm">SCANNING...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                    <Upload className="w-12 h-12 text-muted-foreground mb-4 group-hover:text-white transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-white">Click to Upload Video Feed</span>
                    <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Analysis Result Output */}
              {result && (
                <div className="bg-card/90 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Intelligence Report</h3>
                  <div className="prose prose-invert prose-sm max-w-none max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{result}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}

export default ClientView;
