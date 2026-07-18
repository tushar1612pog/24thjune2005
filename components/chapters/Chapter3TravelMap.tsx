"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import ChapterFooter from "@/components/shared/ChapterFooter";
import ParticleField from "@/components/shared/ParticleField";
import { destinations } from "@/lib/content";
import { CONTINENTS } from "@/lib/globeContinents";
import {
  clamp,
  easeInOutCubic,
  latLonToVec3,
  lerp,
  lerpAngle,
  rotate,
  rotationToFace,
  slerp,
  toRad,
  type Vec3,
} from "@/lib/globeMath";

// ── tunables — nothing here changes the math, just the feel ──────────────
const MIN_ZOOM = 0.78;
const MAX_ZOOM = 1.55;
const FOCUS_ZOOM = 1.22;
const START_ZOOM = 0.5;
const DRAG_SENSITIVITY = 0.0052;
const MAX_PHI = toRad(72);
const AUTOROTATE_SPEED = toRad(2.1); // radians / second, deliberately slow
const FRICTION = 0.945;
const HIT_RADIUS = 26; // px
const FLIGHT_DURATION = 1500; // ms, camera fly-to-marker
const ARRIVAL_PAUSE = 450; // ms, breath before the journal opens
const PATH_DRAW_DURATION = 1300; // ms, ink-spreading route line

const ZOOM_IN_DELAY = 2200; // ms — how long we let the globe just sit there
const ZOOM_IN_DURATION = 1900;
const READY_DELAY = 2500;

type FlightState = {
  fromLambda: number;
  fromPhi: number;
  toLambda: number;
  toPhi: number;
  start: number;
  targetId: string;
};

