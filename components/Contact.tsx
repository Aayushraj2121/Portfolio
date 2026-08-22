import { LINKS } from '@/lib/site';
import styles from './Contact.module.css';

const CONTACTS = [
  { icon: '✉', label: 'Email', value: LINKS.email, href: `mailto:${LINKS.email}`, external: false },
  {
    icon: '⌥',
    label: 'GitHub',
    value: 'github.com/Aayushraj2121',
    href: LINKS.github,
    external: true,
  },
  {
    icon: 'in',
    label: 'LinkedIn',
    value: 'linkedin.com/in/ayush-raj-2294a0385',
    href: LINKS.linkedin,
    external: true,
  },
] as const;

export default function Contact() {
  return (
    <section id="contact" className={`section ${styles.section}`} aria-labelledby="contact-heading">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionLabel">FLAGS · Contact</span>
          <h2 id="contact-heading">Get in touch</h2>
        </div>

        <p className={styles.flags}>
          <span className={styles.flagsDot} aria-hidden="true" />
          FLAGS: available for hire
        </p>

        <p className={styles.tagline}>
          Open to security internships. The fastest way to reach me is email.
        </p>

        <ul className={styles.links}>
          {CONTACTS.map((contact) => (
            <li key={contact.label}>
              <a
                href={contact.href}
                className={styles.link}
                {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className={styles.icon} aria-hidden="true">
                  {contact.icon}
                </span>
                <span className={styles.value}>{contact.value}</span>
                <span className={styles.label}>{contact.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
