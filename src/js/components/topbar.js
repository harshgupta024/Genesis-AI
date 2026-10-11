import { icon } from '../icons.js';
import { getWorlds, getActiveWorld, setActiveWorldId } from '../utils/world-manager.js';

const breadcrumbMap = {
  '#/dashboard': ['Dashboard'],
  '#/world-builder': ['Worlds', 'World Builder'],
  '#/viewer': ['Worlds', '3D Viewer'],
  '#/simulation': ['Simulation', 'Control Center'],
  '#/predictions': ['Analysis', 'Predictions'],
  '#/analytics': ['Analysis', 'Analytics'],
  '#/comparison': ['Analysis', 'Scenario Comparison'],
  '#/timeline': ['Analysis', 'Timeline Explorer'],
  '#/datasets': ['Data', 'Datasets'],
  '#/models': ['Data', 'Models'],
  '#/admin': ['System', 'Admin Dashboard'],
  '#/settings': ['System', 'Settings'],
};

export function renderTopbar(path) {
  const crumbs = breadcrumbMap[path] || ['Dashboard'];
  const worlds = getWorlds();
  const activeWorld = getActiveWorld();

  return `
    <header class="app-topbar" role="banner">
      <nav class="topbar-breadcrumbs" aria-label="Breadcrumb">
        <span>${icon('home', 14)}</span>
        ${crumbs.map((crumb, i) => `
          <span class="separator">/</span>
          <span class="${i === crumbs.length - 1 ? 'current' : ''}">${crumb}</span>
        `).join('')}
      </nav>

      <!-- Global Active World Selector -->
      <div class="topbar-world-selector" style="display:flex;align-items:center;gap:8px;margin-left:var(--space-4);margin-right:auto">
        <span style="font-size:var(--text-2xs);font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;display:flex;align-items:center;gap:4px">
          ${icon('globe', 14)} Planet:
        </span>
        <select id="global-world-select" class="select" style="padding:4px 28px 4px 8px;font-size:var(--text-xs);font-weight:600;height:30px;min-width:140px;background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-sm)" aria-label="Select active planet">
          ${worlds.map(w => `<option value="${w.id}" ${activeWorld && activeWorld.id === w.id ? 'selected' : ''}>${w.name} [${w.climate}]</option>`).join('')}
        </select>
        <a href="#/world-builder" class="btn btn-ghost btn-sm" style="padding:4px 8px;font-size:var(--text-xs);height:30px;display:flex;align-items:center" title="Build New Planet">
          ${icon('plus', 14)} New
        </a>
      </div>

      <div class="topbar-actions">
        <div class="topbar-search" id="search-trigger" role="button" tabindex="0" aria-label="Search or use command palette">
          ${icon('search', 16)}
          <span>Search...</span>
          <span class="kbd">⌘K</span>
        </div>

        <button class="btn-icon notification-btn" id="notification-btn" aria-label="Notifications">
          ${icon('bell', 20)}
          <span class="dot"></span>
        </button>

        <button class="btn-icon" id="theme-toggle" aria-label="Toggle theme">
          ${icon('moon', 20)}
        </button>
      </div>
    </header>
  `;
}

export function initTopbar() {
  const select = document.getElementById('global-world-select');
  if (select) {
    select.addEventListener('change', (e) => {
      setActiveWorldId(e.target.value);
    });
  }
}

