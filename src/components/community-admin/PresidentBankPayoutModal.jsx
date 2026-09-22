import React, { useState, useEffect } from 'react';

export const PresidentBankPayoutModal = ({
  isOpen,
  prefilledPayee,
  prefilledAmount,
  prefilledInvoiceRef,
  prefilledSourceAccount,
  treasuryData,
  onClose,
  onConfirmPayout,
  showToast
}) => {
  const [sourceAccount, setSourceAccount] = useState(prefilledSourceAccount || 'OPERATING_BANK');
  const [vendorName, setVendorName] = useState(prefilledPayee || 'Otis Elevators India Pvt Ltd');
  const [category, setCategory] = useState('VENDOR_AMC');
  const [amount, setAmount] = useState(prefilledAmount ? String(prefilledAmount) : '145000');
  const [invoiceRef, setInvoiceRef] = useState(prefilledInvoiceRef || 'OTIS-Q3-INV-8891');
  const [payoutMode, setPayoutMode] = useState('RTGS');
  const [notes, setNotes] = useState('Authorized quarterly elevator maintenance AMC retainer as per SLA contract.');
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [twoFactorToken, setTwoFactorToken] = useState('789-204');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (prefilledPayee) setVendorName(prefilledPayee);
    if (prefilledAmount) setAmount(String(prefilledAmount));
    if (prefilledInvoiceRef) setInvoiceRef(prefilledInvoiceRef);
    if (prefilledSourceAccount) setSourceAccount(prefilledSourceAccount);
  }, [prefilledPayee, prefilledAmount, prefilledInvoiceRef, prefilledSourceAccount, isOpen]);

  if (!isOpen) return null;

  const operatingBal = treasuryData?.accounts?.operatingBank || 4280000;
  const sinkingBal = treasuryData?.accounts?.sinkingFundFD || 18450000;
  const cashBal = treasuryData?.accounts?.cashVault || 345000;

  const currentAvailableBalance =
    sourceAccount === 'OPERATING_BANK'
      ? operatingBal
      : sourceAccount === 'SINKING_FUND'
      ? sinkingBal
      : cashBal;

  const numericAmount = Number(amount) || 0;
  const isBalanceExceeded = numericAmount > currentAvailableBalance;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      showToast?.('Please enter a valid disbursement amount.', 'error');
      return;
    }
    if (isBalanceExceeded) {
      showToast?.(`Amount exceeds available account balance (₹${currentAvailableBalance.toLocaleString('en-IN')}).`, 'error');
      return;
    }
    if (!isAuthorized) {
      showToast?.('President digital signature confirmation is required.', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onConfirmPayout({
        sourceAccount,
        vendorName,
        category,
        amount: numericAmount,
        invoiceRef,
        payoutMode,
        notes,
        authorizedBy: 'Elena Rostova (President - Board Signatory 1)'
      });
      setIsProcessing(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#eaedff] flex flex-col gap-4 animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006b2c]/10 flex items-center justify-center text-[#006b2c]">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#131b2e]">Direct Bank Payout &amp; Disbursal</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5e9] text-[#006b2c] border border-[#a3e635]/40">
                  President 2FA Signatory
                </span>
              </div>
              <p className="text-xs text-[#6e7b6c]">
                Initiate corporate banking transmission from society treasury accounts to certified vendors
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Source Account Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Source Bank Account / Vault
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSourceAccount('OPERATING_BANK')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  sourceAccount === 'OPERATING_BANK'
                    ? 'border-[#006b2c] bg-[#e8f5e9]/60 shadow-xs'
                    : 'border-[#eaedff] bg-[#f8f9ff] hover:bg-gray-50'
                }`}
              >
                <div className="text-[11px] font-bold text-[#131b2e] truncate">HDFC Operating A/C</div>
                <div className="text-[10px] text-gray-500 font-mono">#8371-92</div>
                <div className="text-xs font-bold text-[#006b2c] mt-1 font-mono">
                  ₹{operatingBal.toLocaleString('en-IN')}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSourceAccount('SINKING_FUND')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  sourceAccount === 'SINKING_FUND'
                    ? 'border-[#006b2c] bg-[#e8f5e9]/60 shadow-xs'
                    : 'border-[#eaedff] bg-[#f8f9ff] hover:bg-gray-50'
                }`}
              >
                <div className="text-[11px] font-bold text-[#131b2e] truncate">SBI Sinking Fund FD</div>
                <div className="text-[10px] text-gray-500 font-mono">Auto-Sweep</div>
                <div className="text-xs font-bold text-blue-700 mt-1 font-mono">
                  ₹{sinkingBal.toLocaleString('en-IN')}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSourceAccount('CASH_VAULT')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  sourceAccount === 'CASH_VAULT'
                    ? 'border-[#006b2c] bg-[#e8f5e9]/60 shadow-xs'
                    : 'border-[#eaedff] bg-[#f8f9ff] hover:bg-gray-50'
                }`}
              >
                <div className="text-[11px] font-bold text-[#131b2e] truncate">Petty Cash Vault</div>
                <div className="text-[10px] text-gray-500 font-mono">Society Safe</div>
                <div className="text-xs font-bold text-amber-700 mt-1 font-mono">
                  ₹{cashBal.toLocaleString('en-IN')}
                </div>
              </button>
            </div>
          </div>

          {/* Beneficiary Payee & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Beneficiary Payee</label>
              <select
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full p-2.5 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-xs font-semibold text-[#131b2e]"
              >
                <optgroup label="Corporate AMCs">
                  <option value="Otis Elevators India Pvt Ltd">Otis Elevators India Pvt Ltd</option>
                  <option value="BVG India Facility Management">BVG India Facility Management</option>
                  <option value="TopsGrup Security Services Ltd">TopsGrup Security Services Ltd</option>
                  <option value="Kirloskar Oil Engines (DG Sets)">Kirloskar Oil Engines (DG Sets)</option>
                  <option value="Ion Exchange Water & STP Corp">Ion Exchange Water &amp; STP Corp</option>
                  <option value="Asian Paints Repaint Division">Asian Paints Repaint Division</option>
                  <option value="Aquapool Maintenance Services">Aquapool Maintenance Services</option>
                </optgroup>
                <optgroup label="Utilities & Boards">
                  <option value="TSSPDCL Common Power Board">TSSPDCL Common Power Board</option>
                  <option value="HMWS&SB Metro Water Supply">HMWS&SB Metro Water Supply</option>
                  <option value="HPCL Diesel Bulk Fuel Tankers">HPCL Diesel Bulk Fuel Tankers</option>
                </optgroup>
                <optgroup label="Staff & Other">
                  <option value="Estate Security Guard Force Payroll">Estate Security Guard Force Payroll</option>
                  <option value="Estate Facilities Technical Staff">Estate Facilities Technical Staff</option>
                  <option value="Custom Vendor / Contractor">Custom Vendor / Contractor</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Disbursement Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-xs font-semibold text-[#131b2e]"
              >
                <option value="VENDOR_AMC">Master AMC Retainer</option>
                <option value="UTILITY_BOARD">Municipal / Utility Disbursal</option>
                <option value="CAPITAL_WORKS">Major Capital Repair &amp; Civil Works</option>
                <option value="STAFF_PAYROLL">Security &amp; Facilities Force Payroll</option>
                <option value="EMERGENCY_REPAIR">Emergency Spares / Breakdown</option>
              </select>
            </div>
          </div>

          {/* Amount & Payment Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Payout Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 145000"
                  className={`w-full pl-7 pr-3 py-2.5 bg-[#f2f3ff] border rounded-xl text-xs font-bold font-mono text-[#131b2e] ${
                    isBalanceExceeded ? 'border-red-500 text-red-700' : 'border-[#eaedff]'
                  }`}
                />
              </div>
              {isBalanceExceeded && (
                <p className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">error</span>
                  Amount exceeds current account balance!
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Transfer Rail</label>
              <select
                value={payoutMode}
                onChange={(e) => setPayoutMode(e.target.value)}
                className="w-full p-2.5 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-xs font-semibold text-[#131b2e]"
              >
                <option value="RTGS">HDFC Corporate RTGS (Instant &gt; ₹2 Lakhs)</option>
                <option value="NEFT">Corporate NEFT (Priority Settlement)</option>
                <option value="IMPS">24x7 Corporate IMPS Direct Transfer</option>
                <option value="DIRECT_DEBIT">Automated NACH / Direct Debit</option>
                <option value="CHEQUE">Bank Pay Order / Cheque Disbursal</option>
              </select>
            </div>
          </div>

          {/* Invoice Ref & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Invoice / Work Order Ref</label>
              <input
                type="text"
                placeholder="e.g. INV-2025-098 / WO-401"
                value={invoiceRef}
                onChange={(e) => setInvoiceRef(e.target.value)}
                className="w-full p-2.5 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-xs font-mono font-semibold text-[#131b2e]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">President 2FA Token</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={twoFactorToken}
                  className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-700 text-center tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => {
                    const token = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
                    setTwoFactorToken(token);
                    showToast?.('Refreshed President RSA Security Token', 'info');
                  }}
                  className="px-2 py-2 text-gray-500 hover:text-gray-800 cursor-pointer"
                  title="Refresh 2FA Token"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Audit Ledger Notation</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for payment and resolution details..."
              className="w-full p-2.5 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-xs font-normal text-[#131b2e]"
            />
          </div>

          {/* Statutory Signatory Checkbox */}
          <div className="p-3 bg-[#e8f5e9]/50 border border-[#a3e635]/40 rounded-xl">
            <label className="flex items-start gap-2.5 text-xs text-[#131b2e] cursor-pointer">
              <input
                type="checkbox"
                checked={isAuthorized}
                onChange={(e) => setIsAuthorized(e.target.checked)}
                className="mt-0.5 rounded text-[#006b2c] focus:ring-[#006b2c]"
              />
              <div>
                <span className="font-bold block">
                  I, Elena Rostova (Apartment President), authorize this bank disbursal.
                </span>
                <span className="text-[11px] text-gray-600 block mt-0.5">
                  This transaction is electronically timestamped and committed to the Society Treasury Ledger under Bye-Law Section 42(A).
                </span>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#eaedff]">
            <div className="text-[11px] text-gray-500">
              Transfer Fee: <span className="font-mono font-bold text-gray-700">₹0.00 (HDFC Corporate Exemption)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || isBalanceExceeded || !isAuthorized}
                className="px-5 py-2.5 bg-[#006b2c] text-white hover:bg-[#00873a] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    <span>Transmitting to HDFC...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Authorize &amp; Transmit Payout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
