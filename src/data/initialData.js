// Comprehensive Multi-Community Seed Data for CommunityConnect

export const INITIAL_COMMUNITIES = [
  {
    id: 'comm-bhooja',
    name: 'My Home Bhooja',
    area: 'Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    address: 'C9R5+6V, Silpa Gram Craft Village, Gachibowli, Hyderabad',
    type: 'Gated Luxury High-Rise',
    towers: 8,
    totalUnits: 1200,
    occupiedUnits: 1140,
    amenitiesCount: 52,
    status: 'ACTIVE',
    plan: 'ENTERPRISE_PREMIUM',
    subscriptionStatus: 'ACTIVE',
    monthlyInflow: 4850000,
    presidentName: 'S. Venkat Reddy',
    presidentEmail: 'president.bhooja@communityconnect.com',
    presidentPhone: '+91 98490 12345',
    securityGatePhone: '+91 98490 55001',
    description: 'A vibrant, secure, and ultra-green luxury community for a better tomorrow.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    onboardedDate: '2025-01-15'
  },
  {
    id: 'comm-saket',
    name: 'Saket Towers',
    area: 'Damayura',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500062',
    address: 'Saket Road, Kapra, Damayura, Hyderabad',
    type: 'Residential Society',
    towers: 4,
    totalUnits: 480,
    occupiedUnits: 452,
    amenitiesCount: 28,
    status: 'ACTIVE',
    plan: 'GROWTH_TIER',
    subscriptionStatus: 'ACTIVE',
    monthlyInflow: 1820000,
    presidentName: 'Elena Rostova',
    presidentEmail: 'admin.saket@communityconnect.com',
    presidentPhone: '+91 98480 99881',
    securityGatePhone: '+91 98480 66002',
    description: 'Tight-knit residential society with lush gardens and family clubhouse.',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
    onboardedDate: '2025-02-01'
  },
  {
    id: 'comm-prestige',
    name: 'Prestige High Fields',
    area: 'Kokapet',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500075',
    address: 'Financial District, Nanakramguda, Kokapet, Hyderabad',
    type: 'Mega Township',
    towers: 10,
    totalUnits: 2240,
    occupiedUnits: 2110,
    amenitiesCount: 65,
    status: 'ACTIVE',
    plan: 'ENTERPRISE_PREMIUM',
    subscriptionStatus: 'ACTIVE',
    monthlyInflow: 8900000,
    presidentName: 'Rajeshwar Rao',
    presidentEmail: 'president.prestige@communityconnect.com',
    presidentPhone: '+91 99080 33441',
    securityGatePhone: '+91 99080 77003',
    description: 'Disney-themed luxury mega community with Olympic sports complex.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    onboardedDate: '2025-03-10'
  },
  {
    id: 'comm-aparna',
    name: 'Aparna CyberLife',
    area: 'Nallagandla',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500019',
    address: 'Huda Layout, Nallagandla, Gachibowli Extension, Hyderabad',
    type: 'Gated Community',
    towers: 6,
    totalUnits: 850,
    occupiedUnits: 810,
    amenitiesCount: 38,
    status: 'ACTIVE',
    plan: 'GROWTH_TIER',
    subscriptionStatus: 'ACTIVE',
    monthlyInflow: 3400000,
    presidentName: 'Kavitha Ramachandran',
    presidentEmail: 'president.aparna@communityconnect.com',
    presidentPhone: '+91 98850 77123',
    securityGatePhone: '+91 98850 88004',
    description: 'Tech-enabled high density residential layout with solar micro-grid.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    onboardedDate: '2025-04-05'
  },
  {
    id: 'comm-lodha',
    name: 'Lodha Meridian',
    area: 'Kondapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500084',
    address: 'Eden Square, Off KPHB, Kondapur, Hyderabad',
    type: 'High-Rise Apartments',
    towers: 5,
    totalUnits: 720,
    occupiedUnits: 680,
    amenitiesCount: 32,
    status: 'FROZEN',
    plan: 'GROWTH_TIER',
    subscriptionStatus: 'PAYMENT_PENDING',
    freezeReason: 'Annual Platform License Renewal past due by 45 days. Restricted to read-only security safety logs.',
    monthlyInflow: 2880000,
    presidentName: 'Vikram Joshi',
    presidentEmail: 'president.lodha@communityconnect.com',
    presidentPhone: '+91 97010 44552',
    securityGatePhone: '+91 97010 99005',
    description: 'Twin tower luxury enclave with sky decks and automated car parking.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    onboardedDate: '2024-11-20'
  }
];

