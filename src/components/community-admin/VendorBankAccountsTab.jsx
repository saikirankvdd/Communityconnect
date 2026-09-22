import React, { useState } from 'react';

export const VendorBankAccountsTab = ({
  treasuryData,
  inflowLedger = [],
  amcContracts = [],
  onOpenPayout,
  onDepositCash,
  onReconcileInflows,
  isAuditingInflows,
  showToast
}) => {
  // Account selection state: 'ALL' | 'OPERATING_BANK' | 'SINKING_FUND' | 'CASH_VAULT'
  const [selectedAccount, setSelectedAccount] = useState('ALL');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('ALL'); // 'ALL' | 'OUTFLOWS' | 'INFLOWS'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuditSlip, setSelectedAuditSlip] = useState(null);
  const [showAccountSelectorDropdown, setShowAccountSelectorDropdown] = useState(false);

  const operatingBal = treasuryData?.accounts?.operatingBank ?? 4280000;
  const sinkingBal = treasuryData?.accounts?.sinkingFundFD ?? 18450000;
  const cashBal = treasuryData?.accounts?.cashVault ?? 345000;
  const totalSocietyFunds = operatingBal + sinkingBal + cashBal;

  // Account definitions
  const accountDefinitions = [
    {
      id: 'OPERATING_BANK',
      name: 'HDFC Corporate Current A/C',
      bankName: 'HDFC Bank Ltd',
      accountNumber: treasuryData?.accounts?.accountNumber || '4409-1092-8371-92',
      ifsc: treasuryData?.accounts?.ifsc || 'HDFC0001092',
      branch: 'Jubilee Hills, Hyderabad',
      type: 'Operating Current Account',
      balance: operatingBal,
      color: 'green',
      badge: 'Live Gateway Active',
      description: 'Primary operational account for vendor AMCs, staff payroll, utility remittances, and resident maintenance dues collection.',
      rails: ['RTGS', 'Corporate NEFT', 'Instant IMPS', 'UPI AutoPay']
    },
    {
      id: 'SINKING_FUND',
      name: 'SBI Statutory Sinking Fund FD',
      bankName: 'State Bank of India',
      accountNumber: 'SBI-SWEEP-9901-2831',
      ifsc: 'SBIN0004120',
      branch: 'Banjara Hills, Hyderabad',
      type: 'Statutory Auto-Sweep Term Deposit',
      balance: sinkingBal,
      color: 'blue',
      badge: '7.25% p.a. Compounding',
      description: 'Statutory capital reserve earmarked for major structural overhauls, lift replacements, and substation maintenance under bye-law compliance.',
      rails: ['Statutory RTGS', 'Term Deposit Auto-Sweep']
    },
    {
      id: 'CASH_VAULT',
      name: 'Estate Office Petty Cash Safe',
      bankName: 'Society Physical Vault',
      accountNumber: 'SAFE-ROOM-102-VAULT',
      ifsc: 'PHYSICAL-VAULT',
      branch: 'Clubhouse Office Room 102',
      type: 'Petty Cash Safe',
      balance: cashBal,
      color: 'amber',
      badge: 'Dual-Key Lock Verified',
      description: 'On-premise secure safe managed under joint custody of Estate Manager & Treasurer for emergency spot repairs, diesel deliveries, and gate slips.',
      rails: ['Cash Voucher (Physical Dual-Key)', 'Direct Bank Deposit']
    }
  ];

  const currentSelectedAccountObj = accountDefinitions.find((a) => a.id === selectedAccount) || null;

  // Pending AMC Invoices that need payment
  const pendingInvoices = (amcContracts || []).filter(
    (c) => c.pendingInvoice && c.pendingInvoiceAmount > 0
  );

  // Filter Outflows based on selectedAccount
  const allOutflows = (treasuryData?.transactions || []).filter(
    (t) => t.type === 'PAYOUT' || t.type === 'PAYMENT' || t.type === 'WITHDRAWAL'
  );

  const filteredOutflows = allOutflows.filter((t) => {
    if (selectedAccount === 'OPERATING_BANK') {
      const fromStr = (t.from || '').toLowerCase();
      return fromStr.includes('hdfc') || fromStr.includes('operating') || fromStr.includes('bank');
    }
    if (selectedAccount === 'SINKING_FUND') {
      const fromStr = (t.from || '').toLowerCase();
      return fromStr.includes('sinking') || fromStr.includes('sbi');
    }
    if (selectedAccount === 'CASH_VAULT') {
      const fromStr = (t.from || '').toLowerCase();
      return fromStr.includes('cash') || fromStr.includes('vault') || fromStr.includes('safe');
    }
    return true; // 'ALL'
  });

  // Filter Inflows based on selectedAccount
  const filteredInflows = (inflowLedger || []).filter((item) => {
    if (selectedAccount === 'OPERATING_BANK') {
      const bankStr = (item.bank || '').toLowerCase();
      return bankStr.includes('hdfc') || bankStr.includes('upi') || bankStr.includes('razorpay') || bankStr.includes('kotak');
    }
    if (selectedAccount === 'SINKING_FUND') {
      const bankStr = (item.bank || '').toLowerCase();
      return bankStr.includes('sbi') || bankStr.includes('neft') || bankStr.includes('escrow');
    }
    if (selectedAccount === 'CASH_VAULT') {
      const bankStr = (item.bank || '').toLowerCase();
      return bankStr.includes('cash') || bankStr.includes('vault') || bankStr.includes('safe');
    }
    return true; // 'ALL'
  });

  // Search filter across transactions
  const searchedOutflows = filteredOutflows.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.id && t.id.toLowerCase().includes(q)) ||
      (t.to && t.to.toLowerCase().includes(q)) ||
      (t.reference && t.reference.toLowerCase().includes(q)) ||
      (t.title && t.title.toLowerCase().includes(q))
    );
  });

  const searchedInflows = filteredInflows.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item.source && item.source.toLowerCase().includes(q)) ||
      (item.utr && item.utr.toLowerCase().includes(q)) ||
      (item.type && item.type.toLowerCase().includes(q))
    );
  });

  const totalSelectedOutflow = searchedOutflows.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalSelectedInflow = searchedInflows.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Helper to get active balance text
  const getSelectedAccountBalance = () => {
    if (selectedAccount === 'OPERATING_BANK') return operatingBal;
    if (selectedAccount === 'SINKING_FUND') return sinkingBal;
    if (selectedAccount === 'CASH_VAULT') return cashBal;
    return totalSocietyFunds;
  };

  const activeAccountBalance = getSelectedAccountBalance();

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Executive Treasury Control Header & Top Actions */}
      <div className="bg-gradient-to-r from-[#131b2e] via-[#1a243b] to-[#131b2e] rounded-2xl p-6 text-white shadow-lg border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#7ffc97] shrink-0 border border-white/15 shadow-inner">
            <span className="material-symbols-outlined text-2xl">account_balance</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl font-black tracking-tight">Bank Accounts &amp; Corporate Cash Management</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#006b2c] text-[#7ffc97] border border-[#7ffc97]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7ffc97] animate-pulse" />
                Live Gateway Synced
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Official banking command center for Oakridge Heights Co-Op Society. Check available cash on each bank account, audit resident maintenance cash inflows, and disburse corporate payouts to vendors with President dual-key authorization.
            </p>
          </div>
        </div>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={onReconcileInflows}
            disabled={isAuditingInflows}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <span className={`material-symbols-outlined text-base ${isAuditingInflows ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isAuditingInflows ? 'Auditing...' : 'Reconcile Feeds'}</span>
          </button>

          <button
            type="button"
            onClick={onDepositCash}
            className="px-3.5 py-2 bg-[#ffddb8]/20 hover:bg-[#ffddb8]/30 text-[#ffddb8] border border-[#ffddb8]/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">savings</span>
            <span>Deposit Vault to Bank</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenPayout('', '', '', selectedAccount !== 'ALL' ? selectedAccount : 'OPERATING_BANK')}
            className="px-4 py-2 bg-[#00873a] hover:bg-[#00a848] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>+ Payout Vendor</span>
          </button>
        </div>
      </div>

      {/* 2. AVAILABLE BANK ACCOUNTS SELECTOR BUTTON & INTERACTIVE CARDS */}
      <div className="flex flex-col gap-3">
        {/* Selector Toolbar & Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#eaedff] shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#e8f5e9] text-[#006b2c]">
              <span className="material-symbols-outlined text-lg">wallet</span>
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#131b2e]">Available Bank Accounts &amp; Cash Balances</h4>
              <p className="text-[11px] text-[#6e7b6c]">
                Select any bank account below to inspect its available cash and view payments done through it.
              </p>
            </div>
          </div>

          {/* Quick Select Button & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAccountSelectorDropdown((prev) => !prev)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold transition-colors cursor-pointer border border-[#eaedff]"
            >
              <span className="material-symbols-outlined text-base text-[#006b2c]">account_balance</span>
              <span>
                {selectedAccount === 'ALL'
                  ? 'All Accounts (Consolidated)'
                  : currentSelectedAccountObj?.name || 'Select Bank Account'}
              </span>
              <span className="material-symbols-outlined text-sm text-gray-500">
                {showAccountSelectorDropdown ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showAccountSelectorDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#eaedff] z-40 p-2 flex flex-col gap-1 animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAccount('ALL');
                    setShowAccountSelectorDropdown(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedAccount === 'ALL' ? 'bg-[#e8f5e9] font-bold text-[#006b2c]' : 'hover:bg-[#f2f3ff] text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">domain</span>
                    <span>All Accounts (Consolidated)</span>
                  </div>
                  <span className="font-mono font-bold">₹{(totalSocietyFunds / 100000).toFixed(2)}L</span>
                </button>

                {accountDefinitions.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      setSelectedAccount(acc.id);
                      setShowAccountSelectorDropdown(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedAccount === acc.id ? 'bg-[#e8f5e9] font-bold text-[#006b2c]' : 'hover:bg-[#f2f3ff] text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{acc.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{acc.accountNumber}</div>
                    </div>
                    <span className="font-mono font-bold">₹{(acc.balance / 100000).toFixed(2)}L</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4 Interactive Bank Account Cards (Click to Select) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 0: All Accounts Consolidated */}
          <div
            onClick={() => setSelectedAccount('ALL')}
            className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between border ${
              selectedAccount === 'ALL'
                ? 'bg-gradient-to-br from-[#131b2e] to-[#1f2942] text-white border-[#131b2e] shadow-md ring-2 ring-[#006b2c]'
                : 'bg-white text-[#131b2e] border-[#eaedff] hover:border-[#131b2e] shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  selectedAccount === 'ALL' ? 'bg-white/20 text-white' : 'bg-[#f2f3ff] text-gray-700'
                }`}>
                  Consolidated Treasury
                </span>
                <span className="material-symbols-outlined text-lg">
                  {selectedAccount === 'ALL' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
              <div className="text-xs font-medium opacity-80">Total Available Cash</div>
              <div className="text-2xl font-black font-mono tracking-tight mt-0.5">
                ₹{totalSocietyFunds.toLocaleString('en-IN')}
              </div>
              <p className={`text-[11px] mt-2 pt-2 border-t ${
                selectedAccount === 'ALL' ? 'border-white/15 text-gray-300' : 'border-gray-100 text-gray-500'
              }`}>
                Combined operating balance across HDFC Current A/C, SBI Sinking Term Deposit, and Cash Safe.
              </p>
            </div>
            <div className="mt-3 pt-2 text-[11px] font-bold flex items-center justify-between">
              <span className={selectedAccount === 'ALL' ? 'text-[#7ffc97]' : 'text-[#006b2c]'}>
                {selectedAccount === 'ALL' ? '✓ Currently Inspected' : 'Click to View All'}
              </span>
              <span className="text-[10px] opacity-75">3 Sources</span>
            </div>
          </div>

          {/* Card 1: HDFC Operating Current Account */}
          <div
            onClick={() => setSelectedAccount('OPERATING_BANK')}
            className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between border ${
              selectedAccount === 'OPERATING_BANK'
                ? 'bg-[#f0fdf4] border-[#006b2c] shadow-md ring-2 ring-[#006b2c]'
                : 'bg-white border-[#eaedff] hover:border-[#006b2c] shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-[#e8f5e9] text-[#006b2c] text-[10px] font-bold uppercase tracking-wider">
                  Operating Current A/C
                </span>
                <span className="material-symbols-outlined text-lg text-[#006b2c]">
                  {selectedAccount === 'OPERATING_BANK' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
              <div className="text-xs font-semibold text-gray-600 font-mono">HDFC Bank Ltd</div>
              <div className="text-2xl font-black text-[#006b2c] font-mono tracking-tight mt-0.5">
                ₹{operatingBal.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-gray-500 font-mono mt-1">
                A/C: <span className="font-bold text-gray-700">4409-1092-8371-92</span>
              </div>
              <p className="text-[11px] text-[#6e7b6c] mt-2 pt-2 border-t border-gray-100">
                Operating funds for monthly vendor payouts, staff payroll, common electricity, and water bills.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] font-bold flex items-center justify-between">
              <span className="text-[#006b2c]">
                {selectedAccount === 'OPERATING_BANK' ? '✓ Account Selected' : 'Select Account'}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">IFSC: HDFC0001092</span>
            </div>
          </div>

          {/* Card 2: SBI Statutory Sinking Fund FD */}
          <div
            onClick={() => setSelectedAccount('SINKING_FUND')}
            className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between border ${
              selectedAccount === 'SINKING_FUND'
                ? 'bg-[#f0f9ff] border-[#006591] shadow-md ring-2 ring-[#006591]'
                : 'bg-white border-[#eaedff] hover:border-[#006591] shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-[#c9e6ff] text-[#006591] text-[10px] font-bold uppercase tracking-wider">
                  Sinking Fund Reserve
                </span>
                <span className="material-symbols-outlined text-lg text-[#006591]">
                  {selectedAccount === 'SINKING_FUND' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
              <div className="text-xs font-semibold text-gray-600 font-mono">State Bank of India</div>
              <div className="text-2xl font-black text-[#006591] font-mono tracking-tight mt-0.5">
                ₹{sinkingBal.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-gray-500 font-mono mt-1">
                Ref: <span className="font-bold text-gray-700">SBI-SWEEP-9901-2831</span>
              </div>
              <p className="text-[11px] text-[#6e7b6c] mt-2 pt-2 border-t border-gray-100">
                Statutory reserve yielding 7.25% p.a. for major lift overhauls, exterior painting, and transformer replacement.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] font-bold flex items-center justify-between">
              <span className="text-[#006591]">
                {selectedAccount === 'SINKING_FUND' ? '✓ Account Selected' : 'Select Account'}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">7.25% p.a.</span>
            </div>
          </div>

          {/* Card 3: Estate Office Petty Cash Safe */}
          <div
            onClick={() => setSelectedAccount('CASH_VAULT')}
            className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between border ${
              selectedAccount === 'CASH_VAULT'
                ? 'bg-[#fffbeb] border-[#825100] shadow-md ring-2 ring-[#825100]'
                : 'bg-white border-[#eaedff] hover:border-[#825100] shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-[#ffddb8] text-[#825100] text-[10px] font-bold uppercase tracking-wider">
                  Petty Cash Safe
                </span>
                <span className="material-symbols-outlined text-lg text-[#825100]">
                  {selectedAccount === 'CASH_VAULT' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
              <div className="text-xs font-semibold text-gray-600 font-mono">Office Safe Room 102</div>
              <div className="text-2xl font-black text-[#825100] font-mono tracking-tight mt-0.5">
                ₹{cashBal.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Custodian: <span className="font-bold text-gray-700">Estate Manager &amp; Treasurer</span>
              </div>
              <p className="text-[11px] text-[#6e7b6c] mt-2 pt-2 border-t border-gray-100">
                Physical vault cash for spot plumbing spares, emergency diesel delivery, and gate overtime slips.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] font-bold flex items-center justify-between">
              <span className="text-[#825100]">
                {selectedAccount === 'CASH_VAULT' ? '✓ Account Selected' : 'Select Account'}
              </span>
              <span className="text-[10px] text-gray-600">Dual-Key</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SELECTED ACCOUNT LIQUIDITY STATUS & DISBURSAL LAUNCHPAD */}
      <div className="bg-white rounded-2xl p-6 border border-[#eaedff] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            selectedAccount === 'OPERATING_BANK'
              ? 'bg-[#e8f5e9] text-[#006b2c]'
              : selectedAccount === 'SINKING_FUND'
              ? 'bg-[#c9e6ff] text-[#006591]'
              : selectedAccount === 'CASH_VAULT'
              ? 'bg-[#ffddb8] text-[#825100]'
              : 'bg-[#f2f3ff] text-[#131b2e]'
          }`}>
            <span className="material-symbols-outlined text-3xl">
              {selectedAccount === 'CASH_VAULT' ? 'savings' : 'account_balance'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Inspected Account Liquidity
              </span>
              <span className="text-gray-300">•</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5e9] text-[#006b2c]">
                Active Disbursal Source
              </span>
            </div>

            <h2 className="text-xl font-black text-[#131b2e] tracking-tight mt-0.5">
              {selectedAccount === 'ALL'
                ? 'All Society Bank Accounts & Cash Vault'
                : currentSelectedAccountObj?.name}
            </h2>

            <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
              <span className="text-xs text-gray-500 font-semibold">Available Cash on this Account:</span>
              <span className={`text-3xl font-black font-mono tracking-tight ${
                selectedAccount === 'OPERATING_BANK'
                  ? 'text-[#006b2c]'
                  : selectedAccount === 'SINKING_FUND'
                  ? 'text-[#006591]'
                  : selectedAccount === 'CASH_VAULT'
                  ? 'text-[#825100]'
                  : 'text-[#131b2e]'
              }`}>
                ₹{activeAccountBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-xs text-[#6e7b6c] mt-1 max-w-xl">
              {selectedAccount === 'ALL'
                ? 'Consolidated funds ready for statutory reserve compliance, operational expenses, and vendor AMC disbursements.'
                : currentSelectedAccountObj?.description}
            </p>
          </div>
        </div>

        {/* Action Buttons for Selected Account */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {selectedAccount === 'CASH_VAULT' ? (
            <button
              type="button"
              onClick={onDepositCash}
              className="px-4 py-2.5 bg-[#825100] hover:bg-[#6c4300] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">savings</span>
              <span>Deposit Cash Vault to HDFC Bank</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenPayout('', '', '', selectedAccount !== 'ALL' ? selectedAccount : 'OPERATING_BANK')}
              className="px-4 py-2.5 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">send_money</span>
              <span>
                Payout Vendor from {selectedAccount === 'SINKING_FUND' ? 'Sinking Fund' : 'HDFC Account'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => showToast(`Audit ledger exported for ${currentSelectedAccountObj?.name || 'All Accounts'}.`, 'info')}
            className="px-3.5 py-2.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Download Statement</span>
          </button>
        </div>
      </div>

      {/* 4. CORPORATE VENDOR INVOICES READY FOR PAYOUT (MOVED HERE FROM VENDORS & STAFF) */}
      <div className="bg-white rounded-2xl border border-[#eaedff] shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#eaedff] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#fffbfa] to-white">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] shrink-0">
              <span className="material-symbols-outlined text-xl">receipt_long</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-[#131b2e] tracking-tight">
                  Vendor Invoices Ready for Bank Payout
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdad6] text-[#ba1a1a]">
                  {pendingInvoices.length} Invoices Pending Authorization
                </span>
              </div>
              <p className="text-xs text-[#6e7b6c] mt-0.5">
                Review verified vendor bills and disburse direct RTGS/NEFT payment using society bank accounts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenPayout('', '', '', selectedAccount !== 'ALL' ? selectedAccount : 'OPERATING_BANK')}
            className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Authorize Custom Vendor Payout</span>
          </button>
        </div>

        {pendingInvoices.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-[#006b2c]">check_circle</span>
            <div className="font-bold text-[#131b2e] text-sm">All Vendor Invoices Settled!</div>
            <p className="text-xs text-[#6e7b6c] max-w-md">
              There are no outstanding vendor invoices awaiting payment. All AMC contracts and contractor disbursements are up to date.
            </p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 rounded-2xl bg-white border border-[#ffdad6] shadow-xs flex flex-col justify-between gap-4 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#131b2e]">{inv.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdad6] text-[#ba1a1a]">
                          Invoice Due
                        </span>
                      </div>
                      <span className="text-xs text-[#6e7b6c] block mt-0.5">{inv.category}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Pending Payout</span>
                      <span className="text-lg font-black text-[#ba1a1a] font-mono">
                        ₹{inv.pendingInvoiceAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-[#f8f9ff] border border-[#eaedff] text-xs flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Invoice Ref:</span>
                      <span className="font-mono font-bold text-[#131b2e]">{inv.invoiceRef}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">SLA Guarantee:</span>
                      <span className="font-bold text-[#006b2c]">{inv.slaGuarantee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Assigned Lead / Supervisor:</span>
                      <span className="font-semibold text-gray-700">{inv.supervisor} ({inv.phone})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-[11px] text-gray-500">
                    Debit from: <span className="font-bold text-[#006b2c]">{currentSelectedAccountObj?.name || 'HDFC Operating A/C'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenPayout(inv.name, inv.pendingInvoiceAmount, inv.invoiceRef, selectedAccount !== 'ALL' ? selectedAccount : 'OPERATING_BANK')}
                    className="px-4 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">send_money</span>
                    <span>Payout ₹{inv.pendingInvoiceAmount?.toLocaleString('en-IN')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. PAYMENTS DONE THROUGH SELECTED BANK ACCOUNT (OUTFLOWS & INFLOWS) */}
      <div className="bg-white rounded-2xl border border-[#eaedff] shadow-sm overflow-hidden flex flex-col">
        {/* Header & Tabs */}
        <div className="p-5 border-b border-[#eaedff] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fbfbfe]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#e8f5e9] text-[#006b2c]">
                <span className="material-symbols-outlined text-base">receipt</span>
              </span>
              <h4 className="text-sm font-black text-[#131b2e] tracking-tight">
                Payments Done Through {selectedAccount === 'ALL' ? 'All Society Accounts' : currentSelectedAccountObj?.name}
              </h4>
            </div>
            <p className="text-xs text-[#6e7b6c] mt-0.5">
              Detailed bank statement showing payouts disbursed to vendors and maintenance cash inflows credited into this account.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400">Net Outflow on Account</div>
              <div className="text-sm font-black text-[#ba1a1a] font-mono">
                -₹{totalSelectedOutflow.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="h-7 w-px bg-gray-200" />
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Inflow Credited</div>
              <div className="text-sm font-black text-[#006b2c] font-mono">
                +₹{totalSelectedInflow.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar: Search & Transaction Direction Tabs */}
        <div className="p-4 border-b border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">search</span>
            <input
              type="text"
              placeholder="Search by Payee, UTR, Invoice or Unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#f2f3ff] rounded-xl text-xs font-semibold text-[#131b2e] border border-transparent focus:border-[#006b2c] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'ALL', label: `All Payments (${searchedOutflows.length + searchedInflows.length})` },
              { id: 'OUTFLOWS', label: `Vendor Payouts & Disbursals (${searchedOutflows.length})` },
              { id: 'INFLOWS', label: `Inflow Dues Credited (${searchedInflows.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTransactionTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  transactionTypeFilter === tab.id
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#6e7b6c] hover:text-[#131b2e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9ff] text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-[#eaedff]">
              <tr>
                <th className="py-3 px-4">Transaction / UTR</th>
                <th className="py-3 px-4">Entity (Payee / Payer)</th>
                <th className="py-3 px-4">Debit / Credit Route</th>
                <th className="py-3 px-4">Category / Purpose</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Signatory / Audit</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff]">
              {/* Render Outflows */}
              {(transactionTypeFilter === 'ALL' || transactionTypeFilter === 'OUTFLOWS') &&
                searchedOutflows.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f8f9ff]/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#131b2e] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#ba1a1a]">arrow_outward</span>
                        <span>{tx.id}</span>
                      </div>
                      <div className="text-[10px] font-mono text-gray-500">{tx.reference}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#131b2e]">{tx.to}</div>
                      <div className="text-[10px] text-gray-500">{tx.title}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium font-mono text-[11px]">
                      {tx.from}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdad6] text-[#ba1a1a]">
                        VENDOR PAYOUT
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 text-right font-black font-mono text-[#ba1a1a]">
                      -₹{Number(tx.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5e9] text-[#006b2c] border border-[#a3e635]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c]" />
                        <span>{tx.performedBy || 'Elena Rostova (Pres)'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => showToast(`Voucher ${tx.id} for ${tx.to} verified.`, 'info')}
                        className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        Voucher
                      </button>
                    </td>
                  </tr>
                ))}

              {/* Render Inflows */}
              {(transactionTypeFilter === 'ALL' || transactionTypeFilter === 'INFLOWS') &&
                searchedInflows.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f8f9ff]/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#131b2e] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#006b2c]">arrow_downward</span>
                        <span>{item.id}</span>
                      </div>
                      <div className="text-[10px] font-mono text-gray-500">{item.utr}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#131b2e]">
                      {item.source}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {item.bank}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5e9] text-[#006b2c]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-4 text-right font-black font-mono text-[#006b2c]">
                      +₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5e9] text-[#006b2c] border border-[#a3e635]/40">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        <span>{item.verifiedBy}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAuditSlip(item);
                          showToast(`Audit slip verified for ${item.source} (${item.utr})`, 'info');
                        }}
                        className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        Audit Slip
                      </button>
                    </td>
                  </tr>
                ))}

              {searchedOutflows.length === 0 && searchedInflows.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 text-xs">
                    No transactions recorded for this account with the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Slip Inspect Drawer / Dialog */}
      {selectedAuditSlip && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#eaedff] flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-xl">receipt_long</span>
                <h4 className="text-sm font-bold text-[#131b2e]">Bank Inward Credit Voucher</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAuditSlip(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#eaedff] flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Inward Slip Ref:</span>
                <span className="font-mono font-bold text-[#131b2e]">{selectedAuditSlip.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Bank UTR / Transaction:</span>
                <span className="font-mono font-bold text-gray-800">{selectedAuditSlip.utr}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Payer Entity:</span>
                <span className="font-bold text-[#131b2e]">{selectedAuditSlip.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Inflow Stream:</span>
                <span className="font-semibold text-gray-700">{selectedAuditSlip.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Payment Gateway / Bank:</span>
                <span className="font-medium text-gray-700">{selectedAuditSlip.bank}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Timestamp:</span>
                <span className="text-gray-700">{selectedAuditSlip.timestamp}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#eaedff]">
                <span className="font-bold text-gray-700">Amount Credited:</span>
                <span className="text-base font-black text-[#006b2c] font-mono">
                  +₹{selectedAuditSlip.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={() => setSelectedAuditSlip(null)}
                className="px-4 py-2 bg-[#006b2c] text-white rounded-xl text-xs font-bold hover:bg-[#00873a] cursor-pointer"
              >
                Close Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
