const fs = require('fs');
const vm = require('vm');

async function test() {
  const stateRes = await fetch('http://localhost:3000/api/state');
  const stateData = await stateRes.json();
  const code = fs.readFileSync('C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/public/js/app.js', 'utf8');

  const domElements = {};
  function makeElem(id = '') {
    return { id, innerHTML: '', textContent: '', className: '', classList: { add: () => {}, remove: () => {}, contains: () => false }, style: {}, value: '', querySelectorAll: () => [], scrollIntoView: () => {} };
  }

  const documentMock = {
    getElementById: (id) => domElements[id] || (domElements[id] = makeElem(id)),
    querySelectorAll: () => [makeElem(), makeElem()],
    addEventListener: () => {}
  };

  const windowMock = {
    location: { origin: 'http://localhost:3000', hash: '', pathname: '/' },
    addEventListener: () => {},
    scrollTo: () => {},
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: global.fetch
  };

  const LMock = {
    map: () => ({ setView: function() { return this; }, fitBounds: function() { return this; }, remove: function() { return this; }, invalidateSize: function() { return this; } }),
    tileLayer: () => ({ addTo: () => ({}) }),
    divIcon: () => ({}),
    polyline: () => ({ addTo: () => ({}) }),
    marker: () => ({ addTo: function() { return this; }, bindPopup: function() { return this; }, openPopup: function() { return this; } })
  };

  const context = { window: windowMock, document: documentMock, localStorage: windowMock.localStorage, fetch: global.fetch, L: LMock, setTimeout: fn => fn(), setInterval: () => 1, clearInterval: () => {}, console, encodeURIComponent };
  vm.createContext(context);
  vm.runInContext(code, context);

  const app = context.app || context.window.app;
  app.db = stateData;

  console.log('--- 1. VERIFYING FIRST PAGE (REGISTRATION FIRST) ---');
  app.currentTab = 'welcome';
  app.render();
  const welcomeHtml = documentMock.getElementById('app-content').innerHTML;

  console.log('Headline present:', welcomeHtml.includes('WELCOME TO NBN') && welcomeHtml.includes('NUVEA BUSINESS NETWORK'));
  console.log('Subtitle present:', welcomeHtml.includes('Choose how you want to grow your business with NBN.'));
  console.log('Option A present:', welcomeHtml.includes('Business Owner: Networking + Marketplace'));
  console.log('Option B present:', welcomeHtml.includes('Business Owner: Marketplace Only'));
  console.log('Option C present:', welcomeHtml.includes('Customer'));
  console.log('Admin Access button present:', welcomeHtml.includes('Admin Login'));

  console.log('\n--- 2. VERIFYING MULTI-STEP OWNER REGISTRATION ---');
  app.openMultiStepOwnerModal('networking_marketplace');
  let modalHtml = documentMock.getElementById('modal-container').innerHTML;
  console.log('Step 1 rendered:', modalHtml.includes('படி 1: வணிக உரிமையாளர் விவரங்கள்'));

  app.regData.fullName = 'கார்த்திக் குமார்';
  app.regData.phone = '9876543210';
  app.regStep = 2;
  app.renderMultiStepOwnerModal();
  modalHtml = documentMock.getElementById('modal-container').innerHTML;
  console.log('Step 2 rendered:', modalHtml.includes('படி 2: நிறுவன / வணிக விவரங்கள்'));

  app.regStep = 3;
  app.renderMultiStepOwnerModal();
  modalHtml = documentMock.getElementById('modal-container').innerHTML;
  console.log('Step 3 rendered:', modalHtml.includes('படி 3: தயாரிப்புகள் மற்றும் சேவைகள்'));

  app.regStep = 4;
  app.renderMultiStepOwnerModal();
  modalHtml = documentMock.getElementById('modal-container').innerHTML;
  console.log('Step 4 rendered:', modalHtml.includes('படி 4: உங்கள் NBN கணக்கு வகை') && modalHtml.includes('preferredChapterId'));

  app.regStep = 5;
  app.renderMultiStepOwnerModal();
  modalHtml = documentMock.getElementById('modal-container').innerHTML;
  console.log('Step 5 rendered:', modalHtml.includes('படி 5: ஆவணங்கள் மற்றும் உறுதிமொழி'));

  app.regStep = 6;
  app.renderMultiStepOwnerModal();
  modalHtml = documentMock.getElementById('modal-container').innerHTML;
  console.log('Step 6 rendered:', modalHtml.includes('படி 6: விண்ணப்ப மதிப்பாய்வு'));

  console.log('\n--- 3. VERIFYING CUSTOMER REGISTRATION MODAL ---');
  app.openCustomerRegisterModal();
  const custModalHtml = documentMock.getElementById('modal-container').innerHTML;
  console.log('Customer modal rendered:', custModalHtml.includes('வாடிக்கையாளர் பதிவு (Customer Register)'));

  console.log('\n--- 4. VERIFYING UPGRADE ACCOUNT MODAL ---');
  app.openUpgradeAccountModal();
  const upModalHtml = documentMock.getElementById('modal-container').innerHTML;
  console.log('Upgrade modal rendered:', upModalHtml.includes('வணிகக் கணக்காக மேம்படுத்து'));
}

test().catch(console.error);
