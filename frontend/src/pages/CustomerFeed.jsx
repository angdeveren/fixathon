import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { mockCustomers } from '../data/mockCustomers';

function CustomerFeed() {
  const { id } = useParams();
  const customer = mockCustomers.find(c => c.id === id);
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (customer && customer.videoFile) {
      // Simulate auto-analysis on load
      analyzeVideo(customer.videoFile);
    }
  }, [customer]);

  const analyzeVideo = async (videoPath) => {
    setLoading(true);
    try {
      // Fetch the video file from the public folder
      const response = await fetch(videoPath);
      const blob = await response.blob();
      const file = new File([blob], "surveillance_feed.mp4", { type: "video/mp4" });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', "Analyze this surveillance footage immediately. Identify any threats, intruders, or safety breaches. Provide a tactical summary.");

      const apiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`Error: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      setResult(data.analysis);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to AI Analysis Grid. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return <div className="p-8 text-center">Customer not found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-sans flex flex-col">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-bold text-red-500 tracking-wider">LIVE INCIDENT FEED</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Feed Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {customer.videoFile ? (
              <video 
                src={customer.videoFile} 
                className="w-full h-full object-cover"
                autoPlay 
                loop 
                muted 
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Signal
              </div>
            )}
            
            {/* Overlay UI */}
            <div className="absolute top-4 left-4 flex flex-col gap-1">
              <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded text-xs font-mono text-white border border-white/10">
                CAM: {customer.camera}
              </div>
              <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded text-xs font-mono text-white border border-white/10">
                LOC: {customer.address}
              </div>
            </div>

            {loading && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-primary/30">
                <Activity className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs font-bold text-primary">ANALYZING FEED...</span>
              </div>
            )}
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className="space-y-6">
          <div className="bg-card border border-white/10 rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-bold">Tactical Analysis</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-3/4"></div>
                  <div className="h-4 bg-white/5 rounded w-1/2"></div>
                  <div className="h-4 bg-white/5 rounded w-5/6"></div>
                  <div className="h-32 bg-white/5 rounded w-full mt-4"></div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <AlertTriangle className="w-5 h-5 mb-2" />
                  {error}
                </div>
              ) : result ? (
                <div className="prose prose-invert prose-sm">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium text-green-400">Analysis Complete</span>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{result}</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-10">
                  Waiting for data stream...
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-900/20 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                DISPATCH UNITS
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CustomerFeed;
