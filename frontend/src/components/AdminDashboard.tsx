import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Lock, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Users, 
  Star,
  Activity,
  Layers
} from 'lucide-react';
import { AdminMetrics } from '../types';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminMetrics()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 text-sm">
        Loading Escrow Vault & Platform Metrics...
      </div>
    );
  }

  const { overview, recent_activity } = metrics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Platform Trust & Escrow Vault Overseer
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              LIVE SIMULATION
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform financial settlement, contractor credential compliance, and active escrow holds.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Marketplace GMV</span>
            <DollarSign className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ${overview.total_gmv.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            Across {overview.total_bookings} total customer bookings
          </span>
        </div>

        {/* Escrow Held Balance */}
        <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-5 rounded-3xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-sky-300 text-xs font-bold uppercase tracking-wider">
            <span>Active Escrow Vault</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            ${overview.escrow_held_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-sky-200 font-medium block">
            Secured funds waiting customer job sign-off
          </span>
        </div>

        {/* Released Payouts */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Settled Pro Payouts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ${overview.payouts_released.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Directly transferred to verified trades
          </span>
        </div>

        {/* Verified Pros */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Verified Trade Network</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {overview.total_verified_pros} Active Pros
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold block">
            ★ {overview.platform_average_rating} Platform Avg Rating
          </span>
        </div>
      </div>

      {/* Activity & Verification Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Platform Dispatches */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            Live Marketplace Stream
          </h3>
          <div className="space-y-3">
            {recent_activity.map((act, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">{act.event}</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Zero PII & Security Audit Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Compliance, Safety & Privacy Guarantee
          </h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Zero Real PII:</strong> All customer names, telephone numbers, addresses, and technician identities are synthetic demo personas.</span>
            </div>
            <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-xl flex items-start gap-2">
              <Lock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span><strong>Zero Live Credentials:</strong> Offline self-contained AI diagnostic engine. No external secret keys or production banking endpoints exposed.</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>Trade Verification:</strong> Master trade licenses, general liability policies ($1M - $2M), and criminal background checks verified prior to dispatch.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
