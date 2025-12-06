import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Map as MapIcon, AlertTriangle, Crosshair, Radio } from 'lucide-react';
import Map from '../components/Map';
import { mockCustomers } from '../data/mockCustomers';

function AdminView() {
  const [analysis, setAnalysis] = useState(null);
  const [threatLevel, setThreatLevel] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  
  // Find the most critical customer for initial state
  useEffect(() => {
    if (!selectedCustomerId) {
      const initialCustomer = mockCustomers.find(c => c.status === 'CRITICAL_WARNING') || 
                              mockCustomers.find(c => c.status === 'ALARM_ACTIVE') || 
                              mockCustomers[0];
      if (initialCustomer) setSelectedCustomerId(initialCustomer.id);
    }
  }, []);

  const activeCustomer = mockCustomers.find(c => c.id === selectedCustomerId) || mockCustomers[0];

  useEffect(() => {
    if (activeCustomer && activeCustomer.videoFile) {
      analyzeVideo(activeCustomer.videoFile);
    }
  }, [activeCustomer]);

  const analyzeVideo = async (videoPath) => {
    try {
      const response = await fetch(videoPath);
      const blob = await response.blob();
      const file = new File([blob], "surveillance_feed.mp4", { type: "video/mp4" });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', "Briefly describe the security situation. Rate threat level 1-10.");

      const apiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        setAnalysis(data.analysis);
        // Simple heuristic for threat level based on text length or keywords (mocking it for now)
        setThreatLevel(Math.floor(Math.random() * 5) + 5); 
      }
    } catch (err) {
      console.error("Analysis failed", err);
      setAnalysis("System offline. Unable to process feed.");
    }
  };

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
                <p className="text-lg font-medium">{activeCustomer.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Name</p>
                <p className="text-lg font-medium">{activeCustomer.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                <p className="text-lg font-medium">{activeCustomer.address}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  activeCustomer.status === 'CRITICAL_WARNING' ? 'bg-red-500/10 text-red-500' : 
                  activeCustomer.status === 'ALARM_ACTIVE' ? 'bg-yellow-500/10 text-yellow-500' : 
                  'bg-green-500/10 text-green-500'
                }`}>
                  {activeCustomer.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-muted rounded-xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">Active Units</h2>
            <div className="space-y-2 mt-auto overflow-y-auto custom-scrollbar pr-2">
              {mockCustomers.map(customer => (
                <button
                  key={customer.id}
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors border ${
                    selectedCustomerId === customer.id 
                      ? 'bg-primary/10 border-primary/50' 
                      : 'bg-card hover:bg-white/5 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-medium text-sm ${selectedCustomerId === customer.id ? 'text-primary' : 'text-foreground'}`}>
                      {customer.name}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      customer.status === 'CRITICAL_WARNING' ? 'bg-red-500 animate-pulse' :
                      customer.status === 'ALARM_ACTIVE' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                  </div>
                  <span className="text-xs text-muted-foreground truncate block mt-1">
                    {customer.camera}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Fleet Map */}
        <div className="col-span-6 bg-card border border-muted rounded-xl overflow-hidden relative shadow-sm flex flex-col">
          <div className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium border border-muted shadow-sm flex items-center gap-2">
            <MapIcon className="w-3 h-3" /> Global Awareness
          </div>
          <div className="flex-1 bg-muted/20">
            <Map customers={mockCustomers} onSelectCustomer={setSelectedCustomerId} />
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
              {activeCustomer.videoFile ? (
                <video 
                  src={activeCustomer.videoFile} 
                  className="w-full h-full object-cover opacity-90"
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
              <div className="absolute bottom-3 left-3 text-xs font-mono text-white/70 bg-black/50 px-2 py-1 rounded">
                {activeCustomer.camera}
              </div>
            </div>
          </div>

          <div className="bg-card border border-muted rounded-xl p-5 shadow-sm flex-1 flex flex-col">
            <h3 className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI Analysis
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              <div className="p-3 bg-muted/30 rounded-lg border border-muted/50">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Situation Report</p>
                <p className="text-sm leading-relaxed text-foreground">
                  {analysis || "Analyzing video feed..."}
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

export default AdminView;
