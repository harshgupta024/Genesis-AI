/* ============================================================
   GENESIS AI — Simulation Center Page
   Real-time procedural planetary simulation engine
   ============================================================ */

import { icon } from '../icons.js';
import { getActiveWorld, getWorlds, setActiveWorldId, updateWorld } from '../utils/world-manager.js';
import { createLineChart, chartColors } from '../utils/charts.js';

// Procedural generator for planet-specific simulation metrics & history
function generateWorldSimulationData(w) {
  const seed = (w.seed || 12345) % 10000;
  const pop = Number(w.population) || 10000;
  const gravity = Number(w.gravity) || 1.0;
  const water = Number(w.waterCoverage) || 50;
  const climate = w.climate || 'Temperate';
  const tech = w.techLevel || 'Industrial';
  const species = w.species || 'Humanoid';

  // Tech multiplier
  const techMultipliers = {
    'Stone Age': { index: 15, gdp: 12, maxYear: 1200, growth: 0.05 },
    'Bronze Age': { index: 45, gdp: 35, maxYear: 2800, growth: 0.12 },
    'Iron Age': { index: 80, gdp: 70, maxYear: 3800, growth: 0.18 },
    'Medieval': { index: 160, gdp: 140, maxYear: 5200, growth: 0.25 },
    'Renaissance': { index: 320, gdp: 310, maxYear: 6800, growth: 0.40 },
    'Industrial': { index: 780, gdp: 890, maxYear: 8400, growth: 0.75 },
    'Modern': { index: 2100, gdp: 3400, maxYear: 9600, growth: 1.10 },
    'Space Age': { index: 5800, gdp: 9200, maxYear: 10000, growth: 1.65 },
  };
  const tm = techMultipliers[tech] || techMultipliers['Industrial'];

  // Climate specific alerts
  const climateAlerts = {
    Temperate: [
      { title: 'Seasonal Atmospheric Inversion', severity: 'warning', text: `Regional thermal shifts across ${w.name}'s prime continental basin are causing temporary crop yield variance.` },
      { title: 'Tectonic Fault Stabilization', severity: 'info', text: 'Sub-crustal harmonic monitors report low-magnitude stress release with minimal civilian disruption.' }
    ],
    Arid: [
      { title: 'Critical Aquifer Depletion', severity: 'danger', text: `Deep subterranean water reserves in southern ${w.name} depleted to 14%. Emergency vapor condensation grids deployed.` },
      { title: 'Haboob Sandstorm Warning', severity: 'warning', text: 'Continental dust front tracking west at 85 km/h. Solar receptor output reduced by 40%.' }
    ],
    Arctic: [
      { title: 'Cryo-Glacial Fracture', severity: 'danger', text: `Tectonic shifting under polar ice pack threatening primary subsurface geothermal tap on ${w.name}.` },
      { title: 'Sub-Zero Aurora Disruption', severity: 'warning', text: 'Ionospheric radiation flare inducing magnetic compass drift in northern shipping quadrants.' }
    ],
    Oceanic: [
      { title: 'Megatsunami Wave Advisory', severity: 'danger', text: `Abyssal trench subduction event generated 42m tidal displacement heading towards ${w.name}'s platform atolls.` },
      { title: 'Kelp Canopy Proliferation', severity: 'info', text: 'Photosynthetic biomass expanded 18%, increasing atmospheric oxygen saturation to optimal thresholds.' }
    ],
    Volcanic: [
      { title: 'Supervolcano Mantle Plume', severity: 'danger', text: `Major pyroclastic rupture detected in Sector 04. Estimated 12-month solar occlusion if unrestrained.` },
      { title: 'Magma Geothermal Tap Surge', severity: 'warning', text: 'Core heat exchange reached 140% capacity, boosting heavy industrial output but straining cooling towers.' }
    ],
    Desert: [
      { title: 'Thermal Radiation Surge', severity: 'warning', text: `Diurnal surface temperature delta exceeded 55°C. Unshielded surface operations suspended between midday hours.` },
      { title: 'Silicate Dunes Encroachment', severity: 'warning', text: 'Mobile barchan dune formations threatening perimeter barriers of eastern oasis settlements.' }
    ],
    Tropical: [
      { title: 'Hyper-Fungal Spore Front', severity: 'danger', text: `Rapid biosphere adaptation caused fungal contagion across central agricultural zone on ${w.name}.` },
      { title: 'Monsoon Saturation Threshold', severity: 'warning', text: 'Annual precipitation exceeded standard rainfall models by 34%, flooding low-lying river settlements.' }
    ],
  };

  const alerts = climateAlerts[climate] || climateAlerts['Temperate'];

  // Species-tailored procedural events
  const events = [
    { time: 'Y0840', type: 'genesis', text: `Emergence of sentient ${species} clans across fertile basins of ${w.name}`, severity: 'info' },
    { time: 'Y1920', type: 'milestone', text: `First permanent agrarian architecture and stone monuments erected`, severity: 'success' },
    { time: 'Y2840', type: 'climate', text: `${climate} weather stabilization allows sustained multi-regional trade routes`, severity: 'info' },
    { time: 'Y3950', type: 'technology', text: `Metallurgical breakthrough: High-tensile bronze & iron alloys developed`, severity: 'success' },
    { time: 'Y4820', type: 'crisis', text: `${water < 40 ? 'Severe continental drought' : 'Great maritime storm'} triggers mass migration and societal reorganization`, severity: 'danger' },
    { time: 'Y5730', type: 'breakthrough', text: `Formal scientific codification, mathematics, and philosophy academies founded`, severity: 'success' },
    { time: 'Y6890', type: 'industry', text: `Mechanized power harnessed; fossil/geothermal energy drives rapid urbanization`, severity: 'info' },
    { time: 'Y7940', type: 'social', text: `${w.government || 'Global'} political federation formed across all discovered continents`, severity: 'success' },
    { time: 'Y8810', type: 'breakthrough', text: `Digital computation and automated cybernetics infrastructure activated`, severity: 'info' },
    { time: 'Y9450', type: 'current', text: `Modern planetary telemetry synchronized: Current population reached ${pop.toLocaleString()}`, severity: 'success' },
  ];

  // Procedural history points (7 steps)
  const years = ['Y1000', 'Y2500', 'Y4000', 'Y5500', 'Y7000', 'Y8500', `Y${tm.maxYear}`];
  const popHistory = [
    Math.round(pop * 0.002),
    Math.round(pop * 0.015),
    Math.round(pop * 0.06),
    Math.round(pop * 0.18),
    Math.round(pop * 0.45),
    Math.round(pop * 0.82),
    pop,
  ];
  const gdpHistory = [
    Math.round(tm.gdp * 0.01),
    Math.round(tm.gdp * 0.04),
    Math.round(tm.gdp * 0.12),
    Math.round(tm.gdp * 0.28),
    Math.round(tm.gdp * 0.55),
    Math.round(tm.gdp * 0.88),
    tm.gdp,
  ];
  const techHistory = [
    5,
    18,
    Math.round(tm.index * 0.15),
    Math.round(tm.index * 0.35),
    Math.round(tm.index * 0.60),
    Math.round(tm.index * 0.85),
    tm.index,
  ];

  const climateStability = Math.max(30, Math.min(98, Math.round(92 - (Math.abs(gravity - 1.0) * 15) - (climate === 'Volcanic' ? 25 : climate === 'Arid' ? 12 : 0))));

  return {
    world: w,
    tm,
    years,
    popHistory,
    gdpHistory,
    techHistory,
    climateStability,
    alerts,
    events,
  };
}

