import React, { useState, useId } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Wrench, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Home, 
  KeyRound, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Car, 
  ShieldAlert,
  ChevronRight,
  Calculator,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  MapPin,
  CreditCard,
  Send,
  X,
  User as UserIcon
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { authApi } from '../../api/authApi';
import { INITIAL_COMMUNITIES } from '../../data/initialData';

export const CommunityConnectWebsite = ({ onLoginSuccess, onNavigate }) => {
  // Navigation & View states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab5W, setActiveTab5W] = useState('WHAT');

  // Interactive Pricing & Onboarding Calculator State
  const [city, setCity] = useState('Hyderabad');
  const [locality, setLocality] = useState('Financial District');
  const [communityName, setCommunityName] = useState('');
  const [communityType, setCommunityType] = useState('High-Rise Gated Society');
  const [unitsCount, setUnitsCount] = useState(480);
  const [gatesCount, setGatesCount] = useState(2);
  const [selectedTier, setSelectedTier] = useState('ENTERPRISE_PREMIUM');
  const [billingCycle, setBillingCycle] = useState('MONTHLY'); // 'MONTHLY' | 'ANNUAL'

  // Contract & MC Liaison Form
  const [presidentName, setPresidentName] = useState('');
  const [presidentEmail, setPresidentEmail] = useState('');
  const [presidentPhone, setPresidentPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('AUTODEBIT');
  const [agreedToContract, setAgreedToContract] = useState(false);
  const [onboardingSuccess, setOnboardingSuccess] = useState(null);
  const [isOnboardingSubmitting, setIsOnboardingSubmitting] = useState(false);

  const handleSelectTierAndScroll = (tier) => {
    setSelectedTier(tier);
    setTimeout(() => {
      const contractElem = document.getElementById('privacy-contract');
      if (contractElem) {
        contractElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [blockedModalData, setBlockedModalData] = useState(null);

  React.useEffect(() => {
    if (loginError && (loginError === 'COMMUNITY_FROZEN' || loginError.includes('FROZEN') || loginError.includes('frozen'))) {
      setBlockedModalData({
        communityName: 'Lodha Meridian',
        reason: 'Annual Platform License Renewal past due by 45 days. Restricted to read-only security safety logs.',
        contactEmail: 'support@communityconnect.io',
        contactPhone: '+91 800-266-6864'
      });
      setLoginError(null);
    }
  }, [loginError]);

  // Preconfigured Member Personas (8 Roles)
  const QUICK_PRECONFIGURED_MEMBERS = [
    {
      id: 'usr-plat-admin',
      name: 'Devashish Sen',
      role: 'PLATFORM_ADMIN',
      roleLabel: 'Platform Super Admin',
      roleBadgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      title: 'Chief Operations Officer',
      org: 'CommunityConnect HQ',
      email: 'admin@communityconnect.com',
      password: 'password123',
      avatar: null,
      scope: 'Multi-Community Governance & Licensing'
    },
    {
      id: 'usr-comm-bhooja',
      name: 'S. Venkat Reddy',
      role: 'COMMUNITY_ADMIN',
      roleLabel: 'Community Admin',
      roleBadgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'Management Committee President',
      org: 'My Home Bhooja',
      email: 'president.bhooja@communityconnect.com',
      password: 'password123',
      avatar: null,
      scope: 'RWA Administration, Finances & Approvals'
    },
    {
      id: 'usr-res-arjun',
      name: 'Arjun Kumar',
      role: 'RESIDENT',
      roleLabel: 'Resident Owner #1',
      roleBadgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'Apartment Owner • Flat A-1204',
      org: 'My Home Bhooja',
      email: 'arjun.kumar@example.com',
      password: 'password123',
      avatar: null,
      scope: 'Visitor FASTag, Group Demands & Bookings'
    },
    {
      id: 'usr-res-priya',
      name: 'Priya Verma',
      role: 'RESIDENT',
      roleLabel: 'Resident Owner #2',
      roleBadgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-200',
      title: 'Apartment Owner • Flat C-502',
      org: 'My Home Bhooja',
      email: 'priya.verma@example.com',
      password: 'password123',
      avatar: null,
      scope: 'Resident Hub, Payments & Amenities'
    },
    {
      id: 'usr-sec-ramsingh',
      name: 'Havaldar Ram Singh',
      role: 'SECURITY_TEAM',
      roleLabel: 'Security Gate Guard',
      roleBadgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
      title: 'Gate 1 North Guard',
      org: 'My Home Bhooja',
      email: 'security.gate1@communityconnect.com',
      password: 'password123',
      avatar: null,
      scope: 'ANPR Boom Barrier & Gate Register'
    },
    {
      id: 'usr-prov-cool',
      name: 'CoolingPro AC Solutions',
      role: 'SERVICE_PROVIDER',
      roleLabel: 'Service Provider',
      roleBadgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
      title: 'Suresh Varma • Partner',
      org: 'AC & Appliance Maintenance',
      email: 'coolingpro.service@example.com',
      password: 'password123',
      avatar: null,
      scope: 'Resident Group Pool Jobs & Dispatch'
    },
    {
      id: 'usr-prov-sunita',
      name: 'Sunita Devi',
      role: 'SERVICE_PROVIDER',
      roleLabel: 'Home Cook',
      roleBadgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      title: 'Verified Home Cook',
      org: 'Gate OTP Access • Tower A & B',
      email: 'sunita.cook@example.com',
      password: 'password123',
      avatar: null,
      scope: 'Dedicated Daily Cooking & Kitchen Shift'
    },
    {
      id: 'usr-prov-lakshmi',
      name: 'Lakshmi Bai',
      role: 'SERVICE_PROVIDER',
      roleLabel: 'Housekeeper Maid',
      roleBadgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
      title: 'Verified Maid',
      org: 'Biometric Access • Tower C',
      email: 'lakshmi.maid@example.com',
      password: 'password123',
      avatar: null,
      scope: 'Daily Housekeeping & Floor Cleaning'
    }
  ];

  const handleAuthError = (err) => {
    const msg = typeof err === 'string' ? err : (err?.message || '');
    if (err?.isBlocked || msg === 'COMMUNITY_FROZEN' || msg.includes('FROZEN') || msg.includes('frozen')) {
      setBlockedModalData({
        communityName: err?.communityName || 'Lodha Meridian',
        reason: err?.freezeReason || 'Annual Platform License Renewal past due by 45 days. Restricted to read-only security safety logs.',
        contactEmail: err?.contactEmail || 'support@communityconnect.io',
        contactPhone: err?.contactPhone || '+91 800-266-6864'
      });
      setLoginError(null);
    } else {
      setLoginError(msg || 'Authentication failed. Please check credentials.');
    }
  };
  // Scroll to onboarding engine
  const scrollToConnect = () => {
    const el = document.getElementById('connect-onboarding-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to 5 Ws
  const scrollToAbout = () => {
    const el = document.getElementById('five-ws-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick 1-Click Login for the 5 Members
  const handleQuickLogin = async (email, password = 'password123') => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const response = await authApi.login(email, password);
      setShowLoginModal(false);
      onLoginSuccess(response.user);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email or login ID.');
      return;
    }
    setLoginError(null);
    setLoginLoading(true);

    try {
      const response = await authApi.login(loginIdentifier, loginPassword);
      setShowLoginModal(false);
      onLoginSuccess(response.user);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Onboarding Submission
  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    if (!communityName.trim()) {
      alert('Please enter your gated community name.');
      return;
    }
    if (!presidentEmail.trim()) {
      alert('Please provide the official Management Committee email.');
      return;
    }
    if (!agreedToContract) {
      alert('Please review and accept the Master Service Agreement & DPDP 2023 Data Protection terms.');
      return;
    }

    setIsOnboardingSubmitting(true);

    setTimeout(() => {
      const generatedId = `comm-${communityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
      const schemaName = `schema_${generatedId.replace('comm-', '')}_prod`;

      // Dispatch invite via authApi
      const invite = authApi.createInvitation({
        communityId: generatedId,
        communityName: communityName,
        recipientEmail: presidentEmail,
        recipientName: presidentName || 'Management Committee President',
        role: 'COMMUNITY_ADMIN'
      });

      // Prepare newly onboarded record
      const newCommunityRecord = {
        id: generatedId,
        name: communityName,
        city: city,
        area: locality,
        state: city === 'Hyderabad' ? 'Telangana' : city === 'Bengaluru' ? 'Karnataka' : city === 'Mumbai' || city === 'Pune' ? 'Maharashtra' : 'NCR',
        type: communityType,
        totalUnits: Number(unitsCount),
        towers: Math.max(1, Math.ceil(unitsCount / 120)),
        status: 'ACTIVE',
        plan: selectedTier,
        subscriptionFee: effectiveMonthlyFee,
        subscriptionStatus: 'ACTIVE',
        privacyPolicyStatus: 'ACCEPTED',
        dpdpCompliant: true,
        schemaId: schemaName,
        presidentName: presidentName || 'Committee President',
        presidentEmail: presidentEmail,
        presidentPhone: presidentPhone || '+91 98490 00000',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
        onboardedDate: new Date().toISOString().split('T')[0]
      };

      // Store in localStorage for demo continuity
      try {
        const storedCommRaw = localStorage.getItem('communityconnect_communities');
        const list = storedCommRaw ? JSON.parse(storedCommRaw) : INITIAL_COMMUNITIES;
        localStorage.setItem('communityconnect_communities', JSON.stringify([newCommunityRecord, ...list]));
      } catch {
        // Fallback
      }

      setIsOnboardingSubmitting(false);
      setOnboardingSuccess({
        community: newCommunityRecord,
        inviteToken: invite.token,
        contractRef: `MSA-CC-${Date.now().toString().slice(-6)}`,
        monthlyFee: effectiveMonthlyFee
      });
    }, 800);
  };

  // Handle Token Activation
  const handleActivateInvite = async (e) => {
    e.preventDefault();
    if (!inviteTokenInput.trim()) {
      setActivateError('Please enter your invitation token.');
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 4) {
      setActivateError('Password must be at least 4 characters.');
      return;
    }

    setActivateLoading(true);
    setActivateError(null);

    try {
      const res = await authApi.activateInvitation(inviteTokenInput, newPasswordInput);
      setActivateSuccess(true);
      setTimeout(() => {
        setShowActivateModal(false);
        onLoginSuccess(res.user);
      }, 1000);
    } catch (err) {
      setActivateError(err.message || 'Invalid or expired invitation token.');
    } finally {
      setActivateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#131B2E] flex flex-col font-sans selection:bg-[#006b2c] selection:text-white">
      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <BrandLogo size="md" />
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-gray-600">
            <button
              onClick={scrollToAbout}
              className="hover:text-[#006b2c] transition cursor-pointer flex items-center gap-1"
            >
              <span>The 5 Ws (What Are We)</span>
            </button>

            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#006b2c] transition"
            >
              How It Works
            </a>

            <button
              onClick={scrollToConnect}
              className="hover:text-[#006b2c] transition cursor-pointer"
            >
              Plans &amp; Pricing
            </button>

            <a
              href="#privacy-contract"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('privacy-contract')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#006b2c] transition"
            >
              DPDP &amp; Contract
            </a>

            <a
              href="#live-enclaves"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('live-enclaves')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#006b2c] transition"
            >
              Live Enclaves
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToConnect}
              id="header-join-button"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#006b2c] border border-emerald-200 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Want to Join Us?</span>
            </button>

            <button
              onClick={() => setShowLoginModal(true)}
              id="header-signin-button"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow-md cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portal Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FDF7EF] to-[#FAF8F5] pt-12 pb-18 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#006b2c] text-xs font-bold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Zero-Knowledge Privacy Architecture • DPDP Act 2023 Compliant</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#131B2E] tracking-tight leading-[1.15]">
              The Sovereign Operating System for Modern Gated Communities.
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              <strong>CommunityConnect</strong> unifies committee governance, ANPR FASTag gate barriers, verified resident services, facility reservations, and automated society accounting—with strict zero-knowledge privacy isolation.
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={scrollToConnect}
                id="hero-connect-cta"
                className="px-7 py-3.5 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <span>Want to Join Us? Connect Your Community</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowLoginModal(true)}
                id="hero-login-cta"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-bold text-sm border border-gray-300 shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-gray-600" />
                <span>Existing Member Sign In</span>
              </button>
            </div>

            {/* Trust Metric Badges */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#006b2c] flex items-center justify-center font-bold mb-2">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-base font-extrabold text-gray-900">100+ Enclaves</div>
                <p className="text-[11px] text-gray-500 mt-0.5">Active across Hyderabad, BLR &amp; Mumbai</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-base font-extrabold text-gray-900">Zero-Knowledge</div>
                <p className="text-[11px] text-gray-500 mt-0.5">0 platform access to resident PII</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-2">
                  <Car className="w-4 h-4" />
                </div>
                <div className="text-base font-extrabold text-gray-900">FASTag &amp; ANPR</div>
                <p className="text-[11px] text-gray-500 mt-0.5">Automated boom barriers &amp; zero paper</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-2">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-base font-extrabold text-gray-900">₹35k / ₹65k</div>
                <p className="text-[11px] text-gray-500 mt-0.5">Simple, transparent B2B SaaS licensing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* THE FIVE Ws OF COMMUNITYCONNECT (ABOUT US & ARCHITECTURE) */}
      {/* ========================================================================= */}
      <section id="five-ws-section" className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold tracking-wider text-[#006b2c] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Foundational Architecture &amp; Mission
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
              The 5 Ws: What, Who, Why, Where &amp; When of CommunityConnect
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Everything the Management Committee and residents need to know before onboarding their gated enclave.
            </p>
          </div>

          {/* Interactive 5 Ws Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            {[
              { id: 'WHAT', label: '1. WHAT Are We?', icon: Building2 },
              { id: 'WHO', label: '2. WHO Is It For?', icon: Users },
              { id: 'WHY', label: '3. WHY CommunityConnect?', icon: ShieldCheck },
              { id: 'WHERE', label: '4. WHERE We Operate?', icon: MapPin },
              { id: 'WHEN', label: '5. WHEN To Deploy?', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab5W === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab5W(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#006b2c] text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 5 Ws Tab Content Canvas */}
          <div className="bg-[#FAF8F5] rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs">
            {activeTab5W === 'WHAT' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006b2c] flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#006b2c] uppercase tracking-wider">The First W</span>
                    <h3 className="text-xl font-bold text-gray-900">WHAT is CommunityConnect?</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>CommunityConnect</strong> is a high-performance B2B SaaS Enterprise Operating System built specifically for Indian gated residential complexes, luxury villa enclaves, and integrated townships. Instead of juggling fragmented WhatsApp channels, physical guard gatebooks, uncollected maintenance cheques, and third-party vendor directories, CommunityConnect consolidates everything into a sovereign, single cloud portal.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1.5">
                      <Car className="w-4 h-4 text-[#006b2c]" />
                      <span>Gate Automation</span>
                    </h4>
                    <p className="text-xs text-gray-500">
                      FASTag RFID tags and high-speed ANPR license plate cameras allow authorized residents to drive in with automated boom barrier clearance in 1.2 seconds.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1.5">
                      <CreditCard className="w-4 h-4 text-purple-700" />
                      <span>Society Accounting</span>
                    </h4>
                    <p className="text-xs text-gray-500">
                      Automated invoicing of monthly maintenance with instant UPI QR payments, penalty calculations, and reconciliation into the society’s audited bank account.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1.5">
                      <Lock className="w-4 h-4 text-emerald-700" />
                      <span>Zero-Knowledge Privacy</span>
                    </h4>
                    <p className="text-xs text-gray-500">
                      Multi-tenant PostgreSQL schema isolation ensures that platform operators have zero access to resident records or visitor directories.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab5W === 'WHO' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">The Second W</span>
                    <h3 className="text-xl font-bold text-gray-900">WHO is CommunityConnect built for?</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  CommunityConnect provides dedicated, role-specific digital portals for every single stakeholder in a residential ecosystem:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">RWA / MC</span>
                    <h4 className="font-bold text-xs text-gray-900 mt-2 mb-1">Management Committees</h4>
                    <p className="text-[11px] text-gray-500">Estate presidents &amp; treasurers get automated dues ledgers, move-in approvals, notice broadcasts, and SLA ticket resolution.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Residents</span>
                    <h4 className="font-bold text-xs text-gray-900 mt-2 mb-1">Owners &amp; Tenants</h4>
                    <p className="text-[11px] text-gray-500">Instant digital visitor passes, clubhouse &amp; tennis court bookings, verified domestic staff attendance, and group service savings.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Guards</span>
                    <h4 className="font-bold text-xs text-gray-900 mt-2 mb-1">Security Personnel</h4>
                    <p className="text-[11px] text-gray-500">Simple one-touch tablet console for delivery agent check-ins, intercom video calls, and luggage departure verification.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Vendors</span>
                    <h4 className="font-bold text-xs text-gray-900 mt-2 mb-1">Verified Technicians</h4>
                    <p className="text-[11px] text-gray-500">Police-verified electricians, plumbers, and AC repair technicians with background check audits and fixed rates.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab5W === 'WHY' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006b2c] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#006b2c] uppercase tracking-wider">The Third W</span>
                    <h3 className="text-xl font-bold text-gray-900">WHY Choose CommunityConnect Over Legacy Apps?</h3>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                  <strong>The Zero-Knowledge Privacy Standard:</strong> Most consumer society apps sell resident phone numbers, display intrusive fintech loans, and maintain a shared database where anyone’s data could leak. Under India’s <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>, CommunityConnect enforces complete cryptographic data segregation.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-rose-200">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-2">
                      <X className="w-4 h-4" />
                      <span>The Legacy Society App Problem</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-2">
                      <li>• Collects resident data to advertise credit cards &amp; personal loans.</li>
                      <li>• Platform administrators can view your phone number &amp; entry/exit logs.</li>
                      <li>• Single shared database prone to cross-society leaks.</li>
                      <li>• Slow, paper-dependent gate check-ins causing traffic jams.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-emerald-200">
                    <div className="flex items-center gap-2 text-[#006b2c] font-bold text-xs mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>The CommunityConnect Guarantee</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-2">
                      <li>• <strong>Zero Ads &amp; Zero Data Monetization</strong>: Pure B2B software model.</li>
                      <li>• <strong>Zero Platform Visibility</strong>: Platform admin cannot read resident PII.</li>
                      <li>• <strong>Isolated Postgres Namespace</strong>: Dedicated database schema per society.</li>
                      <li>• <strong>FASTag + ANPR Integration</strong>: 1.2-second automated gate clearance.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab5W === 'WHERE' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">The Fourth W</span>
                    <h3 className="text-xl font-bold text-gray-900">WHERE Does CommunityConnect Operate?</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  CommunityConnect is architected for Tier-1 metros and growth corridors across India, supporting both high-rise vertical developments (up to 3,000+ units) and sprawling gated villa townships.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                  {Object.entries(cityPresets).map(([cityName, localities]) => (
                    <div key={cityName} className="p-3 bg-white rounded-xl border border-gray-200 text-center">
                      <span className="font-bold text-xs text-gray-900 block">{cityName}</span>
                      <span className="text-[10px] text-[#006b2c] font-semibold">{localities.length}+ Corridors</span>
                      <p className="text-[10px] text-gray-400 mt-1 truncate">{localities[0]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab5W === 'WHEN' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">The Fifth W</span>
                    <h3 className="text-xl font-bold text-gray-900">WHEN to Deploy? (Under 24 Hours)</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Deploying CommunityConnect does not require weeks of IT disruption. With automated Excel flat-roster imports, pre-mapped gate barrier controllers, and automated cryptographic invitation tokens, most communities transition in <strong>under 24 hours</strong> with zero downtime.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-center">
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-200">
                    <div className="text-sm font-bold text-purple-700">Hour 0–2</div>
                    <div className="text-xs font-bold text-gray-900 mt-1">Tenant Partition</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Automated PostgreSQL schema provisioned.</p>
                  </div>
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-200">
                    <div className="text-sm font-bold text-purple-700">Hour 2–6</div>
                    <div className="text-xs font-bold text-gray-900 mt-1">Roster Import</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Towers, units &amp; parking slots mapped.</p>
                  </div>
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-200">
                    <div className="text-sm font-bold text-purple-700">Hour 6–12</div>
                    <div className="text-xs font-bold text-gray-900 mt-1">FASTag Hardware</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">ANPR cameras paired to boom relays.</p>
                  </div>
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-200">
                    <div className="text-sm font-bold text-[#006b2c]">Hour 12–24</div>
                    <div className="text-xs font-bold text-gray-900 mt-1">Go Live</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Invites sent to residents &amp; guards.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS: 4-STEP ONBOARDING & RESIDENT JOURNEY */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 bg-[#FAF8F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold tracking-wider text-[#006b2c] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Operational Blueprint
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
              HOW It Works: From Contract to Automated Gate
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              A smooth, transparent four-stage journey for the Management Committee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#006b2c] flex items-center justify-center font-extrabold text-sm mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Configure Community</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Enter your city, society name, residential units, and gate topology in our interactive calculator below.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-[#006b2c] font-semibold">
                Takes 2 minutes
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-sm mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Select SaaS Plan</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Choose Growth Tier (₹35,000/mo) or Enterprise Premium (₹65,000/mo) with guaranteed transparent pricing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-purple-700 font-semibold">
                No hidden per-resident surcharges
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-sm mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Sign DPDP Contract</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Execute the digital Master Service Agreement guaranteeing Zero-Knowledge isolation &amp; 100% society data ownership.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-blue-700 font-semibold">
                Statutory DPDP Act 2023 Compliant
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-sm mb-4">
                  04
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Instant Dispatch</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Set up corporate auto-debit. Cryptographic JWT onboarding invitation dispatched directly to the MC President.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-amber-800 font-semibold">
                Instant activation token issued
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* "WANT TO JOIN US? CONNECT" INTERACTIVE ONBOARDING & PRICING CALCULATOR */}
      {/* ========================================================================= */}
      <section id="connect-onboarding-section" className="py-16 bg-white border-b border-gray-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#006b2c] text-xs font-bold mb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Interactive Onboarding &amp; Contract Gateway</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Want to Join Us? Connect Your Community
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Select your location, society size, and plan to view transparent pricing, review the digital contract, and complete instant enrollment.
            </p>
          </div>

          {/* Success Banner if Onboarded */}
          {onboardingSuccess && (
            <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-[#e8f5e9] border-2 border-emerald-300 text-emerald-950 shadow-lg animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#006b2c] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                      ENCLAVE PROVISIONED SUCCESSFULLY
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs font-mono font-bold text-gray-700">Ref: {onboardingSuccess.contractRef}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                    Welcome, {onboardingSuccess.community.name}!
                  </h3>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                    Your isolated PostgreSQL namespace <strong className="font-mono text-[#006b2c]">{onboardingSuccess.community.schemaId}</strong> is provisioned. A Master Service Agreement has been registered at ₹{onboardingSuccess.monthlyFee.toLocaleString('en-IN')}/mo under India's DPDP Act 2023.
                  </p>

                  <div className="mt-4 p-3.5 bg-white rounded-2xl border border-emerald-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      CRYPTOGRAPHIC ONBOARDING TOKEN (DISPATCHED TO {onboardingSuccess.community.presidentEmail})
                    </span>
                    <div className="font-mono text-emerald-800 text-xs sm:text-sm font-bold break-all bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                      {onboardingSuccess.inviteToken}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setInviteTokenInput(onboardingSuccess.inviteToken);
                        setShowActivateModal(true);
                      }}
                      className="px-5 py-2.5 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Activate Account &amp; Set Password Now</span>
                    </button>

                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 transition cursor-pointer"
                    >
                      Proceed to Portal Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onboarding Interactive Engine Canvas */}
          <form onSubmit={handleOnboardingSubmit} className="space-y-8">
            {/* Step 1: Location & Gated Community Profile */}
            <div className="bg-[#FAF8F5] rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Step 1: Location &amp; Community Topology</h3>
                  <p className="text-xs text-gray-500">Provide community details to calibrate pricing and infrastructure</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City */}
                <div>
                  <label htmlFor={citySelectId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    METRO CITY / STATE
                  </label>
                  <select
                    id={citySelectId}
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setLocality(cityPresets[e.target.value]?.[0] || 'Corridor Area');
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  >
                    {Object.keys(cityPresets).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Locality */}
                <div>
                  <label htmlFor={localityInputId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    LOCALITY / CORRIDOR
                  </label>
                  <input
                    id={localityInputId}
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Financial District"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  />
                </div>

                {/* Community Name */}
                <div>
                  <label htmlFor={commNameInputId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    GATED COMMUNITY NAME
                  </label>
                  <input
                    id={commNameInputId}
                    type="text"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    placeholder="e.g. Phoenix GolfEdge Enclave"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  />
                </div>

                {/* Community Type */}
                <div>
                  <label htmlFor={commTypeSelectId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    COMMUNITY ARCHETYPE
                  </label>
                  <select
                    id={commTypeSelectId}
                    value={communityType}
                    onChange={(e) => setCommunityType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  >
                    <option value="High-Rise Gated Society">High-Rise Towers (Multi-Tower Complex)</option>
                    <option value="Gated Luxury Villa Enclave">Luxury Villa Gated Community</option>
                    <option value="Integrated Residential Township">Integrated Plotted Township</option>
                  </select>
                </div>

                {/* Units Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor={unitsSliderId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      RESIDENTIAL HOMES / UNITS
                    </label>
                    <span className="text-xs font-extrabold text-[#006b2c]">{unitsCount} Flats</span>
                  </div>
                  <input
                    id={unitsSliderId}
                    type="range"
                    min="50"
                    max="2000"
                    step="25"
                    value={unitsCount}
                    onChange={(e) => setUnitsCount(Number(e.target.value))}
                    className="w-full accent-[#006b2c] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>50 units</span>
                    <span>500</span>
                    <span>1,000</span>
                    <span>2,000 units</span>
                  </div>
                </div>

                {/* Gates / Boom Barriers */}
                <div>
                  <label htmlFor={gatesInputId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    MAIN ENTRY / EXIT GATES (FASTag)
                  </label>
                  <input
                    id={gatesInputId}
                    type="number"
                    min="1"
                    max="12"
                    value={gatesCount}
                    onChange={(e) => setGatesCount(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Dynamic SaaS Plan Selection & Pricing Breakdown */}
            <div className="bg-[#FAF8F5] rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Step 2: Select SaaS Tier &amp; Review Dynamic Pricing</h3>
                    <p className="text-xs text-gray-500">Transparent monthly fee billed directly to the Management Committee</p>
                  </div>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('MONTHLY')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      billingCycle === 'MONTHLY' ? 'bg-[#006b2c] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly Auto-Debit
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('ANNUAL')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                      billingCycle === 'ANNUAL' ? 'bg-[#006b2c] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>Annual Contract</span>
                    <span className="text-[9px] bg-amber-400 text-gray-950 px-1 py-0.2 rounded font-extrabold">15% OFF</span>
                  </button>
                </div>
              </div>

              {/* The Two Standard SaaS Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tier 1: Growth Tier */}
                <div
                  onClick={() => handleSelectTierAndScroll('GROWTH_TIER')}
                  className={`p-6 rounded-3xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                    selectedTier === 'GROWTH_TIER'
                      ? 'bg-white border-[#006b2c] ring-2 ring-[#006b2c]/20 shadow-md'
                      : 'bg-white/60 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[10px] font-bold uppercase">
                        Growth Tier (Up to 500 units)
                      </span>
                      <input
                        type="radio"
                        name="saas_plan"
                        checked={selectedTier === 'GROWTH_TIER'}
                        onChange={() => handleSelectTierAndScroll('GROWTH_TIER')}
                        className="text-[#006b2c] focus:ring-[#006b2c]"
                      />
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mt-2">Community Growth</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Essential cloud portal for standard residential complexes looking to digitize gate passes &amp; dues.
                    </p>

                    <div className="my-5">
                      <div className="text-3xl font-extrabold text-gray-900">
                        ₹{(billingCycle === 'ANNUAL' ? Math.round(35000 * 0.85) : 35000).toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-gray-500 ml-1">/ month</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                        Approx. ₹{Math.round((billingCycle === 'ANNUAL' ? 29750 : 35000) / Math.max(unitsCount, 1))} per home/month
                      </div>
                    </div>

                    <ul className="text-xs text-gray-600 space-y-2.5 pt-2 border-t border-gray-100">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] shrink-0" />
                        <span>Multi-Tenant Postgres Row-Level Security</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] shrink-0" />
                        <span>Resident App &amp; Committee Notices</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] shrink-0" />
                        <span>Digital Visitor Gate Pass &amp; Guard Intercom</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] shrink-0" />
                        <span>Maintenance Dues UPI Collection &amp; Invoices</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTierAndScroll('GROWTH_TIER');
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        selectedTier === 'GROWTH_TIER'
                          ? 'bg-[#006b2c] hover:bg-[#00873a] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{selectedTier === 'GROWTH_TIER' ? 'Plan Selected ✓ Proceed to Contract (Step 3 & 4) ↓' : 'Select Growth Tier'}</span>
                    </button>
                  </div>
                </div>

                {/* Tier 2: Enterprise Premium Tier */}
                <div
                  onClick={() => handleSelectTierAndScroll('ENTERPRISE_PREMIUM')}
                  className={`p-6 rounded-3xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                    selectedTier === 'ENTERPRISE_PREMIUM'
                      ? 'bg-white border-[#006b2c] ring-2 ring-[#006b2c]/20 shadow-md'
                      : 'bg-white/60 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs">
                    RECOMMENDED FOR HIGH-RISES &amp; VILLAS
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                        Enterprise Premium (Unlimited units)
                      </span>
                      <input
                        type="radio"
                        name="saas_plan"
                        checked={selectedTier === 'ENTERPRISE_PREMIUM'}
                        onChange={() => handleSelectTierAndScroll('ENTERPRISE_PREMIUM')}
                        className="text-[#006b2c] focus:ring-[#006b2c]"
                      />
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mt-2">Enterprise Sovereign</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Full-suite enterprise software with dedicated schema isolation, FASTag ANPR integration, and 99.99% SLA.
                    </p>

                    <div className="my-5">
                      <div className="text-3xl font-extrabold text-[#006b2c]">
                        ₹{effectiveMonthlyFee.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-gray-500 ml-1">/ month</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                        Approx. ₹{effectivePerUnitMonthly} per home/month ({unitsCount} units)
                      </div>
                    </div>

                    <ul className="text-xs text-gray-600 space-y-2.5 pt-2 border-t border-gray-100">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] shrink-0" />
                        <span><strong>Dedicated PostgreSQL Schema Namespace</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] shrink-0" />
                        <span><strong>ANPR FASTag Camera Barrier Integration</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] shrink-0" />
                        <span>Move-In / Move-Out Physical Guard Inspection Workflow</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] shrink-0" />
                        <span>Dedicated 24/7 Account Manager &amp; 99.99% Uptime SLA</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTierAndScroll('ENTERPRISE_PREMIUM');
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        selectedTier === 'ENTERPRISE_PREMIUM'
                          ? 'bg-[#006b2c] hover:bg-[#00873a] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{selectedTier === 'ENTERPRISE_PREMIUM' ? 'Plan Selected ✓ Proceed to Contract (Step 3 & 4) ↓' : 'Select Enterprise Premium'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Contract & Statutory DPDP Terms */}
            <div id="privacy-contract" className="bg-[#FAF8F5] rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs scroll-mt-20">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Step 3: Master Service Agreement &amp; DPDP Contract</h3>
                  <p className="text-xs text-gray-500">Zero-Knowledge legal commitment between CommunityConnect and the Society RWA</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-200 max-h-48 overflow-y-auto text-xs text-gray-600 space-y-2 mb-4 leading-relaxed">
                <p className="font-bold text-gray-900 uppercase text-[11px]">
                  COMMUNITYCONNECT B2B MASTER SERVICE AGREEMENT &amp; STATUTORY DATA PROCESSING TERMS
                </p>
                <p>
                  1. <strong>Ownership of Data</strong>: The Client Gated Community retains 100% full ownership of all resident records, apartment data, vehicle registrations, and financial ledgers. CommunityConnect acts purely as a Data Processor under India’s Digital Personal Data Protection (DPDP) Act 2023.
                </p>
                <p>
                  2. <strong>Zero-Knowledge Isolation</strong>: The Platform Super-Administrator is cryptographically prevented from viewing, querying, or harvesting resident PII (including resident phone numbers, personal identity documents, or society bank balances). All data is strictly quarantined inside the society’s dedicated PostgreSQL database partition.
                </p>
                <p>
                  3. <strong>SLA &amp; Availability</strong>: CommunityConnect provides 99.99% cloud availability with real-time replication across multi-region availability zones.
                </p>
                <p>
                  4. <strong>30-Day Exit Freedom</strong>: No vendor lock-in. The society Management Committee may terminate this agreement with 30 days’ notice and receive a full, one-click export of their entire PostgreSQL schema.
                </p>
              </div>

              <label className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-emerald-200 cursor-pointer">
                <input
                  id={contractCheckboxId}
                  type="checkbox"
                  checked={agreedToContract}
                  onChange={(e) => setAgreedToContract(e.target.checked)}
                  required
                  className="mt-1 rounded text-[#006b2c] focus:ring-[#006b2c]"
                />
                <span className="text-xs text-gray-800 leading-snug">
                  <strong>Digital Signature &amp; Statutory Acceptance:</strong> On behalf of the Management Committee / RWA of <strong>{communityName || 'our gated community'}</strong>, I confirm acceptance of the CommunityConnect Master Service Agreement, Terms of Service, and Statutory DPDP Act 2023 Privacy Policy.
                </span>
              </label>
            </div>

            {/* Step 4: Management Committee Liaison & Payment */}
            <div className="bg-[#FAF8F5] rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Step 4: Management Committee Liaison &amp; Auto-Debit</h3>
                  <p className="text-xs text-gray-500">Official contact to receive the cryptographic onboarding invitation token</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={presNameId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    MC PRESIDENT / SECRETARY NAME
                  </label>
                  <input
                    id={presNameId}
                    type="text"
                    value={presidentName}
                    onChange={(e) => setPresidentName(e.target.value)}
                    placeholder="e.g. S. Venkat Reddy"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  />
                </div>

                <div>
                  <label htmlFor={presEmailId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    OFFICIAL MC EMAIL (RECEIVES TOKEN)
                  </label>
                  <input
                    id={presEmailId}
                    type="email"
                    value={presidentEmail}
                    onChange={(e) => setPresidentEmail(e.target.value)}
                    placeholder="e.g. president@phoenixgolfedge.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  />
                </div>

                <div>
                  <label htmlFor={presPhoneId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    MC CONTACT MOBILE (WHATSAPP)
                  </label>
                  <input
                    id={presPhoneId}
                    type="tel"
                    value={presidentPhone}
                    onChange={(e) => setPresidentPhone(e.target.value)}
                    placeholder="+91 98490 12345"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  />
                </div>

                <div className="md:col-span-3">
                  <label htmlFor={paymentMethodId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    B2B PAYMENT &amp; RECONCILIATION METHOD
                  </label>
                  <select
                    id={paymentMethodId}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  >
                    <option value="AUTODEBIT">Corporate Auto-Debit Mandate (HDFC / ICICI / SBI e-NACH)</option>
                    <option value="RAZORPAY_CORP">Corporate Credit Card (Automated Monthly Recurring)</option>
                    <option value="BANK_RTGS">Annual Advance Wire Transfer (RTGS / NEFT Invoice)</option>
                  </select>
                </div>
              </div>

              {/* Submit Action Button */}
              <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500">Monthly Licensing Inflow:</span>
                  <div className="text-xl font-extrabold text-[#006b2c]">
                    ₹{effectiveMonthlyFee.toLocaleString('en-IN')} / month
                    <span className="text-xs font-normal text-gray-400 ml-2">
                      ({billingCycle === 'ANNUAL' ? '₹' + annualTotal.toLocaleString('en-IN') + ' / yr' : 'Auto-debited on 1st of every month'})
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isOnboardingSubmitting}
                  id="submit-onboarding-btn"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#006b2c] hover:bg-[#00873a] text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-700/20 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isOnboardingSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Provisioning Database Schema &amp; Issuing Token...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Onboarding &amp; Generate Activation Token</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* LIVE COMMUNITIES ON COMMUNITYCONNECT */}
      {/* ========================================================================= */}
      <section id="live-enclaves" className="py-16 bg-[#FAF8F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold tracking-wider text-[#006b2c] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Ecosystem Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                Multiple Communities on One Platform
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Each enclave maintains isolated PostgreSQL tenant storage while enjoying universal platform capabilities.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500 mt-2 sm:mt-0">
              Showing active certified communities
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_COMMUNITIES.slice(0, 3).map((comm) => (
              <div
                key={comm.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img
                    src={comm.imageUrl}
                    alt={comm.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                      DPDP COMPLIANT
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white drop-shadow-md">
                    <h3 className="font-bold text-base">{comm.name}</h3>
                    <p className="text-xs text-white/90">{comm.area}, {comm.city}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-2 text-center py-2.5 bg-gray-50 rounded-2xl border border-gray-100 mb-4 text-xs">
                    <div>
                      <div className="text-[10px] text-gray-500">Towers</div>
                      <div className="font-bold text-gray-900">{comm.towers}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">Units</div>
                      <div className="font-bold text-gray-900">{comm.totalUnits}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">SaaS Tier</div>
                      <div className="font-bold text-[#006b2c]">{comm.plan === 'ENTERPRISE_PREMIUM' ? '₹65k/mo' : '₹35k/mo'}</div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                    {comm.description}
                  </p>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 text-[11px]">
                      MC President: <strong>{comm.presidentName}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(true)}
                      className="text-[#006b2c] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* QUICK LOGIN FOOTER CALLOUT */}
      {/* ========================================================================= */}
      <section className="py-14 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#131B2E] to-[#1E293B] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Ready to Enter Your Workspace?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">
                Unified Portal Access for Admins, Residents, and Staff.
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                Sign in with your email or authorized login ID to access your community console, manage passes, and view invoices.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-3.5 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Open Portal Login</span>
              </button>

              <button
                onClick={() => setShowActivateModal(true)}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-emerald-300" />
                <span>Activate Invitation Token</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-white py-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-gray-100">
            <BrandLogo size="md" />
            <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
              <button onClick={scrollToAbout} className="hover:text-gray-900 cursor-pointer">About (5 Ws)</button>
              <button onClick={scrollToConnect} className="hover:text-gray-900 cursor-pointer">Pricing Calculator</button>
              <a href="#privacy-contract" className="hover:text-gray-900">DPDP Act 2023</a>
              <button onClick={() => setShowLoginModal(true)} className="hover:text-gray-900 cursor-pointer">Portal Sign In</button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
            <p>© 2026 CommunityConnect Technologies Inc. One Platform. Many Communities. Better Living.</p>
            <div className="flex items-center gap-3">
              <span>Zero-Knowledge Multi-Tenant Partitioning</span>
              <span>•</span>
              <span>Compliant with DPDP Act 2023</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL 1: EXISTING MEMBER SIGN IN & UNIFIED PORTAL */}
      {/* ========================================================================= */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md sm:max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer transition hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#006b2c] mx-auto flex items-center justify-center mb-2.5 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Portal Sign In</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Sign in with your registered email or authorized login ID to access your community console.
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Manual Credentials Form (Always directly visible) */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label htmlFor={loginIdField} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  EMAIL OR LOGIN ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id={loginIdField}
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. president@phoenixgolfedge.com or mobile"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor={loginPassField} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link dispatched to your registered contact.')}
                    className="text-[11px] text-[#006b2c] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id={loginPassField}
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c] focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 px-4 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loginLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Down Below Form: Authorized Members & Staff (1-Click Access) */}
            <div className="mt-4 pt-3.5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#006b2c]" />
                  <span>Existing Member &amp; Staff Sign In (8 Roles)</span>
                </span>
                <span className="text-[10px] text-[#006b2c] font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  1-Click Access
                </span>
              </div>

              <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
                {QUICK_PRECONFIGURED_MEMBERS.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    disabled={loginLoading}
                    onClick={() => {
                      setLoginIdentifier(member.email);
                      setLoginPassword(member.password);
                      handleQuickLogin(member.email, member.password);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-gray-50/80 hover:bg-emerald-50/60 border border-gray-200/80 hover:border-emerald-300 transition flex items-center justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#006b2c] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs uppercase">
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-gray-900 group-hover:text-[#006b2c] transition truncate">
                            {member.name}
                          </span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${member.roleBadgeBg}`}>
                            {member.roleLabel}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 truncate block">
                          {member.title} • {member.org}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#006b2c] group-hover:underline shrink-0 flex items-center gap-0.5">
                      Sign In →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Invitation Token Activation */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Received an invitation token from your community?
              </p>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowActivateModal(true);
                }}
                className="mt-1 text-xs font-bold text-[#006b2c] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Activate Invitation &amp; Set Password →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INVITATION TOKEN ACTIVATION */}
      {/* ========================================================================= */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowActivateModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 mx-auto flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Activate Community Invitation</h3>
              <p className="text-xs text-gray-500 mt-1">
                Paste your cryptographic token received via email to activate your account.
              </p>
            </div>

            {activateError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{activateError}</span>
              </div>
            )}

            {activateSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#006b2c] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Account verified and activated! Signing you in...</span>
              </div>
            )}

            <form onSubmit={handleActivateInvite} className="space-y-4">
              <div>
                <label htmlFor={inviteTokenId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  INVITATION TOKEN
                </label>
                <input
                  id={inviteTokenId}
                  type="text"
                  value={inviteTokenInput}
                  onChange={(e) => setInviteTokenInput(e.target.value)}
                  placeholder="jwt.inv_..."
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label htmlFor={newPassId} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  SET YOUR PERMANENT PASSWORD
                </label>
                <input
                  id={newPassId}
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Minimum 4 characters"
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <button
                type="submit"
                disabled={activateLoading}
                className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {activateLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Validating Token &amp; Provisioning Access...</span>
                  </>
                ) : (
                  <>
                    <span>Activate Account &amp; Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Account Blocked / Frozen Community Modal Pop-up */}
      {blockedModalData && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-rose-300 flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-100 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3.5 bg-rose-100 text-rose-700 rounded-2xl border border-rose-300 shrink-0 shadow-sm">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wide mb-1.5 shadow-xs">
                  🔒 Subscription Frozen / Access Suspended
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Community Access Blocked</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Portal access for <span className="font-bold text-slate-900">{blockedModalData.communityName}</span> has been frozen by Platform HQ Operations.
                </p>
              </div>
            </div>

            <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200/90 flex flex-col gap-1.5 relative z-10">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">Freeze Reason / Notice</span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed italic">
                "{blockedModalData.reason}"
              </p>
            </div>

            <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 flex flex-col gap-2 relative z-10">
              <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                How to Restore Service / Contact Admin:
              </span>
              <p className="text-[11px] text-amber-900 leading-normal">
                Please contact Platform HQ Super-Admin or Finance Office to unfreeze society access and restore live portal services:
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-2 border-t border-amber-200/80 font-bold text-xs">
                <a href={`mailto:${blockedModalData.contactEmail}`} className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-[#006b2c] rounded-xl border border-emerald-300 transition flex items-center gap-1.5 cursor-pointer">
                  📧 <span>{blockedModalData.contactEmail}</span>
                </a>
                <a href={`tel:${blockedModalData.contactPhone}`} className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl border border-sky-300 transition flex items-center gap-1.5 cursor-pointer">
                  📞 <span>{blockedModalData.contactPhone}</span>
                </a>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 relative z-10">
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
