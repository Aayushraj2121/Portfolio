'use client';

import { useEffect, useState } from 'react';
import { LINKS, NAV_ITEMS } from '@/lib/site';
import styles from './Nav.module.css';

export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (element): element is HTMLElement => element !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={styles.header}>
      <nav
        className={styles.nav}
        data-scrolled={scrolled || undefined}
        aria-label="Main navigation"
      >
        <div className={`container ${styles.inner}`}>
          <a href="#hero" className={styles.brand} aria-label="Cyber Sentinel — home">
            <span className={styles.brandDot} aria-hidden="true" />
            CYBER_SENTINEL
            <span className={styles.brandVer}>.v3</span>
          </a>

          <ul className={styles.links}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={styles.link}
                  data-active={active === item.id || undefined}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resumeBtn}
            aria-label="View GitHub profile"
          >
            <span className={styles.resumeIcon}>⌥</span>
            GITHUB
          </a>
        </div>
      </nav>
    </header>
  );
}
