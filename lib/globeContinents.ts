// Deliberately simplified continent silhouettes — a handful of hand-placed
// lat/lon points each, not a survey-grade GeoJSON dataset. That's on purpose:
// this globe is a vintage, faded-parchment illustration, not a navigation
// tool, so a soft approximate blob reads better than crisp real coastlines.

export type LatLon = { lat: number; lon: number };

export const CONTINENTS: LatLon[][] = [
  // Africa
  [
    { lat: 37, lon: 10 }, { lat: 32, lon: 32 }, { lat: 15, lon: 50 },
    { lat: -5, lon: 42 }, { lat: -20, lon: 35 }, { lat: -34, lon: 20 },
    { lat: -30, lon: 15 }, { lat: -20, lon: 12 }, { lat: -5, lon: 9 },
    { lat: 5, lon: -6 }, { lat: 15, lon: -17 }, { lat: 25, lon: -15 },
    { lat: 33, lon: -8 }, { lat: 37, lon: 10 },
  ],
  // Eurasia (Europe + Asia, merged into one broad landmass)
  [
    { lat: 71, lon: 25 }, { lat: 60, lon: 60 }, { lat: 55, lon: 90 },
    { lat: 45, lon: 135 }, { lat: 35, lon: 140 }, { lat: 20, lon: 110 },
    { lat: 10, lon: 105 }, { lat: 5, lon: 80 }, { lat: 8, lon: 50 },
    { lat: 15, lon: 45 }, { lat: 30, lon: 35 }, { lat: 36, lon: 27 },
    { lat: 45, lon: 15 }, { lat: 60, lon: 5 }, { lat: 71, lon: 25 },
  ],
  // North America
  [
    { lat: 70, lon: -160 }, { lat: 70, lon: -90 }, { lat: 60, lon: -70 },
    { lat: 45, lon: -60 }, { lat: 30, lon: -80 }, { lat: 18, lon: -97 },
    { lat: 15, lon: -95 }, { lat: 25, lon: -110 }, { lat: 48, lon: -124 },
    { lat: 60, lon: -140 }, { lat: 70, lon: -160 },
  ],
  // South America
  [
    { lat: 12, lon: -72 }, { lat: 5, lon: -77 }, { lat: -5, lon: -81 },
    { lat: -18, lon: -70 }, { lat: -33, lon: -72 }, { lat: -55, lon: -68 },
    { lat: -40, lon: -62 }, { lat: -23, lon: -43 }, { lat: -5, lon: -35 },
    { lat: 5, lon: -52 }, { lat: 12, lon: -72 },
  ],
  // Australia
  [
    { lat: -12, lon: 130 }, { lat: -12, lon: 142 }, { lat: -20, lon: 150 },
    { lat: -30, lon: 153 }, { lat: -38, lon: 147 }, { lat: -35, lon: 138 },
    { lat: -32, lon: 115 }, { lat: -20, lon: 113 }, { lat: -12, lon: 130 },
  ],
];
