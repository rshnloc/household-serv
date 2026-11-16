import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  Lock, 
  CheckCircle2, 
  Truck, 
  Wrench,
  AlertCircle
} from 'lucide-react';
import { Booking, User } from '../types';

interface BookingsListProps {
  bookings: Booking[];
  currentUser: User | null;
  onSelectBooking: (bookingId: number) => void;
  onOpenAiAssistant: () => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  currentUser,
  onSelectBooking,
  onOpenAiAssistant,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Scheduled
          </span>
        );
      case 'pro_en_route':
        return (
          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <Truck className="w-3 h-3" /> En Route
          </span>
        );
      case 'in_progress':
        return (
          <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <Wrench className="w-3 h-3" /> In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {currentUser?.role === 'pro' ? 'Assigned Job Queue' : 'My Bookings & Escrow Vault'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track live dispatch status, inspect itemized quotes, release escrow payouts, and message technicians.
          </p>
        </div>

        {currentUser?.role !== 'pro' && (
          <button
            onClick={onOpenAiAssistant}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Book New Service via AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No active bookings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Use the HomeGenie AI assistant or browse verified trade professionals to schedule your first service.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectBooking(b.id)}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-sky-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              {/* Left Column: Pro & Service Info */}
              <div className="flex items-start gap-4">
                <img
                  src={b.pro_image}
                  alt={b.pro_name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      {b.booking_reference}
                    </span>
                    {getStatusBadge(b.status)}
                    {b.urgency === 'emergency_24_7' && (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        🚨 EMERGENCY 24/7
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition truncate">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{b.pro_business}</span>
                    <span>•</span>
                    <span>{b.category_name}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {b.scheduled_date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.scheduled_time_slot}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Escrow Financials & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-slate-400 block">Total In Escrow</span>
                  <span className="text-xl font-black text-slate-900">
                    ${b.total_amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block flex items-center md:justify-end gap-1">
                    <Lock className="w-3 h-3" />
                    {b.payment_status === 'released_to_pro' ? 'Released to Pro' : 'Protected in Vault'}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBooking(b.id);
                  }}
                  className="bg-slate-900 group-hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1"
                >
                  <span>Track & Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
