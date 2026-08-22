import Image from 'next/image';
import { ACTIVITY, CND, PORTSWIGGER, SKILLS } from '@/lib/credentials';
import CertificateGallery from './CertificateGallery';
import styles from './Credentials.module.css';

export default function Credentials() {
  return (
    <section id="credentials" className="section" aria-labelledby="credentials-heading">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionLabel">OPTIONS · Credentials &amp; Skills</span>
          <h2 id="credentials-heading">Credentials &amp; Skills</h2>
        </div>

        {/* CND is the anchor credential and is given the most visual weight. */}
        <div className={styles.anchor}>
          <div className={styles.badge}>
            <Image
              src={CND.badge}
              alt="EC-Council Certified Network Defender badge"
              width={352}
              height={352}
              className={styles.badgeImg}
              sizes="104px"
            />
          </div>

          <div className={styles.anchorInfo}>
            <h3 className={styles.anchorName}>{CND.name}</h3>
            <dl className={styles.anchorMeta}>
              <div>
                <dt>Accreditation</dt>
                <dd>{CND.accreditation}</dd>
              </div>
              <div>
                <dt>Credential ID</dt>
                <dd>{CND.credentialId}</dd>
              </div>
              <div>
                <dt>Validity</dt>
                <dd>
                  {CND.issued} · {CND.validity}
                </dd>
              </div>
            </dl>

            {CND.verifyUrl ? (
              <a
                href={CND.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.verify}
              >
                Verify credential
                <span aria-hidden="true"> ↗</span>
              </a>
            )}
          </div>
        </div>

        <h3 className={styles.subheading}>Certificates</h3>
        <CertificateGallery />

        <div className={styles.strip}>
          <div className={styles.stripRow}>
            <div className={styles.stripText}>
              <span className={styles.stripName}>{PORTSWIGGER.name}</span>
              <span className={styles.stripMeta}>{PORTSWIGGER.meta}</span>
            </div>
            <div className={styles.stripPills}>
              {PORTSWIGGER.tiers.map((tier) => (
                <span key={tier.label} className="pill" data-level={tier.level}>
                  {tier.label}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.stripRow}>
            <div className={styles.stripText}>
              <span className={styles.stripLabel}>Activity</span>
              <span className={styles.stripName}>{ACTIVITY.name}</span>
              <span className={styles.stripMeta}>{ACTIVITY.meta}</span>
            </div>
          </div>
        </div>

        <h3 className={styles.subheading}>Skills, by evidence</h3>

        {/* Table at wide widths; the same rows become cards below 820px. */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Group</th>
                <th scope="col">Tools &amp; Concepts</th>
                <th scope="col">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.map((skill) => (
                <tr key={skill.group}>
                  <th scope="row">{skill.group}</th>
                  <td>{skill.tools}</td>
                  <td className={styles.evidence}>{skill.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={styles.skillCards}>
          {SKILLS.map((skill) => (
            <li key={skill.group} className={styles.skillCard}>
              <span className={styles.skillGroup}>{skill.group}</span>
              <span className={styles.skillTools}>{skill.toolsShort}</span>
              <span className={styles.skillEvidence}>{skill.evidence}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
