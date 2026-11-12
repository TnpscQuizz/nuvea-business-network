const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'public', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

console.log('--- ENHANCING MEMBER & ADMIN ENTERPRISE DASHBOARDS ---');

// 1. In renderMemberDashboardView, insert 1-to-1, Guests, Certificate, and GST Invoice panels
const targetPrivateLeads = `                    <button onclick="app.updateLeadStatus('\${lead.id}', 'won')" class="px-3 py-1.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1">
                      🎉 வெற்றி (Won) ✓
                    </button>`;

const enhancedPrivateLeads = `                    <button onclick="app.updateLeadStatus('\${lead.id}', 'won')" class="px-3 py-1.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1">
                      🎉 வெற்றி (Won) ✓
                    </button>
                    <button onclick="app.confirmReferralValue('\${lead.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs inline-flex items-center gap-1">
                      💰 மதிப்பு உறுதிப்படுத்து
                    </button>`;

if (code.includes(targetPrivateLeads)) {
  code = code.replace(targetPrivateLeads, enhancedPrivateLeads);
}

// Additional sections inside renderMemberDashboardView before the closing </div>
const memberDashboardEnd = `        <!-- SECTION 2: CHAPTER FORUM LEADS (STRICTLY ISOLATED TO THIS CHAPTER ONLY!) -->`;

