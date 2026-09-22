import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Wrench, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Home, 
  KeyRound, 
  Calendar, 
  MessageSquare, 
  Clock, 
  FileText, 
  Car, 
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { INITIAL_COMMUNITIES } from '../../data/initialData';

export const LandingPage = ({ onNavigate, onQuickLogin }) => {
  const [selectedFlowStep, setSelectedFlowStep] = useState(4); // 4 is Security Inspection in the Arjun demo

  const workflowSteps = [
    {
      step: 1,
      title: 'Arjun Registers',
      actor: 'Resident',
      desc: 'Arjun selects My Home Bhooja, Flat A-1204, and requests temporary access for 5 days.',
      status: 'Completed',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    {
      step: 2,
      title: 'Conflict Detected',
      actor: 'System Engine',
      desc: 'Platform detects unit A-1204 is currently assigned to outgoing resident Rahul G.',
      status: 'Conflict Flagged',
      badge: 'bg-amber-100 text-amber-800'
    },
    {
      step: 3,
      title: 'Old Resident Notified',
      actor: 'Resident Rahul G.',
      desc: 'Rahul receives an in-app prompt and confirms his lease end and physical move-out.',
      status: 'Confirmed Exit',
      badge: 'bg-blue-100 text-blue-800'
    },
    {
      step: 4,
      title: 'Security Inspection',
      actor: 'Havaldar Ram Singh',
      desc: 'Guard visits A-1204, inspects luggage departure, collects 3 keys and enters field report.',
      status: 'Report Submitted',
      badge: 'bg-purple-100 text-purple-800'
    },
    {
      step: 5,
      title: 'Admin Approval',
      actor: 'President S. Venkat Reddy',
      desc: 'MC reviews guard checklist and grants 5-day temporary access window (20-25 Sept).',
      status: 'Awaiting Final Sign',
      badge: 'bg-indigo-100 text-indigo-800'
    },
    {
      step: 6,
      title: 'Temporary Access Granted',
      actor: 'Arjun Kumar',
      desc: 'Arjun receives limited app access: book elevator, entry passes, view estate rules.',
      status: 'Live on Mobile',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    {
      step: 7,
      title: 'Permanent Access & Archive',
      actor: 'Platform Ledger',
      desc: 'Handover complete: Arjun elevated to full permanent resident. Rahul account archived.',
      status: 'Zero-Trust Enforced',
      badge: 'bg-emerald-600 text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero Banner with Brand Color Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FDF7EF] to-[#FAF8F5] pt-12 pb-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Top Pill from Stitch Image 1 */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Secure • Verified • Convenient • Scalable</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight font-display leading-tight">
              One Platform. Many Communities.{' '}
              <span className="text-[#16A34A] block mt-1">Better Living.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Connecting verified residents, trusted service providers, security personnel, and community management seamlessly across hundreds of independent residential communities.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Access Common Gateway</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('register')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm border border-gray-300 shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <span>Register as Resident</span>
              </button>

              <button
                onClick={() => onNavigate('activate')}
                className="px-5 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-sm border border-purple-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-purple-600" />
                <span>Admin Invite Activation</span>
              </button>
            </div>

            {/* 4 Architectural Badges from Image 1 */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Multiple Communities</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Isolated tenant data, shared network power</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Verified Residents</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Physical guard check + OTP & MC audit</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-2">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Role-Based Control</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Spring Security RBAC across 5 consoles</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Group Demand Pools</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Aggregate neighborhood volume for 33% off</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Multiple Communities on One Platform (Image 1 Showcase) */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#16A34A] uppercase">
                Centralized Ecosystem
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 font-display mt-1">
                Multiple Communities on One Platform
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Each gated society maintains complete data isolation while tapping into global vendor networks.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500 mt-2 sm:mt-0">
              Showing {INITIAL_COMMUNITIES.length} active communities
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_COMMUNITIES.map((community) => (
              <div
                key={community.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
              >
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img
                    src={community.imageUrl}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                      community.status === 'ACTIVE'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {community.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white drop-shadow-md">
                    <h3 className="font-bold text-base">{community.name}</h3>
                    <p className="text-xs text-white/90">{community.area}, {community.city}</p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-2 text-center py-2 bg-gray-50 rounded-xl border border-gray-100 mb-3 text-xs">
                    <div>
                      <div className="text-[10px] text-gray-500">Towers</div>
                      <div className="font-bold text-gray-900">{community.towers}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">Units</div>
                      <div className="font-bold text-gray-900">{community.totalUnits}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">Amenities</div>
                      <div className="font-bold text-gray-900">{community.amenitiesCount}+</div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {community.description}
                  </p>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 text-[11px]">
                      MC: <strong>{community.presidentName}</strong>
                    </span>
                    <button
                      onClick={() => onNavigate('resident')}
                      className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Same Features for Every Community (Image 1 Showcase) */}
      <section className="py-12 bg-[#FAF8F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-wider text-[#16A34A] uppercase">
              Standardized Feature Suite
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 font-display mt-1">
              Same Features for Every Community
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Every onboarding society immediately unlocks standardized microservices out-of-the-box.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Bell, title: 'Community Announcements', desc: 'Instant notices, committee updates & urgent alerts' },
              { icon: Wrench, title: 'Service Requests & Bookings', desc: 'On-demand technicians with verified SLAs' },
              { icon: Users, title: 'Group Demand Pools', desc: 'Pool orders together for bulk discounted pricing' },
              { icon: ShieldAlert, title: 'Complaints & Maintenance', desc: 'SLA tracking for civil, electrical & plumbing tickets' },
              { icon: ShieldCheck, title: 'Visitor Management', desc: 'High-speed OTP entry passes & ANPR recognition' },
              { icon: MessageSquare, title: 'Community Discussions', desc: 'Interactive resident feed with comments & photo shares' },
              { icon: Calendar, title: 'Facility Bookings', desc: 'Instant reservation for badminton, tennis & club halls' },
              { icon: FileText, title: 'Audit & Analytics', desc: 'Society financial inflows, occupancy tracking & security logs' }
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs hover:border-emerald-300 transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">{feat.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real-Life Example: Arjun Moves into My Home Bhooja (7-Step Interactive Walkthrough from Image 1) */}
      <section className="py-14 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-wider text-[#0EA5E9] uppercase">
              Occupancy Conflict Resolution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display mt-1">
              Real-Life Verification: Arjun Moves into Flat A-1204
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              How CommunityConnect prevents duplicate flat squatting, verifies physical moves via security guards, and grants temporary 5-day move-in access before permanent handover.
            </p>
          </div>

          {/* Stepper Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Step list (Left 1 col) */}
            <div className="space-y-2">
              {workflowSteps.map((stepItem) => {
                const isSelected = selectedFlowStep === stepItem.step;
                return (
                  <div
                    key={stepItem.step}
                    onClick={() => setSelectedFlowStep(stepItem.step)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 shadow-xs ring-1 ring-emerald-400'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {stepItem.step}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{stepItem.title}</h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${stepItem.badge}`}>
                          {stepItem.actor}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{stepItem.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Step Live Simulator Card (Right 2 cols) */}
            <div className="lg:col-span-2 bg-[#FAF8F5] rounded-3xl border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center font-bold text-sm">
                    {selectedFlowStep}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Step {selectedFlowStep}: {workflowSteps[selectedFlowStep - 1].title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Actor: <strong className="text-emerald-700">{workflowSteps[selectedFlowStep - 1].actor}</strong>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-xl border border-gray-200 text-gray-700">
                  CASE #A1204-BHOOJA
                </span>
              </div>

              <div className="py-6">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {workflowSteps[selectedFlowStep - 1].desc}
                </p>

                {/* Step specific UI highlights */}
                {selectedFlowStep === 1 && (
                  <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-200 text-xs space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Selected Society:</span> <strong>My Home Bhooja</strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Target Unit:</span> <strong>Tower A, Flat 1204</strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Requested Mode:</span> <span className="text-emerald-700 font-bold">5-Day Pre-Move-in Access</span>
                    </div>
                  </div>
                )}

                {selectedFlowStep === 2 && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
                    <div className="font-bold text-amber-900 flex items-center gap-2 mb-1">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>Occupancy Conflict System Alert</span>
                    </div>
                    <p className="text-amber-800">
                      Unit A-1204 is still tagged to active resident Rahul G. Automated conflict ticket created. Physical guard verification dispatch triggered.
                    </p>
                  </div>
                )}

                {selectedFlowStep === 4 && (
                  <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-200 text-xs space-y-2">
                    <div className="font-bold text-purple-900 flex items-center justify-between">
                      <span>Security Field Inspection (Guard Ram Singh)</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Physical Visit</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-gray-500 block text-[10px]">Luggage Departure:</span>
                        <strong className="text-emerald-700">✓ Confirmed at B2 Lobby</strong>
                      </div>
                      <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-gray-500 block text-[10px]">Keys &amp; RFID Fobs Surrendered:</span>
                        <strong className="text-gray-900">3 Keys + 1 RFID</strong>
                      </div>
                    </div>
                    <p className="text-gray-600 text-[11px] italic pt-1">
                      "Old resident Rahul vacated unit at 10:45 AM. Move-out checklist verified."
                    </p>
                  </div>
                )}

                {selectedFlowStep === 5 && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs">
                    <h4 className="font-bold text-indigo-900 mb-1">Committee President Review</h4>
                    <p className="text-indigo-800 text-[11px] mb-3">
                      S. Venkat Reddy inspects guard report and authorises temporary access token valid from 20 Sept to 25 Sept.
                    </p>
                    <button
                      onClick={() => onNavigate('community-admin')}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold text-[11px] hover:bg-indigo-700 transition"
                    >
                      Open Admin Verification Console
                    </button>
                  </div>
                )}

                {selectedFlowStep === 6 && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                    <h4 className="font-bold text-emerald-900 mb-1">Limited Temporary Permissions Granted</h4>
                    <ul className="text-emerald-800 text-[11px] list-disc list-inside space-y-1">
                      <li>Move-in service technician bookings allowed</li>
                      <li>Gate intercom access enabled for packers &amp; movers</li>
                      <li>General society announcements visible</li>
                      <li>Resident directory strictly restricted until final handover</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Navigation between steps */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  disabled={selectedFlowStep === 1}
                  onClick={() => setSelectedFlowStep((s) => Math.max(1, s - 1))}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 disabled:opacity-30"
                >
                  Previous Step
                </button>
                <button
                  disabled={selectedFlowStep === 7}
                  onClick={() => setSelectedFlowStep((s) => Math.min(7, s + 1))}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-30"
                >
                  Next Step
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Central Service Provider Network (Image 1 & 3) */}
      <section className="py-14 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                Centralized Multi-Tenant Provider Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 font-display">
                One Vendor Account. Multiple Communities. High-Volume Demand.
              </h2>
              <p className="mt-3 text-sm text-emerald-100/80 leading-relaxed">
                Service contractors like CoolingPro AC Solutions serve My Home Bhooja, Saket Towers, and Prestige High Fields through a single verified gateway with background audits, group bidding, and direct resident ratings.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Sign In to Provider Console
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
                >
                  Resident Sign In (View Pools)
                </button>
              </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
              <Building2 className="w-96 h-96 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#16A34A] font-display text-base">CommunityConnect</span>
            <span>· One Platform. Many Communities. Better Living.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px]">Spring Security Zero-Trust Architecture</span>
            <span className="text-[11px]">PostgreSQL Flyway Normalized Schema</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
