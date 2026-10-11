/* ============================================================
   GENESIS AI — World State Manager
   Manages world creation, storage, and retrieval using localStorage.
   All worlds (including demo seeds) persist across sessions.
   ============================================================ */

const STORAGE_KEY = 'genesis_worlds';
const ACTIVE_WORLD_KEY = 'genesis_active_world';

// Demo seed worlds — used to initialize on first visit
const SEED_WORLDS = [
  {
    id: 'w1', name: 'Nova Terra', status: 'active', created: '2026-07-15',
    population: 8420000, techLevel: 'Industrial', climate: 'Temperate',
    gravity: 1.02, waterCoverage: 68, economy: 'Mixed', government: 'Democracy',
    color: '#3B82F6', simStatus: 'running', epoch: 'Era V — Industrial Age',
    atmosphere: 'Nitrogen-Oxygen', species: 'Humanoid', resources: 'Abundant',
    description: 'A temperate planet with thriving industrial civilizations.',
  },
  {
    id: 'w2', name: 'Kepler Prime', status: 'active', created: '2026-07-22',
    population: 3150000, techLevel: 'Medieval', climate: 'Arid',
    gravity: 0.87, waterCoverage: 32, economy: 'Feudal', government: 'Monarchy',
    color: '#F59E0B', simStatus: 'paused', epoch: 'Era III — Medieval Period',
    atmosphere: 'Nitrogen-Oxygen', species: 'Humanoid', resources: 'Limited',
    description: 'A dry desert world ruled by feudal lords.',
  },
  {
    id: 'w3', name: 'Aetheria', status: 'completed', created: '2026-06-10',
    population: 12700000, techLevel: 'Space Age', climate: 'Oceanic',
    gravity: 1.15, waterCoverage: 84, economy: 'Post-Scarcity', government: 'Technocracy',
    color: '#06B6D4', simStatus: 'completed', epoch: 'Era VIII — Space Age',
    atmosphere: 'Nitrogen-Oxygen', species: 'Humanoid', resources: 'Abundant',
    description: 'An ocean world that has achieved spacefaring civilization.',
  },
  {
    id: 'w4', name: 'Verdant IX', status: 'active', created: '2026-08-01',
    population: 580000, techLevel: 'Bronze Age', climate: 'Tropical',
    gravity: 0.95, waterCoverage: 71, economy: 'Agrarian', government: 'Tribal',
    color: '#10B981', simStatus: 'running', epoch: 'Era II — Bronze Age',
    atmosphere: 'Nitrogen-Oxygen', species: 'Humanoid', resources: 'Moderate',
    description: 'A lush tropical planet in its early civilizational stages.',
  },
  {
    id: 'w5', name: 'Frost Haven', status: 'draft', created: '2026-08-05',
    population: 0, techLevel: 'N/A', climate: 'Arctic',
    gravity: 1.30, waterCoverage: 15, economy: 'N/A', government: 'N/A',
    color: '#8B5CF6', simStatus: 'stopped', epoch: 'Not Started',
    atmosphere: 'Nitrogen-Oxygen', species: 'Humanoid', resources: 'Scarce',
    description: 'A frozen world awaiting simulation.',
  },
  {
    id: 'w6', name: 'Pyraxis', status: 'active', created: '2026-07-28',
    population: 1920000, techLevel: 'Renaissance', climate: 'Volcanic',
    gravity: 1.10, waterCoverage: 22, economy: 'Mercantile', government: 'City-States',
    color: '#EF4444', simStatus: 'running', epoch: 'Era IV — Renaissance',
    atmosphere: 'Carbon Dioxide', species: 'Reptilian', resources: 'Moderate',
    description: 'A volatile volcanic planet with competing city-states.',
  },
];

// Color palette for new worlds (cycles through these)
const WORLD_COLORS = [
  '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1',
];

/**
 * Initialize worlds from localStorage, seeding defaults on first visit.
 */
function loadWorlds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[WorldManager] Failed to parse stored worlds:', e);
  }
  // First visit — seed with demo worlds and save
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_WORLDS));
  return [...SEED_WORLDS];
}

/**
 * Save worlds array to localStorage.
 */
function saveWorlds(worldsArray) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(worldsArray));
  } catch (e) {
    console.warn('[WorldManager] Failed to save worlds:', e);
  }
}

