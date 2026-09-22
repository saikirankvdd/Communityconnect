import React, { useState } from 'react';

export const CreateWorkOrderModal = ({ isOpen, onClose, onSaveTicket, showToast }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '',
    category: 'lifts',
    urgency: 'P1 CRITICAL',
    location: 'Tower A (High-Rise)',
    contractor: 'Otis Elevators AMC (Lead Tech Suresh K.)',
    description: '',
    estimatedCost: '₹0 (Under AMC Coverage)'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('Please enter a work order title', 'error');
      return;
    }

    const iconMap = {
      lifts: 'elevator',
      water: 'water_drop',
      electrical: 'electric_meter',
      fire: 'fire_extinguisher',
      hvac: 'hvac',
      civil: 'handyman'
    };

    const slaMap = {
      'P1 CRITICAL': 'SLA: 2 hr Emergency Response (1 hr 55m remaining)',
      'P2 URGENT': 'SLA: 6 hr Response Window (5 hr 40m remaining)',
      'P3 ROUTINE': 'SLA: 24 hr Standard Turnaround',
      'P2 SCHEDULED': 'Scheduled PM Protocol'
    };

    const newTicket = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      icon: iconMap[formData.category] || 'build',
      title: formData.title,
      urgency: formData.urgency,
      assigned: `${formData.contractor} • ${formData.location}`,
      sla: slaMap[formData.urgency] || 'SLA in progress',
      cat: `${formData.urgency.toLowerCase().includes('p1') ? 'critical ' : ''}${formData.category}`,
      location: formData.location,
      contractor: formData.contractor,
      description: formData.description || 'Routine dispatch logged by Estate President',
      cost: formData.estimatedCost,
      reportedAt: 'Just now',
      resolved: false
    };

    onSaveTicket(newTicket);
    showToast(`Work Order #${newTicket.id} dispatched to contractor.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#006b2c]/10 text-[#006b2c]">
              <span className="material-symbols-outlined text-xl">build_circle</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Dispatch Maintenance Work Order</h3>
              <p className="text-xs text-[#6e7b6c]">Contractual SLA Tracking &amp; Vendor Notification</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#6e7b6c] hover:text-[#131b2e] rounded-full cursor-pointer hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="font-bold text-[#131b2e] block mb-1">Work Order / Asset Issue Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Tower B Lift #1 Cable Governor Vibration"
              className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Asset Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
              >
                <option value="lifts">Elevators &amp; Lifts</option>
                <option value="water">Water STP &amp; Pumps</option>
                <option value="electrical">Power DG &amp; Panels</option>
                <option value="fire">Fire &amp; Life Safety</option>
                <option value="hvac">HVAC &amp; Club Chiller</option>
                <option value="civil">Civil &amp; Plumbing</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Priority / Contractual SLA</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-bold focus:bg-white focus:outline-none"
              >
                <option value="P1 CRITICAL">P1 CRITICAL (2-Hour SLA)</option>
                <option value="P2 URGENT">P2 URGENT (6-Hour SLA)</option>
                <option value="P3 ROUTINE">P3 ROUTINE (24-Hour SLA)</option>
                <option value="P2 SCHEDULED">SCHEDULED PM (Preventive)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Tower / Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
              >
                <option value="Tower A (High-Rise)">Tower A (High-Rise)</option>
                <option value="Tower B (Mid-Rise)">Tower B (Mid-Rise)</option>
                <option value="Tower C (High-Rise)">Tower C (High-Rise)</option>
                <option value="Tower D (Park View)">Tower D (Park View)</option>
                <option value="Central Clubhouse">Central Clubhouse</option>
                <option value="Basement 1 &amp; 2 Utility">Basement 1 &amp; 2 Utility</option>
                <option value="STP &amp; Pump Enclosure">STP &amp; Pump Enclosure</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Assigned Vendor / AMC</label>
              <select
                value={formData.contractor}
                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
              >
                <option value="Otis Elevators AMC (Lead Tech Suresh K.)">Otis Elevators AMC</option>
                <option value="Kirloskar DG Power AMC (Eng. Vikram)">Kirloskar DG Power</option>
                <option value="Ion Exchange STP Services (Ramesh)">Ion Exchange STP</option>
                <option value="AquaPure Plumbing Services">AquaPure Plumbing</option>
                <option value="Siemens Electrical Switchgear">Siemens Switchgear</option>
                <option value="Estate In-House MEP Staff">In-House MEP Staff</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-[#131b2e] block mb-1">Operational Description &amp; Scope</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe symptoms, affected units, or specific parts requiring inspection..."
              className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#e2e7ff]/40 rounded-xl border border-[#eaedff] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#131b2e] block">Contractual AMC Billing</span>
              <span className="text-[#6e7b6c]">Covered under Annual Comprehensive Maintenance Contract</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#006b2c]/10 text-[#006b2c] font-bold">₹0 Direct Cost</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#6e7b6c] hover:bg-gray-100 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Dispatch Work Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
