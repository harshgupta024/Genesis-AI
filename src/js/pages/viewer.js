/* ============================================================
   GENESIS — 3D World Viewer Page
   Planetary Observatory — Enhanced Globe
   ============================================================ */

import { icon } from '../icons.js';
import { getActiveWorld, getWorlds, setActiveWorldId } from '../utils/world-manager.js';

export function renderViewer() {
  const worlds = getWorlds();
  const w = getActiveWorld() || worlds[0] || { name: 'Nova Terra', population: 8420000, gravity: 1.02, waterCoverage: 68, climate: 'Temperate', simStatus: 'running', epoch: 'Era V — Industrial Age', color: '#3B82F6' };
  const popStr = w.population >= 1e6 ? (w.population / 1e6).toFixed(2) + 'M' : w.population >= 1e3 ? (w.population / 1e3).toFixed(1) + 'K' : w.population.toString();
  return `
    <div class="page-container" style="padding:0">
      <div class="viewer-container" id="viewer-container">
        <!-- Three.js canvas will be mounted here -->
        <canvas id="globe-canvas" class="viewer-canvas" aria-label="3D World Viewer"></canvas>

        <!-- Planetary Telemetry Panel -->
        <div class="viewer-info fade-in-left">
          <div class="flex items-center gap-3" style="margin-bottom:var(--space-3)">
            <div style="width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 35% 35%, ${w.color || '#c47a5a'}, #7a9e8e, #0a0c10);box-shadow:0 0 20px ${w.color || 'rgba(196,122,90,0.3)'}60"></div>
            <div style="flex:1">
              <h3 style="font-family:var(--font-display);font-size:var(--text-body);font-weight:var(--weight-semibold)">${w.name}</h3>
              <span class="badge badge-${w.simStatus === 'running' ? 'green' : w.simStatus === 'paused' ? 'amber' : 'blue'}" style="font-size:9px"><span class="badge-dot"></span> ${w.simStatus || 'Active'}</span>
            </div>
          </div>

          <!-- Quick Planet Selector -->
          <div style="margin-bottom:var(--space-3)">
            <select id="viewer-world-select" class="select" style="width:100%;padding:4px 28px 4px 8px;font-size:var(--text-2xs);background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1)" aria-label="Select planet">
              ${worlds.map(item => `<option value="${item.id}" ${item.id === w.id ? 'selected' : ''}>${item.name} (${item.climate})</option>`).join('')}
            </select>
          </div>

          <div style="font-family:var(--font-mono);font-size:var(--text-2xs);color:var(--text-disabled);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:var(--space-3)">Telemetry Data</div>
          <div class="flex flex-col gap-3">
            ${[
              { label: 'Population', value: popStr, icon: 'users' },
              { label: 'Epoch', value: w.epoch || 'Era I', icon: 'clock' },
              { label: 'Gravity', value: (w.gravity || 1.0).toFixed(2) + 'g', icon: 'target' },
              { label: 'Water', value: (w.waterCoverage || 50) + '%', icon: 'droplets' },
              { label: 'Climate', value: w.climate || 'Temperate', icon: 'thermometer' },
            ].map(s => `
              <div class="flex items-center justify-between" style="font-size:var(--text-sm)">
                <span style="color:var(--text-muted);display:flex;align-items:center;gap:6px">
                  ${icon(s.icon, 14)} ${s.label}
                </span>
                <span style="font-family:var(--font-mono);color:var(--text-primary);font-weight:500;font-variant-numeric:tabular-nums;font-size:var(--text-xs)">${s.value}</span>
              </div>
            `).join('')}
          </div>
        </div>


        <!-- Observation Layers Panel -->
        <div class="viewer-legend fade-in-right">
          <h4>Observation Layers</h4>
          ${[
            { name: 'Population Density', color: '#c47a5a', active: true },
            { name: 'Cities & Settlements', color: '#c4a35a', active: true },
            { name: 'Water Bodies', color: '#7a9e8e', active: true },
            { name: 'Forests & Vegetation', color: '#6b9e7a', active: false },
            { name: 'Weather Patterns', color: '#8ba5b8', active: false },
            { name: 'Resource Distribution', color: '#b85c5c', active: false },
          ].map(l => `
            <label class="legend-item" style="cursor:pointer">
              <div class="legend-dot" style="background:${l.color};opacity:${l.active ? 1 : 0.3}"></div>
              <span style="flex:1">${l.name}</span>
              <label class="toggle" style="width:36px;height:20px">
                <input type="checkbox" ${l.active ? 'checked' : ''} />
                <span class="toggle-track" style="border-radius:10px"></span>
                <span class="toggle-thumb" style="width:16px;height:16px;top:2px;left:2px"></span>
              </label>
            </label>
          `).join('')}
        </div>

        <!-- Epoch Scrubber -->
        <div class="viewer-timeline fade-in-up">
          <div class="flex items-center justify-between" style="margin-bottom:var(--space-2)">
            <span style="font-family:var(--font-mono);font-size:var(--text-2xs);font-weight:500;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em">Epoch Scrubber</span>
            <span class="badge badge-blue" style="font-size:9px">Era V — Industrial</span>
          </div>
          <input class="range-slider timeline-slider" type="range" min="0" max="10000" value="7500" aria-label="Timeline scrubber" />
          <div class="epoch-labels">
            <span>Y0 — Genesis</span>
            <span>Y2500</span>
            <span>Y5000</span>
            <span>Y7500</span>
            <span>Y10000</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="viewer-controls fade-in-up">
          <button class="btn-icon tooltip" data-tooltip="Rotate" aria-label="Rotate view">
            ${icon('rotateCcw', 18)}
          </button>
          <button class="btn-icon tooltip" data-tooltip="Day/Night" aria-label="Toggle day night cycle">
            ${icon('sun', 18)}
          </button>
          <div style="width:1px;height:24px;background:rgba(255,255,255,0.06)"></div>
          <button class="btn-icon transport-btn play tooltip" data-tooltip="Play" aria-label="Play simulation">
            ${icon('play', 18)}
          </button>
          <div style="width:1px;height:24px;background:rgba(255,255,255,0.06)"></div>
          <button class="btn-icon tooltip" data-tooltip="Fullscreen" aria-label="Toggle fullscreen">
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

  const worldSelect = document.getElementById('viewer-world-select');
  if (worldSelect) {
    worldSelect.addEventListener('change', (e) => {
      setActiveWorldId(e.target.value);
    });
  }

  // Procedural 3D globe using Three.js
  import('three').then(({ Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshPhongMaterial, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight, Group, Color, BackSide, MeshBasicMaterial, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial }) => {
    const container = document.getElementById('viewer-container');
    if (!container) return;

    const scene = new Scene();
    scene.background = new Color('#0a0c10');

    const camera = new PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3.2;

    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Planet group
    const planetGroup = new Group();

    const w = getActiveWorld() || getWorlds()[0] || {
      name: 'Nova Terra', climate: 'Temperate', waterCoverage: 68,
      atmosphere: 'Nitrogen-Oxygen', color: '#3B82F6',
    };

    // Color palettes calibrated to planetary characteristics
    const oceanColorMap = {
      Oceanic: '#0a3d62',
      Volcanic: '#1c0f0f',
      Arctic: '#1a3045',
      Arid: '#3d2e1e',
      Desert: '#42331c',
      Tropical: '#0c384a',
      Temperate: '#0d2847',
    };
    const landColorMap = {
      Tropical: '#2d6a3f',
      Temperate: '#4a6b40',
      Arid: '#8c6d46',
      Desert: '#a37b42',
      Arctic: '#b8c9d4',
      Volcanic: '#542323',
      Oceanic: '#357a66',
    };
    const atmoColorMap = {
      'Nitrogen-Oxygen': '#3B82F6',
      'Carbon Dioxide': '#F59E0B',
      'Methane': '#06B6D4',
      'Helium': '#EC4899',
      'Toxic': '#10B981',
    };

    const chosenOcean = oceanColorMap[w.climate] || '#0d2847';
    const chosenLand = landColorMap[w.climate] || w.color || '#4a6b40';
    const chosenAtmo = atmoColorMap[w.atmosphere] || '#3B82F6';

    // Ocean — color tuned to world climate
    const oceanGeo = new SphereGeometry(1, 64, 64);
    const oceanMat = new MeshStandardMaterial({
      color: new Color(chosenOcean),
      roughness: 0.7,
      metalness: 0.1,
    });
    const ocean = new Mesh(oceanGeo, oceanMat);
    planetGroup.add(ocean);

    // Land masses — dynamically adjusted to world characteristics
    const landGeo = new SphereGeometry(1.003, 64, 64);
    const positions = landGeo.attributes.position;
    const waterThreshold = (w.waterCoverage || 50) / 100 * 0.008;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      // Multi-octave noise for more organic continents
      const n1 = Math.sin(x * 3.5) * Math.cos(y * 2.8) * Math.sin(z * 4.2);
      const n2 = Math.sin(x * 7.1 + 1.3) * Math.cos(y * 5.7 - 0.8) * Math.sin(z * 8.3 + 2.1) * 0.4;
      const n3 = Math.sin(x * 13.2 - 2.1) * Math.cos(y * 11.5 + 1.5) * Math.sin(z * 14.8) * 0.15;
      const noise = (n1 + n2 + n3) * 0.025;
      if (noise > waterThreshold) {
        const elevation = 1 + noise;
        positions.setXYZ(i, x * elevation, y * elevation, z * elevation);
      }
    }
    landGeo.computeVertexNormals();
    const landMat = new MeshStandardMaterial({
      color: new Color(chosenLand),
      roughness: 0.85,
      metalness: 0.05,
    });
    const land = new Mesh(landGeo, landMat);
    planetGroup.add(land);

    // Atmosphere — color tuned to world atmosphere
    const atmoGeo = new SphereGeometry(1.12, 64, 64);
    const atmoMat = new MeshBasicMaterial({
      color: new Color(chosenAtmo),
      transparent: true,
      opacity: 0.05,
      side: BackSide,
    });
    const atmosphere = new Mesh(atmoGeo, atmoMat);
    planetGroup.add(atmosphere);

    // Thin atmosphere edge
    const atmoEdgeGeo = new SphereGeometry(1.06, 64, 64);
    const atmoEdgeMat = new MeshBasicMaterial({
      color: new Color(w.color || '#7a9e8e'),
      transparent: true,
      opacity: 0.07,
      side: BackSide,
    });
    const atmoEdge = new Mesh(atmoEdgeGeo, atmoEdgeMat);
    planetGroup.add(atmoEdge);

    // Clouds
    const cloudGeo = new SphereGeometry(1.02, 48, 48);
    const cloudMat = new MeshPhongMaterial({
      color: new Color('#e8e4e0'),
      transparent: true,
      opacity: w.waterCoverage > 60 ? 0.16 : 0.08,
    });
    const clouds = new Mesh(cloudGeo, cloudMat);
    planetGroup.add(clouds);

    scene.add(planetGroup);

    // Star field with varying sizes
    const starVertices = [];
    const starSizes = [];
    for (let i = 0; i < 3000; i++) {
      const r = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starVertices.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      starSizes.push(0.5 + Math.random() * 1.5);
    }
    const starGeo = new BufferGeometry();
    starGeo.setAttribute('position', new Float32BufferAttribute(starVertices, 3));
    const starMat = new PointsMaterial({
      color: new Color('#e8e4e0'),
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const stars = new Points(starGeo, starMat);
    scene.add(stars);

    // Lights — warm sunlight
    const ambient = new AmbientLight('#d4c0b0', 0.25);
    scene.add(ambient);

    const sun = new DirectionalLight('#ffe8d0', 1.3);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    // Subtle warm fill light from opposite side
    const fill = new DirectionalLight('#7a9e8e', 0.15);
    fill.position.set(-3, -1, -3);
    scene.add(fill);

    // Interaction — auto-rotation + mouse influence
    let mouseX = 0, mouseY = 0;
    container.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / container.clientWidth - 0.5) * 0.5;
      mouseY = (e.clientY / container.clientHeight - 0.5) * 0.5;
    });

    function animate() {
      requestAnimationFrame(animate);

      planetGroup.rotation.y += 0.0018;
      clouds.rotation.y += 0.0008;
      stars.rotation.y += 0.0001;

      // Mouse influence
      planetGroup.rotation.x += (mouseY * 0.3 - planetGroup.rotation.x) * 0.02;

      renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);
  }).catch(() => {
    // Fallback if Three.js fails to load
    canvas.parentElement.innerHTML = `
      <div class="flex items-center justify-center" style="height:100%;background:var(--bg-primary)">
        <div style="text-align:center;padding:var(--space-8)">
          <div style="width:200px;height:200px;border-radius:50%;background:radial-gradient(circle at 35% 35%, #c47a5a, #7a9e8e, #0a0c10);margin:0 auto var(--space-6);box-shadow:0 0 60px rgba(196,122,90,0.2)"></div>
          <h2 style="font-family:var(--font-display);font-size:var(--text-h3)">Nova Terra</h2>
          <p style="font-family:var(--font-mono);color:var(--text-muted);font-size:var(--text-xs);margin-top:var(--space-2);text-transform:uppercase;letter-spacing:0.05em">Rendering planetary surface...</p>
        </div>
      </div>
    `;
  });
}
