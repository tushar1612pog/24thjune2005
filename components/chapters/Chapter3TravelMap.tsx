"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChapterFooter from "@/components/shared/ChapterFooter";
import { destinations } from "@/lib/content";

const cardPositions = [
  "left-[8%] top-[45%] md:left-[13%] md:top-[34%]",
  "left-[8%] top-[19%] md:left-[14%] md:top-[19%]",
  "right-[7%] top-[18%] md:right-[12%] md:top-[20%]",
];

function playPaperSound(isNewLocation: boolean) {
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(isNewLocation ? 420 : 300, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      isNewLocation ? 680 : 430,
      context.currentTime + 0.14,
    );
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.025, context.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.24);
    oscillator.onended = () => context.close();
  } catch {
  }
}

export default function Chapter3TravelMap({ onNext }: { onNext: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      setPointer({
        x: (event.clientX / window.innerWidth - 0.5) * 10,
        y: (event.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const activeIndex = destinations.findIndex((destination) => destination.id === active);
  const activeDestination = activeIndex >= 0 ? destinations[activeIndex] : null;
  const allVisited = visited.size === destinations.length;

  const openPin = (id: string) => {
    const isNewLocation = !visited.has(id);
    setActive(id);
    setVisited((previous) => new Set(previous).add(id));
    playPaperSound(isNewLocation);
  };

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden px-5 py-20 md:px-10">
      <motion.div
        aria-hidden="true"
        animate={{
          scale: activeDestination ? 1.08 : 1.035,
          x: pointer.x - (activeDestination ? activeDestination.x - 50 : 0) * 0.18,
          y: pointer.y - (activeDestination ? activeDestination.y - 50 : 0) * 0.12,
        }}
        transition={{ type: "spring", stiffness: 18, damping: 18, mass: 1.4 }}
        className="absolute -inset-10 bg-[url('/assets/maps/vintage-world-map.png')] bg-cover bg-center opacity-75 blur-[1.5px]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,243,231,0.12),rgba(74,59,82,0.38))]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,245,213,0.2),transparent_38%,rgba(126,91,56,0.12))]" />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.08, 0.16, 0.08], x: [-12, 12, -12] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 top-0 h-full w-1/2 bg-[linear-gradient(105deg,transparent,rgba(255,244,204,0.6),transparent)] blur-3xl"
      />

      <div className="relative z-10 h-[min(68vh,580px)] w-full max-w-6xl">
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 text-center">
          <p className="mb-2 font-body text-[10px] uppercase tracking-[0.32em] text-plum/65 md:text-xs">Chapter Three</p>
          <h2 className="font-display text-3xl text-plum drop-shadow-[0_2px_10px_rgba(255,255,255,0.6)] md:text-5xl">The Places That Shaped You</h2>
          <p className="mx-auto mt-2 max-w-sm font-body text-xs text-plum/65 md:text-sm">A few corners of the world, and all the stories they hold.</p>
        </header>

        <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          {destinations.slice(0, -1).map((destination, index) => {
            const next = destinations[index + 1];
            const visible = visited.has(destination.id) && visited.has(next.id);
            return <motion.line key={destination.id} x1={destination.x} y1={destination.y} x2={next.x} y2={next.y} stroke="#B98732" strokeWidth="0.45" strokeLinecap="round" strokeDasharray="1.2 2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 0.9 : 0 }} transition={{ duration: 1.35, ease: "easeInOut" }} />;
          })}
        </svg>

        {destinations.map((destination, index) => {
          const isActive = active === destination.id;
          const isVisited = visited.has(destination.id);
          return (
            <motion.button key={destination.id} type="button" onClick={() => openPin(destination.id)} aria-label={`Open journal entry: ${destination.name}`} aria-pressed={isActive} style={{ left: `${destination.x}%`, top: `${destination.y}%` }} animate={{ scale: isActive ? 1.18 : 1, y: [0, -3, 0] }} transition={{ y: { duration: 3.8 + index, repeat: Infinity, ease: "easeInOut" } }} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-vanilla">
              <span className="relative block h-4 w-4 rotate-45 rounded-[4px] border border-[#8b5d1e] bg-gold shadow-[0_0_0_4px_rgba(232,176,75,0.18),0_3px_8px_rgba(74,59,82,0.32)] transition group-hover:scale-125 group-hover:shadow-[0_0_0_7px_rgba(232,176,75,0.25),0_3px_12px_rgba(74,59,82,0.35)]"><span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-vanilla/90" /></span>
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 w-max -translate-x-1/2 font-body text-[10px] uppercase tracking-[0.16em] text-plum/70 opacity-0 transition group-hover:opacity-100">{isVisited ? "Revisit" : "Discover"}</span>
            </motion.button>
          );
        })}

        <AnimatePresence mode="wait">
          {activeDestination && <motion.article key={activeDestination.id} initial={{ opacity: 0, rotateX: -12, scale: 0.92, y: 18 }} animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }} exit={{ opacity: 0, rotateX: 8, scale: 0.96, y: 10 }} transition={{ type: "spring", stiffness: 150, damping: 18 }} className={`absolute z-20 w-[min(18rem,76vw)] rounded-[1.35rem] border border-[#a9773c]/30 bg-[#fff8e9]/90 p-5 shadow-[0_18px_45px_rgba(74,59,82,0.27),inset_0_0_28px_rgba(197,150,83,0.13)] backdrop-blur-sm md:w-80 md:p-6 ${cardPositions[activeIndex]}`}>
            <span aria-hidden="true" className="absolute right-5 top-4 text-gold/70">✦</span>
            <p className="font-body text-[10px] uppercase tracking-[0.23em] text-plum/45">Journal entry</p>
            <h3 className="mt-2 pr-5 font-display text-xl italic text-plum md:text-2xl">{activeDestination.name}</h3>
            <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[#b98732]/50 to-transparent" />
            <p className="font-body text-sm leading-relaxed text-plum/78">{activeDestination.reason}</p>
          </motion.article>}
        </AnimatePresence>

        {!activeDestination && <p className="absolute inset-x-0 bottom-5 text-center font-body text-xs italic text-plum/60">Follow the golden marks on the page.</p>}

        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[15, 31, 59, 77, 88].map((left, index) => <motion.span key={left} initial={{ opacity: 0, y: 8 }} animate={{ opacity: [0, 0.7, 0], y: [-8, -28, -50] }} transition={{ duration: 5 + index, repeat: Infinity, delay: index * 0.8, ease: "easeOut" }} style={{ left: `${left}%`, top: `${56 + (index % 3) * 12}%` }} className="absolute h-1 w-1 rounded-full bg-[#fff3c6] shadow-[0_0_8px_2px_rgba(255,235,175,0.65)]" />)}
        </div>
      </div>

      <div className="absolute bottom-5 z-30 w-full px-6 md:bottom-7"><ChapterFooter onNext={onNext} disabled={!allVisited} label="Continue to Chapter Four" hint="What you don't see in yourself." /></div>
    </section>
  );
}
