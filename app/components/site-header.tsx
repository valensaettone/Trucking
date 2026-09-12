"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import styles from "./site-header.module.css";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Why Reliance", href: "#why" },
  { label: "Contact", href: "#contact" },
];

export default function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // The header inverts once it leaves the video stage.
    const onScroll = () => {
      const stage = document.getElementById("hero");
      const threshold = stage
        ? stage.offsetTop + stage.offsetHeight - window.innerHeight * 0.35
        : window.innerHeight;
      setSolid(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-solid={solid}
      data-open={open}
    >
      <div className={styles.inner}>
        {/* The supplied lockup has a black wordmark, so the white silhouette
            is used while the header sits over the video and the full-colour
            one takes over when the header turns solid. */}
        <a
          className={styles.brand}
          href="#hero"
          aria-label="Reliance Express Ltd. — home"
        >
          <Image
            className={`${styles.logo} ${styles.logoLight}`}
            src="/brand/logo-light.png"
            alt=""
            width={700}
            height={307}
            priority
            aria-hidden="true"
          />
          <Image
            className={`${styles.logo} ${styles.logoDark}`}
            src="/brand/logo.png"
            alt="Reliance Express Ltd."
            width={700}
            height={307}
            priority
          />
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a className={styles.quote} href="#contact" onClick={() => setOpen(false)}>
            Get a Quote
          </a>
        </nav>

        <button
          className={styles.toggle}
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
