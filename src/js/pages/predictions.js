import { icon } from '../icons.js';
import { getActiveWorld, getWorlds, setActiveWorldId } from '../utils/world-manager.js';
import { createBarChart, createRadarChart, chartColors } from '../utils/charts.js';

function computeWorldPredictions(w) {
  const water = Number(w.waterCoverage) || 50;
  const gravity = Number(w.gravity) || 1.0;
  const pop = Number(w.population) || 10000;
  const climate = w.climate || 'Temperate';
  const tech = w.techLevel || 'Industrial';

  const ecoRisk = Math.round(Math.max(10, Math.min(95, (100 - water) * 0.8 + (climate === 'Volcanic' ? 30 : climate === 'Arid' ? 20 : 0))));
  const econRisk = Math.round(Math.max(15, Math.min(90, (tech === 'Stone Age' ? 65 : tech === 'Space Age' ? 15 : 40) + Math.abs(gravity - 1.0) * 20)));
  const socialRisk = Math.round(Math.max(10, Math.min(85, (pop > 5000000 ? 55 : 25) + (w.government === 'Anarchy' ? 35 : 0))));
  const techRisk = Math.round(Math.max(5, Math.min(75, (tech === 'Stone Age' ? 70 : tech === 'Industrial' ? 30 : 15))));
  const polRisk = Math.round(Math.max(10, Math.min(80, (w.government === 'Tribal' ? 45 : w.government === 'Technocracy' ? 18 : 35))));
  const milRisk = Math.round(Math.max(5, Math.min(85, (w.species === 'Reptilian' ? 45 : 25))));

  const avgRisk = Math.round((ecoRisk + econRisk + socialRisk + techRisk + polRisk + milRisk) / 6);
  const confidence = Math.round(98 - (avgRisk * 0.15));

  let classification = 'Sustainable Growth';
  let riskLevel = 'Low';
  if (avgRisk > 60) {
    classification = 'High Collapse Risk';
    riskLevel = 'Critical';
  } else if (avgRisk > 40) {
    classification = 'Volatile Transition';
    riskLevel = 'Moderate';
  } else if (tech === 'Space Age') {
    classification = 'Post-Scarcity Expansion';
    riskLevel = 'Minimal';
  }

  return {
    confidence,
    classification,
    riskLevel,
    features: [
      { name: 'Water Resources', importance: Number((water / 100).toFixed(2)), direction: water > 50 ? 'positive' : 'negative' },
      { name: 'Technology Level', importance: tech === 'Space Age' ? 0.95 : tech === 'Industrial' ? 0.82 : 0.45, direction: 'positive' },
      { name: 'Climate Equilibrium', importance: Number((climate === 'Temperate' ? 0.88 : 0.65).toFixed(2)), direction: climate === 'Temperate' ? 'positive' : 'negative' },
      { name: 'Gravity Normalization', importance: Number((1.0 - Math.min(0.5, Math.abs(gravity - 1.0))).toFixed(2)), direction: Math.abs(gravity - 1.0) < 0.2 ? 'positive' : 'negative' },
      { name: 'Resource Availability', importance: w.resources === 'Abundant' ? 0.90 : w.resources === 'Scarce' ? 0.35 : 0.65, direction: w.resources === 'Scarce' ? 'negative' : 'positive' },
    ],
    riskDimensions: {
      labels: ['Ecological', 'Economic', 'Social', 'Technological', 'Political', 'Military'],
      values: [ecoRisk, econRisk, socialRisk, techRisk, polRisk, milRisk],
    },
    recommendations: [
      { title: `Calibrate ${climate} Ecosystem Reserves`, desc: `Current climate dynamics on ${w.name} suggest environmental stress threshold in Era ${w.epoch ? w.epoch.split(' ')[1] || 'V' : 'V'}. Implement localized biosphere reservoirs.`, priority: ecoRisk > 50 ? 'high' : 'medium' },
      { title: 'Accelerate Tech Infrastructure', desc: `Advancing from ${tech} unlocks +35% resource efficiency and cushions civilization against regional collapse.`, priority: techRisk > 40 ? 'high' : 'medium' },
      { title: `Stabilize ${w.species} Demographic Density`, desc: `Population of ${pop.toLocaleString()} requires sustained agrarian and synthetic nutrient pipelines.`, priority: pop > 2000000 ? 'high' : 'low' },
    ],
  };
}