export const PRECONFIGURED_USERS = [
  {
    id: 'usr-plat-admin',
    name: 'Devashish Sen',
    email: 'admin@communityconnect.com',
    loginId: 'admin@communityconnect.com',
    password: 'password123',
    role: 'PLATFORM_ADMIN',
    avatar: null,
    title: 'Chief Operations Officer (CommunityConnect HQ)',
    phone: '+91 99000 11223'
  },
  {
    id: 'usr-comm-bhooja',
    name: 'S. Venkat Reddy',
    email: 'president.bhooja@communityconnect.com',
    loginId: 'president.bhooja@communityconnect.com',
    password: 'password123',
    role: 'COMMUNITY_ADMIN',
    communityId: 'comm-bhooja',
    communityName: 'My Home Bhooja',
    avatar: null,
    title: 'Management Committee President',
    phone: '+91 98490 12345'
  },
  {
    id: 'usr-comm-saket',
    name: 'Elena Rostova',
    email: 'admin.saket@communityconnect.com',
    loginId: 'admin.saket@communityconnect.com',
    password: 'password123',
    role: 'COMMUNITY_ADMIN',
    communityId: 'comm-saket',
    communityName: 'Saket Towers',
    avatar: null,
    title: 'Resident Welfare Association General Secretary',
    phone: '+91 98480 99881'
  },
  {
    id: 'usr-res-arjun',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@example.com',
    loginId: 'arjun.kumar@example.com',
    password: 'password123',
    role: 'RESIDENT',
    communityId: 'comm-bhooja',
    communityName: 'My Home Bhooja',
    flatNumber: 'A-1204',
    tower: 'Tower A',
    residentType: 'Owner',
    accessLevel: 'PERMANENT',
    avatar: null,
    phone: '+91 98765 43210',
    familyCount: 3,
    vehicleFastag: 'TS 09 FH 8120'
  },
  {
    id: 'usr-res-priya',
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    loginId: 'priya.verma@example.com',
    password: 'password123',
    role: 'RESIDENT',
    communityId: 'comm-bhooja',
    communityName: 'My Home Bhooja',
    flatNumber: 'C-502',
    tower: 'Tower C',
    residentType: 'Owner',
    accessLevel: 'PERMANENT',
    avatar: null,
    phone: '+91 98450 99112',
    familyCount: 4,
    vehicleFastag: 'TS 09 PV 5020'
  },
  {
    id: 'usr-prov-cool',
    name: 'CoolingPro AC Solutions',
    contactPerson: 'Suresh Varma',
    email: 'coolingpro.service@example.com',
    loginId: 'coolingpro.service@example.com',
    password: 'password123',
    role: 'SERVICE_PROVIDER',
    providerType: 'GROUP_AGENCY',
    tradeCategory: 'AC Service',
    category: 'AC Service & Maintenance',
    rating: 4.88,
    reviewsCount: 342,
    communitiesServed: ['comm-bhooja', 'comm-saket', 'comm-prestige', 'comm-aparna'],
    avatar: null,
    phone: '+91 98888 77665',
    verified: true,
    badges: ['ISO Certified', 'Police Verified Techs', 'Group Demand Partner']
  },
  {
    id: 'usr-prov-volt',
    name: 'VoltMaster Electricals',
    contactPerson: 'Vikram Sharma',
    email: 'voltmaster.service@example.com',
    loginId: 'voltmaster.service@example.com',
    password: 'password123',
    role: 'SERVICE_PROVIDER',
    providerType: 'GROUP_AGENCY',
    tradeCategory: 'Electrician',
    category: 'Licensed Electrical & Circuit Diagnostics',
    rating: 4.91,
    reviewsCount: 280,
    communitiesServed: ['comm-bhooja', 'comm-saket', 'comm-prestige'],
    avatar: null,
    phone: '+91 98777 44332',
    verified: true,
    badges: ['Licensed Wiremen', '24x7 Emergency Line', 'Group Demand Partner']
  },
  {
    id: 'usr-prov-hydro',
    name: 'HydroFix Plumbing Solutions',
    contactPerson: 'Mahesh Babu',
    email: 'hydrofix.service@example.com',
    loginId: 'hydrofix.service@example.com',
    password: 'password123',
    role: 'SERVICE_PROVIDER',
    providerType: 'GROUP_AGENCY',
    tradeCategory: 'Plumber',
    category: 'Sanitary & Concealed Leak Repair',
    rating: 4.86,
    reviewsCount: 215,
    communitiesServed: ['comm-bhooja', 'comm-aparna'],
    avatar: null,
    phone: '+91 98666 55443',
    verified: true,
    badges: ['Ultrasonic Leak Detection', '30-Day Guarantee', 'Group Demand Partner']
  },
  {
    id: 'usr-prov-sunita',
    name: 'Sunita Devi',
    contactPerson: 'Sunita Devi',
    email: 'sunita.cook@example.com',
    loginId: 'sunita.cook@example.com',
    password: 'password123',
    role: 'SERVICE_PROVIDER',
    providerType: 'INDIVIDUAL_STAFF',
    tradeCategory: 'Cook',
    category: 'Verified Home Cook & Chef',
    rating: 4.92,
    reviewsCount: 58,
    communitiesServed: ['comm-bhooja'],
    avatar: null,
    phone: '+91 98123 45678',
    verified: true,
    badges: ['Aadhaar Verified', 'Gate Biometric Pass', '1-on-1 Dedicated Staff'],
    assignedFlats: [
      {
        id: 'FLAT-A1204',
        flatNumber: 'Flat A-1204',
        tower: 'Tower A',
        communityName: 'My Home Bhooja',
        residentName: 'Arjun Kumar',
        phone: '+91 98765 43210',
        shiftTime: '07:30 AM - 09:30 AM (Morning Shift)',
        serviceType: 'North Indian Cooking & Kitchen Sanitization',
        monthlyPay: 4500,
        gateOtp: '4829',
        status: 'ACTIVE_CONNECTED'
      },
      {
        id: 'FLAT-B402',
        flatNumber: 'Flat B-402',
        tower: 'Tower B',
        communityName: 'My Home Bhooja',
        residentName: 'Priya Saxena',
        phone: '+91 98450 11223',
        shiftTime: '05:00 PM - 07:00 PM (Evening Shift)',
        serviceType: 'Utensil Cleaning & Dinner Meal Prep',
        monthlyPay: 3500,
        gateOtp: '8812',
        status: 'ACTIVE_CONNECTED'
      }
    ]
  },
  {
    id: 'usr-prov-lakshmi',
    name: 'Lakshmi Bai',
    contactPerson: 'Lakshmi Bai',
    email: 'lakshmi.maid@example.com',
    loginId: 'lakshmi.maid@example.com',
    password: 'password123',
    role: 'SERVICE_PROVIDER',
    providerType: 'INDIVIDUAL_STAFF',
    tradeCategory: 'Maid',
    category: 'Verified Housekeeper & Daily Maid',
    rating: 4.88,
    reviewsCount: 64,
    communitiesServed: ['comm-bhooja'],
    avatar: null,
    phone: '+91 98222 33445',
    verified: true,
    badges: ['Police Cleared', 'Biometric Access Active', '1-on-1 Dedicated Staff'],
    assignedFlats: [
      {
        id: 'FLAT-[#c601]',
        flatNumber: 'Flat C-601',
        tower: 'Tower C',
        communityName: 'My Home Bhooja',
        residentName: 'Ananya Deshmukh',
        phone: '+91 98850 44332',
        shiftTime: '08:00 AM - 10:00 AM (Morning Housekeeping)',
        serviceType: 'Sweeping, Wet Mopping, Balcony & Washroom Scrubbing',
        monthlyPay: 4000,
        gateOtp: '3319',
        status: 'ACTIVE_CONNECTED'
      }
    ]
  },
  {
    id: 'usr-prov-ramesh',
    name: 'Ramesh Kumar',
    contactPerson: 'Ramesh Kumar',
    email: 'ramesh.driver@example.com',
    loginId: 'ramesh.driver@example.com',
    password: 'password123',
    role: 'SERVICE_PROVIDER',
    providerType: 'INDIVIDUAL_STAFF',
    tradeCategory: 'Driver',
    category: 'Private Chauffeur & Driver',
    rating: 4.89,
    reviewsCount: 42,
    communitiesServed: ['comm-bhooja'],
    avatar: null,
    phone: '+91 98765 11223',
    verified: true,
    badges: ['Commercial DL', 'Zero Accident Record', 'Gate Pass Active'],
    assignedFlats: [
      {
        id: 'FLAT-A1204-DRV',
        flatNumber: 'Flat A-1204',
        tower: 'Tower A',
        communityName: 'My Home Bhooja',
        residentName: 'Arjun Kumar',
        phone: '+91 98765 43210',
        shiftTime: '09:30 AM - 06:30 PM (Full Day Office Commute)',
        serviceType: 'Private Chauffeur (SUV TS 09 FH 8120)',
        monthlyPay: 18000,
        gateOtp: '4829',
        status: 'ACTIVE_CONNECTED'
      }
    ]
  },
  {
    id: 'usr-sec-ramsingh',
    name: 'Havaldar Ram Singh',
    email: 'security.gate1@communityconnect.com',
    loginId: 'security.gate1@communityconnect.com',
    password: 'password123',
    role: 'SECURITY_TEAM',
    communityId: 'comm-bhooja',
    communityName: 'My Home Bhooja',
    badgeId: 'SEC-BHOOJA-4892',
    gateAssignment: 'Gate 1 North (Main Ingress)',
    avatar: null,
    phone: '+91 98490 55001',
    shift: 'Shift A (06:00 - 14:00)'
  }
];

