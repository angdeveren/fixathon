import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle2, ChevronRight, Users } from 'lucide-react';
import { mockCustomers } from '../data/mockCustomers';

function AdminView() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sky Command Admin</h1>
              <p className="text-sm text-muted-foreground">Global Surveillance Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">Admin Access</span>
            </div>
          </div>
        </header>

        <main>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            Active Alerts
          </h2>

          <div className="grid gap-4">
            {mockCustomers.map((customer) => (
              <Link 
                to={`/admin/customer/${customer.id}`} 
                key={customer.id}
                className="group block bg-card border border-white/5 hover:border-primary/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      customer.status === 'ALARM_ACTIVE' 
                        ? 'bg-danger/10 text-danger animate-pulse' 
                        : 'bg-green-500/10 text-green-500'
                    }`}>
                      {customer.status === 'ALARM_ACTIVE' ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                      <p className={`font-medium ${
                        customer.status === 'ALARM_ACTIVE' ? 'text-danger' : 'text-green-500'
                      }`}>
                        {customer.status.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Camera</p>
                      <p className="font-medium text-foreground">{customer.camera}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Event</p>
                      <p className="font-medium text-foreground">{customer.timestamp}</p>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminView;
