import React, { useState, useEffect } from 'react';
import type { AppState, Chapter } from '../../types';
import { 
  Users, Building2, Store, ClipboardList, ShoppingBag, 
  Share2, CheckCircle2, Compass, Globe, Calendar, FileText, 
  Star, TrendingUp, PhoneCall, BarChart3, CreditCard, Wallet, 
  Receipt, PieChart, Settings, Bell, ShieldCheck, Database, 
  Search, ChevronDown, RefreshCw, Download, Rocket, Trophy, 
  Plus, X, ArrowRight, UserCheck, AlertTriangle, CheckSquare,
  LogOut, Activity, Filter, Eye, ChevronRight, UserPlus
} from 'lucide-react';

interface AdminPortalProps {
  state: AppState;
  updateState: (newState: AppState) => void;
  lang: 'ta' | 'en';
  onExitPortal?: (portal?: 'gateway' | 'business' | 'user') => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ 
  state, 
  updateState, 
  lang,
  onExitPortal 
}) => {
  // Navigation & Sub-views
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentTime, setCurrentTime] = useState<string>('15 Apr 2025, 04:30 PM');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [growthTimeRange, setGrowthTimeRange] = useState<string>('6 Months');
  const [revenueTimeRange, setRevenueTimeRange] = useState<string>('6 Months');

  // Form states for modals
  const [newChapterName, setNewChapterName] = useState<string>('');
  const [newChapterTaluk, setNewChapterTaluk] = useState<string>('dharmapuri');
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberPhone, setNewMemberPhone] = useState<string>('');
  const [newMemberBusiness, setNewMemberBusiness] = useState<string>('');

  const members = state?.members || [];
  const chapters = state?.chapters || [];
  const users = state?.users || [];
  const requirements = state?.marketplaceRequirements || [];
  const orders = state?.marketplaceOrders || [];

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
        ', ' + 
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle Export Report
  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('NBN Central Administration Report (PDF/Excel) உருவாக்கப்பட்டது!');
    }, 1000);
  };

  // Create Chapter Handler
  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterName.trim()) return;

    const newCh: Chapter = {
      id: `ch_${Date.now()}`,
      name: newChapterName,
      nameTa: newChapterName,
      nameEn: newChapterName,
      talukId: newChapterTaluk,
      districtId: newChapterTaluk === 'salem' ? 'salem' : 'dharmapuri',
      filledSeats: 1,
      availableSeats: 99,
    };

    updateState({
      ...state,
      chapters: [...chapters, newCh],
    });
    setNewChapterName('');
    setShowAddChapterModal(false);
    alert(`"${newChapterName}" சாப்டர் வெற்றிகரமாக உருவாக்கப்பட்டது!`);
  };

  // Toggle user active / suspended
  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'suspended' ? 'active' : 'suspended',
        };
      }
      return u;
    });
    updateState({ ...state, users: updatedUsers });
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR (Dark Navy Slate)                        */}
      {/* ======================================================== */}
      <aside className="w-64 bg-[#0b0f19] text-slate-300 flex flex-col shrink-0 border-r border-slate-800/80 select-none overflow-y-auto">
        
        {/* BRAND LOGO HEADER */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
          {/* Multi-color Radial Connected Nodes Logo */}
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
            <svg viewBox="0 0 100 100" className="w-7 h-7">
              {/* Connector Lines */}
              <circle cx="50" cy="50" r="28" fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="3 3" />
              {/* Central Hub */}
              <circle cx="50" cy="50" r="8" fill="#ffffff" />
              {/* 6 Colored Peripheral Orbit Nodes */}
              <circle cx="50" cy="22" r="7" fill="#06b6d4" />
              <circle cx="74" cy="36" r="7" fill="#ec4899" />
              <circle cx="74" cy="64" r="7" fill="#f59e0b" />
              <circle cx="50" cy="78" r="7" fill="#10b981" />
              <circle cx="26" cy="64" r="7" fill="#8b5cf6" />
              <circle cx="26" cy="36" r="7" fill="#3b82f6" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-black text-white tracking-wider leading-none">
              NBN
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
              Nuvea Business Network
            </div>
          </div>
        </div>

        {/* NAVIGATION SECTIONS */}
        <div className="flex-1 py-4 px-3 space-y-6 text-xs font-semibold overflow-y-auto">
          
          {/* ACTIVE DASHBOARD ITEM */}
          <div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                  : 'hover:bg-slate-900 text-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span className="text-sm font-bold">Dashboard</span>
            </button>
          </div>

          {/* SECTION 1: NETWORK MANAGEMENT */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3.5 pb-1">
              Network Management
            </div>
            
            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'members' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Members</span>
            </button>

            <button
              onClick={() => setActiveTab('chapters')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'chapters' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Chapters</span>
            </button>

            <button
              onClick={() => setActiveTab('geography')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'geography' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Geography</span>
            </button>

            <button
              onClick={() => setActiveTab('referrals')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'referrals' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Share2 className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Referrals</span>
            </button>

            <button
              onClick={() => setActiveTab('meetings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'meetings' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Meetings & Attendance</span>
            </button>
          </div>

          {/* SECTION 2: MARKETPLACE MANAGEMENT */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3.5 pb-1">
              Marketplace Management
            </div>

            <button
              onClick={() => setActiveTab('business_listings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'business_listings' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Business Listings</span>
            </button>

            <button
              onClick={() => setActiveTab('customer_requirements')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'customer_requirements' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Customer Requirements</span>
            </button>

            <button
              onClick={() => setActiveTab('quotations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'quotations' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Quotations</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'orders' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Orders & Transactions</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'reviews' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Star className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Reviews & Disputes</span>
            </button>
          </div>

          {/* SECTION 3: GROWTH & CRM */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3.5 pb-1">
              Growth & CRM
            </div>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'leads' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Leads</span>
            </button>

            <button
              onClick={() => setActiveTab('followups')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'followups' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <PhoneCall className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Follow-ups</span>
            </button>

            <button
              onClick={() => setActiveTab('performance_analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'performance_analytics' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Performance Analytics</span>
            </button>
          </div>

          {/* SECTION 4: FINANCE */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3.5 pb-1">
              Finance
            </div>

            <button
              onClick={() => setActiveTab('membership_plans')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'membership_plans' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Membership Plans</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'payments' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Wallet className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Payments</span>
            </button>

            <button
              onClick={() => setActiveTab('invoices')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'invoices' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Receipt className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Invoices & Refunds</span>
            </button>

            <button
              onClick={() => setActiveTab('revenue_reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'revenue_reports' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <PieChart className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Revenue Reports</span>
            </button>
          </div>

          {/* SECTION 5: PLATFORM CONTROL */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3.5 pb-1">
              Platform Control
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'settings' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'notifications' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'audit_logs' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Audit Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'security' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Security & Backup</span>
            </button>
          </div>

        </div>

        {/* SIDEBAR FOOTER CARD */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 rounded-2xl p-3 border border-indigo-900/40 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Rocket className="w-4 h-4" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="text-xs font-black text-white truncate">NBN v2.0.0</div>
              <div className="text-[10px] text-slate-400 truncate">Build for Business Growth</div>
            </div>
          </div>
        </div>

      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA (Light SaaS Grey / Off-white)       */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 z-10 shadow-xs">
          
          {/* SEARCH INPUT */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search members, businesses, chapters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72 sm:w-96 pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs font-medium text-slate-800 rounded-xl border border-transparent focus:border-indigo-400 focus:outline-none transition"
            />
          </div>

          {/* TOP RIGHT PROFILE & CONTROLS */}
          <div className="flex items-center gap-4">
            
            {/* SWITCH TO FRONTEND PORTAL BUTTON */}
            {onExitPortal && (
              <button
                onClick={() => onExitPortal('gateway')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                title="Switch back to public portal"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Return to Site</span>
              </button>
            )}

            {/* NOTIFICATION BELL */}
            <div className="relative cursor-pointer p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                5
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* SUPER ADMIN PROFILE PILL */}
            <div className="flex items-center gap-3 pl-1 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Super Admin Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">Super Admin</div>
                <div className="text-[10px] text-slate-400 font-medium">NBN HQ</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

          </div>
        </header>

        {/* SCROLLABLE DASHBOARD VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ====================================================== */}
          {/* TAB 1: MAIN CONTROL CENTRE DASHBOARD                   */}
          {/* ====================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              
              {/* PAGE TITLE & TOP ACTION ROW */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    NBN Control Centre
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Central Administration Dashboard
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* LIVE SYSTEM STATUS PILL */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live System</span>
                  </div>

                  {/* LAST UPDATED CLOCK & REFRESH */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span>Last Updated: {currentTime}</span>
                    <button 
                      onClick={() => setCurrentTime(new Date().toLocaleTimeString())}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Refresh"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* EXPORT REPORT BUTTON */}
                  <button
                    onClick={handleExportReport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? 'Generating...' : 'Export Report'}</span>
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* 10 METRICS GRID (2 Rows of 5 Cards)                  */}
              {/* ---------------------------------------------------- */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                
                {/* 1. Total Members */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Total Members</div>
                    <div className="text-2xl font-black text-slate-900">1,250</div>
                    <div className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5">
                      <span>↑ 12%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                {/* 2. Active Networking */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Active Networking</div>
                    <div className="text-2xl font-black text-slate-900">856</div>
                    <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <span>↑ 14%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. Marketplace Sellers */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Marketplace Sellers</div>
                    <div className="text-2xl font-black text-slate-900">342</div>
                    <div className="text-[10px] font-bold text-purple-600 flex items-center gap-0.5">
                      <span>↑ 10%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                </div>

                {/* 4. Customers */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Customers</div>
                    <div className="text-2xl font-black text-slate-900">1,480</div>
                    <div className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                      <span>↑ 16%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>

                {/* 5. Pending Approvals */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Pending Approvals</div>
                    <div className="text-2xl font-black text-slate-900">36</div>
                    <div className="text-[10px] font-bold text-teal-600 flex items-center gap-0.5">
                      <span>↓ 8%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                {/* 6. Active Chapters */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Active Chapters</div>
                    <div className="text-2xl font-black text-slate-900">{chapters.length || 25}</div>
                    <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <span>↑ 5%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                </div>

                {/* 7. Business Listings */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Business Listings</div>
                    <div className="text-2xl font-black text-slate-900">2,840</div>
                    <div className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5">
                      <span>↑ 18%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                {/* 8. Open Requirements */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Open Requirements</div>
                    <div className="text-2xl font-black text-slate-900">148</div>
                    <div className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                      <span>↑ 20%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                </div>

                {/* 9. Active Quotations */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Active Quotations</div>
                    <div className="text-2xl font-black text-slate-900">326</div>
                    <div className="text-[10px] font-bold text-indigo-600 flex items-center gap-0.5">
                      <span>↑ 15%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                {/* 10. Completed Orders */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Completed Orders</div>
                    <div className="text-2xl font-black text-slate-900">412</div>
                    <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <span>↑ 22%</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* ---------------------------------------------------- */}
              {/* MIDDLE ROW: 3 ANALYTICS & CHARTS CARDS               */}
              {/* ---------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* 1. MEMBER GROWTH TREND */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-slate-700" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Member Growth Trend
                      </h3>
                    </div>
                    <select
                      value={growthTimeRange}
                      onChange={(e) => setGrowthTimeRange(e.target.value)}
                      className="text-xs font-bold text-slate-600 bg-slate-100 rounded-lg px-2 py-1 border-0 focus:outline-none cursor-pointer"
                    >
                      <option>6 Months</option>
                      <option>1 Year</option>
                      <option>All Time</option>
                    </select>
                  </div>

                  {/* SVG INTERACTIVE LINE CHART */}
                  <div className="relative pt-4 pb-2">
                    {/* Tooltip on Apr point */}
                    <div className="absolute top-3 left-[56%] -translate-x-1/2 bg-slate-900 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold shadow-lg z-10 pointer-events-none">
                      <div>Apr</div>
                      <div className="text-amber-400 font-black">1,120 Members</div>
                    </div>

                    <svg viewBox="0 0 360 170" className="w-full h-44 overflow-visible">
                      <defs>
                        <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="30" y1="20" x2="350" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="30" y1="60" x2="350" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="30" y1="100" x2="350" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="30" y1="140" x2="350" y2="140" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Y-Axis Labels */}
                      <text x="5" y="24" fill="#94a3b8" fontSize="9" fontWeight="700">1.5K</text>
                      <text x="12" y="64" fill="#94a3b8" fontSize="9" fontWeight="700">1K</text>
                      <text x="7" y="104" fill="#94a3b8" fontSize="9" fontWeight="700">500</text>
                      <text x="18" y="144" fill="#94a3b8" fontSize="9" fontWeight="700">0</text>

                      {/* Filled Area Gradient */}
                      <path
                        d="M 40 120 Q 95 100 150 90 T 210 70 T 270 60 T 340 45 L 340 140 L 40 140 Z"
                        fill="url(#blueAreaGrad)"
                      />

                      {/* Smooth Line Path */}
                      <path
                        d="M 40 120 Q 95 100 150 90 T 210 70 T 270 60 T 340 45"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Data Point Dots */}
                      <circle cx="40" cy="120" r="3.5" fill="#2563eb" />
                      <circle cx="100" cy="100" r="3.5" fill="#2563eb" />
                      <circle cx="160" cy="90" r="3.5" fill="#2563eb" />
                      <circle cx="220" cy="70" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="280" cy="60" r="3.5" fill="#2563eb" />
                      <circle cx="340" cy="45" r="3.5" fill="#2563eb" />

                      {/* X-Axis Labels */}
                      <text x="35" y="160" fill="#64748b" fontSize="9" fontWeight="700">Jan</text>
                      <text x="95" y="160" fill="#64748b" fontSize="9" fontWeight="700">Feb</text>
                      <text x="155" y="160" fill="#64748b" fontSize="9" fontWeight="700">Mar</text>
                      <text x="215" y="160" fill="#64748b" fontSize="9" fontWeight="700">Apr</text>
                      <text x="275" y="160" fill="#64748b" fontSize="9" fontWeight="700">May</text>
                      <text x="335" y="160" fill="#64748b" fontSize="9" fontWeight="700">Jun</text>
                    </svg>
                  </div>
                </div>

                {/* 2. REVENUE OVERVIEW (INR Strictly) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-slate-700" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Revenue Overview
                      </h3>
                    </div>
                    <select
                      value={revenueTimeRange}
                      onChange={(e) => setRevenueTimeRange(e.target.value)}
                      className="text-xs font-bold text-slate-600 bg-slate-100 rounded-lg px-2 py-1 border-0 focus:outline-none cursor-pointer"
                    >
                      <option>6 Months</option>
                      <option>1 Year</option>
                      <option>All Time</option>
                    </select>
                  </div>

                  {/* SVG BAR CHART */}
                  <div className="pt-4 pb-2">
                    <svg viewBox="0 0 360 170" className="w-full h-44 overflow-visible">
                      {/* Grid Lines */}
                      <line x1="35" y1="20" x2="350" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="35" y1="60" x2="350" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="35" y1="100" x2="350" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="35" y1="140" x2="350" y2="140" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Y-Axis Labels (Strictly INR) */}
                      <text x="5" y="24" fill="#94a3b8" fontSize="9" fontWeight="700">₹15L</text>
                      <text x="5" y="64" fill="#94a3b8" fontSize="9" fontWeight="700">₹10L</text>
                      <text x="9" y="104" fill="#94a3b8" fontSize="9" fontWeight="700">₹5L</text>
                      <text x="18" y="144" fill="#94a3b8" fontSize="9" fontWeight="700">₹0</text>

                      {/* Monthly Green Vertical Bars */}
                      {/* Jan: 7L */}
                      <rect x="52" y="85" width="26" height="55" rx="5" fill="#10b981" />
                      {/* Feb: 11L */}
                      <rect x="105" y="55" width="26" height="85" rx="5" fill="#10b981" />
                      {/* Mar: 9.5L */}
                      <rect x="158" y="70" width="26" height="70" rx="5" fill="#10b981" />
                      {/* Apr: 10.2L */}
                      <rect x="211" y="65" width="26" height="75" rx="5" fill="#10b981" />
                      {/* May: 13.5L */}
                      <rect x="264" y="38" width="26" height="102" rx="5" fill="#10b981" />
                      {/* Jun: 14.8L */}
                      <rect x="317" y="30" width="26" height="110" rx="5" fill="#10b981" />

                      {/* X-Axis Labels */}
                      <text x="56" y="160" fill="#64748b" fontSize="9" fontWeight="700">Jan</text>
                      <text x="109" y="160" fill="#64748b" fontSize="9" fontWeight="700">Feb</text>
                      <text x="162" y="160" fill="#64748b" fontSize="9" fontWeight="700">Mar</text>
                      <text x="215" y="160" fill="#64748b" fontSize="9" fontWeight="700">Apr</text>
                      <text x="268" y="160" fill="#64748b" fontSize="9" fontWeight="700">May</text>
                      <text x="321" y="160" fill="#64748b" fontSize="9" fontWeight="700">Jun</text>
                    </svg>
                  </div>
                </div>

                {/* 3. CHAPTER PERFORMANCE (Donut Chart) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-slate-700" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Chapter Performance
                      </h3>
                    </div>
                  </div>

                  {/* DONUT CHART & LEGEND */}
                  <div className="flex items-center justify-around py-2">
                    {/* SVG DONUT */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Background track */}
                        <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                        
                        {/* Top Performing (Emerald): 60% -> strokeDasharray="143 238" */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="12"
                          strokeDasharray="143 238"
                          strokeDashoffset="0"
                        />
                        {/* Active (Blue): 25% -> strokeDasharray="60 238" */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          strokeDasharray="60 238"
                          strokeDashoffset="-143"
                        />
                        {/* Needs Attention (Amber): 15% -> strokeDasharray="35 238" */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="12"
                          strokeDasharray="35 238"
                          strokeDashoffset="-203"
                        />
                      </svg>
                      {/* Center Text */}
                      <div className="absolute text-center">
                        <div className="text-xl font-black text-slate-900 leading-none">25</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">Chapters</div>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="space-y-2 text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Top Performing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span>Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Needs Attention</span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setActiveTab('chapters')}
                      className="text-xs font-bold text-slate-900 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* ---------------------------------------------------- */}
              {/* LOWER ROW: 3 CARDS                                   */}
              {/* ---------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* 1. DISTRICT-WISE BUSINESS PERFORMANCE */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-slate-700" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        District-Wise Business Performance
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Tamil Nadu Map Illustration */}
                    <div className="w-36 h-40 shrink-0 relative flex items-center justify-center bg-slate-50 rounded-2xl p-2 border border-slate-100">
                      <svg viewBox="0 0 100 120" className="w-full h-full">
                        {/* Simplified Stylized Tamil Nadu District Polygons */}
                        {/* Northern (Chennai/Tiruvallur) */}
                        <path d="M 55 10 L 75 18 L 85 30 L 70 38 L 55 25 Z" fill="#10b981" />
                        {/* Western (Coimbatore/Tirupur) */}
                        <path d="M 20 45 L 42 40 L 45 65 L 25 70 L 15 55 Z" fill="#f59e0b" />
                        {/* Dharmapuri / Salem */}
                        <path d="M 45 28 L 68 35 L 60 55 L 42 45 Z" fill="#3b82f6" />
                        {/* Central (Trichy / Dindigul) */}
                        <path d="M 42 55 L 65 52 L 60 78 L 40 75 Z" fill="#8b5cf6" />
                        {/* Southern (Madurai / Tirunelveli / Kanyakumari) */}
                        <path d="M 28 72 L 58 75 L 55 105 L 35 115 L 25 90 Z" fill="#6366f1" />
                      </svg>
                    </div>

                    {/* Percentage Breakdown Legend */}
                    <div className="flex-1 space-y-2 text-xs font-bold text-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>Chennai</span>
                        </div>
                        <span className="font-black text-slate-900">28.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span>Coimbatore</span>
                        </div>
                        <span className="font-black text-slate-900">22.3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <span>Madurai</span>
                        </div>
                        <span className="font-black text-slate-900">18.7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <span>Salem</span>
                        </div>
                        <span className="font-black text-slate-900">16.1%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                          <span>Others</span>
                        </div>
                        <span className="font-black text-slate-900">14.4%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. RECENT PLATFORM ACTIVITY */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-700" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Recent Platform Activity
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('audit_logs')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Activity Feed Items */}
                  <div className="space-y-3">
                    
                    {/* Item 1 */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" 
                          alt="User" 
                          className="w-7 h-7 rounded-full object-cover shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-slate-900">New business registered</div>
                          <div className="text-[11px] text-slate-500">Ramesh Traders – Chennai</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">2 min ago</span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" 
                          alt="User" 
                          className="w-7 h-7 rounded-full object-cover shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-slate-900">New order placed</div>
                          <div className="text-[11px] text-emerald-600 font-bold">₹48,500 – City Supplies</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">5 min ago</span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80" 
                          alt="User" 
                          className="w-7 h-7 rounded-full object-cover shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-slate-900">New referral</div>
                          <div className="text-[11px] text-slate-500">Suresh → Kumar</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">8 min ago</span>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" 
                          alt="User" 
                          className="w-7 h-7 rounded-full object-cover shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-slate-900">Chapter meeting scheduled</div>
                          <div className="text-[11px] text-slate-500">Dharmapuri Chapter</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">12 min ago</span>
                    </div>

                  </div>
                </div>

                {/* 3. PENDING ADMIN TASKS */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-slate-700" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Pending Admin Tasks
                      </h3>
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                        12
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('members')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">
                        👤
                      </span>
                      <span className="flex-grow">Approve 18 new business registrations</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">
                        📋
                      </span>
                      <span className="flex-grow">Review 7 customer requirements</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">
                        🏪
                      </span>
                      <span className="flex-grow">Verify 5 marketplace sellers</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">
                        ⚖️
                      </span>
                      <span className="flex-grow">Resolve 3 disputes</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">
                        🗳️
                      </span>
                      <span className="flex-grow">Confirm 2 chapter elections</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ---------------------------------------------------- */}
              {/* VERY BOTTOM ROW: ALERTS, QUICK ACTIONS, TOP CHAPTERS */}
              {/* ---------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* 1. SYSTEM ALERTS */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        System Alerts
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('audit_logs')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-slate-700 font-medium">Database backup completed successfully</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">2 hours ago</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-slate-700 font-medium">High activity in Chennai chapter</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">3 hours ago</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        <span className="text-slate-700 font-medium">Payment gateway response delay</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">4 hours ago</span>
                    </div>
                  </div>
                </div>

                {/* 2. QUICK ACTIONS */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    Quick Actions
                  </h3>

                  <div className="grid grid-cols-4 gap-2.5">
                    {/* Add Member */}
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="p-3 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center"
                    >
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <span className="text-[10px] font-black leading-tight">Add Member</span>
                    </button>

                    {/* Create Chapter */}
                    <button
                      onClick={() => setShowAddChapterModal(true)}
                      className="p-3 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center"
                    >
                      <Share2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-[10px] font-black leading-tight">Create Chapter</span>
                    </button>

                    {/* Approve Business */}
                    <button
                      onClick={() => setActiveTab('members')}
                      className="p-3 rounded-xl bg-purple-50/80 hover:bg-purple-100/80 text-purple-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center"
                    >
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      <span className="text-[10px] font-black leading-tight">Approve Business</span>
                    </button>

                    {/* View Reports */}
                    <button
                      onClick={handleExportReport}
                      className="p-3 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 text-amber-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center"
                    >
                      <BarChart3 className="w-5 h-5 text-amber-600" />
                      <span className="text-[10px] font-black leading-tight">View Reports</span>
                    </button>
                  </div>
                </div>

                {/* 3. TOP CHAPTERS BY BUSINESS VALUE */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Top Chapters by Business Value
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('chapters')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] flex items-center justify-center">
                          1
                        </span>
                        <span className="font-bold text-slate-800">Chennai Chapter</span>
                      </div>
                      <span className="font-black text-slate-900">₹12.5L</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-black text-[10px] flex items-center justify-center">
                          2
                        </span>
                        <span className="font-bold text-slate-800">Coimbatore Chapter</span>
                      </div>
                      <span className="font-black text-slate-900">₹10.8L</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 font-black text-[10px] flex items-center justify-center">
                          3
                        </span>
                        <span className="font-bold text-slate-800">Madurai Chapter</span>
                      </div>
                      <span className="font-black text-slate-900">₹8.7L</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 2: MEMBERS DIRECTORY VIEW                          */}
          {/* ====================================================== */}
          {activeTab === 'members' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Member Directory & Access Management</h2>
                  <p className="text-xs text-slate-500">Search, verify, approve, and manage networking & marketplace accounts.</p>
                </div>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Member</span>
                </button>
              </div>

              {/* USER LIST TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Member Details</th>
                      <th className="px-5 py-3">Category & Taluk</th>
                      <th className="px-5 py-3">Account Type</th>
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5">
                          <div className="font-black text-slate-900 text-sm">{u.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 font-medium">
                          <div>{u.categoryId || 'General'}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{u.talukId || 'Harur'}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {u.accountType || u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          <div>📞 {u.phone}</div>
                          <div className="text-[10px] text-slate-400">✉️ {u.email}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              u.status === 'suspended' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'suspended' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span>{(u.status || 'active').toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              u.status === 'suspended'
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 3: CHAPTERS MANAGEMENT VIEW                        */}
          {/* ====================================================== */}
          {activeTab === 'chapters' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Chapters & Seat Occupancy</h2>
                  <p className="text-xs text-slate-500">Monitor chapter health, 100-seat monopolies, and director elections.</p>
                </div>
                <button
                  onClick={() => setShowAddChapterModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Chapter</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((c) => {
                  const chMembers = members.filter((m) => m.chapterId === c.id);
                  const occ = chMembers.length || c.filledSeats || 8;
                  const pct = Math.min(100, Math.round((occ / 100) * 100));
                  return (
                    <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900">{c.nameTa || c.name}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {c.talukId?.toUpperCase() || 'REGIONAL'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Meeting: {c.meetingDay || 'Thursday 7:00 AM'}
                      </div>
                      <div className="flex items-baseline justify-between text-xs pt-1">
                        <span className="text-slate-500 font-medium">Occupancy:</span>
                        <span className="font-black text-slate-900">{occ} / 100 seats</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.max(5, pct)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 4: MARKETPLACE MANAGEMENT                          */}
          {/* ====================================================== */}
          {(activeTab === 'customer_requirements' || activeTab === 'orders' || activeTab === 'business_listings') && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">B2B Marketplace Management</h2>
                  <p className="text-xs text-slate-500">Direct RFQ requirements, verified supplier bids, and fulfilled orders.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Requirements */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="text-sm font-black text-slate-900">Open Customer Requirements ({requirements.length})</h3>
                  <div className="space-y-2">
                    {requirements.map((r) => (
                      <div key={r.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                        <div className="font-bold text-slate-900">{r.title}</div>
                        <div className="text-[11px] text-amber-700 font-bold mt-0.5">Budget: ₹{r.budget.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{r.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="text-sm font-black text-slate-900">Marketplace Transactions & Orders ({orders.length})</h3>
                  <div className="space-y-2">
                    {orders.length === 0 ? (
                      <div className="text-xs text-slate-400 p-4 text-center">No transactions recorded yet.</div>
                    ) : (
                      orders.map((o) => (
                        <div key={o.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900">Order #{o.id}</div>
                            <div className="text-[10px] text-slate-500">Status: {o.status}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-emerald-600">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-slate-400">18% GST</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 5: PLATFORM SETTINGS                               */}
          {/* ====================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-black text-slate-900">Super Admin Platform Settings</h2>
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-700">Platform Brand Name</label>
                    <input
                      type="text"
                      defaultValue="Nuvea Business Network (NBN)"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-700">Platform Currency</label>
                    <input
                      type="text"
                      disabled
                      defaultValue="INR (Indian Rupee Only)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-700">Live Test Membership Fee</label>
                    <input
                      type="text"
                      disabled
                      defaultValue="₹1.00 INR (1 RS ONLY)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-emerald-50 text-emerald-800 text-xs font-black"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-700">GST Rate (%)</label>
                    <input
                      type="number"
                      defaultValue={18}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end">
                  <button
                    onClick={() => alert('அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* ADD CHAPTER MODAL                                        */}
      {/* ======================================================== */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">புதிய சாப்டர் துவங்கு (Create Chapter)</h3>
              <button 
                onClick={() => setShowAddChapterModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateChapter} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700">சாப்டர் பெயர் (Chapter Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="எ.கா: அரூர் வைப்ரன்ட்ஸ் சாப்டர்"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">தாலுகா மண்டலம் (Taluk) *</label>
                <select
                  value={newChapterTaluk}
                  onChange={(e) => setNewChapterTaluk(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  <option value="harur">அரூர் (Harur)</option>
                  <option value="palacode">பாலக்கோடு (Palacode)</option>
                  <option value="dharmapuri">தருமபுரி நகரம் (Dharmapuri Town)</option>
                  <option value="salem">சேலம் மேற்கு (Salem West)</option>
                  <option value="omallur">ஓமலூர் (Omallur)</option>
                </select>
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(false)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-slate-700"
                >
                  ரத்து (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl text-white shadow-md"
                >
                  உருவாக்கு ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD MEMBER MODAL                                         */}
      {/* ======================================================== */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">புதிய உறுப்பினர் சேர்க்கை (Add Member)</h3>
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert(`உறுப்பினர் "${newMemberName}" சேர்க்கப்பட்டார்!`);
                setShowAddMemberModal(false);
              }} 
              className="space-y-3 text-xs font-semibold"
            >
              <div>
                <label className="block mb-1 text-slate-700">உறுப்பினர் பெயர் *</label>
                <input
                  type="text"
                  required
                  placeholder="முழு பெயர் உள்ளிடவும்"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">தொலைபேசி எண் *</label>
                <input
                  type="tel"
                  required
                  placeholder="10 இலக்க மொபைல் எண்"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">வணிகப் பெயர் *</label>
                <input
                  type="text"
                  required
                  placeholder="நிறுவனத்தின் பெயர்"
                  value={newMemberBusiness}
                  onChange={(e) => setNewMemberBusiness(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-slate-700"
                >
                  ரத்து
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl text-white shadow-md"
                >
                  சேர்க்க ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
