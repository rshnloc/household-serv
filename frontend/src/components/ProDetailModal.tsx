import React, { useEffect, useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  CheckCircle, 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Lock,
  ThumbsUp,
  Award
} from 'lucide-react';
import { Professional, ProReview } from '../types';
import { api } from '../services/api';

interface ProDetailModalProps {
  proId: number | null;
  onClose: () => void;
  onBookNow: (pro: Professional) => void;
}

export const ProDetailModal: React.FC<ProDetailModalProps> = ({
  proId,
  onClose,
  onBookNow,
}) => {
  const [pro, setPro] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (proId) {
      setLoading(true);
      api.getProDetail(proId)
        .then(setPro)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [proId]);

  if (!proId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={pro?.profile_image}
                alt={pro?.full_name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-slate-900">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{pro?.full_name}</h2>
                <span className="bg-emerald-400/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED PRO
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                {pro?.business_name}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  ★ {pro?.rating} ({pro?.review_count} reviews)
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">{pro?.jobs_completed} jobs completed</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">{pro?.years_experience} yrs experience</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {loading || !pro ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading verified professional credentials...
          </div>
        ) : (
          <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            {/* Verified Trust & Compliance Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Trust & Credential Audit
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">Trade License</span>
                  <span className="font-bold text-slate-800">{pro.license_number}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">Insurance Coverage</span>
                  <span className="font-bold text-slate-800 truncate block">{pro.insured_amount}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">Background Screening</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 100% Cleared
                  </span>
                </div>
              </div>
            </div>

            {/* Bio & Scope */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                About & Expertise
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {pro.bio}
              </p>
            </div>

            {/* Skills & Certifications */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Verified Trade Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {pro.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-sky-50 text-sky-800 text-xs px-3 py-1 rounded-xl font-semibold border border-sky-100 flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Customer Reviews & AI Sentiment Highlights */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified Customer Reviews ({pro.reviews?.length || 0})
                </h3>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {pro.rating} Verified Rating
                </span>
              </div>

              <div className="space-y-3">
                {pro.reviews?.map((rev) => (
                  <div
                    key={rev.id}
                    className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">
                          {rev.customer_name}
                        </span>
                        <span className="text-[10px] text-slate-400">• {rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        ★ {rev.rating}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="bg-sky-50 text-sky-700 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-sky-100">
                        <ThumbsUp className="w-2.5 h-2.5 text-sky-500" />
                        AI Highlight: {rev.sentiment_tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer with Booking CTA */}
        {pro && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[11px] text-slate-500 block">Verified Hourly Rate:</span>
              <span className="text-xl font-extrabold text-slate-900">${pro.hourly_rate}/hr</span>
              <span className="text-[11px] text-emerald-600 font-semibold ml-2">Escrow Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBookNow(pro);
                }}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book & Schedule Pro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
