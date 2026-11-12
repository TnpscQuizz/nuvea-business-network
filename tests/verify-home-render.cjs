const fs = require('fs');
const vm = require('vm');

async function check() {
  const stateRes = await fetch('http://localhost:3000/api/state');
  const stateData = await stateRes.json();

  const domElements = {};
  function makeElem(id = '') {
    return {
      id,
      innerHTML: '',
      textContent: '',
      className: '',
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      style: {},
      value: '',
      querySelectorAll: () => [],
      scrollIntoView: () => {}
    };
  }

  const documentMock = {
    getElementById: (id) => {
      if (!domElements[id]) domElements[id] = makeElem(id);
      return domElements[id];
    },
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

  const code = fs.readFileSync('C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/public/js/app.js', 'utf-8');
  const context = {
    window: windowMock,
    document: documentMock,
    localStorage: windowMock.localStorage,
    fetch: global.fetch,
    L: LMock,
    setTimeout: (fn) => fn(),
    setInterval: () => 1,
    clearInterval: () => {},
    console: console,
    encodeURIComponent: encodeURIComponent
  };

  vm.createContext(context);
  vm.runInContext(code, context);

  const app = context.app || context.window.app;
  app.db = stateData;
  app.currentTab = 'home';
  app.render();

  const html = documentMock.getElementById('app-content').innerHTML;

  console.log('--- VERIFYING HOME SCREEN COMPONENTS ---');
  console.log('1. Search input present:', html.includes('home-master-search-input'));
  console.log('2. Landmark filter tags present:', html.includes('காளியம்மன் கோவில்'));
  console.log('3. Director Avatar present:', html.includes('directorPhoto') || html.includes('சாப்டர் இயக்குனர்'));
  console.log('4. Leads Generated Metric present:', html.includes('பரிமாறப்பட்ட லீட்கள்') || html.includes('லீட்கள்'));
  console.log('5. Chapter Capacity & Seats present:', html.includes('Chapter Capacity & Seats (சாப்டர் சீட்கள்)'));
  console.log('6. Category Exclusivity present:', html.includes('Category Exclusivity'));
  console.log('7. Urgent Vacancy tag present:', html.includes('urgent-vacancy-pulse'));
  console.log('8. Leaflet Map container present:', html.includes('nbn-home-leaflet-map'));

  // Test search interaction
  console.log('\n--- TESTING LIVE SEARCH ENGINE ---');
  app.onHomeSearchInput('காளியம்மன்');
  const searchHtml = documentMock.getElementById('app-content').innerHTML;
  console.log('Search for காளியம்மன் produced filtered view:', searchHtml.includes('தேடல் முடிவுகள்'));

  app.setHomeTalukFilter('harur');
  const talukHtml = documentMock.getElementById('app-content').innerHTML;
  console.log('Set Taluk to harur produced view:', talukHtml.includes('ஹரூர் டைட்டன்ஸ் சாப்டர்'));

  app.clearHomeFilters();
  const clearedHtml = documentMock.getElementById('app-content').innerHTML;
  console.log('Clear filters reset successfully:', !clearedHtml.includes('தேடல் முடிவுகள்'));
}

check().catch(console.error);
