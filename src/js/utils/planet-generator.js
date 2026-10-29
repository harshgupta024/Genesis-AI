/* ============================================================
   GENESIS AI — High-Fidelity Procedural Planetary Generator
   Generates elevation, moisture, dynamic city networks,
   photorealistic terrain biomes, and cloud systems.
   ============================================================ */

// Fast 3D Simplex-like Perlin noise implementation for seamless spherical sampling
class SphericalNoise {
  constructor(seed = 12345) {
    this.p = new Uint8Array(512);
    const permutation = new Uint8Array(256);
    for (let i = 0; i < 256; i++) permutation[i] = i;

    // Deterministic shuffle with seed
    let s = (Math.abs(Math.round(seed)) % 2147483647) || 48291;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      const tmp = permutation[i];
      permutation[i] = permutation[j];
      permutation[j] = tmp;
    }

    for (let i = 0; i < 512; i++) {
      this.p[i] = permutation[i & 255];
    }
  }

  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(t, a, b) { return a + t * (b - a); }
  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise3D(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z;

    return this.lerp(w,
      this.lerp(v,
        this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)),
        this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))
      ),
      this.lerp(v,
        this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)),
        this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))
      )
    );
  }

  // Multi-octave fractal Brownian motion sampled on sphere
  fbm(x, y, z, octaves = 6, lacunarity = 2.0, persistence = 0.5) {
    let total = 0;
    let frequency = 1.0;
    let amplitude = 1.0;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return (total / maxValue + 1) * 0.5; // Normalized to [0, 1]
  }

  // Domain warped noise for realistic organic continental geology
  warpedFbm(x, y, z) {
    const qx = this.fbm(x, y, z, 3, 2.0, 0.5);
    const qy = this.fbm(x + 5.2, y + 1.3, z + 2.8, 3, 2.0, 0.5);
    const qz = this.fbm(x - 3.4, y + 8.1, z - 1.6, 3, 2.0, 0.5);

    const rx = this.fbm(x + qx * 0.4 + 1.7, y + qy * 0.4 + 9.2, z + qz * 0.4 + 0.5, 3, 2.0, 0.5);
    const ry = this.fbm(x + qx * 0.4 + 8.3, y + qy * 0.4 + 2.8, z + qz * 0.4 + 5.1, 3, 2.0, 0.5);
    const rz = this.fbm(x + qx * 0.4 + 3.1, y + qy * 0.4 + 4.6, z + qz * 0.4 + 7.4, 3, 2.0, 0.5);

    return this.fbm(x + rx * 0.35, y + ry * 0.35, z + rz * 0.35, 6, 2.05, 0.52);
  }
}

/**
 * Generate photorealistic planetary surface, elevation data, city networks, and clouds.
 * Produces:
 * - elevationCanvas (R: Elevation, G: Moisture/Vegetation, B: Urban density suitability)
 * - surfaceCanvas (Rich photorealistic biome texture)
 * - lightsCanvas (City lights and transport network)
 * - cloudCanvas (Dynamic atmospheric swirling clouds)
 */
