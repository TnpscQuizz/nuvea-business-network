import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, XCircle, Trash2, Eye, Lock, 
  MapPin, Phone, Mail, Award, Clock, Users, FileText, 
  Sparkles, ExternalLink, RefreshCw, KeyRound, ArrowRight 
} from 'lucide-react';
import type { AppState, BizPost, Member } from '../../../types';

interface SuperAdminConsoleProps {
  posts: BizPost[];
  state: AppState;
  onApprovePost: (postId: string) => void;
  onRejectPost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onExitAdmin: () => void;
}

export const SuperAdminConsole: React.FC<SuperAdminConsoleProps> = ({
  posts,
  state,
  onApprovePost,
  onRejectPost,
  onDeletePost,
  onExitAdmin,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nbn_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Active Tab
  const [activeAdminTab, setActiveAdminTab] = useState<'moderation' | 'members' | 'settings'>('moderation');
  const [moderationFilter, setModerationFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'nbn@2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nbn_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('தவறான பயனர் பெயர் அல்லது கடவுச்சொல்! (Use: admin / nbn@2026)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nbn_admin_auth');
  };

  // Filter posts for moderation
  const filteredPosts = posts.filter((p) => {
    if (moderationFilter === 'all') return true;
    if (moderationFilter === 'pending') return p.status === 'pending';
    if (moderationFilter === 'approved') return p.status === 'approved' || !p.status;
    if (moderationFilter === 'rejected') return p.status === 'rejected';
    return true;
  });

  const pendingCount = posts.filter((p) => p.status === 'pending').length;

  // 1. ADMIN LOGIN WALL IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl select-none">
        
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              NBN சூப்பர் அட்மின் லாகின்
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              பதிவுகள் அப்ரூவல் மற்றும் வணிகர் தரவு மேலாண்மை
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              பயனர் பெயர் (Username)
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              கடவுச்சொல் (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-400"
            />
            <div className="text-[10px] text-slate-400 mt-1">
              இயல்புநிலை: <strong>admin</strong> / <strong>nbn@2026</strong>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0a1128] hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>அட்மின் கன்சோலுக்குள் நுழைக</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    );
  }

  // 2. AUTHENTICATED SUPER ADMIN CONSOLE
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 select-none font-sans">
      
      {/* TOP ADMIN HEADER */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                சூப்பர் அட்மின் கண்ட்ரோல் மையம் (Super Admin)
              </h2>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                MASTER SECURE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              போஸ்ட் அப்ரூவல், வணிகர் பதிவுகள் & 1-Year வேலிடிட்டி மேலாண்மை
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            வெளியேறு (Logout)
          </button>
          <button
            onClick={onExitAdmin}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer"
          >
            முகப்பிற்குச் செல்க ➔
          </button>
        </div>
      </div>

      {/* ADMIN TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none text-xs font-bold">
        
        <button
          onClick={() => setActiveAdminTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition cursor-pointer ${
            activeAdminTab === 'moderation'
              ? 'bg-[#0a1128] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4 text-amber-400" />
          <span>போஸ்ட் அப்ரூவல் வரிசை</span>
          {pendingCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition cursor-pointer ${
            activeAdminTab === 'members'
              ? 'bg-[#0a1128] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>வணிகர் முழு விவரங்கள் ({state.members?.length || 0})</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* TAB 1: POST MODERATION & APPROVAL QUEUE                                   */}
      {/* ========================================================================= */}
      {activeAdminTab === 'moderation' && (
        <div className="space-y-4">
          
          {/* Filter Sub-pills */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">நிலை வடிகட்டி:</span>
              <button
                onClick={() => setModerationFilter('pending')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  moderationFilter === 'pending'
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                நிலுவையில் உள்ளவை ({pendingCount})
              </button>

              <button
                onClick={() => setModerationFilter('approved')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  moderationFilter === 'approved'
                    ? 'bg-emerald-600 text-white font-black'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                அங்கீகரிக்கப்பட்டவை
              </button>

              <button
                onClick={() => setModerationFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  moderationFilter === 'all'
                    ? 'bg-slate-950 text-white font-black'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                அனைத்தும் ({posts.length})
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-semibold">
              நீங்கள் அங்கீகரிக்கும் வீடியோக்கள் மட்டுமே ரீல்ஸ் & எக்ஸ்ப்ளோரில் தோன்றும்.
            </div>
          </div>

          {/* Posts Cards Grid */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500 font-bold border border-slate-200">
              இந்த நிலையில் பதிவுகள் எதுவும் இல்லை.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-4 flex gap-4">
                    {/* Media Preview Box */}
                    <div className="w-28 h-36 bg-slate-950 rounded-2xl overflow-hidden shrink-0 relative">
                      {post.type === 'video' ? (
                        <video
                          src={post.mediaUrl}
                          poster={post.thumbnailUrl}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={post.mediaUrl}
                          alt="Post"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-1 left-1 bg-slate-900/80 text-[9px] text-amber-400 font-bold px-1.5 py-0.2 rounded">
                        {post.type === 'video' ? 'VIDEO' : 'IMAGE'}
                      </div>
                    </div>

                    {/* Post Content Details */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900 truncate">
                          {post.businessName}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          post.status === 'pending'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : post.status === 'approved' || !post.status
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          {post.status === 'pending' ? '⏳ PENDING' : post.status === 'approved' || !post.status ? '✅ LIVE' : '❌ REJECTED'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        {post.ownerName} • <span className="font-semibold text-slate-700">{post.taluk}</span>
                      </div>

                      <div className="text-[11px] font-bold text-purple-700 bg-purple-50 inline-block px-2 py-0.5 rounded-md border border-purple-200">
                        {post.category}
                      </div>

                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>

                      {post.priceTag && (
                        <div className="text-xs font-black text-amber-600">
                          விலை: {post.priceTag}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Super Admin Action Controls */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">ID: {post.id}</span>
                    
                    <div className="flex items-center gap-2">
                      {post.status !== 'approved' && (
                        <button
                          onClick={() => onApprovePost(post.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>அப்ரூவ் செய் (Approve)</span>
                        </button>
                      )}

                      {post.status !== 'rejected' && (
                        <button
                          onClick={() => onRejectPost(post.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-rose-200 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>நிராகரி</span>
                        </button>
                      )}

                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REGISTERED MEMBERS FULL DIRECTORY                                  */}
      {/* ========================================================================= */}
      {activeAdminTab === 'members' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900">
              பதிவு செய்த வணிகர்கள் விபரம் (Registered Business Directory)
            </h3>
            <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-2.5 py-0.5 rounded-full border border-emerald-300">
              ₹1 செலுத்திய வணிகர்கள்: {state.members?.length || 0}
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">வணிகம் & உரிமையாளர்</th>
                    <th className="p-3.5">தாலுகா & சாப்டர்</th>
                    <th className="p-3.5">பிரிவு (Category Monopoly)</th>
                    <th className="p-3.5">தொடர்பு எண்</th>
                    <th className="p-3.5">1-Year வேலிடிட்டி</th>
                    <th className="p-3.5">மேப் லொகேஷன்</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {state.members?.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <img
                            src={m.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-amber-400 shrink-0"
                          />
                          <div>
                            <div>{m.businessName}</div>
                            <div className="text-[11px] text-slate-500 font-normal">{m.ownerName}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-700">
                        <div className="font-semibold">{m.talukId || 'சேலம்'}</div>
                        <div className="text-[10px] text-slate-500">{m.chapterId || 'Executive Forum'}</div>
                      </td>

                      <td className="p-3.5 font-bold text-purple-700">
                        <span className="bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                          {m.categoryName || m.categoryId || 'Textiles'}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-800">
                        <a href={`tel:${m.phone}`} className="text-blue-600 hover:underline">
                          {m.phone}
                        </a>
                      </td>

                      <td className="p-3.5">
                        <span className="bg-emerald-50 text-emerald-800 font-black px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                          1 YEAR ACTIVE (₹1 Paid)
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-600">
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span className="truncate max-w-[120px]">{m.locationTag || m.address || 'Salem'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
