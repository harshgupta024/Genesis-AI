/* ============================================================
   GENESIS AI — World Builder (Multi-Step Wizard)
   ============================================================ */

import { icon } from '../icons.js';
import { createWorld } from '../utils/world-manager.js';

const steps = [
  { label: 'Identity', icon: 'globe' },
  { label: 'Environment', icon: 'mountain' },
  { label: 'Civilization', icon: 'users' },
  { label: 'Resources', icon: 'layers' },
  { label: 'Review', icon: 'check' },
];

let currentStep = 0;
let worldData = {
  name: '', description: '', seed: Math.floor(Math.random() * 999999),
  climate: 'Temperate', gravity: 1.0, waterCoverage: 65, atmosphere: 'Nitrogen-Oxygen',
  population: 10000, techLevel: 'Stone Age', government: 'Tribal', economy: 'Hunter-Gatherer',
  species: 'Humanoid', resources: 'Abundant',
};

export function renderWorldBuilder() {
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">${icon('cube', 28)} World Builder</h1>
          <p class="page-subtitle">Create a new synthetic world for simulation</p>
        </div>
      </div>

      <div class="wizard-container">
        <!-- Progress Steps -->
        <div class="wizard-progress" role="tablist">
          <div class="wizard-progress-fill" id="wizard-fill" style="width:0%"></div>
          ${steps.map((s, i) => `
            <div class="wizard-step ${i === 0 ? 'active' : ''} ${i < currentStep ? 'completed' : ''}" data-step="${i}" role="tab" aria-selected="${i === 0}">
              <div class="wizard-step-number">${i < currentStep ? icon('check', 16) : i + 1}</div>
              <span class="wizard-step-label">${s.label}</span>
            </div>
          `).join('')}
        </div>

        <!-- Wizard Body -->
        <div class="wizard-body" id="wizard-body">
          ${renderStep(0)}
        </div>

        <!-- Wizard Footer -->
        <div class="wizard-footer">
          <div class="autosave-indicator">
            ${icon('save', 14)}
            Auto-saved
          </div>
          <div class="flex gap-3">
            <button class="btn btn-secondary" id="wizard-prev" disabled>
              ${icon('chevronLeft', 16)} Previous
            </button>
            <button class="btn btn-primary" id="wizard-next">
              Next ${icon('chevronRight', 16)}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStep(step) {
  switch (step) {
    case 0: return `
      <div class="wizard-section fade-in-up">
        <h3 class="wizard-section-title">${icon('globe', 20)} Planet Identity</h3>
        <div class="grid grid-cols-2" style="gap:var(--space-5)">
          <div class="input-group" style="grid-column:span 2">
            <label for="world-name">Planet Name</label>
            <input class="input" id="world-name" type="text" placeholder="e.g., Nova Terra, Kepler Prime" value="${worldData.name}" />
          </div>
          <div class="input-group" style="grid-column:span 2">
            <label for="world-desc">Description</label>
            <textarea class="input" id="world-desc" rows="3" placeholder="Describe your world..." style="resize:vertical">${worldData.description}</textarea>
          </div>
          <div class="input-group">
            <label for="world-seed">World Seed</label>
            <input class="input" id="world-seed" type="number" value="${worldData.seed}" />
          </div>
        </div>
      </div>
    `;
    case 1: return `
      <div class="wizard-section fade-in-up">
        <h3 class="wizard-section-title">${icon('mountain', 20)} Environment Configuration</h3>
        <div class="grid grid-cols-2" style="gap:var(--space-5)">
          <div class="input-group">
            <label for="climate">Climate Zone</label>
            <select class="select" id="climate" style="width:100%">
              ${['Temperate', 'Tropical', 'Arid', 'Arctic', 'Oceanic', 'Volcanic', 'Desert'].map(c =>
                `<option ${worldData.climate === c ? 'selected' : ''}>${c}</option>`
              ).join('')}
            </select>
          </div>
          <div class="input-group">
            <label for="atmosphere">Atmosphere</label>
            <select class="select" id="atmosphere" style="width:100%">
              ${['Nitrogen-Oxygen', 'Carbon Dioxide', 'Methane', 'Helium', 'Toxic'].map(a =>
                `<option ${worldData.atmosphere === a ? 'selected' : ''}>${a}</option>`
              ).join('')}
            </select>
          </div>
          <div class="slider-group">
            <div class="slider-header">
              <label>Gravity (g)</label>
              <span class="slider-value" id="gravity-val">${worldData.gravity.toFixed(2)}g</span>
            </div>
            <input class="range-slider" type="range" id="gravity" min="0.1" max="3.0" step="0.01" value="${worldData.gravity}" />
          </div>
          <div class="slider-group">
            <div class="slider-header">
              <label>Water Coverage</label>
              <span class="slider-value" id="water-val">${worldData.waterCoverage}%</span>
            </div>
            <input class="range-slider" type="range" id="water" min="0" max="100" step="1" value="${worldData.waterCoverage}" />
          </div>
        </div>
      </div>
    `;
    case 2: return `
      <div class="wizard-section fade-in-up">
        <h3 class="wizard-section-title">${icon('users', 20)} Civilization Parameters</h3>
        <div class="grid grid-cols-2" style="gap:var(--space-5)">
          <div class="slider-group" style="grid-column:span 2">
            <div class="slider-header">
              <label>Initial Population</label>
              <span class="slider-value" id="pop-val">${worldData.population.toLocaleString()}</span>
            </div>
            <input class="range-slider" type="range" id="population" min="100" max="1000000" step="100" value="${worldData.population}" />
          </div>
          <div class="input-group">
            <label for="tech-level">Starting Tech Level</label>
            <select class="select" id="tech-level" style="width:100%">
              ${['Stone Age', 'Bronze Age', 'Iron Age', 'Medieval', 'Renaissance', 'Industrial', 'Modern', 'Space Age'].map(t =>
                `<option ${worldData.techLevel === t ? 'selected' : ''}>${t}</option>`
              ).join('')}
            </select>
          </div>
          <div class="input-group">
            <label for="government">Government Type</label>
            <select class="select" id="government" style="width:100%">
              ${['Tribal', 'Monarchy', 'Democracy', 'Oligarchy', 'Technocracy', 'Theocracy', 'Anarchy', 'AI Governance'].map(g =>
                `<option ${worldData.government === g ? 'selected' : ''}>${g}</option>`
              ).join('')}
            </select>
          </div>
          <div class="input-group">
            <label for="economy">Economy Model</label>
            <select class="select" id="economy" style="width:100%">
              ${['Hunter-Gatherer', 'Agrarian', 'Feudal', 'Mercantile', 'Capitalist', 'Socialist', 'Mixed', 'Post-Scarcity'].map(e =>
                `<option ${worldData.economy === e ? 'selected' : ''}>${e}</option>`
              ).join('')}
            </select>
          </div>
          <div class="input-group">
            <label for="species">Dominant Species</label>
            <select class="select" id="species" style="width:100%">
              ${['Humanoid', 'Reptilian', 'Avian', 'Aquatic', 'Insectoid', 'Silicon-Based', 'Energy Beings'].map(s =>
                `<option ${worldData.species === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      </div>
    `;
    case 3: return `
      <div class="wizard-section fade-in-up">
        <h3 class="wizard-section-title">${icon('layers', 20)} Resources & Species</h3>
        <div class="grid grid-cols-2" style="gap:var(--space-5)">
          <div class="input-group">
            <label for="resources">Resource Availability</label>
            <select class="select" id="resources" style="width:100%">
              ${['Scarce', 'Limited', 'Moderate', 'Abundant', 'Unlimited'].map(r =>
                `<option ${worldData.resources === r ? 'selected' : ''}>${r}</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <div style="margin-top:var(--space-6)">
          <h4 style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--space-3)">Resource Distribution Preview</h4>
          <div class="grid grid-cols-3" style="gap:var(--space-3)">
            ${[
              { name: 'Minerals', pct: 34, color: 'var(--accent-blue)' },
              { name: 'Water', pct: 28, color: 'var(--accent-cyan)' },
              { name: 'Biomass', pct: 22, color: 'var(--success)' },
              { name: 'Energy', pct: 12, color: 'var(--warning)' },
              { name: 'Rare Elements', pct: 4, color: 'var(--info)' },
            ].map(r => `
              <div class="card" style="padding:var(--space-3)">
                <div class="flex items-center justify-between" style="margin-bottom:var(--space-2)">
                  <span style="font-size:var(--text-xs);color:var(--text-secondary)">${r.name}</span>
                  <span style="font-size:var(--text-xs);font-weight:600;color:var(--text-primary)">${r.pct}%</span>
                </div>
                <div class="progress-bar" style="height:4px">
                  <div class="progress-bar-fill" style="width:${r.pct}%;background:${r.color}"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    case 4: return `
      <div class="wizard-section fade-in-up">
        <h3 class="wizard-section-title">${icon('check', 20)} Review & Launch</h3>

        <!-- Preview Card -->
        <div class="card" style="background:linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.08));border-color:rgba(59,130,246,0.15);margin-bottom:var(--space-6)">
          <div class="flex gap-6">
            <div style="width:140px;height:140px;border-radius:var(--radius-xl);background:radial-gradient(circle at 35% 35%, rgba(59,130,246,0.6), rgba(6,182,212,0.3));display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 60px rgba(59,130,246,0.3)">
              <div style="width:80px;height:80px;border-radius:50%;background:radial-gradient(circle at 35% 35%, #3B82F6, #06B6D4);box-shadow:0 0 30px rgba(59,130,246,0.5)"></div>
            </div>
            <div class="flex-1">
              <h2 style="font-size:var(--text-h3);margin-bottom:var(--space-1)">${worldData.name || 'Unnamed World'}</h2>
              <p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--space-4)">${worldData.description || 'No description provided'}</p>
              <div class="flex gap-2 flex-wrap">
                <span class="badge badge-blue">${worldData.climate}</span>
                <span class="badge badge-cyan">${worldData.atmosphere}</span>
                <span class="badge badge-green">${worldData.techLevel}</span>
                <span class="badge badge-purple">${worldData.government}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Grid -->
        <div class="grid grid-cols-3" style="gap:var(--space-4)">
          ${[
            { label: 'Gravity', value: `${worldData.gravity.toFixed(2)}g`, icon: 'target' },
            { label: 'Water Coverage', value: `${worldData.waterCoverage}%`, icon: 'droplets' },
            { label: 'Population', value: worldData.population.toLocaleString(), icon: 'users' },
            { label: 'Economy', value: worldData.economy, icon: 'barChart' },
            { label: 'Species', value: worldData.species, icon: 'atom' },
            { label: 'Resources', value: worldData.resources, icon: 'layers' },
          ].map(item => `
            <div class="card" style="padding:var(--space-4);text-align:center">
              <div style="color:var(--accent-blue-light);margin-bottom:var(--space-2)">${icon(item.icon, 20)}</div>
              <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-1)">${item.label}</div>
              <div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${item.value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    default: return '';
  }
}

export function initWorldBuilder() {
  currentStep = 0;
  const body = document.getElementById('wizard-body');
  const prevBtn = document.getElementById('wizard-prev');
  const nextBtn = document.getElementById('wizard-next');
  const fill = document.getElementById('wizard-fill');

  if (!prevBtn || !nextBtn) return;

  function updateStep() {
    body.innerHTML = renderStep(currentStep);
    prevBtn.disabled = currentStep === 0;
    nextBtn.innerHTML = currentStep === steps.length - 1
      ? `${icon('rocket', 16)} Launch World`
      : `Next ${icon('chevronRight', 16)}`;

    if (currentStep === steps.length - 1) {
      nextBtn.className = 'btn btn-primary';
      nextBtn.style.background = 'var(--gradient-blue-cyan)';
    } else {
      nextBtn.className = 'btn btn-primary';
      nextBtn.style.background = '';
    }

    // Update progress
    const pct = (currentStep / (steps.length - 1)) * 100;
    fill.style.width = `${pct}%`;

    // Update step indicators and make them clickable
    document.querySelectorAll('.wizard-step').forEach((el, i) => {
      el.classList.toggle('active', i === currentStep);
      el.classList.toggle('completed', i < currentStep);
      el.querySelector('.wizard-step-number').innerHTML = i < currentStep ? icon('check', 16) : i + 1;
      el.style.cursor = 'pointer';
      el.onclick = () => {
        saveCurrentStep();
        currentStep = i;
        updateStep();
      };
    });

    // Bind range sliders
    bindSliders();
  }

  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) { currentStep--; updateStep(); }
  });

  nextBtn.addEventListener('click', () => {
    saveCurrentStep();
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStep();
    } else {
      // Validate or default world name
      if (!worldData.name || !worldData.name.trim()) {
        worldData.name = `Planet-${Math.floor(100 + Math.random() * 900)}`;
      }
      // Create and persist the new world
      const newWorld = createWorld(worldData);
      console.log(`[Genesis] World "${newWorld.name}" created with ID: ${newWorld.id}`);
      
      // Reset form data for next time
      resetBuilderData();

      // Navigate to viewer with active world
      window.location.hash = '#/viewer';
    }
  });

  bindSliders();
}

