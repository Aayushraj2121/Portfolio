/**
 * main.js — Wire Format Portfolio
 * Ayush Raj · 2026
 *
 * Responsibilities:
 *  1. Bit-field load animation (left-to-right field reveal, ~600ms)
 *  2. Project expand / collapse (click + keyboard, aria-expanded)
 *  3. Sticky nav active-section tracking (IntersectionObserver)
 *  4. Smooth-scroll (handled natively via CSS scroll-behavior; no JS needed)
 */

/* ── Utility ─────────────────────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. Bit-Field Load Animation ─────────────────────────────── */
function initBitfieldAnimation() {
  const values = document.querySelectorAll('.bf-field-value');
  if (!values.length) return;

  if (prefersReducedMotion) {
    // Reveal all immediately, no animation
    values.forEach(el => el.classList.add('revealed'));
    return;
  }

  values.forEach(el => {
    const field = el.closest('.bf-field');
    const delay = parseInt(field?.dataset.delay ?? '0', 10);
    setTimeout(() => {
      el.classList.add('revealed');
    }, delay);
  });
}

/* ── 2. Project Expand / Collapse ────────────────────────────── */
function initProjectToggles() {
  const toggles = document.querySelectorAll('[aria-controls][role="button"]');

  toggles.forEach(toggle => {
    const panelId = toggle.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    if (!panel) return;

    // Remove `hidden` attribute so CSS transitions can work
    // We manage visibility through class + max-height
    panel.removeAttribute('hidden');

    function openPanel() {
      const item = toggle.closest('.project-item');
      toggle.setAttribute('aria-expanded', 'true');
      item.classList.add('open');
      panel.style.display = '';
    }

    function closePanel() {
      const item = toggle.closest('.project-item');
      toggle.setAttribute('aria-expanded', 'false');
      item.classList.remove('open');
    }

    function toggle_() {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    }

    toggle.addEventListener('click', toggle_);

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle_();
      }
    });
  });
}

/* ── 3. Active Nav Section Tracking ──────────────────────────── */
function initNavHighlight() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  const navMap = {};
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      navMap[href.slice(1)] = link;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = navMap[id];
        if (!link) return;

        if (entry.isIntersecting) {
          // Remove active from all, then set on this one
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach(section => observer.observe(section));
}

/* ── 4. Bit-field keyboard tooltip accessibility ─────────────── */
function initBitfieldA11y() {
  // Fields already have tabindex=0 and tooltips shown via CSS :focus
  // This adds ARIA description so screen readers announce tooltip text
  const fields = document.querySelectorAll('.bf-field[tabindex]');

  fields.forEach((field, i) => {
    const tooltip = field.querySelector('.bf-tooltip');
    if (!tooltip) return;

    const descId = `bf-desc-${i}`;
    tooltip.id = descId;
    field.setAttribute('aria-describedby', descId);

    // Also make the field label available
    const name = field.querySelector('.bf-field-name');
    const value = field.querySelector('.bf-field-value');
    if (name && value) {
      field.setAttribute('aria-label', `${name.textContent.trim()}: ${value.textContent.trim()}`);
    }
  });
}

/* ── Init ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initBitfieldAnimation();
  initProjectToggles();
  initNavHighlight();
  initBitfieldA11y();
});
