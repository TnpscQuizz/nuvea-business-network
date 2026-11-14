import React, { useState } from 'react';
import type { AppState, CartItem } from '../../types';
import { Search, Plus, ShoppingBag, CheckCircle, Tag, MapPin, Phone, X, ExternalLink } from 'lucide-react';

interface UserPortalProps {
  state: AppState;
  addToCart: (item: CartItem) => void;
  openPostRequirement: () => void;
  lang: 'ta' | 'en';
}

export const UserPortal: React.FC<UserPortalProps> = ({ state, addToCart, openPostRequirement, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('all');
  const [selectedMapBiz, setSelectedMapBiz] = useState<any>(null);

  const members = state.members || [];
  const requirements = state.marketplaceRequirements || [];

  const taluks = [
    { id: 'all', name: 'அனைத்து தாலுகாக்கள்' },
    { id: 'harur', name: 'ஹரூர் (Harur)' },
    { id: 'palacode', name: 'பாலக்கோடு (Palacode)' },
    { id: 'karimangalam', name: 'காரிமங்கலம்' },
    { id: 'dharmapuri_town', name: 'தருமபுரி டவுன்' },
    { id: 'pennagaram', name: 'பென்னாகரம்' },
  ];

  const filteredMembers = members.filter((m) => {
    const matchTaluk = selectedTaluk === 'all' ? true : m.talukId === selectedTaluk;
    const matchSearch =
      searchTerm === '' ||
      m.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.specialOffer || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchTaluk && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase mb-2 border border-emerald-500/30">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>சரிபார்க்கப்பட்ட சப்ளையர்கள் & மார்க்கெட்பிளேஸ்</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            தருமபுரி & சேலத்தின் நம்பகமான வணிகர்கள் மற்றும் பொருட்கள்
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            சிறந்த விலை சலுகைகள், 18% GST வரி பில்லிங் மற்றும் தாலுகா வாரியான நேரடி சேவைகள்
          </p>
        </div>

        <button
          onClick={openPostRequirement}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>மொத்த தேவை சமர்ப்பிக்க (Post Req)</span>
        </button>
      </div>

      {/* SEARCH BAR & TALUK FILTER CHIPS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="கடைகள், உரிமையாளர், சலுகைகள் தேடவும் (எ.கா: தங்கம், பட்டு, சிசிடிவி, 4K வீடியோ)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs font-bold">
          <span className="text-slate-400 text-[11px] shrink-0">தாலுகா தேர்வு:</span>
          {taluks.map((t) => {
            const isSel = selectedTaluk === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTaluk(t.id)}
                className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
                  isSel
                    ? 'bg-emerald-600 text-white border-emerald-600 font-black'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* VERIFIED BUSINESS LISTINGS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">
            சரிபார்க்கப்பட்ட நிறுவனங்கள் ({filteredMembers.length})
          </h3>
          <span className="text-xs text-slate-500 font-semibold">1 தாலுகா = 1 பிரத்யேக மோனோபோலி</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-emerald-500 transition-all duration-200 group"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={m.cover || m.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'}
                    alt={m.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    {m.categoryName || m.categoryId}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                    ✓ VERIFIED B2B
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h4 className="font-black text-slate-900 text-base leading-tight">{m.businessName}</h4>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.talukId.toUpperCase()} • {m.ownerName}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {m.specialOffer ? (
                      <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 inline-block">
                        🎁 {m.specialOffer}
                      </span>
                    ) : (
                      'சிறந்த தரம் மற்றும் நேரடி விலை சலுகை.'
                    )}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs font-bold">
                  <button
                    onClick={() => setSelectedMapBiz(m)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>📍 வரைபடம்</span>
                  </button>

                  <a
                    href={`tel:${m.phone}`}
                    className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>அழைக்க</span>
                  </a>

                  <a
                    href={`https://wa.me/91${m.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`வணக்கம் ${m.ownerName} அவர்களே, NBN மார்க்கெட்பிளேஸ் வழியாக உங்கள் தயாரிப்புகள் குறித்து விசாரிக்க விரும்புகிறேன்.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
                  <a
                    href={`/#/biz/${m.id}`}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5"
                  >
                    கடை பார்க்க ➔
                  </a>
                  <button
                    onClick={() =>
                      addToCart({
                        id: `${m.id}_deal`,
                        name: `${m.businessName} - சிறப்பு சலுகை முன்பதிவு`,
                        price: 999,
                        qty: 1,
                        sellerId: m.id,
                        sellerName: m.businessName,
                      })
                    }
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>கார்ட்டில் சேர்</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REQUIREMENTS & QUOTATIONS STATUS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">📋 உங்கள் தேவைகளுக்கான கொட்டேஷன்கள்</h3>
            <p className="text-xs text-slate-500">சப்ளையர்கள் அனுப்பிய விலைகளை ஒப்பிட்டு ஆர்டர் உறுதி செய்யலாம்.</p>
          </div>
          <button
            onClick={openPostRequirement}
            className="text-xs text-amber-700 hover:underline font-bold"
          >
            + புதிய தேவை சமர்ப்பிக்க
          </button>
        </div>

        <div className="space-y-4">
          {requirements.map((req) => (
            <div key={req.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-black text-sm text-slate-900">{req.title}</h4>
                  <p className="text-xs text-slate-500">
                    பட்ஜெட்: <strong>₹{req.budget.toLocaleString('en-IN')}</strong> • தாலுகா: {(req.talukId || 'Regional').toUpperCase()}
                  </p>
                </div>
                <span className="text-[10px] font-black bg-blue-100 text-blue-900 px-3 py-1 rounded-full uppercase self-start sm:self-auto">
                  {req.quotes?.length || 0} கொட்டேஷன்கள் பெறப்பட்டன
                </span>
              </div>

              {/* Bids received */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {req.quotes && req.quotes.length > 0 ? (
                  req.quotes.map((q) => (
                    <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-xs text-slate-900">{q.supplierName}</span>
                        <span className="font-black text-emerald-600 text-sm">₹{q.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        அடிப்படை: ₹{q.basePrice.toLocaleString('en-IN')} + 18% GST வரி
                      </p>
                      <button
                        onClick={() => alert('சப்ளையரின் நேரடி தொடர்பு விவரங்கள் அன்லாக் செய்யப்பட்டன!')}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                      >
                        ✓ சப்ளையரை தேர்வு செய் (Accept Quote)
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 font-semibold py-2">
                    சப்ளையர்கள் உங்கள் தேவையை ஆய்வு செய்து வருகின்றனர்.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GOOGLE MAPS STORE MODAL */}
      {selectedMapBiz && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  📍 {selectedMapBiz.businessName} - கடை இருப்பிடம் & கூகுள் மேப்
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  உரிமையாளர்: {selectedMapBiz.ownerName} • {selectedMapBiz.talukId.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedMapBiz(null)}
                className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div><strong>முகவரி:</strong> {selectedMapBiz.address || 'மெயின் ரோடு, தருமபுரி & சேலம் மண்டலம்'}</div>
              <div><strong>தொடர்பு:</strong> {selectedMapBiz.phone}</div>
            </div>

            <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
              <iframe
                title="Store Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedMapBiz.address || selectedMapBiz.businessName + ', ' + selectedMapBiz.talukId)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="pt-2 border-t flex items-center justify-between">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMapBiz.address || selectedMapBiz.businessName + ', ' + selectedMapBiz.talukId)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Maps-ல் வழிசெலுத்துக (Get Directions)</span>
              </a>

              <button
                onClick={() => setSelectedMapBiz(null)}
                className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-xl cursor-pointer"
              >
                மூடுக
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
