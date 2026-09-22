import React, { useState } from 'react';
import { serviceApi } from '../../api/serviceApi';

export const SecurityAccessGrantModal = ({
  isOpen,
  directive,
  onClose,
  onAccessGranted,
  showToast
}) => {
  if (!isOpen || !directive) return null;

  const [officerName, setOfficerName] = useState('Havaldar Ram Singh (Badge #SEC-409)');
  const [idVerified, setIdVerified] = useState(true);
  const [leaseVerified, setLeaseVerified] = useState(true);
  const [keysIssued, setKeysIssued] = useState(true);
  const [guardNotes, setGuardNotes] = useState(
    'Conducted physical inspection & Aadhaar verification at Gate 1 Post. Resident credentials bona fide. Tenancy agreement matches society registry. Authorized for platform login and automated boom barrier ingress.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGrantAccess = (e) => {
    e.preventDefault();
    if (!idVerified || !leaseVerified) {
      if (showToast) showToast('Please check the physical ID and tenancy verification boxes before authorizing access.', 'error');
      return;
    }

    setIsSubmitting(true);
    const updated = serviceApi.grantAccessFromSecurity(directive.id, {
      officer: officerName,
      summary: `Physical inspection verified at Gate 1. Cleared by ${officerName}.`,
      notes: guardNotes,
      clearanceStatus: 'CLEARED',
      accessGranted: true
    });

    setIsSubmitting(false);

    if (showToast) {
      showToast(`Platform access GRANTED by Gate Security for ${directive.targetUnit}! Resident account activated and ANPR barrier synced.`, 'success');
    }

    if (onAccessGranted) onAccessGranted(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-200 flex flex-col overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-emerald-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-xl">security</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Security Gate Resident Clearance</h3>
              <p className="text-[10px] text-emerald-300 font-mono">Grant Official Platform Access &amp; Gate RFID Entry</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGrantAccess} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* President Directive Order Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-xs">priority_high</span>
                President Follow-Up Directive #{directive.id}
              </span>
              <span className="text-[11px] font-mono text-amber-800">
                Unit: <strong className="font-bold">{directive.targetUnit}</strong>
              </span>
            </div>
            <div className="text-xs text-amber-950">
              <strong>President's Instructions:</strong> "{directive.instructions || 'Inspect premises and verify resident documents before granting access.'}"
            </div>
            <div className="text-[10px] text-amber-700">
              Dispatched by President Elena Rostova • {directive.createdAt || 'Today'}
            </div>
          </div>

          {/* Physical Verification Checklist */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Mandatory Guard Clearance Checks:
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={idVerified}
                  onChange={(e) => setIdVerified(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Resident Government ID / Aadhaar Verified</span>
                  <span className="text-slate-500 text-[11px]">Original physical photo ID inspected at Gate 1 or confirmed via resident intercom.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={leaseVerified}
                  onChange={(e) => setLeaseVerified(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Registered Tenancy / Deed Agreement Cleared</span>
                  <span className="text-slate-500 text-[11px]">Occupancy verified for {directive.targetUnit}. No unauthorized sublease or dispute detected.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={keysIssued}
                  onChange={(e) => setKeysIssued(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Vehicle RFID FASTag &amp; Digital Access Tagged</span>
                  <span className="text-slate-500 text-[11px]">Enables automatic barrier arm raising at Gate 1 North and Gate 2 South.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Guard Officer & Notes */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Authorizing Security Officer / Badge:
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Official Security Log Remarks:
              </label>
              <textarea
                rows={3}
                value={guardNotes}
                onChange={(e) => setGuardNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Impact Notice */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-emerald-700 shrink-0">check_circle</span>
            <span>
              Clicking below immediately authorizes full platform access, notifies the President's console, and syncs the resident's ANPR gate pass.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Confirm &amp; Give Platform Access</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
