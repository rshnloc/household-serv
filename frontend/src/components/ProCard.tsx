import React from 'react';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Zap, 
  ArrowRight,
  Award
} from 'lucide-react';
import { Professional } from '../types';

interface ProCardProps {
  pro: Professional;
  onViewDetail: (pro: Professional) => void;
  onBookNow: (pro: Professional) => void;
}

export const ProCard: React.FC<ProCardProps> = ({
  pro,
  onViewDetail,
  onBookNow,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top Header: Image, Status & Rating */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={pro.profile_image}
              alt={pro.full_name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition"
            />
            {pro.verification_status === 'verified' && (
              <div 
                title="Verified Professional: Background Check & License Cleared"
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm border-2 border-white"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-base text-slate-900 truncate">
                {pro.full_name}
              </h3>
              <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100 shrink-0">
                ${pro.hourly_rate}/hr
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-600 truncate mt-0.5">
              {pro.business_name}
            </p>

            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{pro.rating}</span>
                <span className="text-slate-400 font-normal">({pro.review_count})</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">
                {pro.jobs_completed} jobs done
              </span>
            </div>
          </div>
        </div>

        {/* Tagline & Bio excerpt */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {pro.tagline}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {pro.badges.slice(0, 3).map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
            >
              <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
              {badge}
            </span>
          ))}
          {pro.badges.length > 3 && (
            <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
              +{pro.badges.length - 3} more
            </span>
          )}
        </div>

        {/* Location & Emergency Tag */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{pro.location_city} ({pro.service_radius_miles} mi radius)</span>
          </div>
          {pro.emergency_capable && (
            <span className="text-rose-600 font-bold flex items-center gap-1 shrink-0 bg-rose-50 px-1.5 py-0.5 rounded">
              <Zap className="w-3 h-3 text-rose-500" /> 24/7 Ready
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onViewDetail(pro)}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold transition shadow-2xs"
        >
          View Profile & Credentials
        </button>
        <button
          onClick={() => onBookNow(pro)}
          className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1"
        >
          <span>Book</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