export function generatePlanetTextures(world) {
  const seed = Number(world.seed) || 58492;
  const noise = new SphericalNoise(seed);
  const detailNoise = new SphericalNoise(seed + 8391);
  const climate = world.climate || 'Oceanic';
  const waterCoverage = (Number(world.waterCoverage) || 65) / 100;

  const width = 1536;
  const height = 768;

  // 1. Elevation & Biome Data Canvas
  // R = Elevation (0-255)
  // G = Moisture / Vegetation potential (0-255)
  // B = Urban settlement suitability (0-255)
  const elevCanvas = document.createElement('canvas');
  elevCanvas.width = width;
  elevCanvas.height = height;
  const eCtx = elevCanvas.getContext('2d');
  const eImg = eCtx.createImageData(width, height);
  const eData = eImg.data;

  // 2. Base Surface Biome Texture Canvas
  const surfaceCanvas = document.createElement('canvas');
  surfaceCanvas.width = width;
  surfaceCanvas.height = height;
  const sCtx = surfaceCanvas.getContext('2d');
  const sImg = sCtx.createImageData(width, height);
  const sData = sImg.data;

  // 3. City Lights Canvas (Night Side & daytime urban footprint)
  const lightsCanvas = document.createElement('canvas');
  lightsCanvas.width = width;
  lightsCanvas.height = height;
  const lCtx = lightsCanvas.getContext('2d');
  const lImg = lCtx.createImageData(width, height);
  const lData = lImg.data;

  // Baseline sea level derived from waterCoverage
  const seaLevel = 0.28 + waterCoverage * 0.44;

  // Biome palettes tailored to planetary climate
  const palettes = {
    Oceanic: {
      deepOcean: [6, 24, 58],
      midOcean: [12, 54, 108],
      shallowOcean: [24, 142, 162],
      coastalReef: [42, 178, 185],
      beach: [218, 202, 156],
      lowlands: [38, 122, 68],
      forest: [22, 88, 48],
      hills: [62, 128, 85],
      mountains: [88, 102, 98],
      peaks: [235, 248, 255],
      polar: [230, 246, 255],
    },
    Temperate: {
      deepOcean: [8, 28, 56],
      midOcean: [16, 62, 105],
      shallowOcean: [32, 125, 152],
      coastalReef: [48, 165, 172],
      beach: [205, 188, 138],
      lowlands: [48, 115, 45],
      forest: [28, 82, 34],
      hills: [92, 122, 62],
      mountains: [102, 98, 88],
      peaks: [242, 246, 252],
      polar: [238, 244, 252],
    },
    Tropical: {
      deepOcean: [8, 30, 62],
      midOcean: [16, 75, 120],
      shallowOcean: [30, 168, 175],
      coastalReef: [55, 195, 190],
      beach: [235, 215, 152],
      lowlands: [28, 138, 52],
      forest: [18, 98, 36],
      hills: [58, 148, 72],
      mountains: [105, 110, 95],
      peaks: [238, 248, 252],
      polar: [232, 242, 250],
    },
    Arid: {
      deepOcean: [16, 34, 52],
      midOcean: [28, 58, 82],
      shallowOcean: [48, 108, 122],
      coastalReef: [65, 135, 140],
      beach: [215, 172, 110],
      lowlands: [195, 135, 75],
      forest: [155, 110, 58],
      hills: [175, 105, 58],
      mountains: [135, 82, 52],
      peaks: [215, 198, 188],
      polar: [222, 226, 232],
    },
    Desert: {
      deepOcean: [18, 32, 48],
      midOcean: [30, 52, 72],
      shallowOcean: [52, 96, 112],
      coastalReef: [70, 125, 132],
      beach: [230, 188, 118],
      lowlands: [218, 162, 92],
      forest: [182, 138, 76],
      hills: [192, 128, 66],
      mountains: [152, 92, 55],
      peaks: [232, 208, 185],
      polar: [226, 222, 218],
    },
    Arctic: {
      deepOcean: [14, 34, 62],
      midOcean: [28, 62, 98],
      shallowOcean: [65, 132, 168],
      coastalReef: [85, 155, 185],
      beach: [205, 215, 225],
      lowlands: [175, 198, 210],
      forest: [92, 125, 135],
      hills: [182, 198, 215],
      mountains: [198, 212, 228],
      peaks: [252, 254, 255],
      polar: [248, 252, 255],
    },
    Volcanic: {
      deepOcean: [18, 12, 14],
      midOcean: [32, 16, 18],
      shallowOcean: [72, 26, 28],
      coastalReef: [95, 34, 32],
      beach: [46, 38, 38],
      lowlands: [58, 42, 40],
      forest: [45, 32, 32],
      hills: [92, 38, 32],
      mountains: [82, 48, 42],
      peaks: [235, 75, 28],
      polar: [168, 158, 162],
    },
  };

  const pal = palettes[climate] || palettes['Oceanic'];

  for (let y = 0; y < height; y++) {
    const latFactor = (y / (height - 1)) * 2 - 1; // -1 (North) to +1 (South)
    const absLat = Math.abs(latFactor);
    const phi = (y / height - 0.5) * Math.PI;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const lambda = (x / width) * Math.PI * 2;

      // Unit sphere coordinates
      const sx = cosPhi * Math.cos(lambda);
      const sy = sinPhi;
      const sz = cosPhi * Math.sin(lambda);

      // Elevation via domain-warped FBM noise [0.0, 1.0]
      const n = noise.warpedFbm(sx * 1.5, sy * 1.5, sz * 1.5);
      const detail = detailNoise.fbm(sx * 6.0, sy * 6.0, sz * 6.0, 4, 2.05, 0.48);

      // Moisture / vegetation potential [0.0, 1.0]
      const rawMoisture = detailNoise.fbm(sx * 2.2 + 4.1, sy * 2.2 + 1.7, sz * 2.2 + 8.2, 4, 2.0, 0.5);
      const latMoisture = (1.0 - Math.pow(absLat, 1.6)) * 0.35;
      const moisture = Math.max(0.0, Math.min(1.0, rawMoisture * 0.75 + latMoisture));

      // Urban settlement suitability [0.0, 1.0]:
      // Highest in temperate latitudes, near coasts, on flat lowlands
      let urbanSuitability = 0.0;
      if (absLat < 0.65 && n > seaLevel && n < seaLevel + 0.30) {
        const cityNoise = detailNoise.noise3D(sx * 16.0, sy * 16.0, sz * 16.0);
        const roadNoise = noise.noise3D(sx * 32.0, sy * 32.0, sz * 32.0);
        const coastalBonus = (1.0 - Math.min(1.0, (n - seaLevel) / 0.15)) * 0.35;

        const val = (cityNoise + 1) * 0.5 * 0.6 + coastalBonus + (Math.abs(roadNoise) < 0.08 ? 0.25 : 0.0);
        urbanSuitability = Math.max(0.0, Math.min(1.0, val));
      }

      // Write Data Map (R: Elevation, G: Moisture, B: Urban Suitability)
      eData[idx] = Math.round(n * 255);
      eData[idx + 1] = Math.round(moisture * 255);
      eData[idx + 2] = Math.round(urbanSuitability * 255);
      eData[idx + 3] = 255;

      // Base surface palette pixel calculation
      const polarThreshold = climate === 'Arctic' ? 0.42 : climate === 'Tropical' ? 0.90 : 0.72;
      const isPolar = absLat > polarThreshold + (detail - 0.5) * 0.07;

      let r = 0, g = 0, b = 0;

      if (isPolar && climate !== 'Volcanic') {
        const iceGrad = Math.min(1.0, (absLat - polarThreshold) / (1 - polarThreshold));
        r = pal.polar[0] + Math.round(iceGrad * 8);
        g = pal.polar[1] + Math.round(iceGrad * 8);
        b = pal.polar[2] + Math.round(iceGrad * 5);
      } else if (n < seaLevel) {
        const depth = (seaLevel - n) / seaLevel;
        if (depth < 0.03) {
          const t = depth / 0.03;
          r = Math.round(pal.coastalReef[0] * (1 - t) + pal.shallowOcean[0] * t);
          g = Math.round(pal.coastalReef[1] * (1 - t) + pal.shallowOcean[1] * t);
          b = Math.round(pal.coastalReef[2] * (1 - t) + pal.shallowOcean[2] * t);
        } else if (depth < 0.12) {
          const t = (depth - 0.03) / (0.12 - 0.03);
          r = Math.round(pal.shallowOcean[0] * (1 - t) + pal.midOcean[0] * t);
          g = Math.round(pal.shallowOcean[1] * (1 - t) + pal.midOcean[1] * t);
          b = Math.round(pal.shallowOcean[2] * (1 - t) + pal.midOcean[2] * t);
        } else if (depth < 0.45) {
          const t = (depth - 0.12) / (0.45 - 0.12);
          r = Math.round(pal.midOcean[0] * (1 - t) + pal.deepOcean[0] * t);
          g = Math.round(pal.midOcean[1] * (1 - t) + pal.deepOcean[1] * t);
          b = Math.round(pal.midOcean[2] * (1 - t) + pal.deepOcean[2] * t);
        } else {
          r = pal.deepOcean[0];
          g = pal.deepOcean[1];
          b = pal.deepOcean[2];
        }
      } else {
        const elevation = (n - seaLevel) / (1 - seaLevel);
        if (elevation < 0.03) {
          r = pal.beach[0]; g = pal.beach[1]; b = pal.beach[2];
        } else if (elevation < 0.28) {
          const t = elevation / 0.28;
          r = Math.round(pal.lowlands[0] * (1 - t) + pal.forest[0] * t);
          g = Math.round(pal.lowlands[1] * (1 - t) + pal.forest[1] * t);
          b = Math.round(pal.lowlands[2] * (1 - t) + pal.forest[2] * t);
        } else if (elevation < 0.60) {
          const t = (elevation - 0.28) / (0.60 - 0.28);
          r = Math.round(pal.forest[0] * (1 - t) + pal.hills[0] * t);
          g = Math.round(pal.forest[1] * (1 - t) + pal.hills[1] * t);
          b = Math.round(pal.forest[2] * (1 - t) + pal.hills[2] * t);
        } else if (elevation < 0.82) {
          const t = (elevation - 0.60) / (0.82 - 0.60);
          r = Math.round(pal.hills[0] * (1 - t) + pal.mountains[0] * t);
          g = Math.round(pal.hills[1] * (1 - t) + pal.mountains[1] * t);
          b = Math.round(pal.hills[2] * (1 - t) + pal.mountains[2] * t);
        } else {
          r = pal.peaks[0]; g = pal.peaks[1]; b = pal.peaks[2];
        }

        const micro = (detail - 0.5) * 20;
        r = Math.max(0, Math.min(255, r + Math.round(micro)));
        g = Math.max(0, Math.min(255, g + Math.round(micro)));
        b = Math.max(0, Math.min(255, b + Math.round(micro)));
      }

      sData[idx] = r;
      sData[idx + 1] = g;
      sData[idx + 2] = b;
      sData[idx + 3] = 255;

      // City light texture pixels (glowing metropolitan cores)
      if (urbanSuitability > 0.45) {
        const isCore = urbanSuitability > 0.75;
        lData[idx] = 255;
        lData[idx + 1] = isCore ? 245 : Math.round(180 + detail * 60);
        lData[idx + 2] = isCore ? 220 : Math.round(90 + detail * 80);
        lData[idx + 3] = Math.round(urbanSuitability * 255);
      } else {
        lData[idx] = 0;
        lData[idx + 1] = 0;
        lData[idx + 2] = 0;
        lData[idx + 3] = 0;
      }
    }
  }

  eCtx.putImageData(eImg, 0, 0);
  sCtx.putImageData(sImg, 0, 0);
  lCtx.putImageData(lImg, 0, 0);

  // 4. Atmospheric Cloud Texture Canvas
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = width;
  cloudCanvas.height = height;
  const cCtx = cloudCanvas.getContext('2d');
  const cImg = cCtx.createImageData(width, height);
  const cData = cImg.data;

  const cloudNoise = new SphericalNoise(seed + 6271);

  for (let y = 0; y < height; y++) {
    const latFactor = (y / (height - 1)) * 2 - 1;
    const absLat = Math.abs(latFactor);
    const phi = (y / height - 0.5) * Math.PI;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    const windOffset = Math.sin(latFactor * Math.PI * 3.5) * 0.5;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const lambda = (x / width) * Math.PI * 2 + windOffset;

      const sx = cosPhi * Math.cos(lambda);
      const sy = sinPhi;
      const sz = cosPhi * Math.sin(lambda);

      const cn = cloudNoise.fbm(sx * 2.5, sy * 2.5, sz * 2.5, 5, 2.1, 0.48);
      const band = Math.sin(absLat * Math.PI * 3.2) * 0.12;
      const cloudVal = cn + band;

      if (cloudVal > 0.50) {
        const density = Math.min(1.0, (cloudVal - 0.50) * 3.4);
        const alpha = Math.round(density * 225);
        cData[idx] = 250;
        cData[idx + 1] = 252;
        cData[idx + 2] = 255;
        cData[idx + 3] = alpha;
      } else {
        cData[idx] = 0;
        cData[idx + 1] = 0;
        cData[idx + 2] = 0;
        cData[idx + 3] = 0;
      }
    }
  }

  cCtx.putImageData(cImg, 0, 0);

  return {
    elevCanvas,
    surfaceCanvas,
    lightsCanvas,
    cloudCanvas,
    seaLevelBaseline: seaLevel,
  };
}
