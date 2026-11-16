import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle, Lock } from 'lucide-react';

interface AiAssistantHeroProps {
  onOpenAiAssistant: (initialPrompt?: string) => void;
}

export const AiAssistantHero: React.FC<AiAssistantHeroProps> = ({ onOpenAiAssistant }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onOpenAiAssistant(query.trim());
    } else {
      onOpenAiAssistant();
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-sky-900/40">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sky-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Home Triage & Escrow Protection</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Find, Book & Pay <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            Verified Trades with Zero Risk
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Describe any repair, maintenance, or home upgrade. Our AI diagnoses the problem, estimates fair market pricing, and connects you with background-checked, insured trade specialists.
        </p>

        {/* AI Search Bar */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border border-slate-200/80">
            <div className="pl-3 pr-2 text-sky-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., 'Water leaking under kitchen sink' or 'Hallway breaker tripping'..."
              className="w-full text-slate-800 text-sm placeholder-slate-400 focus:outline-none py-2 px-1"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 shrink-0"
            >
              <span>AI Diagnose</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Trust Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Background Checked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-sky-400" />
            <span>Safe Escrow Payment Vault</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-indigo-400" />
            <span>$1M Trade Liability Insured</span>
          </div>
        </div>
      </div>
    </div>
  );
};
