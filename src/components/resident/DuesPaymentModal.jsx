import React, { useState } from 'react';
import { serviceApi } from '../../api/serviceApi';

export const DuesPaymentModal = ({ isOpen, onClose, defaultAmount = 4250, defaultPurpose = 'November 2025 Maintenance in Advance', initialMethod = 'upi', onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState(initialMethod || 'upi'); // 'upi', 'bank', 'card', 'cash'
  const [selectedBill, setSelectedBill] = useState('maint'); // 'maint', 'sinking', 'custom'

  React.useEffect(() => {
    if (initialMethod) {
      setPaymentMethod(initialMethod);
    }
  }, [initialMethod]);
  const [amount, setAmount] = useState(defaultAmount);
  const [purpose, setPurpose] = useState(defaultPurpose);
  const [customAmountInput, setCustomAmountInput] = useState('');

  // UPI State
  const [upiUtr, setUpiUtr] = useState('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);

  // Bank State
  const [bankUtr, setBankUtr] = useState('');
  const [bankDate, setBankDate] = useState(new Date().toISOString().split('T')[0]);

  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('Arjun Kumar');
  const [isCardProcessing, setIsCardProcessing] = useState(false);

  // Cash State
  const [cashSubOption, setCashSubOption] = useState('guard_doorstep'); // 'guard_doorstep' or 'estate_office'
  const [cashSlot, setCashSlot] = useState('Today (04:00 PM - 06:00 PM)');
  const [cashNotes, setCashNotes] = useState('');
  const [isCashDispatching, setIsCashDispatching] = useState(false);

  // Completed Payment Receipt State
  const [completedReceipt, setCompletedReceipt] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleBillSelect = (billType) => {
    setSelectedBill(billType);
    if (billType === 'maint') {
      setAmount(4250);
      setPurpose('November 2025 Society Maintenance in Advance');
    } else if (billType === 'sinking') {
      setAmount(1500);
      setPurpose('Annual Sinking Fund & Clubhouse Reserve Corpus');
    } else {
      const num = parseFloat(customAmountInput) || 1000;
      setAmount(num);
      setPurpose('Custom Society Advance / Ad-hoc Contribution');
    }
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    setCustomAmountInput(val);
    const num = parseFloat(val) || 0;
    setAmount(num);
  };

  // Complete UPI Payment
  const handleUpiPayment = (e) => {
    e.preventDefault();
    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      const receipt = {
        receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
        txnId: upiUtr.trim() || `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        amount: amount,
        purpose: purpose,
        method: 'UPI (Unified Payments Interface)',
        paidBy: 'Arjun Kumar (Flat A-1204)',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESSFUL',
        modeDetails: 'aparnabhooja.society@hdfcbank'
      };
      setCompletedReceipt(receipt);
      if (onPaymentSuccess) onPaymentSuccess(receipt);
    }, 1200);
  };

  // Complete Bank Transfer
  const handleBankPayment = (e) => {
    e.preventDefault();
    const receipt = {
      receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      txnId: bankUtr.trim() || `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      amount: amount,
      purpose: purpose,
      method: 'NEFT / RTGS Bank Transfer',
      paidBy: 'Arjun Kumar (Flat A-1204)',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'VERIFICATION_PENDING_ACK',
      modeDetails: 'HDFC Bank A/C #50200084920194'
    };
    setCompletedReceipt(receipt);
    if (onPaymentSuccess) onPaymentSuccess(receipt);
  };

  // Complete Card Payment
  const handleCardPayment = (e) => {
    e.preventDefault();
    setIsCardProcessing(true);
    setTimeout(() => {
      setIsCardProcessing(false);
      const receipt = {
        receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
        txnId: `CRD${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        amount: amount,
        purpose: purpose,
        method: 'Credit / Debit Card',
        paidBy: `${cardHolder} (Flat A-1204)`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESSFUL',
        modeDetails: `Card ending in ${cardNumber.slice(-4) || '4242'}`
      };
      setCompletedReceipt(receipt);
      if (onPaymentSuccess) onPaymentSuccess(receipt);
    }, 1400);
  };

  // Handle Cash Collection or Estate Office Deposit
  const handleCashRequest = (e) => {
    e.preventDefault();
    setIsCashDispatching(true);

    const cashReq = serviceApi.requestCashCollection({
      residentName: 'Arjun Kumar',
      unit: 'Flat A-1204',
      phone: '+91 98765 43210',
      amount: amount,
      purpose: purpose,
      method: cashSubOption === 'guard_doorstep' ? 'SECURITY_DOORSTEP' : 'ESTATE_OFFICE',
      slot: cashSlot,
      notes: cashNotes
    });

    setTimeout(() => {
      setIsCashDispatching(false);
      const receipt = {
        receiptNo: cashReq.id,
        txnId: `OTP Code: #${cashReq.verificationCode}`,
        amount: amount,
        purpose: purpose,
        method: cashSubOption === 'guard_doorstep' ? 'Security Guard Doorstep Cash Collection' : 'Estate Office Cash Deposit Slip',
        paidBy: 'Arjun Kumar (Flat A-1204)',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: cashSubOption === 'guard_doorstep' ? 'GUARD_DISPATCHED' : 'CHALLAN_GENERATED',
        modeDetails: cashSubOption === 'guard_doorstep' 
          ? `Assigned: Guard Ramesh (Gate 1) • Slot: ${cashSlot}`
          : 'Clubhouse Ground Floor Counter #2 (09:00 AM - 06:00 PM)',
        verificationCode: cashReq.verificationCode
      };
      setCompletedReceipt(receipt);
      if (onPaymentSuccess) onPaymentSuccess(receipt);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#283044]/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-[#eaedff] flex flex-col max-h-[92vh] overflow-hidden my-auto animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaedff] bg-gradient-to-r from-emerald-50/70 to-blue-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006b2c] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#131b2e]">
                {completedReceipt ? 'Society Official Payment Receipt' : 'Pay Society Dues & Maintenance'}
              </h2>
              <span className="text-xs text-[#3e4a3d]">
                Flat A-1204 • Aparna Bhooja Owners Welfare Association
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {completedReceipt ? (
            /* ================= COMPLETED RECEIPT VIEW ================= */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">check</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    {completedReceipt.status === 'GUARD_DISPATCHED' 
                      ? 'Security Guard Cash Collection Dispatched!' 
                      : completedReceipt.status === 'CHALLAN_GENERATED'
                      ? 'Estate Office Cash Deposit Slip Created!'
                      : 'Payment Successfully Acknowledged!'}
                  </h3>
                  <p className="text-xs text-emerald-800">
                    {completedReceipt.status === 'GUARD_DISPATCHED'
                      ? `Guard Ramesh has received the task for Flat A-1204. Please verify with OTP #${completedReceipt.verificationCode} upon cash handover.`
                      : 'Digital receipt has been logged to your resident ledger.'}
                  </p>
                </div>
              </div>

              {/* Printable Receipt Card */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-4">
                <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">OFFICIAL RECEIPT</span>
                    <div className="text-sm font-extrabold text-gray-900">{completedReceipt.receiptNo}</div>
                    <div className="text-[11px] text-gray-500">Aparna Bhooja Owners Welfare Association (ABOWA)</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                      {completedReceipt.status === 'GUARD_DISPATCHED' ? 'DISPATCHED' : 'SETTLED ✓'}
                    </span>
                    <div className="text-[10px] text-gray-500 mt-1">{completedReceipt.date} • {completedReceipt.time}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] block">FLAT & RESIDENT</span>
                    <strong className="text-gray-800">{completedReceipt.paidBy}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">PAYMENT METHOD</span>
                    <strong className="text-gray-800">{completedReceipt.method}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">PURPOSE / PARTICULARS</span>
                    <strong className="text-gray-800">{completedReceipt.purpose}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">TRANSACTION REF / DETAILS</span>
                    <strong className="text-gray-800 font-mono">{completedReceipt.txnId}</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Total Amount Handled / Paid:</span>
                  <span className="text-xl font-black text-[#006b2c]">₹{Number(completedReceipt.amount).toLocaleString('en-IN')}.00</span>
                </div>

                <div className="text-[11px] text-gray-500 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-700 text-sm">info</span>
                  <span>{completedReceipt.modeDetails}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCompletedReceipt(null);
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ================= PAYMENT METHOD SELECTION ================= */
            <>
              {/* Select Bill or Purpose */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  1. Select Payment Head or Advance Due
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleBillSelect('maint')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedBill === 'maint'
                        ? 'border-[#006b2c] bg-emerald-50/60 ring-2 ring-[#006b2c]/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">November 2025</span>
                      <span className="text-xs font-extrabold text-[#006b2c]">₹4,250</span>
                    </div>
                    <span className="text-[11px] text-gray-500 block mt-0.5">Advance Flat Maintenance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBillSelect('sinking')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedBill === 'sinking'
                        ? 'border-[#006b2c] bg-emerald-50/60 ring-2 ring-[#006b2c]/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Sinking Fund</span>
                      <span className="text-xs font-extrabold text-[#006b2c]">₹1,500</span>
                    </div>
                    <span className="text-[11px] text-gray-500 block mt-0.5">Clubhouse &amp; Lift Reserve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBillSelect('custom')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedBill === 'custom'
                        ? 'border-[#006b2c] bg-emerald-50/60 ring-2 ring-[#006b2c]/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Custom Amount</span>
                      <span className="text-xs font-extrabold text-blue-700">Ad-hoc</span>
                    </div>
                    <span className="text-[11px] text-gray-500 block mt-0.5">Partial / Advance Deposit</span>
                  </button>
                </div>

                {selectedBill === 'custom' && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">Enter Amount (₹):</span>
                    <input
                      type="number"
                      min="100"
                      value={customAmountInput}
                      onChange={handleCustomAmountChange}
                      placeholder="e.g. 5000"
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-900 w-36 focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Total Amount Badge */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500">Payable to ABOWA:</span>
                  <div className="text-xs font-bold text-gray-900">{purpose}</div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#006b2c]">₹{Number(amount).toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* 2. Payment Method Selector */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  2. Choose Payment Mode
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'upi', label: 'UPI QR Code', icon: 'qr_code_2' },
                    { id: 'bank', label: 'Bank Transfer', icon: 'account_balance' },
                    { id: 'card', label: 'Debit / Card', icon: 'credit_card' },
                    { id: 'cash', label: 'Cash Collection', icon: 'payments' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentMethod(tab.id)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        paymentMethod === tab.id
                          ? 'border-[#006b2c] bg-emerald-50/80 text-[#006b2c] font-bold shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                      <span className="text-xs">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ================= TAB 1: UPI WITH QR CODE ================= */}
              {paymentMethod === 'upi' && (
                <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Visual QR Code Generator */}
                    <div className="flex flex-col items-center p-3 bg-white rounded-2xl border-2 border-[#006b2c]/30 shadow-md">
                      {/* High quality SVG QR Code illustration */}
                      <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" fill="white"/>
                        {/* Corner Targets */}
                        <rect x="5" y="5" width="26" height="26" fill="#131b2e" rx="2"/>
                        <rect x="9" y="9" width="18" height="18" fill="white" rx="1"/>
                        <rect x="13" y="13" width="10" height="10" fill="#006b2c"/>
                        
                        <rect x="69" y="5" width="26" height="26" fill="#131b2e" rx="2"/>
                        <rect x="73" y="9" width="18" height="18" fill="white" rx="1"/>
                        <rect x="77" y="13" width="10" height="10" fill="#006b2c"/>
                        
                        <rect x="5" y="69" width="26" height="26" fill="#131b2e" rx="2"/>
                        <rect x="9" y="73" width="18" height="18" fill="white" rx="1"/>
                        <rect x="13" y="77" width="10" height="10" fill="#006b2c"/>

                        {/* QR Data Pattern */}
                        <rect x="36" y="8" width="5" height="5" fill="#131b2e"/>
                        <rect x="46" y="8" width="5" height="5" fill="#131b2e"/>
                        <rect x="56" y="8" width="5" height="5" fill="#131b2e"/>
                        
                        <rect x="36" y="18" width="10" height="5" fill="#131b2e"/>
                        <rect x="52" y="18" width="5" height="5" fill="#131b2e"/>
                        
                        <rect x="8" y="36" width="5" height="5" fill="#131b2e"/>
                        <rect x="18" y="36" width="10" height="5" fill="#131b2e"/>
                        <rect x="34" y="34" width="8" height="8" fill="#006b2c"/>
                        <rect x="48" y="34" width="6" height="6" fill="#131b2e"/>
                        <rect x="60" y="36" width="10" height="5" fill="#131b2e"/>
                        <rect x="78" y="36" width="14" height="5" fill="#131b2e"/>

                        <rect x="8" y="48" width="12" height="6" fill="#131b2e"/>
                        <rect x="26" y="48" width="6" height="6" fill="#131b2e"/>
                        <rect x="38" y="46" width="24" height="12" fill="#006b2c" rx="2"/>
                        <text x="40" y="55" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">UPI</text>
                        <rect x="68" y="48" width="6" height="6" fill="#131b2e"/>
                        <rect x="80" y="48" width="12" height="6" fill="#131b2e"/>

                        <rect x="36" y="68" width="6" height="6" fill="#131b2e"/>
                        <rect x="48" y="68" width="10" height="6" fill="#131b2e"/>
                        <rect x="64" y="68" width="8" height="6" fill="#131b2e"/>
                        <rect x="78" y="68" width="14" height="6" fill="#131b2e"/>

                        <rect x="36" y="80" width="12" height="6" fill="#131b2e"/>
                        <rect x="54" y="80" width="6" height="6" fill="#131b2e"/>
                        <rect x="66" y="80" width="12" height="6" fill="#131b2e"/>
                        <rect x="84" y="80" width="8" height="6" fill="#131b2e"/>
                      </svg>
                      <span className="text-[10px] font-bold text-gray-500 mt-1">Scan with any UPI App</span>
                    </div>

                    {/* Instructions & UPI ID */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500">Official Society UPI VPA:</span>
                        <div className="mt-1 flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                          <code className="text-xs font-mono font-bold text-gray-900">
                            aparnabhooja.society@hdfcbank
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('aparnabhooja.society@hdfcbank', 'upi')}
                            className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[11px] font-bold text-[#006b2c] cursor-pointer flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                            <span>{copiedField === 'upi' ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-gray-600 space-y-1">
                        <div>• Payee: <strong>Aparna Bhooja Owners Welfare Association</strong></div>
                        <div>• Mention Remarks: <code>FLAT A-1204 MAINT</code></div>
                        <div>• Supported: GPay, PhonePe, Paytm, BHIM, CRED, AmazonPay</div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleUpiPayment} className="space-y-3 pt-3 border-t border-gray-100">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">
                        ENTER 12-DIGIT UPI UTR / TRANSACTION ID (OPTIONAL FOR QUICK DEMO):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 428192081920 or leave blank to auto-verify"
                        value={upiUtr}
                        onChange={(e) => setUpiUtr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingUpi}
                      className="w-full py-3 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isVerifyingUpi ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                          <span>Verifying with HDFC UPI Gateway...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">verified</span>
                          <span>Confirm UPI Payment &amp; Get Official Tax Receipt</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* ================= TAB 2: BANK TRANSFER (NEFT/RTGS) ================= */}
              {paymentMethod === 'bank' && (
                <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-blue-700 text-base">account_balance</span>
                        <span>Society Official Current Account</span>
                      </span>
                      <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">
                        HDFC Bank
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 text-[10px] block">BENEFICIARY NAME</span>
                        <strong className="text-gray-900">Aparna Bhooja Owners Welfare Association</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] block">ACCOUNT NUMBER</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-900 font-mono">50200084920194</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('50200084920194', 'acc')}
                            className="text-[#006b2c] hover:underline text-[10px] font-bold"
                          >
                            {copiedField === 'acc' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] block">IFSC CODE</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-900 font-mono">HDFC0001234</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('HDFC0001234', 'ifsc')}
                            className="text-[#006b2c] hover:underline text-[10px] font-bold"
                          >
                            {copiedField === 'ifsc' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] block">BRANCH</span>
                        <strong className="text-gray-900">Hitec City, Hyderabad - 500081</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-blue-900 bg-white p-2 rounded-lg border border-blue-100">
                      Mandatory Remarks in Bank App: <code className="font-bold text-blue-950">FLAT A-1204</code>
                    </div>
                  </div>

                  <form onSubmit={handleBankPayment} className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">
                        ENTER BANK UTR / NEFT REFERENCE NUMBER:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HDFCN251029102"
                        value={bankUtr}
                        onChange={(e) => setBankUtr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">receipt_long</span>
                      <span>Submit Bank Transfer Ref &amp; Acknowledge</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ================= TAB 3: DEBIT / CREDIT CARD ================= */}
              {paymentMethod === 'card' && (
                <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4">
                  <form onSubmit={handleCardPayment} className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4532 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">lock</span>
                      <span>256-bit SSL encrypted society payment gateway</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isCardProcessing}
                      className="w-full py-3 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isCardProcessing ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">payment</span>
                          <span>Pay ₹{Number(amount).toLocaleString('en-IN')} via Card</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* ================= TAB 4: CASH DEPOSIT / SECURITY GUARD PICKUP ================= */}
              {paymentMethod === 'cash' && (
                <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                      Select How You Wish to Deposit Cash:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option A: Guard Doorstep Collection */}
                      <div
                        onClick={() => setCashSubOption('guard_doorstep')}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                          cashSubOption === 'guard_doorstep'
                            ? 'border-[#006b2c] bg-emerald-50/70 ring-2 ring-[#006b2c]/20'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[#006b2c] text-base">shield_person</span>
                              <span>Security Guard Collection</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#006b2c] text-[10px] font-bold">
                              Doorstep
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed">
                            Security guard visits <strong>Flat A-1204</strong> with the physical receipt book to collect cash.
                          </p>
                        </div>
                      </div>

                      {/* Option B: Estate Office Center Deposit */}
                      <div
                        onClick={() => setCashSubOption('estate_office')}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                          cashSubOption === 'estate_office'
                            ? 'border-[#006b2c] bg-emerald-50/70 ring-2 ring-[#006b2c]/20'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-blue-700 text-base">storefront</span>
                              <span>Estate Office Counter</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
                              Self Deposit
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed">
                            Visit Society Facility Center at Clubhouse Ground Floor (Counter #2).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cash Form Details */}
                  <form onSubmit={handleCashRequest} className="space-y-3 pt-2">
                    {cashSubOption === 'guard_doorstep' ? (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                        <div className="text-xs text-amber-950">
                          <strong>Doorstep Security Guard Cash Collection details:</strong>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">
                            Preferred Time Slot for Security Guard Visit:
                          </label>
                          <select
                            value={cashSlot}
                            onChange={(e) => setCashSlot(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                          >
                            <option value="Today (04:00 PM - 06:00 PM)">Today (04:00 PM - 06:00 PM)</option>
                            <option value="Today (06:00 PM - 08:00 PM)">Today (06:00 PM - 08:00 PM)</option>
                            <option value="Tomorrow (10:00 AM - 12:00 PM)">Tomorrow (10:00 AM - 12:00 PM)</option>
                            <option value="Tomorrow (02:00 PM - 04:00 PM)">Tomorrow (02:00 PM - 04:00 PM)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">
                            Notes for Guard / Denomination Details (Optional):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Exact cash kept ready (₹500 × 8 + ₹250)"
                            value={cashNotes}
                            onChange={(e) => setCashNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                          />
                        </div>

                        <div className="text-[11px] text-amber-900 bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                          🛡️ Assigned Guard: <strong>Guard Ramesh (Gate 1 Security Desk)</strong>. A 4-digit verification OTP will be generated on submission. Hand over cash only after guard verifies your OTP.
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs text-blue-950">
                        <div className="font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-blue-700">location_on</span>
                          <span>Society Facility Center / Estate Management Office</span>
                        </div>
                        <p className="text-[11px] text-gray-700 leading-relaxed">
                          • Location: <strong>Clubhouse Ground Floor, Counter #2 (Accounts &amp; Billings)</strong><br />
                          • Office Timings: <strong>Monday to Saturday, 09:00 AM to 06:00 PM</strong><br />
                          • Mention your flat number: <strong>Flat A-1204</strong> at the counter.<br />
                          • Immediate stamped receipt will be issued on cash handover.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isCashDispatching}
                      className="w-full py-3 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isCashDispatching ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                          <span>Notifying Security Desk...</span>
                        </>
                      ) : cashSubOption === 'guard_doorstep' ? (
                        <>
                          <span className="material-symbols-outlined text-base">shield_person</span>
                          <span>Dispatch Security Guard to Flat A-1204 for Cash Collection</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">assignment</span>
                          <span>Generate Estate Office Deposit Challan</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
