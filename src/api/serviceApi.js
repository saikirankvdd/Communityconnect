// Service & Community Operations API (Supports Group Demand & Centralized Provider Network)
import { 
  SERVICE_CATEGORIES, 
  INITIAL_GROUP_DEMAND_POOLS, 
  INITIAL_SERVICE_REQUESTS, 
  INITIAL_VISITOR_PASSES,
  INITIAL_COMMUNITY_POSTS 
} from '../data/initialData';

const POOLS_STORAGE_KEY = 'communityconnect_group_pools';
const REQUESTS_STORAGE_KEY = 'communityconnect_service_requests';
const VISITORS_STORAGE_KEY = 'communityconnect_visitor_passes';
const POSTS_STORAGE_KEY = 'communityconnect_community_posts';

function getStoredPools() {
  const raw = localStorage.getItem(POOLS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(POOLS_STORAGE_KEY, JSON.stringify(INITIAL_GROUP_DEMAND_POOLS));
    return INITIAL_GROUP_DEMAND_POOLS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_GROUP_DEMAND_POOLS;
  }
}

function getStoredRequests() {
  const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(INITIAL_SERVICE_REQUESTS));
    return INITIAL_SERVICE_REQUESTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_SERVICE_REQUESTS;
  }
}

function getStoredVisitors() {
  const raw = localStorage.getItem(VISITORS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(INITIAL_VISITOR_PASSES));
    return INITIAL_VISITOR_PASSES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_VISITOR_PASSES;
  }
}

function getStoredPosts() {
  const raw = localStorage.getItem(POSTS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_POSTS));
    return INITIAL_COMMUNITY_POSTS;
  }
  try {
    const list = JSON.parse(raw);
    let changed = false;
    list.forEach((p) => {
      if (!p.comments || !Array.isArray(p.comments) || p.comments.length === 0) {
        const initial = INITIAL_COMMUNITY_POSTS.find((ip) => ip.id === p.id);
        if (initial && initial.comments) {
          p.comments = [...initial.comments];
          p.commentsCount = p.comments.length;
          changed = true;
        } else if (!p.comments) {
          p.comments = [];
          changed = true;
        }
      }
      if (p.pinned !== undefined && p.isPinned === undefined) {
        p.isPinned = p.pinned;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(list));
    }
    return list;
  } catch {
    return INITIAL_COMMUNITY_POSTS;
  }
}

