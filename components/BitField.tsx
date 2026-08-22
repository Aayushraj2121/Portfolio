'use client';

import { useEffect, useRef, useState } from 'react';
import { BIT_FIELD_MOBILE, BIT_FIELD_ROWS } from '@/lib/site';
import { useReducedMotion } from '@/lib/useReducedMotion';
import styles from './BitField.module.css';

/** Bit ruler labels 0–31; every tenth is a major tick, the rest show one digit. */
const RULER = Array.from({ length: 32 }, (_, bit) => ({
  bit,
  label: bit % 10 === 0 ? String(bit) : String(bit % 10),
  major: bit % 10 === 0,
}));

/**
 * The RFC 791 IP-header diagram, re-read as an identity record.
 *
 * Field values type in left-to-right on first paint. The whole diagram is
 * `aria-hidden` and paired with a plain-text description for assistive tech,
 * because a character-by-character reveal is meaningless read aloud and the
 * bit-field is decorative framing for information stated elsewhere on the page.
 */
export default function BitField() {
  const reducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    // One frame's delay lets the initial (hidden) state paint, so the
    // transition actually runs instead of being collapsed into first paint.
    const id = setTimeout(() => setRevealed(true), 60);
    timers.current.push(id);
    return () => clearTimeout(id);
  }, [reducedMotion]);

  return (
    <div className={styles.wrap}>
      {/* Desktop / tablet: the full 32-bit diagram. */}
      <div className={styles.hud} aria-hidden="true">
        <div className={styles.hudHeader}>
          <span className={styles.hudTitle}>IDENTITY HEADER</span>
          <span className={styles.hudRfc}>RFC 791 · 32 bits</span>
        </div>

        <div className={styles.ruler}>
          {RULER.map(({ bit, label, major }) => (
            <span key={bit} className={major ? styles.tickMajor : styles.tick}>
              {label}
            </span>
          ))}
        </div>

        <div className={styles.rows}>
          {BIT_FIELD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((field) => (
                <div
                  key={`${field.name}-${field.value}`}
                  className={field.accent ? `${styles.field} ${styles.fieldAccent}` : styles.field}
                  style={{ flex: field.flex }}
                  tabIndex={0}
                >
                  <span className={styles.fieldName}>{field.name}</span>
                  <span
                    className={styles.fieldValue}
                    data-revealed={revealed || undefined}
                    style={{ transitionDelay: reducedMotion ? '0ms' : `${field.delay}ms` }}
                  >
                    {field.value}
                  </span>
                  <span className={styles.tooltip} role="tooltip">
                    {field.tooltip}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Narrow viewports: stacked cards, no ruler, never scrolls sideways. */}
      <ul className={styles.stacked} aria-hidden="true">
        {BIT_FIELD_MOBILE.map((field) => (
          <li
            key={field.label}
            className={
              'accent' in field && field.accent
                ? `${styles.stackedItem} ${styles.stackedAccent}`
                : styles.stackedItem
            }
          >
            <span className={styles.stackedLabel}>{field.label}</span>
            <span className={styles.stackedValue}>{field.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
