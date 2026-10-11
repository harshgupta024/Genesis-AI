/* ============================================================
   GENESIS AI — Data Service
   Fetches real dataset JSON from public/data/ and caches it.
   Falls back gracefully to null if data is unavailable.
   ============================================================ */

const cache = {};

async function fetchJSON(filename) {
  if (cache[filename]) return cache[filename];
  try {
    const resp = await fetch(`/data/${filename}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    cache[filename] = data;
    return data;
  } catch (e) {
    console.warn(`[DataService] Could not load ${filename}:`, e.message);
    return null;
  }
}

export async function getClimateData()    { return fetchJSON('climate.json'); }
export async function getPopulationData() { return fetchJSON('population.json'); }
export async function getEconomyData()    { return fetchJSON('economy.json'); }
export async function getHealthData()     { return fetchJSON('health.json'); }
export async function getTerrainData()    { return fetchJSON('terrain.json'); }
export async function getDatasetRegistry(){ return fetchJSON('dataset_registry.json'); }

/**
 * Load all datasets at once. Returns an object keyed by dataset name.
 */
export async function loadAllData() {
  const [climate, population, economy, health, terrain, registry] = await Promise.all([
    getClimateData(),
    getPopulationData(),
    getEconomyData(),
    getHealthData(),
    getTerrainData(),
    getDatasetRegistry(),
  ]);
  return { climate, population, economy, health, terrain, registry };
}

/**
 * Format large numbers for display (e.g. 1234567 -> "1.23M")
 */
export function formatNumber(num) {
  if (num == null) return 'N/A';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9)  return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6)  return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3)  return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
}

/**
 * State holding the real dataset metadata for the UI.
 */
export let loadedDatasets = [];

/**
 * Load the real dataset registry from public/data/ and store it.
 * Called once at app init.
 */
export async function loadRealDatasets() {
  try {
    const registry = await getDatasetRegistry();
    if (registry && registry.length > 0) {
      loadedDatasets = registry.map(d => ({
        name: d.name,
        size: d.size,
        records: d.records,
        type: d.type,
        source: d.source,
        status: d.status,
        columns: d.columns,
        columnNames: d.column_names,
        category: d.category,
        updated: new Date(d.updated * 1000).toLocaleDateString(),
      }));
    }
  } catch (e) {
    console.warn('[DataService] Could not load real dataset registry.');
  }
}
