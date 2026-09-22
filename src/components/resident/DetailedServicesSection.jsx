import React, { useState, useEffect } from 'react';
import { serviceApi } from '../../api/serviceApi';

export const COMPREHENSIVE_SERVICES = [
  {
    id: 'ac-service',
    name: 'AC Jet Chemical Clean & Overhaul',
    category: 'cooling',
    categoryName: 'Air Conditioning',
    fulfillmentType: 'groupable', // 'groupable' = multi-house poolable | 'exclusive' = 100% dedicated to 1 flat
    weekendDrive: true,
    weekendSlotInfo: 'Saturday & Sunday Tower AC Chemical Jet Drive',
    icon: 'mode_fan',
    iconBg: 'bg-[#7ffc97]/40 text-[#006b2c]',
    tag: 'Pre-Festival Group Pool Active',
    badge: 'Police Verified Techs',
    rating: 4.88,
    reviewsCount: 342,
    startingPrice: 499,
    regularPrice: 750,
    groupDiscountPercent: 33,
    estimatedDuration: '45 - 60 mins per unit',
    serviceTypes: [
      'Split AC High-Pressure Chemical Jet Wash',
      'Window AC Comprehensive Deep Overhaul',
      'Refrigerant Leak Test & Eco Gas Top-Up',
      'Indoor Unit Water Leakage & Drain Clearing',
      'Complete AC Installation / Relocation / Dismantle',
      'Pre-Summer Multi-Unit Society AMC'
    ],
    description: 'Intensive high-pressure chemical jet wash of cooling coils, blower fan, drainage tray, and outdoor compressor. Includes temperature calibration, electrical amp check, and sanitization with hospital-grade disinfectant spray to eliminate mold and bacteria.',
    includedFeatures: [
      'Indoor cooling coil foam wash & bacterial sanitization',
      'Outdoor condenser unit chemical jet pressure spray',
      'Drain tray vacuuming & pipe blockage clearance',
      'Refrigerant pressure & gas level verification',
      '30-Day cool-air satisfaction warranty'
    ],
    starterPrompts: [
      'Living room split AC cooling has dropped significantly',
      'Indoor unit is leaking water droplets onto the floor',
      'Need routine chemical jet wash for 2 bedroom ACs',
      'Foul smell coming from AC vents when turned on'
    ]
  },
  {
    id: 'electrician',
    name: 'Master Electrician & Circuit Diagnostics',
    category: 'electrical',
    categoryName: 'Electrical',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Weekend Express Electrician Tower Run',
    icon: 'bolt',
    iconBg: 'bg-[#c9e6ff]/40 text-[#006591]',
    tag: 'Express 30-Min Dispatch',
    badge: 'Licensed Wireman',
    rating: 4.92,
    reviewsCount: 420,
    startingPrice: 199,
    regularPrice: 299,
    groupDiscountPercent: 20,
    estimatedDuration: '30 - 60 mins',
    serviceTypes: [
      'MCB Tripping, Short Circuit & Distribution Board Fix',
      'Smart Switchboard, Socket & Dimmer Replacement',
      'Ceiling Fan, Exhaust Fan & Chandelier Hanging',
      'Heavy Appliance Power Point (AC, Geyser, Microwave)',
      'Balcony & False Ceiling LED Strip Lighting Wiring',
      'Home Earthing & Voltage Surge Protector Installation'
    ],
    description: 'Certified electrical engineers equipped with digital multimeters, insulation testers, and safety gear. Covers diagnostic fault-finding, emergency fuse trips, appliance hookups, and complete rewiring with fire-retardant standard copper wiring.',
    includedFeatures: [
      'Multi-point voltage & current load testing',
      'Shock-proof terminal connections & sleeve insulation',
      'Safety MCB trip threshold verification',
      'Complimentary test of inverter backup loop'
    ],
    starterPrompts: [
      'Main MCB keeps tripping whenever geyser is turned on',
      'Need to replace 3 switchboards and install ceiling fan',
      'Sparks observed in master bedroom AC power socket',
      'Install decorative chandelier and LED strip profile'
    ]
  },
  {
    id: 'plumber',
    name: 'Plumbing & Sanitary Solutions',
    category: 'plumbing',
    categoryName: 'Plumbing',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Saturday & Sunday Plumbing Health Check',
    icon: 'plumbing',
    iconBg: 'bg-[#ffddb8]/50 text-[#825100]',
    tag: 'Same Day Service',
    badge: 'Certified Plumber',
    rating: 4.85,
    reviewsCount: 288,
    startingPrice: 249,
    regularPrice: 399,
    groupDiscountPercent: 25,
    estimatedDuration: '45 - 90 mins',
    serviceTypes: [
      'Faucet, Mixer Tap, Health Faucet & Shower Leak Repair',
      'Concealed Cistern & Dual-Flush Valve Overhaul',
      'Kitchen Sink & Bathroom Drain Blockage Jet Clearing',
      'RO Water Purifier Filter Replacement & TDS Tuning',
      'Water Heater / Geyser Inlet-Outlet Pipe Installation',
      'Balcony Drainage & Rainwater Pipe Seepage Rectification'
    ],
    description: 'Rapid-response sanitary experts for domestic and concealed pipe plumbing. We resolve persistent leaks, low water pressure, toilet cistern failures, and foul odor traps using non-destructive ultrasonic leak detectors and high-torque mechanical snakes.',
    includedFeatures: [
      'Teflon seal & washer replacement included',
      'Water pressure regulation & aerator de-scaling',
      'Post-repair pressure check to prevent hidden seepage',
      '30-Day leak-free guarantee'
    ],
    starterPrompts: [
      'Kitchen sink tap continuously dripping water',
      'Master toilet flush tank button stuck and water running',
      'Bathroom floor drain is clogging and draining very slowly',
      'Install new mixer faucet in guest washroom'
    ]
  },
  {
    id: 'cleaning-deep',
    name: 'Full Home Deep Scrub & Sanitization',
    category: 'cleaning',
    categoryName: 'Deep Cleaning',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Weekend Full-Flat Deep Scrub Pool',
    icon: 'cleaning_services',
    iconBg: 'bg-[#7ffc97]/50 text-[#006b2c]',
    tag: 'Most Popular',
    badge: '3-Member Crew',
    rating: 4.95,
    reviewsCount: 512,
    startingPrice: 1299,
    regularPrice: 1899,
    groupDiscountPercent: 30,
    estimatedDuration: '3 - 5 Hours',
    serviceTypes: [
      'Complete 2BHK / 3BHK Apartment Intensive Scrub',
      'Occupied Furnished Flat Deep Sanitization',
      'Pre-Move-In / Post-Move-Out Vacant Flat Cleaning',
      'Festival Deep Scrub with Floor Machine Buffing',
      'Balcony, Grille & Sliding Window Track Pressure Cleaning'
    ],
    description: 'Comprehensive top-to-bottom scrubbing of your entire apartment by a trained uniform crew using Taski German cleaning chemicals, single-disc floor scrubbers, and industrial HEPA vacuum cleaners.',
    includedFeatures: [
      'Kitchen tile degreasing, cabinets interior/exterior scrub',
      'Bathroom descaling, acid-free tile stain removal & fixtures shine',
      'High-level fan, cobweb, exhaust & door frame sanitization',
      'Balcony floor jet washing & sliding window track extraction',
      'Machine buffing for living room and bedroom floors'
    ],
    starterPrompts: [
      'Deep cleaning for 3BHK flat before festive family gathering',
      'Thorough descaling of 3 bathrooms and kitchen grease removal',
      'Vacant flat move-in deep scrub and machine floor polishing'
    ]
  },
  {
    id: 'cleaning-kitchen',
    name: 'Kitchen & Chimney Degreasing Blitz',
    category: 'cleaning',
    categoryName: 'Deep Cleaning',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Saturday & Sunday Kitchen Degreasing Blitz',
    icon: 'soup_kitchen',
    iconBg: 'bg-[#ffddb8]/60 text-[#825100]',
    tag: 'Group Savings Eligible',
    badge: 'Food Safe Chemicals',
    rating: 4.89,
    reviewsCount: 195,
    startingPrice: 699,
    regularPrice: 999,
    groupDiscountPercent: 30,
    estimatedDuration: '90 - 120 mins',
    serviceTypes: [
      'Electric Kitchen Chimney Baffle Filter & Rotor Degreasing',
      'Gas Stove Burner Brass Polishing & Pipe Safety Check',
      'Modular Kitchen Under-Counter Oil Stain Scrub',
      'Microwave, Oven & Refrigerator Exterior/Interior De-stain',
      'Backsplash Tiles Steam Wash & Grout Whitening'
    ],
    description: 'Targeted deep clean for high-grease kitchen zones. We dissolve stubborn oil sludge from chimney mesh, polish stainless steel stove burners, and steam-clean tile grout lines using organic, food-safe degreasers.',
    includedFeatures: [
      'Chimney filter hot water chemical dip',
      'Motor housing and oil collector cup emptying & sanitizing',
      'Sink basin descaling & stainless steel polish',
      'Safe for granite, quartz, and acrylic surfaces'
    ],
    starterPrompts: [
      'Kitchen chimney baffle filters are heavy with grease',
      'Deep scrub for kitchen tile walls, counter slab, and cabinets',
      'Degrease gas hob burners and unclog flame jets'
    ]
  },
  {
    id: 'cleaning-sofa',
    name: 'Sofa & Fabric Upholstery Wet Extraction',
    category: 'cleaning',
    categoryName: 'Deep Cleaning',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Sunday Sofa & Mattress Deep Extraction',
    icon: 'chair',
    iconBg: 'bg-[#c9e6ff]/50 text-[#006591]',
    tag: 'Anti-Allergen',
    badge: 'Kärcher Equipment',
    rating: 4.86,
    reviewsCount: 174,
    startingPrice: 499,
    regularPrice: 799,
    groupDiscountPercent: 25,
    estimatedDuration: '45 - 90 mins',
    serviceTypes: [
      'Fabric Sofa 3+2 Seater Foam Injection & Extraction',
      'Leather / Leatherette Sofa Cream Conditioning & Polish',
      'Dining Chair Fabric Cushion Deep Shampooing',
      'King / Queen Mattress Anti-Dust-Mite UV Sanitization',
      'Living Room Heavy Carpet / Rug Wet Shampoo'
    ],
    description: 'Deep injection-extraction shampooing using hot-water extraction technology to remove ground-in food stains, pet dander, beverage spills, and dust-mites without damaging delicate fabrics.',
    includedFeatures: [
      'Dry vacuuming to remove loose pet hair & grit',
      'Biodegradable foam agitation & spot stain treatment',
      'High-power moisture suction (dries in 2-3 hours)',
      'Antimicrobial deodorizer mist applied'
    ],
    starterPrompts: [
      '3-seater fabric sofa has beverage stains and dust',
      'Deep shampooing for 6 dining chairs and living room rug',
      'King-size mattress anti-dust mite sanitization'
    ]
  },
  {
    id: 'pest-herbal',
    name: 'Odorless Herbal Pest & Roach Control',
    category: 'pest',
    categoryName: 'Pest Control',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Saturday Tower Perimeter Pest Drive',
    icon: 'pest_control',
    iconBg: 'bg-[#7ffc97]/50 text-[#006b2c]',
    tag: 'Safe for Kids & Pets',
    badge: 'Bayer Certified',
    rating: 4.93,
    reviewsCount: 366,
    startingPrice: 599,
    regularPrice: 899,
    groupDiscountPercent: 33,
    estimatedDuration: '30 - 45 mins',
    serviceTypes: [
      'Kitchen & Bathroom Herbal Gel Dotting (Roaches & Ants)',
      'Whole-Flat Micro-Emulsion Spray (Zero Odor)',
      'Drain Line Residual Insecticide Treatment',
      'Fly & Mosquito Indoor Misting',
      'Annual 3-Service Society Protection Contract'
    ],
    description: 'Completely odorless and non-toxic herbal pest control certified safe for infants, pregnant women, and pets. No need to empty kitchen cabinets or vacate the premises.',
    includedFeatures: [
      'Targeted Bayer gel dots in all cabinet hinges & electrical conduits',
      'Perimeter crack & crevice baiting',
      'Free warranty re-visit if pests seen within 60 days',
      'Zero residue, zero offensive fumes'
    ],
    starterPrompts: [
      'Small cockroaches spotted near kitchen sink and microwave',
      'Preventive odorless herbal pest spray for entire flat',
      'Ant infestation near balcony sliding door'
    ]
  },
  {
    id: 'pest-termite',
    name: 'Subterranean Termite Barrier Shield',
    category: 'pest',
    categoryName: 'Pest Control',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Weekend Termite Barrier Drill Drive',
    icon: 'shield',
    iconBg: 'bg-[#ffddb8]/60 text-[#825100]',
    tag: '3-Year Society Warranty',
    badge: 'Drill-Fill-Seal Tech',
    rating: 4.91,
    reviewsCount: 142,
    startingPrice: 1499,
    regularPrice: 2200,
    groupDiscountPercent: 32,
    estimatedDuration: '2 - 3 Hours',
    serviceTypes: [
      'Main Door Frame & Wardrobe Drill-Fill Chemical Barrier',
      'Wall Skirting Perimeter Drill Treatment',
      'False Ceiling Wood Ingress Inspection & Spray',
      'Wooden Flooring Sub-Base Termite Prevention',
      'Pre-Construction / Renovation Wood Shielding'
    ],
    description: 'Comprehensive anti-termite treatment utilizing odorless Premise chemicals injected via precision 12mm holes along wooden door frames, baseboards, and wardrobes, sealed with color-matched wax.',
    includedFeatures: [
      'Deep chemical injection directly into colony galleries',
      'Aesthetic wax plugging matches wood grain color',
      'Official 3-year society-backed warranty certificate',
      'Periodic free bi-annual audit inspections'
    ],
    starterPrompts: [
      'Wood dust and mud trails found near master bedroom door frame',
      'Termite inspection for modular wooden wardrobes'
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpentry & Architectural Woodwork',
    category: 'carpentry',
    categoryName: 'Carpentry',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Saturday Woodwork & Smart Lock Installation',
    icon: 'carpenter',
    iconBg: 'bg-[#ffddb8]/60 text-[#825100]',
    tag: 'Skilled Craftsmen',
    badge: 'Precision Tools',
    rating: 4.87,
    reviewsCount: 230,
    startingPrice: 249,
    regularPrice: 399,
    groupDiscountPercent: 25,
    estimatedDuration: '45 - 90 mins',
    serviceTypes: [
      'Godrej / Yale Main Door Smart Lock & Mortise Install',
      'Hydraulic Cabinet Hinge & Soft-Close Channel Alignment',
      'IKEA / Wooden Bed, Wardrobe & Dining Table Assembly',
      'Balcony Pigeon Net Wooden/Aluminum Frame Installation',
      'Custom Floating Bookshelves & Wall TV Unit Mounting',
      'Stuck Wooden Door Sanding & Floor Level Alignment'
    ],
    description: 'Skilled furniture carpenters and wood craftsmen for precision repairs, lock replacements, modular kitchen adjustments, and flatpack furniture assembly.',
    includedFeatures: [
      'Heavy-duty anchors and Fischer nylon wall plugs provided',
      'Precision spirit level alignment for shelves & brackets',
      'Vacuum clean-up of sawdust post work',
      'Hardware lubricant application on moving hinges'
    ],
    starterPrompts: [
      'Kitchen cabinet door hinge has come loose and sagging',
      'Install digital biometric door lock on main entrance',
      'Assemble newly delivered wooden bed and study desk',
      'Bedroom door is rubbing against floor tile'
    ]
  },
  {
    id: 'cook-maid',
    name: 'Verified Home Cook & Culinary Chef',
    category: 'staff',
    categoryName: 'Domestic Staff',
    fulfillmentType: 'exclusive', // Special 1-on-1: Cook cannot go to multiple houses simultaneously
    weekendDrive: false,
    exclusiveNotice: 'Dedicated In-Kitchen Chef: Reserved 100% for your flat — cannot be split between multiple kitchens.',
    icon: 'restaurant',
    iconBg: 'bg-[#7ffc97]/50 text-[#006b2c]',
    tag: 'Background Checked',
    badge: 'Gate Pass Ready',
    rating: 4.82,
    reviewsCount: 180,
    startingPrice: 2499,
    regularPrice: 3200,
    groupDiscountPercent: 20,
    estimatedDuration: 'Monthly / Daily Shifts',
    serviceTypes: [
      'Daily 2-Meal Cook (Breakfast & Lunch / Dinner)',
      'North Indian / South Indian Vegetarian Culinary Specialist',
      'Jain Dietary Compliant Cook (No Onion/Garlic)',
      'Weekend Party / Festival Feast Guest Cook on Demand',
      'Healthy Calorie-Tracked Meal Prep for Gym & Diabetics'
    ],
    description: 'Police-verified and health-screened home cooks skilled in wholesome, hygienic Indian and multi-cuisine meal preparation according to your family taste and spice preferences.',
    includedFeatures: [
      'Police verification & local ID biometric authenticated at gate',
      'Annual medical hygiene & typhoid screening verified',
      'Free replacement guarantee within 48 hours if unsatisfied',
      'Complimentary kitchen countertop wipedown post-cooking'
    ],
    starterPrompts: [
      'Looking for vegetarian North Indian cook for morning shift',
      'Need guest cook for family get-together on Sunday lunch'
    ]
  },
  {
    id: 'housekeeping',
    name: 'Verified Daily Maid & Housekeeper',
    category: 'staff',
    categoryName: 'Domestic Staff',
    fulfillmentType: 'exclusive',
    weekendDrive: false,
    exclusiveNotice: 'Dedicated Household Helper: 1-on-1 private domestic shift for your unit.',
    icon: 'badge',
    iconBg: 'bg-[#c9e6ff]/50 text-[#006591]',
    tag: 'Police Verified',
    badge: 'Biometric Gate Access',
    rating: 4.84,
    reviewsCount: 260,
    startingPrice: 1999,
    regularPrice: 2600,
    groupDiscountPercent: 20,
    estimatedDuration: 'Daily 1 - 2 Hours',
    serviceTypes: [
      'Daily Sweeping, Wet Mopping & Dusting (1-Hour Shift)',
      'Daily Utensil Dishwashing & Kitchen Counter Wash',
      'Clothes Machine Load, Line Drying & Ironing',
      'Full-Day 8-Hour Domestic Help & Elder Assistance',
      'Temporary 3-Day Sick Leave Substitute Maid'
    ],
    description: 'Reliable, community-cleared domestic helpers for routine household chores with verified permanent address records and real-time biometric tracking at security gates.',
    includedFeatures: [
      'Background verification & Aadhaar cross-validated',
      'Automated attendance tracking via Gate 1 facial scanner',
      'Society grievance officer escalation support',
      'Flexible morning or evening time slots'
    ],
    starterPrompts: [
      'Need daily morning maid for sweeping, mopping and dishes',
      'Temporary 3-day substitute housekeeper required'
    ]
  },
  {
    id: 'driver',
    name: 'On-Demand Chauffeur & Driver',
    category: 'staff',
    categoryName: 'Domestic Staff',
    fulfillmentType: 'exclusive',
    weekendDrive: false,
    exclusiveNotice: 'Dedicated Chauffeur: Full-time or hourly allocation exclusively for your family vehicle.',
    icon: 'directions_car',
    iconBg: 'bg-[#c9e6ff]/50 text-[#006591]',
    tag: 'Uniformed & Verified',
    badge: 'Commercial DL Verified',
    rating: 4.90,
    reviewsCount: 155,
    startingPrice: 399,
    regularPrice: 550,
    groupDiscountPercent: 25,
    estimatedDuration: 'Hourly / Full Day',
    serviceTypes: [
      'City Driving & Errands (4 Hours / 40 km)',
      'RGIA Hyderabad Airport Late Night Pickup / Drop',
      'Outstation Weekend Trip (Warangal, Srisailam, Vijayawada)',
      'Luxury Automatic & EV Car Chauffeur (BMW, Tesla, Audi)',
      'Monthly Full-Time Office Commute Chauffeur'
    ],
    description: 'Professional, courteous chauffeurs experienced in manual, automatic, and electric vehicles with immaculate driving records and thorough route knowledge.',
    includedFeatures: [
      'Commercial driving license & zero accident record verified',
      'Uniformed with white gloves and masks',
      'Real-time GPS tracking and dashcam support',
      'Emergency roadside assistance trained'
    ],
    starterPrompts: [
      'Airport drop at 11:30 PM tonight for family flight',
      'Full-day outstation driver for Saturday family trip'
    ]
  },
  {
    id: 'appliance-repair',
    name: 'Major Home Appliance Repair',
    category: 'appliances',
    categoryName: 'Appliances',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Saturday & Sunday Multi-Appliance Tech Drive',
    icon: 'kitchen',
    iconBg: 'bg-[#ffddb8]/60 text-[#825100]',
    tag: 'OEM Spare Parts',
    badge: '90-Day Warranty',
    rating: 4.86,
    reviewsCount: 210,
    startingPrice: 299,
    regularPrice: 450,
    groupDiscountPercent: 20,
    estimatedDuration: '45 - 90 mins',
    serviceTypes: [
      'Washing Machine (Front / Top Load) Drum, Motor & Drain Error',
      'Refrigerator Frost Overload, Cooling Loss & Compressor Relay',
      'Microwave Oven Magnetron & Touchpad Breakdown',
      'Instant / Storage Water Heater (Geyser) Heating Element Fix',
      'Dishwasher Sensor & Water Spray Arm Unclogging'
    ],
    description: 'Certified appliance repair technicians for Samsung, LG, Whirlpool, Bosch, IFB, and Daikin. Quick diagnostics with transparent spare part pricing backed by genuine OEM warranties.',
    includedFeatures: [
      'Transparent digital price quote before opening screws',
      'Genuine factory replacement parts with invoice bill',
      '90-Day part & service performance guarantee',
      'Clean post-repair testing and calibration'
    ],
    starterPrompts: [
      'Front load washing machine making loud thumping sound during spin',
      'Geyser water is not heating up and pilot light is off',
      'Double door refrigerator freezer working but lower fridge warm'
    ]
  },
  {
    id: 'gardening',
    name: 'Balcony Garden Doctor & Drip Irrigation',
    category: 'gardening',
    categoryName: 'Gardening & Plants',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Sunday Morning Balcony Plant Clinic',
    icon: 'yard',
    iconBg: 'bg-[#7ffc97]/50 text-[#006b2c]',
    tag: 'Green Living',
    badge: 'Horticulturist',
    rating: 4.94,
    reviewsCount: 118,
    startingPrice: 349,
    regularPrice: 499,
    groupDiscountPercent: 25,
    estimatedDuration: '60 - 90 mins',
    serviceTypes: [
      'Balcony Plant Health Diagnostic, Pruning & Repotting',
      'Organic Vermicompost & Neem Oil Pest Treatment',
      'Automated Solar / Timer Drip Irrigation Kit Installation',
      'Indoor Air-Purifying Plant Setup (Areca, Snake, ZZ Plant)',
      'Vertical Wall Herb Garden Design & Setup'
    ],
    description: 'Expert urban horticulturists bringing lush greenery to your high-rise balcony with customized soil mixtures, organic pest defenses, and automated watering solutions.',
    includedFeatures: [
      'Premium vermicompost and cocopeat replenishment',
      'Organic anti-fungal spray applied to leaves and soil',
      'Plant health report with sunlight and watering guide',
      'Debris sweep and balcony railing wash included'
    ],
    starterPrompts: [
      'Balcony plants turning yellow and need fertilizer repotting',
      'Setup automated drip irrigation timer before traveling'
    ]
  },
  {
    id: 'car-wash',
    name: 'Eco Waterless Car Wash & Detailing',
    category: 'vehicle',
    categoryName: 'Vehicle Care',
    fulfillmentType: 'groupable',
    weekendDrive: true,
    weekendSlotInfo: 'Saturday & Sunday Basement Parking Detailing',
    icon: 'local_car_wash',
    iconBg: 'bg-[#c9e6ff]/50 text-[#006591]',
    tag: 'Zero Water Waste',
    badge: 'Basement Bay Doorstep',
    rating: 4.88,
    reviewsCount: 390,
    startingPrice: 299,
    regularPrice: 450,
    groupDiscountPercent: 30,
    estimatedDuration: '45 mins at your parking bay',
    serviceTypes: [
      'Hatchback / Sedan Waterless Polymer Spray Wash',
      'SUV / Luxury Vehicle Exterior Detailing & Carnauba Wax',
      'Interior HEPA Vacuum, Mat Wash & Dashboard UV Conditioning',
      'Glass Water Spot Removal & Anti-Rain Shield Coating',
      'Monthly Daily Parking Bay Wipe & Weekend Foam Wash'
    ],
    description: 'Eco-friendly waterless car wash executed right at your designated basement parking slot (Tower A Basement B1/B2) without making floor surfaces wet or slippery.',
    includedFeatures: [
      'Scratch-proof microfiber polymer encapsulation technology',
      'Tire black dressing & alloy wheel degreasing',
      'High-power 1200W cabin suction vacuuming',
      'Air conditioning vent fragrance diffuser applied'
    ],
    starterPrompts: [
      'Complete interior vacuum and waterless exterior foam wash',
      'SUV windshield water spot removal and ceramic wax shine'
    ]
  },
  {
    id: 'tutor',
    name: 'Home Tutor & Academic Mentor',
    category: 'education',
    categoryName: 'Education',
    fulfillmentType: 'exclusive', // Special 1-on-1 private academic coaching
    weekendDrive: false,
    exclusiveNotice: 'Private 1-on-1 Mentor: Personalized academic coaching for your child only.',
    icon: 'school',
    iconBg: 'bg-[#ffddb8]/60 text-[#825100]',
    tag: 'Top Educators',
    badge: 'IIT / NIT Mentors',
    rating: 4.96,
    reviewsCount: 165,
    startingPrice: 600,
    regularPrice: 900,
    groupDiscountPercent: 25,
    estimatedDuration: '60 mins / Class',
    serviceTypes: [
      'CBSE / ICSE / IB Math & Physics Conceptual Coaching (Grades 6-12)',
      'Coding, Robotics & Python AI for Kids (Ages 8-16)',
      'Foreign Languages (French, Spanish, German Conversation)',
      'Grandmaster Chess Strategy & Analytical Mind Training',
      'Acoustic Guitar, Keyboard & Classical Carnatic/Hindustani'
    ],
    description: 'Qualified resident and visiting academic mentors offering personalized one-on-one or small group coaching inside community study suites or at your residence.',
    includedFeatures: [
      'Free 30-minute diagnostic session with parents & student',
      'Customized syllabus pace and exam milestone tracking',
      'Police-verified credentials and university degree audited',
      'Weekly progress analytics shared via WhatsApp'
    ],
    starterPrompts: [
      'Math & Physics home tutor for Class 10 CBSE boards',
      'Beginner acoustic guitar lessons on weekend mornings'
    ]
  }
];

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Services', icon: 'apps', count: 16 },
  { id: 'cooling', label: 'AC & Cooling', icon: 'mode_fan', count: 1 },
  { id: 'electrical', label: 'Electrical', icon: 'bolt', count: 1 },
  { id: 'plumbing', label: 'Plumbing', icon: 'plumbing', count: 1 },
  { id: 'cleaning', label: 'Cleaning & Hygiene', icon: 'cleaning_services', count: 3 },
  { id: 'pest', label: 'Pest Control', icon: 'pest_control', count: 2 },
  { id: 'carpentry', label: 'Carpentry', icon: 'carpenter', count: 1 },
  { id: 'staff', label: 'Domestic Staff & Driver', icon: 'group', count: 3 },
  { id: 'appliances', label: 'Appliances', icon: 'kitchen', count: 1 },
  { id: 'vehicle', label: 'Vehicle Care', icon: 'directions_car', count: 1 },
  { id: 'gardening', label: 'Gardening', icon: 'yard', count: 1 },
  { id: 'education', label: 'Tutors & Mentors', icon: 'school', count: 1 }
];

