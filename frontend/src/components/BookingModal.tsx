import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Professional, DiagnosticResult, User } from '../types';
import { api } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pro: Professional | null;
  diagnostic?: DiagnosticResult | null;
  currentUser: User | null;
  onBookingCreated: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  pro,
  diagnostic,
  currentUser,
  onBookingCreated,
}) => {
  if (!isOpen || !pro) return null;

  // Initial values pre-filled from diagnostic or default
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [date, setDate] = useState<string>(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 12:00 PM');
  const [urgency, setUrgency] = useState<string>(diagnostic?.detected_urgency || 'standard');
  const [title, setTitle] = useState<string>(
    diagnostic ? `${diagnostic.category_name} Service: ${diagnostic.summary.slice(0, 40)}` : `Service Request with ${pro.business_name}`
  );
  const [description, setDescription] = useState<string>(
    diagnostic ? diagnostic.immediate_actions.join('. ') : 'Please inspect and repair the reported issue.'
  );
  const [serviceAddress, setServiceAddress] = useState<string>('742 Evergreen Terrace, Apt 4B, Springfield, NW');
  const [hours, setHours] = useState<number>(diagnostic?.pricing_estimate?.estimated_typical_hours || 2.0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Mock Card (ending in 4242)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Multipliers
  let urgencyMultiplier = 1.0;
  if (urgency === 'priority_same_day') urgencyMultiplier = 1.35;
  if (urgency === 'emergency_24_7') urgencyMultiplier = 1.75;

  const effectiveRate = Math.round(pro.hourly_rate * urgencyMultiplier * 100) / 100;
  const laborSubtotal = Math.round(hours * effectiveRate * 100) / 100;
  const partsEstimate = diagnostic?.pricing_estimate?.parts_estimate || 35.0;
  const escrowFee = 14.50;
  const totalAmount = Math.round((laborSubtotal + partsEstimate + escrowFee) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await api.createBooking({
        customer_id: currentUser.id,
        pro_id: pro.id,
        title,
        problem_description: description,
        urgency,
        scheduled_date: date,
        scheduled_time_slot: timeSlot,
        service_address: serviceAddress,
        estimated_hours: hours,
        hourly_rate: effectiveRate,
        parts_estimate: partsEstimate,
        escrow_fee: escrowFee,
        total_amount: totalAmount,
        payment_method: paymentMethod,
      });

      onBookingCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '08:00 AM - 10:00 AM (Early Morning)',
    '10:00 AM - 12:00 PM (Mid Morning)',
    '01:00 PM - 03:00 PM (Early Afternoon)',
    '03:00 PM - 05:00 PM (Late Afternoon)',
    '05:00 PM - 07:00 PM (Evening Slot)',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-5 sm:p-6 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <img
              src={pro.profile_image}
              alt={pro.full_name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold">Book & Schedule</h2>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Escrow Protected
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {pro.business_name} • {pro.license_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Job Title */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Service Request Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Problem Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Problem Notes / Specific Symptoms
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          {/* Urgency Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Urgency & Dispatch Speed
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('standard')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  urgency === 'standard'
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300/40'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">Standard Schedule</div>
                <div className="text-[10px] text-slate-500">Regular trade rate</div>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('priority_same_day')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  urgency === 'priority_same_day'
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/40'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">Priority Same-Day</div>
                <div className="text-[10px] text-slate-500">+35% expedited fee</div>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('emergency_24_7')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  urgency === 'emergency_24_7'
                    ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300/40'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">🚨 Emergency 24/7</div>
                <div className="text-[10px] text-slate-500">+75% instant dispatch</div>
              </button>
            </div>
          </div>

          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Schedule Date
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Preferred Arrival Window
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {timeSlots.map((slot, i) => (
                  <option key={i} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Address */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Service Address (Zero PII - Synthetic Demo)
            </label>
            <input
              type="text"
              required
              value={serviceAddress}
              onChange={(e) => setServiceAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Escrow Itemized Breakdown Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                Escrow Price Calculation
              </span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Guaranteed Fair Rate
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Labor ({hours} hrs @ ${effectiveRate}/hr):</span>
                <span className="font-semibold text-slate-800">${laborSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated OEM Parts & Materials:</span>
                <span className="font-semibold text-slate-800">${partsEstimate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow Safe Holding & Guarantee Protection:</span>
                <span className="font-semibold text-slate-800">${escrowFee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Held in Escrow:</span>
                <span className="text-emerald-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              * Funds remain securely locked in Escrow. The technician is only paid once you inspect and approve the job.
            </p>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              Select Simulated Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {[
                'Mock Card (ending in 4242)',
                'Mock Apple Pay',
                'Simulated Instant Bank ACH'
              ].map((pm, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`p-2 rounded-xl border text-center transition font-semibold ${
                    paymentMethod === pm
                      ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-sm py-3 px-6 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>
                {isSubmitting ? 'Securing Escrow Vault...' : `Lock $${totalAmount.toFixed(2)} in Escrow & Confirm Booking`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
