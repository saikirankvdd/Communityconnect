import React, { useState } from 'react';

export const SecurityDirectiveModal = ({
  isOpen,
  onClose,
  targetUnit = 'Suite A-1204',
  kycId = 'kyc-1',
  existingDirective = null,
  onDispatchDirective,
  onSubmitGuardReport
}) => {
  if (!isOpen) return null;

  const [directiveTitle, setDirectiveTitle] = useState(
    existingDirective?.title || `Physical Unit Inspection & Occupancy Check: ${targetUnit}`
  );
  const [instructions, setInstructions] = useState(
    existingDirective?.instructions ||
      `Conduct physical spot-check of ${targetUnit}. Verify registered lease agreement copy against tenant government ID. Confirm no unauthorized subleasing, examine key handover, and inspect electric meter status.`
  );
  const [priority, setPriority] = useState(existingDirective?.priority || 'HIGH');
  const [assignedOfficer, setAssignedOfficer] = useState(
    existingDirective?.assignedGuard || 'Havaldar Ram Singh (Gate 1 Supervisor • Badge #SEC-409)'
  );

  // Field Report simulation inputs
  const [reportFindings, setReportFindings] = useState(
    `Physical inspection completed at 11:20 AM with Tower Marshal. Inspected tenant credentials with original Aadhaar & registered lease. Verified sole family residential use; zero unauthorized subleasing found. 2 sets of RFID keys handed over and meter reading logged at 48,219 kWh. Cleared for digital gate activation.`
  );
  const [clearanceStatus, setClearanceStatus] = useState('CLEARED');

  const handleDispatch = (e) => {
    e.preventDefault();
    onDispatchDirective({
      kycId,
      targetUnit,
      title: directiveTitle,
      instructions,
      priority,
      assignedGuard: assignedOfficer
    });
  };

  const handleSimulateReport = () => {
    if (!existingDirective) return;
    onSubmitGuardReport(existingDirective.id, {
      officer: assignedOfficer,
      summary: reportFindings,
      clearanceStatus,
      notes: 'All compliance standards verified on-ground. Official seal affixed.'
    });
  };

  const hasReport = existingDirective && existingDirective.fieldReport;

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e2e7ff] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#006591]/10 text-[#006591]">
              <span className="material-symbols-outlined text-xl">shield</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Direct Security Task Directive</h3>
              <p className="text-xs text-[#6e7b6c]">Estate Board ➔ Gate 1 Patrol Terminal Dispatched Order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6e7b6c] hover:text-[#131b2e] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Informational banner about internal workflow */}
        <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#006591]/20 flex items-center gap-2.5 text-xs text-[#006591]">
          <span className="material-symbols-outlined text-base shrink-0">hub</span>
          <span>
            This directive transfers seamlessly into the Security Gate Console. When security executes the field check, their signed report returns directly here to the Board Console.
          </span>
        </div>

        {/* Existing Report View if Submitted */}
        {hasReport ? (
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-[#7ffc97]/20 border border-[#006b2c]/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#006b2c] flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">verified</span>
                  Official Field Inspection Report Received
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#006b2c] text-white text-[10px] font-bold">
                  {existingDirective.fieldReport.clearanceStatus}
                </span>
              </div>
              <div className="text-xs text-[#131b2e] font-semibold">
                Inspected by: {existingDirective.fieldReport.officer} • {existingDirective.fieldReport.timestamp}
              </div>
              <p className="text-xs text-[#3e4a3d] bg-white p-3 rounded-lg border border-[#006b2c]/20 leading-relaxed">
                "{existingDirective.fieldReport.summary}"
              </p>
              <span className="text-[11px] text-[#6e7b6c] italic">
                Note: {existingDirective.fieldReport.notes}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#006b2c] text-white hover:bg-[#00873a] text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">check</span>
                Close &amp; Proceed to Final Approval
              </button>
            </div>
          </div>
        ) : (
          /* Create or Active Directive View */
          <form onSubmit={handleDispatch} className="flex flex-col gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Target Unit / Location</label>
              <input
                type="text"
                value={targetUnit}
                readOnly
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Directive Title</label>
              <input
                type="text"
                value={directiveTitle}
                onChange={(e) => setDirectiveTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium focus:outline-none focus:border-[#006591]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Assigned Security Unit</label>
                <input
                  type="text"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-bold"
                >
                  <option value="IMMEDIATE">Immediate (Priority 1)</option>
                  <option value="HIGH">High (Within 2 Hours)</option>
                  <option value="NORMAL">Standard Daily Inspection</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">
                Investigation Instructions &amp; Checkpoints
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium focus:outline-none focus:border-[#006591] resize-none"
              />
            </div>

            {/* Quick Simulate Section for Instant Demo */}
            {existingDirective && existingDirective.status === 'DISPATCHED_TO_SECURITY' && (
              <div className="p-3 bg-[#fff8e1] rounded-xl border border-[#ffecb3] flex flex-col gap-2">
                <span className="font-bold text-[#b78103] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">pending_actions</span>
                  Task Dispatched: Awaiting Security Field Check
                </span>
                <p className="text-[11px] text-[#795548]">
                  Security Guard at Gate 1 has received this prompt on their terminal. Click below to simulate the guard completing the check and sending the formal report back to you.
                </p>
                <button
                  type="button"
                  onClick={handleSimulateReport}
                  className="px-3.5 py-1.5 bg-[#b78103] hover:bg-[#8d6200] text-white rounded-lg font-bold text-xs shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                  Simulate Security Guard Submitting Inspection Report
                </button>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#006591] text-white hover:bg-[#004f72] font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">send</span>
                Dispatch Directive Directly to Security
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
