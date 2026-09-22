import React, { useState } from 'react';
import { serviceApi } from '../../api/serviceApi';

export const CreateGatePassModal = ({
  isOpen,
  onClose,
  onPassCreated,
  showToast,
  defaultUnit = 'Flat A-1204',
  issuedBy = 'Estate Board Administration'
}) => {
  if (!isOpen) return null;

  const [visitorType, setVisitorType] = useState('GUEST'); // GUEST, DELIVERY, CAB, CONTRACTOR
  const [entryMode, setEntryMode] = useState('VEHICLE'); // VEHICLE, WALK_IN
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [hostUnit, setHostUnit] = useState(defaultUnit);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [validDuration, setValidDuration] = useState('Next 4 Hours');
  const [customNote, setCustomNote] = useState('');
  const [companyName, setCompanyName] = useState('Amazon');

  const POPULAR_COMPANIES = ['Amazon', 'Zomato', 'Swiggy', 'Blinkit', 'Urban Company', 'Uber', 'Maid/Cook', 'Private Guest'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      if (showToast) showToast('Please enter the visitor / guest name', 'error');
      return;
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const isWalkIn = entryMode === 'WALK_IN';
    const finalVehicle = isWalkIn ? 'N/A (Walk-In Visitor)' : (vehicleNumber.trim() || 'Vehicle Entry');

    let createdPass;
    if (visitorType === 'DELIVERY') {
      createdPass = serviceApi.createDeliveryGatePass({
        companyName: companyName,
        company: companyName,
        deliveryPerson: guestName.trim(),
        guestName: `${companyName} (${guestName.trim()})`,
        phone: phone.trim() || '+91 98000 11223',
        vehicleNumber: finalVehicle,
        entryMode: isWalkIn ? 'Walk-In / On Foot' : 'Vehicle Entry',
        isWalkIn: isWalkIn,
        hostUnit: hostUnit.trim() || 'Flat A-1204',
        validDuration: validDuration,
        customTimeNote: customNote.trim() || (isWalkIn ? 'Pedestrian Walk-In Gate Entry' : 'Express drop delivery pass issued'),
        issuedBy: issuedBy,
        otpCode: generatedOtp
      });
    } else {
      createdPass = serviceApi.createVisitorPass({
        guestName: visitorType === 'CAB' ? `${guestName.trim()} (${companyName || 'Cab'})` : guestName.trim(),
        companyName: companyName,
        company: companyName,
        visitorType: visitorType,
        visitorCategory: visitorType === 'CAB' ? 'Cab' : visitorType === 'CONTRACTOR' ? 'Contractor Work' : 'Guest Visitor',
        phone: phone.trim() || '+91 98450 00112',
        vehicleNumber: finalVehicle,
        entryMode: isWalkIn ? 'Walk-In / On Foot' : 'Vehicle Entry',
        isWalkIn: isWalkIn,
        hostUnit: hostUnit.trim() || 'Flat A-1204',
        numberOfGuests: Number(numberOfGuests),
        validDuration: validDuration,
        customTimeNote: customNote.trim() || (isWalkIn ? 'Walk-In Pedestrian Pass' : ''),
        issuedBy: issuedBy,
        otpCode: generatedOtp,
        status: 'EXPECTED'
      });
    }

    if (showToast) {
      showToast(`Gate Pass #${createdPass.id} issued for ${companyName}! 4-Digit Entry OTP: ${generatedOtp}`, 'success');
    }

    if (onPassCreated) onPassCreated(createdPass);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#131b2e]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#eaedff] flex flex-col overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">badge</span>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Issue Official Society Gate Pass</h3>
              <p className="text-[10px] text-slate-300 font-mono">Supports Vehicle &amp; Walk-In Pedestrian Entry Passes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Visitor Category Tabs */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Select Pass Type:
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setVisitorType('GUEST')}
                className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-1 ${
                  visitorType === 'GUEST' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>Guest</span>
              </button>

              <button
                type="button"
                onClick={() => setVisitorType('DELIVERY')}
                className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-1 ${
                  visitorType === 'DELIVERY' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">local_shipping</span>
                <span>Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setVisitorType('CAB')}
                className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-1 ${
                  visitorType === 'CAB' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">local_taxi</span>
                <span>Cab / Taxi</span>
              </button>

              <button
                type="button"
                onClick={() => setVisitorType('CONTRACTOR')}
                className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-1 ${
                  visitorType === 'CONTRACTOR' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">engineering</span>
                <span>Work / AMC</span>
              </button>
            </div>
          </div>

          {/* Entry Mode: Pedestrian Walk-In vs Vehicle */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Entry Access Mode:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  entryMode === 'VEHICLE'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="entryMode"
                  value="VEHICLE"
                  checked={entryMode === 'VEHICLE'}
                  onChange={() => setEntryMode('VEHICLE')}
                  className="text-emerald-600 focus:ring-0 cursor-pointer"
                />
                <span className="material-symbols-outlined text-lg">directions_car</span>
                <span className="text-xs">Vehicle Entry (Bike/Car)</span>
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  entryMode === 'WALK_IN'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="entryMode"
                  value="WALK_IN"
                  checked={entryMode === 'WALK_IN'}
                  onChange={() => setEntryMode('WALK_IN')}
                  className="text-emerald-600 focus:ring-0 cursor-pointer"
                />
                <span className="material-symbols-outlined text-lg">directions_walk</span>
                <span className="text-xs">On Foot / Walk-In</span>
              </label>
            </div>
          </div>

          {/* Company / Brand Name Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Company / Vendor / Brand Name:
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Specify brand or service</span>
            </div>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Amazon, Zomato, Blinkit, Urban Company, Uber, Self"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600 mb-1.5"
            />
            {/* Quick Brand Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {POPULAR_COMPANIES.map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setCompanyName(chip)}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                    companyName === chip
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Visitor Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {visitorType === 'DELIVERY' ? 'Rider / Agent Name *' : visitorType === 'CAB' ? 'Driver Name *' : 'Guest / Visitor Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={visitorType === 'DELIVERY' ? 'e.g. Ramesh Kumar' : 'e.g. Anand Mahindra'}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Contact Phone:
              </label>
              <input
                type="tel"
                placeholder="+91 98450 00112"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Destination & Vehicle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Host Destination Flat / Suite:
              </label>
              <input
                type="text"
                value={hostUnit}
                onChange={(e) => setHostUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-emerald-800 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {entryMode === 'WALK_IN' ? 'Entry Mode' : 'Vehicle Plate:'}
              </label>
              {entryMode === 'WALK_IN' ? (
                <input
                  type="text"
                  disabled
                  value="N/A (Walk-In Visitor)"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
                />
              ) : (
                <input
                  type="text"
                  placeholder="e.g. TS 08 EA 4410"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-emerald-600 uppercase"
                />
              )}
            </div>
          </div>

          {/* Duration & Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pass Validity:
              </label>
              <select
                value={validDuration}
                onChange={(e) => setValidDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-emerald-600"
              >
                <option value="30 Mins (Express Drop)">30 Mins (Express Drop)</option>
                <option value="Next 2 Hours">Next 2 Hours</option>
                <option value="Next 4 Hours">Next 4 Hours (Standard)</option>
                <option value="Full Day (Until Midnight)">Full Day (Until Midnight)</option>
                <option value="Overnight Stay (24 Hours)">Overnight Stay (24 Hours)</option>
              </select>
            </div>

            {visitorType === 'GUEST' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Number of Persons:
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Instructions / Gate Notes (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Allow parking in Visitor Bay #4, carry tool bag"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
            />
          </div>

          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
            <span className="material-symbols-outlined text-sm text-emerald-600 shrink-0 mt-0.5">info</span>
            <span>
              Upon submission, a unique 4-digit Entry OTP and optical QR code are generated instantly for <strong>{companyName}</strong> ({entryMode === 'WALK_IN' ? 'Walk-In' : 'Vehicle'}).
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold transition cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>Generate &amp; Activate Gate Pass</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