let activeSimState = {
  currentTab: 'Population',
  isPlaying: true,
  speed: '10x',
  currentYear: 8400,
  chartInstance: null,
};

export function renderSimulation() {
  const worlds = getWorlds();
  const w = getActiveWorld() || worlds[0] || {
    id: 'w1', name: 'Nova Terra', population: 8420000, gravity: 1.02,
    waterCoverage: 68, climate: 'Temperate', techLevel: 'Industrial',
    simStatus: 'running', epoch: 'Era V — Industrial Age', color: '#3B82F6',
  };

  const simData = generateWorldSimulationData(w);

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="page-header-left">
          <div class="flex items-center gap-3">
            <h1 class="page-title">Simulation Center: <span style="color:${w.color || 'var(--accent-blue)'}">${w.name}</span></h1>
            <span class="badge badge-${w.simStatus === 'running' ? 'green' : 'amber'}" style="font-size:var(--text-xs);padding:4px 10px">
              <span class="badge-dot"></span> ${w.simStatus === 'running' ? 'Running' : 'Paused'}
            </span>
          </div>
          <p class="page-subtitle">Real-time planetary dynamics, biome evolution, and civilizational growth</p>
        </div>

        <div class="page-actions" style="display:flex;align-items:center;gap:var(--space-3)">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:var(--text-2xs);color:var(--text-muted);font-family:var(--font-mono);text-transform:uppercase">Switch World:</span>
            <select id="sim-world-selector" class="select" style="padding:6px 28px 6px 10px;font-size:var(--text-xs);font-weight:600" aria-label="Select world to simulate">
              ${worlds.map(item => `
                <option value="${item.id}" ${item.id === w.id ? 'selected' : ''}>
                  ${item.name} (${item.climate}, ${item.techLevel})
                </option>
              `).join('')}
            </select>
          </div>
          <a href="#/viewer" class="btn btn-secondary btn-sm" style="display:flex;align-items:center;gap:6px">
            ${icon('eye', 14)} 3D Globe
          </a>
        </div>
      </div>

      <!-- Transport Controls -->
      <div class="sim-transport">
        <button class="transport-btn" id="sim-reset-btn" aria-label="Reset simulation">${icon('rotateCcw', 18)}</button>
        <button class="transport-btn play" id="sim-play-toggle" aria-label="${w.simStatus === 'running' ? 'Pause' : 'Play'}">
          ${icon(w.simStatus === 'running' ? 'pause' : 'play', 18)}
        </button>
        <button class="transport-btn" id="sim-step-forward" aria-label="Fast forward step">${icon('skipForward', 18)}</button>

        <div style="flex:1;margin:0 var(--space-4)">
          <input class="range-slider" id="sim-timeline-slider" type="range" min="0" max="10000" value="${activeSimState.currentYear}" style="width:100%" aria-label="Simulation timeline scrubber" />
          <div class="flex justify-between" style="font-size:var(--text-2xs);font-family:var(--font-mono);color:var(--text-muted);margin-top:4px">
            <span>Y0 (Genesis)</span>
            <span>Y2500</span>
            <span>Y5000</span>
            <span>Y7500</span>
            <span>Y10000+</span>
          </div>
        </div>

        <div class="sim-epoch-badge" id="sim-year-display">
          ${icon('clock', 14)}
          <span id="sim-year-text">Year ${activeSimState.currentYear.toLocaleString()}</span>
        </div>

        <div class="sim-speed">
          <span>Speed:</span>
          <select id="sim-speed-select" class="select" style="padding:4px 28px 4px 8px;font-size:var(--text-xs)" aria-label="Simulation speed">
            <option value="1x">1x</option>
            <option value="2x">2x</option>
            <option value="5x">5x</option>
            <option value="10x" selected>10x</option>
            <option value="50x">50x</option>
            <option value="100x">100x</option>
          </select>
        </div>
      </div>

      <!-- Live Statistics Grid for Active Planet -->
      <div class="grid grid-cols-4 section" style="margin-top:var(--space-6)">
        <div class="card metric-card hover-lift">
          <div class="flex items-center justify-between">
            <div class="metric-icon blue">${icon('users', 20)}</div>
            <div class="metric-change positive">${icon('trendingUp', 12)} +${(simData.tm.growth * 3.2).toFixed(1)}%/era</div>
          </div>
          <div class="metric-label">Current Population</div>
          <div class="metric-value" id="metric-sim-pop">${w.population.toLocaleString()}</div>
          <div style="font-size:var(--text-2xs);color:var(--text-muted);margin-top:4px">${w.species || 'Humanoid'} dominant</div>
        </div>

        <div class="card metric-card hover-lift">
          <div class="flex items-center justify-between">
            <div class="metric-icon green">${icon('barChart', 20)}</div>
            <div class="metric-change positive">${icon('trendingUp', 12)} +${(simData.tm.growth * 4.5).toFixed(1)}%</div>
          </div>
          <div class="metric-label">GDP Index</div>
          <div class="metric-value" id="metric-sim-gdp">${simData.tm.gdp.toLocaleString()} Gc</div>
          <div style="font-size:var(--text-2xs);color:var(--text-muted);margin-top:4px">${w.economy || 'Mixed'} Model</div>
        </div>

        <div class="card metric-card hover-lift">
          <div class="flex items-center justify-between">
            <div class="metric-icon purple">${icon('cpu', 20)}</div>
            <div class="metric-change positive">${icon('trendingUp', 12)} ${w.techLevel}</div>
          </div>
          <div class="metric-label">Tech Progression</div>
          <div class="metric-value" id="metric-sim-tech">${simData.tm.index} pts</div>
          <div style="font-size:var(--text-2xs);color:var(--text-muted);margin-top:4px">${w.epoch || 'Active Epoch'}</div>
        </div>

        <div class="card metric-card hover-lift">
          <div class="flex items-center justify-between">
            <div class="metric-icon amber">${icon('thermometer', 20)}</div>
            <div class="metric-change ${simData.climateStability > 70 ? 'positive' : 'negative'}">
              ${icon(simData.climateStability > 70 ? 'trendingUp' : 'trendingDown', 12)} ${w.climate}
            </div>
          </div>
          <div class="metric-label">Climate Stability</div>
          <div class="metric-value" id="metric-sim-climate">${simData.climateStability}%</div>
          <div style="font-size:var(--text-2xs);color:var(--text-muted);margin-top:4px">${w.waterCoverage}% Hydro Coverage</div>
        </div>
      </div>

      <!-- Charts + Alerts + Event Log -->
      <div class="grid" style="grid-template-columns:1fr 380px;gap:var(--space-6)">
        <div class="flex flex-col gap-6">
          <div class="card chart-card">
            <div class="chart-header">
              <span class="chart-title" id="sim-chart-heading">${activeSimState.currentTab} Dynamics — ${w.name}</span>
              <div class="tabs" id="sim-chart-tabs" style="padding:2px">
                <span class="tab ${activeSimState.currentTab === 'Population' ? 'active' : ''}" data-tab="Population" style="padding:4px 10px;font-size:var(--text-xs);cursor:pointer">Population</span>
                <span class="tab ${activeSimState.currentTab === 'Economy' ? 'active' : ''}" data-tab="Economy" style="padding:4px 10px;font-size:var(--text-xs);cursor:pointer">Economy</span>
                <span class="tab ${activeSimState.currentTab === 'Technology' ? 'active' : ''}" data-tab="Technology" style="padding:4px 10px;font-size:var(--text-xs);cursor:pointer">Technology</span>
              </div>
            </div>
            <div class="chart-container" style="height:280px">
              <canvas id="sim-chart" aria-label="Simulation metrics dynamic chart"></canvas>
            </div>
          </div>

          <!-- Dynamic Alerts for this Specific World -->
          <div>
            <div class="section-header" style="margin-bottom:var(--space-3)">
              <h3 class="section-title">${icon('alertTriangle', 18)} Active Planetary Alerts: ${w.name}</h3>
              <span style="font-size:var(--text-xs);color:var(--text-muted)">Calibrated to ${w.climate} Environment</span>
            </div>
            <div class="grid grid-cols-2" style="gap:var(--space-4)">
              ${simData.alerts.map(a => `
                <div class="card ${a.severity === 'danger' ? 'disaster-card' : ''}" style="padding:var(--space-4);${a.severity === 'warning' ? 'border-color:rgba(245,158,11,0.3);background:var(--warning-dim)' : ''}">
                  <div class="flex items-center gap-2" style="margin-bottom:var(--space-2)">
                    <div style="color:${a.severity === 'danger' ? 'var(--danger)' : a.severity === 'warning' ? 'var(--warning)' : 'var(--info)'}">
                      ${icon('alertTriangle', 16)}
                    </div>
                    <span class="disaster-severity" style="color:${a.severity === 'danger' ? 'var(--danger)' : a.severity === 'warning' ? 'var(--warning)' : 'var(--info)'};font-weight:600;text-transform:uppercase;font-size:var(--text-2xs)">
                      ${a.severity}
                    </span>
                  </div>
                  <h4 style="font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-1);color:var(--text-primary)">${a.title}</h4>
                  <p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.5">${a.text}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Planet History & Event Log -->
        <div class="card" style="height:fit-content">
          <div class="section-header" style="margin-bottom:var(--space-4)">
            <div>
              <h3 class="section-title">Civilization Chronicle</h3>
              <div style="font-size:var(--text-2xs);color:var(--text-muted);margin-top:2px">${w.species} Epoch Milestones</div>
            </div>
            <span class="badge badge-blue" style="font-size:10px">${simData.events.length} records</span>
          </div>
          <div class="event-log no-scrollbar" style="max-height:480px;overflow-y:auto">
            ${simData.events.map(e => `
              <div class="event-log-item">
                <span class="event-log-time">${e.time}</span>
                <div>
                  <span class="badge badge-${e.severity === 'danger' ? 'red' : e.severity === 'warning' ? 'amber' : e.severity === 'success' ? 'green' : 'blue'}" style="font-size:8px;margin-bottom:4px;text-transform:uppercase">
                    ${e.type}
                  </span>
                  <div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.4">${e.text}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSimulation() {
  const worlds = getWorlds();
  const w = getActiveWorld() || worlds[0];
  if (!w) return;

  const simData = generateWorldSimulationData(w);
  const canvas = document.getElementById('sim-chart');

  // Function to render chart based on active tab
  function renderChartForTab(tab) {
    if (!canvas) return;
    if (activeSimState.chartInstance) {
      activeSimState.chartInstance.destroy();
      activeSimState.chartInstance = null;
    }

    let label = 'Population Growth';
    let data = simData.popHistory;
    let color = chartColors.blue.main;
    let bgColor = chartColors.blue.dim;

    if (tab === 'Economy') {
      label = 'GDP Output (Gc)';
      data = simData.gdpHistory;
      color = chartColors.green.main;
      bgColor = chartColors.green.dim;
    } else if (tab === 'Technology') {
      label = 'Tech Index Level';
      data = simData.techHistory;
      color = chartColors.purple.main;
      bgColor = chartColors.purple.dim;
    }

    activeSimState.chartInstance = createLineChart(
      canvas,
      simData.years,
      [{
        label,
        data,
        borderColor: color,
        backgroundColor: bgColor,
        fill: true,
        tension: 0.35,
      }]
    );
  }

  renderChartForTab(activeSimState.currentTab);

  // Tab switching
  const tabs = document.querySelectorAll('#sim-chart-tabs .tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeSimState.currentTab = tab.dataset.tab;
      const heading = document.getElementById('sim-chart-heading');
      if (heading) heading.textContent = `${activeSimState.currentTab} Dynamics — ${w.name}`;
      renderChartForTab(activeSimState.currentTab);
    });
  });

  // World selector dropdown
  const worldSelect = document.getElementById('sim-world-selector');
  if (worldSelect) {
    worldSelect.addEventListener('change', (e) => {
      setActiveWorldId(e.target.value);
    });
  }

  // Transport controls
  const playBtn = document.getElementById('sim-play-toggle');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const newStatus = w.simStatus === 'running' ? 'paused' : 'running';
      updateWorld(w.id, { simStatus: newStatus });
    });
  }

  const slider = document.getElementById('sim-timeline-slider');
  const yearText = document.getElementById('sim-year-text');
  if (slider && yearText) {
    slider.addEventListener('input', (e) => {
      const year = parseInt(e.target.value, 10);
      activeSimState.currentYear = year;
      yearText.textContent = `Year ${year.toLocaleString()}`;

      // Dynamically calculate live population based on scrubber
      const maxYear = simData.tm.maxYear || 8400;
      const fraction = Math.max(0.01, Math.min(1.2, year / maxYear));
      const currentPop = Math.round(Number(w.population) * Math.pow(fraction, 1.8));
      const popEl = document.getElementById('metric-sim-pop');
      if (popEl) popEl.textContent = currentPop.toLocaleString();

      const currentGdp = Math.round(simData.tm.gdp * Math.pow(fraction, 1.5));
      const gdpEl = document.getElementById('metric-sim-gdp');
      if (gdpEl) gdpEl.textContent = `${currentGdp.toLocaleString()} Gc`;
    });
  }

  const resetBtn = document.getElementById('sim-reset-btn');
  if (resetBtn && slider && yearText) {
    resetBtn.addEventListener('click', () => {
      slider.value = 1000;
      slider.dispatchEvent(new Event('input'));
    });
  }
}
