/* ============================================================
   GENESIS — Sidebar Navigation Component
   ============================================================ */

import { icon } from '../icons.js';

const navItems = [
  { section: 'Observatory', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', path: '#/dashboard' },
    { id: 'worlds', label: 'World Builder', icon: 'cube', path: '#/world-builder', badge: 'New' },
    { id: 'viewer', label: '3D Viewer', icon: 'eye', path: '#/viewer' },
  ]},
  { section: 'Simulation Lab', items: [
    { id: 'simulation', label: 'Simulation', icon: 'play', path: '#/simulation' },
    { id: 'predictions', label: 'Predictions', icon: 'brain', path: '#/predictions' },
    { id: 'analytics', label: 'Analytics', icon: 'barChart', path: '#/analytics' },
  ]},
  { section: 'Research', items: [
    { id: 'comparison', label: 'Comparison', icon: 'gitCompare', path: '#/comparison' },
    { id: 'timeline', label: 'Timeline', icon: 'clock', path: '#/timeline' },
  ]},
  { section: 'Data Lab', items: [
    { id: 'datasets', label: 'Datasets', icon: 'database', path: '#/datasets' },
    { id: 'models', label: 'Models', icon: 'cpu', path: '#/models' },
  ]},
  { section: 'System', items: [
    { id: 'admin', label: 'Admin', icon: 'shield', path: '#/admin' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '#/settings' },
  ]},
];

export function renderSidebar(activePath) {
  const currentHash = activePath || window.location.hash || '#/dashboard';

  return `
    <aside class="app-sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">
          ${icon('globe', 20)}
        </div>
        <div class="sidebar-brand-text">
          <span class="sidebar-brand-name">GENESIS</span>
          <span class="sidebar-brand-tag">Planetary Lab</span>
        </div>
      </div>

      <nav class="sidebar-nav no-scrollbar">
        ${navItems.map(section => `
          <div class="sidebar-section">
            <div class="sidebar-section-label">${section.section}</div>
            ${section.items.map(item => `
              <a href="${item.path}"
                 class="sidebar-link ${currentHash === item.path ? 'active' : ''}"
                 data-page="${item.id}"
                 aria-label="${item.label}"
                 aria-current="${currentHash === item.path ? 'page' : 'false'}">
                ${icon(item.icon, 20)}
                <span>${item.label}</span>
                ${item.badge ? `<span class="link-badge">${item.badge}</span>` : ''}
              </a>
            `).join('')}
          </div>
        `).join('')}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user" role="button" tabindex="0" aria-label="User profile">
          <div class="sidebar-avatar">HG</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">Harsh Gupta</div>
            <div class="sidebar-user-role">Researcher</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

export function updateSidebarActive(path) {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const isActive = link.getAttribute('href') === path;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}
