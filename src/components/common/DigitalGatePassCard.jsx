import React from 'react';

export const DigitalGatePassCard = ({
  pass,
  onViewPass,
  onCheckout,
  onCopyOtp,
  onShareWhatsApp,
  compact = false
}) => {
  if (!pass) return null;

  const isDelivery = pass.visitorType === 'DELIVERY';
  const isCab = pass.visitorType === 'CAB';
  const isContractor = pass.visitorType === 'CONTRACTOR' || pass.company?.includes('AMC') || pass.workScope;
  const isInside = pass.status === 'INSIDE_PREMISES' || pass.status === 'ACTIVE ON-SITE' || pass.status === 'ACTIVE';
  const isExpected = pass.status === 'EXPECTED' || pass.status === 'PRE-APPROVED';
  const isCompleted = pass.status === 'COMPLETED' || pass.status === 'EXITED';
  const isOverstay = pass.overstay || pass.isFlagged;

  const badgeColor = isDelivery
    ? 'bg-blue-100 text-blue-800 border-blue-200'
    : isCab
    ? 'bg-amber-100 text-amber-900 border-amber-200'
    : isContractor
    ? 'bg-purple-100 text-purple-900 border-purple-200'
    : 'bg-emerald-100 text-emerald-900 border-emerald-200';

  const categoryLabel = pass.visitorCategory || 
    (isDelivery ? 'Delivery Partner' : isCab ? 'Cab / Taxi' : isContractor ? 'Contractor Work' : 'Guest Visitor');

  const categoryIcon = isDelivery
    ? 'local_shipping'
    : isCab
    ? 'local_taxi'
    : isContractor
    ? 'engineering'
    : 'person';

  const otp = pass.otpCode || pass.otp || '4829';
  const passId = pass.id || 'GP-101';
  const title = pass.guestName || pass.company || pass.title || 'Visitor';
  const host = pass.hostUnit || pass.dest || pass.targetUnit || pass.suite || 'Flat A-1204';
  const vehicle = pass.vehicleNumber || (isDelivery ? 'Two-Wheeler (Delivery Bike)' : 'Pedestrian / Walk-in');
  const validDuration = pass.validDuration || (isDelivery ? '30 Mins Express' : '4 Hours Standard');
  const gate = pass.gate || 'Gate 1 North (Main)';

  const isWalkIn = pass.isWalkIn || pass.entryMode === 'WALK_IN' || pass.entryMode === 'Walk-In / On Foot' || pass.vehicleNumber?.toLowerCase().includes('walk-in') || pass.vehicleNumber?.toLowerCase().includes('n/a') || !pass.vehicleNumber;
  const companyName = pass.companyName || pass.company || (isDelivery ? 'Express Delivery' : isCab ? 'Rideshare Cab' : '');

  const getCompanyStyle = (cName) => {
    const c = (cName || '').toLowerCase();
    if (c.includes('amazon')) return 'bg-amber-500 text-slate-950 font-black';
    if (c.includes('zomato')) return 'bg-rose-600 text-white font-bold';
    if (c.includes('swiggy')) return 'bg-orange-500 text-white font-bold';
    if (c.includes('blinkit')) return 'bg-yellow-400 text-slate-950 font-black';
    if (c.includes('uber')) return 'bg-slate-900 text-white font-bold';
    if (c.includes('urban')) return 'bg-purple-700 text-white font-bold';
    if (c.includes('maid') || c.includes('cook')) return 'bg-teal-700 text-white font-bold';
    return 'bg-emerald-700 text-white font-bold';
  };

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
      isOverstay 
        ? 'border-rose-300 ring-2 ring-rose-100' 
        : isInside 
        ? 'border-emerald-300 ring-1 ring-emerald-100' 
        : 'border-[#eaedff]'
    }`}>
      {/* Top Pass Header (Boarding Pass / Security Pass Style) */}
      <div className="bg-gradient-to-r from-slate-900 via-[#131b2e] to-slate-800 text-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-emerald-400">
              <span className="material-symbols-outlined text-base">shield_person</span>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-300">
                Oakridge Heights • Security Pass
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Pass #{passId}</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-emerald-400 font-mono text-[11px]">{gate}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-1">
            {isOverstay ? (
              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs animate-pulse">
                <span className="material-symbols-outlined text-xs">warning</span>
                Overstay &gt;4h
              </span>
            ) : isInside ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Inside Society
              </span>
            ) : isExpected ? (
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                Pre-Approved
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
                Checked Out
              </span>
            )}
          </div>
        </div>

        {/* Category Pill & Company Brand Tag */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
              <span className="material-symbols-outlined text-xs">{categoryIcon}</span>
              <span>{categoryLabel}</span>
            </span>

            {companyName && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase ${getCompanyStyle(companyName)}`}>
                <span className="material-symbols-outlined text-[12px]">domain</span>
                <span>{companyName}</span>
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-300 font-mono">
            {pass.validDate || 'Today'} • {pass.validStartTime || pass.timestamp || 'Active'}
          </span>
        </div>
      </div>

      {/* Center Pass Body */}
      <div className="p-4 flex flex-col gap-3.5">
        {/* Visitor & Destination Block */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-[#131b2e] truncate">{title}</h4>
            <div className="text-xs text-[#6e7b6c] flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-sm text-[#006b2c]">pin_drop</span>
              <span className="font-semibold text-[#131b2e]">{host}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 truncate">{pass.phone || '+91 98450 00112'}</span>
            </div>
          </div>

          {/* Quick QR Mini Badge */}
          <div 
            onClick={() => onViewPass && onViewPass(pass)}
            title="Click to view full scannable QR pass"
            className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0 cursor-pointer hover:bg-slate-200 transition p-1 text-center"
          >
            <span className="material-symbols-outlined text-2xl text-slate-700">qr_code_2</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">View QR</span>
          </div>
        </div>

        {/* Entry Mode Highlight Bar (Walk-In vs Vehicle) */}
        <div className={`p-2 rounded-xl text-xs flex items-center gap-2 border ${
          isWalkIn 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-bold' 
            : 'bg-slate-50 text-slate-800 border-slate-200 font-mono'
        }`}>
          <span className="material-symbols-outlined text-base">
            {isWalkIn ? 'directions_walk' : 'directions_car'}
          </span>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Entry Mode:</span>
            <span>{isWalkIn ? '🚶 Walk-In / Pedestrian Pass (No Vehicle)' : `🚗 Vehicle: ${pass.vehicleNumber || vehicle}`}</span>
          </div>
        </div>

        {/* The 4-Digit Entry OTP Box (The Core Element that Residents & Guards Need) */}
        <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 rounded-xl border border-dashed border-emerald-300 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Gate Entry 4-Digit OTP:
            </span>
            <span className="text-xs text-emerald-700">
              Read out to guard at barrier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-white rounded-lg border border-emerald-300 font-mono font-black text-lg text-emerald-800 tracking-widest shadow-2xs">
              {otp}
            </div>
            <button
              type="button"
              onClick={() => onCopyOtp && onCopyOtp(otp)}
              title="Copy 4-digit OTP"
              className="p-1.5 rounded-lg bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
            </button>
          </div>
        </div>

        {/* Pass Meta Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-[#f2f3ff] p-2.5 rounded-xl">
          <div>
            <span className="text-[10px] text-[#6e7b6c] block font-bold uppercase tracking-wider">Vehicle Plate:</span>
            <span className="font-mono font-semibold text-[#131b2e] truncate block">
              {vehicle}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#6e7b6c] block font-bold uppercase tracking-wider">Permitted Time:</span>
            <span className="font-medium text-[#131b2e] truncate block">
              {validDuration}
            </span>
          </div>
          {pass.numberOfGuests > 1 && (
            <div className="col-span-2 pt-1 border-t border-[#eaedff] flex items-center gap-1.5 text-[#006b2c] font-semibold text-[11px]">
              <span className="material-symbols-outlined text-xs">group</span>
              <span>{pass.numberOfGuests} Persons Authorized ({pass.numberOfGuests - 1} Co-Visitors with group)</span>
            </div>
          )}
          {pass.customTimeNote && (
            <div className="col-span-2 pt-1 border-t border-[#eaedff] text-[11px] text-[#6e7b6c] italic truncate">
              Note: {pass.customTimeNote}
            </div>
          )}
        </div>
      </div>

      {/* Pass Footer Actions */}
      <div className="p-3 bg-slate-50 border-t border-[#eaedff] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewPass && onViewPass(pass)}
          className="flex-1 py-1.5 px-2.5 bg-white hover:bg-slate-100 text-[#131b2e] border border-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
        >
          <span className="material-symbols-outlined text-sm text-[#006b2c]">badge</span>
          <span>View Full Pass</span>
        </button>

        <button
          type="button"
          onClick={() => onShareWhatsApp && onShareWhatsApp(pass)}
          title="Share Gate Pass via WhatsApp"
          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-2xs flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-sm">share</span>
        </button>

        {isInside && onCheckout && (
          <button
            type="button"
            onClick={() => onCheckout(pass.id)}
            className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Record Exit
          </button>
        )}
      </div>
    </div>
  );
};
