'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import type { Certificate } from '@/lib/credentials';
import styles from './Lightbox.module.css';

interface LightboxProps {
  certificates: Certificate[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-size certificate viewer.
 *
 * Handles the full modal contract: Esc closes, arrows navigate, clicking the
 * backdrop closes, focus is trapped inside the dialog and restored to the
 * trigger on close, and background scrolling is locked.
 */
export default function Lightbox({ certificates, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  /** The element that opened the dialog, so focus can be handed back. */
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const certificate = certificates[index];
  const count = certificates.length;

  const goPrevious = useCallback(
    () => onNavigate((index - 1 + count) % count),
    [index, count, onNavigate]
  );
  const goNext = useCallback(() => onNavigate((index + 1) % count), [index, count, onNavigate]);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    // Compensate for the vanishing scrollbar so the page doesn't shift.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previouslyFocused.current?.focus();
    };
    // Runs once per mount: the dialog stays mounted while navigating between
    // certificates, so scroll lock and focus restoration must not re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft' && count > 1) {
        event.preventDefault();
        goPrevious();
        return;
      }

      if (event.key === 'ArrowRight' && count > 1) {
        event.preventDefault();
        goNext();
        return;
      }

      if (event.key !== 'Tab') return;

      // Focus trap: cycle within the dialog's focusable children.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, goPrevious, goNext, count]);

  if (!certificate) return null;

  return (
    <div
      className={styles.backdrop}
      /* Clicking the backdrop closes; clicks inside the dialog don't bubble. */
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.bar}>
          <div className={styles.barText}>
            <h2 className={styles.title} id="lightbox-title">
              {certificate.title}
            </h2>
            <p className={styles.subtitle}>
              {certificate.issuer} · {certificate.date}
              {certificate.reference && ` · ${certificate.reference}`}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close certificate viewer"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className={styles.stage}>
          <Image
            key={certificate.slug}
            src={certificate.image}
            alt={`${certificate.title} — ${certificate.issuer}`}
            width={certificate.width}
            height={certificate.height}
            className={styles.image}
            sizes="(max-width: 900px) 92vw, 860px"
          />
        </div>

        <div className={styles.footer}>
          {count > 1 && (
            <div className={styles.pager}>
              <button
                type="button"
                className={styles.pagerButton}
                onClick={goPrevious}
                aria-label="Previous certificate"
              >
                <span aria-hidden="true">←</span>
              </button>
              <span className={styles.counter}>
                {index + 1} / {count}
              </span>
              <button
                type="button"
                className={styles.pagerButton}
                onClick={goNext}
                aria-label="Next certificate"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {certificate.pdf && (
            <a
              href={certificate.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.download}
            >
              Open original PDF
              <span aria-hidden="true"> ↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
