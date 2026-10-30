// The Sehra: strands of pearls, jasmine and gold beads hanging over the groom.
// Each strand is a chain of points (Verlet physics). Touch pushes them; parting gathers them to
// both sides like a veil being tied back.

type Bead = "pearl" | "jasmine" | "gold" | "rose" | "drop";
type Strand = { x0: number; len: number; pts: Float32Array; prev: Float32Array; beads: Bead[]; seg: number; phase: number };

const SEGMENTS = 24;

function sprite(size: number, draw: (c: CanvasRenderingContext2D, s: number) => void) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  draw(cv.getContext("2d")!, size);
  return cv;
}

function makeSprites(dpr: number) {
  const k = dpr;
  const pearl = sprite(Math.round(16 * k), (c, s) => {
    const g = c.createRadialGradient(s * 0.38, s * 0.34, s * 0.04, s / 2, s / 2, s * 0.48);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.45, "#f3ede2");
    g.addColorStop(0.85, "#cfc4b2");
    g.addColorStop(1, "rgba(160,145,120,0)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(s / 2, s / 2, s * 0.46, 0, Math.PI * 2);
    c.fill();
  });
  const gold = sprite(Math.round(10 * k), (c, s) => {
    const g = c.createRadialGradient(s * 0.35, s * 0.32, 0, s / 2, s / 2, s * 0.5);
    g.addColorStop(0, "#fff3c9");
    g.addColorStop(0.4, "#d6ac5a");
    g.addColorStop(1, "#7c5a22");
    c.fillStyle = g;
    c.beginPath();
    c.arc(s / 2, s / 2, s * 0.45, 0, Math.PI * 2);
    c.fill();
  });
  const jasmine = sprite(Math.round(22 * k), (c, s) => {
    c.translate(s / 2, s / 2);
    for (let i = 0; i < 6; i++) {
      c.rotate(Math.PI / 3);
      const g = c.createLinearGradient(0, 0, 0, -s * 0.44);
      g.addColorStop(0, "#f4eedd");
      g.addColorStop(1, "#ffffff");
      c.fillStyle = g;
      c.beginPath();
      c.ellipse(0, -s * 0.22, s * 0.11, s * 0.22, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = "#e7c96a";
    c.beginPath();
    c.arc(0, 0, s * 0.08, 0, Math.PI * 2);
    c.fill();
  });
  const rose = sprite(Math.round(24 * k), (c, s) => {
    c.translate(s / 2, s / 2);
    for (let r = s * 0.46; r > 2; r -= s * 0.09) {
      c.fillStyle = r > s * 0.3 ? "#7d0f1c" : r > s * 0.18 ? "#a3192a" : "#c5303f";
      c.beginPath();
      c.arc(Math.sin(r) * 1.2, Math.cos(r) * 1.2, r, 0, Math.PI * 2);
      c.fill();
    }
  });
  const drop = sprite(Math.round(18 * k), (c, s) => {
    const g = c.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, "#fff2c2");
    g.addColorStop(0.5, "#c99a45");
    g.addColorStop(1, "#6e4c17");
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(s / 2, 1);
    c.quadraticCurveTo(s * 0.95, s * 0.6, s / 2, s - 1);
    c.quadraticCurveTo(s * 0.05, s * 0.6, s / 2, 1);
    c.fill();
  });
  return { pearl, gold, jasmine, rose, drop };
}

export class Sehra {
  private ctx: CanvasRenderingContext2D;
  private strands: Strand[] = [];
  private W = 0;
  private H = 0;
  private dpr = 1;
  private sprites!: ReturnType<typeof makeSprites>;
  private part = 0;
  private partTarget = 0;
  private pointer: { x: number; y: number; vx: number; vy: number } | null = null;
  private raf = 0;
  private t = 0;
  private reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private ro: ResizeObserver;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    canvas.addEventListener("pointermove", this.onMove, { passive: true });
    canvas.addEventListener("pointerdown", this.onMove, { passive: true });
    canvas.addEventListener("pointerleave", () => (this.pointer = null));
    this.raf = requestAnimationFrame(this.frame);
  }

  /** 0 = veil closed, 1 = fully parted. */
  setPart(v: number) {
    this.partTarget = Math.max(0, Math.min(1, v));
  }
  get parted() {
    return this.part;
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
  }

  private onMove = (e: PointerEvent) => {
    const r = this.canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    this.pointer = { x, y, vx: this.pointer ? x - this.pointer.x : 0, vy: this.pointer ? y - this.pointer.y : 0 };
  };

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    if (!r.width) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = r.width;
    this.H = r.height;
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
    this.sprites = makeSprites(this.dpr);
    const gap = this.W < 600 ? 15 : 19;
    const count = Math.ceil(this.W / gap);
    this.strands = [];
    for (let i = 0; i < count; i++) {
      const x0 = (i + 0.5) * (this.W / count);
      // longer in the middle, like a real sehra
      const mid = 1 - Math.abs(x0 / this.W - 0.5) * 2;
      const len = this.H * (0.42 + 0.34 * mid + Math.random() * 0.08);
      const seg = len / SEGMENTS;
      const pts = new Float32Array((SEGMENTS + 1) * 2);
      for (let j = 0; j <= SEGMENTS; j++) {
        pts[j * 2] = x0;
        pts[j * 2 + 1] = j * seg;
      }
      const beads: Bead[] = [];
      const style = i % 3;
      for (let j = 0; j <= SEGMENTS; j++) {
        if (j === SEGMENTS) beads.push(i % 4 === 0 ? "rose" : "drop");
        else if (style === 0) beads.push(j % 3 === 2 ? "gold" : "pearl");
        else if (style === 1) beads.push(j % 4 === 1 ? "jasmine" : j % 2 ? "gold" : "pearl");
        else beads.push(j % 5 === 0 ? "jasmine" : "pearl");
      }
      this.strands.push({ x0, len, pts, prev: pts.slice(), beads, seg, phase: Math.random() * 6.28 });
    }
  }

  private frame = () => {
    this.raf = requestAnimationFrame(this.frame);
    this.t += 1 / 60;
    this.part += (this.partTarget - this.part) * (this.reduced ? 1 : 0.06);
    const p = this.part;
    const { W, H } = this;
    const ptr = this.pointer;
    for (const s of this.strands) {
      const left = s.x0 < W / 2;
      // gathered position: pushed to the near edge, tied back at about 40% height
      const gather = left ? 8 + (s.x0 / W) * 40 : W - 8 - ((W - s.x0) / W) * 40;
      const ax = s.x0 + (gather - s.x0) * p;
      // where the tie-back draws the lower strand: partway for a half-lifted veil
      const tieX = s.x0 + (gather - s.x0) * Math.min(1, p * 1.25);
      const pts = s.pts, prev = s.prev;
      pts[0] = ax;
      pts[1] = 0;
      const wind = this.reduced ? 0 : Math.sin(this.t * 0.9 + s.phase) * 0.06;
      for (let j = 1; j <= SEGMENTS; j++) {
        const xi = j * 2, yi = xi + 1;
        const x = pts[xi]!, y = pts[yi]!;
        let vx = (x - prev[xi]!) * 0.975, vy = (y - prev[yi]!) * 0.975;
        prev[xi] = x;
        prev[yi] = y;
        vy += 0.35; // gravity
        vx += wind * (j / SEGMENTS);
        // tie-back: lower beads drawn toward the gathered side, strongest near the tie
        if (p > 0.01) {
          const tie = Math.exp(-Math.pow(j / SEGMENTS - 0.45, 2) * 10) * 0.05 * p;
          vx += (tieX - x) * tie;
        }
        if (ptr) {
          const dx = x - ptr.x, dy = y - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 4900) {
            const f = (1 - d2 / 4900) * 1.4;
            vx += (dx / Math.sqrt(d2 + 1)) * f + ptr.vx * 0.08;
            vy += (dy / Math.sqrt(d2 + 1)) * f * 0.4;
          }
        }
        pts[xi] = x + vx;
        pts[yi] = y + vy;
      }
      // keep links at their length
      for (let it = 0; it < 3; it++)
        for (let j = 0; j < SEGMENTS; j++) {
          const a = j * 2, b = a + 2;
          const dx = pts[b]! - pts[a]!, dy = pts[b + 1]! - pts[a + 1]!;
          const d = Math.hypot(dx, dy) || 1e-4;
          const diff = (d - s.seg) / d;
          if (j === 0) {
            pts[b] = pts[b]! - dx * diff;
            pts[b + 1] = pts[b + 1]! - dy * diff;
          } else {
            pts[a] = pts[a]! + dx * diff * 0.5;
            pts[a + 1] = pts[a + 1]! + dy * diff * 0.5;
            pts[b] = pts[b]! - dx * diff * 0.5;
            pts[b + 1] = pts[b + 1]! - dy * diff * 0.5;
          }
        }
    }
    if (ptr) {
      ptr.vx *= 0.8;
      ptr.vy *= 0.8;
    }
    this.draw(H);
  };

  private draw(H: number) {
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, this.W, H);
    const sp = this.sprites;
    c.lineWidth = 0.8;
    c.strokeStyle = "rgba(196,160,92,0.75)";
    for (const s of this.strands) {
      c.beginPath();
      c.moveTo(s.pts[0]!, s.pts[1]!);
      for (let j = 1; j <= SEGMENTS; j++) c.lineTo(s.pts[j * 2]!, s.pts[j * 2 + 1]!);
      c.stroke();
    }
    for (const s of this.strands) {
      for (let j = 1; j <= SEGMENTS; j++) {
        const x = s.pts[j * 2]!, y = s.pts[j * 2 + 1]!;
        const b = s.beads[j]!;
        const img = sp[b];
        const size = b === "pearl" ? 8 : b === "gold" ? 5 : b === "jasmine" ? 12 : b === "rose" ? 13 : 9;
        c.drawImage(img, x - size / 2, y - size / 2, size, size);
      }
    }
  }
}
