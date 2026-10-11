/* ============================================================
   GENESIS AI — Analytics Page
   ============================================================ */

import { icon } from '../icons.js';
import { getWorlds } from '../utils/world-manager.js';
import { createLineChart, createBarChart, createDoughnutChart, createRadarChart, chartColors } from '../utils/charts.js';

export function renderAnalytics() {
  const worlds = getWorlds();
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Analytics</h1>
          <p class="page-subtitle">Interactive data visualization and trends across your worlds</p>
        </div>
        <div class="page-actions">
          <select class="select" aria-label="Select world">
            ${worlds.map(w => `<option>${w.name}</option>`).join('')}
            <option>All Worlds</option>
          </select>

          <select class="select" aria-label="Time range">
            <option>All Time</option>
            <option>Last Era</option>
            <option>Last 3 Eras</option>
          </select>
          <button class="btn btn-secondary btn-sm">${icon('download', 16)} Export</button>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-2 section">
        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">Population Growth</span>
            <span style="font-size:var(--text-xs);color:var(--success)">+23.4% growth</span>
          </div>
          <div class="chart-container">
            <canvas id="analytics-pop" aria-label="Population growth chart"></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">Economic Output</span>
            <span style="font-size:var(--text-xs);color:var(--success)">+5.1% GDP</span>
          </div>
          <div class="chart-container">
            <canvas id="analytics-econ" aria-label="Economic output chart"></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">Resource Distribution</span>
          </div>
          <div class="chart-container">
            <canvas id="analytics-resource" aria-label="Resource distribution chart"></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">Technology Progress</span>
          </div>
          <div class="chart-container">
            <canvas id="analytics-tech" aria-label="Technology progress radar"></canvas>
          </div>
        </div>
      </div>

      <!-- Comparison Row -->
      <div class="grid grid-cols-3" style="gap:var(--space-6)">
        <div class="card chart-card" style="grid-column:span 2">
          <div class="chart-header">
            <span class="chart-title">Multi-World Comparison</span>
            <div class="tabs" style="padding:2px">
              <span class="tab active" style="padding:4px 10px;font-size:var(--text-xs)">Population</span>
              <span class="tab" style="padding:4px 10px;font-size:var(--text-xs)">Economy</span>
              <span class="tab" style="padding:4px 10px;font-size:var(--text-xs)">Technology</span>
            </div>
          </div>
          <div class="chart-container" style="height:280px">
            <canvas id="analytics-comparison" aria-label="Multi-world comparison"></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">Climate Stability</span>
          </div>
          <div class="chart-container" style="height:280px">
            <canvas id="analytics-climate" aria-label="Climate stability chart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function initAnalytics() {
  // Fetch real data
  const [popData, econData, healthData, climateData] = await Promise.all([
    fetch('/data/population.json').then(r => r.ok ? r.json() : null).catch(() => null),
    fetch('/data/economy.json').then(r => r.ok ? r.json() : null).catch(() => null),
    fetch('/data/health.json').then(r => r.ok ? r.json() : null).catch(() => null),
    fetch('/data/climate.json').then(r => r.ok ? r.json() : null).catch(() => null),
  ]);

  // Population chart — real global population over time
  const popCanvas = document.getElementById('analytics-pop');
  if (popCanvas && popData && popData.yearly_trends) {
    const t = popData.yearly_trends;
    // Sample every 5th year to avoid clutter
    const step = Math.max(1, Math.floor(t.years.length / 15));
    const years = t.years.filter((_, i) => i % step === 0);
    const pops = t.global_pop.filter((_, i) => i % step === 0);
    createLineChart(popCanvas, years.map(String), [{
      label: 'Global Population',
      data: pops,
      borderColor: chartColors.blue.main,
      backgroundColor: chartColors.blue.dim,
      fill: true,
    }]);
  } else if (popCanvas) {
    // Fallback to mock
    createLineChart(popCanvas, ['Era I','Era II','Era III','Era IV','Era V','Era VI','Era VII','Era VIII'], [{
      label: 'Population', data: [1000,12000,85000,420000,1800000,4200000,6800000,8420000],
      borderColor: chartColors.blue.main, backgroundColor: chartColors.blue.dim, fill: true,
    }]);
  }

  // Economy chart — real GDP growth % or GDP per capita over time
  const econCanvas = document.getElementById('analytics-econ');
  if (econCanvas && econData && econData.yearly_trends) {
    const t = econData.yearly_trends;
    const step = Math.max(1, Math.floor(t.years.length / 15));
    const years = t.years.filter((_, i) => i % step === 0);
    const gdpGrowth = t.gdp_growth.filter((_, i) => i % step === 0);
    createBarChart(econCanvas, years.map(String), [{
      label: 'Avg GDP Growth %',
      data: gdpGrowth,
      backgroundColor: gdpGrowth.map(v => v >= 0 ? chartColors.green.main : chartColors.red.main),
      borderRadius: 4,
    }]);
  } else if (econCanvas) {
    createBarChart(econCanvas,
      ['Agriculture','Industry','Services','Tech','Military','Research'],
      [{ label: 'GDP Share (%)', data: [15,35,25,15,5,5],
        backgroundColor: [chartColors.green.main,chartColors.blue.main,chartColors.cyan.main,chartColors.purple.main,chartColors.red.main,chartColors.amber.main],
        borderRadius: 6 }]
    );
  }

  // Resources — real health indicators as a doughnut (life expectancy, sanitation, etc.)
  const resCanvas = document.getElementById('analytics-resource');
  if (resCanvas && healthData && healthData.summary) {
    const s = healthData.summary;
    const lifeExp = s.avg_life_expectancy || 70;
    // Use latest data point for each metric
    const trends = healthData.yearly_trends;
    const lastIdx = trends.years.length - 1;
    const sanitation = trends.sanitation[lastIdx] || 65;
    const water = trends.drinking_water[lastIdx] || 75;
    const infantMort = trends.infant_mortality[lastIdx] || 25;
    createDoughnutChart(resCanvas,
      ['Life Expectancy (avg)', 'Sanitation %', 'Clean Water %', 'Infant Mortality'],
      [Math.round(lifeExp), Math.round(sanitation), Math.round(water), Math.round(infantMort)],
      [chartColors.blue.main, chartColors.cyan.main, chartColors.green.main, chartColors.red.main]
    );
  } else if (resCanvas) {
    createDoughnutChart(resCanvas, ['Minerals','Water','Biomass','Energy','Rare'], [34,28,22,12,4],
      [chartColors.blue.main,chartColors.cyan.main,chartColors.green.main,chartColors.amber.main,chartColors.purple.main]);
  }

  // Tech Radar — terrain elevation as a radar of regions
  const techCanvas = document.getElementById('analytics-tech');
  if (techCanvas) {
    let terrainData = null;
    try { terrainData = await fetch('/data/terrain.json').then(r => r.json()); } catch {}
    if (terrainData && terrainData.regions) {
      createRadarChart(techCanvas,
        terrainData.regions.map(r => r.name.replace(/_/g, ' ')),
        [{
          label: 'Avg Elevation (m)',
          data: terrainData.regions.map(r => Math.round(r.avg_elevation)),
          borderColor: chartColors.blue.main,
          backgroundColor: chartColors.blue.dim,
          borderWidth: 2,
          pointBackgroundColor: chartColors.blue.main,
          pointRadius: 3,
        }]
      );
    } else {
      createRadarChart(techCanvas, ['Computing','Energy','Transport','Medicine','Agriculture','Military'],
        [{ label: 'Nova Terra', data: [75,60,55,45,80,30],
          borderColor: chartColors.blue.main, backgroundColor: chartColors.blue.dim, borderWidth: 2,
          pointBackgroundColor: chartColors.blue.main, pointRadius: 3 }]);
    }
  }

  // Multi-World Comparison — real life expectancy over time
  const compCanvas = document.getElementById('analytics-comparison');
  if (compCanvas && healthData && healthData.yearly_trends) {
    const t = healthData.yearly_trends;
    const step = Math.max(1, Math.floor(t.years.length / 15));
    const years = t.years.filter((_, i) => i % step === 0);
    const datasets = [];
    if (t.life_expectancy) datasets.push({
      label: 'Life Expectancy', data: t.life_expectancy.filter((_, i) => i % step === 0),
      borderColor: chartColors.blue.main, backgroundColor: 'transparent',
    });
    if (t.infant_mortality) datasets.push({
      label: 'Infant Mortality', data: t.infant_mortality.filter((_, i) => i % step === 0),
      borderColor: chartColors.red.main, backgroundColor: 'transparent',
    });
    if (t.sanitation) datasets.push({
      label: 'Sanitation %', data: t.sanitation.filter((_, i) => i % step === 0),
      borderColor: chartColors.green.main, backgroundColor: 'transparent',
    });
    createLineChart(compCanvas, years.map(String), datasets);
  } else if (compCanvas) {
    const eras = ['Era I','Era II','Era III','Era IV','Era V','Era VI','Era VII','Era VIII'];
    createLineChart(compCanvas, eras, [
      { label: 'Nova Terra', data: [1,12,85,420,1800,4200,6800,8420], borderColor: chartColors.blue.main, backgroundColor: 'transparent' },
      { label: 'Aetheria', data: [1.2,15,120,580,2400,5800,9200,12700], borderColor: chartColors.cyan.main, backgroundColor: 'transparent' },
    ]);
  }

  // Climate chart — real temperature trends
  const climateCanvas = document.getElementById('analytics-climate');
  if (climateCanvas && climateData && climateData.yearly_trends) {
    const t = climateData.yearly_trends;
    const step = Math.max(1, Math.floor(t.years.length / 15));
    const years = t.years.filter((_, i) => i % step === 0);
    const datasets = [];
    if (t.avg_temp) datasets.push({
      label: 'Avg Temp (°C)', data: t.avg_temp.filter((_, i) => i % step === 0),
      borderColor: chartColors.amber.main, backgroundColor: chartColors.amber.dim, fill: true,
    });
    if (t.precipitation) datasets.push({
      label: 'Precipitation (mm)', data: t.precipitation.filter((_, i) => i % step === 0),
      borderColor: chartColors.cyan.main, backgroundColor: chartColors.cyan.dim, fill: true,
    });
    createLineChart(climateCanvas, years.map(String), datasets);
  } else if (climateCanvas) {
    const eras = ['Era I','Era II','Era III','Era IV','Era V','Era VI','Era VII','Era VIII'];
    createLineChart(climateCanvas, eras, [
      { label: 'Stability', data: [95,92,88,85,78,72,69,65], borderColor: chartColors.green.main, backgroundColor: chartColors.green.dim, fill: true },
      { label: 'Risk', data: [5,8,12,15,22,28,31,35], borderColor: chartColors.red.main, backgroundColor: chartColors.red.dim, fill: true },
    ]);
  }
}