// Helper date functions for interactive date selection
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

const getNextWeekISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate upcoming Saturday and Sunday dates for Weekend Drives & Group Pooling
const getUpcomingWeekend = () => {
  const d = new Date();
  const currentDay = d.getDay(); // 0 = Sun, 6 = Sat
  let satDiff = (6 - currentDay + 7) % 7;
  if (satDiff === 0 && d.getHours() >= 17) {
    satDiff = 7;
  }
  const satDate = new Date();
  satDate.setDate(d.getDate() + satDiff);

  const sunDate = new Date();
  sunDate.setDate(satDate.getDate() + 1);

  const toISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const satISO = toISO(satDate);
  const sunISO = toISO(sunDate);

  return {
    saturdayISO: satISO,
    sundayISO: sunISO,
    defaultWeekendISO: satISO,
    displayLabel: `This Weekend (${formatDisplayDate(satISO, 'Sat')} & ${formatDisplayDate(sunISO, 'Sun')})`
  };
};

const getUpcomingSaturdayISO = () => {
  return getUpcomingWeekend().saturdayISO;
};

// Convert 24-hour time "HH:MM" to readable 12-hour "hh:mm AM/PM"
const format12HourTime = (time24) => {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 becomes 12
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
};

// Custom Service Categories & Quick Starter Suggestions
const CUSTOM_SERVICE_CATEGORIES = [
  'Electrical & Smart Home',
  'Plumbing & Sanitary Fittings',
  'Air Conditioning & Cooling',
  'Deep Cleaning & Sanitization',
  'Kitchen & Chimney Degreasing',
  'Sofa, Carpet & Upholstery Care',
  'Pest & Termite Eradication',
  'Carpentry & Custom Woodwork',
  'Balcony Safety, Mesh & Grilles',
  'Waterproofing & Wall Seepage',
  'Appliance Repairs (Fridge, WM, Oven)',
  'Painting & Texture Touch-ups',
  'Civil, Tiling & Masonry Repair',
  'Balcony Gardening & Plant Care',
  'Domestic Staff, Cooks & Chauffeurs',
  'Other Custom Home Requirement'
];