function resetBuilderData() {
  worldData = {
    name: '', description: '', seed: Math.floor(Math.random() * 999999),
    climate: 'Temperate', gravity: 1.0, waterCoverage: 65, atmosphere: 'Nitrogen-Oxygen',
    population: 10000, techLevel: 'Stone Age', government: 'Tribal', economy: 'Hunter-Gatherer',
    species: 'Humanoid', resources: 'Abundant',
  };
  currentStep = 0;
}

function saveCurrentStep() {
  const name = document.getElementById('world-name');
  if (name) worldData.name = name.value;
  const desc = document.getElementById('world-desc');
  if (desc) worldData.description = desc.value;
  const seed = document.getElementById('world-seed');
  if (seed) worldData.seed = parseInt(seed.value);
  const climate = document.getElementById('climate');
  if (climate) worldData.climate = climate.value;
  const atmo = document.getElementById('atmosphere');
  if (atmo) worldData.atmosphere = atmo.value;
  const gravity = document.getElementById('gravity');
  if (gravity) worldData.gravity = parseFloat(gravity.value);
  const water = document.getElementById('water');
  if (water) worldData.waterCoverage = parseInt(water.value);
  const pop = document.getElementById('population');
  if (pop) worldData.population = parseInt(pop.value);
  const tech = document.getElementById('tech-level');
  if (tech) worldData.techLevel = tech.value;
  const gov = document.getElementById('government');
  if (gov) worldData.government = gov.value;
  const econ = document.getElementById('economy');
  if (econ) worldData.economy = econ.value;
  const species = document.getElementById('species');
  if (species) worldData.species = species.value;
  const res = document.getElementById('resources');
  if (res) worldData.resources = res.value;
}

function bindSliders() {
  const gravity = document.getElementById('gravity');
  const gravVal = document.getElementById('gravity-val');
  if (gravity && gravVal) {
    gravity.addEventListener('input', () => { gravVal.textContent = `${parseFloat(gravity.value).toFixed(2)}g`; });
  }
  const water = document.getElementById('water');
  const waterVal = document.getElementById('water-val');
  if (water && waterVal) {
    water.addEventListener('input', () => { waterVal.textContent = `${water.value}%`; });
  }
  const pop = document.getElementById('population');
  const popVal = document.getElementById('pop-val');
  if (pop && popVal) {
    pop.addEventListener('input', () => { popVal.textContent = parseInt(pop.value).toLocaleString(); });
  }
}
