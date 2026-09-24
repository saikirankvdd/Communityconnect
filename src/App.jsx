import React, { useState, useEffect } from 'react';
import { authApi } from './api/authApi';
import { communityApi } from './api/communityApi';
import { CommonLogin } from './components/auth/CommonLogin.jsx';
import { ResidentRegistration } from './components/auth/ResidentRegistration.jsx';
import { CommunityConnectWebsite } from './components/public/CommunityConnectWebsite.jsx';
import { PlatformMasterConsole } from './components/platform-admin/PlatformMasterConsole.jsx';
import { CommunityAdminConsole } from './components/community-admin/CommunityAdminConsole.jsx';
import { ResidentPortal } from './components/resident/ResidentPortal.jsx';
import { SecurityGateConsole } from './components/security-gate/SecurityGateConsole.jsx';
import { ProviderConsole } from './components/provider/ProviderConsole.jsx';
import { ErrorBoundary } from './ErrorBoundary.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return authApi.getCurrentUser();
  });

  const [frozenModalNotice, setFrozenModalNotice] = useState(null);

  const [currentView, setCurrentView] = useState(() => {
    const user = authApi.getCurrentUser();
    if (user) {
      return authApi.getDefaultViewForRole(user.role);
    }
    const saved = localStorage.getItem('communityconnect_current_view');
    if (saved && ['website', 'login', 'register'].includes(saved)) {
      return saved;
    }
    return 'website';
  });

  useEffect(() => {
    localStorage.setItem('communityconnect_current_view', currentView);
  }, [currentView, currentUser]);

  // Active Session Freeze Monitoring: Forceful logout if community is frozen
  useEffect(() => {
    const checkActiveSessionFreeze = () => {
      if (currentUser && currentUser.role !== 'PLATFORM_ADMIN' && currentUser.communityId) {
        const comm = communityApi.getCommunityById(currentUser.communityId);
        if (comm && comm.status === 'FROZEN') {
          const reason = comm.freezeReason || 'Platform SaaS subscription license renewal is past due.';
          const notice = {
            communityName: comm.name,
            reason: reason,
            contactEmail: 'support@communityconnect.io',
            contactPhone: '+91 800-266-6864'
          };
          authApi.logout();
          setCurrentUser(null);
          setFrozenModalNotice(notice);
          setCurrentView('login');
        }
      }
    };

    checkActiveSessionFreeze();
    const handleCommunityUpdate = () => checkActiveSessionFreeze();
    window.addEventListener('communityconnect_communities_updated', handleCommunityUpdate);
    window.addEventListener('storage', handleCommunityUpdate);
    const interval = setInterval(checkActiveSessionFreeze, 800);

    return () => {
      window.removeEventListener('communityconnect_communities_updated', handleCommunityUpdate);
      window.removeEventListener('storage', handleCommunityUpdate);
      clearInterval(interval);
    };
  }, [currentUser]);

  // Handle successful login
  const handleLoginSuccess = (user) => {
    setFrozenModalNotice(null);
    setCurrentUser(user);
    const target = authApi.getDefaultViewForRole(user.role);
    setCurrentView(target);
  };

  // Handle user logout
  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    setCurrentView('website');
  };

  const navigateTo = (view) => {
    const isProtected = ['platform-admin', 'community-admin', 'resident', 'security-gate', 'provider'].includes(view);
    if (isProtected && !currentUser) {
      setCurrentView('website');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FAF8FF] text-[#131B2E] flex flex-col font-sans">
        <main className="flex-1">
        {/* If no authenticated user, show CommunityConnect Website, Login view, or Resident Registration */}
        {!currentUser ? (
          currentView === 'login' ? (
            <CommonLogin
              onLoginSuccess={handleLoginSuccess}
              onNavigate={navigateTo}
              initialBlockedModalData={frozenModalNotice}
            />
          ) : currentView === 'register' ? (
            <ResidentRegistration
              onRegistrationComplete={handleLoginSuccess}
              onNavigate={navigateTo}
            />
          ) : (
            <CommunityConnectWebsite
              onLoginSuccess={handleLoginSuccess}
              onNavigate={navigateTo}
            />
          )
        ) : (
          <>
            {currentView === 'community-admin' && (
              <CommunityAdminConsole
                currentUser={currentUser}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'resident' && (
              <ResidentPortal
                currentUser={currentUser}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'provider' && (
              <ProviderConsole
                currentUser={currentUser}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'platform-admin' && (
              <PlatformMasterConsole
                currentUser={currentUser}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'security-gate' && (
              <SecurityGateConsole
                currentUser={currentUser}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
            )}

            {/* Fallback if view doesn't match known role */}
            {!['community-admin', 'resident', 'provider', 'platform-admin', 'security-gate'].includes(currentView) && (
              <CommunityConnectWebsite
                onLoginSuccess={handleLoginSuccess}
                onNavigate={navigateTo}
              />
            )}
          </>
        )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