const CUSTOM_STARTER_PROMPTS = [
  {
    label: 'Balcony Safety Grille & Net',
    title: 'Balcony Invisible Safety Grille & Anti-Bird Net Installation',
    desc: 'Need 316 stainless steel invisible safety grilles and durable transparent bird netting for master and utility balconies.',
    category: 'Balcony Safety, Mesh & Grilles',
    budget: 3500,
    fulfillmentType: 'groupable'
  },
  {
    label: 'Under-Sink RO Purifier',
    title: 'Under-Sink RO Water Purifier & Inlet Tap Installation',
    desc: 'Install new concealed RO water purifier unit under kitchen sink with bypass valve, pressure check, and granite counter faucet drilling.',
    category: 'Plumbing & Sanitary Fittings',
    budget: 650,
    fulfillmentType: 'groupable'
  },
  {
    label: 'Weekend Party Guest Chef',
    title: 'Dedicated Weekend Party Culinary Chef for Family Dinner',
    desc: 'Require an exclusive dedicated vegetarian/multi-cuisine chef to cook fresh appetizers, main course and desserts in our flat kitchen on Sunday evening from 5 PM to 9:30 PM. 100% dedicated to our home.',
    category: 'Domestic Staff, Cooks & Chauffeurs',
    budget: 1800,
    fulfillmentType: 'exclusive'
  },
  {
    label: 'Sliding Door Track Fix',
    title: 'Balcony Sliding Glass Door Track Roller & Lock Repair',
    desc: 'Heavy sliding glass door in living balcony is jammed and off bottom roller track. Needs wheel replacement and alignment.',
    category: 'Carpentry & Custom Woodwork',
    budget: 450,
    fulfillmentType: 'groupable'
  },
  {
    label: 'Substitute Housekeeper',
    title: 'Dedicated Full-Day Household Helper & Maid on Demand',
    desc: 'Need dedicated full-day domestic help for 8 hours for deep dishwashing, wardrobe sorting, laundry and family assistance. Exclusive shift for our flat.',
    category: 'Domestic Staff, Cooks & Chauffeurs',
    budget: 1100,
    fulfillmentType: 'exclusive'
  },
  {
    label: 'Heavy Chandelier Anchor',
    title: 'Heavy Dining Chandelier Ceiling Anchor & Wiring Setup',
    desc: 'Ceiling reinforcement and concealed electrical anchor wiring needed for mounting a 12kg crystal chandelier in dining area.',
    category: 'Electrical & Smart Home',
    budget: 850,
    fulfillmentType: 'groupable'
  },
  {
    label: 'Tile Regrouting & Anti-Skid',
    title: 'Master Bathroom Tile Epoxy Regrouting & Anti-Skid Seal',
    desc: 'Shower area tiles have discolored grout lines with minor seepage. Require waterproof epoxy regrouting and anti-skid treatment.',
    category: 'Civil, Tiling & Masonry Repair',
    budget: 1200,
    fulfillmentType: 'groupable'
  },
  {
    label: 'Digital Fingerprint Door Lock',
    title: 'Biometric Smart Fingerprint Door Lock Installation',
    desc: 'Installation and timber mortise routing for new digital biometric fingerprint/passcode smart lock on main hardwood entrance door.',
    category: 'Carpentry & Custom Woodwork',
    budget: 950,
    fulfillmentType: 'groupable'
  }
];

