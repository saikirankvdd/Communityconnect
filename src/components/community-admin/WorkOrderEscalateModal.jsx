import React, { useState } from 'react';

export const WorkOrderEscalateModal = ({ isOpen, onClose, ticket, onConfirmEscalate }) => {
  if (!isOpen || !ticket) return null;

  const [escalationTier, setEscalationTier] = useState('TIER_1');
  const [escalationReason, setEscalationReason] = useState('SLA Deadline Breached & Resident Impact');
  const [specialInstructions, setSpecialInstructions] = useState(
    'Require Vendor Regional Operations Head on-site within 60 minutes. Apply contractual penalty of ₹2,500/hour for downtime. Dispatch emergency standby technician.'
  );
  const [penaltyNotice, setPenaltyNotice] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmEscalate(ticket.id, {
      escalationTier,
      escalationReason,
      specialInstructions,
      penaltyNotice,
      escalatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#ffdad6] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a]">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Escalate Work Order SLA</h3>
              <p className="text-xs text-[#ba1a1a] font-semibold">Contractual Breach &amp; Emergency Escalation Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6e7b6c] hover:text-[#131b2e] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* What is SLA Escalation Explanatory Banner */}
        <div className="p-3.5 bg-[#fff8f6] rounded-xl border border-[#ffdad6] flex flex-col gap-1 text-xs">
          <span className="font-bold text-[#ba1a1a] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">info</span>
            What does "Escalate" mean in Estate Administration?
          </span>
          <p className="text-[#680003] leading-relaxed">
            Escalating this ticket issues an official legal &amp; contractual notice to the service provider for failing to meet the agreed SLA turnaround time. It alerts the <strong>Executive Managing Committee</strong> and activates <strong>emergency secondary contractor backup</strong>.
          </p>
        </div>

        {/* Ticket Details */}
        <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] text-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#131b2e]">{ticket.title}</span>
            <span className="font-bold text-[#ba1a1a]">{ticket.sla}</span>
          </div>
          <span className="text-[#6e7b6c]">{ticket.assigned} • Ticket #{ticket.id}</span>
        </div>

        {/* Escalation Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="block font-bold text-[#131b2e] mb-1">Select Escalation Level</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEscalationTier('TIER_1')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 cursor-pointer transition-all ${
                  escalationTier === 'TIER_1'
                    ? 'border-[#ba1a1a] bg-[#ffdad6]/40 font-bold text-[#ba1a1a]'
                    : 'border-[#dae2fd] bg-white text-[#131b2e]'
                }`}
              >
                <span className="text-xs">Tier 1: Facility Head</span>
                <span className="text-[10px] text-[#6e7b6c]">60-min deadline</span>
              </button>
              <button
                type="button"
                onClick={() => setEscalationTier('TIER_2')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 cursor-pointer transition-all ${
                  escalationTier === 'TIER_2'
                    ? 'border-[#ba1a1a] bg-[#ffdad6]/40 font-bold text-[#ba1a1a]'
                    : 'border-[#dae2fd] bg-white text-[#131b2e]'
                }`}
              >
                <span className="text-xs">Tier 2: MC Board</span>
                <span className="text-[10px] text-[#6e7b6c]">Penalty Notice</span>
              </button>
              <button
                type="button"
                onClick={() => setEscalationTier('TIER_3')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 cursor-pointer transition-all ${
                  escalationTier === 'TIER_3'
                    ? 'border-[#ba1a1a] bg-[#ffdad6]/40 font-bold text-[#ba1a1a]'
                    : 'border-[#dae2fd] bg-white text-[#131b2e]'
                }`}
              >
                <span className="text-xs">Tier 3: Emergency</span>
                <span className="text-[10px] text-[#6e7b6c]">Alternate Vendor</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#131b2e] mb-1">Escalation Justification</label>
            <select
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium focus:outline-none focus:border-[#ba1a1a]"
            >
              <option value="SLA Deadline Breached & Resident Impact">SLA Deadline Breached &amp; High Resident Discomfort</option>
              <option value="Life Safety or Fire Hazard">Life Safety, Fire Hazard or Trapped Elevator Risk</option>
              <option value="Unresponsive Vendor / Technician No-Show">Unresponsive Vendor / Technician No-Show</option>
              <option value="Repeated Failure After Prior Repairs">Repeated Recurrence After Prior Repair Attempt</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#131b2e] mb-1">
              President / Committee Directives to Service Provider
            </label>
            <textarea
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium focus:outline-none focus:border-[#ba1a1a] resize-none"
            />
          </div>

          <label className="flex items-center gap-2 p-2 bg-[#fff8f6] rounded-xl border border-[#ffdad6] cursor-pointer">
            <input
              type="checkbox"
              checked={penaltyNotice}
              onChange={(e) => setPenaltyNotice(e.target.checked)}
              className="rounded text-[#ba1a1a] focus:ring-[#ba1a1a]"
            />
            <span className="text-xs text-[#ba1a1a] font-bold">
              Invoke contractual breach clause (₹2,500/hour deduction from monthly AMC invoice)
            </span>
          </label>

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
              className="px-5 py-2 rounded-xl bg-[#ba1a1a] text-white hover:bg-[#93000a] font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">emergency</span>
              Issue Official SLA Escalation Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
