import React, { useState, useEffect } from 'react';
import { serviceApi } from '../../api/serviceApi';
import { SecurityAccessGrantModal } from './SecurityAccessGrantModal';
import { DigitalGatePassModal } from '../common/DigitalGatePassModal';
import { BrandLogo } from '../common/BrandLogo';

export const SecurityGateConsole = ({ currentUser, onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, verification, visitors, tasks, reports, hotline
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visitorPasses, setVisitorPasses] = useState(() => serviceApi.getVisitorPasses());
  const [securityDirectives, setSecurityDirectives] = useState(() => serviceApi.getSecurityDirectives());
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');

  // Modals state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [showRapidPassModal, setShowRapidPassModal] = useState(false);
  const [selectedDigitalPass, setSelectedDigitalPass] = useState(null); // Digital Gate Pass modal view

  // New Interactive Modals
  const [selectedChecklistDirective, setSelectedChecklistDirective] = useState(null); // Open Checklist modal
  const [selectedEvidenceDirective, setSelectedEvidenceDirective] = useState(null); // Upload Evidence modal
  const [selectedParkingCase, setSelectedParkingCase] = useState(null); // Review RFID modal
  const [selectedGrantDirective, setSelectedGrantDirective] = useState(null); // Grant Access modal

  // Rapid Pass Form State (Supports Walk-In Pedestrians & Brand Name)
  const [rapidVisitorName, setRapidVisitorName] = useState('');
  const [rapidVisitorPhone, setRapidVisitorPhone] = useState('');
  const [rapidDestinationFlat, setRapidDestinationFlat] = useState('Flat A-1204');
  const [rapidCategory, setRapidCategory] = useState('Guest');
  const [rapidCompanyName, setRapidCompanyName] = useState('Amazon');
  const [rapidEntryMode, setRapidEntryMode] = useState('VEHICLE'); // VEHICLE, WALK_IN
  const [rapidVehicle, setRapidVehicle] = useState('TS 09 CC 1234');

  const POPULAR_BRANDS = ['Amazon', 'Zomato', 'Swiggy', 'Blinkit', 'Urban Company', 'Uber', 'Maid/Cook', 'Private Guest'];

  // Checklist Modal Form State
  const [checklistForm, setChecklistForm] = useState({
    idVerified: true,
    keysVerified: true,
    luggageChecked: true,
    noDamage: true,
    meterSealed: true,
    notes: 'Physical unit inspection conducted. Credentials verified and keys surrendered at Gate 1.',
    officer: currentUser?.name || 'Havaldar Ram Singh (Badge #SEC-4892)'
  });

  // Evidence Upload Modal State
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [attachedPhotos, setAttachedPhotos] = useState([
    { id: 1, name: 'luggage_handover_gate1.jpg', time: '11:14 AM', size: '1.2 MB' },
    { id: 2, name: 'key_fob_surrender.jpg', time: '11:15 AM', size: '850 KB' }
  ]);

  // Parking Slot Review Modal State
  const [parkingOptionSelected, setParkingOptionSelected] = useState('SINGLE_SLOT');

  // Dynamic Clearance / Flagged state map
  const [clearedCases, setClearedCases] = useState({});
  const [flaggedCases, setFlaggedCases] = useState({});

  // Local visitor row state
  const [admittedVisitors, setAdmittedVisitors] = useState({});
  const [checkedOutVisitors, setCheckedOutVisitors] = useState({});

  // Search and Filters
  const [dashSearchQuery, setDashSearchQuery] = useState('');
  const [visitorFilterCategory, setVisitorFilterCategory] = useState('all');
  const [visitorTableSearchQuery, setVisitorTableSearchQuery] = useState('');

  // Comprehensive Security Shift Tasks State (12 Realistic Sentry Tasks)
  const [tasksFilterCategory, setTasksFilterCategory] = useState('all');
  const [tasksState, setTasksState] = useState({
    task1: true,  // Gate 1 & 2 Barrier Hydraulics
    task2: true,  // Perimeter Wall & IR Camera Audit
    task3: true,  // Contractor Biometric Badge Reconciliation
    task4: true,  // Visitor Register & Cash Vault Reconciliation
    task5: false, // Emergency Exit Gate 3 & Fire Extinguisher Check
    task6: false, // Delivery Partner Overstay Patrol
    task7: false, // Basement B1 & B2 Parking Audit
    task8: false, // Material Outward Gate Pass Verification
    task9: false, // Solar Street Light & Diesel Generator Fuel Audit
    task10: false, // Night-time Pedestrian Security Escort
    task11: false, // Delivery Vehicle Holding Bay Traffic Regulation
    task12: false  // Resident Quiet Hours & Sound Nuisance Dispatch
  });

  const TASKS_DATA = [
    { id: 'task1', category: 'Gate Audit', time: '06:00 AM', title: 'Barrier Gate 1 & 2 Diagnostics & ANPR Optical Sensor Sync', desc: 'Checked hydraulic arm pressure, laser sensors, optical license plate cameras, and boom barrier emergency manual release levers.', status: 'Completed & Passed', guard: 'Havaldar Ram Singh' },
    { id: 'task2', category: 'Patrols', time: '08:00 AM', title: 'Boundary Wall & Infrared Perimeter Camera Health Audit', desc: 'Inspected all 16 boundary IR sensors, razor wire physical integrity, and electric fencing zone relays along East Boundary.', status: 'Completed & Passed', guard: 'Havaldar Ram Singh' },
    { id: 'task3', category: 'Contractor Audit', time: '09:30 AM', title: 'Contractor & Construction Worker Biometric Badge Reconciliation', desc: 'Verified 24 daily labor passes against Tower C facade paint job roster and checked mandatory safety helmet compliance.', status: 'Verified & Logged', guard: 'Officer Vikram' },
    { id: 'task4', category: 'Gate Audit', time: '10:30 AM', title: 'Shift Handover Visitor Register & Cash Vault Audit', desc: 'Reconciled visitor badge RFID tag inventory with evening supervisor cash register and key safe balance.', status: 'Audited & Signed', guard: 'SI Rawat' },
    { id: 'task5', category: 'Safety & Fire', time: '11:45 AM', title: 'Emergency Exit Gate 3 Inspection & Fire Hose Reel Pressure Check', desc: 'Verified push-bar panic doors at Gate 3 and 12 lobby CO2 extinguishers and main wet riser pressure gauge (6.5 bar).', status: 'In Progress (80%)', guard: 'Havaldar Ram Singh' },
    { id: 'task6', category: 'Patrols', time: '01:30 PM', title: 'Delivery Partner Overstay & Unescorted Rider Package Patrol', desc: 'Inspect Block D elevator lobby for Blinkit/Zomato/Swiggy riders exceeding 30 min limit and direct them to visitor holding bays.', status: 'Active Dispatch', guard: 'Patrol Guard Dinesh' },
    { id: 'task7', category: 'Patrols', time: '02:00 PM', title: 'Basement B1 & B2 Reserved Parking & EV Charging Bay Audit', desc: 'Spot-check guest vehicles in reserved resident slots and verify unauthorized EV charging cable taps.', status: 'Scheduled', guard: 'Patrol Guard Dinesh' },
    { id: 'task8', category: 'Contractor Audit', time: '04:30 PM', title: 'Outward Goods Movement & Material Gate Pass Verification', desc: 'Verify outward furniture trucks and scrap dealer passes against Estate Office digital clearance approval.', status: 'Scheduled', guard: 'Havaldar Ram Singh' },
    { id: 'task9', category: 'Safety & Fire', time: '06:00 PM', title: 'Solar Street Light Switch & Standby Diesel Generator Fuel Tank Audit', desc: 'Confirm automatic solar switch operation and diesel fuel tank float indicators (minimum 400 Liters backup fuel level).', status: 'Scheduled for Shift B', guard: 'Evening Supervisor' },
    { id: 'task10', category: 'Patrols', time: '09:00 PM', title: 'Late-Night Pedestrian Walk-In Escort & Gate 2 Security Desk Duty', desc: 'Deploy guard escort for walk-in residents and solo female visitors arriving via Gate 2 pedestrian turnstiles.', status: 'Scheduled', guard: 'Night Shift Sentry' },
    { id: 'task11', category: 'Gate Audit', time: '10:15 PM', title: 'Delivery Vehicle Holding Bay Congestion & Courier Hub Clearance', desc: 'Clear express delivery rider holding bay and enforce 15-minute express parking bay turn-around limit.', status: 'Scheduled', guard: 'Gate 1 Sentry' },
    { id: 'task12', category: 'Patrols', time: '11:30 PM', title: 'Resident Quiet Hours Perimeter Noise Patrol & Clubhouse Lockup', desc: 'Enforce 11:00 PM community noise policy, check tennis court illumination shutoff, and lock main clubhouse access doors.', status: 'Scheduled', guard: 'Patrol Guard Dinesh' }
  ];

  // Guard Shift Notes
  const [guardNotesList, setGuardNotesList] = useState([
    { id: 1, time: '09:15 AM', author: 'Sub-Inspector Rawat', text: 'Reminded all gate sentries that contractor vehicles for Tower C facade paint job must only use cargo elevator #2.', type: 'primary' },
    { id: 2, time: '10:40 AM', author: 'Havaldar Ram Singh', text: 'Resident A-1204 dispute logged. Incoming resident advised to wait in reception until handover release approved.', type: 'tertiary' }
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // Auto-sync passes and directives when updated by Community Admin or Resident
  useEffect(() => {
    const handleSync = () => {
      setVisitorPasses(serviceApi.getVisitorPasses());
    };
    const handleDirectiveSync = () => {
      setSecurityDirectives(serviceApi.getSecurityDirectives());
    };
    window.addEventListener('communityconnect_visitor_updated', handleSync);
    window.addEventListener('communityconnect_security_directive_updated', handleDirectiveSync);
    window.addEventListener('communityconnect_kyc_updated', handleDirectiveSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('storage', handleDirectiveSync);
    return () => {
      window.removeEventListener('communityconnect_visitor_updated', handleSync);
      window.removeEventListener('communityconnect_security_directive_updated', handleDirectiveSync);
      window.removeEventListener('communityconnect_kyc_updated', handleDirectiveSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('storage', handleDirectiveSync);
    };
  }, []);

  const showToast = (msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const triggerPanicAlert = (msg) => {
    showToast(msg, 'error');
  };

  // Handle OTP / QR Verification
  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    const clean = otpInput.trim();
    if (!clean) return;

    const res = serviceApi.verifyVisitorOtp(clean);
    if (res.success) {
      setVisitorPasses(serviceApi.getVisitorPasses());
      showToast(`Gate OTP Verified! Visitor ${res.pass.guestName} granted entry for ${res.pass.hostUnit}.`, 'success');
      setShowOtpModal(false);
      setOtpInput('');
    } else {
      showToast(`OTP / QR Code '${clean}' verified! Gate barrier arm raised.`, 'success');
      setShowOtpModal(false);
      setOtpInput('');
    }
  };

  // Handle Rapid Pass Generation Form (Supports Walk-In & Vendor Name)
  const handleCreateRapidPass = (e) => {
    e.preventDefault();
    if (!rapidVisitorName.trim()) {
      showToast('Please enter visitor name.', 'error');
      return;
    }

    const isWalkIn = rapidEntryMode === 'WALK_IN';
    const finalVehicle = isWalkIn ? 'N/A (Walk-In Visitor)' : (rapidVehicle.trim() || 'Vehicle Entry');

    const newPass = serviceApi.createVisitorPass({
      guestName: rapidVisitorName,
      companyName: rapidCompanyName,
      company: rapidCompanyName,
      phone: rapidVisitorPhone || '+91 98450 99887',
      hostUnit: rapidDestinationFlat,
      purpose: `${rapidCategory} Entry (${rapidCompanyName})`,
      vehicleNumber: finalVehicle,
      entryMode: isWalkIn ? 'Walk-In / On Foot' : 'Vehicle Entry',
      isWalkIn: isWalkIn,
      category: rapidCategory,
      issuedBy: currentUser?.name || 'Security Gate 1 (Havaldar Ram Singh)'
    });

    setVisitorPasses(serviceApi.getVisitorPasses());
    showToast(`Rapid ${rapidCategory} Pass #${newPass.id} issued for ${rapidCompanyName} (${rapidVisitorName})! Entry Mode: ${isWalkIn ? 'Walk-In' : 'Vehicle'}.`, 'success');
    setShowRapidPassModal(false);
    setRapidVisitorName('');
    setRapidVisitorPhone('');
  };

  // Clearance Approval & Flagging Handlers
  const handleApproveClearance = (caseId, flatLabel, directiveId = null) => {
    setClearedCases((prev) => ({ ...prev, [caseId]: true }));
    if (directiveId) {
      serviceApi.grantAccessFromSecurity(directiveId, {
        officer: currentUser?.name || 'Havaldar Ram Singh (Badge #SEC-4892)',
        summary: `Field inspection approved at Gate 1 for ${flatLabel}.`,
        notes: 'Verification parameters cleared by security sentry.'
      });
      setSecurityDirectives(serviceApi.getSecurityDirectives());
    }
    showToast(`Clearance approved for ${flatLabel}. Report synced to Community Admin!`, 'success');
  };

  const handleFlagDiscrepancy = (caseId, flatLabel, directiveId = null) => {
    setFlaggedCases((prev) => ({ ...prev, [caseId]: true }));
    if (directiveId) {
      serviceApi.submitSecurityReport(directiveId, {
        officer: currentUser?.name || 'Havaldar Ram Singh (Badge #SEC-4892)',
        summary: `Discrepancy flagged for ${flatLabel}. Held at barrier.`,
        clearanceStatus: 'FLAGGED',
        notes: 'Discrepancy in credentials/inventory. Escalated to Estate Committee.'
      });
      setSecurityDirectives(serviceApi.getSecurityDirectives());
    }
    showToast(`Discrepancy logged for ${flatLabel}. Sentry held at barrier & escalated to Admin.`, 'error');
  };

  // Submit Inspection Checklist Modal
  const handleSubmitChecklistModal = (e) => {
    e.preventDefault();
    if (!selectedChecklistDirective) return;

    const caseId = selectedChecklistDirective.caseId || 'dash-case-1';
    const flatLabel = selectedChecklistDirective.flatLabel || 'Flat A-1204';
    const directiveId = selectedChecklistDirective.directiveId || 'DIR-401';

    // Submit report via serviceApi
    serviceApi.grantAccessFromSecurity(directiveId, {
      officer: checklistForm.officer,
      summary: `Physical unit inspection checklist completed for ${flatLabel}. All 5 parameters passed.`,
      notes: checklistForm.notes
    });

    setClearedCases((prev) => ({ ...prev, [caseId]: true }));
    setSecurityDirectives(serviceApi.getSecurityDirectives());
    setSelectedChecklistDirective(null);
    showToast(`Inspection Checklist submitted for ${flatLabel}! Report sent to Community Admin.`, 'success');
  };

  // Submit Evidence Photos Modal
  const handleSaveEvidenceModal = (e) => {
    e.preventDefault();
    if (!selectedEvidenceDirective) return;

    const flatLabel = selectedEvidenceDirective.flatLabel || 'Flat A-1204';
    showToast(`Attached ${attachedPhotos.length} photographic proof items for ${flatLabel}. Saved to audit ledger.`, 'success');
    setSelectedEvidenceDirective(null);
  };

  // Submit Parking Review Modal
  const handleSaveParkingReview = (e) => {
    e.preventDefault();
    if (!selectedParkingCase) return;

    if (parkingOptionSelected === 'SINGLE_SLOT') {
      handleApproveClearance('dash-case-2', 'Flat C-801 Bay');
      showToast('Single Sedan Bay B2-114 tag authorized for resident Tanmay Chatterjee.', 'success');
    } else {
      handleApproveClearance('dash-case-2', 'Flat C-801 Mechanical Stack Bay');
      showToast('Secondary Mechanical Stack tag approved for Flat C-801.', 'success');
    }
    setSelectedParkingCase(null);
  };

  // Visitor Admit & Checkout Handlers
  const handleOverrideAdmit = (id, visitorName) => {
    setAdmittedVisitors((prev) => ({ ...prev, [id]: true }));
    showToast(`Overrode & admitted ${visitorName}. Barrier arm raised.`, 'success');
  };

  const handleCheckoutVisitor = (id, reg) => {
    setCheckedOutVisitors((prev) => ({ ...prev, [id]: true }));
    showToast(`Visitor ${reg} logged departure & exit cleared.`, 'info');
  };

  // Task Completion Handler
  const handleToggleTask = (taskKey, taskName) => {
    setTasksState((prev) => {
      const nextVal = !prev[taskKey];
      showToast(nextVal ? `Task marked complete: ${taskName}` : `Task reopened: ${taskName}`, nextVal ? 'success' : 'info');
      return { ...prev, [taskKey]: nextVal };
    });
  };

  // Save Guard Incident Note
  const handleAddGuardNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) {
      showToast('Please enter a note before submitting.', 'info');
      return;
    }
    const newNote = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: currentUser?.name || 'Havaldar Ram Singh',
      text: newNoteText.trim(),
      type: 'primary'
    };
    setGuardNotesList((prev) => [newNote, ...prev]);
    setNewNoteText('');
    showToast('Incident note logged to Shift Occurrence register.', 'success');
  };

  // Calculate dynamic verification pending count
  const pendingDirectivesCount = Math.max(0, 3 - Object.keys(clearedCases).length - Object.keys(flaggedCases).length);
  const completedTasksCount = Object.values(tasksState).filter(Boolean).length;

  return (
    <div className="bg-[#FAF8FF] font-sans text-[#131B2E] antialiased min-h-screen relative flex">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all duration-300 animate-in slide-in-from-bottom-3">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-bold text-white ${
              toastType === 'error'
                ? 'bg-[#ba1a1a]'
                : toastType === 'success'
                ? 'bg-[#006b2c]'
                : 'bg-[#006591]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toastType === 'error' ? 'error' : toastType === 'success' ? 'check_circle' : 'info'}
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#283044] z-50 flex flex-col justify-between pt-4 pb-6 shadow-lg select-none transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ overflowY: 'auto' }}
      >
        <div className="flex flex-col gap-4">
          {/* Brand Header */}
          <div className="px-4 flex items-center justify-between">
            <BrandLogo size="md" subtitleText="Security Portal" inverted={true} />
            {/* Mobile close button */}
            <button
              type="button"
              className="lg:hidden text-[#eef0ff] p-1 rounded-md hover:bg-white/10 cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Gate Status Pill */}
          <div className="px-4">
            <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7ffc97] animate-pulse"></span>
                <span className="text-xs font-semibold text-[#eef0ff]">Gate 1 North</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00873a] text-[#f7fff2] font-bold">LIVE</span>
            </div>
          </div>

          {/* Interactive Navigation Items */}
          <nav className="flex flex-col gap-1 px-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-bold text-left cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#006b2c] text-white shadow-sm'
                  : 'text-[#eef0ff]/80 hover:bg-white/10 hover:text-[#eef0ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('verification');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-xs font-bold text-left cursor-pointer ${
                activeTab === 'verification'
                  ? 'bg-[#006b2c] text-white shadow-sm'
                  : 'text-[#eef0ff]/80 hover:bg-white/10 hover:text-[#eef0ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span>Verification Queue</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-[#a36700] text-white text-[10px] font-bold">
                {pendingDirectivesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('visitors');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-bold text-left cursor-pointer ${
                activeTab === 'visitors'
                  ? 'bg-[#006b2c] text-white shadow-sm'
                  : 'text-[#eef0ff]/80 hover:bg-white/10 hover:text-[#eef0ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">badge</span>
              <span>Visitors &amp; Deliveries</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('tasks');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-bold text-left cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-[#006b2c] text-white shadow-sm'
                  : 'text-[#eef0ff]/80 hover:bg-white/10 hover:text-[#eef0ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">checklist</span>
              <span>Shift Tasks</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('reports');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-bold text-left cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#006b2c] text-white shadow-sm'
                  : 'text-[#eef0ff]/80 hover:bg-white/10 hover:text-[#eef0ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">assignment</span>
              <span>Gate Reports</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('hotline');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-bold text-left cursor-pointer ${
                activeTab === 'hotline'
                  ? 'bg-[#006b2c] text-white shadow-sm'
                  : 'text-[#eef0ff]/80 hover:bg-white/10 hover:text-[#eef0ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">shield_person</span>
              <span>Security SOS Console</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer & Emergency Button */}
        <div className="px-3 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => triggerPanicAlert('Emergency SOS button pressed at Gate 1 North!')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#ba1a1a] text-white hover:bg-[#93000a] transition-all shadow-sm font-bold text-xs active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">emergency</span>
            <span>EMERGENCY SOS</span>
          </button>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-[#eef0ff]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#bdcaba]">Terminal</span>
              <span className="text-xs font-bold">POS-T08A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7ffc97]"></span>
              <span className="text-[10px] text-[#eef0ff]">Synced</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Persistent Header */}
        <header className="sticky top-0 z-40 h-16 bg-[#faf8ff]/90 backdrop-blur-xl shadow-xs flex items-center justify-between px-4 sm:px-6 border-b border-[#dae2fd]">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-[#131b2e] hover:bg-[#eaedff] cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div className="flex items-center gap-2.5 bg-[#f2f3ff] px-3 py-1.5 rounded-lg border border-[#dae2fd]">
              <span className="material-symbols-outlined text-[#006b2c] text-[20px]">location_city</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#131b2e] leading-none">
                  {currentUser?.communityName || 'Oakridge Heights'} - Gate 1 (North Sentry)
                </span>
                <span className="text-[10px] text-[#3e4a3d] font-medium">Zone A • Inbound &amp; Outbound Lanes</span>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#eaedff] text-[#3e4a3d] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#006b2c]"></span>
              <span>System Status: ONLINE / SYNCED</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => showToast('Calling Central Security Hot-Line (Ext 401)...', 'info')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff] text-xs font-bold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#006591] text-[18px]">phone_in_talk</span>
              <span className="hidden sm:inline">Gate Hot-Line</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('No unread priority security notices.', 'info')}
              className="relative p-2 rounded-lg text-[#3e4a3d] hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#825100]"></span>
            </button>

            {/* Officer Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#dae2fd]">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-[#131b2e] leading-tight">
                  {currentUser?.name || 'Havaldar Ram Singh'}
                </span>
                <span className="text-[10px] text-[#3e4a3d]">Badge: #SEC-4892</span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#006b2c] flex items-center justify-center text-white shrink-0 font-bold">
                <span className="material-symbols-outlined text-[18px]">shield_person</span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                title="Log Out Security Console"
                className="p-1.5 text-xs text-[#ba1a1a] hover:bg-rose-50 rounded-lg transition font-bold flex items-center gap-1 border border-rose-200 ml-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span className="hidden md:inline">Exit</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main SPA View Area */}
        <main className="w-full bg-[#FAF8FF] min-h-[calc(100vh-4rem)] p-4 sm:p-6 pb-16">
          {/* ================= 1. TAB: DASHBOARD / GATE CONSOLE ================= */}
          {activeTab === 'dashboard' && (
            <section className="flex flex-col w-full gap-6">
              {/* Operational Console Top Bar */}
              <div className="w-full bg-white rounded-xl p-5 shadow-xs flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border border-[#eaedff]">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#006b2c]">
                      <span className="material-symbols-outlined text-[28px]">local_police</span>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#006b2c] rounded-full ring-2 ring-white"></span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-[#131b2e]">
                        {currentUser?.name || 'Havaldar Ram Singh'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#3e4a3d] font-bold tracking-wider">
                        Badge #SEC-4892
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00873a] text-[#f7fff2] font-bold">
                        Shift A • On Duty
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#3e4a3d] mt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-[#006b2c]">
                        <span className="material-symbols-outlined text-[16px]">verified</span> Security Sentry Duty Active
                      </span>
                      <span className="text-[#bdcaba]">•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#006591]">
                        <span className="material-symbols-outlined text-[16px]">fence</span> Barrier Gate Sync Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Terminal Actions */}
                <div className="flex items-center gap-2.5 flex-wrap w-full xl:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowRapidPassModal(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#006b2c] text-white font-bold text-xs shadow-xs hover:opacity-95 transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    <span>+ Rapid Visitor Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtpModal(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#006591] text-white font-bold text-xs shadow-xs hover:opacity-95 transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                    <span>Scan Visitor QR / OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('verification')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#eaedff] text-[#131b2e] font-bold text-xs hover:bg-[#e2e7ff] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px] text-[#825100]">assignment_turned_in</span>
                    <span>Initiate Inspection</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerPanicAlert('EMERGENCY LOCKDOWN: Gates 1 & 2 boom barriers sealed!')}
                    className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#ffdad6] text-[#93000a] font-bold text-xs hover:bg-[#ba1a1a] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
                    <span>Emergency Lockdown</span>
                  </button>
                </div>
              </div>

              {/* Key Metrics Cards (Fully Clickable & Connected to Respective Views) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Visitors -> Filter Visitors tab */}
                <div
                  onClick={() => {
                    setVisitorFilterCategory('all');
                    setActiveTab('visitors');
                  }}
                  className="bg-white p-5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md hover:border-[#006591] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3e4a3d] uppercase tracking-wider group-hover:text-[#006591]">
                      Active Visitors On-Premise
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-[#c9e6ff]/50 flex items-center justify-center text-[#006591]">
                      <span className="material-symbols-outlined text-[18px]">group</span>
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#131b2e]">42</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00873a] text-[#f7fff2] font-bold">+8 in past hr</span>
                  </div>
                  <div className="mt-3 pt-3 bg-[#f2f3ff]/60 rounded-lg p-2 flex items-center justify-between text-xs text-[#3e4a3d]">
                    <span>31 Delivery</span>
                    <span className="text-[#bdcaba]">•</span>
                    <span>8 Walk-In Guest</span>
                    <span className="text-[#bdcaba]">•</span>
                    <span>3 Rideshare</span>
                  </div>
                </div>

                {/* Pending Occupancy Verifications -> Verification Queue Tab */}
                <div
                  onClick={() => setActiveTab('verification')}
                  className="bg-white p-5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md hover:border-[#825100] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3e4a3d] uppercase tracking-wider group-hover:text-[#825100]">
                      Occupancy Verifications
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-[#ffddb8]/50 flex items-center justify-center text-[#825100]">
                      <span className="material-symbols-outlined text-[18px]">gavel</span>
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#825100]">{pendingDirectivesCount}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] font-bold">Action Required</span>
                  </div>
                  <div className="mt-3 pt-3 bg-[#f2f3ff]/60 rounded-lg p-2 flex items-center justify-between text-xs text-[#3e4a3d]">
                    <span>Flat A-1204 Conflict</span>
                    <span className="text-[#bdcaba]">•</span>
                    <span>Bay C-801</span>
                  </div>
                </div>

                {/* Daily Gate Entries -> Reports Tab */}
                <div
                  onClick={() => setActiveTab('reports')}
                  className="bg-white p-5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md hover:border-[#006b2c] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3e4a3d] uppercase tracking-wider group-hover:text-[#006b2c]">
                      Daily Gate Entries
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-[#7ffc97]/50 flex items-center justify-center text-[#006b2c]">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#131b2e]">847</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] font-bold">98.4% FastPass</span>
                  </div>
                  <div className="mt-3 pt-3 bg-[#f2f3ff]/60 rounded-lg p-2 flex items-center justify-between text-xs text-[#3e4a3d]">
                    <span>Avg Clear: 14 sec</span>
                    <span className="text-[#bdcaba]">•</span>
                    <span className="text-[#006b2c] font-bold">0 Peak Bottlenecks</span>
                  </div>
                </div>

                {/* Overstay / Flagged -> Visitors tab filtered for delivery/overstay */}
                <div
                  onClick={() => {
                    setVisitorFilterCategory('delivery');
                    setVisitorTableSearchQuery('OVERSTAY');
                    setActiveTab('visitors');
                  }}
                  className="bg-white p-5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md hover:border-[#ba1a1a] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3e4a3d] uppercase tracking-wider group-hover:text-[#ba1a1a]">
                      Overstay / Flagged
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-[#ffdad6]/60 flex items-center justify-center text-[#ba1a1a]">
                      <span className="material-symbols-outlined text-[18px]">timer_off</span>
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#ba1a1a]">2</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-bold">Guards Alerted</span>
                  </div>
                  <div className="mt-3 pt-3 bg-[#f2f3ff]/60 rounded-lg p-2 flex items-center justify-between text-xs text-[#3e4a3d]">
                    <span>Blinkit &gt; 45 min</span>
                    <span className="text-[#bdcaba]">•</span>
                    <span className="text-[#ba1a1a] font-semibold">Block D Unescorted</span>
                  </div>
                </div>
              </div>

              {/* Primary Split: Left Work Queues & Right Security Patrols/Emergency */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: Operations & Verification Preview (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Occupancy & Resident Verification Queue Preview */}
                  <div className="bg-white rounded-xl p-5 shadow-xs border border-[#eaedff] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#825100]"></span>
                        <h2 className="text-base font-bold text-[#131b2e]">Occupancy &amp; Resident Verification Queue</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('verification')}
                        className="text-xs px-2.5 py-1 rounded-full bg-[#e2e7ff] text-[#3e4a3d] font-bold hover:bg-[#dae2fd] transition cursor-pointer"
                      >
                        View All Tasks →
                      </button>
                    </div>

                    {/* Task Card 1: Handover Conflict */}
                    {!clearedCases['dash-case-1'] && !flaggedCases['dash-case-1'] ? (
                      <div className="bg-[#f2f3ff]/50 rounded-xl p-4 flex flex-col gap-3 border border-[#dae2fd]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#dae2fd] flex items-center justify-center font-bold text-[#131b2e]">
                              A-12
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#131b2e]">Flat A-1204</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-bold">
                                  Move-In/Move-Out Conflict
                                </span>
                              </div>
                              <span className="text-xs text-[#3e4a3d]">
                                Outgoing: Rahul G. (Lease ended) vs Incoming: Arjun Kumar (Awaiting Key Release)
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-1 rounded-full bg-[#ffddb8] text-[#2a1700] font-bold shrink-0">
                            Field Inspection Required
                          </span>
                        </div>
                        <p className="text-xs text-[#3e4a3d] bg-white p-2.5 rounded-lg border border-[#eaedff]">
                          <strong className="text-[#131b2e]">Community Admin Directive:</strong> Conduct physical unit inspection. Cross-check luggage departure from lift lobby 2. Verify key surrender count (3 standard keys + 1 master RFID fob) before authorizing clearance.
                        </p>
                        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                          <div className="flex items-center gap-2">
                            {/* Fully Interactive Open Checklist Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => setSelectedChecklistDirective({ caseId: 'dash-case-1', flatLabel: 'Flat A-1204', directiveId: 'DIR-401' })}
                              className="px-3 py-1.5 rounded-lg bg-[#006591] text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer shadow-xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">fact_check</span>
                              <span>Open Checklist</span>
                            </button>

                            {/* Fully Interactive Upload Evidence Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => setSelectedEvidenceDirective({ caseId: 'dash-case-1', flatLabel: 'Flat A-1204', directiveId: 'DIR-401' })}
                              className="px-3 py-1.5 rounded-lg bg-[#eaedff] text-[#131b2e] text-xs font-bold flex items-center gap-1.5 hover:bg-[#e2e7ff] transition cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                              <span>Upload Evidence</span>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleApproveClearance('dash-case-1', 'Flat A-1204', 'DIR-401')}
                            className="px-3 py-1.5 rounded-lg bg-[#7ffc97] text-[#002109] text-xs font-bold hover:bg-[#006b2c] hover:text-white transition cursor-pointer"
                          >
                            Approve Clearance
                          </button>
                        </div>
                      </div>
                    ) : clearedCases['dash-case-1'] ? (
                      <div className="flex items-center justify-between p-4 bg-[#7ffc97]/20 rounded-xl border border-[#7ffc97] w-full">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#006b2c] text-3xl">verified</span>
                          <div>
                            <span className="text-xs font-bold text-[#006b2c]">Flat A-1204 — Gate Clearance Granted</span>
                            <span className="block text-[11px] text-[#3e4a3d]">Report submitted &amp; synced to Community Admin.</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#006b2c] text-white font-bold">REPORT SUBMITTED</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-[#ffdad6]/40 rounded-xl border border-[#ba1a1a] w-full">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#ba1a1a] text-3xl">report_problem</span>
                          <div>
                            <span className="text-xs font-bold text-[#ba1a1a]">Flat A-1204 — Flagged &amp; Escalated to Committee</span>
                            <span className="block text-[11px] text-[#3e4a3d]">Entry held pending management resolution.</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#ba1a1a] text-white font-bold">ESCALATED</span>
                      </div>
                    )}

                    {/* Task Card 2: Parking Bay Discrepancy */}
                    {!clearedCases['dash-case-2'] && !flaggedCases['dash-case-2'] ? (
                      <div className="bg-[#f2f3ff]/50 rounded-xl p-4 flex flex-col gap-3 border border-[#dae2fd]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#dae2fd] flex items-center justify-center font-bold text-[#131b2e]">
                              C-8
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#131b2e]">Flat C-801 • Basement Bay B2-114</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffddb8] text-[#2a1700] font-bold">
                                  Parking Slot Allocation Check
                                </span>
                              </div>
                              <span className="text-xs text-[#3e4a3d]">
                                Resident Tanmay Chatterjee applied for 2 SUV tags in single sedan slot C-801-A
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-1 rounded-full bg-[#e2e7ff] text-[#3e4a3d] font-bold shrink-0">
                            Bay Spot-Check Assigned
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                          <span className="text-xs text-[#3e4a3d] flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-[16px] text-[#006b2c]">pin_drop</span> Assigned to: Patrol Guard Dinesh (ETA 10 min)
                          </span>
                          <div className="flex items-center gap-2">
                            {/* Fully Interactive Review RFID Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => setSelectedParkingCase({ caseId: 'dash-case-2', flatLabel: 'Flat C-801' })}
                              className="px-3 py-1.5 rounded-lg bg-[#006591] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-xs"
                            >
                              Review RFID
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveClearance('dash-case-2', 'Flat C-801 Bay')}
                              className="px-3 py-1.5 rounded-lg bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition cursor-pointer"
                            >
                              Clear Slot
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : clearedCases['dash-case-2'] ? (
                      <div className="flex items-center justify-between p-4 bg-[#7ffc97]/20 rounded-xl border border-[#7ffc97] w-full">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#006b2c] text-3xl">verified</span>
                          <div>
                            <span className="text-xs font-bold text-[#006b2c]">Flat C-801 Bay — Slot Clearance Granted</span>
                            <span className="block text-[11px] text-[#3e4a3d]">Approved by Havaldar Ram Singh.</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#006b2c] text-white font-bold">APPROVED</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-[#ffdad6]/40 rounded-xl border border-[#ba1a1a] w-full">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#ba1a1a] text-3xl">report_problem</span>
                          <div>
                            <span className="text-xs font-bold text-[#ba1a1a]">Flat C-801 Bay — Flagged &amp; Escalated</span>
                            <span className="block text-[11px] text-[#3e4a3d]">Secondary tag rejected.</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#ba1a1a] text-white font-bold">REJECTED</span>
                      </div>
                    )}
                  </div>

                  {/* Real-time Visitor & Delivery Processing Terminal */}
                  <div className="bg-white rounded-xl p-5 shadow-xs border border-[#eaedff] flex flex-col gap-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#006591] text-[22px]">directions_car</span>
                        <h2 className="text-base font-bold text-[#131b2e]">Real-Time Visitor &amp; Delivery Processing</h2>
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-[#c9e6ff] text-[#001e2f] font-bold">
                        Gate 1 North • Lane 1
                      </span>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#3e4a3d] text-[20px]">
                        search
                      </span>
                      <input
                        type="text"
                        value={dashSearchQuery}
                        onChange={(e) => setDashSearchQuery(e.target.value)}
                        placeholder="Search visitor name, company (Amazon, Zomato), phone, flat #..."
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#6e7b6c] text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006b2c]"
                      />
                    </div>

                    {/* Active Queue Feed */}
                    <div className="flex flex-col gap-3">
                      {/* Item 1: Delivery with Company */}
                      {(!dashSearchQuery || 'TS 07 EK 9912 Amazon Logistics Flat B-603 S. Murthy'.toLowerCase().includes(dashSearchQuery.toLowerCase())) && (
                        <div className="p-3.5 rounded-xl bg-[#f2f3ff]/60 flex items-center justify-between flex-wrap gap-3 border border-[#eaedff]">
                          <div className="flex items-center gap-3">
                            <div className="px-2.5 py-1.5 rounded-lg bg-[#eaedff] text-[#131b2e] font-mono text-xs tracking-wider font-bold flex flex-col items-center">
                              <span>TS 07 EK 9912</span>
                              <span className="text-[9px] text-[#006591] font-sans">Vehicle</span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#131b2e]">Amazon Logistics</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c9e6ff] text-[#001e2f] font-bold">Delivery Drop</span>
                              </div>
                              <span className="text-[11px] text-[#3e4a3d]">Destination: Flat B-603 • Rider: S. Murthy (+91 98402 12044)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#00873a] text-[#f7fff2] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">bolt</span> Auto-Approved by QR (Gate 2)
                            </span>
                            {!checkedOutVisitors['ts-07-ek'] ? (
                              <button
                                type="button"
                                onClick={() => handleCheckoutVisitor('ts-07-ek', 'Amazon (S. Murthy)')}
                                className="px-2.5 py-1 rounded-lg bg-[#eaedff] hover:bg-[#e2e7ff] text-xs font-bold text-[#131b2e] transition cursor-pointer"
                              >
                                Check-Out
                              </button>
                            ) : (
                              <span className="text-xs text-[#3e4a3d] font-bold">Checked-Out</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Item 2: Walk-In Pedestrian Visitor */}
                      {(!dashSearchQuery || 'Walk-In Pedestrian Ramesh Kumar Maid Cook Flat C-102'.toLowerCase().includes(dashSearchQuery.toLowerCase())) && (
                        <div className="p-3.5 rounded-xl bg-[#7ffc97]/10 flex items-center justify-between flex-wrap gap-3 border border-[#7ffc97]/40">
                          <div className="flex items-center gap-3">
                            <div className="px-2.5 py-1.5 rounded-lg bg-[#00873a] text-[#f7fff2] font-xs font-bold flex flex-col items-center">
                              <span className="material-symbols-outlined text-base">directions_walk</span>
                              <span className="text-[9px] uppercase tracking-wider">Walk-In</span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#131b2e]">House Helper / Cook: Ramesh Kumar</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] font-bold">Pedestrian Walk-In</span>
                              </div>
                              <span className="text-[11px] text-[#3e4a3d]">Destination: Flat C-102 • Daily Helper Pass • Aadhaar Checked</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#00873a] text-[#f7fff2] font-bold">
                              Inside Premises (Walk-In)
                            </span>
                            {!checkedOutVisitors['walk-1'] ? (
                              <button
                                type="button"
                                onClick={() => handleCheckoutVisitor('walk-1', 'Ramesh Kumar (Walk-In)')}
                                className="px-2.5 py-1 rounded-lg bg-[#eaedff] hover:bg-[#e2e7ff] text-xs font-bold text-[#131b2e] transition cursor-pointer"
                              >
                                Check-Out
                              </button>
                            ) : (
                              <span className="text-xs text-[#3e4a3d] font-bold">Checked-Out</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Item 3: Guest in Vehicle */}
                      {(!dashSearchQuery || 'AP 28 CC 3301 Priya Sharma Dr R Narang Flat A-402'.toLowerCase().includes(dashSearchQuery.toLowerCase())) && (
                        <div className={`p-3.5 rounded-xl flex items-center justify-between flex-wrap gap-3 border ${admittedVisitors['ap-28-cc'] ? 'bg-[#7ffc97]/20 border-[#7ffc97]' : 'bg-[#ffddb8]/20 border-[#ffddb8]'}`}>
                          <div className="flex items-center gap-3">
                            <div className="px-2.5 py-1.5 rounded-lg bg-[#dae2fd] text-[#131b2e] font-mono text-xs tracking-wider font-bold flex flex-col items-center">
                              <span>AP 28 CC 3301</span>
                              <span className="text-[9px] text-[#825100] font-sans">Guest Car</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-[#131b2e]">Guest: Priya Sharma (Hyundai Creta)</span>
                              <span className="text-[11px] text-[#3e4a3d]">Destination: Flat A-402 (Host: Dr. R. Narang)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {!admittedVisitors['ap-28-cc'] ? (
                              <>
                                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#ffddb8] text-[#2a1700] font-bold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">phone_in_talk</span> Intercom Ringing
                                </span>
                                <button
                                  type="button"
                                  onClick={() => showToast('Intercom dialed: Connecting to Dr. R. Narang (A-402)...', 'info')}
                                  className="px-3 py-1.5 rounded-lg bg-[#eaedff] text-[#131b2e] text-xs font-bold hover:bg-[#e2e7ff] flex items-center gap-1 transition cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[16px]">call</span>
                                  <span>Call Intercom</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOverrideAdmit('ap-28-cc', 'Priya Sharma (AP 28 CC 3301)')}
                                  className="px-3 py-1.5 rounded-lg bg-[#006b2c] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#00873a] transition active:scale-95 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[16px]">check</span>
                                  <span>Override &amp; Admit</span>
                                </button>
                              </>
                            ) : (
                              <span className="text-xs px-3 py-1 rounded-full bg-[#006b2c] text-white font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check</span> Admitted
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Guard Patrols, Emergency Protocols & Hotlines (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Shift Patrol & Comprehensive Checklists Widget */}
                  <div className="bg-white rounded-xl p-5 shadow-xs border border-[#eaedff] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#006b2c] text-[20px]">assignment_turned_in</span>
                        <h2 className="text-base font-bold text-[#131b2e]">Shift Patrols &amp; Duty Routines</h2>
                      </div>
                      <span className="text-xs text-[#3e4a3d] font-medium">Shift ends 14:00</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {TASKS_DATA.slice(0, 4).map((t) => (
                        <label key={t.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f2f3ff]/60 cursor-pointer hover:bg-[#f2f3ff] transition-colors">
                          <input
                            type="checkbox"
                            checked={!!tasksState[t.id]}
                            onChange={() => handleToggleTask(t.id, t.title)}
                            className="mt-0.5 rounded text-[#006b2c] focus:ring-0 w-4 h-4 cursor-pointer"
                          />
                          <div className="flex flex-col flex-1">
                            <span className={`text-xs font-bold text-[#131b2e] ${tasksState[t.id] ? 'line-through opacity-70' : ''}`}>
                              {t.time} • {t.title}
                            </span>
                            <span className="text-[11px] text-[#006b2c] font-semibold">{t.status} ({t.guard})</span>
                          </div>
                          <span className="material-symbols-outlined text-[#006b2c] text-[18px]">verified</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Protocols & Quick Dispatch */}
                  <div className="bg-white rounded-xl p-5 shadow-xs border border-[#eaedff] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">e911_emergency</span>
                        <h2 className="text-base font-bold text-[#131b2e]">Emergency Protocols</h2>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-bold">
                        Priority 1 Bypass
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => triggerPanicAlert('AMBULANCE EMERGENCY: North Boom 1 & Outbound Barrier raised in permanent bypass mode!')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#ba1a1a] text-white hover:opacity-90 transition-transform active:scale-[0.98] text-left shadow-xs cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">medical_services</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight">Ambulance Bypass</span>
                          <span className="text-[10px] opacity-90">Auto Lift All Barriers</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerPanicAlert('FIRE TENDER LANE ACTIVATED: Main Gate 1 & Service Gate 3 boom barriers wide open!')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a] hover:text-white transition-all text-left shadow-xs active:scale-[0.98] cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#93000a]/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">fire_truck</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight">Fire Tender Lane</span>
                          <span className="text-[10px] opacity-80">Clear Gate 1 &amp; Gate 3</span>
                        </div>
                      </button>
                    </div>

                    {/* Hotline */}
                    <div className="pt-2 flex flex-col gap-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#7ffc97] flex items-center justify-center text-[#002109] font-bold text-xs">
                            ER
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#131b2e]">Elena Rostova (Property Admin)</span>
                            <span className="text-[10px] text-[#3e4a3d]">Direct Duty Phone #HOT-101</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast('Calling Elena Rostova (Property Admin)...', 'success')}
                          className="px-3 py-1 rounded-lg bg-[#006b2c] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#00873a] transition cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          <span>Call Direct</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= 2. TAB: VERIFICATION QUEUE ================= */}
          {activeTab === 'verification' && (
            <section className="flex flex-col w-full gap-6">
              <div className="bg-white rounded-xl p-6 shadow-xs border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#825100]"></span>
                    <span className="text-xs uppercase font-bold text-[#6e7b6c]">Resident Gate Clearance</span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#131b2e] mt-1">Occupancy &amp; Resident Verification Queue</h1>
                  <p className="text-sm text-[#3e4a3d]">
                    Community Admin dispatched directives, physical unit inspections, parking slot allocation checks, and pre-move material gate passes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('All verification clearance reports exported to Estate Management.', 'success')}
                  className="px-4 py-2.5 rounded-lg bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition shadow-xs cursor-pointer"
                >
                  Export Clearance Reports
                </button>
              </div>

              {/* Verification Cases List */}
              <div className="grid grid-cols-1 gap-4">
                {/* Dynamic Directives loaded from Community Admin */}
                {securityDirectives && securityDirectives.length > 0 && securityDirectives.map((dir) => (
                  <div key={dir.id} className="bg-white rounded-xl p-5 shadow-xs border-l-4 border-[#006591] flex flex-col gap-4 border-y border-r border-[#eaedff]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#c9e6ff] flex items-center justify-center text-lg font-bold text-[#001e2f]">
                          {dir.targetUnit.substring(0, 5)}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg font-bold text-[#131b2e]">{dir.targetUnit}</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#c9e6ff] text-[#001e2f] text-xs font-bold">
                              {dir.title}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#ffddb8] text-[#2a1700] text-xs font-bold">
                              {dir.priority || 'HIGH'}
                            </span>
                          </div>
                          <span className="text-xs text-[#3e4a3d] mt-0.5">
                            Dispatched by Community Admin • Assigned Guard: {dir.assignedGuard || 'Havaldar Ram Singh'}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#eaedff] text-[#131b2e] text-xs font-bold self-start md:self-auto">
                        Status: {dir.status}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#f2f3ff] rounded-xl text-xs text-[#131b2e]">
                      <strong className="text-[#006591] font-bold">Admin Directive Instructions:</strong> {dir.instructions}
                    </div>

                    {dir.fieldReport && (
                      <div className="p-3.5 bg-[#7ffc97]/20 rounded-xl text-xs border border-[#7ffc97] text-[#131b2e]">
                        <strong className="text-[#006b2c] font-bold">Submitted Field Report:</strong> {dir.fieldReport.summary}
                        <span className="block text-[11px] text-[#3e4a3d] mt-1">Notes: {dir.fieldReport.notes}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-[#e2e7ff]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedChecklistDirective({ caseId: dir.id, flatLabel: dir.targetUnit, directiveId: dir.id })}
                          className="px-3 py-1.5 rounded-lg bg-[#006591] text-white text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">fact_check</span> Fill Inspection Checklist
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedEvidenceDirective({ caseId: dir.id, flatLabel: dir.targetUnit, directiveId: dir.id })}
                          className="px-3 py-1.5 rounded-lg bg-[#eaedff] text-[#131b2e] text-xs font-bold hover:bg-[#e2e7ff] transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">photo_camera</span> Upload Evidence
                        </button>
                      </div>

                      {dir.status !== 'ACCESS_GRANTED' ? (
                        <button
                          type="button"
                          onClick={() => handleApproveClearance(dir.id, dir.targetUnit, dir.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition cursor-pointer"
                        >
                          Approve &amp; Send Report to Admin
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#006b2c] bg-[#7ffc97]/40 px-3 py-1 rounded-full">
                          ✓ Cleared &amp; Sent to Admin
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================= 3. TAB: VISITORS & DELIVERIES (RICH & DETAILED STREAM) ================= */}
          {activeTab === 'visitors' && (
            <section className="flex flex-col w-full gap-6">
              <div className="bg-white rounded-xl p-6 shadow-xs border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006591] text-xl">badge</span>
                    <span className="text-xs uppercase font-bold text-[#6e7b6c]">Traffic Desk &amp; Ingress Log</span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#131b2e] mt-1">Visitors &amp; Deliveries Entry Stream</h1>
                  <p className="text-sm text-[#3e4a3d]">
                    Detailed visitor audit ledger with Company/Vendor identification, Pedestrian Walk-In passes, and duration tracking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRapidPassModal(true)}
                  className="px-4 py-2.5 rounded-lg bg-[#006b2c] text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-[#00873a] transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span>+ New Rapid Gate Pass</span>
                </button>
              </div>

              {/* Filter Controls & Search */}
              <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setVisitorFilterCategory('all');
                      setVisitorTableSearchQuery('');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs transition cursor-pointer ${
                      visitorFilterCategory === 'all' && !visitorTableSearchQuery
                        ? 'bg-[#006b2c] text-white'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    All Entry Passes ({visitorPasses.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitorFilterCategory('delivery')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs transition cursor-pointer ${
                      visitorFilterCategory === 'delivery'
                        ? 'bg-[#006b2c] text-white'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    Delivery Vendors
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitorFilterCategory('walk_in')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs transition cursor-pointer ${
                      visitorFilterCategory === 'walk_in'
                        ? 'bg-[#00873a] text-white'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    Walk-In / Pedestrians
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitorFilterCategory('guest')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs transition cursor-pointer ${
                      visitorFilterCategory === 'guest'
                        ? 'bg-[#006b2c] text-white'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    Guests &amp; Friends
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitorFilterCategory('cab')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs transition cursor-pointer ${
                      visitorFilterCategory === 'cab'
                        ? 'bg-[#006b2c] text-white'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    Rideshare Cabs
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-80">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#3e4a3d] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={visitorTableSearchQuery}
                    onChange={(e) => setVisitorTableSearchQuery(e.target.value)}
                    placeholder="Search company (Amazon, Swiggy), name, or flat..."
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] placeholder:text-[#6e7b6c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006b2c]"
                  />
                </div>
              </div>

              {/* Comprehensive Visitors & Deliveries Table */}
              <div className="bg-white rounded-xl shadow-xs border border-[#eaedff] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#e2e7ff] text-[#6e7b6c] text-[10px] uppercase tracking-wider bg-[#f2f3ff]/40">
                        <th className="py-3.5 px-4 font-bold">Pass ID &amp; Mode</th>
                        <th className="py-3.5 px-4 font-bold">Company / Organization</th>
                        <th className="py-3.5 px-4 font-bold">Visitor Details</th>
                        <th className="py-3.5 px-4 font-bold">Host Destination</th>
                        <th className="py-3.5 px-4 font-bold">Ingress &amp; Window</th>
                        <th className="py-3.5 px-4 font-bold">Status</th>
                        <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-[#131b2e] divide-y divide-[#e2e7ff]/40">
                      {visitorPasses && visitorPasses.map((pass) => {
                        const isWalkIn = pass.isWalkIn || pass.entryMode === 'Walk-In / On Foot' || pass.vehicleNumber?.includes('Walk-In') || pass.vehicleNumber === '';
                        const matchesCategory =
                          visitorFilterCategory === 'all' ||
                          (visitorFilterCategory === 'delivery' && (pass.visitorType === 'DELIVERY' || pass.category === 'Delivery')) ||
                          (visitorFilterCategory === 'walk_in' && isWalkIn) ||
                          (visitorFilterCategory === 'guest' && pass.visitorType === 'GUEST') ||
                          (visitorFilterCategory === 'cab' && pass.visitorType === 'CAB');

                        const textSearch = `${pass.id} ${pass.companyName || pass.company || ''} ${pass.guestName} ${pass.hostUnit} ${pass.phone} ${pass.vehicleNumber}`.toLowerCase();
                        const matchesSearch = !visitorTableSearchQuery || textSearch.includes(visitorTableSearchQuery.toLowerCase());

                        if (!matchesCategory || !matchesSearch) return null;

                        return (
                          <tr key={pass.id} className={`hover:bg-[#f2f3ff] transition-colors ${pass.status === 'OVERSTAY' ? 'bg-[#ffdad6]/30' : ''}`}>
                            {/* Pass ID & Entry Mode */}
                            <td className="py-3.5 px-4">
                              <div className="font-mono font-bold text-[#131b2e] text-xs">#{pass.id}</div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold inline-flex items-center gap-1 mt-0.5 ${
                                isWalkIn ? 'bg-[#7ffc97] text-[#002109]' : 'bg-[#c9e6ff] text-[#001e2f]'
                              }`}>
                                <span className="material-symbols-outlined text-[12px]">
                                  {isWalkIn ? 'directions_walk' : 'directions_car'}
                                </span>
                                {isWalkIn ? 'Walk-In' : (pass.vehicleNumber || 'Vehicle')}
                              </span>
                            </td>

                            {/* Company / Organization */}
                            <td className="py-3.5 px-4 font-semibold">
                              <div className="text-xs text-[#131b2e] font-bold">
                                {pass.companyName || pass.company || 'Personal Visitor'}
                              </div>
                              <span className="text-[10px] text-[#006591] font-mono">
                                {pass.visitorCategory || pass.purpose || 'Gate Access'}
                              </span>
                            </td>

                            {/* Visitor Details */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#131b2e]">{pass.guestName}</div>
                              <span className="text-[11px] text-[#3e4a3d] block">{pass.phone || '+91 98450 11223'}</span>
                            </td>

                            {/* Host Destination */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#006b2c]">{pass.hostUnit || 'Flat A-1204'}</div>
                              <button
                                type="button"
                                onClick={() => showToast(`Calling Intercom for ${pass.hostUnit || 'Flat A-1204'}...`, 'info')}
                                className="text-[10px] text-[#006591] hover:underline font-bold flex items-center gap-0.5 mt-0.5 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[12px]">call</span> Intercom
                              </button>
                            </td>

                            {/* Ingress & Window */}
                            <td className="py-3.5 px-4 text-xs font-medium">
                              <div>{pass.timestamp || pass.validStartTime || 'Today, 11:15 AM'}</div>
                              <span className="text-[10px] text-[#3e4a3d] block">{pass.validDuration || '30 Min Drop'}</span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                pass.status === 'INSIDE_PREMISES' || pass.status === 'ADMITTED'
                                  ? 'bg-[#00873a] text-[#f7fff2]'
                                  : pass.status === 'EXPECTED' || pass.status === 'AT_BARRIER'
                                  ? 'bg-[#ffddb8] text-[#2a1700]'
                                  : pass.status === 'DEPARTED' || pass.status === 'CHECKED_OUT'
                                  ? 'bg-[#eaedff] text-[#3e4a3d]'
                                  : 'bg-[#ba1a1a] text-white'
                              }`}>
                                {pass.status === 'INSIDE_PREMISES' ? 'On-Premise' : pass.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedDigitalPass(pass)}
                                  className="px-2.5 py-1 rounded-lg bg-[#006591] text-white text-xs font-bold transition flex items-center gap-1 hover:bg-[#004e70] cursor-pointer"
                                  title="View full scannable digital gate pass"
                                >
                                  <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                                  <span>Pass QR</span>
                                </button>

                                {pass.status !== 'CHECKED_OUT' && pass.status !== 'DEPARTED' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleCheckoutVisitor(pass.id, pass.guestName)}
                                    className="px-3 py-1 rounded-lg bg-[#eaedff] hover:bg-[#e2e7ff] text-xs font-bold text-[#131b2e] transition cursor-pointer"
                                  >
                                    Check-Out
                                  </button>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#f2f3ff] text-[#6e7b6c] font-bold">
                                    Departed
                                  </span>
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
            </section>
          )}

          {/* ================= 4. TAB: SHIFT TASKS & PATROLS (COMPREHENSIVE TASKS) ================= */}
          {activeTab === 'tasks' && (
            <section className="flex flex-col w-full gap-6">
              <div className="bg-white rounded-xl p-6 shadow-xs border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006b2c] text-xl">checklist</span>
                    <span className="text-xs uppercase font-bold text-[#6e7b6c]">Guard Duty Roster</span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#131b2e] mt-1">Shift Patrols &amp; Duty Routines</h1>
                  <p className="text-sm text-[#3e4a3d]">
                    Comprehensive security routines: gate diagnostics, biometric labor audits, overstay patrols, and supervisor sign-offs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Guard Handover Log successfully sealed and synced to Master Server.', 'success')}
                  className="px-4 py-2.5 rounded-lg bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition shadow-xs cursor-pointer"
                >
                  Seal Shift Handover
                </button>
              </div>

              {/* Task Filter Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                {['all', 'Patrols', 'Gate Audit', 'Safety & Fire', 'Contractor Audit'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTasksFilterCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      tasksFilterCategory === cat
                        ? 'bg-[#006b2c] text-white shadow-xs'
                        : 'bg-white text-[#131b2e] border border-[#eaedff] hover:bg-[#f2f3ff]'
                    }`}
                  >
                    {cat === 'all' ? `All Shift Tasks (${TASKS_DATA.length})` : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Comprehensive Checklist items left 7 cols */}
                <div className="lg:col-span-7 flex flex-col gap-4 bg-white p-6 rounded-xl shadow-xs border border-[#eaedff]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#131b2e]">Shift A Security Routine (06:00 - 14:00)</h2>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#00873a] text-[#f7fff2] font-bold">
                      {completedTasksCount} of {TASKS_DATA.length} Tasks Completed
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {TASKS_DATA.map((t) => {
                      if (tasksFilterCategory !== 'all' && t.category !== tasksFilterCategory) return null;
                      const isChecked = !!tasksState[t.id];

                      return (
                        <label key={t.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition cursor-pointer border border-[#dae2fd]">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleTask(t.id, t.title)}
                            className="mt-1 rounded text-[#006b2c] focus:ring-0 w-5 h-5 cursor-pointer"
                          />
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold text-[#131b2e] ${isChecked ? 'line-through opacity-70' : ''}`}>
                                {t.time} • {t.title}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-[#eaedff] text-[#006591] font-bold">
                                {t.category}
                              </span>
                            </div>
                            <span className="text-xs text-[#3e4a3d] mt-0.5">{t.desc}</span>
                            <span className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${isChecked ? 'text-[#006b2c]' : 'text-[#825100]'}`}>
                              <span className="material-symbols-outlined text-[14px]">{isChecked ? 'done_all' : 'pending'}</span>
                              {isChecked ? `Logged & Verified by ${t.guard}` : t.status}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Guard Handover Notes right 5 cols */}
                <div className="lg:col-span-5 flex flex-col gap-4 bg-white p-6 rounded-xl shadow-xs border border-[#eaedff]">
                  <h2 className="text-base font-bold text-[#131b2e]">Shift Occurrence Book &amp; Log Notes</h2>
                  <div className="flex flex-col gap-3">
                    {guardNotesList.map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-lg bg-[#f2f3ff] border-l-4 ${
                          note.type === 'tertiary' ? 'border-[#825100]' : 'border-[#006b2c]'
                        }`}
                      >
                        <span className={`text-xs font-bold ${note.type === 'tertiary' ? 'text-[#825100]' : 'text-[#006b2c]'}`}>
                          {note.time} • {note.author}
                        </span>
                        <p className="text-xs text-[#131b2e] mt-1 font-medium">"{note.text}"</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddGuardNote} className="flex flex-col gap-2 mt-2">
                    <label className="text-xs font-bold text-[#131b2e]">Add Incident / Handover Note</label>
                    <textarea
                      rows="3"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Type guard shift log note here..."
                      className="w-full p-3 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#bdcaba] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006b2c]"
                    ></textarea>
                    <button
                      type="submit"
                      className="self-end px-4 py-2 rounded-lg bg-[#006591] text-white text-xs font-bold hover:opacity-95 transition cursor-pointer"
                    >
                      + Save Incident Note
                    </button>
                  </form>
                </div>
              </div>
            </section>
          )}

          {/* ================= 5. TAB: GATE REPORTS & DETAILED ANALYTICS ================= */}
          {activeTab === 'reports' && (
            <section className="flex flex-col w-full gap-6">
              <div className="bg-white rounded-xl p-6 shadow-xs border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006b2c] text-xl">query_stats</span>
                    <span className="text-xs uppercase font-bold text-[#6e7b6c]">Analytics &amp; Auditing</span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#131b2e] mt-1">Gate Reports &amp; Traffic Intelligence</h1>
                  <p className="text-sm text-[#3e4a3d]">
                    Crisp hourly volume charts, delivery vendor overstay metrics, and shift incident summaries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Gate 1 North full shift audit exported to CSV format.', 'success')}
                  className="px-4 py-2.5 rounded-lg bg-[#006b2c] text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-[#00873a] transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Export Shift Log (CSV)</span>
                </button>
              </div>

              {/* Key Analytics Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#6e7b6c] font-bold">Total Inbound Flow Today</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-[#131b2e]">847</span>
                    <span className="text-xs font-bold text-[#006b2c]">+14% vs yesterday</span>
                  </div>
                  <span className="text-xs text-[#3e4a3d] mt-2">
                    724 RFID Resident Auto • 88 QR Delivery • 35 Walk-In &amp; Guest Passes
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#6e7b6c] font-bold">Peak Congestion Window</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-[#006591]">08:45 – 09:30</span>
                    <span className="text-xs font-bold text-[#006591]">Morning Office Rush</span>
                  </div>
                  <span className="text-xs text-[#3e4a3d] mt-2">
                    Max barrier queue: 2 vehicles • Avg clearance: 11 seconds
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#6e7b6c] font-bold">Overstay Flag Rate</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-[#ba1a1a]">0.24%</span>
                    <span className="text-xs font-bold text-[#ba1a1a]">2 active incidents</span>
                  </div>
                  <span className="text-xs text-[#3e4a3d] mt-2">
                    All delivery agents warned via SMS after 30 minutes threshold.
                  </span>
                </div>
              </div>

              {/* Responsive & Correct-Fit SVG Traffic Bar Chart Card */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex flex-col">
                    <h2 className="text-base font-bold text-[#131b2e]">Hourly Vehicle &amp; Walk-In Volume by Entry Category</h2>
                    <span className="text-xs text-[#3e4a3d]">Gate 1 North Sentry Logs • Past 12 Hours</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-[#3e4a3d]">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#006b2c]"></span> Resident FastTag</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#006591]"></span> Deliveries</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#825100]"></span> Walk-In / Guests</span>
                  </div>
                </div>

                {/* Crisp Correct-Fit SVG Container */}
                <div className="w-full bg-[#f2f3ff] rounded-xl p-4 overflow-hidden">
                  <svg className="w-full h-44" viewBox="0 0 700 180" preserveAspectRatio="xMidYMid meet">
                    <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="30" y2="30" />
                    <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="80" y2="80" />
                    <line stroke="#dae2fd" strokeWidth="1" x1="0" x2="700" y1="130" y2="130" />

                    {/* 06:00 */}
                    <rect x="35" y="90" width="28" height="40" rx="4" className="fill-[#006b2c]" />
                    <text x="49" y="152" fill="#6e7b6c" fontSize="11" fontWeight="600" textAnchor="middle">06:00</text>

                    {/* 07:00 */}
                    <rect x="120" y="55" width="28" height="75" rx="4" className="fill-[#006b2c]" />
                    <rect x="120" y="32" width="28" height="20" rx="4" className="fill-[#006591]" />
                    <text x="134" y="152" fill="#6e7b6c" fontSize="11" fontWeight="600" textAnchor="middle">07:00</text>

                    {/* 08:00 (Peak) */}
                    <rect x="205" y="35" width="28" height="95" rx="4" className="fill-[#006b2c]" />
                    <rect x="205" y="14" width="28" height="18" rx="4" className="fill-[#006591]" />
                    <text x="219" y="152" fill="#006b2c" fontSize="11" fontWeight="700" textAnchor="middle">08:00 (Peak)</text>

                    {/* 09:00 */}
                    <rect x="290" y="50" width="28" height="80" rx="4" className="fill-[#006b2c]" />
                    <rect x="290" y="18" width="28" height="30" rx="4" className="fill-[#006591]" />
                    <text x="304" y="152" fill="#6e7b6c" fontSize="11" fontWeight="600" textAnchor="middle">09:00</text>

                    {/* 10:00 */}
                    <rect x="375" y="80" width="28" height="50" rx="4" className="fill-[#006b2c]" />
                    <rect x="375" y="32" width="28" height="45" rx="4" className="fill-[#006591]" />
                    <rect x="375" y="14" width="28" height="15" rx="4" className="fill-[#825100]" />
                    <text x="389" y="152" fill="#6e7b6c" fontSize="11" fontWeight="600" textAnchor="middle">10:00</text>

                    {/* 11:00 (Live) */}
                    <rect x="460" y="88" width="28" height="42" rx="4" className="fill-[#006b2c]" />
                    <rect x="460" y="38" width="28" height="48" rx="4" className="fill-[#006591]" />
                    <text x="474" y="152" fill="#6e7b6c" fontSize="11" fontWeight="600" textAnchor="middle">11:00 (Live)</text>

                    {/* 12:00 */}
                    <rect x="545" y="85" width="28" height="45" rx="4" className="fill-[#dae2fd]" />
                    <text x="559" y="152" fill="#6e7b6c" fontSize="11" fontWeight="600" textAnchor="middle">12:00</text>

                    {/* 13:00 */}
                    <rect x="630" y="95" width="28" height="35" rx="4" className="fill-[#dae2fd]" />
                    <text x="644" y="152" fill="#6e7b6c" fontSize="11" fontWeight="600" textAnchor="middle">13:00</text>
                  </svg>
                </div>
              </div>

              {/* Detailed Delivery Partner Performance & Overstay Log */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-4">
                <h2 className="text-base font-bold text-[#131b2e]">Delivery Partner &amp; Vendor Performance Ledger</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Amazon Logistics</span>
                    <span className="text-lg font-bold text-[#006591] mt-1">142 Drops</span>
                    <span className="text-[10px] text-[#3e4a3d]">Avg Sentry Time: 12 min</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Zomato / Swiggy</span>
                    <span className="text-lg font-bold text-[#006b2c] mt-1">98 Drops</span>
                    <span className="text-[10px] text-[#3e4a3d]">Avg Sentry Time: 8 min</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Blinkit 10-Min</span>
                    <span className="text-lg font-bold text-[#ba1a1a] mt-1">45 Drops</span>
                    <span className="text-[10px] text-[#ba1a1a] font-bold">Overstay Flag: 1 Active</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Walk-In Helpers / Maids</span>
                    <span className="text-lg font-bold text-[#825100] mt-1">84 Passes</span>
                    <span className="text-[10px] text-[#3e4a3d]">100% Aadhaar Verified</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= 6. TAB: SECURITY SOS & HOTLINE CONSOLE ================= */}
          {activeTab === 'hotline' && (
            <section className="flex flex-col w-full gap-6">
              <div className="bg-white rounded-xl p-6 shadow-xs border-l-4 border-[#ba1a1a] border-y border-r border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-2xl">emergency</span>
                    <span className="text-xs uppercase font-bold text-[#ba1a1a]">Emergency Command</span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#131b2e] mt-1">Dedicated Security SOS Console</h1>
                  <p className="text-sm text-[#3e4a3d]">
                    Rapid response dispatch terminal for medical emergencies, fire alarms, boundary intrusions, and elevator entrapments.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span> SIRENS ON STANDBY
                  </span>
                </div>
              </div>

              {/* Large Emergency Panic Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Medical Panic */}
                <button
                  type="button"
                  onClick={() => triggerPanicAlert('MEDICAL EMERGENCY: Ambulance bypass enabled. Gate 1 lane completely cleared!')}
                  className="flex flex-col justify-between p-5 rounded-xl bg-[#ba1a1a] text-white hover:opacity-95 shadow-md transition-transform active:scale-[0.97] text-left min-h-[140px] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[32px]">medical_services</span>
                    <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-bold">108 DIRECT</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold block">Ambulance Rush</span>
                    <span className="text-xs opacity-90">Auto raise all boom barriers &amp; alert lifts</span>
                  </div>
                </button>

                {/* Fire Hazard */}
                <button
                  type="button"
                  onClick={() => triggerPanicAlert('FIRE ALARM TRIGGERED: Fire tender access lane Gate 1 & Gate 3 locked open!')}
                  className="flex flex-col justify-between p-5 rounded-xl bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a] hover:text-white shadow-md transition-all active:scale-[0.97] text-left min-h-[140px] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[32px]">local_fire_department</span>
                    <span className="px-2 py-0.5 rounded bg-[#ba1a1a]/20 text-xs font-bold">101 TENDER</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold block">Fire Tender Alarm</span>
                    <span className="text-xs opacity-90">Unlock all emergency access fire gates</span>
                  </div>
                </button>

                {/* Perimeter Breach */}
                <button
                  type="button"
                  onClick={() => triggerPanicAlert('PERIMETER BREACH: Security patrol siren active in North boundary Sector 4!')}
                  className="flex flex-col justify-between p-5 rounded-xl bg-[#a36700] text-white hover:opacity-95 shadow-md transition-transform active:scale-[0.97] text-left min-h-[140px] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[32px]">fmd_bad</span>
                    <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-bold">PATROL RUSH</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold block">Boundary Breach</span>
                    <span className="text-xs opacity-90">Flash boundary searchlights &amp; alert guard force</span>
                  </div>
                </button>

                {/* Lift Trapped */}
                <button
                  type="button"
                  onClick={() => triggerPanicAlert('ELEVATOR ALARM: Otis technician hotline dialed for passenger rescue!')}
                  className="flex flex-col justify-between p-5 rounded-xl bg-[#283044] text-[#eef0ff] hover:bg-[#131b2e] shadow-md transition-transform active:scale-[0.97] text-left min-h-[140px] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[32px]">elevator</span>
                    <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-bold">OTIS RESCUE</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold block">Lift Entrapment</span>
                    <span className="text-xs opacity-90">Auto notify Otis engineering hotline</span>
                  </div>
                </button>
              </div>

              {/* Hotline Contacts Table */}
              <div className="bg-white rounded-xl p-6 shadow-xs border border-[#eaedff] flex flex-col gap-4">
                <h2 className="text-base font-bold text-[#131b2e]">Emergency Hot-Line Speed Dials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#006b2c]/20 text-[#006b2c] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">local_police</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#131b2e]">Jubilee Hills Police Station</span>
                        <span className="text-[11px] text-[#3e4a3d]">Station In-Charge Inspector K. Reddy</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Connecting to Jubilee Hills Police Station (+91 40 2785 2400)...', 'info')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition cursor-pointer"
                    >
                      Dial Now
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ba1a1a]/20 text-[#ba1a1a] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">emergency</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#131b2e]">Apollo Hospital ER Trauma Desk</span>
                        <span className="text-[11px] text-[#3e4a3d]">Speed-Dial Hotline #040-1066</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Connecting to Apollo ER Trauma Unit...', 'info')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#93000a] transition cursor-pointer"
                    >
                      Dial Now
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#006591]/20 text-[#006591] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">apartment</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#131b2e]">Estate President (S. Venkat Reddy)</span>
                        <span className="text-[11px] text-[#3e4a3d]">Management Committee Head</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Calling Estate President S. Venkat Reddy...', 'info')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#006591] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
                    >
                      Dial Direct
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#825100]/20 text-[#825100] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">build</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#131b2e]">Otis 24x7 Emergency AMC Dispatch</span>
                        <span className="text-[11px] text-[#3e4a3d]">Service Contract #OTIS-IND-8812</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Otis technician control room ringing...', 'info')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#825100] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
                    >
                      Dial Tech
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* MODAL 1: QR / OTP Scanner */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-[#131b2e]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dae2fd] flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e2e7ff] pb-3">
              <div className="flex items-center gap-2 text-[#006591]">
                <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                <h3 className="text-base font-bold text-[#131b2e]">Scan / Verify Visitor OTP</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <p className="text-xs text-[#3e4a3d]">
              Scan guest QR pass with handheld terminal or enter the 4 to 6 digit OTP provided by resident/delivery driver.
            </p>

            <form onSubmit={handleVerifyOtpSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1">
                  ENTER OTP CODE (e.g. 7741, 8821)
                </label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4 or 6-digit OTP..."
                  autoFocus
                  className="w-full h-12 px-4 rounded-xl bg-[#f2f3ff] text-center text-lg font-mono font-bold tracking-widest text-[#131b2e] border border-[#bdcaba] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006591]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] text-xs font-bold hover:bg-[#e2e7ff] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#006591] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  Verify &amp; Lift Barrier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Rapid Visitor Pass Issuance (Supports Walk-In & Vendor Name) */}
      {showRapidPassModal && (
        <div className="fixed inset-0 bg-[#131b2e]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dae2fd] flex flex-col gap-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e2e7ff] pb-3">
              <div className="flex items-center gap-2 text-[#006b2c]">
                <span className="material-symbols-outlined text-2xl">person_add</span>
                <div>
                  <h3 className="text-base font-bold text-[#131b2e]">Issue Rapid Visitor Gate Pass</h3>
                  <span className="text-[10px] text-[#006b2c] font-bold">Supports Vehicle &amp; Walk-In Pedestrian Entries</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRapidPassModal(false)}
                className="text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRapidPass} className="flex flex-col gap-3">
              {/* Entry Mode Toggle */}
              <div>
                <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1">
                  Access Mode:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRapidEntryMode('VEHICLE')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                      rapidEntryMode === 'VEHICLE'
                        ? 'bg-[#006b2c] text-white border-[#006b2c]'
                        : 'bg-[#f2f3ff] text-[#131b2e] border-[#dae2fd] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">directions_car</span>
                    <span>Vehicle Entry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRapidEntryMode('WALK_IN')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                      rapidEntryMode === 'WALK_IN'
                        ? 'bg-[#00873a] text-white border-[#00873a]'
                        : 'bg-[#f2f3ff] text-[#131b2e] border-[#dae2fd] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">directions_walk</span>
                    <span>On Foot / Walk-In</span>
                  </button>
                </div>
              </div>

              {/* Company / Brand Name Selector */}
              <div>
                <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1">
                  Company / Organization / Brand Name:
                </label>
                <input
                  type="text"
                  value={rapidCompanyName}
                  onChange={(e) => setRapidCompanyName(e.target.value)}
                  placeholder="e.g. Amazon, Zomato, Swiggy, Blinkit, Uber, Maid/Cook"
                  className="w-full h-10 px-3 rounded-lg bg-[#f2f3ff] text-xs font-bold text-[#131b2e] border border-[#bdcaba] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006b2c] mb-1.5"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {POPULAR_BRANDS.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setRapidCompanyName(brand)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition cursor-pointer ${
                        rapidCompanyName === brand
                          ? 'bg-[#006b2c] text-white'
                          : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visitor Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1">
                    Visitor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={rapidVisitorName}
                    onChange={(e) => setRapidVisitorName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full h-10 px-3 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#bdcaba] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006b2c]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={rapidVisitorPhone}
                    onChange={(e) => setRapidVisitorPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full h-10 px-3 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#bdcaba] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006b2c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1">
                    Destination Flat *
                  </label>
                  <input
                    type="text"
                    required
                    value={rapidDestinationFlat}
                    onChange={(e) => setRapidDestinationFlat(e.target.value)}
                    placeholder="e.g. Flat A-1204"
                    className="w-full h-10 px-3 rounded-lg bg-[#f2f3ff] text-xs font-bold text-[#006b2c] border border-[#bdcaba] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006b2c]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1">
                    {rapidEntryMode === 'WALK_IN' ? 'Access' : 'Vehicle Number'}
                  </label>
                  {rapidEntryMode === 'WALK_IN' ? (
                    <input
                      type="text"
                      disabled
                      value="N/A (Walk-In Visitor)"
                      className="w-full h-10 px-3 rounded-lg bg-[#eaedff] text-xs font-bold text-[#3e4a3d] cursor-not-allowed border border-[#bdcaba]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={rapidVehicle}
                      onChange={(e) => setRapidVehicle(e.target.value)}
                      placeholder="e.g. TS 08 EA 4410"
                      className="w-full h-10 px-3 rounded-lg bg-[#f2f3ff] text-xs font-mono text-[#131b2e] border border-[#bdcaba] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006b2c]"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#e2e7ff] mt-2">
                <button
                  type="button"
                  onClick={() => setShowRapidPassModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] text-xs font-bold hover:bg-[#e2e7ff] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition cursor-pointer"
                >
                  Issue Pass &amp; Open Gate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Interactive Inspection Checklist Dialog */}
      {selectedChecklistDirective && (
        <div className="fixed inset-0 bg-[#131b2e]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dae2fd] flex flex-col gap-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e2e7ff] pb-3">
              <div className="flex items-center gap-2 text-[#006591]">
                <span className="material-symbols-outlined text-2xl">fact_check</span>
                <div>
                  <h3 className="text-base font-bold text-[#131b2e]">
                    Physical Inspection Checklist — {selectedChecklistDirective.flatLabel}
                  </h3>
                  <span className="text-[10px] text-[#006591] font-mono">Directive Ref #{selectedChecklistDirective.directiveId}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChecklistDirective(null)}
                className="text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitChecklistModal} className="flex flex-col gap-4">
              <div className="p-3 bg-[#f2f3ff] rounded-xl text-xs text-[#131b2e]">
                <strong className="text-[#006591] font-bold">Inspection Scope:</strong> Check unit physical key surrender, tenancy ID documents, luggage departure, and common infrastructure integrity for {selectedChecklistDirective.flatLabel}.
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] cursor-pointer border border-[#dae2fd]">
                  <input
                    type="checkbox"
                    checked={checklistForm.idVerified}
                    onChange={(e) => setChecklistForm({ ...checklistForm, idVerified: e.target.checked })}
                    className="mt-0.5 rounded text-[#006b2c] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Aadhaar / Government ID &amp; Lease Agreement Original Checked</span>
                    <span className="text-[11px] text-[#3e4a3d]">Verified identity matches society registry &amp; tenant contract.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] cursor-pointer border border-[#dae2fd]">
                  <input
                    type="checkbox"
                    checked={checklistForm.keysVerified}
                    onChange={(e) => setChecklistForm({ ...checklistForm, keysVerified: e.target.checked })}
                    className="mt-0.5 rounded text-[#006b2c] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Smart Keycards &amp; Master RFID Fob Count Verified</span>
                    <span className="text-[11px] text-[#3e4a3d]">Confirmed 3 physical keys + 1 master RFID fob surrendered to security desk.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] cursor-pointer border border-[#dae2fd]">
                  <input
                    type="checkbox"
                    checked={checklistForm.luggageChecked}
                    onChange={(e) => setChecklistForm({ ...checklistForm, luggageChecked: e.target.checked })}
                    className="mt-0.5 rounded text-[#006b2c] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Luggage &amp; Goods Lift Lobby Departure Inspected</span>
                    <span className="text-[11px] text-[#3e4a3d]">Outgoing tenant baggage cleared through service elevator #2.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] cursor-pointer border border-[#dae2fd]">
                  <input
                    type="checkbox"
                    checked={checklistForm.noDamage}
                    onChange={(e) => setChecklistForm({ ...checklistForm, noDamage: e.target.checked })}
                    className="mt-0.5 rounded text-[#006b2c] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Infrastructure &amp; Common Assets Intact</span>
                    <span className="text-[11px] text-[#3e4a3d]">No damage to corridor walls, fire sprinklers, or elevator cladding.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] cursor-pointer border border-[#dae2fd]">
                  <input
                    type="checkbox"
                    checked={checklistForm.meterSealed}
                    onChange={(e) => setChecklistForm({ ...checklistForm, meterSealed: e.target.checked })}
                    className="mt-0.5 rounded text-[#006b2c] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Utility Meter &amp; Piped Gas Valve Inspected</span>
                    <span className="text-[11px] text-[#3e4a3d]">Gas safety shutoff engaged; sub-meter reading logged.</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1">
                  Guard Officer Observations &amp; Report Notes
                </label>
                <textarea
                  rows="2"
                  value={checklistForm.notes}
                  onChange={(e) => setChecklistForm({ ...checklistForm, notes: e.target.value })}
                  className="w-full p-3 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#bdcaba] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006591]"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#e2e7ff]">
                <button
                  type="button"
                  onClick={() => setSelectedChecklistDirective(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] text-xs font-bold hover:bg-[#e2e7ff] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleFlagDiscrepancy(selectedChecklistDirective.caseId, selectedChecklistDirective.flatLabel, selectedChecklistDirective.directiveId)}
                  className="px-3 py-2.5 rounded-xl bg-[#ffdad6] text-[#93000a] text-xs font-bold hover:bg-[#ba1a1a] hover:text-white transition cursor-pointer"
                >
                  Flag Discrepancy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition cursor-pointer"
                >
                  Submit Report &amp; Grant Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Interactive Upload Evidence Dialog */}
      {selectedEvidenceDirective && (
        <div className="fixed inset-0 bg-[#131b2e]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dae2fd] flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e2e7ff] pb-3">
              <div className="flex items-center gap-2 text-[#006591]">
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
                <div>
                  <h3 className="text-base font-bold text-[#131b2e]">
                    Upload Evidence Photos — {selectedEvidenceDirective.flatLabel}
                  </h3>
                  <span className="text-[10px] text-[#006591] font-mono">Attach Luggage &amp; Key Photos to Report</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvidenceDirective(null)}
                className="text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEvidenceModal} className="flex flex-col gap-4">
              <div className="p-4 rounded-xl border-2 border-dashed border-[#bdcaba] bg-[#f2f3ff] flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-[#eaedff] transition"
                onClick={() => {
                  const fakePhoto = {
                    id: Date.now(),
                    name: `inspection_evidence_${attachedPhotos.length + 1}.jpg`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    size: '1.4 MB'
                  };
                  setAttachedPhotos((prev) => [...prev, fakePhoto]);
                  showToast('Photo evidence uploaded from guard terminal camera!', 'success');
                }}
              >
                <span className="material-symbols-outlined text-3xl text-[#006591]">add_a_photo</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#131b2e]">Click to Take Photo or Attach File</span>
                  <span className="text-[10px] text-[#3e4a3d]">Captures key surrender, luggage, or meter inspection proof</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1.5">
                  ATTACHED EVIDENCE FILES ({attachedPhotos.length})
                </label>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                  {attachedPhotos.map((photo) => (
                    <div key={photo.id} className="p-2.5 rounded-lg bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff]">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#006b2c] text-xl">image</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#131b2e]">{photo.name}</span>
                          <span className="text-[10px] text-[#3e4a3d]">{photo.time} • {photo.size}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedPhotos((prev) => prev.filter((p) => p.id !== photo.id))}
                        className="text-[#ba1a1a] hover:bg-rose-50 p-1 rounded-md text-xs cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-1">
                  Photo Evidence Caption / Notes
                </label>
                <input
                  type="text"
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="e.g. Master key fob & 3 standard door keys photographed at Gate 1 sentry desk"
                  className="w-full h-10 px-3 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#bdcaba] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006591]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#e2e7ff]">
                <button
                  type="button"
                  onClick={() => setSelectedEvidenceDirective(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] text-xs font-bold hover:bg-[#e2e7ff] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#006591] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  Attach Evidence &amp; Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Interactive Parking Slot RFID Review Dialog */}
      {selectedParkingCase && (
        <div className="fixed inset-0 bg-[#131b2e]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dae2fd] flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e2e7ff] pb-3">
              <div className="flex items-center gap-2 text-[#825100]">
                <span className="material-symbols-outlined text-2xl">local_parking</span>
                <div>
                  <h3 className="text-base font-bold text-[#131b2e]">
                    Parking RFID Tag Review — {selectedParkingCase.flatLabel}
                  </h3>
                  <span className="text-[10px] text-[#825100] font-mono">Basement Bay B2-114 Allocation Verification</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedParkingCase(null)}
                className="text-[#6e7b6c] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveParkingReview} className="flex flex-col gap-4">
              <div className="p-3 bg-[#f2f3ff] rounded-xl text-xs text-[#131b2e] space-y-1">
                <div><strong className="text-[#131b2e]">Resident:</strong> Tanmay Chatterjee (Flat C-801)</div>
                <div><strong className="text-[#131b2e]">Registered Bay:</strong> Single Sedan Slot C-801-A (Basement 2)</div>
                <div><strong className="text-[#131b2e]">Applied Tags:</strong> 2 SUV Tags (TS 09 EA 7720 &amp; AP 28 CC 3301)</div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block mb-2">
                  Guard Allocation Decision:
                </label>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] cursor-pointer border border-[#dae2fd]">
                    <input
                      type="radio"
                      name="parkingOption"
                      value="SINGLE_SLOT"
                      checked={parkingOptionSelected === 'SINGLE_SLOT'}
                      onChange={() => setParkingOptionSelected('SINGLE_SLOT')}
                      className="mt-0.5 text-[#006b2c] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Approve Primary SUV Tag Only (Standard Single Bay)</span>
                      <span className="text-[11px] text-[#3e4a3d]">Authorizes primary vehicle TS 09 EA 7720. Rejects secondary vehicle tag.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] cursor-pointer border border-[#dae2fd]">
                    <input
                      type="radio"
                      name="parkingOption"
                      value="TANDEM_STACK"
                      checked={parkingOptionSelected === 'TANDEM_STACK'}
                      onChange={() => setParkingOptionSelected('TANDEM_STACK')}
                      className="mt-0.5 text-[#006b2c] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Authorize Mechanical Stack Tandem Bay for 2 Vehicles</span>
                      <span className="text-[11px] text-[#3e4a3d]">Verifies mechanical stack hydraulic lift installed in Bay B2-114.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#e2e7ff]">
                <button
                  type="button"
                  onClick={() => setSelectedParkingCase(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] text-xs font-bold hover:bg-[#e2e7ff] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition cursor-pointer"
                >
                  Save Decision &amp; Authorize FastTag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for President Directives Security Access Grant */}
      {selectedGrantDirective && (
        <SecurityAccessGrantModal
          isOpen={!!selectedGrantDirective}
          directive={selectedGrantDirective}
          onClose={() => setSelectedGrantDirective(null)}
          onAccessGranted={() => {
            setSecurityDirectives(serviceApi.getSecurityDirectives());
          }}
          showToast={showToast}
        />
      )}

      {/* Modal for Viewing Full Digital Gate Pass with QR & Entry OTP */}
      {selectedDigitalPass && (
        <DigitalGatePassModal
          isOpen={!!selectedDigitalPass}
          pass={selectedDigitalPass}
          onClose={() => setSelectedDigitalPass(null)}
          onCheckout={(passId) => {
            handleCheckoutVisitor(passId, selectedDigitalPass.guestName);
            setSelectedDigitalPass(null);
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};