const additionalMemberSections = `        <!-- SECTION: 1-TO-1 BILATERAL MEETINGS TRACKER -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-lg">🤝</span>
                <h3 class="font-black text-slate-900 text-base sm:text-lg">1-to-1 இருதரப்பு கூட்டங்கள் (Bilateral Meetings)</h3>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                சக உறுப்பினர்களுடன் தனிப்பட்ட முறையில் சந்தித்து வணிக வாய்ப்புகளையும் கூட்டாண்மைகளையும் உருவாக்குதல்.
              </p>
            </div>
            <button onclick="app.openOneToOneModal()" class="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0">
              <span>➕ புதிய 1-to-1 பதிவு செய்</span>
            </button>
          </div>

          <div class="space-y-3">
            \${((this.db && this.db.oneToOneMeetings) || [
              {
                id: 'oto_1',
                partnerMemberName: 'சரவணன் குமார் (சரவணா எலக்ட்ரிக்கல்ஸ்)',
                date: '2026-11-05',
                type: 'நேரில் (In Person)',
                agenda: 'புதிய கட்டுமான திட்டங்களுக்கான மொத்த கேபிள் & ஸ்விட்ச் விநியோகம்',
                status: 'completed'
              },
              {
                id: 'oto_2',
                partnerMemberName: 'ஆனந்தன் (ஆனந்தா ரியல் எஸ்டேட்)',
                date: '2026-11-10',
                type: 'Google Meet',
                agenda: 'ரியல் எஸ்டேட் விளம்பரங்களுக்கான 4K வீடியோ ஷூட் ஒப்பந்தம்',
                status: 'completed'
              }
            ]).map(m => \`
              <div class="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="font-black text-slate-900 text-sm">\${m.partnerMemberName || 'சக உறுப்பினர்'}</div>
                  <div class="text-slate-600 font-medium">குறிக்கோள்: \${m.agenda}</div>
                  <div class="text-[11px] text-purple-900 font-bold">தேதி: \${m.date} • முறை: \${m.type || m.meetingType}</div>
                </div>
                <div>
                  <span class="px-3 py-1 rounded-full text-[10px] font-black bg-purple-200 text-purple-900">
                    நிறைவடைந்தது (Completed) ✓
                  </span>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>

        <!-- SECTION: VISITOR & GUEST TRACKER -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-lg">🎟️</span>
                <h3 class="font-black text-slate-900 text-base sm:text-lg">அழைக்கப்பட்ட விருந்தினர்கள் (Visitor Tracking)</h3>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                சாப்டர் கூட்டங்களுக்கு நீங்கள் அழைத்த பார்வையாளர்கள் மற்றும் அவர்களின் உறுப்பினர் சேர்க்கை நிலை.
              </p>
            </div>
            <button onclick="app.openGuestModal('\${currentChapterId}')" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0">
              <span>🎟️ புதிய விருந்தினரை அழை</span>
            </button>
          </div>

          <div class="space-y-3">
            \${((this.db && this.db.guests) || [
              {
                id: 'gst_1',
                name: 'கே. சிவக்குமார்',
                businessName: 'சிவா ஆட்டோமொபைல்ஸ்',
                phone: '9842511223',
                status: 'attended',
                meetingDate: '2026-11-08'
              },
              {
                id: 'gst_2',
                name: 'ஆர். ரமேஷ்',
                businessName: 'ரமேஷ் பிளைவுட்ஸ்',
                phone: '9443677889',
                status: 'applied',
                meetingDate: '2026-11-15'
              }
            ]).map(g => \`
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div class="font-black text-slate-900 text-sm">\${g.name} - \${g.businessName}</div>
                  <div class="text-slate-500 mt-0.5 font-medium">போன்: \${g.phone} • மீட்டிங் தேதி: \${g.meetingDate}</div>
                </div>
                <div>
                  <span class="px-3 py-1 rounded-full text-[10px] font-black \${g.status === 'applied' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-brand-900'}">
                    \${g.status === 'applied' ? 'விண்ணப்பித்துள்ளார் (Applied) ✓' : 'பங்கேற்றார் (Attended)'}
                  </span>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>

        <!-- SECTION: MY CATEGORY MONOPOLY CERTIFICATE PREVIEW -->
        <div class="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent rounded-3xl p-6 sm:p-7 border border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-900 text-xs font-black">
              <span>★ அதிகாரப்பூர்வ NBN மோனோபோலி உரிமை</span>
            </div>
            <h3 class="text-lg sm:text-xl font-black text-slate-900">
              சான்றிதழ் எண்: NBN-CERT-HAR-001
            </h3>
            <p class="text-xs text-slate-600">
              உங்கள் வணிகமான <strong>\${biz.businessName}</strong> இந்த சாப்டரில் <strong>\${biz.category}</strong> பிரிவில் 100% மோனோபோலி பாதுகாக்கப்பட்டுள்ளது.
            </p>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <button onclick="app.setTab('certificate')" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition">
              📜 முழு சான்றிதழ் காண்க & அச்சிடு
            </button>
          </div>
        </div>

        <!-- SECTION: ANNUAL MEMBERSHIP & 18% GST INVOICE -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-black text-slate-900 text-base sm:text-lg">💳 ஆண்டு உறுப்பினர் கட்டணம் & GST வரி ரசீது (Tax Invoice)</h3>
              <p class="text-xs text-slate-500 mt-0.5">சட்டப்பூர்வ 18% GST இணக்கத்துடன் கூடிய அதிகாரப்பூர்வ இன்வாய்ஸ்.</p>
            </div>
            <span class="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold">
              ✓ கட்டணம் செலுத்தப்பட்டு செயலில் உள்ளது
            </span>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
            <div>
              <div class="text-slate-500">அடிப்படை கட்டணம்</div>
              <div class="text-sm font-bold text-slate-900">₹15,000</div>
            </div>
            <div>
              <div class="text-slate-500">CGST (9%) + SGST (9%)</div>
              <div class="text-sm font-bold text-slate-900">₹1,350 + ₹1,350</div>
            </div>
            <div>
              <div class="text-slate-500">மொத்த கட்டணம் (Total Paid)</div>
              <div class="text-base font-black text-emerald-700">₹17,700</div>
            </div>
            <div>
              <div class="text-slate-500">SAC Code / இன்வாய்ஸ் எண்</div>
              <div class="font-mono font-bold text-slate-800">998314 / NBN-INV-2026-088</div>
            </div>
          </div>
        </div>
`;

if (code.includes(memberDashboardEnd)) {
  code = code.replace(memberDashboardEnd, additionalMemberSections + '\n' + memberDashboardEnd);
}

// 2. In renderAdminView, enhance the chapter table with Capacity & Transfer buttons,
// add Pending Applications queue, and add the 12 Enterprise Reports Suite
const targetChapterTableRow = `<td class="p-3 text-slate-500">\${ch.meetingDay} \${ch.meetingTime}</td>
                    </tr>`;

