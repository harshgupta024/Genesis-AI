/* ============================================================
   GENESIS AI — Additional Pages
   Comparison, Timeline, Datasets, Models, Auth
   ============================================================ */

import { icon } from '../icons.js';
import { getWorlds } from '../utils/world-manager.js';
import { loadedDatasets } from '../utils/data-service.js';
import { createRadarChart, chartColors } from '../utils/charts.js';

const timelineEpochs = [
  { era: 'Era I', name: 'Genesis', year: 'Y0 — Y1000', desc: 'Life emerges. First organisms appear.', color: '#10B981' },
  { era: 'Era II', name: 'Bronze Age', year: 'Y1000 — Y3000', desc: 'Tool use, agriculture, early settlements.', color: '#F59E0B' },
  { era: 'Era III', name: 'Classical', year: 'Y3000 — Y5000', desc: 'Empires, philosophy, architecture.', color: '#3B82F6' },
  { era: 'Era IV', name: 'Medieval', year: 'Y5000 — Y7000', desc: 'Feudalism, religion, exploration.', color: '#8B5CF6' },
  { era: 'Era V', name: 'Industrial', year: 'Y7000 — Y8500', desc: 'Mechanization, urbanization, science.', color: '#EF4444' },
  { era: 'Era VI', name: 'Information', year: 'Y8500 — Y9500', desc: 'Computers, networks, globalization.', color: '#06B6D4' },
  { era: 'Era VII', name: 'AI Age', year: 'Y9500 — Y10000', desc: 'Artificial intelligence, automation.', color: '#EC4899' },
  { era: 'Era VIII', name: 'Space Age', year: 'Y10000+', desc: 'Space colonization, post-scarcity.', color: '#F59E0B' },
];

const mlModels = [
  { name: 'CivilizationNet v4', type: 'Neural Network', accuracy: 94.7, status: 'active', params: '128M', training: 'Complete' },
  { name: 'ClimatePredictor', type: 'Regression', accuracy: 91.2, status: 'active', params: '45M', training: 'Complete' },
  { name: 'PopGrowth-LSTM', type: 'LSTM', accuracy: 89.5, status: 'training', params: '78M', training: '67%' },
  { name: 'ResourceClassifier', type: 'Classification', accuracy: 96.1, status: 'active', params: '22M', training: 'Complete' },
  { name: 'DisasterDetect', type: 'Anomaly Detection', accuracy: 88.3, status: 'active', params: '35M', training: 'Complete' },
];