export const SERVICE_CATEGORIES = [
  { id: 'ac-service', name: 'AC Service', icon: 'Wrench', groupable: true, defaultPrice: 499, description: 'Chemical jet wash, gas top-up, filter sanitize' },
  { id: 'cleaning', name: 'Deep Cleaning', icon: 'Sparkles', groupable: true, defaultPrice: 1299, description: 'Kitchen, bathrooms, balconies & sofa deep scrub' },
  { id: 'electrician', name: 'Electrician', icon: 'Zap', groupable: false, defaultPrice: 199, description: 'MCB switches, fan repair, short circuit fixes' },
  { id: 'plumber', name: 'Plumber', icon: 'Droplets', groupable: false, defaultPrice: 249, description: 'RO water purifier, tap leaks, drain unblocking' },
  { id: 'cook-maid', name: 'Cook / Maid', icon: 'Users', groupable: false, defaultPrice: 2999, description: 'Verified domestic staff with background check' },
  { id: 'driver', name: 'Driver', icon: 'Car', groupable: false, defaultPrice: 499, description: 'Hourly, outstation and city chauffeur on call' },
  { id: 'tutor', name: 'Home Tutor', icon: 'GraduationCap', groupable: true, defaultPrice: 800, description: 'CBSE, ICSE, IB STEM and language specialists' },
  { id: 'pest-control', name: 'Pest Control', icon: 'ShieldAlert', groupable: true, defaultPrice: 899, description: 'Odorless herbal spray for roaches, termites, bedbugs' }
];

