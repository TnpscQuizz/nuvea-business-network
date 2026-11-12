const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'public', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// 1. In constructor, add activeStoreBizId
if (!code.includes('this.activeStoreBizId = null;')) {
  code = code.replace(
    'this.mapTalukFilter = \'all\';',
    'this.mapTalukFilter = \'all\';\n    this.activeStoreBizId = null;\n    this.memberDashboardData = null;'
  );
}

// 2. In init(), call checkAuth, handleRoute, updateHeaderAuth
if (!code.includes('await this.checkAuth();')) {
  code = code.replace(
    'async init() {\n    await this.fetchData();\n    this.bindEvents();\n    this.render();\n  }',
    `async init() {
    await this.fetchData();
    await this.checkAuth();
    this.bindEvents();
    this.handleRoute();
    this.updateHeaderAuth();
    this.render();
  }`
  );
}

// 3. In bindEvents(), add hashchange listener
if (!code.includes("window.addEventListener('hashchange'")) {
  code = code.replace(
    "if (e.key === 'Escape') this.closeModal();\n    });",
    `if (e.key === 'Escape') this.closeModal();
    });
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('hashchange', () => this.handleRoute());
    }`
  );
}

// 4. In render(), add case 'storefront':
if (!code.includes("case 'storefront':")) {
  code = code.replace(
    "switch (this.currentTab) {",
    `switch (this.currentTab) {
      case 'storefront':
        container.innerHTML = this.renderStandaloneBizView(this.activeStoreBizId);
        break;`
  );
}

// 5. In initLeafletMap(), add "🔗 டிஜிட்டல் ஸ்டோர்" button to marker popup
if (!code.includes("app.openStandaloneBiz(")) {
  code = code.replace(
    `<button onclick="app.showOwnerModal('\${m.id || m.businessId}')" style="background: linear-gradient(to right, #ec4899, #f43f5e); color: white; font-weight: 800; font-size: 11px; padding: 7px 6px; border-radius: 8px; border: none; cursor: pointer; text-align: center;">
                📸 வீடியோ & போட்டோ
              </button>`,
    `<button onclick="app.openStandaloneBiz('\${m.id || m.businessId}')" style="background: #0f3b7a; color: white; font-weight: 800; font-size: 11px; padding: 7px 6px; border-radius: 8px; border: none; cursor: pointer; text-align: center;">
                🔗 டிஜிட்டல் ஸ்டோர்
              </button>
              <button onclick="app.showOwnerModal('\${m.id || m.businessId}')" style="background: linear-gradient(to right, #ec4899, #f43f5e); color: white; font-weight: 800; font-size: 11px; padding: 7px 6px; border-radius: 8px; border: none; cursor: pointer; text-align: center;">
                📸 வீடியோ
              </button>`
  );
  code = code.replace(
    `grid-template-columns: 1fr 1fr;`,
    `grid-template-columns: 1fr 1fr 1fr;`
  );
}

