import React, { useState } from 'react';
import { INITIAL_COMMUNITIES } from '../../data/initialData';
import { authApi } from '../../api/authApi';
import { BrandLogo } from '../common/BrandLogo';

export const PlatformMasterConsole = ({ currentUser, onNavigate, onLogout }) => {
  // Navigation tabs: 'tenants' | 'billing' | 'policies' | 'invites' | 'health'
  const [activeTab, setActiveTab] = useState('tenants');
  const [communities, setCommunities] = useState(() => {
    return INITIAL_COMMUNITIES.map((c) => ({
      ...c,
      subscriptionFee: c.plan === 'ENTERPRISE_PREMIUM' ? 65000 : 35000,
      privacyPolicyStatus: 'ACCEPTED',
      privacyPolicyDate: c.onboardedDate || '2025-01-15',
      dpdpCompliant: true,
      termsOfService: 'SIGNED',
      schemaId: `tenant_schema_${c.id.replace('comm-', '')}`,
      inviteStatus: 'ACTIVATED'
    }));
  });
  const [invitations, setInvitations] = useState(() => authApi.getInvitations());
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');

  // Search & Filter for Tenants Tab
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantFilter, setTenantFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'FROZEN' | 'ENTERPRISE' | 'GROWTH'

  // Modals
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [selectedCommForFreeze, setSelectedCommForFreeze] = useState(null);
  const [freezeReasonInput, setFreezeReasonInput] = useState('Monthly platform SaaS license past due by 30 days.');

  // Tenant Inspector Modal
  const [inspectModalComm, setInspectModalComm] = useState(null);

  // SaaS Plan Change Modal
  const [planChangeModal, setPlanChangeModal] = useState({ isOpen: false, comm: null, newPlan: 'ENTERPRISE_PREMIUM' });

  // Onboard Community Form State
  const [newCommName, setNewCommName] = useState('');
  const [newCommCity, setNewCommCity] = useState('Hyderabad');
  const [newCommArea, setNewCommArea] = useState('Financial District');
  const [newCommPlan, setNewCommPlan] = useState('ENTERPRISE_PREMIUM');
  const [newCommPresident, setNewCommPresident] = useState('');
  const [newCommEmail, setNewCommEmail] = useState('');

  // Isolation Penetration Test State
  const [isTestingIsolation, setIsTestingIsolation] = useState(false);
  const [isolationTestLog, setIsolationTestLog] = useState(null);

  // Cluster Operation State
  const [clusterRunningAction, setClusterRunningAction] = useState(null);

  // Monthly Flow Architecture Explainer Modal
  const [showMonthlyFlowModal, setShowMonthlyFlowModal] = useState(false);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  const handleToggleFreeze = (comm) => {
    if (comm.status === 'FROZEN') {
      const updated = communities.map((c) =>
        c.id === comm.id ? { ...c, status: 'ACTIVE', freezeReason: null } : c
      );
      setCommunities(updated);
      showToast(`${comm.name} has been restored to ACTIVE status across all clusters.`, 'success');
      if (inspectModalComm && inspectModalComm.id === comm.id) {
        setInspectModalComm({ ...inspectModalComm, status: 'ACTIVE', freezeReason: null });
      }
    } else {
      setSelectedCommForFreeze(comm);
      setShowFreezeModal(true);
    }
  };

  const confirmFreeze = (e) => {
    e.preventDefault();
    if (!selectedCommForFreeze) return;

    const updated = communities.map((c) =>
      c.id === selectedCommForFreeze.id
        ? { ...c, status: 'FROZEN', freezeReason: freezeReasonInput }
        : c
    );
    setCommunities(updated);
    setShowFreezeModal(false);
    showToast(`Tenant isolation freeze applied to ${selectedCommForFreeze.name}. Platform console locked to read-only safety mode.`, 'error');
    if (inspectModalComm && inspectModalComm.id === selectedCommForFreeze.id) {
      setInspectModalComm({ ...inspectModalComm, status: 'FROZEN', freezeReason: freezeReasonInput });
    }
  };

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!newCommName.trim()) return;

    const newId = `comm-${newCommName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 14)}`;
    const fee = newCommPlan === 'ENTERPRISE_PREMIUM' ? 65000 : 35000;

    const newCommunity = {
      id: newId,
      name: newCommName,
      city: newCommCity,
      state: 'Telangana',
      area: newCommArea || 'Hi-Tech City Corridor',
      status: 'ACTIVE',
      plan: newCommPlan,
      subscriptionStatus: 'ACTIVE',
      subscriptionFee: fee,
      privacyPolicyStatus: 'ACCEPTED',
      privacyPolicyDate: new Date().toISOString().split('T')[0],
      dpdpCompliant: true,
      termsOfService: 'SIGNED',
      schemaId: `tenant_schema_${newId.replace('comm-', '')}`,
      inviteStatus: 'INVITATION_SENT',
      presidentName: newCommPresident || 'Committee General Secretary',
      presidentEmail: newCommEmail || `admin.${newId}@communityconnect.io`,
      description: 'Newly provisioned gated enclave with isolated database partition and zero-knowledge privacy enforcement.',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      onboardedDate: new Date().toISOString().split('T')[0]
    };

    authApi.createInvitation({
      communityId: newId,
      communityName: newCommName,
      recipientEmail: newCommEmail || `admin.${newId}@communityconnect.io`,
      recipientName: newCommPresident || 'Society President',
      role: 'COMMUNITY_ADMIN'
    });

    setCommunities([newCommunity, ...communities]);
    setInvitations(authApi.getInvitations());
    setShowOnboardModal(false);
    setNewCommName('');
    setNewCommPresident('');
    setNewCommEmail('');
    showToast(`Successfully onboarded ${newCommName}! Cryptographic JWT invitation dispatched to ${newCommEmail}.`, 'success');
  };

  const handleVerifyPolicy = (comm) => {
    showToast(`Audit complete for ${comm.name}: Privacy Policy, DPDP Act 2023, & Zero-Knowledge Isolation verified 100% compliant.`, 'success');
  };

  const handleResendInvite = (id) => {
    try {
      const inv = authApi.resendInvitation(id);
      setInvitations(authApi.getInvitations());
      showToast(`Refreshed cryptographic token dispatched to ${inv.recipientEmail}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to resend token', 'error');
    }
  };

  const handleRevokeInvite = (id) => {
    try {
      authApi.revokeInvitation(id);
      setInvitations(authApi.getInvitations());
      showToast('Invitation token revoked immediately.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to revoke token', 'error');
    }
  };

  const handleApplyPlanChange = (e) => {
    e.preventDefault();
    if (!planChangeModal.comm) return;

    const newFee = planChangeModal.newPlan === 'ENTERPRISE_PREMIUM' ? 65000 : 35000;
    const updated = communities.map((c) =>
      c.id === planChangeModal.comm.id
        ? { ...c, plan: planChangeModal.newPlan, subscriptionFee: newFee }
        : c
    );
    setCommunities(updated);
    setPlanChangeModal({ isOpen: false, comm: null, newPlan: 'ENTERPRISE_PREMIUM' });
    showToast(`Updated subscription tier for ${planChangeModal.comm.name} to ${planChangeModal.newPlan} (₹${newFee.toLocaleString('en-IN')}/mo).`, 'success');
    if (inspectModalComm && inspectModalComm.id === planChangeModal.comm.id) {
      setInspectModalComm({ ...inspectModalComm, plan: planChangeModal.newPlan, subscriptionFee: newFee });
    }
  };

  // Run Penetration & Cross-Tenant Leakage Test
  const handleRunIsolationTest = () => {
    setIsTestingIsolation(true);
    showToast('Executing zero-trust cross-tenant isolation penetration suite...', 'info');

    setTimeout(() => {
      setIsTestingIsolation(false);
      setIsolationTestLog([
        {
          id: 'TEST-01',
          name: 'Row-Level Security (RLS) SQL Injection Tenant Bypass Test',
          target: 'SELECT * FROM maintenance_tickets WHERE tenant_id = ? OR 1=1',
          result: 'BLOCKED_BY_RLS',
          status: 'PASSED',
          latency: '1.2ms',
          details: 'Postgres RLS policy enforced at connection kernel. 0 cross-tenant rows exposed.'
        },
        {
          id: 'TEST-02',
          name: 'Zero-Knowledge Privacy Leakage Audit (Admin PII Access Check)',
          target: 'SELECT resident_phone, email, bank_account FROM resident_profiles',
          result: 'ENCRYPTED_OPAQUE_BLOB',
          status: 'PASSED',
          latency: '0.8ms',
          details: 'Platform super-admin has 0 access to resident PII per DPDP Act 2023 regulations.'
        },
        {
          id: 'TEST-03',
          name: 'Cryptographic JWT Tenant Claim Tampering Probe',
          target: 'Bearer eyJhbGciOiJSUzI1NiIsInRlbmFudF9pZCI6InJvb3QifQ...',
          result: 'SIGNATURE_INVALID_401',
          status: 'PASSED',
          latency: '1.9ms',
          details: 'Spring Security 6.2 rejected forged tenant token claims immediately.'
        },
        {
          id: 'TEST-04',
          name: 'WebSocket STOMP Channel Cross-Talk Leakage Test',
          target: 'SUBSCRIBE /topic/tenant.comm-saket.gate-events',
          result: 'UNAUTHORIZED_401',
          status: 'PASSED',
          latency: '1.1ms',
          details: 'Handshake intercepted: JWT lacks tenant authorization for target channel.'
        }
      ]);
      showToast('Penetration test passed: 100% tenant data isolation & zero-knowledge privacy confirmed!', 'success');
    }, 1400);
  };

  // Cluster maintenance operations
  const handleClusterAction = (actionName, successMessage) => {
    setClusterRunningAction(actionName);
    setTimeout(() => {
      setClusterRunningAction(null);
      showToast(successMessage, 'success');
    }, 1200);
  };

  // Filtered communities for Tenants Tab
  const filteredCommunities = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      (c.area && c.area.toLowerCase().includes(tenantSearch.toLowerCase())) ||
      (c.presidentName && c.presidentName.toLowerCase().includes(tenantSearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (tenantFilter === 'ACTIVE') return c.status === 'ACTIVE';
    if (tenantFilter === 'FROZEN') return c.status === 'FROZEN';
    if (tenantFilter === 'ENTERPRISE') return c.plan === 'ENTERPRISE_PREMIUM';
    if (tenantFilter === 'GROWTH') return c.plan === 'GROWTH_TIER';
    return true;
  });

  // Calculate SaaS Subscription metrics (Platform only, not internal society maintenance)
  const totalSubscriptionMRR = communities.reduce(
    (acc, c) => acc + (c.subscriptionFee || (c.plan === 'ENTERPRISE_PREMIUM' ? 65000 : 35000)),
    0
  );
  const totalInflow = totalSubscriptionMRR;
  const activeCount = communities.filter((c) => c.status === 'ACTIVE').length;
  const frozenCount = communities.filter((c) => c.status === 'FROZEN').length;
  const enterpriseCount = communities.filter((c) => c.plan === 'ENTERPRISE_PREMIUM').length;
  const compliantCount = communities.filter((c) => (c.privacyPolicyStatus || 'ACCEPTED') === 'ACCEPTED').length;

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

      {/* Fixed Left Navigation Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white z-40 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#eaedff]">
        <div>
          {/* Brand Header: Crisp CommunityConnect Logo + Properly Formatted Platform Root Super-Admin */}
          <div className="h-16 px-5 flex items-center gap-3 border-b border-[#eaedff] bg-white">
            {/* Custom CommunityConnect Vector House Logo Mark matching Community Admin */}
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#006b2c] to-[#004d1f] p-1.5 flex items-center justify-center text-white shadow-sm relative overflow-hidden">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M18 4L4 15V30C4 31.1 4.9 32 6 32H30C31.1 32 32 31.1 32 30V15L18 4Z" fill="white" />
                <path d="M14 32V25C14 23.9 14.9 23 16 23H20C21.1 23 22 23.9 22 25V32H14Z" fill="#006b2c" />
                <circle cx="12.5" cy="14" r="2.8" fill="#0EA5E9" />
                <path d="M8.5 21C8.5 19.3 10.2 18 12.5 18C14.8 18 16.5 19.3 16.5 21V22H8.5V21Z" fill="#0EA5E9" />
                <circle cx="23.5" cy="14" r="2.8" fill="#F59E0B" />
                <path d="M19.5 21C19.5 19.3 21.2 18 23.5 18C25.8 18 27.5 19.3 27.5 21V22H19.5V21Z" fill="#F59E0B" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#131b2e] tracking-tight leading-tight">CommunityConnect</span>
              <span className="text-[10px] text-[#006b2c] font-bold uppercase tracking-wider">
                Platform Root Super-Admin
              </span>
            </div>
          </div>

          {/* Navigation Links - Clean 5 Tabs Only */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => handleTabSwitch('tenants')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'tenants'
                  ? 'bg-[#00873a] text-white font-bold shadow-sm'
                  : 'text-[#3e4a3d] hover:bg-[#f2f3ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">apartment</span>
                <span>Multi-Tenant Societies</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'tenants' ? 'bg-white/20 text-white' : 'bg-[#e2e7ff] text-[#131b2e]'}`}>
                {communities.length}
              </span>
            </button>

            <button
              onClick={() => handleTabSwitch('billing')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'billing'
                  ? 'bg-[#00873a] text-white font-bold shadow-sm'
                  : 'text-[#3e4a3d] hover:bg-[#f2f3ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">payments</span>
                <span>Platform Subscriptions &amp; MRR</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'billing' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'}`}>
                ₹{(totalSubscriptionMRR / 1000).toFixed(0)}k
              </span>
            </button>

            <button
              onClick={() => handleTabSwitch('policies')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'policies'
                  ? 'bg-[#00873a] text-white font-bold shadow-sm'
                  : 'text-[#3e4a3d] hover:bg-[#f2f3ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span>Privacy Policy &amp; DPDP Audit</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'policies' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                100%
              </span>
            </button>

            <button
              onClick={() => handleTabSwitch('invites')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'invites'
                  ? 'bg-[#00873a] text-white font-bold shadow-sm'
                  : 'text-[#3e4a3d] hover:bg-[#f2f3ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">mail</span>
                <span>Admin Onboarding Invites</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'invites' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}`}>
                {invitations.length}
              </span>
            </button>

            <button
              onClick={() => handleTabSwitch('health')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'health'
                  ? 'bg-[#00873a] text-white font-bold shadow-sm'
                  : 'text-[#3e4a3d] hover:bg-[#f2f3ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">dns</span>
                <span>Cluster &amp; Spring Security</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'health' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                99.99%
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#eaedff] space-y-3">
          <div className="p-3 bg-[#f2f3ff] rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-gray-700">DPDP Act &amp; Privacy</div>
              <div className="text-[10px] text-emerald-700 font-bold">Zero-Knowledge Active</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          <div className="text-[10px] text-gray-400 text-center font-mono">
            Build v4.9.0-PROD • Cloud Run Multi-Tenant
          </div>
        </div>
      </aside>

      {/* Main Screen Content Area */}
      <div className="ml-72 flex-1 flex flex-col min-w-0">
        {/* Sticky Top Bar - Dynamically adapts to the active option */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex items-center justify-between px-6 lg:px-8 py-3.5 border-b border-[#eaedff]">
          <div className="flex items-center gap-4 min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006b2c] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Control Plane
                </span>
                <span className="text-gray-300">/</span>
                <h1 className="text-base font-bold text-[#131b2e] tracking-tight truncate">
                  {activeTab === 'tenants' && 'Multi-Tenant Societies Directory'}
                  {activeTab === 'billing' && 'Platform Subscriptions & MRR Revenue Engine'}
                  {activeTab === 'policies' && 'Privacy Policy & Platform Governance Compliance'}
                  {activeTab === 'invites' && 'Admin Cryptographic Onboarding Invitations'}
                  {activeTab === 'health' && 'Cluster Health & Spring Security 6.2'}
                </h1>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate hidden md:block">
                {activeTab === 'tenants' && 'Directory of registered gated societies, tenant schemas, and administrative status.'}
                {activeTab === 'billing' && 'Platform SaaS licensing fees, corporate auto-debit reconciliations, and MRR cashflow.'}
                {activeTab === 'policies' && 'Statutory DPDP Act 2023 data fiduciary agreements and zero-knowledge privacy enforcement.'}
                {activeTab === 'invites' && 'Cryptographic JWT tokens issued to Management Committee Presidents for onboarding.'}
                {activeTab === 'health' && 'Spring Boot 3.2 microservice pods, HikariCP database connections, and kernel security.'}
              </p>
            </div>
          </div>

          {/* Contextual Actions & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* OPTION 1: TENANTS TAB ACTIONS */}
            {activeTab === 'tenants' && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#006b2c]">
                  <span className="w-2 h-2 rounded-full bg-[#006b2c]"></span>
                  <span>{activeCount} Active / {communities.length} Enclaves</span>
                </div>
                <button
                  onClick={() => setShowOnboardModal(true)}
                  className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-base">add_business</span>
                  <span>Onboard New Society</span>
                </button>
              </>
            )}

            {/* OPTION 2: BILLING TAB ACTIONS */}
            {activeTab === 'billing' && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#006b2c]">
                  <span>MRR: ₹{totalSubscriptionMRR.toLocaleString('en-IN')}/mo</span>
                </div>
                <button
                  onClick={() => setShowMonthlyFlowModal(true)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006b2c] border border-emerald-200 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">account_tree</span>
                  <span>Explain Monthly SaaS Flow</span>
                </button>
              </>
            )}

            {/* OPTION 3: POLICIES TAB ACTIONS */}
            {activeTab === 'policies' && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-800">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>DPDP 2023 Compliant</span>
                </div>
                <button
                  onClick={() => {
                    showToast(`DPDP Audit Verified: All ${communities.length} societies have signed statutory data processor policies.`, 'success');
                  }}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span>Verify Audit Signatures</span>
                </button>
              </>
            )}

            {/* OPTION 4: INVITES TAB ACTIONS */}
            {activeTab === 'invites' && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
                  <span>{invitations.filter(i => i.status === 'PENDING').length} Pending Invites</span>
                </div>
                <button
                  onClick={() => setShowOnboardModal(true)}
                  className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Issue New Admin Token</span>
                </button>
              </>
            )}

            {/* OPTION 5: HEALTH TAB ACTIONS */}
            {activeTab === 'health' && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#006b2c]">
                  <span className="w-2 h-2 rounded-full bg-[#006b2c] animate-pulse"></span>
                  <span>Zero-Trust RLS Active</span>
                </div>
                <button
                  onClick={handleRunIsolationTest}
                  disabled={isTestingIsolation}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
                >
                  <span className={`material-symbols-outlined text-base ${isTestingIsolation ? 'animate-spin' : ''}`}>
                    {isTestingIsolation ? 'sync' : 'security'}
                  </span>
                  <span>{isTestingIsolation ? 'Auditing Cluster...' : 'Run Penetration Test'}</span>
                </button>
              </>
            )}

            {/* Platform Admin Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-[#eaedff]">
              <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                DS
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-gray-900 leading-tight">
                  {currentUser?.name || 'Devashish Sen'}
                </div>
                <div className="text-[10px] text-[#006b2c] font-semibold">Super-Admin</div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Log out from Platform Admin Account"
                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content: Clean padding that never obscures content */}
        <main className="p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Contextual Metric Cards for Tenants Tab Only */}
          {activeTab === 'tenants' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    TOTAL ENCLAVES
                  </span>
                  <div className="text-2xl font-bold text-[#131b2e] mt-1">
                    {communities.length} Societies
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-[#eaedff]/60 flex items-center justify-between text-xs text-gray-500">
                  <span>Directory Register</span>
                  <span className="font-semibold text-emerald-700">{activeCount} Active</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    ACTIVE SAAS LICENSES
                  </span>
                  <div className="text-2xl font-bold text-[#006b2c] mt-1">
                    {activeCount} Active
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-[#eaedff]/60 flex items-center justify-between text-xs text-gray-500">
                  <span>Suspended / Frozen</span>
                  <span className="font-semibold text-rose-600">{frozenCount} Frozen</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    ENTERPRISE TIER SHARE
                  </span>
                  <div className="text-2xl font-bold text-purple-900 mt-1">
                    {enterpriseCount} of {communities.length}
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-[#eaedff]/60 flex items-center justify-between text-xs text-gray-500">
                  <span>Growth Tier</span>
                  <span className="font-semibold text-blue-700">{communities.length - enterpriseCount} Societies</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    DPDP COMPLIANCE
                  </span>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">
                    100% Signed
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-[#eaedff]/60 flex items-center justify-between text-xs text-gray-500">
                  <span>Privacy Agreements</span>
                  <span className="font-semibold text-emerald-700">{compliantCount} Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* Contextual Metric Cards for Invites Tab Only */}
          {activeTab === 'invites' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  TOTAL INVITATIONS
                </span>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {invitations.length} Tokens
                </div>
                <div className="text-xs text-gray-500 mt-1">Issued for MC President Onboarding</div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  PENDING ACTIVATION
                </span>
                <div className="text-2xl font-bold text-amber-700 mt-1">
                  {invitations.filter(i => i.status === 'PENDING').length} Pending
                </div>
                <div className="text-xs text-gray-500 mt-1">Awaiting MC President Password Setup</div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  ACTIVATED SOCIETIES
                </span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">
                  {invitations.filter(i => i.status === 'ACTIVATED').length} Onboarded
                </div>
                <div className="text-xs text-gray-500 mt-1">Accessing Community Admin Portals</div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  TOKEN ENCRYPTION
                </span>
                <div className="text-2xl font-bold text-purple-900 mt-1">
                  RS256 JWT
                </div>
                <div className="text-xs text-gray-500 mt-1">Cryptographically Signed &amp; Timed</div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: MULTI-TENANT COMMUNITIES DIRECTORY */}
          {/* ========================================================================= */}
          {activeTab === 'tenants' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs overflow-hidden">
                {/* Header & Filter Controls */}
                <div className="p-5 border-b border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-[#131b2e] flex items-center gap-2">
                      <span>Multi-Tenant Societies Directory</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                        {filteredCommunities.length} Enclaves
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Platform SaaS licensing &amp; privacy compliance register • Zero-knowledge boundary restricts internal society operational visibility
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Search society, city, MC head..."
                        value={tenantSearch}
                        onChange={(e) => setTenantSearch(e.target.value)}
                        className="pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      />
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                      {['ALL', 'ACTIVE', 'FROZEN', 'ENTERPRISE', 'GROWTH'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setTenantFilter(filter)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            tenantFilter === filter
                              ? 'bg-white text-emerald-950 shadow-xs'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Communities Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9ff] text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-[#eaedff]">
                      <tr>
                        <th className="py-3 px-4">Society &amp; Location</th>
                        <th className="py-3 px-4">PostgreSQL Tenant Schema</th>
                        <th className="py-3 px-4">Platform Tier</th>
                        <th className="py-3 px-4">Monthly Subscription Fee</th>
                        <th className="py-3 px-4">Privacy &amp; DPDP Policy</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Master Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCommunities.map((comm) => (
                        <tr
                          key={comm.id}
                          onClick={() => setInspectModalComm(comm)}
                          className="hover:bg-[#f8f9ff]/70 transition cursor-pointer group"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-xs group-hover:ring-2 group-hover:ring-[#006b2c]/40 transition">
                                <img
                                  src={comm.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                                  alt={comm.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                                <div className="w-full h-full bg-emerald-100 text-[#006b2c] font-bold text-sm hidden items-center justify-center">
                                  {comm.name.charAt(0)}
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 group-hover:text-[#006b2c] transition flex items-center gap-1.5">
                                  <span>{comm.name}</span>
                                  <span className="material-symbols-outlined text-xs text-gray-300 group-hover:text-[#006b2c]">
                                    visibility
                                  </span>
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {comm.area}, {comm.city} • <span className="font-mono text-gray-400">{comm.id}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-mono text-[11px] text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 inline-block">
                              schema_{comm.id.replace('comm-', '')}_prod
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">lock</span>
                              <span>Zero-Knowledge Isolated</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlanChangeModal({ isOpen: true, comm, newPlan: comm.plan });
                              }}
                              className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold hover:ring-2 hover:ring-purple-400 cursor-pointer ${
                                comm.plan === 'ENTERPRISE_PREMIUM'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}
                              title="Click to modify SaaS subscription plan"
                            >
                              {comm.plan}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-[#006b2c] text-sm">
                            ₹{(comm.subscriptionFee || (comm.plan === 'ENTERPRISE_PREMIUM' ? 65000 : 35000)).toLocaleString('en-IN')}
                            <span className="text-[10px] text-gray-400 font-normal ml-1">/ mo</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                <span>Policy Signed</span>
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVerifyPolicy(comm);
                                }}
                                className="text-[10px] text-gray-500 hover:text-emerald-700 hover:underline cursor-pointer"
                              >
                                Audit
                              </button>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              DPDP 2023 Compliant
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {comm.status === 'ACTIVE' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                ACTIVE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                FROZEN
                              </span>
                            )}
                            {comm.freezeReason && (
                              <div className="text-[10px] text-rose-600 mt-0.5 max-w-[180px] truncate" title={comm.freezeReason}>
                                {comm.freezeReason}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setInspectModalComm(comm)}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#006b2c] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer flex items-center gap-1"
                                title="Inspect Enclave Contract & Privacy Compliance"
                              >
                                <span className="material-symbols-outlined text-sm">policy</span>
                                <span>Inspect</span>
                              </button>

                              <button
                                onClick={() => handleToggleFreeze(comm)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  comm.status === 'ACTIVE'
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {comm.status === 'ACTIVE' ? 'Freeze' : 'Unfreeze'}
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
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRIVACY POLICY & DPDP AUDIT GOVERNANCE */}
          {/* ========================================================================= */}
          {(activeTab === 'policies' || activeTab === 'isolation') && (
            <div className="space-y-6">
              {/* Privacy Policy & DPDP Statutory Compliance Header */}
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eaedff]">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-2xl">policy</span>
                      <span>Privacy Policy &amp; DPDP Act 2023 Statutory Compliance</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Zero-Knowledge Architecture: Platform Root Admin is cryptographically prevented from viewing internal society resident rosters, gate logs, or maintenance accounts
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const verifiedCount = communities.filter(c => c.privacyPolicyStatus === 'VERIFIED').length;
                        showToast(`Privacy Audit Complete: ${verifiedCount} of ${communities.length} societies have executed the DPDP Data Processing Agreement. Zero PII leaks detected.`, 'success');
                      }}
                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                      <span>Export Compliance Certificate</span>
                    </button>

                    <button
                      onClick={handleRunIsolationTest}
                      disabled={isTestingIsolation}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-base ${isTestingIsolation ? 'animate-spin' : ''}`}>
                        {isTestingIsolation ? 'sync' : 'security'}
                      </span>
                      <span>{isTestingIsolation ? 'Auditing Boundaries...' : 'Verify Zero-Knowledge Barrier'}</span>
                    </button>
                  </div>
                </div>

                {/* 4 Architecture Pillars of Privacy Policy */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                      <span className="material-symbols-outlined text-base">verified_user</span>
                      <span>DPDP Act 2023 Compliant</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">100% Executed</div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      Statutory Data Fiduciary &amp; Processor agreements executed for all {communities.length} societies.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-1">
                      <span className="material-symbols-outlined text-base">visibility_off</span>
                      <span>Zero-Knowledge Isolation</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">0 Resident PII Exposure</div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      Platform root console cannot query resident phone numbers, vehicle logs, or ledger dues.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-800 font-bold text-xs mb-1">
                      <span className="material-symbols-outlined text-base">key</span>
                      <span>Cryptographic Boundary</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">RS256 JWT Signed</div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      Resident &amp; Admin tokens embed tenant claims checked before query execution.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                      <span className="material-symbols-outlined text-base">lock</span>
                      <span>Database Partitions</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{communities.length} Isolated Schemas</div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      Separate Postgres search paths and kernel RLS enforce impenetrable tenant silos.
                    </div>
                  </div>
                </div>

                {/* Penetration Test Results Terminal */}
                {isolationTestLog && (
                  <div className="mt-6 rounded-2xl bg-[#131b2e] text-white p-5 font-mono text-xs shadow-xl border border-gray-800">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-emerald-400">ZERO-KNOWLEDGE &amp; PRIVACY LEAKAGE AUDIT REPORT</span>
                      </div>
                      <span className="text-[10px] text-gray-400">Execution timestamp: {new Date().toLocaleTimeString()}</span>
                    </div>

                    <div className="space-y-3">
                      {isolationTestLog.map((test) => (
                        <div key={test.id} className="p-3 bg-[#1c263c] rounded-xl border border-gray-800">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-200">{test.id}: {test.name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                              ✔ {test.status} ({test.latency})
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-1">Vector: {test.target}</div>
                          <div className="text-[11px] text-emerald-300 mt-0.5">Response: {test.result} • {test.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Per-Community Privacy Policy & DPDP Compliance Register Table */}
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs overflow-hidden">
                <div className="p-5 border-b border-[#eaedff] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-base text-[#131b2e]">Society Privacy Policy &amp; Statutory DPDP Register</h4>
                    <p className="text-xs text-gray-500">Verification status of data processing agreements and zero-knowledge boundaries</p>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    DPDP Act 2023 Registered
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9ff] text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-[#eaedff]">
                      <tr>
                        <th className="py-3 px-4">Community Enclave</th>
                        <th className="py-3 px-4">Privacy Policy Status</th>
                        <th className="py-3 px-4">DPDP Act 2023</th>
                        <th className="py-3 px-4">Terms of Service</th>
                        <th className="py-3 px-4">Executed Date</th>
                        <th className="py-3 px-4 text-right">Audit Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {communities.map((comm) => (
                        <tr key={comm.id} className="hover:bg-[#f8f9ff]/50">
                          <td className="py-3.5 px-4 font-bold text-gray-900">
                            {comm.name}
                            <div className="text-[10px] text-gray-400 font-mono">{comm.id} • {comm.city}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                              <span className="material-symbols-outlined text-xs">verified</span>
                              <span>{comm.privacyPolicyStatus || 'SIGNED_AND_VERIFIED'}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-200">
                              COMPLIANT (Zero PII Leak)
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-gray-600 font-medium">
                            {comm.termsOfService || 'CommunityConnect v3.2 Master Terms'}
                          </td>

                          <td className="py-3.5 px-4 text-gray-500 font-mono">
                            {comm.privacyPolicyDate || '2024-01-15'}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleVerifyPolicy(comm)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 cursor-pointer"
                            >
                              Verify Policy
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SAAS SUBSCRIPTIONS & MRR REVENUE ENGINE */}
          {/* ========================================================================= */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* SaaS Revenue Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    TOTAL PLATFORM SUBSCRIPTION MRR
                  </span>
                  <div className="text-2xl font-bold text-[#006b2c] mt-1">
                    ₹{totalSubscriptionMRR.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-0.5">
                    Annual Run-Rate: ₹{((totalSubscriptionMRR * 12) / 100000).toFixed(1)} Lakhs ARR
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    TIER BREAKDOWN
                  </span>
                  <div className="text-2xl font-bold text-purple-900 mt-1">
                    {enterpriseCount} Enterprise • {communities.length - enterpriseCount} Growth
                  </div>
                  <div className="text-xs text-purple-700 font-semibold mt-0.5">
                    Enterprise tier: ₹65,000/mo • Growth: ₹35,000/mo
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#eaedff] shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    COLLECTION RECOVERY
                  </span>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">100% On-Time</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Automated B2B Auto-Debit via Corporate NetBanking
                  </div>
                </div>
              </div>

              {/* Plan Pricing Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 shadow-xs relative overflow-hidden">
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                    Most Popular
                  </span>
                  <div className="text-sm font-bold text-purple-950">ENTERPRISE PREMIUM TIER</div>
                  <div className="text-2xl font-black text-gray-900 mt-1">
                    ₹65,000 <span className="text-xs font-normal text-gray-500">/ month per society</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                      <span>Dedicated PostgreSQL Tenant Schema Partition with Zero-Knowledge Boundary</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                      <span>Unlimited Administrative Seats &amp; 99.99% Cloud Infrastructure SLA</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                      <span>Statutory DPDP Act 2023 Compliance &amp; Encrypted Audit Vault</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                  <div className="text-sm font-bold text-gray-800">GROWTH TIER</div>
                  <div className="text-2xl font-black text-gray-900 mt-1">
                    ₹35,000 <span className="text-xs font-normal text-gray-500">/ month per society</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                      <span>Shared Cloud Cluster with Postgres Row-Level Security (RLS) Isolation</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                      <span>Automated Monthly B2B Auto-Debit Settlement</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                      <span>Standard CommunityConnect Privacy Policy Agreement</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Society Subscription Table */}
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs overflow-hidden">
                <div className="p-5 border-b border-[#eaedff] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-base text-[#131b2e]">Active Society SaaS Subscriptions</h4>
                    <p className="text-xs text-gray-500">Monthly billing ledger and plan assignment per community</p>
                  </div>

                  <button
                    onClick={() => {
                      const csv = communities.map(c => `${c.name},${c.plan},${c.subscriptionFee || (c.plan === 'ENTERPRISE_PREMIUM' ? 65000 : 35000)},ACTIVE`).join('\n');
                      const blob = new Blob([`Community,Plan,Fee,Status\n${csv}`], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `SaaS_Subscriptions_${Date.now()}.csv`;
                      a.click();
                      showToast('Consolidated SaaS ledger downloaded successfully.', 'success');
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Download Ledger CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9ff] text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-[#eaedff]">
                      <tr>
                        <th className="py-3 px-4">Community</th>
                        <th className="py-3 px-4">Current Plan</th>
                        <th className="py-3 px-4">Monthly Fee</th>
                        <th className="py-3 px-4">Next Renewal</th>
                        <th className="py-3 px-4">Billing Method</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {communities.map((comm) => (
                        <tr key={comm.id} className="hover:bg-[#f8f9ff]/50">
                          <td className="py-3.5 px-4 font-bold text-gray-900">
                            {comm.name}
                            <div className="text-[10px] text-gray-400">{comm.city}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                              comm.plan === 'ENTERPRISE_PREMIUM' ? 'bg-purple-100 text-purple-800' : 'bg-blue-50 text-blue-800'
                            }`}>
                              {comm.plan}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-[#006b2c]">
                            ₹{(comm.subscriptionFee || (comm.plan === 'ENTERPRISE_PREMIUM' ? 65000 : 35000)).toLocaleString('en-IN')} / mo
                          </td>

                          <td className="py-3.5 px-4 text-gray-600">
                            1st of Next Month (Auto-Debit)
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-emerald-800 text-xs font-semibold">
                              <span className="material-symbols-outlined text-sm">credit_card</span>
                              <span>Corporate Auto-Debit</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setPlanChangeModal({ isOpen: true, comm, newPlan: comm.plan })}
                              className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 cursor-pointer"
                            >
                              Change Plan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CLUSTER & SPRING SECURITY 6.2 */}
          {/* ========================================================================= */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Cluster Health Summary Card */}
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eaedff]">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-700 text-2xl">dns</span>
                      <span>Spring Boot 3.2 &amp; Spring Security 6.2 Cluster Health</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Microservice pod orchestrator, HikariCP database pool, and zero-trust authentication filters
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleClusterAction('REDIS', 'Flushed Redis multi-tenant cache keys cleanly.')}
                      disabled={clusterRunningAction !== null}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">cached</span>
                      <span>Flush Redis Cache</span>
                    </button>

                    <button
                      onClick={() => handleClusterAction('KEYS', 'Rotated RS256 asymmetric public-private keypairs.')}
                      disabled={clusterRunningAction !== null}
                      className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">vpn_key</span>
                      <span>Rotate JWT Keys</span>
                    </button>
                  </div>
                </div>

                {/* Service Pods Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">auth-gateway-pod-1</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ONLINE</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">Spring Security 6.2 Filter Chain Active</div>
                    <div className="mt-2 text-xs font-mono text-gray-700">CPU: 11% • Heap: 340MB / 1024MB</div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">gate-anpr-stream-pod</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ONLINE</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">OpenCV Fastag RFID WebSocket Bridge</div>
                    <div className="mt-2 text-xs font-mono text-gray-700">CPU: 18% • Heap: 512MB / 2048MB</div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">hikari-db-pool</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ONLINE</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">PostgreSQL Read/Write Cluster</div>
                    <div className="mt-2 text-xs font-mono text-gray-700">Active: 28 • Idle: 42 • Latency: 1.2ms</div>
                  </div>
                </div>

                {/* Spring Security Filter Chain Pipeline */}
                <div className="mt-6 p-4 rounded-xl bg-purple-50/60 border border-purple-200">
                  <div className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-purple-700">account_tree</span>
                    <span>Spring Security 6.2 Filter Chain Pipeline Order</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-purple-900 font-bold shadow-xs">
                      1. CorsFilter
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-purple-900 font-bold shadow-xs">
                      2. CsrfFilter
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-purple-900 font-bold shadow-xs">
                      3. JwtAuthenticationFilter
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2.5 py-1 bg-purple-700 text-white rounded-lg font-bold shadow-xs">
                      4. TenantContextFilter (RLS Enforcer)
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-purple-900 font-bold shadow-xs">
                      5. AuthorizationFilter (RBAC)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CRYPTOGRAPHIC JWT ADMIN INVITATIONS */}
          {/* ========================================================================= */}
          {activeTab === 'invites' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#eaedff] gap-3">
                  <div>
                    <h3 className="font-bold text-base text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-700 text-lg">vpn_key</span>
                      <span>Cryptographic JWT Admin Invitation Registry</span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Secure zero-trust onboarding tokens issued to society management committee presidents
                    </p>
                  </div>

                  <button
                    onClick={() => setShowOnboardModal(true)}
                    className="px-3 py-1.5 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Issue New Admin Token</span>
                  </button>
                </div>

                <div className="divide-y divide-gray-100 mt-2">
                  {invitations.map((inv) => (
                    <div key={inv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900">{inv.recipientName}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-purple-700 font-semibold">{inv.communityName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'ACTIVATED'
                                ? 'bg-gray-100 text-gray-600'
                                : inv.status === 'REVOKED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          Recipient: {inv.recipientEmail} • Role: <code className="font-mono">{inv.role}</code> • Sent: {inv.sentDate} • Expires: {inv.expiresDate}
                        </div>
                        <div className="font-mono text-[11px] text-gray-600 bg-gray-50 px-2 py-1 rounded-lg mt-1.5 inline-block border border-gray-200">
                          Token: {inv.token}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(inv.token);
                            showToast(`Invitation token copied to clipboard: ${inv.token}`, 'success');
                          }}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                          title="Copy JWT to clipboard"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                          <span>Copy JWT</span>
                        </button>

                        {inv.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleResendInvite(inv.id)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                              title="Resend invitation email"
                            >
                              <span className="material-symbols-outlined text-sm">send</span>
                              <span>Resend</span>
                            </button>

                            <button
                              onClick={() => handleRevokeInvite(inv.id)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                              title="Revoke Token"
                            >
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              <span>Revoke</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ONBOARD NEW COMMUNITY */}
      {/* ========================================================================= */}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006b2c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">add_business</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Onboard New Community Enclave</h3>
                  <p className="text-[11px] text-gray-500">Provisions isolated database namespace &amp; issues JWT</p>
                </div>
              </div>
              <button
                onClick={() => setShowOnboardModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  Community Name
                </label>
                <input
                  type="text"
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  placeholder="e.g. Phoenix GolfEdge"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                    City / Metro
                  </label>
                  <input
                    type="text"
                    value={newCommCity}
                    onChange={(e) => setNewCommCity(e.target.value)}
                    placeholder="e.g. Hyderabad"
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    value={newCommArea}
                    onChange={(e) => setNewCommArea(e.target.value)}
                    placeholder="e.g. Financial District"
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  Platform Subscription Tier &amp; Fee
                </label>
                <select
                  value={newCommPlan}
                  onChange={(e) => setNewCommPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none"
                >
                  <option value="ENTERPRISE_PREMIUM">Enterprise Premium Tier (₹65,000 / month • Dedicated Schema)</option>
                  <option value="GROWTH_TIER">Growth Tier (₹35,000 / month • Shared Postgres RLS)</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">
                  B2B software licensing fee billed monthly to the society management committee.
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  Society MC President / Liaison Name
                </label>
                <input
                  type="text"
                  value={newCommPresident}
                  onChange={(e) => setNewCommPresident(e.target.value)}
                  placeholder="e.g. S. Venkat Reddy"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  Official Liaison Email (Receives Activation Invite &amp; JWT)
                </label>
                <input
                  type="email"
                  value={newCommEmail}
                  onChange={(e) => setNewCommEmail(e.target.value)}
                  placeholder="e.g. president@phoenixgolfedge.com"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Mandatory DPDP & Privacy Policy Acceptance */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-emerald-900 leading-snug">
                    <strong>Statutory DPDP &amp; Privacy Policy Execution:</strong> I confirm that this society has executed the CommunityConnect Privacy Policy and the DPDP Act 2023 Statutory Data Protection Agreement. Platform admin has zero visibility into internal resident data.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>Provision Enclave &amp; Send Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TENANT INSPECTION MODAL */}
      {/* ========================================================================= */}
      {inspectModalComm && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#eaedff] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-xs">
                  <img
                    src={inspectModalComm.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                    alt={inspectModalComm.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{inspectModalComm.name}</h3>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Enclave ID: {inspectModalComm.id} • {inspectModalComm.area}, {inspectModalComm.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectModalComm(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Zero-Knowledge Privacy Isolation Notice */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 mb-4 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-emerald-700 text-lg mt-0.5">verified_user</span>
              <div className="text-xs text-emerald-950 leading-relaxed">
                <strong>Zero-Knowledge Privacy Boundary Active:</strong> Under CommunityConnect's Privacy Policy and the DPDP Act 2023, the Platform Root Administrator is strictly isolated from accessing internal society operations, resident rosters, gate visitor records, or local maintenance ledgers. All internal society data is cryptographically quarantined.
              </div>
            </div>

            <div className="space-y-4">
              {/* Key Platform SaaS Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">SUBSCRIPTION FEE</span>
                  <div className="font-bold text-[#006b2c] text-base mt-0.5">
                    ₹{(inspectModalComm.subscriptionFee || (inspectModalComm.plan === 'ENTERPRISE_PREMIUM' ? 65000 : 35000)).toLocaleString('en-IN')}
                    <span className="text-[10px] text-gray-400 font-normal ml-1">/ mo</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Corporate Auto-Debit</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">SUBSCRIPTION PLAN</span>
                  <div className="font-bold text-purple-900 text-sm mt-0.5">{inspectModalComm.plan}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">SaaS Contract Active</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">PRIVACY &amp; DPDP</span>
                  <div className="font-bold text-emerald-700 text-sm mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>100% Compliant</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Zero PII Leakage</div>
                </div>
              </div>

              {/* Society Liaison Officials */}
              <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-1.5">
                <div className="font-bold text-purple-950 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-purple-700">contact_mail</span>
                  <span>Society Management Committee Official Liaison</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-700 pt-1">
                  <div>
                    <span className="text-gray-400 text-[10px] block">MC PRESIDENT / SECRETARY</span>
                    <span className="font-semibold text-gray-900">{inspectModalComm.presidentName || 'S. Venkat Reddy'}</span>
                    <div className="text-gray-500 text-[11px]">{inspectModalComm.presidentEmail}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">ONBOARDING INVITATION TOKEN</span>
                    <span className="font-mono text-emerald-800 text-[11px] font-bold">INV-{inspectModalComm.id.toUpperCase()}-VERIFIED</span>
                    <div className="text-gray-500 text-[10px]">Statutory Master Agreement Executed</div>
                  </div>
                </div>
              </div>

              {/* Database & Cryptographic Tenant Partition */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                <div className="font-bold text-gray-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-gray-600">dns</span>
                  <span>PostgreSQL Tenant Namespace &amp; RLS Configuration</span>
                </div>
                <div className="font-mono text-[11px] text-gray-600 pt-1 space-y-0.5">
                  <div>Schema Partition: <span className="text-purple-700 font-bold">schema_{inspectModalComm.id.replace('comm-', '')}_prod</span></div>
                  <div>Kernel RLS Filter: <span className="text-emerald-700 font-bold">FOR ALL USING (tenant_id = '{inspectModalComm.id}')</span></div>
                  <div>Privacy Boundary: <span className="text-gray-800 font-bold">Zero-Knowledge Encrypted (DPDP Act 2023)</span></div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleToggleFreeze(inspectModalComm)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  inspectModalComm.status === 'ACTIVE'
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {inspectModalComm.status === 'ACTIVE' ? 'Quarantine & Freeze Tenant' : 'Restore & Unfreeze Tenant'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    authApi.createInvitation({
                      communityId: inspectModalComm.id,
                      communityName: inspectModalComm.name,
                      recipientEmail: inspectModalComm.presidentEmail || `admin.${inspectModalComm.id}@communityconnect.io`,
                      recipientName: inspectModalComm.presidentName || 'Society President',
                      role: 'COMMUNITY_ADMIN'
                    });
                    setInvitations(authApi.getInvitations());
                    showToast(`Fresh onboarding invite dispatched to ${inspectModalComm.presidentEmail}`, 'success');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-[#006b2c] bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>Dispatch Invite</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPlanChangeModal({ isOpen: true, comm: inspectModalComm, newPlan: inspectModalComm.plan });
                    setInspectModalComm(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 cursor-pointer"
                >
                  Modify SaaS Tier
                </button>

                <button
                  type="button"
                  onClick={() => setInspectModalComm(null)}
                  className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MODIFY SAAS PLAN MODAL */}
      {/* ========================================================================= */}
      {planChangeModal.isOpen && planChangeModal.comm && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Change Subscription Tier</h3>
                <p className="text-[11px] text-gray-500">{planChangeModal.comm.name}</p>
              </div>
              <button
                onClick={() => setPlanChangeModal({ isOpen: false, comm: null, newPlan: 'ENTERPRISE_PREMIUM' })}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleApplyPlanChange} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  Select SaaS Plan
                </label>
                <select
                  value={planChangeModal.newPlan}
                  onChange={(e) => setPlanChangeModal({ ...planChangeModal, newPlan: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                >
                  <option value="ENTERPRISE_PREMIUM">Enterprise Premium (₹6,50,000/mo - Unlimited units)</option>
                  <option value="GROWTH_TIER">Growth Tier (₹2,80,000/mo - Up to 500 units)</option>
                </select>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-900">
                <span className="font-bold block mb-0.5">Billing Adjustment</span>
                <span>
                  The new monthly fee will automatically reflect in the automated B2B auto-debit cycle on the 1st of next month.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPlanChangeModal({ isOpen: false, comm: null, newPlan: 'ENTERPRISE_PREMIUM' })}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Confirm Tier Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FREEZE TENANT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showFreezeModal && selectedCommForFreeze && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-rose-600 text-2xl">warning</span>
              <h3 className="text-base font-bold text-gray-900">
                Confirm Freeze for {selectedCommForFreeze.name}
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Freezing will lock the community management console into read-only mode. Gate access will default to fallback manual passbooks.
            </p>

            <form onSubmit={confirmFreeze} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  Reason for Freeze
                </label>
                <textarea
                  rows={2}
                  value={freezeReasonInput}
                  onChange={(e) => setFreezeReasonInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFreezeModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Confirm Isolation Freeze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: MONTHLY INFLOW & FINANCIAL ARCHITECTURE EXPLAINER */}
      {/* ========================================================================= */}
      {showMonthlyFlowModal && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#eaedff] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#eaedff]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#006b2c] to-[#004d1f] flex items-center justify-center text-white shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-2xl">account_balance</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006b2c] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Financial Architecture Guide
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 font-medium">B2B SaaS MRR &amp; Society Cash Flow</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#131b2e] tracking-tight mt-0.5">
                    Understanding "Monthly Inflow" in CommunityConnect
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowMonthlyFlowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                title="Close Explainer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto py-5 space-y-6 pr-1">
              {/* Executive Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#f2f3ff] to-[#e8f5e9] border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#006b2c] block">
                    CommunityConnect B2B Subscription MRR
                  </span>
                  <div className="text-3xl font-extrabold text-[#131b2e] mt-1">
                    ₹{totalInflow.toLocaleString('en-IN')}
                    <span className="text-sm font-semibold text-gray-500 ml-1.5">/ month</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    B2B SaaS licensing fees collected strictly from {communities.length} enrolled gated community clients. Zero access to resident internal funds.
                  </p>
                </div>
                <div className="text-right sm:border-l sm:border-emerald-200/60 sm:pl-5 shrink-0">
                  <span className="text-[11px] font-bold uppercase text-gray-400 block">Annualized SaaS Run-Rate</span>
                  <div className="text-xl font-bold text-[#006b2c]">
                    ₹{((totalInflow * 12) / 100000).toFixed(1)} Lakh ARR
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full inline-block mt-1">
                    100% On-Time Corporate Collection
                  </span>
                </div>
              </div>

              {/* Scope & Role Boundary Card */}
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-purple-700 text-lg">shield_lock</span>
                  <h4 className="font-bold text-xs text-purple-950 uppercase tracking-wide">
                    Platform Administrator Scope &amp; Responsibilities
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-1">
                      <span className="material-symbols-outlined text-sm text-[#006b2c]">payments</span>
                      <span>1. Subscription Fee</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Collect and audit the B2B SaaS software licensing fee (₹65,000 or ₹35,000/mo) from each enrolled community.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-1">
                      <span className="material-symbols-outlined text-sm text-purple-700">policy</span>
                      <span>2. Policy &amp; DPDP Check</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Verify that each society has signed CommunityConnect's master privacy policy and meets DPDP Act 2023 requirements.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-1">
                      <span className="material-symbols-outlined text-sm text-blue-700">send</span>
                      <span>3. Send Invitations</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Issue secure onboarding invitations and activation tokens to the Management Committee heads to access their enclave.
                    </p>
                  </div>
                </div>
              </div>

              {/* Zero-Knowledge Isolation Guarantee */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-emerald-800 text-lg">lock</span>
                  <h5 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
                    Zero-Knowledge Privacy Isolation (No Gated Community Access)
                  </h5>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  As requested by platform governance standards, <strong>the Platform Admin does NOT know what is going on inside the gated communities</strong>. The admin cannot view resident profiles, individual unit maintenance dues, gate visitor logs, or society bank accounts. All internal operations are completely isolated within each community's quarantined PostgreSQL schema.
                </p>
              </div>

              {/* Client Subscription Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Client Subscription Inflow &amp; Policy Registry
                </h4>
                <div className="border border-[#eaedff] rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#f8f9ff] text-gray-500 font-bold uppercase text-[10px] border-b border-[#eaedff]">
                        <th className="py-2.5 px-4">Enclave Client</th>
                        <th className="py-2.5 px-3">SaaS Tier</th>
                        <th className="py-2.5 px-3">Privacy Policy</th>
                        <th className="py-2.5 px-4 text-right">Subscription Fee</th>
                        <th className="py-2.5 px-3 text-center">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaedff]">
                      {communities.map((c) => {
                        const fee = c.subscriptionFee || (c.plan === 'ENTERPRISE_PREMIUM' ? 65000 : 35000);
                        const pct = ((fee / totalInflow) * 100).toFixed(1);
                        return (
                          <tr key={c.id} className="hover:bg-gray-50/80 transition">
                            <td className="py-2.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm text-[#006b2c]">apartment</span>
                              <span>{c.name}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e2e7ff] text-[#131b2e]">
                                {c.plan === 'ENTERPRISE_PREMIUM' ? 'Enterprise (₹65k)' : 'Growth (₹35k)'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="inline-flex items-center gap-1 text-emerald-800 text-[11px] font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                <span>DPDP Signed</span>
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right font-bold text-[#006b2c]">
                              ₹{fee.toLocaleString('en-IN')} / mo
                            </td>
                            <td className="py-2.5 px-3 text-center text-gray-500 font-medium">
                              {pct}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit & Compliance Assurance */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-500 text-lg mt-0.5">verified</span>
                <div className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Cryptographic Inflow Reconciliation:</strong> All monthly subscription charges are processed via corporate HDFC/Razorpay B2B mandates. Automated reconciliation matches each invoice against the society's cryptographic onboarding agreement.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#eaedff] flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Audited against RBI Master Directions for Payment Aggregators
              </span>
              <button
                onClick={() => setShowMonthlyFlowModal(false)}
                className="px-5 py-2.5 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                Got It, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