export const INITIAL_GROUP_DEMAND_POOLS = [
  {
    id: 'pool-ac-bhooja-sep',
    communityId: 'comm-bhooja',
    serviceTitle: 'Pre-Festival AC Deep Chemical Service',
    category: 'AC Service',
    regularPrice: 750,
    discountedPrice: 499,
    savingsPercent: 33,
    minThreshold: 20,
    currentParticipants: 18,
    deadline: '2025-09-24',
    status: 'AGGREGATING',
    creator: { residentName: 'Sanjay Mittal', unit: 'Tower B-302' },
    participants: [
      { residentName: 'Arjun Kumar', unit: 'Tower A-1204', unitsBooked: 2, joinedAt: '2025-09-18' },
      { residentName: 'Priya Saxena', unit: 'Tower B-402', unitsBooked: 3, joinedAt: '2025-09-17' },
      { residentName: 'Vikas Rao', unit: 'Tower A-701', unitsBooked: 2, joinedAt: '2025-09-17' },
      { residentName: 'Meenakshi Iyer', unit: 'Tower C-1104', unitsBooked: 1, joinedAt: '2025-09-16' },
      { residentName: 'Rohit Sharma', unit: 'Tower D-202', unitsBooked: 2, joinedAt: '2025-09-16' }
    ]
  },
  {
    id: 'pool-elec-bhooja-sep',
    communityId: 'comm-bhooja',
    serviceTitle: 'Tower A & B Smart Switchboard & MCB Inspection Drive',
    category: 'Electrician',
    regularPrice: 350,
    discountedPrice: 199,
    savingsPercent: 43,
    minThreshold: 15,
    currentParticipants: 14,
    deadline: '2025-09-26',
    status: 'AGGREGATING',
    creator: { residentName: 'Rameshwar Rao', unit: 'Tower A-504' },
    participants: [
      { residentName: 'Arjun Kumar', unit: 'Tower A-1204', unitsBooked: 1, joinedAt: '2025-09-18' },
      { residentName: 'Kavita Menon', unit: 'Tower B-901', unitsBooked: 1, joinedAt: '2025-09-17' }
    ]
  },
  {
    id: 'pool-[#plumber]-bhooja-sep',
    communityId: 'comm-bhooja',
    serviceTitle: 'Bathroom Concealed Cistern & Leak Detector Sanitization Drive',
    category: 'Plumber',
    regularPrice: 450,
    discountedPrice: 249,
    savingsPercent: 44,
    minThreshold: 12,
    currentParticipants: 10,
    deadline: '2025-09-27',
    status: 'AGGREGATING',
    creator: { residentName: 'Deepak Verma', unit: 'Tower C-802' },
    participants: [
      { residentName: 'Meera Nair', unit: 'Tower C-302', unitsBooked: 1, joinedAt: '2025-09-18' }
    ]
  },
  {
    id: 'pool-pest-bhooja-sep',
    communityId: 'comm-bhooja',
    serviceTitle: 'Herbal Odorless Pest Control Blitz',
    category: 'Pest Control',
    regularPrice: 1400,
    discountedPrice: 949,
    savingsPercent: 32,
    minThreshold: 15,
    currentParticipants: 12,
    deadline: '2025-09-28',
    status: 'AGGREGATING',
    creator: { residentName: 'Ananya Deshmukh', unit: 'Tower C-601' },
    participants: [
      { residentName: 'Karthik Raja', unit: 'Tower B-1402', unitsBooked: 1, joinedAt: '2025-09-18' },
      { residentName: 'Deepak Patel', unit: 'Tower A-404', unitsBooked: 1, joinedAt: '2025-09-17' }
    ]
  }
];

