import React, { useState } from 'react';
import { PRECONFIGURED_USERS } from '../../data/initialData';
import { 
  Terminal, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown, 
  ShieldCheck, 
  Users, 
  Check, 
  Layers, 
  Sparkles, 
  KeyRound 
} from 'lucide-react';

export const DeveloperSandboxBar = ({
  currentUser,
  activeView,
  currentView,
  onNavigate,
  onQuickLogin,
  onSelectPersona,
  onResetData
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleLogin = onQuickLogin || onSelectPersona;
  const currentActiveView = activeView || currentView;

  return (
    <div className="fixed bottom-3 right-3 z-50 max-w-[calc(100vw-24px)] transition-all duration-300">
      <div className="bg-[#0F172A]/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 p-3 text-xs">
        {/* Bar Header */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold text-[11px] text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>ROLE SANDBOX &amp; DEMO PERSONAS</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
            >
              {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

          {!collapsed && (
            <div className="mt-2.5 space-y-2.5">
              {/* Quick 1-Click Persona Authentication (Section 12 / Demo readiness) */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>1-Click Switch Persona:</span>
                  <span className="text-emerald-400">Current: {currentUser ? currentUser.role : 'Guest'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {PRECONFIGURED_USERS.map((persona) => {
                    const isActive = currentUser && currentUser.email === persona.email;
                    return (
                      <button
                        key={persona.id}
                        onClick={() => handleLogin && handleLogin(persona)}
                        className={`px-2 py-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-start transition text-left cursor-pointer border ${
                          isActive
                            ? 'bg-emerald-600/90 text-white border-emerald-400 ring-1 ring-emerald-400'
                            : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700/90'
                        }`}
                      >
                        <span className="truncate w-full font-bold">{persona.name.split(' ')[0]}</span>
                        <span className="text-[9px] opacity-75 truncate w-full">
                          {persona.role.replace('_', ' ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer controls: Sign Out / Guest, Reset Data */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[10px]">
                <div className="text-slate-400 font-mono">
                  {currentUser ? (
                    <span>Authenticated as: <strong className="text-white">{currentUser.name}</strong></span>
                  ) : (
                    <span className="text-amber-400">Public Mode (Unauthenticated)</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                  {currentUser && (
                    <button
                      onClick={() => {
                        if (onNavigate) onNavigate('landing');
                        // trigger logout if available via quick login or reset
                        if (handleLogin) handleLogin(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
                      title="Log out and return to public gateway"
                    >
                      Sign Out (Guest)
                    </button>
                  )}

                  <button
                    onClick={onResetData}
                    className="px-2.5 py-1 rounded-lg font-medium bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 flex items-center gap-1 transition cursor-pointer"
                    title="Reset all localStorage demo data back to clean initial state"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset Demo Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};
