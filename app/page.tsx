"use client";

import { useEffect, useRef, useState } from "react";
import { useJourneyStore, CHAPTER_COUNT } from "@/lib/journeyStore";
import IntroSequence from "@/components/shared/IntroSequence";
import Firefly from "@/components/shared/Firefly";
import MusicToggle from "@/components/shared/MusicToggle";
import ProgressRail from "@/components/shared/ProgressRail";
import Chapter1Beginning from "@/components/chapters/Chapter1Beginning";
import Chapter2LittleThings from "@/components/chapters/Chapter2LittleThings";
import Chapter3TravelMap from "@/components/chapters/Chapter3TravelMap";
import Chapter4HiddenQualities from "@/components/chapters/Chapter4HiddenQualities";
import Chapter5Dreams from "@/components/chapters/Chapter5Dreams";
import Chapter6Detective from "@/components/chapters/Chapter6Detective";
import Chapter7Garden from "@/components/chapters/Chapter7Garden";
import Chapter8Scrapbook from "@/components/chapters/Chapter8Scrapbook";
import Chapter9TwentyOneReasons from "@/components/chapters/Chapter9TwentyOneReasons";
import Chapter10Future from "@/components/chapters/Chapter10Future";

const CHAPTER_TITLES = [
  "The Beginning",
  "Little Things That Make You…",
  "The World Through Your Eyes",
  "Things You Don't Realize About Yourself",
  "Dreams",
  "The Detective",
  "A Garden",
  "Our Story",
  "21 Things I Love About You",
  "The Future",
];

export default function Home() {
  const { introComplete, unlockedChapter, completeIntro, unlockNext } =
    useJourneyStore();
  const [currentChapter, setCurrentChapter] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track which chapter is centered in view, to light up the progress rail.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-chapter-index]")
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-chapter-index"));
            setCurrentChapter(idx);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [introComplete]);

  const goToChapter = (index: number) => {
    const target = scrollRef.current?.querySelector<HTMLElement>(
      `[data-chapter-index="${index}"]`
    );
    target?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNext = (fromChapter: number) => {
    unlockNext(fromChapter);
    goToChapter(Math.min(fromChapter + 1, CHAPTER_COUNT - 1));
  };

  if (!introComplete) {
    return <IntroSequence onBegin={completeIntro} />;
  }

  return (
    <main>
      <Firefly warmth={unlockedChapter / (CHAPTER_COUNT - 1)} />
      <MusicToggle />
      <ProgressRail
        currentChapter={currentChapter}
        unlockedChapter={unlockedChapter}
      />

      <div ref={scrollRef} className="journey-scroll">
        {CHAPTER_TITLES.map((title, i) => (
          <section key={title} data-chapter-index={i} className="chapter-section">
            {i > unlockedChapter ? (
              <div className="font-body text-sm text-plum/30">
                Chapter {i + 1} unlocks after Chapter {i}
              </div>
            ) : (
              renderChapter(i, () => handleNext(i))
            )}
          </section>
        ))}
      </div>
    </main>
  );
}

function renderChapter(index: number, onNext: () => void) {
  switch (index) {
    case 0:
      return <Chapter1Beginning onNext={onNext} />;
    case 1:
      return <Chapter2LittleThings onNext={onNext} />;
    case 2:
      return <Chapter3TravelMap onNext={onNext} />;
    case 3:
      return <Chapter4HiddenQualities onNext={onNext} />;
    case 4:
      return <Chapter5Dreams onNext={onNext} />;
    case 5:
      return <Chapter6Detective onNext={onNext} />;
    case 6:
      return <Chapter7Garden onNext={onNext} />;
    case 7:
      return <Chapter8Scrapbook onNext={onNext} />;
    case 8:
      return <Chapter9TwentyOneReasons onNext={onNext} />;
    case 9:
      return <Chapter10Future />;
    default:
      return null;
  }
}
