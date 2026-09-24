import React, { useState, useEffect } from 'react';
import { serviceApi } from '../../api/serviceApi';
import { communityApi } from '../../api/communityApi';
import { WorkOrderResolveModal } from './WorkOrderResolveModal';
import { WorkOrderEscalateModal } from './WorkOrderEscalateModal';
import { SecurityDirectiveModal } from './SecurityDirectiveModal';
import { TreasuryPaymentModal } from './TreasuryPaymentModal';
import { OverviewKpiDetailModal } from './OverviewKpiDetailModal';
import { StaffRollCallModal } from './StaffRollCallModal';
import { ExecutiveReportPrintModal } from './ExecutiveReportPrintModal';
import { CreateWorkOrderModal } from './CreateWorkOrderModal';
import { IssueVendorPassModal } from './IssueVendorPassModal';
import { AuthorizeVendorInvoiceModal } from './AuthorizeVendorInvoiceModal';
import { RegisterStaffModal } from './RegisterStaffModal';
import { PresidentBankPayoutModal } from './PresidentBankPayoutModal';
import { VendorBankAccountsTab } from './VendorBankAccountsTab';
import { DigitalGatePassCard } from '../common/DigitalGatePassCard';
import { DigitalGatePassModal } from '../common/DigitalGatePassModal';
import { CreateGatePassModal } from '../common/CreateGatePassModal';
import { BrandLogo } from '../common/BrandLogo';

