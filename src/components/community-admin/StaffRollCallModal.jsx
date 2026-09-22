import React, { useState } from 'react';

export const StaffRollCallModal = ({ isOpen, onClose, onNavigateToVendors }) => {
  if (!isOpen) return null;

  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const staffList = [
    { id: 'STF-101', name: 'Lakshmi Devi', role: 'Housemaid', flat: 'Suite B-402 (Priya Saxena)', gate: 'Gate 1', inTime: '07:30 AM', status: 'Inside Unit', verified: true },
    { id: 'STF-102', name: 'Raju Yadav', role: 'Chauffeur', flat: 'Suite C-1104 (Rajesh Verma)', gate: 'Gate 2', inTime: '08:15 AM', status: 'Inside Basement Parking', verified: true },
    { id: 'STF-103', name: 'Sunita Sharma', role: 'Home Cook', flat: 'Suite A-902 (Anita Menon)', gate: 'Gate 1', inTime: '06:45 AM', status: 'Inside Unit', verified: true },
    { id: 'STF-104', name: 'Meena Bai', role: 'Housemaid', flat: 'Suite A-1204 (Arjun Kumar)', gate: 'Gate 1', inTime: '08:00 AM', status: 'Inside Unit', verified: true },
    { id: 'STF-105', name: 'Gopal Krishna', role: 'Gardener', flat: 'Clubhouse & Central Lawns', gate: 'Gate 2', inTime: '07:00 AM', status: 'Central Park', verified: true },
    { id: 'STF-106', name: 'Kavita Kumari', role: 'Childcare / Nanny', flat: 'Villa V-08 (Kavita Reddy)', gate: 'Gate 1', inTime: '08:30 AM', status: 'Inside Unit', verified: true },
    { id: 'STF-107', name: 'Babu Lal', role: 'Chauffeur', flat: 'Suite D-204 (Gautam Singhania)', gate: 'Gate 2', inTime: '08:45 AM', status: 'Drivers Lounge', verified: true },
    { id: 'STF-108', name: 'Asian Paints Crew (6 Techs)', role: 'Contractor', flat: 'Tower C Facade Exterior', gate: 'Gate 1', inTime: '09:00 AM', status: 'Scaffold Zone', verified: true }
  ];

  const filtered = staffList.filter((s) => {
    const matchesRole =
      filterRole === 'ALL' ||
      (filterRole === 'MAID' && s.role === 'Housemaid') ||
      (filterRole === 'DRIVER' && s.role === 'Chauffeur') ||
      (filterRole === 'COOK' && s.role === 'Home Cook') ||
      (filterRole === 'CONTRACTOR' && s.role === 'Contractor');
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.flat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e2e7ff] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#006591]/10 text-[#006591]">
              <span className="material-symbols-outlined text-xl">groups</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Live Staff &amp; Help On-Premise</h3>
              <p className="text-xs text-[#6e7b6c]">142 Domestic Helpers &amp; Authorized Personnel Checked In</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6e7b6c] hover:text-[#131b2e] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <button
            onClick={() => setFilterRole('ALL')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              filterRole === 'ALL' ? 'bg-[#006591] text-white border-[#006591] font-bold' : 'bg-[#f2f3ff] text-[#131b2e]'
            }`}
          >
            <span className="text-base block">142</span>
            <span className="text-[10px]">All On-Site</span>
          </button>
          <button
            onClick={() => setFilterRole('MAID')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              filterRole === 'MAID' ? 'bg-[#006b2c] text-white border-[#006b2c] font-bold' : 'bg-[#f2f3ff] text-[#131b2e]'
            }`}
          >
            <span className="text-base block">88</span>
            <span className="text-[10px]">Housemaids</span>
          </button>
          <button
            onClick={() => setFilterRole('DRIVER')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              filterRole === 'DRIVER' ? 'bg-[#006591] text-white border-[#006591] font-bold' : 'bg-[#f2f3ff] text-[#131b2e]'
            }`}
          >
            <span className="text-base block">34</span>
            <span className="text-[10px]">Chauffeurs</span>
          </button>
          <button
            onClick={() => setFilterRole('COOK')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              filterRole === 'COOK' ? 'bg-[#825100] text-white border-[#825100] font-bold' : 'bg-[#f2f3ff] text-[#131b2e]'
            }`}
          >
            <span className="text-base block">20</span>
            <span className="text-[10px]">Home Cooks</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#6e7b6c] text-lg">search</span>
          <input
            type="text"
            placeholder="Search by staff name, flat number, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-xs text-[#131b2e] focus:outline-none focus:border-[#006591]"
          />
        </div>

        {/* Staff Table / Cards */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {filtered.map((staff) => (
            <div
              key={staff.id}
              className="p-3 bg-white rounded-xl border border-[#eaedff] hover:bg-[#f2f3ff] transition-colors flex items-center justify-between text-xs gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#006591]/10 text-[#006591] font-bold flex items-center justify-center text-xs shrink-0">
                  {staff.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#131b2e]">{staff.name}</span>
                    <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#006591] font-bold text-[10px]">
                      {staff.role}
                    </span>
                    {staff.verified && (
                      <span className="text-[#006b2c] font-bold text-[10px] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">verified</span> Police Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#6e7b6c] block mt-0.5">
                    {staff.flat} • In via {staff.gate} at {staff.inTime}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] font-bold text-[10px] block">
                  {staff.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#eaedff] text-xs">
          <span className="text-[#6e7b6c]">
            Showing {filtered.length} of {staffList.length} active staff
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToVendors();
              }}
              className="px-4 py-2 rounded-xl bg-[#006b2c] text-white hover:bg-[#00873a] font-bold shadow-md cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">badge</span>
              Manage All Vendors &amp; Staff →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
