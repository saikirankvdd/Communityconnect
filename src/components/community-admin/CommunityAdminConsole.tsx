import React, { useState } from 'react';
import { OccupancyConflictCase } from '../../types';
import { verificationApi } from '../../api/verificationApi';
import { 
  Building2, 
  Users, 
  IndianRupee, 
  ShieldCheck, 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  PhoneCall, 
  Calendar, 
  Plus, 
  ExternalLink, 
  Check, 
  X, 
  ArrowRight, 
  ChevronRight, 
  FileCheck2, 
  Key, 
  ShieldAlert, 
  UserCheck, 
  MessageSquare,
  Sparkles,
  Download
} from 'lucide-react';

interface CommunityAdminConsoleProps {
  onOpenGateView?: () => void;
}

export const CommunityAdminConsole: React.FC<CommunityAdminConsoleProps> = ({ onOpenGateView }) => {
  const [cases, setCases] = useState<OccupancyConflictCase[]>(verificationApi.getCases());
  const [selectedCase, setSelectedCase] = useState<OccupancyConflictCase | null>(cases[0]);
  const [show7StepModal, setShow7StepModal] = useState(false);
  const [chartView, setChartView] = useState<'MONTHLY' | 'TOWER'>('MONTHLY');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Action notices
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('MAINTENANCE');

  // Trigger simulated WhatsApp Reminder
  const handleSendWhatsApp = (residentName: string, unit: string, amount: string) => {
    setToastMessage(`WhatsApp Dues notice dispatched to ${residentName} (${unit}) for ₹${amount}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Verification step actions inside the 7-step modal
  const handleGrantTempPass = (caseId: string) => {
    const updated = verificationApi.approveTemporaryPass(caseId, 5);
    setCases(verificationApi.getCases());
    setSelectedCase(updated);
    setToastMessage(`5-Day Temporary Access Pass approved for ${updated.incomingResident.name} (${updated.unit}).`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFinalizePermanent = (caseId: string) => {
    const updated = verificationApi.finalizePermanentApproval(caseId);
    setCases(verificationApi.getCases());
    setSelectedCase(updated);
    setToastMessage(`Permanent tenancy registered! Outgoing tenant deactivated.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Dues Bar Chart Data
  const monthlyDuesData = [
    { month: 'Apr', target: 45, actual: 44.2 },
    { month: 'May', target: 45, actual: 43.8 },
    { month: 'Jun', target: 46, actual: 45.1 },
    { month: 'Jul', target: 46, actual: 44.9 },
    { month: 'Aug', target: 46.2, actual: 45.5 },
    { month: 'Sep', target: 46.2, actual: 42.8 }
  ];

  const towerDuesData = [
    { tower: 'Tower A', target: 12.0, actual: 11.8, count: '105 Units' },
    { tower: 'Tower B', target: 11.5, actual: 10.4, count: '105 Units' },
    { tower: 'Tower C', target: 11.5, actual: 10.8, count: '105 Units' },
    { tower: 'Tower D', target: 11.2, actual: 9.8, count: '105 Units' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Header / Estate Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                COMMUNITY ADMIN OPERATIONS
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-600 text-xs font-semibold">Oakridge Heights (Hyderabad)</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              Community Admin &amp; Council Dashboard
            </h1>
            <p className="text-xs text-gray-500">
              Presiding Officer: Elena Rostova (Council President, Unit B-402)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowNoticeModal(true)}
              className="px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Notice</span>
            </button>
            <button
              onClick={() => alert('New domestic staff / vendor badge registration portal open.')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
            >
              + Staff Pass
            </button>
            <button
              onClick={() => {
                setToastMessage('September Maintenance Invoices queued for 420 units via WhatsApp & Email.');
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
            >
              Run Invoices
            </button>
            <button
              onClick={() => alert('Exporting monthly audit register in XLSX format...')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Occupancy */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                TOTAL OCCUPANCY
              </span>
              <Building2 className="w-4 h-4 text-[#16A34A]" />
            </div>
            <div className="text-3xl font-bold text-gray-900 font-display">
              94.0% <span className="text-xs font-normal text-gray-500">/ 420 Units</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-700 font-semibold">395 Occupied</span>
              <span>•</span>
              <span className="text-gray-500">25 Vacant / Reno</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">+12 MoM</span>
            </div>
          </div>

          {/* Card 2: Maintenance Inflow */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                MAINTENANCE INFLOW
              </span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 font-display">
              ₹42.8L <span className="text-xs font-normal text-gray-500">/ ₹46.2L</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <span className="text-emerald-700 font-semibold">92.6% Collected</span> • ₹3.4L Overdue (18 flats)
            </div>
          </div>

          {/* Card 3: Gate Flow */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                DAILY SECURITY GATE FLOW
              </span>
              <ShieldCheck className="w-4 h-4 text-[#0EA5E9]" />
            </div>
            <div className="text-3xl font-bold text-gray-900 font-display">1,248</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <span>842 RFID Auto</span>
              <span>•</span>
              <span>268 Service</span>
              <span>•</span>
              <span className="text-rose-600 font-semibold">2 Overstays</span>
            </div>
          </div>

          {/* Card 4: Work Orders & SLA */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                WORK ORDERS &amp; SLA
              </span>
              <Wrench className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="text-3xl font-bold text-gray-900 font-display">14 Active</div>
            <div className="text-xs text-gray-500 mt-1">
              <span className="text-rose-600 font-bold">3 Critical</span> • 98.2% SLA • Avg MTTR 2.4h
            </div>
          </div>
        </div>

        {/* 2-Column Core Operations Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center 8-Cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* Dues Collection Trend & Action Queue */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Dues Collection Trend vs Budget Target
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    FY 2026-27 Revenue realization against estate operating expenditure
                  </p>
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setChartView('MONTHLY')}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      chartView === 'MONTHLY' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    Monthly View
                  </button>
                  <button
                    onClick={() => setChartView('TOWER')}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      chartView === 'TOWER' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    By Tower Breakdown
                  </button>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="pt-5">
                {chartView === 'MONTHLY' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-6 gap-2 text-center text-xs">
                      {monthlyDuesData.map((d) => {
                        const pct = Math.round((d.actual / d.target) * 100);
                        return (
                          <div key={d.month} className="flex flex-col items-center">
                            <div className="text-[11px] font-bold text-gray-700 mb-1">
                              ₹{d.actual}L
                            </div>
                            {/* Bar container */}
                            <div className="w-full bg-gray-100 rounded-t-lg h-32 relative flex items-end justify-center p-1">
                              {/* Target marker line */}
                              <div className="absolute top-2 w-full border-t border-dashed border-gray-300"></div>
                              {/* Actual bar */}
                              <div
                                style={{ height: `${pct}%` }}
                                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-md transition-all duration-500"
                              ></div>
                            </div>
                            <div className="text-xs font-semibold text-gray-900 mt-2">{d.month}</div>
                            <div className="text-[10px] text-emerald-700 font-semibold">{pct}%</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-emerald-500"></span>
                        <span>Actual Inflow</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 border-t border-dashed border-gray-400"></span>
                        <span>Budget Target (₹46.2L)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {towerDuesData.map((t) => (
                      <div key={t.tower} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-gray-900">{t.tower} ({t.count})</span>
                          <span className="font-semibold text-emerald-700">₹{t.actual}L collected of ₹{t.target}L</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${(t.actual / t.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Critical Collection Action Queue */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Critical Collection Action Queue (Overdue &gt; 30 Days)</span>
                  </h3>
                  <span className="text-[11px] text-gray-400">3 Priority Accounts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Item 1 */}
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">Suite B-402</span>
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          45d Overdue
                        </span>
                      </div>
                      <p className="text-gray-600 text-[11px] mt-0.5">Priya Saxena</p>
                      <div className="text-base font-bold text-rose-700 mt-1">₹28,500</div>
                    </div>
                    <button
                      onClick={() => handleSendWhatsApp('Priya Saxena', 'Suite B-402', '28,500')}
                      className="mt-2.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp Notice</span>
                    </button>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">Suite C-1104</span>
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          60d Overdue
                        </span>
                      </div>
                      <p className="text-gray-600 text-[11px] mt-0.5">Rajesh Verma</p>
                      <div className="text-base font-bold text-rose-700 mt-1">₹34,200</div>
                    </div>
                    <button
                      onClick={() => handleSendWhatsApp('Rajesh Verma', 'Suite C-1104', '34,200')}
                      className="mt-2.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp Notice</span>
                    </button>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">Suite A-902</span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          30d Overdue
                        </span>
                      </div>
                      <p className="text-gray-600 text-[11px] mt-0.5">Anita Menon</p>
                      <div className="text-base font-bold text-amber-700 mt-1">₹19,000</div>
                    </div>
                    <button
                      onClick={() => handleSendWhatsApp('Anita Menon', 'Suite A-902', '19,000')}
                      className="mt-2.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp Notice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Work Orders & SLA Management */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Critical Work Orders &amp; SLA Management
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Real-time dispatch and vendor commitments for infrastructure maintenance
                  </p>
                </div>
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  2 Priority Escalations
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Work Order 1 */}
                <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded uppercase">
                        P1 Critical
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        Tower A Lift #2 Hydraulic Sensor Fault
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">
                      Elevator car parked at 4th floor with door interlock sensor timeout. Technician on-site.
                    </p>
                    <div className="flex items-center gap-3 text-gray-500 text-[11px] mt-1.5">
                      <span>Assigned: <strong>Otis Elevators</strong></span>
                      <span>•</span>
                      <span className="text-rose-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        SLA Expiry: 20m remaining
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Escalated to Otis Regional Manager via Priority Telco Bridge.')}
                    className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold whitespace-nowrap self-start sm:self-center"
                  >
                    Escalate to Otis
                  </button>
                </div>

                {/* Work Order 2 */}
                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded uppercase">
                        P2 Medium
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        Clubhouse Water Softener Regeneration Flange Leak
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">
                      Minor brine solution seepage observed during 04:00 AM auto-cycle. Isolation valve closed.
                    </p>
                    <div className="flex items-center gap-3 text-gray-500 text-[11px] mt-1.5">
                      <span>Assigned: <strong>AquaPure Technologies</strong></span>
                      <span>•</span>
                      <span className="text-amber-700 font-medium">SLA: Today, 04:00 PM</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Vendor status rechecked: Parts dispatched via courier.')}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold whitespace-nowrap self-start sm:self-center"
                  >
                    View Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Rail 4-Cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* HIGHLIGHT: 7-STEP OCCUPANCY CONFLICT RESOLUTION MODULE */}
            <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl border-2 border-[#16A34A] shadow-md p-5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Occupancy Verification
                    </h3>
                    <p className="text-[11px] text-emerald-800">7-Step Conflict Resolution Engine</p>
                  </div>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Action Req.
                </span>
              </div>

              {/* Conflict Case Card */}
              {cases.map((c) => (
                <div key={c.id} className="p-3 bg-white rounded-xl border border-emerald-200 shadow-xs mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">{c.unit} ({c.tower})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                      Step {c.currentStep}/7
                    </span>
                  </div>

                  <div className="mt-2 text-xs space-y-1 text-gray-700">
                    <p>
                      <span className="text-gray-400">Incoming:</span> <strong>{c.incomingResident.name}</strong> ({c.incomingResident.type})
                    </p>
                    <p>
                      <span className="text-gray-400">Outgoing:</span> <strong>{c.outgoingResident.name}</strong> ({c.outgoingResident.contactStatus.replace('_', ' ')})
                    </p>
                  </div>

                  {/* Resolution Status badge */}
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-800 font-medium">
                      {c.resolutionStatus === 'TEMPORARY_ACCESS_ACTIVE' && '● 5-Day Pass Active'}
                      {c.resolutionStatus === 'RESOLVED_PERMANENT' && '✓ Permanent Approved'}
                      {c.resolutionStatus === 'PENDING_INSPECTION' && '● Guard Inspection'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setShow7StepModal(true);
                      }}
                      className="px-2.5 py-1 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Resolve</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="text-[11px] text-gray-500 bg-white/80 p-2.5 rounded-xl border border-emerald-100/80 leading-relaxed">
                Reconciles database records, outgoing tenant confirmation, Havaldar Ram Singh&apos;s physical key surrender report, and board authorization.
              </div>
            </div>

            {/* Staff On-Premise Status */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Staff On-Premise (142 Checked In)
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-gray-700 font-medium">Housemaids &amp; Helpers</span>
                  <span className="font-bold text-gray-900">88 active</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-gray-700 font-medium">Chauffeurs &amp; Drivers</span>
                  <span className="font-bold text-gray-900">34 active</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-gray-700 font-medium">Cooks &amp; Kitchen Staff</span>
                  <span className="font-bold text-gray-900">20 active</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
                <div className="font-bold text-gray-800 text-[11px] uppercase mb-1.5">
                  Authorized Vendor Crews
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 text-[10px] font-semibold">
                    Asian Paints (Tower C)
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 text-[10px] font-semibold">
                    Urban Company (Tower A)
                  </span>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-200 text-[10px] font-semibold">
                    Otis Elevators (Tower A Lift)
                  </span>
                </div>
              </div>
            </div>

            {/* Live Notices & Broadcast */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Live Society Notices
                </h3>
                <span className="text-[10px] text-[#16A34A] font-semibold cursor-pointer hover:underline">
                  View All (8)
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span className="font-semibold text-emerald-800">FESTIVAL PROTOCOL</span>
                    <span>18 Sep</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs">
                    Ganesh Chaturthi Eco-Immersion &amp; Parking Guidelines
                  </h4>
                  <p className="text-gray-600 text-[11px] mt-0.5">
                    Clubhouse pool designated strictly for clay idols. Temporary guest parking in B3.
                  </p>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span className="font-semibold text-amber-800">INFRASTRUCTURE</span>
                    <span>Tomorrow</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs">
                    DG Set Full Load Testing (10:00 AM - 11:00 AM)
                  </h4>
                  <p className="text-gray-600 text-[11px] mt-0.5">
                    Brief 15-second switchover flickers expected in common area elevators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-STEP OCCUPANCY CONFLICT RESOLUTION MODAL */}
      {show7StepModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-3xl w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedCase.unit} ({selectedCase.tower})
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-600 text-xs font-semibold">
                    Case #{selectedCase.id}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mt-1">
                  7-Step Multi-Party Occupancy Verification Pipeline
                </h2>
                <p className="text-xs text-gray-500">
                  Reconciling Incoming Resident: <strong>{selectedCase.incomingResident.name}</strong> vs Outgoing Resident: <strong>{selectedCase.outgoingResident.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setShow7StepModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 7 Interactive Steps Timeline */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-emerald-50/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Step 1: Incoming Resident Registers</span>
                    <span className="text-gray-400 text-[10px]">{selectedCase.incomingResident.registeredDate}</span>
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    {selectedCase.incomingResident.name} submitted onboarding form for {selectedCase.unit} with Aadhaar ID &amp; Lease Agreement document.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-emerald-50/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Step 2: Database Conflict Detected</span>
                    <span className="text-amber-700 font-mono text-[10px] font-bold">CONFLICT FLAG AUTO-TRIGGERED</span>
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    System detected unit already occupied by {selectedCase.outgoingResident.name} (Lease ends {selectedCase.outgoingResident.leaseEndDate}). Multi-party lock activated.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-emerald-50/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Step 3: Outgoing Resident Notified &amp; Contacted</span>
                    <span className="text-emerald-700 text-[10px] font-bold">CONFIRMED VACATING</span>
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    Outgoing tenant {selectedCase.outgoingResident.name} confirmed vacating timeline via registered mobile OTP &amp; WhatsApp concierge.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-emerald-50/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      Step 4: Physical Security Inspection (Havaldar Ram Singh)
                    </span>
                    <span className="text-gray-400 text-[10px]">{selectedCase.securityInspection.inspectedAt}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200 mt-1 text-gray-700">
                    <p className="italic text-[11px]">&quot;{selectedCase.securityInspection.notes}&quot;</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-semibold text-gray-500">
                      <span className="text-emerald-700">✓ Luggage departure confirmed</span>
                      <span>•</span>
                      <span className="text-emerald-700">✓ 3 keys + 1 RFID surrendered</span>
                      <span>•</span>
                      <span>Inspected by: {selectedCase.securityInspection.guardName} ({selectedCase.securityInspection.guardBadge})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-emerald-50/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Step 5: Admin &amp; Board Document Approval</span>
                    <span className="text-emerald-700 text-[10px] font-bold">APPROVED BY PRESIDENT</span>
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    Elena Rostova verified registered deed / rent agreement and signed off on guard inspection logs.
                  </p>
                </div>
              </div>

              {/* Step 6: Temporary 5-Day Pass */}
              <div className={`p-3.5 rounded-xl border ${selectedCase.currentStep >= 6 ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-200 bg-gray-50'} flex items-start gap-3`}>
                <div className={`w-7 h-7 rounded-full ${selectedCase.currentStep >= 6 ? 'bg-emerald-600' : 'bg-gray-300'} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                  6
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      Step 6: Temporary &amp; Pre-Move-in Access (5-Day Pass)
                    </span>
                    {selectedCase.temporaryAccess.granted ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        ACTIVE: {selectedCase.temporaryAccess.validFrom} to {selectedCase.temporaryAccess.validUntil}
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        PENDING PASS
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    Enables movers &amp; packers gate entry, barcode elevator access, and painter registration without full society voting rights.
                  </p>

                  {!selectedCase.temporaryAccess.granted && (
                    <button
                      onClick={() => handleGrantTempPass(selectedCase.id)}
                      className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Issue 5-Day Temporary Access Pass →
                    </button>
                  )}
                </div>
              </div>

              {/* Step 7: Permanent Handover */}
              <div className={`p-3.5 rounded-xl border ${selectedCase.currentStep === 7 ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-200 bg-white'} flex items-start gap-3`}>
                <div className={`w-7 h-7 rounded-full ${selectedCase.currentStep === 7 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'} flex items-center justify-center text-xs font-bold shrink-0`}>
                  7
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      Step 7: Permanent Handover &amp; Outgoing Account Deactivation
                    </span>
                    {selectedCase.currentStep === 7 ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        FINALIZED &amp; ARCHIVED
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[10px]">AWAITING SIGN-OFF</span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    Deactivates Rahul G.&apos;s FASTag RFID fobs, switches Arjun Kumar to permanent primary resident, and unlocks society amenity bookings.
                  </p>

                  {selectedCase.currentStep < 7 && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleFinalizePermanent(selectedCase.id)}
                        className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sign-off Permanent Tenancy &amp; Deactivate Rahul G. →</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-5 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShow7StepModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Close Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Post Notice */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900">Broadcast Circular / Society Notice</h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowNoticeModal(false);
                setToastMessage(`Notice "${noticeTitle}" broadcasted to 420 resident app feeds.`);
                setTimeout(() => setToastMessage(null), 3500);
                setNoticeTitle('');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Swimming Pool Filter Overhaul"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                >
                  <option value="MAINTENANCE">Maintenance &amp; Utilities</option>
                  <option value="FESTIVAL">Cultural &amp; Festival</option>
                  <option value="SECURITY">Security Protocol</option>
                  <option value="GENERAL">General Circular</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Body Text</label>
                <textarea
                  rows={3}
                  placeholder="Describe circular details, timelines, and action items..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold shadow cursor-pointer"
                >
                  Broadcast Circular →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
