import React, { useState, useEffect } from 'react';
import { serviceApi } from '../../api/serviceApi';
import { BrandLogo } from '../common/BrandLogo';

export const ProviderConsole = ({ currentUser, onNavigate, onLogout }) => {
  // Trade Category (e.g. 'AC Service', 'Electrician', 'Plumber', 'Cook', 'Maid', 'Driver')
  const userTradeCategory = currentUser?.tradeCategory || (
    currentUser?.id === 'usr-prov-volt' ? 'Electrician' : 
    currentUser?.id === 'usr-prov-hydro' ? 'Plumber' : 
    currentUser?.id === 'usr-prov-sunita' ? 'Cook' : 
    currentUser?.id === 'usr-prov-lakshmi' ? 'Maid' : 
    currentUser?.id === 'usr-prov-ramesh' ? 'Driver' : 'AC Service'
  );

  const isSoloStaff = currentUser?.providerType === 'INDIVIDUAL_STAFF' || 
    currentUser?.id === 'usr-prov-sunita' || 
    currentUser?.id === 'usr-prov-lakshmi' || 
    currentUser?.id === 'usr-prov-ramesh' ||
    ['Cook', 'Maid', 'Driver'].includes(userTradeCategory);

  // Default Seed Data for Solo Staff (Cook & Maid)
  const defaultSunitaFlats = [
    {
      id: 'FLAT-A1204',
      flatNumber: 'Flat A-1204',
      tower: 'Tower A',
      communityName: 'My Home Bhooja',
      residentName: 'Arjun Kumar',
      phone: '+91 98765 43210',
      shiftTime: '07:30 AM - 09:30 AM (Morning Shift)',
      serviceType: 'North Indian Cooking & Kitchen Sanitization',
      monthlyPay: 4500,
      gateOtp: '4829',
      status: 'ACTIVE_CONNECTED',
      checkedInToday: true,
      lastCheckIn: 'Today, 07:28 AM (Gate 1 Entry Logged)'
    },
    {
      id: 'FLAT-B402',
      flatNumber: 'Flat B-402',
      tower: 'Tower B',
      communityName: 'My Home Bhooja',
      residentName: 'Priya Saxena',
      phone: '+91 98450 11223',
      shiftTime: '05:00 PM - 07:00 PM (Evening Shift)',
      serviceType: 'Utensil Cleaning & Dinner Meal Prep',
      monthlyPay: 3500,
      gateOtp: '8812',
      status: 'ACTIVE_CONNECTED',
      checkedInToday: false,
      lastCheckIn: 'Yesterday, 05:02 PM'
    }
  ];

  const defaultLakshmiFlats = [
    {
      id: 'FLAT-C601',
      flatNumber: 'Flat C-601',
      tower: 'Tower C',
      communityName: 'My Home Bhooja',
      residentName: 'Ananya Deshmukh',
      phone: '+91 98850 44332',
      shiftTime: '08:00 AM - 10:00 AM (Morning Housekeeping)',
      serviceType: 'Sweeping, Wet Mopping, Balcony & Washroom Scrubbing',
      monthlyPay: 4000,
      gateOtp: '3319',
      status: 'ACTIVE_CONNECTED',
      checkedInToday: true,
      lastCheckIn: 'Today, 08:01 AM (Biometric Face Scanner Entry)'
    }
  ];

  // Active Sidebar Tab State
  const [activeTab, setActiveTab] = useState(isSoloStaff ? 'flats' : 'overview'); // flats/overview | pools | requests | crew | permits | settlements
  const [pools, setPools] = useState(() => serviceApi.getPools());
  const [requests, setRequests] = useState(() => serviceApi.getRequests());
  const [filterCategory, setFilterCategory] = useState('all');

  // Solo Staff Assigned Households State (Cook / Maid)
  const [assignedFlats, setAssignedFlats] = useState(() => {
    if (currentUser?.assignedFlats && currentUser.assignedFlats.length > 0) {
      return currentUser.assignedFlats;
    }
    if (currentUser?.id === 'usr-prov-sunita' || userTradeCategory === 'Cook') {
      return defaultSunitaFlats;
    }
    if (currentUser?.id === 'usr-prov-lakshmi' || userTradeCategory === 'Maid') {
      return defaultLakshmiFlats;
    }
    return defaultSunitaFlats;
  });

  // Modal States
  const [selectedReqForQuote, setSelectedReqForQuote] = useState(null);
  const [selectedPoolForBid, setSelectedPoolForBid] = useState(null);
  const [selectedCrewForPayout, setSelectedCrewForPayout] = useState(null);
  const [selectedSettlementForNudge, setSelectedSettlementForNudge] = useState(null);
  const [selectedReqForHire, setSelectedReqForHire] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');

  useEffect(() => {
    const handleSync = () => {
      setPools(serviceApi.getPools());
      setRequests(serviceApi.getRequests());
    };
    window.addEventListener('communityconnect_pools_updated', handleSync);
    window.addEventListener('communityconnect_requests_updated', handleSync);
    window.addEventListener('communityconnect_staff_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('communityconnect_pools_updated', handleSync);
      window.removeEventListener('communityconnect_requests_updated', handleSync);
      window.removeEventListener('communityconnect_staff_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Direct Hire Accept Form State for Cook/Maid
  const [monthlyRateInput, setMonthlyRateInput] = useState('4500');
  const [shiftTimingInput, setShiftTimingInput] = useState('07:30 AM - 09:30 AM (Morning Shift)');
  const [isSubmittingHireAccept, setIsSubmittingHireAccept] = useState(false);

  // Attendance Check-In Handler for Cook / Maid
  const handleToggleCheckIn = (flatId) => {
    setAssignedFlats(prev => prev.map(f => {
      if (f.id === flatId) {
        const nextState = !f.checkedInToday;
        if (nextState) {
          showToast(`Shift Check-In recorded for ${f.flatNumber} (${f.residentName})! Security gate entry code ${f.gateOtp} verified.`, 'success');
        } else {
          showToast(`Shift Check-Out marked for ${f.flatNumber}.`, 'info');
        }
        return {
          ...f,
          checkedInToday: nextState,
          lastCheckIn: nextState ? `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Gate Entry Logged)` : f.lastCheckIn
        };
      }
      return f;
    }));
  };

  // Accept Resident Single Hiring Request Handler (Cook/Maid)
  const handleAcceptHiringRequest = (e) => {
    e.preventDefault();
    if (!selectedReqForHire) return;

    setIsSubmittingHireAccept(true);
    setTimeout(() => {
      const newFlat = {
        id: `FLAT-HIRE-${Date.now()}`,
        flatNumber: selectedReqForHire.unit || 'Flat A-802',
        tower: (selectedReqForHire.unit || '').split(' ')[0] || 'Tower A',
        communityName: 'My Home Bhooja',
        residentName: selectedReqForHire.residentName || 'Resident Client',
        phone: selectedReqForHire.phone || '+91 98765 00000',
        shiftTime: shiftTimingInput,
        serviceType: selectedReqForHire.title || `${userTradeCategory} Service`,
        monthlyPay: Number(monthlyRateInput) || 4500,
        gateOtp: String(Math.floor(1000 + Math.random() * 9000)),
        status: 'ACTIVE_CONNECTED',
        checkedInToday: false,
        lastCheckIn: 'Newly Connected Today'
      };

      setAssignedFlats(prev => [newFlat, ...prev]);

      // Update request status in serviceApi
      setRequests(prev => prev.map(r => {
        if (r.id === selectedReqForHire.id) {
          return { ...r, status: 'ACCEPTED_CONNECTED' };
        }
        return r;
      }));

      setIsSubmittingHireAccept(false);
      showToast(`Hiring Accepted! ${selectedReqForHire.residentName} (${selectedReqForHire.unit}) added to your assigned shift roster at ₹${monthlyRateInput}/mo.`, 'success');
      setSelectedReqForHire(null);
    }, 500);
  };

  // Direct Quote Form State
  const [quoteAmount, setQuoteAmount] = useState('499');
  const [estimatedArrival, setEstimatedArrival] = useState('Tomorrow, 10:30 AM');
  const [warranty, setWarranty] = useState('30-Day Workmanship Guarantee');
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Group Pool Contractor Bid Form State
  const [bidPricePerUnit, setBidPricePerUnit] = useState('');
  const [bidDriveDate, setBidDriveDate] = useState('Saturday Drive (09:00 AM - 05:00 PM)');
  const [bidWarrantyNote, setBidWarrantyNote] = useState('90-Day Gas Top-Up & Chemical Wash Assurance');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // Web Crew Salary Payout Form State
  const [customCrewPayoutAmount, setCustomCrewPayoutAmount] = useState('');
  const [crewUpiAccount, setCrewUpiAccount] = useState('');
  const [isSubmittingCrewPayout, setIsSubmittingCrewPayout] = useState(false);

  // Admin Settlement Nudge Escalation Form State
  const [nudgeMessage, setNudgeMessage] = useState('');
  const [isSubmittingNudge, setIsSubmittingNudge] = useState(false);

  // Society Settlements Ledger (Pending RWA Payouts)
  const [societySettlements, setSocietySettlements] = useState([
    {
      id: 'SETTLE-901',
      communityName: 'My Home Bhooja',
      adminName: 'S. Venkat Reddy (President)',
      adminPhone: '+91 98490 11223',
      serviceTitle: 'Pre-Festival AC Deep Chemical Service (18 Flats)',
      grossAmount: 44910,
      rwaFee: 2245,
      netPayout: 42665,
      dueDate: '18 Sep 2025',
      status: 'PENDING_RWA_DISBURSEMENT' // 'PENDING_RWA_DISBURSEMENT' | 'ESCALATED_TO_PRESIDENT' | 'SETTLED'
    },
    {
      id: 'SETTLE-902',
      communityName: 'Saket Towers',
      adminName: 'Elena Rostova (Secretary)',
      adminPhone: '+91 98100 44332',
      serviceTitle: 'Smart Circuit Breaker Audit Drive (14 Flats)',
      grossAmount: 28000,
      rwaFee: 1400,
      netPayout: 26600,
      dueDate: '21 Sep 2025',
      status: 'PENDING_RWA_DISBURSEMENT'
    },
    {
      id: 'SETTLE-903',
      communityName: 'Aparna Sarovar',
      adminName: 'Rajesh Verma (Treasurer)',
      adminPhone: '+91 97000 88776',
      serviceTitle: 'Plumbing Dual Filter Inspection (10 Flats)',
      grossAmount: 19500,
      rwaFee: 975,
      netPayout: 18525,
      dueDate: '15 Sep 2025',
      status: 'SETTLED'
    }
  ]);

  // Auto-sync pools and requests when storage changes
  useEffect(() => {
    const syncData = () => {
      setPools(serviceApi.getPools());
      setRequests(serviceApi.getRequests());
    };
    window.addEventListener('communityconnect_visitor_updated', syncData);
    window.addEventListener('storage', syncData);
    return () => {
      window.removeEventListener('communityconnect_visitor_updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  // Dispatched Field Technicians Roster with Web Salary Payout Status
  const [crewMembers, setCrewMembers] = useState([
    { 
      id: 'TECH-101', 
      name: 'Suresh Varma', 
      trade: 'AC Lead Technician', 
      phone: '+91 98888 77665', 
      policeVerified: true, 
      badgeNo: 'BADGE-AC-88', 
      assignedTower: 'Tower A & B', 
      gateStatus: 'CHECKED_IN',
      monthlySalary: 28500,
      upiId: 'suresh.varma@okaxis',
      payoutStatus: 'PENDING_TRANSFER',
      lastPayoutDate: '01 Sep 2025'
    },
    { 
      id: 'TECH-102', 
      name: 'Vikram Sharma', 
      trade: 'Senior Wireman Electrician', 
      phone: '+91 98777 44332', 
      policeVerified: true, 
      badgeNo: 'BADGE-ELE-42', 
      assignedTower: 'Tower C', 
      gateStatus: 'CHECKED_IN',
      monthlySalary: 26000,
      upiId: 'vikram.wireman@upi',
      payoutStatus: 'PENDING_TRANSFER',
      lastPayoutDate: '01 Sep 2025'
    },
    { 
      id: 'TECH-103', 
      name: 'Mahesh Babu', 
      trade: 'Master Plumber', 
      phone: '+91 98666 55443', 
      policeVerified: true, 
      badgeNo: 'BADGE-PLM-19', 
      assignedTower: 'Tower A', 
      gateStatus: 'STANDBY',
      monthlySalary: 24500,
      upiId: 'mahesh.plumb@ybl',
      payoutStatus: 'SETTLED',
      lastPayoutDate: 'Yesterday, 19 Sep'
    }
  ]);

  // Gate Entry Permits State
  const [permits, setPermits] = useState([
    { id: 'PERMIT-901', society: 'My Home Bhooja', validDate: 'Today, 20 Sep', vehicleNo: 'TS 09 EA 4410', scope: 'AC Chemical Jet Wash Equipment Truck', approvedBy: 'S. Venkat Reddy (President)', status: 'ACTIVE_PERMIT' },
    { id: 'PERMIT-902', society: 'Saket Towers', validDate: '22 Sep 2025', vehicleNo: 'TS 08 UB 9920', scope: 'Electrical Distribution Board Audit Gear', approvedBy: 'Elena Rostova (Secretary)', status: 'SCHEDULED' }
  ]);

  const showToast = (msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleOpenQuoteModal = (req) => {
    setSelectedReqForQuote(req);
    setQuoteAmount(req.category === 'Electrician' ? '199' : req.category === 'Plumber' ? '249' : '499');
  };

  const handleOpenPoolBidModal = (pool) => {
    setSelectedPoolForBid(pool);
    setBidPricePerUnit('');
  };

  const handleOpenCrewPayoutModal = (crew) => {
    setSelectedCrewForPayout(crew);
    setCustomCrewPayoutAmount(crew.monthlySalary.toString());
    setCrewUpiAccount(crew.upiId);
  };

  const handleOpenNudgeModal = (settlement) => {
    setSelectedSettlementForNudge(settlement);
    setNudgeMessage(`Respected ${settlement.adminName}, we have completed the scheduled drive for '${settlement.serviceTitle}'. Kindly review and disburse the pending settlement amount of ₹${settlement.netPayout.toLocaleString()} to our registered vendor bank account.`);
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    if (!selectedReqForQuote) return;

    setIsSubmittingQuote(true);
    serviceApi.submitQuotation(selectedReqForQuote.id, {
      providerId: currentUser?.id || 'usr-prov-cool',
      providerName: currentUser?.name || 'CoolingPro AC Solutions',
      rating: currentUser?.rating || 4.88,
      quoteAmount,
      estimatedArrival,
      warranty
    });

    setRequests(serviceApi.getRequests());
    setIsSubmittingQuote(false);
    setSelectedReqForQuote(null);
    showToast(`Quotation of ₹${quoteAmount} sent to resident at ${selectedReqForQuote.unit}!`, 'success');
  };

  const handleSubmitPoolBid = (e) => {
    e.preventDefault();
    if (!selectedPoolForBid) return;

    const numBid = Number(bidPricePerUnit);
    if (!numBid || numBid <= 0) {
      showToast('Please enter a valid contractor bid price per unit.', 'error');
      return;
    }

    if (numBid >= selectedPoolForBid.regularPrice) {
      showToast(`Bid price (₹${numBid}) must be below the regular market price of ₹${selectedPoolForBid.regularPrice}!`, 'error');
      return;
    }

    setIsSubmittingBid(true);
    const committedUnits = selectedPoolForBid.currentParticipants || 1;
    const grossRevenue = committedUnits * numBid;
    const netPayout = Math.round(grossRevenue * 0.95);

    serviceApi.submitPoolBid(selectedPoolForBid.id, {
      providerId: currentUser?.id || 'usr-prov-cool',
      providerName: currentUser?.name || 'CoolingPro AC Solutions',
      rating: currentUser?.rating || 4.88,
      bidPricePerUnit: numBid,
      grossRevenue,
      netPayout,
      scheduledDriveDate: bidDriveDate,
      warranty: bidWarrantyNote
    });

    setPools(serviceApi.getPools());
    setIsSubmittingBid(false);
    setSelectedPoolForBid(null);
    showToast(`Official Contractor Bid of ₹${numBid}/unit logged for '${selectedPoolForBid.serviceTitle}'! Projected Net Earnings: ₹${netPayout.toLocaleString()}`, 'success');
  };

  // Direct Web-Based Crew Salary Disbursement Handler
  const handleExecuteCrewPayout = (e) => {
    e.preventDefault();
    if (!selectedCrewForPayout) return;

    setIsSubmittingCrewPayout(true);
    setTimeout(() => {
      setCrewMembers(prev => prev.map(m => {
        if (m.id === selectedCrewForPayout.id) {
          return {
            ...m,
            payoutStatus: 'SETTLED',
            lastPayoutDate: 'Today (Web Direct Transfer)'
          };
        }
        return m;
      }));

      setIsSubmittingCrewPayout(false);
      const paidAmount = customCrewPayoutAmount || selectedCrewForPayout.monthlySalary;
      showToast(`Web Direct Payout of ₹${Number(paidAmount).toLocaleString()} successfully transferred to ${selectedCrewForPayout.name} (UPI: ${crewUpiAccount})!`, 'success');
      setSelectedCrewForPayout(null);
    }, 600);
  };

  // Admin Formal Settlement Escalation & Nudge Handler
  const handleSendNudgeToAdmin = (e) => {
    e.preventDefault();
    if (!selectedSettlementForNudge) return;

    setIsSubmittingNudge(true);
    setTimeout(() => {
      serviceApi.sendSettlementEscalation(selectedSettlementForNudge.id, {
        communityName: selectedSettlementForNudge.communityName,
        adminName: selectedSettlementForNudge.adminName,
        vendorName: providerName,
        amount: selectedSettlementForNudge.netPayout,
        serviceTitle: selectedSettlementForNudge.serviceTitle,
        message: nudgeMessage
      });

      setSocietySettlements(prev => prev.map(s => {
        if (s.id === selectedSettlementForNudge.id) {
          return {
            ...s,
            status: 'ESCALATED_TO_PRESIDENT'
          };
        }
        return s;
      }));

      setIsSubmittingNudge(false);
      showToast(`Formal settlement request & nudge sent directly to ${selectedSettlementForNudge.adminName} (${selectedSettlementForNudge.communityName})! Admin notified.`, 'success');
      setSelectedSettlementForNudge(null);
    }, 500);
  };

  const providerName = currentUser?.name || 'CoolingPro AC Solutions';
  const providerCategory = currentUser?.category || 'AC Service & Maintenance Company';

  // Filter requests and pools according to selected trade category
  const filteredPools = pools.filter(p => 
    filterCategory === 'all' || 
    p.category?.toLowerCase().includes(filterCategory.toLowerCase()) || 
    filterCategory.toLowerCase().includes(p.category?.toLowerCase() || '')
  );

  const filteredRequests = requests.filter(r => {
    if (filterCategory === 'all') return true;
    const cat = (r.category || '').toLowerCase();
    const target = (r.targetTrade || '').toLowerCase();
    const filter = filterCategory.toLowerCase();
    return cat.includes(filter) || filter.includes(cat) || target.includes(filter);
  });

  return (
    <div className="bg-[#FAF8FF] font-['Plus_Jakarta_Sans',sans-serif] text-[#131B2E] antialiased min-h-screen flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white transition-all transform animate-bounce">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${toastType === 'error' ? 'bg-[#ba1a1a]' : toastType === 'success' ? 'bg-[#006b2c]' : 'bg-[#006591]'}`}>
            <span className="material-symbols-outlined text-lg">
              {toastType === 'error' ? 'error' : toastType === 'success' ? 'check_circle' : 'info'}
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Persistent Left Sidebar Navigation (Matching Community Admin Theme Exactly) */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white z-40 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none border-r border-[#eaedff]">
        <div className="flex flex-col">
          {/* Logo Branding */}
          <div className="h-16 px-5 flex items-center bg-white border-b border-[#eaedff]">
            <BrandLogo size="md" subtitleText="Service Provider Console" />
          </div>

          {/* Navigation Links */}
          <div className="px-4 pt-4 pb-2">
            <div className="px-3 py-1">
              <span className="text-[10px] uppercase tracking-wider text-[#6e7b6c] font-bold">
                {isSoloStaff ? 'SINGLE SERVICE & STAFF PORTAL' : 'CONTRACTOR MANAGEMENT'}
              </span>
            </div>

            <nav className="mt-1 flex flex-col gap-1">
              {isSoloStaff ? (
                <>
                  <button
                    onClick={() => setActiveTab('flats')}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'flats'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">home_work</span>
                      <span>My Households &amp; Shifts</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'flats' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'}`}>
                      {assignedFlats.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'requests'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">person_add</span>
                      <span>Resident Hiring Offers</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-[#c9e6ff] text-[#004c6f]'}`}>
                      {filteredRequests.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settlements')}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'settlements'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">payments</span>
                      <span>Monthly Salary Ledger</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                      Active
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('permits')}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'permits'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">badge</span>
                      <span>My Gate Pass &amp; Credentials</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                      Verified
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'overview'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">dashboard</span>
                    <span>Contractor Overview</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pools')}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'pools'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">groups</span>
                      <span>Group Bulk Bids</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'pools' ? 'bg-white/20 text-white' : 'bg-[#e2e7ff] text-[#131b2e]'}`}>
                      {filteredPools.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'requests'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">assignment</span>
                      <span>Resident Service Tickets</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-[#c9e6ff] text-[#004c6f]'}`}>
                      {filteredRequests.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('crew')}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'crew'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">engineering</span>
                      <span>Field Crew &amp; Web Payouts</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'crew' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'}`}>
                      {crewMembers.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('permits')}
                    className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'permits'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">badge</span>
                    <span>Society Gate Permits</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settlements')}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                      activeTab === 'settlements'
                        ? 'bg-[#00873a] text-white shadow-sm'
                        : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                      <span>Payouts &amp; Settlements</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      2 Pending
                    </span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#eaedff] space-y-3">
          <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#dae2fd]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#131b2e]">Resident Rating</span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">star</span>
                {currentUser?.rating || '4.88'} / 5.0
              </span>
            </div>
            <div className="text-[10px] text-[#6e7b6c] mt-0.5">
              {currentUser?.reviewsCount || '342'} verified resident reviews
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#7ffc97]/20 text-[#005320] text-[11px] font-semibold flex items-center gap-2 border border-[#006b2c]/20">
            <span className="material-symbols-outlined text-base">verified</span>
            <span>RWA Vendor Empaneled Badge</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-72 flex-1 flex flex-col min-w-0">
        {/* Fixed Top Bar Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-6 border-b border-[#eaedff]">
          <div className="flex items-center gap-4 min-w-0 flex-1 mr-4">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-[#131b2e] flex items-center gap-2 truncate">
                <span className="truncate max-w-[280px]">{providerName}</span>
                <span className="text-gray-300 shrink-0">•</span>
                <span className="truncate text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 bg-[#c9e6ff] text-[#004c6f] border border-[#b2d9ff]">
                  {providerCategory}
                </span>
              </div>
              <div className="text-[11px] text-[#6e7b6c] truncate mt-0.5">
                Trade Specialty: <strong className="text-[#131b2e] font-bold">{userTradeCategory}</strong> • Multi-Community Synced
              </div>
            </div>

            {/* Trade Category Filter Dropdown */}
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#eaedff] shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#6e7b6c]">Trade View:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-[#f2f3ff] border border-[#dae2fd] text-xs font-bold text-[#131b2e] focus:outline-none"
              >
                <option value="all">All Trade Offerings</option>
                <option value="AC Service">AC Service &amp; Cooling</option>
                <option value="Electrician">Electrician &amp; Circuits</option>
                <option value="Plumber">Plumbing &amp; Leak Repair</option>
                <option value="Cook">Cook &amp; Culinary Chef</option>
                <option value="Maid">Housekeeper &amp; Maid</option>
                <option value="Driver">Chauffeur &amp; Driver</option>
                <option value="Pest Control">Pest Control</option>
              </select>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#eaedff]">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs uppercase">
                {providerName ? providerName.charAt(0) : 'P'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-[#131b2e] leading-tight">
                  {providerName}
                </div>
                <div className="text-[10px] text-[#6e7b6c]">
                  Tier 1 Certified Vendor
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out from Service Provider Account"
                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer ml-1"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="pt-20 px-6 pb-12 max-w-7xl w-full mx-auto space-y-6">

          {/* ========================================================================= */}
          {/* TAB 0: MY HOUSEHOLDS & SHIFTS (COOK / MAID / SOLO STAFF PORTAL)           */}
          {/* ========================================================================= */}
          {activeTab === 'flats' && (
            <div className="space-y-6">
              {/* Solo Staff Hero Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c] block">
                    SPECIALTY SERVICE
                  </span>
                  <div className="text-xl font-bold text-[#131b2e] mt-1">{userTradeCategory} Specialist</div>
                  <div className="text-xs text-[#006b2c] font-semibold mt-0.5">
                    1-on-1 Dedicated Staff
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c] block">
                    ASSIGNED HOUSEHOLDS
                  </span>
                  <div className="text-2xl font-bold text-[#131b2e] mt-1">{assignedFlats.length} Connected Flats</div>
                  <div className="text-xs text-[#006591] font-semibold mt-0.5">
                    Daily Scheduled Shifts
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c] block">
                    TOTAL MONTHLY SALARY
                  </span>
                  <div className="text-2xl font-bold text-[#006b2c] font-mono mt-1">
                    ₹{assignedFlats.reduce((sum, f) => sum + (f.monthlyPay || 0), 0).toLocaleString()} / mo
                  </div>
                  <div className="text-xs text-[#005320] font-semibold mt-0.5">
                    Direct Resident Transfer
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c] block">
                    RWA GATE ACCESS PASS
                  </span>
                  <div className="text-lg font-bold text-[#131b2e] mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006b2c]">verified</span>
                    <span>Gate OTP Verified</span>
                  </div>
                  <div className="text-xs text-[#006b2c] font-semibold mt-0.5">
                    Biometric Pass Active
                  </div>
                </div>
              </div>

              {/* Roster of Assigned Households */}
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006b2c] text-xl">home_work</span>
                      <span>My Assigned Household Shifts &amp; Daily Gate OTPs</span>
                    </h2>
                    <p className="text-xs text-[#6e7b6c]">1-on-1 resident assignments, shift times, monthly pay, and security gate entry pass codes.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
                    {assignedFlats.length} Active Shifts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {assignedFlats.map((flat) => (
                    <div key={flat.id} className="p-5 rounded-2xl border border-[#eaedff] bg-[#f2f3ff]/50 flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#c9e6ff] text-[#004c6f] font-mono font-bold text-xs">
                              {flat.flatNumber}
                            </span>
                            <span className="text-xs font-bold text-[#6e7b6c]">{flat.tower}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            flat.checkedInToday
                              ? 'bg-[#7ffc97]/30 text-[#005320] border border-[#006b2c]/20'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {flat.checkedInToday ? '✔ Checked-In Today' : 'Shift Pending Today'}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-base text-[#131b2e]">{flat.residentName}</h3>
                          <div className="text-xs text-[#006b2c] font-semibold mt-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span>{flat.shiftTime}</span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white border border-[#eaedff] text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[#6e7b6c] font-semibold">Service Scope:</span>
                            <span className="font-bold text-[#131b2e] text-right truncate max-w-[200px]">{flat.serviceType}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-[#eaedff]">
                            <span className="text-[#6e7b6c] font-semibold">Monthly Pay Rate:</span>
                            <strong className="text-[#006b2c] font-mono text-sm">₹{flat.monthlyPay.toLocaleString()} / mo</strong>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-[#eaedff]">
                            <span className="text-[#6e7b6c] font-semibold">Gate Entry OTP:</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#006b2c] font-mono font-black border border-emerald-200 text-xs">
                              OTP: {flat.gateOtp}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-[#6e7b6c] font-mono">
                          Last Security Gate Access: {flat.lastCheckIn}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => showToast(`Calling resident ${flat.residentName} at ${flat.phone}...`, 'info')}
                          className="px-3.5 py-2 rounded-xl bg-[#f2f3ff] hover:bg-gray-200 text-[#3e4a3d] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">call</span>
                          <span>Call Resident</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleCheckIn(flat.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 ${
                            flat.checkedInToday
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-[#006b2c] text-white hover:bg-[#00873a]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {flat.checkedInToday ? 'check_circle' : 'fingerprint'}
                          </span>
                          <span>{flat.checkedInToday ? 'Mark Shift Completed' : 'Check-In Today Shift'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: CONTRACTOR OVERVIEW                                                */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <>
              {/* Top Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c] block">
                    SPECIALTY TRADE
                  </span>
                  <div className="text-xl font-bold text-[#131b2e] mt-1">{userTradeCategory}</div>
                  <div className="text-xs text-[#006b2c] font-semibold mt-0.5">
                    {filteredPools.length} active demand pools
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c] block">
                    OPEN GROUP POOLS
                  </span>
                  <div className="text-2xl font-bold text-[#131b2e] mt-1">{filteredPools.length} Pools</div>
                  <div className="text-xs text-amber-700 font-semibold mt-0.5">
                    Aggregated bulk demand active
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c] block">
                    RESIDENT TICKETS AWAITING QUOTE
                  </span>
                  <div className="text-2xl font-bold text-[#131b2e] mt-1">{filteredRequests.length} Tickets</div>
                  <div className="text-xs text-[#006591] font-semibold mt-0.5">
                    Direct resident requests
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c] block">
                    SETTLEMENT WALLET
                  </span>
                  <div className="text-2xl font-bold text-[#131b2e] mt-1">₹1,42,800</div>
                  <div className="text-xs text-[#006b2c] font-semibold mt-0.5">
                    Direct RWA transfer cycle
                  </div>
                </div>
              </div>

              {/* Group Demand Opportunities Grid */}
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                  <div>
                    <h3 className="font-bold text-base text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-lg">local_fire_department</span>
                      <span>Active Group Demand Opportunities ({userTradeCategory})</span>
                    </h3>
                    <p className="text-xs text-[#6e7b6c]">Aggregated neighborhood contracts with zero acquisition cost</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#7ffc97]/30 text-[#005320] text-[11px] font-bold border border-[#006b2c]/20">
                    Direct Dispatch Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPools.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#006591]">
                            {p.category} • {p.status}
                          </span>
                          <span className="text-xs font-bold text-[#005320] bg-[#7ffc97]/30 px-2 py-0.5 rounded-full">
                            Save {p.savingsPercent}%
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#131b2e] mt-1">{p.serviceTitle}</h4>
                        <div className="text-xs text-[#3e4a3d] mt-1">
                          Regular Price: <span className="line-through font-mono">₹{p.regularPrice}</span> • Target Price: <strong className="text-[#006b2c]">₹{p.discountedPrice}</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#dae2fd]">
                        <div>
                          <span className="text-[10px] text-[#6e7b6c] block uppercase font-bold">Progress:</span>
                          <span className="text-xs font-bold text-[#131b2e]">{p.currentParticipants} / {p.minThreshold} Flats Joined</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenPoolBidModal(p)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Submit Contractor Bid
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: GROUP DEMAND BULK BIDS                                             */}
          {/* ========================================================================= */}
          {activeTab === 'pools' && (
            <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                <div>
                  <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-xl">groups</span>
                    <span>Community Group Demand Bulk Bids ({userTradeCategory})</span>
                  </h2>
                  <p className="text-xs text-[#6e7b6c]">Multi-household aggregated service pools awaiting contractor proposals.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPools.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-[#eaedff] bg-[#f2f3ff]/50 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#006591] bg-[#c9e6ff] px-2.5 py-0.5 rounded-full">
                          {p.category}
                        </span>
                        <span className="text-xs font-bold text-[#005320] bg-[#7ffc97]/30 px-2.5 py-0.5 rounded-full border border-[#006b2c]/20">
                          {p.savingsPercent}% Bulk Discount
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[#131b2e]">{p.serviceTitle}</h3>
                      <p className="text-xs text-[#3e4a3d]">Regular Market Price: <span className="line-through font-mono">₹{p.regularPrice}</span> • Target Price: <strong className="text-[#006b2c] text-sm">₹{p.discountedPrice}</strong></p>
                      
                      <div className="p-3 rounded-xl bg-white border border-[#eaedff] text-xs space-y-1">
                        <div className="flex items-center justify-between text-[#131b2e] font-bold">
                          <span>Pool Participation:</span>
                          <span>{p.currentParticipants} of {p.minThreshold} Flats</span>
                        </div>
                        <div className="w-full bg-[#f2f3ff] h-2 rounded-full overflow-hidden border border-[#dae2fd]">
                          <div 
                            className="bg-[#00873a] h-full rounded-full transition-all" 
                            style={{ width: `${Math.min(100, (p.currentParticipants / p.minThreshold) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between">
                      <span className="text-xs text-[#6e7b6c] font-mono">Deadline: {p.deadline}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenPoolBidModal(p)}
                        className="px-4 py-2 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        Submit Group Bid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: RESIDENT SERVICE TICKETS & HIRING OFFERS                           */}
          {/* ========================================================================= */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                <div>
                  <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006591] text-xl">assignment</span>
                    <span>
                      {isSoloStaff ? `Resident Hiring Offers & Requests (${userTradeCategory})` : `Resident Service Tickets & Quotations (${userTradeCategory})`}
                    </span>
                  </h2>
                  <p className="text-xs text-[#6e7b6c]">
                    {isSoloStaff ? '1-on-1 resident requirements seeking dedicated staff in your community.' : 'Individual household service requests submitted by residents.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="p-8 text-center bg-[#f2f3ff]/50 rounded-2xl border border-[#eaedff] text-xs text-[#6e7b6c]">
                    No pending hiring requests for {userTradeCategory} right now.
                  </div>
                ) : (
                  filteredRequests.map((r) => (
                    <div key={r.id} className="p-5 rounded-2xl border border-[#eaedff] bg-[#f2f3ff]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#c9e6ff] text-[#004c6f] text-[10px] uppercase font-mono">{r.category}</span>
                          <span className="text-[#131b2e] text-sm">{r.title}</span>
                          {r.status === 'ACCEPTED_CONNECTED' && (
                            <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/30 text-[#005320] text-[10px] font-bold">✔ Hiring Accepted</span>
                          )}
                        </div>
                        <p className="text-xs text-[#3e4a3d]">{r.description}</p>
                        <div className="text-xs text-[#6e7b6c] font-mono pt-1">
                          Resident: <strong className="text-[#131b2e]">{r.residentName} ({r.unit})</strong> • Preferred Window: {r.preferredDate} ({r.preferredTime})
                        </div>
                      </div>

                      {isSoloStaff ? (
                        r.status === 'ACCEPTED_CONNECTED' ? (
                          <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold shrink-0">
                            ✔ Active Shift Connected
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReqForHire(r);
                              setMonthlyRateInput('4500');
                              setShiftTimingInput(r.preferredTime || '07:30 AM - 09:30 AM (Morning Shift)');
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0 flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            <span>Accept Hiring &amp; Set Monthly Rate</span>
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenQuoteModal(r)}
                          className="px-5 py-2.5 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
                        >
                          Submit Official Quote
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: DISPATCHED FIELD CREW & WEB PAYOUTS                                */}
          {/* ========================================================================= */}
          {activeTab === 'crew' && (
            <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                <div>
                  <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006b2c] text-xl">engineering</span>
                    <span>Dispatched Field Technicians &amp; Web Salary Payouts</span>
                  </h2>
                  <p className="text-xs text-[#6e7b6c]">Police-verified field technicians deployed across gated community towers with direct web page salary transfers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('New field technician registration form opened.', 'info')}
                  className="px-4 py-2 rounded-xl bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition cursor-pointer"
                >
                  + Add New Technician
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {crewMembers.map((member) => (
                  <div key={member.id} className="p-5 rounded-2xl border border-[#eaedff] bg-[#f2f3ff]/50 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[#6e7b6c] uppercase">{member.badgeNo}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#7ffc97]/30 text-[#005320] text-[10px] font-extrabold border border-[#006b2c]/20">
                          ✔ Police Verified
                        </span>
                      </div>
                      <h3 className="font-bold text-[#131b2e] text-base mt-1">{member.name}</h3>
                      <p className="text-xs text-[#006b2c] font-semibold">{member.trade}</p>
                      <div className="text-xs text-[#6e7b6c] font-mono">Phone: {member.phone}</div>
                      
                      <div className="p-3 rounded-xl bg-white border border-[#eaedff] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[#6e7b6c]">Monthly Earnings:</span>
                          <strong className="text-[#131b2e] font-mono text-sm">₹{member.monthlySalary.toLocaleString()}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#6e7b6c]">UPI / Bank:</span>
                          <span className="text-[#006591] font-mono text-[11px] truncate max-w-[130px]">{member.upiId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#eaedff] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#6e7b6c] font-bold">Assigned: {member.assignedTower}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#c9e6ff] text-[#004c6f] font-bold text-[10px]">
                          {member.gateStatus}
                        </span>
                      </div>

                      {/* Direct Web Crew Salary Payout Action */}
                      <button
                        type="button"
                        onClick={() => handleOpenCrewPayoutModal(member)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          member.payoutStatus === 'SETTLED'
                            ? 'bg-[#7ffc97]/30 text-[#005320] border border-[#006b2c]/20'
                            : 'bg-[#006b2c] text-white hover:bg-[#00873a] shadow-xs'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">payments</span>
                        <span>{member.payoutStatus === 'SETTLED' ? 'Salary Settled ✔ (Transfer Again)' : 'Disburse Technician Salary'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: SOCIETY GATE PERMITS & SOLO STAFF CLEARANCES                       */}
          {/* ========================================================================= */}
          {activeTab === 'permits' && (
            isSoloStaff ? (
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006591] text-xl">badge</span>
                      <span>My RWA Security Gate Pass &amp; Credentials</span>
                    </h2>
                    <p className="text-xs text-[#6e7b6c]">Official gated community security clearance credentials verified by RWA Management &amp; Gate Security.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
                    ✔ 100% Police &amp; Biometric Cleared
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[#eaedff] bg-[#f2f3ff]/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c9e6ff] text-[#004c6f] text-[10px] font-mono font-bold">
                        PASS-ID: MAID-BHOOJA-042
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7ffc97]/30 text-[#005320] font-bold text-[10px] border border-[#006b2c]/20">
                        ✔ Active Police Verification
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#131b2e]">Cyberabad Police Verification Record</h3>
                    <p className="text-xs text-[#3e4a3d]">Police Background Cleared &amp; Address Verified at Gachibowli Police Station.</p>
                    <div className="text-[11px] text-[#6e7b6c] font-mono pt-1">
                      Approved by: S. Venkat Reddy (RWA President, My Home Bhooja)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#eaedff] bg-[#f2f3ff]/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold">
                        GATE 1 BIOMETRIC PASS
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7ffc97]/30 text-[#005320] font-bold text-[10px] border border-[#006b2c]/20">
                        ✔ Facial Scanner Active
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#131b2e]">Gate Guard Fast-Track Entrance Pass</h3>
                    <p className="text-xs text-[#3e4a3d]">Biometric face recognition active at Gate 1 North. Instant entry logged without queueing.</p>
                    <div className="text-[11px] text-[#6e7b6c] font-mono pt-1">
                      Security Lead: Havaldar Ram Singh (Gate 1 Guard)
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006591] text-xl">badge</span>
                      <span>Society Gate Permits &amp; Vehicle Clearances</span>
                    </h2>
                    <p className="text-xs text-[#6e7b6c]">Official RWA gate permits for service trucks and heavy equipment entry.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {permits.map((permit) => (
                    <div key={permit.id} className="p-4 rounded-xl border border-[#eaedff] bg-[#f2f3ff]/40 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#131b2e]">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#c9e6ff] text-[#004c6f] text-[10px] font-mono">{permit.id}</span>
                          <span>{permit.society}</span>
                        </div>
                        <p className="text-xs text-[#3e4a3d] mt-1">{permit.scope} (Vehicle: {permit.vehicleNo})</p>
                        <div className="text-[11px] text-[#6e7b6c] font-mono mt-0.5">Approved by: {permit.approvedBy}</div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-[#7ffc97]/30 text-[#005320] font-bold text-xs border border-[#006b2c]/20">
                        ✔ {permit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* ========================================================================= */}
          {/* TAB 6: PAYOUTS & SETTLEMENTS + COMMUNITY ADMIN NUDGE ESCALATION           */}
          {/* ========================================================================= */}
          {activeTab === 'settlements' && (
            isSoloStaff ? (
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006b2c] text-xl">payments</span>
                      <span>My Monthly Household Salary &amp; Payout Ledger</span>
                    </h2>
                    <p className="text-xs text-[#6e7b6c]">Direct monthly salary payments from assigned apartment residents (100% direct salary — 0% platform fee).</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
                    100% Direct Resident Salary
                  </span>
                </div>

                {/* Staff Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#7ffc97]/15 border border-[#006b2c]/20">
                    <span className="text-xs text-[#006b2c] font-bold uppercase block">Total Monthly Earnings</span>
                    <span className="text-2xl font-black text-[#131b2e] mt-1 block">
                      ₹{assignedFlats.reduce((sum, f) => sum + (f.monthlyPay || 0), 0).toLocaleString()} / mo
                    </span>
                    <span className="text-[10px] text-[#005320] mt-1 block">Direct Resident Transfer</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#c9e6ff]/30 border border-[#006591]/20">
                    <span className="text-xs text-[#006591] font-bold uppercase block">Active Household Clients</span>
                    <span className="text-xl font-bold text-[#131b2e] mt-1 block">{assignedFlats.length} Connected Flats</span>
                    <span className="text-[10px] text-[#004c6f] mt-1 block">Daily Scheduled Shifts</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#f2f3ff] border border-[#eaedff]">
                    <span className="text-xs text-[#6e7b6c] font-bold uppercase block">Agency Commission</span>
                    <span className="text-xl font-bold text-[#006b2c] mt-1 block">₹0 (Zero Deduction)</span>
                    <span className="text-[10px] text-[#3e4a3d] mt-1 block">Full Earnings Retained by Staff</span>
                  </div>
                </div>

                {/* HOUSEHOLD SALARY LEDGER TABLE */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006b2c] text-lg">receipt_long</span>
                      <span>Household Monthly Salary Breakdown ({userTradeCategory})</span>
                    </h3>
                    <span className="text-xs text-[#6e7b6c]">Direct payment collection per household</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#eaedff]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f2f3ff] text-[#131b2e] font-bold uppercase text-[10px] border-b border-[#eaedff]">
                        <tr>
                          <th className="p-3">Apartment Flat</th>
                          <th className="p-3">Resident Client</th>
                          <th className="p-3">Service &amp; Shift Scope</th>
                          <th className="p-3">Monthly Pay</th>
                          <th className="p-3">Payment Status</th>
                          <th className="p-3 text-right">Payment Reminder</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaedff]">
                        {assignedFlats.map((flat) => (
                          <tr key={flat.id} className="hover:bg-[#f2f3ff]/40">
                            <td className="p-3 font-bold text-[#131b2e]">
                              <span className="px-2 py-0.5 rounded bg-[#c9e6ff] text-[#004c6f] font-mono text-xs">{flat.flatNumber}</span>
                              <span className="text-[10px] text-[#6e7b6c] block mt-0.5">{flat.tower}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-[#131b2e] block">{flat.residentName}</span>
                              <span className="text-[10px] text-[#6e7b6c] font-mono">{flat.phone}</span>
                            </td>
                            <td className="p-3 text-[#3e4a3d]">
                              <span className="font-semibold text-[#131b2e] block truncate max-w-[180px]">{flat.serviceType}</span>
                              <span className="text-[10px] text-[#006b2c] block">{flat.shiftTime}</span>
                            </td>
                            <td className="p-3 font-bold font-mono text-[#006b2c] text-sm">₹{flat.monthlyPay.toLocaleString()} / mo</td>
                            <td className="p-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7ffc97]/30 text-[#005320] border border-[#006b2c]/20">
                                ✔ Received via GPay / Cash
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => showToast(`Gentle monthly salary reminder dispatched to ${flat.residentName} (${flat.flatNumber}).`, 'success')}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold transition bg-[#f2f3ff] hover:bg-emerald-50 text-[#006b2c] border border-emerald-200 cursor-pointer flex items-center gap-1 ml-auto"
                              >
                                <span className="material-symbols-outlined text-sm">notifications</span>
                                <span>Remind Resident</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006b2c] text-xl">payments</span>
                      <span>Contractor Settlements &amp; RWA Admin Escalations</span>
                    </h2>
                    <p className="text-xs text-[#6e7b6c]">Transparent earnings ledger, pending society payouts, and formal Nudge/Escalation options to Community Presidents.</p>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#7ffc97]/15 border border-[#006b2c]/20">
                    <span className="text-xs text-[#006b2c] font-bold uppercase block">Total Monthly Revenue</span>
                    <span className="text-2xl font-black text-[#131b2e] mt-1 block">
                      ₹1,42,800
                    </span>
                    <span className="text-[10px] text-[#005320] mt-1 block">Direct HDFC Bank Settlement</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#c9e6ff]/30 border border-[#006591]/20">
                    <span className="text-xs text-[#006591] font-bold uppercase block">Pending RWA Disbursements</span>
                    <span className="text-xl font-bold text-[#131b2e] mt-1 block">₹69,265</span>
                    <span className="text-[10px] text-[#004c6f] mt-1 block">2 Society Payouts Awaiting Admin</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#f2f3ff] border border-[#eaedff]">
                    <span className="text-xs text-[#6e7b6c] font-bold uppercase block">Platform Commission</span>
                    <span className="text-xl font-bold text-[#131b2e] mt-1 block">5% Flat RWA Fee</span>
                    <span className="text-[10px] text-[#3e4a3d] mt-1 block">95% Direct Net Payout</span>
                  </div>
                </div>

                {/* PENDING SOCIETY SETTLEMENTS LEDGER WITH ADMIN NUDGE ACTION */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-lg">notifications_active</span>
                      <span>Pending Society Settlements &amp; Formal RWA Nudges</span>
                    </h3>
                    <span className="text-xs text-[#6e7b6c]">Directly remind Community Presidents to disburse pending funds</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#eaedff]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f2f3ff] text-[#131b2e] font-bold uppercase text-[10px] border-b border-[#eaedff]">
                        <tr>
                          <th className="p-3">Gated Community</th>
                          <th className="p-3">Target RWA Admin</th>
                          <th className="p-3">Service Scope</th>
                          <th className="p-3">Net Amount</th>
                          <th className="p-3">Settlement Status</th>
                          <th className="p-3 text-right">Formal Admin Nudge</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaedff]">
                        {societySettlements.map((item) => (
                          <tr key={item.id} className="hover:bg-[#f2f3ff]/40">
                            <td className="p-3 font-bold text-[#131b2e]">{item.communityName}</td>
                            <td className="p-3">
                              <span className="font-bold text-[#131b2e] block">{item.adminName}</span>
                              <span className="text-[10px] text-[#6e7b6c] font-mono">{item.adminPhone}</span>
                            </td>
                            <td className="p-3 text-[#3e4a3d] truncate max-w-[200px]">{item.serviceTitle}</td>
                            <td className="p-3 font-bold font-mono text-[#006b2c] text-sm">₹{item.netPayout.toLocaleString()}</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'SETTLED'
                                  ? 'bg-[#7ffc97]/30 text-[#005320] border border-[#006b2c]/20'
                                  : item.status === 'ESCALATED_TO_PRESIDENT'
                                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}>
                                {item.status === 'SETTLED' ? '✔ Settled' : item.status === 'ESCALATED_TO_PRESIDENT' ? '🔔 Admin Nudge Sent' : 'Pending RWA Payout'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {item.status === 'SETTLED' ? (
                                <span className="text-[11px] text-[#6e7b6c] font-semibold">Cleared on {item.dueDate}</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenNudgeModal(item)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5 ml-auto ${
                                    item.status === 'ESCALATED_TO_PRESIDENT'
                                      ? 'bg-blue-100 text-blue-900 hover:bg-blue-200 border border-blue-300'
                                      : 'bg-[#006b2c] text-white hover:bg-[#00873a]'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-sm">notifications_active</span>
                                  <span>{item.status === 'ESCALATED_TO_PRESIDENT' ? 'Re-Send Nudge' : 'Nudge Admin to Settle'}</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* FORMAL COMMUNITY ADMIN SETTLEMENT NUDGE ESCALATION MODAL (USER REQUESTED)  */}
      {/* ========================================================================= */}
      {selectedSettlementForNudge && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e7ff] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
                  <span className="material-symbols-outlined text-xl">notifications_active</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#131b2e]">Send Formal Settlement Nudge to Admin</h3>
                  <p className="text-xs text-[#6e7b6c]">Remind RWA President/Treasurer to clear pending payout</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSettlementForNudge(null)}
                className="p-1 rounded-full text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Target Details Card */}
            <div className="bg-[#f2f3ff] p-4 rounded-xl border border-[#dae2fd] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#131b2e] text-sm">{selectedSettlementForNudge.communityName}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                  Pending Payout: ₹{selectedSettlementForNudge.netPayout.toLocaleString()}
                </span>
              </div>
              <div className="text-[#3e4a3d] font-medium">
                Target Admin: <strong className="text-[#131b2e]">{selectedSettlementForNudge.adminName}</strong>
              </div>
              <div className="text-[#6e7b6c] text-[11px] font-mono">
                Scope: {selectedSettlementForNudge.serviceTitle}
              </div>
            </div>

            <form onSubmit={handleSendNudgeToAdmin} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">
                  Official Remind Message to RWA President *
                </label>
                <textarea
                  rows={4}
                  value={nudgeMessage}
                  onChange={(e) => setNudgeMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs text-[#131b2e] font-medium focus:outline-none focus:border-[#006b2c]"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-[#c9e6ff]/40 text-[#004c6f] text-[11px] flex items-center gap-2 border border-[#006591]/20">
                <span className="material-symbols-outlined text-base">info</span>
                <span>This nudge will be dispatched as an urgent priority alert to the Community Admin's Treasury Console.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setSelectedSettlementForNudge(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#3e4a3d] font-semibold hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNudge}
                  className="px-5 py-2.5 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>{isSubmittingNudge ? 'Dispatching Nudge...' : 'Dispatch Formal Admin Nudge'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REDESIGNED GROUP DEMAND BID MODAL                                          */}
      {/* ========================================================================= */}
      {selectedPoolForBid && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e7ff] space-y-5 my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#7ffc97]/20 text-[#005320]">
                  <span className="material-symbols-outlined text-xl">gavel</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#131b2e] leading-tight">Submit Group Contractor Bid</h3>
                  <p className="text-xs text-[#6e7b6c]">Bulk household discount proposal &amp; service schedule</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPoolForBid(null)}
                className="p-1 rounded-full text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Target Pool Summary Card */}
            <div className="bg-[#f2f3ff] p-4 rounded-xl border border-[#dae2fd] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#131b2e] text-sm">{selectedPoolForBid.serviceTitle}</span>
                <span className="px-2 py-0.5 rounded bg-[#c9e6ff] text-[#004c6f] text-[10px] font-bold font-mono">
                  {selectedPoolForBid.category}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#dae2fd]">
                <div>
                  <span className="text-[#6e7b6c] block font-semibold">Regular Market Price:</span>
                  <span className="font-mono text-[#131b2e] line-through font-bold">₹{selectedPoolForBid.regularPrice} / Flat</span>
                </div>
                <div>
                  <span className="text-[#6e7b6c] block font-semibold">Committed Volume:</span>
                  <span className="font-bold text-[#006b2c]">{selectedPoolForBid.currentParticipants || 1} Households Participating</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitPoolBid} className="space-y-4 text-xs">
              {/* Custom Contractor Bid Price Input */}
              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[11px] flex items-center justify-between mb-1">
                  <span>Set Bid Price Per Flat (₹) *</span>
                  <span className="text-[10px] text-amber-800 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Regular Price: ₹{selectedPoolForBid.regularPrice}
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-[#006b2c] text-base">₹</span>
                  <input
                    type="number"
                    value={bidPricePerUnit}
                    onChange={(e) => setBidPricePerUnit(e.target.value)}
                    max={selectedPoolForBid.regularPrice - 1}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-mono font-bold text-[#131b2e] text-base focus:outline-none focus:border-[#006b2c]"
                    placeholder={`Type amount below ₹${selectedPoolForBid.regularPrice}...`}
                    required
                  />
                </div>
                {(!bidPricePerUnit || Number(bidPricePerUnit) >= selectedPoolForBid.regularPrice) && (
                  <p className="text-[11px] text-amber-800 font-semibold mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-amber-600">info</span>
                    Please enter your custom price (must be strictly below regular price of ₹{selectedPoolForBid.regularPrice}).
                  </p>
                )}
              </div>

              {/* FINANCIAL LEDGER CARD */}
              {Number(bidPricePerUnit) > 0 && Number(bidPricePerUnit) < selectedPoolForBid.regularPrice && (
                <div className="bg-[#f2f3ff] rounded-xl border border-[#dae2fd] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#dae2fd]">
                    <span className="text-[11px] font-bold text-[#131b2e] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#006b2c]">calculate</span>
                      Contractor Revenue &amp; Resident Savings Summary
                    </span>
                    <span className="text-[10px] text-[#6e7b6c] font-mono">{selectedPoolForBid.currentParticipants || 1} Flats</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-[#eaedff]">
                      <span className="text-[10px] text-[#6e7b6c] block font-semibold">Gross Contract Revenue:</span>
                      <span className="font-mono font-bold text-[#131b2e] text-sm">
                        ₹{(Number(bidPricePerUnit) * (selectedPoolForBid.currentParticipants || 1)).toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-[#eaedff]">
                      <span className="text-[10px] text-[#6e7b6c] block font-semibold">Net Contractor Payout (95%):</span>
                      <span className="font-mono font-bold text-[#006b2c] text-sm">
                        ₹{Math.round(Number(bidPricePerUnit) * (selectedPoolForBid.currentParticipants || 1) * 0.95).toLocaleString()}
                      </span>
                    </div>

                    <div className="col-span-2 p-2.5 rounded-lg bg-[#7ffc97]/20 border border-[#006b2c]/20 flex items-center justify-between text-xs">
                      <span className="text-[#005320] font-semibold">Total Neighborhood Savings:</span>
                      <strong className="font-mono font-bold text-[#005320]">
                        Save ₹{((selectedPoolForBid.regularPrice - Number(bidPricePerUnit)) * (selectedPoolForBid.currentParticipants || 1)).toLocaleString()} ({Math.round(((selectedPoolForBid.regularPrice - Number(bidPricePerUnit)) / selectedPoolForBid.regularPrice) * 100)}% Discount)
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Schedule Drive Options */}
              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">
                  Service Execution Drive Slot *
                </label>
                <select
                  value={bidDriveDate}
                  onChange={(e) => setBidDriveDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-semibold text-[#131b2e] focus:outline-none"
                >
                  <option value="Saturday Drive (09:00 AM - 05:00 PM)">Saturday Drive (09:00 AM - 05:00 PM)</option>
                  <option value="Sunday Drive (09:00 AM - 05:00 PM)">Sunday Drive (09:00 AM - 05:00 PM)</option>
                  <option value="Monday & Tuesday Morning Drive (09:00 AM - 01:00 PM)">Monday &amp; Tuesday Morning Drive (09:00 AM - 01:00 PM)</option>
                  <option value="Wednesday & Thursday Midday Drive (11:00 AM - 03:00 PM)">Wednesday &amp; Thursday Midday Drive (11:00 AM - 03:00 PM)</option>
                  <option value="Friday Special Multi-Tower Slot (02:00 PM - 06:00 PM)">Friday Special Multi-Tower Slot (02:00 PM - 06:00 PM)</option>
                  <option value="Custom Weekday Emergency AMC Slot">Custom Weekday Emergency AMC Slot</option>
                </select>
              </div>

              {/* Warranty Guarantee */}
              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">
                  Warranty &amp; Service Inclusions
                </label>
                <input
                  type="text"
                  value={bidWarrantyNote}
                  onChange={(e) => setBidWarrantyNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-medium text-[#131b2e] focus:outline-none"
                  placeholder="e.g. 90-Day Gas Top-Up &amp; Chemical Wash Assurance"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setSelectedPoolForBid(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#3e4a3d] font-semibold hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBid}
                  className="px-5 py-2.5 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">gavel</span>
                  <span>{isSubmittingBid ? 'Logging Bid...' : `Confirm & Log Bid (₹${bidPricePerUnit || '0'}/flat)`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WEB CREW SALARY DISBURSEMENT MODAL */}
      {selectedCrewForPayout && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e7ff] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-xl">payments</span>
                <h3 className="font-bold text-base text-[#131b2e]">Disburse Technician Web Payout</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCrewForPayout(null)}
                className="p-1 rounded-full text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd] text-xs space-y-1">
              <div className="font-bold text-[#131b2e]">{selectedCrewForPayout.name} ({selectedCrewForPayout.badgeNo})</div>
              <div className="text-[#006b2c] font-semibold">{selectedCrewForPayout.trade} • {selectedCrewForPayout.assignedTower}</div>
            </div>

            <form onSubmit={handleExecuteCrewPayout} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">Transfer Amount (₹) *</label>
                <input
                  type="number"
                  value={customCrewPayoutAmount}
                  onChange={(e) => setCustomCrewPayoutAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-mono font-bold text-[#131b2e] text-sm focus:outline-none focus:border-[#006b2c]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">Target UPI / Bank Account *</label>
                <input
                  type="text"
                  value={crewUpiAccount}
                  onChange={(e) => setCrewUpiAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-mono font-medium text-[#131b2e] focus:outline-none focus:border-[#006b2c]"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-[#7ffc97]/20 border border-[#006b2c]/20 text-[11px] text-[#005320]">
                ✔ Direct Web API Transfer will be initiated from HDFC Corporate Portal to {crewUpiAccount}.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCrewForPayout(null)}
                  className="px-4 py-2 rounded-xl bg-[#f2f3ff] text-[#3e4a3d] font-semibold hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCrewPayout}
                  className="px-5 py-2 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>{isSubmittingCrewPayout ? 'Processing Web Payout...' : 'Execute Direct Web Payout'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Submission Modal for Direct Resident Tickets */}
      {selectedReqForQuote && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e7ff] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <h3 className="font-bold text-base text-[#131b2e]">Submit Official Quote</h3>
              <button
                type="button"
                onClick={() => setSelectedReqForQuote(null)}
                className="p-1 rounded-full text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="text-xs space-y-1 bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd]">
              <div className="font-bold text-[#131b2e]">{selectedReqForQuote.title}</div>
              <div className="text-[#6e7b6c] font-mono">Resident: {selectedReqForQuote.residentName} ({selectedReqForQuote.unit})</div>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">Quote Amount (₹) *</label>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-mono font-bold text-[#131b2e] text-sm focus:outline-none focus:border-[#006b2c]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">Estimated Technician Arrival *</label>
                <input
                  type="text"
                  value={estimatedArrival}
                  onChange={(e) => setEstimatedArrival(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-medium text-[#131b2e] focus:outline-none focus:border-[#006b2c]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">Warranty &amp; Service Guarantee</label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-medium text-[#131b2e] focus:outline-none focus:border-[#006b2c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setSelectedReqForQuote(null)}
                  className="px-4 py-2 rounded-xl bg-[#f2f3ff] text-[#3e4a3d] font-semibold hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuote}
                  className="px-5 py-2 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  {isSubmittingQuote ? 'Submitting...' : 'Send Official Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Hiring Offer Accept Modal for Solo Staff (Cook/Maid) */}
      {selectedReqForHire && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e7ff] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-xl">person_add</span>
                <h3 className="font-bold text-base text-[#131b2e]">Accept Household Hiring Offer</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReqForHire(null)}
                className="p-1 rounded-full text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="text-xs space-y-1 bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd]">
              <div className="font-bold text-[#131b2e] text-sm">{selectedReqForHire.title}</div>
              <div className="text-[#3e4a3d] font-medium">{selectedReqForHire.description}</div>
              <div className="text-[#006b2c] font-mono pt-1">
                Client Resident: <strong>{selectedReqForHire.residentName} ({selectedReqForHire.unit})</strong>
              </div>
            </div>

            <form onSubmit={handleAcceptHiringRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">
                  Agreed Monthly Pay Rate (₹ / month) *
                </label>
                <input
                  type="number"
                  value={monthlyRateInput}
                  onChange={(e) => setMonthlyRateInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-mono font-bold text-[#131b2e] text-sm focus:outline-none focus:border-[#006b2c]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#131b2e] uppercase text-[10px] block mb-1">
                  Daily Shift Timing *
                </label>
                <input
                  type="text"
                  value={shiftTimingInput}
                  onChange={(e) => setShiftTimingInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] font-medium text-[#131b2e] focus:outline-none focus:border-[#006b2c]"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-[#7ffc97]/20 border border-[#006b2c]/20 text-[11px] text-[#005320]">
                ✔ Accepting this offer will issue a Security Gate Entry Pass Code and add this flat to your daily active shift roster.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setSelectedReqForHire(null)}
                  className="px-4 py-2 rounded-xl bg-[#f2f3ff] text-[#3e4a3d] font-semibold hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHireAccept}
                  className="px-5 py-2 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  <span>{isSubmittingHireAccept ? 'Connecting...' : 'Confirm Hiring & Add to Roster'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
