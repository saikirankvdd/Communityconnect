import React, { useState } from 'react';

export const IssueVendorPassModal = ({ isOpen, onClose, onIssuePass, showToast }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    company: 'Asian Paints',
    technicianName: '',
    phone: '',
    crewCount: '4',
    towerZone: 'Tower C - Facade Scaffolding',
    workScope: 'Exterior Weatherproof Emulsion Painting',
    gate: 'Gate 2 (Commercial/Service)',
    validUntil: 'Today, 07:00 PM'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.technicianName) {
      showToast('Please specify the lead technician name.', 'error');
      return;
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const newPass = {
      id: `VND-${Math.floor(1000 + Math.random() * 9000)}`,
      company: formData.company,
      leadTech: formData.technicianName,
      phone: formData.phone || '+91 98450 11928',
      crewCount: parseInt(formData.crewCount, 10) || 1,
      towerZone: formData.towerZone,
      workScope: formData.workScope,
      gate: formData.gate,
      otpCode,
      validUntil: formData.validUntil,
      issuedAt: 'Just now',
      status: 'AUTHORIZED'
    };

    onIssuePass(newPass);
    showToast(`Gate Pass #${newPass.id} issued (Entry OTP: ${otpCode})`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#006591]/10 text-[#006591]">
              <span className="material-symbols-outlined text-xl">badge</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Issue Temporary Vendor Pass</h3>
              <p className="text-xs text-[#6e7b6c]">Instant Gate Security Clearance &amp; OTP Generation</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Company / Contractor</label>
              <select
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-bold focus:bg-white focus:outline-none"
              >
                <option value="Asian Paints">Asian Paints</option>
                <option value="Urban Company">Urban Company</option>
                <option value="Daikin HVAC">Daikin HVAC</option>
                <option value="Airtel Fibernet">Airtel Fibernet</option>
                <option value="Otis Elevator Co.">Otis Elevator Co.</option>
                <option value="Schneider Electric">Schneider Electric</option>
                <option value="Independent Contractor">Independent Contractor</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Crew Size (Persons)</label>
              <input
                type="number"
                min="1"
                max="25"
                value={formData.crewCount}
                onChange={(e) => setFormData({ ...formData, crewCount: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Lead Supervisor / Tech Name</label>
              <input
                type="text"
                placeholder="e.g., Rajeshwar Rao"
                value={formData.technicianName}
                onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Contact Phone</label>
              <input
                type="tel"
                placeholder="+91 98450 00112"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Destination Work Zone</label>
              <select
                value={formData.towerZone}
                onChange={(e) => setFormData({ ...formData, towerZone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
              >
                <option value="Tower A (Floors 1-14)">Tower A (Floors 1-14)</option>
                <option value="Tower B (Floors 1-12)">Tower B (Floors 1-12)</option>
                <option value="Tower C - Facade Scaffolding">Tower C - Facade Scaffolding</option>
                <option value="Tower D - Roof Terrace">Tower D - Roof Terrace</option>
                <option value="Clubhouse &amp; Pool">Clubhouse &amp; Pool</option>
                <option value="Basement 1 &amp; 2 Electrical Plant">Basement 1 &amp; 2 Electrical Plant</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Designated Entry Gate</label>
              <select
                value={formData.gate}
                onChange={(e) => setFormData({ ...formData, gate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
              >
                <option value="Gate 2 (Commercial/Service)">Gate 2 (Commercial/Service)</option>
                <option value="Gate 1 (Main Boulevard)">Gate 1 (Main Boulevard)</option>
                <option value="Gate 3 (Rear Goods Delivery)">Gate 3 (Rear Goods Delivery)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-[#131b2e] block mb-1">Scope of Authorized Work</label>
            <input
              type="text"
              value={formData.workScope}
              onChange={(e) => setFormData({ ...formData, workScope: e.target.value })}
              placeholder="e.g., Fibre optic line splicing, Water pump seal change"
              className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div className="p-3 bg-[#c9e6ff]/30 rounded-xl border border-[#c9e6ff] flex items-center gap-2 text-[#001e2f]">
            <span className="material-symbols-outlined text-lg text-[#006591]">verified_user</span>
            <span className="text-[11px] font-medium leading-tight">
              Safety induction required at Gate 2. Hard hats and fluorescent safety jackets mandatory on site.
            </span>
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
              className="px-5 py-2 bg-[#006591] hover:bg-[#005277] text-white rounded-xl font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">pin</span>
              <span>Generate Gate Pass</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
