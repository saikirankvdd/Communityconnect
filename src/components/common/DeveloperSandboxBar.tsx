import React, { useState } from 'react';
import { User, Role } from '../../types';
import { PRECONFIGURED_PERSONAS } from '../../api/authApi';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Home, 
  Shield, 
  Wrench, 
  ChevronDown, 
  ChevronUp, 
  KeyRound, 
  RefreshCw,
  SlidersHorizontal,
  Lock
} from 'lucide-react';

interface DeveloperSandboxBarProps {
  currentUser: User | null;
  activeConsole: 'login' | 'platform-admin' | 'community-admin' | 'resident' | 'security-gate';
  onSelectConsole: (console: 'login' | 'platform-admin' | 'community-admin' | 'resident' | 'security-gate') => void;
  onQuickLogin: (persona: typeof PRECONFIGURED_PERSONAS[0]) => void;
  onResetData: () => void;
}

export const DeveloperSandboxBar: React.FC<DeveloperSandboxBarProps> = ({
  currentUser,
  activeConsole,
  onSelectConsole,
  onQuickLogin,
  onResetData
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [showPersonaMenu, setShowPersonaMenu] = useState<boolean>(false);

  return (
    <aside 
      id="dev-sandbox-root" 
      aria-label="Developer Sandbox Controls"
      className="fixed bottom-3 right-3 z-50 transition-all duration-300 max-w-[calc(100vw-24px)]"
    >
      <div className="bg-[#0F172A] text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3 backdrop-blur-md">
        {/* Top bar header */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide text-emerald-400 font-mono">DEV SANDBOX</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden md:inline text-[11px]">
              Multi-Tenant Architecture Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 font-mono truncate max-w-[130px]">
                {currentUser.role}: {currentUser.name.split(' ')[0]}
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Collapse developer sandbox" : "Expand developer sandbox"}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Sandbox Controls */}
        {isOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex flex-col gap-2">
            {/* Quick Screen Console Switcher */}
            <div>
              <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
                <span>Jump to Screen Console:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 text-xs">
                <button
                  onClick={() => onSelectConsole('login')}
                  className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition font-medium text-[11px] ${
                    activeConsole === 'login'
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Lock className="w-3 h-3 text-emerald-300" />
                  <span>1. Login Gate</span>
                </button>

                <button
                  onClick={() => onSelectConsole('platform-admin')}
                  className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition font-medium text-[11px] ${
                    activeConsole === 'platform-admin'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Building2 className="w-3 h-3 text-blue-300" />
                  <span>2. Platform Admin</span>
                </button>

                <button
                  onClick={() => onSelectConsole('community-admin')}
                  className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition font-medium text-[11px] ${
                    activeConsole === 'community-admin'
                      ? 'bg-purple-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-purple-300" />
                  <span>3. Community Admin</span>
                </button>

                <button
                  onClick={() => onSelectConsole('resident')}
                  className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition font-medium text-[11px] ${
                    activeConsole === 'resident'
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Home className="w-3 h-3 text-emerald-300" />
                  <span>4. Resident Portal</span>
                </button>

                <button
                  onClick={() => onSelectConsole('security-gate')}
                  className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition font-medium text-[11px] ${
                    activeConsole === 'security-gate'
                      ? 'bg-amber-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Shield className="w-3 h-3 text-amber-300" />
                  <span>5. Security Terminal</span>
                </button>
              </div>
            </div>

            {/* Persona Switcher Quick Launchers */}
            <div className="pt-1.5 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Auto-Fill Credentials:</span>
                <div className="flex flex-wrap gap-1">
                  {PRECONFIGURED_PERSONAS.map((p) => (
                    <button
                      key={p.role}
                      onClick={() => onQuickLogin(p)}
                      title={`Simulate Spring Security login as ${p.name} (${p.title})`}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[10px] border border-slate-700 flex items-center gap-1 transition"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{p.title.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={onResetData}
                title="Restore default mock societies, 7-step cases, and group demand pools"
                className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 hover:underline ml-auto"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
