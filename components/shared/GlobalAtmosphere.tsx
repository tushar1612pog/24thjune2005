import ParticleField from "@/components/shared/ParticleField";

/**
 * Site-wide atmosphere layer: grain (already in globals.css), a soft edge
 * vignette, a faint warm bloom, and a low-density dust drift. Rendered once
 * in the root layout so every chapter gets the same base atmosphere without
 * having to remember to add it individually.
 */
export default function GlobalAtmosphere() {
  return (
    <>
      <div className="warm-bloom" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-[6] opacity-30">
        <ParticleField count={10} color="#E8B04B" />
      </div>
    </>
  );
}
