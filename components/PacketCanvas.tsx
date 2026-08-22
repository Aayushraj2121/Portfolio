'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import styles from './PacketCanvas.module.css';

/**
 * Animated packet-stream backdrop for the hero.
 *
 * Packets travel left-to-right along fixed lanes at varied speeds, leaving a
 * short trail. A few are marked as bursts and render brighter in cyan. The
 * effect is scoped to the hero rather than the whole page so the cost stays
 * bounded, and it stops entirely when the tab is hidden.
 *
 * Under `prefers-reduced-motion` a single static frame is drawn instead.
 */

const LANE_COUNT = 14;
const PACKETS_PER_LANE = 5;
/** Pixels per second, before the per-packet multiplier. */
const BASE_SPEED = 46;

interface Packet {
  lane: number;
  /** Horizontal position as a fraction of width, so resizes stay valid. */
  x: number;
  speed: number;
  length: number;
  alpha: number;
  burst: boolean;
}

/**
 * Deterministic pseudo-random source. A fixed seed keeps the static
 * reduced-motion frame identical between server and client, and makes the
 * animation reproducible when debugging.
 */
function makeRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function createPackets(): Packet[] {
  const random = makeRandom(0x5eed);
  const packets: Packet[] = [];

  for (let lane = 0; lane < LANE_COUNT; lane += 1) {
    for (let n = 0; n < PACKETS_PER_LANE; n += 1) {
      packets.push({
        lane,
        x: random(),
        speed: 0.45 + random() * 1.5,
        length: 0.04 + random() * 0.13,
        // Kept low: the trails sit behind hero copy and must not compete with it.
        alpha: 0.12 + random() * 0.34,
        // Roughly one packet in seven is a bright burst.
        burst: random() > 0.86,
      });
    }
  }

  return packets;
}

export default function PacketCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const packets = createPackets();
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Cap the backing-store scale: above 2x the extra pixels cost more than
      // they show on a diffuse, low-alpha effect like this.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const laneGap = height / (LANE_COUNT + 1);

      // Lane guides — a faint hint of structure behind the packets.
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(44, 52, 68, 0.32)';
      for (let lane = 0; lane < LANE_COUNT; lane += 1) {
        const y = Math.round(laneGap * (lane + 1)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (const packet of packets) {
        const y = Math.round(laneGap * (packet.lane + 1)) + 0.5;
        const head = packet.x * width;
        const tail = head - packet.length * width;

        // Trail fades from the head backwards.
        const gradient = ctx.createLinearGradient(tail, y, head, y);
        const hue = packet.burst ? '34, 211, 238' : '124, 92, 255';
        gradient.addColorStop(0, `rgba(${hue}, 0)`);
        gradient.addColorStop(1, `rgba(${hue}, ${packet.alpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = packet.burst ? 2 : 1.25;
        ctx.beginPath();
        ctx.moveTo(tail, y);
        ctx.lineTo(head, y);
        ctx.stroke();

        // Bright leading dot, so each packet reads as a discrete unit.
        ctx.fillStyle = `rgba(${hue}, ${Math.min(packet.alpha + 0.35, 0.95)})`;
        ctx.beginPath();
        ctx.arc(head, y, packet.burst ? 1.9 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (time: number) => {
      // Clamp dt so a long stall (tab switch, breakpoint) doesn't teleport
      // every packet across the canvas in one step.
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;

      for (const packet of packets) {
        packet.x += (BASE_SPEED * packet.speed * dt) / Math.max(width, 1);
        if (packet.x - packet.length > 1) {
          packet.x = -packet.length;
        }
      }

      draw();
      frame = requestAnimationFrame(tick);
    };

    resize();

    if (reducedMotion) {
      draw();
      const onResize = () => {
        resize();
        draw();
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const start = () => {
      if (frame) return;
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Nothing to animate while the tab is in the background.
    const onVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.grid} />
      <div className={styles.glow} />
    </div>
  );
}
