const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'public', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

console.log('--- ENHANCING NBN ENTERPRISE FRONTEND ---');

// 1. In constructor, set defaultTab to 'home' and ensure state variables
if (!code.includes("this.certificateSearchId = 'NBN-CERT-HAR-001';")) {
  code = code.replace(
    "this.activeStoreBizId = null;",
    `this.activeStoreBizId = null;
    this.certificateSearchId = 'NBN-CERT-HAR-001';
    this.timerSeconds = 45;
    this.timerCurrentSpeakerIdx = 0;
    this.activeReportType = 'growth';`
  );
  code = code.replace("this.currentTab = 'consumer';", "this.currentTab = 'home';");
}

// 2. In handleRoute(), support #/home, #/chapters, #/certificate, #/meetings, etc.
if (!code.includes("else if (hash === '#/chapters')")) {
  code = code.replace(
    "else if (hash === '#/map') {",
    `else if (hash === '#/home' || hash === '' || hash === '#/') {
      this.setTab('home');
      this.render();
      return;
    } else if (hash === '#/chapters') {
      this.setTab('chapters');
      this.render();
      return;
    } else if (hash.startsWith('#/verify-certificate/')) {
      this.certificateSearchId = hash.replace('#/verify-certificate/', '').trim();
      this.setTab('certificate');
      this.render();
      return;
    } else if (hash === '#/certificate') {
      this.setTab('certificate');
      this.render();
      return;
    } else if (hash === '#/map') {`
  );
}

// 3. In setTab(), support active class for #tab-home, #tab-chapters, #tab-certificate
if (!code.includes("'home', 'chapters', 'certificate'")) {
  code = code.replace(
    "['consumer', 'map', 'categories', 'opportunities', 'meeting', 'elevation']",
    "['home', 'chapters', 'categories', 'meeting', 'consumer', 'map', 'elevation', 'certificate', 'opportunities']"
  );
}

// 4. In render(), add case 'home', 'chapters', 'certificate'
if (!code.includes("case 'home':")) {
  code = code.replace(
    "switch (this.currentTab) {",
    `switch (this.currentTab) {
      case 'home':
        container.innerHTML = this.renderHomeView();
        break;
      case 'chapters':
        container.innerHTML = this.renderChaptersView();
        break;
      case 'certificate':
        container.innerHTML = this.renderCertificateVerificationView();
        break;`
  );
}

