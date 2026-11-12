import React, { useState, useEffect } from 'react';
import type { AppState, Member } from '../../types';
import { 
  Building, Send, Handshake, DollarSign, Share2, Check, RefreshCw, Lock, 
  Edit3, Plus, Trash2, X, Save, MapPin, Phone, Mail, Award, Store 
} from 'lucide-react';

interface BusinessPortalProps {
  state: AppState;
  updateState: (newState: AppState) => void;
  lang: 'ta' | 'en';
  currentMemberId?: string;
}

export const BusinessPortal: React.FC<BusinessPortalProps> = ({ 
  state, 
  updateState, 
  lang,
  currentMemberId 
}) => {
  const isTa = lang === 'ta';
  const members = state.members || [];
  const requirements = state.marketplaceRequirements || [];

  const [selectedMemberId, setSelectedMemberId] = useState(currentMemberId || members[0]?.id || 'mem_001');
  const [copied, setCopied] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState('');

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync when currentMemberId changes (e.g. immediately after registration)
  useEffect(() => {
    if (currentMemberId) {
      setSelectedMemberId(currentMemberId);
    }
  }, [currentMemberId]);

  const activeMember: Member = members.find((m) => m.id === selectedMemberId) || members[0] || {} as Member;
  const isNetworking = activeMember.accountType !== 'marketplace_only';
  const chapterMembers = members.filter((m) => m.chapterId === activeMember.chapterId && m.id !== activeMember.id);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    businessName: activeMember.businessName || '',
    ownerName: activeMember.ownerName || '',
    categoryName: activeMember.categoryName || '',
    phone: activeMember.phone || '',
    email: activeMember.email || '',
    address: activeMember.address || '',
    specialOffer: activeMember.specialOffer || '',
    tagline: activeMember.tagline || '',
    logo: activeMember.logo || '',
    cover: activeMember.cover || ''
  });

  // Keep editForm in sync with selected active member
  useEffect(() => {
    setEditForm({
      businessName: activeMember.businessName || '',
      ownerName: activeMember.ownerName || '',
      categoryName: activeMember.categoryName || '',
      phone: activeMember.phone || '',
      email: activeMember.email || '',
      address: activeMember.address || '',
      specialOffer: activeMember.specialOffer || '',
      tagline: activeMember.tagline || '',
      logo: activeMember.logo || '',
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

    alert(`உங்கள் கொட்டேஷன் (₹${bidPrice} + 18% GST) வாடிக்கையாளருக்கு அனுப்பப்பட்டது!`);
    setShowBidModal(null);
    setBidPrice('');
  };

  // Save Profile Updates
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
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      
      {/* MEMBER SWITCHER & PROFILE BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
        
        {/* Switch Member Dropdown & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-2">
            <span>👤 வணிகர் கணக்கு (Active Profile):</span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="bg-slate-900 text-amber-300 font-black rounded-xl px-3 py-1.5 border border-slate-700 text-xs focus:outline-none cursor-pointer"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.businessName} ({m.ownerName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isTa ? '✏️ சுயவிவரம் திருத்துக' : 'Edit Profile'}</span>
            </button>

            {/* Share Link Button */}
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'காப்பி செய்யப்பட்டது!' : 'பகிர் (Share Link)'}</span>
            </button>
          </div>
        </div>

        {/* Member Details */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img
            src={activeMember.logo || activeMember.cover || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
            alt={activeMember.businessName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-lg shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-white">{activeMember.businessName}</h2>
              <span className="bg-emerald-950/80 text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                ✓ VERIFIED B2B
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase">
                {isNetworking ? 'Option A: Networking' : 'Option B: Marketplace Only'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              உரிமையாளர்: <strong>{activeMember.ownerName}</strong> • {activeMember.categoryName || activeMember.categoryId}
            </p>
            <p className="text-xs text-amber-400 font-bold">
              📍 {(activeMember.talukId || 'harur').toUpperCase()} சாப்டர் • 📞 {activeMember.phone} {activeMember.address ? `• 🏢 ${activeMember.address}` : ''}
            </p>
          </div>
        </div>

      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">பெற்ற பரிந்துரைகள்</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{activeMember.referralsReceived || 0}</div>
            <div className="text-xs text-emerald-600 font-bold mt-1">✓ நேரடி வாடிக்கையாளர் லீட்ஸ்</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
            📥
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">வழங்கிய பரிந்துரைகள்</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{activeMember.referralsGiven || 0}</div>
            <div className="text-xs text-brand-600 font-bold mt-1">சக உறுப்பினர்களுக்கு</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
            📤
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">ஈட்டிய வர்த்தக மதிப்பு</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">
              ₹{(activeMember.businessWon || 0).toLocaleString('en-IN')} INR
            </div>
            <div className="text-xs text-slate-500 font-bold mt-1">NBN பரிந்துரைகள் மூலம்</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
            💰
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">ஒழுங்கு நிலை (Strikes)</div>
            <div className="text-3xl font-black text-slate-900 mt-1">0 <span className="text-xs text-slate-400 font-bold">/ 3</span></div>
            <div className="text-xs text-emerald-600 font-bold mt-1">✓ 100% தூய ரெக்கார்டு</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
            🛡️
          </div>
        </div>
      </div>

      {/* NETWORKING SECTION OR UPGRADE PROMPT */}
      {isNetworking ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">🏛️ உங்கள் சாப்டர் உறுப்பினர்கள் ({chapterMembers.length})</h3>
              <p className="text-xs text-slate-500">1-to-1 சந்திப்பு மற்றும் நேரடி பரிந்துரைகள் வழங்கலாம்.</p>
            </div>
            <button
              onClick={() => setShowReferralModal(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              + பரிந்துரை வழங்க (Pass Referral)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapterMembers.map((cm) => (
              <div key={cm.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={cm.logo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'} alt={cm.businessName} className="w-10 h-10 rounded-xl object-cover border" />
                  <div>
                    <h4 className="font-black text-xs text-slate-900">{cm.businessName}</h4>
                    <p className="text-[11px] text-amber-700 font-bold">{cm.categoryName || cm.categoryId}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">உரிமையாளர்: <strong>{cm.ownerName}</strong></p>
                <div className="border-t pt-2 flex items-center justify-between text-xs font-bold text-amber-700">
                  <button onClick={() => alert('1-to-1 சந்திப்பு கோரிக்கை அனுப்பப்பட்டது!')} className="hover:underline cursor-pointer">
                    🤝 1-to-1 சந்திக்க
                  </button>
                  <a href={`tel:${cm.phone}`} className="text-slate-500 hover:text-slate-900">
                    📞 அழைக்க
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-center space-y-2">
          <span className="text-xs font-black text-amber-800 uppercase tracking-wider">OPTION B: MARKETPLACE SELLER MODE</span>
          <h3 className="text-base font-black text-slate-900">சாப்டர் உறுப்பினர் பதவிக்கு மேம்படுத்த விரும்புகிறீர்களா?</h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            தாலுகா அளவிலான 100% பிரத்யேக ஏகபோக சீட், வாராந்திர நேரடி கூட்டங்கள் மற்றும் வாடிக்கையாளர் பரிந்துரைகளை பெற Option A-க்கு மேம்படுத்தவும்.
          </p>
        </div>
      )}

      {/* MARKETPLACE REQUIREMENTS / LIVE BUYER BIDS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">📦 நேரடி வாடிக்கையாளர் தேவைகள் ({requirements.length})</h3>
            <p className="text-xs text-slate-500">உடனடியாக உங்கள் கொட்டேஷன்களை சமர்ப்பித்து ஆர்டர்களைப் பெறுங்கள்.</p>
          </div>
        </div>

        <div className="space-y-3">
          {requirements.map((req) => (
            <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {req.category}
                </span>
                <h4 className="font-black text-sm text-slate-900">{req.title}</h4>
                <p className="text-xs text-slate-600">{req.description}</p>
                <div className="text-xs font-bold text-slate-500 pt-1">
                  மதிப்பீடு: <span className="text-slate-900">₹{(req.budget || 50000).toLocaleString('en-IN')} INR</span> • இடம்: {req.talukId || 'தருமபுரி'}
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => setShowBidModal(req.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  கொட்டேஷன் அனுப்ப ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* EDIT PROFILE MODAL (ஆப்டர் பே பண்ணதுக்கு அப்புறம் எடிட்)   */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">✏️ சுயவிவர விவரங்களைத் திருத்துக (Edit Profile)</h3>
                <p className="text-xs text-slate-500">வணிக முகவரி, தயாரிப்பு விவரங்கள் மற்றும் தொடர்பு எண்களை மாற்றலாம்.</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
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
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">உரிமையாளர் பெயர் (Owner Name)</label>
                  <input
                    type="text"
                    value={editForm.ownerName}
                    onChange={e => setEditForm({ ...editForm, ownerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">மொபைல் எண் (Mobile Phone)</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">மின்னஞ்சல் (Email)</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-slate-700">வணிக முகவரி (Business Address)</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="கதவு எண், தெரு, ஊர்"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-slate-700">சிறப்புச் சலுகை / Tagline</label>
                  <input
                    type="text"
                    value={editForm.specialOffer}
                    onChange={e => setEditForm({ ...editForm, specialOffer: e.target.value })}
                    placeholder="எ.கா. 100% தர உத்தரவாதம் மற்றும் இலவச டெலிவரி!"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  ரத்து
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>விவரங்களைச் சேமிக்க ➔</span>
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
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl"
                >
                  ரத்து
                </button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-black rounded-xl">
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
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl"
                >
                  ரத்து
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-400 font-black rounded-xl text-slate-950">
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