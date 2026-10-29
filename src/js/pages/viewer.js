/* ============================================================
   GENESIS AI — 3D World Viewer & Planetary Observatory
   Photorealistic Procedural Globe with Dynamic Epoch Evolution
   Day / Night Modes, Sea Level Dynamics & Civilisation Web
   ============================================================ */

import { icon } from '../icons.js';
import { getActiveWorld, getWorlds, setActiveWorldId } from '../utils/world-manager.js';
import { generatePlanetTextures } from '../utils/planet-generator.js';

// Historical planetary milestones mapping year (0 - 10,000) to visual transformations & real empirical telemetry
const EPOCH_STAGES = [
  {
    minYear: 0, maxYear: 1400,
    era: 'Era I — Genesis', subtitle: 'Primordial Wilderness & Low Sea Level',
    badgeClass: 'badge-green',
    seaLevelOffset: -0.045,   // Water level drops, land bridges & continental shelves exposed
    vegetationCover: 1.45,    // Vast virgin emerald rainforests & pristine greenery
    cityGrowth: 0.0,          // ZERO cities (pure untouched nature)
    cityNightGlow: 0.0,
    iceCapExtent: 0.68,       // Expansive glacial polar ice sheets
    smogDensity: 0.0,
    orbitalOpacity: 0.0,
    waterPercent: '58% (Low Glacial Sea Level)',
    forestPercent: '84% (Virgin Wilderness)',
    urbanPercent: '0% (Pristine Nature)',
    tempAnomaly: '+0.0°C (Baseline)',
    realMeanTemp: '17.13°C (NOAA Baseline)',
    precipitation: '136.5 mm/mo (NOAA GSOM)',
    elevationRelief: '-84.8m to 2,979m (SRTM)',
  },
  {
    minYear: 1400, maxYear: 3200,
    era: 'Era II — Bronze Age', subtitle: 'Early River Civilizations & Farmlands',
    badgeClass: 'badge-amber',
    seaLevelOffset: -0.025,
    vegetationCover: 1.25,
    cityGrowth: 0.10,         // Tiny rustic river settlements
    cityNightGlow: 0.12,
    iceCapExtent: 0.70,
    smogDensity: 0.0,
    orbitalOpacity: 0.0,
    waterPercent: '61%',
    forestPercent: '78%',
    urbanPercent: '3% (River Villages)',
    tempAnomaly: '+0.02°C',
    realMeanTemp: '17.15°C (+0.02°C)',
    precipitation: '136.8 mm/mo',
    elevationRelief: '-84.8m to 2,979m (SRTM)',
  },
  {
    minYear: 3200, maxYear: 5200,
    era: 'Era III — Medieval Age', subtitle: 'Agricultural Mosaic & Coastal Ports',
    badgeClass: 'badge-amber',
    seaLevelOffset: -0.010,
    vegetationCover: 1.00,    // Farmland patchwork carving into forests
    cityGrowth: 0.25,         // Walled towns and coastal ports
    cityNightGlow: 0.35,
    iceCapExtent: 0.73,
    smogDensity: 0.0,
    orbitalOpacity: 0.0,
    waterPercent: '63%',
    forestPercent: '66% (Agricultural Clearings)',
    urbanPercent: '12% (Towns & Ports)',
    tempAnomaly: '+0.05°C',
    realMeanTemp: '17.18°C (+0.05°C)',
    precipitation: '137.1 mm/mo',
    elevationRelief: '-84.8m to 2,979m (SRTM)',
  },
  {
    minYear: 5200, maxYear: 7000,
    era: 'Era IV — Renaissance', subtitle: 'Maritime Expansion & Growing Cities',
    badgeClass: 'badge-blue',
    seaLevelOffset: 0.005,
    vegetationCover: 0.80,
    cityGrowth: 0.48,         // Expanding merchant trade cities
    cityNightGlow: 0.65,
    iceCapExtent: 0.76,
    smogDensity: 0.12,
    orbitalOpacity: 0.0,
    waterPercent: '65% (Baseline Sea Level)',
    forestPercent: '54%',
    urbanPercent: '24% (Expanding Cities)',
    tempAnomaly: '+0.18°C',
    realMeanTemp: '17.31°C (+0.18°C)',
    precipitation: '136.2 mm/mo',
    elevationRelief: '-84.8m to 2,979m (SRTM)',
  },
  {
    minYear: 7000, maxYear: 8400,
    era: 'Era V — Industrial Age', subtitle: 'Sea Level Rise, Heavy Deforestation & Factory Sprawl',
    badgeClass: 'badge-blue',
    seaLevelOffset: 0.045,    // Water RISES! Low-lying coastlines flood!
    vegetationCover: 0.48,    // Heavy deforestation
    cityGrowth: 0.75,         // Massive slate-grey concrete and brick factory sprawl
    cityNightGlow: 1.35,      // Incandescent amber night lights
    iceCapExtent: 0.85,       // Polar ice sheets visibly melt & recede
    smogDensity: 0.80,        // Brown factory smog haze
    orbitalOpacity: 0.08,
    waterPercent: '69% (Sea Level Rise: +2.8m)',
    forestPercent: '38% (Heavy Deforestation)',
    urbanPercent: '46% (Industrial Urban Sprawl)',
    tempAnomaly: '+0.95°C (Global Warming)',
    realMeanTemp: '18.08°C (+0.95°C NOAA)',
    precipitation: '135.4 mm/mo',
    elevationRelief: '-84.8m to 2,979m (SRTM)',
  },
  {
    minYear: 8400, maxYear: 9500,
    era: 'Era VI — Information Age', subtitle: 'Peak Megalopolis Expansion & Coastal Inundation',
    badgeClass: 'badge-cyan',
    seaLevelOffset: 0.055,    // Peak coastal inundation
    vegetationCover: 0.40,
    cityGrowth: 0.92,         // Gigantic modern megalopolises
    cityNightGlow: 2.00,      // Blazing electric night web
    iceCapExtent: 0.82,
    smogDensity: 0.35,
    orbitalOpacity: 0.65,
    waterPercent: '71% (Coastal Inundation: +4.2m)',
    forestPercent: '32% (Urban Pressure)',
    urbanPercent: '72% (Modern Megalopolises)',
    tempAnomaly: '+1.45°C (Peak Emissions)',
    realMeanTemp: '18.58°C (+1.45°C Peak)',
    precipitation: '139.8 mm/mo',
    elevationRelief: '-84.8m to 2,979m (SRTM)',
  },
  {
    minYear: 9500, maxYear: 10001,
    era: 'Era VII — Space Age', subtitle: 'Ecological Terraforming, Stabilized Seas & Arcologies',
    badgeClass: 'badge-purple',
    seaLevelOffset: 0.0,      // Stabilized sea level with coastal barriers
    vegetationCover: 1.25,    // Terraformed greening of arid lands
    cityGrowth: 1.0,          // Hyper-connected futuristic ecumenopolis nodes
    cityNightGlow: 2.65,      // Radiant golden & cyan ecumenopolis
    iceCapExtent: 0.77,       // Stabilized polar ice
    smogDensity: 0.0,         // Pure crystalline air
    orbitalOpacity: 1.0,      // Orbital transit ring & satellite constellation
    waterPercent: '65% (Stabilized Geo-Engineering)',
    forestPercent: '58% (Restored Bio-Reserves)',
    urbanPercent: '85% (High-Tech Arcologies)',
    tempAnomaly: '+0.25°C (Climate Stabilized)',
    realMeanTemp: '17.38°C (Equilibrium)',
    precipitation: '136.5 mm/mo',
    elevationRelief: '-84.8m to 2,979m (SRTM)',
  },
];