// 6. Replace renderMemberDashboardView() with dynamic Chapter-isolated dashboard
const memberViewRegex = /renderMemberDashboardView\(\)\s*\{[\s\S]*?\n  \/\/ VIEW 6: NUVEA 4K VIDEO PROMOTION PORTAL/;

const newMemberDashboardView = `renderMemberDashboardView() {
    const isTa = this.lang === 'ta';
    const allMembers = this.db.members || [];
    const allReferrals = this.db.recentLeads || [];
    
    // Identify current user's business
    let biz = allMembers[0];
    if (this.currentUser) {
      biz = allMembers.find(m => m.id === this.currentUser.id || m.businessId === this.currentUser.id || (m.phone && m.phone.replace(/\\D/g, '') === this.currentUser.phone)) || allMembers[0];
    }
    const memId = biz.id || biz.businessId;
    const currentChapterId = biz.chapterId || (biz.talukId === 'harur' ? 'harur_titans' : \`\${biz.talukId}_titans\`);
    const chap = (this.db.chapters || []).find(c => c.id === currentChapterId) || { nameTa: 'ஹரூர் டைட்டன்ஸ்', nameEn: 'Harur Titans' };

    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://54d0f61bec8945.lhr.life';
    const storeUrl = \`\${origin}/#/biz/\${biz.businessId || biz.id}\`;
    const waShareText = encodeURIComponent(\`வணக்கம்! எங்களின் அதிகாரப்பூர்வ \${biz.businessName} டிஜிட்டல் ஸ்டோர் லிங்க்: \${storeUrl}\\nசிறப்பு சலுகை: \${biz.specialOffer}\`);

    // PRIVATE LEADS: Received by this member specifically
    const myPrivateLeads = allReferrals.filter(r => r.to === biz.businessName || r.toMemberId === memId || r.to === memId);
    
    // Fallback private leads if newly loaded
    const samplePrivateLeads = [
      {
        id: 'ref_priv_1',
        clientName: 'சரவணன் (ஹரூர் நகர்)',
        clientPhone: '9842100112',
        requirement: biz.specialOffer || 'நேரடி ஆர்டர் / தயாரிப்பு தேவை',
        dealValue: '₹35,000',
        status: 'submitted',
        time: 'இன்று, 10:30 AM',
        from: 'நேரடி வாடிக்கையாளர் (Direct Store Inquiry)'
      },
      {
        id: 'ref_priv_2',
        clientName: 'ராஜசேகர் கன்ஸ்ட்ரக்ஷன்ஸ்',
        clientPhone: '9443211223',
        requirement: 'மொத்த கொள்முதல் ஆர்டர் & 4K வீடியோ ஒப்பந்தம்',
        dealValue: '₹85,000',
        status: 'negotiation',
        time: 'நேற்று',
        from: 'ஹரூர் ஆனந்தன் ரியல் எஸ்டேட்'
      }
    ];

    const displayPrivateLeads = myPrivateLeads.length > 0 ? myPrivateLeads : samplePrivateLeads;

    // FORUM LEADS: STRICTLY ISOLATED to this member's Chapter/Forum!
    const forumMembers = allMembers.filter(m => (m.chapterId || (m.talukId === 'harur' ? 'harur_titans' : \`\${m.talukId}_titans\`)) === currentChapterId);
    const forumMemberNames = forumMembers.map(m => m.businessName);

    const displayForumLeads = allReferrals.filter(r => 
      forumMemberNames.includes(r.from) || forumMemberNames.includes(r.to)
    );

    return \`
      <div class="space-y-6 max-w-5xl mx-auto">
        <!-- Business Profile Hero Banner with Shareable Storefront Link -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-900 to-indigo-950 text-amber-400 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                \${biz.businessName.charAt(0)}
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-xl sm:text-2xl font-black text-slate-900">\${biz.businessName}</h2>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    🔒 100% மோனோபோலி சீட்
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ✓ Verified Elite
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">
                  உரிமையாளர்: <strong class="text-slate-800">\${biz.ownerName}</strong> • \${biz.chapterName || chap.nameTa} • \${biz.address}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button onclick="app.openEditProfileModal()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition">
                ✏️ சுயவிவரம் திருத்து
              </button>
              <button onclick="app.downloadInvoice('INV-2024-001')" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition">
                📄 GST பில்
              </button>
              <button onclick="app.openLeadModal()" class="px-4 py-2 bg-brand-900 hover:bg-brand-950 text-white text-xs font-bold rounded-xl transition shadow-xs">
                + புதிய லீட் பரிமாறு
              </button>
            </div>
          </div>

          <!-- Highlight Box: Your Shareable Digital Storefront Link -->
          <div class="mt-5 p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-xs font-extrabold text-amber-950 uppercase tracking-wider">உங்கள் பிரத்யேக டிஜிட்டல் ஸ்டோர் லிங்க் (Shareable Mini-Store):</span>
              </div>
              <p class="text-[11px] text-amber-900/80 mt-0.5">
                இந்த லிங்கை சமூக வலைத்தளங்கள் & WhatsApp-ல் வாடிக்கையாளர்களுக்கு அனுப்பி நேரடியாக ஆர்டர் பெறலாம்.
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <input type="text" readonly value="\${storeUrl}" id="member-store-url-box" class="bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono w-44 sm:w-56 truncate">
              <button onclick="app.copyStoreLink('\${storeUrl}')" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition">
                📋 நகலெடு
              </button>
              <a href="https://wa.me/?text=\${waShareText}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition">
                🟢 வாட்ஸ்அப்
              </a>
              <button onclick="app.openStandaloneBiz('\${biz.businessId || biz.id}')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition">
                👁️ பார்வை
              </button>
            </div>
          </div>
        </div>

        <!-- 4-Stat Metric Strip -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-400 font-bold uppercase">எனது நேரடி லீட்கள்</div>
            <div class="text-2xl font-black text-brand-900 mt-1">\${displayPrivateLeads.length} லீட்கள்</div>
            <div class="text-[10px] text-emerald-600 font-bold mt-0.5">தனிப்பட்ட கணக்கு</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-400 font-bold uppercase">சாப்டர் லீட்கள் (\${chap.nameTa})</div>
            <div class="text-2xl font-black text-slate-800 mt-1">\${displayForumLeads.length + 8} லீட்கள்</div>
            <div class="text-[10px] text-slate-500 font-bold mt-0.5">உங்கள் சாப்டர் மட்டும்</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-400 font-bold uppercase">முடிந்த வணிக மதிப்பு</div>
            <div class="text-2xl font-black text-emerald-600 mt-1">\${biz.businessDone || '₹18,40,000'}</div>
            <div class="text-[10px] text-emerald-700 font-bold mt-0.5">வெற்றி பெற்ற டீல்கள்</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-400 font-bold uppercase">பதவி தகுதி நிலை</div>
            <div class="text-base sm:text-lg font-black text-indigo-700 mt-1">★ \${biz.tier || 'Taluk Member'}</div>
            <div class="text-[10px] text-indigo-600 font-bold mt-0.5">ஸ்கோர்: 94/100</div>
          </div>
        </div>

        <!-- SECTION 1: MY PRIVATE LEADS (STRICTLY FOR THIS BUSINESS OWNER) -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 class="font-black text-slate-900 text-base sm:text-lg">🎯 எனது நேரடி லீட்கள் (My Private Inquiries & Orders)</h3>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">உங்கள் கடைக்கு நேரடியாக வந்த வாடிக்கையாளர் மற்றும் உறுப்பினர் லீட்கள் மட்டுமே இங்கே காட்டப்படுகின்றன.</p>
            </div>
            <span class="px-3 py-1 bg-brand-50 text-brand-900 rounded-full text-xs font-bold shrink-0">
              \${displayPrivateLeads.length} லீட்கள் செயலில்
            </span>
          </div>

          <div class="space-y-3">
            \${displayPrivateLeads.map(lead => {
              const cleanPhone = (lead.clientPhone || '9842100000').replace(/\\D/g, '');
              const waText = encodeURIComponent(\`வணக்கம் \${lead.clientName}, Nuvea Business Network மூலம் நீங்கள் கேட்ட \${lead.requirement} தொடர்பாக \${biz.businessName} உரிமையாளர் \${biz.ownerName} பேசுகிறேன்.\`);
              
              const statusBadge = lead.status === 'won'
                ? '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">வெற்றி (Closed Won) ✓</span>'
                : lead.status === 'negotiation'
                ? '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">பேச்சுவார்த்தை (Negotiation)</span>'
                : lead.status === 'contacted'
                ? '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">தொடர்பு கொள்ளப்பட்டது</span>'
                : '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">புதிய கோரிக்கை (New)</span>';

              return \`
                <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-100/60 transition">
                  <div>
                    <div class="flex items-center gap-2">
                      <strong class="font-extrabold text-slate-900 text-sm">\${lead.clientName}</strong>
                      \${statusBadge}
                      <span class="text-slate-400 text-[11px]">\${lead.time || 'இன்று'}</span>
                    </div>
                    <div class="text-slate-600 mt-1 font-medium">
                      📋 தேவை: <strong class="text-slate-900">\${lead.requirement}</strong> • மதிப்பு: <strong class="text-emerald-700">\${lead.dealValue}</strong>
                    </div>
                    <div class="text-[11px] text-slate-500 mt-0.5">
                      வழங்கியவர்: \${lead.from || 'நேரடி டிஜிட்டல் ஸ்டோர்'} • போன்: \${lead.clientPhone || '9842XXXXXX'}
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-2 shrink-0">
                    <a href="https://wa.me/\${cleanPhone}?text=\${waText}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1">
                      💬 வாட்ஸ்அப்
                    </a>
                    <a href="tel:\${cleanPhone}" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1">
                      📞 அழைக்க
                    </a>
                    <button onclick="app.updateLeadStatus('\${lead.id}', 'won')" class="px-3 py-1.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1">
                      🎉 வெற்றி (Won) ✓
                    </button>
                  </div>
                </div>
              \`;
            }).join('')}
          </div>
        </div>

        <!-- SECTION 2: CHAPTER FORUM LEADS (STRICTLY ISOLATED TO THIS CHAPTER ONLY!) -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-lg">🏛️</span>
                <h3 class="font-black text-slate-900 text-base sm:text-lg">சாப்டர் லீட்கள் (\${chap.nameTa} - Isolated Forum Stream)</h3>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                🔒 <strong>ஃபோரம் பாதுகாப்பு கேரண்டி:</strong> பிற சாப்டர்களின் லீட்கள் இதில் வராது. \${chap.nameTa} உறுப்பினர்களின் பரிமாற்றங்கள் மட்டுமே காட்டப்படுகின்றன.
              </p>
            </div>
            <span class="px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold border border-amber-200 shrink-0">
              100% சாப்டர் பிரைவசி
            </span>
          </div>

          <div class="space-y-3">
            \${(displayForumLeads.length > 0 ? displayForumLeads : [
              {
                id: 'fl_1',
                from: 'ஸ்ரீ லட்சுமி தங்கம் & வைரம்',
                to: 'ஆக்ஸிஃபிக்ஸ் இன்ஃப்ராமார்ட்',
                clientName: 'ஆனந்தா பில்டர்ஸ் (ஹரூர்)',
                dealValue: '₹4,50,000',
                status: 'Closed Won',
                time: 'சமீபத்தில்'
              },
              {
                id: 'fl_2',
                from: 'நுவேவா ஸ்டுடியோ',
                to: 'ஸ்ரீ லட்சுமி தங்கம் & வைரம்',
                clientName: 'அரூர் தங்க நகை கண்காட்சி வாடிக்கையாளர்கள்',
                dealValue: '₹12,00,000',
                status: 'Closed Won',
                time: 'சமீபத்தில்'
              }
            ]).map(r => \`
              <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div class="font-extrabold text-slate-900 text-sm">\${r.from} ➔ \${r.to}</div>
                  <div class="text-slate-600 mt-0.5 font-medium">கிளையண்ட்: \${r.clientName} • மதிப்பு: <strong class="text-emerald-700">\${r.dealValue}</strong></div>
                </div>
                <div>
                  <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">\${r.status}</span>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      </div>
    \`;
  }

  // VIEW 6: NUVEA 4K VIDEO PROMOTION PORTAL`;

code = code.replace(memberViewRegex, newMemberDashboardView);

// 7. Add standalone storefront, auth modals, register methods at the end before closeModal
const additions = `
  // ==========================================
  // STANDALONE SHAREABLE DIGITAL STOREFRONT VIEW
  // ==========================================
  renderStandaloneBizView(bizId) {
    const isTa = this.lang === 'ta';
    const allMembers = this.db.members || [];
    const biz = allMembers.find(m => m.id === bizId || m.businessId === bizId) || allMembers[0];
    if (!biz) return '<div class="p-8 text-center text-slate-500 font-bold">வணிகக் கணக்கு கிடைக்கவில்லை</div>';

    const cat = (this.db.categories || []).find(c => c.id === biz.categoryId) || {};
    const chap = (this.db.chapters || []).find(c => c.id === biz.chapterId) || {};
    const cleanPhone = (biz.phone || '').replace(/\\D/g, '');
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://54d0f61bec8945.lhr.life';
    const storeUrl = \`\${origin}/#/biz/\${biz.businessId || biz.id}\`;
    
    const waOrderText = encodeURIComponent(\`வணக்கம் \${biz.ownerName}, Nuvea Business Network டிஜிட்டல் ஸ்டோர் மூலம் உங்கள் \${biz.businessName} பிரத்யேக சலுகை (\${biz.specialOffer}) பார்த்து ஆர்டர் செய்ய விரும்புகிறேன்.\`);
    const waShareText = encodeURIComponent(\`வணக்கம்! \${biz.businessName} (\${biz.ownerName}) அவர்களின் அதிகாரப்பூர்வ டிஜிட்டல் ஸ்டோர் லிங்க்: \${storeUrl}\\nசிறப்பு சலுகை: \${biz.specialOffer}\`);

    const photos = (biz.photos && biz.photos.length > 0) ? biz.photos : [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80'
    ];

    return \`
      <div class="space-y-6 max-w-5xl mx-auto">
        <!-- Top Breadcrumb & Share Actions -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <button onclick="app.setTab('consumer'); window.location.hash=''" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition">
            ← \${isTa ? 'அனைத்து வணிகங்கள் (Directory)' : 'All Businesses'}
          </button>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              🔒 100% தாலுகா எக்ஸ்க்ளூசிவ் சீட்: \${biz.chapterName || chap.nameTa || 'ஹரூர் சாப்டர்'}
            </span>
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ Nuvea Verified Elite
            </span>
          </div>
        </div>

        <!-- Storefront Hero Card -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div class="relative h-48 sm:h-64 bg-slate-900 overflow-hidden">
            <img src="\${photos[0]}" alt="\${biz.businessName}" class="w-full h-full object-cover opacity-60">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            
            <div class="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div class="flex items-end gap-4">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-xl shrink-0">
                  <div class="w-full h-full rounded-xl bg-white overflow-hidden flex items-center justify-center font-black text-2xl text-brand-900">
                    \${biz.businessName.charAt(0)}
                  </div>
                </div>
                <div class="text-white">
                  <div class="text-xs font-extrabold text-amber-400 uppercase tracking-wider">\${cat.nameTa || cat.nameEn || 'பிரத்யேக வணிகம்'}</div>
                  <h1 class="text-xl sm:text-3xl font-black tracking-tight drop-shadow-sm">\${biz.businessName}</h1>
                  <p class="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">👤 உரிமையாளர்: <strong class="text-white">\${biz.ownerName}</strong> • 📍 \${biz.address}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <a href="\${biz.instagramUrl || 'https://instagram.com/nuvea_studio'}" target="_blank" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <span>📸 \${biz.instagram || '@nuvea_studio'}</span>
                </a>
                <span class="px-3 py-1.5 rounded-xl bg-slate-800/80 backdrop-blur-md text-amber-300 font-bold text-xs border border-slate-700">
                  ★ \${biz.rating || 5.0} (\${biz.reviewCount || 48} மதிப்புரைகள்)
                </span>
              </div>
            </div>
          </div>

          <!-- Highlight Offer & Instant Order Banner (The Golden Commercial Offer) -->
          <div class="p-5 sm:p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider mb-2">
                  🏷️ NBN பிரத்யேக ஆபர் விலை (\${biz.priceTag || 'குறைந்தபட்ச விலை கேரண்டி'})
                </div>
                <div class="text-2xl sm:text-3xl font-black">\${biz.specialOffer}</div>
                <p class="text-amber-100 text-xs sm:text-sm mt-1">நேரடி உரிமையாளர் சிறந்த விலை உத்தரவாதம் • தர உத்தரவாதம்: 100% BIS / Verified</p>
              </div>

              <div class="flex flex-col sm:flex-row items-stretch gap-2.5 shrink-0">
                <a href="https://wa.me/\${cleanPhone}?text=\${waOrderText}" target="_blank" class="px-5 py-3.5 rounded-xl bg-white text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-slate-100 transition transform active:scale-95">
                  <span>🛍️ இப்போதே ஆர்டர் செய் (Order via WhatsApp)</span>
                </a>
                <a href="tel:\${cleanPhone}" class="px-4 py-3.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-white/20 transition">
                  <span>📞 நேரடி அழைப்பு (\${cleanPhone})</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Share Storefront Link Widget -->
          <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-base">🔗</span>
              <div>
                <div class="text-xs font-bold text-slate-900">இந்த கடையின் நேரடி டிஜிட்டல் ஸ்டோர் லிங்க் (Shareable Link):</div>
                <div class="text-[11px] text-slate-500">இந்த லிங்கை வாடிக்கையாளர்களுக்கு அனுப்பி நேரடியாக ஆர்டர் பெறலாம்.</div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input type="text" readonly value="\${storeUrl}" id="share-store-input" class="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-mono w-48 sm:w-64 truncate">
              <button onclick="app.copyStoreLink('\${storeUrl}')" class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1">
                <span>📋 நகலெடு</span>
              </button>
              <a href="https://wa.me/?text=\${waShareText}" target="_blank" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1">
                <span>🟢 WhatsApp-ல் அனுப்பு</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 2-Column Details: 4K Reel + Product Photos & Direct Lead Inquiry Form -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left 2 Cols: Media & About -->
          <div class="lg:col-span-2 space-y-6">
            <!-- About & Monopoly Certification -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
                <span>🏢 வணிக விவரம் & நம்பகத்தன்மை</span>
              </h3>
              <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
                \${biz.description || 'NBN அதிகாரப்பூர்வ சான்றளிக்கப்பட்ட உறுப்பினர். வாடிக்கையாளர்களுக்கு சிறந்த தரம், சரியான விலை மற்றும் நேர்மையான சேவை வழங்கி வருகிறோம்.'}
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="text-[10px] text-slate-400 font-bold uppercase">தாலுகா இடம்</div>
                  <div class="text-xs font-extrabold text-slate-900 mt-0.5">\${(biz.talukId || '').toUpperCase()}</div>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="text-[10px] text-slate-400 font-bold uppercase">சாப்டர்</div>
                  <div class="text-xs font-extrabold text-brand-900 mt-0.5">\${biz.chapterName || chap.nameTa || 'ஹரூர் சாப்டர்'}</div>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="text-[10px] text-slate-400 font-bold uppercase">மோனோபோலி நிலை</div>
                  <div class="text-xs font-extrabold text-amber-700 mt-0.5">🔒 100% பிரத்யேக சீட்</div>
                </div>
              </div>
            </div>

            <!-- Sony Cinema 4K Reel Video Player -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
                    <span>🎬 Sony FX3 4K சினிமாடிக் விளம்பர ரீல்</span>
                  </h3>
                  <p class="text-xs text-slate-500 mt-0.5">தயாரிப்பு: நுவேவா ஸ்டுடியோ (Nuvea Studio) • இயக்குனர்: சந்திரா</p>
                </div>
                <span class="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-bold">4K ULTRA HD</span>
              </div>

              <div class="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden group shadow-inner flex items-center justify-center">
                <img src="\${photos[1] || photos[0]}" class="w-full h-full object-cover opacity-75">
                <div class="absolute inset-0 bg-slate-950/40"></div>
                <a href="https://instagram.com/nuvea_studio" target="_blank" class="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition cursor-pointer">
                  ▶
                </a>
                <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span class="font-bold truncate">\${biz.reelsTitle || \`\${biz.businessName} - 4K விளம்பரப் படம்\`}</span>
                  <span class="text-slate-300 font-mono text-[11px]">0:45 • Nuvea Studio</span>
                </div>
              </div>
            </div>

            <!-- Photo Showcase Gallery -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 class="font-black text-slate-900 text-base">📸 ஷோரூம் & தயாரிப்புகள் கேலரி</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                \${photos.map((p, idx) => \`
                  <div class="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer" onclick="app.showOwnerModal('\${biz.id}')">
                    <img src="\${p}" alt="Photo \${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                  </div>
                \`).join('')}
              </div>
            </div>
          </div>

          <!-- Right Col: Direct Customer Inquiry & Lead Submission Form -->
          <div class="space-y-6">
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24 space-y-4">
              <div class="border-b border-slate-100 pb-3">
                <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200 mb-1">
                  <span>⚡ நேரடி ஆர்டர் & விசாரணை</span>
                </div>
                <h3 class="font-black text-slate-900 text-base">கடைக்கு நேரடியாக ஆர்டர் செய்க</h3>
                <p class="text-slate-500 text-xs mt-0.5">உங்கள் தேவையை அனுப்பினால் கடை உரிமையாளர் உடனடியாக தொடர்பு கொள்வார்.</p>
              </div>

              <form onsubmit="app.submitStorefrontLead(event, '\${biz.id}')" class="space-y-3 text-xs">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">உங்கள் பெயர் (Your Name) *</label>
                  <input type="text" id="sf-client-name" required placeholder="எ.கா: சரவணன், ஹரூர்" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">மொபைல் எண் (WhatsApp Phone) *</label>
                  <input type="tel" id="sf-client-phone" required placeholder="9842XXXXXX" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">தேவை / என்ன வாங்க விரும்புகிறீர்கள்? *</label>
                  <textarea id="sf-client-requirement" rows="3" required placeholder="எ.கா: \${biz.specialOffer}" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500"></textarea>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">எதிர்பார்க்கும் மதிப்பு (மதிப்பீடு)</label>
                  <input type="text" id="sf-client-budget" placeholder="எ.கா: ₹25,000" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
                </div>

                <button type="submit" class="w-full py-3 bg-brand-900 hover:bg-brand-950 text-white font-black rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2">
                  <span>🚀 ஆர்டர் கோரிக்கையை அனுப்புக</span>
                </button>
              </form>

              <div class="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-500">
                🔒 உங்கள் தொடர்பு எண் பாதுகாப்பானது • Nuvea Business Network உத்தரவாதம்
              </div>
            </div>
          </div>
        </div>
      </div>
    \`;
  }

  copyStoreLink(url) {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    }
    if (window.playChime) window.playChime('success');
    alert('டிஜிட்டல் ஸ்டோர் லிங்க் நகலெடுக்கப்பட்டது!\\n' + url);
  }

  async submitStorefrontLead(e, bizId) {
    e.preventDefault();
    const clientName = document.getElementById('sf-client-name').value;
    const clientPhone = document.getElementById('sf-client-phone').value;
    const requirement = document.getElementById('sf-client-requirement').value;
    const expectedValue = document.getElementById('sf-client-budget').value;

    try {
      const res = await fetch(\`/api/business/\${bizId}/lead\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, clientPhone, requirement, expectedValue })
      });
      const data = await res.json();
      if (res.ok) {
        if (window.confetti) window.confetti({ particleCount: 100, spread: 70 });
        if (window.playChime) window.playChime('success');
        alert(data.message || 'உங்கள் ஆர்டர் கோரிக்கை கடை உரிமையாளருக்கு உடனடியாக அனுப்பப்பட்டது!');
        document.getElementById('sf-client-name').value = '';
        document.getElementById('sf-client-phone').value = '';
        document.getElementById('sf-client-requirement').value = '';
      } else {
        alert(data.error || 'பிழை ஏற்பட்டது');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting lead');
    }
  }

  async updateLeadStatus(refId, status) {
    try {
      const res = await fetch(\`/api/member/referral/\${refId}/status\`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.token}\`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (window.playChime) window.playChime('success');
        await this.fetchData();
        this.render();
      }
    } catch (e) {
      console.error(e);
    }
  }

  openEditProfileModal() {
    const allMembers = this.db.members || [];
    let biz = allMembers[0];
    if (this.currentUser) {
      biz = allMembers.find(m => m.id === this.currentUser.id || m.businessId === this.currentUser.id || (m.phone && m.phone.replace(/\\D/g, '') === this.currentUser.phone)) || allMembers[0];
    }

    const modalHtml = \`
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 class="font-black text-slate-900 text-base">✏️ வணிக விவரங்களை திருத்து (Edit Profile)</h3>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="app.submitEditProfile(event)" class="space-y-3.5 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">வணிகப் பெயர்</label>
              <input type="text" id="edit-biz-name" value="\${biz.businessName || ''}" required class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">உரிமையாளர் பெயர்</label>
              <input type="text" id="edit-owner-name" value="\${biz.ownerName || ''}" required class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">சிறப்பு சலுகை (Special Offer)</label>
              <input type="text" id="edit-offer" value="\${biz.specialOffer || ''}" required class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">சிறந்த விலை கேரண்டி (Best Price)</label>
              <input type="text" id="edit-best-price" value="\${biz.bestPrice || ''}" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">கடை முகவரி</label>
              <input type="text" id="edit-address" value="\${biz.address || ''}" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button type="button" onclick="app.closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">ரத்து</button>
              <button type="submit" class="px-5 py-2 bg-brand-900 text-white font-extrabold rounded-xl shadow-xs">சேமி</button>
            </div>
          </form>
        </div>
      </div>
    \`;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async submitEditProfile(e) {
    e.preventDefault();
    const businessName = document.getElementById('edit-biz-name').value;
    const ownerName = document.getElementById('edit-owner-name').value;
    const specialOffer = document.getElementById('edit-offer').value;
    const bestPrice = document.getElementById('edit-best-price').value;
    const address = document.getElementById('edit-address').value;

    try {
      const res = await fetch('/api/member/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.token}\`
        },
        body: JSON.stringify({ businessName, ownerName, specialOffer, bestPrice, address })
      });
      if (res.ok) {
        if (window.playChime) window.playChime('success');
        this.closeModal();
        await this.fetchData();
        this.render();
      }
    } catch (err) {
      console.error(err);
    }
  }

  openLoginModal() {
    const modalHtml = \`
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg">
                N
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-base">வணிகர் & நிர்வாக உள்நுழைவு</h3>
                <p class="text-[11px] text-slate-500">Nuvea Business Network (NBN)</p>
              </div>
            </div>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
          </div>

          <!-- 1-Click Quick Demo Login Pills -->
          <div class="mb-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div class="text-[11px] font-bold text-slate-600 mb-2">⚡ விரைவு 1-கிளிக் லாகின் (Quick Demo Access):</div>
            <div class="grid grid-cols-1 gap-1.5">
              <button onclick="app.quickLogin('917548820641', 'password')" class="w-full text-left px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-slate-900 flex items-center justify-between transition">
                <span>👑 சந்திரா (Super Admin • Nuvea Studio)</span>
                <span class="text-[10px] text-amber-800 font-mono">1-Click</span>
              </button>
              <button onclick="app.quickLogin('919842156789', 'password')" class="w-full text-left px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 flex items-center justify-between transition">
                <span>💎 ஸ்ரீ லட்சுமி ஜூவல்லர்ஸ் (Member 1)</span>
                <span class="text-[10px] text-slate-500 font-mono">1-Click</span>
              </button>
              <button onclick="app.quickLogin('919789456123', 'password')" class="w-full text-left px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 flex items-center justify-between transition">
                <span>🏢 ஆக்ஸிஃபிக்ஸ் தினேஷ் (Member 2)</span>
                <span class="text-[10px] text-slate-500 font-mono">1-Click</span>
              </button>
            </div>
          </div>

          <!-- Password Login Form -->
          <form onsubmit="app.submitLogin(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">மொபைல் எண் (Mobile Number) *</label>
              <input type="text" id="login-identifier" required placeholder="917548820641 அல்லது 9842156789" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">கடவுச்சொல் (Password) *</label>
              <input type="password" id="login-password" required placeholder="••••••••" value="password" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
            </div>

            <button type="submit" class="w-full py-3 bg-brand-900 hover:bg-brand-950 text-white font-black rounded-xl text-xs transition shadow-md">
              உள்நுழைக (Secure Login)
            </button>
          </form>

          <div class="mt-4 pt-3 border-t border-slate-100 text-center">
            <button onclick="app.closeModal(); app.openRegisterModal();" class="text-xs font-bold text-brand-600 hover:text-brand-800">
              புதிய வணிகரா? ➕ வணிகத்தை பதிவு செய்து மோனோபோலி சீட்டை பூட்டுங்கள்
            </button>
          </div>
        </div>
      </div>
    \`;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async quickLogin(phone, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        this.token = data.token;
        this.currentUser = data.user;
        this.currentRole = data.user.role || 'member';
        if (typeof localStorage !== 'undefined') localStorage.setItem('nbn_token', data.token);
        this.closeModal();
        this.updateHeaderAuth();
        if (window.playChime) window.playChime('success');
        if (this.currentRole === 'super_admin') {
          this.setTab('admin');
        } else {
          this.setTab('member');
        }
      } else {
        alert(data.error || 'உள்நுழைவு தோல்வியடைந்தது');
      }
    } catch (e) {
      console.error(e);
      alert('Login error');
    }
  }

  async submitLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;
    await this.quickLogin(identifier, password);
  }

  openRegisterModal() {
    const categories = this.db.categories || [];
    const chapters = this.db.chapters || [];
    const taluks = [
      { id: 'harur', name: 'ஹரூர் (Harur)' },
      { id: 'palacode', name: 'பாலக்கோடு (Palacode)' },
      { id: 'karimangalam', name: 'காரிமங்கலம் (Karimangalam)' },
      { id: 'dharmapuri_town', name: 'தருமபுரி டவுன் (Dharmapuri Town)' },
      { id: 'pennagaram', name: 'பென்னாகரம் (Pennagaram)' }
    ];

    const modalHtml = \`
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 modal-backdrop overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-1">
                🔒 1 தாலுகா • 1 சாப்டர் • 1 பிசினஸ் மட்டுமே
              </div>
              <h3 class="font-black text-slate-900 text-base sm:text-lg">புதிய வணிகர் பதிவு & மோனோபோலி சீட் முன்பதிவு</h3>
            </div>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
          </div>

          <form onsubmit="app.submitBusinessRegistration(event)" class="space-y-3.5 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">உரிமையாளர் பெயர் (Owner Name) *</label>
                <input type="text" id="reg-name" required placeholder="எ.கா: சுப்ரமணியம்" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">மொபைல் எண் (WhatsApp Phone) *</label>
                <input type="tel" id="reg-phone" required placeholder="9842XXXXXX" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">வணிகப் பெயர் (Shop / Business Name) *</label>
                <input type="text" id="reg-biz-name" required placeholder="எ.கா: ஸ்ரீ லட்சுமி ஜூவல்லர்ஸ்" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">கடவுச்சொல் (Set Password) *</label>
                <input type="password" id="reg-password" required value="password" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">தாலுகா வட்டம் (Taluk) *</label>
                <select id="reg-taluk" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
                  \${taluks.map(t => \`<option value="\${t.id}">\${t.name}</option>\`).join('')}
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">சாப்டர் / ஃபோரம் (Chapter) *</label>
                <select id="reg-chapter" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
                  \${chapters.map(c => \`<option value="\${c.id}">\${c.nameTa} (\${(c.talukId||'').toUpperCase()})</option>\`).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">வணிக வகை (100 Monopoly Categories) *</label>
              <select id="reg-category" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
                \${categories.map(c => \`<option value="\${c.id}">\${c.nameTa} (\${c.nameEn})</option>\`).join('')}
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">சிறப்பு சலுகை / சிறந்த விலை கேரண்டி *</label>
              <input type="text" id="reg-offer" required placeholder="எ.கா: 20% நேரடி தள்ளுபடி • குறைந்தபட்ச விலை கேரண்டி" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">கடை முகவரி (Shop Address)</label>
              <input type="text" id="reg-address" placeholder="எ.கா: மெயின் ரோடு, ஹரூர்" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              ⭐ <strong>Nuvea Studio சிறப்பு பலன்:</strong> பதிவு செய்தவுடன் உங்கள் கடைக்கு ₹25,000 மதிப்பிலான 4K சினிமாடிக் விளம்பர ரீல் & தனிப்பட்ட டிஜிட்டல் ஸ்டோர் லிங்க் உடனடியாக உருவாக்கப்படும்.
            </div>

            <button type="submit" class="w-full py-3.5 bg-brand-900 hover:bg-brand-950 text-white font-black rounded-xl text-xs sm:text-sm transition shadow-md">
              🚀 பதிவு செய்து மோனோபோலி சீட்டை பூட்டுங்கள்
            </button>
          </form>
        </div>
      </div>
    \`;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async submitBusinessRegistration(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    const businessName = document.getElementById('reg-biz-name').value;
    const talukId = document.getElementById('reg-taluk').value;
    const chapterId = document.getElementById('reg-chapter').value;
    const categoryId = document.getElementById('reg-category').value;
    const specialOffer = document.getElementById('reg-offer').value;
    const address = document.getElementById('reg-address').value;

    try {
      const res = await fetch('/api/auth/register-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, password, businessName, talukId, chapterId, categoryId, specialOffer, address
        })
      });
      const data = await res.json();
      if (res.ok) {
        this.token = data.token;
        this.currentUser = data.user;
        this.currentRole = 'member';
        if (typeof localStorage !== 'undefined') localStorage.setItem('nbn_token', data.token);
        await this.fetchData();
        this.closeModal();
        this.updateHeaderAuth();
        if (window.confetti) window.confetti({ particleCount: 120, spread: 80 });
        if (window.playChime) window.playChime('success');
        
        this.openRegistrationSuccessModal(data);
        this.setTab('member');
      } else {
        alert(data.error || 'பதிவு தோல்வியடைந்தது');
      }
    } catch (err) {
      console.error(err);
      alert('Registration error');
    }
  }

  openRegistrationSuccessModal(data) {
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://54d0f61bec8945.lhr.life';
    const storeUrl = \`\${origin}/#/biz/\${data.business.id}\`;
    const waShareText = encodeURIComponent(\`வணக்கம்! எங்கள் \${data.business.businessName} அதிகாரப்பூர்வமாக Nuvea Business Network-ல் இணைந்துள்ளது. எங்களின் டிஜிட்டல் ஸ்டோர்: \${storeUrl}\`);

    const modalHtml = \`
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
            ✓
          </div>
          <h3 class="text-xl font-black text-slate-900">வாழ்த்துகள் \${data.user.name}!</h3>
          <p class="text-xs text-slate-500 mt-1">உங்கள் <strong>\${data.business.businessName}</strong> வணிகக் கணக்கு மற்றும் 100% மோனோபோலி சீட் வெற்றிகரமாக பூட்டப்பட்டது!</p>

          <div class="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
            <div class="text-[11px] font-bold text-slate-700">🔗 உங்கள் பிரத்யேக டிஜிட்டல் ஸ்டோர் லிங்க்:</div>
            <input type="text" readonly value="\${storeUrl}" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800">
            <div class="flex items-center gap-2 pt-1">
              <button onclick="app.copyStoreLink('\${storeUrl}')" class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition">
                📋 லிங்க் நகலெடு
              </button>
              <a href="https://wa.me/?text=\${waShareText}" target="_blank" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs text-center transition">
                🟢 வாட்ஸ்அப் பகிர்
              </a>
            </div>
          </div>

          <button onclick="app.closeModal()" class="w-full mt-4 py-3 bg-brand-900 text-white font-black rounded-xl text-xs">
            என் வணிகக் கட்டுப்பாட்டு அறைக்கு செல் (Go to Dashboard)
          </button>
        </div>
      </div>
    \`;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async checkAuth() {
    if (!this.token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': \`Bearer \${this.token}\` }
      });
      if (res.ok) {
        const data = await res.json();
        this.currentUser = data.user;
        this.currentRole = data.user.role || 'member';
      } else {
        this.token = null;
        if (typeof localStorage !== 'undefined') localStorage.removeItem('nbn_token');
      }
    } catch (e) {
      console.warn('Auth check failed:', e);
    }
  }

  handleRoute() {
    if (typeof window === 'undefined' || !window.location) return;
    const hash = window.location.hash || '';
    if (hash.startsWith('#/biz/')) {
      const bizId = hash.replace('#/biz/', '').trim();
      if (bizId) {
        this.activeStoreBizId = bizId;
        this.currentTab = 'storefront';
        this.render();
        return;
      }
    } else if (hash === '#/admin') {
      this.currentTab = 'admin';
      this.render();
      return;
    } else if (hash === '#/member') {
      this.currentTab = 'member';
      this.render();
      return;
    } else if (hash === '#/map') {
      this.currentTab = 'map';
      this.render();
      return;
    } else if (hash === '#/opportunities') {
      this.currentTab = 'opportunities';
      this.render();
      return;
    }
  }

  updateHeaderAuth() {
    const container = document.getElementById('headerAuthContainer');
    if (!container) return;

    if (this.currentUser) {
      if (this.currentUser.role === 'super_admin') {
        container.innerHTML = \`
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="text-[11px] sm:text-xs font-bold text-amber-300">👑 \${this.currentUser.name}</span>
            <button onclick="app.setTab('admin')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-xs transition shadow-2xs">
              ⚙️ அட்மின் அறை
            </button>
            <button onclick="app.logout()" class="px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-white transition">
              🚪 வெளியேறு
            </button>
          </div>
        \`;
      } else {
        container.innerHTML = \`
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="text-[11px] sm:text-xs font-bold text-emerald-300">👤 \${this.currentUser.name}</span>
            <button onclick="app.setTab('member')" class="px-2.5 py-1 bg-brand-900 hover:bg-brand-950 text-white font-bold rounded-lg text-xs border border-brand-700 transition shadow-2xs">
              💼 வணிகக் கட்டுப்பாடு
            </button>
            <button onclick="app.logout()" class="px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-white transition">
              🚪 வெளியேறு
            </button>
          </div>
        \`;
      }
    } else {
      container.innerHTML = \`
        <div class="flex items-center gap-1.5 sm:gap-2">
          <button onclick="app.openLoginModal()" class="inline-flex items-center gap-1 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            <span>உள்நுழைக</span>
          </button>
          <button onclick="app.openRegisterModal()" class="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 px-3 py-1.5 rounded-lg transition shadow-xs">
            <span>➕ வணிகப் பதிவு</span>
          </button>
        </div>
      \`;
    }
  }

  logout() {
    this.token = null;
    this.currentUser = null;
    this.currentRole = 'public';
    if (typeof localStorage !== 'undefined') localStorage.removeItem('nbn_token');
    this.updateHeaderAuth();
    if (window.playChime) window.playChime('warning');
    this.setTab('consumer');
  }

  openStandaloneBiz(bizId) {
    this.activeStoreBizId = bizId;
    if (typeof window !== 'undefined' && window.location) {
      window.location.hash = \`#/biz/\${bizId}\`;
    }
    this.setTab('storefront');
  }
`;

code = code.replace('\n  closeModal() {', additions + '\n  closeModal() {');

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('Successfully updated app.js with Storefront, Login, Register, and Isolated Member Dashboard!');
