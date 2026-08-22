/**
 * The five project dissections, moved verbatim out of the original index.html.
 *
 * Rich text is modelled as typed inline segments rather than HTML strings, so
 * the renderer stays free of `dangerouslySetInnerHTML` and the copy stays
 * type-checked.
 */

/** A run of text, optionally emphasised. */
export type Inline = string | { strong: string } | { em: string };

export type Block =
  | { kind: 'text'; content: Inline[] }
  | { kind: 'list'; items: Inline[][] }
  /** Set-apart callout — used for disclosure notes and design rationale. */
  | { kind: 'note'; content: Inline[] };

export interface Dissection {
  label: string;
  blocks: Block[];
}

export type Severity = 'crit' | 'high' | 'med' | 'low' | 'info';

export interface ProjectLink {
  label: string;
  href: string;
  /** Marks a placeholder destination until the real URL is known. */
  pending?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  status: 'COMPLETED' | 'IN PROGRESS' | 'LIVE';
  summary: string;
  /** Severity roll-up. Only the VAPT project uses severity colour. */
  severities?: { label: string; level: Severity }[];
  tags: string[];
  dissections: Dissection[];
  links?: ProjectLink[];
  /** Shown instead of links when a repo is intentionally withheld. */
  noLinkNote?: string;
}

/** Shorthand for the common single-paragraph block. */
const p = (...content: Inline[]): Block => ({ kind: 'text', content });

