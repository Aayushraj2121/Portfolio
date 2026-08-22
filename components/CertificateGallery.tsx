'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CERTIFICATES } from '@/lib/credentials';
import Lightbox from './Lightbox';
import styles from './CertificateGallery.module.css';

/** Thumbnail grid of the real certificate scans, each opening in a lightbox. */
export default function CertificateGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className={styles.grid}>
        {CERTIFICATES.map((certificate, index) => (
          <li key={certificate.slug}>
            <button
              type="button"
              className={styles.card}
              onClick={() => setOpenIndex(index)}
              aria-label={`View ${certificate.title} certificate full size`}
            >
              <span className={styles.frame}>
                <Image
                  src={certificate.thumb}
                  alt=""
                  width={600}
                  height={Math.round((600 * certificate.height) / certificate.width)}
                  loading="lazy"
                  className={styles.thumb}
                  sizes="(max-width: 620px) 100vw, (max-width: 900px) 46vw, 260px"
                />
                <span className={styles.zoom} aria-hidden="true">
                  ⤢
                </span>
              </span>
              <span className={styles.caption}>
                <span className={styles.captionTitle}>{certificate.title}</span>
                <span className={styles.captionMeta}>
                  {certificate.issuer}
                  <br />
                  {certificate.date}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <Lightbox
          certificates={CERTIFICATES}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}
