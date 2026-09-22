import React, { useState } from 'react';
import { User, Role } from '../../types';
import { BrandLogo } from './BrandLogo';
import { 
  Bell, 
  PhoneCall, 
  LogOut, 
  CheckCircle2, 
  Building2, 
  Search, 
  ChevronDown,
  Shield,
  Key,
  User as UserIcon,
  X
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  activeConsoleTitle?: string;
  onOpenQuickSwitcher?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  activeConsoleTitle,
  onOpenQuickSwitcher
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Flat A-1204 Conflict Inspection Cleared',
      desc: 'Havaldar Ram Singh verified key surrender & luggage departure for Rahul G.',
      time: '12m ago',
      type: 'VERIFICATION'
    },
    {
      id: 2,
      title: 'Group AC Servicing Reached 18/20',
      desc: 'Only 2 more units required from Tower A/B to unlock ₹499 group rate.',
      time: '34m ago',
      type: 'GROUP_DEMAND'
    },
    {
      id: 3,
      title: 'Gate 1 ANPR Alert',
      desc: 'Amazon Logistics vehicle TS 07 EK 9912 admitted with verified pass.',
      time: '1h ago',
      type: 'SECURITY'
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand and Scope */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <BrandLogo size="md" />

            {/* Scope / Community Badge */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-1.5 text-xs text-gray-700">
              <Building2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="font-semibold text-gray-900">
                {currentUser?.communityName || 'Oakridge Heights'}
              </span>
              {currentUser?.unit && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600 font-medium">{currentUser.unit}</span>
                </>
              )}
              {currentUser?.role === 'PLATFORM_ADMIN' && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Root Scope
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-3">
            {/* Live System Sync Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-[11px]">System Online • Synced</span>
            </div>

            {/* Emergency Hotline / Quick Contact */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/70 px-2.5 py-1 rounded-full">
              <PhoneCall className="w-3 h-3 text-rose-600" />
              <span>Gate 1 Hot-Line #108</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#16A34A] rounded-full ring-2 ring-white"></span>
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
                      <Bell className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Live Event Feed</span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-900">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill & Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-50 rounded-xl border border-gray-200 transition"
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-[#16A34A]/10 border border-[#16A34A]/20 flex items-center justify-center shrink-0">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <div className="hidden md:flex flex-col items-start text-left">
                    <span className="text-xs font-semibold text-gray-900 leading-none">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5 mr-1" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50">
                    <div className="p-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {currentUser.role}
                        </span>
                        {currentUser.unit && (
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {currentUser.unit}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Gateway</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
