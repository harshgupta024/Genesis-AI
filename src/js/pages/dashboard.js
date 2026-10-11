/* ============================================================
   GENESIS — Dashboard / Observatory
   ============================================================ */

import { icon } from '../icons.js';
import { animateCounter } from '../utils/counter.js';
import { getWorlds, setActiveWorldId } from '../utils/world-manager.js';
import { createSparkline, createLineChart, createDoughnutChart, chartColors } from '../utils/charts.js';

const sparklineData = {
  worlds: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6],
  simulations: [3, 5, 4, 8, 7, 10, 9, 12, 11, 14],
  predictions: [120, 340, 580, 890, 1200, 1580, 1900, 2200, 2540, 2847],
  accuracy: [85, 87, 86, 89, 90, 91, 92, 93, 94, 94.7],
};

const recentActivity = [
  { type: 'world', text: '<strong>Nova Terra</strong> simulation advanced to Era V', time: '2 min ago', icon: 'globe', color: 'blue' },
  { type: 'prediction', text: 'New prediction generated for <strong>Kepler Prime</strong>', time: '15 min ago', icon: 'brain', color: 'purple' },
  { type: 'alert', text: 'Volcanic event detected on <strong>Pyraxis</strong>', time: '32 min ago', icon: 'alertTriangle', color: 'amber' },
  { type: 'simulation', text: '<strong>Aetheria</strong> simulation completed successfully', time: '1 hour ago', icon: 'check', color: 'green' },
  { type: 'world', text: 'New world <strong>Frost Haven</strong> created (draft)', time: '2 hours ago', icon: 'plus', color: 'cyan' },
  { type: 'prediction', text: 'Risk analysis updated for <strong>Verdant IX</strong>', time: '3 hours ago', icon: 'activity', color: 'red' },
];

const aiInsights = [
  { title: 'Population Growth Anomaly', desc: 'Nova Terra is showing 23% higher growth than predicted. Consider adjusting resource allocation.', severity: 'info' },
  { title: 'Climate Shift Warning', desc: "Kepler Prime's desertification is accelerating. Water resources may deplete by Era IV.", severity: 'warning' },
  { title: 'Technology Breakthrough', desc: 'Aetheria has achieved space-faring civilization 2 eras ahead of baseline prediction.', severity: 'success' },
];

