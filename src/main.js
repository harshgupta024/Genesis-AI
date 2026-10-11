/* ============================================================
   GENESIS — Main Application Entry Point
   ============================================================ */

import { CosmicBackground } from './js/utils/cosmic-bg.js';
let shellCosmic = null;

// CSS Imports
import './css/tokens.css';
import './css/reset.css';
import './css/components.css';
import './css/layout.css';
import './css/animations.css';
import './css/pages/landing.css';
import './css/pages/pages.css';

// JS Imports
import { router } from './js/router.js';
import { loadRealDatasets } from './js/utils/data-service.js';
import { renderSidebar, updateSidebarActive } from './js/components/sidebar.js';
import { renderTopbar, initTopbar } from './js/components/topbar.js';
import { renderCommandPalette, initCommandPalette } from './js/components/command-palette.js';

// Pages
import { renderLanding } from './js/pages/landing.js';
import { renderDashboard, initDashboard } from './js/pages/dashboard.js';
import { renderWorldBuilder, initWorldBuilder } from './js/pages/world-builder.js';
import { renderViewer, initViewer } from './js/pages/viewer.js';
import { renderSimulation, initSimulation } from './js/pages/simulation.js';
import { renderPredictions, initPredictions } from './js/pages/predictions.js';
import { renderAnalytics, initAnalytics } from './js/pages/analytics.js';
import {
  renderComparison, initComparison,
  renderTimeline, initTimeline,
  renderDatasets, initDatasets,
  renderModels,
  renderAdmin,
  renderSettings,
  renderAuth,
} from './js/pages/additional.js';

const app = document.getElementById('app');

// Pages that use the app shell (sidebar + topbar)
const shellPages = new Set([
  '#/dashboard', '#/world-builder', '#/viewer', '#/simulation',
  '#/predictions', '#/analytics', '#/comparison', '#/timeline',
  '#/datasets', '#/models', '#/admin', '#/settings',
]);

// Full-page layouts (no shell)
const fullPages = new Set(['/', '#/', '#/auth']);

function renderShell(path, contentHTML) {
  // Clean up previous cosmic bg
  if (shellCosmic) { shellCosmic.destroy(); shellCosmic = null; }

  app.innerHTML = `
    ${renderSidebar(path)}
    <div class="app-main" id="app-main-cosmic">
      ${renderTopbar(path)}
      <main class="app-content" id="page-content" role="main">
        ${contentHTML}
      </main>
    </div>
    ${renderCommandPalette()}
  `;
  updateSidebarActive(path);
  initTopbar();
  initCommandPalette();

  // Initialize subtle cosmic background behind content
  const mainEl = document.getElementById('app-main-cosmic');
  if (mainEl) {
    shellCosmic = new CosmicBackground(mainEl, {
      subtle: true,
      opacity: 0.6,
    });
  }
}

function navigateTo(path) {
  // Scroll to top
  window.scrollTo(0, 0);

  // Clean up shell cosmic bg on full-page navigation
  if (fullPages.has(path) && shellCosmic) {
    shellCosmic.destroy();
    shellCosmic = null;
  }

  switch (path) {
    case '/':
    case '#/':
      renderLanding();
      break;

    case '#/auth':
      renderAuth();
      break;

    case '#/dashboard':
      renderShell(path, renderDashboard());
      requestAnimationFrame(() => initDashboard());
      break;

    case '#/world-builder':
      renderShell(path, renderWorldBuilder());
      requestAnimationFrame(() => initWorldBuilder());
      break;

    case '#/viewer':
      renderShell(path, renderViewer());
      requestAnimationFrame(() => initViewer());
      break;

    case '#/simulation':
      renderShell(path, renderSimulation());
      requestAnimationFrame(() => initSimulation());
      break;

    case '#/predictions':
      renderShell(path, renderPredictions());
      requestAnimationFrame(() => initPredictions());
      break;

    case '#/analytics':
      renderShell(path, renderAnalytics());
      requestAnimationFrame(() => initAnalytics());
      break;

    case '#/comparison':
      renderShell(path, renderComparison());
      requestAnimationFrame(() => initComparison());
      break;

    case '#/timeline':
      renderShell(path, renderTimeline());
      requestAnimationFrame(() => initTimeline());
      break;

    case '#/datasets':
      renderShell(path, renderDatasets());
      requestAnimationFrame(() => initDatasets());
      break;

    case '#/models':
      renderShell(path, renderModels());
      break;

    case '#/admin':
      renderShell(path, renderAdmin());
      break;

    case '#/settings':
      renderShell(path, renderSettings());
      break;

    default:
      renderShell('#/dashboard', renderDashboard());
      requestAnimationFrame(() => initDashboard());
  }
}

// Register all routes
[
  '/', '#/', '#/dashboard', '#/world-builder', '#/viewer', '#/simulation',
  '#/predictions', '#/analytics', '#/comparison', '#/timeline',
  '#/datasets', '#/models', '#/admin', '#/settings', '#/auth',
].forEach(path => {
  router.register(path, () => navigateTo(path));
});

// Load real datasets then start
loadRealDatasets().then(() => router.resolve());

// Re-render current page when active world changes
window.addEventListener('genesis:world-changed', () => {
  const hash = window.location.hash || '#/dashboard';
  navigateTo(hash);
});

// Log
console.log(
  '%c✦ Genesis %cv1.0.0 %c— Planetary Research Laboratory',
  'color:#c47a5a;font-weight:bold;font-size:14px',
  'color:#7a9e8e;font-size:12px',
  'color:#9a9590;font-size:12px'
);