// 5. Replace renderMeetingView() with 90-minute structured agenda & live 45s timer & attendance
const meetingViewRegex = /renderMeetingView\(\)\s*\{[\s\S]*?\n  \/\/ VIEW 4: FOUR-LEVEL ELEVATION/;

const newMeetingView = `renderMeetingView() {
    const isTa = this.lang === 'ta';
    const s = (this.db && this.db.settings) || {};
    const chapters = this.db.chapters || [];
    const members = this.db.members || [];
    const queue = (this.db && this.db.speakerQueue) || [];
    const activeChapter = chapters.find(c => c.id === (this.selectedChapter !== 'all' ? this.selectedChapter : 'harur_titans')) || chapters[0] || {};

    const currentSpeaker = queue[this.timerCurrentSpeakerIdx % Math.max(1, queue.length)] || {
      name: 'சந்திரா',
      businessName: 'நுவேவா ஸ்டுடியோ',
      category: 'டிஜிட்டல் மார்க்கெட்டிங் & வீடியோ'
    };

    return \`
      <div class="space-y-8 max-w-5xl mx-auto">
        <!-- Meeting Header -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ஒழுங்கமைக்கப்பட்ட வாராந்திர 90-நிமிட காலை கூட்டம்</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              \${activeChapter.nameTa || 'ஹரூர் டைட்டன்ஸ்'} வாராந்திர பிசினஸ் மீட்டிங்
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              நடைபெறும் நேரம்: <strong class="text-slate-800">\${activeChapter.meetingDay || 'வெள்ளிக்கிழமை'} \${activeChapter.meetingTime || 'காலை 07:30 AM'}</strong> • இடம்: \${activeChapter.meetingVenue || 'ஹரூர் NBN பிசினஸ் சென்டர்'}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <a href="\${activeChapter.googleMeetUrl || 'https://meet.google.com/nbn-harur'}" target="_blank" class="px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5">
              <span>📹 Google Meet இணைப்பு</span>
            </a>
            <button onclick="app.openGuestModal('\${activeChapter.id}')" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5">
              <span>🎟️ பார்வையாளர் அழைப்பு</span>
            </button>
          </div>
        </div>

        <!-- 45-SECOND MEMBER INTRODUCTION LIVE TIMER (CORE OPERATIONAL TOOL) -->
        <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <!-- Left Info: Speaker Profile -->
            <div class="space-y-3 max-w-lg">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/30 uppercase tracking-wider">
                <span>⏱️ நேரலை 45-வினாடி உறுப்பினர் அறிமுகம்</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-black text-white leading-tight">
                \${currentSpeaker.businessName || currentSpeaker.name}
              </h3>
              <p class="text-slate-300 text-xs sm:text-sm">
                உறுப்பினர்: <strong class="text-amber-400">\${currentSpeaker.name || currentSpeaker.ownerName}</strong> • பிரிவு: <span class="bg-white/10 px-2 py-0.5 rounded font-mono">\${currentSpeaker.category || currentSpeaker.categoryId}</span>
              </p>
              <div class="text-[11px] text-slate-400 pt-1">
                💡 <strong>45-விதிமுறை:</strong> உங்கள் நிறுவனத்தின் பெயர், சிறப்பு சலுகை, மற்றும் இந்த வாரம் உங்களுக்கு தேவையான கிளையண்ட் யார் என்பதை சுருக்கமாகக் கூறவும்.
              </div>
            </div>

            <!-- Right: Countdown Ring & Controls -->
            <div class="flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
              <div class="text-5xl sm:text-6xl font-black font-mono tracking-wider text-amber-400 mb-3" id="live-timer-display">
                00:45
              </div>
              
              <div class="flex items-center gap-2">
                <button onclick="app.toggleMeetingTimer()" id="btn-timer-toggle" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition shadow-md">
                  ▶ தொடங்கு
                </button>
                <button onclick="app.resetMeetingTimer()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition border border-slate-700">
                  ↺ ரீசெட்
                </button>
                <button onclick="app.nextMeetingSpeaker()" class="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition">
                  அடுத்தவர் ➔
                </button>
              </div>

              <div class="text-[10px] text-slate-400 font-mono mt-2" id="timer-status-hint">
                45 வினாடி முடிந்ததும் ஆடியோ ஒலிக்கும்
              </div>
            </div>
          </div>
        </div>

        <!-- 90-MINUTE STRUCTURED AGENDA (STANDARD NBN PROTOCOL) -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-black text-slate-900 text-base sm:text-lg">📋 90-நிமிட மீட்டிங் நிகழ்ச்சி நிரல் (Meeting Agenda)</h3>
              <p class="text-xs text-slate-500 mt-0.5">ஒவ்வொரு வாரமும் துல்லியமாக பின்பற்றப்படும் தொழில் நெறிமுறை.</p>
            </div>
            <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">காலை 07:30 - 09:00 AM</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0">1</div>
              <div>
                <div class="font-extrabold text-slate-900">00–05 நிமிடம்: வரவேற்பு & அறிமுகம்</div>
                <div class="text-slate-500 mt-0.5">சாப்டர் தலைவர் வரவேற்புரை & நெட்வொர்க்கிங் தொடக்கம்.</div>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0">2</div>
              <div>
                <div class="font-extrabold text-slate-900">05–10 நிமிடம்: வணிகக் கல்வி (Education Slot)</div>
                <div class="text-slate-500 mt-0.5">விற்பனை உத்திகள், வாடிக்கையாளர் அணுகுமுறை பயிற்சி.</div>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-mono font-bold shrink-0">3</div>
              <div>
                <div class="font-extrabold text-slate-900">10–40 நிமிடம்: 45-வினாடி உறுப்பினர் அறிமுகம்</div>
                <div class="text-amber-900 mt-0.5">டைமர் மூலம் அனைத்து உறுப்பினர்களின் சுருக்கமான பிட்ச்.</div>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0">4</div>
              <div>
                <div class="font-extrabold text-slate-900">40–55 நிமிடம்: B2B லீட் பரிமாற்றம் (Referrals)</div>
                <div class="text-slate-500 mt-0.5">உறுப்பினர்கள் ஒருவருக்கொருவர் பரிந்துரைகளை அறிவித்தல்.</div>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0">5</div>
              <div>
                <div class="font-extrabold text-slate-900">55–70 நிமிடம்: சிறப்பு வணிக விளக்கவுரை (Feature)</div>
                <div class="text-slate-500 mt-0.5">தேர்வு செய்யப்பட்ட உறுப்பினரின் 10 நிமிட முழு விளக்கக்காட்சி.</div>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0">6</div>
              <div>
                <div class="font-extrabold text-slate-900">70–90 நிமிடம்: பார்வையாளர்கள் அறிமுகம் & நிறைவு</div>
                <div class="text-slate-500 mt-0.5">விருந்தினர் கருத்துகள், விருதுகள் வழங்குதல் & நன்றி உரை.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ATTENDANCE RECORDING MODULE -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-black text-slate-900 text-base sm:text-lg">⏱️ உறுப்பினர் வருகைப் பதிவு (Attendance Record)</h3>
              <p class="text-xs text-slate-500 mt-0.5">சாப்டர் செயலாளர் & நிர்வாகிகளுக்கான வருகை பதிவு பிரிவு.</p>
            </div>
            <span class="text-xs font-bold text-brand-900">\${members.length} உறுப்பினர்கள்</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-700 font-extrabold border-b">
                <tr>
                  <th class="p-3">உறுப்பினர் பெயர்</th>
                  <th class="p-3">வணிகம் & பிரிவு</th>
                  <th class="p-3">வருகை சதவீதம்</th>
                  <th class="p-3">இன்றைய நிலை பதிவு</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                \${members.slice(0, 8).map(m => \`
                  <tr class="hover:bg-slate-50">
                    <td class="p-3 font-bold text-slate-900">\${m.ownerName}</td>
                    <td class="p-3 text-slate-600">\${m.businessName}</td>
                    <td class="p-3 font-bold text-emerald-700">\${m.attendance || 100}%</td>
                    <td class="p-3">
                      <div class="flex items-center gap-1.5">
                        <button onclick="app.markAttendance('\${m.id}', 'present')" class="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold text-[11px] transition">வருகை ✓</button>
                        <button onclick="app.markAttendance('\${m.id}', 'late')" class="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-bold text-[11px] transition">தாமதம்</button>
                        <button onclick="app.markAttendance('\${m.id}', 'absent')" class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-bold text-[11px] transition">வரவில்லை</button>
                      </div>
                    </td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    \`;
  }

  // VIEW 4: FOUR-LEVEL ELEVATION`;

code = code.replace(meetingViewRegex, newMeetingView);

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('✓ Successfully enhanced meeting view with 90m agenda & timer');