export const CommunityAdminConsole = ({ currentUser, onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, board, gate, maintenance, feed, dues, vendors, banking
  const [currentCommunity, setCurrentCommunity] = useState(() => {
    return currentUser?.communityId ? communityApi.getCommunityById(currentUser.communityId) : null;
  });
  const isCommunityFrozen = currentCommunity && currentCommunity.status === 'FROZEN';
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSecurityVerifModal, setShowSecurityVerifModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');

  // Overview Interactive KPI and Chart States
  const [kpiDetailModal, setKpiDetailModal] = useState({ isOpen: false, kpiType: 'OCCUPANCY' });
  const [chartView, setChartView] = useState('monthly'); // 'monthly' | 'tower'
  const [selectedTowerFilter, setSelectedTowerFilter] = useState('ALL'); // 'ALL' | 'TOWER_A' | 'TOWER_B' | 'TOWER_C' | 'TOWER_D' | 'VILLAS'
  const [showStaffRollCallModal, setShowStaffRollCallModal] = useState(false);
  const [showExecutivePrintModal, setShowExecutivePrintModal] = useState(false);
  const [selectedChartMonth, setSelectedChartMonth] = useState({
    month: 'SEP',
    full: 'September 2024 (Active Audit)',
    target: 46.2,
    collected: 42.8,
    rate: '92.6%',
    arrears: 3.4,
    unitsPaid: 395,
    totalUnits: 420
  });

  // Security Directives & Field Report State
  const [securityDirectiveModal, setSecurityDirectiveModal] = useState({
    isOpen: false,
    targetUnit: 'Suite A-1204',
    kycId: 'kyc-1',
    existingDirective: null
  });
  const [securityDirectives, setSecurityDirectives] = useState(() => serviceApi.getSecurityDirectives());

  // Maintenance Modals
  const [resolveTicketModal, setResolveTicketModal] = useState({ isOpen: false, ticket: null });
  const [escalateTicketModal, setEscalateTicketModal] = useState({ isOpen: false, ticket: null });

  // Treasury & Dues State
  const [treasuryData, setTreasuryData] = useState(() => serviceApi.getTreasuryData());
  const [treasuryPaymentModal, setTreasuryPaymentModal] = useState({
    isOpen: false,
    mode: 'PAY_UTILITY_BILL',
    billData: null,
    unitData: null
  });
  const [duesSubTab, setDuesSubTab] = useState('bills'); // 'bills' | 'deposits' | 'residents'

  // Community Feed Moderation State
  const [communityPosts, setCommunityPosts] = useState(() => serviceApi.getPosts());
  const [deletePostModal, setDeletePostModal] = useState({ isOpen: false, postId: null, reason: 'Spam / Commercial promotion' });
  const [showNewNoticeModal, setShowNewNoticeModal] = useState(false);
  const [newNoticeForm, setNewNoticeForm] = useState({ title: '', category: 'ANNOUNCEMENT', content: '', pin: false });

  // Redesigned Digital Gate Passes State
  const [visitorPasses, setVisitorPasses] = useState(() => serviceApi.getVisitorPasses());
  const [gatePassFilter, setGatePassFilter] = useState('ALL'); // ALL, GUEST, DELIVERY, CAB, CONTRACTOR, OVERSTAY
  const [gatePassViewMode, setGatePassViewMode] = useState('CARDS'); // 'CARDS' | 'TABLE'
  const [gatePassSearch, setGatePassSearch] = useState('');
  const [selectedPassForModal, setSelectedPassForModal] = useState(null);
  const [showCreateGatePassModal, setShowCreateGatePassModal] = useState(false);
  const [showHowPassWorks, setShowHowPassWorks] = useState(true);

  // Sync with serviceApi events
  useEffect(() => {
    const handleTreasuryUpdate = (e) => {
      if (e.detail) setTreasuryData(e.detail);
      else setTreasuryData(serviceApi.getTreasuryData());
    };
    const handleDirectiveUpdate = () => {
      setSecurityDirectives(serviceApi.getSecurityDirectives());
    };
    const handlePostsUpdate = () => {
      setCommunityPosts(serviceApi.getPosts());
    };
    const handleVisitorsUpdate = () => {
      setVisitorPasses(serviceApi.getVisitorPasses());
    };
    const handleKycUpdate = (e) => {
      const detail = e.detail;
      if (detail && detail.targetUnit) {
        setKycItems((prev) =>
          prev.map((item) =>
            item.suite === detail.targetUnit || item.id === detail.kycId
              ? {
                  ...item,
                  approved: true,
                  status: `Access Granted by Gate 1 Security (${detail.officer || 'Havaldar Ram Singh'})`,
                  followup: 'Verified & Platform Access Activated by Guard',
                  guard: `${detail.officer || 'Havaldar Ram Singh'} (Gate 1 Terminal)`
                }
              : item
          )
        );
        showToast(
          `Security Guard ${detail.officer || 'Havaldar Ram Singh'} physically verified and granted platform access to ${detail.targetUnit}!`,
          'success'
        );
      }
    };

    const handleCommunitiesUpdate = () => {
      if (currentUser?.communityId) {
        setCurrentCommunity(communityApi.getCommunityById(currentUser.communityId));
      }
    };

    window.addEventListener('communityconnect_treasury_updated', handleTreasuryUpdate);
    window.addEventListener('communityconnect_security_directive_updated', handleDirectiveUpdate);
    window.addEventListener('communityconnect_posts_updated', handlePostsUpdate);
    window.addEventListener('communityconnect_visitor_updated', handleVisitorsUpdate);
    window.addEventListener('communityconnect_kyc_updated', handleKycUpdate);
    window.addEventListener('communityconnect_communities_updated', handleCommunitiesUpdate);
    window.addEventListener('storage', handleCommunitiesUpdate);

    return () => {
      window.removeEventListener('communityconnect_treasury_updated', handleTreasuryUpdate);
      window.removeEventListener('communityconnect_security_directive_updated', handleDirectiveUpdate);
      window.removeEventListener('communityconnect_posts_updated', handlePostsUpdate);
      window.removeEventListener('communityconnect_visitor_updated', handleVisitorsUpdate);
      window.removeEventListener('communityconnect_kyc_updated', handleKycUpdate);
      window.removeEventListener('communityconnect_communities_updated', handleCommunitiesUpdate);
      window.removeEventListener('storage', handleCommunitiesUpdate);
    };
  }, []);

  // KYC items state
  const [kycItems, setKycItems] = useState([
    {
      id: 'kyc-1',
      initials: 'SR',
      name: 'Shalini Roy',
      type: 'Tenant',
      suite: 'Suite D-601',
      status: 'Step 2: Guard Inspection Cleared',
      followup: 'Awaiting Security Report',
      docs: '11-Month Registered Agreement + Police Verification Verified',
      guard: 'Havaldar Ram Singh (Gate 1 Terminal)',
      approved: false
    },
    {
      id: 'kyc-2',
      initials: 'VS',
      name: 'Vikramaditya Sen',
      type: 'Co-Owner',
      suite: 'Suite B-102',
      status: 'Step 2: Security Field Inspection Active',
      followup: 'Awaiting Security Report',
      docs: 'Registry Deed & Society Share Certificate Endorsement',
      guard: 'Dispatched to Havaldar Ram Singh (Gate 1)',
      approved: false
    },
    {
      id: 'kyc-3',
      initials: 'MH',
      name: 'Meera Hegde',
      type: 'Tenant',
      suite: 'Suite C-303',
      status: 'Step 1: Employer KYC Verified',
      followup: null,
      docs: 'Employer KYC (Google LLC) + Vehicle FastTag Registration',
      guard: 'Desk review in progress',
      approved: false
    }
  ]);

  // Committee members
  const [committeeMembers, setCommitteeMembers] = useState([
    {
      initials: 'ER',
      name: 'Elena Rostova',
      role: 'President',
      flat: 'Flat B-402',
      notes: 'Provisioned by Platform Admin with Super-Admin credentials.',
      status: 'Active Signatory',
      color: 'border-primary'
    },
    {
      initials: 'AK',
      name: 'Arjun Kumar',
      role: 'Treasurer',
      flat: 'Flat A-1204',
      notes: 'Invited Resident from Flat A-1204 - Active (Financial Co-Signatory).',
      status: 'Active Role',
      color: 'border-secondary'
    },
    {
      initials: 'SB',
      name: 'Sunita Bai',
      role: 'Secretary',
      flat: 'Flat C-502',
      notes: 'Nominated Resident - Invite Pending (Invite Code: MC-7714).',
      status: 'Pending Acceptance',
      color: 'border-amber-500'
    }
  ]);

  // Gate stream
  const [gateEntries, setGateEntries] = useState([
    {
      id: 'g-1',
      time: '10:42 AM',
      title: 'Amazon Delivery #9821',
      desc: 'Ramesh Yadav • MH 02 CD 4901',
      dest: 'Suite B-402 (Elena R.)',
      type: 'Parcel',
      status: 'Approved',
      overstay: false
    },
    {
      id: 'g-2',
      time: '10:35 AM',
      title: 'Uber Auto • DL 1Y 3290',
      desc: 'Guest of Dr. Kapoor',
      dest: 'Suite C-801',
      type: 'Cab / Taxi',
      status: 'Inside',
      overstay: false
    },
    {
      id: 'g-3',
      time: '08:12 AM',
      title: 'Unregistered Plumber Van',
      desc: 'KA 04 MP 1192 • Gate 2',
      dest: 'Basement 1',
      type: 'Contractor',
      status: 'OVERSTAY 2h',
      overstay: true
    }
  ]);

  // Maintenance tickets & SLA Engine
  const [tickets, setTickets] = useState([
    {
      id: 'WO-9041',
      icon: 'elevator',
      title: 'Tower A Lift #2 Hydraulic Sensor Fault',
      urgency: 'P1 CRITICAL',
      assigned: 'Otis Elevators Field Tech (Suresh K.) • Reported 40m ago',
      sla: 'SLA Countdown: 1 hr 20m remaining',
      cat: 'critical lifts',
      location: 'Tower A (Floors 1-14)',
      contractor: 'Otis Elevators AMC',
      techPhone: '+91 98450 11928',
      progress: 65,
      cost: 'Covered under AMC',
      resolved: false
    },
    {
      id: 'WO-9042',
      icon: 'water_drop',
      title: 'Clubhouse Water Softener Regeneration Flange Leak',
      urgency: 'P2 URGENT',
      assigned: 'Ion Exchange Tech (Rameshwar) • Resident impact: Low (Backups active)',
      sla: 'In Progress • SLA: 3 hrs remaining',
      cat: 'water',
      location: 'Clubhouse Basements',
      contractor: 'Ion Exchange STP & WTP',
      techPhone: '+91 97000 44192',
      progress: 45,
      cost: '₹3,200 Parts / AMC Labor Free',
      resolved: false
    },
    {
      id: 'WO-9043',
      icon: 'electric_meter',
      title: 'DG Set AMF Panel Synchronizer Calibration',
      urgency: 'P2 SCHEDULED',
      assigned: 'Kirloskar DG Power (Vikramaditya) • Annual audit protocol',
      sla: 'Scheduled for Saturday 11:00 AM',
      cat: 'electrical',
      location: 'Substation DG Yard',
      contractor: 'Kirloskar Oil Engines',
      techPhone: '+91 98110 33491',
      progress: 20,
      cost: 'Quarterly Free Audit',
      resolved: false
    },
    {
      id: 'WO-9044',
      icon: 'fire_extinguisher',
      title: 'Tower C Level 8 Fire Hose Reel Pressure Drop',
      urgency: 'P1 CRITICAL',
      assigned: 'Ceasefire Safety Engineer • Pressure regulator replacement',
      sla: 'SLA Countdown: 45m remaining',
      cat: 'critical fire',
      location: 'Tower C (Floor 8)',
      contractor: 'Ceasefire Safety Systems',
      techPhone: '+91 99010 88219',
      progress: 80,
      cost: 'Covered under Fire AMC',
      resolved: false
    },
    {
      id: 'WO-9045',
      icon: 'hvac',
      title: 'Clubhouse Gymnasium VRV AC Compressor Trip',
      urgency: 'P2 URGENT',
      assigned: 'Daikin HVAC Service Engineer • Thermostat reset underway',
      sla: 'In Progress • SLA: 2 hrs remaining',
      cat: 'hvac',
      location: 'Clubhouse Level 2',
      contractor: 'Daikin HVAC Systems',
      techPhone: '+91 98230 44551',
      progress: 55,
      cost: 'Covered under Comprehensive AMC',
      resolved: false
    },
    {
      id: 'WO-9046',
      icon: 'plumbing',
      title: 'Tower B Rainwater Harvesting Dual Filter Backwash',
      urgency: 'P3 ROUTINE',
      assigned: 'In-House Estate MEP Crew • Standard weekly protocol',
      sla: 'Completed routine sweep',
      cat: 'civil water',
      location: 'Tower B Basement',
      contractor: 'Internal Facilities Team',
      techPhone: '+91 98480 99881',
      progress: 100,
      cost: 'In-House Crew',
      resolved: true
    }
  ]);

  const [ticketFilter, setTicketFilter] = useState('all');
  const [maintenanceSearchQuery, setMaintenanceSearchQuery] = useState('');
  const [maintenanceCategoryFilter, setMaintenanceCategoryFilter] = useState('all');
  const [maintenancePriorityFilter, setMaintenancePriorityFilter] = useState('all');
  const [showCreateWorkOrderModal, setShowCreateWorkOrderModal] = useState(false);

  // Feed Comments Expanded & Inputs State
  const [openComments, setOpenComments] = useState({ 'post-1': true, 'post-2': true, 'post-3': true });
  const [commentInputs, setCommentInputs] = useState({});

  // Vendors & Staff Management MVP States
  const [vendorSubTab, setVendorSubTab] = useState('amc'); // 'amc' | 'facilities' | 'domestic' | 'passes'
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [domesticRoleFilter, setDomesticRoleFilter] = useState('ALL');
  const [showIssueVendorPassModal, setShowIssueVendorPassModal] = useState(false);
  const [authorizeInvoiceModal, setAuthorizeInvoiceModal] = useState({ isOpen: false, invoice: null });
  const [showRegisterStaffModal, setShowRegisterStaffModal] = useState(false);
  const [showPresidentPayoutModal, setShowPresidentPayoutModal] = useState(false);
  const [payoutPrefill, setPayoutPrefill] = useState({ payee: '', amount: '', invoiceRef: '', sourceAccount: 'OPERATING_BANK' });
  const [isAuditingInflows, setIsAuditingInflows] = useState(false);
  const [inflowLedger, setInflowLedger] = useState([
    {
      id: 'IN-9081',
      source: 'Suite A-1204 (Arjun Kumar)',
      category: 'MAINTENANCE',
      type: 'Monthly Maintenance & Sinking Fund',
      amount: 14500,
      bank: 'HDFC NetBanking Direct Debit',
      utr: 'HDFC-IN-99201948',
      timestamp: 'Today, 08:30 AM',
      status: 'AUDITED_VERIFIED',
      verifiedBy: 'Bank API Webhook'
    },
    {
      id: 'IN-9082',
      source: 'Suite B-402 (Priya Saxena)',
      category: 'MAINTENANCE',
      type: 'Quarterly Advance Maintenance Dues',
      amount: 42000,
      bank: 'ICICI UPI AutoPay (Gateway)',
      utr: 'UPI-ICICI-40918230',
      timestamp: 'Today, 09:15 AM',
      status: 'AUDITED_VERIFIED',
      verifiedBy: 'Bank API Webhook'
    },
    {
      id: 'IN-9083',
      source: 'Grand Banquet Hall & Lawn Booking',
      category: 'AMENITIES',
      type: 'Clubhouse Event Booking (Suite C-801)',
      amount: 35000,
      bank: 'HDFC Corporate Current A/C',
      utr: 'HDFC-EVT-7728190',
      timestamp: 'Yesterday, 04:45 PM',
      status: 'AUDITED_VERIFIED',
      verifiedBy: 'Treasury Manager'
    },
    {
      id: 'IN-9084',
      source: 'Suite D-204 (Gautam Singhania)',
      category: 'DEPOSITS',
      type: 'Interior Fit-Out Refundable Escrow',
      amount: 75000,
      bank: 'RTGS Inward (Kotak Mahindra)',
      utr: 'KOTAK-RTGS-8812903',
      timestamp: '19 Sep 2025',
      status: 'AUDITED_VERIFIED',
      verifiedBy: 'Chartered Accountant'
    },
    {
      id: 'IN-9085',
      source: 'Basement 1 EV Supercharging Hub',
      category: 'OTHER',
      type: 'Fortnightly EV Substation Meter Revenue',
      amount: 38400,
      bank: 'Automated Razorpay X Inflow',
      utr: 'RZP-EV-66192834',
      timestamp: '18 Sep 2025',
      status: 'AUDITED_VERIFIED',
      verifiedBy: 'Automated Settlement'
    },
    {
      id: 'IN-9086',
      source: 'Estate Dry Waste Segregation & Recycler',
      category: 'OTHER',
      type: 'Dry Paper & Plastic Scrap Sales',
      amount: 14500,
      bank: 'Cash Vault Deposit (Office Safe)',
      utr: 'CASH-SLIP-0921',
      timestamp: '17 Sep 2025',
      status: 'AUDITED_VERIFIED',
      verifiedBy: 'Estate Office Manager'
    },
    {
      id: 'IN-9087',
      source: 'Suite C-1104 (Rajesh Verma)',
      category: 'MAINTENANCE',
      type: 'Overdue Arrears + Delayed Interest Clearance',
      amount: 35220,
      bank: 'SBI NEFT Inward',
      utr: 'SBIN-NEFT-3091823',
      timestamp: '16 Sep 2025',
      status: 'AUDITED_VERIFIED',
      verifiedBy: 'Bank API Webhook'
    }
  ]);

  // Corporate AMC Master Contracts
  const [amcContracts, setAmcContracts] = useState([
    {
      id: 'AMC-OTIS',
      name: 'Otis Elevator Co. India',
      category: 'Passenger & Service Elevators (8 High-Speed Lifts)',
      status: 'ACTIVE_AMC',
      slaGuarantee: '2-Hour Emergency Response • 24/7 Breakdown Cell',
      renewalDate: '15-Dec-2025 (420 days left)',
      monthlyPayout: 120000,
      pendingInvoice: true,
      pendingInvoiceAmount: 120000,
      invoiceRef: 'INV-OTIS-SEP24',
      supervisor: 'Suresh Kumar (Lead Field Engineer)',
      phone: '+91 98450 11928',
      emergencyPhone: '+91 80 4000 8899',
      activeTicketsCount: 1,
      rating: 4.8
    },
    {
      id: 'AMC-KIRLOSKAR',
      name: 'Kirloskar Oil Engines Ltd.',
      category: 'Dual 500kVA Diesel Generator Sets & AMF Panels',
      status: 'ACTIVE_AMC',
      slaGuarantee: '1-Hour Critical Emergency Restoral',
      renewalDate: '30-Nov-2025 (405 days left)',
      monthlyPayout: 45000,
      pendingInvoice: false,
      invoiceRef: null,
      supervisor: 'Vikramaditya Rao (Chief Power Specialist)',
      phone: '+91 98110 33491',
      emergencyPhone: '1800-233-5144',
      activeTicketsCount: 1,
      rating: 4.9
    },
    {
      id: 'AMC-IONEXCHANGE',
      name: 'Ion Exchange (India) Ltd.',
      category: '200 KLD Sewage Treatment Plant (STP) & RO Filtration',
      status: 'ACTIVE_AMC',
      slaGuarantee: '4-Hour Response • Daily Water Quality Lab Testing',
      renewalDate: '10-Oct-2025 (355 days left)',
      monthlyPayout: 65000,
      pendingInvoice: false,
      invoiceRef: null,
      supervisor: 'Rameshwar Sharma (Environmental Engineer)',
      phone: '+91 97000 44192',
      emergencyPhone: '+91 80 2558 1120',
      activeTicketsCount: 1,
      rating: 4.7
    },
    {
      id: 'AMC-TOPSGRUP',
      name: 'TopsGrup Security Services',
      category: 'Guarding Force (18 Armed & Static Security Personnel)',
      status: 'ACTIVE_AMC',
      slaGuarantee: '24/7 Gate ANPR • CCTV Monitoring • Perimeter Patrol',
      renewalDate: '31-Mar-2025 (192 days left)',
      monthlyPayout: 280000,
      pendingInvoice: false,
      invoiceRef: null,
      supervisor: 'Capt. Deshmukh (Chief Security Officer)',
      phone: '+91 99010 88219',
      emergencyPhone: '080-2222-1000',
      activeTicketsCount: 0,
      rating: 4.9
    },
    {
      id: 'AMC-BVG',
      name: 'BVG India Integrated Facilities',
      category: 'Housekeeping, High-Pressure Washing & Waste Segregation',
      status: 'RENEWAL_DUE',
      slaGuarantee: '3 Daily Corridor Sweeps • Sanitization Protocol',
      renewalDate: '30-Sep-2024 (10 days left)',
      monthlyPayout: 125000,
      pendingInvoice: true,
      pendingInvoiceAmount: 125000,
      invoiceRef: 'INV-BVG-SEP24',
      supervisor: 'Anant Shinde (Operations Head)',
      phone: '+91 98230 44551',
      emergencyPhone: '+91 98230 44500',
      activeTicketsCount: 0,
      rating: 4.6
    },
    {
      id: 'AMC-ASIANPAINTS',
      name: 'Asian Paints Project Services',
      category: 'Tower Facade Crack Sealing & External Weatherproofing',
      status: 'CAPEX_PROJECT',
      slaGuarantee: 'Contractor Safety Code Compliance (6 Scaffolding Techs)',
      renewalDate: 'Milestone 2 Completion',
      monthlyPayout: 1450000,
      pendingInvoice: false,
      invoiceRef: null,
      supervisor: 'Rajiv Nambiar (Site Project Lead)',
      phone: '+91 97110 66219',
      emergencyPhone: '+91 80 6611 2233',
      activeTicketsCount: 0,
      rating: 4.8
    },
    {
      id: 'AMC-AQUAPOOL',
      name: 'Aquapool Tech & Spa',
      category: 'Olympic Swimming Pool, Jacuzzi & Kids Pool Filtration',
      status: 'ACTIVE_AMC',
      slaGuarantee: 'Daily Chemical Shock, pH & Chlorine Titration',
      renewalDate: '15-Jan-2026 (480 days left)',
      monthlyPayout: 32000,
      pendingInvoice: false,
      invoiceRef: null,
      supervisor: 'Farhan Akhtar (Aquatic Chemist)',
      phone: '+91 98490 22331',
      emergencyPhone: '+91 98490 22300',
      activeTicketsCount: 0,
      rating: 4.7
    }
  ]);

  // Estate Facility & Security Staff (42 staff)
  const [estateFacilitiesStaff, setEstateFacilitiesStaff] = useState([
    { id: 'SEC-01', name: 'Havaldar Ram Singh', role: 'Head Security Officer', shift: 'Morning (06:00 - 14:00)', post: 'Gate 1 Main Terminal', phone: '+91 98450 99101', status: 'ON_DUTY', verified: true },
    { id: 'SEC-02', name: 'Devendra Pal', role: 'Security Guard', shift: 'Morning (06:00 - 14:00)', post: 'Gate 2 Commercial Service', phone: '+91 98450 99102', status: 'ON_DUTY', verified: true },
    { id: 'SEC-03', name: 'Mahesh Patil', role: 'Patrol Officer', shift: 'Morning (06:00 - 14:00)', post: 'Basement 1 & 2 Patrol', phone: '+91 98450 99103', status: 'ON_DUTY', verified: true },
    { id: 'SEC-04', name: 'Sunil Gurung', role: 'CCTV & ANPR Specialist', shift: 'Morning (06:00 - 14:00)', post: 'Central Security Control Room', phone: '+91 98450 99104', status: 'ON_DUTY', verified: true },
    { id: 'MEP-01', name: 'Kishanlal Verma', role: 'Senior Electrician', shift: 'General (08:00 - 17:00)', post: 'Substation & Panels', phone: '+91 98450 99201', status: 'ON_DUTY', verified: true },
    { id: 'MEP-02', name: 'Abdul Rashid', role: 'Senior Plumber', shift: 'General (08:00 - 17:00)', post: 'STP & Booster Pumps', phone: '+91 98450 99202', status: 'ON_DUTY', verified: true },
    { id: 'HK-01', name: 'Manjula Ben', role: 'Housekeeping Supervisor', shift: 'Morning (07:00 - 15:00)', post: 'Towers A & B Lobbies', phone: '+91 98450 99301', status: 'ON_DUTY', verified: true },
    { id: 'HK-02', name: 'Gopal Nayak', role: 'Housekeeping Supervisor', shift: 'Morning (07:00 - 15:00)', post: 'Clubhouse & Boulevard', phone: '+91 98450 99302', status: 'ON_DUTY', verified: true }
  ]);

  // Domestic Helpers & Helpers Directory
  const [domesticStaff, setDomesticStaff] = useState([
    { id: 'STF-101', name: 'Lakshmi Devi', role: 'Housemaid', phone: '+91 98450 33112', flat: 'Suite B-402, Suite B-601', gate: 'Gate 1', inTime: '07:30 AM', status: 'Inside Unit', verified: true, policeRef: 'PV-982104' },
    { id: 'STF-102', name: 'Raju Yadav', role: 'Chauffeur', phone: '+91 98450 44223', flat: 'Suite C-1104 (Rajesh Verma)', gate: 'Gate 2', inTime: '08:15 AM', status: 'Basement Parking', verified: true, policeRef: 'PV-871109' },
    { id: 'STF-103', name: 'Sunita Sharma', role: 'Home Cook', phone: '+91 98450 55334', flat: 'Suite A-902 (Anita Menon)', gate: 'Gate 1', inTime: '06:45 AM', status: 'Inside Unit', verified: true, policeRef: 'PV-654312' },
    { id: 'STF-104', name: 'Meena Bai', role: 'Housemaid', phone: '+91 98450 66445', flat: 'Suite A-1204 (Arjun Kumar)', gate: 'Gate 1', inTime: '08:00 AM', status: 'Inside Unit', verified: true, policeRef: 'PV-441190' },
    { id: 'STF-105', name: 'Gopal Krishna', role: 'Gardener', phone: '+91 98450 77556', flat: 'Clubhouse & Central Park', gate: 'Gate 2', inTime: '07:00 AM', status: 'Central Park', verified: true, policeRef: 'PV-229910' },
    { id: 'STF-106', name: 'Kavita Kumari', role: 'Childcare / Nanny', phone: '+91 98450 88667', flat: 'Villa V-08 (Kavita Reddy)', gate: 'Gate 1', inTime: '08:30 AM', status: 'Inside Unit', verified: true, policeRef: 'PV-119933' },
    { id: 'STF-107', name: 'Babu Lal', role: 'Chauffeur', phone: '+91 98450 99778', flat: 'Suite D-204 (Gautam Singhania)', gate: 'Gate 2', inTime: '08:45 AM', status: 'Drivers Lounge', verified: true, policeRef: 'PV-338811' },
    { id: 'STF-108', name: 'Anita Soren', role: 'Housemaid', phone: '+91 98450 11889', flat: 'Suite D-503 (Pooja Hegde)', gate: 'Gate 1', inTime: '09:00 AM', status: 'Inside Unit', verified: true, policeRef: 'PV-776655' }
  ]);

  // Temporary Vendor & Contractor Gate Passes
  const [vendorGatePasses, setVendorGatePasses] = useState([
    { id: 'VND-8812', company: 'Asian Paints', leadTech: 'Rajiv Nambiar', phone: '+91 97110 66219', crewCount: 6, towerZone: 'Tower C Facade', workScope: 'Exterior Weatherproof Emulsion', gate: 'Gate 2', otpCode: '4921', validUntil: 'Today 06:00 PM', issuedAt: '08:30 AM', status: 'AUTHORIZED' },
    { id: 'VND-8813', company: 'Urban Company', leadTech: 'Manoj Tiwari', phone: '+91 98200 44112', crewCount: 4, towerZone: 'Clubhouse Squash Court', workScope: 'Deep Wood Polishing', gate: 'Gate 1', otpCode: '3109', validUntil: 'Today 05:00 PM', issuedAt: '09:15 AM', status: 'AUTHORIZED' },
    { id: 'VND-8814', company: 'Daikin HVAC', leadTech: 'Deepak Chawla', phone: '+91 98490 77112', crewCount: 2, towerZone: 'Clubhouse Level 2 Gym', workScope: 'VRV Chiller Thermostat Overhaul', gate: 'Gate 2', otpCode: '7742', validUntil: 'Today 07:00 PM', issuedAt: '10:00 AM', status: 'AUTHORIZED' },
    { id: 'VND-8815', company: 'Airtel Fibernet', leadTech: 'Kiran Rao', phone: '+91 98111 88223', crewCount: 2, towerZone: 'Tower B Shaft 3', workScope: 'Optical Fibre Cable Splicing', gate: 'Gate 2', otpCode: '9012', validUntil: 'Today 04:00 PM', issuedAt: '10:30 AM', status: 'AUTHORIZED' }
  ]);
  const [pollVoted, setPollVoted] = useState(null);

  // Invite modal form
  const [inviteResident, setInviteResident] = useState('Rajesh Verma (Flat C-1104, Tower C)');
  const [inviteRole, setInviteRole] = useState('Secretary');
  const [inviteCode, setInviteCode] = useState('MC-7714');

  const showToast = (msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleApproveKYC = (id, name) => {
    setKycItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, approved: true } : item))
    );
    showToast(`Access granted & digital smart pass issued to ${name}. Gate ANPR synched!`, 'success');
  };

  const handleFollowupToSecurity = (kycItem) => {
    let directive = securityDirectives.find((d) => d.targetUnit === kycItem.suite);
    if (!directive) {
      directive = serviceApi.createSecurityDirective({
        targetUnit: kycItem.suite,
        kycId: kycItem.id,
        priority: 'HIGH',
        instructions: `President Elena Rostova follow-up order: Conduct physical spot-check and tenancy verification for ${kycItem.name} (${kycItem.suite}). If credentials are valid, grant platform access and activate ANPR barrier whitelist.`,
        assignedGuard: 'Havaldar Ram Singh (Gate 1 Terminal)',
        societySection: kycItem.suite.split('-')[0] || 'Tower B'
      });
      setSecurityDirectives(serviceApi.getSecurityDirectives());
    }
    setKycItems((prev) =>
      prev.map((k) =>
        k.id === kycItem.id
          ? {
              ...k,
              status: 'Step 2: Follow-up Dispatched to Security (Gate 1)',
              followup: 'Dispatched to Gate 1 Terminal (Havaldar Ram Singh)'
            }
          : k
      )
    );
    showToast(
      `Follow-up order sent to Gate 1 Security! Guard Havaldar Ram Singh will verify resident credentials and grant platform access.`,
      'success'
    );
  };

  const handleCheckoutGatePass = (passId) => {
    const updated = serviceApi.checkoutVisitor(passId);
    if (updated) {
      setVisitorPasses(serviceApi.getVisitorPasses());
      showToast(`Visitor pass #${passId} checked out. Barrier exit granted.`, 'info');
    }
  };

  const handleCreatePassSuccess = (newPass) => {
    setVisitorPasses(serviceApi.getVisitorPasses());
    setSelectedPassForModal(newPass);
    showToast(`New Digital Gate Pass #${newPass.id} issued with OTP #${newPass.otpCode}!`, 'success');
  };

  const handleSimulateGateScan = () => {
    const newEntry = {
      id: `g-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Zomato Food Delivery',
      desc: 'Karan Mehta • DL 3S 8821',
      dest: 'Suite A-504',
      type: 'Food',
      status: 'QR Verified',
      overstay: false
    };
    setGateEntries([newEntry, ...gateEntries]);
    showToast('Gate 1 ANPR Barrier opened: Zomato verified.', 'success');
  };

  const handleResolveTicket = (id, title) => {
    const t = tickets.find((tk) => tk.id === id);
    setResolveTicketModal({ isOpen: true, ticket: t || { id, title, assigned: 'Field Engineer', urgency: 'P1 CRITICAL', sla: '1 hr' } });
  };

  const handleEscalateTicket = (id, title) => {
    const t = tickets.find((tk) => tk.id === id);
    setEscalateTicketModal({ isOpen: true, ticket: t || { id, title, assigned: 'Field Engineer', urgency: 'P1 CRITICAL', sla: '1 hr' } });
  };

  const handleConfirmResolveTicket = (ticketId, data) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, resolved: true, resolutionData: data } : t))
    );
    setResolveTicketModal({ isOpen: false, ticket: null });
    showToast(`Ticket #${ticketId} signed off & marked resolved by ${data.technicianName}.`, 'success');
  };

  const handleConfirmEscalateTicket = (ticketId, data) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              escalated: true,
              urgency: `${t.urgency} (ESCALATED - ${data.escalationTier})`,
              escalationData: data
            }
          : t
      )
    );
    setEscalateTicketModal({ isOpen: false, ticket: null });
    showToast(`Official SLA Escalation Notice issued for Ticket #${ticketId}. Penalty clause active!`, 'error');
  };

  const handleDispatchSecurityDirective = (data) => {
    const created = serviceApi.createSecurityDirective(data);
    setSecurityDirectives(serviceApi.getSecurityDirectives());
    setSecurityDirectiveModal({
      isOpen: true,
      targetUnit: data.targetUnit,
      kycId: data.kycId,
      existingDirective: created
    });
    showToast(`Direct Security Task Directive dispatched to Gate 1 Console. Guard alerted!`, 'info');
  };

  const handleSubmitGuardReport = (directiveId, reportData) => {
    const updated = serviceApi.submitSecurityReport(directiveId, reportData);
    setSecurityDirectives(serviceApi.getSecurityDirectives());
    setSecurityDirectiveModal({
      isOpen: true,
      targetUnit: updated.targetUnit,
      kycId: updated.kycId,
      existingDirective: updated
    });
    // Also update kycItems status
    setKycItems((prev) =>
      prev.map((k) =>
        k.id === updated.kycId
          ? {
              ...k,
              status: 'Step 2: Field Report Received (Cleared)',
              followup: 'Guard Signed Off',
              reportReady: true
            }
          : k
      )
    );
    showToast(`Security Field Report returned to Board Console: Cleared by ${reportData.officer}!`, 'success');
  };

  const handleConfirmUtilityPayment = (billId, paymentData) => {
    const res = serviceApi.payUtilityBill(billId, paymentData);
    if (res) {
      setTreasuryData(serviceApi.getTreasuryData());
      setTreasuryPaymentModal({ isOpen: false, mode: 'PAY_UTILITY_BILL', billData: null, unitData: null });
      showToast(`Utility Bill paid successfully! UTR: ${paymentData.utrNumber}`, 'success');
    }
  };

  const handleConfirmDeposit = (depositData) => {
    const res = serviceApi.depositCashToBank(depositData);
    if (res) {
      setTreasuryData(serviceApi.getTreasuryData());
      setTreasuryPaymentModal({ isOpen: false, mode: 'DEPOSIT_CASH', billData: null, unitData: null });
      showToast(`₹${depositData.amount.toLocaleString('en-IN')} deposited to Society HDFC Account. Slip #${depositData.slipNumber}`, 'success');
    }
  };

  const handleConfirmDisbursement = (disburseData) => {
    const res = serviceApi.disburseTreasuryFunds(disburseData);
    if (res) {
      setTreasuryData(serviceApi.getTreasuryData());
      setTreasuryPaymentModal({ isOpen: false, mode: 'WITHDRAW_DISBURSE', billData: null, unitData: null });
      showToast(`Disbursement of ₹${disburseData.amount.toLocaleString('en-IN')} authorized. Voucher #${disburseData.voucherNumber}`, 'info');
    }
  };

  const handleConfirmUnitPayment = (unitSuite, paymentData) => {
    const res = serviceApi.recordApartmentPayment(unitSuite, paymentData);
    if (res) {
      setTreasuryData(serviceApi.getTreasuryData());
      setTreasuryPaymentModal({ isOpen: false, mode: 'RECORD_UNIT_PAYMENT', billData: null, unitData: null });
      showToast(`Payment receipt #${res.receiptNumber} issued for ${unitSuite}! Dues settled.`, 'success');
    }
  };

  const handleDeletePost = () => {
    if (!deletePostModal.postId) return;
    serviceApi.deletePost(deletePostModal.postId, deletePostModal.reason);
    setCommunityPosts(serviceApi.getPosts());
    setDeletePostModal({ isOpen: false, postId: null, reason: 'Spam / Commercial promotion' });
    showToast('Post removed by Estate Administration.', 'info');
  };

  const handleTogglePin = (postId) => {
    const updated = serviceApi.pinPost(postId);
    setCommunityPosts(serviceApi.getPosts());
    showToast(updated?.isPinned ? 'Notice pinned to top of Community Feed.' : 'Notice unpinned.', 'success');
  };

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!newNoticeForm.title || !newNoticeForm.content) return;
    serviceApi.createPost({
      title: newNoticeForm.title,
      author: 'Elena Rostova (Estate President)',
      authorRole: 'COMMUNITY_ADMIN',
      category: newNoticeForm.category,
      content: newNoticeForm.content,
      tags: ['Official', 'Advisory', 'Oakridge'],
      isPinned: newNoticeForm.pin
    });
    setCommunityPosts(serviceApi.getPosts());
    setNewNoticeForm({ title: '', category: 'ANNOUNCEMENT', content: '', pin: false });
    setShowNewNoticeModal(false);
    showToast('Official estate circular published to all residents.', 'success');
  };

  const handleToggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = (postId, customText = null) => {
    const textToSubmit = customText || commentInputs[postId];
    if (!textToSubmit || !textToSubmit.trim()) {
      showToast('Please enter a comment or official note.', 'info');
      return;
    }
    const res = serviceApi.addCommentToPost(postId, {
      author: 'Elena Rostova (Estate President)',
      unit: 'Management Committee',
      role: 'COMMUNITY_ADMIN',
      text: textToSubmit.trim()
    });
    if (res) {
      setCommunityPosts(serviceApi.getPosts());
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      setOpenComments((prev) => ({ ...prev, [postId]: true }));
      showToast('Official response posted to notice thread.', 'success');
    }
  };

  const handleSaveNewWorkOrder = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleIssueVendorPass = (newPass) => {
    setVendorGatePasses((prev) => [newPass, ...prev]);
  };

  const handleRegisterStaff = (newStaff) => {
    setDomesticStaff((prev) => [newStaff, ...prev]);
  };

  const handleConfirmInvoiceApproval = (approvalData) => {
    setAmcContracts((prev) =>
      prev.map((c) =>
        c.id === approvalData.invoiceId || c.name.includes(approvalData.vendorName)
          ? { ...c, pendingInvoice: false, status: 'ACTIVE_AMC' }
          : c
      )
    );
    // Disburse via treasury API
    const updatedTreasury = serviceApi.recordDisbursement({
      recipient: approvalData.vendorName,
      category: 'AMC & Maintenance Operations',
      amount: approvalData.netPayable,
      account: approvalData.escrowAccount,
      memo: `President Approval: ${approvalData.vendorName} (Penalty Ded: ₹${approvalData.slaPenaltyDeduction})`
    });
    if (updatedTreasury) {
      setTreasuryData(serviceApi.getTreasuryData());
    }
  };

  const handleOpenPayoutForVendor = (vendorName = '', amount = '', invoiceRef = '', sourceAccount = 'OPERATING_BANK') => {
    setPayoutPrefill({
      payee: vendorName,
      amount: amount ? String(amount) : '',
      invoiceRef: invoiceRef || '',
      sourceAccount: sourceAccount || 'OPERATING_BANK'
    });
    setShowPresidentPayoutModal(true);
  };

  const handleExecutePresidentPayout = (payoutData) => {
    try {
      const res = serviceApi.executeVendorBankPayout(payoutData);
      if (res) {
        setTreasuryData(serviceApi.getTreasuryData());

        // Update matching AMC contract invoice in state
        if (payoutData.vendorName) {
          setAmcContracts((prev) =>
            prev.map((c) => {
              if (
                c.name.toLowerCase().includes(payoutData.vendorName.toLowerCase().slice(0, 4)) ||
                (payoutData.invoiceRef && c.invoiceRef === payoutData.invoiceRef)
              ) {
                return { ...c, pendingInvoice: false, pendingInvoiceAmount: 0 };
              }
              return c;
            })
          );
        }

        setShowPresidentPayoutModal(false);
        showToast(
          `Bank Payout of ₹${payoutData.amount.toLocaleString('en-IN')} transmitted to ${payoutData.vendorName}! UTR: ${res.utr}`,
          'success'
        );
      }
    } catch (err) {
      showToast(err.message || 'Disbursal transmission failed.', 'error');
    }
  };

  const handleReconcileInflows = () => {
    setIsAuditingInflows(true);
    setTimeout(() => {
      setIsAuditingInflows(false);
      showToast(
        'Inflow Audit Complete: All 7 bank webhook feeds reconciled against HDFC & SBI ledgers with 0 discrepancy!',
        'success'
      );
    }, 550);
  };

  return (
    <div className={`bg-[#FAF8FF] font-['Plus_Jakarta_Sans',sans-serif] text-[#131B2E] antialiased min-h-screen flex ${isCommunityFrozen ? 'pt-16' : ''}`}>
      {/* Community Frozen Lockout Top Banner */}
      {isCommunityFrozen && (
        <div className="fixed top-0 left-0 right-0 z-[99999] bg-gradient-to-r from-rose-700 via-rose-800 to-amber-800 text-white px-5 py-3.5 shadow-2xl flex items-center justify-between border-b-2 border-rose-300">
          <div className="flex items-center gap-3 max-w-7xl mx-auto w-full">
            <div className="p-2 bg-white/10 rounded-xl border border-white/20 shrink-0">
              <span className="material-symbols-outlined text-2xl text-amber-300 animate-pulse">lock</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-rose-950/80 text-rose-200 font-black text-[10px] uppercase px-2 py-0.5 rounded border border-rose-400/40">
                  🔒 SUBSCRIPTION FROZEN / ACCESS BLOCKED
                </span>
                <span className="font-extrabold text-sm text-white">
                  {currentCommunity?.name || 'Community Portal'} Services Suspended
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                Notice: <em>"{currentCommunity?.freezeReason || 'Annual SaaS License Renewal Past Due'}"</em>. Read-only safety logs active. Contact <strong>support@communityconnect.io</strong> / <strong>+91 800-266-6864</strong> to unfreeze live portal access.
              </p>
            </div>
          </div>
        </div>
      )}
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

      {/* Invite Committee Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e7ff] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#c9e6ff]/50 text-[#006591]">
                  <span className="material-symbols-outlined text-xl">person_add</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#131b2e]">Invite Committee Member</h3>
                  <p className="text-xs text-[#6e7b6c]">Elevate a fellow tower resident to the Management Committee</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 text-[#6e7b6c] hover:text-[#131b2e] rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#131b2e]">Select Resident &amp; Suite</span>
                <select
                  value={inviteResident}
                  onChange={(e) => setInviteResident(e.target.value)}
                  className="w-full rounded-xl bg-[#f2f3ff] border border-[#dae2fd] p-2.5 text-sm text-[#131b2e] focus:outline-none focus:border-[#006b2c]"
                >
                  <option value="Rajesh Verma (Flat C-1104, Tower C)">Rajesh Verma • Tower C &amp; Flat C-1104 (Active Resident)</option>
                  <option value="Priya Saxena (Flat B-402, Tower B)">Priya Saxena • Tower B &amp; Flat B-402 (Registered Owner)</option>
                  <option value="Vikramaditya Sen (Flat B-102, Tower B)">Vikramaditya Sen • Tower B &amp; Flat B-102 (Co-Owner)</option>
                  <option value="Anita Menon (Flat A-902, Tower A)">Anita Menon • Tower A &amp; Flat A-902 (Registered Owner)</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#131b2e]">Assign Committee Role</span>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-xl bg-[#f2f3ff] border border-[#dae2fd] p-2.5 text-sm text-[#131b2e] focus:outline-none focus:border-[#006b2c]"
                >
                  <option value="Secretary">Secretary (Governance, Notices &amp; AGM Agendas)</option>
                  <option value="Treasurer">Treasurer (Financial Ledger &amp; Bank Signatory)</option>
                  <option value="Block Lead (Tower A)">Block Lead - Tower A (Floor Escalations)</option>
                  <option value="Block Lead (Tower B)">Block Lead - Tower B (Floor Escalations)</option>
                  <option value="Co-Admin">Co-Admin (Full Access Delegation)</option>
                </select>
              </label>

              <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#6e7b6c] uppercase font-bold block">Generated 6-Digit Invitation Code</span>
                  <span className="text-xl font-bold text-[#006b2c] tracking-widest">{inviteCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newCode = 'MC-' + Math.floor(1000 + Math.random() * 9000);
                    setInviteCode(newCode);
                    showToast('Generated fresh code: ' + newCode, 'info');
                  }}
                  className="px-3 py-1.5 bg-white text-[#006b2c] hover:bg-[#006b2c] hover:text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">refresh</span> Refresh
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#7ffc97]/20 text-[#005320] text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">verified_user</span>
                <span>Bylaw Notice: Upon resident acceptance via OTP or WhatsApp invite link, elevated members receive designated administrative privileges.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInviteModal(false);
                  showToast(`Invitation code ${inviteCode} and link sent to ${inviteResident} for role: ${inviteRole}`, 'success');
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#006b2c] text-white text-sm font-bold hover:bg-[#00873a] shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Send Invite Link &amp; Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Verification & Inspection Modal */}
      {showSecurityVerifModal && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e2e7ff] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#006b2c]/10 text-[#006b2c]">
                  <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-[#131b2e]">Security Verification &amp; Inspection Console</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">Field Report Ready</span>
                  </div>
                  <p className="text-xs text-[#6e7b6c]">Cross-portal physical inspection record synchronized with Gate 1 Terminal</p>
                </div>
              </div>
              <button
                onClick={() => setShowSecurityVerifModal(false)}
                className="p-1 text-[#6e7b6c] hover:text-[#131b2e] rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#f2f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-xl">badge</span>
                <div>
                  <span className="text-xs font-bold text-[#131b2e] block">Assigned Field Officer: Havaldar Ram Singh (Gate 1 Post)</span>
                  <span className="text-[11px] text-[#6e7b6c]">Patrol Badge #SEC-409 • Radio Channel 3 • Dispatched 09:30 AM</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span>
                <span className="text-[11px] font-bold text-[#006b2c]">Inspection Completed</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#6e7b6c] font-bold">3-Stage Security Verification Pipeline</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-[#f2f3ff] border border-[#dae2fd]">
                  <span className="block font-bold text-[#131b2e]">1. Conflict / App</span>
                  <span className="text-[11px] text-[#006b2c] font-semibold">✔ Verified Docs</span>
                </div>
                <div className="p-2 rounded-xl bg-[#7ffc97]/30 border border-[#006b2c]/30">
                  <span className="block font-bold text-[#131b2e]">2. Field Security</span>
                  <span className="text-[11px] text-[#006b2c] font-bold">✔ Passed by Guard</span>
                </div>
                <div className="p-2 rounded-xl bg-[#c9e6ff]/40 border border-[#006591]/30">
                  <span className="block font-bold text-[#131b2e]">3. Access Gate</span>
                  <span className="text-[11px] text-[#006591] font-bold">Awaiting Admin</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border border-[#e2e7ff] rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
                <span className="text-sm font-bold text-[#131b2e] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006b2c] text-base">fact_check</span>
                  Physical Inspection Checklist &amp; Report Details
                </span>
                <span className="text-xs text-[#6e7b6c] font-medium">Suite: Flat A-1204</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-[#f2f3ff] rounded-lg">
                  <span>Flat Physical Occupancy Status</span>
                  <span className="font-bold text-[#006b2c] flex items-center gap-1">✔ Vacant &amp; Clean</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#f2f3ff] rounded-lg">
                  <span>Key Handover &amp; RFID Surrender</span>
                  <span className="font-bold text-[#006b2c] flex items-center gap-1">✔ 2 Keys + 2 Cards Logged</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#f2f3ff] rounded-lg">
                  <span>Electricity Meter Reading</span>
                  <span className="font-bold text-[#131b2e]">48,219 kWh (Verified)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#f2f3ff] rounded-lg">
                  <span>Biometric Smart Lock Sync</span>
                  <span className="font-bold text-[#006591]">Reset to Factory Master</span>
                </div>
              </div>
              <div className="p-3 bg-[#f2f3ff] rounded-xl flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131b2e]">Patrol Guard Sign-off:</span>
                  <span className="text-[11px] text-[#6e7b6c]">Logged 10:15 AM by Ram Singh</span>
                </div>
                <p className="text-xs text-[#3e4a3d] italic">
                  "Inspected premises with Tower A Marshal. Previous tenant completely vacated; no unauthorized sublease occupants found. Tenant Arjun Kumar legitimate lessee as per agreement."
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs text-[#006b2c] font-bold">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Recommendation: Cleared for Full Digital Gate Access
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={() => {
                  setShowSecurityVerifModal(false);
                  showToast('Re-inspection request dispatched to Gate 1 Supervisor.', 'error');
                }}
                className="px-3 py-1.5 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6] text-xs font-semibold cursor-pointer"
              >
                Request Re-Inspection
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSecurityVerifModal(false);
                    showToast('Grant 5-Day Temporary Passcode dispatched via SMS/WhatsApp.', 'info');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#006591] text-white hover:opacity-90 text-xs font-bold shadow-sm cursor-pointer"
                >
                  Grant 5-Day Temp Access
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSecurityVerifModal(false);
                    handleApproveKYC('kyc-1', 'Arjun Kumar / Shalini Roy');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#006b2c] text-white hover:bg-[#00873a] text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  Grant Full Access (Activate Resident)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Persistent Left Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white z-40 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none border-r border-[#eaedff]">
        <div className="flex flex-col">
          {/* Logo Branding */}
          <div className="h-16 px-5 flex items-center bg-white border-b border-[#eaedff]">
            <BrandLogo size="md" subtitleText="Estate Executive Console" />
          </div>

          {/* Navigation Links */}
          <div className="px-4 pt-4 pb-2">
            <div className="px-3 py-1">
              <span className="text-[10px] uppercase tracking-wider text-[#6e7b6c] font-bold">COMMUNITY MANAGEMENT</span>
            </div>
            <nav className="mt-1 flex flex-col gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#00873a] text-white shadow-sm'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('board')}
                className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                  activeTab === 'board'
                    ? 'bg-[#00873a] text-white shadow-sm'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  <span>Board Console</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'board' ? 'bg-white/20 text-white' : 'bg-[#e2e7ff] text-[#131b2e]'}`}>
                  Verification
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gate')}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                  activeTab === 'gate'
                    ? 'bg-[#00873a] text-white shadow-sm'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">sensor_door</span>
                <span>Gate Passes</span>
              </button>

              <button
                onClick={() => setActiveTab('maintenance')}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                  activeTab === 'maintenance'
                    ? 'bg-[#00873a] text-white shadow-sm'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">handyman</span>
                <span>Maintenance &amp; SLA</span>
              </button>

              <button
                onClick={() => setActiveTab('feed')}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-[#00873a] text-white shadow-sm'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">forum</span>
                <span>Community Feed</span>
              </button>

              <button
                onClick={() => setActiveTab('dues')}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                  activeTab === 'dues'
                    ? 'bg-[#00873a] text-white shadow-sm'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">payments</span>
                <span>Society Dues &amp; Billing</span>
              </button>

              <button
                onClick={() => setActiveTab('vendors')}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                  activeTab === 'vendors'
                    ? 'bg-[#00873a] text-white shadow-sm'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">badge</span>
                <span>Vendors &amp; Staff</span>
              </button>

              <button
                onClick={() => setActiveTab('banking')}
                className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 transition-all rounded-xl text-sm font-semibold cursor-pointer ${
                  activeTab === 'banking'
                    ? 'bg-[#00873a] text-white shadow-sm'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg">account_balance</span>
                  <span>Bank Accounts &amp; Cash</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'banking' ? 'bg-white/20 text-white' : 'bg-[#e8f5e9] text-[#006b2c]'}`}>
                  Live
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 flex flex-col gap-2.5 border-t border-[#eaedff]">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f3ff]">
            <div className="flex items-center gap-1.5 text-xs text-[#3e4a3d]">
              <span className="material-symbols-outlined text-[#006b2c] text-base">lock</span>
              <span>256-bit SSL Encrypted</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#006b2c]"></span>
          </div>
          <button
            onClick={() => showToast('Security SOS Hotline dispatched to Central Guard Command.', 'error')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#ba1a1a] text-white hover:bg-red-700 font-semibold text-xs transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-base">emergency</span>
            <span>Security SOS Hotline</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-72 w-full flex-1">
        {/* Top Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-8 border-b border-[#eaedff]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-1.5 rounded-xl">
              <span className="material-symbols-outlined text-[#006b2c] text-lg">apartment</span>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-xs text-[#131b2e] leading-tight">Oakridge Heights • Unit B-402</span>
                <span className="text-[10px] text-[#6e7b6c] leading-tight">Tower A (Primary Flat)</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2e7ff]">
              <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span>
              <span className="text-[11px] text-[#006b2c] font-bold">System Online • Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('All 53 tenant heartbeats responding normally.', 'info')}
              className="relative p-2 rounded-full text-[#6e7b6c] hover:bg-[#f2f3ff] hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#a36700]"></span>
            </button>

            <div className="flex items-center gap-2.5 pl-2 bg-[#f2f3ff] p-1.5 pr-3 rounded-full">
              <img
                alt="Elena Rostova"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#006b2c]/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiZb7a5TxSdzxLXDfoYxeTXGxcGC8hnG6bHetSKFZgpL4-bpz7i7UcleZhlUQmzzDjjCllPoOYsYjD6qib4tjezLetvaFGOIYDmhFR3dX01_frUY1buu_pbeGq1dLLE4Z84gazsTQSr6DumJFOGT6TeU0kxkkpZNoBlvf9PtG_OXSk45brJb00fARO6BP90GLDHpD35de_CQIrJB96Dz__1F_upJd5UJSrYzNqH8KrDp0MDXXHYGyFyA"
              />
              <div className="flex flex-col text-left">
                <span className="font-bold text-xs text-[#131b2e] leading-tight">Elena Rostova</span>
                <span className="text-[10px] text-[#006b2c] font-semibold leading-tight">Estate President</span>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors cursor-pointer"
                title="Sign Out"
              >
                Sign Out
              </button>
            )}
          </div>
        </header>

        {/* Tab Views */}
        <main className="pt-16 min-h-screen bg-[#FAF8FF]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* Executive Welcome Bar */}
              <div className="px-8 py-6 bg-white border-b border-[#eaedff] shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold uppercase tracking-wider">
                        Executive Management
                      </span>
                      <span className="text-[#6e7b6c]">•</span>
                      <span className="text-xs text-[#6e7b6c] font-medium">Estate President &amp; MC Portal</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight">
                      Welcome back, Elena • Oakridge Heights Executive Dashboard
                    </h1>
                    <p className="text-xs text-[#6e7b6c]">
                      Real-time surveillance, financial reconciliation &amp; facility automation across Towers A, B, C &amp; D (420 residential suites).
                    </p>
                  </div>

                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab('feed')}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-[#006b2c]">campaign</span>
                      <span>+ Post Notice</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('gate')}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-[#006591]">badge</span>
                      <span>+ Staff Pass</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('dues')}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-[#825100]">receipt_long</span>
                      <span>Run Invoices</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('banking')}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e8f5e9] text-[#006b2c] hover:bg-[#c8e6c9] rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">account_balance</span>
                      <span>Bank Accounts &amp; Cash</span>
                    </button>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#c9e6ff] text-[#001e2f] hover:bg-[#39b8fd] rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-[#006591]">person_add</span>
                      <span>+ Invite Committee Member</span>
                    </button>
                    <button
                      onClick={() => showToast('Monthly financial audit report exported to CSV.', 'success')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      <span>Export Audit</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="px-8 py-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* KPI 1: Occupancy */}
                  <div
                    onClick={() => setKpiDetailModal({ isOpen: true, kpiType: 'OCCUPANCY' })}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] hover:border-[#006b2c]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#6e7b6c] font-bold block">Total Occupancy</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-3xl font-bold text-[#131b2e]">94.0%</span>
                          <span className="text-xs text-[#6e7b6c]">/ 420 Units</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#7ffc97]/30 text-[#006b2c] group-hover:bg-[#006b2c] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">domain</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-gray-200 stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3.5"></path>
                          <path className="text-[#006b2c] stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="94, 100" strokeLinecap="round" strokeWidth="3.5"></path>
                        </svg>
                        <div>
                          <span className="text-xs font-bold text-[#131b2e] block">395 Occupied</span>
                          <span className="text-[11px] text-[#6e7b6c]">25 Vacant</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#006b2c] font-bold bg-[#f2f3ff] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">trending_up</span> +12 MoM
                      </span>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#006591] font-semibold">
                      <span>Click to view unit census</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </div>

                  {/* KPI 2: Maintenance Inflow */}
                  <div
                    onClick={() => setKpiDetailModal({ isOpen: true, kpiType: 'MAINTENANCE_FLOW' })}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] hover:border-[#006591]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#6e7b6c] font-bold block">Maintenance Inflow</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-3xl font-bold text-[#131b2e]">₹42.8L</span>
                          <span className="text-xs text-[#6e7b6c]">/ ₹46.2L</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#c9e6ff] text-[#006591] group-hover:bg-[#006591] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-1.5">
                      <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden flex">
                        <div className="bg-[#006591] h-full rounded-full" style={{ width: '92.6%' }}></div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#006b2c] font-bold">92.6% Collected</span>
                        <span className="text-[#ba1a1a] font-semibold">₹3.4L Overdue</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#006591] font-semibold">
                      <span>Click for collection ledger</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </div>

                  {/* KPI 3: Daily Gate Flow */}
                  <div
                    onClick={() => setKpiDetailModal({ isOpen: true, kpiType: 'GATE_FLOW' })}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] hover:border-[#825100]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#6e7b6c] font-bold block">Daily Gate Flow</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-3xl font-bold text-[#131b2e]">1,248</span>
                          <span className="text-xs text-[#6e7b6c]">Entries Today</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#ffddb8] text-[#825100] group-hover:bg-[#825100] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">emoji_flags</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] text-[#6e7b6c]">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#006b2c]"></span> 842 RFID</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#006591]"></span> 268 Service</span>
                      <span className="flex items-center gap-1 text-[#ba1a1a] font-bold"><span className="h-2 w-2 rounded-full bg-[#ba1a1a]"></span> 2 Overstays</span>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#825100] font-semibold">
                      <span>Click for ANPR telemetry</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </div>

                  {/* KPI 4: Work Orders & SLA */}
                  <div
                    onClick={() => setKpiDetailModal({ isOpen: true, kpiType: 'WORK_ORDERS_SLA' })}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] hover:border-[#ba1a1a]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#6e7b6c] font-bold block">Work Orders &amp; SLA</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-3xl font-bold text-[#131b2e]">14 Active</span>
                          <span className="text-xs text-[#ba1a1a] font-bold">/ 3 Critical</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] group-hover:bg-[#ba1a1a] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">handyman</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="text-[#006b2c] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">verified</span> 98.2% On-Time SLA
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#6e7b6c] font-semibold text-[11px]">Avg MTTR: 2.4h</span>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#ba1a1a] font-semibold">
                      <span>Click for SLA breakdown</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </div>
                </div>

                {/* 2-Column Split: Charts & Critical Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left 8 Cols */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Dues Collection Trend Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#eaedff]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#006b2c] text-xl">query_stats</span>
                            <h2 className="text-lg font-bold text-[#131b2e]">Dues Collection Trend vs Budget Target</h2>
                          </div>
                          <p className="text-xs text-[#6e7b6c]">FY 2024–25 Maintenance Billing &amp; Sinking Fund Accumulation</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl">
                            <button
                              type="button"
                              onClick={() => setChartView('monthly')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                chartView === 'monthly'
                                  ? 'bg-white text-[#131b2e] shadow-sm'
                                  : 'text-[#6e7b6c] hover:text-[#131b2e]'
                              }`}
                            >
                              Monthly View
                            </button>
                            <button
                              type="button"
                              onClick={() => setChartView('tower')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                chartView === 'tower'
                                  ? 'bg-white text-[#131b2e] shadow-sm'
                                  : 'text-[#6e7b6c] hover:text-[#131b2e]'
                              }`}
                            >
                              By Tower Breakdown
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowExecutivePrintModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] rounded-xl text-xs font-bold transition-colors cursor-pointer border border-[#eaedff]"
                            title="Print Executive Financial Audit"
                          >
                            <span className="material-symbols-outlined text-sm text-[#006591]">print</span>
                            <span>Print Report</span>
                          </button>
                        </div>
                      </div>

                      {/* By Tower Sub-filter pills if in tower mode */}
                      {chartView === 'tower' && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          <span className="text-xs font-semibold text-[#6e7b6c] shrink-0">Filter:</span>
                          {[
                            { id: 'ALL', label: 'All Towers (420)' },
                            { id: 'TOWER_A', label: 'Tower A (112)' },
                            { id: 'TOWER_B', label: 'Tower B (104)' },
                            { id: 'TOWER_C', label: 'Tower C (100)' },
                            { id: 'TOWER_D', label: 'Tower D (104)' },
                            { id: 'VILLAS', label: 'Villas & Penthouses (15)' }
                          ].map((pill) => (
                            <button
                              key={pill.id}
                              onClick={() => setSelectedTowerFilter(pill.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                                selectedTowerFilter === pill.id
                                  ? 'bg-[#006b2c] text-white shadow-sm'
                                  : 'bg-[#f2f3ff] text-[#3e4a3d] hover:bg-[#e2e7ff]'
                              }`}
                            >
                              {pill.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="p-4 bg-[#f2f3ff] rounded-2xl border border-[#eaedff]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <span className="text-xs font-bold text-[#131b2e] block">
                              {chartView === 'monthly'
                                ? 'FY 2024–25 Monthly Inflow Velocity (Interactive Timeline)'
                                : `Tower Collection Performance (${
                                    selectedTowerFilter === 'ALL'
                                      ? 'Entire Community (420 Units)'
                                      : selectedTowerFilter.replace('_', ' ')
                                  })`}
                            </span>
                            <span className="text-[11px] text-[#6e7b6c]">
                              {chartView === 'monthly'
                                ? 'Click on any month to inspect collection efficiency, arrears & unit stats'
                                : 'Click on any tower bar or pill to view recovery rates & unit census'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-medium text-[#6e7b6c] shrink-0">
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded-sm bg-[#006b2c]"></span> Collected Inflow
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded-sm bg-[#dae2fd]"></span> Target Billed
                            </span>
                          </div>
                        </div>

                        {chartView === 'monthly' ? (
                          <div className="flex flex-col gap-3">
                            <div className="w-full h-48">
                              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 650 160">
                                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="25" y2="25"></line>
                                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="70" y2="70"></line>
                                <line stroke="#dae2fd" strokeWidth="1" x1="0" x2="650" y1="120" y2="120"></line>

                                {[
                                  { month: 'APR', full: 'April 2024', target: 45.0, collected: 43.8, rate: '97.3%', arrears: 1.2, unitsPaid: 405, totalUnits: 420, x: 25, hT: 95, hC: 92 },
                                  { month: 'MAY', full: 'May 2024', target: 45.0, collected: 44.1, rate: '98.0%', arrears: 0.9, unitsPaid: 408, totalUnits: 420, x: 95, hT: 95, hC: 93 },
                                  { month: 'JUN', full: 'June 2024', target: 45.5, collected: 43.5, rate: '95.6%', arrears: 2.0, unitsPaid: 398, totalUnits: 420, x: 165, hT: 96, hC: 91 },
                                  { month: 'JUL', full: 'July 2024', target: 45.5, collected: 41.2, rate: '90.5%', arrears: 4.3, unitsPaid: 382, totalUnits: 420, x: 235, hT: 96, hC: 86 },
                                  { month: 'AUG', full: 'August 2024', target: 46.0, collected: 44.8, rate: '97.4%', arrears: 1.2, unitsPaid: 406, totalUnits: 420, x: 305, hT: 97, hC: 94 },
                                  { month: 'SEP', full: 'September 2024 (Active Audit)', target: 46.2, collected: 42.8, rate: '92.6%', arrears: 3.4, unitsPaid: 395, totalUnits: 420, x: 375, hT: 98, hC: 90 },
                                  { month: 'OCT', full: 'October 2024 (Projected)', target: 46.5, collected: 43.0, rate: '92.5%', arrears: 3.5, unitsPaid: 392, totalUnits: 420, x: 445, hT: 99, hC: 91 },
                                  { month: 'NOV', full: 'November 2024 (Projected)', target: 46.5, collected: 43.2, rate: '92.9%', arrears: 3.3, unitsPaid: 394, totalUnits: 420, x: 515, hT: 99, hC: 91 },
                                  { month: 'DEC', full: 'December 2024 (Projected)', target: 47.0, collected: 44.5, rate: '94.7%', arrears: 2.5, unitsPaid: 399, totalUnits: 420, x: 585, hT: 100, hC: 94 }
                                ].map((item) => {
                                  const isSelected = selectedChartMonth.month === item.month;
                                  return (
                                    <g
                                      key={item.month}
                                      onClick={() => setSelectedChartMonth(item)}
                                      className="cursor-pointer group"
                                    >
                                      {/* Target Bar */}
                                      <rect
                                        fill="#dae2fd"
                                        height={item.hT}
                                        rx="4"
                                        width="32"
                                        x={item.x}
                                        y={120 - item.hT}
                                        opacity={isSelected ? '1' : '0.8'}
                                      ></rect>
                                      {/* Collected Inflow Bar */}
                                      <rect
                                        fill={item.month === 'SEP' ? '#006b2c' : isSelected ? '#00873a' : '#006b2c'}
                                        height={item.hC}
                                        rx="4"
                                        width="32"
                                        x={item.x}
                                        y={120 - item.hC}
                                        className="transition-all"
                                      ></rect>
                                      {/* Highlight ring if selected */}
                                      {isSelected && (
                                        <rect
                                          fill="none"
                                          stroke="#131b2e"
                                          strokeWidth="2"
                                          rx="6"
                                          height={item.hT + 6}
                                          width="36"
                                          x={item.x - 2}
                                          y={120 - item.hT - 3}
                                        ></rect>
                                      )}
                                      {/* Month Label */}
                                      <text
                                        fill={isSelected ? '#131b2e' : '#6e7b6c'}
                                        fontSize="11"
                                        fontWeight={isSelected ? '700' : '600'}
                                        textAnchor="middle"
                                        x={item.x + 16}
                                        y="142"
                                      >
                                        {item.month}
                                      </text>
                                    </g>
                                  );
                                })}
                              </svg>
                            </div>

                            {/* Dynamic Selected Month Detail Box */}
                            <div className="p-3.5 bg-white rounded-xl border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-[#131b2e]">
                                    {selectedChartMonth.full}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/30 text-[#006b2c] text-[11px] font-bold">
                                    {selectedChartMonth.rate} Collected
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-[#6e7b6c]">
                                  <span>Target Billed: <strong className="text-[#131b2e]">₹{selectedChartMonth.target}L</strong></span>
                                  <span>•</span>
                                  <span>Collected: <strong className="text-[#006b2c]">₹{selectedChartMonth.collected}L</strong></span>
                                  <span>•</span>
                                  <span>Overdue Arrears: <strong className="text-[#ba1a1a]">₹{selectedChartMonth.arrears}L</strong></span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#6e7b6c] font-medium hidden sm:inline">
                                  {selectedChartMonth.unitsPaid} / {selectedChartMonth.totalUnits} Units Paid
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setKpiDetailModal({ isOpen: true, kpiType: 'MAINTENANCE_FLOW' })}
                                  className="px-3 py-1.5 rounded-lg bg-[#006591] hover:bg-[#005277] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                                >
                                  Inspect Arrears Ledger →
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Tower Breakdown Chart */
                          <div className="flex flex-col gap-3">
                            <div className="w-full h-48">
                              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 650 160">
                                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="25" y2="25"></line>
                                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="70" y2="70"></line>
                                <line stroke="#dae2fd" strokeWidth="1" x1="0" x2="650" y1="120" y2="120"></line>

                                {[
                                  { id: 'TOWER_A', label: 'Tower A', units: '108 / 112', target: '₹12.8L', collected: '₹12.4L', rate: '96.8%', overdue: '₹0.4L', x: 40, hT: 100, hC: 96, color: '#006b2c' },
                                  { id: 'TOWER_B', label: 'Tower B', units: '98 / 104', target: '₹11.6L', collected: '₹10.8L', rate: '93.1%', overdue: '₹0.8L', x: 165, hT: 95, hC: 88, color: '#006591' },
                                  { id: 'TOWER_C', label: 'Tower C', units: '96 / 100', target: '₹10.4L', collected: '₹9.6L', rate: '92.3%', overdue: '₹0.8L', x: 290, hT: 90, hC: 83, color: '#825100' },
                                  { id: 'TOWER_D', label: 'Tower D', units: '93 / 104', target: '₹8.1L', collected: '₹7.2L', rate: '88.8%', overdue: '₹0.9L', x: 415, hT: 85, hC: 75, color: '#ba1a1a' },
                                  { id: 'VILLAS', label: 'Villas & Penthouses', units: '14 / 15', target: '₹3.3L', collected: '₹2.8L', rate: '84.8%', overdue: '₹0.5L', x: 540, hT: 75, hC: 63, color: '#4a6572' }
                                ].map((t) => {
                                  const isSelected = selectedTowerFilter === t.id || selectedTowerFilter === 'ALL';
                                  return (
                                    <g
                                      key={t.id}
                                      onClick={() => setSelectedTowerFilter(t.id)}
                                      className="cursor-pointer group"
                                    >
                                      {/* Target */}
                                      <rect
                                        fill="#dae2fd"
                                        height={t.hT}
                                        rx="4"
                                        width="44"
                                        x={t.x}
                                        y={120 - t.hT}
                                        opacity={isSelected ? '1' : '0.4'}
                                      ></rect>
                                      {/* Collected */}
                                      <rect
                                        fill={t.color}
                                        height={t.hC}
                                        rx="4"
                                        width="44"
                                        x={t.x}
                                        y={120 - t.hC}
                                        opacity={isSelected ? '1' : '0.4'}
                                      ></rect>
                                      {/* Text */}
                                      <text
                                        fill={isSelected ? '#131b2e' : '#6e7b6c'}
                                        fontSize="11"
                                        fontWeight="700"
                                        textAnchor="middle"
                                        x={t.x + 22}
                                        y="142"
                                      >
                                        {t.label.split(' ')[0]} ({t.rate})
                                      </text>
                                    </g>
                                  );
                                })}
                              </svg>
                            </div>

                            {/* Dynamic Selected Tower Detail Box */}
                            <div className="p-3.5 bg-white rounded-xl border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-[#131b2e]">
                                    {selectedTowerFilter === 'ALL'
                                      ? 'Oakridge Heights - All Towers Combined (420 Units)'
                                      : selectedTowerFilter === 'TOWER_A'
                                      ? 'Tower A - High-Rise Executive Suites (112 Units)'
                                      : selectedTowerFilter === 'TOWER_B'
                                      ? 'Tower B - Mid-Rise Suites (104 Units)'
                                      : selectedTowerFilter === 'TOWER_C'
                                      ? 'Tower C - High-Rise Suites (100 Units)'
                                      : selectedTowerFilter === 'TOWER_D'
                                      ? 'Tower D - Park View Suites (104 Units)'
                                      : 'Villas & Penthouses (15 Units)'}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/30 text-[#006b2c] text-[11px] font-bold">
                                    {selectedTowerFilter === 'ALL'
                                      ? '92.6% Collected'
                                      : selectedTowerFilter === 'TOWER_A'
                                      ? '96.8% Collected'
                                      : selectedTowerFilter === 'TOWER_B'
                                      ? '93.1% Collected'
                                      : selectedTowerFilter === 'TOWER_C'
                                      ? '92.3% Collected'
                                      : selectedTowerFilter === 'TOWER_D'
                                      ? '88.8% Collected'
                                      : '84.8% Collected'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-[#6e7b6c]">
                                  <span>
                                    Occupancy:{' '}
                                    <strong className="text-[#131b2e]">
                                      {selectedTowerFilter === 'ALL'
                                        ? '395 / 420 (94%)'
                                        : selectedTowerFilter === 'TOWER_A'
                                        ? '108 / 112 (96.4%)'
                                        : selectedTowerFilter === 'TOWER_B'
                                        ? '98 / 104 (94.2%)'
                                        : selectedTowerFilter === 'TOWER_C'
                                        ? '96 / 100 (96%)'
                                        : selectedTowerFilter === 'TOWER_D'
                                        ? '93 / 104 (89.4%)'
                                        : '14 / 15 (93.3%)'}
                                    </strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Outstanding Deficit:{' '}
                                    <strong className="text-[#ba1a1a]">
                                      {selectedTowerFilter === 'ALL'
                                        ? '₹3.40L (25 Flats)'
                                        : selectedTowerFilter === 'TOWER_A'
                                        ? '₹0.40L (4 Flats)'
                                        : selectedTowerFilter === 'TOWER_B'
                                        ? '₹0.80L (6 Flats)'
                                        : selectedTowerFilter === 'TOWER_C'
                                        ? '₹0.80L (5 Flats)'
                                        : selectedTowerFilter === 'TOWER_D'
                                        ? '₹0.90L (9 Flats)'
                                        : '₹0.50L (2 Flats)'}
                                    </strong>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowExecutivePrintModal(true)}
                                  className="px-3 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 border border-[#eaedff]"
                                >
                                  <span className="material-symbols-outlined text-sm text-[#006591]">print</span>
                                  Print Tower Audit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setKpiDetailModal({ isOpen: true, kpiType: 'MAINTENANCE_FLOW' })}
                                  className="px-3 py-1.5 rounded-lg bg-[#006591] hover:bg-[#005277] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                                >
                                  View Defaulters →
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Critical Collection Queue */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#131b2e]">Critical Collection Action Queue</span>
                          <button onClick={() => setActiveTab('dues')} className="text-xs text-[#006591] font-semibold hover:underline cursor-pointer">
                            View All 18 Units →
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3.5 bg-[#f2f3ff] rounded-xl flex flex-col justify-between gap-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-sm font-bold text-[#131b2e]">Suite B-402</span>
                                <span className="block text-[11px] text-[#6e7b6c]">Owner: Priya Saxena</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold">₹28,500</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-[#6e7b6c]">
                              <span>Due: 45 Days</span>
                              <button
                                onClick={() => showToast('WhatsApp reminder sent to Priya Saxena (B-402)', 'success')}
                                className="px-2.5 py-1 bg-white text-[#006b2c] hover:bg-[#006b2c] hover:text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-xs">chat</span> WhatsApp
                              </button>
                            </div>
                          </div>

                          <div className="p-3.5 bg-[#f2f3ff] rounded-xl flex flex-col justify-between gap-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-sm font-bold text-[#131b2e]">Suite C-1104</span>
                                <span className="block text-[11px] text-[#6e7b6c]">Tenant: Rajesh Verma</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold">₹34,200</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-[#6e7b6c]">
                              <span>Due: 60 Days</span>
                              <button
                                onClick={() => showToast('WhatsApp reminder sent to Rajesh Verma (C-1104)', 'success')}
                                className="px-2.5 py-1 bg-white text-[#006b2c] hover:bg-[#006b2c] hover:text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-xs">chat</span> WhatsApp
                              </button>
                            </div>
                          </div>

                          <div className="p-3.5 bg-[#f2f3ff] rounded-xl flex flex-col justify-between gap-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-sm font-bold text-[#131b2e]">Suite A-902</span>
                                <span className="block text-[11px] text-[#6e7b6c]">Owner: Anita Menon</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold">₹19,000</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-[#6e7b6c]">
                              <span>Due: 35 Days</span>
                              <button
                                onClick={() => showToast('WhatsApp reminder sent to Anita Menon (A-902)', 'success')}
                                className="px-2.5 py-1 bg-white text-[#006b2c] hover:bg-[#006b2c] hover:text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-xs">chat</span> WhatsApp
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Critical Work Orders Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#ba1a1a] text-xl">priority_high</span>
                            <h2 className="text-lg font-bold text-[#131b2e]">Critical Work Orders &amp; SLA Management</h2>
                          </div>
                          <p className="text-xs text-[#6e7b6c]">14 Active tickets • 3 Escalated to Management Committee</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('maintenance')}
                          className="px-3.5 py-1.5 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Open Tickets Console →
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">elevator</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#131b2e]">Tower A Lift #2 Hydraulic Sensor Fault</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">P1 CRITICAL</span>
                              </div>
                              <span className="text-xs text-[#6e7b6c] mt-0.5 block">Assigned: Otis Elevators (Suresh K.) • Reported 40m ago</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 justify-between md:justify-end">
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-bold text-[#ba1a1a] flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">alarm</span> ETA: 20 mins
                              </span>
                              <span className="text-[10px] text-[#6e7b6c]">SLA: 2 hrs</span>
                            </div>
                            <button
                              onClick={() => showToast('Technician Suresh K. contacted via radio alert.', 'info')}
                              className="px-3 py-1.5 bg-white text-[#131b2e] hover:bg-[#eaedff] rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
                            >
                              View Dispatch
                            </button>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-[#006591] text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">water_drop</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#131b2e]">Clubhouse Water Softener Flange Leak</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#c9e6ff] text-[#001e2f] text-[10px] font-bold">P2 MEDIUM</span>
                              </div>
                              <span className="text-xs text-[#6e7b6c] mt-0.5 block">Assigned: AquaPure Tech Services • Status: In Progress</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 justify-between md:justify-end">
                            <span className="text-xs font-bold text-[#006591] flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">build</span> In Progress
                            </span>
                            <button
                              onClick={() => setActiveTab('maintenance')}
                              className="px-3 py-1.5 bg-white text-[#131b2e] hover:bg-[#eaedff] rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Facility Photography Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => setActiveTab('maintenance')}
                        className="relative rounded-2xl overflow-hidden shadow-sm h-48 group cursor-pointer"
                      >
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt="Clubhouse & Pool Deck"
                          src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/90 via-[#131b2e]/30 to-transparent flex flex-col justify-end p-4">
                          <span className="text-[#7ffc97] text-[10px] uppercase font-bold tracking-wide">Facility Inspection Completed</span>
                          <span className="text-white text-lg font-bold">Clubhouse &amp; Pool Deck</span>
                          <p className="text-[#dae2fd] text-xs">Ph level: 7.2 Balanced • Lifeguard check complete</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveTab('gate')}
                        className="relative rounded-2xl overflow-hidden shadow-sm h-48 group cursor-pointer"
                      >
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt="Main Gate ANPR"
                          src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/90 via-[#131b2e]/30 to-transparent flex flex-col justify-end p-4">
                          <span className="text-[#89ceff] text-[10px] uppercase font-bold tracking-wide">Perimeter Security Active</span>
                          <span className="text-white text-lg font-bold">Main Gate ANPR Lane 1 &amp; 2</span>
                          <p className="text-[#dae2fd] text-xs">All 4 Boom barriers operational • Firmware 3.4.1 OK</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right 4 Cols */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Admin Console Shortcuts */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006b2c] text-xl">admin_panel_settings</span>
                          <h2 className="text-lg font-bold text-[#131b2e]">Admin Console</h2>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => setActiveTab('board')}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#006b2c]/10 transition-colors text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white text-[#006b2c] group-hover:bg-[#006b2c] group-hover:text-white transition-colors shadow-sm">
                              <span className="material-symbols-outlined text-lg">how_to_reg</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[#131b2e] block">Resident Verifications</span>
                              <span className="text-[11px] text-[#6e7b6c]">New tenant leases &amp; KYC</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold">3 Pending</span>
                        </button>

                        <button
                          onClick={() => showToast('Court & Banquet slots fully booked for the weekend.', 'info')}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#006591]/10 transition-colors text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white text-[#006591] group-hover:bg-[#006591] group-hover:text-white transition-colors shadow-sm">
                              <span className="material-symbols-outlined text-lg">sports_tennis</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[#131b2e] block">Amenity Bookings</span>
                              <span className="text-[11px] text-[#6e7b6c]">Banquet hall &amp; Tennis</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#131b2e] text-[10px] font-bold">7 Today</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('feed')}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#825100]/10 transition-colors text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white text-[#825100] group-hover:bg-[#825100] group-hover:text-white transition-colors shadow-sm">
                              <span className="material-symbols-outlined text-lg">broadcast_on_personal</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[#131b2e] block">Broadcast Circular</span>
                              <span className="text-[11px] text-[#6e7b6c]">Push notification &amp; SMS</span>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-[#6e7b6c] text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    {/* Domestic Staff On-Premise */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006591] text-xl">groups</span>
                          <h2 className="text-lg font-bold text-[#131b2e]">Staff On-Premise</h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowStaffRollCallModal(true)}
                          className="text-[11px] text-[#006b2c] font-bold bg-[#7ffc97]/30 hover:bg-[#006b2c] hover:text-white px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                        >
                          142 Checked In • View Roll-Call
                        </button>
                      </div>

                      <div
                        onClick={() => setShowStaffRollCallModal(true)}
                        className="grid grid-cols-3 gap-2 text-center cursor-pointer group"
                      >
                        <div className="p-2.5 bg-[#f2f3ff] rounded-xl group-hover:bg-[#e2e7ff] transition-colors">
                          <span className="block text-xl font-bold text-[#131b2e]">88</span>
                          <span className="text-[10px] text-[#6e7b6c]">Housemaids</span>
                        </div>
                        <div className="p-2.5 bg-[#f2f3ff] rounded-xl group-hover:bg-[#e2e7ff] transition-colors">
                          <span className="block text-xl font-bold text-[#131b2e]">34</span>
                          <span className="text-[10px] text-[#6e7b6c]">Chauffeurs</span>
                        </div>
                        <div className="p-2.5 bg-[#f2f3ff] rounded-xl group-hover:bg-[#e2e7ff] transition-colors">
                          <span className="block text-xl font-bold text-[#131b2e]">20</span>
                          <span className="text-[10px] text-[#6e7b6c]">Home Cooks</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#6e7b6c] font-bold">Authorized Vendor Crews</span>
                        <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-xl text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#006b2c]"></span>
                            <span className="font-semibold text-[#131b2e]">Asian Paints (Tower C)</span>
                          </div>
                          <span className="text-[#6e7b6c]">6 Techs</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-xl text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#006b2c]"></span>
                            <span className="font-semibold text-[#131b2e]">Urban Company Clean</span>
                          </div>
                          <span className="text-[#6e7b6c]">4 Specs</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowStaffRollCallModal(true)}
                        className="w-full py-2 bg-[#f2f3ff] hover:bg-[#006591] hover:text-white text-[#006591] rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">badge</span>
                        <span>Open Live Staff Roll-Call &amp; Police Verification →</span>
                      </button>
                    </div>

                    {/* Live Notices */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#825100] text-xl">feed</span>
                          <h2 className="text-lg font-bold text-[#131b2e]">Live Notices</h2>
                        </div>
                        <button
                          onClick={() => setActiveTab('feed')}
                          className="text-[#006b2c] text-xs font-semibold hover:underline cursor-pointer"
                        >
                          Manage All
                        </button>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <div className="p-3 rounded-xl bg-[#f2f3ff] flex flex-col gap-1 border-l-4 border-[#006b2c]">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[#006b2c] font-bold">FESTIVAL GUIDELINE</span>
                            <span className="text-[10px] text-[#6e7b6c]">Today, 9:15 AM</span>
                          </div>
                          <span className="text-xs font-bold text-[#131b2e]">Ganesh Chaturthi Protocol</span>
                          <p className="text-[11px] text-[#6e7b6c] line-clamp-2">Temporary eco-immersion tanks set near Tower D lawn...</p>
                        </div>
                        <div className="p-3 rounded-xl bg-[#f2f3ff] flex flex-col gap-1 border-l-4 border-[#825100]">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[#825100] font-bold">MAINTENANCE ALERT</span>
                            <span className="text-[10px] text-[#6e7b6c]">Yesterday</span>
                          </div>
                          <span className="text-xs font-bold text-[#131b2e]">DG Set Power Backup Testing</span>
                          <p className="text-[11px] text-[#6e7b6c] line-clamp-2">Mandatory annual testing of 500kVA Cummins generator sets scheduled.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOARD CONSOLE */}
          {activeTab === 'board' && (
            <div>
              <div className="px-8 py-6 bg-white border-b border-[#eaedff] shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c9e6ff] text-[#001e2f] text-[10px] font-bold uppercase">
                        Executive Verification
                      </span>
                      <span className="text-[#6e7b6c]">•</span>
                      <span className="text-xs text-[#6e7b6c]">Council Governance</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight mt-1">Board Console &amp; KYC Verification</h1>
                    <p className="text-xs text-[#6e7b6c]">Review tenant onboarding leases, background police verification, and ownership transfers.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006591] text-white text-xs font-bold shadow-md hover:bg-opacity-90 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">person_add</span>
                      <span>+ Invite Resident to Committee</span>
                    </button>
                    <button
                      onClick={() => showToast('Bulk KYC verified and signed digitally via Aadhaar e-Sign.', 'success')}
                      className="px-4 py-2 rounded-xl bg-[#006b2c] text-white text-xs font-bold shadow-md hover:bg-[#00873a] transition-all cursor-pointer"
                    >
                      Batch Approve Pending (3)
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 flex flex-col gap-6">
                {/* Committee Governance & Elevation Cards */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e7ff] flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#eaedff]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006591] text-2xl">shield_person</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-[#131b2e]">Active Committee Governance &amp; Resident Elevation</h2>
                          <span className="px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">Bylaw Compliant</span>
                        </div>
                        <p className="text-xs text-[#6e7b6c]">Elevate verified unit owners &amp; long-term tenants into Society Management Council roles.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#006b2c] text-white text-xs font-semibold hover:bg-[#00873a] shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">add_moderator</span>
                      <span>+ Invite Resident to Committee</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {committeeMembers.map((member, idx) => (
                      <div key={idx} className={`p-4 rounded-xl bg-[#f2f3ff] flex flex-col justify-between gap-3 border-l-4 ${member.color}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-white text-[#131b2e] font-bold flex items-center justify-center text-sm shadow-sm">
                              {member.initials}
                            </div>
                            <div>
                              <span className="font-bold text-sm text-[#131b2e] block">{member.name}</span>
                              <span className="text-xs text-[#006b2c] font-bold">{member.role}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-white text-[#6e7b6c] text-[11px] font-semibold">{member.flat}</span>
                        </div>
                        <p className="text-xs text-[#3e4a3d]">{member.notes}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-[#dae2fd]">
                          <span className="text-xs text-[#006b2c] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">verified</span> {member.status}
                          </span>
                          <button
                            onClick={() => showToast(`Governance log accessed for ${member.name}`, 'info')}
                            className="text-xs text-[#006591] hover:underline font-semibold cursor-pointer"
                          >
                            Audit Log
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conflict Alert Banner */}
                <div className="p-4 bg-[#ffdad6]/60 border-l-4 border-[#ba1a1a] rounded-2xl flex flex-col gap-3 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#ba1a1a] text-2xl mt-0.5">warning</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#93000a]">Ownership / Move-In Conflict Alert: Suite A-1204</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold">Biometrics Locked</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#c9e6ff] text-[#001e2f] text-[10px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">contact_phone</span> Follow-up In Progress
                          </span>
                        </div>
                        <p className="text-xs text-[#93000a]/90 mt-1">
                          Dual sub-lease agreement detected. Requires on-ground security guard inspection and RFID turnover verification prior to tenant activation.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const existing = securityDirectives.find((d) => d.targetUnit === 'Suite A-1204');
                          setSecurityDirectiveModal({
                            isOpen: true,
                            targetUnit: 'Suite A-1204',
                            kycId: 'kyc-1',
                            existingDirective: existing || null
                          });
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#006591] text-white rounded-xl text-xs font-bold hover:bg-opacity-90 transition-all shadow-md cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">assignment_turned_in</span>
                        <span>Assign Security Inspection Order</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const existing = securityDirectives.find((d) => d.targetUnit === 'Suite A-1204');
                          if (existing && existing.status === 'REPORT_SUBMITTED') {
                            setSecurityDirectiveModal({
                              isOpen: true,
                              targetUnit: 'Suite A-1204',
                              kycId: 'kyc-1',
                              existingDirective: existing
                            });
                          } else {
                            // Open guard verification modal or directive
                            setShowSecurityVerifModal(true);
                          }
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#131b2e] rounded-xl text-xs font-bold hover:bg-gray-100 transition-all shadow-sm border border-gray-200 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base text-[#006b2c]">description</span>
                        <span>View Guard Inspection Report</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* KYC Verification Table */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#eaedff]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#131b2e]">Pending Verification Queue</h2>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold">3 Action Required</span>
                      </div>
                      <p className="text-xs text-[#6e7b6c]">Pipeline: 1. Conflict Detected ➔ 2. Security Field Inspection Ready ➔ 3. Admin Final Access Clearance</p>
                    </div>
                    <button
                      onClick={() => setShowSecurityVerifModal(true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] text-xs font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-[#006b2c]">security</span>
                      <span>Security Inspection Console</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {kycItems.map((item) => {
                      const directive = securityDirectives.find((d) => d.targetUnit === item.suite);
                      const hasSubmittedReport = directive?.status === 'REPORT_SUBMITTED';

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-xl bg-[#f2f3ff] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                            item.approved ? 'opacity-60 bg-green-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#006b2c]/20 text-[#006b2c] font-bold flex items-center justify-center text-base">
                              {item.initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-[#131b2e]">{item.name}</span>
                                <span className="px-2 py-0.5 bg-white rounded text-[#6e7b6c] text-[11px] font-semibold">{item.type}</span>
                                <span className="text-xs font-bold text-[#006b2c]">● {item.suite}</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">
                                  {hasSubmittedReport ? 'Guard Report Ready' : item.status}
                                </span>
                              </div>
                              <span className="text-xs text-[#6e7b6c] block mt-1">{item.docs}</span>
                              <div className="text-[11px] text-[#6e7b6c] flex items-center gap-2 mt-1">
                                <span>Field Guard: {item.guard}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSecurityDirectiveModal({
                                      isOpen: true,
                                      targetUnit: item.suite,
                                      kycId: item.id,
                                      existingDirective: directive || null
                                    });
                                  }}
                                  className="text-[#006b2c] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-xs">visibility</span>
                                  {hasSubmittedReport ? 'Read Guard Report & Clearance' : 'View / Edit Directive'}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* If Access Already Granted */}
                            {item.approved || directive?.status === 'ACCESS_GRANTED' || directive?.fieldReport?.accessGranted ? (
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-bold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm text-emerald-700">verified</span>
                                  <span>Access Given by Security Guard</span>
                                </span>
                              </div>
                            ) : (
                              <>
                                {/* Dispatched vs Not Dispatched */}
                                {directive ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSecurityDirectiveModal({
                                        isOpen: true,
                                        targetUnit: item.suite,
                                        kycId: item.id,
                                        existingDirective: directive
                                      });
                                    }}
                                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-xs">hourglass_top</span>
                                    <span>Dispatched to Gate 1 (View Order)</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleFollowupToSecurity(item)}
                                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer animate-pulse active:scale-95"
                                  >
                                    <span className="material-symbols-outlined text-sm">forward_to_inbox</span>
                                    <span>Follow up to Security (Gate 1)</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleApproveKYC(item.id, item.name)}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer bg-[#006b2c] text-white hover:bg-[#00873a]"
                                >
                                  <span className="material-symbols-outlined text-sm">key</span>
                                  <span>President Bypass Access</span>
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => showToast(`Rejection memo sent to ${item.name}`, 'error')}
                              className="px-3 py-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl text-xs font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GATE PASSES & VISITOR STREAM (REDESIGNED) */}
          {activeTab === 'gate' && (
            <div>
              {/* Header */}
              <div className="px-8 py-6 bg-white border-b border-[#eaedff] shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold uppercase tracking-wider">
                        Gate 1 ANPR &amp; Access Control
                      </span>
                      <span className="text-[#6e7b6c]">•</span>
                      <span className="text-xs text-[#006b2c] font-bold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span>
                        Live Security Gate Synchronized
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight mt-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600">badge</span>
                      <span>Digital Gate Passes &amp; Visitor Stream</span>
                    </h1>
                    <p className="text-xs text-[#6e7b6c]">
                      Surveillance register and pass issuance for guests, delivery riders (Zomato/Swiggy/Amazon), cabs, and contractor AMC crews.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowHowPassWorks(!showHowPassWorks)}
                      className="px-3.5 py-2 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm text-blue-600">help_outline</span>
                      <span>{showHowPassWorks ? 'Hide Pass Guide' : 'How Pass Works'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCreateGatePassModal(true)}
                      className="px-4 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span>Issue New Digital Gate Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSimulateGateScan}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                      <span>Simulate QR Scan</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 flex flex-col gap-6">
                {/* Visual Step-by-Step "How Gate Pass Works" Explainer */}
                {showHowPassWorks && (
                  <div className="p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-emerald-50/50 rounded-2xl border border-blue-200/80 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-blue-200/60 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                          i
                        </span>
                        <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                          How Society Digital Gate Passes Work (From Request to Exit)
                        </h3>
                      </div>
                      <span className="text-[11px] text-blue-800 font-semibold">
                        Instant Security Clearance System
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                        <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-950">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">1</span>
                          <span>1. Pass Issued</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Resident or Admin creates pass with visitor name, phone, vehicle plate, and host flat.
                        </p>
                      </div>

                      <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                        <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-950">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">2</span>
                          <span>2. QR &amp; 4-Digit OTP</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          System generates encrypted QR badge and 4-digit numeric code sent to visitor's phone.
                        </p>
                      </div>

                      <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                        <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-950">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">3</span>
                          <span>3. Gate 1 Verification</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Guard Havaldar Ram Singh verifies OTP or scans QR code at Gate 1 terminal.
                        </p>
                      </div>

                      <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                        <div className="flex items-center gap-2 mb-1 text-xs font-bold text-emerald-900">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">4</span>
                          <span>4. Barrier Lift &amp; Log</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Barrier opens. Live timer monitors stay duration; overstay alert fires if &gt;4 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4 Statistical Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6e7b6c] uppercase font-bold tracking-wider">Active On-Site (Inside)</span>
                      <span className="block text-2xl font-black text-[#006591] mt-0.5">
                        {visitorPasses.filter(p => p.status === 'INSIDE').length} On-Premises
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">badge</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6e7b6c] uppercase font-bold tracking-wider">Pre-Approved (Expected)</span>
                      <span className="block text-2xl font-black text-emerald-600 mt-0.5">
                        {visitorPasses.filter(p => p.status === 'APPROVED').length} Scheduled
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">schedule</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6e7b6c] uppercase font-bold tracking-wider">Delivery Couriers</span>
                      <span className="block text-2xl font-black text-amber-600 mt-0.5">
                        {visitorPasses.filter(p => p.visitorType === 'DELIVERY').length} Today
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">local_shipping</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6e7b6c] uppercase font-bold tracking-wider">Overstay Triggers (&gt;4 hrs)</span>
                      <span className="block text-2xl font-black text-rose-600 mt-0.5">
                        {visitorPasses.filter(p => p.overstayTrigger).length} Flagged
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">warning</span>
                    </div>
                  </div>
                </div>

                {/* Filter and View Mode Toolbar */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { key: 'ALL', label: 'All Passes', count: visitorPasses.length },
                      { key: 'GUEST', label: 'Guests & Friends', count: visitorPasses.filter(p => p.visitorType === 'GUEST').length },
                      { key: 'DELIVERY', label: 'Deliveries', count: visitorPasses.filter(p => p.visitorType === 'DELIVERY').length },
                      { key: 'CAB', label: 'Cabs & Taxis', count: visitorPasses.filter(p => p.visitorType === 'CAB').length },
                      { key: 'CONTRACTOR', label: 'Contractors / Staff', count: visitorPasses.filter(p => p.visitorType === 'CONTRACTOR' || p.visitorType === 'SERVICE').length },
                      { key: 'OVERSTAY', label: '⚠️ Overstay Alerts', count: visitorPasses.filter(p => p.overstayTrigger).length },
                    ].map(f => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setGatePassFilter(f.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          gatePassFilter === f.key
                            ? 'bg-[#131b2e] text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <span>{f.label}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          gatePassFilter === f.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {f.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search and Layout Toggle */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="material-symbols-outlined text-gray-400 text-sm absolute left-3 top-2.5">search</span>
                      <input
                        type="text"
                        placeholder="Search name, flat, vehicle, OTP..."
                        value={gatePassSearch}
                        onChange={(e) => setGatePassSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 w-56"
                      />
                    </div>

                    <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setGatePassViewMode('CARDS')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                          gatePassViewMode === 'CARDS' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">grid_view</span>
                        <span className="hidden sm:inline">Pass Badges</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGatePassViewMode('TABLE')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                          gatePassViewMode === 'TABLE' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">table_rows</span>
                        <span className="hidden sm:inline">Register Table</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Pass Presentation: CARDS OR TABLE */}
                {(() => {
                  const filteredPasses = visitorPasses.filter(p => {
                    if (gatePassFilter === 'GUEST' && p.visitorType !== 'GUEST') return false;
                    if (gatePassFilter === 'DELIVERY' && p.visitorType !== 'DELIVERY') return false;
                    if (gatePassFilter === 'CAB' && p.visitorType !== 'CAB') return false;
                    if (gatePassFilter === 'CONTRACTOR' && p.visitorType !== 'CONTRACTOR' && p.visitorType !== 'SERVICE') return false;
                    if (gatePassFilter === 'OVERSTAY' && !p.overstayTrigger) return false;

                    if (gatePassSearch.trim()) {
                      const q = gatePassSearch.toLowerCase();
                      const matchName = p.guestName?.toLowerCase().includes(q);
                      const matchUnit = p.hostUnit?.toLowerCase().includes(q);
                      const matchVehicle = p.vehicleNo?.toLowerCase().includes(q);
                      const matchOtp = p.otpCode?.toLowerCase().includes(q);
                      const matchId = String(p.id).toLowerCase().includes(q);
                      const matchCompany = p.company?.toLowerCase().includes(q);
                      return matchName || matchUnit || matchVehicle || matchOtp || matchId || matchCompany;
                    }
                    return true;
                  });

                  if (filteredPasses.length === 0) {
                    return (
                      <div className="bg-white rounded-2xl p-12 text-center border border-[#eaedff]">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">badge</span>
                        <p className="text-sm font-semibold text-gray-700">No gate passes found matching your filter</p>
                        <p className="text-xs text-gray-400 mt-1">Try changing the category filter or searching for another term.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setGatePassFilter('ALL');
                            setGatePassSearch('');
                          }}
                          className="mt-3 px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200 cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    );
                  }

                  if (gatePassViewMode === 'CARDS') {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredPasses.map(pass => (
                          <DigitalGatePassCard
                            key={pass.id}
                            pass={pass}
                            onViewDetails={(p) => setSelectedPassForModal(p)}
                            onCheckout={(id) => handleCheckoutGatePass(id)}
                          />
                        ))}
                      </div>
                    );
                  }

                  return (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                          <span>Gate Barrier Operations Register</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
                            {filteredPasses.length} Records
                          </span>
                        </h2>
                        <span className="text-xs font-semibold text-[#006b2c] flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span> Streaming Live ANPR
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#eaedff] text-[#6e7b6c] uppercase tracking-wider bg-[#f2f3ff]">
                              <th className="py-3 px-4 font-bold">Pass ID &amp; OTP</th>
                              <th className="py-3 px-4 font-bold">Visitor &amp; Vehicle</th>
                              <th className="py-3 px-4 font-bold">Category</th>
                              <th className="py-3 px-4 font-bold">Host Unit</th>
                              <th className="py-3 px-4 font-bold">Status</th>
                              <th className="py-3 px-4 font-bold">Validity</th>
                              <th className="py-3 px-4 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#eaedff]">
                            {filteredPasses.map((pass) => {
                              const isInside = pass.status === 'INSIDE';
                              return (
                                <tr
                                  key={pass.id}
                                  className={`hover:bg-[#f2f3ff] transition-colors ${pass.overstayTrigger ? 'bg-rose-50/50' : ''}`}
                                >
                                  <td className="py-3 px-4">
                                    <div className="font-mono font-bold text-blue-900">#{pass.id}</div>
                                    <span className="inline-block font-mono text-[10px] font-extrabold bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200 mt-0.5">
                                      OTP: {pass.otpCode}
                                    </span>
                                  </td>

                                  <td className="py-3 px-4">
                                    <div className="font-bold text-[#131b2e]">{pass.guestName}</div>
                                    <div className="text-[11px] text-[#6e7b6c] font-mono">
                                      {pass.vehicleNo || 'Walk-in (No Vehicle)'}
                                    </div>
                                  </td>

                                  <td className="py-3 px-4">
                                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-[10px] font-bold">
                                      {pass.visitorType} {pass.company ? `• ${pass.company}` : ''}
                                    </span>
                                  </td>

                                  <td className="py-3 px-4 font-semibold text-[#131b2e]">
                                    {pass.hostUnit}
                                  </td>

                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      pass.overstayTrigger
                                        ? 'bg-rose-600 text-white'
                                        : isInside
                                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                        : pass.status === 'EXITED'
                                        ? 'bg-gray-100 text-gray-600'
                                        : 'bg-emerald-100 text-emerald-900'
                                    }`}>
                                      {pass.overstayTrigger ? '⚠️ OVERSTAY >4h' : pass.status}
                                    </span>
                                  </td>

                                  <td className="py-3 px-4 text-gray-600 text-[11px]">
                                    <div>{pass.validDuration || 'Active Pass'}</div>
                                    <div className="text-[10px] text-gray-400 font-mono">In: {pass.checkInTime || 'Scheduled'}</div>
                                  </td>

                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedPassForModal(pass)}
                                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined text-xs">badge</span>
                                        <span>View Slip</span>
                                      </button>

                                      {isInside && (
                                        <button
                                          type="button"
                                          onClick={() => handleCheckoutGatePass(pass.id)}
                                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition cursor-pointer shadow-2xs"
                                        >
                                          Checkout
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 4: MAINTENANCE & SLA COMMAND CENTER */}
          {activeTab === 'maintenance' && (
            <div>
              {/* Header */}
              <div className="px-8 py-6 bg-white border-b border-[#eaedff] shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold uppercase tracking-wide">
                        MEP &amp; Asset Operations
                      </span>
                      <span className="text-[#6e7b6c]">•</span>
                      <span className="text-xs text-[#006b2c] font-bold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span>
                        Live SLA Dispatch Engine
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight mt-1">Maintenance &amp; SLA Operations</h1>
                    <p className="text-xs text-[#6e7b6c]">Executive supervision of estate assets, elevator AMC contracts, power backup generators, and contractor SLA restoral timers.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showToast('Preventive maintenance compliance report generated.', 'info')}
                      className="px-3.5 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">assessment</span>
                      <span>SLA Compliance Audit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateWorkOrderModal(true)}
                      className="px-4 py-2 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">add_circle</span>
                      <span>+ Create Work Order</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 flex flex-col gap-6">
                {/* Executive SLA Performance Metrics Gauges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#6e7b6c] tracking-wider">Contractual SLA Adherence</span>
                      <span className="p-1.5 rounded-lg bg-[#7ffc97]/30 text-[#006b2c]">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#006b2c]">98.2%</span>
                        <span className="text-xs text-[#006b2c] font-bold">Compliant</span>
                      </div>
                      <p className="text-[11px] text-[#6e7b6c] mt-0.5">Benchmark &gt;95.0% • 0 Breaches this month</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#ba1a1a] tracking-wider">Active P1 Critical Alerts</span>
                      <span className="p-1.5 rounded-lg bg-[#ffdad6] text-[#ba1a1a]">
                        <span className="material-symbols-outlined text-sm animate-bounce">warning</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#ba1a1a]">
                          {tickets.filter((t) => !t.resolved && (t.urgency.includes('CRITICAL') || t.urgency.includes('P1'))).length}
                        </span>
                        <span className="text-xs text-[#ba1a1a] font-bold">Requiring Urgency</span>
                      </div>
                      <p className="text-[11px] text-[#6e7b6c] mt-0.5">Otis Lift #2, Fire Line &amp; STP Aeration</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#6e7b6c] tracking-wider">Mean Time to Resolution</span>
                      <span className="p-1.5 rounded-lg bg-[#c9e6ff] text-[#001e2f]">
                        <span className="material-symbols-outlined text-sm">speed</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#006591]">42 mins</span>
                        <span className="text-xs text-[#006591] font-bold">MTTR</span>
                      </div>
                      <p className="text-[11px] text-[#6e7b6c] mt-0.5">26m faster than FY24 Q2 average</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#6e7b6c] tracking-wider">Preventive Maintenance</span>
                      <span className="p-1.5 rounded-lg bg-[#ffddb8] text-[#825100]">
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#131b2e]">100%</span>
                        <span className="text-xs text-[#006b2c] font-bold">12/12 Audits</span>
                      </div>
                      <p className="text-[11px] text-[#6e7b6c] mt-0.5">Lifts, DG, STP &amp; Fire Pumps certified</p>
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col gap-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Search Field */}
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                      <input
                        type="text"
                        placeholder="Search work order ID, equipment asset, tower, or contractor (e.g., Lift #2, Otis, Fire)..."
                        value={maintenanceSearchQuery}
                        onChange={(e) => setMaintenanceSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] rounded-xl text-xs font-semibold text-[#131b2e] border border-transparent focus:border-[#006b2c] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    {/* Urgency Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                      {[
                        { key: 'all', label: `All (${tickets.length})` },
                        { key: 'critical', label: `🚨 P1 Critical (${tickets.filter((t) => t.urgency.includes('CRITICAL')).length})` },
                        { key: 'urgent', label: `⚠️ P2 Urgent (${tickets.filter((t) => t.urgency.includes('URGENT') || t.urgency.includes('MEDIUM')).length})` },
                        { key: 'scheduled', label: `🗓️ Scheduled PM (${tickets.filter((t) => t.urgency.includes('SCHEDULED') || t.urgency.includes('ROUTINE')).length})` },
                        { key: 'resolved', label: `✓ Resolved (${tickets.filter((t) => t.resolved).length})` }
                      ].map((pill) => (
                        <button
                          key={pill.key}
                          type="button"
                          onClick={() => setMaintenancePriorityFilter(pill.key)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                            maintenancePriorityFilter === pill.key
                              ? 'bg-[#006b2c] text-white shadow-sm'
                              : 'bg-[#f2f3ff] text-[#6e7b6c] hover:bg-[#e2e7ff]'
                          }`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#eaedff]">
                    <span className="text-[11px] font-bold text-[#6e7b6c] mr-1">Domain:</span>
                    {[
                      { key: 'all', label: 'All Domains' },
                      { key: 'lifts', label: '🛗 Elevators & Lifts' },
                      { key: 'water', label: '💧 Water STP & WTP' },
                      { key: 'electrical', label: '⚡ Power & DG Panels' },
                      { key: 'fire', label: '🧯 Fire & Life Safety' },
                      { key: 'hvac', label: '❄️ HVAC & Cooling' },
                      { key: 'civil', label: '🏗️ Civil & Plumbing' }
                    ].map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setMaintenanceCategoryFilter(c.key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                          maintenanceCategoryFilter === c.key
                            ? 'bg-[#131b2e] text-white'
                            : 'bg-white text-[#6e7b6c] border border-[#eaedff] hover:bg-gray-100'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Work Orders List */}
                <div className="flex flex-col gap-4">
                  {tickets
                    .filter((ticket) => {
                      // Category filter
                      if (maintenanceCategoryFilter !== 'all' && !ticket.cat.includes(maintenanceCategoryFilter)) {
                        return false;
                      }
                      // Priority filter
                      if (maintenancePriorityFilter === 'critical') {
                        if (!ticket.urgency.includes('CRITICAL')) return false;
                      } else if (maintenancePriorityFilter === 'urgent') {
                        if (!ticket.urgency.includes('URGENT') && !ticket.urgency.includes('MEDIUM')) return false;
                      } else if (maintenancePriorityFilter === 'scheduled') {
                        if (!ticket.urgency.includes('SCHEDULED') && !ticket.urgency.includes('ROUTINE')) return false;
                      } else if (maintenancePriorityFilter === 'resolved') {
                        if (!ticket.resolved) return false;
                      }
                      // Search query
                      if (maintenanceSearchQuery) {
                        const q = maintenanceSearchQuery.toLowerCase();
                        const matchTitle = ticket.title.toLowerCase().includes(q);
                        const matchId = ticket.id.toLowerCase().includes(q);
                        const matchAssigned = ticket.assigned.toLowerCase().includes(q);
                        const matchLocation = ticket.location?.toLowerCase().includes(q);
                        if (!matchTitle && !matchId && !matchAssigned && !matchLocation) return false;
                      }
                      return true;
                    })
                    .map((ticket) => {
                      const isCritical = ticket.urgency.includes('CRITICAL');
                      const isUrgent = ticket.urgency.includes('URGENT') || ticket.urgency.includes('MEDIUM');

                      return (
                        <div
                          key={ticket.id}
                          className={`p-5 rounded-2xl bg-white shadow-sm border transition-all ${
                            ticket.resolved
                              ? 'border-l-4 border-l-[#006b2c] border-[#eaedff] bg-gray-50/50'
                              : isCritical
                              ? 'border-l-4 border-l-[#ba1a1a] border-[#ffdad6]'
                              : isUrgent
                              ? 'border-l-4 border-l-[#825100] border-[#eaedff]'
                              : 'border-l-4 border-l-[#006591] border-[#eaedff]'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Left details */}
                            <div className="flex items-start gap-3.5 flex-1">
                              <div
                                className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${
                                  ticket.resolved
                                    ? 'bg-[#7ffc97]/30 text-[#006b2c]'
                                    : isCritical
                                    ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                    : isUrgent
                                    ? 'bg-[#ffddb8] text-[#825100]'
                                    : 'bg-[#c9e6ff] text-[#001e2f]'
                                }`}
                              >
                                <span className="material-symbols-outlined text-2xl">{ticket.icon}</span>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-mono font-bold text-gray-500">{ticket.id}</span>
                                  <h3 className="text-sm font-bold text-[#131b2e]">{ticket.title}</h3>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      ticket.resolved
                                        ? 'bg-[#7ffc97] text-[#002109]'
                                        : isCritical
                                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                        : isUrgent
                                        ? 'bg-[#ffddb8] text-[#825100]'
                                        : 'bg-[#c9e6ff] text-[#001e2f]'
                                    }`}
                                  >
                                    {ticket.resolved ? 'RESOLVED ✓' : ticket.urgency}
                                  </span>
                                  {ticket.location && (
                                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                                      {ticket.location}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-[#6e7b6c] mt-1.5">{ticket.assigned}</p>

                                {/* Progress & Countdown Bar */}
                                {!ticket.resolved && (
                                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                                    <div className="flex-1 max-w-xs">
                                      <div className="flex items-center justify-between text-[11px] mb-1">
                                        <span className="text-[#6e7b6c] font-medium">Work Order Progress</span>
                                        <span className="font-bold text-[#131b2e]">{ticket.progress || 50}%</span>
                                      </div>
                                      <div className="w-full bg-[#f2f3ff] rounded-full h-2 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all ${
                                            isCritical ? 'bg-[#ba1a1a]' : 'bg-[#006b2c]'
                                          }`}
                                          style={{ width: `${ticket.progress || 50}%` }}
                                        ></div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                                          isCritical
                                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                            : 'bg-[#c9e6ff] text-[#001e2f]'
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-xs">timer</span>
                                        <span>{ticket.sla}</span>
                                      </span>
                                      {ticket.cost && (
                                        <span className="text-[11px] text-[#6e7b6c] font-medium">
                                          {ticket.cost}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right Action buttons */}
                            <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#eaedff]">
                              {ticket.techPhone && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(ticket.techPhone);
                                    showToast(`Dialing contractor supervisor at ${ticket.techPhone}`, 'info');
                                  }}
                                  className="px-3 py-1.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">call</span>
                                  <span>Call Tech</span>
                                </button>
                              )}

                              {ticket.resolved ? (
                                <button
                                  type="button"
                                  onClick={() => setResolveTicketModal({ isOpen: true, ticket })}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#7ffc97]/40 text-[#002109] hover:bg-[#7ffc97] transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">verified</span>
                                  <span>Resolved ✓ (View Log)</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setResolveTicketModal({ isOpen: true, ticket })}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#006b2c] text-white hover:bg-[#00873a] shadow-sm transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">task_alt</span>
                                  <span>Mark Resolved</span>
                                </button>
                              )}

                              {!ticket.resolved && (
                                <button
                                  type="button"
                                  onClick={() => setEscalateTicketModal({ isOpen: true, ticket })}
                                  className="px-3 py-1.5 bg-[#f2f3ff] text-gray-700 hover:bg-[#ffdad6] hover:text-[#ba1a1a] rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">priority_high</span>
                                  <span>Escalate</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}


          {/* TAB 5: FEED */}
          {activeTab === 'feed' && (
            <div>
              <div className="px-8 py-6 bg-white border-b border-[#eaedff] shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold uppercase">
                        Resident Engagement
                      </span>
                      <span className="text-[#6e7b6c]">•</span>
                      <span className="text-xs text-[#6e7b6c]">Notices &amp; Voting</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight mt-1">Community Feed &amp; Circulars</h1>
                    <p className="text-xs text-[#6e7b6c]">Publish official estate circulars, gather resident consensus via polls, and post advisories.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewNoticeModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">campaign</span>
                    <span>+ Post Official Notice</span>
                  </button>
                </div>
              </div>

              <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 flex flex-col gap-4">
                  {/* Poll */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#006b2c]/20 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#006b2c] text-xl">how_to_vote</span>
                        <span className="text-sm font-bold text-[#131b2e]">MC Resident Poll #2024-04</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">Ends in 2 days</span>
                    </div>
                    <h3 className="text-base font-bold text-[#131b2e]">
                      Should we install 25 additional 22kW EV charging bays across Basements 1 &amp; 2?
                    </h3>
                    <p className="text-xs text-[#6e7b6c]">
                      Estimated capital expenditure ₹14.5L sourced from Sinking Fund reserve with zero monthly levy hike.
                    </p>

                    {pollVoted ? (
                      <div className="p-3 bg-[#7ffc97]/30 rounded-xl flex items-center gap-2 text-[#005320] font-bold text-xs">
                        <span className="material-symbols-outlined">how_to_reg</span>
                        <span>Your vote for "{pollVoted}" has been recorded on the verified ledger.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setPollVoted('Yes, Approve Solar-tied Chargers');
                            showToast('Vote confirmed & cast!', 'success');
                          }}
                          className="w-full text-left p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#006b2c]/10 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-xs font-semibold text-[#131b2e]">A) Yes, Approve Solar-tied Chargers</span>
                          <span className="text-xs text-[#006b2c] font-bold">78% (142 votes)</span>
                        </button>
                        <button
                          onClick={() => {
                            setPollVoted('No, Defer to AGM 2025');
                            showToast('Vote confirmed & cast!', 'success');
                          }}
                          className="w-full text-left p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#006b2c]/10 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-xs font-semibold text-[#131b2e]">B) No, Defer to AGM 2025</span>
                          <span className="text-xs text-[#6e7b6c] font-bold">22% (40 votes)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Community Posts & Bulletins */}
                  <div className="flex flex-col gap-4">
                    {[...communityPosts]
                      .sort((a, b) => ((b.isPinned || b.pinned ? 1 : 0) - (a.isPinned || a.pinned ? 1 : 0)))
                      .map((post) => {
                        const isCommentsOpen = openComments[post.id] ?? true;
                        const commentsList = post.comments || [];

                        return (
                          <div
                            key={post.id}
                            className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                              post.isPinned
                                ? 'border-2 border-[#006b2c] bg-gradient-to-b from-[#f8fdf9] to-white shadow-md'
                                : 'border-[#eaedff]'
                            } flex flex-col gap-3`}
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    post.category === 'SECURITY'
                                      ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                      : post.category === 'MAINTENANCE'
                                      ? 'bg-[#ffddb8] text-[#825100]'
                                      : post.category === 'EVENT'
                                      ? 'bg-[#c9e6ff] text-[#001e2f]'
                                      : 'bg-[#7ffc97] text-[#002109]'
                                  }`}
                                >
                                  {post.category || 'NOTICE'}
                                </span>
                                {post.isPinned && (
                                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#006b2c] text-white text-[10px] font-bold shadow-sm">
                                    <span className="material-symbols-outlined text-[13px]">push_pin</span>
                                    <span>Pinned to Top</span>
                                  </span>
                                )}
                                <span className="text-[11px] text-[#6e7b6c]">
                                  • {post.time || 'Recently'} • <strong className="text-[#131b2e]">{post.author}</strong>
                                </span>
                              </div>

                              {/* Admin Moderation Actions */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePin(post.id)}
                                  title={post.isPinned ? 'Unpin this circular from top' : 'Pin this circular to top of resident feed'}
                                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    post.isPinned
                                      ? 'bg-[#006b2c] text-white hover:bg-[#00873a] shadow-sm'
                                      : 'bg-[#f2f3ff] text-[#6e7b6c] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-sm">push_pin</span>
                                  <span>{post.isPinned ? 'Pinned ✓' : 'Pin to Top'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeletePostModal({
                                      isOpen: true,
                                      postId: post.id,
                                      reason: 'Spam / Commercial promotion'
                                    })
                                  }
                                  title="Delete bulletin as Estate President"
                                  className="p-1.5 rounded-xl text-xs text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              </div>
                            </div>

                            <h2 className="text-base font-bold text-[#131b2e]">{post.title}</h2>
                            <p className="text-xs text-[#3e4a3d] leading-relaxed whitespace-pre-line">{post.content}</p>

                            {/* Engagement toolbar */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#eaedff] text-xs text-[#6e7b6c]">
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => showToast('Appreciated notice.', 'info')}
                                  className="flex items-center gap-1 hover:text-[#006b2c] cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-base">favorite</span>
                                  <span>{post.likes || 12} Likes</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleComments(post.id)}
                                  className="flex items-center gap-1.5 text-[#006b2c] font-bold hover:underline cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-base">chat_bubble</span>
                                  <span>{commentsList.length} Comments</span>
                                  <span className="material-symbols-outlined text-sm">
                                    {isCommentsOpen ? 'expand_less' : 'expand_more'}
                                  </span>
                                </button>
                              </div>

                              {post.tags && (
                                <div className="flex items-center gap-1.5">
                                  {post.tags.map((t, idx) => (
                                    <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* FULL EXPANDED COMMENTS THREAD */}
                            {isCommentsOpen && (
                              <div className="mt-3 -mx-6 -mb-6 p-5 bg-[#f8f9ff] border-t border-[#eaedff] rounded-b-2xl flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm text-[#006b2c]">forum</span>
                                    <span>Resident Discussion &amp; Official Responses ({commentsList.length})</span>
                                  </span>
                                  <span className="text-[10px] text-[#6e7b6c]">Official MC Verification Active</span>
                                </div>

                                {/* Comments List */}
                                <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                                  {commentsList.length === 0 ? (
                                    <div className="p-3 text-center bg-white rounded-xl border border-[#eaedff] text-xs text-[#6e7b6c]">
                                      No comments yet on this circular. Use the response box below to post an official update.
                                    </div>
                                  ) : (
                                    commentsList.map((c, idx) => {
                                      const isAdmin = c.role === 'COMMUNITY_ADMIN' || c.author?.toLowerCase().includes('president');

                                      return (
                                        <div
                                          key={c.id || idx}
                                          className={`p-3 rounded-xl text-xs border ${
                                            isAdmin
                                              ? 'bg-[#edf9f0] border-[#7ffc97] shadow-xs'
                                              : 'bg-white border-[#eaedff]'
                                          }`}
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                              <span className="font-bold text-[#131b2e]">{c.author}</span>
                                              {c.unit && (
                                                <span className="text-[10px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded">
                                                  {c.unit}
                                                </span>
                                              )}
                                              {isAdmin && (
                                                <span className="px-2 py-0.5 rounded-full bg-[#006b2c] text-white text-[9px] font-bold flex items-center gap-1">
                                                  <span className="material-symbols-outlined text-[10px]">verified</span>
                                                  Official MC Response
                                                </span>
                                              )}
                                            </div>
                                            <span className="text-[10px] text-[#6e7b6c]">{c.time || 'Today'}</span>
                                          </div>
                                          <p className="text-[#3e4a3d] leading-normal">{c.text}</p>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>

                                {/* President Quick Response Chips */}
                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                  <span className="text-[10px] font-bold text-[#6e7b6c]">Quick Board Reply:</span>
                                  {[
                                    '✓ Acknowledged & noted by Management Committee.',
                                    '🔧 Dispatched to Asset Tech & AMC Engineer for restoral.',
                                    '📋 Added to upcoming Board & AGM Agenda.',
                                    '👮 Security Supervisor dispatched for on-site inspection.'
                                  ].map((chip, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => handleAddComment(post.id, chip)}
                                      className="px-2 py-1 rounded-lg bg-white border border-[#eaedff] text-[10px] font-medium text-[#006b2c] hover:bg-[#006b2c] hover:text-white transition-colors cursor-pointer shadow-2xs"
                                    >
                                      {chip.split(' ')[0]} {chip.slice(2, 28)}...
                                    </button>
                                  ))}
                                </div>

                                {/* Comment Input Box */}
                                <div className="flex items-center gap-2 pt-1">
                                  <input
                                    type="text"
                                    placeholder="Write an official response as Elena Rostova (Estate President)..."
                                    value={commentInputs[post.id] || ''}
                                    onChange={(e) =>
                                      setCommentInputs((prev) => ({
                                        ...prev,
                                        [post.id]: e.target.value
                                      }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddComment(post.id);
                                      }
                                    }}
                                    className="flex-1 px-3.5 py-2 bg-white rounded-xl text-xs font-medium text-[#131b2e] border border-[#eaedff] focus:outline-none focus:border-[#006b2c]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddComment(post.id)}
                                    className="px-4 py-2 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1 shrink-0"
                                  >
                                    <span className="material-symbols-outlined text-sm">send</span>
                                    <span>Reply</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-[#131b2e]">Community Guidelines</h3>
                    <ul className="text-xs text-[#6e7b6c] space-y-2 list-disc list-inside">
                      <li>Quiet hours observed between 10:30 PM – 6:30 AM.</li>
                      <li>Commercial photography in clubhouse requires prior MC permit.</li>
                      <li>Pet leashes mandatory inside tower lobbies &amp; high-speed lifts.</li>
                    </ul>
                    <button
                      onClick={() => showToast('Full Bye-Laws PDF sent to registered email.', 'info')}
                      className="text-[#006b2c] text-xs font-bold text-left hover:underline cursor-pointer pt-1"
                    >
                      Download Bye-Laws (PDF) →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DUES */}
          {activeTab === 'dues' && (
            <div>
              <div className="px-8 py-6 bg-white border-b border-[#eaedff] shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c9e6ff] text-[#001e2f] text-[10px] font-bold uppercase">
                        Financial Management
                      </span>
                      <span className="text-[#6e7b6c]">•</span>
                      <span className="text-xs text-[#6e7b6c]">Billing Ledger</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight mt-1">Society Dues &amp; Billing Ledger</h1>
                    <p className="text-xs text-[#6e7b6c]">Track collection inflows, sinking funds, penalty accruals, and dispatch payment reminders.</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setTreasuryPaymentModal({ isOpen: true, mode: 'RECORD_UNIT_PAYMENT' })}
                      className="px-4 py-2 bg-white text-[#006b2c] border border-[#006b2c] hover:bg-[#006b2c]/10 rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">receipt_long</span>
                      <span>Record Inflow Payment</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTreasuryPaymentModal({ isOpen: true, mode: 'WITHDRAW_DISBURSE' })}
                      className="px-4 py-2 bg-[#006591] text-white hover:bg-opacity-90 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">payments</span>
                      <span>Disburse Outflow</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('WhatsApp reminder links generated for all 18 overdue accounts.', 'success')}
                      className="px-4 py-2 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">send_to_mobile</span>
                      <span>Broadcast Reminders (18)</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 flex flex-col gap-6">
                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#6e7b6c]">Total Billed (H1 FY25)</span>
                    <span className="text-2xl font-bold text-[#131b2e] mt-1">₹46,20,000</span>
                    <span className="text-xs text-[#006b2c] font-bold mt-1">₹42,80,000 Collected (92.6%)</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#6e7b6c]">Total Overdue Defaulters</span>
                    <span className="text-2xl font-bold text-[#ba1a1a] mt-1">₹3,40,000</span>
                    <span className="text-xs text-[#ba1a1a] font-bold mt-1">18 Flats with &gt;30 days default</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#6e7b6c]">Society Operating Bank (HDFC)</span>
                    <span className="text-2xl font-bold text-[#006591] mt-1">
                      ₹{treasuryData?.accounts?.societyOperatingAccount?.toLocaleString('en-IN') || '42,80,000'}
                    </span>
                    <span className="text-xs text-[#006591] font-bold mt-1">Primary Disbursement Account</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#6e7b6c]">Cash In Office Vault</span>
                    <span className="text-2xl font-bold text-[#825100] mt-1">
                      ₹{treasuryData?.accounts?.cashVault?.toLocaleString('en-IN') || '1,45,000'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTreasuryPaymentModal({ isOpen: true, mode: 'DEPOSIT_CASH' })}
                      className="text-xs text-[#825100] font-bold mt-1 hover:underline text-left cursor-pointer flex items-center gap-1"
                    >
                      <span>Deposit Cash to Bank →</span>
                    </button>
                  </div>
                </div>

                {/* Society Treasury Outflows & Vendor Payments Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#131b2e]">Upcoming Vendor &amp; Utility Invoices (Authorized Signatory: Elena Rostova)</h2>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold">
                          {treasuryData?.pendingUtilityBills?.filter((b) => b.status === 'PENDING')?.length || 4} Pending Approval
                        </span>
                      </div>
                      <p className="text-xs text-[#6e7b6c]">Disburse utility bills, contract vendor retainers, and operational staff payroll directly from verified bank accounts.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(treasuryData?.pendingUtilityBills || [
                      { id: 'util-1', vendor: 'TSSPDCL Grid Electricity', category: 'Electricity', amount: 142800, dueDate: '25th of this month', status: 'PENDING' },
                      { id: 'util-2', vendor: 'HMWS&SB Water Tanker Operations', category: 'Water', amount: 68500, dueDate: '28th of this month', status: 'PENDING' },
                      { id: 'util-3', vendor: 'Otis Elevators Comprehensive AMC', category: 'Lift AMC', amount: 85000, dueDate: '30th of this month', status: 'PENDING' },
                      { id: 'util-4', vendor: 'G4S Security Agency Force', category: 'Security Staff', amount: 195000, dueDate: '01st of next month', status: 'PENDING' }
                    ]).map((bill) => {
                      const isPaid = bill.status === 'PAID';

                      return (
                        <div key={bill.id} className="p-4 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff] flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white text-gray-700">{bill.category}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPaid ? 'bg-[#7ffc97] text-[#002109]' : 'bg-[#ffdad6] text-[#ba1a1a]'}`}>
                                {bill.status}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm text-[#131b2e] mt-2">{bill.vendor}</h3>
                            <span className="text-xs text-[#6e7b6c] block mt-0.5">Due: {bill.dueDate}</span>
                            <span className="text-lg font-bold text-[#131b2e] block mt-2">₹{bill.amount?.toLocaleString('en-IN')}</span>
                          </div>

                          <button
                            type="button"
                            disabled={isPaid}
                            onClick={() => {
                              setTreasuryPaymentModal({
                                isOpen: true,
                                mode: 'PAY_UTILITY_BILL',
                                billData: bill
                              });
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                              isPaid
                                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                : 'bg-[#006b2c] text-white hover:bg-[#00873a]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">{isPaid ? 'check_circle' : 'account_balance'}</span>
                            <span>{isPaid ? 'Paid & Audited ✓' : 'Authorize NetBanking Pay'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 30+ Days Arrears Ledger */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#131b2e]">30+ Days Arrears &amp; Defaulters Ledger</h2>
                      <span className="text-xs text-[#6e7b6c]">Ordered by Aging Duration • Instant Payment Settlement enabled</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTreasuryPaymentModal({ isOpen: true, mode: 'RECORD_UNIT_PAYMENT' })}
                      className="px-3 py-1.5 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#006b2c] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span>Record Custom Unit Payment</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#eaedff] text-[#6e7b6c] uppercase tracking-wider bg-[#f2f3ff]">
                          <th className="py-3 px-4 font-bold">Suite No.</th>
                          <th className="py-3 px-4 font-bold">Resident Name</th>
                          <th className="py-3 px-4 font-bold">Unpaid Dues</th>
                          <th className="py-3 px-4 font-bold">Days Overdue</th>
                          <th className="py-3 px-4 font-bold">Interest (18% p.a.)</th>
                          <th className="py-3 px-4 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaedff]">
                        {[
                          { suite: 'Suite B-402', name: 'Priya Saxena (Owner)', dues: '₹28,500', days: '45 Days', int: '₹632' },
                          { suite: 'Suite C-1104', name: 'Rajesh Verma (Tenant)', dues: '₹34,200', days: '60 Days', int: '₹1,020' },
                          { suite: 'Suite A-902', name: 'Anita Menon (Owner)', dues: '₹19,000', days: '35 Days', int: '₹281' },
                          { suite: 'Suite D-204', name: 'Gautam Singhania (Owner)', dues: '₹41,800', days: '75 Days', int: '₹1,560' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#f2f3ff] transition-colors">
                            <td className="py-3 px-4 font-bold">{row.suite}</td>
                            <td className="py-3 px-4 text-gray-800">{row.name}</td>
                            <td className="py-3 px-4 font-bold text-[#ba1a1a]">{row.dues}</td>
                            <td className="py-3 px-4 text-gray-600">{row.days}</td>
                            <td className="py-3 px-4 font-semibold text-gray-700">{row.int}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTreasuryPaymentModal({
                                      isOpen: true,
                                      mode: 'RECORD_UNIT_PAYMENT',
                                      unitData: {
                                        suite: row.suite,
                                        residentName: row.name,
                                        defaultAmount: row.dues.replace(/[^\d]/g, '')
                                      }
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#006b2c] text-white hover:bg-[#00873a] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">receipt</span>
                                  <span>Record Payment</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => showToast(`WhatsApp reminder sent to ${row.name}`, 'success')}
                                  className="px-2.5 py-1 rounded-lg bg-[#006b2c]/10 text-[#006b2c] hover:bg-[#006b2c] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                                >
                                  WhatsApp Reminder
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: VENDORS & STAFF MANAGEMENT (PRESIDENT MVP) */}
          {activeTab === 'vendors' && (
            <div>
              {/* Header */}
              <div className="px-8 py-6 bg-white border-b border-[#eaedff] shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold uppercase tracking-wide">
                        Core Estate MVP
                      </span>
                      <span className="text-[#6e7b6c]">•</span>
                      <span className="text-xs text-[#006b2c] font-bold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span>
                        Staff Biometrics &amp; AMC Operations Center
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight mt-1">Vendors &amp; Staff Management</h1>
                    <p className="text-xs text-[#6e7b6c]">Apartment President command center for Corporate AMC SLAs, security shifts, domestic helper police verification, and contractor gate passes.</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => showToast('Biometric attendance scanner synced: 142 daily helpers verified on estate perimeter.', 'success')}
                      className="px-3.5 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">fingerprint</span>
                      <span>Biometric Roll-Call Sync</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenPayoutForVendor('', '', '')}
                      className="px-3.5 py-2 bg-[#006591] text-white hover:bg-[#004e70] rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">payments</span>
                      <span>+ Direct Bank Payout</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegisterStaffModal(true)}
                      className="px-3.5 py-2 bg-white text-[#006b2c] border border-[#006b2c] hover:bg-[#006b2c]/10 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">badge</span>
                      <span>+ Register Domestic Staff</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowIssueVendorPassModal(true)}
                      className="px-4 py-2 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">vpn_key</span>
                      <span>+ Issue Contractor Pass</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 flex flex-col gap-6">
                {/* 5 Executive President KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  <div
                    onClick={() => setVendorSubTab('domestic')}
                    className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] hover:border-[#006b2c] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#6e7b6c] tracking-wider">Domestic Help Today</span>
                      <span className="p-1.5 rounded-lg bg-[#7ffc97]/30 text-[#006b2c]">
                        <span className="material-symbols-outlined text-sm">group</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#006b2c]">142</span>
                        <span className="text-xs text-[#006b2c] font-bold">94.6%</span>
                      </div>
                      <p className="text-[11px] text-[#6e7b6c] mt-0.5 truncate">88 Maids • 34 Drivers • 20 Cooks</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setVendorSubTab('facilities')}
                    className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] hover:border-[#006591] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#6e7b6c] tracking-wider">Facility &amp; Security Force</span>
                      <span className="p-1.5 rounded-lg bg-[#c9e6ff] text-[#001e2f]">
                        <span className="material-symbols-outlined text-sm">shield</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#006591]">42 Staff</span>
                        <span className="text-xs text-[#006591] font-bold">Active</span>
                      </div>
                      <p className="text-[11px] text-[#6e7b6c] mt-0.5 truncate">18 Guards • 14 Housekeeping • 6 MEP</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setVendorSubTab('amc')}
                    className="p-4 bg-white rounded-2xl shadow-sm border border-[#eaedff] hover:border-[#825100] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#6e7b6c] tracking-wider">Corporate AMCs</span>
                      <span className="p-1.5 rounded-lg bg-[#ffddb8] text-[#825100]">
                        <span className="material-symbols-outlined text-sm">handshake</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#131b2e]">7 Active</span>
                        <span className="text-xs text-[#006b2c] font-bold">100% Up</span>
                      </div>
                      <p className="text-[11px] text-[#6e7b6c] mt-0.5 truncate">Otis, Kirloskar, Ion Exchange, TopsGrup</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setVendorSubTab('amc')}
                    className="p-4 bg-white rounded-2xl shadow-sm border border-[#ffdad6] hover:border-[#ba1a1a] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#ba1a1a] tracking-wider">Pending Invoices</span>
                      <span className="p-1.5 rounded-lg bg-[#ffdad6] text-[#ba1a1a]">
                        <span className="material-symbols-outlined text-sm">receipt</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#ba1a1a]">₹2,45,000</span>
                        <span className="text-xs text-[#ba1a1a] font-bold">2 Due</span>
                      </div>
                      <p className="text-[11px] text-[#ba1a1a] font-medium mt-0.5 truncate">Otis &amp; BVG Housekeeping</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('banking')}
                    className="p-4 bg-white rounded-2xl shadow-sm border border-[#a3e635]/60 hover:border-[#006b2c] transition-all cursor-pointer flex flex-col justify-between bg-gradient-to-br from-white to-[#e8f5e9]/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#006b2c] tracking-wider">Bank Accounts &amp; Cash</span>
                      <span className="p-1.5 rounded-lg bg-[#e8f5e9] text-[#006b2c]">
                        <span className="material-symbols-outlined text-sm">account_balance</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-[#006b2c]">
                          ₹{((treasuryData?.accounts?.operatingBank || 4280000) / 100000).toFixed(2)}L
                        </span>
                        <span className="text-[10px] text-[#006b2c] font-bold">HDFC Live</span>
                      </div>
                      <p className="text-[11px] text-[#006b2c] font-medium mt-0.5 truncate">Open Bank Payout Console →</p>
                    </div>
                  </div>
                </div>

                {/* Sub-Tabs Selector */}
                <div className="flex items-center gap-2 border-b border-[#eaedff] pb-2 overflow-x-auto">
                  {[
                    { id: 'amc', label: 'Corporate AMC Contracts & Invoices', count: amcContracts.length, icon: 'handshake' },
                    { id: 'facilities', label: 'Security & Facilities Crew', count: estateFacilitiesStaff.length, icon: 'security' },
                    { id: 'domestic', label: 'Domestic Daily Help Directory', count: domesticStaff.length, icon: 'badge' },
                    { id: 'passes', label: 'Contractor Gate Passes', count: vendorGatePasses.length, icon: 'vpn_key' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setVendorSubTab(tab.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                        vendorSubTab === tab.id
                          ? 'bg-[#006b2c] text-white shadow-sm'
                          : 'bg-white text-[#6e7b6c] hover:bg-[#f2f3ff] hover:text-[#131b2e] border border-[#eaedff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                      <span>{tab.label}</span>
                      <span
                        className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          vendorSubTab === tab.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* SUB-TAB 1: CORPORATE AMC CONTRACTS & INVOICE SIGN-OFF */}
                {vendorSubTab === 'amc' && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                        <input
                          type="text"
                          placeholder="Search contract name, service domain, supervisor or equipment (e.g. Otis, Lifts, Kirloskar)..."
                          value={vendorSearchQuery}
                          onChange={(e) => setVendorSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] rounded-xl text-xs font-semibold text-[#131b2e] border border-transparent focus:border-[#006b2c] focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6e7b6c]">
                        <span className="font-bold text-[#131b2e]">{amcContracts.length} Corporate AMCs</span>
                        <span>• Managed by Estate Management Committee</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {amcContracts
                        .filter((c) => {
                          if (!vendorSearchQuery) return true;
                          const q = vendorSearchQuery.toLowerCase();
                          return (
                            c.name.toLowerCase().includes(q) ||
                            c.category.toLowerCase().includes(q) ||
                            c.supervisor.toLowerCase().includes(q)
                          );
                        })
                        .map((contract) => (
                          <div
                            key={contract.id}
                            className={`p-5 rounded-2xl bg-white shadow-sm border transition-all flex flex-col justify-between gap-4 ${
                              contract.pendingInvoice
                                ? 'border-[#ffdad6] bg-gradient-to-br from-[#fffbfa] to-white'
                                : 'border-[#eaedff]'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-base text-[#131b2e]">{contract.name}</h3>
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        contract.status === 'RENEWAL_DUE'
                                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                          : contract.status === 'CAPEX_PROJECT'
                                          ? 'bg-[#c9e6ff] text-[#001e2f]'
                                          : 'bg-[#7ffc97] text-[#002109]'
                                      }`}
                                    >
                                      {contract.status.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <span className="text-xs text-[#6e7b6c] font-medium block mt-1">{contract.category}</span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-[10px] font-bold uppercase text-[#6e7b6c] block">Monthly Retainer</span>
                                  <span className="text-base font-black text-[#131b2e]">₹{contract.monthlyPayout.toLocaleString('en-IN')}</span>
                                </div>
                              </div>

                              {/* SLA & Service Commitments */}
                              <div className="mt-3 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1.5 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#131b2e] flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-[#006b2c]">verified</span>
                                    SLA Guarantee:
                                  </span>
                                  <span className="text-[#006b2c] font-bold text-[11px]">{contract.slaGuarantee}</span>
                                </div>
                                <div className="flex items-center justify-between text-[#6e7b6c] text-[11px]">
                                  <span>Contract Term:</span>
                                  <span>{contract.renewalDate}</span>
                                </div>
                                <div className="flex items-center justify-between text-[#6e7b6c] text-[11px]">
                                  <span>Assigned Lead:</span>
                                  <span className="font-bold text-[#131b2e]">{contract.supervisor}</span>
                                </div>
                              </div>

                              {/* Pending Invoice Notification Banner */}
                              {contract.pendingInvoice && (
                                <div className="mt-3 p-3 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6] flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#ba1a1a] text-lg">receipt</span>
                                    <div>
                                      <span className="text-xs font-bold text-[#ba1a1a] block">
                                        Pending Authorization: ₹{contract.pendingInvoiceAmount?.toLocaleString('en-IN')}
                                      </span>
                                      <span className="text-[10px] text-[#6e7b6c]">Invoice Ref: {contract.invoiceRef}</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveTab('banking');
                                      handleOpenPayoutForVendor(contract.name, contract.pendingInvoiceAmount, contract.invoiceRef);
                                    }}
                                    className="px-3 py-1.5 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
                                  >
                                    <span className="material-symbols-outlined text-xs">account_balance</span>
                                    <span>Payout in Bank Accounts &amp; Cash →</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Actions Toolbar */}
                            <div className="flex items-center justify-between pt-3 border-t border-[#eaedff] text-xs">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(contract.phone);
                                    showToast(`Dialing supervisor ${contract.supervisor} at ${contract.phone}`, 'info');
                                  }}
                                  className="px-3 py-1.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">call</span>
                                  <span>Call Supervisor</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(contract.emergencyPhone);
                                    showToast(`Emergency 24/7 Breakdown Cell: ${contract.emergencyPhone}`, 'warning');
                                  }}
                                  className="px-2.5 py-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">emergency</span>
                                  <span className="hidden sm:inline">24/7 Hotline</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('maintenance');
                                  setMaintenanceSearchQuery(contract.name);
                                }}
                                className="text-[#006b2c] font-bold hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <span>{contract.activeTicketsCount} Open Work Orders</span>
                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: SECURITY & FACILITIES ROSTER */}
                {vendorSubTab === 'facilities' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eaedff]">
                      <div>
                        <h2 className="text-base font-bold text-[#131b2e]">Estate Facility Roster &amp; Station Assignments</h2>
                        <span className="text-xs text-[#6e7b6c]">42 active security personnel, electricians, plumbers and sanitation crew on three 8-hour shifts.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('Shift rotation roster broadcasted to Guard Room Kiosk.', 'success')}
                        className="px-3 py-1.5 bg-[#006b2c] text-white hover:bg-[#00873a] text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                      >
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>Broadcast Shift Handover</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#eaedff] text-[#6e7b6c] uppercase tracking-wider bg-[#f2f3ff]">
                            <th className="py-3 px-4 font-bold">Staff ID &amp; Name</th>
                            <th className="py-3 px-4 font-bold">Role</th>
                            <th className="py-3 px-4 font-bold">Station / Post</th>
                            <th className="py-3 px-4 font-bold">Shift Schedule</th>
                            <th className="py-3 px-4 font-bold">Police Verified</th>
                            <th className="py-3 px-4 font-bold">Status</th>
                            <th className="py-3 px-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaedff]">
                          {estateFacilitiesStaff.map((staff) => (
                            <tr key={staff.id} className="hover:bg-[#f2f3ff] transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-8 w-8 rounded-full bg-[#006591] text-white flex items-center justify-center font-bold text-xs">
                                    {staff.name.slice(0, 2)}
                                  </div>
                                  <div>
                                    <span className="font-bold text-[#131b2e] block">{staff.name}</span>
                                    <span className="text-[10px] font-mono text-[#6e7b6c]">{staff.id}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-[#131b2e]">{staff.role}</td>
                              <td className="py-3.5 px-4 text-gray-700">{staff.post}</td>
                              <td className="py-3.5 px-4 text-gray-600">{staff.shift}</td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/40 text-[#002109] font-bold text-[10px] flex items-center gap-1 w-fit">
                                  <span className="material-symbols-outlined text-[12px]">verified</span>
                                  Verified ✓
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] font-bold text-[10px]">
                                  {staff.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard?.writeText(staff.phone);
                                      showToast(`Dialing ${staff.name} (${staff.role}) at ${staff.phone}`, 'info');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-[#006b2c] text-white hover:bg-[#00873a] font-bold text-xs cursor-pointer flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-xs">call</span>
                                    <span>Call</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: DOMESTIC DAILY HELP DIRECTORY (PRESIDENT MVP) */}
                {vendorSubTab === 'domestic' && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                        <input
                          type="text"
                          placeholder="Search helper name, flat suite, employer, or PV number (e.g., Lakshmi, Suite B-402)..."
                          value={vendorSearchQuery}
                          onChange={(e) => setVendorSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] rounded-xl text-xs font-semibold text-[#131b2e] border border-transparent focus:border-[#006b2c] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                        {['ALL', 'Housemaid', 'Chauffeur', 'Home Cook', 'Gardener', 'Childcare / Nanny'].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setDomesticRoleFilter(role)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                              domesticRoleFilter === role
                                ? 'bg-[#006b2c] text-white shadow-sm'
                                : 'bg-[#f2f3ff] text-[#6e7b6c] hover:bg-[#e2e7ff]'
                            }`}
                          >
                            {role === 'ALL' ? 'All Roles (142)' : role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {domesticStaff
                        .filter((stf) => {
                          if (domesticRoleFilter !== 'ALL' && stf.role !== domesticRoleFilter) return false;
                          if (vendorSearchQuery) {
                            const q = vendorSearchQuery.toLowerCase();
                            const matchName = stf.name.toLowerCase().includes(q);
                            const matchFlat = stf.flat.toLowerCase().includes(q);
                            const matchPhone = stf.phone.includes(q);
                            const matchPv = stf.policeRef?.toLowerCase().includes(q);
                            if (!matchName && !matchFlat && !matchPhone && !matchPv) return false;
                          }
                          return true;
                        })
                        .map((stf) => (
                          <div
                            key={stf.id}
                            className="p-4 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
                          >
                            <div>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-10 w-10 rounded-full bg-[#e8f5e9] text-[#006b2c] flex items-center justify-center font-bold text-sm border border-[#7ffc97]">
                                    {stf.name.slice(0, 2)}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-sm text-[#131b2e]">{stf.name}</h4>
                                    <span className="text-[11px] font-semibold text-[#006591]">{stf.role}</span>
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] font-bold text-[9px]">
                                  {stf.status}
                                </span>
                              </div>

                              <div className="mt-3 p-2.5 rounded-xl bg-[#f2f3ff] text-xs flex flex-col gap-1">
                                <div className="flex items-center justify-between text-[#6e7b6c]">
                                  <span>Employer Flat:</span>
                                  <span className="font-bold text-[#131b2e]">{stf.flat}</span>
                                </div>
                                <div className="flex items-center justify-between text-[#6e7b6c]">
                                  <span>Check-in Gate:</span>
                                  <span>{stf.gate} • {stf.inTime}</span>
                                </div>
                                <div className="flex items-center justify-between text-[#6e7b6c]">
                                  <span>Police Verification:</span>
                                  <span className="text-[#006b2c] font-bold">{stf.policeRef} ✓</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-[#eaedff]">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(stf.phone);
                                  showToast(`Calling ${stf.name} at ${stf.phone}`, 'info');
                                }}
                                className="flex-1 py-1.5 bg-[#006b2c] text-white hover:bg-[#00873a] font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs">call</span>
                                <span>Call</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => showToast(`SMS verification ping dispatched to resident of ${stf.flat}.`, 'success')}
                                className="px-2.5 py-1.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                                title="Notify flat owner"
                              >
                                Notify Flat
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 4: CONTRACTOR & SERVICE GATE PASSES */}
                {vendorSubTab === 'passes' && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-base font-bold text-[#131b2e]">Active Temporary Contractor Gate Passes</h2>
                        <span className="text-xs text-[#6e7b6c]">All external labor crews require OTP biometric authentication at Gate 1 or Gate 2 before entering towers.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowIssueVendorPassModal(true)}
                        className="px-4 py-2 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Issue New Gate Pass</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vendorGatePasses.map((pass) => (
                        <div
                          key={pass.id}
                          className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-base text-[#131b2e]">{pass.company}</h3>
                                  <span className="px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] font-bold text-[10px]">
                                    {pass.status}
                                  </span>
                                </div>
                                <span className="text-xs text-[#6e7b6c] block mt-0.5">{pass.workScope}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold uppercase text-[#6e7b6c] block">Gate Entry OTP</span>
                                <span className="text-base font-mono font-black text-[#006b2c]">{pass.otpCode}</span>
                              </div>
                            </div>

                            <div className="mt-3 p-3 rounded-xl bg-[#f2f3ff] text-xs grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[#6e7b6c] block text-[11px]">Lead Supervisor:</span>
                                <span className="font-bold text-[#131b2e]">{pass.leadTech} ({pass.crewCount} workers)</span>
                              </div>
                              <div>
                                <span className="text-[#6e7b6c] block text-[11px]">Target Work Zone:</span>
                                <span className="font-bold text-[#131b2e]">{pass.towerZone}</span>
                              </div>
                              <div>
                                <span className="text-[#6e7b6c] block text-[11px]">Authorized Entry Gate:</span>
                                <span className="font-semibold text-gray-700">{pass.gate}</span>
                              </div>
                              <div>
                                <span className="text-[#6e7b6c] block text-[11px]">Valid Until:</span>
                                <span className="font-bold text-[#ba1a1a]">{pass.validUntil}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#eaedff] text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(pass.phone);
                                showToast(`Dialing contractor lead ${pass.leadTech} at ${pass.phone}`, 'info');
                              }}
                              className="px-3 py-1.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-xs">call</span>
                              <span>Call Supervisor</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setVendorGatePasses((prev) => prev.filter((p) => p.id !== pass.id));
                                showToast(`Gate Pass #${pass.id} revoked. Guard alerted at barrier.`, 'error');
                              }}
                              className="px-3 py-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Revoke Pass
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: DEDICATED BANK ACCOUNTS & CASH MANAGEMENT */}
          {activeTab === 'banking' && (
            <div className="flex-1 flex flex-col bg-[#FAF8FF] min-h-screen">
              {/* Standalone View Header */}
              <div className="bg-white border-b border-[#eaedff] px-8 py-6 sticky top-0 z-30 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e8f5e9] text-[#006b2c] border border-[#a3e635]/40 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">account_balance</span>
                        Executive Treasury Console
                      </span>
                      <span className="text-[#6e7b6c]">•</span>
                      <span className="text-xs text-[#006b2c] font-bold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span>
                        HDFC &amp; SBI Direct Core Banking Gateway
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight mt-1">Bank Accounts &amp; Cash Management</h1>
                    <p className="text-xs text-[#6e7b6c]">Independent command center for cash inflow auditing, statutory reserve deposits, and President 2FA vendor bank disbursements.</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleReconcileInflows}
                      disabled={isAuditingInflows}
                      className="px-3.5 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-base ${isAuditingInflows ? 'animate-spin' : ''}`}>sync</span>
                      <span>{isAuditingInflows ? 'Auditing Inflows...' : 'Reconcile Inflow Feeds'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTreasuryPaymentModal({ isOpen: true, mode: 'DEPOSIT_CASH', billData: null, unitData: null })}
                      className="px-3.5 py-2 bg-white text-[#825100] border border-[#825100] hover:bg-[#825100]/10 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">savings</span>
                      <span>Deposit Cash Vault to Bank</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenPayoutForVendor('', '', '', 'OPERATING_BANK')}
                      className="px-4 py-2 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">payments</span>
                      <span>+ Authorize Bank Payout</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6">
                <VendorBankAccountsTab
                  treasuryData={treasuryData}
                  inflowLedger={inflowLedger}
                  amcContracts={amcContracts}
                  onOpenPayout={handleOpenPayoutForVendor}
                  onDepositCash={() => setTreasuryPaymentModal({ isOpen: true, mode: 'DEPOSIT_CASH', billData: null, unitData: null })}
                  onReconcileInflows={handleReconcileInflows}
                  isAuditingInflows={isAuditingInflows}
                  showToast={showToast}
                />
              </div>
            </div>
          )}

        </main>

        {/* ========================================================================= */}
        {/* MODALS RENDERED IN DOM */}
        {/* ========================================================================= */}

        {/* 1. Work Order Resolution Modal */}
        <WorkOrderResolveModal
          isOpen={resolveTicketModal.isOpen}
          ticket={resolveTicketModal.ticket}
          onClose={() => setResolveTicketModal({ isOpen: false, ticket: null })}
          onConfirmResolve={handleConfirmResolveTicket}
        />

        {/* 2. Work Order Escalation Notice Modal */}
        <WorkOrderEscalateModal
          isOpen={escalateTicketModal.isOpen}
          ticket={escalateTicketModal.ticket}
          onClose={() => setEscalateTicketModal({ isOpen: false, ticket: null })}
          onConfirmEscalate={handleConfirmEscalateTicket}
        />

        {/* 3. Security Directive & Guard Field Inspection Modal */}
        <SecurityDirectiveModal
          isOpen={securityDirectiveModal.isOpen}
          targetUnit={securityDirectiveModal.targetUnit}
          kycId={securityDirectiveModal.kycId}
          existingDirective={securityDirectiveModal.existingDirective}
          onClose={() =>
            setSecurityDirectiveModal({
              isOpen: false,
              targetUnit: 'Suite A-1204',
              kycId: 'kyc-1',
              existingDirective: null
            })
          }
          onDispatchDirective={handleDispatchSecurityDirective}
          onSubmitGuardReport={handleSubmitGuardReport}
        />

        {/* 4. Society Treasury & Vendor Payment Disbursal Modal */}
        <TreasuryPaymentModal
          isOpen={treasuryPaymentModal.isOpen}
          mode={treasuryPaymentModal.mode}
          billData={treasuryPaymentModal.billData}
          unitData={treasuryPaymentModal.unitData}
          treasuryData={treasuryData}
          onClose={() =>
            setTreasuryPaymentModal({
              isOpen: false,
              mode: 'PAY_UTILITY_BILL',
              billData: null,
              unitData: null
            })
          }
          onConfirmUtilityPayment={handleConfirmUtilityPayment}
          onConfirmDeposit={handleConfirmDeposit}
          onConfirmDisbursement={handleConfirmDisbursement}
          onConfirmUnitPayment={handleConfirmUnitPayment}
        />

        {/* 5. Overview KPI Detailed Drilldown Modal */}
        <OverviewKpiDetailModal
          isOpen={kpiDetailModal.isOpen}
          kpiType={kpiDetailModal.kpiType}
          onClose={() => setKpiDetailModal({ isOpen: false, kpiType: 'OCCUPANCY' })}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onOpenResolveTicket={(ticket) => setResolveTicketModal({ isOpen: true, ticket })}
          onOpenEscalateTicket={(ticket) => setEscalateTicketModal({ isOpen: true, ticket })}
          onOpenRecordPayment={(unitData) =>
            setTreasuryPaymentModal({ isOpen: true, mode: 'RECORD_UNIT_PAYMENT', unitData })
          }
          tickets={tickets}
          gateEntries={gateEntries}
          treasuryData={treasuryData}
          onSimulateGateScan={handleSimulateGateScan}
          showToast={showToast}
        />

        {/* Executive Financial Audit & Tower Print Modal */}
        <ExecutiveReportPrintModal
          isOpen={showExecutivePrintModal}
          onClose={() => setShowExecutivePrintModal(false)}
          treasuryData={treasuryData}
          showToast={showToast}
        />

        {/* 6. Staff Roll Call Modal */}
        <StaffRollCallModal
          isOpen={showStaffRollCallModal}
          onClose={() => setShowStaffRollCallModal(false)}
          onNavigateToVendors={() => setActiveTab('vendors')}
        />

        {/* Feed: Delete Notice Modal */}
        {deletePostModal.isOpen && (
          <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ffdad6] flex flex-col gap-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2.5 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-2xl">delete_sweep</span>
                <h3 className="text-base font-bold text-[#131b2e]">Remove Community Feed Post</h3>
              </div>
              <p className="text-xs text-[#6e7b6c]">
                As Estate President, select the governance or bye-law violation reason to archive this post from the public resident feed:
              </p>
              <select
                value={deletePostModal.reason}
                onChange={(e) => setDeletePostModal((prev) => ({ ...prev, reason: e.target.value }))}
                className="p-3 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-xs font-semibold text-[#131b2e]"
              >
                <option value="Spam / Commercial promotion">Commercial promotion / Unauthorized solicitation</option>
                <option value="Violates Estate Conduct Bye-Laws">Violates Estate Conduct &amp; Decorum Bye-Laws</option>
                <option value="Duplicate notice or misinformation">Duplicate circular or unverified rumor</option>
                <option value="Resolved complaint / Expired request">Resolved grievance / Expired resident request</option>
              </select>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setDeletePostModal({ isOpen: false, postId: null, reason: 'Spam' })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeletePost}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ba1a1a] text-white hover:bg-red-700 shadow-sm cursor-pointer"
                >
                  Confirm Removal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feed: New Notice Composer Modal */}
        {showNewNoticeModal && (
          <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff] flex flex-col gap-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b2c] text-2xl">campaign</span>
                  <h3 className="text-base font-bold text-[#131b2e]">Issue Official Estate Circular</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewNoticeModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateNotice} className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Circular Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Annual Hydro-pneumatic Water Tank Desilting &amp; Cleaning"
                    value={newNoticeForm.title}
                    onChange={(e) => setNewNoticeForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full p-2.5 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-xs font-semibold text-[#131b2e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={newNoticeForm.category}
                      onChange={(e) => setNewNoticeForm((p) => ({ ...p, category: e.target.value }))}
                      className="w-full p-2.5 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-xs font-semibold text-[#131b2e]"
                    >
                      <option value="ANNOUNCEMENT">Official Announcement</option>
                      <option value="MAINTENANCE">Maintenance Advisory</option>
                      <option value="SECURITY">Security Protocol</option>
                      <option value="EVENT">Community Festival / AGM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Authorized By</label>
                    <input
                      type="text"
                      readOnly
                      value="Elena Rostova (President)"
                      className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Circular Content &amp; Instructions</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide full schedule, contractor details, precautionary measures, and resident impact..."
                    value={newNoticeForm.content}
                    onChange={(e) => setNewNoticeForm((p) => ({ ...p, content: e.target.value }))}
                    className="w-full p-2.5 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-xs font-normal text-[#131b2e]"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#131b2e] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newNoticeForm.pin}
                    onChange={(e) => setNewNoticeForm((p) => ({ ...p, pin: e.target.checked }))}
                    className="rounded text-[#006b2c] focus:ring-[#006b2c]"
                  />
                  <span>Pin this circular permanently to top of Community Feed</span>
                </label>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eaedff]">
                  <button
                    type="button"
                    onClick={() => setShowNewNoticeModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Publish Circular</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 6. New Work Order Generation Modal */}
        <CreateWorkOrderModal
          isOpen={showCreateWorkOrderModal}
          onClose={() => setShowCreateWorkOrderModal(false)}
          onSaveWorkOrder={handleSaveNewWorkOrder}
          showToast={showToast}
        />

        {/* 7. Issue Contractor Gate Pass Modal */}
        <IssueVendorPassModal
          isOpen={showIssueVendorPassModal}
          onClose={() => setShowIssueVendorPassModal(false)}
          onIssuePass={handleIssueVendorPass}
          showToast={showToast}
        />

        {/* 8. Authorize Vendor Invoice Modal */}
        <AuthorizeVendorInvoiceModal
          isOpen={authorizeInvoiceModal.isOpen}
          invoice={authorizeInvoiceModal.invoice}
          onClose={() => setAuthorizeInvoiceModal({ isOpen: false, invoice: null })}
          onConfirmApproval={handleConfirmInvoiceApproval}
          showToast={showToast}
        />

        {/* 9. Register Domestic / Estate Staff Modal */}
        <RegisterStaffModal
          isOpen={showRegisterStaffModal}
          onClose={() => setShowRegisterStaffModal(false)}
          onRegisterStaff={handleRegisterStaff}
          showToast={showToast}
        />

        {/* 10. Direct Bank Payout & Disbursal Modal (President 2FA Signatory) */}
        <PresidentBankPayoutModal
          isOpen={showPresidentPayoutModal}
          prefilledPayee={payoutPrefill.payee}
          prefilledAmount={payoutPrefill.amount}
          prefilledInvoiceRef={payoutPrefill.invoiceRef}
          prefilledSourceAccount={payoutPrefill.sourceAccount}
          treasuryData={treasuryData}
          onClose={() => setShowPresidentPayoutModal(false)}
          onConfirmPayout={handleExecutePresidentPayout}
          showToast={showToast}
        />

        {/* 11. Digital Gate Pass Printable / Scannable Slip Modal */}
        <DigitalGatePassModal
          isOpen={!!selectedPassForModal}
          pass={selectedPassForModal}
          onClose={() => setSelectedPassForModal(null)}
          onCheckout={(id) => handleCheckoutGatePass(id)}
        />

        {/* 12. Create New Digital Gate Pass Modal */}
        <CreateGatePassModal
          isOpen={showCreateGatePassModal}
          onClose={() => setShowCreateGatePassModal(false)}
          onPassCreated={handleCreatePassSuccess}
        />
      </div>
    </div>
  );
};
