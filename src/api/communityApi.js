// Community Management API Layer (Supports Platform Admin & Community Admin multi-tenant isolation)
import { INITIAL_COMMUNITIES, INITIAL_ADMIN_INVITATIONS } from '../data/initialData';

const COMMUNITIES_STORAGE_KEY = 'communityconnect_communities';
const INVITATIONS_STORAGE_KEY = 'communityconnect_invitations';

function getStoredCommunities() {
  const raw = localStorage.getItem(COMMUNITIES_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(COMMUNITIES_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITIES));
    return INITIAL_COMMUNITIES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMMUNITIES;
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

export const communityApi = {
  // GET /api/communities (filterable)
  getCommunities(filter = {}) {
    const list = getStoredCommunities();
    return list.filter((c) => {
      if (filter.status && filter.status !== 'ALL' && c.status !== filter.status) return false;
      if (filter.city && filter.city !== 'ALL' && c.city.toLowerCase() !== filter.city.toLowerCase()) return false;
      if (filter.search) {
        const query = filter.search.toLowerCase();
        const matchName = c.name.toLowerCase().includes(query);
        const matchArea = c.area.toLowerCase().includes(query);
        const matchCity = c.city.toLowerCase().includes(query);
        if (!matchName && !matchArea && !matchCity) return false;
      }
      return true;
    });
  },

  // GET /api/communities/:id
  getCommunityById(id) {
    const list = getStoredCommunities();
    return list.find((c) => c.id === id) || null;
  },

  // POST /api/communities (Platform Admin Onboard Community)
  onboardCommunity(communityData, adminData) {
    const list = getStoredCommunities();
    const newId = `comm-${communityData.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}-${Date.now().toString().slice(-4)}`;
    
    const newCommunity = {
      id: newId,
      name: communityData.name,
      area: communityData.area || 'Metro Enclave',
      city: communityData.city || 'Hyderabad',
      state: communityData.state || 'Telangana',
      pincode: communityData.pincode || '500001',
      address: communityData.address || `${communityData.name}, Main Boulevard`,
      type: communityData.type || 'Gated Residential Township',
      towers: Number(communityData.towers) || 4,
      totalUnits: Number(communityData.totalUnits) || 300,
      occupiedUnits: 0,
      amenitiesCount: Number(communityData.amenitiesCount) || 20,
      status: 'ACTIVE',
      plan: communityData.plan || 'GROWTH_TIER',
      subscriptionStatus: 'ACTIVE',
      monthlyInflow: (Number(communityData.totalUnits) || 300) * 3500,
      presidentName: adminData.name,
      presidentEmail: adminData.email,
      presidentPhone: adminData.phone,
      securityGatePhone: adminData.securityPhone || '+91 99000 00101',
      description: communityData.description || 'Modern gated community with smart facility automation.',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      onboardedDate: new Date().toISOString().split('T')[0]
    };

    list.unshift(newCommunity);
    localStorage.setItem(COMMUNITIES_STORAGE_KEY, JSON.stringify(list));

    // Generate secure admin invitation token
    const token = `cc-token-${newId.slice(5)}-${Math.random().toString(36).slice(2, 8)}`;
    const newInvitation = {
      id: `INV-${Date.now()}`,
      communityId: newId,
      communityName: newCommunity.name,
      recipientName: adminData.name,
      recipientEmail: adminData.email,
      recipientMobile: adminData.phone,
      role: 'COMMUNITY_ADMIN',
      status: 'PENDING',
      token,
      sentDate: new Date().toISOString().split('T')[0],
      expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      acceptedDate: null
    };

    const invitations = getStoredInvitations();
    invitations.unshift(newInvitation);
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(invitations));

    return { community: newCommunity, invitation: newInvitation };
  },

  // POST /api/communities/:id/toggle-status (Suspend / Freeze / Restore)
  toggleCommunityStatus(id, targetStatus, reason = '') {
    const list = getStoredCommunities();
    const target = list.find((c) => c.id === id);
    if (!target) throw new Error('Community not found');

    target.status = targetStatus;
    target.subscriptionStatus = targetStatus === 'FROZEN' ? 'PAYMENT_PENDING' : 'ACTIVE';
    if (targetStatus === 'FROZEN') {
      target.freezeReason = reason || 'Platform administrative suspension applied by HQ operations.';
    } else {
      delete target.freezeReason;
    }

    localStorage.setItem(COMMUNITIES_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_communities_updated', { detail: target }));
    } catch {}
    return target;
  },

  // GET /api/admin/invitations
  getInvitations() {
    return getStoredInvitations();
  },

  // POST /api/admin/invitations/:id/resend
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

  // POST /api/admin/invitations/:id/revoke
  revokeInvitation(invitationId) {
    const list = getStoredInvitations();
    const inv = list.find((i) => i.id === invitationId);
    if (!inv) throw new Error('Invitation not found');

    inv.status = 'REVOKED';
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(list));
    return inv;
  }
};
