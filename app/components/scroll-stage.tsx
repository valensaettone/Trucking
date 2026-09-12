"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./scroll-stage.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ *
 * The copy is anchored to moments in `public/video/hero.mp4` (10s):
 *   0.0 - 2.2s   tracking shot along the trailer  -> brand statement
 *   3.6 - 4.8s   the rear doors swing open        -> what we move
 *   4.8 - 7.2s   travelling inside the trailer    -> how we move it
 *   8.2 - 10s    out into the terminal yard       -> partnership + CTA
 * `from` / `to` are a fraction of the video timeline, which is also the
 * scroll progress of the stage.
 * ------------------------------------------------------------------ */

type Phase = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  lede?: string;
  points?: { term: string; detail: string }[];
  cta?: { label: string; href: string };
  from: number;
  to: number;
  /** Visible from the very first pixel (no fade-in). */
  lead?: boolean;
  /** Stays on screen through the end of the stage (no fade-out). */
  hold?: boolean;
  /** Scrim weight, 0-1. Lower it where the footage is already dark. */
  scrim?: number;
};

const PHASES: Phase[] = [
  {
    id: "intro",
    label: "Reliance Express",
    eyebrow: "Toronto, Ontario — Canada",
    title: "Reliable Freight & Logistics Across North America",
    lede: "Reliance Express Ltd. — fast, safe and tailored transportation solutions, dispatched daily from the Greater Toronto Area.",
    from: 0,
    to: 0.22,
    lead: true,
  },
  {
    id: "coverage",
    label: "Coverage",
    eyebrow: "01 — Coverage",
    title: "Complete Transportation & Supply Chain Solutions",
    points: [
      {
        term: "Local & Regional Transport",
        detail: "Efficient coverage tailored to your regional logistics.",
      },
      {
        term: "Long-Haul Shipping",
        detail: "Seamless cross-border and long-distance hauling.",
      },
    ],
    from: 0.34,
    to: 0.52,
  },
  {
    id: "performance",
    label: "Performance",
    eyebrow: "02 — Performance",
    title: "Speed & Safety Without Compromise",
    points: [
      {
        term: "Expedited Shipping",
        detail: "Dedicated, time-sensitive delivery options.",
      },
      {
        term: "Safety-Focused Hauling",
        detail: "Committed to the highest safety and compliance standards.",
      },
    ],
    from: 0.57,
    to: 0.73,
    // This lands inside the trailer, which is already near-black.
    scrim: 0.4,
  },
  {
    id: "partnership",
    label: "Partnership",
    eyebrow: "03 — Partnership",
    title: "End-to-End Supply Chain Management",
    lede: "We map your supply chain, then build the transportation solution around it. Optimize your logistics today.",
    cta: { label: "Get a Quote", href: "#contact" },
    from: 0.82,
    to: 1,
    hold: true,
  },
];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Smooth 0 to 1 ramp between two edges. */
function smoothstep(edge0: number, edge1: number, n: number) {
  const t = clamp01((n - edge0) / (edge1 - edge0 || 1));
  return t * t * (3 - 2 * t);
}