export const PROJECTS: Project[] = [
  {
    slug: 'vapt',
    title: 'Online Assessment Platform: Security Assessment',
    status: 'COMPLETED',
    summary:
      'Full VAPT of a Next.js online proctored coding platform — 9 findings across the severity spectrum.',
    severities: [
      { label: '1 CRITICAL · CVSS 9.8', level: 'crit' },
      { label: '1 HIGH', level: 'high' },
      { label: '3 MEDIUM', level: 'med' },
      { label: '4 LOW', level: 'low' },
      { label: '2 INFO', level: 'info' },
    ],
    tags: ['Burp Suite', 'Manual VAPT', 'OWASP Top 10', 'CVSS', 'CWE', 'Web'],
    dissections: [
      {
        label: 'Problem',
        blocks: [
          p(
            'Online proctored coding platforms are a uniquely dangerous attack surface: by design they accept untrusted code, compile it, and run it, while also trying to enforce exam integrity. I performed a full vulnerability assessment and penetration test of one such platform — a Next.js-based online assessment system — end to end.'
          ),
        ],
      },
      {
        label: 'Approach',
        blocks: [
          p(
            'Manual testing driven through Burp Suite (Proxy, Repeater, Intruder) alongside authenticated scanning. Every finding was mapped to the OWASP Top 10 (2021) and a CWE, scored with CVSS, and documented with a reproducible proof-of-concept and a concrete remediation.'
          ),
        ],
      },
      {
        label: 'Key Findings (redacted to technique)',
        blocks: [
          {
            kind: 'list',
            items: [
              [
                { strong: 'Critical — Remote Code Execution.' },
                " The backend compiled and executed submitted C with no sandbox. A payload invoking an OS command executed at the operating-system level; impact was proven by a deliberate timed delay in the server's response. ",
                {
                  em: 'Remediation: isolated execution (containers with dropped capabilities, seccomp/AppArmor), restricted compiler surface.',
                },
              ],
              [
                { strong: 'High — Vertical privilege escalation.' },
                ' Role authorization was enforced only in client-side routing, so a low-privilege session token replayed against admin/teacher endpoints returned protected data. ',
                { em: 'Remediation: server-side RBAC on every protected route.' },
              ],
              [
                { strong: 'Medium —' },
                " CSRF on the submission endpoint; a proctoring anti-cheat bypass (posting code straight to the API, past the browser's paste/copy listeners); no rate limiting or lockout on login.",
              ],
              [
                { strong: 'Low / Info —' },
                ' Missing anti-clickjacking headers, reflected user input, HSTS not enforced, cacheable sensitive responses.',
              ],
            ],
          },
        ],
      },
      {
        label: 'What it demonstrates',
        blocks: [
          p(
            'I can test a real, complex application methodically, prove impact instead of asserting it, and communicate risk in the language both a security team and a developer need.'
          ),
        ],
      },
      {
        label: 'Responsible Disclosure',
        blocks: [
          {
            kind: 'note',
            content: [
              "Target identity, live host, credentials, and working exploit payloads are deliberately withheld. Findings were reported to the system's owner. This page describes methodology and technique only.",
            ],
          },
        ],
      },
    ],
    noLinkNote: 'No public repo / report link — by design.',
  },

  {
    slug: 'omnisniff',
    title: 'OmniSniff: Network Traffic Analyzer & Intrusion Detector',
    status: 'COMPLETED',
    summary:
      'Live packet capture with Scapy feeding a rolling-average anomaly detector and real-time Flask-SocketIO dashboard.',
    tags: ['Python', 'Scapy', 'Flask-SocketIO', 'Detection'],
    dissections: [
      {
        label: 'Problem',
        blocks: [
          p(
            'Most student security projects live at the web layer. Real attacks often show up on the wire first — a port scan, a sudden traffic spike, a host talking to something it never talks to. Reading that requires working at packet level, which off-the-shelf dashboards abstract away.'
          ),
        ],
      },
      {
        label: 'Approach / Architecture',
        blocks: [
          p(
            'Live capture with Scapy feeds a detection layer that uses rolling-average baselines and sliding-window analysis to separate normal variance from a scan or spike. Alerts stream to a Flask-SocketIO dashboard in real time and export to CSV/HTML reports.'
          ),
        ],
      },
      {
        label: 'Pipeline',
        blocks: [
          p(
            'Capture (Scapy sniff) → per-flow feature extraction → sliding-window aggregation → rolling-average baseline comparison → alerting → live dashboard + report export.'
          ),
        ],
      },
      {
        label: 'Tradeoffs & Decisions',
        blocks: [
          p(
            'Chose rolling-average / sliding-window statistics over a heavyweight ML model: real-time, explainable, and needs no training data. The cost is that it catches statistical anomalies, not semantically novel attacks — a deliberate, documented trade.'
          ),
        ],
      },
      {
        label: 'Failure Modes / Limits',
        blocks: [
          p(
            "Capture throughput is bounded by Scapy/Python, so it's designed for monitoring representative traffic, not saturating a gigabit link. That ceiling is understood, and I can explain the architecture (AF_PACKET, kernel-bypass, eBPF/XDP) that would lift it."
          ),
        ],
      },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Aayushraj2121', pending: true }],
  },

  {
    slug: 'firewall',
    title: 'Application-Context Aware Firewall',
    status: 'IN PROGRESS',
    summary:
      'Host-based firewall that combines live threat-intel lookups, behavioral profiling, and process-tree lineage to catch malware riding trusted apps.',
    tags: ['Python', 'Threat Intel', 'Behavioral Detection', 'Host Security'],
    dissections: [
      {
        label: 'Problem',
        blocks: [
          p(
            "Traditional firewalls decide on ports and IPs. They can't tell that a trusted application has been hijacked: if Chrome is allowed out and malware rides Chrome, the traffic passes. That gap is how a lot of real exfiltration and malware command-and-control succeeds."
          ),
        ],
      },
      {
        label: 'Approach — Three Innovations',
        blocks: [
          {
            kind: 'list',
            items: [
              [
                { strong: 'Live threat intelligence.' },
                ' Every outbound destination is checked in real time against AbuseIPDB / VirusTotal; known-malicious IPs are blocked instantly.',
              ],
              [
                { strong: 'Behavioral anomaly detection.' },
                " The firewall learns each application's normal traffic profile and flags exfiltration-shaped deviations — e.g. a document editor suddenly pushing hundreds of MB to an unknown host.",
              ],
              [
                { strong: 'Process-tree lineage.' },
                ' It inspects how a process was spawned to catch masquerading: a chrome.exe launched silently by an Office macro is treated very differently from one the user opened.',
              ],
            ],
          },
        ],
      },
      {
        label: 'Open Questions (ongoing)',
        blocks: [
          p(
            'Tuning false positives from behavioral learning; free-tier threat-intel rate limits; where enforcement should live (userland vs kernel hooks).'
          ),
        ],
      },
      {
        label: 'What it demonstrates',
        blocks: [
          p(
            'I think about detection at the layer attackers actually operate — process and behavior — not just the perimeter.'
          ),
        ],
      },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Aayushraj2121', pending: true }],
  },

  {
    slug: 'evently',
    title: 'Evently: Full-Stack Event Booking & Management Platform',
    status: 'LIVE',
    summary:
      'MERN stack platform with JWT auth, OTP, three-role RBAC enforced server-side, QR tickets, and analytics dashboards.',
    tags: ['React', 'Node/Express', 'MongoDB', 'JWT', 'RBAC'],
    dissections: [
      {
        label: 'Problem',
        blocks: [
          p(
            "I wanted to build a real multi-role web application end to end — the kind of system I test from the offensive side — so I'd understand first-hand how authentication, authorization, and state get implemented, and where they break."
          ),
        ],
      },
      {
        label: 'Approach',
        blocks: [
          p(
            'MERN stack. JWT authentication with OTP verification; role-based access control across three roles (attendee / organizer / admin) enforced server-side; event CRUD with image upload (Multer); booking with unique references and QR ticket stubs; HTML confirmation email; wishlist and reviews; analytics dashboards with CSV export. ~20 REST endpoints across User, Event, and Booking models.'
          ),
        ],
      },
      {
        label: 'Security-Conscious Build',
        blocks: [
          {
            kind: 'note',
            content: [
              "Having found broken access control in a penetration test — where role checks lived only in the client — I built Evently's authorization as server-side middleware on every protected route.",
            ],
          },
        ],
      },
      {
        label: 'Tradeoffs & Decisions',
        blocks: [
          p(
            'MongoDB for schema flexibility and iteration speed; JWT for stateless auth; auto-publish on event creation for a frictionless organizer flow.'
          ),
          p({ em: 'Credit: built with a collaborator (@ayushjaiswal36937-dev).' }),
        ],
      },
    ],
    links: [
      { label: 'Live', href: 'https://event-booking-system-dun.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/Aayushraj2121/Event_booking' },
    ],
  },

  {
    slug: 'driftsense',
    title: 'Drift-Sense: Synthetic Data Generation + Siamese CNN',
    status: 'COMPLETED',
    summary:
      'Synthetic SEM wafer-image generator + Siamese CNN trained with normalized cross-correlation, validated against a 30+ test-case benchmark harness.',
    tags: ['Python', 'OpenCV', 'Siamese CNN', 'Synthetic Data'],
    dissections: [
      {
        label: 'Problem',
        blocks: [
          p(
            "The hardest part of many ML problems isn't the model — it's that no labelled dataset exists. For wafer-defect detection there was none, so I generated one."
          ),
        ],
      },
      {
        label: 'Approach',
        blocks: [
          p(
            'Built a synthetic SEM wafer-image generator to produce labelled defect / non-defect pairs, trained a Siamese CNN using normalized cross-correlation for similarity, and validated against a benchmark harness of 30+ test cases.'
          ),
        ],
      },
      {
        label: 'Why it matters for security',
        blocks: [
          p(
            "The same instinct — manufacture representative data and a rigorous evaluation harness when real data doesn't exist — is exactly what unsupervised threat detection needs. It's the bridge between my ML work and my security work."
          ),
        ],
      },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Aayushraj2121', pending: true }],
  },
];
