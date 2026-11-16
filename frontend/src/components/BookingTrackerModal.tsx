import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Send, 
  Star, 
  Truck, 
  Wrench, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { BookingDetail, User } from '../types';
import { api } from '../services/api';

interface BookingTrackerModalProps {
  bookingId: number | null;
  currentUser: User | null;
  onClose: () => void;
  onRefresh: () => void;
  onViewReceipt: (bookingId: number) => void;
}

export const BookingTrackerModal: React.FC<BookingTrackerModalProps> = ({
  bookingId,
  currentUser,
  onClose,
  onRefresh,
  onViewReceipt,
}) => {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Review state
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [reviewRating, setReviewRating] = useState(5.0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDetail = () => {
    if (bookingId) {
      setLoading(true);
      api.getBookingDetail(bookingId)
        .then(setBooking)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [bookingId]);

  if (!bookingId) return null;

  const handleUpdateStatus = async (status: string) => {
    try {
      await api.updateBookingStatus(bookingId, status);
      fetchDetail();
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReleaseEscrow = async () => {
    try {
      await api.releaseEscrow(bookingId);
      fetchDetail();
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !currentUser) return;
    setSendingMsg(true);
    try {
      await api.sendBookingMessage(
        bookingId,
        currentUser.full_name,
        currentUser.role,
        newMsg
      );
      setNewMsg('');
      fetchDetail();
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await api.submitReview(bookingId, reviewRating, reviewComment);
      setShowReviewBox(false);
      fetchDetail();
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Steps
  const steps = [
    { key: 'confirmed', label: 'Confirmed & Scheduled', icon: Calendar },
    { key: 'pro_en_route', label: 'Technician En Route', icon: Truck },
    { key: 'in_progress', label: 'Work In Progress', icon: Wrench },
    { key: 'completed', label: 'Completed & Signed Off', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'pro_en_route': return 1;
      case 'in_progress': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = booking ? getStepIndex(booking.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-5 sm:p-6 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-sky-300">
                {booking?.booking_reference}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                booking?.payment_status === 'released_to_pro'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
              }`}>
                {booking?.payment_status === 'released_to_pro' ? 'Funds Released' : 'Held in Escrow Vault'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
              {booking?.title}
            </h2>
            <p className="text-xs text-slate-300">
              Escrow ID: {booking?.escrow_transaction_id} • Protected with $1,000,000 Guarantee
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {loading || !booking ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading live job status and messages...
          </div>
        ) : (
          <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            {/* Status Progress Stepper */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Live Service Timeline
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {steps.map((st, i) => {
                  const Icon = st.icon;
                  const isDone = i <= currentStepIdx;
                  const isCurrent = i === currentStepIdx;
                  return (
                    <div
                      key={st.key}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                        isCurrent
                          ? 'bg-sky-50 border-sky-400 shadow-xs ring-2 ring-sky-300/30'
                          : isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrent ? 'bg-sky-600 text-white' :
                        isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold leading-tight">
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Simulation Controls for Testing Both Customer & Pro Workflow */}
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    Marketplace Workflow Actions
                  </h4>
                  <p className="text-[11px] text-sky-700 mt-0.5">
                    Logged in as: <strong>{currentUser?.full_name}</strong> ({currentUser?.role})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Pro Status Advancers */}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus('pro_en_route')}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" /> Start Drive (En Route)
                    </button>
                  )}

                  {booking.status === 'pro_en_route' && (
                    <button
                      onClick={() => handleUpdateStatus('in_progress')}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1"
                    >
                      <Wrench className="w-3.5 h-3.5" /> Arrive & Start Work
                    </button>
                  )}

                  {booking.status === 'in_progress' && (
                    <button
                      onClick={() => handleUpdateStatus('completed')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Work Complete
                    </button>
                  )}

                  {/* Customer Release Escrow Button */}
                  {booking.payment_status === 'escrow_held' && (
                    <button
                      onClick={handleReleaseEscrow}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" /> Release Escrow (${booking.total_amount.toFixed(2)})
                    </button>
                  )}

                  {/* Customer Leave Review */}
                  {booking.status === 'completed' && !booking.review && (
                    <button
                      onClick={() => setShowReviewBox(!showReviewBox)}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5" /> Write Review
                    </button>
                  )}

                  {/* View Invoice / Receipt */}
                  <button
                    onClick={() => onViewReceipt(booking.id)}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" /> View Receipt
                  </button>
                </div>
              </div>
            </div>

            {/* Review Submission Card */}
            {showReviewBox && (
              <form onSubmit={handleSubmitReview} className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  Leave Verified Customer Review
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-semibold">Rating:</span>
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setReviewRating(stars)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                        reviewRating === stars
                          ? 'bg-amber-500 text-white'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {stars} ★
                    </button>
                  ))}
                </div>
                <textarea
                  required
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share feedback on punctuality, craftsmanship, and clean worksite..."
                  className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
                </button>
              </form>
            )}

            {/* Details Grid: Pro Info, Service Spec & Escrow Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pro Details */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Verified Professional
                </h4>
                <div className="flex items-center gap-3">
                  <img
                    src={booking.pro.image}
                    alt={booking.pro.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{booking.pro.name}</h5>
                    <p className="text-xs text-slate-600">{booking.pro.business_name}</p>
                    <p className="text-[11px] text-slate-400">
                      License: {booking.pro.license} • {booking.pro.phone}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800">Scheduled:</span> {booking.scheduled_date} ({booking.scheduled_time_slot})
                </div>
              </div>

              {/* Escrow Vault Details */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Escrow Vault Accounting
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    booking.payment_status === 'released_to_pro'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {booking.payment_status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Labor ({booking.estimated_hours}h @ ${booking.hourly_rate}/h):</span>
                    <span className="font-semibold text-slate-800">${(booking.estimated_hours * booking.hourly_rate).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parts & Supplies:</span>
                    <span className="font-semibold text-slate-800">${booking.parts_estimate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Escrow Guarantee Protection:</span>
                    <span className="font-semibold text-slate-800">${booking.escrow_fee.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
                    <span>Total Authorized:</span>
                    <span className="text-emerald-600">${booking.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* In-App Direct Messages & Escrow Logs */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Direct In-App Messages & System Logs
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                  End-to-End Encrypted Simulation
                </span>
              </div>

              <div className="p-4 space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
                {booking.messages.map((m) => {
                  const isSystem = m.sender_role === 'system';
                  return (
                    <div
                      key={m.id}
                      className={`text-xs p-3 rounded-2xl ${
                        isSystem
                          ? 'bg-sky-50/70 border border-sky-100 text-sky-900 mx-auto max-w-lg text-center'
                          : m.sender_role === 'pro'
                          ? 'bg-amber-50/80 border border-amber-200 text-slate-800 mr-auto max-w-md'
                          : 'bg-indigo-50/80 border border-indigo-200 text-slate-800 ml-auto max-w-md'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-bold mb-1 text-[11px]">
                        <span>{m.sender_name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{m.time}</span>
                      </div>
                      <p className="leading-relaxed">{m.message_text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Send Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-slate-50/60 flex items-center gap-2">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type a message to technician or customer..."
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={sendingMsg || !newMsg.trim()}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs p-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
