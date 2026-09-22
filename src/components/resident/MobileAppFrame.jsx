import React from 'react';
import { X, Smartphone, Wifi, Battery, Signal } from 'lucide-react';

export const MobileAppFrame = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative max-h-[96vh] flex flex-col items-center">
        
        {/* Floating control bar above phone */}
        <div className="w-full max-w-[390px] flex items-center justify-between pb-2 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Stitch Mobile App Preview · Resident Viewport</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            title="Close mobile preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Realistic iPhone / Smartphone Chassis Frame */}
        <div className="w-[380px] h-[780px] max-h-[90vh] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/20 flex flex-col relative overflow-hidden">
          
          {/* Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-3"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-950/80"></div>
          </div>

          {/* Screen Content Container */}
          <div className="w-full h-full bg-[#FAF8F5] rounded-[38px] overflow-hidden flex flex-col relative">
            
            {/* Status Bar */}
            <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-gray-800 shrink-0 select-none bg-white/60 backdrop-blur-xs z-40">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-gray-700">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Scrollable App Body */}
            <div className="flex-1 overflow-y-auto relative">
              {children}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="h-4 w-full flex items-center justify-center bg-white shrink-0 pointer-events-none">
              <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
