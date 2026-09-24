import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { authApi } from '../../api/authApi';
import { 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Sparkles,
  X
} from 'lucide-react';

const EIGHT_QUICK_MEMBERS = [
  {
    id: 'usr-plat-admin',
    name: 'Devashish Sen',
    role: 'PLATFORM_ADMIN',
    badge: 'Super Admin',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'COO • Platform HQ',
    email: 'admin@communityconnect.com',
    avatar: null
  },
  {
    id: 'usr-comm-bhooja',
    name: 'S. Venkat Reddy',
    role: 'COMMUNITY_ADMIN',
    badge: 'Community Admin',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'MC President • My Home Bhooja',
    email: 'president.bhooja@communityconnect.com',
    avatar: null
  },
  {
    id: 'usr-res-arjun',
    name: 'Arjun Kumar',
    role: 'RESIDENT',
    badge: 'Resident #1 (A-1204)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Flat A-1204 • My Home Bhooja',
    email: 'arjun.kumar@example.com',
    avatar: null
  },
  {
    id: 'usr-res-priya',
    name: 'Priya Verma',
    role: 'RESIDENT',
    badge: 'Resident #2 (C-502)',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    title: 'Flat C-502 • My Home Bhooja',
    email: 'priya.verma@example.com',
    avatar: null
  },
  {
    id: 'usr-sec-ramsingh',
    name: 'Havaldar Ram Singh',
    role: 'SECURITY_TEAM',
    badge: 'Security Gate Guard',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Gate 1 North Guard',
    email: 'security.gate1@communityconnect.com',
    avatar: null
  },
  {
    id: 'usr-prov-cool',
    name: 'CoolingPro AC Solutions',
    role: 'SERVICE_PROVIDER',
    badge: 'AC Contractor',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    title: 'Suresh Varma • Partner • AC & Appliance Maintenance',
    email: 'coolingpro.service@example.com',
    avatar: null
  },
  {
    id: 'usr-prov-sunita',
    name: 'Sunita Devi',
    role: 'SERVICE_PROVIDER',
    badge: 'Home Cook',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    title: 'Verified Home Cook • Gate OTP Access',
    email: 'sunita.cook@example.com',
    avatar: null
  },
  {
    id: 'usr-prov-lakshmi',
    name: 'Lakshmi Bai',
    role: 'SERVICE_PROVIDER',
    badge: 'Housekeeper Maid',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    title: 'Verified Maid • Biometric Facial Log',
    email: 'lakshmi.maid@example.com',
    avatar: null
  },
  {
    id: 'usr-prov-ramesh',
    name: 'Ramesh Kumar',
    role: 'SERVICE_PROVIDER',
    badge: 'Private Driver',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    title: 'Verified Driver • Chauffeur Pass',
    email: 'ramesh.driver@example.com',
    avatar: null
  }
];

