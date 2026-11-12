const fs = require('fs');

const appJsPath = 'C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/public/js/app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');

// 1. Ensure default tab is 'welcome' if not set
appJs = appJs.replace("this.currentTab = 'home';", "this.currentTab = 'welcome';");

// 2. Add handleRoute check for welcome
const oldRouteWelcome = `    } else if (hash === '#/home' || hash === '' || hash === '#/') {
      this.setTab('home');
      this.render();
      return;`;

const newRouteWelcome = `    } else if (hash === '#/welcome' || hash === '' || hash === '#/') {
      if (this.currentUser) {
        if (this.currentUser.role === 'super_admin') this.setTab('admin');
        else if (this.currentUser.role === 'customer') this.setTab('customer');
        else this.setTab('member');
      } else {
        this.setTab('welcome');
      }
      this.render();
      return;
    } else if (hash === '#/home') {
      this.setTab('home');
      this.render();
      return;`;

if (appJs.includes(oldRouteWelcome)) {
  appJs = appJs.replace(oldRouteWelcome, newRouteWelcome);
}

// 3. Add case 'welcome': in render()
const renderSwitchTarget = `    switch (this.currentTab) {`;
const renderSwitchWelcome = `    switch (this.currentTab) {
      case 'welcome':
        container.innerHTML = this.renderWelcomeRegistrationFirstView();
        break;`;

if (!appJs.includes("case 'welcome':")) {
  appJs = appJs.replace(renderSwitchTarget, renderSwitchWelcome);
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('Step 1: Set default route to welcome screen.');
