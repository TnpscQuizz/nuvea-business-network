import React, { useState } from 'react';
import type { AppState, Chapter } from '../../types';
import { Shield, Users, Landmark, ShoppingCart, DollarSign, Search, Plus, CheckCircle, AlertTriangle } from 'lucide-react';

interface AdminPortalProps {
  state: AppState;
  updateState: (newState: AppState) => void;
  lang: 'ta' | 'en';
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ state, updateState, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [newChapterName, setNewChapterName] = useState('');
  const [showAddChapter, setShowAddChapter] = useState(false);

  const members = state.members || [];
  const chapters = state.chapters || [];
  const users = state.users || [];
  const requirements = state.marketplaceRequirements || [];
  const orders = state.marketplaceOrders || [];

  const totalGmv = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const filteredUsers = users.filter((u) => {
    const matchFilter = filterRole === 'all' ? true : (u.accountType === filterRole || u.role === filterRole);
    const matchSearch =
      searchTerm === '' ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

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

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterName.trim()) return;

    const newCh: Chapter = {
      id: `ch_${Date.now()}`,
      name: newChapterName,
      nameTa: newChapterName,
      nameEn: newChapterName,
      talukId: 'harur',
      districtId: 'dharmapuri',
      filledSeats: 0,
      availableSeats: 100,
    };

    updateState({
      ...state,
      chapters: [...chapters, newCh],
    });
    setNewChapterName('');
    setShowAddChapter(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      
      {/* TOP HEADER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase mb-2 border border-rose-500/30">
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>மத்திய நிர்வாக கன்சோல் (Super Admin Console)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            NBN மண்டல தலைமை நிர்வாகக் கட்டுப்பாட்டகம்
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            தருமபுரி & சேலம் மண்டலத்தின் 11 சாப்டர்கள், 100 தொழில் பிரிவுகள் மற்றும் சந்தை மேலாண்மை
          </p>
        </div>

        <button
          onClick={() => setShowAddChapter(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ புதிய சாப்டர் துவங்கு</span>
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">மொத்த உறுப்பினர்கள்</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{members.length}</div>
            <div className="text-xs text-emerald-600 font-bold mt-1">✓ 100% சரிபார்க்கப்பட்டவர்கள்</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
            🏛️
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">சாப்டர்கள்</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{chapters.length}</div>
            <div className="text-xs text-brand-600 font-bold mt-1">தருமபுரி & சேலம் மண்டலம்</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
            🗺️
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">சந்தை தேவைகள்</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{requirements.length}</div>
            <div className="text-xs text-amber-600 font-bold mt-1">{orders.length} ஆர்டர்கள் நிறைவடைந்தன</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
            🛒
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">வர்த்தக அளவு (GMV)</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">₹{totalGmv.toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-500 font-bold mt-1">18% GST வரி பில்லிங்</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
            💰
          </div>
        </div>
      </div>

      {/* CHAPTER OCCUPANCY SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-900">🏛️ சாப்டர்கள் & சீட் காலியிட நிலவரம் (Chapter Occupancy)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((c) => {
            const chMembers = members.filter((m) => m.chapterId === c.id);
            const occ = chMembers.length;
            const pct = Math.min(100, Math.round((occ / 100) * 100));
            return (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{c.nameTa || c.name}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {c.talukId?.toUpperCase() || 'REGIONAL'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-3 text-xs">
                  <span className="text-slate-500">நிரப்பப்பட்ட சீட்கள்:</span>
                  <span className="font-black text-slate-900">{occ} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.max(5, pct)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* USER MANAGEMENT DIRECTORY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">👥 பயனர் & உறுப்பினர் அடைவு (User Directory)</h3>
            <p className="text-xs text-slate-500">அனைத்து 4 கணக்கு வகைகளையும் தேடலாம், அங்கீகரிக்கலாம் மற்றும் இடைநிறுத்தலாம்.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="பெயர் அல்லது தொலைபேசி..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none w-52"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">பயனர் பெயர்</th>
                <th className="px-4 py-3">கணக்கு வகை</th>
                <th className="px-4 py-3">தொடர்பு</th>
                <th className="px-4 py-3">நிலை</th>
                <th className="px-4 py-3 text-right">நடவடிக்கை</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-black text-slate-900">{u.fullName}</div>
                    <div className="text-[10px] text-slate-400">{u.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
                      {u.accountType || u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-semibold">
                    <div>📞 {u.phone}</div>
                    <div className="text-[10px] text-slate-400">✉️ {u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        u.status === 'suspended' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'suspended' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <span>{(u.status || 'active').toUpperCase()}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        u.status === 'suspended'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {u.status === 'suspended' ? 'மீளமைக்க' : 'இடைநிறுத்து'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD CHAPTER MODAL */}
      {showAddChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">புதிய சாப்டர் உருவாக்குதல்</h3>
            <form onSubmit={handleCreateChapter} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block mb-1">சாப்டர் பெயர் (தமிழ் / English)</label>
                <input
                  type="text"
                  required
                  placeholder="எ.கா: அரூர் வைப்ரன்ட்ஸ் சாப்டர்"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl"
                >
                  ரத்து
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 font-black rounded-xl text-slate-950"
                >
                  உருவாக்கு ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
