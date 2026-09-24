import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { INITIAL_COMMUNITIES } from '../../data/initialData';
import { authApi } from '../../api/authApi';
import { communityApi } from '../../api/communityApi';

export const ResidentRegistration = ({ onRegistrationComplete, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [selectedCommunity, setSelectedCommunity] = useState(INITIAL_COMMUNITIES[0]); // Default to My Home Bhooja
  const [flatNumber, setFlatNumber] = useState('A-1204');
  const [residentType, setResidentType] = useState('Owner');
  const [fullName, setFullName] = useState('Arjun Kumar');
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [email, setEmail] = useState('arjun.kumar@example.com');
  const [password, setPassword] = useState('password123');
  const [otp, setOtp] = useState(['4', '8', '2', '7', '3', '1']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [conflictDetected, setConflictDetected] = useState(false);
  const [blockedModalData, setBlockedModalData] = useState(null);

  const filteredCommunities = INITIAL_COMMUNITIES.map((c) => {
    const dbComm = communityApi.getCommunityById(c.id);
    return dbComm ? { ...c, ...dbComm } : c;
  }).filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCommunity = (comm) => {
    const dbComm = communityApi.getCommunityById(comm.id);
    const activeComm = dbComm || comm;
    if (activeComm.status === 'FROZEN') {
      setBlockedModalData({
        communityName: activeComm.name,
        reason: activeComm.freezeReason || 'Platform SaaS subscription license renewal is past due.',
        contactEmail: 'support@communityconnect.io',
        contactPhone: '+91 800-266-6864'
      });
      return;
    }
    setSelectedCommunity(activeComm);
    setCurrentStep(2);
  };

  const handleResidenceDetailsSubmit = (e) => {
    e.preventDefault();
    if (!flatNumber) return;
    const dbComm = communityApi.getCommunityById(selectedCommunity.id);
    if (dbComm && dbComm.status === 'FROZEN') {
      setBlockedModalData({
        communityName: dbComm.name,
        reason: dbComm.freezeReason || 'Platform SaaS subscription license renewal is past due.',
        contactEmail: 'support@communityconnect.io',
        contactPhone: '+91 800-266-6864'
      });
      return;
    }
    setCurrentStep(3);
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(4); // OTP step
  };

  const handleOtpVerify = async () => {
    setIsVerifyingOtp(true);
    await new Promise((r) => setTimeout(r, 600));

    // Simulate conflict detection if Flat A-1204 at My Home Bhooja
    const isConflict = selectedCommunity.id === 'comm-bhooja' && flatNumber.toUpperCase() === 'A-1204';
    setConflictDetected(isConflict);

    try {
      const result = await authApi.registerResident({
        name: fullName,
        email,
        phone: mobileNumber,
        password,
        communityId: selectedCommunity.id,
        communityName: selectedCommunity.name,
        flatNumber,
        residentType,
        hasConflict: isConflict
      });

      setIsSubmitted(true);
      setCurrentStep(5);
    } catch (err) {
      if (err.isBlocked || err.message === 'COMMUNITY_FROZEN') {
        setBlockedModalData({
          communityName: err.communityName || selectedCommunity?.name || 'Community',
          reason: err.freezeReason || 'Platform SaaS subscription license renewal is past due.',
          contactEmail: err.contactEmail || 'support@communityconnect.io',
          contactPhone: err.contactPhone || '+91 800-266-6864'
        });
      } else {
        alert(err.message || 'Registration failed');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#FAF8F5] py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        
        {/* Header with Progress Steps */}
        <div className="bg-gradient-to-r from-[#16A34A] to-[#15803D] p-6 text-white text-center relative">
          <h2 className="text-xl font-bold font-display">Resident Onboarding</h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Step {currentStep} of 4: {
              currentStep === 1 ? 'Choose Community' :
              currentStep === 2 ? 'Residence Details' :
              currentStep === 3 ? 'Personal Information' :
              currentStep === 4 ? 'OTP Verification' : 'Status Verification'
            }
          </p>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all ${
                  step === currentStep
                    ? 'w-8 bg-white'
                    : step < currentStep
                    ? 'w-4 bg-emerald-200'
                    : 'w-4 bg-emerald-900/40'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          
          {/* STEP 1: Choose Community (Image 2 Screen 5) */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Choose Your Community</h3>
                <p className="text-xs text-gray-500 mt-0.5">Select the gated society or apartment you reside in</p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search community, area or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredCommunities.map((comm) => (
                  <div
                    key={comm.id}
                    onClick={() => handleSelectCommunity(comm)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      selectedCommunity?.id === comm.id
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        <img src={comm.imageUrl} alt={comm.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-gray-900">{comm.name}</div>
                        <div className="text-[11px] text-gray-500">{comm.area}, {comm.city}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      Select <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Residence Details (Image 2 Screen 6) */}
          {currentStep === 2 && (
            <form onSubmit={handleResidenceDetailsSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Your Residence Details</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Specify flat number and residency type</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  Change Community
                </button>
              </div>

              {/* Selected Community Snapshot */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-gray-900">{selectedCommunity.name}</div>
                  <div className="text-[10px] text-gray-500">{selectedCommunity.address}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Flat / Villa Number
                </label>
                <input
                  type="text"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  placeholder="e.g. Tower A - Flat 1204"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Tip: Use A-1204 to test the real-life move-in conflict flow with security inspection!
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Resident Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Owner', 'Tenant', 'Family Member'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setResidentType(type)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        residentType === type
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Personal Information & Password (Image 2 Screen 4) */}
          {currentStep === 3 && (
            <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Create Account</h3>
                <p className="text-xs text-gray-500 mt-0.5">Enter contact credentials for verification OTP</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number (for SMS OTP)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Account Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Request OTP
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: OTP Verification (Image 2 Screen 7) */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Verify Your Number</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  We have sent a 6-digit verification code to <strong className="text-gray-800">{mobileNumber}</strong>
                </p>
              </div>

              {/* 6 Box OTP Inputs */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = [...otp];
                      next[idx] = val;
                      setOtp(next);
                    }}
                    className="w-10 h-12 text-center text-lg font-bold font-mono bg-gray-50 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                ))}
              </div>

              <div className="text-xs text-gray-500">
                Resend OTP in <span className="font-bold text-emerald-600">00:28</span>
              </div>

              <button
                type="button"
                onClick={handleOtpVerify}
                disabled={isVerifyingOtp}
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifyingOtp ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Verify &amp; Start Access Process</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 5: Verification & Pending Admin Approval Status */}
          {currentStep === 5 && (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center border-4 border-amber-50 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wide mb-2">
                  ⏳ Registration Request Submitted
                </span>
                <h3 className="text-xl font-bold text-gray-900 font-display">Pending Admin Approval</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Your access request for <strong className="text-gray-900">{flatNumber}</strong> at <strong className="text-gray-900">{selectedCommunity.name}</strong> is awaiting review.
                </p>
              </div>

              {/* Zero-Trust Access Policy Notice */}
              <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200/90 text-left text-xs space-y-2 text-amber-950">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Portal Access Locked (Zero-Trust Security)</span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  Temporary login access has been disabled to prevent unverified data access. Your account remains locked until the Management Committee President confirms occupancy & document clearance.
                </p>
                {conflictDetected && (
                  <div className="mt-2 pt-2 border-t border-amber-200/80 text-[11px] text-amber-950 font-medium">
                    ⚠️ <strong>Occupancy Flag:</strong> Flat {flatNumber} was previously registered under outgoing resident Rahul G. Security inspection and key surrender report will be verified by the President.
                  </div>
                )}
              </div>

              {/* Waiting Period & SMS Alert Info */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500 font-medium">Expected Waiting Period:</span>
                  <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded-lg border border-gray-200">24 – 48 Hours (2–5 Days)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500 font-medium">SMS Notification Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enabled ({mobileNumber})
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="w-full py-3 bg-gray-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Return to Login Screen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('community-admin')}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Switch to President View to Approve (Testing Sandbox)</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Account Blocked / Frozen Community Modal Pop-up */}
      {blockedModalData && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200 freeze-modal-overlay select-none cursor-default">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-rose-200 flex flex-col gap-5 relative overflow-hidden select-none cursor-default">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-100 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start gap-4 relative z-10 select-none cursor-default">
              <div className="p-3.5 bg-rose-100 text-rose-700 rounded-2xl border border-rose-300 shrink-0 shadow-sm cursor-default">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="flex-1 select-none cursor-default">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wide mb-1.5 shadow-xs cursor-default">
                  🔒 Subscription Frozen / Access Suspended
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 cursor-default">Community Access Blocked</h3>
                <p className="text-xs text-slate-600 mt-1 cursor-default">
                  Portal access for <span className="font-bold text-slate-900 cursor-default">{blockedModalData.communityName}</span> has been frozen by Platform HQ Operations.
                </p>
              </div>
            </div>

            <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200/90 flex flex-col gap-1.5 relative z-10 select-none cursor-default">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider cursor-default">Freeze Reason / Notice</span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed italic cursor-default">
                "{blockedModalData.reason}"
              </p>
            </div>

            <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 flex flex-col gap-2 relative z-10 select-none cursor-default">
              <span className="font-extrabold text-amber-950 flex items-center gap-1.5 cursor-default">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                How to Restore Service:
              </span>
              <p className="text-[11px] text-amber-900 leading-normal cursor-default">
                Please contact Platform HQ Super-Admin or Finance Office to unfreeze society access and restore live portal services:
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-amber-200/80 font-bold text-xs select-none cursor-default">
                <a href={`mailto:${blockedModalData.contactEmail}`} className="text-[#16A34A] hover:underline flex items-center gap-1 cursor-pointer">
                  📧 {blockedModalData.contactEmail}
                </a>
                <span className="hidden sm:inline text-amber-400 cursor-default">•</span>
                <a href={`tel:${blockedModalData.contactPhone}`} className="text-[#16A34A] hover:underline flex items-center gap-1 cursor-pointer">
                  📞 {blockedModalData.contactPhone}
                </a>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 relative z-10 select-none cursor-default">
              <button
                type="button"
                onClick={() => setBlockedModalData(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Dismiss &amp; Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
