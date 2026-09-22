import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  User, 
  ChevronDown, 
  Layers, 
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const Header = ({ 
  currentUser, 
  onLogout, 
  activeView, 
  currentView,
  onNavigate 
}) => {
  const currentActiveView = activeView || currentView;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'PLATFORM_ADMIN':
        return { label: 'Platform Admin', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'COMMUNITY_ADMIN':
        return { label: 'Community President', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'RESIDENT':
        return { label: 'Verified Resident', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'SERVICE_PROVIDER':
        return { label: 'Service Provider', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'SECURITY_TEAM':
        return { label: 'Security Gate Team', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: 'Member', bg: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const badge = currentUser ? getRoleBadge(currentUser.role) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Tagline (from Reference Images) */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            {/* Custom CommunityConnect Icon: Green Home with Interconnected Network Nodes */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <circle cx="9" cy="12" r="1.5" fill="currentColor" />
                <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                <path d="M9 12h6" />
                <path d="M9 12l3 4 3-4" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-display tracking-tight text-[#16A34A]">
                  Community<span className="text-[#0EA5E9]">Connect</span>
                </span>
                <span className="hidden md:inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Secure • Verified • Scalable
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                One Platform. Many Communities. Better Living.
              </p>
            </div>
          </div>

          {/* Right Action & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="relative">
                <div 
                  className="flex items-center gap-2 p-1 pl-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full cursor-pointer transition"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="text-right hidden sm:block leading-tight pr-1">
                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1 justify-end">
                      <span>{currentUser.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium">
                      {currentUser.communityName ? `${currentUser.communityName} • ` : ''}
                      {badge?.label}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-emerald-500/20 shadow-xs uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 mr-1" />
                </div>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-bold text-xs text-gray-900">{currentUser.name}</div>
                      <div className="text-[11px] text-gray-500 truncate">{currentUser.email}</div>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge?.bg}`}>
                        {badge?.label}
                      </span>
                    </div>

                    <div className="py-1 text-xs text-gray-700">
                      {currentUser.communityName && (
                        <div className="px-4 py-1.5 text-[11px] text-gray-600 bg-gray-50">
                          Community: <strong className="text-gray-900">{currentUser.communityName}</strong>
                          {currentUser.flatNumber && <span> (Flat {currentUser.flatNumber})</span>}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          if (currentUser.role === 'PLATFORM_ADMIN') onNavigate('platform-admin');
                          else if (currentUser.role === 'COMMUNITY_ADMIN') onNavigate('community-admin');
                          else if (currentUser.role === 'RESIDENT') onNavigate('resident');
                          else if (currentUser.role === 'SERVICE_PROVIDER') onNavigate('provider');
                          else if (currentUser.role === 'SECURITY_TEAM') onNavigate('security-gate');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {currentUser.role === 'PLATFORM_ADMIN' && 'Platform Governance'}
                          {currentUser.role === 'COMMUNITY_ADMIN' && 'Community Operations'}
                          {currentUser.role === 'RESIDENT' && 'Resident Hub'}
                          {currentUser.role === 'SERVICE_PROVIDER' && 'Provider Network'}
                          {currentUser.role === 'SECURITY_TEAM' && 'Gate Terminal'}
                        </span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  Register Resident
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
