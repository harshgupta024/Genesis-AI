/* ============================================================
   GENESIS — Chart.js Wrapper with Observatory Theme
   ============================================================ */

import Chart from 'chart.js/auto';

// Genesis Observatory theme defaults
const genesisDefaults = {
  color: '#9a9590',
  borderColor: 'rgba(255, 255, 255, 0.04)',
  font: { family: "'IBM Plex Mono', monospace", size: 11 },
};

Chart.defaults.color = genesisDefaults.color;
Chart.defaults.borderColor = genesisDefaults.borderColor;
Chart.defaults.font.family = genesisDefaults.font.family;
Chart.defaults.font.size = genesisDefaults.font.size;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 20;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10, 12, 16, 0.95)';
Chart.defaults.plugins.tooltip.titleColor = '#e8e4e0';
Chart.defaults.plugins.tooltip.titleFont = { family: "'Space Grotesk', sans-serif", weight: 600 };
Chart.defaults.plugins.tooltip.bodyColor = '#9a9590';
Chart.defaults.plugins.tooltip.bodyFont = { family: "'IBM Plex Mono', monospace" };
Chart.defaults.plugins.tooltip.borderColor = 'rgba(196, 122, 90, 0.15)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.elements.point.radius = 0;
Chart.defaults.elements.point.hoverRadius = 5;
Chart.defaults.elements.line.tension = 0.4;
Chart.defaults.elements.line.borderWidth = 2;

export const chartColors = {
  blue:   { main: '#c47a5a', dim: 'rgba(196, 122, 90, 0.12)', gradient: ['rgba(196, 122, 90, 0.25)', 'rgba(196, 122, 90, 0)'] },
  cyan:   { main: '#7a9e8e', dim: 'rgba(122, 158, 142, 0.12)', gradient: ['rgba(122, 158, 142, 0.25)', 'rgba(122, 158, 142, 0)'] },
  purple: { main: '#8ba5b8', dim: 'rgba(139, 165, 184, 0.12)', gradient: ['rgba(139, 165, 184, 0.25)', 'rgba(139, 165, 184, 0)'] },
  green:  { main: '#6b9e7a', dim: 'rgba(107, 158, 122, 0.12)', gradient: ['rgba(107, 158, 122, 0.25)', 'rgba(107, 158, 122, 0)'] },
  amber:  { main: '#c4a35a', dim: 'rgba(196, 163, 90, 0.12)',  gradient: ['rgba(196, 163, 90, 0.25)', 'rgba(196, 163, 90, 0)'] },
  red:    { main: '#b85c5c', dim: 'rgba(184, 92, 92, 0.12)',   gradient: ['rgba(184, 92, 92, 0.25)', 'rgba(184, 92, 92, 0)'] },
  pink:   { main: '#a87a8a', dim: 'rgba(168, 122, 138, 0.12)', gradient: ['rgba(168, 122, 138, 0.25)', 'rgba(168, 122, 138, 0)'] },
};

export function createGradient(ctx, colorKey) {
  const c = chartColors[colorKey] || chartColors.blue;
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradient.addColorStop(0, c.gradient[0]);
  gradient.addColorStop(1, c.gradient[1]);
  return gradient;
}

export function createLineChart(canvas, labels, datasets, options = {}) {
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { family: "'IBM Plex Mono', monospace", size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { maxTicksLimit: 6, font: { family: "'IBM Plex Mono', monospace", size: 10 } } },
      },
      plugins: {
        legend: { display: datasets.length > 1 },
      },
      ...options,
    },
  });
}

export function createBarChart(canvas, labels, datasets, options = {}) {
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { maxTicksLimit: 6 } },
      },
      plugins: {
        legend: { display: datasets.length > 1 },
      },
      borderRadius: 6,
      ...options,
    },
  });
}

export function createDoughnutChart(canvas, labels, data, colors, options = {}) {
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { family: "'IBM Plex Mono', monospace", size: 10 } } },
      },
      ...options,
    },
  });
}

export function createRadarChart(canvas, labels, datasets, options = {}) {
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'radar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.04)' },
          grid: { color: 'rgba(255,255,255,0.04)' },
          pointLabels: { color: '#9a9590', font: { family: "'IBM Plex Mono', monospace", size: 10 } },
          ticks: { display: false },
          suggestedMin: 0,
        },
      },
      plugins: {
        legend: { display: datasets.length > 1 },
      },
      ...options,
    },
  });
}

export function createSparkline(canvas, data, colorKey = 'blue') {
  const ctx = canvas.getContext('2d');
  const c = chartColors[colorKey] || chartColors.blue;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: c.main,
        backgroundColor: createGradient(ctx, colorKey),
        fill: true,
        borderWidth: 1.5,
        tension: 0.4,
        pointRadius: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      elements: { line: { borderWidth: 1.5 } },
    },
  });
}

export { Chart };
