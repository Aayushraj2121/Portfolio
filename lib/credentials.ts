/**
 * Credentials, certificates, and skills.
 *
 * The hierarchy is deliberate: CND is the anchor credential, the coursework and
 * internship certificates sit below it, and the hackathon participation
 * certificate is grouped under Activity rather than presented as a credential.
 */

/** A certificate with a scan the visitor can open full-size. */
export interface Certificate {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  /** Credential / reference number, where the certificate carries one. */
  reference?: string;
  /** Full-resolution image in public/certs. */
  image: string;
  thumb: string;
  width: number;
  height: number;
  /** Original PDF, offered as a download when one exists. */
  pdf?: string;
}

export const CND = {
  name: 'EC-Council Certified Network Defender',
  accreditation: 'ANSI-Accredited',
  credentialId: 'ECC3120469785',
  issued: 'Issued 21 May 2026',
  validity: 'Renewable 01 June 2027',
  badge: '/certs/cnd-badge.webp',
  /** TODO: replace with the real Credly / EC-Council Aspen verification URL. */
  verifyUrl: null as string | null,
} as const;

export const CERTIFICATES: Certificate[] = [
  {
    slug: 'cnd-certificate',
    title: 'Certified Network Defender',
    issuer: 'EC-Council · ANSI-accredited',
    date: 'Issued 21 May 2026',
    reference: 'ECC3120469785',
    image: '/certs/cnd-certificate.webp',
    thumb: '/certs/cnd-certificate-thumb.webp',
    width: 1680,
    height: 1328,
    pdf: '/certs/cnd-certificate.pdf',
  },
  {
    slug: 'csdf-2026',
    title: 'Advanced Certificate Program in Cyber Security & Digital Forensics',
    issuer: 'Sharda University — Center for Cyber Security & Cryptology',
    date: '2–12 Feb 2026',
    image: '/certs/csdf-2026.webp',
    thumb: '/certs/csdf-2026-thumb.webp',
    width: 1229,
    height: 889,
  },
  {
    slug: 'internship-skillorbit',
    title: 'Cyber Security Internship',
    issuer: 'SkillOrbit / Sofzenix IT Solutions',
    date: '01 May – 30 Jun 2026',
    reference: 'SO26CC00609',
    image: '/certs/internship-skillorbit.webp',
    thumb: '/certs/internship-skillorbit-thumb.webp',
    width: 1280,
    height: 905,
  },
  {
    slug: 'sih-2025',
    title: 'Smart India Hackathon 2025 — Certificate of Participation',
    issuer: 'Internal round · Team "Loop Coder"',
    date: '23–24 Sept 2025',
    image: '/certs/sih-2025.webp',
    thumb: '/certs/sih-2025-thumb.webp',
    width: 1244,
    height: 974,
  },
];

export const PORTSWIGGER = {
  name: 'PortSwigger Web Security Academy',
  meta: 'Hands-on practice — 47 labs solved',
  tiers: [
    { label: '20 Practitioner', level: 'high' as const },
    { label: '25 Apprentice', level: 'low' as const },
    { label: '2 Expert', level: 'crit' as const },
  ],
} as const;

export const ACTIVITY = {
  name: 'Smart India Hackathon 2025',
  meta: 'Internal round · Team "Loop Coder" · Sept 2025',
  certSlug: 'sih-2025',
} as const;

export interface SkillGroup {
  group: string;
  tools: string;
  evidence: string;
  /** Condensed tool list for the narrow-viewport card layout. */
  toolsShort: string;
}

export const SKILLS: SkillGroup[] = [
  {
    group: 'Offensive / Web App Security',
    tools:
      'Burp Suite, manual VAPT, OWASP Top 10, CWE, CVSS, Nmap, Metasploit, Hydra, Kali Linux',
    toolsShort: 'Burp Suite · VAPT · OWASP Top 10 · CVSS · Nmap · Kali Linux',
    evidence: 'VAPT assessment (9 findings); 47 PortSwigger labs',
  },
  {
    group: 'Network / Packet Analysis',
    tools: 'Python, Scapy, Wireshark, tcpdump, Flask-SocketIO',
    toolsShort: 'Python · Scapy · Wireshark · tcpdump · Flask-SocketIO',
    evidence: 'OmniSniff',
  },
  {
    group: 'Detection & Host Security',
    tools:
      'Behavioral anomaly detection, process-tree lineage, threat-intel APIs (AbuseIPDB, VirusTotal)',
    toolsShort:
      'Behavioral anomaly detection · process-tree lineage · AbuseIPDB · VirusTotal',
    evidence: 'Application-Context Aware Firewall',
  },
  {
    group: 'Full-Stack Engineering',
    tools: 'React, Node.js, Express, MongoDB, JWT, RBAC, REST',
    toolsShort: 'React · Node.js · Express · MongoDB · JWT · RBAC',
    evidence: 'Evently',
  },
  {
    group: 'ML / Data',
    tools: 'Synthetic data generation, Siamese CNN, OpenCV, evaluation harnesses',
    toolsShort: 'Siamese CNN · Synthetic data generation · OpenCV',
    evidence: 'Drift-Sense',
  },
  {
    group: 'Languages',
    tools: 'Python (primary), JavaScript, C++, C, Java',
    toolsShort: 'Python (primary) · JavaScript · C++ · C · Java',
    evidence: 'across projects',
  },
];
