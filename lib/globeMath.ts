// Small, dependency-free math for rendering a rotating globe on a 2D canvas
// using an orthographic projection. No WebGL / three.js involved, so there's
// nothing to fall back from if a device can't do 3D — it just always works.

export type Vec3 = { x: number; y: number; z: number };

export const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Unit-sphere position for a given latitude/longitude, in degrees. */
export function latLonToVec3(lat: number, lon: number): Vec3 {
  const la = toRad(lat);
  const lo = toRad(lon);
  return {
    x: Math.cos(la) * Math.sin(lo),
    y: Math.sin(la),
    z: Math.cos(la) * Math.cos(lo),
  };
}

/**
 * Rotates a unit-sphere point by yaw (lambda, around Y) then pitch (phi,
 * around X), and returns the rotated point. z > 0 means "facing the camera".
 */
export function rotate(p: Vec3, lambda: number, phi: number): Vec3 {
  const x1 = p.x * Math.cos(lambda) + p.z * Math.sin(lambda);
  const z1 = -p.x * Math.sin(lambda) + p.z * Math.cos(lambda);
  const y1 = p.y;

  const y2 = y1 * Math.cos(phi) - z1 * Math.sin(phi);
  const z2 = y1 * Math.sin(phi) + z1 * Math.cos(phi);
  const x2 = x1;

  return { x: x2, y: y2, z: z2 };
}

/** The yaw/pitch that brings a given lat/lon to face the camera dead-on. */
export function rotationToFace(lat: number, lon: number) {
  return { lambda: -toRad(lon), phi: toRad(lat) };
}

/** Spherical linear interpolation between two unit vectors. */
export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  const theta = Math.acos(dot);
  if (theta < 1e-6) return a;
  const sinTheta = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / sinTheta;
  const wb = Math.sin(t * theta) / sinTheta;
  return {
    x: a.x * wa + b.x * wb,
    y: a.y * wa + b.y * wb,
    z: a.z * wa + b.z * wb,
  };
}

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Smooth, no-bounce easing — used for the camera "fly to a marker" tween.
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Shortest angular distance for lerping angles across the +-PI seam. */
export function lerpAngle(a: number, b: number, t: number) {
  let diff = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}
