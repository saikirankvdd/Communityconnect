import React, { useState, useEffect } from 'react';
import { DetailedServicesSection } from './DetailedServicesSection';
import { serviceApi } from '../../api/serviceApi';
import { communityApi } from '../../api/communityApi';
import { DuesPaymentModal } from './DuesPaymentModal';
import { ChatMessengerModal } from './ChatMessengerModal';
import { CreatePostModal } from './CreatePostModal';
import { BrandLogo } from '../common/BrandLogo';

// Helper Date Utilities for Gate Passes
const formatDisplayDate = (isoString, prefix = '') => {
  if (!isoString) return '';
  const parts = isoString.split('-');
  if (parts.length !== 3) return isoString;
  const [y, m, d] = parts.map(Number);
  const dateObj = new Date(y, m - 1, d);
  const formatted = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  return prefix ? `${prefix} (${formatted})` : formatted;
};

const getTodayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getUpcomingSaturdayISO = () => {
  const d = new Date();
  const dayOfWeek = d.getDay();
  let daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  if (daysUntilSaturday === 0) daysUntilSaturday = 7;
  d.setDate(d.getDate() + daysUntilSaturday);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getNextWeekISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const format12HourTime = (time24) => {
  if (!time24) return '';
  const [hStr, m] = time24.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
};

export const ResidentPortal = ({ currentUser, onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, services, gate-passes, maintenance, community-feed, society-dues, amenities
  const [currentCommunity, setCurrentCommunity] = useState(() => {
    return currentUser?.communityId ? communityApi.getCommunityById(currentUser.communityId) : null;
  });
  const isCommunityFrozen = currentCommunity && currentCommunity.status === 'FROZEN';
  const [showFrozenModal, setShowFrozenModal] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');

  // Group Pool States & Sync
  const [pools, setPools] = useState(() => serviceApi.getPools());
  const acPool = pools.find((p) => p.id === 'pool-ac-bhooja-sep') || pools[0];
  const acPoolJoined = Boolean(acPool?.participants?.some((p) => p.residentName === (currentUser?.name || 'Arjun Kumar')));

  // Family Members & Vehicles State
  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = localStorage.getItem('communityconnect_family_members');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'fam-1', name: 'Arjun Kumar', role: 'Primary Owner', access: 'Full Access', isPrimary: true, initials: 'AK', bg: 'bg-[#7ffc97]', text: 'text-[#002109]', phone: '+91 98765 43210' },
      { id: 'fam-2', name: 'Sneha Kumar', role: 'Spouse', access: 'App Linked', isPrimary: false, initials: 'SK', bg: 'bg-[#c9e6ff]', text: 'text-[#004c6e]', phone: '+91 98765 43211' }
    ];
  });
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({ name: '', role: 'Spouse', phone: '', access: 'App Linked' });

  const [vehiclePasses, setVehiclePasses] = useState(() => {
    const saved = localStorage.getItem('communityconnect_vehicle_passes');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'veh-1', plate: 'TS 09 FH 8120', slot: 'Slot #B2-44', type: '4 Wheeler (SUV)', icon: 'directions_car', status: 'FASTag RFID Active' },
      { id: 'veh-2', plate: 'TS 07 EK 4412', slot: 'Slot #B2-Bike-12', type: '2 Wheeler (EV)', icon: 'two_wheeler', status: 'Sensor Active' }
    ];
  });
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicleForm, setNewVehicleForm] = useState({ plate: '', slot: '', type: '4 Wheeler (Car)' });

  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    if (!newMemberForm.name.trim()) return;
    const nameParts = newMemberForm.name.trim().split(' ');
    const initials = (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '')).toUpperCase();
    const newMember = {
      id: `fam-${Date.now()}`,
      name: newMemberForm.name.trim(),
      role: newMemberForm.role,
      access: newMemberForm.access,
      phone: newMemberForm.phone || '+91 98000 11223',
      isPrimary: false,
      initials,
      bg: 'bg-[#e2d5ff]',
      text: 'text-[#32177a]'
    };
    const updated = [...familyMembers, newMember];
    setFamilyMembers(updated);
    localStorage.setItem('communityconnect_family_members', JSON.stringify(updated));
    setShowAddMemberModal(false);
    setNewMemberForm({ name: '', role: 'Spouse', phone: '', access: 'App Linked' });
    showToast(`Added ${newMember.name} (${newMember.role}) to family passes!`, 'success');
  };

  const handleRemoveFamilyMember = (id) => {
    const updated = familyMembers.filter((m) => m.id !== id);
    setFamilyMembers(updated);
    localStorage.setItem('communityconnect_family_members', JSON.stringify(updated));
    showToast('Family member pass removed.', 'info');
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehicleForm.plate.trim()) return;
    const isBike = newVehicleForm.type.toLowerCase().includes('2') || newVehicleForm.type.toLowerCase().includes('bike');
    const newVehicle = {
      id: `veh-${Date.now()}`,
      plate: newVehicleForm.plate.trim().toUpperCase(),
      slot: newVehicleForm.slot.trim() || `Slot #${isBike ? 'B2-Bike' : 'B2'}-${Math.floor(Math.random() * 80 + 10)}`,
      type: newVehicleForm.type,
      icon: isBike ? 'two_wheeler' : 'directions_car',
      status: 'FASTag RFID Active'
    };
    const updated = [...vehiclePasses, newVehicle];
    setVehiclePasses(updated);
    localStorage.setItem('communityconnect_vehicle_passes', JSON.stringify(updated));
    setShowAddVehicleModal(false);
    setNewVehicleForm({ plate: '', slot: '', type: '4 Wheeler (Car)' });
    showToast(`Registered vehicle ${newVehicle.plate} with RFID gate pass!`, 'success');
  };

  const handleRemoveVehicle = (id) => {
    const updated = vehiclePasses.filter((v) => v.id !== id);
    setVehiclePasses(updated);
    localStorage.setItem('communityconnect_vehicle_passes', JSON.stringify(updated));
    showToast('Vehicle RFID pass revoked.', 'info');
  };

  // Slot Selection states
  const [selectedSlots, setSelectedSlots] = useState({
    ac: '10:00 AM - 12:00 PM',
    electrician: 'Express 30 Mins',
    plumber: 'Today 12:30 PM',
    cleaning: 'Tomorrow 9:00 AM',
    badminton: 'Court 1 • 06:00 PM',
    pool: 'Morning 06:30 AM',
    banquet: 'Saturday Lunch'
  });

  // Gate Pass Generator State
  const [passCategory, setPassCategory] = useState('Friend'); // 'Friend', 'Relative', 'Guest', 'Cab', 'Other'
  const [entryMode, setEntryMode] = useState('VEHICLE'); // 'VEHICLE', 'WALK_IN'
  const [companyName, setCompanyName] = useState('Amazon');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorVehicle, setVisitorVehicle] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [additionalGuests, setAdditionalGuests] = useState([]); // [{ name: '', phone: '', vehicle: '' }]
  const [visitorDateISO, setVisitorDateISO] = useState(getTodayISO());
  const [visitorDuration, setVisitorDuration] = useState('4 Hours (Standard Afternoon / Evening)');
  const [visitorExactTime, setVisitorExactTime] = useState('');
  const [visitorGateNote, setVisitorGateNote] = useState('');
  const [currentOtp, setCurrentOtp] = useState('4829');
  const [activePassCreated, setActivePassCreated] = useState(null);
  const [gateFilter, setGateFilter] = useState('all'); // 'all', 'friends', 'cabs', 'delivery'
  const [allVisitorPasses, setAllVisitorPasses] = useState(() => serviceApi.getVisitorPasses());

  // Maintenance Tickets State & Clarity
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketLocation, setTicketLocation] = useState('Inside Flat (Flat A-1204)');
  const [ticketCategory, setTicketCategory] = useState('Plumbing (Tap / Leakage / Flush)');
  const [ticketUrgency, setTicketUrgency] = useState('Standard');
  const [ticketSlot, setTicketSlot] = useState('Today (02:00 PM - 05:00 PM)');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  
  const [activeTickets, setActiveTickets] = useState([
    {
      id: 'TKT-4091',
      title: 'Geyser Valve Leakage in Master Bathroom',
      category: 'Plumbing',
      location: 'Inside Flat (Master Bath)',
      urgency: 'Standard',
      status: 'IN_PROGRESS', // 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'
      technician: 'Dinesh P.',
      techRole: 'Society Plumber',
      techPhone: '+91 98490 12091',
      reportedAt: '09:30 AM Today',
      estCompletion: '12:30 PM Today',
      otpCode: '6192',
      note: 'Replacing 1/2 inch brass elbow joint and sealing pipe collar.'
    }
  ]);

  const [pastTickets, setPastTickets] = useState([
    { id: 'TKT-3918', title: 'Balcony Sliding Mesh Stiff', date: '28 Sep 2025', team: 'Carpentry Team', status: 'RESOLVED' },
    { id: 'TKT-3750', title: 'Intercom Speaker Buzzing', date: '14 Sep 2025', team: 'Telecom Engineer', status: 'RESOLVED' }
  ]);

  // Community Feed State
  const [feedFilter, setFeedFilter] = useState('all');
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);
  const [rsvpAutumn, setRsvpAutumn] = useState(false);

  const [pollVoted, setPollVoted] = useState(null); // null, 0, 1
  const [pollVotes, setPollVotes] = useState({ yes: 148, no: 52 });
  const [userLikedPosts, setUserLikedPosts] = useState(() => {
    try {
      const raw = localStorage.getItem('communityconnect_user_liked_posts');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [communityPosts, setCommunityPosts] = useState(() => serviceApi.getPosts(currentUser?.communityId));

  const [expandedComments, setExpandedComments] = useState({ 'post-poll-ev': false, 'post-classified-bike': false });
  const [commentInputs, setCommentInputs] = useState({});

  // Society Dues & Payments State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInitialMethod, setPaymentInitialMethod] = useState('upi');
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [cashCollections, setCashCollections] = useState(() => serviceApi.getCashCollections());

  // Detailed Group Demand Join Modal State
  const [selectedPoolForJoinModal, setSelectedPoolForJoinModal] = useState(null);
  const [joinUnitsCount, setJoinUnitsCount] = useState(1);
  const [joinSlotInput, setJoinSlotInput] = useState('Saturday Morning (09:00 AM - 12:00 PM)');
  const [joinTargetBidInput, setJoinTargetBidInput] = useState('');
  const [joinNotesInput, setJoinNotesInput] = useState('');

  // Marketplace & Classified Offers State
  const [selectedPostForOffer, setSelectedPostForOffer] = useState(null);
  const [offerPriceInput, setOfferPriceInput] = useState('');
  const [offerNoteInput, setOfferNoteInput] = useState('');
  const [marketplaceOffers, setMarketplaceOffers] = useState(() => serviceApi.getMarketplaceOffers());

  // Domestic Staff & Maid Hiring State
  const [staffRequests, setStaffRequests] = useState(() => serviceApi.getStaffRequests(currentUser?.communityId));
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [newStaffType, setNewStaffType] = useState('Cook');
  const [newStaffTitle, setNewStaffTitle] = useState('');
  const [newStaffBudget, setNewStaffBudget] = useState('4200');
  const [newStaffTimeSlot, setNewStaffTimeSlot] = useState('07:30 AM - 09:00 AM');

  useEffect(() => {
    const handlePostsSync = () => {
      setCommunityPosts(serviceApi.getPosts(currentUser?.communityId));
    };
    const handleVisitorSync = () => {
      setAllVisitorPasses(serviceApi.getVisitorPasses());
    };
    const handleCashSync = () => {
      setCashCollections(serviceApi.getCashCollections());
    };
    const handleCommunitySync = () => {
      setCommunityPosts(serviceApi.getPosts(currentUser?.communityId));
    };
    const handleOffersSync = () => {
      setMarketplaceOffers(serviceApi.getMarketplaceOffers());
    };
    const handleStaffSync = () => {
      setStaffRequests(serviceApi.getStaffRequests(currentUser?.communityId));
    };

    window.addEventListener('communityconnect_posts_updated', handlePostsSync);
    window.addEventListener('communityconnect_visitor_updated', handleVisitorSync);
    window.addEventListener('communityconnect_cash_updated', handleCashSync);
    window.addEventListener('communityconnect_communities_updated', handleCommunitySync);
    window.addEventListener('communityconnect_offers_updated', handleOffersSync);
    window.addEventListener('communityconnect_staff_updated', handleStaffSync);
    window.addEventListener('communityconnect_pools_updated', handlePostsSync);
    window.addEventListener('storage', handlePostsSync);

    return () => {
      window.removeEventListener('communityconnect_posts_updated', handlePostsSync);
      window.removeEventListener('communityconnect_visitor_updated', handleVisitorSync);
      window.removeEventListener('communityconnect_cash_updated', handleCashSync);
      window.removeEventListener('communityconnect_communities_updated', handleCommunitySync);
      window.removeEventListener('communityconnect_offers_updated', handleOffersSync);
      window.removeEventListener('communityconnect_staff_updated', handleStaffSync);
      window.removeEventListener('communityconnect_pools_updated', handlePostsSync);
      window.removeEventListener('storage', handlePostsSync);
    };
  }, [currentUser]);

  // Detailed Group Pool Join Handler
  const handleConfirmJoinPoolDetailed = (e) => {
    e.preventDefault();
    if (!selectedPoolForJoinModal) return;

    const updatedPool = serviceApi.joinPoolDetailed(selectedPoolForJoinModal.id, {
      residentName: currentUser?.name || 'Arjun Kumar',
      unit: currentUser?.unit || 'Flat A-1204',
      phone: currentUser?.phone || '+91 98765 43210',
      unitsBooked: joinUnitsCount,
      slot: joinSlotInput,
      targetBidPrice: joinTargetBidInput,
      notes: joinNotesInput
    });

    setPools(serviceApi.getPools());
    setSelectedPoolForJoinModal(null);
    setJoinTargetBidInput('');
    setJoinNotesInput('');
    showToast(`Successfully configured & joined ${updatedPool.serviceTitle || 'Group Pool'}! Tier price: ₹${updatedPool.discountedPrice}/unit.`, 'success');
  };

  // Classified Offer Submit Handler
  const handleConfirmClassifiedOffer = (e) => {
    e.preventDefault();
    if (!selectedPostForOffer || !offerPriceInput) return;

    const offer = serviceApi.submitClassifiedOffer(selectedPostForOffer.id, {
      postTitle: selectedPostForOffer.title,
      sellerName: selectedPostForOffer.author || 'Priya Verma',
      sellerUnit: selectedPostForOffer.unit || 'Flat C-502',
      buyerName: currentUser?.name || 'Arjun Kumar',
      buyerUnit: currentUser?.unit || 'Flat A-1204',
      buyerPhone: currentUser?.phone || '+91 98765 43210',
      askingPrice: selectedPostForOffer.price ? parseInt(selectedPostForOffer.price.replace(/[^0-9]/g, ''), 10) : 5000,
      offeredPrice: offerPriceInput,
      message: offerNoteInput
    });

    setSelectedPostForOffer(null);
    setOfferPriceInput('');
    setOfferNoteInput('');
    showToast(`Price offer of ₹${offer.offeredPrice} dispatched to ${offer.sellerName}!`, 'success');
  };

  // Accept Offer Handler
  const handleAcceptClassifiedOffer = (offerId) => {
    const accepted = serviceApi.acceptClassifiedOffer(offerId);
    setMarketplaceOffers(serviceApi.getMarketplaceOffers());
    showToast(`Offer accepted! Item marked as SOLD to ${accepted.buyerName} (${accepted.buyerUnit}).`, 'success');
  };

  // Post Staff Requirement Handler
  const handleConfirmCreateStaffRequest = (e) => {
    e.preventDefault();
    const newReq = serviceApi.createStaffRequest({
      communityId: currentUser?.communityId || 'comm-bhooja',
      residentName: currentUser?.name || 'Arjun Kumar',
      unit: currentUser?.unit || 'Flat A-1204',
      phone: currentUser?.phone || '+91 98765 43210',
      staffType: newStaffType,
      title: newStaffTitle || `Need ${newStaffType}`,
      offeredBudget: newStaffBudget,
      preferredTime: newStaffTimeSlot,
      description: `Requirement for ${newStaffType} for ${currentUser?.unit || 'Flat A-1204'}.`
    });

    setShowCreateStaffModal(false);
    setNewStaffTitle('');
    showToast(`Requirement for ${newStaffType} broadcast to community staff network!`, 'success');
  };

  // Accept Maid/Cook Application & Issue Gate Pass
  const handleAcceptStaffApp = (requestId, appId) => {
    const res = serviceApi.acceptStaffApplication(requestId, appId);
    setStaffRequests(serviceApi.getStaffRequests(currentUser?.communityId));
    setAllVisitorPasses(serviceApi.getVisitorPasses());
    showToast(`Hired ${res.application.staffName}! Security gate entry pass auto-issued to Gate Guard.`, 'success');
  };

  // Quick Action / Tab Switching
  const switchTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message, type = 'info') => {
    setToastMessage({ text: message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const selectSlot = (service, slot) => {
    setSelectedSlots(prev => ({ ...prev, [service]: slot }));
  };

  const handlePassFromService = (passData) => {
    if (passData) {
      serviceApi.createVisitorPass(passData);
      setAllVisitorPasses(serviceApi.getVisitorPasses());
    }
  };

  const handleGuestCountChange = (count) => {
    const num = parseInt(count, 10);
    setGuestCount(num);
    setAdditionalGuests(prev => {
      const needed = Math.max(0, num - 1);
      const updated = [...prev];
      while (updated.length < needed) {
        updated.push({ name: '', phone: '', vehicle: '' });
      }
      return updated.slice(0, needed);
    });
  };

  const updateAdditionalGuest = (index, field, value) => {
    setAdditionalGuests(prev => {
      const updated = [...prev];
      if (!updated[index]) updated[index] = { name: '', phone: '', vehicle: '' };
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCreatePass = (e) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      showToast('Please enter the primary visitor name', 'error');
      return;
    }
    if (!visitorPhone.trim()) {
      showToast('Please enter the primary visitor phone number', 'error');
      return;
    }

    // Validate additional guests if guestCount >= 2
    if (guestCount > 1) {
      for (let i = 0; i < additionalGuests.length; i++) {
        if (!additionalGuests[i]?.name?.trim()) {
          showToast(`Please enter name for Person ${i + 2}`, 'error');
          return;
        }
      }
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setCurrentOtp(newOtp);

    const isWalkIn = entryMode === 'WALK_IN';
    const finalVehicle = isWalkIn ? 'N/A (Walk-In Visitor)' : (visitorVehicle.trim() || 'Vehicle Entry');

    const formattedTime = visitorExactTime ? format12HourTime(visitorExactTime) : 'Immediate / Flexible';
    const categoryLabel = passCategory === 'Friend' ? 'Friend' : passCategory === 'Relative' ? 'Relative / Family' : passCategory === 'Cab' ? 'Guest Cab' : passCategory === 'Other' ? 'Other Person' : 'Personal Guest';
    
    const allGuestsList = [
      { name: visitorName.trim(), phone: visitorPhone.trim(), vehicle: isWalkIn ? 'Walk-In' : visitorVehicle.trim(), isPrimary: true },
      ...additionalGuests.map((g, idx) => ({
        name: g.name?.trim() || `Person ${idx + 2}`,
        phone: g.phone?.trim() || visitorPhone.trim(),
        vehicle: g.vehicle?.trim() || (isWalkIn ? 'Walk-In' : ''),
        isPrimary: false
      }))
    ];

    const newPass = serviceApi.createVisitorPass({
      guestName: visitorName.trim(),
      companyName: companyName,
      company: companyName,
      visitorType: passCategory.toUpperCase(),
      visitorCategory: categoryLabel,
      phone: visitorPhone.trim(),
      vehicleNumber: finalVehicle,
      entryMode: isWalkIn ? 'Walk-In / On Foot' : 'Vehicle Entry',
      isWalkIn: isWalkIn,
      numberOfGuests: guestCount,
      additionalGuests: additionalGuests,
      allGuests: allGuestsList,
      hostUnit: currentUser?.unit || 'Flat A-1204',
      validDate: formatDisplayDate(visitorDateISO),
      validDateISO: visitorDateISO,
      validDuration: visitorDuration,
      validStartTime: formattedTime,
      customTimeNote: visitorGateNote,
      issuedBy: `${currentUser?.name || 'Arjun Kumar'} (${currentUser?.unit || 'Flat A-1204'})`,
      otpCode: newOtp,
      status: 'EXPECTED'
    });

    setActivePassCreated(newPass);
    setAllVisitorPasses(serviceApi.getVisitorPasses());
    showToast(`Gate Pass created for ${guestCount} person${guestCount > 1 ? 's' : ''}! OTP #${newOtp} active.`, 'success');
    setVisitorName('');
    setVisitorPhone('');
    setVisitorVehicle('');
    setVisitorGateNote('');
    setGuestCount(1);
    setAdditionalGuests([]);
  };

  const copyOtp = () => {
    navigator.clipboard?.writeText(currentOtp);
    showToast(`Gate Check-in OTP #${currentOtp} copied to clipboard!`, 'info');
  };

  const sharePassViaText = (pass) => {
    const passToShare = pass || activePassCreated || {
      guestName: 'Guest',
      otpCode: currentOtp,
      hostUnit: 'Flat A-1204',
      validDate: formatDisplayDate(visitorDateISO),
      validDuration: visitorDuration,
      numberOfGuests: guestCount,
      allGuests: []
    };

    let guestsBlock = `👤 Primary Visitor: ${passToShare.guestName} (${passToShare.phone || visitorPhone})`;
    if (passToShare.allGuests && passToShare.allGuests.length > 1) {
      guestsBlock = `👥 Total Visitors (${passToShare.numberOfGuests || passToShare.allGuests.length} Persons):\n` +
        passToShare.allGuests.map((g, idx) => `  ${idx + 1}. ${g.name} (${g.phone || 'Same as primary'})${g.vehicle ? ` [Vehicle: ${g.vehicle}]` : ''}`).join('\n');
    }

    const message = `Hello ${passToShare.guestName || 'Guest'}, your Gate Pass for ${passToShare.hostUnit || 'Flat A-1204'} (Aparna Bhooja) is ready!\n\n${guestsBlock}\n🔑 Gate Check-in OTP: ${passToShare.otpCode}\n📅 Valid Date: ${passToShare.validDate || 'Today'}\n⏳ Valid Duration: ${passToShare.validDuration || '4 Hours'}\n📍 Main Gate 1 & South Barrier\n\nPlease show this OTP or code to security at the gate barrier.`;
    navigator.clipboard?.writeText(message);
    showToast('Gate Pass with all visitor details copied in ready-to-share WhatsApp/SMS format!', 'success');
  };

  const handleNewTicket = (e) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    const newId = `TKT-${Math.floor(4100 + Math.random() * 900)}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Auto assign specialist
    let techName = 'Ramesh M.';
    let techRole = 'Society Electrician';
    let techPhone = '+91 98490 12088';
    if (ticketCategory.toLowerCase().includes('plumb')) {
      techName = 'Dinesh P.';
      techRole = 'Society Plumber';
      techPhone = '+91 98490 12091';
    } else if (ticketCategory.toLowerCase().includes('carp')) {
      techName = 'Suresh K.';
      techRole = 'Society Carpenter';
      techPhone = '+91 98490 12044';
    } else if (ticketCategory.toLowerCase().includes('ac') || ticketCategory.toLowerCase().includes('appliance')) {
      techName = 'CoolingPro Tech Team';
      techRole = 'HVAC Specialist';
      techPhone = '+91 98490 12055';
    }

    const newTicket = {
      id: newId,
      title: ticketTitle.trim(),
      category: ticketCategory.split(' ')[0],
      location: ticketLocation,
      urgency: ticketUrgency,
      status: 'ASSIGNED',
      technician: techName,
      techRole: techRole,
      techPhone: techPhone,
      reportedAt: 'Just now',
      estCompletion: ticketSlot,
      otpCode: otp,
      note: ticketDesc.trim() || 'Work order logged. Technician notified.'
    };

    setActiveTickets([newTicket, ...activeTickets]);
    setShowTicketModal(false);
    showToast(`Work Order #${newId} logged! Assigned to ${techName}. Completion OTP #${otp} generated.`, 'success');
    setTicketTitle('');
    setTicketDesc('');
  };

  const handleResolveTicket = (ticketId) => {
    const ticket = activeTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    setActiveTickets(activeTickets.filter(t => t.id !== ticketId));
    setPastTickets([
      { id: ticket.id, title: ticket.title, date: 'Today (Just now)', team: ticket.technician, status: 'RESOLVED' },
      ...pastTickets
    ]);
    showToast(`Ticket #${ticketId} confirmed resolved! Thank you for rating the service.`, 'success');
  };

  const handleToggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const res = serviceApi.addCommentToPost(postId, {
      author: currentUser?.name || 'Arjun Kumar',
      unit: currentUser?.unit || 'Flat A-1204',
      text: text
    });

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
    if (res && res.post) {
      setCommunityPosts(serviceApi.getPosts(currentUser?.communityId));
    }
    showToast('Your comment has been posted to the community feed!', 'success');
  };

  const handleTogglePostLike = (postId) => {
    const currentlyLiked = !!userLikedPosts[postId];
    const newLikedState = { ...userLikedPosts, [postId]: !currentlyLiked };
    setUserLikedPosts(newLikedState);
    try {
      localStorage.setItem('communityconnect_user_liked_posts', JSON.stringify(newLikedState));
    } catch {}

    serviceApi.toggleLikePost(postId, currentlyLiked);
    setCommunityPosts(serviceApi.getPosts(currentUser?.communityId));
  };

  const handlePostCreated = (newPostData) => {
    const created = serviceApi.createPost({
      ...newPostData,
      communityId: currentUser?.communityId || 'comm-bhooja',
      author: currentUser?.name || 'Arjun Kumar',
      unit: currentUser?.unit || 'Flat A-1204'
    });
    setCommunityPosts(serviceApi.getPosts(currentUser?.communityId));
    showToast(`Post "${created.title}" published to community feed!`, 'success');
  };

  const openSellerChat = (sellerInfo) => {
    setChatTarget(sellerInfo);
    setShowChatModal(true);
  };

  const votePoll = (choice) => {
    if (pollVoted !== null) {
      showToast('You have already cast your vote on this poll!', 'info');
      return;
    }
    setPollVoted(choice);
    if (choice === 0) {
      setPollVotes(prev => ({ ...prev, yes: prev.yes + 1 }));
    } else {
      setPollVotes(prev => ({ ...prev, no: prev.no + 1 }));
    }
    showToast('Your vote has been counted anonymously!', 'success');
  };

  const openPaymentWithMethod = (method = 'upi') => {
    setPaymentInitialMethod(method);
    setShowPaymentModal(true);
  };

  const toggleAutoPay = () => {
    const nextVal = !autoPayEnabled;
    setAutoPayEnabled(nextVal);
    if (nextVal) {
      showToast('UPI AutoPay enabled for 1st of every month.', 'success');
    } else {
      showToast('UPI AutoPay disabled. Manual payment required for next cycle.', 'info');
    }
  };

  // Calculate poll percentages
  const totalVotes = pollVotes.yes + pollVotes.no;
  const yesPct = Math.round((pollVotes.yes / totalVotes) * 100);
  const noPct = Math.round((pollVotes.no / totalVotes) * 100);

  return (
    <div className={`bg-[#FAF8FF] font-['Plus_Jakarta_Sans',sans-serif] text-[#131B2E] antialiased min-h-screen ${isCommunityFrozen ? 'pt-14' : ''}`}>
      {/* Community Frozen Lockout Top Banner & Pop-up Modal */}
      {isCommunityFrozen && (
        <>
          <div className="fixed top-0 left-0 right-0 z-[99998] bg-gradient-to-r from-rose-700 via-rose-800 to-amber-800 text-white px-5 py-2.5 shadow-2xl flex items-center justify-between border-b-2 border-rose-300">
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/10 rounded-xl border border-white/20 shrink-0">
                  <span className="material-symbols-outlined text-xl text-amber-300 animate-pulse">lock</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="bg-rose-950/80 text-rose-200 font-black text-[10px] uppercase px-2 py-0.5 rounded border border-rose-400/40">
                    🔒 SUBSCRIPTION FROZEN
                  </span>
                  <span className="font-extrabold text-white">
                    {currentCommunity?.name || 'Community Portal'} Services Suspended
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFrozenModal(true)}
                className="px-3 py-1 bg-white text-rose-900 rounded-lg text-xs font-bold hover:bg-rose-50 transition cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">info</span>
                <span>View Lock Details &amp; Unfreeze</span>
              </button>
            </div>
          </div>

          {/* Subscription Frozen Modal Pop-up */}
          {showFrozenModal && (
            <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[999999] flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-rose-500/40 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-start justify-between border-b border-rose-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <span className="material-symbols-outlined text-2xl animate-pulse">lock</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-100 text-rose-900 font-black text-[10px] uppercase px-2 py-0.5 rounded-md border border-rose-300">
                          🔒 LICENSE SUSPENDED
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                        {currentCommunity?.name || 'Community'} Services Frozen
                      </h2>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFrozenModal(false)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 leading-relaxed">
                    <strong className="block font-bold text-rose-900 mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">warning</span>
                      <span>Suspension Notice:</span>
                    </strong>
                    <em>"{currentCommunity?.freezeReason || 'Annual Platform License Renewal past due by 45 days. Restricted to read-only security safety logs.'}"</em>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <span className="font-bold text-slate-800 block">Current Restricted Status:</span>
                    <ul className="space-y-1 text-slate-600 list-disc pl-4 text-[11px]">
                      <li>Live amenity bookings &amp; maintenance payments locked.</li>
                      <li>Gate security ANPR logs running in read-only audit mode.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-950 block">HQ Support &amp; Unfreeze Helpline:</span>
                    <p className="text-emerald-900 text-[11px]">
                      Email: <strong>support@communityconnect.io</strong> | Mobile: <strong>+91 800-266-6864</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFrozenModal(false);
                      showToast('Read-only safety access active.', 'info');
                    }}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition"
                  >
                    Continue Read-Only
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = 'mailto:support@communityconnect.io?subject=Unfreeze%20Community%20License%20Request';
                    }}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">mail</span>
                    <span>Contact Support to Unfreeze</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[9999] pointer-events-none flex flex-col gap-2">
          <div className={`p-3.5 rounded-xl shadow-lg flex items-center gap-2.5 min-w-[280px] max-w-md pointer-events-auto border-l-4 text-sm font-medium ${
            toastMessage.type === 'error'
              ? 'bg-white text-rose-700 border-rose-600'
              : toastMessage.type === 'success'
              ? 'bg-white text-[#131b2e] border-[#006b2c]'
              : 'bg-white text-[#131b2e] border-[#006591]'
          }`}>
            <span className="material-symbols-outlined text-lg shrink-0">
              {toastMessage.type === 'error' ? 'warning' : toastMessage.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <span className="flex-1">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#eaedff] overflow-y-auto">
        <div className="flex flex-col">
          {/* Brand Logo Header */}
          <div className="h-16 px-5 flex items-center bg-white border-b border-[#eaedff]">
            <BrandLogo size="md" subtitleText="Resident Portal" />
          </div>

          {/* Navigation Section */}
          <div className="px-4 pt-4 pb-2">
            <div className="px-2 py-1">
              <span className="text-[10px] uppercase tracking-wider text-[#6e7b6c] font-bold">
                RESIDENT DASHBOARD
              </span>
            </div>

            <nav className="mt-1 flex flex-col gap-1">
              <button
                onClick={() => switchTab('overview')}
                className={`w-full flex items-center gap-2 px-4 py-2.5 transition-colors rounded-xl text-left text-xs font-semibold cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#00873a] text-white shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                <span>Overview</span>
              </button>

              <button
                onClick={() => switchTab('services')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors text-left text-xs cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-[#00873a] text-white font-semibold shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">home_repair_service</span>
                  <span>Book Services</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-[#7ffc97]/60 text-[#002109]'
                }`}>
                  Verified
                </span>
              </button>

              <button
                onClick={() => switchTab('gate-passes')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors text-left text-xs cursor-pointer ${
                  activeTab === 'gate-passes'
                    ? 'bg-[#00873a] text-white font-semibold shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">sensor_door</span>
                  <span>Gate Passes</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  activeTab === 'gate-passes' ? 'bg-white/20 text-white' : 'bg-[#c9e6ff] text-[#004c6e]'
                }`}>
                  OTP Active
                </span>
              </button>

              <button
                onClick={() => switchTab('maintenance')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors text-left text-xs cursor-pointer ${
                  activeTab === 'maintenance'
                    ? 'bg-[#00873a] text-white font-semibold shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">handyman</span>
                  <span>Maintenance</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${activeTab === 'maintenance' ? 'bg-white' : 'bg-[#825100]'}`}></span>
              </button>

              <button
                onClick={() => switchTab('community-feed')}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors text-left text-xs cursor-pointer ${
                  activeTab === 'community-feed'
                    ? 'bg-[#00873a] text-white font-semibold shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">forum</span>
                <span>Community Feed</span>
              </button>

              <button
                onClick={() => switchTab('society-dues')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors text-left text-xs cursor-pointer ${
                  activeTab === 'society-dues'
                    ? 'bg-[#00873a] text-white font-semibold shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">payments</span>
                  <span>Society Dues</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  activeTab === 'society-dues' ? 'bg-white/20 text-white' : 'bg-[#7ffc97]/50 text-[#002109]'
                }`}>
                  Paid
                </span>
              </button>

              <button
                onClick={() => switchTab('amenities')}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors text-left text-xs cursor-pointer ${
                  activeTab === 'amenities'
                    ? 'bg-[#00873a] text-white font-semibold shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">sports_tennis</span>
                <span>Amenities</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="p-4 flex flex-col gap-2 border-t border-[#eaedff]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-[#eaedff]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006b2c] text-base">lock</span>
              <span className="text-[10px] font-semibold text-[#3e4a3d]">256-bit SSL Encrypted</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span>
          </div>

          <button
            onClick={() => showToast('Connecting to 24x7 Security Emergency Guard...', 'error')}
            type="button"
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ba1a1a] text-white hover:bg-[#93000a] text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">emergency</span>
            <span>Security SOS Hotline</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="pl-72 min-h-screen">
        {/* Top Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-8 border-b border-[#eaedff]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-1.5 rounded-xl cursor-pointer hover:bg-[#eaedff] transition-colors">
              <span className="material-symbols-outlined text-[#006b2c] text-lg">apartment</span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-[#131b2e] leading-tight">
                  Oakridge Heights • Unit A-1204
                </span>
                <span className="text-[10px] text-[#3e4a3d] leading-tight">Tower A (Primary Flat)</span>
              </div>
              <span className="material-symbols-outlined text-[#6e7b6c] text-sm ml-1">expand_more</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e2e7ff]">
              <span className="h-2 w-2 rounded-full bg-[#006b2c]"></span>
              <span className="text-[10px] text-[#006b2c] font-bold">System Online • Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('You have 2 unread announcements', 'info')}
              type="button"
              className="relative p-1.5 rounded-full text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#a36700]"></span>
            </button>

            <button
              onClick={() => showToast('Resident Support Desk: Toll-free 1800-419-COMM', 'info')}
              type="button"
              className="p-1.5 rounded-full text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">help</span>
            </button>

            {/* Resident Profile Pill */}
            <div className="flex items-center gap-2 pl-2 bg-[#f2f3ff] p-1 pr-3 rounded-full">
              <div className="w-8 h-8 rounded-full bg-[#006b2c] text-white font-extrabold text-xs flex items-center justify-center shrink-0 uppercase shadow-xs">
                {(currentUser?.name || 'Arjun Kumar').charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-[#131b2e] leading-tight">
                  {currentUser?.name || 'Arjun Kumar'}
                </span>
                <span className="text-[10px] text-[#006b2c] font-semibold leading-tight">
                  Owner • {currentUser?.flatNumber || 'Flat A-1204'}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={onLogout}
                title="Log out of Resident Account"
                className="ml-1 p-1 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Space */}
        <main className="relative pt-20 px-8 pb-12 max-w-7xl mx-auto w-full min-h-screen">
          {/* ========================================================
               TAB 1: OVERVIEW (Default)
              ======================================================== */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* Welcome Card Header */}
              <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)] border border-[#eaedff]">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#7ffc97]/20 blur-3xl pointer-events-none"></div>
                <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#c9e6ff]/30 blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-[#006b2c] text-white font-black text-2xl flex items-center justify-center shrink-0 uppercase shadow-md ring-2 ring-[#006b2c]/20">
                        {(currentUser?.name || 'Arjun Kumar').charAt(0)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#006b2c] ring-2 ring-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[10px] text-white">check</span>
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl font-bold text-[#131b2e]">Good Morning, Arjun! 👋</h1>
                        <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/60 text-[#002109] text-[10px] uppercase tracking-wide font-bold">
                          OWNER OCCUPIED
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#3e4a3d] mt-1 text-xs">
                        <span className="material-symbols-outlined text-base text-[#006b2c]">holiday_village</span>
                        <span className="font-medium">Oakridge Heights • Tower A, Flat A-1204</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[#6e7b6c]">Verified Resident ID: #OH-1204-A</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      onClick={() => switchTab('gate-passes')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#006b2c] text-white rounded-xl text-xs font-semibold hover:bg-[#00873a] transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">person_add</span>
                      <span>+ Invite Guest / Cab</span>
                    </button>
                    <button
                      onClick={() => switchTab('society-dues')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-[#006591]">payments</span>
                      <span>Society Dues</span>
                    </button>
                    <button
                      onClick={() => switchTab('amenities')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-[#825100]">sports_tennis</span>
                      <span>Book Amenity</span>
                    </button>
                    <button
                      onClick={() => switchTab('maintenance')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-[#ba1a1a]">report_problem</span>
                      <span>Report Issue</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Top Status & Metric Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Society Dues */}
                <div
                  onClick={() => switchTab('society-dues')}
                  className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff] hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#7ffc97]/40 flex items-center justify-center text-[#006b2c]">
                        <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#6e7b6c] font-bold block">
                          Maintenance &amp; Dues
                        </span>
                        <div className="text-lg font-bold text-[#131b2e]">₹0.00 Due</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/50 text-[#002109] text-[10px] flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c]"></span> Paid
                    </span>
                  </div>
                  <div className="mt-4 pt-2 flex items-center justify-between border-t border-[#eaedff]">
                    <span className="text-xs text-[#3e4a3d]">Next cycle: <strong>01 Nov 2025</strong></span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast('Downloading Oct 2025 Receipt (PDF)...', 'success');
                      }}
                      className="text-[#006b2c] hover:text-[#00873a] text-xs font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Download Slip</span>
                      <span className="material-symbols-outlined text-sm">download</span>
                    </button>
                  </div>
                </div>

                {/* Card 2: Active Passes & Visitors */}
                <div
                  onClick={() => switchTab('gate-passes')}
                  className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff] hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#c9e6ff]/40 flex items-center justify-center text-[#006591]">
                        <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#6e7b6c] font-bold block">
                          Active Visitor Passes
                        </span>
                        <div className="text-lg font-bold text-[#131b2e]">2 Expected Today</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#c9e6ff] text-[#004c6e] text-[10px] font-bold">
                      Active Today
                    </span>
                  </div>
                  <div className="mt-4 pt-2 flex items-center justify-between border-t border-[#eaedff]">
                    <div className="flex items-center gap-2 text-xs text-[#3e4a3d]">
                      <span className="text-xs font-semibold text-[#131b2e] font-mono bg-[#f2f3ff] px-1.5 py-0.5 rounded">
                        OTP #4829
                      </span>
                      <span>• Zomato Delivery</span>
                    </div>
                    <span className="text-[#006591] text-xs font-semibold flex items-center gap-0.5">
                      <span>View Passes</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>

                {/* Card 3: Amenity Access */}
                <div
                  onClick={() => switchTab('amenities')}
                  className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff] hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#ffddb8]/50 flex items-center justify-center text-[#825100]">
                        <span className="material-symbols-outlined text-xl">sports_tennis</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#6e7b6c] font-bold block">
                          Clubhouse Booking
                        </span>
                        <div className="text-lg font-bold text-[#131b2e]">Badminton Court 2</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold">
                      Confirmed
                    </span>
                  </div>
                  <div className="mt-4 pt-2 flex items-center justify-between border-t border-[#eaedff]">
                    <span className="text-xs text-[#3e4a3d]">Slot: <strong>Today, 7:00 PM – 8:00 PM</strong></span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast('QR Pass #CRT-2-7PM displayed to Gate Intercom', 'info');
                      }}
                      className="text-[#825100] text-xs font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Pass QR</span>
                      <span className="material-symbols-outlined text-sm">qr_code</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Two-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Group Buying Pool Banner */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7ffc97]/50 via-white to-white p-5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#006b2c] text-white flex items-center justify-center shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-2xl">group_work</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#131b2e]">Community Group AC Servicing</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#006b2c] text-white text-[10px] font-bold">
                            SAVE 25%
                          </span>
                        </div>
                        <p className="text-xs text-[#3e4a3d] mt-1">
                          <strong>{acPool?.currentParticipants || 18} / {acPool?.minThreshold || 20} neighbors joined</strong> from Tower A &amp; B. Unlock group discounted deep clean at ₹{acPool?.discountedPrice || 499}/unit.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (acPool) {
                          setSelectedPoolForJoinModal(acPool);
                        }
                      }}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        acPoolJoined ? 'bg-emerald-800 text-white' : 'bg-[#006b2c] text-white hover:bg-[#00873a]'
                      }`}
                    >
                      {acPoolJoined ? 'Enrolled ✓ (Joined)' : 'Join Group Pool'}
                    </button>
                  </div>

                  {/* Service & Home Assistance Shortcuts */}
                  <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <h2 className="text-base font-bold text-[#131b2e]">Verified Home Services</h2>
                        <span className="text-xs text-[#3e4a3d]">Pre-vetted, security badge-verified personnel with community ratings</span>
                      </div>
                      <button
                        onClick={() => switchTab('services')}
                        className="text-[#006b2c] hover:text-[#00873a] text-xs font-semibold flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View All Services</span>
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {[
                        { title: 'AC Service', price: '₹499', icon: 'mode_fan', color: 'text-[#006b2c]', bgHover: 'hover:bg-[#7ffc97]/20' },
                        { title: 'Electrician', price: '₹199', icon: 'bolt', color: 'text-[#006591]', bgHover: 'hover:bg-[#c9e6ff]/30' },
                        { title: 'Plumber', price: '₹249', icon: 'plumbing', color: 'text-[#825100]', bgHover: 'hover:bg-[#ffddb8]/30' },
                        { title: 'Cleaning', price: '₹1499', icon: 'cleaning_services', color: 'text-[#006b2c]', bgHover: 'hover:bg-[#7ffc97]/20' },
                        { title: 'Pest Control', price: 'Herbal Safe', icon: 'pest_control', color: 'text-[#006591]', bgHover: 'hover:bg-[#c9e6ff]/30' },
                        { title: 'Cook / Maid', price: 'Verified Pass', icon: 'soup_kitchen', color: 'text-[#825100]', bgHover: 'hover:bg-[#ffddb8]/30' }
                      ].map((svc, i) => (
                        <div
                          key={i}
                          onClick={() => switchTab('services')}
                          className={`group flex flex-col items-center justify-center p-3 rounded-xl bg-[#f2f3ff] ${svc.bgHover} transition-all text-center cursor-pointer`}
                        >
                          <div className={`w-12 h-12 rounded-full bg-white ${svc.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                            <span className="material-symbols-outlined text-2xl">{svc.icon}</span>
                          </div>
                          <span className="text-xs font-semibold text-[#131b2e] mt-2 group-hover:text-[#006b2c] leading-tight">
                            {svc.title}
                          </span>
                          <span className="text-[10px] text-[#6e7b6c] mt-0.5">{svc.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-Time Activity & Gate Access Log */}
                  <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-bold text-[#131b2e]">Recent Activity &amp; Flat Access Log</h2>
                        <span className="text-xs text-[#3e4a3d]">Live telemetry from Main Gate 1, Concierge, and Intercom</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-ping"></span>
                        <span className="text-[10px] font-bold text-[#006b2c]">Live Synced</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {/* Item 1 */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#7ffc97]/60 text-[#002109] flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">badge</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#131b2e]">Domestic Help Entry: Sunita Bai</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/50 text-[#002109] text-[10px] font-semibold">
                                Verified Pass
                              </span>
                            </div>
                            <span className="text-xs text-[#3e4a3d] mt-0.5">
                              Checked in at <strong>Gate 1 (North Barrier)</strong> • Daily Pass ID #ST-092
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-semibold text-[#131b2e]">11:20 AM</span>
                          <span className="text-[10px] text-[#6e7b6c]">Today</span>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#c9e6ff] text-[#004c6e] flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">package_2</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#131b2e]">Amazon Courier Delivered to Locker #14</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#39b8fd]/20 text-[#004666] text-[10px] font-semibold">
                                In Locker
                              </span>
                            </div>
                            <span className="text-xs text-[#3e4a3d] mt-0.5">
                              Tower A Ground Concierge • PIN sent via SMS &amp; In-App Pass
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-semibold text-[#131b2e]">09:15 AM</span>
                          <span className="text-[10px] text-[#6e7b6c]">Today</span>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#7ffc97] text-[#002109] flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">verified</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#131b2e]">Society Maintenance Dues Settled</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/40 text-[#002109] text-[10px] font-semibold">
                                ₹4,250 Paid
                              </span>
                            </div>
                            <span className="text-xs text-[#3e4a3d] mt-0.5">
                              Paid via UPI AutoPay • Transaction Ref #TXN981249
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-semibold text-[#131b2e]">04:30 PM</span>
                          <span className="text-[10px] text-[#6e7b6c]">Yesterday</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Family Members & Vehicle Digital Passes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Family Passes */}
                    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006b2c] text-xl">family_restroom</span>
                          <h3 className="text-sm font-bold text-[#131b2e]">Family Passes</h3>
                        </div>
                        <button
                          onClick={() => setShowAddMemberModal(true)}
                          type="button"
                          className="text-[#006b2c] hover:text-[#00873a] text-xs font-semibold cursor-pointer hover:underline"
                        >
                          + Add Member
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                        {familyMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f3ff]">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full ${member.bg || 'bg-[#7ffc97]'} ${member.text || 'text-[#002109]'} flex items-center justify-center text-xs font-bold shrink-0`}>
                                {member.initials || 'FM'}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#131b2e]">{member.name}</span>
                                <span className="text-[10px] text-[#3e4a3d]">{member.role} • {member.access}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[#006b2c] text-lg">check_circle</span>
                              {!member.isPrimary && (
                                <button
                                  onClick={() => handleRemoveFamilyMember(member.id)}
                                  title="Remove Member Pass"
                                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition cursor-pointer ml-1"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vehicle RFID Passes */}
                    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006591] text-xl">directions_car</span>
                          <h3 className="text-sm font-bold text-[#131b2e]">Vehicle RFID Passes</h3>
                        </div>
                        <button
                          onClick={() => setShowAddVehicleModal(true)}
                          type="button"
                          className="text-[#006591] hover:text-[#004c6e] text-xs font-semibold cursor-pointer hover:underline"
                        >
                          + Add Vehicle
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                        {vehiclePasses.map((veh) => (
                          <div key={veh.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f3ff]">
                            <div className="flex items-center gap-2.5">
                              <span className="material-symbols-outlined text-[#131b2e] text-xl shrink-0">{veh.icon || 'directions_car'}</span>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#131b2e] font-mono">{veh.plate}</span>
                                <span className="text-[10px] text-[#3e4a3d]">{veh.slot} • {veh.status || 'Active'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/50 text-[#002109] text-[10px] font-bold">
                                Active
                              </span>
                              <button
                                onClick={() => handleRemoveVehicle(veh.id)}
                                title="Revoke Vehicle Pass"
                                className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition cursor-pointer ml-1"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Gate Intercom Quick Connect Card */}
                  <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[#006b2c] text-xl">call</span>
                      <h3 className="text-base font-bold text-[#131b2e]">Gate Intercom Quick Connect</h3>
                    </div>
                    <p className="text-xs text-[#3e4a3d] mb-4">
                      Direct VoIP audio link to security towers and community command desk.
                    </p>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-all">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006b2c]">sensor_door</span>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-[#131b2e]">Gate 1 Main Entry</span>
                            <span className="text-[10px] text-[#3e4a3d]">Officer R. Sharma</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast('Calling Gate 1 Main Entry VoIP...', 'info')}
                          className="px-3 py-1.5 rounded-full bg-[#006b2c] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#00873a] cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">phone</span>
                          <span>Dial</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-all">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#ba1a1a]">local_police</span>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-[#131b2e]">Emergency SOS Desk</span>
                            <span className="text-[10px] text-[#3e4a3d]">24x7 Quick Response Team</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast('Connecting SOS desk...', 'error')}
                          className="px-3 py-1.5 rounded-full bg-[#ba1a1a] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#93000a] cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">sos</span>
                          <span>Call SOS</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Society Official Notice Board */}
                  <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#825100] text-xl">campaign</span>
                        <h3 className="text-base font-bold text-[#131b2e]">Society Notices</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold">
                        2 New
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#f2f3ff]">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                            Facility Alert
                          </span>
                          <span className="text-[10px] text-[#6e7b6c]">Today, 8:30 AM</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#131b2e] mt-1">
                          Swimming Pool Filter Replacement
                        </h4>
                        <p className="text-xs text-[#3e4a3d]">
                          The main clubhouse pool will be unavailable on Friday from 06:00 to 16:00 for carbon overhaul.
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#f2f3ff]">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">
                            Community Event
                          </span>
                          <span className="text-[10px] text-[#6e7b6c]">Oct 12th</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#131b2e] mt-1">
                          Autumn Gathering &amp; Food Stalls
                        </h4>
                        <p className="text-xs text-[#3e4a3d]">
                          Central Lawn gathering. 164 neighbors registered. Stalls, games &amp; live acoustic performance!
                        </p>
                        <div className="mt-2 flex items-center justify-between pt-1">
                          <span className="text-[11px] text-[#006b2c] font-semibold">
                            {rsvpAutumn ? '165 Attending' : '164 Attending'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setRsvpAutumn(!rsvpAutumn);
                              showToast(!rsvpAutumn ? 'RSVP Confirmed for Autumn Gathering!' : 'RSVP Cancelled.', !rsvpAutumn ? 'success' : 'info');
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                              rsvpAutumn ? 'bg-[#00873a] text-white' : 'bg-[#006b2c] text-white hover:bg-[#00873a]'
                            }`}
                          >
                            {rsvpAutumn ? 'RSVP Confirmed ✓' : 'RSVP Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
               TAB 2: BOOK SERVICES (DETAILED FULL CATALOG & WORK ORDERS)
              ======================================================== */}
          {activeTab === 'services' && (
            <DetailedServicesSection
              currentUser={currentUser}
              showToast={showToast}
              onPassGenerated={handlePassFromService}
            />
          )}

          {/* ========================================================
               TAB 3: GATE PASSES
              ======================================================== */}
          {activeTab === 'gate-passes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Pass Generator Form (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff] flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#131b2e]">Pre-Approve Visitor Gate Pass</h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Main Gate 1 &amp; 2
                    </span>
                  </div>
                  <p className="text-xs text-[#3e4a3d] mt-0.5">
                    Generate instant digital entry passes for friends, relatives, cabs, and personal guests.
                  </p>
                </div>

                {/* Delivery Clarification Callout Notice */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-700 text-lg mt-0.5 shrink-0">local_shipping</span>
                  <div className="space-y-1">
                    <div className="font-bold text-[12px] flex items-center gap-1.5 text-blue-900">
                      <span>Expecting a Delivery? (Zomato, Swiggy, Amazon, Couriers)</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Delivery personnel are processed directly at the <strong>Security Gate</strong>. The gate guards register their company, verify parcels, and issue an official <strong>Delivery Gate Pass</strong> to Flat A-1204. You do not need to create passes here—all active delivery riders arriving at your doorstep appear in the live table on the right!
                    </p>
                  </div>
                </div>

                {/* Pass Category Selector */}
                <div>
                  <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1.5">
                    Select Visitor Category
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 p-1 rounded-xl bg-[#f2f3ff]">
                    {[
                      { id: 'Friend', label: 'Friend', icon: 'diversity_3' },
                      { id: 'Relative', label: 'Relative', icon: 'family_restroom' },
                      { id: 'Guest', label: 'Guest', icon: 'person' },
                      { id: 'Cab', label: 'Cab', icon: 'local_taxi' },
                      { id: 'Other', label: 'Other', icon: 'person_pin' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPassCategory(item.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                          passCategory === item.id
                            ? 'bg-white text-[#006b2c] shadow-xs font-bold'
                            : 'text-[#3e4a3d] hover:text-[#131b2e]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                        <span className="text-[11px] leading-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form className="flex flex-col gap-3.5" onSubmit={handleCreatePass}>
                  {/* Entry Mode Selector (Vehicle vs Walk-In Pedestrian) */}
                  <div>
                    <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">
                      Entry Transit Mode *
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-[#f2f3ff] p-1 rounded-xl border border-[#eaedff]">
                      <button
                        type="button"
                        onClick={() => setEntryMode('VEHICLE')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          entryMode === 'VEHICLE'
                            ? 'bg-[#131b2e] text-white shadow-xs'
                            : 'text-[#3e4a3d] hover:bg-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">directions_car</span>
                        <span>🚗 Vehicle Entry</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEntryMode('WALK_IN');
                          setVisitorVehicle('');
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          entryMode === 'WALK_IN'
                            ? 'bg-[#00873a] text-white shadow-xs'
                            : 'text-[#3e4a3d] hover:bg-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">directions_walk</span>
                        <span>🚶 Walk-In (No Vehicle)</span>
                      </button>
                    </div>
                  </div>

                  {/* Company / Brand Selection Chips */}
                  <div>
                    <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">
                      Company / Organization Tag
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      {['Amazon', 'Zomato', 'Swiggy', 'Blinkit', 'Urban Company', 'Uber', 'Maid/Cook', 'Private Guest'].map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => setCompanyName(brand)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            companyName === brand
                              ? 'bg-[#006b2c] text-white shadow-2xs'
                              : 'bg-[#f2f3ff] text-[#131b2e] border border-[#eaedff] hover:bg-[#e2e7ff]'
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visitor Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">
                        {passCategory === 'Cab' ? 'Driver / Cab Service' : passCategory === 'Relative' ? 'Relative / Family Name' : 'Visitor Name'} *
                      </label>
                      <input
                        className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-[#131b2e]"
                        placeholder={passCategory === 'Cab' ? 'e.g. Uber (Driver Ramesh)' : passCategory === 'Relative' ? 'e.g. Ramesh Uncle & Family' : 'e.g. Vikram Verma'}
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        required
                        type="text"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">
                        Phone Number *
                      </label>
                      <input
                        className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-[#131b2e]"
                        placeholder="+91 98765 43210"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        required
                        type="tel"
                      />
                    </div>
                  </div>

                  {/* Vehicle Number & Number of Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">
                        {entryMode === 'WALK_IN' ? 'Vehicle Status' : 'Vehicle Plate Number (Optional)'}
                      </label>
                      <input
                        disabled={entryMode === 'WALK_IN'}
                        className={`w-full px-3 py-2 rounded-xl border border-[#eaedff] text-xs font-mono ${
                          entryMode === 'WALK_IN'
                            ? 'bg-emerald-50 text-emerald-900 font-bold border-emerald-200'
                            : 'bg-[#f2f3ff] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c]'
                        }`}
                        placeholder={entryMode === 'WALK_IN' ? '🚶 Walk-In Pedestrian (No Vehicle)' : 'e.g. TS 09 UB 1120'}
                        value={entryMode === 'WALK_IN' ? 'N/A (Walk-In Visitor)' : visitorVehicle}
                        onChange={(e) => setVisitorVehicle(e.target.value)}
                        type="text"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">
                        Number of Persons
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => handleGuestCountChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-[#131b2e] font-semibold"
                      >
                        <option value={1}>1 Person (Primary Visitor)</option>
                        <option value={2}>2 Persons (1 Co-Visitor)</option>
                        <option value={3}>3 Persons (2 Co-Visitors)</option>
                        <option value={4}>4 Persons (3 Co-Visitors)</option>
                        <option value={5}>5 Persons (4 Co-Visitors)</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Additional Guests Fields (For 2, 3, 4, 5 Persons) */}
                  {guestCount > 1 && (
                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                          <span className="material-symbols-outlined text-base text-emerald-700">group_add</span>
                          <span>Co-Visitor Details ({guestCount - 1} Additional Person{guestCount > 2 ? 's' : ''})</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                          Gate Security Requirement
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Gate security verifies ID for each person entering the community premises.
                      </p>

                      <div className="space-y-2.5">
                        {additionalGuests.map((guest, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-2">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">
                                  {idx + 2}
                                </span>
                                <span>Person #{idx + 2} Details</span>
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium">Co-Visitor</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-gray-600 uppercase font-bold block mb-1">
                                  Full Name *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={guest.name || ''}
                                  onChange={(e) => updateAdditionalGuest(idx, 'name', e.target.value)}
                                  placeholder={`e.g. Person ${idx + 2} Full Name`}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-gray-900"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-gray-600 uppercase font-bold block mb-1">
                                  Phone Number *
                                </label>
                                <input
                                  type="tel"
                                  required
                                  value={guest.phone || ''}
                                  onChange={(e) => updateAdditionalGuest(idx, 'phone', e.target.value)}
                                  placeholder="e.g. +91 98765 00000"
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-gray-900"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-gray-600 uppercase font-bold block mb-1">
                                Separate Vehicle Plate Number <span className="text-gray-400 font-normal">(Optional - leave blank if traveling together)</span>
                              </label>
                              <input
                                type="text"
                                value={guest.vehicle || ''}
                                onChange={(e) => updateAdditionalGuest(idx, 'vehicle', e.target.value)}
                                placeholder="e.g. TS 09 EA 4410 (Optional)"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-gray-900 font-mono"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date Selection with Quick Shortcuts */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block">
                        Valid Date
                      </label>
                      <span className="text-[11px] font-semibold text-[#006b2c]">
                        {formatDisplayDate(visitorDateISO, 'Selected:')}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <button
                        type="button"
                        onClick={() => setVisitorDateISO(getTodayISO())}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          visitorDateISO === getTodayISO()
                            ? 'bg-[#006b2c] text-white shadow-xs'
                            : 'bg-[#f2f3ff] text-[#3e4a3d] hover:bg-gray-200'
                        }`}
                      >
                        ⚡ Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisitorDateISO(getTomorrowISO())}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          visitorDateISO === getTomorrowISO()
                            ? 'bg-[#006b2c] text-white shadow-xs'
                            : 'bg-[#f2f3ff] text-[#3e4a3d] hover:bg-gray-200'
                        }`}
                      >
                        ☀️ Tomorrow
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisitorDateISO(getUpcomingSaturdayISO())}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          visitorDateISO === getUpcomingSaturdayISO()
                            ? 'bg-[#006b2c] text-white shadow-xs'
                            : 'bg-[#f2f3ff] text-[#3e4a3d] hover:bg-gray-200'
                        }`}
                      >
                        📅 This Weekend
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisitorDateISO(getNextWeekISO())}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          visitorDateISO === getNextWeekISO()
                            ? 'bg-[#006b2c] text-white shadow-xs'
                            : 'bg-[#f2f3ff] text-[#3e4a3d] hover:bg-gray-200'
                        }`}
                      >
                        🗓️ Next Week
                      </button>
                    </div>

                    <input
                      type="date"
                      value={visitorDateISO}
                      min={getTodayISO()}
                      onChange={(e) => setVisitorDateISO(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-[#131b2e]"
                    />
                  </div>

                  {/* Valid Duration and Expected Arrival Time */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block">
                      Valid Duration &amp; Expected Arrival Time
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-gray-500 block mb-1 font-medium">Valid Duration Window:</span>
                        <select
                          value={visitorDuration}
                          onChange={(e) => setVisitorDuration(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-[#131b2e]"
                        >
                          <option value="2 Hours (Quick Visit)">2 Hours (Quick Visit)</option>
                          <option value="4 Hours (Standard Afternoon / Evening)">4 Hours (Standard Afternoon / Evening)</option>
                          <option value="8 Hours (Full Day Pass)">8 Hours (Full Day Pass)</option>
                          <option value="All Day (Until 11:59 PM)">All Day (Until 11:59 PM)</option>
                          <option value="Weekend Pass (48 Hours)">Weekend Pass (48 Hours)</option>
                          <option value="Extended Pass (Up to 7 Days)">Extended Pass (Up to 7 Days)</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 block mb-1 font-medium">Expected Arrival Clock:</span>
                        <input
                          type="time"
                          value={visitorExactTime}
                          onChange={(e) => setVisitorExactTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-[#131b2e]"
                        />
                      </div>
                    </div>

                    {/* Quick Arrival Shortcuts */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {[
                        { label: '⚡ Any Time', time: '' },
                        { label: '🌅 10:00 AM', time: '10:00' },
                        { label: '☀️ 02:00 PM', time: '14:00' },
                        { label: '🌆 06:30 PM', time: '18:30' },
                        { label: '🌙 08:30 PM', time: '20:30' }
                      ].map((slot, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setVisitorExactTime(slot.time)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                            visitorExactTime === slot.time
                              ? 'bg-emerald-800 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Computed Validity Window Summary Pill */}
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-700 text-base shrink-0">schedule</span>
                    <div className="text-[11px] leading-tight">
                      <strong>Valid Window:</strong> {formatDisplayDate(visitorDateISO)} • Arrival: <strong>{visitorExactTime ? format12HourTime(visitorExactTime) : 'Immediate / Any Time'}</strong> • Duration: <strong>{visitorDuration}</strong>
                    </div>
                  </div>

                  {/* Special Gate Instructions */}
                  <div>
                    <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">
                      Instructions for Security Gate Guard <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-xs text-[#131b2e]"
                      placeholder="e.g. Family visiting with luggage, permit parking in Tower A visitor slot"
                      value={visitorGateNote}
                      onChange={(e) => setVisitorGateNote(e.target.value)}
                      type="text"
                    />
                  </div>

                  <button
                    className="mt-2 w-full py-3 bg-[#006b2c] text-white rounded-xl text-xs font-bold hover:bg-[#00873a] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-lg">verified</span>
                    <span>Generate Pre-Approved Gate Pass &amp; OTP</span>
                  </button>
                </form>

                {/* Live Active OTP Badge & Sharing Card */}
                <div className="mt-2 p-4 rounded-xl bg-gradient-to-br from-[#f2f3ff] to-emerald-50/50 border border-dashed border-[#006b2c]/40 flex flex-col items-center text-center gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] uppercase text-[#6e7b6c] font-bold tracking-wider">
                      Active Gate Check-in OTP
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-3xl font-extrabold tracking-widest text-[#006b2c] bg-white px-4 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                      {currentOtp}
                    </span>
                    <button
                      onClick={copyOtp}
                      title="Copy OTP"
                      type="button"
                      className="p-2 rounded-xl bg-white text-[#006b2c] border border-emerald-200 hover:bg-[#006b2c] hover:text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-[#3e4a3d] max-w-xs leading-relaxed">
                    Show this OTP to the security guard at Gate 1 or South Barrier to open the boom arm automatically.
                  </div>

                  <button
                    type="button"
                    onClick={() => sharePassViaText(activePassCreated)}
                    className="mt-1 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                    <span>Share Pass to WhatsApp / SMS</span>
                  </button>
                </div>
              </div>

              {/* Visitor & Delivery Log Table (7 cols) */}
              <div className="lg:col-span-7 rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff] flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                        <span>Live Gate Ingress &amp; Visitor History</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                          Flat A-1204
                        </span>
                      </h3>
                      <span className="text-xs text-[#3e4a3d]">
                        Real-time visitor logs, pre-approved passes, and security-gate deliveries
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setAllVisitorPasses(serviceApi.getVisitorPasses());
                        showToast('Visitor history refreshed from Gate 1 server', 'info');
                      }}
                      type="button"
                      className="self-start sm:self-auto p-2 rounded-lg bg-[#f2f3ff] text-[#3e4a3d] hover:text-[#131b2e] cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-base">refresh</span>
                      <span>Sync Gate</span>
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
                    {[
                      { id: 'all', label: 'All Gate Logs' },
                      { id: 'friends', label: '👥 Friends & Relatives' },
                      { id: 'cabs', label: '🚖 Cabs' },
                      { id: 'delivery', label: '🚚 Delivery Passes (From Security Gate)' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setGateFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                          gateFilter === f.id
                            ? 'bg-[#006b2c] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Pass List */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#eaedff] text-[#6e7b6c] text-[10px] uppercase tracking-wider">
                          <th className="py-2.5">Visitor / Delivery Partner</th>
                          <th className="py-2.5">Category &amp; Issuer</th>
                          <th className="py-2.5">Valid Duration / Time</th>
                          <th className="py-2.5 text-right">Gate Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaedff]">
                        {allVisitorPasses
                          .filter(pass => {
                            if (gateFilter === 'friends') {
                              return pass.visitorType === 'FRIEND' || pass.visitorType === 'RELATIVE' || pass.visitorType === 'GUEST';
                            }
                            if (gateFilter === 'cabs') {
                              return pass.visitorType === 'CAB';
                            }
                            if (gateFilter === 'delivery') {
                              return pass.visitorType === 'DELIVERY';
                            }
                            return true;
                          })
                          .map((pass, i) => {
                            const isDelivery = pass.visitorType === 'DELIVERY';
                            const isInside = pass.status === 'INSIDE_PREMISES';
                            const isExpected = pass.status === 'EXPECTED';

                            return (
                              <tr key={pass.id || i} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3">
                                  <div className="font-semibold text-[#131b2e] flex items-center gap-1.5 flex-wrap">
                                    {isDelivery ? (
                                      <span className="material-symbols-outlined text-blue-600 text-base">local_shipping</span>
                                    ) : pass.visitorType === 'CAB' ? (
                                      <span className="material-symbols-outlined text-amber-600 text-base">local_taxi</span>
                                    ) : (
                                      <span className="material-symbols-outlined text-emerald-600 text-base">person</span>
                                    )}
                                    <span>{pass.guestName}</span>
                                    {pass.numberOfGuests > 1 && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                                        {pass.numberOfGuests} Persons ({pass.numberOfGuests - 1} Co-Visitor{pass.numberOfGuests > 2 ? 's' : ''})
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                                    {pass.vehicleNumber ? `Vehicle: ${pass.vehicleNumber}` : `Phone: ${pass.phone || 'N/A'}`}
                                    {pass.otpCode && <span className="ml-2 font-bold text-[#006b2c]">OTP: #{pass.otpCode}</span>}
                                  </div>
                                  {/* List of Co-Visitors if 2+ people */}
                                  {pass.additionalGuests && pass.additionalGuests.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {pass.additionalGuests.map((ag, agi) => (
                                        <span key={agi} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                                          P{agi + 2}: <strong>{ag.name}</strong> ({ag.phone}){ag.vehicle ? ` • ${ag.vehicle}` : ''}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </td>

                                <td className="py-3">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isDelivery
                                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                      : pass.visitorType === 'CAB'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                  }`}>
                                    {pass.visitorCategory || (isDelivery ? 'Delivery Partner' : 'Guest')}
                                  </span>
                                  <div className="text-[10px] text-gray-500 mt-1">
                                    {isDelivery ? 'Issued by Security Gate 1' : 'Pre-Approved by You'}
                                  </div>
                                </td>

                                <td className="py-3 text-[#3e4a3d]">
                                  <div className="font-medium text-[#131b2e]">
                                    {pass.validDuration || '4 Hours'}
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    {pass.validDate ? `${pass.validDate} • ` : ''}{pass.validStartTime || pass.timestamp || 'Active'}
                                  </div>
                                </td>

                                <td className="py-3 text-right">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    isInside
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : isExpected
                                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {isInside && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                                    <span>
                                      {isInside ? 'Inside Premises' : isExpected ? 'Pre-Approved' : pass.status || 'Active'}
                                    </span>
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs text-[#6e7b6c]">
                  <span>Displaying Gate 1 &amp; Gate 2 logs for Unit A-1204</span>
                  <button
                    onClick={() => showToast('Archived visitor & delivery report sent to registered email.', 'info')}
                    type="button"
                    className="text-[#006b2c] hover:underline font-semibold cursor-pointer"
                  >
                    Export Monthly CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
               TAB 4: MAINTENANCE & TICKETS
              ======================================================== */}
          {activeTab === 'maintenance' && (
            <div className="flex flex-col gap-6">
              {/* Header with Action */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)] border border-[#eaedff]">
                <div>
                  <h1 className="text-xl font-bold text-[#131b2e]">Maintenance &amp; Work Orders</h1>
                  <p className="text-xs text-[#3e4a3d] mt-0.5">
                    Doorstep service requests for Flat A-1204 &amp; common area facilities
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Calling Facility Desk Intercom #104 (+91 98490 00104)...', 'info')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">support_agent</span>
                    <span>Intercom #104</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#006b2c] text-white rounded-xl text-xs font-bold hover:bg-[#00873a] transition-all shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    <span>+ Raise New Ticket</span>
                  </button>
                </div>
              </div>

              {/* Maintenance Guide Banner - Clarifying what this is */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-blue-50 to-indigo-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-emerald-800 text-lg">lightbulb</span>
                  <h3 className="font-bold text-emerald-950 text-sm">How Society Maintenance Works (Resident Guide)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="font-bold text-[#131b2e] flex items-center gap-1.5 mb-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
                      <span>In-Flat Repairs</span>
                    </div>
                    <p className="text-[11px] text-[#3e4a3d] leading-relaxed">
                      Plumbing, electrical, carpentry, or masonry work inside Flat A-1204. Facility assigns a verified specialist who visits your home.
                    </p>
                  </div>

                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="font-bold text-[#131b2e] flex items-center gap-1.5 mb-1">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">2</span>
                      <span>Secure Completion OTP</span>
                    </div>
                    <p className="text-[11px] text-[#3e4a3d] leading-relaxed">
                      Every ticket has a private 4-digit OTP. Only give this code to the technician after the repair is completed to your satisfaction!
                    </p>
                  </div>

                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="font-bold text-[#131b2e] flex items-center gap-1.5 mb-1">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-xs flex items-center justify-center font-bold">3</span>
                      <span>Common Area (CAM)</span>
                    </div>
                    <p className="text-[11px] text-[#3e4a3d] leading-relaxed">
                      Lifts, DG backup, landscape, swimming pool, and streetlights are maintained 24/7 and covered under your monthly society dues.
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Tickets List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                    <span>Active Work Orders</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                      {activeTickets.length} Ongoing
                    </span>
                  </h2>
                </div>

                {activeTickets.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#eaedff]">
                    <span className="material-symbols-outlined text-4xl text-emerald-600 mb-2">task_alt</span>
                    <h3 className="font-bold text-gray-800">No Pending Tickets</h3>
                    <p className="text-xs text-gray-500 mt-1">All maintenance issues for Flat A-1204 are resolved.</p>
                  </div>
                ) : (
                  activeTickets.map(ticket => (
                    <div key={ticket.id} className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#eaedff] pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined">
                              {ticket.category.toLowerCase().includes('plumb') ? 'water_drop' : ticket.category.toLowerCase().includes('elec') ? 'bolt' : 'handyman'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-bold text-[#131b2e]">#{ticket.id}: {ticket.title}</span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[10px] font-bold">
                                {ticket.status === 'ASSIGNED' ? 'Technician Assigned' : 'In Progress (On-Site)'}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                {ticket.location}
                              </span>
                            </div>
                            <span className="text-xs text-[#3e4a3d]">
                              Reported: {ticket.reportedAt} • Target Window: {ticket.estCompletion}
                            </span>
                          </div>
                        </div>

                        {/* Assigned Tech Info */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#131b2e] block">{ticket.technician}</span>
                            <span className="text-[10px] text-[#6e7b6c]">{ticket.techRole}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => showToast(`Dialing ${ticket.technician} at ${ticket.techPhone}...`, 'info')}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                          >
                            <span className="material-symbols-outlined text-sm">call</span>
                            <span>Call Tech</span>
                          </button>
                        </div>
                      </div>

                      {/* 4-Step Stepper Component */}
                      <div className="py-6 px-2">
                        <div className="relative flex items-center justify-between">
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#eaedff] z-0"></div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#006b2c] z-0" style={{ width: ticket.status === 'ASSIGNED' ? '33%' : '66%' }}></div>

                          {/* Step 1: Submitted */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#006b2c] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              <span className="material-symbols-outlined text-sm">check</span>
                            </div>
                            <span className="mt-1.5 text-xs font-bold text-[#131b2e]">Submitted</span>
                            <span className="text-[10px] text-[#6e7b6c]">{ticket.reportedAt}</span>
                          </div>

                          {/* Step 2: Assigned */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#006b2c] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              <span className="material-symbols-outlined text-sm">check</span>
                            </div>
                            <span className="mt-1.5 text-xs font-bold text-[#131b2e]">Assigned</span>
                            <span className="text-[10px] text-[#6e7b6c]">{ticket.technician}</span>
                          </div>

                          {/* Step 3: In Progress */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#006b2c] text-white ring-4 ring-[#7ffc97]/40 flex items-center justify-center font-bold text-xs shadow-xs animate-pulse">
                              <span className="material-symbols-outlined text-sm">engineering</span>
                            </div>
                            <span className="mt-1.5 text-xs font-bold text-[#006b2c]">In Progress</span>
                            <span className="text-[10px] text-[#006b2c] font-medium">Technician On-Site</span>
                          </div>

                          {/* Step 4: Resolved */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#eaedff] text-[#3e4a3d] flex items-center justify-center font-bold text-xs">
                              <span className="material-symbols-outlined text-sm">done_all</span>
                            </div>
                            <span className="mt-1.5 text-xs font-semibold text-[#6e7b6c]">Resolved</span>
                            <span className="text-[10px] text-[#6e7b6c]">Pending OTP</span>
                          </div>
                        </div>
                      </div>

                      {/* Work Notes & Completion OTP Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-[#eaedff] items-center">
                        <div className="md:col-span-6 flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="material-symbols-outlined text-[#006b2c] text-base shrink-0 mt-0.5">chat</span>
                          <span className="text-xs text-[#131b2e] leading-relaxed">
                            {ticket.note}
                          </span>
                        </div>

                        {/* OTP Verification Box */}
                        <div className="md:col-span-4 p-2.5 rounded-xl bg-emerald-50 border border-dashed border-emerald-300 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-900 block">
                              Work Completion OTP
                            </span>
                            <span className="text-[10px] text-emerald-800">
                              Give to {ticket.technician} when done
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-base font-extrabold text-[#006b2c] bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                              {ticket.otpCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(ticket.otpCode);
                                showToast(`Completion OTP #${ticket.otpCode} copied!`, 'info');
                              }}
                              className="p-1 rounded bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-pointer"
                              title="Copy OTP"
                            >
                              <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                          </div>
                        </div>

                        {/* Mark Resolved Button */}
                        <div className="md:col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleResolveTicket(ticket.id)}
                            className="w-full py-2 px-3 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span>Mark Resolved</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* History of past resolved tickets */}
              <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                <h3 className="text-base font-bold text-[#131b2e] mb-3">Past Resolved Tickets &amp; Audit Logs</h3>
                <div className="divide-y divide-[#eaedff]">
                  {pastTickets.map((t, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#131b2e]">#{t.id}: {t.title}</span>
                        <p className="text-[11px] text-[#3e4a3d] mt-0.5">Resolved on {t.date} • {t.team}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/50 text-[#002109] text-[10px] font-bold">
                        Resolved ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
               TAB 5: COMMUNITY FEED
              ======================================================== */}
          {activeTab === 'community-feed' && (
            <div className="flex flex-col gap-6">
              {/* Feed Filter Tabs */}
              <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: 'all', label: 'All Feed & Activity' },
                    { id: 'classifieds', label: 'Marketplace & Classifieds' },
                    { id: 'group_services', label: 'Community Group Services' },
                    { id: 'notices', label: 'Announcements & Notices' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFeedFilter(tab.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                        feedFilter === tab.id
                          ? 'bg-[#00873a] text-white shadow-xs'
                          : 'text-[#3e4a3d] hover:bg-[#f2f3ff]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(true)}
                  className="px-4 py-2 bg-[#006b2c] text-white rounded-xl text-xs font-bold hover:bg-[#00873a] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  <span>Create a Post</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Posts Stream (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  {communityPosts
                    .filter(post => {
                      if (feedFilter === 'notices') return post.category === 'notices' || post.type === 'POLL' || post.type === 'ANNOUNCEMENT' || post.category === 'SECURITY' || post.category === 'MAINTENANCE';
                      if (feedFilter === 'classifieds') return post.category === 'classifieds' || post.category === 'MARKETPLACE' || post.type === 'CLASSIFIED';
                      if (feedFilter === 'group_services') return post.category === 'group_services' || post.category === 'GROUP_SERVICE' || post.category === 'SOLO_STAFF' || post.type === 'GROUP_SERVICE';
                      return true;
                    })
                    .map(post => {
                      const isLiked = !!userLikedPosts[post.id];
                      const areCommentsOpen = !!expandedComments[post.id];
                      const commentCount = post.comments ? post.comments.length : 0;

                      return (
                        <div key={post.id} className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                          {/* Post Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs text-white ${
                                post.authorRole === 'COMMUNITY_ADMIN' || post.authorRole === 'ADMIN'
                                  ? 'bg-[#006b2c]'
                                  : post.authorRole === 'SERVICE_PROVIDER'
                                  ? 'bg-amber-600'
                                  : post.authorRole === 'SECURITY_TEAM'
                                  ? 'bg-purple-700'
                                  : 'bg-[#006591]'
                              }`}>
                                {post.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-[#131b2e]">{post.author}</span>
                                  <span className="text-[10px] text-gray-500 font-medium">({post.unit})</span>
                                </div>
                                <p className="text-[10px] text-[#3e4a3d]">{post.timestamp || 'Recent'}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              post.type === 'POLL'
                                ? 'bg-[#7ffc97]/60 text-[#002109]'
                                : post.type === 'CLASSIFIED' || post.category === 'MARKETPLACE'
                                ? 'bg-sky-100 text-sky-800'
                                : post.type === 'GROUP_SERVICE' || post.category === 'GROUP_SERVICE' || post.category === 'SOLO_STAFF'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300/40'
                                : 'bg-purple-100 text-purple-900'
                            }`}>
                              {post.type === 'POLL' ? 'Active Poll' : (post.type === 'CLASSIFIED' || post.category === 'MARKETPLACE') ? 'Classified Bazaar' : (post.type === 'GROUP_SERVICE' || post.category === 'GROUP_SERVICE' || post.category === 'SOLO_STAFF') ? 'Group Service' : 'Official Notice'}
                            </span>
                          </div>

                          {/* Post Body */}
                          <div className="mt-3">
                            <h3 className="text-sm font-bold text-[#131b2e] flex items-center justify-between gap-2">
                              <span>{post.title}</span>
                              {post.price && post.type !== 'CLASSIFIED' && (
                                <span className="text-xs font-black text-[#006b2c] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                                  {post.price}
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-[#3e4a3d] mt-1 whitespace-pre-line leading-relaxed">{post.content}</p>

                            {/* Poll Rendering if Type is POLL */}
                            {post.type === 'POLL' && (
                              <div className="mt-4 flex flex-col gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => votePoll(0)}
                                  className="group w-full p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-left relative overflow-hidden transition-all border border-transparent hover:border-[#006b2c] cursor-pointer"
                                >
                                  <div
                                    className="absolute left-0 top-0 bottom-0 bg-[#006b2c]/15 transition-all duration-500"
                                    style={{ width: `${yesPct}%` }}
                                  ></div>
                                  <div className="relative z-10 flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-2">
                                      <span className="w-4 h-4 rounded-full border-2 border-[#006b2c] flex items-center justify-center">
                                        {pollVoted === 0 && <span className="w-2 h-2 rounded-full bg-[#006b2c]"></span>}
                                      </span>
                                      <strong className="text-[#131b2e]">Yes, approve fast chargers immediately</strong>
                                    </span>
                                    <span className="font-bold text-[#006b2c]">{yesPct}% ({pollVotes.yes} votes)</span>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => votePoll(1)}
                                  className="group w-full p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-left relative overflow-hidden transition-all border border-transparent hover:border-[#006b2c] cursor-pointer"
                                >
                                  <div
                                    className="absolute left-0 top-0 bottom-0 bg-[#006b2c]/15 transition-all duration-500"
                                    style={{ width: `${noPct}%` }}
                                  ></div>
                                  <div className="relative z-10 flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-2">
                                      <span className="w-4 h-4 rounded-full border-2 border-[#6e7b6c] flex items-center justify-center">
                                        {pollVoted === 1 && <span className="w-2 h-2 rounded-full bg-[#006b2c]"></span>}
                                      </span>
                                      <strong className="text-[#131b2e]">No, defer till next annual AGM</strong>
                                    </span>
                                    <span className="font-bold text-[#6e7b6c]">{noPct}% ({pollVotes.no} votes)</span>
                                  </div>
                                </button>
                              </div>
                            )}

                            {/* Classified Media Box & Chat Button */}
                            {(post.type === 'CLASSIFIED' || post.category === 'MARKETPLACE') && (
                              <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                                {post.imageUrl && (
                                  <img
                                    alt={post.title}
                                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                                    src={post.imageUrl}
                                  />
                                )}
                                <div className="flex-1 flex flex-col">
                                  <span className="text-xs font-bold text-[#131b2e]">{post.title}</span>
                                  {post.price && <span className="text-sm font-bold text-[#006b2c]">{post.price}</span>}
                                  <span className="text-[10px] text-[#6e7b6c]">Pickup / Inspection at {post.unit}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => openSellerChat({
                                    name: post.author,
                                    unit: post.unit,
                                    role: `Seller • ${post.title}`,
                                    avatarBg: 'bg-[#006591]',
                                    avatarText: post.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
                                    initialMessage: `Hi Arjun! Yes, ${post.title} is available for inspection at ${post.unit}. When would you like to drop by?`
                                  })}
                                  className="px-3 py-1.5 bg-[#006591] hover:bg-[#005174] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs shrink-0"
                                >
                                  <span className="material-symbols-outlined text-sm">chat</span>
                                  <span>Chat with Seller</span>
                                </button>
                              </div>
                            )}

                            {/* Group Service & Staff Offerings Callout Box */}
                            {(post.type === 'GROUP_SERVICE' || post.category === 'GROUP_SERVICE' || post.category === 'SOLO_STAFF') && (
                              <div className="mt-3 flex items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
                                <div className="flex-1 flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
                                      {post.category === 'SOLO_STAFF' ? 'Verified Staff' : 'Group Service Drive'}
                                    </span>
                                    {post.price && <span className="text-sm font-black text-[#006b2c]">{post.price}</span>}
                                  </div>
                                  <span className="text-[11px] text-amber-950 mt-1 font-medium">Provider / Staff: {post.author} • {post.unit}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => openSellerChat({
                                    name: post.author,
                                    unit: post.unit,
                                    role: `Service Provider • ${post.title}`,
                                    avatarBg: 'bg-amber-600',
                                    avatarText: (post.author || 'SP').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
                                    initialMessage: `Hello! I would like to inquire about "${post.title}". Are slots currently available?`
                                  })}
                                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs shrink-0"
                                >
                                  <span className="material-symbols-outlined text-sm">chat</span>
                                  <span>Chat with Provider</span>
                                </button>
                              </div>
                            )}

                            {/* Attached Files & Uploaded Documents/Images */}
                            {post.attachments && post.attachments.length > 0 && (
                              <div className="mt-3 flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs text-[#006b2c]">attach_file</span>
                                  <span>Attached Files ({post.attachments.length})</span>
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {post.attachments.map((file, idx) => (
                                    <a
                                      key={idx}
                                      href={file.dataUrl || '#'}
                                      download={file.name}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-lg border border-slate-300 transition shadow-2xs group"
                                    >
                                      <span className="material-symbols-outlined text-sm text-[#006b2c]">
                                        {file.isImage ? 'image' : file.name?.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                      </span>
                                      <span className="truncate max-w-[150px]">{file.name}</span>
                                      <span className="text-[10px] text-slate-400">({file.size})</span>
                                      <span className="material-symbols-outlined text-xs text-slate-400 group-hover:text-[#006b2c]">download</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Post Action Footer: Likes and Comments Trigger */}
                          <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-[#3e4a3d] text-xs">
                            <button
                              type="button"
                              onClick={() => handleTogglePostLike(post.id)}
                              className={`flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100 ${
                                isLiked ? 'text-[#006b2c] font-bold bg-emerald-50' : 'hover:text-[#006b2c]'
                              }`}
                            >
                              <span className="material-symbols-outlined text-lg">{isLiked ? 'thumb_up' : 'thumb_up'}</span>
                              <span>{post.likes || 0} Likes</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleComments(post.id)}
                              className="flex items-center gap-1.5 hover:text-[#006b2c] cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100 font-semibold text-[#006b2c]"
                            >
                              <span className="material-symbols-outlined text-base">comment</span>
                              <span>{commentCount} Comment{commentCount === 1 ? '' : 's'}</span>
                              <span className="material-symbols-outlined text-sm">
                                {areCommentsOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                              </span>
                            </button>
                          </div>

                          {/* Dynamic Comments Thread Section */}
                          {areCommentsOpen && (
                            <div className="mt-3 pt-3 border-t border-dashed border-[#eaedff] bg-slate-50/70 p-3 rounded-xl">
                              <div className="space-y-2.5 mb-3">
                                {commentCount === 0 ? (
                                  <p className="text-[11px] text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                                ) : (
                                  post.comments.map(c => (
                                    <div key={c.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                                      <div className="flex items-start gap-2.5">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 text-white ${
                                          c.role === 'COMMUNITY_ADMIN' || c.role === 'ADMIN' ? 'bg-[#006b2c]' :
                                          c.role === 'SERVICE_PROVIDER' ? 'bg-amber-600' :
                                          c.role === 'SECURITY_TEAM' ? 'bg-purple-700' : 'bg-[#006591]'
                                        }`}>
                                          {(c.author || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between mb-0.5">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <span className="font-bold text-[#131b2e]">{c.author}</span>
                                              {c.unit && <span className="text-[10px] text-gray-500">({c.unit})</span>}
                                            </div>
                                            <span className="text-[10px] text-gray-400">{c.timestamp || 'Recent'}</span>
                                          </div>
                                          <p className="text-gray-700 text-xs mt-0.5 leading-relaxed">{c.text}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>

                              {/* Add Comment Input Form */}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleAddComment(post.id);
                                }}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="text"
                                  value={commentInputs[post.id] || ''}
                                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                  placeholder={`Comment as Arjun Kumar (Flat A-1204)...`}
                                  className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#006b2c] text-[#131b2e]"
                                />
                                <button
                                  type="submit"
                                  disabled={!(commentInputs[post.id] || '').trim()}
                                  className="px-3 py-1.5 bg-[#006b2c] hover:bg-[#00873a] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                >
                                  <span>Send</span>
                                  <span className="material-symbols-outlined text-sm">send</span>
                                </button>
                              </form>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Feed Right Rail (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  {/* Quick Action: Chat with Resident Helpdesk Cell */}
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-emerald-300 text-2xl">forum</span>
                      <h3 className="text-sm font-bold">Resident Support Desk</h3>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      Have a query about society regulations, move-in permissions, or estate upkeep? Chat directly with the estate manager.
                    </p>
                    <button
                      type="button"
                      onClick={() => openSellerChat({
                        name: 'Estate Management Desk',
                        unit: 'Tower A Admin Cell',
                        role: 'Estate Manager (Vikram Mehta)',
                        avatarBg: 'bg-emerald-600',
                        avatarText: 'ED',
                        initialMessage: 'Hello Arjun! How can the Oakridge Estate Desk assist Flat A-1204 today?'
                      })}
                      className="mt-3 w-full py-2 bg-white text-[#006b2c] rounded-xl text-xs font-bold hover:bg-emerald-50 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      <span>Chat with Resident Helpdesk Cell</span>
                    </button>
                  </div>

                  <div className="rounded-2xl bg-white p-5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                    <h3 className="text-sm font-bold text-[#131b2e] mb-2">Community Guidelines</h3>
                    <ul className="text-xs text-[#3e4a3d] flex flex-col gap-1.5 list-disc pl-4">
                      <li>Keep classifieds verified to apartment owners &amp; tenants.</li>
                      <li>Commercial promotion strictly restricted to Monday threads.</li>
                      <li>Observe silent hours in common corridors after 10 PM.</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-[#f2f3ff] p-5 border border-[#eaedff]">
                    <span className="text-[10px] uppercase font-bold text-[#6e7b6c] block">
                      Trending Society Topics
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 rounded-lg bg-white text-[#006b2c] text-xs font-semibold shadow-xs">
                        #EVChargingStation
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-white text-[#006591] text-xs font-semibold shadow-xs">
                        #DiwaliFest2025
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-white text-[#825100] text-xs font-semibold shadow-xs">
                        #CarpoolHitecCity
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
               TAB 6: SOCIETY DUES & BILLING
              ======================================================== */}
          {activeTab === 'society-dues' && (
            <div className="flex flex-col gap-6">
              {/* Summary Top Card */}
              <div className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-[#006b2c]/20">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6e7b6c] font-bold block">
                    Maintenance Account • Flat A-1204
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <h1 className="text-2xl font-bold text-[#131b2e]">₹0.00 Outstanding</h1>
                    <span className="px-3 py-1 rounded-full bg-[#7ffc97] text-[#002109] text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span> All Cleared
                    </span>
                  </div>
                  <p className="text-xs text-[#3e4a3d] mt-1">
                    Last payment of <strong>₹4,250.00</strong> was processed on Oct 01, 2025 via AutoPay.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Primary Pay Advance Dues Button */}
                  <button
                    type="button"
                    onClick={() => openPaymentWithMethod('upi')}
                    className="px-4 py-2.5 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">payments</span>
                    <span>Make Payment / Pay Advance</span>
                  </button>

                  {/* UPI AutoPay Toggle Switch */}
                  <div className="flex items-center gap-3 bg-[#f2f3ff] p-3 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">UPI AutoPay</span>
                      <span className="text-[10px] text-[#6e7b6c]">Auto-debits on 1st</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoPayEnabled}
                        onChange={toggleAutoPay}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006b2c]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Methods Section (4 Options: UPI, Bank Transfer, Card, Cash) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">Choose Payment Option</h2>
                    <p className="text-xs text-[#6e7b6c]">Pay monthly maintenance, advance sinking fund, or club corpus</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. UPI Option (QR Code) */}
                  <div className="rounded-2xl bg-white p-5 border border-emerald-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Instant • 0% Fee
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#131b2e]">UPI QR &amp; Apps</h3>
                      <p className="text-xs text-[#3e4a3d] mt-1">
                        Scan interactive dynamic QR code via Google Pay, PhonePe, Paytm, or BHIM.
                      </p>
                      <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 text-[11px] font-mono text-emerald-950 truncate">
                        aparnabhooja.society@hdfcbank
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPaymentWithMethod('upi')}
                      className="mt-4 w-full py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">qr_code_2</span>
                      <span>Scan QR &amp; Pay via UPI</span>
                    </button>
                  </div>

                  {/* 2. Bank Transfer Option (NEFT/RTGS) */}
                  <div className="rounded-2xl bg-white p-5 border border-blue-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-xl">account_balance</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          Direct Transfer
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#131b2e]">Bank Account (NEFT/RTGS)</h3>
                      <p className="text-xs text-[#3e4a3d] mt-1">
                        HDFC Bank Current A/C with IFSC code. Submit UTR to receive instant tax challan.
                      </p>
                      <div className="mt-2.5 p-2 rounded-lg bg-blue-50 text-[11px] font-mono text-blue-950 truncate">
                        A/C: 50200084920194 • HDFC0001234
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPaymentWithMethod('bank')}
                      className="mt-4 w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">info</span>
                      <span>View Bank Details &amp; Pay</span>
                    </button>
                  </div>

                  {/* 3. Card Option */}
                  <div className="rounded-2xl bg-white p-5 border border-purple-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-xl">credit_card</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                          Cards &amp; NetBanking
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#131b2e]">Credit &amp; Debit Card</h3>
                      <p className="text-xs text-[#3e4a3d] mt-1">
                        Visa, Mastercard, RuPay cards accepted via secure 256-bit payment gateway.
                      </p>
                      <div className="mt-2.5 p-2 rounded-lg bg-purple-50 text-[11px] text-purple-950">
                        Zero surcharge on RuPay &amp; Debit
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPaymentWithMethod('card')}
                      className="mt-4 w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">payment</span>
                      <span>Pay by Card</span>
                    </button>
                  </div>

                  {/* 4. Cash Option (Doorstep Guard or Facility Center) */}
                  <div className="rounded-2xl bg-white p-5 border border-amber-300 shadow-xs flex flex-col justify-between hover:shadow-md transition bg-amber-50/20">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-xl">local_atm</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                          Doorstep / Counter
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#131b2e]">Cash Payment</h3>
                      <p className="text-xs text-[#3e4a3d] mt-1">
                        • <strong>Guard Doorstep:</strong> Security collects at Flat A-1204 with OTP.<br />
                        • <strong>Center Deposit:</strong> Deposit at Estate Office Counter (Room #102).
                      </p>
                      <div className="mt-2.5 p-2 rounded-lg bg-amber-100/70 text-[11px] font-medium text-amber-950">
                        Flat A-1204 Handover OTP
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPaymentWithMethod('cash')}
                      className="mt-4 w-full py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">shield_person</span>
                      <span>Doorstep Guard / Office Cash</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Cash Requests Tracker (if any requested) */}
              {cashCollections && cashCollections.length > 0 && (
                <div className="rounded-2xl bg-white p-5 border border-amber-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-700">receipt</span>
                      <h3 className="text-sm font-bold text-[#131b2e]">Recent Cash Collection &amp; Deposit Activity</h3>
                    </div>
                    <span className="text-xs text-[#6e7b6c]">Verified by Security Gate Console</span>
                  </div>

                  <div className="space-y-2">
                    {cashCollections.map((col) => (
                      <div key={col.id} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-[#131b2e]">{col.id}</strong>
                            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                              {col.status}
                            </span>
                            <span className="text-[#6e7b6c]">• {col.method === 'SECURITY_DOORSTEP' ? 'Guard Doorstep Pickup' : 'Estate Office Counter Deposit'}</span>
                          </div>
                          <p className="text-gray-700 mt-1">
                            Flat: <strong>{col.unit || 'Flat A-1204'}</strong> • Amount: <strong>₹{col.amount}</strong> • Slot: {col.slot}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {col.verificationCode && (
                            <div className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-center shadow-2xs">
                              <span className="text-[10px] text-gray-500 block uppercase font-bold">Verification OTP</span>
                              <span className="font-mono text-sm font-bold text-amber-900">#{col.verificationCode}</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => showToast(`Deposit voucher #${col.id} is registered with society accounts!`, 'info')}
                            className="px-3 py-1.5 bg-amber-800 text-white rounded-lg text-xs font-bold hover:bg-amber-900 transition"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ledger Breakdown Table */}
              <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-[#131b2e]">October 2025 Maintenance Ledger Breakdown</h2>
                    <span className="text-xs text-[#3e4a3d]">Computed per super built-up area (1,700 sq.ft @ ₹2.50/sq.ft)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Downloading October 2025 Tax Receipt Slip (PDF)...', 'success')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#006b2c] text-white rounded-xl text-xs font-bold hover:bg-[#00873a] transition-all cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                    <span>Download Receipt Slip</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#eaedff] text-[#6e7b6c] text-[10px] uppercase tracking-wider">
                        <th className="py-2.5">Line Item / Expense Head</th>
                        <th className="py-2.5">Computation Basis</th>
                        <th className="py-2.5">Tax (GST 18%)</th>
                        <th className="py-2.5 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaedff]">
                      <tr>
                        <td className="py-3 font-semibold text-[#131b2e]">Society Common Maintenance &amp; Security</td>
                        <td className="py-3 text-[#3e4a3d]">1,700 sq.ft × ₹1.80</td>
                        <td className="py-3 text-[#3e4a3d]">Included</td>
                        <td className="py-3 text-right font-medium">₹3,060.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold text-[#131b2e]">Clubhouse, Pool &amp; Gym Sinking Fund</td>
                        <td className="py-3 text-[#3e4a3d]">Fixed Flat Contribution</td>
                        <td className="py-3 text-[#3e4a3d]">₹88.20</td>
                        <td className="py-3 text-right font-medium">₹590.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold text-[#131b2e]">DG Back-up &amp; Lift AMC Reserve</td>
                        <td className="py-3 text-[#3e4a3d]">Fixed Flat Reserve</td>
                        <td className="py-3 text-[#3e4a3d]">₹64.80</td>
                        <td className="py-3 text-right font-medium">₹400.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold text-[#131b2e]">Water Consumption &amp; Sewage Treatment</td>
                        <td className="py-3 text-[#3e4a3d]">Sub-meter 14.2 KL</td>
                        <td className="py-3 text-[#3e4a3d]">Exempt</td>
                        <td className="py-3 text-right font-medium">₹200.00</td>
                      </tr>
                      <tr className="bg-[#f2f3ff]/60 font-bold">
                        <td className="py-3.5 pl-3 text-[#131b2e]">Total October Bill Paid</td>
                        <td className="py-3.5 text-[#6e7b6c] font-normal">Transaction Ref: #TXN981249</td>
                        <td className="py-3.5 text-[#6e7b6c] font-normal">Paid via HDFC UPI</td>
                        <td className="py-3.5 pr-3 text-right text-[#006b2c] text-base font-bold">₹4,250.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
               TAB 7: AMENITIES
              ======================================================== */}
          {activeTab === 'amenities' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)] border border-[#eaedff]">
                <div>
                  <h1 className="text-xl font-bold text-[#131b2e]">Clubhouse &amp; Facility Amenities</h1>
                  <p className="text-xs text-[#3e4a3d] mt-0.5">
                    Instant booking with digital QR passes for access gate turnstiles
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#7ffc97]/50 text-[#002109] text-xs font-bold">
                    2 Slots Allowed / Week
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Amenity 1: Badminton Court 1 & 2 */}
                <div className="rounded-2xl bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col justify-between border border-[#eaedff]">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#ffddb8]/50 text-[#825100] flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">sports_tennis</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/50 text-[#002109] text-[10px] font-bold">
                        Wooden Flooring
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#131b2e] mt-3">Badminton Court 1 &amp; 2</h3>
                    <p className="text-xs text-[#3e4a3d] mt-1">
                      Indoor air-conditioned synthetic wooden court. Non-marking shoes compulsory.
                    </p>

                    <div className="mt-4">
                      <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1.5">
                        Select Available Slot
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Court 1 • 06:00 PM', 'Court 2 • 07:00 PM', 'Court 1 • 08:00 PM', 'Court 2 • 09:00 PM'].map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => selectSlot('badminton', slot)}
                            className={`px-2 py-1.5 rounded-lg text-[11px] text-center font-medium transition cursor-pointer border ${
                              selectedSlots.badminton === slot
                                ? 'border-[#006b2c] bg-[#7ffc97]/30 text-[#131b2e] font-bold'
                                : 'border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => showToast(`Badminton (${selectedSlots.badminton}) reserved! QR pass issued for turnstile.`, 'success')}
                      className="w-full py-2 bg-[#006b2c] text-white rounded-xl text-xs font-bold hover:bg-[#00873a] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">bookmark_added</span>
                      <span>Confirm Reservation</span>
                    </button>
                  </div>
                </div>

                {/* Amenity 2: Swimming Pool */}
                <div className="rounded-2xl bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col justify-between border border-[#eaedff]">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#c9e6ff]/50 text-[#006591] flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">pool</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#c9e6ff] text-[#004c6e] text-[10px] font-bold">
                        Half Olympic
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#131b2e] mt-3">Swimming Pool &amp; Kids Jacuzzi</h3>
                    <p className="text-xs text-[#3e4a3d] mt-1">
                      Temperature-controlled lap pool with certified lifeguard on deck. Swim caps required.
                    </p>

                    <div className="mt-4">
                      <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1.5">
                        Select Available Slot
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Morning 06:30 AM', 'Morning 07:30 AM', 'Evening 05:30 PM', 'Evening 06:30 PM'].map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => selectSlot('pool', slot)}
                            className={`px-2 py-1.5 rounded-lg text-[11px] text-center font-medium transition cursor-pointer border ${
                              selectedSlots.pool === slot
                                ? 'border-[#006591] bg-[#c9e6ff]/30 text-[#131b2e] font-bold'
                                : 'border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => showToast(`Swimming Pool pass (${selectedSlots.pool}) generated for Arjun Kumar!`, 'success')}
                      className="w-full py-2 bg-[#006591] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">bookmark_added</span>
                      <span>Confirm Reservation</span>
                    </button>
                  </div>
                </div>

                {/* Amenity 3: Grand Banquet Hall */}
                <div className="rounded-2xl bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col justify-between border border-[#eaedff]">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#ffddb8]/40 text-[#825100] flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">celebration</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold">
                        250 Capacity
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#131b2e] mt-3">Grand Community Banquet Hall</h3>
                    <p className="text-xs text-[#3e4a3d] mt-1">
                      Equipped with catering pantry, dining tables, central AC &amp; stage audio.
                    </p>

                    <div className="mt-4">
                      <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1.5">
                        Select Day / Session
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Saturday Lunch', 'Saturday Dinner', 'Sunday Lunch', 'Sunday Dinner'].map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => selectSlot('banquet', slot)}
                            className={`px-2 py-1.5 rounded-lg text-[11px] text-center font-medium transition cursor-pointer border ${
                              selectedSlots.banquet === slot
                                ? 'border-[#825100] bg-[#ffddb8]/30 text-[#131b2e] font-bold'
                                : 'border-[#eaedff] bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => showToast(`Banquet Hall booking inquiry (${selectedSlots.banquet}) registered with Society Estate Manager!`, 'success')}
                      className="w-full py-2 bg-[#825100] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">bookmark_added</span>
                      <span>Request Booking</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Raise Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-[#283044]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl flex flex-col gap-4 border border-[#eaedff]">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <h3 className="text-base font-bold text-[#131b2e]">Raise Flat Issue Ticket</h3>
              <button
                type="button"
                className="p-1 text-[#3e4a3d] hover:text-[#131b2e] rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => setShowTicketModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleNewTicket}>
              <div>
                <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs text-[#131b2e] focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                  required
                >
                  <option>Plumbing (Tap / Leakage / Flush)</option>
                  <option>Electrical (MCB / Fixture / Fan)</option>
                  <option>Carpentry &amp; Doors</option>
                  <option>Civil &amp; Seepage</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">Problem Summary</label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs text-[#131b2e] focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                  placeholder="e.g. Kitchen tap dripping continuously"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#6e7b6c] uppercase font-bold block mb-1">Detailed Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs text-[#131b2e] focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
                  placeholder="Provide extra details for the maintenance engineer..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  rows={3}
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-[#3e4a3d] hover:bg-[#f2f3ff] text-xs font-semibold cursor-pointer"
                  onClick={() => setShowTicketModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] transition-all cursor-pointer shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Community Create Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* 1-on-1 Resident / Seller / Helpdesk Chat Modal */}
      {showChatModal && (
        <ChatMessengerModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          targetUser={chatTarget}
        />
      )}

      {/* Society Dues Payment Modal (UPI QR, Bank Details, Cards, Cash Pickup / Desk Deposit) */}
      {showPaymentModal && (
        <DuesPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          initialMethod={paymentInitialMethod}
          onPaymentSuccess={(receipt) => {
            setCashCollections(serviceApi.getCashCollections());
            showToast(`Official Society Receipt #${receipt.receiptNo} logged successfully!`, 'success');
          }}
        />
      )}

      {/* Detailed Group Pool Configuration & Join Modal */}
      {selectedPoolForJoinModal && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 flex flex-col gap-4 animate-in fade-in duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-[#16A34A] border border-emerald-200">
                  <span className="material-symbols-outlined text-xl">groups</span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Group Demand Pool Configuration</h3>
                  <p className="text-[11px] text-slate-500">{selectedPoolForJoinModal.serviceTitle || selectedPoolForJoinModal.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPoolForJoinModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Dynamic Volume Tier Table */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span>Dynamic Volume Pricing Tiers</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px]">
                  {selectedPoolForJoinModal.currentParticipants || 1} Enrolled
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <div className="text-[10px] text-gray-500 font-semibold">Tier 1 (1-10)</div>
                  <div className="font-extrabold text-slate-900">₹{selectedPoolForJoinModal.regularPrice ? Math.round(selectedPoolForJoinModal.regularPrice * 0.75) : 549}</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-300 shadow-2xs">
                  <div className="text-[10px] text-emerald-700 font-bold">Tier 2 (11-20)</div>
                  <div className="font-extrabold text-[#16A34A]">₹{selectedPoolForJoinModal.regularPrice ? Math.round(selectedPoolForJoinModal.regularPrice * 0.65) : 489}</div>
                </div>
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-2xs">
                  <div className="text-[10px] text-emerald-100 font-bold">Tier 3 (25+)</div>
                  <div className="font-black text-white">₹{selectedPoolForJoinModal.regularPrice ? Math.round(selectedPoolForJoinModal.regularPrice * 0.55) : 429}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmJoinPoolDetailed} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">
                    Number of Units / ACs *
                  </label>
                  <select
                    value={joinUnitsCount}
                    onChange={(e) => setJoinUnitsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                  >
                    <option value={1}>1 Unit (Standard)</option>
                    <option value={2}>2 Units (Multi-room Pack)</option>
                    <option value={3}>3 Units (Whole Flat Pack)</option>
                    <option value={4}>4 Units (Duplex Pack)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">
                    Preferred Service Slot *
                  </label>
                  <select
                    value={joinSlotInput}
                    onChange={(e) => setJoinSlotInput(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                  >
                    <option>Saturday Morning (09:00 AM - 12:00 PM)</option>
                    <option>Saturday Afternoon (01:00 PM - 04:00 PM)</option>
                    <option>Sunday Morning (10:00 AM - 01:00 PM)</option>
                    <option>Sunday Evening (04:00 PM - 07:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">
                  Target Price Bid <span className="text-gray-400 font-normal">(Optional counter-bid for contractor)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={joinTargetBidInput}
                    onChange={(e) => setJoinTargetBidInput(e.target.value)}
                    placeholder={`Current price: ₹${selectedPoolForJoinModal.discountedPrice || 549} (e.g. 450)`}
                    className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">
                  Special Notes / Access Instructions
                </label>
                <input
                  type="text"
                  value={joinNotesInput}
                  onChange={(e) => setJoinNotesInput(e.target.value)}
                  placeholder="e.g. Bring extra ladder for balcony unit"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedPoolForJoinModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Confirm &amp; Join Group Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classified Price Offer & Negotiation Modal */}
      {selectedPostForOffer && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="material-symbols-outlined text-xl">sell</span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Make Price Offer / Buy Item</h3>
                  <p className="text-[11px] text-slate-500">{selectedPostForOffer.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPostForOffer(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-amber-800 uppercase font-bold block">Seller Listed Price</span>
                <span className="text-base font-black text-amber-950">{selectedPostForOffer.price || '₹5,000'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-800 uppercase font-bold block">Seller Profile</span>
                <span className="font-bold text-slate-900">{selectedPostForOffer.author || 'Priya Verma'} ({selectedPostForOffer.unit || 'Flat C-502'})</span>
              </div>
            </div>

            <form onSubmit={handleConfirmClassifiedOffer} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">
                  Your Price Offer (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={offerPriceInput}
                  onChange={(e) => setOfferPriceInput(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-extrabold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">
                  Message for Seller *
                </label>
                <textarea
                  required
                  rows={3}
                  value={offerNoteInput}
                  onChange={(e) => setOfferNoteInput(e.target.value)}
                  placeholder="e.g. Interested in buying this cycle for my daughter. Can inspect and pick it up today."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedPostForOffer(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Submit Price Offer to Seller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Staff Requirement Modal */}
      {showCreateStaffModal && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-[#16A34A] border border-emerald-200">
                  <span className="material-symbols-outlined text-xl">person_add</span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Post Staff / Helper Requirement</h3>
                  <p className="text-[11px] text-slate-500">Flat {currentUser?.unit || 'Flat A-1204'} • Community Staff Network</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateStaffModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmCreateStaffRequest} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Staff Category *</label>
                  <select
                    value={newStaffType}
                    onChange={(e) => setNewStaffType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                  >
                    <option value="Cook">Home Cook / Chef</option>
                    <option value="Maid">Housekeeping Maid</option>
                    <option value="Driver">Private Chauffeur / Driver</option>
                    <option value="Nanny">Babysitter / Nanny</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Monthly Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newStaffBudget}
                    onChange={(e) => setNewStaffBudget(e.target.value)}
                    placeholder="e.g. 4200"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Requirement Title *</label>
                <input
                  type="text"
                  required
                  value={newStaffTitle}
                  onChange={(e) => setNewStaffTitle(e.target.value)}
                  placeholder="e.g. Morning South Indian Cook for 3-member family"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Preferred Shift Slot *</label>
                <input
                  type="text"
                  required
                  value={newStaffTimeSlot}
                  onChange={(e) => setNewStaffTimeSlot(e.target.value)}
                  placeholder="e.g. 07:30 AM - 09:00 AM"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateStaffModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Broadcast Staff Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Family Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#006b2c]">
                  <span className="material-symbols-outlined text-xl">person_add</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Household / Family Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddFamilyMember} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Relationship</label>
                  <select
                    value={newMemberForm.role}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c]"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent / Elderly</option>
                    <option value="Child">Son / Daughter</option>
                    <option value="Tenant">Co-Tenant</option>
                    <option value="Flatmate">Flatmate</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Access Level</label>
                  <select
                    value={newMemberForm.access}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, access: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c]"
                  >
                    <option value="App Linked">App Linked (Full)</option>
                    <option value="Biometric Only">Gate Biometric Only</option>
                    <option value="Emergency Pass">Emergency Pass</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={newMemberForm.phone}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Save &amp; Generate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100 flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-[#006591]">
                  <span className="material-symbols-outlined text-xl">directions_car</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Register Vehicle RFID Pass</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVehicleModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Registration Plate No. *</label>
                <input
                  type="text"
                  required
                  value={newVehicleForm.plate}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, plate: e.target.value })}
                  placeholder="e.g. TS 09 EA 9988"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-mono focus:bg-white focus:ring-2 focus:ring-[#006591]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Vehicle Type</label>
                  <select
                    value={newVehicleForm.type}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006591]"
                  >
                    <option value="4 Wheeler (Car)">4 Wheeler (Car/SUV)</option>
                    <option value="2 Wheeler (EV)">2 Wheeler (EV Scooter)</option>
                    <option value="2 Wheeler (Bike)">2 Wheeler (Motorcycle)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Designated Slot No.</label>
                  <input
                    type="text"
                    value={newVehicleForm.slot}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, slot: e.target.value })}
                    placeholder="e.g. Slot #B2-45"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006591]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#006591] hover:bg-[#004c6e] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Activate FASTag RFID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