export function renderDashboard() {
  const worlds = getWorlds();
  return `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="dashboard-greeting">
            <h1>Welcome back, <span>Harsh</span></h1>
          </div>
          <p class="page-subtitle" style="font-family:var(--font-mono);font-size:var(--text-xs);letter-spacing:0.03em">Observatory status: All systems nominal</p>
        </div>
        <div class="page-actions">
          <a href="#/world-builder" class="btn btn-primary">
            ${icon('plus', 18)}
            New World
          </a>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-4 section">
        ${[
          { label: 'Total Worlds', value: worlds.length, change: '+' + worlds.filter(w => w.simStatus === 'running').length + ' active', trend: 'up', color: 'blue', icon: 'globe' },
          { label: 'Simulations', value: worlds.filter(w => w.simStatus === 'running').length, change: 'running', trend: 'up', color: 'cyan', icon: 'play' },
          { label: 'Predictions', value: 2847, change: '+312', trend: 'up', color: 'purple', icon: 'brain' },
          { label: 'Accuracy', value: 94.7, change: '+1.2%', trend: 'up', color: 'green', icon: 'target', suffix: '%' },
        ].map((m, i) => `
          <div class="card metric-card hover-lift" style="animation-delay:${i * 80}ms">
            <div class="flex items-center justify-between">
              <div class="metric-icon ${m.color}">
                ${icon(m.icon, 22)}
              </div>
              <div class="metric-change positive">
                ${icon('trendingUp', 14)}
                ${m.change}
              </div>
            </div>
            <div class="metric-label">${m.label}</div>
            <div class="metric-value" data-metric="${m.value}" data-suffix="${m.suffix || ''}">${m.value}${m.suffix || ''}</div>
            <div class="sparkline-container">
              <canvas id="sparkline-${i}" aria-label="${m.label} trend"></canvas>
            </div>
          </div>
        `).join('')}
      </div>


      <!-- Main Content Grid -->
      <div class="grid" style="grid-template-columns:1fr 1fr 380px;gap:var(--space-6)">

        <!-- Recent Worlds -->
        <div class="card" style="grid-column:span 2">
          <div class="section-header">
            <h3 class="section-title">Recent Worlds</h3>
            <a href="#/world-builder" class="section-action">+ Create World</a>
          </div>
          <div class="grid grid-cols-2" style="gap:var(--space-4)">
            ${worlds.slice(0, 4).map(w => `
              <div class="card world-card hover-lift" style="padding:var(--space-4)">
                <div class="world-preview" style="height:110px;background:linear-gradient(135deg, ${w.color}15, ${w.color}05);display:flex;align-items:center;justify-content:center;position:relative">
                  <div style="width:55px;height:55px;border-radius:50%;background:radial-gradient(circle at 35% 35%, ${w.color}80, ${w.color}30);box-shadow:0 0 25px ${w.color}40;"></div>
                  <span class="badge badge-${w.simStatus === 'running' ? 'green' : w.simStatus === 'paused' ? 'amber' : 'blue'}" style="position:absolute;top:8px;right:8px;font-size:8px">
                    <span class="badge-dot"></span>
                    ${w.simStatus}
                  </span>
                </div>
                <div class="world-info" style="margin-top:var(--space-2)">
                  <div class="flex items-center justify-between">
                    <span class="world-name" style="font-size:var(--text-sm);font-weight:600">${w.name}</span>
                    <span style="font-size:var(--text-2xs);color:var(--text-muted)">${w.climate}</span>
                  </div>
                  <div class="world-meta" style="margin-top:4px;display:flex;gap:var(--space-3);font-size:var(--text-2xs);color:var(--text-muted)">
                    <span>${icon('users', 12)} ${w.population.toLocaleString()}</span>
                    <span>${icon('zap', 12)} ${w.techLevel}</span>
                  </div>
                  <div class="flex gap-2" style="margin-top:var(--space-3)">
                    <a href="#/simulation" class="btn btn-secondary btn-sm world-action-btn" data-world-id="${w.id}" style="flex:1;justify-content:center;font-size:var(--text-2xs);padding:4px 8px">
                      ${icon('play', 12)} Simulate
                    </a>
                    <a href="#/viewer" class="btn btn-ghost btn-sm world-action-btn" data-world-id="${w.id}" style="flex:1;justify-content:center;font-size:var(--text-2xs);padding:4px 8px">
                      ${icon('eye', 12)} 3D Globe
                    </a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Activity Feed + AI Insights -->
        <div class="flex flex-col gap-6">
          <!-- AI Insights -->
          <div class="card insight-card" style="flex-shrink:0">
            <div class="insight-icon">
              ${icon('sparkles', 20)}
            </div>
            <h4 style="font-family:var(--font-display);font-size:var(--text-sm);margin-bottom:var(--space-2)">Research Insight</h4>
            <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.6">
              ${aiInsights[0].desc}
            </p>
            <button class="btn btn-ghost btn-sm" style="margin-top:var(--space-3)">
              View Details ${icon('arrowRight', 14)}
            </button>
          </div>

          <!-- Activity Feed -->
          <div class="card" style="flex:1;overflow:hidden">
            <div class="section-header">
              <h3 class="section-title">Mission Activity</h3>
            </div>
            <div style="overflow-y:auto;max-height:320px" class="no-scrollbar">
              ${recentActivity.map(a => `
                <div class="activity-item">
                  <div class="activity-icon" style="background:var(--${a.color === 'blue' ? 'accent-blue' : a.color === 'purple' ? 'info' : a.color === 'amber' ? 'warning' : a.color === 'green' ? 'success' : a.color === 'cyan' ? 'accent-cyan' : 'danger'}-dim);color:var(--${a.color === 'blue' ? 'accent-blue-light' : a.color === 'purple' ? 'info' : a.color === 'amber' ? 'warning' : a.color === 'green' ? 'success' : a.color === 'cyan' ? 'accent-cyan' : 'danger'})">
                    ${icon(a.icon, 16)}
                  </div>
                  <div>
                    <div class="activity-text">${a.text}</div>
                    <div class="activity-time">${a.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid" style="grid-template-columns:2fr 1fr;gap:var(--space-6);margin-top:var(--space-6)">
        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">Population Growth Across Worlds</span>
            <div class="tabs" style="padding:2px">
              <span class="tab active" style="padding:4px 10px;font-size:var(--text-xs)">Line</span>
              <span class="tab" style="padding:4px 10px;font-size:var(--text-xs)">Bar</span>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="population-chart" aria-label="Population growth chart"></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">World Status Distribution</span>
          </div>
          <div class="chart-container">
            <canvas id="status-chart" aria-label="World status distribution"></canvas>
          </div>
        </div>
      </div>

      <!-- Simulation Status -->
      <div class="section" style="margin-top:var(--space-6)">
        <div class="section-header">
          <h3 class="section-title">Active Missions</h3>
          <a href="#/simulation" class="section-action">View All</a>
        </div>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>World</th>
                <th>Status</th>
                <th>Epoch</th>
                <th>Population</th>
                <th>Tech Level</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              ${worlds.filter(w => w.simStatus !== 'stopped').map(w => `
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <div style="width:32px;height:32px;border-radius:8px;background:${w.color}20;display:flex;align-items:center;justify-content:center">
                        <div style="width:14px;height:14px;border-radius:50%;background:${w.color}"></div>
                      </div>
                      <strong style="color:var(--text-primary)">${w.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-${w.simStatus === 'running' ? 'green' : w.simStatus === 'paused' ? 'amber' : 'blue'}">
                      <span class="badge-dot"></span>
                      ${w.simStatus}
                    </span>
                  </td>
                  <td style="font-size:var(--text-xs);color:var(--text-muted)">${w.epoch}</td>
                  <td style="font-variant-numeric:tabular-nums">${w.population.toLocaleString()}</td>
                  <td>${w.techLevel}</td>
                  <td style="width:140px">
                    <div class="progress-bar">
                      <div class="progress-bar-fill" style="width:${w.simStatus === 'completed' ? 100 : Math.random() * 60 + 20}%;background:${w.color}"></div>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export async function initDashboard() {
  // Sparklines
  const sparkKeys = ['worlds', 'simulations', 'predictions', 'accuracy'];
  const sparkColors = ['blue', 'cyan', 'purple', 'green'];
  sparkKeys.forEach((key, i) => {
    const canvas = document.getElementById(`sparkline-${i}`);
    if (canvas) {
      createSparkline(canvas, sparklineData[key], sparkColors[i]);
    }
  });

  // Bind world card action buttons
  document.querySelectorAll('.world-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-world-id');
      if (id) setActiveWorldId(id);
    });
  });

  // Population chart — try real data first
  const popCanvas = document.getElementById('population-chart');
  if (popCanvas) {
    let realData = null;
    try { realData = await fetch('/data/population.json').then(r => r.ok ? r.json() : null); } catch {}

    if (realData && realData.yearly_trends) {
      const t = realData.yearly_trends;
      const step = Math.max(1, Math.floor(t.years.length / 12));
      const years = t.years.filter((_, i) => i % step === 0);
      const pops = t.global_pop.filter((_, i) => i % step === 0);
      const urban = t.urban_pop.filter((_, i) => i % step === 0);
      createLineChart(popCanvas, years.map(String), [
        {
          label: 'Global Population',
          data: pops,
          borderColor: chartColors.blue.main,
          backgroundColor: chartColors.blue.dim,
          fill: true,
        },
        {
          label: 'Urban Population',
          data: urban,
          borderColor: chartColors.cyan.main,
          backgroundColor: chartColors.cyan.dim,
          fill: true,
        },
      ]);
    } else {
      // Fallback to mock
      createLineChart(popCanvas,
        ['Era I', 'Era II', 'Era III', 'Era IV', 'Era V', 'Era VI', 'Era VII', 'Era VIII'],
        [
          {
            label: 'Nova Terra',
            data: [1000, 12000, 85000, 420000, 1800000, 4200000, 6800000, 8420000],
            borderColor: chartColors.blue.main,
            backgroundColor: chartColors.blue.dim,
            fill: true,
          },
          {
            label: 'Aetheria',
            data: [1200, 15000, 120000, 580000, 2400000, 5800000, 9200000, 12700000],
            borderColor: chartColors.cyan.main,
            backgroundColor: chartColors.cyan.dim,
            fill: true,
          },
          {
            label: 'Kepler Prime',
            data: [800, 8500, 65000, 310000, 1200000, 2100000, 2800000, 3150000],
            borderColor: chartColors.amber.main,
            backgroundColor: chartColors.amber.dim,
            fill: true,
          },
        ]
      );
    }
  }

  // Status doughnut
  const statusCanvas = document.getElementById('status-chart');
  if (statusCanvas) {
    createDoughnutChart(statusCanvas,
      ['Running', 'Paused', 'Completed', 'Draft'],
      [3, 1, 1, 1],
      [chartColors.green.main, chartColors.amber.main, chartColors.blue.main, chartColors.purple.main]
    );
  }
}

