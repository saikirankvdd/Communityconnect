import React, { useState } from 'react';

export const AuthorizeVendorInvoiceModal = ({ isOpen, onClose, invoice, onConfirmApproval, showToast }) => {
  if (!isOpen || !invoice) return null;

  const [slaPenaltyDeduction, setSlaPenaltyDeduction] = useState(invoice.penaltyDeduction || 0);
  const [escrowAccount, setEscrowAccount] = useState('HDFC Bank - Estate Operations Escrow (A/c ...8821)');
  const [presidentNotes, setPresidentNotes] = useState('Service verified by Facility Operations Manager. SLA approved for payment.');

  const grossAmount = invoice.grossAmount || 120000;
  const netPayable = Math.max(0, grossAmount - Number(slaPenaltyDeduction));

  const handleAuthorize = () => {
    onConfirmApproval({
      invoiceId: invoice.id,
      vendorName: invoice.vendorName,
      grossAmount,
      slaPenaltyDeduction: Number(slaPenaltyDeduction),
      netPayable,
      escrowAccount,
      authorizedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    showToast(`Invoice for ${invoice.vendorName} (₹${netPayable.toLocaleString('en-IN')}) authorized & queued for disbursement.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#006b2c]/10 text-[#006b2c]">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Authorize Vendor AMC Disbursement</h3>
              <p className="text-xs text-[#6e7b6c]">MC President Dual Signatory Clearance</p>
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

        {/* Invoice Summary Box */}
        <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#6e7b6c] font-medium">Vendor / Entity:</span>
            <span className="font-bold text-[#131b2e] text-sm">{invoice.vendorName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6e7b6c] font-medium">Contract Reference:</span>
            <span className="font-mono text-[#131b2e]">{invoice.contractRef || 'AMC-OTIS-2024'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6e7b6c] font-medium">Service Period:</span>
            <span className="text-[#131b2e]">{invoice.period || 'September 2024'}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#eaedff] pt-2">
            <span className="text-[#6e7b6c] font-medium">Gross Billed Amount:</span>
            <span className="font-bold text-[#131b2e] text-sm">₹{grossAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* SLA Deductions Adjustment */}
        <div className="flex flex-col gap-1 text-xs">
          <label className="font-bold text-[#131b2e]">SLA Breach Penalty Deduction (₹)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max={grossAmount}
              value={slaPenaltyDeduction}
              onChange={(e) => setSlaPenaltyDeduction(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-[#eaedff] bg-[#f8f9ff] text-[#ba1a1a] font-bold focus:bg-white focus:outline-none"
            />
            <span className="text-[11px] text-[#6e7b6c]">Applied for contractual delays</span>
          </div>
        </div>

        {/* Net Disbursement Highlight */}
        <div className="p-3.5 bg-[#7ffc97]/25 rounded-xl border border-[#006b2c]/30 flex items-center justify-between text-xs">
          <div>
            <span className="text-[#005320] font-bold block text-sm">Net Payout Approved</span>
            <span className="text-[#6e7b6c] text-[11px]">Direct NEFT/RTGS from society operating account</span>
          </div>
          <span className="text-xl font-extrabold text-[#006b2c]">₹{netPayable.toLocaleString('en-IN')}</span>
        </div>

        {/* Escrow Account Selector */}
        <div className="flex flex-col gap-1 text-xs">
          <label className="font-bold text-[#131b2e]">Source Escrow Account</label>
          <select
            value={escrowAccount}
            onChange={(e) => setEscrowAccount(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
          >
            <option value="HDFC Bank - Estate Operations Escrow (A/c ...8821)">
              HDFC Bank - Estate Operations Escrow (A/c ...8821)
            </option>
            <option value="State Bank of India - Sinking Fund Reserve (A/c ...4190)">
              State Bank of India - Sinking Fund Reserve (A/c ...4190)
            </option>
          </select>
        </div>

        {/* Approval Note */}
        <div className="flex flex-col gap-1 text-xs">
          <label className="font-bold text-[#131b2e]">President Audit Remark / Verification Memo</label>
          <input
            type="text"
            value={presidentNotes}
            onChange={(e) => setPresidentNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] font-medium focus:bg-white focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[#6e7b6c] hover:bg-gray-100 rounded-xl font-bold cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAuthorize}
            className="px-5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5 text-xs"
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Authorize ₹{netPayable.toLocaleString('en-IN')} Payout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
