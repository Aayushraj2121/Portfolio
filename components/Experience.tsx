import { EXPERIENCE } from '@/lib/site';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionLabel">IDENTITY · Experience</span>
          <h2 id="experience-heading">Experience</h2>
        </div>

        <ol className={styles.list}>
          {EXPERIENCE.map((item) => (
            <li key={item.company} className={styles.item}>
              <div className={styles.body}>
                <h3 className={styles.role}>{item.role}</h3>
                <p className={styles.company}>{item.company}</p>
                <p className={styles.description}>{item.description}</p>
              </div>
              <span className={styles.period}>{item.period}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