export const DetailedServicesSection = ({ currentUser, showToast, onPassGenerated }) => {
  const [subView, setSubView] = useState('catalog'); // 'catalog' | 'requests' | 'pools'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all'); // 'all' | 'groupable' | 'exclusive' | 'weekend'

  // Requests state from API
  const [serviceRequests, setServiceRequests] = useState(() => serviceApi.getRequests());
  const [groupPools, setGroupPools] = useState(() => serviceApi.getPools());

  // Detailed Standard Booking Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [unitsCount, setUnitsCount] = useState(1);
  const [selectedDateISO, setSelectedDateISO] = useState(() => getTomorrowISO());
  const [preferredDate, setPreferredDate] = useState(() => formatDisplayDate(getTomorrowISO(), 'Tomorrow'));
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [standardExactTime, setStandardExactTime] = useState('');
  const [standardCustomTimeNote, setStandardCustomTimeNote] = useState('');
  const [joinGroupPoolToggle, setJoinGroupPoolToggle] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Custom Service Request Modal state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState('Electrical & Smart Home');
  const [customFulfillmentType, setCustomFulfillmentType] = useState('groupable'); // 'groupable' | 'exclusive'
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customUrgency, setCustomUrgency] = useState('NORMAL'); // 'NORMAL' | 'HIGH' | 'EMERGENCY'
  const [customPricingMode, setCustomPricingMode] = useState('INSPECTION'); // 'INSPECTION' | 'BUDGET'
  const [customBudget, setCustomBudget] = useState(650);
  const [customDateISO, setCustomDateISO] = useState(() => getTomorrowISO());
  const [customPreferredDate, setCustomPreferredDate] = useState(() => formatDisplayDate(getTomorrowISO(), 'Tomorrow'));
  const [customPreferredTime, setCustomPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [customExactTime, setCustomExactTime] = useState('');
  const [customTimeNote, setCustomTimeNote] = useState('');
  const [customJoinPool, setCustomJoinPool] = useState(true);
  const [customSpecialInstructions, setCustomSpecialInstructions] = useState('');

  // Expand quotation state for tracking
  const [expandedRequestId, setExpandedRequestId] = useState('REQ-20250918-001');

  // Refresh lists
  const refreshData = () => {
    setServiceRequests(serviceApi.getRequests());
    setGroupPools(serviceApi.getPools());
  };

  // Standard modal quick date selector handler (Today, Tomorrow, Weekend, Next Week)
  const handleSelectQuickDate = (type) => {
    let iso;
    let prefix;
    if (type === 'today') {
      iso = getTodayISO();
      prefix = 'Today';
    } else if (type === 'tomorrow') {
      iso = getTomorrowISO();
      prefix = 'Tomorrow';
    } else if (type === 'weekend') {
      const weekend = getUpcomingWeekend();
      iso = weekend.saturdayISO;
      prefix = 'This Weekend';
    } else if (type === 'next-week') {
      iso = getNextWeekISO();
      prefix = 'Next Week';
    }
    setSelectedDateISO(iso);
    setPreferredDate(formatDisplayDate(iso, prefix));
  };

  // Standard modal custom calendar date picker change handler
  const handleCustomDateChange = (e) => {
    const iso = e.target.value;
    if (!iso) return;
    setSelectedDateISO(iso);
    const todayISO = getTodayISO();
    const tomorrowISO = getTomorrowISO();
    const nextWeekISO = getNextWeekISO();
    let prefix = '';
    if (iso === todayISO) prefix = 'Today';
    else if (iso === tomorrowISO) prefix = 'Tomorrow';
    else if (iso === nextWeekISO) prefix = 'Next Week';
    setPreferredDate(formatDisplayDate(iso, prefix));
  };

  // Standard modal exact time input picker change handler
  const handleStandardExactTimeChange = (e) => {
    const val = e.target.value; // "14:30"
    setStandardExactTime(val);
    if (val) {
      const formatted = format12HourTime(val);
      setPreferredTime(`Exact at ${formatted}`);
    }
  };

  // Standard modal custom text note for time requirements
  const handleStandardCustomTimeNoteChange = (e) => {
    const val = e.target.value;
    setStandardCustomTimeNote(val);
    if (val.trim()) {
      setPreferredTime(val.trim());
    }
  };

  // Custom modal quick date selector handler (Today, Tomorrow, Weekend, Next Week)
  const handleCustomModalQuickDate = (type) => {
    let iso;
    let prefix;
    if (type === 'today') {
      iso = getTodayISO();
      prefix = 'Today';
    } else if (type === 'tomorrow') {
      iso = getTomorrowISO();
      prefix = 'Tomorrow';
    } else if (type === 'weekend') {
      const weekend = getUpcomingWeekend();
      iso = weekend.saturdayISO;
      prefix = 'This Weekend';
    } else if (type === 'next-week') {
      iso = getNextWeekISO();
      prefix = 'Next Week';
    }
    setCustomDateISO(iso);
    setCustomPreferredDate(formatDisplayDate(iso, prefix));
  };

  // Custom modal calendar date picker change handler
  const handleCustomModalDateChange = (e) => {
    const iso = e.target.value;
    if (!iso) return;
    setCustomDateISO(iso);
    const todayISO = getTodayISO();
    const tomorrowISO = getTomorrowISO();
    const nextWeekISO = getNextWeekISO();
    let prefix = '';
    if (iso === todayISO) prefix = 'Today';
    else if (iso === tomorrowISO) prefix = 'Tomorrow';
    else if (iso === nextWeekISO) prefix = 'Next Week';
    setCustomPreferredDate(formatDisplayDate(iso, prefix));
  };

  // Custom modal exact time picker change handler
  const handleCustomExactTimeChange = (e) => {
    const val = e.target.value;
    setCustomExactTime(val);
    if (val) {
      const formatted = format12HourTime(val);
      setCustomPreferredTime(`Exact at ${formatted}`);
    }
  };

  // Custom modal custom time text note change handler
  const handleCustomTimeNoteChange = (e) => {
    const val = e.target.value;
    setCustomTimeNote(val);
    if (val.trim()) {
      setCustomPreferredTime(val.trim());
    }
  };

  // Open booking modal for a specific standard service
  const handleOpenBookingModal = (service, prefilledType = '', preselectedDate = null, forceWeekend = false) => {
    setSelectedService(service);
    setSelectedType(prefilledType || service.serviceTypes[0] || service.name);
    setDescriptionText('');
    setUnitsCount(1);

    if (forceWeekend || preselectedDate === 'weekend') {
      const weekend = getUpcomingWeekend();
      setSelectedDateISO(weekend.saturdayISO);
      setPreferredDate(formatDisplayDate(weekend.saturdayISO, 'This Weekend'));
    } else {
      const tomorrowISO = getTomorrowISO();
      setSelectedDateISO(tomorrowISO);
      setPreferredDate(formatDisplayDate(tomorrowISO, 'Tomorrow'));
    }

    setPreferredTime('10:00 AM - 12:00 PM');
    setStandardExactTime('');
    setStandardCustomTimeNote('');
    // If service is exclusive to 1 house (cook, maid, driver, tutor), disable group pool by default
    setJoinGroupPoolToggle(service.fulfillmentType === 'groupable');
    setSpecialInstructions('');
    setIsModalOpen(true);
  };

  // Open Custom Service Request Modal
  const handleOpenCustomModal = (
    prefilledCategory = '',
    prefilledTitle = '',
    prefilledDesc = '',
    prefilledFulfillment = 'groupable',
    preselectedDate = null
  ) => {
    setCustomCategory(prefilledCategory || 'Electrical & Smart Home');
    setCustomFulfillmentType(prefilledFulfillment || 'groupable');
    setCustomTitle(prefilledTitle || '');
    setCustomDescription(prefilledDesc || '');
    setCustomUrgency('NORMAL');
    setCustomPricingMode('INSPECTION');
    setCustomBudget(650);

    if (preselectedDate === 'weekend') {
      const weekend = getUpcomingWeekend();
      setCustomDateISO(weekend.saturdayISO);
      setCustomPreferredDate(formatDisplayDate(weekend.saturdayISO, 'This Weekend'));
    } else {
      const tomorrowISO = getTomorrowISO();
      setCustomDateISO(tomorrowISO);
      setCustomPreferredDate(formatDisplayDate(tomorrowISO, 'Tomorrow'));
    }

    setCustomPreferredTime('10:00 AM - 12:00 PM');
    setCustomExactTime('');
    setCustomTimeNote('');
    // If exclusive, disable pooling by default
    setCustomJoinPool(prefilledFulfillment !== 'exclusive');
    setCustomSpecialInstructions('');
    setIsCustomModalOpen(true);
  };

  // Apply custom starter prompt
  const handleApplyCustomStarter = (item) => {
    setCustomCategory(item.category);
    setCustomTitle(item.title);
    setCustomDescription(item.desc);
    if (item.fulfillmentType) {
      setCustomFulfillmentType(item.fulfillmentType);
      if (item.fulfillmentType === 'exclusive') {
        setCustomJoinPool(false);
      }
    }
    if (item.budget) {
      setCustomBudget(item.budget);
      setCustomPricingMode('BUDGET');
    }
  };

  // Submit Detailed Booking Form
  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!selectedService) return;

    const isPoolActive = selectedService.fulfillmentType === 'groupable' && joinGroupPoolToggle;
    const pricePerUnit = isPoolActive ? selectedService.startingPrice : selectedService.regularPrice;
    const totalPrice = pricePerUnit * unitsCount;

    const requestPayload = {
      communityId: currentUser?.communityId || 'comm-bhooja',
      category: selectedService.categoryName,
      title: `${selectedType} (${unitsCount} unit${unitsCount > 1 ? 's' : ''})`,
      description: descriptionText.trim() || `${selectedType} requested for unit ${currentUser?.flatNumber || 'A-1204'}. ${specialInstructions ? 'Notes: ' + specialInstructions : ''}`,
      preferredDate,
      preferredTime,
      fulfillmentType: selectedService.fulfillmentType || 'groupable',
      weekendDrive: !!selectedService.weekendDrive,
      isGroupRequest: isPoolActive,
      residentName: currentUser?.name || 'Arjun Kumar',
      unit: `Flat ${currentUser?.flatNumber || 'A-1204'}`,
      phone: currentUser?.phone || '+91 98765 43210',
      estimatedPrice: totalPrice
    };

    const createdReq = serviceApi.createRequest(requestPayload);
    refreshData();
    setIsModalOpen(false);

    showToast(`Service Request #${createdReq.id} submitted successfully! Verified contractors are notified for bids.`, 'success');
    setSubView('requests');
    setExpandedRequestId(createdReq.id);
  };

  // Submit Custom Service Request
  const handleSubmitCustomBooking = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      showToast('Please enter a service title or requirement.', 'error');
      return;
    }

    const budgetVal = customPricingMode === 'BUDGET' ? (Number(customBudget) || 600) : 650;
    const isPoolActive = customFulfillmentType === 'groupable' && customJoinPool;

    const requestPayload = {
      communityId: currentUser?.communityId || 'comm-bhooja',
      category: customCategory,
      title: customTitle.trim(),
      description: customDescription.trim() || `${customTitle.trim()} requested for Flat ${currentUser?.flatNumber || 'A-1204'}. ${customSpecialInstructions ? 'Special instructions: ' + customSpecialInstructions : ''}`,
      preferredDate: customPreferredDate,
      preferredTime: customPreferredTime,
      urgency: customUrgency,
      fulfillmentType: customFulfillmentType,
      isGroupRequest: isPoolActive,
      isCustom: true,
      residentName: currentUser?.name || 'Arjun Kumar',
      unit: `Flat ${currentUser?.flatNumber || 'A-1204'}`,
      phone: currentUser?.phone || '+91 98765 43210',
      estimatedBudget: budgetVal,
      estimatedPrice: budgetVal
    };

    const createdReq = serviceApi.createRequest(requestPayload);
    refreshData();
    setIsCustomModalOpen(false);

    showToast(`Custom Request #${createdReq.id} submitted successfully! Verified vendors notified for quotation bids.`, 'success');
    setSubView('requests');
    setExpandedRequestId(createdReq.id);
  };

  // Accept Contractor Quotation
  const handleAcceptQuote = (reqId, quote) => {
    const assignedProvider = {
      name: quote.providerName.split(' ')[0] + ' Technician',
      company: quote.providerName,
      contact: '+91 98888 77665',
      gateOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      arrival: quote.estimatedArrival,
      warranty: quote.warranty
    };

    serviceApi.advanceRequestStep(reqId, 4, assignedProvider);
    refreshData();
    showToast(`Quote from ${quote.providerName} accepted (₹${quote.quoteAmount})! Gate pass OTP #${assignedProvider.gateOtp} issued.`, 'success');

    if (onPassGenerated) {
      onPassGenerated({
        guestName: `${quote.providerName} (Technician)`,
        visitorType: 'SERVICE',
        hostUnit: `Flat ${currentUser?.flatNumber || 'A-1204'}`,
        phone: '+91 98888 77665',
        otpCode: assignedProvider.gateOtp
      });
    }
  };

  // Complete Request
  const handleCompleteRequest = (reqId) => {
    serviceApi.advanceRequestStep(reqId, 5);
    refreshData();
    showToast(`Work order #${reqId} marked completed. Invoice receipt logged in Society Dues.`, 'success');
  };

  // Join Pool action
  const handleJoinPool = (pool) => {
    try {
      serviceApi.joinPool(pool.id, currentUser?.name || 'Arjun Kumar', `Tower A-${currentUser?.flatNumber || '1204'}`);
      refreshData();
      showToast(`You have joined the "${pool.serviceTitle}" pool! Discounted rate of ₹${pool.discountedPrice} locked.`, 'success');
    } catch (err) {
      showToast(err.message || 'Unable to join pool', 'error');
    }
  };

  // Filtered services with fulfillment grouping & search
  const filteredServices = COMPREHENSIVE_SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    let matchesFulfillment = true;
    if (fulfillmentFilter === 'groupable') {
      matchesFulfillment = service.fulfillmentType === 'groupable';
    } else if (fulfillmentFilter === 'exclusive') {
      matchesFulfillment = service.fulfillmentType === 'exclusive';
    } else if (fulfillmentFilter === 'weekend') {
      matchesFulfillment = !!service.weekendDrive;
    }

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory && matchesFulfillment;

    const matchesName = service.name.toLowerCase().includes(query);
    const matchesDesc = service.description.toLowerCase().includes(query);
    const matchesTypes = service.serviceTypes.some(t => t.toLowerCase().includes(query));
    const matchesCat = service.categoryName.toLowerCase().includes(query);

    return matchesCategory && matchesFulfillment && (matchesName || matchesDesc || matchesTypes || matchesCat);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & View Switcher */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)] border border-[#eaedff]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#131b2e]">Book Verified Community Services</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#7ffc97]/60 text-[#002109] text-[11px] font-bold">
                16 Verified Services
              </span>
            </div>
            <p className="text-xs text-[#3e4a3d] mt-1">
              Certified technicians with police verification &amp; community gate badges • Pre-negotiated society rates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenCustomModal()}
              className="px-4 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>+ Book Custom Service</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#eaedff]">
          <button
            type="button"
            onClick={() => setSubView('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              subView === 'catalog'
                ? 'bg-[#006b2c] text-white shadow-xs'
                : 'bg-[#f2f3ff] text-[#3e4a3d] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
            <span>Explore All Services ({COMPREHENSIVE_SERVICES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('requests')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              subView === 'requests'
                ? 'bg-[#006b2c] text-white shadow-xs'
                : 'bg-[#f2f3ff] text-[#3e4a3d] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">assignment</span>
            <span>My Service Requests</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              subView === 'requests' ? 'bg-white/20 text-white' : 'bg-[#006b2c] text-white'
            }`}>
              {serviceRequests.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('pools')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              subView === 'pools'
                ? 'bg-[#006b2c] text-white shadow-xs'
                : 'bg-[#f2f3ff] text-[#3e4a3d] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">groups</span>
            <span>Group Demand Pools</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              subView === 'pools' ? 'bg-white/20 text-white' : 'bg-amber-600 text-white'
            }`}>
              {groupPools.length} Active
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: EXPLORE SERVICES CATALOG */}
      {subView === 'catalog' && (
        <>
          {/* Active Demand Pool Announcement Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#7ffc97]/40 via-[#f2f3ff] to-white p-5 border border-[#006b2c]/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#006b2c] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-2xl">local_fire_department</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#131b2e]">
                    Active Society Demand Pool: Pre-Festival AC Deep Chemical Jet Wash
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#006b2c] text-white text-[10px] font-bold">
                    18 / 20 FLATS ENROLLED
                  </span>
                </div>
                <p className="text-xs text-[#3e4a3d] mt-0.5">
                  Save 33% (Pay ₹499 instead of ₹750) when 2 more flats in Tower A or B join before Sept 24!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSubView('pools')}
                className="px-4 py-2 bg-white text-[#006b2c] border border-[#006b2c]/30 rounded-xl text-xs font-bold hover:bg-[#7ffc97]/20 transition cursor-pointer"
              >
                View All Pools
              </button>
              <button
                type="button"
                onClick={() => handleOpenBookingModal(COMPREHENSIVE_SERVICES[0], 'Split AC High-Pressure Chemical Jet Wash')}
                className="px-4 py-2 bg-[#006b2c] text-white rounded-xl text-xs font-bold hover:bg-[#00873a] transition shadow-xs cursor-pointer"
              >
                Join Pool &amp; Book ₹499
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#eaedff]">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, e.g. AC chemical wash, geyser fix, pest control, sofa, cook, tutor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Quick Filter Dropdown count */}
            <div className="text-xs text-[#6e7b6c] flex items-center gap-1 self-end md:self-center font-medium">
              <span>Showing {filteredServices.length} of {COMPREHENSIVE_SERVICES.length} verified services</span>
            </div>
          </div>

          {/* SERVICE GROUPING & CATEGORIZATION CONTROL BAR (Groupable vs Dedicated Single-Household & Weekend) */}
          <div className="bg-white p-4 rounded-2xl border border-[#eaedff] shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#006b2c]">category</span>
                <span className="text-xs font-bold text-[#131b2e]">Filter by Service Categorization &amp; Grouping:</span>
              </div>
              <span className="text-[11px] text-[#6e7b6c]">
                {fulfillmentFilter === 'all' ? 'All 16 Services' :
                 fulfillmentFilter === 'groupable' ? 'Multi-House Technicians' :
                 fulfillmentFilter === 'exclusive' ? 'Dedicated 1-on-1 to 1 Flat' : 'Weekend Society Drives'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFulfillmentFilter('all')}
                className={`p-2.5 rounded-xl text-left transition border cursor-pointer flex items-center justify-between ${
                  fulfillmentFilter === 'all'
                    ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                    : 'bg-[#f2f3ff] text-[#131b2e] border-[#eaedff] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">apps</span>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">All Services</span>
                    <span className={`text-[10px] ${fulfillmentFilter === 'all' ? 'text-white/80' : 'text-[#6e7b6c]'}`}>
                      Full Catalog
                    </span>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  fulfillmentFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  16
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentFilter('groupable')}
                className={`p-2.5 rounded-xl text-left transition border cursor-pointer flex items-center justify-between ${
                  fulfillmentFilter === 'groupable'
                    ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                    : 'bg-[#f2f3ff] text-[#131b2e] border-[#eaedff] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">group</span>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">👥 Groupable / Multi-House</span>
                    <span className={`text-[10px] ${fulfillmentFilter === 'groupable' ? 'text-white/80' : 'text-[#6e7b6c]'}`}>
                      Electricians, Plumbers, AC
                    </span>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  fulfillmentFilter === 'groupable' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  12
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentFilter('exclusive')}
                className={`p-2.5 rounded-xl text-left transition border cursor-pointer flex items-center justify-between ${
                  fulfillmentFilter === 'exclusive'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-[#f2f3ff] text-[#131b2e] border-[#eaedff] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">lock</span>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">🔒 Dedicated (Single Flat)</span>
                    <span className={`text-[10px] ${fulfillmentFilter === 'exclusive' ? 'text-white/80' : 'text-[#6e7b6c]'}`}>
                      Cooks, Maids, Drivers, Tutors
                    </span>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  fulfillmentFilter === 'exclusive' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  4
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentFilter('weekend')}
                className={`p-2.5 rounded-xl text-left transition border cursor-pointer flex items-center justify-between ${
                  fulfillmentFilter === 'weekend'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-[#f2f3ff] text-[#131b2e] border-[#eaedff] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">event_upcoming</span>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">📅 Weekend Drives</span>
                    <span className={`text-[10px] ${fulfillmentFilter === 'weekend' ? 'text-white/80' : 'text-[#6e7b6c]'}`}>
                      Sat &amp; Sun Society Batch Runs
                    </span>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  fulfillmentFilter === 'weekend' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                }`}>
                  11
                </span>
              </button>
            </div>

            {/* Smart Categorization Explainer Note */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#f8faff] border border-[#eaedff] text-[11px] text-[#3e4a3d] flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-[#006b2c] mt-0.5 shrink-0">verified</span>
              <div>
                <span className="font-bold text-[#131b2e]">Society Categorization Rules: </span>
                <span>
                  <strong>Dedicated Services</strong> (Cooks, Household Maids, Chauffeurs &amp; Private Tutors) cannot be shared across multiple kitchens or flats simultaneously—they are reserved 100% for your private residence during their shift.
                  <strong> Groupable Services</strong> (Electricians, Plumbers, Servicemen, Pest Control) can service multiple units sequentially or be scheduled on <strong>Weekend Drives</strong> to unlock 20-35% society discounts!
                </span>
              </div>
            </div>
          </div>

          {/* Category Horizontal Pill Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_FILTERS.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'bg-white border border-[#eaedff] text-[#3e4a3d] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Services Grid (All 16 Services with Detailed Types & Descriptions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="rounded-2xl bg-white p-5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff] flex flex-col justify-between hover:shadow-md hover:border-[#006b2c]/40 transition-all group"
              >
                <div>
                  {/* Top Bar: Icon, Category & Rating */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                      <span className="material-symbols-outlined text-2xl">{service.icon}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#006591] text-[10px] font-bold border border-[#eaedff]">
                        {service.categoryName}
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-600">
                        <span>★ {service.rating}</span>
                        <span className="text-gray-400 font-normal">({service.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-[#131b2e] leading-snug group-hover:text-[#006b2c] transition-colors">
                      {service.name}
                    </h3>
                  </div>

                  {/* Badges: Grouping & Duration */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    {/* Fulfillment Grouping Badge */}
                    {service.fulfillmentType === 'exclusive' ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-amber-700">lock</span>
                        <span>Dedicated 1-on-1 (Single Flat)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-emerald-700">group</span>
                        <span>Groupable / Multi-House</span>
                      </span>
                    )}

                    {service.weekendDrive && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-blue-700">event_upcoming</span>
                        <span>Weekend Drive</span>
                      </span>
                    )}

                    <span className="text-[10px] text-[#6e7b6c]">• {service.estimatedDuration}</span>
                  </div>

                  {/* Detailed Description */}
                  <p className="text-xs text-[#3e4a3d] line-clamp-3 mb-2.5 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Specific Categorization Notice */}
                  {service.fulfillmentType === 'exclusive' ? (
                    <div className="text-[10px] text-amber-900 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 flex items-start gap-1.5 mb-3 leading-relaxed">
                      <span className="material-symbols-outlined text-xs text-amber-700 mt-0.5 shrink-0">shield_lock</span>
                      <span>{service.exclusiveNotice || "Exclusive household shift: In-home cook/maid/driver cannot be split across multiple flats."}</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#006b2c] bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60 flex items-start gap-1.5 mb-3 leading-relaxed">
                      <span className="material-symbols-outlined text-xs text-[#006b2c] mt-0.5 shrink-0">handshake</span>
                      <span>{service.weekendSlotInfo || "Groupable technician: can service multiple units sequentially or bundle in weekend society drives."}</span>
                    </div>
                  )}

                  {/* Types of Service Pills */}
                  <div className="mb-3 pt-2.5 border-t border-[#eaedff]">
                    <div className="text-[10px] font-bold text-[#6e7b6c] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Specific Service Types:</span>
                      <span className="text-[#006b2c] lowercase">{service.serviceTypes.length} options</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {service.serviceTypes.slice(0, 3).map((st, idx) => (
                        <span
                          key={idx}
                          onClick={() => handleOpenBookingModal(service, st)}
                          className="px-2 py-0.5 rounded-md bg-[#f2f3ff] hover:bg-[#7ffc97]/30 text-[#131b2e] text-[10px] font-medium border border-[#eaedff] cursor-pointer transition"
                          title="Click to book this specific type"
                        >
                          {st}
                        </span>
                      ))}
                      {service.serviceTypes.length > 3 && (
                        <span
                          onClick={() => handleOpenBookingModal(service)}
                          className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium cursor-pointer hover:bg-gray-200"
                        >
                          +{service.serviceTypes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Key Deliverables Bullet Points */}
                  <div className="mb-4 bg-[#f8faff] p-2.5 rounded-xl border border-[#eaedff]/60">
                    <div className="text-[10px] font-bold text-[#131b2e] uppercase mb-1">Includes:</div>
                    <ul className="space-y-1">
                      {service.includedFeatures.slice(0, 2).map((feat, fidx) => (
                        <li key={fidx} className="text-[11px] text-[#414840] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs text-[#006b2c] shrink-0">check_circle</span>
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price & Action Section */}
                <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-[#006b2c]">₹{service.startingPrice}</span>
                      <span className="text-xs text-gray-400 line-through">₹{service.regularPrice}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">
                      {service.fulfillmentType === 'exclusive'
                        ? '1-on-1 Dedicated Household'
                        : `Save ${service.groupDiscountPercent}% with Flat Pool`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {service.weekendDrive && (
                      <button
                        type="button"
                        onClick={() => handleOpenBookingModal(service, '', 'weekend', true)}
                        className="px-2.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        title="Book for the upcoming coordinated weekend drive"
                      >
                        <span className="material-symbols-outlined text-xs">event</span>
                        <span>Weekend</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenBookingModal(service)}
                      className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      <span>Book in Detail</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* DEDICATED CUSTOM SERVICE REQUEST CARD IN CATALOG GRID */}
            <div
              onClick={() => handleOpenCustomModal()}
              className="rounded-2xl bg-gradient-to-br from-[#f2f3ff] via-white to-[#7ffc97]/15 p-5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border-2 border-dashed border-[#006b2c]/40 hover:border-[#006b2c] flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#006b2c] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">tune</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#7ffc97]/50 text-[#002109] text-[10px] font-bold border border-[#006b2c]/20">
                    Custom / Unlisted
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#131b2e] leading-snug group-hover:text-[#006b2c] transition-colors mb-1">
                  Have an Unlisted Custom Service Need?
                </h3>
                <p className="text-xs text-[#3e4a3d] mb-3 leading-relaxed">
                  Can’t find what you need? Request any custom requirement—from mosquito nets and invisible grilles to woodwork, smart door locks, or civil repairs.
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3 pt-2 border-t border-[#eaedff]">
                  {['Safety Grilles', 'Under-Sink RO', 'Sliding Doors', 'Wall Seepage', 'Smart Lock'].map((chip, cIdx) => (
                    <span key={cIdx} className="px-2 py-0.5 rounded-md bg-white border border-[#eaedff] text-[10px] font-medium text-[#131b2e]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Quotation Mode</span>
                  <span className="text-xs font-bold text-[#006b2c]">Free Inspection &amp; Bids</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleOpenCustomModal(); }}
                  className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Request Custom</span>
                </button>
              </div>
            </div>
          </div>

          {filteredServices.length === 0 && (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#eaedff]">
              <div className="w-16 h-16 rounded-full bg-[#f2f3ff] text-gray-400 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-3xl">search_off</span>
              </div>
              <h3 className="text-sm font-bold text-[#131b2e]">No matching catalog services found</h3>
              <p className="text-xs text-[#6e7b6c] mt-1">
                You can raise a custom service request for "{searchQuery}" and certified society contractors will bid!
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="px-4 py-2 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-xs font-bold border border-[#eaedff] hover:bg-[#eaedff] cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenCustomModal('Other Custom Home Requirement', searchQuery, `Custom resident requirement for: ${searchQuery}`)}
                  className="px-4 py-2 bg-[#006b2c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#00873a] transition cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>Request "{searchQuery}" as Custom Service</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* VIEW 2: MY SERVICE REQUESTS (With Real Provider Quotations & Tracking) */}
      {subView === 'requests' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#eaedff]">
            <div>
              <h2 className="text-base font-bold text-[#131b2e]">My Active Service Work Orders</h2>
              <span className="text-xs text-[#3e4a3d]">
                Track contractor dispatch, compare competitive quotes, and view Security Gate Pass OTPs
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleOpenCustomModal()}
              className="px-3.5 py-2 bg-[#006b2c] text-white text-xs font-bold rounded-xl hover:bg-[#00873a] transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>+ Raise Custom Request</span>
            </button>
          </div>

          {serviceRequests.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#eaedff]">
              <p className="text-sm font-bold text-[#131b2e]">No active service requests logged</p>
              <p className="text-xs text-[#6e7b6c] mt-1">Explore our verified catalog to schedule your first service.</p>
              <button
                type="button"
                onClick={() => setSubView('catalog')}
                className="mt-4 px-4 py-2 bg-[#006b2c] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Browse Services Catalog
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {serviceRequests.map((req) => {
                const isExpanded = expandedRequestId === req.id;
                const hasQuotes = req.quotations && req.quotations.length > 0;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff] flex flex-col gap-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eaedff]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#006591] px-2 py-0.5 rounded-md bg-[#c9e6ff]/50">
                            {req.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#131b2e] text-[10px] font-bold border border-[#eaedff]">
                            {req.category}
                          </span>
                          {req.fulfillmentType === 'exclusive' ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[11px] text-amber-700">lock</span>
                              <span>Dedicated 1-on-1</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[11px] text-[#006b2c]">group</span>
                              <span>Groupable</span>
                            </span>
                          )}
                          {req.weekendDrive && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[11px] text-blue-700">event_upcoming</span>
                              <span>Weekend Drive</span>
                            </span>
                          )}
                          {req.isGroupRequest && (
                            <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/50 text-[#002109] text-[10px] font-bold">
                              Group Pool Joined (33% Saved)
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-[#131b2e] mt-1.5">{req.title}</h3>
                        <p className="text-xs text-[#3e4a3d] mt-0.5">{req.description}</p>
                      </div>

                      <div className="flex flex-col sm:items-end">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          req.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'DISPATCHED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status === 'COMPLETED'
                            ? 'Work Completed ✓'
                            : req.status === 'DISPATCHED'
                            ? 'Technician Dispatched 🚚'
                            : 'Contractor Quotes Received 🏷️'}
                        </span>
                        <span className="text-[11px] text-[#6e7b6c] mt-1 font-medium">
                          📅 {req.preferredDate} • 🕒 {req.preferredTime}
                        </span>
                        {req.customTimeNote && (
                          <span className="text-[10px] text-[#006b2c] font-semibold bg-[#7ffc97]/20 px-2 py-0.5 rounded-md mt-0.5 max-w-[240px] truncate" title={req.customTimeNote}>
                            Custom Timing: "{req.customTimeNote}"
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 5-Step Lifecycle Progress Stepper */}
                    <div className="bg-[#f8faff] p-4 rounded-xl border border-[#eaedff]">
                      <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold">
                        <div className={`${req.currentStep >= 1 ? 'text-[#006b2c]' : 'text-gray-400'}`}>
                          <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center mb-1 ${
                            req.currentStep >= 1 ? 'bg-[#006b2c] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            1
                          </div>
                          <span>Request Logged</span>
                        </div>

                        <div className={`${req.currentStep >= 2 ? 'text-[#006b2c]' : 'text-gray-400'}`}>
                          <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center mb-1 ${
                            req.currentStep >= 2 ? 'bg-[#006b2c] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            2
                          </div>
                          <span>Broadcasted</span>
                        </div>

                        <div className={`${req.currentStep >= 3 ? 'text-[#006b2c]' : 'text-gray-400'}`}>
                          <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center mb-1 ${
                            req.currentStep >= 3 ? 'bg-[#006b2c] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            3
                          </div>
                          <span>Quotes Received</span>
                        </div>

                        <div className={`${req.currentStep >= 4 ? 'text-[#006b2c]' : 'text-gray-400'}`}>
                          <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center mb-1 ${
                            req.currentStep >= 4 ? 'bg-[#006b2c] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            4
                          </div>
                          <span>Dispatched</span>
                        </div>

                        <div className={`${req.currentStep >= 5 ? 'text-[#006b2c]' : 'text-gray-400'}`}>
                          <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center mb-1 ${
                            req.currentStep >= 5 ? 'bg-[#006b2c] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            5
                          </div>
                          <span>Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 Dispatched Details: Gate Pass OTP & Technician card */}
                    {req.currentStep >= 4 && req.assignedProvider && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#c9e6ff]/30 via-white to-[#7ffc97]/30 border border-[#006591]/20 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#006591] text-white flex items-center justify-center font-bold text-xl">
                            <span className="material-symbols-outlined">engineering</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[#131b2e]">{req.assignedProvider.name}</h4>
                              <span className="text-xs text-[#006591] font-semibold">({req.assignedProvider.company})</span>
                            </div>
                            <p className="text-xs text-[#3e4a3d] mt-0.5">
                              Arrival: <span className="font-semibold">{req.assignedProvider.arrival || 'On Schedule'}</span> • Warranty: {req.assignedProvider.warranty}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-white border border-[#eaedff] text-center shadow-xs">
                            <span className="text-[10px] text-gray-500 uppercase font-bold block">Security Gate OTP</span>
                            <span className="font-mono text-base font-bold text-[#006b2c] tracking-wider">
                              #{req.assignedProvider.gateOtp || '4829'}
                            </span>
                          </div>
                          <a
                            href={`tel:${req.assignedProvider.contact}`}
                            className="px-3.5 py-2 bg-[#006591] text-white rounded-xl text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">call</span>
                            <span>Call Crew</span>
                          </a>
                          {req.currentStep === 4 && (
                            <button
                              type="button"
                              onClick={() => handleCompleteRequest(req.id)}
                              className="px-3.5 py-2 bg-[#006b2c] text-white rounded-xl text-xs font-bold hover:bg-[#00873a] transition cursor-pointer"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3 Contractor Quotation Bids Cards */}
                    {hasQuotes && req.currentStep === 3 && (
                      <div className="flex flex-col gap-2.5 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                            Verified Contractor Bids ({req.quotations.length} Providers Responded)
                          </h4>
                          <span className="text-[11px] text-[#006b2c] font-bold">Society Certified Rates</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {req.quotations.map((quote) => (
                            <div
                              key={quote.id}
                              className="p-4 rounded-xl bg-white border-2 border-[#eaedff] hover:border-[#006b2c] transition-all flex flex-col justify-between gap-3 shadow-xs"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="text-sm font-bold text-[#131b2e] leading-tight">{quote.providerName}</h5>
                                  <span className="text-xs font-bold text-amber-600 shrink-0">★ {quote.rating}</span>
                                </div>
                                <div className="text-lg font-bold text-[#006b2c] mt-1.5">
                                  ₹{quote.quoteAmount}
                                </div>
                                <div className="text-[11px] text-[#3e4a3d] mt-1">
                                  <span className="text-gray-500">ETA:</span> {quote.estimatedArrival}
                                </div>
                                <div className="text-[11px] text-[#3e4a3d]">
                                  <span className="text-gray-500">Warranty:</span> {quote.warranty}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAcceptQuote(req.id, quote)}
                                className="w-full py-2 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-base">check_circle</span>
                                <span>Accept &amp; Dispatch</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: GROUP DEMAND POOLS */}
      {subView === 'pools' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#131b2e]">Community Group Demand Pools</h2>
              <span className="text-xs text-[#3e4a3d]">
                Pool demand with neighbors in Oakridge Heights / Tower A to unlock 25% to 40% contractor discounts!
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleOpenBookingModal(COMPREHENSIVE_SERVICES[0])}
              className="px-3.5 py-2 bg-[#006b2c] text-white text-xs font-bold rounded-xl hover:bg-[#00873a] transition cursor-pointer"
            >
              + Create New Pool
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {groupPools.map((pool) => {
              const pct = Math.min(100, Math.round((pool.currentParticipants / pool.minThreshold) * 100));

              return (
                <div
                  key={pool.id}
                  className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#eaedff] flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#006591] text-[10px] font-bold border border-[#eaedff]">
                        {pool.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7ffc97]/50 text-[#002109] text-[10px] font-bold">
                        Save {pool.savingsPercent}%
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#131b2e]">{pool.serviceTitle}</h3>
                    <p className="text-xs text-[#3e4a3d] mt-1">
                      Targeting minimum {pool.minThreshold} flats to dispatch centralized contractor crew.
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-[#131b2e]">{pool.currentParticipants} flats enrolled</span>
                        <span className="text-[#006b2c]">{pool.minThreshold - pool.currentParticipants} more needed ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#f2f3ff] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#006b2c] to-[#7ffc97] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Price and Deadline */}
                    <div className="grid grid-cols-2 gap-3 mt-4 p-3 rounded-xl bg-[#f8faff] border border-[#eaedff]">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Pool Price</span>
                        <span className="text-base font-bold text-[#006b2c]">₹{pool.discountedPrice}</span>
                        <span className="text-xs text-gray-400 line-through ml-1.5">₹{pool.regularPrice}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Enrollment Closes</span>
                        <span className="text-xs font-bold text-[#131b2e]">{pool.deadline}</span>
                      </div>
                    </div>

                    {/* Participants preview */}
                    {pool.participants && (
                      <div className="mt-3 text-[11px] text-[#6e7b6c]">
                        <span className="font-semibold text-[#131b2e]">Neighbors joined: </span>
                        {pool.participants.slice(0, 3).map(p => p.residentName).join(', ')}
                        {pool.participants.length > 3 && ` +${pool.participants.length - 3} others`}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleJoinPool(pool)}
                    className="w-full py-2.5 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">group_add</span>
                    <span>Join This Group Pool (Lock ₹{pool.discountedPrice})</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED BOOKING MODAL (Comprehensive with Type of Service, Detailed Description, Slots, Units & Pool Toggle) */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#eaedff] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#f2f3ff] to-white border-b border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${selectedService.iconBg} flex items-center justify-center shadow-xs`}>
                  <span className="material-symbols-outlined text-2xl">{selectedService.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#131b2e]">{selectedService.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/60 text-[#002109] text-[10px] font-bold">
                      {selectedService.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#3e4a3d] mt-0.5">
                    {selectedService.categoryName} • Estimated Duration: {selectedService.estimatedDuration}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition cursor-pointer border border-[#eaedff]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitBooking} className="p-6 flex flex-col gap-5">
              {/* 1. Type of Service Selection */}
              <div>
                <label className="text-xs font-bold text-[#131b2e] block mb-1.5 flex items-center justify-between">
                  <span>Select Exact Type of Service:</span>
                  <span className="text-[11px] text-[#006b2c] font-semibold">Required</span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
                  required
                >
                  {selectedService.serviceTypes.map((typeOption, idx) => (
                    <option key={idx} value={typeOption}>
                      {typeOption}
                    </option>
                  ))}
                  <option value="Custom / Unlisted Special Request">Other / Custom Issue (Specify Below)</option>
                </select>
              </div>

              {/* 2. Detailed Description of the Issue / Requirement */}
              <div>
                <label className="text-xs font-bold text-[#131b2e] block mb-1.5 flex items-center justify-between">
                  <span>Detailed Description &amp; Specific Requirements:</span>
                  <span className="text-[10px] text-[#6e7b6c]">Give details for technician</span>
                </label>
                <textarea
                  rows={3}
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  placeholder="e.g., Master bedroom Daikin 1.5T split AC is not cooling properly and has minor water dripping on the wall. Please bring chemical jet equipment."
                  className="w-full p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c] resize-none leading-relaxed"
                  required
                />

                {/* Quick starter prompts */}
                {selectedService.starterPrompts && (
                  <div className="mt-2">
                    <span className="text-[10px] text-[#6e7b6c] block mb-1 font-semibold">Quick Suggestions (Click to fill):</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedService.starterPrompts.map((prompt, pidx) => (
                        <button
                          key={pidx}
                          type="button"
                          onClick={() => setDescriptionText(prompt)}
                          className="px-2 py-1 rounded-lg bg-white border border-[#eaedff] text-[10px] text-[#3e4a3d] hover:bg-[#7ffc97]/20 hover:text-[#006b2c] transition cursor-pointer text-left"
                        >
                          "{prompt}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Categorization & Fulfillment Type Guidance Banner */}
              {selectedService.fulfillmentType === 'exclusive' ? (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-lg mt-0.5 shrink-0">shield_lock</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-900">Dedicated 1-on-1 Household Service</span>
                      <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">Single Flat Exclusive</span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      {selectedService.exclusiveNotice || "For food hygiene, privacy, and dedicated attention, this professional is assigned 100% to your flat. Personnel cannot be shared across multiple kitchens or residences simultaneously."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#006b2c] text-lg mt-0.5 shrink-0">groups</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#006b2c]">Groupable Multi-House Community Service</span>
                      {selectedService.weekendDrive && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[11px]">event_upcoming</span>
                          <span>Weekend Drive Eligible</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#3e4a3d] mt-0.5 leading-relaxed">
                      {selectedService.weekendSlotInfo || "Technicians can service multiple flats sequentially. Enable Group Pooling below or schedule during weekend society drives to save up to " + selectedService.groupDiscountPercent + "%."}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Scope / Number of Units & Preferred Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                    Quantity / Number of Units:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUnitsCount(Math.max(1, unitsCount - 1))}
                      className="w-9 h-9 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-sm text-[#131b2e]">
                      {unitsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUnitsCount(unitsCount + 1)}
                      className="w-9 h-9 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-[11px] text-[#6e7b6c] ml-1">
                      unit{unitsCount > 1 ? 's' : ''} / room{unitsCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="serviceDatePickerInput" className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5 cursor-pointer">
                      <span className="material-symbols-outlined text-sm text-[#006b2c]">calendar_month</span>
                      <span>Select Service Date:</span>
                    </label>
                    {preferredDate && (
                      <span className="text-[10px] font-semibold text-[#006b2c] bg-[#7ffc97]/30 px-2 py-0.5 rounded-md truncate max-w-[170px]" title={preferredDate}>
                        {preferredDate}
                      </span>
                    )}
                  </div>

                  {/* Quick Select Buttons: Today, Tomorrow, Weekend, Next Week */}
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    <button
                      type="button"
                      onClick={() => handleSelectQuickDate('today')}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer border flex items-center justify-center gap-0.5 ${
                        selectedDateISO === getTodayISO()
                          ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                          : 'bg-[#f2f3ff] text-[#3e4a3d] border-[#eaedff] hover:bg-[#eaedff]'
                      }`}
                    >
                      <span>⚡ Today</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectQuickDate('tomorrow')}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer border flex items-center justify-center gap-0.5 ${
                        selectedDateISO === getTomorrowISO()
                          ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                          : 'bg-[#f2f3ff] text-[#3e4a3d] border-[#eaedff] hover:bg-[#eaedff]'
                      }`}
                    >
                      <span>☀️ Tmrw</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectQuickDate('weekend')}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer border flex items-center justify-center gap-0.5 ${
                        selectedDateISO === getUpcomingSaturdayISO()
                          ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                          : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                      }`}
                      title="Select upcoming Saturday weekend batch"
                    >
                      <span>📅 Weekend</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectQuickDate('next-week')}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer border flex items-center justify-center gap-0.5 ${
                        selectedDateISO === getNextWeekISO()
                          ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                          : 'bg-[#f2f3ff] text-[#3e4a3d] border-[#eaedff] hover:bg-[#eaedff]'
                      }`}
                    >
                      <span>🗓️ Next Wk</span>
                    </button>
                  </div>

                  {/* Interactive Calendar Date Picker Input */}
                  <div className="relative">
                    <input
                      type="date"
                      id="serviceDatePickerInput"
                      min={getTodayISO()}
                      value={selectedDateISO}
                      onChange={handleCustomDateChange}
                      className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c] cursor-pointer hover:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Flexible Time Selection: Preset Windows + Exact Custom Time Picker */}
              <div className="p-4 rounded-2xl bg-[#f8faff] border border-[#eaedff] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#006b2c]">schedule</span>
                    <label className="text-xs font-bold text-[#131b2e]">
                      Preferred Timing: Pick a Window or Exact Time Slot
                    </label>
                  </div>
                  {preferredTime && (
                    <span className="text-[10px] font-bold text-[#006b2c] bg-[#7ffc97]/30 px-2.5 py-0.5 rounded-full border border-[#006b2c]/20">
                      🕒 {preferredTime}
                    </span>
                  )}
                </div>

                {/* Preset Time Windows */}
                <div>
                  <span className="text-[11px] text-[#6e7b6c] block mb-1.5 font-medium">Standard Society Service Windows:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      '08:30 AM - 11:30 AM',
                      '12:00 PM - 03:00 PM',
                      '03:30 PM - 06:30 PM',
                      '07:00 PM - 09:30 PM'
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setPreferredTime(slot);
                          setStandardExactTime('');
                        }}
                        className={`p-2 rounded-xl text-[11px] font-semibold text-center transition cursor-pointer border ${
                          preferredTime === slot
                            ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                            : 'bg-white text-[#3e4a3d] border-[#eaedff] hover:bg-[#eaedff]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exact Time Selector & Custom Timing Note (When the resident needs it) */}
                <div className="pt-2 border-t border-[#eaedff] flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                  <div className="flex items-center gap-2 shrink-0">
                    <label htmlFor="standardExactTimePicker" className="text-[11px] font-bold text-[#131b2e] flex items-center gap-1 cursor-pointer">
                      <span className="material-symbols-outlined text-sm text-[#006b2c]">alarm</span>
                      <span>Pick Exact Time:</span>
                    </label>
                    <input
                      type="time"
                      id="standardExactTimePicker"
                      value={standardExactTime}
                      onChange={handleStandardExactTimeChange}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-[#eaedff] text-xs font-bold text-[#006b2c] focus:outline-none focus:ring-2 focus:ring-[#006b2c] cursor-pointer"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={standardCustomTimeNote}
                      onChange={handleStandardCustomTimeNoteChange}
                      placeholder="Or specify timing note (e.g., 'Sharp at 9:15 AM before leaving for office')"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#eaedff] text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Group Demand Pooling Toggle vs Exclusive Allocation Box */}
              {selectedService.fulfillmentType === 'exclusive' ? (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-700 text-lg mt-0.5">verified_user</span>
                  <div>
                    <span className="font-bold block text-amber-900 text-xs">
                      Dedicated 1-on-1 Household Allocation (No Multi-Flat Sharing)
                    </span>
                    <span className="text-[11px] text-amber-800 mt-0.5 block leading-relaxed">
                      For dedicated home services (Cooks, Household Maids, Chauffeurs &amp; Tutors), staff cannot be split across multiple kitchens or flats simultaneously. Your booking guarantees 100% focused attention for your residence during the reserved slot.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#7ffc97]/30 to-[#f2f3ff] border border-[#006b2c]/20 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="groupPoolCheck"
                    checked={joinGroupPoolToggle}
                    onChange={(e) => setJoinGroupPoolToggle(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#006b2c] rounded cursor-pointer accent-[#006b2c]"
                  />
                  <label htmlFor="groupPoolCheck" className="text-xs text-[#131b2e] cursor-pointer">
                    <span className="font-bold block text-[#006b2c]">
                      Bundle with Neighbors for Group Savings (Save {selectedService.groupDiscountPercent}%)
                    </span>
                    <span className="text-[11px] text-[#3e4a3d] mt-0.5 block">
                      Check this to automatically broadcast your request into Oakridge Heights Tower A pool. When 3+ flats join, your rate drops to ₹{selectedService.startingPrice} per unit!
                    </span>
                  </label>
                </div>
              )}

              {/* 6. Flat & Resident Details Summary */}
              <div className="p-3.5 rounded-xl bg-white border border-[#eaedff] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Assigned Residence</span>
                  <span className="font-bold text-[#131b2e]">
                    Oakridge Heights • Flat {currentUser?.flatNumber || 'A-1204'} ({currentUser?.tower || 'Tower A'})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Primary Resident</span>
                  <span className="font-bold text-[#131b2e]">
                    {currentUser?.name || 'Arjun Kumar'}
                  </span>
                </div>
              </div>

              {/* 7. Price Calculation & Guarantee */}
              <div className="p-4 rounded-2xl bg-[#f8faff] border border-[#eaedff] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    Base Inspection &amp; Service Fee ({unitsCount} unit{unitsCount > 1 ? 's' : ''}):
                  </span>
                  <span className="font-bold text-gray-800">
                    ₹{(joinGroupPoolToggle ? selectedService.startingPrice : selectedService.regularPrice) * unitsCount}
                  </span>
                </div>

                {joinGroupPoolToggle && (
                  <div className="flex items-center justify-between text-xs text-[#006b2c]">
                    <span>Society Bulk Demand Subsidy:</span>
                    <span className="font-bold">
                      -₹{(selectedService.regularPrice - selectedService.startingPrice) * unitsCount}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 block">Total Net Estimated:</span>
                    <span className="text-lg font-bold text-[#006b2c]">
                      ₹{(joinGroupPoolToggle ? selectedService.startingPrice : selectedService.regularPrice) * unitsCount}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full block">
                      Pay After Service Completion
                    </span>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">
                      30-Day Re-work Guarantee
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#eaedff] text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Confirm &amp; Request Quotes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED CUSTOM SERVICE REQUEST MODAL */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#eaedff] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#f2f3ff] via-white to-[#7ffc97]/15 border-b border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#006b2c] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-2xl">tune</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#131b2e]">Raise Custom Service Request</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#7ffc97]/60 text-[#002109] text-[10px] font-bold">
                      Verified Network
                    </span>
                  </div>
                  <p className="text-xs text-[#3e4a3d] mt-0.5">
                    Specify any custom home task • Receive verified contractor quotes &amp; free site inspection
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition cursor-pointer border border-[#eaedff]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitCustomBooking} className="p-6 flex flex-col gap-5">
              {/* Quick Starter Suggestions */}
              <div>
                <span className="text-[10px] font-bold text-[#6e7b6c] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#006b2c]">lightbulb</span>
                  <span>Popular Custom Requests (Click to auto-populate):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CUSTOM_STARTER_PROMPTS.map((starter, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleApplyCustomStarter(starter)}
                      className="px-2.5 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#7ffc97]/30 text-[11px] font-medium text-[#131b2e] border border-[#eaedff] transition cursor-pointer text-left"
                    >
                      + {starter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Category Selection & Urgency Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#131b2e] block mb-1.5 flex items-center justify-between">
                    <span>Service Category:</span>
                    <span className="text-[10px] text-[#006b2c] font-semibold">Required</span>
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
                    required
                  >
                    {CUSTOM_SERVICE_CATEGORIES.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                    Urgency &amp; Priority:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'NORMAL', label: 'Normal', time: '24-48h' },
                      { id: 'HIGH', label: 'High', time: 'Today' },
                      { id: 'EMERGENCY', label: 'Urgent', time: '< 60m' }
                    ].map((urg) => (
                      <button
                        key={urg.id}
                        type="button"
                        onClick={() => setCustomUrgency(urg.id)}
                        className={`py-2 px-1 rounded-xl text-center transition cursor-pointer border flex flex-col items-center justify-center ${
                          customUrgency === urg.id
                            ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                            : 'bg-[#f2f3ff] text-[#3e4a3d] border-[#eaedff] hover:bg-[#eaedff]'
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight">{urg.label}</span>
                        <span className={`text-[9px] ${customUrgency === urg.id ? 'text-white/80' : 'text-gray-400'}`}>
                          {urg.time}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Custom Service Title */}
              <div>
                <label className="text-xs font-bold text-[#131b2e] block mb-1.5 flex items-center justify-between">
                  <span>Custom Service Title / Requirement:</span>
                  <span className="text-[10px] text-[#006b2c] font-semibold">Required</span>
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Balcony Invisible Safety Grille & Anti-Bird Net Installation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
                  required
                />
              </div>

              {/* 3. Detailed Description of the Issue / Requirement */}
              <div>
                <label className="text-xs font-bold text-[#131b2e] block mb-1.5 flex items-center justify-between">
                  <span>Detailed Scope &amp; Specific Instructions:</span>
                  <span className="text-[10px] text-[#6e7b6c]">Helps contractors provide accurate quotes</span>
                </label>
                <textarea
                  rows={3}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Describe dimensions, materials, preferred brand, or exact issue (e.g., 8x6 ft balcony needs 316-grade SS wire mesh; need ladder and electric drill)..."
                  className="w-full p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c] resize-none leading-relaxed"
                  required
                />
              </div>

              {/* 4. Budget & Quotation Mode */}
              <div className="p-4 rounded-2xl bg-[#f8faff] border border-[#eaedff] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131b2e]">Quotation &amp; Pricing Preference:</span>
                  <span className="text-[10px] text-[#006b2c] font-semibold">Zero upfront payment</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomPricingMode('INSPECTION')}
                    className={`p-3 rounded-xl text-left transition cursor-pointer border flex items-start gap-2.5 ${
                      customPricingMode === 'INSPECTION'
                        ? 'bg-white border-[#006b2c] ring-1 ring-[#006b2c] shadow-xs'
                        : 'bg-[#f2f3ff] border-[#eaedff] hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg text-[#006b2c] mt-0.5">request_quote</span>
                    <div>
                      <span className="text-xs font-bold text-[#131b2e] block">Free Inspection &amp; Bids</span>
                      <span className="text-[10px] text-[#6e7b6c] block mt-0.5">
                        Technicians visit for free inspection and submit competitive bids
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomPricingMode('BUDGET')}
                    className={`p-3 rounded-xl text-left transition cursor-pointer border flex items-start gap-2.5 ${
                      customPricingMode === 'BUDGET'
                        ? 'bg-white border-[#006b2c] ring-1 ring-[#006b2c] shadow-xs'
                        : 'bg-[#f2f3ff] border-[#eaedff] hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg text-[#006b2c] mt-0.5">payments</span>
                    <div>
                      <span className="text-xs font-bold text-[#131b2e] block">Target Budget Estimate</span>
                      <span className="text-[10px] text-[#6e7b6c] block mt-0.5">
                        Specify expected budget to fast-track contractor matching
                      </span>
                    </div>
                  </button>
                </div>

                {customPricingMode === 'BUDGET' && (
                  <div className="pt-2 border-t border-[#eaedff] flex items-center gap-3">
                    <label className="text-xs font-bold text-[#131b2e] shrink-0">Your Target Budget (₹):</label>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      className="w-36 px-3 py-1.5 rounded-xl bg-white border border-[#eaedff] text-xs font-bold text-[#006b2c] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
                    />
                    <span className="text-[11px] text-[#6e7b6c]">Final payment after work completion</span>
                  </div>
                )}
              </div>

              {/* Fulfillment Categorization: Groupable vs Dedicated Single-Household (As requested by user) */}
              <div className="p-4 rounded-2xl bg-[#f8faff] border border-[#eaedff] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#006b2c]">category</span>
                    <span>Service Allocation &amp; Grouping Type:</span>
                  </span>
                  <span className="text-[10px] text-[#006b2c] font-semibold">Required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomFulfillmentType('groupable')}
                    className={`p-3 rounded-xl text-left transition border cursor-pointer flex items-start gap-2.5 ${
                      customFulfillmentType === 'groupable'
                        ? 'bg-white border-[#006b2c] ring-1 ring-[#006b2c] shadow-xs'
                        : 'bg-[#f2f3ff] border-[#eaedff] hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl text-[#006b2c] mt-0.5 shrink-0">groups</span>
                    <div>
                      <span className="text-xs font-bold text-[#131b2e] block">👥 Groupable / Multi-House</span>
                      <span className="text-[10px] text-[#6e7b6c] block mt-0.5 leading-relaxed">
                        Electrician, plumber, AC, painter, carpenter, or serviceman who can service multiple flats sequentially or on weekend batch drives. Eligible for 20-35% group pooling!
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomFulfillmentType('exclusive');
                      setCustomJoinPool(false);
                    }}
                    className={`p-3 rounded-xl text-left transition border cursor-pointer flex items-start gap-2.5 ${
                      customFulfillmentType === 'exclusive'
                        ? 'bg-white border-amber-600 ring-1 ring-amber-600 shadow-xs'
                        : 'bg-[#f2f3ff] border-[#eaedff] hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl text-amber-700 mt-0.5 shrink-0">lock</span>
                    <div>
                      <span className="text-xs font-bold text-[#131b2e] block">🔒 Dedicated 1-on-1 (My Flat Only)</span>
                      <span className="text-[10px] text-[#6e7b6c] block mt-0.5 leading-relaxed">
                        In-home cook, full-day maid, chauffeur, nanny, nurse, or tutor allocated 100% to your flat. Cannot be shared across multiple kitchens or residences simultaneously.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 5. Date Selection with Calendar Picker & Shortcuts */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="customServiceDatePickerInput" className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5 cursor-pointer">
                    <span className="material-symbols-outlined text-sm text-[#006b2c]">calendar_month</span>
                    <span>Preferred Service Date:</span>
                  </label>
                  {customPreferredDate && (
                    <span className="text-[10px] font-semibold text-[#006b2c] bg-[#7ffc97]/30 px-2 py-0.5 rounded-md truncate max-w-[200px]" title={customPreferredDate}>
                      {customPreferredDate}
                    </span>
                  )}
                </div>

                {/* Quick Select Buttons: Today, Tomorrow, Weekend, Next Week */}
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => handleCustomModalQuickDate('today')}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer border flex items-center justify-center gap-0.5 ${
                      customDateISO === getTodayISO()
                        ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                        : 'bg-[#f2f3ff] text-[#3e4a3d] border-[#eaedff] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span>⚡ Today</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCustomModalQuickDate('tomorrow')}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer border flex items-center justify-center gap-0.5 ${
                      customDateISO === getTomorrowISO()
                        ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                        : 'bg-[#f2f3ff] text-[#3e4a3d] border-[#eaedff] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span>☀️ Tmrw</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCustomModalQuickDate('weekend')}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer border flex items-center justify-center gap-0.5 ${
                      customDateISO === getUpcomingSaturdayISO()
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                    }`}
                    title="Select upcoming Saturday weekend batch"
                  >
                    <span>📅 Weekend</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCustomModalQuickDate('next-week')}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer border flex items-center justify-center gap-0.5 ${
                      customDateISO === getNextWeekISO()
                        ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                        : 'bg-[#f2f3ff] text-[#3e4a3d] border-[#eaedff] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span>🗓️ Next Wk</span>
                  </button>
                </div>

                {/* Interactive Calendar Date Picker Input */}
                <div className="relative">
                  <input
                    type="date"
                    id="customServiceDatePickerInput"
                    min={getTodayISO()}
                    value={customDateISO}
                    onChange={handleCustomModalDateChange}
                    className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c] cursor-pointer hover:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* 6. Flexible Timing: Preset Windows + Exact Custom Time Picker (When you need it) */}
              <div className="p-4 rounded-2xl bg-[#f8faff] border border-[#eaedff] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#006b2c]">schedule</span>
                    <label className="text-xs font-bold text-[#131b2e]">
                      Service Timing: Standard Window or Pick Exact Time
                    </label>
                  </div>
                  {customPreferredTime && (
                    <span className="text-[10px] font-bold text-[#006b2c] bg-[#7ffc97]/30 px-2.5 py-0.5 rounded-full border border-[#006b2c]/20">
                      🕒 {customPreferredTime}
                    </span>
                  )}
                </div>

                {/* Preset Time Windows */}
                <div>
                  <span className="text-[11px] text-[#6e7b6c] block mb-1.5 font-medium">Select Time Window:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      '08:30 AM - 11:30 AM',
                      '12:00 PM - 03:00 PM',
                      '03:30 PM - 06:30 PM',
                      'Express 45-Mins'
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setCustomPreferredTime(slot);
                          setCustomExactTime('');
                        }}
                        className={`p-2 rounded-xl text-[11px] font-semibold text-center transition cursor-pointer border ${
                          customPreferredTime === slot
                            ? 'bg-[#006b2c] text-white border-[#006b2c] shadow-xs'
                            : 'bg-white text-[#3e4a3d] border-[#eaedff] hover:bg-[#eaedff]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exact Time Clock Picker & Custom Timing Note */}
                <div className="pt-2 border-t border-[#eaedff] flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                  <div className="flex items-center gap-2 shrink-0">
                    <label htmlFor="customExactTimePicker" className="text-[11px] font-bold text-[#131b2e] flex items-center gap-1 cursor-pointer">
                      <span className="material-symbols-outlined text-sm text-[#006b2c]">alarm</span>
                      <span>Pick Exact Time:</span>
                    </label>
                    <input
                      type="time"
                      id="customExactTimePicker"
                      value={customExactTime}
                      onChange={handleCustomExactTimeChange}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-[#eaedff] text-xs font-bold text-[#006b2c] focus:outline-none focus:ring-2 focus:ring-[#006b2c] cursor-pointer"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={customTimeNote}
                      onChange={handleCustomTimeNoteChange}
                      placeholder="Or specify custom timing note (e.g., 'Sharp at 10:15 AM before leaving for office')"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#eaedff] text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
                    />
                  </div>
                </div>
              </div>

              {/* 7. Special Instructions / Access Notes */}
              <div>
                <label className="text-xs font-bold text-[#131b2e] block mb-1.5 flex items-center justify-between">
                  <span>Special Access Instructions (Optional):</span>
                  <span className="text-[10px] text-[#6e7b6c]">Gate pass &amp; equipment note</span>
                </label>
                <input
                  type="text"
                  value={customSpecialInstructions}
                  onChange={(e) => setCustomSpecialInstructions(e.target.value)}
                  placeholder="e.g., Bring 6ft ladder; pets inside flat, please call before ringing doorbell"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
                />
              </div>

              {/* 8. Neighbor Demand Pooling Toggle vs Exclusive Allocation */}
              {customFulfillmentType === 'exclusive' ? (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-700 text-lg mt-0.5">verified_user</span>
                  <div>
                    <span className="font-bold block text-amber-900 text-xs">
                      Dedicated 1-on-1 Household Allocation (No Multi-Flat Sharing)
                    </span>
                    <span className="text-[11px] text-amber-800 mt-0.5 block leading-relaxed">
                      For dedicated home services (Cooks, Household Maids, Chauffeurs &amp; Tutors), staff cannot be split across multiple kitchens or flats simultaneously. Your booking guarantees 100% focused attention for your residence during the reserved slot.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#7ffc97]/30 to-[#f2f3ff] border border-[#006b2c]/20 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="customGroupPoolCheck"
                    checked={customJoinPool}
                    onChange={(e) => setCustomJoinPool(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#006b2c] rounded cursor-pointer accent-[#006b2c]"
                  />
                  <label htmlFor="customGroupPoolCheck" className="text-xs text-[#131b2e] cursor-pointer">
                    <span className="font-bold block text-[#006b2c]">
                      Broadcast to Neighbors in Tower A for Group Bulk Savings (20-35% Off)
                    </span>
                    <span className="text-[11px] text-[#3e4a3d] mt-0.5 block">
                      Invite neighbors with similar tasks to bundle together. Contractors give discounted group rates when serving multiple units on the same day.
                    </span>
                  </label>
                </div>
              )}

              {/* 9. Flat & Resident Details Summary */}
              <div className="p-3.5 rounded-xl bg-[#f8faff] border border-[#eaedff] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Assigned Residence</span>
                  <span className="font-bold text-[#131b2e]">
                    Oakridge Heights • Flat {currentUser?.flatNumber || 'A-1204'} ({currentUser?.tower || 'Tower A'})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Primary Resident</span>
                  <span className="font-bold text-[#131b2e]">
                    {currentUser?.name || 'Arjun Kumar'}
                  </span>
                </div>
              </div>

              {/* 10. Society Guarantee Badge */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700 text-lg">verified_user</span>
                  <span className="text-[11px] font-semibold text-emerald-900">
                    Police-verified technicians • Instant Gate Pass OTP upon quote acceptance
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  Pay After Completion
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#eaedff] text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Confirm &amp; Broadcast Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
