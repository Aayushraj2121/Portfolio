'use client';

import { useState } from 'react';
import type { Block, Inline, Project } from '@/lib/projects';
import styles from './ProjectCard.module.css';

/** Renders typed inline segments without reaching for dangerouslySetInnerHTML. */
function InlineText({ content }: { content: Inline[] }) {
  return (
    <>
      {content.map((segment, index) => {
        if (typeof segment === 'string') return segment;
        if ('strong' in segment) return <strong key={index}>{segment.strong}</strong>;
        return <em key={index}>{segment.em}</em>;
      })}
    </>
  );
}

function BlockContent({ block }: { block: Block }) {
  if (block.kind === 'text') {
    return (
      <p>
        <InlineText content={block.content} />
      </p>
    );
  }

  if (block.kind === 'note') {
    return (
      <div className={styles.note}>
        <InlineText content={block.content} />
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {block.items.map((item, index) => (
        <li key={index}>
          <InlineText content={item} />
        </li>
      ))}
    </ul>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const panelId = `panel-${project.slug}`;
  const headingId = `heading-${project.slug}`;

  return (
    <article className={styles.card} data-open={open || undefined}>
      {/*
        A real <button> gives Enter/Space activation and focus handling for free,
        replacing the hand-rolled keydown logic in the original main.js.
      */}
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.meta}>
          <span className={styles.titleRow}>
            <h3 className={styles.title} id={headingId}>
              {project.title}
            </h3>
            <span className={styles.status} data-status={project.status}>
              {project.status}
            </span>
          </span>

          <span className={styles.summary}>{project.summary}</span>

          {project.severities && (
            <span className={styles.severities}>
              <span className="visuallyHidden">Finding severity summary: </span>
              {project.severities.map((severity) => (
                <span key={severity.label} className="pill" data-level={severity.level}>
                  {severity.label}
                </span>
              ))}
            </span>
          )}

          <span className={styles.tags}>
            <span className="visuallyHidden">Technologies: </span>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </span>
        </span>

        <span className={styles.toggle} aria-hidden="true">
          <span className={styles.toggleIcon} />
        </span>
      </button>

      {/*
        `grid-template-rows: 0fr -> 1fr` animates to the panel's true content
        height, so the transition holds however long a dissection runs.
        The inner wrapper's `visibility` is transitioned rather than using the
        `hidden` attribute: `hidden` would snap the panel shut with no animation,
        while `visibility: hidden` still keeps the collapsed content out of the
        tab order and the accessibility tree.
      */}
      <div className={styles.panel} id={panelId} role="region" aria-labelledby={headingId}>
        <div className={styles.panelInner}>
          {project.dissections.map((dissection) => (
            <div key={dissection.label} className={styles.dissection}>
              <h4 className={styles.dissectionLabel}>{dissection.label}</h4>
              <div className={styles.dissectionBody}>
                {dissection.blocks.map((block, index) => (
                  <BlockContent key={index} block={block} />
                ))}
              </div>
            </div>
          ))}

          {project.noLinkNote && <p className={styles.noLink}>{project.noLinkNote}</p>}

          {project.links && (
            <div className={styles.links}>
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {link.label}
                  <span aria-hidden="true"> →</span>
                  {link.pending && <span className={styles.pending}>(URL pending)</span>}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
