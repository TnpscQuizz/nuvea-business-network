import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, XCircle, Trash2, Eye, Lock, 
  MapPin, Phone, Mail, Award, Clock, Users, FileText, 
  Sparkles, ExternalLink, RefreshCw, KeyRound, ArrowRight,
  Search, Check, AlertCircle, Building2, Tag, ShieldCheck, ChevronRight
} from 'lucide-react';
import type { AppState, BizPost, BizUser } from '../../../types';
import { INITIAL_REGISTERED_USERS } from '../data/bizGramData';

interface SuperAdminConsoleProps {
  posts: BizPost[];
  state: AppState;
  registeredUsers?: BizUser[];
  onApproveUser?: (userId: string) => void;
  onRejectUser?: (userId: string, reason?: string) => void;
  onApprovePost: (postId: string) => void;
  onRejectPost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onExitAdmin: () => void;
}

export const SuperAdminConsole: React.FC<SuperAdminConsoleProps> = ({
  posts,
  state,
  registeredUsers = INITIAL_REGISTERED_USERS,
  onApproveUser,
  onRejectUser,
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

  // Admin Active Tab: 'users' (User Registration Approvals) by default
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'moderation' | 'members' | 'audit'>('users');
  
  // User Approvals Filters
  const [userFilter, setUserFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Post Moderation Filter
  const [moderationFilter, setModerationFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'nbn@2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nbn_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('தவறான பயனர் பெயர் அல்லது கடவுச்சொல்! (Credentials: admin / nbn@2026)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nbn_admin_auth');
  };

  // Filter Users
  const filteredUsers = registeredUsers.filter((u) => {
    const status = u.verificationStatus || 'approved';
    const matchFilter = 
      userFilter === 'all' ? true :
      userFilter === 'pending' ? status === 'pending' :
      userFilter === 'approved' ? status === 'approved' :
      status === 'rejected';

    const matchSearch = userSearchQuery.trim() === '' || 
      u.businessName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.ownerName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.taluk.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.category.toLowerCase().includes(userSearchQuery.toLowerCase());

    return matchFilter && matchSearch;
  });

  const pendingUsersCount = registeredUsers.filter((u) => (u.verificationStatus || 'approved') === 'pending').length;
  const approvedUsersCount = registeredUsers.filter((u) => (u.verificationStatus || 'approved') === 'approved').length;

  // Filter posts for moderation
  const filteredPosts = posts.filter((p) => {
    if (moderationFilter === 'all') return true;
    if (moderationFilter === 'pending') return p.status === 'pending';
    if (moderationFilter === 'approved') return p.status === 'approved' || !p.status;
    if (moderationFilter === 'rejected') return p.status === 'rejected';
    return true;
  });

  const pendingPostsCount = posts.filter((p) => p.status === 'pending').length;

  // 1. ADMIN LOGIN WALL IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen white-glow-canvas flex flex-col items-center justify-center p-4 select-none font-sans relative">
        
        {/* Glow ambient */}
        <div className="fixed top-10 left-1/3 w-[500px] h-[500px] bg-white rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-md w-full apple-glass apple-specular-edge rounded-[36px] p-6 sm:p-8 shadow-2xl border-2 border-white space-y-6 bg-white/90">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-950 text-white flex items-center justify-center mx-auto shadow-xl">
              <Shield className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                PLATFORM GOVERNANCE
              </span>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1.5">
                Shinegah™ Super Admin Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Authorized Governance, User Verification & Trade Audit Console
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Master Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm font-medium"
              />
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Demo Key: <strong>admin</strong> / <strong>nbn@2026</strong></span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-950 hover:bg-black text-white rounded-full text-xs font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Authorize & Enter Admin Portal</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-xs font-bold text-slate-600 hover:text-slate-950 transition cursor-pointer flex items-center gap-1"
            >
              <span>← Back to Shinegah Network</span>
            </button>
          </div>

        </div>

      </div>
    );
  }

  // 2. AUTHENTICATED DEDICATED SUPER ADMIN PORTAL
  return (
    <div className="min-h-screen white-glow-canvas p-4 sm:p-6 lg:p-8 select-none font-sans space-y-6">
      
      {/* TOP ADMIN HEADER BAR */}
      <div className="max-w-7xl mx-auto apple-glass apple-specular-edge rounded-[32px] p-5 sm:p-6 shadow-xl border-2 border-white flex flex-col md:flex-row items-center justify-between gap-4 bg-white/95">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black shadow-md shrink-0">
            <Shield className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Shinegah™ Super Admin Portal
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                MASTER ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Enterprise Governance • Business Profile Verification Gate • Post Moderation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onExitAdmin}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-extrabold rounded-full transition cursor-pointer border border-slate-200 shadow-sm flex items-center gap-1.5"
          >
            <span>Launch Public App</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-full border border-rose-200 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP KPI OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-700" />
              <span>Total Businesses</span>
            </div>
            <div className="text-2xl font-black text-slate-950 font-mono">
              {registeredUsers.length}
            </div>
            <div className="text-[10px] text-slate-500">Registered across 38 districts</div>
          </div>

          <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Verification</span>
            </div>
            <div className="text-2xl font-black text-amber-700 font-mono flex items-center gap-2">
              <span>{pendingUsersCount}</span>
              {pendingUsersCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <div className="text-[10px] text-amber-700 font-medium">Requires Admin Approval</div>
          </div>

          <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Approved & Verified</span>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {approvedUsersCount}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">Full trade & store privileges</div>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-700" />
              <span>Pending Posts / Reels</span>
            </div>
            <div className="text-2xl font-black text-slate-950 font-mono">
              {pendingPostsCount}
            </div>
            <div className="text-[10px] text-slate-500">Awaiting media moderation</div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-black overflow-x-auto">
          {/* Tab 1: User Registration Approvals */}
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2.5 rounded-2xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'users'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:text-slate-950 hover:bg-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>User Registration Approvals</span>
            {pendingUsersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {pendingUsersCount}
              </span>
            )}
          </button>

          {/* Tab 2: Feed Moderation */}
          <button
            onClick={() => setActiveAdminTab('moderation')}
            className={`px-4 py-2.5 rounded-2xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'moderation'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:text-slate-950 hover:bg-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Post & Reel Moderation</span>
            {pendingPostsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {pendingPostsCount}
              </span>
            )}
          </button>

          {/* Tab 3: Verified Directory */}
          <button
            onClick={() => setActiveAdminTab('members')}
            className={`px-4 py-2.5 rounded-2xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'members'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:text-slate-950 hover:bg-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Verified Members Directory</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: USER REGISTRATION APPROVAL QUEUE (CORE USER REQUIREMENT!)          */}
        {/* ========================================================================= */}
        {activeAdminTab === 'users' && (
          <div className="space-y-4">
            
            {/* Filter Pills & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'pending', label: `Pending Verification (${pendingUsersCount})` },
                  { id: 'approved', label: `Approved (${approvedUsersCount})` },
                  { id: 'rejected', label: 'Rejected' },
                  { id: 'all', label: `All Businesses (${registeredUsers.length})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setUserFilter(f.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      userFilter === f.id
                        ? 'bg-slate-950 text-white font-black shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search business, owner, city..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            {/* User Cards Grid */}
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center apple-glass rounded-3xl border border-white text-slate-500 text-sm shadow-sm">
                No business profiles match this verification status.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredUsers.map((user) => {
                  const status = user.verificationStatus || 'approved';

                  return (
                    <div
                      key={user.id}
                      className="apple-glass apple-specular-edge p-5 rounded-3xl border-2 border-white shadow-md space-y-4 flex flex-col justify-between bg-white/95"
                    >
                      {/* Top Info */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.businessName}
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                            />
                            <div>
                              <div className="font-black text-sm text-slate-950 flex items-center gap-1.5">
                                <span>{user.businessName}</span>
                                {status === 'approved' && (
                                  <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-200" />
                                )}
                              </div>
                              <div className="text-xs text-slate-600 font-medium">
                                {user.ownerName} • <span className="font-mono text-slate-500">@{user.username}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                Applied: {user.registeredAt || 'Nov 20, 2026'}
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="text-right">
                            {status === 'approved' ? (
                              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>APPROVED</span>
                              </span>
                            ) : status === 'rejected' ? (
                              <span className="text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full">
                                REJECTED
                              </span>
                            ) : (
                              <span className="text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full animate-pulse inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>PENDING APPROVAL</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Badges Capsule */}
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold border border-slate-200">
                            {user.category}
                          </span>
                          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold border border-slate-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-600" />
                            <span>{user.taluk}</span>
                          </span>
                          {user.verificationTicket && (
                            <span className="px-2 py-1 rounded-xl bg-blue-50 text-blue-900 font-mono text-[11px] font-bold border border-blue-200">
                              Ticket: {user.verificationTicket}
                            </span>
                          )}
                        </div>

                        {/* GSTIN & Phone Verification Panel */}
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-medium">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">GSTIN / Tax ID:</span>
                            <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                              <span>{user.gstin || '33AABCS1429B1Z2'}</span>
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                ACTIVE ON GSTN
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Registered Phone:</span>
                            <span className="font-mono font-bold text-slate-900">{user.phone}</span>
                          </div>
                          {user.bio && (
                            <div className="text-[11px] text-slate-600 line-clamp-2 pt-1 border-t border-slate-200">
                              "{user.bio}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {status === 'pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                if (onApproveUser) {
                                  onApproveUser(user.id);
                                }
                              }}
                              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approve & Grant Network Access</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (onRejectUser) {
                                  onRejectUser(user.id, 'Incomplete verification credentials');
                                }
                              }}
                              className="px-4 py-2.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : status === 'approved' ? (
                          <div className="w-full flex items-center justify-between text-xs">
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Active Verified Member</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (onRejectUser) {
                                  onRejectUser(user.id, 'Suspended by admin');
                                }
                              }}
                              className="text-[11px] text-slate-500 hover:text-rose-600 underline cursor-pointer"
                            >
                              Revoke Access
                            </button>
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-between text-xs">
                            <span className="text-rose-700 font-bold">Application Rejected</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (onApproveUser) {
                                  onApproveUser(user.id);
                                }
                              }}
                              className="px-3 py-1 bg-slate-950 text-white rounded-full text-[11px] font-bold cursor-pointer"
                            >
                              Re-Approve
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: POST & REEL MODERATION                                             */}
        {/* ========================================================================= */}
        {activeAdminTab === 'moderation' && (
          <div className="space-y-4">
            
            <div className="flex items-center gap-2">
              {[
                { id: 'pending', label: 'Pending Approval' },
                { id: 'approved', label: 'Approved' },
                { id: 'rejected', label: 'Rejected' },
                { id: 'all', label: 'All' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setModerationFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    moderationFilter === f.id
                      ? 'bg-slate-950 text-white font-black shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center apple-glass rounded-3xl border border-white text-slate-500 text-sm shadow-sm">
                No moderation posts in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="apple-glass p-4 rounded-3xl border border-white shadow-sm space-y-3 flex flex-col justify-between bg-white/95"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={post.avatar}
                        alt={post.businessName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-white shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {post.businessName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {post.ownerName} • {post.taluk} • {post.category}
                        </div>
                      </div>
                      <div>
                        {post.status === 'approved' ? (
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            APPROVED
                          </span>
                        ) : post.status === 'rejected' ? (
                          <span className="text-[10px] font-bold bg-rose-500/20 text-rose-700 border border-rose-500/30 px-2 py-0.5 rounded-full">
                            REJECTED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-400/20 text-amber-800 border border-amber-400/30 px-2 py-0.5 rounded-full">
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-2">
                      {post.caption}
                    </p>

                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
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

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => onApprovePost(post.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => onRejectPost(post.id)}
                        className="flex-1 py-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-700 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition cursor-pointer border border-slate-200"
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

        {/* ========================================================================= */}
        {/* TAB 3: VERIFIED MEMBERS DIRECTORY                                         */}
        {/* ========================================================================= */}
        {activeAdminTab === 'members' && (
          <div className="apple-glass rounded-3xl border border-white p-5 shadow-xl space-y-4 bg-white/95">
            <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Verified B2B Network Members ({approvedUsersCount})</span>
              <span className="text-xs text-slate-500 font-mono">Governed under Shinegah Enterprise Rules</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Business & Owner</th>
                    <th className="p-3">Taluk / District</th>
                    <th className="p-3">Industry Category</th>
                    <th className="p-3">Mobile</th>
                    <th className="p-3">GSTIN</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {registeredUsers.filter(u => (u.verificationStatus || 'approved') === 'approved').map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 flex items-center gap-2">
                        <img src={m.avatar} alt={m.businessName} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900">{m.businessName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">@{m.username} • {m.ownerName}</div>
                        </div>
                      </td>
                      <td className="p-3">{m.taluk}</td>
                      <td className="p-3">{m.category}</td>
                      <td className="p-3 font-mono">{m.phone}</td>
                      <td className="p-3 font-mono text-[11px] font-bold text-slate-800">{m.gstin || '33AABCS1429B1Z2'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Verified
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

    </div>
  );
};
