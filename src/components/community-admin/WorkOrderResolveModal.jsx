import React, { useState } from 'react';

export const WorkOrderResolveModal = ({ isOpen, onClose, ticket, onConfirmResolve }) => {
  if (!isOpen || !ticket) return null;

  const [technicianName, setTechnicianName] = useState(ticket.assigned || 'Lead Field Technician');
  const [resolutionSummary, setResolutionSummary] = useState(
    `Replaced worn safety sensor, recalibrated operating thresholds, and executed 3 full automated safety test cycles. All readings normal and compliant with estate maintenance standards.`
  );
  const [partsReplaced, setPartsReplaced] = useState('Optical safety sensor & cable harness');
  const [spareCost, setSpareCost] = useState('4850');
  const [qualityChecks, setQualityChecks] = useState({
    physicalTest: true,
    siteCleaned: true,
    residentSignoff: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmResolve(ticket.id, {
      technicianName,
      resolutionSummary,
      partsReplaced,
      spareCost: Number(spareCost) || 0,
      resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e7ff] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#7ffc97]/40 text-[#006b2c]">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Mark Work Order Resolved</h3>
              <p className="text-xs text-[#6e7b6c]">Ticket #{ticket.id} • SLA Compliance Audit Sign-off</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6e7b6c] hover:text-[#131b2e] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Ticket Summary Card */}
        <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#131b2e]">{ticket.title}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
              {ticket.urgency}
            </span>
          </div>
          <p className="text-xs text-[#6e7b6c]">{ticket.assigned} • Target SLA: {ticket.sla}</p>
        </div>

        {/* Resolution Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="block font-bold text-[#131b2e] mb-1">
              Field Technician / Engineer Sign-off
            </label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium focus:outline-none focus:border-[#006b2c]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#131b2e] mb-1">
              Work Completed &amp; Resolution Summary
            </label>
            <textarea
              rows={3}
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium focus:outline-none focus:border-[#006b2c] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#131b2e] mb-1">
                Spare Parts Replaced
              </label>
              <input
                type="text"
                value={partsReplaced}
                onChange={(e) => setPartsReplaced(e.target.value)}
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium focus:outline-none focus:border-[#006b2c]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#131b2e] mb-1">
                Incurred Cost (₹)
              </label>
              <input
                type="number"
                value={spareCost}
                onChange={(e) => setSpareCost(e.target.value)}
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium focus:outline-none focus:border-[#006b2c]"
              />
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="p-3 bg-[#f2f3ff] rounded-xl flex flex-col gap-2 mt-1">
            <span className="font-bold text-[#131b2e]">Quality &amp; Safety Compliance Verification:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={qualityChecks.physicalTest}
                onChange={(e) => setQualityChecks({ ...qualityChecks, physicalTest: e.target.checked })}
                className="rounded text-[#006b2c] focus:ring-[#006b2c]"
              />
              <span className="text-[#3e4a3d]">Physical operational test conducted on-site</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={qualityChecks.siteCleaned}
                onChange={(e) => setQualityChecks({ ...qualityChecks, siteCleaned: e.target.checked })}
                className="rounded text-[#006b2c] focus:ring-[#006b2c]"
              />
              <span className="text-[#3e4a3d]">Work area sanitized &amp; debris cleared</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={qualityChecks.residentSignoff}
                onChange={(e) => setQualityChecks({ ...qualityChecks, residentSignoff: e.target.checked })}
                className="rounded text-[#006b2c] focus:ring-[#006b2c]"
              />
              <span className="text-[#3e4a3d]">Tower Marshal / Resident sign-off verified</span>
            </label>
          </div>

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
              className="px-5 py-2 rounded-xl bg-[#006b2c] text-white hover:bg-[#00873a] font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              Confirm &amp; Close Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
