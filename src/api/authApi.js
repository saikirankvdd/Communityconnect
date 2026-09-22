// Authentication API Layer (Prepared for Spring Boot Spring Security REST API integration)
import { 
  PRECONFIGURED_USERS, 
  INITIAL_ADMIN_INVITATIONS,
  INITIAL_COMMUNITIES,
  INITIAL_GROUP_DEMAND_POOLS,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_VISITOR_PASSES,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_VERIFICATION_CASES
} from '../data/initialData';

export const PRECONFIGURED_PERSONAS = PRECONFIGURED_USERS;

const SESSION_STORAGE_KEY = 'communityconnect_session';
const USERS_STORAGE_KEY = 'communityconnect_users';
const INVITATIONS_STORAGE_KEY = 'communityconnect_invitations';

// Initialize in localStorage
function getStoredUsers() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(PRECONFIGURED_USERS));
    return PRECONFIGURED_USERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return PRECONFIGURED_USERS;
  }
}

function getStoredInvitations() {
  const raw = localStorage.getItem(INVITATIONS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_INVITATIONS));
    return INITIAL_ADMIN_INVITATIONS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADMIN_INVITATIONS;
  }
}

export const authApi = {
  // Common Login endpoint (POST /api/auth/login) - NO ROLE DROPDOWN
  async login(loginId, password) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 250));

    const users = getStoredUsers();
    const cleanId = (loginId || '').trim().toLowerCase();

    // 1. Direct match in registered users
    let matchedUser = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanId || (u.loginId && u.loginId.toLowerCase() === cleanId)) &&
        (!password || u.password === password || password.length > 0)
    );

    // 2. Role-based smart account resolution if not direct match
    if (!matchedUser) {
      if (cleanId.includes('platform') || cleanId.includes('root') || cleanId.includes('superadmin')) {
        matchedUser = users.find((u) => u.role === 'PLATFORM_ADMIN') || PRECONFIGURED_USERS[0];
      } else if (cleanId.includes('elena') || cleanId.includes('oakridge') || cleanId.includes('comm') || cleanId.includes('president') || cleanId.includes('admin')) {
        matchedUser = users.find((u) => u.id === 'usr-comm-saket' || u.role === 'COMMUNITY_ADMIN') || PRECONFIGURED_USERS[2];
      } else if (cleanId.includes('arjun') || cleanId.includes('resident') || cleanId.includes('tenant') || cleanId.includes('owner')) {
        matchedUser = users.find((u) => u.role === 'RESIDENT') || PRECONFIGURED_USERS[3];
      } else if (cleanId.includes('cooling') || cleanId.includes('provider') || cleanId.includes('service') || cleanId.includes('vendor')) {
        matchedUser = users.find((u) => u.role === 'SERVICE_PROVIDER') || PRECONFIGURED_USERS[4];
      } else if (cleanId.includes('gate') || cleanId.includes('security') || cleanId.includes('guard') || cleanId.includes('ram')) {
        matchedUser = users.find((u) => u.role === 'SECURITY_TEAM' || u.role === 'SECURITY_GUARD') || PRECONFIGURED_USERS[5];
      } else if (users.length > 0) {
        // Fallback: match by email ignoring domain or first name
        matchedUser = users.find((u) => u.email.toLowerCase().includes(cleanId) || cleanId.includes(u.email.toLowerCase().split('@')[0]));
      }
    }

    if (!matchedUser) {
      // Default to Resident or create on-the-fly authenticated profile
      matchedUser = {
        id: `usr-${Date.now()}`,
        name: cleanId.split('@')[0] ? cleanId.split('@')[0].charAt(0).toUpperCase() + cleanId.split('@')[0].slice(1) : 'Resident',
        email: cleanId.includes('@') ? cleanId : `${cleanId}@communityconnect.io`,
        role: 'RESIDENT',
        communityId: 'comm-saket',
        communityName: 'Oakridge Heights',
        flatNumber: 'A-1204',
        tower: 'Tower A',
        residentType: 'Resident',
        accessLevel: 'PERMANENT',
        title: 'Resident'
      };
    }

    // Return JWT-like authentication payload
    const session = {
      token: `jwt-bearer-${matchedUser.id}-${Date.now()}`,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        communityId: matchedUser.communityId || 'comm-saket',
        communityName: matchedUser.communityName || 'Oakridge Heights',
        flatNumber: matchedUser.flatNumber || 'Flat A-1204',
        tower: matchedUser.tower || 'Tower A',
        residentType: matchedUser.residentType || 'OWNER',
        accessLevel: matchedUser.accessLevel || 'PERMANENT',
        avatar: matchedUser.avatar || null,
        title: matchedUser.title || (matchedUser.role === 'PLATFORM_ADMIN' ? 'Platform Super-Admin' : matchedUser.role === 'COMMUNITY_ADMIN' ? 'Estate President' : matchedUser.role === 'SECURITY_TEAM' ? 'Security Guard' : matchedUser.role === 'SERVICE_PROVIDER' ? 'Certified Contractor' : 'Resident'),
        phone: matchedUser.phone || '+91 98450 11223'
      },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  // Get current active session
  getCurrentSession() {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  // Logout (POST /api/auth/logout)
  logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  // Get current active authenticated user or null
  getCurrentUser() {
    const session = this.getCurrentSession();
    if (session && session.user) {
      return session.user;
    }
    return null;
  },

  // Map user role to initial console view route
  getDefaultViewForRole(role) {
    if (!role) return 'landing';
    switch (role) {
      case 'PLATFORM_ADMIN':
      case 'SUPER_ADMIN':
        return 'platform-admin';
      case 'COMMUNITY_ADMIN':
      case 'ADMIN':
        return 'community-admin';
      case 'RESIDENT':
        return 'resident';
      case 'SECURITY_TEAM':
      case 'SECURITY_GUARD':
      case 'SECURITY':
        return 'security-gate';
      case 'SERVICE_PROVIDER':
      case 'PROVIDER':
        return 'provider';
      default:
        return 'landing';
    }
  },

  // Switch persona directly in sandbox / 1-click switcher
  switchPersona(userOrId) {
    const users = getStoredUsers();
    let target = null;
    if (typeof userOrId === 'object' && userOrId !== null) {
      target = userOrId;
    } else {
      target = users.find((u) => u.id === userOrId || u.email === userOrId) ||
        PRECONFIGURED_USERS.find((u) => u.id === userOrId || u.email === userOrId);
    }

    if (!target) {
      target = PRECONFIGURED_USERS[0];
    }

    const session = {
      token: `jwt-bearer-${target.id}-${Date.now()}`,
      user: {
        id: target.id,
        name: target.name,
        email: target.email,
        role: target.role,
        communityId: target.communityId || null,
        communityName: target.communityName || null,
        flatNumber: target.flatNumber || null,
        tower: target.tower || null,
        residentType: target.residentType || null,
        accessLevel: target.accessLevel || 'PERMANENT',
        avatar: target.avatar || null,
        title: target.title || null,
        phone: target.phone || null
      },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session.user;
  },

  // Reset entire application localStorage to pristine demo seeds
  resetToInitialData() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(PRECONFIGURED_USERS));
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_INVITATIONS));
    localStorage.setItem('communityconnect_communities', JSON.stringify(INITIAL_COMMUNITIES));
    localStorage.setItem('communityconnect_group_pools', JSON.stringify(INITIAL_GROUP_DEMAND_POOLS));
    localStorage.setItem('communityconnect_service_requests', JSON.stringify(INITIAL_SERVICE_REQUESTS));
    localStorage.setItem('communityconnect_visitor_passes', JSON.stringify(INITIAL_VISITOR_PASSES));
    localStorage.setItem('communityconnect_community_posts', JSON.stringify(INITIAL_COMMUNITY_POSTS));
    localStorage.setItem('communityconnect_verification_cases', JSON.stringify(INITIAL_VERIFICATION_CASES));
  },

  // Retrieve all registered and preconfigured users
  getAllUsers() {
    return getStoredUsers();
  },

  // Resident Registration (POST /api/auth/register-resident)
  async registerResident(formData) {
    await new Promise((r) => setTimeout(r, 300));

    const users = getStoredUsers();
    const newUser = {
      id: `usr-res-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      loginId: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: 'RESIDENT',
      communityId: formData.communityId,
      communityName: formData.communityName,
      flatNumber: formData.flatNumber,
      residentType: formData.residentType || 'Owner',
      accessLevel: formData.hasConflict ? 'TEMPORARY' : 'PERMANENT',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      familyCount: 1
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    return {
      success: true,
      user: newUser,
      requiresVerification: formData.hasConflict,
      message: formData.hasConflict
        ? 'Account registered! Your occupancy request is queued for security & admin verification.'
        : 'Account verified and activated successfully!'
    };
  },

  // Admin Invitation Verification & Password Setup (POST /api/auth/activate-invitation)
  async activateInvitation(token, newPassword, adminName) {
    await new Promise((r) => setTimeout(r, 300));

    const invitations = getStoredInvitations();
    const invIndex = invitations.findIndex((i) => i.token === token);

    if (invIndex === -1) {
      throw new Error('Invitation token is invalid or has expired. Please contact Platform Operations.');
    }

    const invitation = invitations[invIndex];
    if (invitation.status === 'EXPIRED' || invitation.status === 'REVOKED') {
      throw new Error(`This invitation was ${invitation.status.toLowerCase()}.`);
    }

    // Mark invitation accepted
    invitation.status = 'ACCEPTED';
    invitation.acceptedDate = new Date().toISOString().split('T')[0];
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(invitations));

    // Create or activate Community Admin user
    const users = getStoredUsers();
    let adminUser = users.find((u) => u.email.toLowerCase() === invitation.recipientEmail.toLowerCase());

    if (!adminUser) {
      adminUser = {
        id: `usr-comm-${Date.now()}`,
        name: adminName || invitation.recipientName,
        email: invitation.recipientEmail,
        loginId: invitation.recipientEmail,
        password: newPassword,
        role: 'COMMUNITY_ADMIN',
        communityId: invitation.communityId,
        communityName: invitation.communityName,
        phone: invitation.recipientMobile,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        title: 'Management Committee President'
      };
      users.push(adminUser);
    } else {
      adminUser.password = newPassword;
      adminUser.role = 'COMMUNITY_ADMIN';
      adminUser.communityId = invitation.communityId;
      adminUser.communityName = invitation.communityName;
    }

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    return {
      success: true,
      user: adminUser,
      message: 'Account activated! You may now sign in with your permanent password.'
    };
  },

  // Validate Invitation Token
  getInvitationByToken(token) {
    const invitations = getStoredInvitations();
    return invitations.find((i) => i.token === token) || null;
  },

  // Get all invitations
  getInvitations() {
    return getStoredInvitations();
  },

  // Create and store a new cryptographic admin invitation
  createInvitation(data) {
    const list = getStoredInvitations();
    const newInvite = {
      id: `inv-${Date.now()}`,
      communityId: data.communityId,
      communityName: data.communityName,
      recipientEmail: data.recipientEmail,
      recipientName: data.recipientName || 'Society President',
      role: data.role || 'COMMUNITY_ADMIN',
      token: `jwt.inv_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`,
      status: 'PENDING',
      sentDate: new Date().toISOString().split('T')[0],
      expiresDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    list.unshift(newInvite);
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(list));
    return newInvite;
  },

  // Resend invitation
  resendInvitation(invitationId) {
    const list = getStoredInvitations();
    const inv = list.find((i) => i.id === invitationId);
    if (!inv) throw new Error('Invitation not found');

    inv.sentDate = new Date().toISOString().split('T')[0];
    inv.expiresDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    inv.status = 'PENDING';

    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(list));
    return inv;
  },

  // Revoke invitation
  revokeInvitation(invitationId) {
    const list = getStoredInvitations();
    const inv = list.find((i) => i.id === invitationId);
    if (!inv) throw new Error('Invitation not found');

    inv.status = 'REVOKED';
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(list));
    return inv;
  }
};
