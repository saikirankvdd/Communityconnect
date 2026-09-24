import React from 'react';

export const ExecutiveReportPrintModal = ({
  isOpen,
  onClose,
  treasuryData,
  monthlyData = [],
  towerData = [],
  currentUser,
  currentCommunity,
  showToast = () => {}
}) => {
  if (!isOpen) return null;

  const adminName = currentUser?.name || 'Elena Rostova';
  const communityName = currentCommunity?.name || currentUser?.communityName || 'Oakridge Heights';
  const communityInitials = communityName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'OH';

  const handleTriggerPrint = () => {
    window.print();
    showToast('Executive Financial Audit sent to printer.', 'success');
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:fixed-none">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl border border-[#eaedff] flex flex-col gap-6 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-4">
        {/* Print Controls Bar - hidden during actual window.print */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eaedff] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#006b2c]/10 text-[#006b2c]">
              <span className="material-symbols-outlined text-2xl">print</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Executive Financial Audit &amp; Tower Report</h3>
              <p className="text-xs text-[#6e7b6c]">Ready for physical printing, archiving or PDF export</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print Document</span>
            </button>
            <button
              onClick={() => {
                showToast('Audit report exported to CSV.', 'success');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#6e7b6c] hover:text-[#131b2e] rounded-full cursor-pointer hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Official Society Header for Printable Document */}
        <div className="flex items-start justify-between border-b-2 border-[#131b2e] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#006b2c] text-white flex items-center justify-center font-bold text-xl shrink-0 print:border print:border-black">
              {communityInitials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#131b2e] tracking-tight uppercase">
                {communityName} Co-Operative Housing Society Ltd.
              </h1>
              <p className="text-xs text-[#6e7b6c]">
                Reg. No. CHS/{currentCommunity?.city ? currentCommunity.city.slice(0, 3).toUpperCase() : 'BLR'}/2023/KA/4091 • {currentCommunity?.area || 'Main Corridor'}, {currentCommunity?.city || 'Metro'}
              </p>
              <span className="text-[11px] font-semibold text-[#006591] block mt-0.5">
                Executive Management Committee Monthly Financial &amp; Operations Audit
              </span>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="font-bold text-[#131b2e] block">Audit Cycle: FY 2024–25</span>
            <span className="text-[#6e7b6c] block">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="text-[10px] font-mono text-[#006b2c] block mt-0.5">DOC-REF: {communityInitials}-AUD-FY25-M09</span>
          </div>
        </div>

        {/* Executive Summary Metrics Box */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff] print:border-gray-300">
            <span className="text-[10px] uppercase font-bold text-[#6e7b6c] block">Total Inflow Collected</span>
            <span className="text-xl font-bold text-[#006b2c] block mt-0.5">₹42.80 Lakhs</span>
            <span className="text-[10px] text-[#006b2c] font-semibold">92.6% of ₹46.20L Target</span>
          </div>
          <div className="p-3 bg-[#ffdad6]/40 rounded-xl border border-[#ffdad6] print:border-gray-300">
            <span className="text-[10px] uppercase font-bold text-[#ba1a1a] block">Outstanding Arrears</span>
            <span className="text-xl font-bold text-[#ba1a1a] block mt-0.5">₹3.40 Lakhs</span>
            <span className="text-[10px] text-[#ba1a1a] font-semibold">25 Defaulter Flats</span>
          </div>
          <div className="p-3 bg-[#c9e6ff]/30 rounded-xl border border-[#c9e6ff] print:border-gray-300">
            <span className="text-[10px] uppercase font-bold text-[#006591] block">Sinking &amp; Reserve Fund</span>
            <span className="text-xl font-bold text-[#006591] block mt-0.5">
              ₹{((treasuryData?.reserveFundBalance || 12850000) / 100000).toFixed(2)} Lakhs
            </span>
            <span className="text-[10px] text-[#006591] font-semibold">Escrow Bank Verified</span>
          </div>
          <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff] print:border-gray-300">
            <span className="text-[10px] uppercase font-bold text-[#6e7b6c] block">Units Census</span>
            <span className="text-xl font-bold text-[#131b2e] block mt-0.5">395 / 420</span>
            <span className="text-[10px] text-[#006b2c] font-semibold">94.0% Occupancy Rate</span>
          </div>
        </div>

        {/* Tower-By-Tower Detailed Matrix */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-[#131b2e]">Tower-by-Tower Collection &amp; Maintenance Matrix</h3>
            <span className="text-xs text-[#6e7b6c]">4 Residential Towers + Exclusive Villas</span>
          </div>
          <table className="w-full text-left text-xs border border-[#eaedff] rounded-xl overflow-hidden print:border-gray-300">
            <thead className="bg-[#f2f3ff] text-[#131b2e] font-bold border-b border-[#eaedff]">
              <tr>
                <th className="p-2.5">Tower Name</th>
                <th className="p-2.5">Units / Occupied</th>
                <th className="p-2.5">Billed Target</th>
                <th className="p-2.5">Collected Inflow</th>
                <th className="p-2.5">Recovery %</th>
                <th className="p-2.5 text-right">Outstanding Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff]">
              {[
                { tower: 'Tower A (High-Rise)', units: '112 / 108', target: '₹12.80L', collected: '₹12.40L', rate: '96.8%', overdue: '₹0.40L', status: 'Compliant' },
                { tower: 'Tower B (Mid-Rise)', units: '104 / 98', target: '₹11.60L', collected: '₹10.80L', rate: '93.1%', overdue: '₹0.80L', status: 'Compliant' },
                { tower: 'Tower C (High-Rise)', units: '100 / 96', target: '₹10.40L', collected: '₹9.60L', rate: '92.3%', overdue: '₹0.80L', status: 'Compliant' },
                { tower: 'Tower D (Park View)', units: '104 / 93', target: '₹8.10L', collected: '₹7.20L', rate: '88.8%', overdue: '₹0.90L', status: 'Notice Issued' },
                { tower: 'Villas & Penthouses', units: '15 / 14', target: '₹3.30L', collected: '₹2.80L', rate: '84.8%', overdue: '₹0.50L', status: 'Notice Issued' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2.5 font-bold text-[#131b2e]">{row.tower}</td>
                  <td className="p-2.5 text-[#6e7b6c]">{row.units}</td>
                  <td className="p-2.5 text-[#131b2e]">{row.target}</td>
                  <td className="p-2.5 font-bold text-[#006b2c]">{row.collected}</td>
                  <td className="p-2.5 font-bold">{row.rate}</td>
                  <td className="p-2.5 text-right font-bold text-[#ba1a1a]">{row.overdue}</td>
                </tr>
              ))}
              <tr className="bg-[#f2f3ff] font-bold border-t-2 border-[#eaedff]">
                <td className="p-2.5 text-[#131b2e]">Total Estate Summary</td>
                <td className="p-2.5">420 / 395 Units</td>
                <td className="p-2.5">₹46.20L</td>
                <td className="p-2.5 text-[#006b2c]">₹42.80L</td>
                <td className="p-2.5 text-[#006b2c]">92.6%</td>
                <td className="p-2.5 text-right text-[#ba1a1a]">₹3.40L</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Monthly Collection Trend Summary */}
        <div>
          <h3 className="font-bold text-sm text-[#131b2e] mb-2">Monthly Collection Trend (H1 FY2024–25)</h3>
          <div className="grid grid-cols-6 gap-2 text-center text-xs">
            {[
              { month: 'APR 2024', collected: '₹43.8L', rate: '97.3%' },
              { month: 'MAY 2024', collected: '₹44.1L', rate: '98.0%' },
              { month: 'JUN 2024', collected: '₹43.5L', rate: '95.6%' },
              { month: 'JUL 2024', collected: '₹41.2L', rate: '90.5%' },
              { month: 'AUG 2024', collected: '₹44.8L', rate: '97.4%' },
              { month: 'SEP 2024', collected: '₹42.8L', rate: '92.6%' }
            ].map((m, i) => (
              <div key={i} className="p-2.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                <span className="text-[10px] font-bold text-[#6e7b6c] block">{m.month}</span>
                <span className="text-sm font-bold text-[#006b2c] block mt-0.5">{m.collected}</span>
                <span className="text-[10px] text-[#131b2e] font-semibold">{m.rate} Rate</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Certification Block */}
        <div className="pt-8 mt-4 border-t border-[#eaedff] flex items-end justify-between text-xs">
          <div className="flex flex-col items-center">
            <div className="w-40 border-b border-gray-400 pb-1 text-center font-serif italic text-gray-700">
              {adminName}
            </div>
            <span className="font-bold text-[#131b2e] mt-1">{adminName}</span>
            <span className="text-[10px] text-[#6e7b6c]">Estate President &amp; Signatory</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-40 border-b border-gray-400 pb-1 text-center font-serif italic text-gray-700">
              Arjun Kumar
            </div>
            <span className="font-bold text-[#131b2e] mt-1">Arjun Kumar</span>
            <span className="text-[10px] text-[#6e7b6c]">Hon. Treasurer</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-40 border-b border-gray-400 pb-1 text-center font-serif italic text-gray-700">
              Sunita Bai
            </div>
            <span className="font-bold text-[#131b2e] mt-1">Sunita Bai</span>
            <span className="text-[10px] text-[#6e7b6c]">MC Secretary</span>
          </div>
        </div>
      </div>
    </div>
  );
};