export default function ScrollStage() {
  const stageRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phaseEls = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-phase]"),
    );
    const lineGroups = phaseEls.map((el) =>
      Array.from(el.querySelectorAll<HTMLElement>("[data-line]")),
    );
    const railEls = railRef.current
      ? Array.from(railRef.current.querySelectorAll<HTMLElement>("li"))
      : [];

    /* 1. iOS/Safari refuses to decode a frame until the element has been
          told to play at least once. Nudge it, then park it. */
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      const attempt = video.play();
      if (attempt && typeof attempt.then === "function") {
        attempt.then(() => video.pause()).catch(() => {});
      } else {
        video.pause();
      }
    };
    video.addEventListener("loadeddata", unlock, { once: true });
    window.addEventListener("pointerdown", unlock, { once: true });
    if (video.readyState >= 2) unlock();

    /* 2. Scroll progress drives the copy and the target frame. */
    let progress = 0;
    let seekCurrent = 0;

    const paint = () => {
      let peakScrim = 0;
      let bestPeak = 0;
      let active = 0;

      phaseEls.forEach((el, i) => {
        const phase = PHASES[i];
        const span = phase.to - phase.from || 1;
        const local = clamp01((progress - phase.from) / span);
        const inWindow = progress >= phase.from && progress <= phase.to;

        // Fade out at the tail of the window unless this phase holds.
        const leave = phase.hold ? 1 : 1 - smoothstep(0.74, 1, local);

        let peak = 0;
        lineGroups[i].forEach((line, j) => {
          const delay = j * 0.07;
          const enter = phase.lead ? 1 : smoothstep(delay, delay + 0.3, local);
          const v = inWindow ? enter * leave : 0;
          if (v > peak) peak = v;
          line.style.setProperty("--v", v.toFixed(4));
        });

        el.style.setProperty("--vis", peak.toFixed(4));
        el.style.visibility = peak < 0.005 ? "hidden" : "visible";

        const scrim = peak * (phase.scrim ?? 1);
        if (scrim > peakScrim) peakScrim = scrim;
        if (peak > bestPeak) {
          bestPeak = peak;
          active = i;
        }
      });

      scrimRef.current?.style.setProperty("--scrim", peakScrim.toFixed(4));
      barRef.current?.style.setProperty("--p", progress.toFixed(4));
      hintRef.current?.style.setProperty(
        "--v",
        (1 - smoothstep(0, 0.06, progress)).toFixed(4),
      );
      railEls.forEach((li, i) => {
        li.dataset.active = String(i === active && bestPeak > 0.2);
      });
    };

    /* 3. Eased seeking. Scroll events are decoupled from the actual
          `currentTime` writes so a fast flick never floods the decoder. */
    const tick = () => {
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      const seekTarget = progress * duration;
      const ease = reduced.matches ? 1 : 0.16;
      seekCurrent += (seekTarget - seekCurrent) * ease;
      if (Math.abs(seekTarget - seekCurrent) < 0.002) seekCurrent = seekTarget;

      if (
        video.readyState >= 2 &&
        Math.abs(video.currentTime - seekCurrent) > 1 / 50
      ) {
        // Clamp just inside the last frame: seeking to exactly `duration`
        // fires `ended`, and some browsers then snap the poster back in.
        video.currentTime = Math.min(seekCurrent, duration - 0.04);
      }
    };

    gsap.ticker.add(tick);

    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress = self.progress;
        paint();
      },
      onRefresh: (self) => {
        progress = self.progress;
        seekCurrent = progress * (video.duration || 0);
        paint();
      },
    });

    paint();
    const onMeta = () => ScrollTrigger.refresh();
    video.addEventListener("loadedmetadata", onMeta);

    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", unlock);
      window.removeEventListener("pointerdown", unlock);
    };
  }, []);

  return (
    <section ref={stageRef} className={styles.stage} id="hero">
      <div className={styles.viewport}>
        {/* Both files are re-encoded all-intra (every frame a keyframe) so
            that seeking is instant; the source clip only had keyframes at
            the head, which made scrubbing take up to 1.8s per seek. */}
        <video
          ref={videoRef}
          className={styles.video}
          poster="/video/hero-poster.jpg"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        >
          <source
            src="/video/hero-scrub.mp4"
            type="video/mp4"
            media="(min-width: 769px)"
          />
          <source src="/video/hero-scrub-sm.mp4" type="video/mp4" />
        </video>

        <div className={styles.grade} aria-hidden="true" />
        <div ref={scrimRef} className={styles.scrim} aria-hidden="true" />

        <div className={styles.copy}>
          <div className={styles.copyInner}>
            {PHASES.map((phase, i) => {
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <article
                  key={phase.id}
                  className={styles.phase}
                  data-phase={i}
                  aria-labelledby={`phase-${phase.id}`}
                >
                  <p className={styles.line} data-line="">
                    <span className="eyebrow">{phase.eyebrow}</span>
                  </p>

                  <Heading
                    id={`phase-${phase.id}`}
                    className={`${styles.line} ${styles.title}`}
                    data-line=""
                  >
                    {phase.title}
                  </Heading>

                  {phase.lede ? (
                    <p className={`${styles.line} ${styles.lede}`} data-line="">
                      {phase.lede}
                    </p>
                  ) : null}

                  {phase.points ? (
                    <ul className={styles.points}>
                      {phase.points.map((point) => (
                        <li
                          key={point.term}
                          className={styles.line}
                          data-line=""
                        >
                          <span className={styles.term}>{point.term}</span>
                          <span className={styles.detail}>{point.detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {phase.cta ? (
                    <p className={styles.line} data-line="">
                      <a className={styles.cta} href={phase.cta.href}>
                        {phase.cta.label}
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M5 12h13M12 5l7 7-7 7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <ol ref={railRef} className={styles.rail} aria-hidden="true">
          {PHASES.map((phase) => (
            <li key={phase.id} data-active="false">
              <span className={styles.railDot} />
              <span className={styles.railLabel}>{phase.label}</span>
            </li>
          ))}
        </ol>

        <div ref={hintRef} className={styles.hint} aria-hidden="true">
          <span>Scroll</span>
          <span className={styles.hintLine} />
        </div>

        <div ref={barRef} className={styles.bar} aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