/**
 * Get all worlds.
 */
export function getWorlds() {
  return loadWorlds();
}

/**
 * Get a single world by ID.
 */
export function getWorldById(id) {
  return loadWorlds().find(w => w.id === id) || null;
}

/**
 * Create a new world from world-builder data and persist it.
 * Returns the newly created world object.
 */
export function createWorld(builderData) {
  const worlds = loadWorlds();
  const id = 'w' + Date.now();
  const colorIndex = worlds.length % WORLD_COLORS.length;

  const techToEpoch = {
    'Stone Age': 'Era I — Stone Age',
    'Bronze Age': 'Era II — Bronze Age',
    'Iron Age': 'Era II — Iron Age',
    'Medieval': 'Era III — Medieval Period',
    'Renaissance': 'Era IV — Renaissance',
    'Industrial': 'Era V — Industrial Age',
    'Modern': 'Era VI — Modern Age',
    'Space Age': 'Era VIII — Space Age',
  };

  const newWorld = {
    id,
    name: (builderData.name && builderData.name.trim()) ? builderData.name.trim() : `Genesis-${Math.floor(100 + Math.random() * 900)}`,
    description: builderData.description || 'Custom simulated world.',
    status: 'active',
    created: new Date().toISOString().split('T')[0],
    population: Number(builderData.population) || 10000,
    techLevel: builderData.techLevel || 'Stone Age',
    climate: builderData.climate || 'Temperate',
    gravity: Number(builderData.gravity) || 1.0,
    waterCoverage: Number(builderData.waterCoverage) || 50,
    economy: builderData.economy || 'Hunter-Gatherer',
    government: builderData.government || 'Tribal',
    atmosphere: builderData.atmosphere || 'Nitrogen-Oxygen',
    species: builderData.species || 'Humanoid',
    resources: builderData.resources || 'Moderate',
    seed: builderData.seed || Math.floor(Math.random() * 999999),
    color: WORLD_COLORS[colorIndex],
    simStatus: 'running',
    epoch: techToEpoch[builderData.techLevel] || 'Era I — Stone Age',
  };

  // Add new world to beginning so it appears first in recents
  worlds.unshift(newWorld);
  saveWorlds(worlds);

  // Set as the active world
  setActiveWorldId(id);

  return newWorld;
}

/**
 * Delete a world by ID.
 */
export function deleteWorld(id) {
  const worlds = loadWorlds().filter(w => w.id !== id);
  saveWorlds(worlds);
  if (getActiveWorldId() === id && worlds.length > 0) {
    setActiveWorldId(worlds[0].id);
  }
}

/**
 * Update a world by ID with partial data.
 */
export function updateWorld(id, partialData) {
  const worlds = loadWorlds();
  const idx = worlds.findIndex(w => w.id === id);
  if (idx !== -1) {
    worlds[idx] = { ...worlds[idx], ...partialData };
    saveWorlds(worlds);
    window.dispatchEvent(new CustomEvent('genesis:world-updated', { detail: { world: worlds[idx] } }));
    return worlds[idx];
  }
  return null;
}

/**
 * Set the active world ID (the one being viewed/simulated).
 */
export function setActiveWorldId(id) {
  localStorage.setItem(ACTIVE_WORLD_KEY, id);
  window.dispatchEvent(new CustomEvent('genesis:world-changed', { detail: { worldId: id } }));
}

/**
 * Get the active world ID.
 */
export function getActiveWorldId() {
  const id = localStorage.getItem(ACTIVE_WORLD_KEY);
  if (id) return id;
  const worlds = loadWorlds();
  if (worlds.length > 0) {
    const firstId = worlds[0].id;
    localStorage.setItem(ACTIVE_WORLD_KEY, firstId);
    return firstId;
  }
  return null;
}

/**
 * Get the active world object.
 */
export function getActiveWorld() {
  const id = getActiveWorldId();
  if (!id) return null;
  const found = getWorldById(id);
  if (found) return found;
  const worlds = loadWorlds();
  return worlds[0] || null;
}

/**
 * Reset all worlds back to the seed defaults (for testing).
 */
export function resetWorlds() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACTIVE_WORLD_KEY);
}
