import React from 'react';

export const DigitalGatePassModal = ({
  isOpen,
  pass,
  onClose,
  onCheckout,
  onShareWhatsApp,
  showToast
}) => {
  if (!isOpen || !pass) return null;

  const isDelivery = pass.visitorType === 'DELIVERY';
  const isCab = pass.visitorType === 'CAB';
  const isContractor = pass.visitorType === 'CONTRACTOR' || pass.company?.includes('AMC') || pass.workScope;
  const isInside = pass.status === 'INSIDE_PREMISES' || pass.status === 'ACTIVE ON-SITE' || pass.status === 'ACTIVE';
  const isExpected = pass.status === 'EXPECTED' || pass.status === 'PRE-APPROVED';
  const isOverstay = pass.overstay || pass.isFlagged;

  const otp = pass.otpCode || pass.otp || '4829';
  const passId = pass.id || 'GP-101';
  const title = pass.guestName || pass.company || pass.title || 'Visitor';
  const host = pass.hostUnit || pass.dest || pass.targetUnit || pass.suite || 'Flat A-1204';
  const vehicle = pass.vehicleNumber || (isDelivery ? 'Two-Wheeler (Delivery Rider)' : 'Pedestrian / Walk-in');
  const validDuration = pass.validDuration || (isDelivery ? '30 Mins Express Delivery' : '4 Hours Standard Visit');
  const gate = pass.gate || 'Gate 1 North (Main Boom Barrier)';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `*OFFICIAL GATE PASS - OAKRIDGE HEIGHTS*\nPass ID: #${passId}\nVisitor: ${title}\nDestination: ${host}\nGate Check-in OTP: *${otp}*\nVehicle: ${vehicle}\nValid: ${pass.validDate || 'Today'} (${validDuration})\nBarrier: ${gate}\n\nPlease show this 4-digit OTP or pass to security at the gate barrier.`;
    navigator.clipboard?.writeText(text);
    if (showToast) showToast('Gate Pass text copied to clipboard in shareable WhatsApp format!', 'success');
  };

  const isWalkIn = pass.isWalkIn || pass.entryMode === 'WALK_IN' || pass.entryMode === 'Walk-In / On Foot' || pass.vehicleNumber?.toLowerCase().includes('walk-in') || pass.vehicleNumber?.toLowerCase().includes('n/a') || !pass.vehicleNumber;
  const companyName = pass.companyName || pass.company || (isDelivery ? 'Express Logistics' : isCab ? 'Rideshare Cab' : '');

  const getCompanyStyle = (cName) => {
    const c = (cName || '').toLowerCase();
    if (c.includes('amazon')) return 'bg-amber-500 text-slate-950 border-amber-400 font-black';
    if (c.includes('zomato')) return 'bg-rose-600 text-white border-rose-500 font-bold';
    if (c.includes('swiggy')) return 'bg-orange-500 text-white border-orange-400 font-bold';
    if (c.includes('blinkit')) return 'bg-yellow-400 text-slate-950 border-yellow-300 font-black';
    if (c.includes('uber')) return 'bg-slate-900 text-white border-slate-700 font-bold';
    if (c.includes('urban')) return 'bg-purple-700 text-white border-purple-600 font-bold';
    if (c.includes('maid') || c.includes('cook') || c.includes('help')) return 'bg-teal-700 text-white border-teal-600 font-bold';
    return 'bg-emerald-700 text-white border-emerald-600 font-bold';
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Close Bar */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">verified</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Official Digital Gate Pass
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* The Printable Pass Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          {/* Authentic Pass Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Oakridge Heights Security Command</span>
            </div>

            {/* Company / Brand Banner Chip if available */}
            {companyName && (
              <div className={`px-4 py-1.5 rounded-xl border shadow-xs text-xs tracking-wide uppercase mb-2 inline-flex items-center gap-2 ${getCompanyStyle(companyName)}`}>
                <span className="material-symbols-outlined text-sm">domain</span>
                <span>{companyName}</span>
              </div>
            )}

            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isDelivery ? 'EXPRESS DELIVERY GATE PASS' : isCab ? 'CAB ENTRY PERMIT' : isContractor ? 'SERVICE CONTRACTOR PASS' : 'GUEST VISITOR PASS'}
            </h2>

            {/* Entry Mode Pill: Walk-In vs Vehicle */}
            <div className="mt-2 flex items-center justify-center gap-2">
              {isWalkIn ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">directions_walk</span>
                  <span>🚶 Walk-In / Pedestrian Pass (No Vehicle)</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-sm">directions_car</span>
                  <span>🚗 Vehicle: {pass.vehicleNumber || 'Registered Motor Vehicle'}</span>
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 font-mono mt-2">
              SERIAL REF: <strong className="text-slate-800">#{passId}</strong> • ISSUED: {pass.validDate || 'Today'}, {pass.validStartTime || pass.timestamp || 'Active'}
            </div>
          </div>

          {/* Central QR Code & Entry OTP Showcase */}
          <div className="bg-gradient-to-b from-slate-50 to-emerald-50/40 p-5 rounded-2xl border border-emerald-200/80 flex flex-col items-center text-center gap-3">
            {/* Simulated Scannable QR Graphic */}
            <div className="relative p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-36 h-36 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-between text-white font-mono text-[9px] relative overflow-hidden">
                {/* SVG QR Pattern Simulation */}
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex justify-between w-full">
                    <div className="w-8 h-8 border-4 border-white bg-slate-900 p-1 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-0.5 w-12 h-8 opacity-75">
                      <div className="bg-white"></div><div></div><div className="bg-white"></div><div></div>
                      <div></div><div className="bg-white"></div><div></div><div className="bg-white"></div>
                    </div>
                    <div className="w-8 h-8 border-4 border-white bg-slate-900 p-1 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white"></div>
                    </div>
                  </div>

                  {/* Center QR Matrix */}
                  <div className="flex items-center justify-center py-1">
                    <div className="p-1 bg-white text-slate-900 rounded font-black text-[9px] tracking-widest">
                      GATE 1
                    </div>
                  </div>

                  <div className="flex justify-between w-full">
                    <div className="w-8 h-8 border-4 border-white bg-slate-900 p-1 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-0.5 w-12 h-8 opacity-75">
                      <div></div><div className="bg-white"></div><div></div><div className="bg-white"></div>
                      <div className="bg-white"></div><div></div><div className="bg-white"></div><div></div>
                    </div>
                    <div className="w-8 h-8 border-2 border-dashed border-emerald-400 p-1 flex items-center justify-center text-emerald-400 text-[10px]">
                      ✔
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1.5">
                Scan at Lane 1 / 2 Terminal
              </span>
            </div>

            {/* Giant 4-Digit Entry OTP */}
            <div className="w-full max-w-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">
                GATE ENTRY 4-DIGIT CHECK-IN OTP:
              </span>
              <div className="flex items-center justify-center gap-2">
                <div className="px-6 py-2 bg-white rounded-xl border-2 border-dashed border-emerald-500 font-mono font-black text-3xl text-emerald-800 tracking-[0.3em] shadow-sm">
                  {otp}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(otp);
                    if (showToast) showToast(`OTP #${otp} copied!`, 'success');
                  }}
                  title="Copy OTP"
                  className="p-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-700 hover:text-white transition cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                </button>
              </div>
              <p className="text-[11px] text-emerald-700 leading-tight pt-1">
                Show this code to the guard at Gate 1 or Gate 2. The boom barrier arm will raise automatically.
              </p>
            </div>
          </div>

          {/* Structured Visitor & Host Credentials */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-3">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Visitor / Person Name:
                </span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {title}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {pass.phone || '+91 98450 00112'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Destination Flat / Suite:
                </span>
                <span className="font-bold text-emerald-800 text-sm block mt-0.5">
                  {host}
                </span>
                <span className="text-[11px] text-slate-500">
                  Oakridge Heights
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Entry Mode / Transit:
                </span>
                <span className={`font-semibold text-slate-800 block mt-0.5 ${isWalkIn ? 'text-emerald-800 font-bold' : 'font-mono'}`}>
                  {isWalkIn ? '🚶 Walk-In / Pedestrian Pass' : `🚗 Vehicle: ${pass.vehicleNumber || 'Motor Vehicle'}`}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Valid Duration:
                </span>
                <span className="font-semibold text-slate-800 block mt-0.5">
                  {validDuration}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Authorized Entry Gate:
                </span>
                <span className="font-medium text-slate-700 block mt-0.5">
                  {gate}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Current Status:
                </span>
                <span className={`inline-flex items-center gap-1 font-bold mt-0.5 ${
                  isOverstay ? 'text-rose-600' : isInside ? 'text-emerald-700' : 'text-blue-700'
                }`}>
                  {isInside ? '● Inside Premises' : isExpected ? '○ Pre-Approved (Expected)' : 'Checked Out'}
                </span>
              </div>
            </div>

            {pass.numberOfGuests > 1 && (
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700">
                <span className="font-bold block text-[11px] text-emerald-800">
                  👥 Group Pass Authorized for {pass.numberOfGuests} Persons
                </span>
                {pass.additionalGuests && pass.additionalGuests.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {pass.additionalGuests.map((ag, i) => (
                      <div key={i} className="text-[10px] text-slate-600">
                        • {ag.name} ({ag.phone}) {ag.vehicle ? `[${ag.vehicle}]` : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Barcode Footer Simulation */}
          <div className="pt-2 text-center">
            <div className="h-9 w-full bg-[repeating-linear-gradient(90deg,#0f172a_0px,#0f172a_2px,transparent_2px,transparent_4px,#0f172a_4px,#0f172a_7px,transparent_7px,transparent_9px)] rounded opacity-80 mb-1"></div>
            <div className="font-mono text-[10px] tracking-widest text-slate-500">
              * CC-{passId}-{otp} *
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              <span>Copy Pass</span>
            </button>

            <button
              type="button"
              onClick={() => onShareWhatsApp && onShareWhatsApp(pass)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              <span>Share WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print Slip</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isInside && onCheckout && (
              <button
                type="button"
                onClick={() => {
                  onCheckout(pass.id);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                Record Gate Exit
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
