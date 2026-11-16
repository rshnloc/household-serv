import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  UserCheck, 
  Layers, 
  ChevronDown, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { User, DemoUserOption } from '../types';

interface NavbarProps {
  currentUser: User | null;
  demoUsers: DemoUserOption[];
  onSwitchUser: (email: string) => void;
  activeTab: 'marketplace' | 'ai-assistant' | 'bookings' | 'admin';
  setActiveTab: (tab: 'marketplace' | 'ai-assistant' | 'bookings' | 'admin') => void;
  activeBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  demoUsers,
  onSwitchUser,
  activeTab,
  setActiveTab,
  activeBookingsCount,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Home<span className="text-sky-600">Assist</span>
                </span>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI ESCROW
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Verified Trades • Safe Escrow Payments
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'marketplace'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-600" />
              Find Pros
            </button>

            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'ai-assistant'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              HomeGenie AI
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 relative ${
                activeTab === 'bookings'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-sky-600" />
              {currentUser?.role === 'pro' ? 'Job Queue' : 'My Bookings'}
              {activeBookingsCount > 0 && (
                <span className="ml-1 bg-sky-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Escrow Vault
            </button>
          </nav>

          {/* User & Persona Switcher */}
          <div className="flex items-center gap-3">
            {/* Escrow Guarantee Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Escrow Protected</span>
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm text-left"
              >
                {currentUser?.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    {currentUser?.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser?.full_name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium capitalize flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      currentUser?.role === 'pro' ? 'bg-amber-500' :
                      currentUser?.role === 'admin' ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`} />
                    {currentUser?.role === 'pro' ? 'Verified Trade Pro' : currentUser?.role}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Demo Persona (1-Click)
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Test marketplace from customer, pro, or admin view:
                    </p>
                  </div>

                  <div className="py-1">
                    {demoUsers.map((u) => {
                      const isSelected = u.email === currentUser?.email;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u.email);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition ${
                            isSelected ? 'bg-sky-50/70 border-l-4 border-sky-600' : ''
                          }`}
                        >
                          <img
                            src={u.avatar_url}
                            alt={u.full_name}
                            className="w-9 h-9 rounded-lg object-cover mt-0.5 border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-800 truncate">
                                {u.full_name}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                u.role === 'customer' ? 'bg-emerald-100 text-emerald-800' :
                                u.role === 'pro' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {u.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {u.title}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-4 pt-2 pb-1 border-t border-slate-100 mt-1">
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Zero PII & Zero Live Credentials Used
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-slate-100 py-2 justify-around">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`text-xs font-semibold py-1 px-2 rounded-lg flex items-center gap-1 ${
              activeTab === 'marketplace' ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Pros
          </button>
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`text-xs font-semibold py-1 px-2 rounded-lg flex items-center gap-1 ${
              activeTab === 'ai-assistant' ? 'bg-sky-600 text-white' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`text-xs font-semibold py-1 px-2 rounded-lg flex items-center gap-1 ${
              activeTab === 'bookings' ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Bookings
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`text-xs font-semibold py-1 px-2 rounded-lg flex items-center gap-1 ${
              activeTab === 'admin' ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Vault
          </button>
        </div>
      </div>
    </header>
  );
};
