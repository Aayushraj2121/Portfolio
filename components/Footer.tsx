import { LINKS } from '@/lib/site';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.line}>© 2026 CYBER_SENTINEL // ENCRYPTED_CONNECTION</p>
        <div className={styles.links}>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GitHub</a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>LinkedIn</a>
          <a href="https://tryhackme.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>TryHackMe</a>
          <a href="#projects" className={styles.footerLink}>Write-ups</a>
        </div>
      </div>
    </footer>
  );
}
