import React, { useState, useEffect } from 'react';
import { authApi } from './api/authApi';
import { CommonLogin } from './components/auth/CommonLogin.jsx';
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

  const [currentView, setCurrentView] = useState(() => {
    const user = authApi.getCurrentUser();
    if (user) {
      return authApi.getDefaultViewForRole(user.role);
    }
    const saved = localStorage.getItem('communityconnect_current_view');
    if (saved && ['website', 'login'].includes(saved)) {
      return saved;
    }
    return 'website';
  });

  useEffect(() => {
    localStorage.setItem('communityconnect_current_view', currentView);
  }, [currentView, currentUser]);

  // Handle successful login
  const handleLoginSuccess = (user) => {
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
        {/* If no authenticated user, show CommunityConnect Website or Login view */}
        {!currentUser ? (
          currentView === 'login' ? (
            <CommonLogin
              onLoginSuccess={handleLoginSuccess}
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
