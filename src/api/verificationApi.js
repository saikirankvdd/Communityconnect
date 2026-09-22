// Verification & Occupancy Conflict API Layer
import { INITIAL_VERIFICATION_CASES } from '../data/initialData';

const CASES_STORAGE_KEY = 'communityconnect_verification_cases';

function getStoredCases() {
  const raw = localStorage.getItem(CASES_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(INITIAL_VERIFICATION_CASES));
    return INITIAL_VERIFICATION_CASES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_VERIFICATION_CASES;
  }
}

export const verificationApi = {
  // GET /api/verification/cases
  getCases(communityId = null) {
    const list = getStoredCases();
    if (communityId) {
      const filtered = list.filter((c) => c.communityId === communityId);
      if (filtered.length > 0) {
        return filtered;
      }
    }
    return list;
  },

  getCaseById(id) {
    const list = getStoredCases();
    return list.find((c) => c.id === id) || list[0] || null;
  },

  // Security Guard updates physical inspection (Step 4 of 7)
  updateSecurityInspection(caseId, notes, keysCount = 3, luggageDeparted = true) {
    const list = getStoredCases();
    const targetCase = list.find((c) => c.id === caseId);
    if (!targetCase) throw new Error('Verification case not found');

    targetCase.securityInspection = {
      ...targetCase.securityInspection,
      notes,
      keysSurrendered: keysCount,
      luggageDeparted,
      status: 'SUBMITTED',
      date: new Date().toISOString().split('T')[0]
    };
    targetCase.currentStage = 5; // Ready for Admin Approval
    targetCase.status = 'AWAITING_ADMIN_APPROVAL';

    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(list));
    return targetCase;
  },

  // Community Admin approves Temporary Access (Step 5 -> 6 of 7)
  approveTemporaryAccess(caseId, adminName = 'S. Venkat Reddy', days = 5) {
    const list = getStoredCases();
    const targetCase = list.find((c) => c.id === caseId);
    if (!targetCase) throw new Error('Verification case not found');

    targetCase.currentStage = 6;
    targetCase.status = 'TEMPORARY_ACCESS_ACTIVE';
    targetCase.adminDecision = {
      approvedBy: adminName,
      approvalDate: new Date().toISOString().split('T')[0],
      temporaryAccessGranted: true,
      allowedDays: days,
      permanentHandoverGranted: false
    };

    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(list));
    return targetCase;
  },

  // Community Admin activates Permanent Access (Step 7 of 7)
  activatePermanentAccess(caseId, adminName = 'S. Venkat Reddy') {
    const list = getStoredCases();
    const targetCase = list.find((c) => c.id === caseId);
    if (!targetCase) throw new Error('Verification case not found');

    targetCase.currentStage = 7;
    targetCase.status = 'PERMANENT_ACCESS_ACTIVATED';
    targetCase.adminDecision.permanentHandoverGranted = true;
    targetCase.adminDecision.permanentApprovalDate = new Date().toISOString().split('T')[0];
    targetCase.existingResident.status = 'DEACTIVATED';

    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(list));
    return targetCase;
  },

  // Admin rejects verification
  rejectVerification(caseId, reason) {
    const list = getStoredCases();
    const targetCase = list.find((c) => c.id === caseId);
    if (!targetCase) throw new Error('Verification case not found');

    targetCase.status = 'REJECTED';
    targetCase.rejectionReason = reason;
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(list));
    return targetCase;
  }
};