function getEpochForYear(year) {
  const y = Math.max(0, Math.min(10000, year));
  return EPOCH_STAGES.find(s => y >= s.minYear && y < s.maxYear) || EPOCH_STAGES[EPOCH_STAGES.length - 1];
}

function calculateEpochPopulation(world, year) {
  const basePop = Number(world.population) || 8420000;
  const y = Math.max(0, Math.min(10000, year));
  const peakPop = basePop >= 1000000 ? basePop : 9800000000;
  const minPop = 15000;

  const exponent = -0.00135 * (y - 7200);
  const logistic = 1.0 / (1.0 + Math.exp(exponent));

  return Math.round(minPop + (peakPop - minPop) * logistic);
}

function formatPopulation(num) {
  const n = Math.max(0, Math.round(num));
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toLocaleString();
}

export function renderViewer() {
  const worlds = getWorlds();
  const w = getActiveWorld() || worlds[0] || {
    name: 'Aurelia Prime', population: 8420000, gravity: 1.0, waterCoverage: 65,
    climate: 'Oceanic', simStatus: 'running', epoch: 'Era V — Industrial Age', color: '#38bdf8'
  };

  const currentYear = 7500;
  const stage = getEpochForYear(currentYear);
  const currentPop = calculateEpochPopulation(w, currentYear);

  return `
    <div class="page-container" style="padding:0">
      <div class="viewer-container" id="viewer-container">
        <!-- 3D WebGL Canvas -->
        <canvas id="globe-canvas" class="viewer-canvas" aria-label="3D World Viewer"></canvas>

        <!-- Planetary Telemetry Panel -->
        <div class="viewer-info fade-in-left" style="z-index:10;width:300px">
          <div class="flex items-center gap-3" style="margin-bottom:var(--space-3)">
            <div id="viewer-world-avatar" style="width:42px;height:42px;border-radius:50%;background:radial-gradient(circle at 35% 35%, ${w.color || '#38bdf8'}, #0f172a);box-shadow:0 0 25px ${(w.color || '#38bdf8')}80;border:1px solid rgba(255,255,255,0.2)"></div>
            <div style="flex:1;min-width:0">
              <h3 id="viewer-world-name" style="font-family:var(--font-display);font-size:var(--text-body);font-weight:var(--weight-semibold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.name}</h3>
              <span id="viewer-world-status" class="badge badge-${w.simStatus === 'running' ? 'green' : w.simStatus === 'paused' ? 'amber' : 'blue'}" style="font-size:9px"><span class="badge-dot"></span> ${w.simStatus || 'Active'}</span>
            </div>
          </div>

          <!-- Quick Planet Selector -->
          <div style="margin-bottom:var(--space-3)">
            <select id="viewer-world-select" class="select" style="width:100%;padding:5px 28px 5px 8px;font-size:var(--text-2xs);background:rgba(10,12,16,0.7);border:1px solid rgba(255,255,255,0.12)" aria-label="Select planet">
              ${worlds.map(item => `<option value="${item.id}" ${item.id === w.id ? 'selected' : ''}>${item.name} (${item.climate})</option>`).join('')}
            </select>
          </div>

          <div style="font-family:var(--font-mono);font-size:var(--text-2xs);color:var(--text-disabled);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:var(--space-2)">Dynamic Planetary Surface Telemetry</div>
          <div class="flex flex-col gap-2" style="font-size:var(--text-sm)">
            <div class="flex items-center justify-between">
              <span style="color:var(--text-muted);display:flex;align-items:center;gap:6px">${icon('users', 14)} Population</span>
              <span id="telemetry-pop" style="font-family:var(--font-mono);color:var(--brand-primary);font-weight:600;font-variant-numeric:tabular-nums;font-size:var(--text-xs)">${formatPopulation(currentPop)}</span>
            </div>
            <div class="flex items-center justify-between">
              <span style="color:var(--text-muted);display:flex;align-items:center;gap:6px">${icon('clock', 14)} Epoch</span>
              <span id="telemetry-epoch" style="font-family:var(--font-mono);color:var(--text-primary);font-weight:500;font-size:var(--text-xs)">${stage.era}</span>
            </div>
            <div class="flex items-center justify-between">
              <span style="color:var(--text-muted);display:flex;align-items:center;gap:6px">${icon('droplets', 14)} Sea Level & Water</span>
              <span id="telemetry-water" style="font-family:var(--font-mono);color:#38bdf8;font-weight:600;font-size:var(--text-xs)">${stage.waterPercent}</span>
            </div>
            <div class="flex items-center justify-between">
              <span style="color:var(--text-muted);display:flex;align-items:center;gap:6px">${icon('target', 14)} Vegetation Cover</span>
              <span id="telemetry-forest" style="font-family:var(--font-mono);color:#34d399;font-weight:600;font-size:var(--text-xs)">${stage.forestPercent}</span>
            </div>
            <div class="flex items-center justify-between">
              <span style="color:var(--text-muted);display:flex;align-items:center;gap:6px">${icon('globe', 14)} Urban Footprint</span>
              <span id="telemetry-urban" style="font-family:var(--font-mono);color:#fb923c;font-weight:600;font-size:var(--text-xs)">${stage.urbanPercent}</span>
            </div>
            <div class="flex items-center justify-between">
              <span style="color:var(--text-muted);display:flex;align-items:center;gap:6px">${icon('thermometer', 14)} Surface Temp</span>
              <span id="telemetry-temp" style="font-family:var(--font-mono);color:#fbbf24;font-weight:600;font-size:var(--text-xs)">${stage.realMeanTemp}</span>
            </div>
            <div class="flex items-center justify-between">
              <span style="color:var(--text-muted);display:flex;align-items:center;gap:6px">${icon('cloudRain', 14)} Precipitation</span>
              <span id="telemetry-precip" style="font-family:var(--font-mono);color:#67e8f9;font-weight:500;font-size:var(--text-xs)">${stage.precipitation}</span>
            </div>
            <div class="flex items-center justify-between">
              <span style="color:var(--text-muted);display:flex;align-items:center;gap:6px">${icon('activity', 14)} Topography Relief</span>
              <span id="telemetry-relief" style="font-family:var(--font-mono);color:#a78bfa;font-weight:500;font-size:var(--text-xs)">${stage.elevationRelief}</span>
            </div>
          </div>
          <div style="margin-top:var(--space-2);padding-top:var(--space-2);border-top:1px solid rgba(255,255,255,0.08);font-size:9px;color:var(--text-disabled);display:flex;align-items:center;justify-content:space-between">
            <span>Ground Truth Models:</span>
            <span style="color:var(--brand-primary);font-family:var(--font-mono)">NOAA GSOM • NASA SRTM</span>
          </div>
        </div>

        <!-- Observation Layers Panel -->
        <div class="viewer-legend fade-in-right" style="z-index:10;width:250px">
          <h4>Observation Layers</h4>
          <label class="legend-item" style="cursor:pointer">
            <div class="legend-dot" style="background:#fb923c"></div>
            <span style="flex:1">Cities & Urban Sprawl</span>
            <label class="toggle" style="width:36px;height:20px">
              <input type="checkbox" id="layer-cities" checked />
              <span class="toggle-track" style="border-radius:10px"></span>
              <span class="toggle-thumb" style="width:16px;height:16px;top:2px;left:2px"></span>
            </label>
          </label>
          <label class="legend-item" style="cursor:pointer">
            <div class="legend-dot" style="background:#38bdf8"></div>
            <span style="flex:1">Water & Sea Level Rise</span>
            <label class="toggle" style="width:36px;height:20px">
              <input type="checkbox" id="layer-water" checked />
              <span class="toggle-track" style="border-radius:10px"></span>
              <span class="toggle-thumb" style="width:16px;height:16px;top:2px;left:2px"></span>
            </label>
          </label>
          <label class="legend-item" style="cursor:pointer">
            <div class="legend-dot" style="background:#34d399"></div>
            <span style="flex:1">Vegetation & Biomes</span>
            <label class="toggle" style="width:36px;height:20px">
              <input type="checkbox" id="layer-vegetation" checked />
              <span class="toggle-track" style="border-radius:10px"></span>
              <span class="toggle-thumb" style="width:16px;height:16px;top:2px;left:2px"></span>
            </label>
          </label>
          <label class="legend-item" style="cursor:pointer">
            <div class="legend-dot" style="background:#e2e8f0"></div>
            <span style="flex:1">Atmospheric Clouds & Smog</span>
            <label class="toggle" style="width:36px;height:20px">
              <input type="checkbox" id="layer-weather" checked />
              <span class="toggle-track" style="border-radius:10px"></span>
              <span class="toggle-thumb" style="width:16px;height:16px;top:2px;left:2px"></span>
            </label>
          </label>
          <label class="legend-item" style="cursor:pointer">
            <div class="legend-dot" style="background:#a78bfa"></div>
            <span style="flex:1">Resource Deposits</span>
            <label class="toggle" style="width:36px;height:20px">
              <input type="checkbox" id="layer-resources" checked />
              <span class="toggle-track" style="border-radius:10px"></span>
              <span class="toggle-thumb" style="width:16px;height:16px;top:2px;left:2px"></span>
            </label>
          </label>
          <label class="legend-item" style="cursor:pointer">
            <div class="legend-dot" style="background:#67e8f9"></div>
            <span style="flex:1">Space Age Megastructures</span>
            <label class="toggle" style="width:36px;height:20px">
              <input type="checkbox" id="layer-space" checked />
              <span class="toggle-track" style="border-radius:10px"></span>
              <span class="toggle-thumb" style="width:16px;height:16px;top:2px;left:2px"></span>
            </label>
          </label>
        </div>

        <!-- Epoch Scrubber (Interactive Planetary Time Navigation) -->
        <div class="viewer-timeline fade-in-up" style="z-index:10">
          <div class="flex items-center justify-between" style="margin-bottom:var(--space-2)">
            <div class="flex items-center gap-3">
              <span style="font-family:var(--font-mono);font-size:var(--text-2xs);font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.12em">Epoch Scrubber</span>
              <span id="epoch-year-indicator" style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--brand-primary);font-weight:700;letter-spacing:0.04em">Year 7,500</span>
              <span id="epoch-subtitle" style="font-size:var(--text-2xs);color:var(--text-muted);font-style:italic">(${stage.subtitle})</span>
            </div>
            <span id="epoch-badge" class="badge ${stage.badgeClass}" style="font-size:10px;font-weight:600;letter-spacing:0.03em">${stage.era}</span>
          </div>
          <input id="epoch-slider" class="range-slider timeline-slider" type="range" min="0" max="10000" value="${currentYear}" step="10" aria-label="Epoch timeline scrubber" style="cursor:pointer" />
          <div class="epoch-labels">
            <span class="epoch-milestone" data-year="0">Y0 — Genesis</span>
            <span class="epoch-milestone" data-year="2500">Y2500 — Bronze</span>
            <span class="epoch-milestone" data-year="5000">Y5000 — Medieval</span>
            <span class="epoch-milestone active" data-year="7500">Y7500 — Industrial</span>
            <span class="epoch-milestone" data-year="10000">Y10000 — Space Age</span>
          </div>
        </div>

        <!-- Interactive Viewer Controls (With Dedicated Day & Night Buttons) -->
        <div class="viewer-controls fade-in-up" style="z-index:10">
          <button id="ctrl-rotate" class="btn-icon tooltip active" data-tooltip="Toggle Rotation" aria-label="Rotate view">
            ${icon('rotateCcw', 18)}
          </button>

          <!-- Dedicated Day & Night Switcher Pill -->
          <div class="daynight-pill" role="group" aria-label="Day and Night Planetary Modes">
            <button id="ctrl-btn-day" class="btn-daynight active" aria-label="Day Mode: Land & Biomes">
              ${icon('sun', 14)} <span>Day (Land)</span>
            </button>
            <button id="ctrl-btn-night" class="btn-daynight" aria-label="Night Mode: Civilisation">
              ${icon('moon', 14)} <span>Night (Cities)</span>
            </button>
          </div>

          <div style="width:1px;height:24px;background:rgba(255,255,255,0.1)"></div>
          <button id="ctrl-play" class="btn-icon transport-btn play tooltip" data-tooltip="Play Timeline Simulation" aria-label="Play timeline simulation">
            ${icon('play', 18)}
          </button>
          <div style="width:1px;height:24px;background:rgba(255,255,255,0.1)"></div>
          <button id="ctrl-fullscreen" class="btn-icon tooltip" data-tooltip="Toggle Fullscreen" aria-label="Toggle fullscreen">
            ${icon('externalLink', 18)}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initViewer() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const container = document.getElementById('viewer-container');
  if (!container) return;

  // Dynamically load Three.js
  import('three').then((THREE) => {
    const {
      Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, TorusGeometry,
      MeshBasicMaterial, ShaderMaterial, CanvasTexture, Mesh, AmbientLight, DirectionalLight,
      Group, Color, BackSide, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial,
      AdditiveBlending, NormalBlending, Vector3, LinearFilter, LinearMipmapLinearFilter
    } = THREE;

    const scene = new Scene();
    scene.background = new Color('#040608');

    const camera = new PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 3.1);

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let activeWorld = getActiveWorld() || getWorlds()[0] || {
      name: 'Aurelia Prime', population: 8420000, gravity: 1.0, waterCoverage: 65,
      climate: 'Oceanic', simStatus: 'running', epoch: 'Era V — Industrial Age', color: '#38bdf8'
    };

    // Main planetary group
    const planetGroup = new Group();
    scene.add(planetGroup);

    // Initial procedural textures
    let textures = generatePlanetTextures(activeWorld);

    let elevTexture = new CanvasTexture(textures.elevCanvas);
    elevTexture.minFilter = LinearMipmapLinearFilter;
    elevTexture.magFilter = LinearFilter;
    elevTexture.anisotropy = 8;

    let surfaceTexture = new CanvasTexture(textures.surfaceCanvas);
    surfaceTexture.minFilter = LinearMipmapLinearFilter;
    surfaceTexture.magFilter = LinearFilter;
    surfaceTexture.anisotropy = 8;

    let lightsTexture = new CanvasTexture(textures.lightsCanvas);
    lightsTexture.minFilter = LinearMipmapLinearFilter;
    lightsTexture.magFilter = LinearFilter;
    lightsTexture.anisotropy = 8;

    let cloudTexture = new CanvasTexture(textures.cloudCanvas);
    cloudTexture.minFilter = LinearMipmapLinearFilter;
    cloudTexture.magFilter = LinearFilter;
    cloudTexture.anisotropy = 4;

    // Day & Night mode states
    let isDayMode = true;
    let currentDayNightBlend = 0.0; // 0.0 = full Day, 1.0 = full Night
    let targetDayNightBlend = 0.0;

    const sunPosVec = new Vector3(1.8, 2.8, 4.5);

    // ============================================================
    // 1. Dynamic Planetary Surface Shader
    // Day Mode: Bright, crystal-clear illumination displaying land, biomes,
    //           vegetation, and oceans perfectly!
    // Night Mode: Dark midnight globe where the civilization lights, cities,
    //             and metropolitan webs blaze with luminous brilliance!
    // ============================================================
    const surfaceVertexShader = `
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `;

    const surfaceFragmentShader = `
      uniform sampler2D tElev;      // R: Elevation, G: Moisture, B: Urban Suitability
      uniform sampler2D tSurface;   // Base biome palette guide
      uniform sampler2D tLights;    // Night lights & city network
      uniform vec3 sunPosition;

      // Day / Night control blend: 0.0 = Day (more light, perfect land), 1.0 = Night (dark, civilization shines)
      uniform float uDayNightBlend;

      // Epoch dynamic parameters
      uniform float uSeaLevel;      // Current dynamic sea level (rises in industrial, drops in glacial)
      uniform float uVegetation;    // Dynamic vegetation abundance (lush in ancient, deforested in industrial, restored in space)
      uniform float uCityGrowth;    // Cities expanding across land in modern times
      uniform float uCityNightGlow; // Night lights intensity
      uniform float uIceCapExtent;  // Polar ice cap reach (melts in industrial warming)
      uniform float uSmogDensity;   // Industrial factory smog haze

      // Layer toggles
      uniform float uLayerCities;
      uniform float uLayerVegetation;
      uniform float uLayerWater;

      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;

      void main() {
        vec4 elevData = texture2D(tElev, vUv);
        vec4 lightTex = texture2D(tLights, vUv);

        float elevation = elevData.r;
        float moisture = elevData.g;
        float urbanSuitability = elevData.b;
        float absLat = abs(vUv.y - 0.5) * 2.0;

        // 1. Dynamic Sea Level (Water vs Land)
        float curSeaLevel = uSeaLevel;
        float isWater = elevation < curSeaLevel ? 1.0 : 0.0;

        vec3 surfaceColor;

        if (isWater > 0.5) {
          // Dynamic Ocean & Continental Shelves
          float depth = (curSeaLevel - elevation) / curSeaLevel;

          vec3 shallowReef = vec3(0.10, 0.64, 0.74); // Vibrant turquoise coastal waters
          vec3 midOcean = vec3(0.06, 0.30, 0.56);    // Rich oceanic blue
          vec3 deepOcean = vec3(0.02, 0.10, 0.25);   // Deep sapphire abyss

          if (depth < 0.05) {
            surfaceColor = mix(shallowReef, midOcean, depth / 0.05);
          } else if (depth < 0.32) {
            surfaceColor = mix(midOcean, deepOcean, (depth - 0.05) / (0.32 - 0.05));
          } else {
            surfaceColor = deepOcean;
          }
        } else {
          // Dynamic Landmasses: Elevation, Vegetation & Biomes
          float landElevation = (elevation - curSeaLevel) / (1.0 - curSeaLevel);

          // Dynamic vegetation coverage
          float effectiveVeg = clamp(moisture * uVegetation * uLayerVegetation, 0.0, 1.5);

          vec3 beachColor = vec3(0.85, 0.78, 0.58);
          vec3 lushForest = vec3(0.07, 0.44, 0.16);     // Virgin emerald rainforest
          vec3 temperatePlains = vec3(0.24, 0.52, 0.22); // Green valley plains
          vec3 farmlandGold = vec3(0.68, 0.58, 0.32);    // Cultivated wheat / crops
          vec3 deforestedSoil = vec3(0.52, 0.42, 0.32);  // Industrial clear-cut dry soil
          vec3 alpineRock = vec3(0.42, 0.39, 0.36);
          vec3 alpineSnow = vec3(0.94, 0.96, 0.98);

          if (landElevation < 0.025) {
            surfaceColor = beachColor;
          } else if (landElevation < 0.55) {
            if (effectiveVeg > 0.88) {
              surfaceColor = mix(temperatePlains, lushForest, (effectiveVeg - 0.88) / 0.62);
            } else if (effectiveVeg > 0.48) {
              surfaceColor = mix(farmlandGold, temperatePlains, (effectiveVeg - 0.48) / 0.40);
            } else {
              surfaceColor = mix(deforestedSoil, farmlandGold, effectiveVeg / 0.48);
            }
          } else if (landElevation < 0.80) {
            surfaceColor = mix(alpineRock, deforestedSoil, 0.25);
          } else {
            surfaceColor = alpineSnow;
          }

          // Daytime Urban Expansion (Structured concrete/steel megalopolises visible by day)
          if (uLayerCities > 0.01 && uCityGrowth > 0.01) {
            float cityThreshold = 1.0 - uCityGrowth * 0.75;
            if (urbanSuitability > cityThreshold) {
              float cityIntensity = smoothstep(cityThreshold, 1.0, urbanSuitability);

              vec3 rusticVillage = vec3(0.70, 0.60, 0.45);
              vec3 industrialConcrete = vec3(0.35, 0.37, 0.42);
              vec3 spaceMegalopolis = vec3(0.24, 0.48, 0.64);

              vec3 cityColor = mix(
                rusticVillage,
                mix(industrialConcrete, spaceMegalopolis, smoothstep(0.75, 1.0, uCityGrowth)),
                smoothstep(0.20, 0.75, uCityGrowth)
              );

              surfaceColor = mix(surfaceColor, cityColor, min(0.92, cityIntensity * 1.35));
            }
          }
        }

        // 2. Polar Ice Sheet Dynamics (Melts in Industrial, Expands in Genesis)
        float iceThreshold = uIceCapExtent;
        if (absLat > iceThreshold) {
          float iceBlend = smoothstep(iceThreshold, iceThreshold + 0.08, absLat);
          vec3 iceColor = vec3(0.94, 0.97, 1.0);
          surfaceColor = mix(surfaceColor, iceColor, iceBlend * 0.95);
        }

        // 3. Lighting & Day/Night Mode Calculations
        vec3 norm = normalize(vWorldNormal);
        vec3 sunDir = normalize(sunPosition - vWorldPosition);
        float nDotSun = dot(norm, sunDir);

        // In Day Mode: more light shows, illuminating the land, biomes and oceans vividly!
        // In Night Mode: dark midnight base so the globe is dark!
        float dayLighting = clamp(nDotSun * 0.92 + 0.28, 0.0, 1.0) * 0.96 + 0.16;
        float nightLighting = 0.035; // Deep midnight darkness
        float effectiveLighting = mix(dayLighting, nightLighting, uDayNightBlend);

        vec3 diffuse = surfaceColor * effectiveLighting;

        // 4. Water Specular Reflection (Sun glint on oceans)
        if (isWater > 0.5 && uLayerWater > 0.01) {
          vec3 halfDir = normalize(sunDir + normalize(-vWorldPosition));
          float specAngle = max(0.0, dot(norm, halfDir));
          float specular = pow(specAngle, 36.0) * 1.15 * max(0.0, nDotSun);
          diffuse += vec3(0.78, 0.94, 1.0) * specular * uLayerWater * (1.0 - uDayNightBlend * 0.92);
        }

        // 5. Civilization Lights at Night
        // When in Night Mode or on the dark terminator, civilization sparkles with intense golden/cyan illumination!
        float naturalNight = smoothstep(0.12, -0.22, nDotSun);
        float effectiveNight = mix(naturalNight, 1.0, uDayNightBlend * 0.85);

        if (effectiveNight > 0.01 && uLayerCities > 0.01 && uCityNightGlow > 0.01 && isWater < 0.5) {
          float cityThreshold = 1.0 - uCityGrowth * 0.75;
          if (urbanSuitability > cityThreshold) {
            float glowAlpha = smoothstep(cityThreshold, 1.0, urbanSuitability);

            // Boost civilization radiance in Night mode
            float glowBoost = mix(1.0, 1.85, uDayNightBlend);
            vec3 nightCityRgb = lightTex.rgb * (1.0 + uCityNightGlow * 0.5);

            diffuse += nightCityRgb * glowAlpha * effectiveNight * min(uCityNightGlow * glowBoost, 3.8);
          }
        }

        // 6. Industrial Smog (Era V factory haze over urban land)
        if (isWater < 0.5 && uSmogDensity > 0.02) {
          vec3 smogColor = vec3(0.46, 0.40, 0.35);
          float smogAmount = uSmogDensity * 0.38 * max(0.0, nDotSun) * (1.0 - uDayNightBlend * 0.7);
          diffuse = mix(diffuse, smogColor, smogAmount);
        }

        gl_FragColor = vec4(diffuse, 1.0);
      }
    `;

    const baseSeaLevel = textures.seaLevelBaseline || 0.50;

    const surfaceMat = new ShaderMaterial({
      vertexShader: surfaceVertexShader,
      fragmentShader: surfaceFragmentShader,
      uniforms: {
        tElev: { value: elevTexture },
        tSurface: { value: surfaceTexture },
        tLights: { value: lightsTexture },
        sunPosition: { value: sunPosVec },
        uDayNightBlend: { value: 0.0 }, // 0.0 = Day mode, 1.0 = Night mode
        uSeaLevel: { value: baseSeaLevel + 0.045 }, // Initialized to Era V
        uVegetation: { value: 0.48 },
        uCityGrowth: { value: 0.75 },
        uCityNightGlow: { value: 1.35 },
        uIceCapExtent: { value: 0.85 },
        uSmogDensity: { value: 0.80 },
        uLayerCities: { value: 1.0 },
        uLayerVegetation: { value: 1.0 },
        uLayerWater: { value: 1.0 },
      },
    });

    const globeGeo = new SphereGeometry(1.0, 96, 96);
    const globeMesh = new Mesh(globeGeo, surfaceMat);
    planetGroup.add(globeMesh);

    // ============================================================
    // 2. Atmospheric Cloud & Industrial Smog System
    // ============================================================
    const cloudVertexShader = `
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;

      void main() {
        vUv = uv;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const cloudFragmentShader = `
      uniform sampler2D tCloud;
      uniform vec3 sunPosition;
      uniform float uSmogDensity;
      uniform float uVisibility;
      uniform float uDayNightBlend;

      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;

      void main() {
        if (uVisibility < 0.01) discard;

        vec4 tex = texture2D(tCloud, vUv);
        if (tex.a < 0.02) discard;

        vec3 norm = normalize(vWorldNormal);
        vec3 sunDir = normalize(sunPosition - vWorldPosition);
        float nDotSun = dot(norm, sunDir);
        float day = clamp(nDotSun * 0.8 + 0.2, 0.1, 1.0);

        vec3 cloudColor = vec3(0.98, 0.99, 1.0) * day;
        if (uSmogDensity > 0.05) {
          vec3 smogTint = vec3(0.72, 0.65, 0.58) * day;
          cloudColor = mix(cloudColor, smogTint, uSmogDensity * 0.45);
        }

        // Dim clouds in night mode so civilization lights shine through clearly
        float nightCloudAlpha = mix(1.0, 0.35, uDayNightBlend);
        gl_FragColor = vec4(cloudColor, tex.a * 0.85 * uVisibility * nightCloudAlpha);
      }
    `;

    const cloudMat = new ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      uniforms: {
        tCloud: { value: cloudTexture },
        sunPosition: { value: sunPosVec },
        uSmogDensity: { value: 0.80 },
        uVisibility: { value: 1.0 },
        uDayNightBlend: { value: 0.0 },
      },
      transparent: true,
      blending: NormalBlending,
      depthWrite: false,
    });

    const cloudGeo = new SphereGeometry(1.022, 64, 64);
    const cloudsMesh = new Mesh(cloudGeo, cloudMat);
    planetGroup.add(cloudsMesh);

    // ============================================================
    // 3. Rayleigh Atmosphere Halo
    // ============================================================
    const atmoGlowVertex = `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const atmoGlowFragment = `
      uniform vec3 glowColor;
      uniform vec3 sunPosition;
      uniform float uDayNightBlend;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
        float intensity = pow(rim, 3.2) * 1.5;

        vec3 worldNorm = normalize(vWorldPosition);
        vec3 sunDir = normalize(sunPosition - vWorldPosition);
        float sunScatter = max(0.0, dot(worldNorm, sunDir)) * 0.45 + 0.55;

        // Subtle dark rim at night
        float nightGlowFactor = mix(1.0, 0.45, uDayNightBlend);

        gl_FragColor = vec4(glowColor * sunScatter, intensity * 0.8 * nightGlowFactor);
      }
    `;

    function getAtmoColor(atmoType) {
      const colors = {
        'Nitrogen-Oxygen': '#38bdf8',
        'Carbon Dioxide': '#fb923c',
        'Methane': '#a855f7',
        'Helium': '#f43f5e',
        'Toxic': '#10b981',
      };
      return new Color(colors[atmoType] || '#38bdf8');
    }

    const atmoMat = new ShaderMaterial({
      vertexShader: atmoGlowVertex,
      fragmentShader: atmoGlowFragment,
      uniforms: {
        glowColor: { value: getAtmoColor(activeWorld.atmosphere) },
        sunPosition: { value: sunPosVec },
        uDayNightBlend: { value: 0.0 },
      },
      side: BackSide,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const atmoGeo = new SphereGeometry(1.16, 64, 64);
    const atmosphereMesh = new Mesh(atmoGeo, atmoMat);
    planetGroup.add(atmosphereMesh);

    // ============================================================
    // 4. Space Age Megastructures & Satellite Constellations
    // ============================================================
    const spaceAgeGroup = new Group();

    const ringGeo = new TorusGeometry(1.38, 0.005, 16, 128);
    const ringMat = new MeshBasicMaterial({
      color: new Color('#38bdf8'),
      transparent: true,
      opacity: 0.08,
      blending: AdditiveBlending,
    });
    const orbitalRing = new Mesh(ringGeo, ringMat);
    orbitalRing.rotation.x = Math.PI / 2 + 0.12;
    spaceAgeGroup.add(orbitalRing);

    const stationCount = 6;
    for (let i = 0; i < stationCount; i++) {
      const angle = (i / stationCount) * Math.PI * 2;
      const stationGeo = new SphereGeometry(0.015, 8, 8);
      const stationMat = new MeshBasicMaterial({ color: new Color('#fcd34d'), transparent: true, opacity: 0.08 });
      const station = new Mesh(stationGeo, stationMat);
      station.position.set(Math.cos(angle) * 1.38, Math.sin(angle) * 0.1, Math.sin(angle) * 1.38);
      orbitalRing.add(station);
    }

    const satCount = 140;
    const satVertices = [];
    const satMeta = [];
    for (let i = 0; i < satCount; i++) {
      const r = 1.08 + Math.random() * 0.22;
      const inc = (Math.random() - 0.5) * Math.PI * 0.9;
      const speed = 0.008 + Math.random() * 0.016;
      const theta = Math.random() * Math.PI * 2;
      satMeta.push({ r, inc, speed, theta });
      satVertices.push(
        r * Math.cos(theta) * Math.cos(inc),
        r * Math.sin(inc),
        r * Math.sin(theta) * Math.cos(inc)
      );
    }
    const satGeo = new BufferGeometry();
    satGeo.setAttribute('position', new Float32BufferAttribute(satVertices, 3));
    const satMat = new PointsMaterial({
      color: new Color('#67e8f9'),
      size: 0.025,
      transparent: true,
      opacity: 0.08,
      blending: AdditiveBlending,
    });
    const satelliteSwarm = new Points(satGeo, satMat);
    spaceAgeGroup.add(satelliteSwarm);

    planetGroup.add(spaceAgeGroup);

    // 5. Holographic Resource Deposits
    const resourceGroup = new Group();
    const resCount = 20;
    for (let i = 0; i < resCount; i++) {
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const r = 1.01;
      const pos = new Vector3(
        r * Math.cos(phi) * Math.sin(theta),
        r * Math.sin(phi),
        r * Math.cos(phi) * Math.cos(theta)
      );
      const resGeo = new SphereGeometry(0.016, 8, 8);
      const resMat = new MeshBasicMaterial({
        color: i % 2 === 0 ? new Color('#a78bfa') : new Color('#34d399'),
        transparent: true,
        opacity: 0.85,
        blending: AdditiveBlending,
      });
      const resMesh = new Mesh(resGeo, resMat);
      resMesh.position.copy(pos);
      resourceGroup.add(resMesh);
    }
    planetGroup.add(resourceGroup);

    // 6. Background Starfield
    const starCount = 2800;
    const starVertices = [];
    for (let i = 0; i < starCount; i++) {
      const dist = 50 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starVertices.push(
        dist * Math.sin(phi) * Math.cos(theta),
        dist * Math.sin(phi) * Math.sin(theta),
        dist * Math.cos(phi)
      );
    }
    const starGeo = new BufferGeometry();
    starGeo.setAttribute('position', new Float32BufferAttribute(starVertices, 3));
    const starMat = new PointsMaterial({
      color: new Color('#d4d8e8'),
      size: 0.18,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const stars = new Points(starGeo, starMat);
    scene.add(stars);

    // Lighting (Direct sunlight & soft cosmic ambient)
    const ambientLight = new AmbientLight('#202a3a', 0.55);
    scene.add(ambientLight);

    const sunLight = new DirectionalLight('#fff8f0', 2.2);
    sunLight.position.copy(sunPosVec);
    scene.add(sunLight);

    const rimLight = new DirectionalLight('#38bdf8', 0.25);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // ============================================================
    // Dynamic Timeline & Epoch Evolution System
    // ============================================================
    let currentTimelineYear = 7500;
    let isPlaying = false;
    let autoRotate = true;

    const epochSlider = document.getElementById('epoch-slider');
    const epochBadge = document.getElementById('epoch-badge');
    const epochYearIndicator = document.getElementById('epoch-year-indicator');
    const epochSubtitle = document.getElementById('epoch-subtitle');
    const telemetryPop = document.getElementById('telemetry-pop');
    const telemetryEpoch = document.getElementById('telemetry-epoch');
    const telemetryWater = document.getElementById('telemetry-water');
    const telemetryForest = document.getElementById('telemetry-forest');
    const telemetryUrban = document.getElementById('telemetry-urban');
    const telemetryTemp = document.getElementById('telemetry-temp');

    function updateEpochState(year) {
      currentTimelineYear = Number(year);
      const stage = getEpochForYear(currentTimelineYear);
      const baseSea = textures.seaLevelBaseline || 0.50;

      // 1. DYNAMIC SURFACE TRANSFORMATION:
      // Sea level rises or decreases, flooding coasts or exposing land bridges
      surfaceMat.uniforms.uSeaLevel.value = baseSea + stage.seaLevelOffset;
      // Vegetation expands or contracts (ancient lush -> industrial deforestation -> space terraforming)
      surfaceMat.uniforms.uVegetation.value = stage.vegetationCover;
      // Cities expand from 0 to sprawling modern megalopolises
      surfaceMat.uniforms.uCityGrowth.value = stage.cityGrowth;
      // Night side lights scale up
      surfaceMat.uniforms.uCityNightGlow.value = stage.cityNightGlow;
      // Polar ice sheets melt or freeze
      surfaceMat.uniforms.uIceCapExtent.value = stage.iceCapExtent;
      // Industrial factory smog
      surfaceMat.uniforms.uSmogDensity.value = stage.smogDensity;
      cloudMat.uniforms.uSmogDensity.value = stage.smogDensity;

      // 2. Space Age Megastructures visibility
      const spaceLayerActive = document.getElementById('layer-space')?.checked ?? true;
      const targetOpacity = spaceLayerActive ? stage.orbitalOpacity : 0.0;
      ringMat.opacity = targetOpacity;
      satMat.opacity = targetOpacity;
      orbitalRing.children.forEach(c => {
        if (c.material) c.material.opacity = targetOpacity;
      });

      // 3. Update DOM Telemetry Elements
      if (epochYearIndicator) epochYearIndicator.textContent = `Year ${currentTimelineYear.toLocaleString()}`;
      if (epochSubtitle) epochSubtitle.textContent = `(${stage.subtitle})`;
      if (epochBadge) {
        epochBadge.textContent = stage.era;
        epochBadge.className = `badge ${stage.badgeClass}`;
      }

      if (telemetryPop) {
        const popVal = calculateEpochPopulation(activeWorld, currentTimelineYear);
        telemetryPop.textContent = formatPopulation(popVal);
      }
      if (telemetryEpoch) telemetryEpoch.textContent = stage.era;
      if (telemetryWater) telemetryWater.textContent = stage.waterPercent;
      if (telemetryForest) telemetryForest.textContent = stage.forestPercent;
      if (telemetryUrban) telemetryUrban.textContent = stage.urbanPercent;
      if (telemetryTemp) telemetryTemp.textContent = stage.realMeanTemp;
      const telemetryPrecip = document.getElementById('telemetry-precip');
      if (telemetryPrecip) telemetryPrecip.textContent = stage.precipitation;
      const telemetryRelief = document.getElementById('telemetry-relief');
      if (telemetryRelief) telemetryRelief.textContent = stage.elevationRelief;

      // Update active milestone label styling
      document.querySelectorAll('.epoch-milestone').forEach(el => {
        const myYear = Number(el.getAttribute('data-year'));
        el.classList.toggle('active', Math.abs(currentTimelineYear - myYear) < 1200);
      });
    }

    // Bind Epoch Slider Event
    if (epochSlider) {
      epochSlider.addEventListener('input', (e) => {
        updateEpochState(e.target.value);
      });
    }

    // Clickable Epoch Milestones
    document.querySelectorAll('.epoch-milestone').forEach(el => {
      el.addEventListener('click', () => {
        const yr = Number(el.getAttribute('data-year'));
        if (epochSlider) epochSlider.value = yr;
        updateEpochState(yr);
      });
    });

    // Initialize to slider starting position
    updateEpochState(epochSlider ? epochSlider.value : 7500);

    // ============================================================
    // Dedicated Day and Night Mode Handlers
    // Day: Full frontal sunlight, bright ambient fill, perfect land & biomes!
    // Night: Deep midnight dark planet where the civilization lights shine!
    // ============================================================
    const btnDay = document.getElementById('ctrl-btn-day');
    const btnNight = document.getElementById('ctrl-btn-night');

    function setDayNightMode(day) {
      isDayMode = day;
      targetDayNightBlend = day ? 0.0 : 1.0;

      if (btnDay) {
        btnDay.classList.toggle('active', day);
      }
      if (btnNight) {
        btnNight.classList.toggle('active', !day);
        btnNight.classList.toggle('night', !day);
      }
    }

    if (btnDay) {
      btnDay.addEventListener('click', () => setDayNightMode(true));
    }
    if (btnNight) {
      btnNight.addEventListener('click', () => setDayNightMode(false));
    }

    // ============================================================
    // Observation Layer Toggles
    // ============================================================
    const layerCities = document.getElementById('layer-cities');
    const layerWater = document.getElementById('layer-water');
    const layerVegetation = document.getElementById('layer-vegetation');
    const layerWeather = document.getElementById('layer-weather');
    const layerResources = document.getElementById('layer-resources');
    const layerSpace = document.getElementById('layer-space');

    if (layerCities) {
      layerCities.addEventListener('change', (e) => {
        surfaceMat.uniforms.uLayerCities.value = e.target.checked ? 1.0 : 0.0;
      });
    }

    if (layerWater) {
      layerWater.addEventListener('change', (e) => {
        surfaceMat.uniforms.uLayerWater.value = e.target.checked ? 1.0 : 0.0;
      });
    }

    if (layerVegetation) {
      layerVegetation.addEventListener('change', (e) => {
        surfaceMat.uniforms.uLayerVegetation.value = e.target.checked ? 1.0 : 0.0;
      });
    }

    if (layerWeather) {
      layerWeather.addEventListener('change', (e) => {
        cloudMat.uniforms.uVisibility.value = e.target.checked ? 1.0 : 0.0;
      });
    }

    if (layerResources) {
      layerResources.addEventListener('change', (e) => {
        resourceGroup.visible = e.target.checked;
      });
    }

    if (layerSpace) {
      layerSpace.addEventListener('change', (e) => {
        const stage = getEpochForYear(currentTimelineYear);
        const op = e.target.checked ? stage.orbitalOpacity : 0.0;
        ringMat.opacity = op;
        satMat.opacity = op;
        orbitalRing.children.forEach(c => {
          if (c.material) c.material.opacity = op;
        });
      });
    }

    // ============================================================
    // Control Buttons
    // ============================================================
    const ctrlRotate = document.getElementById('ctrl-rotate');
    if (ctrlRotate) {
      ctrlRotate.addEventListener('click', () => {
        autoRotate = !autoRotate;
        ctrlRotate.classList.toggle('active', autoRotate);
      });
    }

    const ctrlPlay = document.getElementById('ctrl-play');
    if (ctrlPlay) {
      ctrlPlay.addEventListener('click', () => {
        isPlaying = !isPlaying;
        ctrlPlay.classList.toggle('active', isPlaying);
        ctrlPlay.innerHTML = isPlaying ? icon('pause', 18) : icon('play', 18);
      });
    }

    const ctrlFullscreen = document.getElementById('ctrl-fullscreen');
    if (ctrlFullscreen) {
      ctrlFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // ============================================================
    // Planet World Switcher
    // ============================================================
    function switchWorld(newWorld) {
      if (!newWorld) return;
      activeWorld = newWorld;

      textures = generatePlanetTextures(activeWorld);

      elevTexture.image = textures.elevCanvas;
      elevTexture.needsUpdate = true;

      surfaceTexture.image = textures.surfaceCanvas;
      surfaceTexture.needsUpdate = true;

      lightsTexture.image = textures.lightsCanvas;
      lightsTexture.needsUpdate = true;

      cloudTexture.image = textures.cloudCanvas;
      cloudTexture.needsUpdate = true;

      atmoMat.uniforms.glowColor.value = getAtmoColor(activeWorld.atmosphere);

      const avatar = document.getElementById('viewer-world-avatar');
      if (avatar) {
        avatar.style.background = `radial-gradient(circle at 35% 35%, ${activeWorld.color || '#38bdf8'}, #0f172a)`;
        avatar.style.boxShadow = `0 0 25px ${(activeWorld.color || '#38bdf8')}80`;
      }
      const nameEl = document.getElementById('viewer-world-name');
      if (nameEl) nameEl.textContent = activeWorld.name;

      const climateEl = document.getElementById('telemetry-climate');
      if (climateEl) climateEl.textContent = activeWorld.climate || 'Oceanic';

      updateEpochState(currentTimelineYear);
    }

    const worldSelect = document.getElementById('viewer-world-select');
    if (worldSelect) {
      worldSelect.addEventListener('change', (e) => {
        setActiveWorldId(e.target.value);
        const w = getWorlds().find(item => item.id === e.target.value);
        if (w) switchWorld(w);
      });
    }

    const onWorldChanged = (e) => {
      if (e.detail && e.detail.world) {
        switchWorld(e.detail.world);
        if (worldSelect) worldSelect.value = e.detail.world.id;
      }
    };
    window.addEventListener('genesis:world-changed', onWorldChanged);

    // ============================================================
    // Mouse Interaction: Click & Drag to Orbit, Wheel to Zoom
    // ============================================================
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.viewer-info, .viewer-legend, .viewer-timeline, .viewer-controls')) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      planetGroup.rotation.y += deltaX * 0.005;
      planetGroup.rotation.x = Math.max(-1.2, Math.min(1.2, planetGroup.rotation.x + deltaY * 0.005));
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('wheel', (e) => {
      if (e.target.closest('.viewer-info, .viewer-legend')) return;
      e.preventDefault();
      camera.position.z = Math.max(2.1, Math.min(5.5, camera.position.z + e.deltaY * 0.002));
    }, { passive: false });

    // ============================================================
    // Animation Loop (60 FPS)
    // ============================================================
    let animFrameId;

    function animate() {
      if (!document.getElementById('globe-canvas')) return;
      animFrameId = requestAnimationFrame(animate);

      // Auto rotation
      if (autoRotate && !isDragging) {
        planetGroup.rotation.y += 0.0016;
      }

      // Atmospheric parallax
      cloudsMesh.rotation.y += 0.0006;
      stars.rotation.y += 0.00008;

      // Animate satellites
      if (spaceAgeGroup.visible && satMat.opacity > 0.01) {
        const satPosAttr = satGeo.attributes.position;
        for (let i = 0; i < satCount; i++) {
          const m = satMeta[i];
          m.theta += m.speed;
          satPosAttr.setXYZ(
            i,
            m.r * Math.cos(m.theta) * Math.cos(m.inc),
            m.r * Math.sin(m.inc),
            m.r * Math.sin(m.theta) * Math.cos(m.inc)
          );
        }
        satPosAttr.needsUpdate = true;
        orbitalRing.rotation.z += 0.002;
      }

      // Smooth Day / Night transition
      currentDayNightBlend += (targetDayNightBlend - currentDayNightBlend) * 0.07;
      surfaceMat.uniforms.uDayNightBlend.value = currentDayNightBlend;
      cloudMat.uniforms.uDayNightBlend.value = currentDayNightBlend;
      atmoMat.uniforms.uDayNightBlend.value = currentDayNightBlend;

      // In Day mode: sun is in front, high light shows land and biomes
      // In Night mode: sun moves behind, planet is dark and civilization shines
      const daySunX = 1.8, daySunY = 2.8, daySunZ = 4.5;
      const nightSunX = -1.8, nightSunY = -2.8, nightSunZ = -4.5;

      sunPosVec.set(
        daySunX + (nightSunX - daySunX) * currentDayNightBlend,
        daySunY + (nightSunY - daySunY) * currentDayNightBlend,
        daySunZ + (nightSunZ - daySunZ) * currentDayNightBlend
      );
      sunLight.position.copy(sunPosVec);
      surfaceMat.uniforms.sunPosition.value.copy(sunPosVec);
      cloudMat.uniforms.sunPosition.value.copy(sunPosVec);
      atmoMat.uniforms.sunPosition.value.copy(sunPosVec);

      // Light intensity modulation
      sunLight.intensity = 2.2 * (1.0 - currentDayNightBlend * 0.85);
      ambientLight.intensity = 0.55 * (1.0 - currentDayNightBlend * 0.88);

      // Playback simulation scrubber animation
      if (isPlaying) {
        let nextYear = currentTimelineYear + 18;
        if (nextYear > 10000) nextYear = 0;
        if (epochSlider) epochSlider.value = nextYear;
        updateEpochState(nextYear);
      }

      renderer.render(scene, camera);
    }

    animate();

    // Responsive Canvas Resize
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

  }).catch((err) => {
    console.error('Three.js globe initialization error:', err);
    canvas.parentElement.innerHTML = `
      <div class="flex items-center justify-center" style="height:100%;background:var(--bg-primary)">
        <div style="text-align:center;padding:var(--space-8)">
          <div style="width:160px;height:160px;border-radius:50%;background:radial-gradient(circle at 35% 35%, #38bdf8, #0f172a);margin:0 auto var(--space-6);box-shadow:0 0 60px rgba(56,189,248,0.3)"></div>
          <h2 style="font-family:var(--font-display);font-size:var(--text-h3)">Planetary Simulation Active</h2>
          <p style="font-family:var(--font-mono);color:var(--text-muted);font-size:var(--text-xs);margin-top:var(--space-2)">Procedural generation complete.</p>
        </div>
      </div>
    `;
  });
}
