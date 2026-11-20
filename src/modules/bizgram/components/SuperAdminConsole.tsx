import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, XCircle, Trash2, Eye, Lock, 
  MapPin, Phone, Mail, Award, Clock, Users, FileText, 
  Sparkles, ExternalLink, RefreshCw, KeyRound, ArrowRight 
} from 'lucide-react';
import type { AppState, BizPost, Member } from '../../../types';
import { ShinegahLogo } from './ShinegahLogo';

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
      <div className="max-w-md mx-auto my-12 bg-[#0e1428] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] select-none font-sans">
        
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto shadow-md border border-blue-500/30">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              Shinegah™ Super Admin
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              போஸ்ட் அப்ரூவல் & வணிகர் தணிக்கை மையம்
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300 font-bold">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-400"
            />
            <div className="text-[10px] text-slate-500 mt-1">
              இயல்புநிலை: <strong>admin</strong> / <strong>nbn@2026</strong>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Login to Admin Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    );
  }

  // 2. AUTHENTICATED SUPER ADMIN CONSOLE
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 select-none font-sans">
      
      {/* TOP ADMIN HEADER */}
      <div className="bg-[#0e1428]/95 backdrop-blur-2xl text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-black">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Shinegah™ Super Admin Console
              </h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              100% Verified B2B • போஸ்ட் அப்ரூவல் & உறுப்பினர் மேலாண்மை
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onExitAdmin}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            வெளியேறு (Back to Feed)
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/30 transition cursor-pointer"
          >
            லாக் அவுட்
          </button>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2 text-xs font-black">
        <button
          onClick={() => setActiveAdminTab('moderation')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'moderation'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>போஸ்ட் தணிக்கை வரிசை (Moderation)</span>
          {pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] flex items-center justify-center font-black">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('members')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'members'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>உறுப்பினர்கள் விபரம் (Members Directory)</span>
        </button>
      </div>

      {/* TAB 1: POST MODERATION QUEUE */}
      {activeAdminTab === 'moderation' && (
        <div className="space-y-4">
          
          {/* Moderation Status Filter Pills */}
          <div className="flex items-center gap-2">
            {[
              { id: 'pending', label: 'அனுமதி கோருபவை (Pending)' },
              { id: 'approved', label: 'அங்கீகரிக்கப்பட்டவை (Approved)' },
              { id: 'rejected', label: 'நிராகரிக்கப்பட்டவை (Rejected)' },
              { id: 'all', label: 'அனைத்தும் (All)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setModerationFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  moderationFilter === f.id
                    ? 'bg-white text-slate-950 font-black'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-[#0e1428] rounded-3xl border border-white/10 text-slate-400 text-sm">
              இந்த பிரிவில் தணிக்கை பதிவுகள் எதுவும் இல்லை.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#0e1428] p-4 rounded-3xl border border-white/10 shadow-md space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={post.avatar}
                      alt={post.businessName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/15"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-white truncate">
                        {post.businessName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {post.ownerName} • {post.taluk} • {post.category}
                      </div>
                    </div>
                    <div>
                      {post.status === 'approved' ? (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          APPROVED
                        </span>
                      ) : post.status === 'rejected' ? (
                        <span className="text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full">
                          REJECTED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {post.caption}
                  </p>

                  {/* Media Preview */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60">
                    {post.type === 'video' ? (
                      <video
                        src={post.mediaUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={post.mediaUrl}
                        alt="Media"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Approve / Reject Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => onApprovePost(post.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onRejectPost(post.id)}
                      className="flex-1 py-2 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: MEMBERS DIRECTORY */}
      {activeAdminTab === 'members' && (
        <div className="bg-[#0e1428] rounded-3xl border border-white/10 p-5 shadow-xl space-y-4">
          <div className="text-sm font-bold text-white">
            பதிவு செய்யப்பட்ட வணிக உறுப்பினர்கள் ({state.members?.length || 1})
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 text-[11px] font-bold uppercase border-b border-white/10">
                <tr>
                  <th className="p-3">வணிகர் & நிறுவனம்</th>
                  <th className="p-3">தாலுகா / மாவட்டம்</th>
                  <th className="p-3">தொழில் பிரிவு</th>
                  <th className="p-3">மொபைல்</th>
                  <th className="p-3">வேலிடிட்டி</th>
                  <th className="p-3">நிலை</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(state.members || []).map((m) => (
                  <tr key={m.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <img
                        src={m.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt="Logo"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span>{m.businessName}</span>
                    </td>
                    <td className="p-3">{m.talukId || 'Chennai'}</td>
                    <td className="p-3">{m.categoryName || 'Technology'}</td>
                    <td className="p-3 font-mono">{m.phone}</td>
                    <td className="p-3 text-emerald-400 font-bold">1 Year (Active)</td>
                    <td className="p-3">
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
