import { ABOUT_TEXT } from '@/lib/site';
import styles from './About.module.css';

const CAPABILITIES = [
  {
    id: 'SYS_01',
    icon: '⚙',
    title: 'Penetration Testing',
    desc: 'Comprehensive black-box and white-box assessments across web, mobile, and internal networks. Identifying critical CVEs before adversaries do.',
    tags: ['Burp Suite', 'Metasploit', 'OWASP'],
  },
  {
    id: 'SYS_02',
    icon: '⊕',
    title: 'Threat Intelligence',
    desc: 'Proactive adversary tracking, IOC correlation, and OSINT investigations to preemptively secure infrastructure.',
    tags: ['Maltego', 'OSINT'],
  },
  {
    id: 'SYS_03',
    icon: '◈',
    title: 'Network Defense',
    desc: 'Designing zero-trust environments, configuring Next-Gen Firewalls, and implementing robust SIEM solutions for real-time traffic analysis.',
    tags: ['Splunk', 'Wireshark', 'Suricata'],
  },
  {
    id: 'SYS_04',
    icon: '⟨/⟩',
    title: 'Packet Engineering',
    desc: 'Building packet-level detection tools with live capture, statistical anomaly detection, and host-based behavioral firewalls using Scapy.',
    tags: ['Scapy', 'Python', 'Pcap'],
  },
];

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionLabel">SYSTEM ONLINE · Tactical Capabilities</span>
          <h2 id="about-heading">Tactical Capabilities</h2>
        </div>

        <p className={styles.text}>{ABOUT_TEXT}</p>

        <div className={styles.grid}>
          {CAPABILITIES.map((cap) => (
            <div key={cap.id} className={styles.card}>
              <span className={styles.cardId}>{cap.id}</span>
              <div className={styles.cardIcon} aria-hidden="true">{cap.icon}</div>
              <h3 className={styles.cardTitle}>{cap.title}</h3>
              <p className={styles.cardDesc}>{cap.desc}</p>
              <div className={styles.cardTags}>
                {cap.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
