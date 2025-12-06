'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Crosshair, Radio, Activity, Map as MapIcon, AlertTriangle } from 'lucide-react';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function AdminDashboard() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [threatLevel, setThreatLevel] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock Gemini Analysis
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // In a real app, we'd capture a frame from videoRef and send it to /api/analyze
        // const frame = captureFrame(videoRef.current);
        const res = await fetch('/api/analyze', { method: 'POST' });
        const data = await res.json();
        
        setAnalysis(data.text);
        setThreatLevel(data.threat);
      } catch (e) {
        console.error("API Error", e);
        setAnalysis("Connection lost. Retrying...");
      }
    }, 5000); // Slowed down to 5s to avoid rate limits on free tier

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans p-4 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Valkyrie Command</h1>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            System Online
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Network Secure
          </div>
          <div className={`flex items-center gap-2 ${threatLevel > 5 ? 'text-danger animate-pulse' : 'text-muted-foreground'}`}>
            <AlertTriangle className="w-4 h-4" />
            Threat Level: {threatLevel > 5 ? 'CRITICAL' : 'Normal'}
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Panel 1: Escalation */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="bg-card border border-muted rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Active Incident
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">User ID</p>
                <p className="text-lg font-medium">#5591</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                <p className="text-lg font-medium">Sveavägen 24</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 mt-1">
                  Evaluating
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-muted rounded-xl p-5 shadow-sm flex-1 flex flex-col">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">Response Actions</h2>
            <div className="space-y-3 mt-auto">
              <button className="w-full bg-primary hover:bg-blue-700 text-white p-4 rounded-lg transition-colors text-left group shadow-lg shadow-blue-500/20">
                <span className="block font-semibold">Dispatch Drone</span>
                <span className="text-xs opacity-80">Engage auto-pilot sequence</span>
              </button>
              
              <button className="w-full bg-card hover:bg-danger/10 border border-danger/20 text-danger p-4 rounded-lg transition-colors text-left group">
                <span className="block font-semibold">Dispatch Police (SEPO)</span>
                <span className="text-xs opacity-80">Requires authorization</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panel 2: Fleet Map */}
        <div className="col-span-6 bg-card border border-muted rounded-xl overflow-hidden relative shadow-sm flex flex-col">
          <div className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium border border-muted shadow-sm flex items-center gap-2">
            <MapIcon className="w-3 h-3" /> Global Awareness
          </div>
          <div className="flex-1 bg-muted/20">
            <Map />
          </div>
        </div>

        {/* Panel 3: The AI Eye */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="bg-card border border-muted rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-muted flex justify-between items-center">
              <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Crosshair className="w-4 h-4" /> Live Feed
              </h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[10px] font-bold uppercase tracking-wider">
                <Radio className="w-3 h-3" /> Live
              </div>
            </div>

            <div className="aspect-video bg-black relative group">
              {/* Placeholder for video stream */}
              <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/172393635/photo/night-vision.jpg?s=612x612&w=0&k=20&c=0t6tqI_7QoJ_b_X4f_z_z_z_z_z_z_z_z_z_z_z_z_z')] bg-cover bg-center opacity-80" />
              
              {/* Overlay UI */}
              <div className="absolute bottom-3 left-3 text-xs font-mono text-white/70 bg-black/50 px-2 py-1 rounded">
                CAM-04 [NIGHT VISION]
              </div>
            </div>
          </div>

          <div className="bg-card border border-muted rounded-xl p-5 shadow-sm flex-1 flex flex-col">
            <h3 className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Gemini 1.5 Analysis
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg border border-muted/50">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Situation Report</p>
                <p className="text-sm leading-relaxed text-foreground">
                  {analysis || "Waiting for input..."}
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Threat Score</p>
                  <p className={`text-sm font-bold ${threatLevel > 5 ? 'text-danger' : 'text-green-500'}`}>{threatLevel}/10</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${threatLevel > 5 ? 'bg-danger' : 'bg-green-500'}`} 
                    style={{ width: `${threatLevel * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