export const INITIAL_SERVICE_REQUESTS = [
  {
    id: 'REQ-20250918-001',
    communityId: 'comm-bhooja',
    category: 'AC Service',
    title: 'AC Servicing for 2 Split Units',
    description: 'Master bedroom Daikin 1.5T + Living room Mitsubishi 2.0T chemical wash',
    preferredDate: '2025-09-20',
    preferredTime: '10:00 AM - 04:00 PM',
    isGroupRequest: true,
    currentStep: 3,
    status: 'QUOTES_RECEIVED',
    residentName: 'Arjun Kumar',
    unit: 'Flat A-1204',
    phone: '+91 98765 43210',
    quotations: [
      {
        id: 'QUOTE-101',
        providerId: 'usr-prov-cool',
        providerName: 'CoolingPro AC Solutions',
        rating: 4.88,
        quoteAmount: 998,
        estimatedArrival: 'Tomorrow, 10:30 AM',
        warranty: '90-Day Cool-Gas Guarantee',
        status: 'PENDING'
      }
    ]
  },
  {
    id: 'REQ-20250919-002',
    communityId: 'comm-bhooja',
    category: 'Electrician',
    title: 'Main Distribution MCB Tripping & Smart Dimmer Installation',
    description: 'Living room chandelier dimmer installation and heavy appliance MCB load test',
    preferredDate: '2025-09-21',
    preferredTime: '02:00 PM - 05:00 PM',
    isGroupRequest: true,
    currentStep: 2,
    status: 'AWAITING_QUOTES',
    residentName: 'Priya Saxena',
    unit: 'Flat B-402',
    phone: '+91 98450 11223',
    quotations: []
  },
  {
    id: 'REQ-20250919-003',
    communityId: 'comm-bhooja',
    category: 'Plumber',
    title: 'RO Water Purifier Filter Change & Concealed Flush Tank Leak',
    description: 'Kent RO 3-stage filter replacement and master washroom flush button adjustment',
    preferredDate: '2025-09-22',
    preferredTime: '11:00 AM - 01:00 PM',
    isGroupRequest: false,
    currentStep: 2,
    status: 'AWAITING_QUOTES',
    residentName: 'Vikas Rao',
    unit: 'Flat A-701',
    phone: '+91 98111 22334',
    quotations: []
  },
  {
    id: 'REQ-20250920-004',
    communityId: 'comm-bhooja',
    category: 'Cook',
    title: 'Resident Requirement: Vegetarian North Indian Morning Cook Needed',
    description: 'Looking for a daily morning cook (07:30 AM to 09:30 AM) for 3-member family in Tower A',
    preferredDate: '2025-09-21',
    preferredTime: '07:30 AM',
    isGroupRequest: false,
    currentStep: 1,
    status: 'PENDING_STAFF_RESPONSE',
    residentName: 'Arjun Kumar',
    unit: 'Flat A-1204',
    phone: '+91 98765 43210',
    targetTrade: 'Cook'
  },
  {
    id: 'REQ-20250920-005',
    communityId: 'comm-bhooja',
    category: 'Maid',
    title: 'Resident Requirement: Daily Morning Maid for Sweeping, Mopping & Dishes',
    description: 'Daily 2-hour morning housekeeping shift required for 3BHK flat in Tower C',
    preferredDate: '2025-09-22',
    preferredTime: '08:00 AM',
    isGroupRequest: false,
    currentStep: 1,
    status: 'PENDING_STAFF_RESPONSE',
    residentName: 'Ananya Deshmukh',
    unit: 'Flat C-601',
    phone: '+91 98850 44332',
    targetTrade: 'Maid'
  },
  {
    id: 'REQ-20250920-006',
    communityId: 'comm-bhooja',
    category: 'Driver',
    title: 'Resident Requirement: Airport Pickup Driver for Late Night Flight',
    description: 'Need experienced chauffeur for SUV pickup from Hyderabad International Airport to My Home Bhooja',
    preferredDate: '2025-09-21',
    preferredTime: '11:30 PM',
    isGroupRequest: false,
    currentStep: 1,
    status: 'PENDING_STAFF_RESPONSE',
    residentName: 'Arjun Kumar',
    unit: 'Flat A-1204',
    phone: '+91 98765 43210',
    targetTrade: 'Driver'
  }
];

