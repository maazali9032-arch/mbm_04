// The Wedding Days: a tall section with a sticky stage. As you scroll, the page lives through the
// ceremonies: the light (CSS colours) changes, the look changes, and each day has its own particles.

import { CEREMONIES } from "./data";

type P = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; life: number; hue: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function mixHex(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i]!, t))).join(",")})`;
}

export class WeddingDays {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private parts: P[] = [];
  private raf = 0;
  private visible = false;
  private io: IntersectionObserver;
  private mode = "haldi";
  private amount = 0;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private henna: SVGPathElement[];
  private hennaLen: number[];
  private reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  constructor(private section: HTMLElement) {
    this.canvas = section.querySelector(".days-fx")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.henna = [...section.querySelectorAll<SVGPathElement>(".days-henna path")];
    this.hennaLen = this.henna.map((p) => p.getTotalLength());
    this.henna.forEach((p, i) => (p.style.strokeDasharray = `${this.hennaLen[i]} ${this.hennaLen[i]}`));
    this.io = new IntersectionObserver(([e]) => {
      this.visible = !!e?.isIntersecting;
      if (this.visible && !this.raf) this.raf = requestAnimationFrame(this.frame);
    });
    this.io.observe(section);
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.size);
    this.size();
    this.onScroll();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.io.disconnect();
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.size);
  }

  private size = () => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
  };

  private onScroll = () => {
    const r = this.section.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const prog = Math.min(1, Math.max(0, -r.top / span));
    const n = CEREMONIES.length;
    const f = Math.min(n - 0.001, prog * n);
    const i = Math.floor(f);
    const within = f - i;
    const cur = CEREMONIES[i]!;
    const next = CEREMONIES[Math.min(n - 1, i + 1)]!;
    // hold each day, then blend into the next over the last 30%
    const blend = Math.max(0, (within - 0.8) / 0.2);
    const st = this.section.style;
    st.setProperty("--day-a", mixHex(cur.mood[0], next.mood[0], blend));
    st.setProperty("--day-b", mixHex(cur.mood[1], next.mood[1], blend));
    st.setProperty("--day-ink", mixHex(cur.mood[2], next.mood[2], blend));
    this.section.dataset.day = cur.id;
    this.section.querySelectorAll<HTMLElement>(".day").forEach((el, k) => el.classList.toggle("on", k === i));
    this.section.querySelectorAll<HTMLElement>(".days-look img").forEach((el, k) => el.classList.toggle("on", k === i));
    this.section.querySelectorAll<HTMLElement>(".days-dots li").forEach((el, k) => el.classList.toggle("on", k === i));
    this.mode = cur.id;
    this.amount = 1 - blend;
    // henna draws itself during Mehendi
    const henna = cur.id === "mehendi" ? Math.min(1, within / 0.6) : cur.id === "haldi" ? 0 : 1 - blend;
    this.henna.forEach((p, k) => {
      p.style.strokeDashoffset = String(this.hennaLen[k]! * (1 - (cur.id === "mehendi" ? henna : 0)));
      p.style.opacity = cur.id === "mehendi" ? String(1 - blend) : "0";
    });
  };

  private spawn() {
    const { W, H } = this;
    const m = this.mode;
    const p: P = { x: Math.random() * W, y: -20, vx: (Math.random() - 0.5) * 0.6, vy: 0.6 + Math.random() * 1.2, r: 4 + Math.random() * 5, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.08, life: 1, hue: Math.random() };
    if (m === "sangeet") Object.assign(p, { y: H + 10, vy: -(0.5 + Math.random() * 1.2), r: 1.5 + Math.random() * 2.5 });
    if (m === "reception") Object.assign(p, { y: Math.random() * H, vy: -0.15 - Math.random() * 0.3, r: 6 + Math.random() * 22 });
    if (m === "nikah") Object.assign(p, { vy: 0.3 + Math.random() * 0.6, r: 1 + Math.random() * 2.2 });
    if (m === "mehendi") Object.assign(p, { vy: 0.4 + Math.random() * 0.7, r: 4 + Math.random() * 4 });
    this.parts.push(p);
  }

  private frame = () => {
    if (!this.visible) {
      this.raf = 0;
      return;
    }
    this.raf = requestAnimationFrame(this.frame);
    if (this.reduced) return;
    const rate = { haldi: 1.2, mehendi: 0.5, sangeet: 1.6, nikah: 1.4, reception: 0.35, pellikoduku: 0.9 }[this.mode] ?? 1;
    if (this.parts.length < 160 && Math.random() < rate * this.amount) this.spawn();
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, this.W, this.H);
    const m = this.mode;
    this.parts = this.parts.filter((p) => p.y > -40 && p.y < this.H + 40 && p.life > 0);
    for (const p of this.parts) {
      p.x += p.vx + Math.sin((p.y + p.hue * 100) * 0.02) * 0.3;
      p.y += p.vy;
      p.rot += p.vr;
      if (m === "reception" || m === "sangeet") p.life -= 0.004;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      if (m === "haldi") {
        // marigold petal
        c.fillStyle = p.hue > 0.5 ? "#F29F1A" : "#F7C531";
        c.beginPath();
        c.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "rgba(190,90,0,0.35)";
        c.fillRect(-p.r * 0.7, -0.5, p.r * 1.4, 1);
      } else if (m === "mehendi") {
        c.fillStyle = p.hue > 0.5 ? "#3E7A3A" : "#6B9A4A";
        c.beginPath();
        c.ellipse(0, 0, p.r * 0.45, p.r, 0, 0, Math.PI * 2);
        c.fill();
      } else if (m === "sangeet") {
        c.globalAlpha = Math.max(0, p.life) * (0.5 + 0.5 * Math.sin(p.y * 0.1));
        c.fillStyle = p.hue > 0.6 ? "#F5D27A" : p.hue > 0.3 ? "#E9A7F2" : "#FFFFFF";
        c.beginPath();
        for (let k = 0; k < 4; k++) {
          c.rotate(Math.PI / 2);
          c.moveTo(0, 0);
          c.quadraticCurveTo(p.r * 0.3, p.r * 0.3, 0, p.r * 2.4);
        }
        c.fill();
      } else if (m === "nikah") {
        c.fillStyle = p.hue > 0.75 ? "#FFFFFF" : "#D9B66A";
        c.globalAlpha = 0.85;
        c.beginPath();
        c.arc(0, 0, p.hue > 0.75 ? p.r * 1.8 : p.r, 0, Math.PI * 2);
        c.fill();
      } else if (m === "reception") {
        const g = c.createRadialGradient(0, 0, 0, 0, 0, p.r);
        g.addColorStop(0, `rgba(255,${200 + Math.round(p.hue * 40)},160,${0.35 * Math.max(0, p.life)})`);
        g.addColorStop(1, "rgba(255,220,170,0)");
        c.fillStyle = g;
        c.beginPath();
        c.arc(0, 0, p.r, 0, Math.PI * 2);
        c.fill();
      } else {
        // jasmine petal
        c.fillStyle = "#FFFDF6";
        c.beginPath();
        c.ellipse(0, 0, p.r * 0.5, p.r, 0, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    }
  };
}
