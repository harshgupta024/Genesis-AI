/* ============================================================
   GENESIS AI — Command Palette Component
   ============================================================ */

import { icon } from '../icons.js';

const commands = [
  { group: 'Navigation', items: [
    { label: 'Go to Dashboard', icon: 'home', action: '#/dashboard', shortcut: 'G D' },
    { label: 'Go to World Builder', icon: 'cube', action: '#/world-builder', shortcut: 'G W' },
    { label: 'Go to 3D Viewer', icon: 'eye', action: '#/viewer', shortcut: 'G V' },
    { label: 'Go to Simulation', icon: 'play', action: '#/simulation', shortcut: 'G S' },
    { label: 'Go to Predictions', icon: 'brain', action: '#/predictions', shortcut: 'G P' },
    { label: 'Go to Analytics', icon: 'barChart', action: '#/analytics', shortcut: 'G A' },
  ]},
  { group: 'Actions', items: [
    { label: 'Create New World', icon: 'plus', action: '#/world-builder', shortcut: 'N' },
    { label: 'Run Simulation', icon: 'play', action: '#/simulation', shortcut: 'R' },
    { label: 'Generate Prediction', icon: 'sparkles', action: '#/predictions', shortcut: 'P' },
  ]},
];

export function renderCommandPalette() {
  return `
    <div class="command-overlay" id="command-overlay" role="dialog" aria-label="Command palette" aria-modal="true">
      <div class="command-palette">
        <div class="command-input">
          ${icon('search', 20)}
          <input type="text" id="command-search" placeholder="Type a command or search..." autocomplete="off" aria-label="Command search" />
          <span class="kbd">ESC</span>
        </div>
        <div class="command-list" id="command-list" role="listbox">
          ${commands.map(group => `
            <div class="command-group-label">${group.group}</div>
            ${group.items.map(item => `
              <div class="command-item" role="option" data-action="${item.action}" tabindex="-1">
                ${icon(item.icon, 18)}
                <span>${item.label}</span>
                ${item.shortcut ? `
                  <div class="shortcut">
                    ${item.shortcut.split(' ').map(k => `<span class="kbd">${k}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function initCommandPalette() {
  const overlay = document.getElementById('command-overlay');
  const searchInput = document.getElementById('command-search');
  if (!overlay || !searchInput) return;

  // Keyboard shortcut: Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      togglePalette();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closePalette();
    }
  });

  // Click trigger
  const trigger = document.getElementById('search-trigger');
  if (trigger) {
    trigger.addEventListener('click', togglePalette);
  }

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePalette();
  });

  // Command item clicks
  document.querySelectorAll('.command-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      if (action) window.location.hash = action;
      closePalette();
    });
  });

  // Search filtering
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.command-item').forEach(item => {
      const text = item.querySelector('span').textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
    document.querySelectorAll('.command-group-label').forEach(label => {
      const nextItems = [];
      let sibling = label.nextElementSibling;
      while (sibling && !sibling.classList.contains('command-group-label')) {
        nextItems.push(sibling);
        sibling = sibling.nextElementSibling;
      }
      const hasVisible = nextItems.some(item => item.style.display !== 'none');
      label.style.display = hasVisible ? '' : 'none';
    });
  });

  function togglePalette() {
    overlay.classList.toggle('open');
    if (overlay.classList.contains('open')) {
      searchInput.value = '';
      searchInput.focus();
      document.querySelectorAll('.command-item, .command-group-label').forEach(el => el.style.display = '');
    }
  }

  function closePalette() {
    overlay.classList.remove('open');
  }
}
