/**
 * Site-wide constants: identity, links, and the RFC 791 hero bit-field.
 */

export const SITE = {
  name: 'Ayush Raj',
  role: 'Security Practitioner',
  title: 'Ayush Raj — Security Practitioner & CS Student',
  description:
    'Ayush Raj — Third-year B.Tech CSE (Cybersecurity and Digital Forensics) student and security practitioner. I build packet-level detection tools and break real web apps. EC-Council Certified Network Defender.',
  ogDescription:
    'Network defense and offensive web-app security. I work one layer deeper than the demo.',
  url: 'https://aayushraj2121.github.io',
} as const;

export const LINKS = {
  github: 'https://github.com/Aayushraj2121',
  linkedin: 'https://linkedin.com/in/ayush-raj-2294a0385',
  email: 'ayushraj36937@gmail.com',
} as const;

export const NAV_ITEMS = [
  { id: 'about', label: 'SRC' },
  { id: 'projects', label: 'PAYLOAD' },
  { id: 'credentials', label: 'OPTIONS' },
  { id: 'experience', label: 'TTL' },
  { id: 'contact', label: 'FLAGS' },
] as const;

/**
 * The hero reads as an RFC 791 IP header. Each field occupies a share of the
 * 32-bit row, expressed as a flex basis so rows always sum to 100% and the
 * diagram never scrolls horizontally.
 */
export interface BitFieldEntry {
  name: string;
  value: string;
  tooltip: string;
  /** CSS flex shorthand — controls the field's share of its 32-bit row. */
  flex: string;
  /** Reveal delay in ms, so values type in left-to-right. */
  delay: number;
  /** The FLAGS field is highlighted; it carries the availability signal. */
  accent?: boolean;
}

export const BIT_FIELD_ROWS: BitFieldEntry[][] = [
  [
    { name: 'Ver', value: 'v3', tooltip: 'Version 3 — 3rd-year B.Tech CSE (Cybersecurity & Digital Forensics) student.', flex: '0 0 12.5%', delay: 0 },
    { name: 'Role', value: 'Sec', tooltip: 'Security analyst in the making.', flex: '0 0 12.5%', delay: 80 },
    { name: 'Name', value: 'AYUSH RAJ', tooltip: 'Ayush Raj.', flex: '1', delay: 160 },
  ],
  [
    {
      name: 'Focus',
      value: 'Network Defense & Offensive Web',
      tooltip: 'Network defense and offensive web-app security.',
      flex: '1',
      delay: 240,
    },
    { name: 'Flags', value: 'HIRE', tooltip: 'Set: available for hire.', flex: '0 0 25%', delay: 320, accent: true },
  ],
  [
    {
      name: 'Source',
      value: 'Sharda University — B.Tech CSE (Cybersecurity & Digital Forensics)',
      tooltip: 'B.Tech CSE (Cybersecurity and Digital Forensics), Sharda University.',
      flex: '1',
      delay: 400,
    },
  ],
  [
    {
      name: 'Options',
      value: 'EC-Council CND',
      tooltip: 'Certified Network Defender — ANSI-accredited.',
      flex: '1 1 34%',
      delay: 480,
    },
    {
      name: 'Options',
      value: 'Scapy / Wireshark',
      tooltip: 'Packet analysis with Scapy and Wireshark.',
      flex: '1 1 33%',
      delay: 540,
    },
    {
      name: 'Options',
      value: 'Burp Suite',
      tooltip: 'Web application security testing with Burp Suite.',
      flex: '1 1 33%',
      delay: 580,
    },
  ],
];

/** Condensed field list for the sub-640px layout, where the ruler is dropped. */
export const BIT_FIELD_MOBILE = [
  { label: 'Name', value: 'Ayush Raj' },
  { label: 'Ver / Role', value: 'v3 · Security analyst in the making' },
  { label: 'Focus', value: 'Network Defense & Offensive Web' },
  { label: 'Flags', value: 'Available for hire', accent: true },
  { label: 'Source', value: 'Sharda University — B.Tech CSE (Cybersecurity & Digital Forensics)' },
  { label: 'Options', value: 'EC-Council CND · Scapy · Burp Suite' },
] as const;

export const ABOUT_TEXT = `I'm a third-year B.Tech CSE (Cybersecurity and Digital Forensics) student at Sharda University focused on network defense and offensive web security. My work sits at two layers most student projects skip: the packet and the exploit. On the defensive side I build tools that read raw traffic — live capture, statistical anomaly detection, host-based behavioral firewalls. On the offensive side I test real applications the way an attacker would, then document what I find to professional standard. I care less about shipping a demo than about being able to defend every decision inside it.`;

export const EXPERIENCE = [
  {
    role: 'Cybersecurity Intern',
    company: 'SkillOrbit / Sofzenix IT Solutions',
    period: 'May – Jun 2026',
    description:
      'Worked on defensive security best practices and vulnerability remediation documentation.',
  },
] as const;
