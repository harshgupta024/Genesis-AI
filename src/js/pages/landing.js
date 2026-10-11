/* ============================================================
   GENESIS — Landing Page
   Planetary Research Laboratory Portal
   ============================================================ */

import { icon } from '../icons.js';
import { animateCounter, observeAndAnimate } from '../utils/counter.js';
import { CosmicBackground } from '../utils/cosmic-bg.js';

let cosmicBg = null;

export function renderLanding() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="full-page" id="cosmic-landing-container" style="overflow-x:hidden">
      <!-- Navigation -->
      <nav class="landing-nav" id="landing-nav">
        <div class="landing-nav-brand">
          <div class="sidebar-brand-icon">${icon('globe', 20)}</div>
          <span style="font-family:var(--font-display);font-weight:700;font-size:1.1rem;letter-spacing:0.04em">GENESIS</span>
        </div>
        <div class="landing-nav-links">
          <a href="#features">Capabilities</a>
          <a href="#architecture">Architecture</a>
          <a href="#technology">Technology</a>
        </div>
        <div class="landing-nav-actions">
          <a href="#/auth" class="btn btn-ghost btn-sm">Sign In</a>
          <a href="#/dashboard" class="btn btn-primary btn-sm">Launch Observatory</a>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero" id="hero">
        <div class="hero-bg"></div>

        <!-- Orbit Rings with warm tint -->
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0.2">
          <div class="orbit-ring" style="width:500px;height:500px">
            <div class="orbit-dot" style="top:0;left:50%"></div>
          </div>
          <div class="orbit-ring" style="width:700px;height:700px;position:absolute">
            <div class="orbit-dot" style="bottom:0;right:10%"></div>
          </div>
          <div class="orbit-ring" style="width:900px;height:900px;position:absolute">
            <div class="orbit-dot" style="top:30%;left:0"></div>
          </div>
        </div>

        <div class="hero-content fade-in-up">
          <div class="hero-badge">
            <span class="dot"></span>
            <span style="font-family:var(--font-mono);letter-spacing:0.05em;text-transform:uppercase;font-size:0.65rem">Synthetic World Simulation Platform</span>
          </div>

          <h1 class="hero-title">
            Design a World.<br/>
            Define the Rules.<br/>
            <span class="highlight">Predict the Future.</span>
          </h1>

          <p class="hero-subtitle">
            Genesis is a planetary research laboratory for synthetic world generation
            and predictive civilization simulation. Create planets, run simulations,
            and forecast outcomes with machine learning.
          </p>

          <div class="hero-actions">
            <a href="#/dashboard" class="btn btn-primary btn-xl">
              ${icon('rocket', 20)}
              Launch Observatory
            </a>
            <a href="#/world-builder" class="btn btn-secondary btn-xl">
              ${icon('cube', 20)}
              Create a World
            </a>
          </div>

          <!-- Telemetry Stats Bar -->
          <div class="hero-stats stagger-children">
            <div class="hero-stat">
              <div class="hero-stat-value" data-count="12847">0</div>
              <div class="hero-stat-label">Worlds Generated</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value" data-count="48293">0</div>
              <div class="hero-stat-label">Simulations Run</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value" data-count="94" data-suffix="%">0</div>
              <div class="hero-stat-label">Prediction Accuracy</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value" data-count="156">0</div>
              <div class="hero-stat-label">Research Teams</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Capabilities Section -->
      <section class="features-section" id="features">
        <div class="features-header">
          <h2>Research <span class="text-gradient">Capabilities</span></h2>
          <p>A complete platform for synthetic world creation, simulation, and predictive analysis</p>
        </div>

        <div class="features-grid stagger-children">
          <div class="feature-card hover-lift">
            <div class="feature-icon" style="background:var(--accent-primary-dim);color:var(--accent-primary-light)">
              ${icon('globe', 28)}
            </div>
            <h3>World Generation</h3>
            <p>Procedurally generate entire planets with custom climates, terrains, atmospheres, and ecosystems. Every world is unique.</p>
          </div>

          <div class="feature-card hover-lift">
            <div class="feature-icon" style="background:var(--accent-secondary-dim);color:var(--accent-secondary-light)">
              ${icon('play', 28)}
            </div>
            <h3>Civilization Simulation</h3>
            <p>Watch civilizations emerge, evolve, and interact. From bronze age settlements to space-faring societies.</p>
          </div>

          <div class="feature-card hover-lift">
            <div class="feature-icon" style="background:var(--accent-data-dim);color:var(--accent-data)">
              ${icon('brain', 28)}
            </div>
            <h3>ML Predictions</h3>
            <p>Machine learning models predict population growth, technological advancement, resource depletion, and civilizational outcomes.</p>
          </div>

          <div class="feature-card hover-lift">
            <div class="feature-icon" style="background:var(--success-dim);color:var(--success)">
              ${icon('barChart', 28)}
            </div>
            <h3>Real-time Analytics</h3>
            <p>Interactive charts and dashboards for population, economy, technology, climate, and resource tracking across eras.</p>
          </div>

          <div class="feature-card hover-lift">
            <div class="feature-icon" style="background:var(--warning-dim);color:var(--warning)">
              ${icon('gitCompare', 28)}
            </div>
            <h3>Scenario Comparison</h3>
            <p>Compare multiple worlds side-by-side. Analyze different initial conditions and their impact on civilization trajectories.</p>
          </div>

          <div class="feature-card hover-lift">
            <div class="feature-icon" style="background:var(--danger-dim);color:var(--danger)">
              ${icon('eye', 28)}
            </div>
            <h3>3D Visualization</h3>
            <p>Explore your worlds in an interactive 3D viewer with day/night cycles, weather systems, and civilization overlays.</p>
          </div>
        </div>
      </section>

      <!-- Architecture Section -->
      <section class="architecture-section" id="architecture">
        <div class="features-header">
          <h2>Platform <span class="text-gradient">Architecture</span></h2>
          <p>Enterprise-grade infrastructure designed for scale and reliability</p>
        </div>

        <div class="arch-diagram">
          <div class="arch-layer">
            <div class="arch-node hover-glow">${icon('layers', 18)} Frontend UI</div>
            <div class="arch-node hover-glow">${icon('globe', 18)} 3D Engine</div>
            <div class="arch-node hover-glow">${icon('command', 18)} API Gateway</div>
          </div>
          <div class="arch-connector"></div>
          <div class="arch-layer">
            <div class="arch-node hover-glow">${icon('cpu', 18)} Simulation Engine</div>
            <div class="arch-node hover-glow">${icon('brain', 18)} ML Pipeline</div>
            <div class="arch-node hover-glow">${icon('activity', 18)} Analytics Engine</div>
          </div>
          <div class="arch-connector"></div>
          <div class="arch-layer">
            <div class="arch-node hover-glow">${icon('database', 18)} World Database</div>
            <div class="arch-node hover-glow">${icon('network', 18)} Model Registry</div>
            <div class="arch-node hover-glow">${icon('folder', 18)} Blob Storage</div>
          </div>
        </div>
      </section>

      <!-- Technology Stack -->
      <section class="tech-section" id="technology">
        <div class="features-header">
          <h2>Technology <span class="text-gradient">Stack</span></h2>
          <p>Powered by cutting-edge technologies</p>
        </div>

        <div class="tech-grid">
          ${[
            { name: 'Three.js', icon: '3D', color: '#c47a5a' },
            { name: 'TensorFlow', icon: 'TF', color: '#c4a35a' },
            { name: 'PyTorch', icon: 'PT', color: '#b85c5c' },
            { name: 'WebGL', icon: 'GL', color: '#8ba5b8' },
            { name: 'GraphQL', icon: 'GQ', color: '#a87a8a' },
            { name: 'Docker', icon: 'DK', color: '#7a9e8e' },
            { name: 'Kubernetes', icon: 'K8', color: '#8ba5b8' },
            { name: 'PostgreSQL', icon: 'PG', color: '#7a9e8e' },
          ].map(t => `
            <div class="tech-item tooltip" data-tooltip="${t.name}">
              <div class="tech-item-icon" style="background:${t.color}15;color:${t.color}">${t.icon}</div>
              <span class="tech-item-name">${t.name}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-card hover-lift">
          <h2>Ready to Create Your <span class="text-gradient">First World</span>?</h2>
          <p>Join researchers and scientists who are pushing the boundaries of predictive simulation.</p>
          <div class="hero-actions">
            <a href="#/dashboard" class="btn btn-primary btn-xl">
              ${icon('rocket', 20)}
              Begin Research
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-grid">
          <div class="footer-brand">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem">
              <div class="sidebar-brand-icon" style="width:32px;height:32px">${icon('globe', 16)}</div>
              <span style="font-family:var(--font-display);font-weight:700;letter-spacing:0.04em">GENESIS</span>
            </div>
            <p>Design a World. Define the Rules. Predict the Future.</p>
          </div>
          <div class="footer-col">
            <h4>Platform</h4>
            <a href="#/dashboard">Observatory</a>
            <a href="#/world-builder">World Builder</a>
            <a href="#/simulation">Simulation</a>
            <a href="#/predictions">Predictions</a>
          </div>
          <div class="footer-col">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Tutorials</a>
            <a href="#">Research Papers</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Genesis. All rights reserved.</span>
          <span>Built with ${icon('sparkles', 14)} by Harsh Gupta</span>
        </div>
      </footer>
    </div>
  `;

  initLanding();
}

function initLanding() {
  // Initialize cosmic background
  if (cosmicBg) cosmicBg.destroy();
  const cosmicContainer = document.getElementById('cosmic-landing-container');
  if (cosmicContainer) {
    cosmicBg = new CosmicBackground(cosmicContainer, {
      starCount: 400,
      planetStarCount: 10,
      asteroidCount: 15,
      satelliteCount: 5,
      nebulaCount: 6,
      shootingStarInterval: 300,
    });
  }

  // Scroll-triggered nav background
  const nav = document.getElementById('landing-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Animate counters on scroll
  observeAndAnimate('[data-count]', (el) => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    animateCounter(el, target, 2500, '', suffix);
  });
}
