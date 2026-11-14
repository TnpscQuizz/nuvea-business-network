import React, { useState, useEffect } from 'react';
import type { AppState, Chapter } from '../../types';
import { 
  Users, Building2, Store, ClipboardList, ShoppingBag, 
  Share2, CheckCircle2, Compass, Globe, Calendar, FileText, 
  Star, TrendingUp, PhoneCall, BarChart3, CreditCard, Wallet, 
  Receipt, PieChart, Settings, Bell, ShieldCheck, Database, 
  Search, ChevronDown, RefreshCw, Download, Rocket, Trophy, 
  Plus, X, ArrowRight, UserCheck, AlertTriangle, CheckSquare,
  LogOut, Activity, Filter, Eye, EyeOff, ChevronRight, UserPlus,
  Edit2, Trash2, Lock, Unlock, Send, Play, Pause, Save, Check,
  Layers, MapPin, Sliders, Shield
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
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentTime, setCurrentTime] = useState<string>('15 Apr 2025, 04:30 PM');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string>('');

  // Modals
  const [showAddChapterModal, setShowAddChapterModal] = useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [strikingMember, setStrikingMember] = useState<any>(null);
  const [strikeReason, setStrikeReason] = useState<string>('');

  // Meeting Conductor State
  const [isMeetingRunning, setIsMeetingRunning] = useState<boolean>(false);
  const [meetingTimer, setMeetingTimer] = useState<number>(45);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState<number>(0);

  // Time Range Filters for Charts
  const [growthTimeRange, setGrowthTimeRange] = useState<string>('6 Months');
  const [revenueTimeRange, setRevenueTimeRange] = useState<string>('6 Months');

  // Customization & Settings State (Loaded from state or backend)
  const [settingsForm, setSettingsForm] = useState({
    platformName: 'Nuvea Business Network (NBN)',
    taglineTa: "தமிழ்நாட்டின் முதல் தாலுகா அளவிலான டிஜிட்டல் B2B நெட்வொர்க்",
    taglineEn: "Tamil Nadu's First Taluk-Level Digital B2B Business Network",
    founderName: 'சந்துரு மாதேசன் (Chandru Madhesan)',
    founderPhone: '9788112233',
    supportEmail: 'admin@nuvea.in',
    gstin: '33AABCN7548Z1Z9',
    sacCode: '998314',
    gstPercentage: 18,
    cgstPercentage: 9,
    sgstPercentage: 9,
    annualFeeTaluk: 1, // Currently locked to ₹1 INR for live testing!
    annualFeeDistrictVIP: 25000,
    annualFeeStateTitan: 50000,
    annualFeeNationalApex: 100000,
    talukMaxSeats: 100,
    speakerDurationSeconds: 45,
    speakerWarningSeconds: 10,
    strikeThresholdWarning: 1,
    strikeThresholdFinal: 2,
    strikeThresholdRevoke: 3,
    videoBenefitIncluded: true,
    razorpayKeyId: 'rzp_test_NBN_DEMO_KEY',
    razorpayKeySecret: '••••••••••••••••••••',
    razorpayPaymentLink: 'https://rzp.io/rzp/zZS6aMWL',
    demoPaymentMode: true,
    elevationWeightLeads: 30,
    elevationWeightClosedValue: 40,
    elevationWeightAttendance: 20,
    elevationWeightGuests: 10,
    chapterMaxMembers: 30, // Admin decided: 30 members max per chapter
    enableChapterChat: true,
    strictCategoryExclusivity: true
  });

  const [showSecret, setShowSecret] = useState<boolean>(false);

  // Hostinger Remote MySQL State
  const [hostingerConfig, setHostingerConfig] = useState({
    host: '',
    port: 3306,
    user: '',
    password: '',
    database: '',
    enabled: false
  });
  const [hostingerStatus, setHostingerStatus] = useState<string>('');
  const [isTestingHostinger, setIsTestingHostinger] = useState<boolean>(false);
  const [isSyncingHostinger, setIsSyncingHostinger] = useState<boolean>(false);

  // Broadcast Notification State
  const [broadcastTarget, setBroadcastTarget] = useState<string>('all');
  const [broadcastTitle, setBroadcastTitle] = useState<string>('');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');

  // Extract database objects safely
  const members = state?.members || [];
  const chapters = state?.chapters || [];
  const users = state?.users || [];
  const requirements = state?.marketplaceRequirements || [];
  const orders = state?.marketplaceOrders || [];

  // Clock tick
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

  // Meeting timer countdown
  useEffect(() => {
    let timerId: any = null;
    if (isMeetingRunning && meetingTimer > 0) {
      timerId = setInterval(() => {
        setMeetingTimer(prev => prev - 1);
      }, 1000);
    } else if (meetingTimer === 0 && isMeetingRunning) {
      setIsMeetingRunning(false);
    }
    return () => clearInterval(timerId);
  }, [isMeetingRunning, meetingTimer]);

  // Flash notification helper
  const flashBanner = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  // Save Settings to Backend with Persistence
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        flashBanner('✅ அனைத்து அமைப்புகளும் வெற்றிகரமாக சேமிக்கப்பட்டன! (Settings saved with live persistence)');
      } else {
        flashBanner('✅ அமைப்புகள் உள்ளூரில் புதுப்பிக்கப்பட்டன!');
      }
    } catch (e) {
      flashBanner('✅ அமைப்புகள் உள்ளூரில் புதுப்பிக்கப்பட்டன!');
    }
    setIsSaving(false);
  };

  // Load Hostinger Remote MySQL Config
  useEffect(() => {
    fetch('/api/admin/hostinger-config')
      .then(res => res.json())
      .then(cfg => {
        if (cfg) setHostingerConfig(cfg);
      })
      .catch(err => console.error('Error fetching hostinger config:', err));
  }, []);

  const handleSaveHostingerConfig = async () => {
    try {
      const res = await fetch('/api/admin/hostinger-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hostingerConfig)
      });
      const data = await res.json();
      flashBanner('✅ Hostinger MySQL அமைப்புகள் சேமிக்கப்பட்டன!');
    } catch (err: any) {
      flashBanner('❌ சேமிப்பதில் பிழை: ' + err.message);
    }
  };

  const handleTestHostinger = async () => {
    setIsTestingHostinger(true);
    setHostingerStatus('Connecting to Hostinger Remote MySQL...');
    try {
      const res = await fetch('/api/admin/hostinger-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hostingerConfig)
      });
      const data = await res.json();
      if (data.success) {
        setHostingerStatus('✅ Hostinger MySQL இணைப்பு வெற்றி! (Connected)');
        flashBanner('✅ Hostinger MySQL Remote Database Connected Successfully!');
      } else {
        setHostingerStatus(`❌ இணைப்பு தோல்வி: ${data.error}`);
      }
    } catch (err: any) {
      setHostingerStatus(`❌ இணைப்பு தோல்வி: ${err.message}`);
    } finally {
      setIsTestingHostinger(false);
    }
  };

  const handleSyncAllHostinger = async () => {
    setIsSyncingHostinger(true);
    try {
      const res = await fetch('/api/admin/hostinger-sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        flashBanner(`✅ ${data.message || 'அனைத்து வணிகர்களும் Hostinger MySQL-ல் ஒத்திசைக்கப்பட்டனர்!'}`);
      } else {
        flashBanner(`❌ ஒத்திசைவு தோல்வி: ${data.error}`);
      }
    } catch (err: any) {
      flashBanner(`❌ ஒத்திசைவு தோல்வி: ${err.message}`);
    } finally {
      setIsSyncingHostinger(false);
    }
  };

  // Member Status Toggle
  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    updateState({ ...state, users: updatedUsers });
    flashBanner('பயனர் நிலை மாற்றப்பட்டது!');
  };

  // Issue Strike
  const handleIssueStrike = () => {
    if (!strikingMember || !strikeReason.trim()) return;
    flashBanner(`உறுப்பினர் "${strikingMember.fullName}"-க்கு ஸ்ட்ரைக் பதிவு செய்யப்பட்டது: ${strikeReason}`);
    setStrikingMember(null);
    setStrikeReason('');
  };

  // Send Broadcast Notification
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    flashBanner(`அறிவிப்பு "${broadcastTitle}" வெற்றிகரமாக அனுப்பப்பட்டது! (Target: ${broadcastTarget.toUpperCase()})`);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  // Export CSV
  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['Business Name,Owner Name,Phone,Email,Category,Taluk,Status\n'];
      const rows = members.map(m => `"${m.businessName}","${m.ownerName}","${m.phone}","${m.email || ''}","${m.categoryName || ''}","${m.talukId}","${m.status}"\n`);
      const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NBN_Members_Export_${Date.now()}.csv`;
      a.click();
      setIsExporting(false);
      flashBanner('CSV அறிக்கை பதிவிறக்கம் செய்யப்பட்டது!');
    }, 600);
  };

  // Download DB Backup
  const handleDownloadBackup = () => {
    const backupJson = JSON.stringify(state, null, 2);
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NBN_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    flashBanner('முழு தரவுத்தள காப்புப் பிரதி (Database Backup JSON) பதிவிறக்கம் செய்யப்பட்டது!');
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR (Dark Navy Slate)                        */}
      {/* ======================================================== */}
      <aside className="w-64 bg-[#0b0f19] text-slate-300 flex flex-col shrink-0 border-r border-slate-800/80 select-none overflow-y-auto">
        
        {/* BRAND LOGO HEADER */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
            <svg viewBox="0 0 100 100" className="w-7 h-7">
              <circle cx="50" cy="50" r="28" fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="8" fill="#ffffff" />
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
          
          {/* DASHBOARD */}
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

          {/* 1. NETWORK MANAGEMENT */}
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

          {/* 2. MARKETPLACE MANAGEMENT */}
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

          {/* 3. GROWTH & CRM */}
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

          {/* 4. FINANCE */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3.5 pb-1">
              Finance & Customizations
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
              <span>Payments & Razorpay</span>
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

          {/* 5. PLATFORM CONTROL */}
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
            
            {/* RETURN TO FRONTEND PORTAL BUTTON */}
            {onExitPortal && (
              <button
                onClick={() => onExitPortal('gateway')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                title="Switch back to public website"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Return to Site</span>
              </button>
            )}

            {/* NOTIFICATION BELL */}
            <div 
              onClick={() => setActiveTab('notifications')}
              className="relative cursor-pointer p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
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

        {/* NOTIFICATION SUCCESS BANNER */}
        {successBanner && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 flex items-center justify-between shadow-md">
            <span>{successBanner}</span>
            <button onClick={() => setSuccessBanner('')} className="text-white hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SCROLLABLE VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ====================================================== */}
          {/* TAB 1: MASTER DASHBOARD (EXACT VISUAL MATCH)           */}
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
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? 'Generating...' : 'Export Report'}</span>
                  </button>
                </div>
              </div>

              {/* 10 METRICS GRID (2 Rows of 5 Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                
                {/* 1. Total Members */}
                <div onClick={() => setActiveTab('members')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Total Members</div>
                    <div className="text-2xl font-black text-slate-900">1,250</div>
                    <div className="text-[10px] font-bold text-blue-600">↑ 12%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                {/* 2. Active Networking */}
                <div onClick={() => setActiveTab('referrals')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Active Networking</div>
                    <div className="text-2xl font-black text-slate-900">856</div>
                    <div className="text-[10px] font-bold text-emerald-600">↑ 14%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. Marketplace Sellers */}
                <div onClick={() => setActiveTab('business_listings')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Marketplace Sellers</div>
                    <div className="text-2xl font-black text-slate-900">342</div>
                    <div className="text-[10px] font-bold text-purple-600">↑ 10%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                </div>

                {/* 4. Customers */}
                <div onClick={() => setActiveTab('members')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Customers</div>
                    <div className="text-2xl font-black text-slate-900">1,480</div>
                    <div className="text-[10px] font-bold text-amber-600">↑ 16%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>

                {/* 5. Pending Approvals */}
                <div onClick={() => setActiveTab('members')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Pending Approvals</div>
                    <div className="text-2xl font-black text-slate-900">36</div>
                    <div className="text-[10px] font-bold text-teal-600">↓ 8%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                {/* 6. Active Chapters */}
                <div onClick={() => setActiveTab('chapters')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Active Chapters</div>
                    <div className="text-2xl font-black text-slate-900">{chapters.length || 25}</div>
                    <div className="text-[10px] font-bold text-emerald-600">↑ 5%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                </div>

                {/* 7. Business Listings */}
                <div onClick={() => setActiveTab('business_listings')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Business Listings</div>
                    <div className="text-2xl font-black text-slate-900">2,840</div>
                    <div className="text-[10px] font-bold text-blue-600">↑ 18%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                {/* 8. Open Requirements */}
                <div onClick={() => setActiveTab('customer_requirements')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Open Requirements</div>
                    <div className="text-2xl font-black text-slate-900">{requirements.length || 148}</div>
                    <div className="text-[10px] font-bold text-amber-600">↑ 20%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                </div>

                {/* 9. Active Quotations */}
                <div onClick={() => setActiveTab('quotations')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Active Quotations</div>
                    <div className="text-2xl font-black text-slate-900">326</div>
                    <div className="text-[10px] font-bold text-indigo-600">↑ 15%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                {/* 10. Completed Orders */}
                <div onClick={() => setActiveTab('orders')} className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Completed Orders</div>
                    <div className="text-2xl font-black text-slate-900">412</div>
                    <div className="text-[10px] font-bold text-emerald-600">↑ 22%</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* MIDDLE ROW: 3 ANALYTICS CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* 1. Member Growth Trend */}
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

                  <div className="relative pt-4 pb-2">
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
                      <line x1="30" y1="20" x2="350" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="30" y1="60" x2="350" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="30" y1="100" x2="350" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="30" y1="140" x2="350" y2="140" stroke="#f1f5f9" strokeWidth="1" />

                      <text x="5" y="24" fill="#94a3b8" fontSize="9" fontWeight="700">1.5K</text>
                      <text x="12" y="64" fill="#94a3b8" fontSize="9" fontWeight="700">1K</text>
                      <text x="7" y="104" fill="#94a3b8" fontSize="9" fontWeight="700">500</text>
                      <text x="18" y="144" fill="#94a3b8" fontSize="9" fontWeight="700">0</text>

                      <path d="M 40 120 Q 95 100 150 90 T 210 70 T 270 60 T 340 45 L 340 140 L 40 140 Z" fill="url(#blueAreaGrad)" />
                      <path d="M 40 120 Q 95 100 150 90 T 210 70 T 270 60 T 340 45" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

                      <circle cx="40" cy="120" r="3.5" fill="#2563eb" />
                      <circle cx="100" cy="100" r="3.5" fill="#2563eb" />
                      <circle cx="160" cy="90" r="3.5" fill="#2563eb" />
                      <circle cx="220" cy="70" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="280" cy="60" r="3.5" fill="#2563eb" />
                      <circle cx="340" cy="45" r="3.5" fill="#2563eb" />

                      <text x="35" y="160" fill="#64748b" fontSize="9" fontWeight="700">Jan</text>
                      <text x="95" y="160" fill="#64748b" fontSize="9" fontWeight="700">Feb</text>
                      <text x="155" y="160" fill="#64748b" fontSize="9" fontWeight="700">Mar</text>
                      <text x="215" y="160" fill="#64748b" fontSize="9" fontWeight="700">Apr</text>
                      <text x="275" y="160" fill="#64748b" fontSize="9" fontWeight="700">May</text>
                      <text x="335" y="160" fill="#64748b" fontSize="9" fontWeight="700">Jun</text>
                    </svg>
                  </div>
                </div>

                {/* 2. Revenue Overview (INR Strictly) */}
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

                  <div className="pt-4 pb-2">
                    <svg viewBox="0 0 360 170" className="w-full h-44 overflow-visible">
                      <line x1="35" y1="20" x2="350" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="35" y1="60" x2="350" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="35" y1="100" x2="350" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="35" y1="140" x2="350" y2="140" stroke="#f1f5f9" strokeWidth="1" />

                      <text x="5" y="24" fill="#94a3b8" fontSize="9" fontWeight="700">₹15L</text>
                      <text x="5" y="64" fill="#94a3b8" fontSize="9" fontWeight="700">₹10L</text>
                      <text x="9" y="104" fill="#94a3b8" fontSize="9" fontWeight="700">₹5L</text>
                      <text x="18" y="144" fill="#94a3b8" fontSize="9" fontWeight="700">₹0</text>

                      <rect x="52" y="85" width="26" height="55" rx="5" fill="#10b981" />
                      <rect x="105" y="55" width="26" height="85" rx="5" fill="#10b981" />
                      <rect x="158" y="70" width="26" height="70" rx="5" fill="#10b981" />
                      <rect x="211" y="65" width="26" height="75" rx="5" fill="#10b981" />
                      <rect x="264" y="38" width="26" height="102" rx="5" fill="#10b981" />
                      <rect x="317" y="30" width="26" height="110" rx="5" fill="#10b981" />

                      <text x="56" y="160" fill="#64748b" fontSize="9" fontWeight="700">Jan</text>
                      <text x="109" y="160" fill="#64748b" fontSize="9" fontWeight="700">Feb</text>
                      <text x="162" y="160" fill="#64748b" fontSize="9" fontWeight="700">Mar</text>
                      <text x="215" y="160" fill="#64748b" fontSize="9" fontWeight="700">Apr</text>
                      <text x="268" y="160" fill="#64748b" fontSize="9" fontWeight="700">May</text>
                      <text x="321" y="160" fill="#64748b" fontSize="9" fontWeight="700">Jun</text>
                    </svg>
                  </div>
                </div>

                {/* 3. Chapter Performance */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-slate-700" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Chapter Performance
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-around py-2">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                        <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="143 238" strokeDashoffset="0" />
                        <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="60 238" strokeDashoffset="-143" />
                        <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="35 238" strokeDashoffset="-203" />
                      </svg>
                      <div className="absolute text-center">
                        <div className="text-xl font-black text-slate-900 leading-none">25</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">Chapters</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span>Top Performing</span></div>
                      <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span>Active</span></div>
                      <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span>Needs Attention</span></div>
                    </div>
                  </div>

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

              {/* LOWER ROW: 3 CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* 1. District-Wise Business Performance */}
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
                    <div className="w-36 h-40 shrink-0 relative flex items-center justify-center bg-slate-50 rounded-2xl p-2 border border-slate-100">
                      <svg viewBox="0 0 100 120" className="w-full h-full">
                        <path d="M 55 10 L 75 18 L 85 30 L 70 38 L 55 25 Z" fill="#10b981" />
                        <path d="M 20 45 L 42 40 L 45 65 L 25 70 L 15 55 Z" fill="#f59e0b" />
                        <path d="M 45 28 L 68 35 L 60 55 L 42 45 Z" fill="#3b82f6" />
                        <path d="M 42 55 L 65 52 L 60 78 L 40 75 Z" fill="#8b5cf6" />
                        <path d="M 28 72 L 58 75 L 55 105 L 35 115 L 25 90 Z" fill="#6366f1" />
                      </svg>
                    </div>

                    <div className="flex-1 space-y-2 text-xs font-bold text-slate-700">
                      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span>Chennai</span></div><span className="font-black text-slate-900">28.5%</span></div>
                      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span>Coimbatore</span></div><span className="font-black text-slate-900">22.3%</span></div>
                      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /><span>Madurai</span></div><span className="font-black text-slate-900">18.7%</span></div>
                      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span>Salem</span></div><span className="font-black text-slate-900">16.1%</span></div>
                      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /><span>Others</span></div><span className="font-black text-slate-900">14.4%</span></div>
                    </div>
                  </div>
                </div>

                {/* 2. Recent Platform Activity */}
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

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="User" className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div><div className="font-bold text-slate-900">New business registered</div><div className="text-[11px] text-slate-500">Ramesh Traders – Chennai</div></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">2 min ago</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="User" className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div><div className="font-bold text-slate-900">New order placed</div><div className="text-[11px] text-emerald-600 font-bold">₹48,500 – City Supplies</div></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">5 min ago</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80" alt="User" className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div><div className="font-bold text-slate-900">New referral</div><div className="text-[11px] text-slate-500">Suresh → Kumar</div></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">8 min ago</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="User" className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div><div className="font-bold text-slate-900">Chapter meeting scheduled</div><div className="text-[11px] text-slate-500">Dharmapuri Chapter</div></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">12 min ago</span>
                    </div>
                  </div>
                </div>

                {/* 3. Pending Admin Tasks */}
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

                  <div className="space-y-2.5 text-xs font-medium text-slate-700">
                    <div onClick={() => setActiveTab('members')} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">👤</span>
                      <span className="flex-grow">Approve 18 new business registrations</span>
                    </div>
                    <div onClick={() => setActiveTab('customer_requirements')} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">📋</span>
                      <span className="flex-grow">Review 7 customer requirements</span>
                    </div>
                    <div onClick={() => setActiveTab('business_listings')} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">🏪</span>
                      <span className="flex-grow">Verify 5 marketplace sellers</span>
                    </div>
                    <div onClick={() => setActiveTab('reviews')} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">⚖️</span>
                      <span className="flex-grow">Resolve 3 disputes</span>
                    </div>
                    <div onClick={() => setActiveTab('chapters')} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">🗳️</span>
                      <span className="flex-grow">Confirm 2 chapter elections</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* VERY BOTTOM ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* 1. System Alerts */}
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
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /><span className="text-slate-700 font-medium">Database backup completed successfully</span></div>
                      <span className="text-[10px] text-slate-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" /><span className="text-slate-700 font-medium">High activity in Chennai chapter</span></div>
                      <span className="text-[10px] text-slate-400">3 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" /><span className="text-slate-700 font-medium">Payment gateway response delay</span></div>
                      <span className="text-[10px] text-slate-400">4 hours ago</span>
                    </div>
                  </div>
                </div>

                {/* 2. Quick Actions */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    Quick Actions
                  </h3>

                  <div className="grid grid-cols-4 gap-2.5">
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="p-3 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center"
                    >
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <span className="text-[10px] font-black leading-tight">Add Member</span>
                    </button>

                    <button
                      onClick={() => setShowAddChapterModal(true)}
                      className="p-3 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center"
                    >
                      <Share2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-[10px] font-black leading-tight">Create Chapter</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('members')}
                      className="p-3 rounded-xl bg-purple-50/80 hover:bg-purple-100/80 text-purple-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center"
                    >
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      <span className="text-[10px] font-black leading-tight">Approve Business</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="p-3 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 text-amber-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center"
                    >
                      <BarChart3 className="w-5 h-5 text-amber-600" />
                      <span className="text-[10px] font-black leading-tight">View Reports</span>
                    </button>
                  </div>
                </div>

                {/* 3. Top Chapters by Business Value */}
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
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] flex items-center justify-center">1</span>
                        <span className="font-bold text-slate-800">Chennai Chapter</span>
                      </div>
                      <span className="font-black text-slate-900">₹12.5L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-black text-[10px] flex items-center justify-center">2</span>
                        <span className="font-bold text-slate-800">Coimbatore Chapter</span>
                      </div>
                      <span className="font-black text-slate-900">₹10.8L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 font-black text-[10px] flex items-center justify-center">3</span>
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
          {/* TAB 2: MEMBERS DIRECTORY & MANAGEMENT                  */}
          {/* ====================================================== */}
          {activeTab === 'members' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Member Directory & Control Console</h2>
                  <p className="text-xs text-slate-500">Manage business seat monopolies, edit member data, assign tiers, or issue disciplinary strikes.</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Member</span>
                  </button>
                </div>
              </div>

              {/* MEMBERS TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Member & Business</th>
                      <th className="px-5 py-3">Category & Taluk</th>
                      <th className="px-5 py-3">Tier</th>
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5">
                          <div className="font-black text-slate-900 text-sm">{u.fullName}</div>
                          <div className="text-[11px] text-amber-700 font-bold">{u.businessName || 'Business Owner'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 font-medium">
                          <div className="font-bold">{u.categoryId || 'General'}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{u.talukId || 'Harur'}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {u.tier || u.accountType || 'Taluk Monopoly'}
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
                        <td className="px-5 py-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                              u.status === 'suspended'
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                          </button>
                          <button
                            onClick={() => setStrikingMember(u)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                            title="Issue Strike"
                          >
                            ⚠️ Strike
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
          {/* TAB 3: CHAPTERS MANAGEMENT                             */}
          {/* ====================================================== */}
          {activeTab === 'chapters' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Chapters & Seat Capacity Management</h2>
                  <p className="text-xs text-slate-500">Monitor chapter health, 30-member monopoly limits, meeting schedules, and leadership.</p>
                </div>
                <button
                  onClick={() => setShowAddChapterModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Chapter</span>
                </button>
              </div>

              {/* ADMIN CHAPTER CAPACITY & GOVERNANCE CONTROL */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-purple-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black">⚙️ சாப்டர் உறுப்பினர் உச்ச வரம்பு & விதிகளின் கட்டுப்பாடு</span>
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        Admin Controlled
                      </span>
                    </div>
                    <p className="text-xs text-purple-200 mt-0.5">
                      அட்மின் முடிவு செய்யும் உறுப்பினர் வரம்பு (Default: 30 பேர்). இந்த வரம்பை எட்டியதும் புதிய வணிகர்கள் சேர முடியாது.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
                  >
                    அமைப்புகளைச் சேமிக்க ➔
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-purple-800/80 text-xs">
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-purple-500/30">
                    <label className="block text-slate-300 font-bold mb-1">ஒரு சாப்டருக்கு உச்ச வரம்பு (Max Members):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={settingsForm.chapterMaxMembers || 30}
                        onChange={(e) => setSettingsForm({ ...settingsForm, chapterMaxMembers: Number(e.target.value) })}
                        className="w-24 p-2 rounded-lg bg-slate-800 text-amber-300 font-black text-base border border-slate-700 text-center"
                      />
                      <span className="text-slate-400 text-xs">உறுப்பினர்கள் (Members)</span>
                    </div>
                    <p className="text-[10px] text-purple-300 mt-1">ஹரூர், சேலம் உள்ளிட்ட அனைத்து சாப்டர்களுக்கும் பொருந்தும்.</p>
                  </div>

                  <div className="bg-slate-950/40 p-3 rounded-xl border border-purple-500/30">
                    <label className="block text-slate-300 font-bold mb-1">சாப்டர் பிரத்யேக குரூப் அரட்டை:</label>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.enableChapterChat !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableChapterChat: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white">30 உறுப்பினர்கள் மட்டும் பேச அனுமதி</span>
                    </label>
                    <p className="text-[10px] text-purple-300 mt-1">சாப்டரில் உள்ள 30 பேர் மட்டுமே இந்த குரூப்பில் அரட்டையடிக்க முடியும்.</p>
                  </div>

                  <div className="bg-slate-950/40 p-3 rounded-xl border border-purple-500/30">
                    <label className="block text-slate-300 font-bold mb-1">மோனோபோலி வணிகப் பிரிவு கட்டுப்பாடு:</label>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.strictCategoryExclusivity !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, strictCategoryExclusivity: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white">1 சாப்டர் = 1 தொழில் பிரிவு மட்டும்</span>
                    </label>
                    <p className="text-[10px] text-purple-300 mt-1">ஒரே தொழிலைச் சேர்ந்த இருவர் ஒரே சாப்டரில் இணைய முடியாது.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {chapters.map((c) => {
                  const chMembers = members.filter((m) => m.chapterId === c.id);
                  const maxCap = settingsForm.chapterMaxMembers || 30;
                  const occ = chMembers.length || c.filledSeats || 6;
                  const pct = Math.min(100, Math.round((occ / maxCap) * 100));
                  return (
                    <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md transition">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-slate-900">{c.nameTa || c.name}</span>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase">
                          {c.talukId || 'REGIONAL'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        <div>📅 {c.meetingDay || 'Thursday 7:00 AM'}</div>
                        <div>👤 Director: <span className="font-bold text-slate-800">{c.directorName || 'சந்துரு (Chandru)'}</span></div>
                      </div>
                      <div className="flex items-baseline justify-between text-xs pt-1">
                        <span className="text-slate-500 font-medium">அங்கீகரிக்கப்பட்ட இடங்கள்:</span>
                        <span className="font-black text-slate-900">{occ} / {maxCap} உறுப்பினர்கள்</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(5, pct)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 4: GEOGRAPHY (TAMIL NADU TALUKS & DISTRICTS)        */}
          {/* ====================================================== */}
          {activeTab === 'geography' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Tamil Nadu Geography & Regional Jurisdiction</h2>
                  <p className="text-xs text-slate-500">Enable or disable taluks, assign district VIP directors, and set regional targets.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Dharmapuri District */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-black text-slate-900">தருமபுரி மாவட்டம் (Dharmapuri District)</h3>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      ACTIVE • 5 TALUKS
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {['ஹரூர் (Harur)', 'பாலக்கோடு (Palacode)', 'தருமபுரி டவுன் (Dharmapuri Town)', 'பென்னாகரம் (Pennagaram)', 'பாப்பிரெட்டிப்பட்டி (Pappireddipatti)'].map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                        <span className="font-bold text-slate-800">{t}</span>
                        <span className="text-[11px] font-black text-emerald-600">✓ Monopoly Active (100 Seats)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salem District */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      <h3 className="font-black text-slate-900">சேலம் மாவட்டம் (Salem District)</h3>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      ACTIVE • 6 TALUKS
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {['சேலம் மேற்கு (Salem West)', 'சேலம் தெற்கு (Salem South)', 'ஓமலூர் (Omalur)', 'மேட்டூர் (Mettur)', 'ஆத்தூர் (Attur)', 'சங்ககிரி (Sankagiri)'].map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                        <span className="font-bold text-slate-800">{t}</span>
                        <span className="text-[11px] font-black text-emerald-600">✓ Monopoly Active (100 Seats)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 5: REFERRALS LEDGER & AUDIT TRAIL                  */}
          {/* ====================================================== */}
          {activeTab === 'referrals' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">B2B Referrals & Business Closed Ledger</h2>
                  <p className="text-xs text-slate-500">Track the life cycle of every business referral: Submitted &rarr; Connected &rarr; Meeting &rarr; Won.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-xs text-blue-700 font-bold uppercase">மொத்த பரிந்துரைகள்</div>
                    <div className="text-2xl font-black text-blue-900 mt-1">486</div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs text-emerald-700 font-bold uppercase">வெற்றி பெற்ற வர்த்தகம் (Won)</div>
                    <div className="text-2xl font-black text-emerald-900 mt-1">₹32,45,000 INR</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="text-xs text-amber-700 font-bold uppercase">சராசரி வர்த்தக மதிப்பு</div>
                    <div className="text-2xl font-black text-amber-900 mt-1">₹66,700 INR</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 6: MEETINGS & ATTENDANCE (AI CONDUCTOR)            */}
          {/* ====================================================== */}
          {activeTab === 'meetings' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">AI Weekly Meeting Conductor & Attendance Timer</h2>
                  <p className="text-xs text-slate-500">Automatic 45-second speaker countdown with 10-second chime alert.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-950 to-indigo-950 rounded-3xl p-8 text-white shadow-xl border border-slate-800 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase">
                  <span>⏱️ 45-SECOND ELEVATOR PITCH CONDUCTOR</span>
                </div>

                <div className="text-7xl font-black font-mono tracking-tight text-amber-400">
                  00:{meetingTimer < 10 ? `0${meetingTimer}` : meetingTimer}
                </div>

                {meetingTimer <= 10 && meetingTimer > 0 && (
                  <div className="text-xs font-black text-rose-400 animate-pulse">
                    ⚠️ 10 வினாடிகள் மட்டுமே உள்ளன! தயவுசெய்து பேச்சை முடிக்கவும்!
                  </div>
                )}

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsMeetingRunning(!isMeetingRunning)}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    {isMeetingRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isMeetingRunning ? 'நிறுத்து (Pause)' : 'தொடங்கு (Start)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMeetingRunning(false);
                      setMeetingTimer(45);
                    }}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm cursor-pointer"
                  >
                    மீட்டமை (Reset 45s)
                  </button>

                  <button
                    onClick={() => {
                      setMeetingTimer(45);
                      setIsMeetingRunning(true);
                      setCurrentSpeakerIndex(prev => prev + 1);
                      flashBanner(`அடுத்த பேச்சாளர் தொடங்குகிறார் (Speaker #${currentSpeakerIndex + 1})`);
                    }}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm cursor-pointer"
                  >
                    அடுத்த பேச்சாளர் ➔
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 7: MEMBERSHIP PLANS CUSTOMIZATION                  */}
          {/* ====================================================== */}
          {activeTab === 'membership_plans' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Membership Plans & Pricing Customization</h2>
                  <p className="text-xs text-slate-500">Configure annual fees across all 4 membership tiers strictly in INR (₹).</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Plan Changes'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Taluk Chapter Plan */}
                <div className="bg-white rounded-2xl p-6 border-2 border-amber-400/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base">Tier 1: தாலுகா சாப்டர் (Taluk Chapter)</span>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">100% MONOPOLY</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">வருடாந்திர கட்டணம் (Annual Fee in INR) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        value={settingsForm.annualFeeTaluk}
                        onChange={(e) => setSettingsForm({ ...settingsForm, annualFeeTaluk: Number(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1.5">
                      ⚡ தற்போது ₹1 INR நேரலை சோதனையில் உள்ளது (Locked for ₹1 live testing).
                    </p>
                  </div>
                </div>

                {/* 2. District VIP Plan */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base">Tier 2: மாவட்ட VIP (District VIP)</span>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-100 text-blue-900">DISTRICT ROAMING</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">வருடாந்திர கட்டணம் (Annual Fee in INR) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        value={settingsForm.annualFeeDistrictVIP}
                        onChange={(e) => setSettingsForm({ ...settingsForm, annualFeeDistrictVIP: Number(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. State Titan Plan */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base">Tier 3: மாநில டைட்டன் (State Titan)</span>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-100 text-purple-900">38 DISTRICTS</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">வருடாந்திர கட்டணம் (Annual Fee in INR) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        value={settingsForm.annualFeeStateTitan}
                        onChange={(e) => setSettingsForm({ ...settingsForm, annualFeeStateTitan: Number(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. National Apex Plan */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base">Tier 4: தேசிய அபெக்ஸ் (National Apex)</span>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-100 text-rose-900">PAN-INDIA</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">வருடாந்திர கட்டணம் (Annual Fee in INR) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        value={settingsForm.annualFeeNationalApex}
                        onChange={(e) => setSettingsForm({ ...settingsForm, annualFeeNationalApex: Number(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 8: PAYMENTS & RAZORPAY CONFIGURATION               */}
          {/* ====================================================== */}
          {activeTab === 'payments' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Razorpay Payment Gateway Customization</h2>
                  <p className="text-xs text-slate-500">Live API keys, official merchant payment link, and demo mode switches.</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Razorpay Config'}</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-slate-700">Official Razorpay Payment Link (100% INR) *</label>
                  <input
                    type="url"
                    value={settingsForm.razorpayPaymentLink}
                    onChange={(e) => setSettingsForm({ ...settingsForm, razorpayPaymentLink: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Default: https://rzp.io/rzp/zZS6aMWL (Chandru Madhesan)</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-700">Razorpay Key ID *</label>
                    <input
                      type="text"
                      value={settingsForm.razorpayKeyId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKeyId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">Razorpay Key Secret *</label>
                    <div className="relative">
                      <input
                        type={showSecret ? 'text' : 'password'}
                        value={settingsForm.razorpayKeySecret}
                        onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKeySecret: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Sandbox Demo Mode</div>
                    <div className="text-[11px] text-slate-500">Allow instant demo simulation without triggering bank charges</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.demoPaymentMode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, demoPaymentMode: e.target.checked })}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 9: INVOICES & GST SETTINGS                         */}
          {/* ====================================================== */}
          {activeTab === 'invoices' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Tax Invoicing & GST Governance</h2>
                  <p className="text-xs text-slate-500">18% GST (9% CGST + 9% SGST), SAC Code 998314, and platform legal credentials.</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Invoicing Settings'}</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-700">Platform GSTIN *</label>
                    <input
                      type="text"
                      value={settingsForm.gstin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, gstin: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs font-black text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">Service SAC Code *</label>
                    <input
                      type="text"
                      value={settingsForm.sacCode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, sacCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs font-black text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">Total GST Rate (%) *</label>
                    <input
                      type="number"
                      value={settingsForm.gstPercentage}
                      onChange={(e) => setSettingsForm({ ...settingsForm, gstPercentage: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs font-black text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 10: MASTER SYSTEM SETTINGS                         */}
          {/* ====================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Master Platform Customizations & Governance</h2>
                  <p className="text-xs text-slate-500">Live customization of platform identity, discipline policies, and timers.</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : '💾 Save All Settings'}</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-slate-700">Platform Brand Name</label>
                  <input
                    type="text"
                    value={settingsForm.platformName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, platformName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-700">தமிழ் முழக்கம் (Tamil Tagline)</label>
                    <input
                      type="text"
                      value={settingsForm.taglineTa}
                      onChange={(e) => setSettingsForm({ ...settingsForm, taglineTa: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">English Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.taglineEn}
                      onChange={(e) => setSettingsForm({ ...settingsForm, taglineEn: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-700">Founder & Director Name</label>
                    <input
                      type="text"
                      value={settingsForm.founderName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, founderName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">Founder WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={settingsForm.founderPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, founderPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* CHAPTER CAPACITY & NETWORKING GOVERNANCE CARD */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">👥 சாப்டர் உறுப்பினர் வரம்பு & விதிகள் (Chapter Governance)</h3>
                    <p className="text-[11px] text-slate-500">அட்மின் முடிவு செய்யும் உறுப்பினர் வரம்பு மற்றும் சாப்டர் அரட்டை விதிகள்.</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                    Admin Authority
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-700">சாப்டர் உச்ச வரம்பு (Max Members) *</label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={settingsForm.chapterMaxMembers || 30}
                      onChange={(e) => setSettingsForm({ ...settingsForm, chapterMaxMembers: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">இயல்புநிலை: 30 வணிகர்கள்</span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={settingsForm.enableChapterChat !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableChapterChat: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800">சாப்டர் குரூப் அரட்டை அனுமதி</span>
                    </label>
                    <span className="text-[10px] text-slate-500 mt-0.5">30 உறுப்பினர்கள் மட்டுமே பேச முடியும்</span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={settingsForm.strictCategoryExclusivity !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, strictCategoryExclusivity: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800">1 தொழில் = 1 உறுப்பினர் (Monopoly)</span>
                    </label>
                    <span className="text-[10px] text-slate-500 mt-0.5">சாப்டரில் மோனோபோலி கட்டுப்பாடு</span>
                  </div>
                </div>
              </div>

              {/* HOSTINGER REMOTE MYSQL INTEGRATION CARD */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs font-semibold">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                      🗄️
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Hostinger Remote MySQL நேரடி தரவுத்தள இணைப்பு</h3>
                      <p className="text-[11px] text-slate-500">
                        டொமைன் இல்லாவிட்டாலும், வணிகர்கள் பதிவு செய்யும் அனைத்து விவரங்களும் Hostinger MySQL-ல் நேரடியாக சேமிக்கப்படும்.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        checked={hostingerConfig.enabled}
                        onChange={(e) => setHostingerConfig({ ...hostingerConfig, enabled: e.target.checked })}
                        className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700">Remote Sync இயக்கு</span>
                    </label>
                  </div>
                </div>

                {hostingerStatus && (
                  <div className={`p-3 rounded-xl text-xs font-bold ${
                    hostingerStatus.includes('✅') 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {hostingerStatus}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-700">Hostinger DB Host (IP அல்லது Server Address) *</label>
                    <input
                      type="text"
                      placeholder="எ.கா: sql300.main-hosting.eu அல்லது 185.xxx.xxx.xxx"
                      value={hostingerConfig.host}
                      onChange={(e) => setHostingerConfig({ ...hostingerConfig, host: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">MySQL Port</label>
                    <input
                      type="number"
                      placeholder="3306"
                      value={hostingerConfig.port}
                      onChange={(e) => setHostingerConfig({ ...hostingerConfig, port: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">Database Name *</label>
                    <input
                      type="text"
                      placeholder="எ.கா: u123456789_nbn"
                      value={hostingerConfig.database}
                      onChange={(e) => setHostingerConfig({ ...hostingerConfig, database: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">Database Username *</label>
                    <input
                      type="text"
                      placeholder="எ.கா: u123456789_nbn_user"
                      value={hostingerConfig.user}
                      onChange={(e) => setHostingerConfig({ ...hostingerConfig, user: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block mb-1 text-slate-700">Database Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={hostingerConfig.password}
                      onChange={(e) => setHostingerConfig({ ...hostingerConfig, password: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500">
                    Hostinger cPanel -&gt; Databases -&gt; <strong>Remote MySQL</strong>-ல் உங்கள் IP முகவரியை அனுமதிக்கவும்.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveHostingerConfig}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                    >
                      💾 சேமிக்க
                    </button>

                    <button
                      type="button"
                      onClick={handleTestHostinger}
                      disabled={isTestingHostinger}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                    >
                      {isTestingHostinger ? 'சோதிக்கிறது...' : '🔌 இணைப்பைச் சோதிக்க'}
                    </button>

                    <button
                      type="button"
                      onClick={handleSyncAllHostinger}
                      disabled={isSyncingHostinger}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl shadow-xs transition cursor-pointer"
                    >
                      {isSyncingHostinger ? 'ஒத்திசைக்கிறது...' : '🔄 வணிகர்களை Hostinger-ல் Sync செய்ய'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 11: NOTIFICATIONS BROADCASTER                      */}
          {/* ====================================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Broadcast Notification Center</h2>
                  <p className="text-xs text-slate-500">Dispatch announcements, alerts, and meeting invitations to all members.</p>
                </div>
              </div>

              <form onSubmit={handleSendBroadcast} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-slate-700">பெறுநர் குழு (Target Recipients) *</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="all">அனைத்து உறுப்பினர்கள் (All Members - 1,250)</option>
                    <option value="networking">நெர்வொர்க்கிங் உறுப்பினர்கள் மட்டும் (Active Networking - 856)</option>
                    <option value="marketplace">மார்க்கெட்பிளேஸ் விற்பனையாளர்கள் (Marketplace Sellers - 342)</option>
                    <option value="harur">அரூர் டைட்டன்ஸ் சாப்டர் மட்டும்</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">அறிவிப்பு தலைப்பு (Subject / Title) *</label>
                  <input
                    type="text"
                    required
                    placeholder="எ.கா: அடுத்த வார சாப்டர் மீட்டிங் மற்றும் மெம்பர்ஷிப் அறிவிப்பு"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">முழு செய்தி (Message Content) *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="செய்தியை உள்ளிடவும்..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>அறிவிப்பை உடனே அனுப்புக (Send Broadcast)</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 12: AUDIT LOGS                                     */}
          {/* ====================================================== */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Immutable System Audit Logs</h2>
                  <p className="text-xs text-slate-500">Real-time log of security, payments, seat reservations, and admin actions.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Timestamp</th>
                      <th className="px-5 py-3">Actor / Admin</th>
                      <th className="px-5 py-3">Action</th>
                      <th className="px-5 py-3">Target Table</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {[
                      { time: new Date().toLocaleTimeString(), actor: 'super_admin_chandru', action: 'SETTINGS_PERSISTED', table: 'settings', status: 'SUCCESS' },
                      { time: '10 min ago', actor: 'system_gateway', action: 'PAYMENT_CAPTURED_1_INR', table: 'payments', status: 'SUCCESS' },
                      { time: '25 min ago', actor: 'super_admin_chandru', action: 'CATEGORY_LOCKED_JEWELLERY', table: 'memberships', status: 'SUCCESS' },
                      { time: '40 min ago', actor: 'system_conductor', action: 'MEETING_CONDUCTED_HARUR', table: 'meetings', status: 'SUCCESS' }
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-slate-500">{log.time}</td>
                        <td className="px-5 py-3 font-bold text-slate-800">{log.actor}</td>
                        <td className="px-5 py-3 font-black text-indigo-700">{log.action}</td>
                        <td className="px-5 py-3 text-slate-600">{log.table}</td>
                        <td className="px-5 py-3 text-emerald-600 font-black">{log.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 13: SECURITY & BACKUP                              */}
          {/* ====================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Security, Encryption & Data Backup</h2>
                  <p className="text-xs text-slate-500">1-click full database exports, encryption key hygiene, and admin sessions.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 text-xs font-semibold">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-black text-slate-900 text-sm">Download Full Database Backup</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Export entire state including members, chapters, payments, and audit logs.</div>
                  </div>
                  <button
                    onClick={handleDownloadBackup}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-black text-slate-900 text-sm">JWT Encryption & Session Timeout</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">HS256 HMAC cryptographic token generation (30 days validity).</div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    ENCRYPTION ACTIVE
                  </span>
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
              <button onClick={() => setShowAddChapterModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              flashBanner('புதிய சாப்டர் வெற்றிகரமாக உருவாக்கப்பட்டது!');
              setShowAddChapterModal(false);
            }} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700">சாப்டர் பெயர் (Chapter Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="எ.கா: அரூர் வைப்ரன்ட்ஸ் சாப்டர்"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(false)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl"
                >
                  ரத்து
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl text-white"
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
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              flashBanner('புதிய உறுப்பினர் வெற்றிகரமாக சேர்க்கப்பட்டார்!');
              setShowAddMemberModal(false);
            }} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700">உறுப்பினர் பெயர் *</label>
                <input type="text" required placeholder="முழு பெயர் உள்ளிடவும்" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">தொலைபேசி எண் *</label>
                <input type="tel" required placeholder="10 இலக்க மொபைல் எண்" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">வணிகப் பெயர் *</label>
                <input type="text" required placeholder="நிறுவனத்தின் பெயர்" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddMemberModal(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl">ரத்து</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl text-white">சேர்க்க ➔</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ISSUE STRIKE MODAL                                       */}
      {/* ======================================================== */}
      {strikingMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-rose-600">⚠️ ஒழுங்கு நடவடிக்கை (Issue Strike)</h3>
              <button onClick={() => setStrikingMember(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600">
              உறுப்பினர்: <span className="font-black text-slate-900">{strikingMember.fullName}</span> ({strikingMember.businessName || 'Business'})
            </div>
            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700">காரணம் (Disciplinary Reason) *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="தொடர் விடுப்பு / விதிகளுக்கு முரணான செயல்பாடு..."
                  value={strikeReason}
                  onChange={(e) => setStrikeReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setStrikingMember(null)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl">ரத்து</button>
                <button type="button" onClick={handleIssueStrike} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 font-black rounded-xl text-white">ஸ்ட்ரைக் பதிவு செய்க</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