export const serviceApi = {
  // Categories
  getCategories() {
    return SERVICE_CATEGORIES;
  },

  // Group Demand Pools
  getPools(communityId = null) {
    const list = getStoredPools();
    if (communityId) {
      return list.filter((p) => p.communityId === communityId);
    }
    return list;
  },

  joinPool(poolId, residentName, unit, unitsCount = 1) {
    const list = getStoredPools();
    const pool = list.find((p) => p.id === poolId);
    if (!pool) throw new Error('Pool not found');

    const alreadyJoined = pool.participants.find((p) => p.residentName === residentName && p.unit === unit);
    if (!alreadyJoined) {
      pool.participants.unshift({
        residentName,
        unit,
        unitsBooked: unitsCount,
        joinedAt: new Date().toISOString().split('T')[0]
      });
      pool.currentParticipants += unitsCount;
    }

    localStorage.setItem(POOLS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_pools_updated', { detail: pool }));
    } catch {}
    return pool;
  },

  createPool(poolData) {
    const list = getStoredPools();
    const newPool = {
      id: `pool-${Date.now()}`,
      communityId: poolData.communityId,
      serviceTitle: poolData.serviceTitle,
      category: poolData.category,
      regularPrice: Number(poolData.regularPrice) || 799,
      discountedPrice: Number(poolData.discountedPrice) || 549,
      savingsPercent: Math.round(((poolData.regularPrice - poolData.discountedPrice) / poolData.regularPrice) * 100),
      minThreshold: Number(poolData.minThreshold) || 15,
      currentParticipants: 1,
      deadline: poolData.deadline || '2025-10-15',
      status: 'AGGREGATING',
      creator: { residentName: poolData.residentName, unit: poolData.unit },
      participants: [
        { residentName: poolData.residentName, unit: poolData.unit, unitsBooked: 1, joinedAt: new Date().toISOString().split('T')[0] }
      ]
    };
    list.unshift(newPool);
    localStorage.setItem(POOLS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_pools_updated', { detail: newPool }));
    } catch {}
    return newPool;
  },

  submitPoolBid(poolId, bidData) {
    const list = getStoredPools();
    const pool = list.find((p) => p.id === poolId);
    if (!pool) throw new Error('Pool not found');

    if (!pool.bids) pool.bids = [];
    const newBid = {
      id: `BID-${Date.now()}`,
      providerId: bidData.providerId || 'usr-prov-cool',
      providerName: bidData.providerName || 'CoolingPro AC Solutions',
      rating: bidData.rating || 4.88,
      bidPricePerUnit: Number(bidData.bidPricePerUnit) || pool.discountedPrice,
      grossRevenue: Number(bidData.grossRevenue) || (pool.currentParticipants * pool.discountedPrice),
      netPayout: Number(bidData.netPayout) || Math.round(pool.currentParticipants * pool.discountedPrice * 0.95),
      scheduledDriveDate: bidData.scheduledDriveDate || 'Saturday Drive Slot',
      warranty: bidData.warranty || '30-Day Service Assurance',
      submittedAt: new Date().toISOString()
    };

    pool.bids.unshift(newBid);
    pool.discountedPrice = Number(bidData.bidPricePerUnit);
    pool.savingsPercent = Math.round(((pool.regularPrice - pool.discountedPrice) / pool.regularPrice) * 100);
    pool.activeContractor = {
      name: newBid.providerName,
      bidPrice: newBid.bidPricePerUnit
    };

    localStorage.setItem(POOLS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_pools_updated', { detail: pool }));
    } catch {}
    return pool;
  },

  // Service Requests
  getRequests(communityId = null) {
    const list = getStoredRequests();
    if (communityId) {
      return list.filter((r) => r.communityId === communityId);
    }
    return list;
  },

  createRequest(requestData) {
    const list = getStoredRequests();
    const baseEstimated = Number(requestData.estimatedBudget) || Number(requestData.estimatedPrice) || 599;

    const defaultQuotes = requestData.quotations && requestData.quotations.length > 0
      ? requestData.quotations
      : [
          {
            id: `QUOTE-${Date.now()}-1`,
            providerId: 'prov-01',
            providerName: 'Apex Community Verified Technicians',
            rating: 4.92,
            quoteAmount: baseEstimated,
            estimatedArrival: `${requestData.preferredDate || 'Tomorrow'} (${requestData.preferredTime || '10:00 AM'})`,
            warranty: '30-Day Workmanship Guarantee',
            status: 'PENDING'
          },
          {
            id: `QUOTE-${Date.now()}-2`,
            providerId: 'prov-02',
            providerName: 'UrbanCraft Facility Experts',
            rating: 4.88,
            quoteAmount: Math.round(baseEstimated * 1.08),
            estimatedArrival: `${requestData.preferredDate || 'Tomorrow'} (Within 1 hr of slot)`,
            warranty: '45-Day Extended Society Warranty',
            status: 'PENDING'
          }
        ];

    const newReq = {
      id: `REQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      communityId: requestData.communityId,
      category: requestData.category,
      title: requestData.title || `${requestData.category} Request`,
      description: requestData.description,
      preferredDate: requestData.preferredDate,
      preferredTime: requestData.preferredTime,
      urgency: requestData.urgency || 'NORMAL',
      isGroupRequest: !!requestData.isGroupRequest,
      isCustom: !!requestData.isCustom,
      currentStep: 3, // Immediately advances to step 3 so residents can review vendor bids and accept
      status: 'QUOTES_RECEIVED',
      residentName: requestData.residentName,
      unit: requestData.unit,
      phone: requestData.phone,
      estimatedPrice: baseEstimated,
      fulfillmentType: requestData.fulfillmentType || 'groupable',
      quotations: defaultQuotes
    };

    list.unshift(newReq);
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_requests_updated', { detail: newReq }));
    } catch {}

    // If marked as group request, create a pool automatically
    if (requestData.isGroupRequest) {
      this.createPool({
        communityId: requestData.communityId,
        serviceTitle: `Community Group: ${requestData.title}`,
        category: requestData.category,
        regularPrice: Math.round(baseEstimated * 1.25),
        discountedPrice: baseEstimated,
        minThreshold: 8,
        residentName: requestData.residentName,
        unit: requestData.unit
      });
    }

    return newReq;
  },

  // Advance request lifecycle step (1 to 5)
  advanceRequestStep(requestId, step, providerData = null) {
    const list = getStoredRequests();
    const req = list.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    req.currentStep = step;
    if (providerData) {
      req.assignedProvider = providerData;
    }
    if (step === 4) req.status = 'DISPATCHED';
    if (step === 5) req.status = 'COMPLETED';

    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_requests_updated', { detail: req }));
    } catch {}
    return req;
  },

  // Service Provider submits quotation
  submitQuotation(requestId, quotation) {
    const list = getStoredRequests();
    const req = list.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const newQuote = {
      id: `QUOTE-${Date.now()}`,
      providerId: quotation.providerId,
      providerName: quotation.providerName,
      rating: quotation.rating || 4.9,
      quoteAmount: Number(quotation.quoteAmount),
      estimatedArrival: quotation.estimatedArrival || 'Tomorrow morning',
      warranty: quotation.warranty || '30 Days Quality Guarantee',
      status: 'PENDING'
    };

    req.quotations = req.quotations || [];
    req.quotations.push(newQuote);
    if (req.currentStep < 3) req.currentStep = 3;
    req.status = 'QUOTES_RECEIVED';

    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_requests_updated', { detail: req }));
    } catch {}
    return req;
  },

  // Visitor Passes & Security Delivery Gate Passes
  getVisitorPasses(communityId = null) {
    const list = getStoredVisitors();
    if (communityId) {
      return list.filter((v) => !v.communityId || v.communityId === communityId);
    }
    return list;
  },

  // Created by Resident for Friends, Relatives, Guests, Cabs, or Other Persons
  createVisitorPass(passData) {
    const list = getStoredVisitors();
    const isWalkIn = passData.entryMode === 'WALK_IN' || passData.isWalkIn === true || !passData.vehicleNumber || passData.vehicleNumber.trim() === '';
    const newPass = {
      id: passData.id || `VIS-${Math.floor(1000 + Math.random() * 9000)}`,
      communityId: passData.communityId || 'comm-bhooja',
      guestName: passData.guestName,
      company: passData.companyName || passData.company || (passData.visitorType === 'CAB' ? 'Uber / Ola Cab' : passData.visitorType === 'DELIVERY' ? 'Delivery Partner' : 'Personal Guest'),
      companyName: passData.companyName || passData.company || (passData.visitorType === 'CAB' ? 'Uber / Ola Cab' : passData.visitorType === 'DELIVERY' ? 'Delivery Partner' : 'Personal Guest'),
      visitorType: passData.visitorType || 'GUEST',
      visitorCategory: passData.visitorCategory || (passData.visitorType === 'CAB' ? 'Cab' : passData.visitorType === 'RELATIVE' ? 'Relative' : passData.visitorType === 'FRIEND' ? 'Friend' : 'Guest Visitor'),
      phone: passData.phone || '+91 98450 00112',
      vehicleNumber: isWalkIn ? 'N/A (Walk-In Visitor)' : (passData.vehicleNumber || 'Vehicle Entry'),
      entryMode: isWalkIn ? 'Walk-In / On Foot' : 'Vehicle Entry',
      isWalkIn: isWalkIn,
      hostUnit: passData.hostUnit || 'Flat A-1204',
      numberOfGuests: passData.numberOfGuests || 1,
      additionalGuests: passData.additionalGuests || [],
      allGuests: passData.allGuests || [],
      validDate: passData.validDate || 'Today',
      validDateISO: passData.validDateISO || new Date().toISOString().split('T')[0],
      validDuration: passData.validDuration || 'Next 4 Hours',
      validStartTime: passData.validStartTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      validEndTime: passData.validEndTime || '',
      customTimeNote: passData.customTimeNote || '',
      issuedBy: passData.issuedBy || 'Resident (Flat A-1204)',
      otpCode: passData.otpCode || Math.floor(1000 + Math.random() * 9000).toString(),
      status: passData.status || 'EXPECTED',
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };

    list.unshift(newPass);
    localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_visitor_updated', { detail: newPass }));
    } catch {}
    return newPass;
  },

  // Created at Security Gate for Delivery Personnel (Zomato, Swiggy, Amazon, Couriers, etc.)
  createDeliveryGatePass(deliveryData) {
    const list = getStoredVisitors();
    const passId = deliveryData.id || `DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const isWalkIn = deliveryData.entryMode === 'WALK_IN' || deliveryData.isWalkIn === true || deliveryData.vehicleNumber === 'N/A (Walk-In Visitor)';
    const company = deliveryData.companyName || deliveryData.company || 'Delivery Service';
    const newPass = {
      id: passId,
      communityId: deliveryData.communityId || 'comm-bhooja',
      guestName: deliveryData.guestName || `${company} (${deliveryData.deliveryPerson || 'Courier'})`,
      company: company,
      companyName: company,
      deliveryPerson: deliveryData.deliveryPerson || 'Agent',
      visitorType: 'DELIVERY',
      visitorCategory: 'Delivery',
      phone: deliveryData.phone || '+91 98000 11223',
      vehicleNumber: isWalkIn ? 'N/A (Walk-In Visitor)' : (deliveryData.vehicleNumber || 'Bike/Scooter'),
      entryMode: isWalkIn ? 'Walk-In / On Foot' : 'Vehicle Entry',
      isWalkIn: isWalkIn,
      packageType: deliveryData.packageType || 'Parcel / Food Delivery',
      hostUnit: deliveryData.hostUnit || 'Flat A-1204',
      validDuration: deliveryData.validDuration || '30 Mins (Express Drop)',
      validStartTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      validEndTime: deliveryData.validEndTime || '',
      customTimeNote: deliveryData.customTimeNote || 'Checked in at Security Gate 1',
      issuedBy: deliveryData.issuedBy || 'Security Gate 1 (Havaldar Ram Singh)',
      otpCode: deliveryData.otpCode || Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'INSIDE_PREMISES',
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };

    list.unshift(newPass);
    localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_visitor_updated', { detail: newPass }));
    } catch {}
    return newPass;
  },

  // Mark visitor or delivery pass as checked out / completed at security gate
  checkoutVisitorPass(passId) {
    const list = getStoredVisitors();
    const pass = list.find((p) => p.id === passId);
    if (pass) {
      pass.status = 'COMPLETED';
      pass.exitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_visitor_updated', { detail: pass }));
      } catch {}
    }
    return pass;
  },

  // Verify visitor OTP at security gate
  verifyVisitorOtp(otpCode) {
    const clean = String(otpCode).trim();
    const list = getStoredVisitors();
    const matched = list.find((p) => String(p.otpCode) === clean);
    if (matched) {
      if (matched.status === 'EXPECTED') {
        matched.status = 'INSIDE_PREMISES';
        matched.entryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(list));
        try {
          window.dispatchEvent(new CustomEvent('communityconnect_visitor_updated', { detail: matched }));
        } catch {}
      }
      return { success: true, pass: matched };
    }
    return { success: false, message: 'Invalid or expired Gate OTP' };
  },

  // Community Feed Posts
  getPosts(communityId = null) {
    const list = getStoredPosts();
    if (communityId) {
      return list.filter((p) => !p.communityId || p.communityId === communityId);
    }
    return list;
  },

  createPost(postData) {
    const list = getStoredPosts();
    const newPost = {
      id: `post-${Date.now()}`,
      communityId: postData.communityId,
      author: postData.author,
      authorRole: postData.authorRole || 'RESIDENT',
      unit: postData.unit || '',
      title: postData.title,
      content: postData.content,
      imageUrl: postData.imageUrl || null,
      type: postData.type || 'DISCUSSION',
      category: postData.category || 'discussion',
      price: postData.price || null,
      attachments: postData.attachments || [],
      timestamp: 'Just now',
      pinned: !!postData.pinned,
      likes: 1,
      commentsCount: 0,
      comments: postData.comments || []
    };

    list.unshift(newPost);
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_posts_updated', { detail: newPost }));
    } catch {}
    return newPost;
  },

  likePost(postId) {
    const list = getStoredPosts();
    const post = list.find((p) => p.id === postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_posts_updated', { detail: post }));
      } catch {}
    }
    return post;
  },

  toggleLikePost(postId, hasLiked) {
    const list = getStoredPosts();
    const post = list.find((p) => p.id === postId);
    if (post) {
      if (hasLiked) {
        post.likes = Math.max(0, (post.likes || 1) - 1);
      } else {
        post.likes = (post.likes || 0) + 1;
      }
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_posts_updated', { detail: post }));
      } catch {}
    }
    return post;
  },

  addCommentToPost(postId, commentData) {
    const list = getStoredPosts();
    const post = list.find((p) => p.id === postId);
    if (post) {
      if (!post.comments) post.comments = [];
      const newComment = {
        id: `c-${Date.now()}`,
        author: commentData.author || 'Resident',
        unit: commentData.unit || 'Flat A-1204',
        text: commentData.text,
        timestamp: 'Just now'
      };
      post.comments.push(newComment);
      post.commentsCount = post.comments.length;
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_posts_updated', { detail: post }));
      } catch {}
      return { post, newComment };
    }
    return null;
  },

  deletePost(postId, reason = 'Violates community guidelines') {
    const list = getStoredPosts();
    const idx = list.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      const deleted = list.splice(idx, 1)[0];
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_posts_updated', { detail: { action: 'deleted', id: postId, reason } }));
      } catch {}
      return deleted;
    }
    return null;
  },

  pinPost(postId, isPinned = null) {
    const list = getStoredPosts();
    const post = list.find((p) => p.id === postId);
    if (post) {
      const nextState = isPinned !== null ? isPinned : !(post.isPinned || post.pinned);
      post.pinned = nextState;
      post.isPinned = nextState;
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_posts_updated', { detail: post }));
      } catch {}
    }
    return post;
  },

  revokeVisitorPass(passId, reason = 'Security flag by Estate Administration') {
    const list = getStoredVisitors();
    const pass = list.find((p) => p.id === passId);
    if (pass) {
      pass.status = 'REVOKED';
      pass.revocationReason = reason;
      pass.revokedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_visitor_updated', { detail: pass }));
      } catch {}
    }
    return pass;
  },

  flagVisitorPass(passId, alertReason) {
    const list = getStoredVisitors();
    const pass = list.find((p) => p.id === passId);
    if (pass) {
      pass.isFlagged = true;
      pass.flagReason = alertReason;
      localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_visitor_updated', { detail: pass }));
      } catch {}
    }
    return pass;
  },

  // Direct Security Directives & Field Reports (Board Console <-> Security Gate)
  getSecurityDirectives() {
    const raw = localStorage.getItem('communityconnect_security_directives');
    if (!raw) {
      const initial = [
        {
          id: 'DIR-401',
          kycId: 'kyc-2',
          targetUnit: 'Suite B-102',
          title: 'Physical Flat Occupancy & Lease Check',
          instructions: 'Conduct spot check at Suite B-102. Confirm tenant Arjun Kumar is residing as per registered lease. Verify no unauthorized subleasing or hostel usage. Check physical ID original.',
          priority: 'HIGH',
          status: 'REPORT_SUBMITTED',
          assignedGuard: 'Havaldar Ram Singh (Gate 1 Supervisor)',
          createdAt: 'Today, 09:30 AM',
          fieldReport: {
            officer: 'Havaldar Ram Singh (Badge #SEC-409)',
            timestamp: 'Today, 11:15 AM',
            summary: 'Inspected premises with Tower B marshal. Tenant Arjun Kumar present with original Aadhaar & notarized lease agreement. Verified sole family occupancy; no subletting or commercial activity observed. Flat in compliant order.',
            clearanceStatus: 'CLEARED',
            notes: 'Resident cooperated fully. Electric meter and gas piped connections inspected.'
          }
        },
        {
          id: 'DIR-402',
          kycId: 'kyc-1',
          targetUnit: 'Flat A-1204',
          title: 'Parking Slot Stencil & Smart FASTag Affixing',
          instructions: 'Check designated basement bay B1-44 for White Honda City (TS 09 AB 1234). Affix RFID gate transponder and register in barrier automation system.',
          priority: 'NORMAL',
          status: 'PENDING_INSPECTION',
          assignedGuard: 'Patrol Officer Vikram',
          createdAt: 'Today, 10:00 AM',
          fieldReport: null
        }
      ];
      localStorage.setItem('communityconnect_security_directives', JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  createSecurityDirective(directive) {
    const raw = localStorage.getItem('communityconnect_security_directives');
    const list = raw ? JSON.parse(raw) : [];
    const newDirective = {
      id: `DIR-${Math.floor(100 + Math.random() * 900)}`,
      kycId: directive.kycId || null,
      targetUnit: directive.targetUnit || 'Community Gate',
      title: directive.title || 'Security Field Inspection Directive',
      instructions: directive.instructions || 'Inspect premises and submit official verification report.',
      priority: directive.priority || 'HIGH',
      status: 'DISPATCHED_TO_SECURITY',
      assignedGuard: directive.assignedGuard || 'Havaldar Ram Singh (Gate 1 Supervisor)',
      createdAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fieldReport: null
    };
    list.unshift(newDirective);
    localStorage.setItem('communityconnect_security_directives', JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_security_directive_updated', { detail: newDirective }));
    } catch {}
    return newDirective;
  },

  submitSecurityReport(directiveId, reportData) {
    const raw = localStorage.getItem('communityconnect_security_directives');
    const list = raw ? JSON.parse(raw) : [];
    const item = list.find((d) => d.id === directiveId);
    if (item) {
      item.status = 'REPORT_SUBMITTED';
      item.fieldReport = {
        officer: reportData.officer || 'Havaldar Ram Singh (Badge #SEC-409)',
        timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary: reportData.summary || 'Physical inspection completed. Credentials verified against society standards.',
        clearanceStatus: reportData.clearanceStatus || 'CLEARED',
        notes: reportData.notes || 'All verification parameters satisfied.'
      };
      localStorage.setItem('communityconnect_security_directives', JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_security_directive_updated', { detail: item }));
      } catch {}
    }
    return item;
  },

  grantAccessFromSecurity(directiveId, guardData = {}) {
    const raw = localStorage.getItem('communityconnect_security_directives');
    const list = raw ? JSON.parse(raw) : [];
    const item = list.find((d) => d.id === directiveId);
    if (item) {
      item.status = 'ACCESS_GRANTED';
      item.fieldReport = {
        officer: guardData.officer || 'Havaldar Ram Singh (Badge #SEC-409)',
        timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary: guardData.summary || `Physical credentials and tenancy checked for ${item.targetUnit}. Cleared for platform access.`,
        clearanceStatus: 'CLEARED',
        accessGranted: true,
        notes: guardData.notes || 'Aadhaar ID matched, rental deed valid, keys verified. Gate ANPR transponder and mobile login authorized.'
      };
      localStorage.setItem('communityconnect_security_directives', JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_security_directive_updated', { detail: item }));
        window.dispatchEvent(new CustomEvent('communityconnect_kyc_updated', { 
          detail: { 
            kycId: item.kycId, 
            targetUnit: item.targetUnit, 
            status: 'ACCESS_GRANTED',
            officer: item.fieldReport.officer,
            notes: item.fieldReport.notes
          } 
        }));
      } catch {}
    }
    return item;
  },

  // Society Treasury, Utility Billing & Cash Deposits
  getTreasuryData() {
    const raw = localStorage.getItem('communityconnect_treasury_ledger');
    if (!raw) {
      const initial = {
        accounts: {
          operatingBank: 4280000,
          sinkingFundFD: 18450000,
          cashVault: 345000,
          bankName: 'HDFC Bank Ltd, Jubilee Hills Branch',
          accountNumber: '4409-1092-8371-92',
          ifsc: 'HDFC0001092'
        },
        utilityBills: [
          {
            id: 'UTIL-01',
            service: 'TSSPDCL Common Area Electricity',
            category: 'Electricity / Power',
            consumerNumber: 'HT-4892019',
            description: 'Common area lightning, 14 high-speed passenger lifts, STP & booster pumps',
            amount: 284500,
            dueDate: '28 Sep 2025',
            status: 'PENDING',
            billMonth: 'August 2025',
            invoicePdf: 'TSSPDCL-AUG25-INV.pdf'
          },
          {
            id: 'UTIL-02',
            service: 'HMWS&SB Metro Piped Water & Tankers',
            category: 'Water Supply',
            consumerNumber: 'CAN-881920',
            description: 'Monthly municipal piped supply + 24 standby emergency drinking tankers',
            amount: 94200,
            dueDate: '30 Sep 2025',
            status: 'PAID',
            paidOn: '21 Sep 2025',
            utrNumber: 'UTR-HDFC-9912093',
            billMonth: 'August 2025'
          },
          {
            id: 'UTIL-03',
            service: 'HPCL Diesel Generator Bulk Supply',
            category: 'Generator Fuel',
            consumerNumber: 'HP-FUEL-COMM-22',
            description: '2,500 Liters high-speed diesel for 500kVA Cummins generator sets',
            amount: 235000,
            dueDate: '02 Oct 2025',
            status: 'PENDING',
            billMonth: 'September 2025',
            invoicePdf: 'HPCL-DIESEL-SEPT25.pdf'
          },
          {
            id: 'UTIL-04',
            service: 'Otis Elevators Quarterly AMC',
            category: 'Lift Maintenance',
            consumerNumber: 'OTIS-AMC-901',
            description: 'Preventive monthly maintenance & 24x7 emergency rescue cover for 14 lifts',
            amount: 145000,
            dueDate: '05 Oct 2025',
            status: 'PENDING',
            billMonth: 'Q3 FY25',
            invoicePdf: 'OTIS-Q3-AMC-INV.pdf'
          },
          {
            id: 'UTIL-05',
            service: 'Apex Security & Surveillance Fleet',
            category: 'Security Force',
            consumerNumber: 'APEX-SEC-HYD-44',
            description: 'Monthly payroll for 32 armed & unarmed guards, supervisors, and gate operators',
            amount: 380000,
            dueDate: '07 Oct 2025',
            status: 'PENDING',
            billMonth: 'September 2025',
            invoicePdf: 'APEX-PAYROLL-SEPT25.pdf'
          }
        ],
        transactions: [
          {
            id: 'TXN-8801',
            type: 'DEPOSIT',
            title: 'Cash Vault Deposit to HDFC Society A/C',
            amount: 150000,
            from: 'Estate Office Cash Vault',
            to: 'HDFC Current A/C #8371-92',
            reference: 'Slip #CH-99201 (Teller: Jubilee Hills)',
            date: '20 Sep 2025',
            status: 'COMPLETED',
            performedBy: 'Elena Rostova (President)'
          },
          {
            id: 'TXN-8802',
            type: 'PAYMENT',
            title: 'HMWS&SB Metro Water Piped Bill',
            amount: 94200,
            from: 'HDFC Current A/C #8371-92',
            to: 'HMWS&SB Piped Water Dept',
            reference: 'UTR-HDFC-9912093',
            date: '21 Sep 2025',
            status: 'COMPLETED',
            performedBy: 'Elena Rostova (President)'
          },
          {
            id: 'TXN-8803',
            type: 'WITHDRAWAL',
            title: 'Emergency Plumbing Spares Petty Cash',
            amount: 8500,
            from: 'Estate Office Cash Vault',
            to: 'Chief Plumber Imran (Tower C Main Valve)',
            reference: 'Petty Cash Voucher #PV-108',
            date: '22 Sep 2025',
            status: 'COMPLETED',
            performedBy: 'Treasurer Rajesh Sharma'
          }
        ],
        unitDues: [
          { suite: 'Suite B-402', owner: 'Priya Saxena (Owner)', type: 'Apartment', dues: 28500, days: 45, interest: 632, status: 'UNPAID', electricityDue: 4200 },
          { suite: 'Suite C-1104', owner: 'Rajesh Verma (Tenant)', type: 'Apartment', dues: 34200, days: 60, interest: 1020, status: 'UNPAID', electricityDue: 5800 },
          { suite: 'Suite A-902', owner: 'Anita Menon (Owner)', type: 'Apartment', dues: 19000, days: 35, interest: 281, status: 'UNPAID', electricityDue: 3100 },
          { suite: 'Suite D-204', owner: 'Gautam Singhania (Owner)', type: 'Penthouse', dues: 41800, days: 75, interest: 1560, status: 'UNPAID', electricityDue: 8900 },
          { suite: 'Villa V-08', owner: 'Kavita Reddy (Owner)', type: 'Villa', dues: 52000, days: 40, interest: 1100, status: 'UNPAID', electricityDue: 12400 },
          { suite: 'Suite A-1204', owner: 'Arjun Kumar (Resident)', type: 'Apartment', dues: 0, days: 0, interest: 0, status: 'PAID', electricityDue: 0 }
        ]
      };
      localStorage.setItem('communityconnect_treasury_ledger', JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  depositCashToBank(depositData) {
    const ledger = this.getTreasuryData();
    const amt = Number(depositData.amount);
    if (amt > ledger.accounts.cashVault) {
      throw new Error(`Insufficient cash in vault. Maximum available: ₹${ledger.accounts.cashVault.toLocaleString('en-IN')}`);
    }
    ledger.accounts.cashVault -= amt;
    ledger.accounts.operatingBank += amt;

    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'DEPOSIT',
      title: depositData.title || `Cash Vault Deposit to Bank A/C`,
      amount: amt,
      from: 'Estate Office Cash Vault',
      to: `Bank A/C (${ledger.accounts.bankName})`,
      reference: depositData.slipNumber ? `Slip #${depositData.slipNumber}` : `Bank Counter Deposit Ref #${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'COMPLETED',
      performedBy: depositData.performedBy || 'Elena Rostova (President)',
      notes: depositData.notes || 'Routine cash vault clearance to bank'
    };
    ledger.transactions.unshift(newTxn);
    localStorage.setItem('communityconnect_treasury_ledger', JSON.stringify(ledger));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_treasury_updated', { detail: ledger }));
    } catch {}
    return { ledger, newTxn };
  },

  disburseTreasuryFunds(data) {
    const ledger = this.getTreasuryData();
    const amt = Number(data.amount);
    const source = data.source || 'CASH_VAULT'; // 'CASH_VAULT' or 'BANK'

    if (source === 'CASH_VAULT') {
      if (amt > ledger.accounts.cashVault) {
        throw new Error(`Insufficient cash in vault. Available: ₹${ledger.accounts.cashVault.toLocaleString('en-IN')}`);
      }
      ledger.accounts.cashVault -= amt;
    } else {
      if (amt > ledger.accounts.operatingBank) {
        throw new Error(`Insufficient bank operating funds. Available: ₹${ledger.accounts.operatingBank.toLocaleString('en-IN')}`);
      }
      ledger.accounts.operatingBank -= amt;
    }

    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'WITHDRAWAL',
      title: data.purpose || 'Disbursement / Expense Withdrawal',
      amount: amt,
      from: source === 'CASH_VAULT' ? 'Estate Office Cash Vault' : 'HDFC Current A/C',
      to: data.beneficiary || 'Vendor / Contractor / Petty Cash',
      reference: data.voucherNumber ? `Voucher #${data.voucherNumber}` : `Voucher #PV-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'COMPLETED',
      performedBy: data.performedBy || 'Elena Rostova (President)',
      notes: data.notes || ''
    };
    ledger.transactions.unshift(newTxn);
    localStorage.setItem('communityconnect_treasury_ledger', JSON.stringify(ledger));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_treasury_updated', { detail: ledger }));
    } catch {}
    return { ledger, newTxn };
  },

  payUtilityBill(billId, paymentDetails = {}) {
    const ledger = this.getTreasuryData();
    const bill = ledger.utilityBills.find((b) => b.id === billId);
    if (!bill) throw new Error('Utility bill not found');
    if (bill.status === 'PAID') throw new Error('Bill is already settled');

    const amt = Number(bill.amount);
    if (amt > ledger.accounts.operatingBank) {
      throw new Error(`Insufficient operating account balance to pay bill of ₹${amt.toLocaleString('en-IN')}`);
    }

    ledger.accounts.operatingBank -= amt;
    bill.status = 'PAID';
    bill.paidOn = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    bill.utrNumber = paymentDetails.utrNumber || `UTR-HDFC-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'PAYMENT',
      title: `${bill.service} Bill Payment`,
      amount: amt,
      from: 'HDFC Current A/C #8371-92',
      to: bill.service,
      reference: bill.utrNumber,
      date: bill.paidOn,
      status: 'COMPLETED',
      performedBy: paymentDetails.performedBy || 'Elena Rostova (President)'
    };
    ledger.transactions.unshift(newTxn);
    localStorage.setItem('communityconnect_treasury_ledger', JSON.stringify(ledger));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_treasury_updated', { detail: ledger }));
    } catch {}
    return { ledger, bill, newTxn };
  },

  recordApartmentPayment(suiteNo, paymentDetails) {
    const ledger = this.getTreasuryData();
    const unit = ledger.unitDues.find((u) => u.suite === suiteNo);
    if (!unit) throw new Error('Unit not found in dues registry');

    const amt = Number(paymentDetails.amount) || unit.dues;
    const mode = paymentDetails.mode || 'ONLINE'; // 'ONLINE' or 'CASH'

    if (mode === 'CASH') {
      ledger.accounts.cashVault += amt;
    } else {
      ledger.accounts.operatingBank += amt;
    }

    unit.dues = Math.max(0, unit.dues - amt);
    if (unit.dues === 0) {
      unit.status = 'PAID';
      unit.days = 0;
      unit.interest = 0;
      if (paymentDetails.clearElectricity) {
        unit.electricityDue = 0;
      }
    }

    const receiptNo = `REC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'PAYMENT_RECEIVED',
      title: `Maintenance & Utility Settlement: ${unit.suite}`,
      amount: amt,
      from: `${unit.owner} (${unit.suite})`,
      to: mode === 'CASH' ? 'Estate Office Cash Vault' : 'HDFC Current A/C',
      reference: `Receipt #${receiptNo} (${mode})`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'COMPLETED',
      performedBy: paymentDetails.performedBy || 'Elena Rostova (President)'
    };
    ledger.transactions.unshift(newTxn);
    localStorage.setItem('communityconnect_treasury_ledger', JSON.stringify(ledger));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_treasury_updated', { detail: ledger }));
    } catch {}
    return { ledger, unit, receiptNo };
  },

  executeVendorBankPayout(payoutDetails) {
    const ledger = this.getTreasuryData();
    const amt = Number(payoutDetails.amount);
    const source = payoutDetails.sourceAccount || 'OPERATING_BANK'; // 'OPERATING_BANK', 'SINKING_FUND', 'CASH_VAULT'

    if (source === 'CASH_VAULT') {
      if (amt > ledger.accounts.cashVault) {
        throw new Error(`Insufficient cash in vault. Available: ₹${ledger.accounts.cashVault.toLocaleString('en-IN')}`);
      }
      ledger.accounts.cashVault -= amt;
    } else if (source === 'SINKING_FUND') {
      if (amt > ledger.accounts.sinkingFundFD) {
        throw new Error(`Insufficient funds in Sinking Fund Fixed Deposit. Available: ₹${ledger.accounts.sinkingFundFD.toLocaleString('en-IN')}`);
      }
      ledger.accounts.sinkingFundFD -= amt;
    } else {
      if (amt > ledger.accounts.operatingBank) {
        throw new Error(`Insufficient bank operating funds. Available: ₹${ledger.accounts.operatingBank.toLocaleString('en-IN')}`);
      }
      ledger.accounts.operatingBank -= amt;
    }

    const utr = payoutDetails.utrNumber || `UTR-HDFC-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'PAYOUT',
      category: payoutDetails.category || 'VENDOR_PAYOUT',
      title: payoutDetails.title || `Vendor Payout to ${payoutDetails.vendorName}`,
      amount: amt,
      from: source === 'CASH_VAULT' ? 'Estate Office Cash Vault' : (source === 'SINKING_FUND' ? 'SBI Sinking Fund FD #9901' : `${ledger.accounts.bankName} (A/C #${ledger.accounts.accountNumber})`),
      to: payoutDetails.vendorName || 'Authorized Beneficiary',
      reference: utr,
      invoiceRef: payoutDetails.invoiceRef || null,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SETTLED',
      payoutMode: payoutDetails.payoutMode || 'RTGS / Corporate NetBanking',
      performedBy: payoutDetails.authorizedBy || 'Elena Rostova (President)',
      notes: payoutDetails.notes || 'Board approved direct bank disbursement'
    };

    ledger.transactions.unshift(newTxn);

    // If a utility bill was associated, mark as paid
    if (payoutDetails.billId) {
      const bill = ledger.utilityBills.find((b) => b.id === payoutDetails.billId);
      if (bill) {
        bill.status = 'PAID';
        bill.paidOn = newTxn.date;
        bill.utrNumber = utr;
      }
    }

    localStorage.setItem('communityconnect_treasury_ledger', JSON.stringify(ledger));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_treasury_updated', { detail: ledger }));
    } catch {}
    return { ledger, newTxn, utr };
  },

  // Society Dues Cash Collection Requests (For Security Guard Doorstep Pickup or Estate Office Deposit)
  getCashCollections() {
    const raw = localStorage.getItem('communityconnect_cash_collections');
    if (!raw) {
      const initial = [
        {
          id: 'CASH-9021',
          residentName: 'Arjun Kumar',
          unit: 'Flat A-1204',
          phone: '+91 98765 43210',
          amount: 4250,
          purpose: 'November 2025 Society Maintenance',
          method: 'SECURITY_DOORSTEP',
          slot: 'Today, 04:00 PM - 06:00 PM',
          status: 'ASSIGNED',
          assignedGuard: 'Guard Ramesh (Gate 1)',
          notes: 'Keep physical receipt book ready with carbon copy',
          verificationCode: '8831',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('communityconnect_cash_collections', JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  requestCashCollection(data) {
    const raw = localStorage.getItem('communityconnect_cash_collections');
    const list = raw ? JSON.parse(raw) : [];
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const newReq = {
      id: `CASH-${Math.floor(1000 + Math.random() * 9000)}`,
      residentName: data.residentName || 'Arjun Kumar',
      unit: data.unit || 'Flat A-1204',
      phone: data.phone || '+91 98765 43210',
      amount: Number(data.amount) || 4250,
      purpose: data.purpose || 'Maintenance Dues',
      method: data.method || 'SECURITY_DOORSTEP', // 'SECURITY_DOORSTEP' or 'ESTATE_OFFICE'
      slot: data.slot || 'Today, 04:00 PM - 06:00 PM',
      status: data.method === 'SECURITY_DOORSTEP' ? 'DISPATCHED_TO_GUARD' : 'PENDING_OFFICE_VISIT',
      assignedGuard: data.method === 'SECURITY_DOORSTEP' ? 'Havaldar Ram Singh (Security Desk)' : 'Estate Office Counter #2',
      notes: data.notes || '',
      verificationCode: code,
      createdAt: new Date().toISOString()
    };
    list.unshift(newReq);
    localStorage.setItem('communityconnect_cash_collections', JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_cash_updated', { detail: newReq }));
    } catch {}
    return newReq;
  },

  updateCashCollectionStatus(id, status) {
    const raw = localStorage.getItem('communityconnect_cash_collections');
    const list = raw ? JSON.parse(raw) : [];
    const item = list.find((c) => c.id === id);
    if (item) {
      item.status = status;
      if (status === 'COLLECTED') {
        item.collectedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      localStorage.setItem('communityconnect_cash_collections', JSON.stringify(list));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_cash_updated', { detail: item }));
      } catch {}
    }
    return item;
  },

  // Vendor Settlement Escalation & Formal Nudge to Community Admin
  sendSettlementEscalation(settlementId, escalationData) {
    const key = 'communityconnect_settlement_escalations';
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const newEscalation = {
      id: `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
      settlementId: settlementId || 'SETTLE-901',
      communityName: escalationData.communityName || 'My Home Bhooja',
      adminName: escalationData.adminName || 'S. Venkat Reddy (President)',
      vendorName: escalationData.vendorName || 'CoolingPro AC Solutions',
      amount: escalationData.amount || 44910,
      serviceTitle: escalationData.serviceTitle || 'Pre-Festival AC Deep Chemical Service',
      message: escalationData.message || 'Formal settlement request sent to RWA President.',
      status: 'ESCALATED_TO_ADMIN',
      timestamp: new Date().toLocaleString()
    };
    list.unshift(newEscalation);
    localStorage.setItem(key, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_escalation_updated', { detail: newEscalation }));
    } catch {}
    return newEscalation;
  },

  // Domestic Staff & Helper Hiring API
  getStaffRequests(communityId = null) {
    const key = 'communityconnect_staff_requests';
    const raw = localStorage.getItem(key);
    let list = [];
    if (!raw) {
      list = [
        {
          id: 'SREQ-101',
          communityId: 'comm-bhooja',
          residentName: 'Arjun Kumar',
          unit: 'Flat A-1204',
          phone: '+91 98765 43210',
          staffType: 'Cook',
          title: 'Morning South & North Indian Cook Needed',
          description: 'Looking for experienced home cook for 3-member family. Morning 07:30 AM to 09:00 AM slot.',
          offeredBudget: 4200,
          preferredTime: '07:30 AM - 09:00 AM',
          status: 'OPEN_FOR_APPLICATIONS',
          createdAt: 'Today',
          applications: [
            {
              id: 'APP-101',
              staffId: 'usr-prov-sunita',
              staffName: 'Sunita Devi',
              phone: '+91 98888 77665',
              category: 'Cook',
              rating: 4.9,
              proposedMonthlyPay: 4200,
              proposedShiftTime: '07:30 AM - 09:00 AM (Morning)',
              specialties: ['North Indian', 'South Indian', 'Low Oil Hygiene'],
              note: 'I am already serving Flat B-402 in Tower B. Available for your morning slot!',
              appliedAt: 'Today',
              status: 'PENDING_RESIDENT_REVIEW'
            }
          ]
        }
      ];
      localStorage.setItem(key, JSON.stringify(list));
    } else {
      try { list = JSON.parse(raw); } catch { list = []; }
    }
    if (communityId) {
      return list.filter((s) => !s.communityId || s.communityId === communityId);
    }
    return list;
  },

  createStaffRequest(requestData) {
    const key = 'communityconnect_staff_requests';
    const list = this.getStaffRequests();
    const newReq = {
      id: `SREQ-${Date.now().toString().slice(-4)}`,
      communityId: requestData.communityId || 'comm-bhooja',
      residentName: requestData.residentName || 'Arjun Kumar',
      unit: requestData.unit || 'Flat A-1204',
      phone: requestData.phone || '+91 98765 43210',
      staffType: requestData.staffType || 'Cook',
      title: requestData.title || `Need ${requestData.staffType || 'Staff'}`,
      description: requestData.description || 'Domestic helper required.',
      offeredBudget: Number(requestData.offeredBudget) || 4000,
      preferredTime: requestData.preferredTime || 'Morning Shift',
      status: 'OPEN_FOR_APPLICATIONS',
      createdAt: 'Just now',
      applications: []
    };
    list.unshift(newReq);
    localStorage.setItem(key, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_staff_updated', { detail: newReq }));
    } catch {}
    return newReq;
  },

  submitStaffApplication(requestId, staffData) {
    const key = 'communityconnect_staff_requests';
    const list = this.getStaffRequests();
    const req = list.find((r) => r.id === requestId);
    if (!req) throw new Error('Staff request not found');

    if (!req.applications) req.applications = [];
    const newApp = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      staffId: staffData.staffId || 'usr-prov-sunita',
      staffName: staffData.staffName || 'Sunita Devi',
      phone: staffData.phone || '+91 98888 77665',
      category: staffData.category || req.staffType || 'Cook',
      rating: staffData.rating || 4.9,
      proposedMonthlyPay: Number(staffData.proposedMonthlyPay) || req.offeredBudget,
      proposedShiftTime: staffData.proposedShiftTime || req.preferredTime,
      specialties: staffData.specialties || ['Police Verified', 'Hygiene First'],
      note: staffData.note || 'Available to start work immediately.',
      appliedAt: 'Just now',
      status: 'PENDING_RESIDENT_REVIEW'
    };
    req.applications.unshift(newApp);
    localStorage.setItem(key, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_staff_updated', { detail: req }));
    } catch {}
    return { req, application: newApp };
  },

  acceptStaffApplication(requestId, applicationId) {
    const key = 'communityconnect_staff_requests';
    const list = this.getStaffRequests();
    const req = list.find((r) => r.id === requestId);
    if (!req) throw new Error('Staff request not found');

    const app = (req.applications || []).find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    app.status = 'ACCEPTED';
    req.status = 'HIRED';
    req.hiredStaff = app;

    localStorage.setItem(key, JSON.stringify(list));

    // Auto-generate Security Gate Pass for Gate Guard
    this.createVisitorPass({
      guestName: app.staffName,
      companyName: `${app.category || 'Domestic Helper'} Pass`,
      company: 'Domestic Staff',
      visitorType: 'CONTRACTOR',
      visitorCategory: app.category || 'Staff',
      phone: app.phone,
      vehicleNumber: 'N/A (Walk-In Staff Pass)',
      entryMode: 'Walk-In / On Foot',
      isWalkIn: true,
      hostUnit: req.unit,
      validDate: 'Daily Access',
      validDuration: app.proposedShiftTime || 'Daily Morning Shift',
      issuedBy: `${req.residentName} (${req.unit})`,
      otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'EXPECTED'
    });

    try {
      window.dispatchEvent(new CustomEvent('communityconnect_staff_updated', { detail: req }));
    } catch {}
    return { req, application: app };
  },

  // Marketplace & Classified Price Offers API
  getMarketplaceOffers(postId = null) {
    const key = 'communityconnect_marketplace_offers';
    const raw = localStorage.getItem(key);
    let list = [];
    if (!raw) {
      list = [
        {
          id: 'OFFER-201',
          postId: 'post-classified-bike',
          postTitle: 'Kids Bicycle (Red) - Like New with Helmet',
          sellerName: 'Priya Verma',
          sellerUnit: 'Flat C-502',
          buyerName: 'Arjun Kumar',
          buyerUnit: 'Flat A-1204',
          buyerPhone: '+91 98765 43210',
          askingPrice: 2800,
          offeredPrice: 2500,
          message: 'Hi Priya! Can pick it up today evening for ₹2,500 for my daughter.',
          status: 'PENDING_SELLER',
          createdAt: 'Today, 11:30 AM'
        }
      ];
      localStorage.setItem(key, JSON.stringify(list));
    } else {
      try { list = JSON.parse(raw); } catch { list = []; }
    }
    if (postId) {
      return list.filter((o) => o.postId === postId);
    }
    return list;
  },

  submitClassifiedOffer(postId, offerData) {
    const key = 'communityconnect_marketplace_offers';
    const list = this.getMarketplaceOffers();
    const newOffer = {
      id: `OFFER-${Date.now().toString().slice(-4)}`,
      postId: postId,
      postTitle: offerData.postTitle || 'Classified Item',
      sellerName: offerData.sellerName || 'Resident',
      sellerUnit: offerData.sellerUnit || 'Estate',
      buyerName: offerData.buyerName || 'Arjun Kumar',
      buyerUnit: offerData.buyerUnit || 'Flat A-1204',
      buyerPhone: offerData.buyerPhone || '+91 98765 43210',
      askingPrice: Number(offerData.askingPrice) || 5000,
      offeredPrice: Number(offerData.offeredPrice) || Number(offerData.askingPrice) || 4500,
      message: offerData.message || 'Interested in buying this item!',
      status: 'PENDING_SELLER',
      createdAt: 'Just now'
    };
    list.unshift(newOffer);
    localStorage.setItem(key, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_offers_updated', { detail: newOffer }));
    } catch {}
    return newOffer;
  },

  acceptClassifiedOffer(offerId) {
    const key = 'communityconnect_marketplace_offers';
    const list = this.getMarketplaceOffers();
    const offer = list.find((o) => o.id === offerId);
    if (!offer) throw new Error('Offer not found');

    offer.status = 'ACCEPTED';

    // Mark post as SOLD in feed
    const posts = getStoredPosts();
    const post = posts.find((p) => p.id === offer.postId);
    if (post) {
      post.isSold = true;
      post.soldTo = `${offer.buyerName} (${offer.buyerUnit})`;
      post.title = `[SOLD] ${post.title}`;
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      try {
        window.dispatchEvent(new CustomEvent('communityconnect_posts_updated', { detail: post }));
      } catch {}
    }

    localStorage.setItem(key, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_offers_updated', { detail: offer }));
    } catch {}
    return offer;
  },

  // Detailed Group Demand Pool Joining with Slot, Units & Target Bidding
  joinPoolDetailed(poolId, joinData) {
    const list = getStoredPools();
    const pool = list.find((p) => p.id === poolId);
    if (!pool) throw new Error('Pool not found');

    const unitsCount = Number(joinData.unitsBooked) || 1;
    const existingIdx = (pool.participants || []).findIndex(
      (p) => p.residentName === joinData.residentName && p.unit === joinData.unit
    );

    const participantEntry = {
      residentName: joinData.residentName || 'Arjun Kumar',
      unit: joinData.unit || 'Flat A-1204',
      phone: joinData.phone || '+91 98765 43210',
      unitsBooked: unitsCount,
      slot: joinData.slot || 'Saturday Drive Slot',
      preferredDate: joinData.preferredDate || 'Upcoming Weekend',
      targetBidPrice: joinData.targetBidPrice ? Number(joinData.targetBidPrice) : null,
      notes: joinData.notes || '',
      joinedAt: new Date().toISOString().split('T')[0]
    };

    if (existingIdx !== -1) {
      pool.participants[existingIdx] = participantEntry;
    } else {
      pool.participants.unshift(participantEntry);
    }

    pool.currentParticipants = pool.participants.reduce((acc, p) => acc + (Number(p.unitsBooked) || 1), 0);

    // Calculate Dynamic Tier Discount based on total units booked
    const previousPrice = pool.discountedPrice;
    if (pool.currentParticipants >= 25) {
      pool.discountedPrice = Math.round(pool.regularPrice * 0.55); // ~45% OFF
    } else if (pool.currentParticipants >= 10) {
      pool.discountedPrice = Math.round(pool.regularPrice * 0.65); // ~35% OFF
    } else {
      pool.discountedPrice = pool.discountedPrice || Math.round(pool.regularPrice * 0.75);
    }

    pool.savingsPercent = Math.round(((pool.regularPrice - pool.discountedPrice) / pool.regularPrice) * 100);
    if (previousPrice !== pool.discountedPrice) {
      pool.hasPriceDrop = true;
      pool.priceDropNotice = `Price dropped from ₹${previousPrice} to ₹${pool.discountedPrice} due to high group volume!`;
    }

    localStorage.setItem(POOLS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_pools_updated', { detail: pool }));
    } catch {}
    return pool;
  },

  optOutPool(poolId, residentName, unit) {
    const list = getStoredPools();
    const pool = list.find((p) => p.id === poolId);
    if (!pool) throw new Error('Pool not found');

    if (pool.participants) {
      pool.participants = pool.participants.filter(
        (p) => !(p.residentName === residentName && p.unit === unit)
      );
      pool.currentParticipants = pool.participants.reduce((acc, p) => acc + (Number(p.unitsBooked) || 1), 0);
    }

    localStorage.setItem(POOLS_STORAGE_KEY, JSON.stringify(list));
    try {
      window.dispatchEvent(new CustomEvent('communityconnect_pools_updated', { detail: pool }));
    } catch {}
    return pool;
  }
};