export const CommonLogin = ({ onLoginSuccess, onNavigate, initialBlockedModalData }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Active Quick Persona Profile Category Tab ('staff' | 'contractor' | 'residents' | 'admins')
  const [activeProfileTab, setActiveProfileTab] = useState('staff');

  // Invitation Activation Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteToken, setInviteToken] = useState('');
  const [newInvitePassword, setNewInvitePassword] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const [blockedModalData, setBlockedModalData] = useState(initialBlockedModalData || null);
  const [pendingApprovalModalData, setPendingApprovalModalData] = useState(null);

  React.useEffect(() => {
    if (initialBlockedModalData) {
      setBlockedModalData(initialBlockedModalData);
    }
  }, [initialBlockedModalData]);

  const handleAuthError = (err) => {
    const msg = typeof err === 'string' ? err : (err?.message || '');
    if (err?.isBlocked || msg === 'COMMUNITY_FROZEN' || msg.includes('FROZEN') || msg.includes('frozen')) {
      setBlockedModalData({
        communityName: err?.communityName || 'Lodha Meridian',
        reason: err?.freezeReason || 'Annual Platform License Renewal past due by 45 days. Restricted to read-only security safety logs.',
        contactEmail: err?.contactEmail || 'support@communityconnect.io',
        contactPhone: err?.contactPhone || '+91 800-266-6864'
      });
      setErrorMsg(null);
    } else if (err?.isPendingApproval || msg === 'RESIDENT_PENDING_APPROVAL' || msg.includes('PENDING_APPROVAL')) {
      setPendingApprovalModalData({
        communityName: err?.communityName || 'Community',
        flatNumber: err?.flatNumber || 'Flat',
        residentName: err?.residentName || 'Resident',
        contactEmail: err?.contactEmail || 'admin@communityconnect.io',
        contactPhone: err?.contactPhone || '+91 800-266-6864'
      });
      setErrorMsg(null);
    } else {
      setErrorMsg(msg || 'Authentication failed. Please verify credentials.');
    }
  };

  // Handle standard login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or authorized login ID.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await authApi.login(identifier, password);
      onLoginSuccess(response.user);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle invitation activation
  const handleActivateInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const res = await authApi.activateInvitation(inviteToken, newInvitePassword);
      setInviteSuccess(true);
      setTimeout(() => {
        setShowInviteModal(false);
        onLoginSuccess(res.user);
      }, 900);
    } catch (err) {
      setErrorMsg('Invalid or expired invitation token.');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ambient-pattern grid-pattern flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
      {/* Top Bar with Brand and Gateway Status */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <BrandLogo size="md" />

        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('website')}
              className="text-xs font-bold text-[#16A34A] hover:text-[#15803D] hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs"
            >
              <span>← CommunityConnect Website &amp; 5 Ws</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>Unified Security Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-200/80 p-6 sm:p-8 backdrop-blur-sm relative">
          {/* Subtle brand glow accent at top */}
          <div className="absolute -top-[1px] left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[#16A34A] to-transparent"></div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Sign in with your email or authorized login ID to access your community workspace.
            </p>
          </div>

          {/* Error notice if any */}
          {errorMsg && (
            <div 
              onClick={() => {
                if (errorMsg.includes('FROZEN') || errorMsg === 'COMMUNITY_FROZEN') {
                  setBlockedModalData({
                    communityName: 'Lodha Meridian',
                    reason: 'Annual Platform License Renewal past due by 45 days. Restricted to read-only security safety logs.',
                    contactEmail: 'support@communityconnect.io',
                    contactPhone: '+91 800-266-6864'
                  });
                }
              }}
              className={`mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2 ${
                (errorMsg.includes('FROZEN') || errorMsg === 'COMMUNITY_FROZEN') ? 'cursor-pointer hover:bg-rose-100 transition shadow-2xs' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {errorMsg === 'COMMUNITY_FROZEN' ? '🔒 Subscription Frozen / Access Blocked' : errorMsg}
                </span>
              </div>
              {(errorMsg.includes('FROZEN') || errorMsg === 'COMMUNITY_FROZEN') && (
                <span className="text-[10px] font-bold underline bg-rose-200 text-rose-900 px-2 py-0.5 rounded shrink-0">
                  View Lock Details &amp; Unfreeze
                </span>
              )}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Identifier */}
            <div>
              <label
                htmlFor="login-identifier"
                className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                EMAIL OR LOGIN ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or mobile"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-[11px] font-bold uppercase tracking-wider text-gray-700"
                >
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset instructions dispatched to registered email/mobile.')}
                  className="text-[11px] text-[#0EA5E9] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#16A34A] border-gray-300 rounded focus:ring-[#16A34A]"
                />
                <span className="text-xs text-gray-600">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-700/20 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Spring Security Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Preconfigured Members & Staff Quick Sign In (8 Roles) */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>EXISTING MEMBER &amp; STAFF SIGN IN (8 ROLES)</span>
              </span>
              <span className="text-[10px] text-[#16A34A] font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                1-Click Access
              </span>
            </div>

            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1 select-none">
              {EIGHT_QUICK_MEMBERS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setIdentifier(m.email);
                    setPassword('password123');
                    setIsLoading(true);
                    authApi.login(m.email, 'password123')
                      .then((res) => onLoginSuccess(res.user))
                      .catch((err) => handleAuthError(err))
                      .finally(() => setIsLoading(false));
                  }}
                  className="w-full text-left p-2 sm:p-2.5 rounded-xl bg-gray-50/80 hover:bg-emerald-50/60 border border-gray-200/80 hover:border-emerald-300 transition flex items-center justify-between gap-2.5 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs uppercase">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-gray-900 group-hover:text-[#16A34A] transition truncate">
                          {m.name}
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 truncate block">
                        {m.title}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-[#16A34A] group-hover:underline shrink-0 flex items-center gap-0.5">
                    Sign In →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider text-[10px]">
                OR
              </span>
            </div>
          </div>

          {/* Invitation Activation Channel */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-600 font-medium">
              Invited by your community or association?
            </p>
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:text-[#15803D] hover:underline cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Activate Invitation &amp; Set Password →</span>
            </button>
          </div>

          {/* Want to Onboard / Explore 5 Ws Callout */}
          {onNavigate && (
            <div className="mt-3 bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-center">
              <p className="text-xs text-emerald-950 font-medium">
                Want to onboard your gated community?
              </p>
              <button
                type="button"
                onClick={() => onNavigate('website')}
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:text-[#15803D] hover:underline cursor-pointer"
              >
                <span>Explore The 5 Ws, Dynamic Pricing &amp; Contract →</span>
              </button>
            </div>
          )}
        </div>

        {/* Security Seals */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center flex-wrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted</span>
          <span>•</span>
          <span>SOC2 Type II Certified</span>
          <span>•</span>
          <span>Spring Security Protected</span>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full max-w-6xl mx-auto py-4 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
        <p>© 2026 CommunityConnect. One Platform. Many Communities. Better Living.</p>
        <div className="flex items-center gap-4 text-gray-500">
          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: End-to-end multi-tenant isolation enforced.'); }} className="hover:underline">Privacy Policy</a>
          <span>•</span>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: Standard residential SLA applied.'); }} className="hover:underline">Terms of Service</a>
          <span>•</span>
          <a href="#help" onClick={(e) => { e.preventDefault(); alert('Help Center: Connect with your community estate manager or dial 108.'); }} className="hover:underline">Help Center</a>
        </div>
      </footer>

      {/* Invitation Activation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Activate Admin Account</h3>
                  <p className="text-[11px] text-gray-500">Enter your secure invitation token</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-center">
                <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto mb-2" />
                <div className="font-bold text-sm">Account Successfully Activated!</div>
                <div className="mt-1">Initializing your secure session workspace...</div>
              </div>
            ) : (
              <form onSubmit={handleActivateInvite} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    INVITATION TOKEN / JWT
                  </label>
                  <input
                    type="text"
                    value={inviteToken}
                    onChange={(e) => setInviteToken(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    CREATE SECURE PASSWORD
                  </label>
                  <input
                    type="password"
                    value={newInvitePassword}
                    onChange={(e) => setNewInvitePassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
                  Upon activation, this cryptographic token verifies your designation with the Platform Master Registry.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50"
                  >
                    {inviteLoading ? 'Activating...' : 'Activate & Enter Workspace'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
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

      {/* Resident Registration Pending Approval Modal Pop-up */}
      {pendingApprovalModalData && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-amber-200 flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-100 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3.5 bg-amber-100 text-amber-800 rounded-2xl border border-amber-300 shrink-0 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wide mb-1.5 shadow-xs">
                  ⏳ Registration Request Pending
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Portal Access Locked</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Resident account for <span className="font-bold text-slate-900">{pendingApprovalModalData.residentName}</span> ({pendingApprovalModalData.flatNumber}) is under Management Committee review.
                </p>
              </div>
            </div>

            <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200/90 flex flex-col gap-2 relative z-10 text-xs text-amber-950">
              <span className="font-extrabold text-amber-900 uppercase tracking-wider text-[10px]">Zero-Trust Security Notice</span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                Temporary access credentials are disabled to protect society data privacy. You will gain full portal access once the President approves your residency application.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs text-gray-800 flex flex-col gap-2 relative z-10">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500 font-medium">Estimated Waiting Period:</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded-md border border-gray-200">24 – 48 Hours (2–5 Days)</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500 font-medium">SMS Alert Notification:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched upon Approval
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-100 relative z-10">
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    setPendingApprovalModalData(null);
                    onNavigate('community-admin');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Switch to President View to Approve</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setPendingApprovalModalData(null)}
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
