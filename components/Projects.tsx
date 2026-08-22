import { PROJECTS } from '@/lib/projects';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionLabel">PAYLOAD · Projects</span>
          <h2 id="projects-heading">What I&rsquo;ve built &amp; broken</h2>
        </div>

        <div className={styles.list}>
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
