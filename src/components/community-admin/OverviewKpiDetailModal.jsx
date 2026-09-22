import React, { useState } from 'react';

export const OverviewKpiDetailModal = ({
  isOpen,
  kpiType, // 'OCCUPANCY' | 'MAINTENANCE_FLOW' | 'GATE_FLOW' | 'WORK_ORDERS_SLA'
  onClose,
  onNavigateTab,
  onOpenResolveTicket,
  onOpenEscalateTicket,
  onOpenRecordPayment,
  tickets = [],
  gateEntries = [],
  visitorPasses = [],
  treasuryData = null,
  onSimulateGateScan,
  showToast = () => {}
}) => {
  if (!isOpen) return null;

  // Sub-tabs for Maintenance Flow
  const [maintenanceSubTab, setMaintenanceSubTab] = useState('defaulters'); // 'defaulters' | 'towers' | 'summary'
  const [maintenanceSearch, setMaintenanceSearch] = useState('');
  const [maintenanceTowerFilter, setMaintenanceTowerFilter] = useState('ALL');

  // Sub-tabs for Gate Flow
  const [gateFilterType, setGateFilterType] = useState('ALL'); // 'ALL' | 'RFID' | 'DELIVERY' | 'CAB' | 'OVERSTAY'
  const [gateSearch, setGateSearch] = useState('');

  // Sub-tabs for Work Orders SLA
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState('ALL'); // 'ALL' | 'P1' | 'P2' | 'RESOLVED'
  const [ticketSearch, setTicketSearch] = useState('');

  // Default arrears ledger data
  const arrearsLedger = [
    { id: 'arr-1', suite: 'Suite B-402', tower: 'Tower B', name: 'Priya Saxena', type: 'Owner', dues: 28500, days: 45, lateFee: 632, phone: '+91 98765 12345' },
    { id: 'arr-2', suite: 'Suite C-1104', tower: 'Tower C', name: 'Rajesh Verma', type: 'Tenant', dues: 34200, days: 60, lateFee: 1020, phone: '+91 98111 22334' },
    { id: 'arr-3', suite: 'Suite A-902', tower: 'Tower A', name: 'Anita Menon', type: 'Owner', dues: 19000, days: 35, lateFee: 281, phone: '+91 97222 33445' },
    { id: 'arr-4', suite: 'Suite D-204', tower: 'Tower D', name: 'Gautam Singhania', type: 'Owner', dues: 41800, days: 75, lateFee: 1880, phone: '+91 99333 44556' },
    { id: 'arr-5', suite: 'Suite A-301', tower: 'Tower A', name: 'K. Venkatesh', type: 'Owner', dues: 15200, days: 32, lateFee: 220, phone: '+91 98444 55667' },
    { id: 'arr-6', suite: 'Suite B-805', tower: 'Tower B', name: 'Rohit Sharma', type: 'Tenant', dues: 22400, days: 40, lateFee: 450, phone: '+91 97555 66778' },
    { id: 'arr-7', suite: 'Suite C-402', tower: 'Tower C', name: 'Sanjay Deshmukh', type: 'Owner', dues: 18000, days: 38, lateFee: 310, phone: '+91 98666 77889' },
    { id: 'arr-8', suite: 'Villa 03', tower: 'Villas', name: 'Dr. Alok Nath', type: 'Owner', dues: 48500, days: 65, lateFee: 1450, phone: '+91 98777 88990' }
  ];

  // Filtered arrears
  const filteredArrears = arrearsLedger.filter((item) => {
    const matchesTower = maintenanceTowerFilter === 'ALL' || item.tower === maintenanceTowerFilter;
    const matchesSearch =
      item.suite.toLowerCase().includes(maintenanceSearch.toLowerCase()) ||
      item.name.toLowerCase().includes(maintenanceSearch.toLowerCase()) ||
      item.tower.toLowerCase().includes(maintenanceSearch.toLowerCase());
    return matchesTower && matchesSearch;
  });

  // Combined gate logs
  const combinedGateLogs = [
    ...(gateEntries || []),
    {
      id: 'g-sim-1',
      time: '10:55 AM',
      title: 'White Toyota Fortuner (TS 09 AB 1234)',
      desc: 'Resident RFID • Lane 1 Automated Barrier',
      dest: 'Suite A-1204 (Arjun Kumar)',
      type: 'RFID',
      status: 'Approved / Inside',
      overstay: false
    },
    {
      id: 'g-sim-2',
      time: '10:48 AM',
      title: 'Blinkit Grocery Delivery (KA 03 HY 8192)',
      desc: 'Delivery Pass • Verified by Security Console',
      dest: 'Suite B-602',
      type: 'Delivery',
      status: 'Inside Premises',
      overstay: false
    },
    {
      id: 'g-sim-3',
      time: '10:20 AM',
      title: 'Uber Premier Sedan (DL 1Z 7789)',
      desc: 'Guest of Dr. Kapoor • Gate 2 Exit',
      dest: 'Suite C-801',
      type: 'Cab',
      status: 'Exited Lane 2',
      overstay: false
    },
    {
      id: 'g-sim-4',
      time: '08:12 AM',
      title: 'Contractor Sump Repair Van (TS 10 ZZ 5544)',
      desc: 'Plumbing AMC Crew • Overstay Flagged >4h',
      dest: 'Basement 2 Sump Pump',
      type: 'Contractor',
      status: 'OVERSTAY 2h 45m',
      overstay: true
    }
  ];

  const filteredGateLogs = combinedGateLogs.filter((item) => {
    let matchesType = true;
    if (gateFilterType === 'RFID') matchesType = (item.type || '').toLowerCase().includes('rfid') || (item.desc || '').toLowerCase().includes('rfid');
    else if (gateFilterType === 'DELIVERY') matchesType = (item.type || '').toLowerCase().includes('parcel') || (item.type || '').toLowerCase().includes('delivery');
    else if (gateFilterType === 'CAB') matchesType = (item.type || '').toLowerCase().includes('cab') || (item.type || '').toLowerCase().includes('taxi');
    else if (gateFilterType === 'OVERSTAY') matchesType = !!item.overstay || (item.status || '').toLowerCase().includes('overstay');

    const matchesSearch =
      (item.title || '').toLowerCase().includes(gateSearch.toLowerCase()) ||
      (item.dest || '').toLowerCase().includes(gateSearch.toLowerCase()) ||
      (item.desc || '').toLowerCase().includes(gateSearch.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Default tickets fallback if empty
  const defaultTickets = [
    {
      id: 'ticket-1',
      title: 'Tower A Lift #2 Hydraulic Sensor Fault',
      urgency: 'P1 CRITICAL',
      assigned: 'Otis Elevators Field Tech (Suresh K.)',
      sla: 'SLA Countdown: 42 mins remaining',
      cat: 'critical lifts',
      resolved: false
    },
    {
      id: 'ticket-2',
      title: 'Clubhouse Water Softener Regeneration Flange Leak',
      urgency: 'P2 MEDIUM',
      assigned: 'AquaPure Tech Services (Ramesh D.)',
      sla: 'In Progress • ETA 5:00 PM',
      cat: 'water',
      resolved: false
    },
    {
      id: 'ticket-3',
      title: 'DG Set AMF Panel Synchronizer Calibration',
      urgency: 'P2 SCHEDULED',
      assigned: 'Cummins India Service • Annual audit protocol',
      sla: 'Scheduled for Saturday 11:00 AM',
      cat: 'critical lifts',
      resolved: false
    },
    {
      id: 'ticket-4',
      title: 'Tower C Fire Alarm Sensor False Trigger in Staged B2',
      urgency: 'P1 CRITICAL',
      assigned: 'Honeywell Life Safety System AMC',
      sla: 'SLA Countdown: 1h 15m remaining',
      cat: 'safety',
      resolved: false
    },
    {
      id: 'ticket-5',
      title: 'Basement 2 Stormwater Sump Pump 3 Tripped',
      urgency: 'P1 CRITICAL',
      assigned: 'Drainage & Pump Facilities AMC',
      sla: 'SLA Countdown: 55m remaining',
      cat: 'water',
      resolved: false
    },
    {
      id: 'ticket-6',
      title: 'Tower D Corridor Emergency Battery Inverter Backup',
      urgency: 'P2 MEDIUM',
      assigned: 'Electrical Facility Desk',
      sla: 'In Progress • ETA 3h remaining',
      cat: 'electrical',
      resolved: false
    }
  ];

  const currentTickets = tickets && tickets.length > 0 ? tickets : defaultTickets;

  const filteredTickets = currentTickets.filter((t) => {
    let matchesCategory = true;
    if (ticketCategoryFilter === 'P1') matchesCategory = (t.urgency || '').includes('P1') || (t.urgency || '').includes('CRITICAL');
    else if (ticketCategoryFilter === 'P2') matchesCategory = (t.urgency || '').includes('P2') || (t.urgency || '').includes('MEDIUM');
    else if (ticketCategoryFilter === 'RESOLVED') matchesCategory = !!t.resolved;

    const matchesSearch =
      (t.title || '').toLowerCase().includes(ticketSearch.toLowerCase()) ||
      (t.assigned || '').toLowerCase().includes(ticketSearch.toLowerCase()) ||
      (t.id || '').toLowerCase().includes(ticketSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-[#eaedff] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl shadow-sm ${
                kpiType === 'OCCUPANCY'
                  ? 'bg-[#7ffc97]/30 text-[#006b2c]'
                  : kpiType === 'MAINTENANCE_FLOW'
                  ? 'bg-[#c9e6ff] text-[#006591]'
                  : kpiType === 'GATE_FLOW'
                  ? 'bg-[#ffddb8] text-[#825100]'
                  : 'bg-[#ffdad6] text-[#ba1a1a]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                {kpiType === 'OCCUPANCY' && 'domain'}
                {kpiType === 'MAINTENANCE_FLOW' && 'account_balance_wallet'}
                {kpiType === 'GATE_FLOW' && 'gate'}
                {kpiType === 'WORK_ORDERS_SLA' && 'handyman'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#131b2e]">
                  {kpiType === 'OCCUPANCY' && 'Total Units Occupancy & Demographic Census'}
                  {kpiType === 'MAINTENANCE_FLOW' && 'Maintenance Inflow & Financial Collection Flow'}
                  {kpiType === 'GATE_FLOW' && 'Daily Gate Flow & Real-Time ANPR Barrier Stream'}
                  {kpiType === 'WORK_ORDERS_SLA' && 'Work Orders, Active Maintenance & SLA Tracker'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#006591] text-[10px] font-bold">
                  President Audit Live
                </span>
              </div>
              <p className="text-xs text-[#6e7b6c]">
                {kpiType === 'OCCUPANCY' && 'Real-time census across Towers A, B, C, D & Villas (420 Suites)'}
                {kpiType === 'MAINTENANCE_FLOW' && 'FY25 collections, tower velocity & individual flat arrears breakdown'}
                {kpiType === 'GATE_FLOW' && 'Automated ANPR vehicle barrier, delivery OTPs & overstay telemetry'}
                {kpiType === 'WORK_ORDERS_SLA' && 'Real-time MTTR performance, vendor SLAs & urgent sign-offs'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6e7b6c] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* 1. OCCUPANCY BREAKDOWN */}
        {kpiType === 'OCCUPANCY' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#f2f3ff] rounded-xl text-center border border-[#eaedff]">
                <span className="text-2xl font-bold text-[#006b2c]">395</span>
                <span className="block text-[11px] text-[#6e7b6c] mt-0.5 font-medium">Occupied Units (94.0%)</span>
                <span className="text-[10px] text-[#006b2c] font-bold mt-1 inline-block bg-[#7ffc97]/20 px-2 py-0.5 rounded-full">+12 MoM</span>
              </div>
              <div className="p-3.5 bg-[#f2f3ff] rounded-xl text-center border border-[#eaedff]">
                <span className="text-2xl font-bold text-[#825100]">25</span>
                <span className="block text-[11px] text-[#6e7b6c] mt-0.5 font-medium">Vacant / Fit-out (6.0%)</span>
                <span className="text-[10px] text-[#825100] font-bold mt-1 inline-block bg-[#ffddb8]/30 px-2 py-0.5 rounded-full">4 Handover Pending</span>
              </div>
              <div className="p-3.5 bg-[#f2f3ff] rounded-xl text-center border border-[#eaedff]">
                <span className="text-2xl font-bold text-[#006591]">420</span>
                <span className="block text-[11px] text-[#6e7b6c] mt-0.5 font-medium">Total Registered Units</span>
                <span className="text-[10px] text-[#006591] font-bold mt-1 inline-block bg-[#c9e6ff]/40 px-2 py-0.5 rounded-full">4 Towers + Villas</span>
              </div>
            </div>

            {/* Resident Demographics */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-white border border-[#eaedff] rounded-xl">
              <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg">
                <div>
                  <span className="text-xs font-bold text-[#131b2e]">Owner-Occupied</span>
                  <span className="text-[11px] text-[#6e7b6c] block">Primary MC voting members</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#006b2c]">278 Units</span>
                  <span className="text-[10px] text-[#6e7b6c] block">70.4%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg">
                <div>
                  <span className="text-xs font-bold text-[#131b2e]">Registered Tenants</span>
                  <span className="text-[11px] text-[#6e7b6c] block">Police verification synched</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#006591]">117 Units</span>
                  <span className="text-[10px] text-[#6e7b6c] block">29.6%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f2f3ff] p-4 rounded-xl flex flex-col gap-2.5 border border-[#eaedff]">
              <span className="font-bold text-sm text-[#131b2e]">Tower-by-Tower Occupancy Status</span>
              <div className="space-y-2">
                {[
                  { tower: 'Tower A (High-Rise)', occupied: 108, total: 112, pct: '96.4%', color: '#006b2c' },
                  { tower: 'Tower B (Mid-Rise)', occupied: 98, total: 104, pct: '94.2%', color: '#006591' },
                  { tower: 'Tower C (High-Rise)', occupied: 96, total: 100, pct: '96.0%', color: '#006b2c' },
                  { tower: 'Tower D (Park View)', occupied: 93, total: 104, pct: '89.4%', color: '#825100' }
                ].map((row, i) => (
                  <div key={i} className="flex flex-col gap-1 p-2.5 bg-white rounded-lg border border-[#eaedff]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#131b2e]">{row.tower}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#6e7b6c]">{row.occupied} / {row.total} units</span>
                        <span className="font-bold text-[#006b2c]">{row.pct}</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#e2e7ff] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: row.pct, backgroundColor: row.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#eaedff]">
              <button
                onClick={() => {
                  showToast('Census report exported to CSV.', 'success');
                }}
                className="flex items-center gap-1.5 text-xs text-[#006591] font-bold hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Download Census Sheet
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[#3e4a3d] hover:bg-[#f2f3ff] font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('board');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#006b2c] text-white hover:bg-[#00873a] font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  Open Resident KYC Console
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. MAINTENANCE INFLOW BREAKDOWN */}
        {kpiType === 'MAINTENANCE_FLOW' && (
          <div className="flex flex-col gap-4 text-xs">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                <span className="text-xl font-bold text-[#006b2c]">₹42.80L</span>
                <span className="block text-[11px] text-[#6e7b6c] mt-0.5">Collected (92.6%)</span>
                <span className="text-[10px] text-[#006b2c] font-bold">395 Units Paid</span>
              </div>
              <div className="p-3 bg-[#ffdad6]/40 rounded-xl border border-[#ffdad6]">
                <span className="text-xl font-bold text-[#ba1a1a]">₹3.40L</span>
                <span className="block text-[11px] text-[#ba1a1a] mt-0.5 font-semibold">Overdue Arrears</span>
                <span className="text-[10px] text-[#ba1a1a] font-bold">25 Defaulter Units</span>
              </div>
              <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                <span className="text-xl font-bold text-[#131b2e]">₹46.20L</span>
                <span className="block text-[11px] text-[#6e7b6c] mt-0.5">Total Billed Target</span>
                <span className="text-[10px] text-[#6e7b6c] font-medium">Monthly Assessment</span>
              </div>
              <div className="p-3 bg-[#c9e6ff]/30 rounded-xl border border-[#c9e6ff]">
                <span className="text-xl font-bold text-[#006591]">
                  ₹{((treasuryData?.reserveFundBalance || 12850000) / 100000).toFixed(2)}L
                </span>
                <span className="block text-[11px] text-[#006591] mt-0.5 font-semibold">Sinking Reserve</span>
                <span className="text-[10px] text-[#006591] font-bold">Audited &amp; Escrowed</span>
              </div>
            </div>

            {/* Sub-tab Pill Switcher */}
            <div className="flex items-center justify-between gap-2 border-b border-[#eaedff] pb-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMaintenanceSubTab('defaulters')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    maintenanceSubTab === 'defaulters'
                      ? 'bg-[#ba1a1a] text-white shadow-sm'
                      : 'bg-[#f2f3ff] text-[#6e7b6c] hover:text-[#131b2e]'
                  }`}
                >
                  Defaulters &amp; Arrears ({filteredArrears.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMaintenanceSubTab('towers')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    maintenanceSubTab === 'towers'
                      ? 'bg-[#006591] text-white shadow-sm'
                      : 'bg-[#f2f3ff] text-[#6e7b6c] hover:text-[#131b2e]'
                  }`}
                >
                  Tower Velocity Breakdown
                </button>
                <button
                  type="button"
                  onClick={() => setMaintenanceSubTab('summary')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    maintenanceSubTab === 'summary'
                      ? 'bg-[#006b2c] text-white shadow-sm'
                      : 'bg-[#f2f3ff] text-[#6e7b6c] hover:text-[#131b2e]'
                  }`}
                >
                  Collection Categories
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Defaulters & Arrears */}
            {maintenanceSubTab === 'defaulters' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#f2f3ff] p-2.5 rounded-xl border border-[#eaedff]">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#6e7b6c] text-base">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Search unit (e.g. B-402), resident name..."
                      value={maintenanceSearch}
                      onChange={(e) => setMaintenanceSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#dae2fd] rounded-lg text-xs text-[#131b2e] focus:outline-none focus:border-[#006591]"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-[#6e7b6c] font-semibold">Tower:</span>
                    <select
                      value={maintenanceTowerFilter}
                      onChange={(e) => setMaintenanceTowerFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-[#dae2fd] rounded-lg text-xs font-medium text-[#131b2e] focus:outline-none"
                    >
                      <option value="ALL">All Towers</option>
                      <option value="Tower A">Tower A</option>
                      <option value="Tower B">Tower B</option>
                      <option value="Tower C">Tower C</option>
                      <option value="Tower D">Tower D</option>
                      <option value="Villas">Villas</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {filteredArrears.length === 0 ? (
                    <div className="p-4 text-center text-[#6e7b6c] bg-[#f2f3ff] rounded-xl">
                      No overdue defaulters matching your criteria.
                    </div>
                  ) : (
                    filteredArrears.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white border border-[#eaedff] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#ba1a1a]/40 transition-all shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center font-bold text-xs shrink-0">
                            {item.suite.split('-')[0].replace('Suite ', '')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#131b2e] text-xs">{item.suite}</span>
                              <span className="text-[#6e7b6c]">•</span>
                              <span className="font-semibold text-[#131b2e] text-xs">{item.name}</span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#f2f3ff] text-[#6e7b6c]">
                                {item.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#6e7b6c]">
                              <span className="text-[#ba1a1a] font-bold">{item.days} Days Overdue</span>
                              <span>•</span>
                              <span>Late Fee: ₹{item.lateFee}</span>
                              <span>•</span>
                              <span>{item.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2.5">
                          <div className="text-right">
                            <span className="text-sm font-bold text-[#ba1a1a] block">
                              ₹{item.dues.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-[#6e7b6c]">Pending</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                showToast(`WhatsApp & Email reminder notice dispatched to ${item.name} (${item.suite}).`, 'success');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#006591] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                              title="Send WhatsApp / SMS Notice"
                            >
                              <span className="material-symbols-outlined text-sm">notifications_active</span>
                              Remind
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenRecordPayment({
                                  suite: item.suite,
                                  name: item.name,
                                  defaultAmount: String(item.dues)
                                });
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">receipt</span>
                              Collect
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 2: Tower Velocity */}
            {maintenanceSubTab === 'towers' && (
              <div className="space-y-2.5">
                {[
                  { tower: 'Tower A (105 Units)', collected: '₹12.40L', target: '₹12.80L', rate: '96.8%', arrears: '₹0.40L', color: '#006b2c' },
                  { tower: 'Tower B (105 Units)', collected: '₹10.80L', target: '₹11.60L', rate: '93.1%', arrears: '₹0.80L', color: '#006591' },
                  { tower: 'Tower C (105 Units)', collected: '₹9.60L', target: '₹10.40L', rate: '92.3%', arrears: '₹0.80L', color: '#006591' },
                  { tower: 'Tower D (105 Units)', collected: '₹7.20L', target: '₹8.10L', rate: '88.8%', arrears: '₹0.90L', color: '#825100' },
                  { tower: 'Villas & Penthouses (15 Units)', collected: '₹2.80L', target: '₹3.30L', rate: '84.8%', arrears: '₹0.50L', color: '#ba1a1a' }
                ].map((t, idx) => (
                  <div key={idx} className="p-3 bg-white border border-[#eaedff] rounded-xl flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }}></span>
                        <span className="font-bold text-[#131b2e] text-xs">{t.tower}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#6e7b6c]">{t.collected} collected of {t.target}</span>
                        <span className="font-bold" style={{ color: t.color }}>{t.rate}</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden flex">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: t.rate, backgroundColor: t.color }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#6e7b6c]">
                      <span>On-time collection deadline: 10th of every month</span>
                      <span className="text-[#ba1a1a] font-semibold">Arrears: {t.arrears}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-tab 3: Summary by Category */}
            {maintenanceSubTab === 'summary' && (
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'Common Area Maintenance (CAM)', budgeted: '₹26.50L', received: '₹24.80L', pct: '93.6%', desc: 'Security, Housekeeping, Gardening & Common Utilities' },
                  { name: 'Sinking / Reserve Fund Assessment', budgeted: '₹9.20L', received: '₹8.80L', pct: '95.6%', desc: 'Long-term structural capital repairs & elevator overhaul' },
                  { name: 'Diesel Generator (DG) Power Surcharge', budgeted: '₹6.80L', received: '₹5.90L', pct: '86.7%', desc: 'Automatic power backup fuel & AMF panel upkeep' },
                  { name: 'Clubhouse & Recreational Amenities', budgeted: '₹3.70L', received: '₹3.30L', pct: '89.2%', desc: 'Pool chemistry, gymnasium equipment & badminton court' }
                ].map((cat, i) => (
                  <div key={i} className="p-3 bg-white border border-[#eaedff] rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-[#131b2e] text-xs block">{cat.name}</span>
                      <p className="text-[11px] text-[#6e7b6c] mt-0.5">{cat.desc}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#eaedff] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#006b2c]">{cat.received}</span>
                      <span className="text-[11px] text-[#6e7b6c]">of {cat.budgeted} ({cat.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#eaedff]">
              <button
                onClick={() => {
                  showToast('Financial collection ledger exported to CSV file.', 'success');
                }}
                className="flex items-center gap-1.5 text-xs text-[#006591] font-bold hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Export Ledger CSV
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[#3e4a3d] hover:bg-[#f2f3ff] font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('dues');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#006591] text-white hover:opacity-90 font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                  Open Society Dues &amp; Billing Ledger →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. DAILY GATE FLOW BREAKDOWN */}
        {kpiType === 'GATE_FLOW' && (
          <div className="flex flex-col gap-4 text-xs">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div
                onClick={() => setGateFilterType('RFID')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  gateFilterType === 'RFID'
                    ? 'bg-[#7ffc97]/30 border-[#006b2c] shadow-xs'
                    : 'bg-[#f2f3ff] border-[#eaedff] hover:border-[#006b2c]/50'
                }`}
              >
                <span className="text-xl font-bold text-[#006b2c]">842</span>
                <span className="block text-[11px] text-[#6e7b6c]">RFID Residents</span>
                <span className="text-[10px] text-[#006b2c] font-bold">FastTag Automated</span>
              </div>
              <div
                onClick={() => setGateFilterType('DELIVERY')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  gateFilterType === 'DELIVERY'
                    ? 'bg-[#c9e6ff]/40 border-[#006591] shadow-xs'
                    : 'bg-[#f2f3ff] border-[#eaedff] hover:border-[#006591]/50'
                }`}
              >
                <span className="text-xl font-bold text-[#006591]">268</span>
                <span className="block text-[11px] text-[#6e7b6c]">Delivery &amp; Couriers</span>
                <span className="text-[10px] text-[#006591] font-bold">OTP Passcode Validated</span>
              </div>
              <div
                onClick={() => setGateFilterType('CAB')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  gateFilterType === 'CAB'
                    ? 'bg-[#ffddb8]/40 border-[#825100] shadow-xs'
                    : 'bg-[#f2f3ff] border-[#eaedff] hover:border-[#825100]/50'
                }`}
              >
                <span className="text-xl font-bold text-[#825100]">138</span>
                <span className="block text-[11px] text-[#6e7b6c]">Guests &amp; Cabs</span>
                <span className="text-[10px] text-[#825100] font-bold">Resident App Pre-Approved</span>
              </div>
              <div
                onClick={() => setGateFilterType('OVERSTAY')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  gateFilterType === 'OVERSTAY'
                    ? 'bg-[#ffdad6] border-[#ba1a1a] shadow-xs'
                    : 'bg-[#ffdad6]/40 border-[#ffdad6] hover:border-[#ba1a1a]/50'
                }`}
              >
                <span className="text-xl font-bold text-[#ba1a1a]">2</span>
                <span className="block text-[11px] text-[#ba1a1a] font-bold">Overstays (&gt;4h)</span>
                <span className="text-[10px] text-[#ba1a1a] font-bold">Security Alert Active</span>
              </div>
            </div>

            {/* Filter Bar & Quick ANPR Simulator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#f2f3ff] p-2.5 rounded-xl border border-[#eaedff]">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#6e7b6c] text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search license plate, driver, unit destination..."
                  value={gateSearch}
                  onChange={(e) => setGateSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#dae2fd] rounded-lg text-xs text-[#131b2e] focus:outline-none focus:border-[#006591]"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setGateFilterType('ALL')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    gateFilterType === 'ALL' ? 'bg-[#131b2e] text-white' : 'bg-white text-[#6e7b6c]'
                  }`}
                >
                  All ({combinedGateLogs.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSimulateGateScan) onSimulateGateScan();
                    showToast('Simulated ANPR fast-pass entry captured at Gate 1!', 'success');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                  + ANPR Scan
                </button>
              </div>
            </div>

            {/* Live Gate Barrier Feed */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredGateLogs.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 bg-white border rounded-xl flex items-center justify-between gap-3 shadow-xs ${
                    item.overstay ? 'border-[#ba1a1a] bg-[#fff8f7]' : 'border-[#eaedff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        item.overstay
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : (item.type || '').includes('RFID')
                          ? 'bg-[#7ffc97]/30 text-[#006b2c]'
                          : 'bg-[#c9e6ff] text-[#006591]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {item.overstay ? 'warning' : (item.type || '').includes('RFID') ? 'directions_car' : 'local_shipping'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#131b2e] text-xs">{item.title}</span>
                        {item.overstay && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#ba1a1a] text-white font-bold animate-pulse">
                            FLAGGED OVERSTAY
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#6e7b6c] block mt-0.5">
                        {item.dest} • {item.desc}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#131b2e] block">{item.time}</span>
                    <span
                      className={`text-[11px] font-bold ${
                        item.overstay ? 'text-[#ba1a1a]' : 'text-[#006b2c]'
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.overstay && (
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Security Havaldar alerted at Gate 1 regarding ${item.title}. Intercom active.`, 'info');
                        }}
                        className="mt-1 px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[10px] font-bold cursor-pointer hover:bg-red-700"
                      >
                        Intercom Guard
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#006b2c] animate-pulse"></span>
                <span className="text-[11px] text-[#6e7b6c] font-medium">
                  Gate 1 &amp; Gate 2 ANPR Cameras Synchronized
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[#3e4a3d] hover:bg-[#f2f3ff] font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('gate');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#825100] text-white hover:opacity-90 font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                  Open Gate Passes &amp; Visitor Stream →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. WORK ORDERS & SLA BREAKDOWN */}
        {kpiType === 'WORK_ORDERS_SLA' && (
          <div className="flex flex-col gap-4 text-xs">
            {/* Top Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                <span className="text-xl font-bold text-[#131b2e]">{currentTickets.length}</span>
                <span className="block text-[11px] text-[#6e7b6c]">Total Work Orders</span>
                <span className="text-[10px] text-[#006591] font-bold">14 Estate Wide</span>
              </div>
              <div className="p-3 bg-[#ffdad6]/50 rounded-xl border border-[#ffdad6]">
                <span className="text-xl font-bold text-[#ba1a1a]">3</span>
                <span className="block text-[11px] text-[#ba1a1a] font-bold">Critical P1 Queue</span>
                <span className="text-[10px] text-[#ba1a1a] font-bold">&lt;2h SLA Window</span>
              </div>
              <div className="p-3 bg-[#7ffc97]/30 rounded-xl border border-[#7ffc97]/40">
                <span className="text-xl font-bold text-[#006b2c]">98.2%</span>
                <span className="block text-[11px] text-[#006b2c] font-bold">On-Time SLA Rate</span>
                <span className="text-[10px] text-[#006b2c] font-semibold">+1.4% vs FY Target</span>
              </div>
              <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                <span className="text-xl font-bold text-[#131b2e]">2.4 Hours</span>
                <span className="block text-[11px] text-[#6e7b6c]">Average MTTR</span>
                <span className="text-[10px] text-[#6e7b6c] font-medium">Mean Time to Resolve</span>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#f2f3ff] p-2.5 rounded-xl border border-[#eaedff]">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#6e7b6c] text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search work order title, technician, ticket ID..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#dae2fd] rounded-lg text-xs text-[#131b2e] focus:outline-none focus:border-[#006591]"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTicketCategoryFilter('ALL')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    ticketCategoryFilter === 'ALL' ? 'bg-[#131b2e] text-white' : 'bg-white text-[#6e7b6c]'
                  }`}
                >
                  All ({currentTickets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTicketCategoryFilter('P1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    ticketCategoryFilter === 'P1' ? 'bg-[#ba1a1a] text-white' : 'bg-white text-[#ba1a1a]'
                  }`}
                >
                  Critical P1 (3)
                </button>
                <button
                  type="button"
                  onClick={() => setTicketCategoryFilter('P2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    ticketCategoryFilter === 'P2' ? 'bg-[#825100] text-white' : 'bg-white text-[#825100]'
                  }`}
                >
                  Elevated P2 (6)
                </button>
              </div>
            </div>

            {/* Active Tickets List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredTickets.map((ticket) => {
                const isCritical = (ticket.urgency || '').includes('P1') || (ticket.urgency || '').includes('CRITICAL');
                return (
                  <div
                    key={ticket.id}
                    className={`p-3 bg-white rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs ${
                      ticket.resolved
                        ? 'border-[#7ffc97] bg-[#f7fdf8]'
                        : isCritical
                        ? 'border-l-4 border-l-[#ba1a1a] border-[#eaedff]'
                        : 'border-l-4 border-l-[#825100] border-[#eaedff]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                          ticket.resolved
                            ? 'bg-[#7ffc97]/40 text-[#006b2c]'
                            : isCritical
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#ffddb8] text-[#825100]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {ticket.resolved ? 'check_circle' : isCritical ? 'emergency' : 'handyman'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#131b2e] text-xs">{ticket.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ticket.resolved
                                ? 'bg-[#7ffc97]/40 text-[#006b2c]'
                                : isCritical
                                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                : 'bg-[#f2f3ff] text-[#6e7b6c]'
                            }`}
                          >
                            {ticket.resolved ? 'RESOLVED' : ticket.urgency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6e7b6c]">
                          <span>{ticket.assigned}</span>
                          <span>•</span>
                          <span className={isCritical && !ticket.resolved ? 'text-[#ba1a1a] font-bold' : ''}>
                            {ticket.sla}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!ticket.resolved ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenResolveTicket(ticket);
                            }}
                            className="px-3 py-1.5 bg-[#006b2c] hover:bg-[#00873a] text-white font-bold rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-sm">verified</span>
                            Resolve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenEscalateTicket(ticket);
                            }}
                            className="px-3 py-1.5 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] font-bold rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">priority_high</span>
                            Escalate
                          </button>
                        </>
                      ) : (
                        <span className="px-3 py-1 bg-[#7ffc97]/30 text-[#006b2c] font-bold rounded-lg text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">done_all</span>
                          Signed Off
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#eaedff]">
              <div className="flex items-center gap-3 text-[11px] text-[#6e7b6c]">
                <span>Otis AMC (Lifts): 99.1% SLA</span>
                <span>•</span>
                <span>AquaPure (Plumbing): 96.5% SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[#3e4a3d] hover:bg-[#f2f3ff] font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('maintenance');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white hover:opacity-90 font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">handyman</span>
                  Open Maintenance SLA Console →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
