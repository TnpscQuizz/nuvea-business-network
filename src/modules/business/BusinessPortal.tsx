import React, { useState, useEffect } from 'react';
import type { AppState, Member } from '../../types';
import { 
  Building, Send, Handshake, DollarSign, Share2, Check, RefreshCw, Lock, 
  Edit3, Plus, Trash2, X, Save, MapPin, Phone, Mail, Award, Store, Users,
  FileCheck, ShieldCheck, Calendar, ArrowRight, UserCheck, MessageSquare,
  Sparkles, CheckCircle2, ChevronDown
} from 'lucide-react';

interface BusinessPortalProps {
  state: AppState;
  updateState: (newState: AppState) => void;
  lang: 'ta' | 'en';
  currentMemberId?: string;
  onExitPortal?: (portal?: 'gateway' | 'business' | 'user' | 'admin') => void;
  onOpenRenewModal?: () => void;
}

export const BusinessPortal: React.FC<BusinessPortalProps> = ({ 
  state, 
  updateState, 
  lang,
  currentMemberId,
  onExitPortal,
  onOpenRenewModal
}) => {
  const isTa = lang === 'ta';
  const members = state.members || [];
  const requirements = state.marketplaceRequirements || [];

  // Default to Chandru's Nuvea Studio (biz_001 / mem_002 / mem_001) matching mockup
  const defaultMember = members.find(m => m.businessName.includes('நுவேவா') || m.ownerName.includes('சந்திரா')) || members[0] || {} as Member;
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentMemberId || defaultMember.id || 'biz_001');
  const [copied, setCopied] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState<'members' | 'chat' | 'meetings' | 'referrals' | 'opportunities'>('members');
  
  // Chapter Chat States
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newChatText, setNewChatText] = useState('');
  const [chatTag, setChatTag] = useState<'general' | 'opportunity' | 'referral' | 'meeting' | 'announcement'>('general');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatFilter, setChatFilter] = useState<string>('all');

  // Modals
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState<any>(null);
  const [showBidModal, setShowBidModal] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 1-Year Membership Countdown Timer
  const [expiryTimestamp, setExpiryTimestamp] = useState<number>(() => {
    const key = `nbn_expiry_${selectedMemberId}`;
    const stored = localStorage.getItem(key);
    if (stored) return Number(stored);

    const activeM = members.find(m => m.id === selectedMemberId);
    if (activeM?.membershipExpiryDate) {
      return new Date(activeM.membershipExpiryDate).getTime();
    }
    const defaultExpiry = Date.now() + 365 * 24 * 60 * 60 * 1000;
    localStorage.setItem(key, defaultExpiry.toString());
    return defaultExpiry;
  });

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isExpired: boolean;
  }>({ days: 364, hours: 23, minutes: 59, seconds: 59, totalSeconds: 31536000, isExpired: false });

  const [isSimulatingExpiry, setIsSimulatingExpiry] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  // Sync expiry timestamp when selected member changes
  useEffect(() => {
    const key = `nbn_expiry_${selectedMemberId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setExpiryTimestamp(Number(stored));
    } else {
      const activeM = members.find(m => m.id === selectedMemberId);
      if (activeM?.membershipExpiryDate) {
        setExpiryTimestamp(new Date(activeM.membershipExpiryDate).getTime());
      } else {
        const fullYear = Date.now() + 365 * 24 * 60 * 60 * 1000;
        setExpiryTimestamp(fullYear);
        localStorage.setItem(key, fullYear.toString());
      }
    }
    setShowExpiredModal(false);
  }, [selectedMemberId, members]);

  // Live 1-Second Interval
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diffMs = expiryTimestamp - now;

      if (diffMs <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true });
        setShowExpiredModal(true);
      } else {
        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          totalSeconds,
          isExpired: false
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTimestamp]);

  // Auto-Redirect back to Gateway on Expiry after 4 seconds
  useEffect(() => {
    if (showExpiredModal) {
      const autoRedirect = setTimeout(() => {
        handleAutoExit();
      }, 5000);
      return () => clearTimeout(autoRedirect);
    }
  }, [showExpiredModal]);

  const handleAutoExit = () => {
    setShowExpiredModal(false);
    localStorage.removeItem(`nbn_expiry_${selectedMemberId}`);
    if (onExitPortal) {
      onExitPortal('gateway');
    }
  };

  const handleTest10Sec = () => {
    const testTime = Date.now() + 10 * 1000;
    setExpiryTimestamp(testTime);
    setIsSimulatingExpiry(true);
    setShowExpiredModal(false);
  };

  const handleResetOneYear = () => {
    const fullYear = Date.now() + 365 * 24 * 60 * 60 * 1000;
    setExpiryTimestamp(fullYear);
    localStorage.setItem(`nbn_expiry_${selectedMemberId}`, fullYear.toString());
    setIsSimulatingExpiry(false);
    setShowExpiredModal(false);
  };

  // Sync when currentMemberId changes
  useEffect(() => {
    if (currentMemberId) {
      setSelectedMemberId(currentMemberId);
    }
  }, [currentMemberId]);

  const activeMember: Member = members.find((m) => m.id === selectedMemberId) || defaultMember || {} as Member;
  const isNetworking = activeMember.accountType !== 'marketplace_only';
  
  // Chapter Capacity (Admin configurable: default 30 members max)
  const chapterCapacity = (state as any)?.settings?.chapterMaxMembers || 30;

  // Chapter members list: includes all members registered in this chapter up to 30 capacity
  const chapterMembers = members
    .filter((m) => (m.chapterId === activeMember.chapterId || m.talukId === activeMember.talukId || m.talukId === 'harur') && m.id !== activeMember.id)
    .slice(0, chapterCapacity - 1);

  const activeChapterId = activeMember.chapterId || `${activeMember.talukId || 'harur'}_titans`;

  // Fetch chapter chat messages
  useEffect(() => {
    fetch(`/api/member/chapter-chat/${activeChapterId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setChatMessages(data);
      })
      .catch(err => console.error('Error fetching chat:', err));
  }, [activeChapterId]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    setChatLoading(true);
    try {
      const res = await fetch(`/api/member/chapter-chat/${activeChapterId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: activeMember.id,
          senderName: activeMember.ownerName,
          businessName: activeMember.businessName,
          category: activeMember.categoryName || activeMember.categoryId,
          message: newChatText.trim(),
          tag: chatTag
        })
      });
      const data = await res.json();
      if (data.message) {
        setChatMessages(prev => [...prev, data.message]);
        setNewChatText('');
      }
    } catch (err) {
      console.error('Failed to send chat message:', err);
    } finally {
      setChatLoading(false);
    }
  };

  // Edit Form State
  const [editForm, setEditForm] = useState({
    businessName: activeMember.businessName || 'நுவேவா ஸ்டுடியோ (Nuvea Studio)',
    ownerName: activeMember.ownerName || 'சந்திரா (Chandru)',
    categoryName: activeMember.categoryName || 'digital_marketing',
    phone: activeMember.phone || '917548820641',
    email: activeMember.email || 'chandru@nuveastudio.com',
    address: activeMember.address || 'மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம்',
    locationTag: (activeMember as any).locationTag || '',
    mapAddress: (activeMember as any).mapAddress || activeMember.address || 'மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம்',
    mapEmbedUrl: (activeMember as any).mapEmbedUrl || '',
    specialOffer: activeMember.specialOffer || '4K வணிக விளம்பரம் & மெட்டா ஆட்ஸ் வளர்ச்சி தொகுப்பு',
    tagline: activeMember.tagline || '4K சினிமாடிக் விளம்பரங்கள் மூலம் பிராண்ட் வளர்ச்சி',
    logo: activeMember.logo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    cover: activeMember.cover || ''
  });

  // Keep editForm in sync with selected active member
  useEffect(() => {
    setEditForm({
      businessName: activeMember.businessName || 'நுவேவா ஸ்டுடியோ (Nuvea Studio)',
      ownerName: activeMember.ownerName || 'சந்திரா (Chandru)',
      categoryName: activeMember.categoryName || 'digital_marketing',
      phone: activeMember.phone || '917548820641',
      email: activeMember.email || 'chandru@nuveastudio.com',
      address: activeMember.address || 'மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம்',
      locationTag: (activeMember as any).locationTag || '',
      mapAddress: (activeMember as any).mapAddress || activeMember.address || 'மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம்',
      mapEmbedUrl: (activeMember as any).mapEmbedUrl || '',
      specialOffer: activeMember.specialOffer || '',
      tagline: activeMember.tagline || '',
      logo: activeMember.logo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      cover: activeMember.cover || ''
    });
  }, [selectedMemberId, activeMember]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#/biz/${activeMember.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showBidModal || !bidPrice) return;

    alert(`உங்கள் கொட்டேஷன் (₹${Number(bidPrice).toLocaleString('en-IN')} + 18% GST) வாடிக்கையாளருக்கு சமர்ப்பிக்கப்பட்டது!`);
    setShowBidModal(null);
    setBidPrice('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMembers = members.map(m => {
      if (m.id === activeMember.id) {
        return {
          ...m,
          businessName: editForm.businessName,
          ownerName: editForm.ownerName,
          categoryName: editForm.categoryName,
          phone: editForm.phone,
          email: editForm.email,
          address: editForm.address,
          locationTag: editForm.locationTag,
          specialOffer: editForm.specialOffer,
          tagline: editForm.tagline,
          logo: editForm.logo,
          cover: editForm.cover
        };
      }
      return m;
    });

    updateState({
      ...state,
      members: updatedMembers
    });

    setIsEditModalOpen(false);
    alert('உங்கள் வணிக விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன! (Profile updated successfully)');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-3 font-sans">
      
      {/* ======================================================== */}
      {/* 0. LIVE 1-YEAR MEMBERSHIP VALIDITY COUNTDOWN TIMER BAR   */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400/80 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left Info: Status, Plan, Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>உறுப்பினர் நிலை: ஆக்டிவ் (1 Year Active)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase">
                திட்டம்: ₹1 தொடக்கச் சலுகை (₹1 Launch Plan)
              </span>
              {isSimulatingExpiry && (
                <span className="px-2.5 py-1 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/50 text-[11px] font-black animate-pulse">
                  ⚡ 10-வினாடி சோதனை முறையில் இயங்குகிறது
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>⏳ உறுப்பினர் செல்லுபடியாகும் காலக்கோடு (1-Year Validity Timer)</span>
            </h3>

            <p className="text-xs text-slate-300 font-medium">
              செல்லுபடியாகும் காலம்: <strong>1 முழு வருடம் (365 நாட்கள்)</strong> • காலக்கெடு முடிந்ததும் கணக்கு தானாக காலாவதியாகி முகப்புப் பக்கத்திற்குத் திரும்பும்.
            </p>
          </div>

          {/* Center/Right: Prominent Live Digital Countdown Blocks */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid grid-cols-4 gap-2 text-center">
              
              {/* Days Block */}
              <div className="bg-[#070b16] border border-amber-400/60 rounded-2xl px-3 py-2.5 shadow-inner min-w-[64px]">
                <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 leading-tight">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  நாட்கள் (Days)
                </div>
              </div>

              {/* Hours Block */}
              <div className="bg-[#070b16] border border-slate-700 rounded-2xl px-3 py-2.5 shadow-inner min-w-[64px]">
                <div className="font-mono text-xl sm:text-2xl font-black text-white leading-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  மணி (Hrs)
                </div>
              </div>

              {/* Minutes Block */}
              <div className="bg-[#070b16] border border-slate-700 rounded-2xl px-3 py-2.5 shadow-inner min-w-[64px]">
                <div className="font-mono text-xl sm:text-2xl font-black text-white leading-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  நிமி (Mins)
                </div>
              </div>

              {/* Seconds Block (Ticking Live) */}
              <div className="bg-[#070b16] border border-amber-400/80 rounded-2xl px-3 py-2.5 shadow-inner min-w-[64px]">
                <div className="font-mono text-xl sm:text-2xl font-black text-amber-400 leading-tight animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  விநாடி (Sec)
                </div>
              </div>

            </div>

            {/* Test Simulation Controls */}
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleTest10Sec}
                title="1 வருடம் முடிந்ததும் தானாக வெளியேறும் நிகழ்வை உடனே பரிசோதிக்க"
                className="flex-1 sm:flex-none px-3 py-2 bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>🧪 10 விநாடி டெஸ்ட்</span>
              </button>
              <button
                type="button"
                onClick={handleResetOneYear}
                className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer whitespace-nowrap"
              >
                <span>🔄 1 வருடம் ரீசெட்</span>
              </button>
            </div>

          </div>

        </div>

        {/* Progress Bar for 1-Year Duration */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3">
          <div className="flex-grow bg-slate-950/80 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.max(1, Math.min(100, (timeLeft.totalSeconds / (365 * 24 * 3600)) * 100))}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">
            {((timeLeft.totalSeconds / (365 * 24 * 3600)) * 100).toFixed(1)}% மீதம் உள்ளது
          </span>
        </div>

      </div>

      {/* 1-YEAR MEMBERSHIP EXPIRED AUTO-MODAL */}
      {showExpiredModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border-2 border-rose-500 animate-in fade-in zoom-in duration-300">
            
            <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
              ⏰
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-black text-xs uppercase tracking-wider">
                MEMBERSHIP EXPIRED • காலம் முடிந்தது
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                1 வருட உறுப்பினர் காலம் நிறைவடைந்தது!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                உங்கள் <strong>1 வருட (365 நாட்கள்)</strong> NBN வணிகர் அங்கீகாரம் முடிவடைந்தது. கணக்கிலிருந்து தானாக வெளியேறி முகப்பு மற்றும் பதிவுப் பக்கத்திற்குச் செல்கிறது...
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-slate-700 font-bold">
              மறுபடியும் இணைய ₹1 செலுத்தி உடனடியாக உங்கள் 1 வருட புதிய காலக்கட்டத்தை துவங்கலாம்!
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleAutoExit}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-400/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>முகப்புப் பக்கத்திற்குச் செல்லவும் (Go to Gateway) ➔</span>
              </button>

              <button
                type="button"
                onClick={handleResetOneYear}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                சோதனைக்காக மீண்டும் 1 வருடம் நீட்டிக்க (Dev Extend)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. MEMBER SWITCHER & PROFILE BANNER (EXACT DESIGN MATCH) */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-[#0d152c] via-[#101e43] to-[#1c2c5c] text-white rounded-3xl p-6 sm:p-7 border border-slate-700/60 shadow-xl relative overflow-hidden space-y-6">
        
        {/* Subtle Wave Glow in Background */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />

        {/* TOP ROW: ACTIVE PROFILE SELECTOR & BUTTONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 relative z-10">
          
          {/* Active Profile Dropdown Pill */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0">
              <span className="text-xs">👤</span>
            </div>
            <span className="text-xs text-slate-300 font-bold">வணிகர் கணக்கு (Active Profile):</span>
            
            <div className="relative inline-flex items-center">
              <div className="flex items-center gap-2 bg-[#080d1a]/90 text-amber-300 font-black rounded-xl px-3.5 py-1.5 border border-slate-700 text-xs shadow-inner">
                <span>🏢</span>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="bg-transparent text-amber-300 font-black text-xs focus:outline-none cursor-pointer pr-1"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.businessName} ({m.ownerName})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons: Edit Profile & Share Link */}
          <div className="flex items-center gap-2.5">
            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
              <span>{isTa ? 'சுயவிவரம் திருத்துக' : 'Edit Profile'}</span>
            </button>

            {/* Share Link Button */}
            <button
              onClick={handleCopyLink}
              className="px-4 py-1.5 bg-[#e0e7ff] hover:bg-white text-[#312e81] text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#312e81]" />}
              <span>{copied ? 'காப்பி செய்யப்பட்டது!' : 'பகிர் (Share Link)'}</span>
            </button>
          </div>
        </div>

        {/* MAIN ROW: AVATAR, TITLE, BADGES, DETAILS & 3D GROWTH CHART */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={activeMember.logo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
              alt={activeMember.businessName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-indigo-400/30 border border-slate-700 shadow-xl shrink-0"
            />
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeMember.businessName || 'நுவேவா ஸ்டுடியோ (Nuvea Studio)'}
                </h2>
                <span className="bg-[#10b981] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  ✓ VERIFIED B2B
                </span>
                <span className="bg-[#d97706] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                  {isNetworking ? 'OPTION A: NETWORKING' : 'OPTION B: MARKETPLACE'}
                </span>
              </div>
              
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <span>👤</span>
                <span>உரிமையாளர்: <strong className="text-white">{activeMember.ownerName || 'சந்திரா (Chandru)'}</strong></span>
                <span>•</span>
                <span className="text-slate-300 font-semibold">{activeMember.categoryId || activeMember.categoryName || 'digital_marketing'}</span>
              </p>
              
              <div className="text-xs text-amber-300/90 font-bold flex items-center gap-2 flex-wrap pt-0.5">
                <span>📍 {(activeMember.talukId || 'harur').toUpperCase()} சாப்டர்</span>
                {(activeMember as any).locationTag && (
                  <>
                    <span className="text-slate-500">|</span>
                    <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30 text-[11px] flex items-center gap-1">
                      <span>🏷️</span>
                      <span>{(activeMember as any).locationTag}</span>
                    </span>
                  </>
                )}
                <span className="text-slate-500">|</span>
                <span>📞 {activeMember.phone || '917548820641'}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">🏢 {activeMember.address || 'மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம்'}</span>
              </div>
            </div>
          </div>

          {/* 3D Glass Growth Bars Graphic with Pink Upward Arrow */}
          <div className="hidden lg:flex items-center justify-center shrink-0 w-44 h-24 relative select-none">
            <svg viewBox="0 0 160 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="bizBarGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="bizBarGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="bizArrowGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
                <filter id="bizGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.6" />
                </filter>
              </defs>
              
              {/* 4 Frosted Glass Bars */}
              <rect x="75" y="65" width="13" height="25" rx="3" fill="url(#bizBarGrad1)" />
              <rect x="94" y="50" width="13" height="40" rx="3" fill="url(#bizBarGrad1)" />
              <rect x="113" y="35" width="13" height="55" rx="3" fill="url(#bizBarGrad2)" />
              <rect x="132" y="16" width="13" height="74" rx="3" fill="url(#bizBarGrad2)" />
              
              {/* Upward 3D Sweeping Arrow */}
              <path 
                d="M 55 76 Q 85 72 112 48 T 142 14" 
                fill="none" 
                stroke="url(#bizArrowGrad)" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                filter="url(#bizGlow)" 
              />
              <polygon points="142,6 150,19 135,17" fill="#f43f5e" filter="url(#bizGlow)" />
            </svg>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. 4 KPI CARDS (EXACT MATCHING ICONS, LABELS & METRICS)  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. பெற்ற பரிந்துரைகள் (Referrals Received) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-600">பெற்ற பரிந்துரைகள்</div>
            <div className="text-3xl font-black text-slate-900 leading-tight">
              {activeMember.referralsReceived || 0}
            </div>
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>✓</span>
              <span>நேரடி வாடிக்கையாளர் லீட்ஸ்</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* 2. வழங்கிய பரிந்துரைகள் (Referrals Given) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-600">வழங்கிய பரிந்துரைகள்</div>
            <div className="text-3xl font-black text-slate-900 leading-tight">
              {activeMember.referralsGiven || 0}
            </div>
            <div className="text-xs font-bold text-slate-600">
              சக உறுப்பினர்களுக்கு
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        {/* 3. ஈட்டிய வர்த்தக மதிப்பு (Business Value Earned - strictly INR) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-600">ஈட்டிய வர்த்தக மதிப்பு</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 leading-tight">
              ₹{(activeMember.businessWon || 0).toLocaleString('en-IN')} INR
            </div>
            <div className="text-xs font-bold text-slate-500">
              NBN பரிந்துரைகள் மூலம்
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-xl font-black">
            💰
          </div>
        </div>

        {/* 4. ஒழுங்கு நிலை (STRIKES) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-600">ஒழுங்கு நிலை (STRIKES)</div>
            <div className="text-3xl font-black text-slate-900 leading-tight">
              0 <span className="text-sm text-slate-400 font-bold">/ 3</span>
            </div>
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>✓</span>
              <span>100% தரம ரெக்கார்டு</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. CHAPTER SECTION WITH 4 INTERACTIVE ACTION PILLS       */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        
        {/* HEADER: HANDSHAKE ICON + TITLE + PASS REFERRAL BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-slate-900">
                  உங்கள் சாப்டர் உறுப்பினர்கள் ({chapterMembers.length + 1} / {chapterCapacity})
                </h3>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  சாப்டர் வரம்பு: {chapterCapacity} பேர் மட்டுமே
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                1-to-1 சந்திப்பு, நேரடி அழைப்பு, வாட்ஸ்அப் மற்றும் பிரத்யேக சாப்டர் அரட்டை வசதி.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveSectionTab('chat')}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>குரூப் அரட்டை ({chatMessages.length})</span>
            </button>

            <button
              onClick={() => setShowReferralModal(true)}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/25 transition flex items-center gap-2 cursor-pointer"
            >
              <Handshake className="w-4 h-4" />
              <span>+ பரிந்துரை வழங்க</span>
            </button>
          </div>
        </div>

        {/* 5 ACTION / QUICK ACCESS PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          
          {/* Pill 1: மொத்த உறுப்பினர்கள் */}
          <button
            onClick={() => setActiveSectionTab('members')}
            className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeSectionTab === 'members'
                ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-200'
                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black text-slate-900 leading-none">{chapterMembers.length + 1} / {chapterCapacity}</div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">உறுப்பினர்கள்</div>
            </div>
          </button>

          {/* Pill 2: சாப்டர் குரூப் அரட்டை */}
          <button
            onClick={() => setActiveSectionTab('chat')}
            className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeSectionTab === 'chat'
                ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-200'
                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">சாப்டர் அரட்டை</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">30 பேர் குரூப்</div>
            </div>
          </button>

          {/* Pill 3: 1-to-1 சந்திப்புகள் */}
          <button
            onClick={() => setActiveSectionTab('meetings')}
            className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeSectionTab === 'meetings'
                ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-200'
                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">1-to-1 சந்திப்புகள்</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">நேரடி மீட்டிங்</div>
            </div>
          </button>

          {/* Pill 4: பரிந்துரைகள் */}
          <button
            onClick={() => setActiveSectionTab('referrals')}
            className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeSectionTab === 'referrals'
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-200'
                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">பரிந்துரைகள்</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">உறுப்பினர்களுடன்</div>
            </div>
          </button>

          {/* Pill 5: வணிக வாய்ப்புகள் */}
          <button
            onClick={() => setActiveSectionTab('opportunities')}
            className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeSectionTab === 'opportunities'
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-200'
                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">வணிக வாய்ப்புகள்</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">புதிய லீட்ஸ்</div>
            </div>
          </button>

        </div>

        {/* ======================================================== */}
        {/* SECTION CONTENT: SWITCHES BASED ON ACTIVE PILL           */}
        {/* ======================================================== */}
        
        {/* TAB 1: MEMBERS DIRECTORY */}
        {activeSectionTab === 'members' && (
          <div className="pt-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapterMembers.map((cm) => (
                <div key={cm.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:shadow-md transition space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={cm.logo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'} 
                      alt={cm.businessName} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="min-w-0 flex-grow">
                      <h4 className="font-black text-sm text-slate-900 truncate">{cm.businessName}</h4>
                      <p className="text-xs text-indigo-600 font-bold truncate">{cm.categoryName || cm.categoryId}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div>👤 உரிமையாளர்: <strong className="text-slate-800">{cm.ownerName}</strong></div>
                    <div className="text-[11px] text-slate-500 truncate">📍 {cm.address || 'தருமபுரி & சேலம் மண்டலம்'}</div>
                    {cm.specialOffer && <div className="text-[11px] text-amber-700 italic truncate mt-0.5">🎁 {cm.specialOffer}</div>}
                  </div>

                  <div className="border-t border-slate-200/80 pt-3 grid grid-cols-3 gap-2 text-xs font-bold">
                    <a 
                      href={`tel:${cm.phone}`} 
                      className="text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 py-1.5 px-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>📞</span>
                      <span>அழைக்க</span>
                    </a>
                    
                    <a 
                      href={`https://wa.me/91${cm.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`வணக்கம் ${cm.ownerName} அவர்களே, நான் ${activeMember.businessName} உரிமையாளர் ${activeMember.ownerName}. NBN சாப்டர் வழியாக தொடர்பு கொள்கிறேன்.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 py-1.5 px-2 rounded-xl border border-emerald-200 shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </a>

                    <button 
                      onClick={() => setShowMeetingModal(cm)} 
                      className="text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 py-1.5 px-2 rounded-xl border border-purple-200 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>🤝</span>
                      <span>1-to-1</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: IN-CHAPTER 30-MEMBER GROUP CHAT & NETWORKING SPACE */}
        {activeSectionTab === 'chat' && (
          <div className="pt-2 space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">
                    🔒 {(activeMember.talukId || 'ஹரூர்').toUpperCase()} சாப்டர் பிரத்யேக நெட்வொர்க்கிங் அரட்டை
                  </h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                    30 உறுப்பினர்கள் மட்டுமே
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  அங்கீகரிக்கப்பட்ட சாப்டர் உறுப்பினர்கள் மட்டுமே இங்கு அரட்டையடிக்கலாம். புதிய வாடிக்கையாளர் தேவைகள், பரிந்துரைகள் மற்றும் சந்திப்புகளைப் பகிரவும்.
                </p>
              </div>

              {/* Tag filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold shrink-0">
                {['all', 'opportunity', 'referral', 'meeting', 'announcement', 'general'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setChatFilter(tag)}
                    className={`px-2.5 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                      chatFilter === tag
                        ? 'bg-indigo-600 text-white font-black'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag === 'all' && 'அனைத்தும்'}
                    {tag === 'opportunity' && '💡 வாய்ப்புகள்'}
                    {tag === 'referral' && '🤝 பரிந்துரைகள்'}
                    {tag === 'meeting' && '📅 சந்திப்புகள்'}
                    {tag === 'announcement' && '📢 அறிவிப்புகள்'}
                    {tag === 'general' && '💬 பொது'}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="h-96 overflow-y-auto space-y-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
              {chatMessages
                .filter(m => chatFilter === 'all' ? true : m.tag === chatFilter)
                .map((msg) => {
                  const isMe = msg.senderId === activeMember.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-2xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {msg.senderName?.charAt(0) || 'U'}
                      </div>
                      
                      <div className={`p-3.5 rounded-2xl border text-xs space-y-1 shadow-2xs ${
                        isMe 
                          ? 'bg-purple-600 text-white border-purple-500 rounded-tr-none' 
                          : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
                      }`}>
                        <div className="flex items-center justify-between gap-3 text-[11px]">
                          <span className={`font-black ${isMe ? 'text-purple-100' : 'text-slate-900'}`}>
                            {msg.senderName} ({msg.businessName})
                          </span>
                          <span className={`${isMe ? 'text-purple-200' : 'text-slate-400'}`}>
                            {msg.timestamp || 'இப்போது'}
                          </span>
                        </div>

                        {msg.tag && (
                          <div className="pb-0.5">
                            <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${
                              msg.tag === 'opportunity' ? 'bg-amber-100 text-amber-800' :
                              msg.tag === 'referral' ? 'bg-emerald-100 text-emerald-800' :
                              msg.tag === 'meeting' ? 'bg-blue-100 text-blue-800' :
                              msg.tag === 'announcement' ? 'bg-rose-100 text-rose-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {msg.tag === 'opportunity' && '💡 வணிக வாய்ப்பு (Lead)'}
                              {msg.tag === 'referral' && '🤝 பரிந்துரை (Referral)'}
                              {msg.tag === 'meeting' && '📅 1-to-1 சந்திப்பு'}
                              {msg.tag === 'announcement' && '📢 சாப்டர் அறிவிப்பு'}
                              {msg.tag === 'general' && '💬 கலந்துரையாடல்'}
                            </span>
                          </div>
                        )}

                        <p className={`text-xs leading-relaxed ${isMe ? 'text-white' : 'text-slate-700'}`}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              
              {chatMessages.length === 0 && (
                <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs">
                  <div>
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold">இன்னும் செய்திகள் எதுவும் இல்லை.</p>
                    <p className="text-[11px]">முதல் வணிக வாய்ப்பை அல்லது வாழ்த்தைப் பகிருங்கள்!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Composer Form */}
            <form onSubmit={handleSendChatMessage} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">செய்தி வகை:</span>
                <select
                  value={chatTag}
                  onChange={(e: any) => setChatTag(e.target.value)}
                  className="p-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50"
                >
                  <option value="general">💬 பொதுவான கலந்துரையாடல் (General)</option>
                  <option value="opportunity">💡 புதிய வணிக வாய்ப்பு (Lead Opportunity)</option>
                  <option value="referral">🤝 சக உறுப்பினர் பரிந்துரை (Referral)</option>
                  <option value="meeting">📅 1-to-1 சந்திப்பு அழைப்பு (Meeting)</option>
                  <option value="announcement">📢 சாப்டர் அறிவிப்பு (Announcement)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="சாப்டர் நண்பர்களுடன் வணிக வாய்ப்பு அல்லது செய்தியைப் பகிரவும்..."
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  className="flex-grow p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !newChatText.trim()}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>அனுப்புக ➔</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: 1-TO-1 MEETINGS */}
        {activeSectionTab === 'meetings' && (
          <div className="pt-2 space-y-4">
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900">வழக்கமான வாராந்திர 1-to-1 சந்திப்பு நெட்வொர்க்</h4>
                <p className="text-xs text-slate-600 mt-0.5">உங்கள் சாப்டர் உறுப்பினர்களுடன் தனிப்பட்ட முறையில் சந்தித்து வணிக வாய்ப்புகளை உருவாக்குங்கள்.</p>
              </div>
              <button
                onClick={() => setShowMeetingModal(chapterMembers[0])}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                + புதிய சந்திப்பை பதிவு செய்க
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    📅
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">ஸ்ரீ லட்சுமி தங்கம் & வைரம் (ஆர். சுப்ரமணியம்) உடன் சந்திப்பு</div>
                    <div className="text-[11px] text-slate-500">நேரடி சந்திப்பு • ஹரூர் சாப்டர் அலுவலகம் • நாளை காலை 10:30 AM</div>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full">உறுதிப்படுத்தப்பட்டது</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REFERRALS */}
        {activeSectionTab === 'referrals' && (
          <div className="pt-2 space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900">நேரடி வணிகப் பரிந்துரை பரிமாற்றம்</h4>
                <p className="text-xs text-slate-600 mt-0.5">சக உறுப்பினர்களுக்கு புதிய வாடிக்கையாளர் லீட்களை அனுப்பி வர்த்தகத்தை பெருக்குங்கள்.</p>
              </div>
              <button
                onClick={() => setShowReferralModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                + புதிய பரிந்துரை வழங்க
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">ஆக்ஸிஃபிக்ஸ் இன்ஃப்ராமார்ட் - டைல்ஸ் & சானிட்டரி தேவை</div>
                  <div className="text-[11px] text-slate-500">வாடிக்கையாளர்: ரமேஷ் குமார் (9876543210) • மதிப்பு: ₹1,50,000</div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full">பேச்சுவார்த்தையில்</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MARKETPLACE BUYER REQUIREMENTS */}
        {activeSectionTab === 'opportunities' && (
          <div className="pt-2 space-y-4">
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900">நேரடி வாடிக்கையாளர் தேவைகள் & ஆர்டர்கள்</h4>
                <p className="text-xs text-slate-600 mt-0.5">தருமபுரி & சேலம் மண்டல வாடிக்கையாளர்கள் சமர்ப்பித்த தேவைகளுக்கு உடனடியாக கொட்டேஷன் அனுப்புங்கள்.</p>
              </div>
            </div>

            <div className="space-y-3">
              {requirements.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-indigo-100">
                      {req.category}
                    </span>
                    <h4 className="font-black text-sm text-slate-900">{req.title}</h4>
                    <p className="text-xs text-slate-600">{req.description}</p>
                    <div className="text-xs font-bold text-slate-500 pt-1">
                      மதிப்பீடு: <span className="text-slate-900 font-black">₹{(req.budget || 50000).toLocaleString('en-IN')} INR</span> • இடம்: {req.talukId || 'தருமபுரி'}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => setShowBidModal(req.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      கொட்டேஷன் அனுப்ப ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 4. GOOGLE MAPS STORE LOCATION & DIRECTIONS WIDGET        */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                📍 உங்கள் வணிக இருப்பிடம் & கூகுள் மேப் (Store Location & Directions)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {activeMember.address || 'மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம்'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeMember.address || activeMember.businessName + ', ' + activeMember.talukId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Google Maps-ல் பார்க்க ➔</span>
            </a>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>முகவரி மாற்று</span>
            </button>
          </div>
        </div>

        {/* Embedded Interactive Google Map */}
        <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-inner">
          <iframe
            title="Business Location Map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(activeMember.address || activeMember.businessName + ', ' + activeMember.talukId)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* EDIT PROFILE MODAL                                       */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">✏️ சுயவிவர விவரங்களைத் திருத்துக (Edit Profile)</h3>
                <p className="text-xs text-slate-500">வணிக முகவரி, தயாரிப்பு விவரங்கள் மற்றும் தொடர்பு எண்களை மாற்றலாம்.</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700">வணிகப் பெயர் (Business Name)</label>
                  <input
                    type="text"
                    value={editForm.businessName}
                    onChange={e => setEditForm({ ...editForm, businessName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">உரிமையாளர் பெயர் (Owner Name)</label>
                  <input
                    type="text"
                    value={editForm.ownerName}
                    onChange={e => setEditForm({ ...editForm, ownerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">மொபைல் எண் (Mobile Phone)</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">மின்னஞ்சல் (Email)</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-slate-700">வணிக முகவரி (Business Address)</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="கதவு எண், தெரு, ஊர்"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-slate-700">குறிப்பிட்ட அமைவிட லேண்ட்மார்க் டேக் (Location Landmark Tag)</label>
                  <input
                    type="text"
                    value={editForm.locationTag}
                    onChange={e => setEditForm({ ...editForm, locationTag: e.target.value })}
                    placeholder="எ.கா. ஹரூர் பஸ் நிலையம் அருகில், கடைவீதி"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-slate-700">சிறப்புச் சலுகை / Tagline</label>
                  <input
                    type="text"
                    value={editForm.specialOffer}
                    onChange={e => setEditForm({ ...editForm, specialOffer: e.target.value })}
                    placeholder="எ.கா. 100% தர உத்தரவாதம் மற்றும் இலவச டெலிவரி!"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  ரத்து
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>விவரங்களைச் சேமிக்க ➔</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-TO-1 MEETING MODAL */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">
              1-to-1 சந்திப்பு கோரிக்கை: {showMeetingModal.businessName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">உரிமையாளர்: {showMeetingModal.ownerName} ({showMeetingModal.phone})</p>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`🤝 ${showMeetingModal.businessName} உரிமையாளர் ${showMeetingModal.ownerName} அவர்களுக்கு 1-to-1 சந்திப்பு அழைப்பு அனுப்பப்பட்டது!`);
                setShowMeetingModal(null);
              }}
              className="space-y-3 text-xs font-semibold"
            >
              <div>
                <label className="block mb-1">சந்திப்பு தேதி</label>
                <input type="date" required className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block mb-1">சந்திப்பு நேரம்</label>
                <input type="time" required className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block mb-1">சந்திப்பின் நோக்கம் / Agenda</label>
                <textarea rows={2} required placeholder="வணிக ஒத்துழைப்பு மற்றும் தயாரிப்பு அறிமுகம்..." className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(null)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl cursor-pointer"
                >
                  ரத்து
                </button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white font-black rounded-xl cursor-pointer">
                  அழைப்பை அனுப்புக ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BID MODAL */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">கொட்டேஷன் விலைப் புள்ளி சமர்ப்பித்தல்</h3>
            <form onSubmit={handleSubmitBid} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block mb-1">உங்கள் விலைப் புள்ளி (Base Price ₹ INR)</label>
                <input
                  type="number"
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  placeholder="எ.கா: 45000"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                18% GST வரி (9% CGST + 9% SGST) தானாகவே கணக்கிடப்பட்டு வாடிக்கையாளருக்கு சமர்ப்பிக்கப்படும்.
              </p>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBidModal(null)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl cursor-pointer"
                >
                  ரத்து
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-black rounded-xl cursor-pointer">
                  அனுப்புக ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFERRAL MODAL */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">புதிய பிசினஸ் பரிந்துரை வழங்குதல்</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('பரிந்துரை வெற்றிகரமாக வழங்கப்பட்டது!');
                setShowReferralModal(false);
              }}
              className="space-y-3 text-xs font-semibold"
            >
              <div>
                <label className="block mb-1">பரிந்துரை பெறும் உறுப்பினர்</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-300">
                  {chapterMembers.map((cm) => (
                    <option key={cm.id} value={cm.id}>
                      {cm.businessName} - {cm.ownerName} ({cm.categoryName})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">வாடிக்கையாளர் பெயர்</label>
                <input type="text" required placeholder="எ.கா: சுரேஷ் குமார்" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block mb-1">வாடிக்கையாளர் தொலைபேசி</label>
                <input type="tel" required placeholder="9876543210" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block mb-1">தோராய வர்த்தக மதிப்பு (₹ INR)</label>
                <input type="number" required placeholder="50000" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReferralModal(false)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl cursor-pointer"
                >
                  ரத்து
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 font-black rounded-xl text-white cursor-pointer">
                  பரிந்துரையை அனுப்புக ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
