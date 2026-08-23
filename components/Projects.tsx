import { PROJECTS } from '@/lib/projects';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionLabel">SYSTEM_ONLINE · Arsenal Deployment</span>
          <h2 id="projects-heading">Arsenal Deployment</h2>
          <p className={styles.subtext}>
            A structured repository of security research, penetration testing labs, and defensive
            automation scripts. Data classified. Access granted.
          </p>
        </div>

        <div className={styles.list}>
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        {/* Terminal search bar — decorative, matches Stitch design */}
        <div className={styles.terminal}>
          <span className={styles.terminalPrompt}>root@sentinel:~#</span>
          <span className={styles.terminalCmd}>search_arsenal --query &apos;...&apos;</span>
          <span className={styles.terminalCursor} aria-hidden="true">▌</span>
        </div>
      </div>
    </section>
  );
}
