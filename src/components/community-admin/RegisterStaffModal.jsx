import React, { useState } from 'react';

export const RegisterStaffModal = ({ isOpen, onClose, onRegisterStaff, showToast }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    role: 'Housemaid',
    phone: '',
    flat: '',
    gate: 'Gate 1 (Main Boulevard)',
    policeVerified: true,
    policeRef: `PV-${Math.floor(100000 + Math.random() * 900000)}`
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.flat) {
      showToast('Please provide the staff member name and employer flat.', 'error');
      return;
    }

    const newStaff = {
      id: `STF-${Math.floor(200 + Math.random() * 800)}`,
      name: formData.name,
      role: formData.role,
      phone: formData.phone || '+91 98450 00192',
      flat: formData.flat,
      gate: formData.gate,
      inTime: '08:00 AM',
      status: 'Inside Unit',
      verified: formData.policeVerified,
      policeRef: formData.policeRef,
      registeredAt: 'Today'
    };

    onRegisterStaff(newStaff);
    showToast(`${newStaff.name} registered and granted biometric RFID badge #${newStaff.id}.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#006b2c]/10 text-[#006b2c]">
              <span className="material-symbols-outlined text-xl">person_add</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Register Domestic Staff &amp; Help</h3>
              <p className="text-xs text-[#6e7b6c]">Police Verification &amp; Biometric RFID Credentialing</p>
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
              <label className="font-bold text-[#131b2e] block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g., Suman Lata"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Service Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-bold focus:bg-white focus:outline-none"
              >
                <option value="Housemaid">Housemaid / Housekeeper</option>
                <option value="Chauffeur">Chauffeur / Driver</option>
                <option value="Home Cook">Home Cook / Chef</option>
                <option value="Childcare / Nanny">Childcare / Nanny</option>
                <option value="Elderly Caregiver">Elderly Caregiver</option>
                <option value="Gardener">Gardener</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Primary Mobile Number</label>
              <input
                type="tel"
                placeholder="+91 98450 12345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Employer Flat(s) Served</label>
              <input
                type="text"
                placeholder="e.g., Suite B-402, Suite C-1104"
                value={formData.flat}
                onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Designated Entry Gate</label>
              <select
                value={formData.gate}
                onChange={(e) => setFormData({ ...formData, gate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
              >
                <option value="Gate 1 (Main Boulevard)">Gate 1 (Main Boulevard)</option>
                <option value="Gate 2 (Service Gate)">Gate 2 (Service Gate)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#131b2e] block mb-1">Police Clearance Verification</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="policeVerifiedCheck"
                  checked={formData.policeVerified}
                  onChange={(e) => setFormData({ ...formData, policeVerified: e.target.checked })}
                  className="rounded border-gray-300 text-[#006b2c] focus:ring-[#006b2c] h-4 w-4"
                />
                <label htmlFor="policeVerifiedCheck" className="text-xs font-semibold text-[#131b2e]">
                  Police Verified (Ref: {formData.policeRef})
                </label>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#7ffc97]/20 rounded-xl border border-[#006b2c]/20 flex items-center gap-2 text-[#005320]">
            <span className="material-symbols-outlined text-lg">fingerprint</span>
            <span className="text-[11px] font-medium leading-tight">
              Biometric turnstile profile and RFID proximity badge will be provisioned at Gate 1 Terminal.
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
              className="px-5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">how_to_reg</span>
              <span>Register &amp; Issue Badge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
