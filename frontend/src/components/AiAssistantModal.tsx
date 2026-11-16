import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Send, 
  Info,
  Calendar,
  X,
  Zap,
  Activity
} from 'lucide-react';
import { DiagnosticResult, Professional } from '../types';
import { api } from '../services/api';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProForBooking: (pro: Professional, diagnostic?: DiagnosticResult) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectProForBooking,
}) => {
  const [inputText, setInputText] = useState('');
  const [urgencyOverride, setUrgencyOverride] = useState<string>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    "Dripping water pipe under the kitchen sink whenever the tap is running",
    "Hallway breaker makes a buzzing hum and trips when microwave is turned on",
    "Air conditioner blowing warm air and humming loudly in hot weather",
    "Washing machine won't spin or drain water with error code on screen",
    "Mount 75-inch TV into metal studs and patch 4-inch drywall hole",
    "Full move-out deep cleaning for 2-bed apartment including oven and shower tiles"
  ];

  if (!isOpen) return null;

  const handleDiagnose = async (queryToRun?: string) => {
    const q = queryToRun || inputText;
    if (!q.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.diagnoseIssue(q, urgencyOverride);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Diagnostic failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-sky-300 shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">HomeGenie AI™ Diagnostic</h2>
                <span className="bg-sky-400/20 text-sky-200 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-300/30">
                  Real-Time Triage
                </span>
              </div>
              <p className="text-xs text-sky-200/80 mt-0.5">
                Describe any household issue in plain English. AI detects root causes, safety hazards & matches verified specialists.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Input Box */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Describe What's Happening in Your Home:
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="E.g., 'Water is dripping from under the sink and there is a damp spot on the cabinet floor...'"
                rows={3}
                className="w-full rounded-2xl border border-slate-300 p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition shadow-xs resize-none"
              />
            </div>

            {/* Urgency Selector & Submit */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Urgency:</span>
                {(['standard', 'priority_same_day', 'emergency_24_7'] as const).map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setUrgencyOverride(urg)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition ${
                      urgencyOverride === urg
                        ? urg === 'emergency_24_7'
                          ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200'
                          : 'bg-sky-50 text-sky-700 border-sky-300 ring-2 ring-sky-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {urg === 'standard' && 'Standard (Within 48h)'}
                    {urg === 'priority_same_day' && 'Priority Same-Day'}
                    {urg === 'emergency_24_7' && '🚨 Emergency 24/7'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleDiagnose()}
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {isLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Analyzing Household Systems...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Triage</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompts */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 mb-1.5">
                Or try one of these common home symptoms:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(p);
                      handleDiagnose(p);
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition text-left"
                  >
                    "{p.slice(0, 48)}..."
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              {error}
            </div>
          )}

          {/* Diagnostic Result Display */}
          {result && (
            <div className="space-y-6 pt-4 border-t border-slate-200 animate-fadeIn">
              {/* Critical Safety Banners */}
              {result.safety_alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl flex items-start gap-3 border ${
                    result.is_critical_hazard && i === 0
                      ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    result.is_critical_hazard && i === 0 ? 'text-rose-600' : 'text-amber-600'
                  }`} />
                  <div className="text-xs sm:text-sm font-medium">
                    {alert}
                  </div>
                </div>
              ))}

              {/* Triage Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Likely Causes */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <Activity className="w-4 h-4 text-sky-600" />
                    Likely Root Causes
                  </div>
                  <ul className="space-y-2">
                    {result.likely_causes.map((cause, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Immediate Containment Actions */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Immediate Safe Actions
                  </div>
                  <ul className="space-y-2">
                    {result.immediate_actions.map((act, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Parts & Equipment */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <Wrench className="w-4 h-4 text-indigo-600" />
                    Recommended Parts & Specs
                  </div>
                  <ul className="space-y-2">
                    {result.recommended_parts.map((part, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{part}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verified Pricing & Escrow Calculator */}
              <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                      Transparent Cost Breakdown
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {result.category_name} • {result.detected_urgency.replace('_', ' ').toUpperCase()}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300">Estimated Total (Held in Escrow):</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      ${result.pricing_estimate.total_min} - ${result.pricing_estimate.total_max}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Labor Rate:</span>
                    <span className="font-bold text-white">${result.pricing_estimate.hourly_rate}/hr</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Est. Labor Time:</span>
                    <span className="font-bold text-white">{result.pricing_estimate.estimated_typical_hours} hours</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Estimated Parts:</span>
                    <span className="font-bold text-white">~${result.pricing_estimate.parts_estimate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Escrow Vault Guarantee:</span>
                    <span className="font-bold text-emerald-300">${result.pricing_estimate.escrow_guarantee_fee}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    $1,000,000 Marketplace Guarantee & Escrow Holding Protection
                  </span>
                  <span className="text-sky-300 font-semibold">
                    Confidence: {(result.ai_confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Matched Verified Specialists */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    Top Verified Specialists Matched For This Job
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {result.matched_professionals.length} Licensed Pros Available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.matched_professionals.map((pro) => (
                    <div
                      key={pro.id}
                      className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <img
                            src={pro.profile_image}
                            alt={pro.full_name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-sm text-slate-900 truncate">
                              {pro.full_name}
                            </h5>
                            <p className="text-[11px] text-slate-500 truncate">
                              {pro.business_name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                              ★ {pro.rating} <span className="text-slate-400 font-normal">({pro.review_count})</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {pro.badges.slice(0, 2).map((b, bi) => (
                            <span
                              key={bi}
                              className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md font-semibold border border-sky-100"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Rate</span>
                          <span className="text-sm font-bold text-slate-800">${pro.hourly_rate}/hr</span>
                        </div>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectProForBooking(pro, result);
                          }}
                          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Calendar className="w-3.5 h-3.5" /> Book with AI Scope
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