export function renderPredictions() {
  const worlds = getWorlds();
  const w = getActiveWorld() || worlds[0];
  const pr = computeWorldPredictions(w);
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Prediction Dashboard: <span style="color:${w.color || 'var(--accent-blue)'}">${w.name}</span></h1>
          <p class="page-subtitle">Machine learning predictions and risk analysis for ${w.name} (${w.climate}, ${w.techLevel})</p>
        </div>
        <div class="page-actions" style="display:flex;align-items:center;gap:var(--space-3)">
          <select id="pred-world-select" class="select" style="padding:6px 28px 6px 10px;font-size:var(--text-xs);font-weight:600" aria-label="Select planet for predictions">
            ${worlds.map(item => `<option value="${item.id}" ${item.id === w.id ? 'selected' : ''}>${item.name}</option>`).join('')}
          </select>
          <div class="tabs" style="padding:2px">
            <span class="tab active" style="padding:6px 12px;font-size:var(--text-xs)">Classification</span>
            <span class="tab" style="padding:6px 12px;font-size:var(--text-xs)">Regression</span>
            <span class="tab" style="padding:6px 12px;font-size:var(--text-xs)">Clustering</span>
          </div>
        </div>
      </div>

      <!-- Confidence + Classification -->
      <div class="grid grid-cols-3 section">
        <!-- Confidence Gauge -->
        <div class="card" style="text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div class="progress-ring" style="margin-bottom:var(--space-4)">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle class="progress-ring-bg" cx="80" cy="80" r="70" stroke-width="8"/>
              <circle class="progress-ring-fill" cx="80" cy="80" r="70" stroke-width="8"
                stroke="url(#gauge-gradient)"
                stroke-dasharray="${2 * Math.PI * 70}"
                stroke-dashoffset="${2 * Math.PI * 70 * (1 - pr.confidence / 100)}"
                style="transition:stroke-dashoffset 1s ease"/>
              <defs>
                <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#3B82F6"/>
                  <stop offset="100%" stop-color="#06B6D4"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="progress-ring-text" style="font-size:var(--text-h2);font-weight:800">${pr.confidence}%</span>
          </div>
          <h3 style="font-size:var(--text-h4);margin-bottom:var(--space-1)">Prediction Confidence</h3>
          <p style="font-size:var(--text-sm);color:var(--text-muted)">Based on CivilizationNet v4</p>
        </div>

        <!-- Classification Result -->
        <div class="card" style="display:flex;flex-direction:column;justify-content:center">
          <div style="margin-bottom:var(--space-6)">
            <span style="font-size:var(--text-xs);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em">Classification Result</span>
            <h2 style="font-size:var(--text-h2);margin-top:var(--space-2);color:var(--success)">${pr.classification}</h2>
          </div>
          <div style="margin-bottom:var(--space-4)">
            <span style="font-size:var(--text-xs);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em">Risk Level</span>
            <div class="flex items-center gap-3" style="margin-top:var(--space-2)">
              <span class="badge badge-amber" style="font-size:var(--text-xs);padding:4px 12px">${pr.riskLevel}</span>
              <div class="progress-bar" style="flex:1">
                <div class="progress-bar-fill" style="width:48%;background:var(--warning)"></div>
              </div>
            </div>
          </div>
          <div class="alert alert-info" style="padding:var(--space-3);font-size:var(--text-xs)">
            ${icon('info', 16)}
            <span>Model trained on 12,847 world simulations with 94.7% validation accuracy</span>
          </div>
        </div>

        <!-- Risk Radar -->
        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">Risk Analysis</span>
          </div>
          <div class="chart-container" style="height:220px">
            <canvas id="risk-radar" aria-label="Risk analysis radar chart"></canvas>
          </div>
        </div>
      </div>

      <!-- Feature Importance -->
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:var(--space-6)">
        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">Feature Importance</span>
          </div>
          <div class="chart-container" style="height:280px">
            <canvas id="feature-chart" aria-label="Feature importance bar chart"></canvas>
          </div>
        </div>

        <!-- Explanation -->
        <div class="card explanation-card" style="padding:var(--space-6)">
          <div class="flex items-center gap-3" style="margin-bottom:var(--space-5)">
            <div style="width:40px;height:40px;border-radius:var(--radius-lg);background:var(--info-dim);display:flex;align-items:center;justify-content:center">
              ${icon('sparkles', 20)}
            </div>
            <div>
              <h3 style="font-size:var(--text-body);font-weight:600">AI Explanation</h3>
              <p style="font-size:var(--text-xs);color:var(--text-muted)">Natural language analysis</p>
            </div>
          </div>
          <div style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8">
            <p style="margin-bottom:var(--space-3)">
              Nova Terra shows a <strong style="color:var(--success)">sustainable growth</strong> trajectory based on its current parameters. The primary drivers are:
            </p>
            <p style="margin-bottom:var(--space-3)">
              <strong style="color:var(--text-primary)">Water Resources</strong> (importance: 0.92) — Adequate water coverage at 68% provides a strong foundation for agricultural and industrial development.
            </p>
            <p style="margin-bottom:var(--space-3)">
              <strong style="color:var(--text-primary)">Technology Level</strong> (importance: 0.85) — Industrial-era technology enables efficient resource extraction and economic growth.
            </p>
            <p>
              <strong style="color:var(--warning)">Caution:</strong> Population density (negative correlation at 0.78) may become a limiting factor if urbanization exceeds infrastructure capacity.
            </p>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="section" style="margin-top:var(--space-6)">
        <div class="section-header">
          <h3 class="section-title">${icon('sparkles', 18)} AI Recommendations</h3>
        </div>
        <div class="flex flex-col gap-4">
          ${pr.recommendations.map((rec, i) => `
            <div class="recommendation-card hover-lift">
              <div class="recommendation-number">${i + 1}</div>
              <div style="flex:1">
                <div class="flex items-center gap-2" style="margin-bottom:var(--space-1)">
                  <h4 style="font-size:var(--text-sm);font-weight:600">${rec.title}</h4>
                  <span class="badge badge-${rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'amber' : 'green'}">${rec.priority}</span>
                </div>
                <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.6">${rec.desc}</p>
              </div>
              <button class="btn btn-ghost btn-sm" style="flex-shrink:0;align-self:center">
                Apply ${icon('arrowRight', 14)}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function initPredictions() {
  const worlds = getWorlds();
  const w = getActiveWorld() || worlds[0];
  if (!w) return;

  const pr = computeWorldPredictions(w);

  // World selector
  const worldSelect = document.getElementById('pred-world-select');
  if (worldSelect) {
    worldSelect.addEventListener('change', (e) => {
      setActiveWorldId(e.target.value);
    });
  }

  // Risk Radar
  const radarCanvas = document.getElementById('risk-radar');
  if (radarCanvas) {
    createRadarChart(radarCanvas,
      pr.riskDimensions.labels,
      [{
        label: `${w.name} Risk Score`,
        data: pr.riskDimensions.values,
        borderColor: chartColors.amber.main,
        backgroundColor: chartColors.amber.dim,
        borderWidth: 2,
        pointBackgroundColor: chartColors.amber.main,
        pointRadius: 4,
      }]
    );
  }

  // Feature Importance
  const featureCanvas = document.getElementById('feature-chart');
  if (featureCanvas) {
    createBarChart(featureCanvas,
      pr.features.map(f => f.name),
      [{
        label: 'Correlation Weight',
        data: pr.features.map(f => f.importance),
        backgroundColor: pr.features.map(f =>
          f.direction === 'positive' ? chartColors.blue.main :
          f.direction === 'negative' ? chartColors.red.main :
          chartColors.purple.main
        ),
        borderRadius: 6,
        barThickness: 24,
      }],
      { indexAxis: 'y', scales: { x: { max: 1, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { grid: { display: false } } } }
    );
  }
}