/* ── SCENARIO COMPARISON ──────────────────────────────────── */
export function renderComparison() {
  const worlds = getWorlds();
  const w1 = worlds[0], w2 = worlds[2] || worlds[1];
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Scenario Comparison</h1>
          <p class="page-subtitle">Compare two worlds side-by-side</p>
        </div>
      </div>

      <div class="comparison-header">
        <div class="comparison-world-select">
          <div style="width:32px;height:32px;border-radius:50%;background:${w1.color}"></div>
          <span style="font-weight:600">${w1.name}</span>
        </div>
        <span class="comparison-vs">VS</span>
        <div class="comparison-world-select">
          <div style="width:32px;height:32px;border-radius:50%;background:${w2.color}"></div>
          <span style="font-weight:600">${w2.name}</span>
        </div>
      </div>

      <div class="split-layout">
        <!-- World 1 Stats -->
        <div class="card">
          <h3 style="text-align:center;margin-bottom:var(--space-6);color:${w1.color}">${w1.name}</h3>
          ${renderCompStats(w1)}
        </div>
        <!-- World 2 Stats -->
        <div class="card">
          <h3 style="text-align:center;margin-bottom:var(--space-6);color:${w2.color}">${w2.name}</h3>
          ${renderCompStats(w2)}
        </div>
      </div>

      <!-- Radar Comparison -->
      <div class="grid grid-cols-2" style="gap:var(--space-6);margin-top:var(--space-6)">
        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">Dimensional Comparison</span>
          </div>
          <div class="chart-container" style="height:300px">
            <canvas id="comp-radar" aria-label="Comparison radar chart"></canvas>
          </div>
        </div>

        <div class="card" style="padding:var(--space-6)">
          <div class="flex items-center gap-3" style="margin-bottom:var(--space-5)">
            <div style="width:40px;height:40px;border-radius:var(--radius-lg);background:var(--info-dim);display:flex;align-items:center;justify-content:center">
              ${icon('sparkles', 20)}
            </div>
            <h3 style="font-size:var(--text-body);font-weight:600">AI Recommendation</h3>
          </div>
          <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;margin-bottom:var(--space-4)">
            <strong style="color:${w2.color}">${w2.name}</strong> demonstrates superior long-term sustainability due to higher water coverage (84% vs 68%) and advanced technology (Space Age vs Industrial).
          </p>
          <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;margin-bottom:var(--space-4)">
            <strong style="color:${w1.color}">${w1.name}</strong> shows stronger population growth potential but faces resource constraints that may limit future expansion.
          </p>
          <div class="flex gap-3">
            <span class="badge badge-green">Aetheria: Higher ceiling</span>
            <span class="badge badge-blue">Nova Terra: Faster growth</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCompStats(w) {
  const stats = [
    { label: 'Population', value: w.population.toLocaleString() },
    { label: 'Tech Level', value: w.techLevel },
    { label: 'Climate', value: w.climate },
    { label: 'Gravity', value: `${w.gravity}g` },
    { label: 'Water', value: `${w.waterCoverage}%` },
    { label: 'Government', value: w.government },
    { label: 'Economy', value: w.economy },
  ];
  return stats.map(s => `
    <div class="comparison-stat-row">
      <span class="comparison-stat-label">${s.label}</span>
      <span style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${s.value}</span>
    </div>
  `).join('');
}

export function initComparison() {
  const canvas = document.getElementById('comp-radar');
  if (canvas) {
    createRadarChart(canvas,
      ['Population', 'Technology', 'Economy', 'Resources', 'Climate', 'Military'],
      [
        { label: 'Nova Terra', data: [65, 55, 60, 70, 72, 30], borderColor: chartColors.blue.main, backgroundColor: chartColors.blue.dim, borderWidth: 2, pointBackgroundColor: chartColors.blue.main, pointRadius: 3 },
        { label: 'Aetheria', data: [90, 95, 85, 60, 80, 25], borderColor: chartColors.cyan.main, backgroundColor: chartColors.cyan.dim, borderWidth: 2, pointBackgroundColor: chartColors.cyan.main, pointRadius: 3 },
      ]
    );
  }
}

/* ── TIMELINE EXPLORER ────────────────────────────────────── */
export function renderTimeline() {
  const worlds = getWorlds();
  const activeWorld = worlds[0];

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Timeline Explorer</h1>
          <p class="page-subtitle">Journey through the epochs of civilization evolution</p>
        </div>
        <div class="page-actions">
          <select id="timeline-world-select" class="select" aria-label="Select world to explore timeline">
            ${worlds.map(w => `<option value="${w.id}">${w.name} (${w.epoch})</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="timeline">
        ${timelineEpochs.map((e, i) => `
          <div class="timeline-item fade-in-up" style="animation-delay:${i * 100}ms">
            <div class="timeline-dot ${i <= 4 ? 'active' : ''}" style="border-color:${e.color}${i <= 4 ? '' : '80'};${i <= 4 ? `background:${e.color};box-shadow:0 0 12px ${e.color}60` : ''}"></div>
            <div class="timeline-content hover-lift">
              <div class="flex items-center justify-between" style="margin-bottom:var(--space-2)">
                <span class="badge" style="background:${e.color}20;color:${e.color}">${e.era}</span>
                <span class="timeline-time">${e.year}</span>
              </div>
              <div class="timeline-title">${e.name}</div>
              <div class="timeline-desc">${e.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function initTimeline() {
  const select = document.getElementById('timeline-world-select');
  if (select) {
    select.addEventListener('change', (e) => {
      // Timeline world selection can notify
      console.log('[Genesis] Timeline focused on world ID:', e.target.value);
    });
  }
}

/* ── DATASET MANAGER ──────────────────────────────────────── */
export function renderDatasets() {
  const datasets = (loadedDatasets && loadedDatasets.length > 0) ? loadedDatasets : [
    { name: 'Climate (NOAA GSOM)', source: 'NOAA', type: 'Time Series', size: '5.3 MB', records: '17,478', columns: 96, status: 'ready', category: 'climate' },
    { name: 'World Development & Population', source: 'World Bank', type: 'Time Series', size: '10.3 KB', records: '23,700', columns: 4, status: 'ready', category: 'population' },
    { name: 'Global Economic Indicators & GDP', source: 'World Bank', type: 'Time Series', size: '2.5 KB', records: '14,800', columns: 5, status: 'ready', category: 'economy' },
    { name: 'Global Health & Life Expectancy', source: 'WHO / World Bank', type: 'Time Series', size: '6.7 KB', records: '19,200', columns: 6, status: 'ready', category: 'health' },
    { name: 'Shuttle Radar Topography (SRTM)', source: 'NASA JPL', type: 'Raster / Grid', size: '5.5 KB', records: '100', columns: 5, status: 'ready', category: 'terrain' },
  ];

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Datasets</h1>
          <p class="page-subtitle">Real-world training data powering Genesis simulations</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary btn-sm" onclick="window.__genesis_refreshDatasets && window.__genesis_refreshDatasets()">
            ${icon('refresh', 16)} Refresh
          </button>
        </div>
      </div>

      <!-- Dataset Stats Summary -->
      <div class="grid grid-cols-4 section" id="dataset-stats">
        <div class="card metric-card hover-lift">
          <div class="metric-label">Total Datasets</div>
          <div class="metric-value" id="ds-total-count">${datasets.length}</div>
        </div>
        <div class="card metric-card hover-lift">
          <div class="metric-label">Total Records</div>
          <div class="metric-value" id="ds-total-records">—</div>
        </div>
        <div class="card metric-card hover-lift">
          <div class="metric-label">Data Sources</div>
          <div class="metric-value" id="ds-total-sources">—</div>
        </div>
        <div class="card metric-card hover-lift">
          <div class="metric-label">Pipeline Status</div>
          <div class="metric-value" style="color:var(--success)">Online</div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Source</th>
              <th>Type</th>
              <th>Size</th>
              <th>Records</th>
              <th>Columns</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${datasets.map(d => `
              <tr class="dataset-row" data-category="${d.category || ''}" style="cursor:pointer">
                <td>
                  <div class="flex items-center gap-3">
                    <div style="width:32px;height:32px;border-radius:8px;background:var(--accent-blue-dim);display:flex;align-items:center;justify-content:center;color:var(--accent-blue-light)">
                      ${icon('database', 16)}
                    </div>
                    <div>
                      <strong style="color:var(--text-primary)">${d.name}</strong>
                      ${d.columnNames ? `<div style="font-size:var(--text-2xs);color:var(--text-muted);margin-top:2px">${d.columnNames.slice(0, 4).join(', ')}${d.columnNames.length > 4 ? '…' : ''}</div>` : ''}
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-purple">${d.source || '—'}</span></td>
                <td><span class="badge badge-blue">${d.type}</span></td>
                <td style="font-variant-numeric:tabular-nums">${d.size}</td>
                <td style="font-variant-numeric:tabular-nums">${d.records}</td>
                <td style="font-variant-numeric:tabular-nums;text-align:center">${d.columns || '—'}</td>
                <td>
                  <span class="badge badge-${d.status === 'ready' ? 'green' : 'amber'}">
                    <span class="badge-dot"></span> ${d.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Dataset Preview Panel -->
      <div id="dataset-preview" class="card" style="margin-top:var(--space-6);display:none;padding:var(--space-6)">
        <div class="section-header">
          <h3 class="section-title" id="preview-title">Dataset Preview</h3>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('dataset-preview').style.display='none'">Close</button>
        </div>
        <div id="preview-content" style="font-size:var(--text-sm);color:var(--text-secondary)">Loading...</div>
      </div>
    </div>
  `;
}

export function initDatasets() {
  const dsList = (loadedDatasets && loadedDatasets.length > 0) ? loadedDatasets : [
    { name: 'Climate (NOAA GSOM)', source: 'NOAA', records: '17,478' },
    { name: 'World Development & Population', source: 'World Bank', records: '23,700' },
    { name: 'Global Economic Indicators & GDP', source: 'World Bank', records: '14,800' },
    { name: 'Global Health & Life Expectancy', source: 'WHO / World Bank', records: '19,200' },
    { name: 'Shuttle Radar Topography (SRTM)', source: 'NASA JPL', records: '100' },
  ];
  // Compute aggregate stats
  const totalRecords = dsList.reduce((sum, d) => {
    const num = parseInt(String(d.records).replace(/,/g, ''), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const sources = new Set(dsList.map(d => d.source).filter(Boolean));

  const totalEl = document.getElementById('ds-total-records');
  if (totalEl) totalEl.textContent = totalRecords.toLocaleString();

  const srcEl = document.getElementById('ds-total-sources');
  if (srcEl) srcEl.textContent = sources.size;

  // Click to preview dataset details
  document.querySelectorAll('.dataset-row').forEach(row => {
    row.addEventListener('click', () => {
      const cat = row.dataset.category;
      if (!cat) return;
      const panel = document.getElementById('dataset-preview');
      const title = document.getElementById('preview-title');
      const content = document.getElementById('preview-content');
      if (!panel) return;

      panel.style.display = 'block';
      title.textContent = `Preview: ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
      content.innerHTML = '<span style="color:var(--text-muted)">Loading data preview…</span>';

      fetch(`/data/${cat}.json`)
        .then(r => r.json())
        .then(data => {
          if (!data || !data.summary) {
            content.innerHTML = '<span style="color:var(--warning)">No preview available.</span>';
            return;
          }
          const s = data.summary;
          let html = `<div class="grid grid-cols-3" style="gap:var(--space-4);margin-bottom:var(--space-4)">`;
          Object.entries(s).forEach(([key, val]) => {
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const display = Array.isArray(val) ? val.join(' — ') : (typeof val === 'number' ? val.toLocaleString() : val);
            html += `<div class="card" style="padding:var(--space-3)"><span style="font-size:var(--text-2xs);color:var(--text-muted);text-transform:uppercase">${label}</span><div style="font-size:var(--text-body);font-weight:600;margin-top:4px">${display}</div></div>`;
          });
          html += `</div>`;

          if (data.yearly_trends) {
            const keys = Object.keys(data.yearly_trends).filter(k => k !== 'years');
            html += `<div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-3)">Available trend series: <strong>${keys.join(', ')}</strong></div>`;
          }
          if (data.regions) {
            html += `<div style="margin-top:var(--space-3)"><strong>Regions:</strong> ${data.regions.map(r => r.name).join(', ')}</div>`;
          }
          if (data.top_countries) {
            html += `<div style="margin-top:var(--space-3)"><strong>Top Countries:</strong> ${data.top_countries.slice(0, 5).map(c => c.name).join(', ')}</div>`;
          }
          content.innerHTML = html;
        })
        .catch(() => {
          content.innerHTML = '<span style="color:var(--danger)">Failed to load preview.</span>';
        });
    });
  });
}

/* ── MODEL MANAGER ────────────────────────────────────────── */
export function renderModels() {
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">ML Models</h1>
          <p class="page-subtitle">Machine learning model registry and performance tracking</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary">${icon('plus', 16)} Train New Model</button>
        </div>
      </div>

      <div class="grid grid-cols-2" style="gap:var(--space-6)">
        ${mlModels.map(m => `
          <div class="card hover-lift" style="padding:var(--space-6)">
            <div class="flex items-center justify-between" style="margin-bottom:var(--space-4)">
              <div class="flex items-center gap-3">
                <div style="width:40px;height:40px;border-radius:var(--radius-lg);background:var(--info-dim);display:flex;align-items:center;justify-content:center;color:var(--info)">
                  ${icon('cpu', 20)}
                </div>
                <div>
                  <h4 style="font-size:var(--text-body);font-weight:600">${m.name}</h4>
                  <span style="font-size:var(--text-xs);color:var(--text-muted)">${m.type}</span>
                </div>
              </div>
              <span class="badge badge-${m.status === 'active' ? 'green' : 'amber'}">
                <span class="badge-dot"></span> ${m.status}
              </span>
            </div>
            <div class="grid grid-cols-3" style="gap:var(--space-3)">
              <div>
                <span style="font-size:var(--text-2xs);color:var(--text-muted);text-transform:uppercase">Accuracy</span>
                <div style="font-size:var(--text-body);font-weight:700;color:var(--success)">${m.accuracy}%</div>
              </div>
              <div>
                <span style="font-size:var(--text-2xs);color:var(--text-muted);text-transform:uppercase">Parameters</span>
                <div style="font-size:var(--text-body);font-weight:600">${m.params}</div>
              </div>
              <div>
                <span style="font-size:var(--text-2xs);color:var(--text-muted);text-transform:uppercase">Training</span>
                <div style="font-size:var(--text-body);font-weight:600">${m.training}</div>
              </div>
            </div>
            ${m.status === 'training' ? `
              <div class="progress-bar" style="margin-top:var(--space-3)">
                <div class="progress-bar-fill" style="width:${m.training}"></div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── AUTH PAGE ─────────────────────────────────────────────── */
export function renderAuth() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-container bg-grid">
      <div class="auth-card fade-in-up">
        <div class="auth-brand">
          <div class="sidebar-brand-icon">${icon('globe', 20)}</div>
          <span style="font-weight:700;font-size:1.1rem">Genesis AI</span>
        </div>

        <h2 class="auth-title" style="font-size:var(--text-h3)">Welcome Back</h2>
        <p class="auth-subtitle">Sign in to continue to your worlds</p>

        <form class="auth-form" onsubmit="event.preventDefault();window.location.hash='#/dashboard'">
          <div class="input-group">
            <label for="auth-email">Email Address</label>
            <input class="input" id="auth-email" type="email" placeholder="you@example.com" required />
          </div>
          <div class="input-group">
            <label for="auth-password">Password</label>
            <input class="input" id="auth-password" type="password" placeholder="••••••••" required />
          </div>
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2" style="font-size:var(--text-sm);color:var(--text-muted);cursor:pointer">
              <input type="checkbox" style="accent-color:var(--accent-blue)" /> Remember me
            </label>
            <a href="#" style="font-size:var(--text-sm)">Forgot password?</a>
          </div>
          <button class="btn btn-primary btn-lg" type="submit" style="width:100%">Sign In</button>
        </form>

        <div class="auth-divider"><span>or continue with</span></div>

        <div class="flex gap-3">
          <button class="btn btn-secondary" style="flex:1;padding:0.625rem">Google</button>
          <button class="btn btn-secondary" style="flex:1;padding:0.625rem">GitHub</button>
        </div>

        <div class="auth-footer">
          Don't have an account? <a href="#/dashboard">Get started</a>
        </div>
      </div>
    </div>
  `;
}
