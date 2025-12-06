'use client';

import { useState, useRef } from 'react';
import { Shield, MapPin, CheckCircle2, X } from 'lucide-react';

export default function Home() {
  const [status, setStatus] = useState<'IDLE' | 'ACTIVE'>('IDLE');
  const [progress, setProgress] = useState(0);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 relative overflow-hidden bg-background text-foreground">
      {/* Header */}
      <div className="w-full flex justify-between items-center z-10">
        <h1 className="text-lg font-semibold tracking-tight">Valkyrie</h1>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status === 'ACTIVE' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
          <div className={`w-2 h-2 rounded-full ${status === 'ACTIVE' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          {status === 'ACTIVE' ? 'EMERGENCY' : 'ONLINE'}
        </div>
      </div>

      {/* Map Background (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none">
        <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center invert" />
      </div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center justify-center w-full flex-1 gap-12">
        {status === 'IDLE' ? (
          <>
            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
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
              className="relative w-64 h-64 rounded-full flex items-center justify-center group active:scale-95 transition-all duration-200 cursor-pointer bg-card border border-muted shadow-2xl shadow-black/50"
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
                <Shield className={`w-12 h-12 mx-auto mb-3 transition-colors ${progress > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="block font-semibold text-lg tracking-tight">Request Escort</span>
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
          <>
            <div className="w-full max-w-sm bg-card border border-danger/20 rounded-2xl p-6 shadow-2xl shadow-danger/10 text-center space-y-6">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-danger" />
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-foreground">Drone Dispatched</h2>
                <p className="text-sm text-muted-foreground mt-1">Help is on the way.</p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-primary">In Transit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ETA</span>
                  <span className="font-medium">&lt; 2 Minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Unit</span>
                  <span className="font-mono text-xs bg-background px-2 py-1 rounded border border-muted">V-99 ALPHA</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm aspect-video bg-black rounded-xl overflow-hidden relative border border-muted shadow-lg">
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded uppercase tracking-wider z-20">
                Live Feed
              </div>
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                [Connecting to Drone Feed...]
              </div>
            </div>
            
            <button 
              onClick={() => setStatus('IDLE')}
              className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted"
            >
              <X className="w-4 h-4" />
              Cancel Request
            </button>
          </>
        )}
      </div>
    </main>
  );
}
