import React, { useState } from 'react';

export const TreasuryPaymentModal = ({
  isOpen,
  mode = 'PAY_UTILITY_BILL', // 'PAY_UTILITY_BILL' | 'DEPOSIT_CASH' | 'WITHDRAW_DISBURSE' | 'RECORD_UNIT_PAYMENT'
  billData = null,
  unitData = null,
  treasuryData = null,
  onClose,
  onConfirmUtilityPayment,
  onConfirmDeposit,
  onConfirmDisbursement,
  onConfirmUnitPayment
}) => {
  if (!isOpen) return null;

  // State for Utility Payment
  const [paymentMode, setPaymentMode] = useState('HDFC_NET_BANKING');
  const [utrNumber, setUtrNumber] = useState(`UTR-HDFC-${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [authSignatory, setAuthSignatory] = useState('Elena Rostova (Estate President)');

  // State for Cash Deposit to Bank
  const [depositAmount, setDepositAmount] = useState(
    treasuryData?.accounts?.cashVault ? Math.min(100000, treasuryData.accounts.cashVault) : 50000
  );
  const [slipNumber, setSlipNumber] = useState(`CH-${Math.floor(10000 + Math.random() * 90000)}`);
  const [depositBranch, setDepositBranch] = useState('HDFC Jubilee Hills Branch (Teller Counter #3)');
  const [depositNotes, setDepositNotes] = useState('Routine bi-weekly estate office cash clearance to main society operating account.');

  // State for Disbursement / Withdrawal
  const [disburseAmount, setDisburseAmount] = useState(15000);
  const [disburseSource, setDisburseSource] = useState('CASH_VAULT');
  const [disburseBeneficiary, setDisburseBeneficiary] = useState('Imran Plumbing Spares / Emergency STP Motor Overhaul');
  const [voucherNumber, setVoucherNumber] = useState(`PV-${Math.floor(100 + Math.random() * 900)}`);
  const [disbursePurpose, setDisbursePurpose] = useState('Emergency plumbing valve parts purchase');

  // State for Resident Unit Payment
  const [unitPaymentAmount, setUnitPaymentAmount] = useState(
    unitData ? (unitData.dues || 0) + (unitData.electricityDue || 0) : 15000
  );
  const [unitPaymentMode, setUnitPaymentMode] = useState('ONLINE');
  const [clearElectricity, setClearElectricity] = useState(true);

  const handleUtilitySubmit = (e) => {
    e.preventDefault();
    if (!billData) return;
    onConfirmUtilityPayment(billData.id, {
      paymentMode,
      utrNumber,
      performedBy: authSignatory
    });
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    onConfirmDeposit({
      amount: Number(depositAmount),
      slipNumber,
      branch: depositBranch,
      notes: depositNotes,
      performedBy: authSignatory
    });
  };

  const handleDisburseSubmit = (e) => {
    e.preventDefault();
    onConfirmDisbursement({
      amount: Number(disburseAmount),
      source: disburseSource,
      beneficiary: disburseBeneficiary,
      voucherNumber,
      purpose: disbursePurpose,
      performedBy: authSignatory
    });
  };

  const handleUnitPaymentSubmit = (e) => {
    e.preventDefault();
    if (!unitData) return;
    onConfirmUnitPayment(unitData.suite, {
      amount: Number(unitPaymentAmount),
      mode: unitPaymentMode,
      clearElectricity,
      performedBy: authSignatory
    });
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e7ff] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#006b2c]/10 text-[#006b2c]">
              <span className="material-symbols-outlined text-xl">
                {mode === 'PAY_UTILITY_BILL'
                  ? 'receipt_long'
                  : mode === 'DEPOSIT_CASH'
                  ? 'account_balance'
                  : mode === 'WITHDRAW_DISBURSE'
                  ? 'payments'
                  : 'credit_card'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">
                {mode === 'PAY_UTILITY_BILL' && 'Pay Society Operational Bill'}
                {mode === 'DEPOSIT_CASH' && 'Deposit Cash Vault to Society Bank'}
                {mode === 'WITHDRAW_DISBURSE' && 'Disburse Funds / Cash Voucher'}
                {mode === 'RECORD_UNIT_PAYMENT' && `Record Payment for ${unitData?.suite || 'Unit'}`}
              </h3>
              <p className="text-xs text-[#6e7b6c]">Society Treasury &amp; Real-Time Financial Execution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6e7b6c] hover:text-[#131b2e] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* MODE 1: PAY UTILITY BILL */}
        {mode === 'PAY_UTILITY_BILL' && billData && (
          <form onSubmit={handleUtilitySubmit} className="flex flex-col gap-3 text-xs">
            <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-[#131b2e] block">{billData.service}</span>
                  <span className="text-[11px] text-[#6e7b6c]">
                    Consumer ID: {billData.consumerNumber} • {billData.category}
                  </span>
                </div>
                <span className="text-base font-bold text-[#006b2c]">
                  ₹{billData.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-[#3e4a3d]">{billData.description}</p>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#dae2fd]/60 text-[#6e7b6c]">
                <span>Bill Cycle: {billData.billMonth}</span>
                <span className="text-[#ba1a1a] font-bold">Due Date: {billData.dueDate}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Source Account</label>
              <div className="p-2.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#131b2e] block">HDFC Bank Current Account</span>
                  <span className="text-[11px] text-[#6e7b6c]">A/C #4409-1092-8371-92 (Jubilee Hills)</span>
                </div>
                <span className="text-xs font-bold text-[#006b2c]">
                  Avail: ₹{(treasuryData?.accounts?.operatingBank || 4280000).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Payment Method</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-semibold"
                >
                  <option value="HDFC_NET_BANKING">HDFC Corporate NetBanking</option>
                  <option value="RTGS_NEFT">Direct RTGS / NEFT Transfer</option>
                  <option value="BBPS_AUTO_DEBIT">BBPS Integrated Auto-Debit</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Generated UTR / Ref</label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-mono text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Authorized Board Signatory</label>
              <input
                type="text"
                value={authSignatory}
                onChange={(e) => setAuthSignatory(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-[#131b2e] font-medium"
              />
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
                <span className="material-symbols-outlined text-base">lock</span>
                Authorize &amp; Pay ₹{billData.amount.toLocaleString('en-IN')}
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: DEPOSIT CASH VAULT TO BANK */}
        {mode === 'DEPOSIT_CASH' && (
          <form onSubmit={handleDepositSubmit} className="flex flex-col gap-3 text-xs">
            <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6e7b6c] uppercase font-bold block">Current Vault Cash Balance</span>
                <span className="text-xl font-bold text-[#131b2e]">
                  ₹{(treasuryData?.accounts?.cashVault || 345000).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#6e7b6c] block">Target Deposit Account</span>
                <span className="font-bold text-[#006b2c]">HDFC Current A/C #8371-92</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Deposit Amount (₹)</label>
              <input
                type="number"
                max={treasuryData?.accounts?.cashVault || 345000}
                min={1000}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-base font-bold text-[#006b2c] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Bank Teller Deposit Slip #</label>
                <input
                  type="text"
                  value={slipNumber}
                  onChange={(e) => setSlipNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Bank Branch</label>
                <input
                  type="text"
                  value={depositBranch}
                  onChange={(e) => setDepositBranch(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Deposit Audit Notes</label>
              <textarea
                rows={2}
                value={depositNotes}
                onChange={(e) => setDepositNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-xs resize-none"
              />
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
                <span className="material-symbols-outlined text-base">savings</span>
                Confirm Bank Deposit of ₹{Number(depositAmount).toLocaleString('en-IN')}
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: DISBURSEMENT / WITHDRAWAL */}
        {mode === 'WITHDRAW_DISBURSE' && (
          <form onSubmit={handleDisburseSubmit} className="flex flex-col gap-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  value={disburseAmount}
                  onChange={(e) => setDisburseAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-base font-bold text-[#ba1a1a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Fund Source</label>
                <select
                  value={disburseSource}
                  onChange={(e) => setDisburseSource(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-xs font-bold"
                >
                  <option value="CASH_VAULT">Estate Office Cash Vault (Avail: ₹{(treasuryData?.accounts?.cashVault || 345000).toLocaleString('en-IN')})</option>
                  <option value="BANK">HDFC Bank Current Account (Avail: ₹{(treasuryData?.accounts?.operatingBank || 4280000).toLocaleString('en-IN')})</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Petty Cash / Voucher #</label>
                <input
                  type="text"
                  value={voucherNumber}
                  onChange={(e) => setVoucherNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Beneficiary / Payee</label>
                <input
                  type="text"
                  value={disburseBeneficiary}
                  onChange={(e) => setDisburseBeneficiary(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Purpose &amp; Authorization</label>
              <textarea
                rows={2}
                value={disbursePurpose}
                onChange={(e) => setDisbursePurpose(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-xs resize-none"
              />
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
                className="px-5 py-2 rounded-xl bg-[#ba1a1a] text-white hover:bg-[#93000a] font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">payments</span>
                Authorize Disbursement
              </button>
            </div>
          </form>
        )}

        {/* MODE 4: RECORD RESIDENT PAYMENT */}
        {mode === 'RECORD_UNIT_PAYMENT' && unitData && (
          <form onSubmit={handleUnitPaymentSubmit} className="flex flex-col gap-3 text-xs">
            <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#131b2e]">{unitData.suite}</span>
                  <span className="text-[11px] text-[#6e7b6c] block">{unitData.owner} • {unitData.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#ba1a1a]">
                    ₹{(unitData.dues || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-[#6e7b6c]">Maintenance Arrears</span>
                </div>
              </div>
              {unitData.electricityDue > 0 && (
                <div className="flex items-center justify-between pt-1 border-t border-[#dae2fd]/60 text-[#825100] font-bold">
                  <span>Sub-meter Electricity Bill Due:</span>
                  <span>₹{unitData.electricityDue.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Amount Collected (₹)</label>
                <input
                  type="number"
                  value={unitPaymentAmount}
                  onChange={(e) => setUnitPaymentAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-base font-bold text-[#006b2c] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Receipt Channel</label>
                <select
                  value={unitPaymentMode}
                  onChange={(e) => setUnitPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl text-xs font-bold"
                >
                  <option value="ONLINE">Bank Transfer (NEFT / UPI / IMPS)</option>
                  <option value="CASH">Estate Office Cash Counter</option>
                  <option value="CHEQUE">Society Cheque Deposit</option>
                </select>
              </div>
            </div>

            {unitData.electricityDue > 0 && (
              <label className="flex items-center gap-2 p-2 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] cursor-pointer">
                <input
                  type="checkbox"
                  checked={clearElectricity}
                  onChange={(e) => setClearElectricity(e.target.checked)}
                  className="rounded text-[#006b2c] focus:ring-[#006b2c]"
                />
                <span className="text-xs text-[#131b2e] font-semibold">
                  Also clear pending sub-meter electricity dues of ₹{unitData.electricityDue.toLocaleString('en-IN')}
                </span>
              </label>
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
                className="px-5 py-2 rounded-xl bg-[#006b2c] text-white hover:bg-[#00873a] font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">receipt</span>
                Generate Society Official Receipt &amp; Settle Dues
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