export const INITIAL_VERIFICATION_CASES = [
  {
    id: 'CASE-A1204',
    communityId: 'comm-bhooja',
    flatNumber: 'A-1204',
    tower: 'Tower A',
    status: 'UNDER_SECURITY_INSPECTION',
    currentStage: 4, // 1: Register, 2: Conflict, 3: Old Resident Notified, 4: Security Inspection, 5: Admin Approval, 6: Temp Access, 7: Permanent
    incomingResident: {
      name: 'Arjun Kumar',
      phone: '+91 98765 43210',
      email: 'arjun.kumar@example.com',
      type: 'Owner',
      requestType: 'TEMPORARY_ACCESS',
      requestedDays: 5,
      startDate: '2025-09-20',
      endDate: '2025-09-25',
      saleDeedUploaded: true,
      identityDocUploaded: true
    },
    existingResident: {
      name: 'Rahul G.',
      phone: '+91 98110 44552',
      registeredSince: '2022-04-10',
      status: 'VACATING_CONFIRMED',
      exitClearanceDues: 0
    },
    securityInspection: {
      guardName: 'Havaldar Ram Singh',
      guardBadge: 'SEC-4892',
      date: '2025-09-18',
      luggageDeparted: true,
      keysSurrendered: 3,
      meterReadingElectric: '14,821 kWh',
      status: 'SUBMITTED',
      notes: 'Luggage move-out observed at basement B2 lift lobby. 3 master keys and 1 lift RFID fob returned to estate office.'
    },
    adminDecision: {
      approvedBy: null,
      approvalDate: null,
      temporaryAccessGranted: false,
      permanentHandoverGranted: false
    }
  },
  {
    id: 'CASE-S501',
    communityId: 'comm-saket',
    flatNumber: 'B-501',
    tower: 'Tower B',
    status: 'AWAITING_ADMIN_APPROVAL',
    currentStage: 5,
    incomingResident: {
      name: 'Priya Sharma',
      phone: '+91 98220 54321',
      email: 'priya.sharma@example.com',
      type: 'Tenant',
      requestType: 'TEMPORARY_ACCESS',
      requestedDays: 5,
      startDate: '2025-09-21',
      endDate: '2025-09-26',
      saleDeedUploaded: true,
      identityDocUploaded: true
    },
    existingResident: {
      name: 'Ramesh Iyer',
      phone: '+91 98450 11223',
      registeredSince: '2021-06-15',
      status: 'VACATING_CONFIRMED',
      exitClearanceDues: 0
    },
    securityInspection: {
      guardName: 'Security In-Charge Vijay',
      guardBadge: 'SEC-3104',
      date: '2025-09-18',
      luggageDeparted: true,
      keysSurrendered: 2,
      meterReadingElectric: '9,450 kWh',
      status: 'SUBMITTED',
      notes: 'Key handover completed and biometric gate registration revoked for old resident.'
    },
    adminDecision: {
      approvedBy: null,
      approvalDate: null,
      temporaryAccessGranted: false,
      permanentHandoverGranted: false
    }
  },
  {
    id: 'CASE-P1102',
    communityId: 'comm-prestige',
    flatNumber: 'C-1102',
    tower: 'Tower C',
    status: 'TEMPORARY_ACCESS_ACTIVE',
    currentStage: 6,
    incomingResident: {
      name: 'Karthik Menon',
      phone: '+91 97410 99881',
      email: 'karthik.menon@example.com',
      type: 'Owner',
      requestType: 'TEMPORARY_ACCESS',
      requestedDays: 5,
      startDate: '2025-09-19',
      endDate: '2025-09-24',
      saleDeedUploaded: true,
      identityDocUploaded: true
    },
    existingResident: {
      name: 'Sunita Rao',
      phone: '+91 99800 33441',
      registeredSince: '2020-01-10',
      status: 'VACATING_CONFIRMED',
      exitClearanceDues: 0
    },
    securityInspection: {
      guardName: 'Guard Om Prakash',
      guardBadge: 'SEC-8921',
      date: '2025-09-17',
      luggageDeparted: true,
      keysSurrendered: 4,
      meterReadingElectric: '21,130 kWh',
      status: 'SUBMITTED',
      notes: 'Truck departure verified at North Gate. Keys surrendered.'
    },
    adminDecision: {
      approvedBy: 'Rajeshwar Rao',
      approvalDate: '2025-09-18',
      temporaryAccessGranted: true,
      allowedDays: 5,
      permanentHandoverGranted: false
    }
  },
  {
    id: 'CASE-AP704',
    communityId: 'comm-aparna',
    flatNumber: 'E-704',
    tower: 'Tower E',
    status: 'CONFLICT_DETECTED',
    currentStage: 2,
    incomingResident: {
      name: 'Deepa Nair',
      phone: '+91 98860 44556',
      email: 'deepa.nair@example.com',
      type: 'Tenant',
      requestType: 'PERMANENT',
      requestedDays: 0,
      startDate: '2025-09-22',
      endDate: '2026-09-21',
      saleDeedUploaded: true,
      identityDocUploaded: true
    },
    existingResident: {
      name: 'Vikram Verma',
      phone: '+91 98450 77889',
      registeredSince: '2023-08-01',
      status: 'ACTIVE_OCCUPANT',
      exitClearanceDues: 2400
    },
    securityInspection: {
      guardName: 'Guard Santosh Kumar',
      guardBadge: 'SEC-2231',
      date: '2025-09-18',
      luggageDeparted: false,
      keysSurrendered: 0,
      meterReadingElectric: '8,210 kWh',
      status: 'PENDING',
      notes: 'Pending resident confirmation on vacating date.'
    },
    adminDecision: {
      approvedBy: null,
      approvalDate: null,
      temporaryAccessGranted: false,
      permanentHandoverGranted: false
    }
  }
];