export default function Chapter3TravelMap({ onNext }: { onNext: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Mutable render state lives in refs, not React state — the draw loop
  // reads/writes these every frame without triggering re-renders.
  const rotationRef = useRef({ lambda: toRad(-25), phi: toRad(18) });
  const velocityRef = useRef({ vLambda: 0, vPhi: 0 });
  const zoomRef = useRef(START_ZOOM);
  const zoomTargetRef = useRef(START_ZOOM);
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);
  const flightRef = useRef<FlightState | null>(null);
  const arrivalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const segmentTimesRef = useRef<Record<string, number>>({});
  const visitedOrderRef = useRef<string[]>([]);
  const focusedIdRef = useRef<string | null>(null);
  const chimeCtxRef = useRef<AudioContext | null>(null);

  const [phase, setPhase] = useState<"intro" | "ready">("intro");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [visitedOrder, setVisitedOrder] = useState<string[]>([]);

  const focusedDestination = destinations.find((d) => d.id === focusedId) ?? null;
  const allVisited = visitedOrder.length === destinations.length;

  useEffect(() => {
    visitedOrderRef.current = visitedOrder;
  }, [visitedOrder]);
  useEffect(() => {
    focusedIdRef.current = focusedId;
  }, [focusedId]);

  // A new segment of the golden route appeared — remember when, so the
  // draw loop can animate it filling in like ink spreading across paper.
  useEffect(() => {
    if (visitedOrder.length < 2) return;
    const a = visitedOrder[visitedOrder.length - 2];
    const b = visitedOrder[visitedOrder.length - 1];
    segmentTimesRef.current[`${a}|${b}`] = performance.now();
  }, [visitedOrder.length]);

  // A tiny synthesized chime for the discovery moment — no audio asset
  // needed, just a couple of soft sine tones through the Web Audio API.
  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!chimeCtxRef.current) chimeCtxRef.current = new AudioCtx();
      const ctx = chimeCtxRef.current;
      const now = ctx.currentTime;
      [880, 1318.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const t0 = now + i * 0.09;
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(0.05, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 1);
      });
    } catch {
      // Web Audio unavailable — the visual arrival still lands fine without it.
    }
  }, []);

  const selectDestination = useCallback((id: string) => {
    const dest = destinations.find((d) => d.id === id);
    if (!dest) return;
    if (flightRef.current?.targetId === id) return; // already headed there
    if (arrivalTimeoutRef.current) clearTimeout(arrivalTimeoutRef.current);
    setFocusedId(null);

    const { lambda: toLambda, phi: toPhi } = rotationToFace(dest.lat, dest.lon);
    flightRef.current = {
      fromLambda: rotationRef.current.lambda,
      fromPhi: rotationRef.current.phi,
      toLambda,
      toPhi: clamp(toPhi, -MAX_PHI, MAX_PHI),
      start: performance.now(),
      targetId: id,
    };
    velocityRef.current = { vLambda: 0, vPhi: 0 };
    zoomTargetRef.current = FOCUS_ZOOM;
  }, []);

  // ── camera intro: sit still, then drift closer, then reveal the title ──
  useEffect(() => {
    let controls: { stop: () => void } | null = null;
    const t1 = setTimeout(() => {
      controls = animate(zoomTargetRef.current, 1, {
        duration: ZOOM_IN_DURATION / 1000,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => {
          zoomTargetRef.current = v;
        },
      });
    }, ZOOM_IN_DELAY);
    const t2 = setTimeout(() => setPhase("ready"), READY_DELAY);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      controls?.stop();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (arrivalTimeoutRef.current) clearTimeout(arrivalTimeoutRef.current);
      chimeCtxRef.current?.close().catch(() => {});
    };
  }, []);

  // ── the render loop: one canvas, one rAF, everything drawn by hand ──────
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    const project = (p: Vec3, cx: number, cy: number, R: number) => {
      const r = rotate(p, rotationRef.current.lambda, rotationRef.current.phi);
      return { x: cx + r.x * R, y: cy - r.y * R, z: r.z };
    };

    const drawFrame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const flight = flightRef.current;
      if (flight) {
        const t = clamp((now - flight.start) / FLIGHT_DURATION, 0, 1);
        const eased = easeInOutCubic(t);
        rotationRef.current.lambda = lerpAngle(flight.fromLambda, flight.toLambda, eased);
        rotationRef.current.phi = lerp(flight.fromPhi, flight.toPhi, eased);
        if (t >= 1) {
          flightRef.current = null;
          const id = flight.targetId;
          arrivalTimeoutRef.current = setTimeout(() => {
            setFocusedId(id);
            setVisitedOrder((prev) => (prev.includes(id) ? prev : [...prev, id]));
            playChime();
          }, ARRIVAL_PAUSE);
        }
      } else if (draggingRef.current) {
        // rotation is updated directly by the pointer-move handler
      } else if (Math.abs(velocityRef.current.vLambda) > 0.00005 || Math.abs(velocityRef.current.vPhi) > 0.00005) {
        rotationRef.current.lambda += velocityRef.current.vLambda;
        rotationRef.current.phi = clamp(rotationRef.current.phi + velocityRef.current.vPhi, -MAX_PHI, MAX_PHI);
        velocityRef.current.vLambda *= FRICTION;
        velocityRef.current.vPhi *= FRICTION;
      } else {
        rotationRef.current.lambda += AUTOROTATE_SPEED * dt;
      }

      zoomRef.current = lerp(zoomRef.current, zoomTargetRef.current, 0.08);

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.36 * zoomRef.current;

      ctx.clearRect(0, 0, w, h);

      // soft outer atmosphere
      const glow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.35);
      glow.addColorStop(0, "rgba(232,176,75,0.16)");
      glow.addColorStop(1, "rgba(232,176,75,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // globe base — muted blue-grey "ocean"
      const base = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      base.addColorStop(0, "#8B98A8");
      base.addColorStop(0.55, "#6D7C8F");
      base.addColorStop(1, "#48546A");
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // graticule — faint vintage cartography lines
      ctx.strokeStyle = "rgba(251,243,231,0.14)";
      ctx.lineWidth = 1;
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(latLonToVec3(lat, lon), cx, cy, R);
          if (p.z <= 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const p = project(latLonToVec3(lat, lon), cx, cy, R);
          if (p.z <= 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // continents — faded parchment
      ctx.fillStyle = "rgba(234,217,184,0.88)";
      ctx.strokeStyle = "rgba(201,162,39,0.35)";
      ctx.lineWidth = 1;
      CONTINENTS.forEach((poly) => {
        ctx.beginPath();
        let started = false;
        let visiblePoints = 0;
        poly.forEach(({ lat, lon }) => {
          const p = project(latLonToVec3(lat, lon), cx, cy, R);
          if (p.z <= -0.05) {
            started = false;
            return;
          }
          visiblePoints++;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        });
        if (visiblePoints >= 3) {
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      });

      // golden travel path — draws itself like ink spreading across paper
      ctx.strokeStyle = "#E8B04B";
      ctx.lineWidth = 1.6;
      ctx.shadowColor = "rgba(232,176,75,0.6)";
      ctx.shadowBlur = 4;
      for (let i = 0; i < visitedOrderRef.current.length - 1; i++) {
        const aId = visitedOrderRef.current[i];
        const bId = visitedOrderRef.current[i + 1];
        const a = destinations.find((d) => d.id === aId);
        const b = destinations.find((d) => d.id === bId);
        if (!a || !b) continue;
        const startedAt = segmentTimesRef.current[`${aId}|${bId}`] ?? now;
        const progress = easeInOutCubic(clamp((now - startedAt) / PATH_DRAW_DURATION, 0, 1));
        const va = latLonToVec3(a.lat, a.lon);
        const vb = latLonToVec3(b.lat, b.lon);
        const steps = 48;
        const limit = Math.round(steps * progress);
        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= limit; s++) {
          const p = project(slerp(va, vb, s / steps), cx, cy, R);
          if (p.z <= 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      ctx.restore(); // end clip to disc

      // limb shading for roundness
      const limb = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R);
      limb.addColorStop(0, "rgba(30,25,20,0)");
      limb.addColorStop(1, "rgba(30,25,20,0.35)");
      ctx.fillStyle = limb;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // markers — glowing brass-and-gold pins
      destinations.forEach((d) => {
        const p = project(latLonToVec3(d.lat, d.lon), cx, cy, R);
        if (p.z <= 0.04) return;
        const visited = visitedOrderRef.current.includes(d.id);
        const focused = focusedIdRef.current === d.id;
        const pulse = 0.7 + Math.sin(now / 650 + d.lat) * 0.3;
        const baseR = focused ? 7 : 4.4;
        const glowR = baseR * (2.4 + (focused ? pulse * 1.4 : pulse * 0.6));

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        g.addColorStop(0, visited ? "rgba(232,176,75,0.85)" : "rgba(232,176,75,0.55)");
        g.addColorStop(1, "rgba(232,176,75,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = visited ? "#FBF3E7" : "#F4C7B6";
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR * (0.55 + pulse * 0.15), 0, Math.PI * 2);
        ctx.fill();
      });

      // background parallax — layers drift opposite the globe's rotation
      const dLambda = rotationRef.current.lambda - toRad(-25);
      const dPhi = rotationRef.current.phi - toRad(18);
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const factor = (i + 1) * 3.2;
        el.style.transform = `translate3d(${-dLambda * factor}px, ${dPhi * factor}px, 0)`;
      });

      raf = requestAnimationFrame(drawFrame);
    };

    raf = requestAnimationFrame(drawFrame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── pointer interaction: drag to rotate, pinch/wheel to zoom, tap a marker ──
  const getRelPos = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handleTap = useCallback(
    (pos: { x: number; y: number }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.36 * zoomRef.current;

      let bestId: string | null = null;
      let bestDist = HIT_RADIUS;
      destinations.forEach((d) => {
        const r = rotate(latLonToVec3(d.lat, d.lon), rotationRef.current.lambda, rotationRef.current.phi);
        if (r.z <= 0.04) return;
        const sx = cx + r.x * R;
        const sy = cy - r.y * R;
        const dist = Math.hypot(pos.x - sx, pos.y - sy);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = d.id;
        }
      });
      if (bestId) selectDestination(bestId);
    },
    [selectDestination]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "ready") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pos = getRelPos(e.clientX, e.clientY);
    pointersRef.current.set(e.pointerId, pos);
    flightRef.current = null; // a touch interrupts any camera flight in progress

    if (pointersRef.current.size === 1) {
      draggingRef.current = true;
      dragMovedRef.current = false;
      velocityRef.current = { vLambda: 0, vPhi: 0 };
      lastPointerRef.current = pos;
    } else if (pointersRef.current.size === 2) {
      draggingRef.current = false;
      const pts = Array.from(pointersRef.current.values());
      pinchRef.current = {
        startDist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        startZoom: zoomTargetRef.current,
      };
    }
  }, [phase, getRelPos]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    const pos = getRelPos(e.clientX, e.clientY);
    pointersRef.current.set(e.pointerId, pos);

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const ratio = dist / (pinchRef.current.startDist || 1);
      zoomTargetRef.current = clamp(pinchRef.current.startZoom * ratio, MIN_ZOOM, MAX_ZOOM);
      return;
    }

    if (draggingRef.current) {
      const dx = pos.x - lastPointerRef.current.x;
      const dy = pos.y - lastPointerRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) dragMovedRef.current = true;
      rotationRef.current.lambda += dx * DRAG_SENSITIVITY;
      rotationRef.current.phi = clamp(rotationRef.current.phi - dy * DRAG_SENSITIVITY, -MAX_PHI, MAX_PHI);
      velocityRef.current.vLambda = dx * DRAG_SENSITIVITY;
      velocityRef.current.vPhi = -dy * DRAG_SENSITIVITY;
      lastPointerRef.current = pos;
    }
  }, [getRelPos]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const wasSingleDrag = draggingRef.current && pointersRef.current.size === 1;
    const pos = pointersRef.current.get(e.pointerId) ?? getRelPos(e.clientX, e.clientY);
    pointersRef.current.delete(e.pointerId);
    pinchRef.current = null;

    if (pointersRef.current.size === 0) {
      draggingRef.current = false;
      if (wasSingleDrag && !dragMovedRef.current) handleTap(pos);
    } else if (pointersRef.current.size === 1) {
      draggingRef.current = true;
      dragMovedRef.current = false;
      velocityRef.current = { vLambda: 0, vPhi: 0 };
      lastPointerRef.current = Array.from(pointersRef.current.values())[0];
    }
  }, [getRelPos, handleTap]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    if (phase !== "ready") return;
    e.preventDefault();
    zoomTargetRef.current = clamp(zoomTargetRef.current - e.deltaY * 0.0012, MIN_ZOOM, MAX_ZOOM);
  }, [phase]);

  // deterministic "random" star field — no hydration mismatch
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: (i * 17.3) % 100,
        top: (i * 29.7 + i * 3) % 100,
        size: 1 + (i % 3),
        delay: (i % 10) * 0.3,
      })),
    []
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-plum px-6 py-16">
      {/* atmospheric background — five independent layers, each drifting
          a little against the globe's rotation to create depth */}
      <div ref={(el) => { layerRefs.current[0] = el; }} className="pointer-events-none absolute inset-0">
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-vanilla animate-flicker"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: 0.5, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>
      <div ref={(el) => { layerRefs.current[1] = el; }} className="pointer-events-none absolute inset-0">
        <ParticleField count={14} color="#F4C7B6" />
      </div>
      <div ref={(el) => { layerRefs.current[2] = el; }} className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-56 w-56 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      </div>
      <div ref={(el) => { layerRefs.current[3] = el; }} className="pointer-events-none absolute inset-0">
        <ParticleField count={10} color="#E8B04B" />
      </div>
      <div ref={(el) => { layerRefs.current[4] = el; }} className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/2 h-40 w-72 rounded-full bg-vanilla/5 blur-3xl animate-drift" />
      </div>

      <p className="relative z-10 mb-2 mt-4 font-body text-xs uppercase tracking-[0.3em] text-gold">
        Chapter Three
      </p>

      <AnimatePresence>
        {phase === "ready" && (
          <motion.h2
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mb-2 text-center font-display text-3xl text-vanilla md:text-5xl"
          >
            The World Through Your Eyes
          </motion.h2>
        )}
      </AnimatePresence>

      <motion.div
        ref={wrapperRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="relative z-10 h-[380px] w-full max-w-xl md:h-[480px]"
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none"
          style={{ cursor: phase === "ready" ? "grab" : "default" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        />
      </motion.div>

      <AnimatePresence>
        {focusedDestination && (
          <motion.div
            key={focusedDestination.id}
            initial={{ opacity: 0, y: 36, scaleY: 0.6 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 20, scaleY: 0.85 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top center" }}
            className="absolute bottom-24 left-1/2 z-20 w-[90%] max-w-sm -translate-x-1/2 rounded-2xl border border-gold/30 bg-vanilla px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            <div aria-hidden="true" className="pointer-events-none absolute -top-3 left-6 text-2xl">
              🌸
            </div>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-coral/70">
              {String(visitedOrder.indexOf(focusedDestination.id) + 1).padStart(2, "0")} — discovered
            </p>
            <p className="mt-2 font-display text-lg italic text-plum">{focusedDestination.name}</p>
            <p className="mt-2 font-body text-sm leading-relaxed text-plum/70">{focusedDestination.reason}</p>
            <button
              onClick={() => setFocusedId(null)}
              className="mt-4 font-body text-xs uppercase tracking-widest text-plum/40 transition-colors hover:text-plum/70"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "ready" && !focusedDestination && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative z-10 mt-3 font-body text-xs text-vanilla/40"
        >
          {visitedOrder.length === 0
            ? "Turn the globe. A light will find you."
            : "Keep exploring — more of the world is waiting."}
        </motion.p>
      )}

      <ChapterFooter
        onNext={onNext}
        disabled={!allVisited}
        label="Continue to Chapter Four"
        hint="Every place carries a story."
        variant="dark"
      />
    </div>
  );
}
