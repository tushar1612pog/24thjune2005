"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ─────────────────────────────────────────────────────────
// Single source of truth for site-wide audio.
//
// Exactly one <audio> element ever exists (created lazily on
// first use, inside this provider). Every chapter and every
// control talks to this context instead of touching the DOM
// audio API directly — that's what guarantees only one song
// can ever be playing at a time.
// ─────────────────────────────────────────────────────────

const AMBIENT_SRC = "/assets/music/ambient.mp3";
const SUPER_TROUPER_SRC = "/assets/music/super-trouper.mp3";

const TARGET_VOLUME = 0.35; // matches the previous player's volume
const SWITCH_FADE_MS = 400; // track-to-track crossfade-style transitions
const INITIAL_FADE_MS = 1000; // the very first fade-in, on "Begin Journey"

type TrackKey = "ambient" | "super-trouper";

type MusicContextValue = {
  currentTrack: TrackKey | null;
  isPlaying: boolean;
  /** Start the ambient loop. Called once, from the "Begin Journey" click. */
  playAmbient: () => void;
  /** Ambient fades out, Super Trouper fades in from the start. */
  switchToSuperTrouper: () => void;
  /** Super Trouper stops (not paused), ambient resumes where it left off. */
  returnToAmbient: () => void;
  /** Vinyl click: pause/resume whatever track is currently loaded. */
  togglePlayPause: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return ctx;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mirrors of state that fade()/callbacks need to read synchronously,
  // without depending on (and being staled by) React render cycles.
  const currentTrackRef = useRef<TrackKey | null>(null);
  const isPlayingRef = useRef(false);
  const ambientTimeRef = useRef(0); // where ambient was when we last left it
  const fadeTokenRef = useRef(0); // cancels any in-flight fade

  const [currentTrack, setCurrentTrackState] = useState<TrackKey | null>(null);
  const [isPlaying, setIsPlayingState] = useState(false);

  const setCurrentTrack = (track: TrackKey | null) => {
    currentTrackRef.current = track;
    setCurrentTrackState(track);
  };
  const setIsPlaying = (playing: boolean) => {
    isPlayingRef.current = playing;
    setIsPlayingState(playing);
  };

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      audio.volume = 0;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  // Smoothly ramps this audio element's volume from -> to over duration ms.
  // Any fade already in flight is cancelled so fades never fight each other.
  const fade = useCallback(
    (audio: HTMLAudioElement, from: number, to: number, duration: number, onComplete?: () => void) => {
      const token = ++fadeTokenRef.current;
      const start = performance.now();
      audio.volume = from;

      const step = (now: number) => {
        if (fadeTokenRef.current !== token) return; // superseded
        const elapsed = now - start;
        const t = duration <= 0 ? 1 : Math.min(elapsed / duration, 1);
        audio.volume = from + (to - from) * t;
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          onComplete?.();
        }
      };
      requestAnimationFrame(step);
    },
    []
  );

  const playAmbient = useCallback(() => {
    const audio = getAudio();

    if (currentTrackRef.current === "ambient" && isPlayingRef.current) {
      return; // already the ambient loop, nothing to do
    }

    audio.src = AMBIENT_SRC;
    audio.loop = true;
    audio.currentTime = ambientTimeRef.current;
    audio.volume = 0;
    setCurrentTrack("ambient");

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        fade(audio, 0, TARGET_VOLUME, INITIAL_FADE_MS);
      })
      .catch(() => {
        // Autoplay was blocked — the vinyl will still let them start it.
        setIsPlaying(false);
      });
  }, [fade, getAudio]);

  const switchToSuperTrouper = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrackRef.current === "super-trouper") return; // already on it

    if (currentTrackRef.current === "ambient") {
      ambientTimeRef.current = audio.currentTime;
    }

    fade(audio, audio.volume, 0, SWITCH_FADE_MS, () => {
      audio.pause();
      audio.src = SUPER_TROUPER_SRC;
      audio.loop = false;
      audio.currentTime = 0;
      audio.volume = 0;
      setCurrentTrack("super-trouper");

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          fade(audio, 0, TARGET_VOLUME, SWITCH_FADE_MS);
        })
        .catch(() => setIsPlaying(false));
    });
  }, [fade]);

  const returnToAmbient = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrackRef.current !== "super-trouper") return; // nothing to return from

    fade(audio, audio.volume, 0, SWITCH_FADE_MS, () => {
      // Super Trouper stops outright — no resuming it later from this point.
      audio.pause();
      audio.currentTime = 0;

      audio.src = AMBIENT_SRC;
      audio.loop = true;
      audio.currentTime = ambientTimeRef.current;
      audio.volume = 0;
      setCurrentTrack("ambient");

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          fade(audio, 0, TARGET_VOLUME, SWITCH_FADE_MS);
        })
        .catch(() => setIsPlaying(false));
    });
  }, [fade]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrackRef.current) return;

    if (isPlayingRef.current) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Remember ambient's position even if paused mid-loop.
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  // Keep ambient's saved position fresh while it's the active track, so a
  // later switch/return resumes from the right spot rather than 0.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (currentTrackRef.current === "ambient") {
        ambientTimeRef.current = audio.currentTime;
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [currentTrack]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const value = useMemo<MusicContextValue>(
    () => ({
      currentTrack,
      isPlaying,
      playAmbient,
      switchToSuperTrouper,
      returnToAmbient,
      togglePlayPause,
    }),
    [currentTrack, isPlaying, playAmbient, switchToSuperTrouper, returnToAmbient, togglePlayPause]
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
