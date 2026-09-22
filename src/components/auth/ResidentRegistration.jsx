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
  Sparkles
} from 'lucide-react';
import { INITIAL_COMMUNITIES } from '../../data/initialData';
import { authApi } from '../../api/authApi';

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

  const filteredCommunities = INITIAL_COMMUNITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCommunity = (comm) => {
    setSelectedCommunity(comm);
    setCurrentStep(2);
  };

  const handleResidenceDetailsSubmit = (e) => {
    e.preventDefault();
    if (!flatNumber) return;
    setCurrentStep(3);
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(4); // OTP step
  };

  const handleOtpVerify = async () => {
    setIsVerifyingOtp(true);
    await new Promise((r) => setTimeout(r, 600));

    // Simulate conflict detection if Flat A-1204 at My Home Bhooja (as in Image 1 scenario)
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
      alert(err.message);
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

          {/* STEP 5: Verification Feedback Result */}
          {currentStep === 5 && (
            <div className="text-center space-y-4 py-2">
              {conflictDetected ? (
                <div>
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-3">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-display">Occupancy Conflict Flagged</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Flat <strong>{flatNumber}</strong> at <strong>{selectedCommunity.name}</strong> is currently registered under outgoing resident Rahul G.
                  </p>
                  
                  <div className="mt-4 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs space-y-1.5 text-amber-900">
                    <div className="font-bold">Next Automated Verification Steps:</div>
                    <div className="text-[11px] space-y-1">
                      <div>1. Rahul received vacation confirmation prompt (Confirmed).</div>
                      <div>2. Security Guard Ram Singh conducts physical inspection of luggage &amp; keys surrender.</div>
                      <div>3. President reviews report and grants 5-day temporary move-in access.</div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      onClick={() => onNavigate('resident')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      Enter Resident Console (Temporary Stage)
                    </button>
                    <button
                      onClick={() => onNavigate('community-admin')}
                      className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
                    >
                      Switch to President View to Approve Access
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-display">Account Verified!</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Welcome to {selectedCommunity.name}. Full resident permissions activated.
                  </p>
                  <button
                    onClick={() => onNavigate('resident')}
                    className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Enter Resident Portal
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
