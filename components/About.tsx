import { ABOUT_TEXT } from '@/lib/site';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionLabel">SRC · About</span>
          <h2 id="about-heading">Where I work</h2>
        </div>
        <p className={styles.text}>{ABOUT_TEXT}</p>
      </div>
    </section>
  );
}
