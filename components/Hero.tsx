import Image from 'next/image';
import { LINKS } from '@/lib/site';
import BitField from './BitField';
import PacketCanvas from './PacketCanvas';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-heading">
      <PacketCanvas />

      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.portrait}>
            {/*
              Framed with HUD corner brackets rather than a circle, so the photo
              reads as part of the instrument. `priority` because it sits above
              the fold and would otherwise cause a visible late swap.
            */}
            <Image
              src="/profile.webp"
              alt="Ayush Raj"
              width={560}
              height={700}
              priority
              className={styles.portraitImg}
              sizes="(max-width: 860px) 168px, 248px"
            />
            <span className={styles.bracket} data-corner="tl" aria-hidden="true" />
            <span className={styles.bracket} data-corner="tr" aria-hidden="true" />
            <span className={styles.bracket} data-corner="bl" aria-hidden="true" />
            <span className={styles.bracket} data-corner="br" aria-hidden="true" />
            <span className={styles.scanline} aria-hidden="true" />
          </div>

          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <span className={styles.statusDot} aria-hidden="true" />
              AYUSH RAJ // SECURITY
            </p>
            <h1 id="hero-heading">
              I work one layer
              <br />
              deeper than the demo.
            </h1>
            <p className={styles.sub}>
              Third-year B.Tech CSE (Cybersecurity and Digital Forensics) student and security practitioner. I build packet-level detection
              tools, and I break real web apps to understand how they fail. EC-Council Certified
              Network Defender.
            </p>
            <div className={styles.actions}>
              <a href="#projects" className={styles.cta}>
                Read the dissections
                <span aria-hidden="true"> ↓</span>
              </a>
              <div className={styles.secondary}>
                <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        <BitField />

        {/* Plain-language equivalent of the bit-field, which is aria-hidden. */}
        <p className="visuallyHidden">
          Identity summary: Ayush Raj, third-year B.Tech CSE (Cybersecurity and Digital Forensics) student at Sharda University,
          B.Tech CSE Cybersecurity and Digital Forensics. Focus: network defense and offensive web application security.
          Available for hire. Credentials: EC-Council Certified Network Defender. Tools: Scapy,
          Wireshark, Burp Suite.
        </p>
      </div>
    </section>
  );
}