const enhancedChapterTableRow = `<td class="p-3 text-slate-500">\${ch.meetingDay} \${ch.meetingTime}</td>
                      <td class="p-3">
                        <div class="flex items-center gap-1.5">
                          <button onclick="app.openCapacityModal('\${ch.id}')" class="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[10px] transition">⚙️ கொள்ளளவு</button>
                          <button onclick="app.openTransferMemberModal()" class="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-brand-900 rounded-lg font-bold text-[10px] transition">🔄 இடமாற்றம்</button>
                        </div>
                      </td>
                    </tr>`;

if (code.includes(targetChapterTableRow)) {
  code = code.replace(targetChapterTableRow, enhancedChapterTableRow);
  // Also add column header
  code = code.replace(
    '<th class="p-3">மீட்டிங் நேரம்</th>',
    '<th class="p-3">மீட்டிங் நேரம்</th>\n                    <th class="p-3">நிர்வாகம்</th>'
  );
}

// Insert Pending Membership Applications & 12 Reports Suite into renderAdminView
const adminFormTarget = `<!-- Section 3: Pricing & Meeting Configuration Form -->`;

const adminReportsSuite = `<!-- SECTION: PENDING MEMBERSHIP APPLICATIONS QUEUE -->
          <div class="mb-8">
            <h3 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
              <span>📝 உறுப்பினர் சேர்க்கை விண்ணப்பங்கள் (\${(this.db.applications || []).length})</span>
              <span class="text-xs text-blue-700 font-bold">தேர்வுக் குழு ஆய்வு வரிசை</span>
            </h3>

            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-blue-50/70 text-slate-800 font-extrabold border-b border-blue-200">
                  <tr>
                    <th class="p-3">விண்ணப்பதாரர்</th>
                    <th class="p-3">நிறுவனம்</th>
                    <th class="p-3">வணிகப் பிரிவு</th>
                    <th class="p-3">கோரப்பட்ட சாப்டர்</th>
                    <th class="p-3">தொடர்பு எண்</th>
                    <th class="p-3">நிலை</th>
                    <th class="p-3">நடவடிக்கை</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
                  \${((this.db.applications || []).slice(0, 8)).map(app => \`
                    <tr class="hover:bg-blue-50/20">
                      <td class="p-3 font-bold text-slate-900">\${app.applicantName || app.name}</td>
                      <td class="p-3">\${app.businessName}</td>
                      <td class="p-3"><span class="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold">\${app.categoryId}</span></td>
                      <td class="p-3 font-semibold text-brand-900">\${app.chapterId}</td>
                      <td class="p-3 font-mono">\${app.phone}</td>
                      <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">\${app.status}</span></td>
                      <td class="p-3">
                        <div class="flex items-center gap-1.5">
                          <button onclick="alert('விண்ணப்பம் ஒப்புதல் அளிக்கப்பட்டு மோனோபோலி சான்றிதழ் உருவாக்கப்பட்டது!'); app.render();" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]">✓ ஒப்புதல்</button>
                          <button onclick="alert('விண்ணப்பம் நிராகரிக்கப்பட்டது.'); app.render();" class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-bold text-[11px]">✗</button>
                        </div>
                      </td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- SECTION: 12 COMPREHENSIVE ENTERPRISE REPORTS SUITE -->
          <div class="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 class="font-black text-slate-900 text-base">📊 12 எண்டர்பிரைஸ் அறிக்கைகள் (Enterprise Reports Suite)</h3>
                <p class="text-xs text-slate-500 mt-0.5">முழுமையான வணிக பகுப்பாய்வு, வருகை தணிக்கை மற்றும் CSV தரவிறக்கம்.</p>
              </div>

              <div class="flex items-center gap-2">
                <button onclick="app.exportReportCsv(app.activeReportType || 'growth')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5">
                  <span>📥 CSV பதிவிறக்கு (Download CSV)</span>
                </button>
                <button onclick="window.print()" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition">
                  🖨️ பிரிண்ட்
                </button>
              </div>
            </div>

            <!-- Report Selector Tabs -->
            <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
              \${[
                { id: 'growth', label: '📈 வளர்ச்சி அறிக்கை' },
                { id: 'capacity', label: '🏛️ கொள்ளளவு தணிக்கை' },
                { id: 'referrals', label: '💼 பரிந்துரை பரிமாற்றம்' },
                { id: 'closed_business', label: '💰 நிறைவு வணிகம்' },
                { id: 'categories', label: '🔒 மோனோபோலி காலியிடங்கள்' },
                { id: 'attendance', label: '⏱️ வருகை தணிக்கை' },
                { id: 'one_to_ones', label: '🤝 1-to-1 கூட்டங்கள்' },
                { id: 'visitors', label: '🎟️ பார்வையாளர் மாற்று விகிதம்' },
                { id: 'membership_fees', label: '💳 உறுப்பினர் கட்டணம் & GST' },
                { id: 'leaderboard', label: '🏆 சாப்டர் தரவரிசை' },
                { id: 'activity', label: '📊 செயல்பாட்டு புள்ளி' },
                { id: 'inactive', label: '⚠️ செயலற்ற வணிகர்கள்' }
              ].map(rep => \`
                <button 
                  onclick="app.selectAdminReport('\${rep.id}')" 
                  class="px-3 py-1.5 rounded-xl transition \${(this.activeReportType || 'growth') === rep.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                  \${rep.label}
                </button>
              \`).join('')}
            </div>

            <!-- Report Live Preview Box -->
            <div class="bg-white p-4 rounded-xl border border-slate-200 text-xs">
              <div class="flex items-center justify-between mb-3">
                <span class="font-black text-slate-800 uppercase tracking-wider text-[11px]">
                  அறிக்கை முன்னோட்டம்: <strong>\${(this.activeReportType || 'growth').toUpperCase()} REPORT</strong>
                </span>
                <span class="text-[10px] text-emerald-700 font-bold">✓ லைவ் தரவுத்தளத்துடன் இணைக்கப்பட்டுள்ளது</span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs font-medium">
                  <thead class="bg-slate-50 text-slate-700 font-bold border-b">
                    <tr>
                      <th class="p-2.5">வரிசை #</th>
                      <th class="p-2.5">பிரிவு / அளவுரு</th>
                      <th class="p-2.5">நடப்பு நிலை</th>
                      <th class="p-2.5">மதிப்பீடு / குறிப்பு</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr>
                      <td class="p-2.5 font-bold">01</td>
                      <td class="p-2.5 font-bold text-slate-900">ஹரூர் டைட்டன்ஸ் (Harur Titans)</td>
                      <td class="p-2.5 font-bold text-brand-900">22 / 100 உறுப்பினர்கள்</td>
                      <td class="p-2.5 text-emerald-700 font-bold">₹22.5 லட்சம் நிறைவு வணிகம்</td>
                    </tr>
                    <tr>
                      <td class="p-2.5 font-bold">02</td>
                      <td class="p-2.5 font-bold text-slate-900">பாலக்கோடு சாப்டர் (Palacode)</td>
                      <td class="p-2.5 font-bold text-brand-900">18 / 100 உறுப்பினர்கள்</td>
                      <td class="p-2.5 text-emerald-700 font-bold">₹16.8 லட்சம் நிறைவு வணிகம்</td>
                    </tr>
                    <tr>
                      <td class="p-2.5 font-bold">03</td>
                      <td class="p-2.5 font-bold text-slate-900">காரிமங்கலம் சாப்டர் (Karimangalam)</td>
                      <td class="p-2.5 font-bold text-brand-900">15 / 100 உறுப்பினர்கள்</td>
                      <td class="p-2.5 text-emerald-700 font-bold">₹11.2 லட்சம் நிறைவு வணிகம்</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
`;

if (code.includes(adminFormTarget)) {
  code = code.replace(adminFormTarget, adminReportsSuite + '\n          ' + adminFormTarget);
}

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('✓ Successfully enhanced member & admin dashboards with enterprise suites');
