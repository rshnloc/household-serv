import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Zap, 
  X,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { AiAssistantHero } from './components/AiAssistantHero';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ProCard } from './components/ProCard';
import { ProDetailModal } from './components/ProDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingTrackerModal } from './components/BookingTrackerModal';
import { BookingsList } from './components/BookingsList';
import { AdminDashboard } from './components/AdminDashboard';
import { ReceiptModal } from './components/ReceiptModal';
import { User, DemoUserOption, Category, Professional, DiagnosticResult, Booking } from './types';
import { api } from './services/api';

export function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState<'marketplace' | 'ai-assistant' | 'bookings' | 'admin'>('marketplace');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [demoUsers, setDemoUsers] = useState<DemoUserOption[]>([]);
  
  // Marketplace Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [pros, setPros] = useState<Professional[]>([]);
  const [loadingPros, setLoadingPros] = useState<boolean>(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(150);
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Bookings State
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  // Modals
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);
  const [selectedProForDetail, setSelectedProForDetail] = useState<number | null>(null);
  const [selectedProForBooking, setSelectedProForBooking] = useState<Professional | null>(null);
  const [currentDiagnostic, setCurrentDiagnostic] = useState<DiagnosticResult | null>(null);
  const [activeTrackingBookingId, setActiveTrackingBookingId] = useState<number | null>(null);
  const [activeReceiptBookingId, setActiveReceiptBookingId] = useState<number | null>(null);

  // Initial Load: User & Categories
  useEffect(() => {
    api.getCurrentUser()
      .then(setCurrentUser)
      .catch(console.error);

    api.getDemoUsers()
      .then(setDemoUsers)
      .catch(console.error);

    api.getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Fetch Pros when filters change
  const fetchPros = () => {
    setLoadingPros(true);
    api.getPros({
      category_slug: selectedCategorySlug || undefined,
      search: searchTerm || undefined,
      min_rating: minRating > 0 ? minRating : undefined,
      max_rate: maxHourlyRate < 150 ? maxHourlyRate : undefined,
      emergency_only: emergencyOnly,
    })
      .then(setPros)
      .catch(console.error)
      .finally(() => setLoadingPros(false));
  };

  useEffect(() => {
    fetchPros();
  }, [selectedCategorySlug, searchTerm, minRating, maxHourlyRate, emergencyOnly]);

  // Fetch Bookings for Current User
  const fetchMyBookings = () => {
    if (currentUser) {
      api.getMyBookings(currentUser.id, currentUser.role)
        .then(setMyBookings)
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [currentUser]);

  // Handle Persona Switching
  const handleSwitchUser = async (email: string) => {
    try {
      const switched = await api.getCurrentUser(email);
      setCurrentUser(switched);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAiAssistant = (prompt?: string) => {
    setAiInitialPrompt(prompt);
    setAiModalOpen(true);
  };

  const handleProSelectedFromAi = (pro: Professional, diag?: DiagnosticResult) => {
    setCurrentDiagnostic(diag || null);
    setSelectedProForBooking(pro);
  };

  const handleBookNow = (pro: Professional) => {
    setCurrentDiagnostic(null);
    setSelectedProForBooking(pro);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        demoUsers={demoUsers}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeBookingsCount={myBookings.filter(b => b.status !== 'completed').length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* AI Hero Banner */}
            <AiAssistantHero onOpenAiAssistant={handleOpenAiAssistant} />

            {/* Category Navigation Bar */}
            <CategoryBar
              categories={categories}
              selectedCategorySlug={selectedCategorySlug}
              onSelectCategory={setSelectedCategorySlug}
            />

            {/* Filter & Search Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search trade by name, skill (e.g. EV charger, leak detection, drywall)..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Toggle Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={() => setEmergencyOnly(!emergencyOnly)}
                      className={`text-xs px-3 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 ${
                        emergencyOnly
                          ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-rose-500" />
                      <span>24/7 Emergency</span>
                    </button>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`text-xs px-3 py-2 rounded-xl font-semibold border transition flex items-center gap-1.5 ${
                        showFilters
                          ? 'bg-sky-50 text-sky-800 border-sky-300'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                      <span>Filters</span>
                      {(minRating > 0 || maxHourlyRate < 150) && (
                        <span className="w-2 h-2 rounded-full bg-sky-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Filter Controls */}
                {showFilters && (
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold text-slate-600 mb-1">
                        <span>Minimum Verified Rating:</span>
                        <span className="text-amber-600 font-bold">{minRating > 0 ? `${minRating} ★ & above` : 'Any'}</span>
                      </div>
                      <div className="flex gap-2">
                        {[0, 4.5, 4.8, 4.9].map((r) => (
                          <button
                            key={r}
                            onClick={() => setMinRating(r)}
                            className={`flex-1 py-1 rounded-lg border text-xs font-semibold ${
                              minRating === r
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {r === 0 ? 'All' : `${r}+ ★`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-slate-600 mb-1">
                        <span>Max Hourly Rate:</span>
                        <span className="text-sky-700 font-bold">${maxHourlyRate}/hr</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="150"
                        step="5"
                        value={maxHourlyRate}
                        onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                        className="w-full accent-sky-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professionals Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedCategorySlug
                      ? `${categories.find(c => c.slug === selectedCategorySlug)?.name || 'Category'} Pros`
                      : 'All Verified Professionals'}
                  </h2>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
                    {pros.length} available
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Trade Licensed & Insured</span>
                </div>
              </div>

              {loadingPros ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
                  ))}
                </div>
              ) : pros.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                  <p className="text-sm font-bold text-slate-700">No professionals found matching current filters</p>
                  <p className="text-xs text-slate-500">Try adjusting your search keywords, rating, or rate limits.</p>
                  <button
                    onClick={() => {
                      setSelectedCategorySlug(null);
                      setSearchTerm('');
                      setMinRating(0);
                      setMaxHourlyRate(150);
                      setEmergencyOnly(false);
                    }}
                    className="text-xs font-bold text-sky-600 hover:underline pt-2 inline-block"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pros.map((pro) => (
                    <ProCard
                      key={pro.id}
                      pro={pro}
                      onViewDetail={(p) => setSelectedProForDetail(p.id)}
                      onBookNow={handleBookNow}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HomeGenie AI Standalone View */}
        {activeTab === 'ai-assistant' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    HomeGenie AI Assistant
                  </h2>
                  <p className="text-xs text-slate-500">
                    Instant diagnostics, emergency safety recommendations, fair rate estimation, and trade matching.
                  </p>
                </div>
              </div>

              {/* Directly open modal or show launcher */}
              <div className="text-center py-8 space-y-4">
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  Click below to launch the diagnostic console, or type an issue to inspect likely causes, required parts, and fair escrow pricing.
                </p>
                <button
                  onClick={() => setAiModalOpen(true)}
                  className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg transition inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open HomeGenie Diagnostic Engine</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings View */}
        {activeTab === 'bookings' && (
          <BookingsList
            bookings={myBookings}
            currentUser={currentUser}
            onSelectBooking={(id) => setActiveTrackingBookingId(id)}
            onOpenAiAssistant={() => setAiModalOpen(true)}
          />
        )}

        {/* Escrow Vault & Platform Admin View */}
        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">HomeAssist AI Marketplace</span>
            <span>•</span>
            <span>Protected by Escrow Safe</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Zero Real PII • Zero Live Credentials • Clean Synthetic Demonstration
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelectProForBooking={handleProSelectedFromAi}
      />

      <ProDetailModal
        proId={selectedProForDetail}
        onClose={() => setSelectedProForDetail(null)}
        onBookNow={handleBookNow}
      />

      <BookingModal
        isOpen={selectedProForBooking !== null}
        onClose={() => setSelectedProForBooking(null)}
        pro={selectedProForBooking}
        diagnostic={currentDiagnostic}
        currentUser={currentUser}
        onBookingCreated={() => {
          fetchMyBookings();
          setActiveTab('bookings');
        }}
      />

      <BookingTrackerModal
        bookingId={activeTrackingBookingId}
        currentUser={currentUser}
        onClose={() => setActiveTrackingBookingId(null)}
        onRefresh={fetchMyBookings}
        onViewReceipt={(id) => setActiveReceiptBookingId(id)}
      />

      <ReceiptModal
        bookingId={activeReceiptBookingId}
        onClose={() => setActiveReceiptBookingId(null)}
      />
    </div>
  );
}

export default App;