export const INITIAL_ADMIN_INVITATIONS = [
  {
    id: 'INV-BHOOJA-2025',
    communityId: 'comm-bhooja',
    communityName: 'My Home Bhooja',
    recipientName: 'S. Venkat Reddy',
    recipientEmail: 'president.bhooja@communityconnect.com',
    recipientMobile: '+91 98490 12345',
    role: 'COMMUNITY_ADMIN',
    status: 'ACCEPTED',
    token: 'cc-token-bhooja-99a81',
    sentDate: '2025-01-10',
    expiresDate: '2025-01-25',
    acceptedDate: '2025-01-11'
  },
  {
    id: 'INV-SAKET-2025',
    communityId: 'comm-saket',
    communityName: 'Saket Towers',
    recipientName: 'Elena Rostova',
    recipientEmail: 'admin.saket@communityconnect.com',
    recipientMobile: '+91 98480 99881',
    role: 'COMMUNITY_ADMIN',
    status: 'ACCEPTED',
    token: 'cc-token-saket-74f20',
    sentDate: '2025-01-20',
    expiresDate: '2025-02-05',
    acceptedDate: '2025-01-21'
  },
  {
    id: 'INV-NEW-GREENGLEN',
    communityId: 'comm-greenglen',
    communityName: 'Green Glen Manor',
    recipientName: 'Manoj Pillai',
    recipientEmail: 'president.greenglen@example.com',
    recipientMobile: '+91 98200 66554',
    role: 'COMMUNITY_ADMIN',
    status: 'PENDING',
    token: 'cc-token-greenglen-44321',
    sentDate: '2025-09-17',
    expiresDate: '2025-09-24',
    acceptedDate: null
  }
];

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post-mkt-1',
    communityId: 'comm-bhooja',
    author: 'Arjun Kumar',
    authorRole: 'RESIDENT',
    unit: 'Flat A-1204',
    title: 'Pre-owned Herman Miller Ergonomic Mesh Office Chair (Mint Condition)',
    content: 'Selling my Herman Miller Aeron Ergonomic Mesh Chair. Fully adjustable lumbar support, 3D armrests, and quiet polyurethane casters. Ideal for WFH. Purchased 8 months ago, selling because I am downsizing my home office setup.',
    price: '₹18,500',
    type: 'CLASSIFIED',
    category: 'MARKETPLACE',
    timestamp: '30 mins ago',
    pinned: false,
    isPinned: false,
    likes: 18,
    commentsCount: 3,
    comments: [
      {
        id: 'c-m101',
        author: 'Priya Verma',
        unit: 'Flat C-502',
        role: 'RESIDENT',
        text: 'Hi Arjun! Is this chair still available for inspection at Flat A-1204?',
        timestamp: '25 mins ago'
      },
      {
        id: 'c-m102',
        author: 'Arjun Kumar',
        unit: 'Flat A-1204',
        role: 'RESIDENT',
        text: 'Hi Priya! Yes, absolutely. You can visit Tower A Flat 1204 today evening post 6:00 PM to try it out.',
        timestamp: '15 mins ago'
      },
      {
        id: 'c-m103',
        author: 'Priya Verma',
        unit: 'Flat C-502',
        role: 'RESIDENT',
        text: 'Awesome! Will drop by around 6:30 PM. Thank you!',
        timestamp: '5 mins ago'
      }
    ]
  },
  {
    id: 'post-mkt-2',
    communityId: 'comm-bhooja',
    author: 'Priya Verma',
    authorRole: 'RESIDENT',
    unit: 'Flat C-502',
    title: 'DeLonghi Dedica Deluxe Espresso & Cappuccino Coffee Machine',
    content: 'Selling my 15-bar Italian pump DeLonghi coffee maker with steam milk frother wand and tamper. Perfect working condition, includes stainless steel milk pitcher.',
    price: '₹12,000',
    type: 'CLASSIFIED',
    category: 'MARKETPLACE',
    timestamp: '1 hour ago',
    pinned: false,
    isPinned: false,
    likes: 14,
    commentsCount: 2,
    comments: [
      {
        id: 'c-m201',
        author: 'S. Venkat Reddy (MC President)',
        unit: 'Management Committee',
        role: 'COMMUNITY_ADMIN',
        text: 'Hi Priya, does it include the portafilter basket for double shots?',
        timestamp: '45 mins ago'
      },
      {
        id: 'c-m202',
        author: 'Priya Verma',
        unit: 'Flat C-502',
        role: 'RESIDENT',
        text: 'Yes Mr. President, single shot, double shot, and ESE pod filters are all included!',
        timestamp: '30 mins ago'
      }
    ]
  },
  {
    id: 'post-grp-1',
    communityId: 'comm-bhooja',
    author: 'Suresh Varma (CoolingPro AC Solutions)',
    authorRole: 'SERVICE_PROVIDER',
    unit: 'AC Service Contractor',
    title: '🤝 Society Group AC Deep Cleaning & Chemical Wash Drive (Save 40%)',
    content: 'CoolingPro AC Solutions has launched a pre-monsoon group servicing drive for My Home Bhooja! Regular price ₹1,499 per unit, unlocked group price is ₹899 per unit when 15+ flats join. 16/20 slots already filled!',
    price: '₹899 / Unit (Save 40%)',
    type: 'GROUP_SERVICE',
    category: 'GROUP_SERVICE',
    timestamp: '2 hours ago',
    pinned: true,
    isPinned: true,
    likes: 29,
    commentsCount: 3,
    comments: [
      {
        id: 'c-g101',
        author: 'Arjun Kumar',
        unit: 'Flat A-1204',
        role: 'RESIDENT',
        text: 'Just registered 3 AC units for Flat A-1204! Glad we hit the 15-unit tier.',
        timestamp: '1 hour ago'
      },
      {
        id: 'c-g102',
        author: 'Priya Verma',
        unit: 'Flat C-502',
        role: 'RESIDENT',
        text: 'Count me in for 2 split ACs in Tower C! What date is the technician drive scheduled?',
        timestamp: '45 mins ago'
      },
      {
        id: 'c-g103',
        author: 'Suresh Varma (CoolingPro AC)',
        unit: 'Service Provider',
        role: 'SERVICE_PROVIDER',
        text: 'Hi Priya! Saturday drive starts at 9 AM. Our team will verify gate OTP and service Tower A & C first.',
        timestamp: '20 mins ago'
      }
    ]
  },
  {
    id: 'post-grp-2',
    communityId: 'comm-bhooja',
    author: 'Sunita Devi (Verified Home Cook)',
    authorRole: 'SERVICE_PROVIDER',
    unit: 'Gate OTP Access • Tower A & B',
    title: '👩‍🍳 Authentic North & South Indian Home Cooking (Evening Slot Open)',
    content: 'Police verified and estate background-cleared home cook available for daily breakfast, lunch, or dinner preparation. Specialized in North Indian thali, South Indian tiffin, and diabetic diet cooking.',
    price: '₹8,000 / Month',
    type: 'GROUP_SERVICE',
    category: 'SOLO_STAFF',
    timestamp: '3 hours ago',
    pinned: false,
    isPinned: false,
    likes: 22,
    commentsCount: 2,
    comments: [
      {
        id: 'c-g201',
        author: 'Priya Verma',
        unit: 'Flat C-502',
        role: 'RESIDENT',
        text: 'Sunita ji, are you available for the 6 PM - 8 PM evening dinner slot in Tower C?',
        timestamp: '2 hours ago'
      },
      {
        id: 'c-g202',
        author: 'Sunita Devi (Home Cook)',
        unit: 'Solo Staff',
        role: 'SERVICE_PROVIDER',
        text: 'Namaste Priya ji! Yes, 6 PM - 8 PM slot is available for Flat C-502. Gate OTP clearance is active.',
        timestamp: '1 hour ago'
      }
    ]
  },
  {
    id: 'post-grp-3',
    communityId: 'comm-bhooja',
    author: 'Lakshmi Bai (Verified Maid)',
    authorRole: 'SERVICE_PROVIDER',
    unit: 'Biometric Access • Tower C',
    title: '🧹 Professional Daily Housekeeping, Mopping & Utensil Care',
    content: 'Verified housekeeper maid with biometric facial recognition gate access at Gate 1. Punctual, hygienic, and highly rated by 12 society residents.',
    price: '₹5,000 / Month',
    type: 'GROUP_SERVICE',
    category: 'SOLO_STAFF',
    timestamp: '4 hours ago',
    pinned: false,
    isPinned: false,
    likes: 31,
    commentsCount: 1,
    comments: [
      {
        id: 'c-g301',
        author: 'Arjun Kumar',
        unit: 'Flat A-1204',
        role: 'RESIDENT',
        text: 'Lakshmi Bai cleans our Flat A-1204 impeccably every morning! Very trustworthy.',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'post-sec-1',
    communityId: 'comm-bhooja',
    author: 'Havaldar Ram Singh (Gate 1 Guard)',
    authorRole: 'SECURITY_TEAM',
    unit: 'Gate 1 Terminal',
    title: '🛡️ Gate 1 FastTag ANPR System & Delivery OTP Register Rules',
    content: 'All resident vehicles must ensure FastTag windshield stickers are clean for automated boom barrier clearance. Delivery partners (Zomato/Swiggy/Amazon) will only be granted entry upon resident OTP validation.',
    type: 'ANNOUNCEMENT',
    category: 'SECURITY',
    timestamp: '5 hours ago',
    pinned: false,
    isPinned: false,
    likes: 45,
    commentsCount: 2,
    comments: [
      {
        id: 'c-s101',
        author: 'S. Venkat Reddy (MC President)',
        unit: 'Management Committee',
        role: 'COMMUNITY_ADMIN',
        text: 'Thank you Ram Singh for enforcing zero-trust gate security protocols across both gates.',
        timestamp: '4 hours ago'
      },
      {
        id: 'c-s102',
        author: 'Devashish Sen (Platform HQ)',
        unit: 'CommunityConnect HQ',
        role: 'PLATFORM_ADMIN',
        text: 'Great operational discipline by Havaldar Ram Singh! ANPR barrier logs are synced to HQ audit.',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'post-1',
    communityId: 'comm-bhooja',
    author: 'S. Venkat Reddy (Estate President)',
    authorRole: 'COMMUNITY_ADMIN',
    unit: 'Management Committee Office',
    title: '🏊 Swimming Pool Routine Maintenance & Solar Water Heating Upgrade',
    content: 'The Olympic and kids pools will remain closed for chemical shock treatment and filtration overhaul on 20th Sept (06:00 AM - 04:00 PM). Normal access resumes for the evening swim session.',
    type: 'ANNOUNCEMENT',
    category: 'MAINTENANCE',
    timestamp: '6 hours ago',
    pinned: false,
    isPinned: false,
    likes: 52,
    commentsCount: 3,
    comments: [
      {
        id: 'c-101',
        author: 'Arjun Kumar',
        unit: 'Flat A-1204',
        role: 'RESIDENT',
        text: 'Will the heated pumps be active for the evening 6 PM session?',
        timestamp: '5 hours ago'
      },
      {
        id: 'c-102',
        author: 'S. Venkat Reddy (Estate President)',
        unit: 'MC Office',
        role: 'COMMUNITY_ADMIN',
        text: 'Yes Arjun, solar heat pumps will be switched on at 4 PM post chemical testing.',
        timestamp: '4 hours ago'
      },
      {
        id: 'c-103',
        author: 'Priya Verma',
        unit: 'Flat C-502',
        role: 'RESIDENT',
        text: 'Thank you President Reddy and MC team for keeping facilities clean!',
        timestamp: '3 hours ago'
      }
    ]
  }
];

export const INITIAL_VISITOR_PASSES = [
  {
    id: 'VIS-991',
    communityId: 'comm-bhooja',
    guestName: 'Zomato Delivery',
    visitorType: 'DELIVERY',
    phone: '+91 98111 22334',
    hostUnit: 'Flat A-1204',
    otpCode: '4829',
    status: 'EXPECTED',
    timestamp: 'Today, 12:45 PM'
  },
  {
    id: 'VIS-992',
    communityId: 'comm-bhooja',
    guestName: 'Rohit Sharma (Family Guest)',
    visitorType: 'GUEST',
    vehicleNumber: 'TS 08 AB 4912',
    phone: '+91 98450 00112',
    hostUnit: 'Flat A-1204',
    otpCode: '7104',
    status: 'EXPECTED',
    timestamp: 'Today, 07:00 PM'
  },
  {
    id: 'VIS-993',
    communityId: 'comm-bhooja',
    guestName: 'Amazon Logistics',
    visitorType: 'DELIVERY',
    phone: '+91 97000 33441',
    hostUnit: 'Tower A Smart Locker',
    otpCode: '1102',
    status: 'CHECKED_IN',
    timestamp: 'Today, 09:15 AM'
  }
];
