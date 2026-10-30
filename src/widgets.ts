// Interactive objects: the Rail, the Stitch Clock, the Measuring Tape, the three-way mirror,
// the MAHIB spotlight and the NRI boarding pass.

import { byId, inr, readyBy, STORE, waLink } from "./data";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- The Rail: hangers with weight ----------
export function mountRail(root: HTMLElement, go: (path: string) => void) {
  const track = root.querySelector<HTMLElement>(".rail-track")!;
  const items = [...root.querySelectorAll<HTMLElement>(".rail-item")];
  const state = items.map(() => ({ a: 0, v: 0, ta: 0, tv: 0 }));
  let last = track.scrollLeft;
  let raf = 0;
  let energy = 0;
  const tick = () => {
    // a jump (arrow buttons, fast flick) counts as a firm push, never a spin
    const dx = Math.max(-28, Math.min(28, track.scrollLeft - last));
    last = track.scrollLeft;
    energy = Math.max(energy * 0.96, Math.abs(dx));
    items.forEach((el, i) => {
      const s = state[i]!;
      // the rail moves, the hanger lags behind and swings back
      s.v += -dx * 0.0022 - s.a * 0.05;
      s.v *= 0.93;
      s.a = Math.max(-0.45, Math.min(0.45, s.a + s.v));
      s.tv += (s.a * 1.8 - s.ta) * 0.08 - dx * 0.002;
      s.tv *= 0.9;
      s.ta = Math.max(-0.7, Math.min(0.7, s.ta + s.tv));
      el.querySelector<HTMLElement>(".hanger")!.style.transform = `rotate(${(s.a * 57.3).toFixed(2)}deg)`;
      el.querySelector<HTMLElement>(".tag")!.style.transform = `rotate(${(s.ta * 57.3 + 8).toFixed(2)}deg)`;
      energy = Math.max(energy, Math.abs(s.v) * 400);
    });
    raf = energy > 0.02 ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => {
    if (!raf && !reduced()) raf = requestAnimationFrame(tick);
  };
  track.addEventListener("scroll", wake, { passive: true });

  // desktop: drag the rail with the mouse
  let drag: { x: number; left: number; moved: boolean } | null = null;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false };
    track.classList.add("dragging");
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const d = e.clientX - drag.x;
    if (Math.abs(d) > 4) drag.moved = true;
    track.scrollLeft = drag.left - d;
  });
  window.addEventListener("pointerup", () => {
    track.classList.remove("dragging");
    setTimeout(() => (drag = null), 0);
  });
  const nudge = (dir: number) => track.scrollBy({ left: dir * track.clientWidth * 0.7, behavior: "smooth" });
  root.querySelector(".rail-prev")?.addEventListener("click", () => nudge(-1));
  root.querySelector(".rail-next")?.addEventListener("click", () => nudge(1));

  items.forEach((el) =>
    el.addEventListener("click", (e) => {
      if (drag?.moved) {
        e.preventDefault();
        return;
      }
      lift(el, go);
    }),
  );
  // a small invitation swing when the rail first comes into view
  const io = new IntersectionObserver(([en]) => {
    if (en?.isIntersecting) {
      state.forEach((s, i) => (s.v = 0.02 * Math.sin(i)));
      wake();
      io.disconnect();
    }
  });
  io.observe(track);
  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
  };
}

/** The tapped garment lifts off its hook and comes forward. */
function lift(el: HTMLElement, go: (path: string) => void) {
  const p = byId(el.dataset.id!);
  if (!p) return;
  const img = el.querySelector<HTMLImageElement>(".garment img")!;
  const from = img.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "lift";
  layer.innerHTML = `
    <div class="lift-back"></div>
    <figure class="lift-piece${p.cutout ? " cutout" : ""}"><img src="${p.img}" alt=""></figure>
    <div class="lift-card" role="dialog" aria-label="${p.name}">
      <p class="eyebrow">${p.mahib ? "MAHIB · " : ""}${p.work}</p>
      <h3>${p.name}</h3>
      <p class="lift-price">${inr(p.price)}${p.unit ? ` <small>${p.unit}</small>` : ""}</p>
      <div class="swatches">${p.colours.map((c) => `<span title="${c.name}" style="--sw:${c.hex}"></span>`).join("")}</div>
      <p class="lift-note">${p.note}</p>
      <div class="lift-actions">
        <button class="btn btn-dark" data-view>View piece</button>
        <a class="btn btn-line" target="_blank" rel="noopener" href="${waLink(p, `Hello Maqdoom's, I'd like to know about: ${p.name}`)}">Ask on WhatsApp</a>
      </div>
      <button class="lift-close" aria-label="Back to the rail">×</button>
    </div>`;
  document.body.appendChild(layer);
  const piece = layer.querySelector<HTMLElement>(".lift-piece")!;
  const to = piece.getBoundingClientRect();
  piece.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  piece.style.transformOrigin = "top left";
  requestAnimationFrame(() => {
    layer.classList.add("on");
    piece.style.transition = "transform .7s cubic-bezier(.2,.8,.2,1)";
    piece.style.transform = "none";
  });
  el.classList.add("lifted");
  const close = () => {
    layer.classList.remove("on");
    piece.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
    setTimeout(() => {
      layer.remove();
      el.classList.remove("lifted");
    }, 500);
    document.removeEventListener("keydown", esc);
  };
  const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
  document.addEventListener("keydown", esc);
  layer.querySelector(".lift-back")!.addEventListener("click", close);
  layer.querySelector(".lift-close")!.addEventListener("click", close);
  layer.querySelector("[data-view]")!.addEventListener("click", () => {
    layer.remove();
    el.classList.remove("lifted");
    document.removeEventListener("keydown", esc);
    go(`/p/${p.id}`);
  });
}

// ---------- The Stitch Clock ----------
export function clockSvg(now = new Date()) {
  const r = readyBy(now);
  const cx = 120, cy = 120, R = 92;
  const ang = (d: Date) => ((d.getHours() % 12) + d.getMinutes() / 60) * 30 - 90;
  const pt = (deg: number, rad: number) => [cx + Math.cos((deg * Math.PI) / 180) * rad, cy + Math.sin((deg * Math.PI) / 180) * rad];
  const a0 = ang(r.start), a1 = a0 + 120; // four hours = 120 degrees
  const [sx, sy] = pt(a0, R - 14), [ex, ey] = pt(a1, R - 14);
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const [x1, y1] = pt(i * 30 - 90, R - 4), [x2, y2] = pt(i * 30 - 90, i % 3 ? R - 10 : R - 16);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#16130F" stroke-width="${i % 3 ? 1 : 2}"/>`;
  }).join("");
  const now0 = ang(now);
  const minute = now.getMinutes() * 6 - 90;
  return {
    label: r.label,
    today: r.today,
    svg: `<svg viewBox="0 0 240 240" class="stitch-clock" role="img" aria-label="Order now, ready ${r.label}">
      <circle cx="${cx}" cy="${cy}" r="${R + 10}" fill="#F6F0E6" stroke="#B48A4A" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy}" r="${R + 4}" fill="none" stroke="#B48A4A" stroke-width=".6" stroke-dasharray="2 3"/>
      ${ticks}
      <path class="stitch-arc" d="M ${sx} ${sy} A ${R - 14} ${R - 14} 0 0 1 ${ex} ${ey}" fill="none" stroke="#B3262B" stroke-width="3" stroke-linecap="round" stroke-dasharray="7 6"/>
      <circle cx="${ex}" cy="${ey}" r="5" fill="#B3262B"/>
      <g transform="rotate(${now0 + 90} ${cx} ${cy})" class="hand-scissors">
        <path d="M${cx - 5} ${cy + 2} L${cx - 3.5} ${cy - 50} Q${cx - 2} ${cy - 56} ${cx} ${cy - 58} L${cx + 1} ${cy + 2}Z" fill="#8a847c" stroke="#5a554e" stroke-width=".6"/>
        <path d="M${cx - 1} ${cy + 2} L${cx + 1.5} ${cy - 46} Q${cx + 3} ${cy - 52} ${cx + 6} ${cy - 53} L${cx + 5} ${cy + 2}Z" fill="#b2aca3" stroke="#5a554e" stroke-width=".6"/>
        <circle cx="${cx - 7}" cy="${cy + 14}" r="7.5" fill="none" stroke="#16130F" stroke-width="3"/>
        <circle cx="${cx + 7}" cy="${cy + 14}" r="7.5" fill="none" stroke="#16130F" stroke-width="3"/>
      </g>
      <g transform="rotate(${minute + 90} ${cx} ${cy})" class="hand-needle">
        <path d="M${cx - 1.6} ${cy + 10} L${cx} ${cy - 78} L${cx + 1.6} ${cy + 10}Z" fill="#B48A4A"/>
        <ellipse cx="${cx}" cy="${cy + 2}" rx="1" ry="3.4" fill="#F6F0E6"/>
        <path d="M${cx} ${cy + 4} C ${cx + 18} ${cy + 26}, ${cx - 14} ${cy + 40}, ${cx + 8} ${cy + 58}" stroke="#B3262B" stroke-width="1" fill="none"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="4" fill="#16130F"/>
    </svg>`,
  };
}

export function mountClock(el: HTMLElement) {
  const draw = () => {
    const c = clockSvg();
    el.querySelector(".clock-face")!.innerHTML = c.svg;
    el.querySelectorAll(".ready-by").forEach((n) => (n.textContent = c.label));
  };
  draw();
  const t = window.setInterval(draw, 30000);
  return () => window.clearInterval(t);
}

// ---------- The Measuring Tape ----------
export function mountTape(el: HTMLElement) {
  const strip = el.querySelector<HTMLElement>(".tape-strip")!;
  const out = el.querySelector<HTMLElement>(".tape-size")!;
  const val = el.querySelector<HTMLElement>(".tape-val")!;
  const MIN = 30, MAX = 56, PX = 46; // px per inch, close to a real tape on screen
  let inches = 40;
  // draw the tape once
  let marks = "";
  for (let i = MIN; i <= MAX; i += 0.25) {
    const whole = Number.isInteger(i);
    const half = !whole && Number.isInteger(i * 2);
    marks += `<i class="${whole ? "w" : half ? "h" : ""}" style="left:${(i - MIN) * PX}px">${whole ? `<b>${i}</b>` : ""}</i>`;
  }
  strip.innerHTML = marks;
  strip.style.width = `${(MAX - MIN) * PX + 2}px`;
  const render = () => {
    strip.style.transform = `translateX(${-(inches - MIN) * PX}px)`;
    val.textContent = `${inches.toFixed(1)}″`;
    const size = Math.min(48, Math.max(36, Math.round(inches / 2) * 2));
    out.innerHTML = inches < 34 ? "Kids' sizes, ask us" : inches > 50 ? "Made to measure, in 4 hours" : `Your size: <strong>${size}</strong>`;
  };
  let drag: { x: number; v: number } | null = null;
  el.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, v: inches };
    el.setPointerCapture(e.pointerId);
    el.classList.add("pulling");
  });
  el.addEventListener("pointermove", (e) => {
    if (!drag) return;
    inches = Math.min(MAX, Math.max(MIN, drag.v - (e.clientX - drag.x) / PX));
    inches = Math.round(inches * 4) / 4;
    render();
  });
  const end = () => {
    drag = null;
    el.classList.remove("pulling");
  };
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
  el.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") inches = Math.min(MAX, inches + 0.5);
    else if (e.key === "ArrowLeft") inches = Math.max(MIN, inches - 0.5);
    else return;
    e.preventDefault();
    render();
  });
  render();
}

// ---------- Three-way trial-room mirror ----------
export function mountMirror(el: HTMLElement) {
  let angle = 34;
  const set = () => el.style.setProperty("--wing", `${angle}deg`);
  let drag: { x: number; a: number } | null = null;
  el.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, a: angle };
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (drag) {
      angle = Math.max(12, Math.min(68, drag.a + (e.clientX - drag.x) * 0.25));
      set();
    }
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tilt", `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2)}deg`);
  });
  el.addEventListener("pointerup", () => (drag = null));
  el.addEventListener("pointerleave", () => el.style.setProperty("--tilt", "0deg"));
  set();
}

// ---------- MAHIB spotlight ----------
export function mountSpotlight(el: HTMLElement) {
  let idle = 0;
  let raf = 0;
  const move = (x: number, y: number) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${x - r.left}px`);
    el.style.setProperty("--my", `${y - r.top}px`);
  };
  el.addEventListener("pointermove", (e) => {
    idle = performance.now();
    move(e.clientX, e.clientY);
  });
  // drifts on its own when nobody is pointing
  const drift = (t: number) => {
    raf = requestAnimationFrame(drift);
    if (t - idle < 2500 || reduced()) return;
    const r = el.getBoundingClientRect();
    move(r.left + r.width * (0.5 + 0.32 * Math.sin(t / 2600)), r.top + r.height * (0.48 + 0.2 * Math.sin(t / 1900)));
  };
  raf = requestAnimationFrame(drift);
  return () => cancelAnimationFrame(raf);
}

// ---------- NRI boarding pass ----------
const CITIES: Record<string, { code: string; city: string; days: string }> = {
  LHR: { code: "LHR", city: "London", days: "5–7" },
  DXB: { code: "DXB", city: "Dubai", days: "3–5" },
  JFK: { code: "JFK", city: "New York", days: "6–9" },
  YYZ: { code: "YYZ", city: "Toronto", days: "6–9" },
  SYD: { code: "SYD", city: "Sydney", days: "7–10" },
  JED: { code: "JED", city: "Jeddah", days: "4–6" },
  SIN: { code: "SIN", city: "Singapore", days: "4–6" },
};
export function mountPass(el: HTMLElement) {
  const form = el.querySelector<HTMLFormElement>("form")!;
  const pass = el.querySelector<HTMLElement>(".pass")!;
  const sel = form.querySelector<HTMLSelectElement>("select")!;
  sel.innerHTML = Object.values(CITIES).map((c) => `<option value="${c.code}">${c.city} (${c.code})</option>`).join("");
  const date = form.querySelector<HTMLInputElement>('input[type="date"]')!;
  const d = new Date();
  d.setDate(d.getDate() + 75);
  date.value = d.toISOString().slice(0, 10);
  const render = () => {
    const name = (form.querySelector<HTMLInputElement>('input[name="groom"]')!.value.trim() || "The Groom").toUpperCase();
    const c = CITIES[sel.value]!;
    const wed = new Date(date.value || d);
    const ship = new Date(wed);
    ship.setDate(ship.getDate() - 21);
    const fmt = (x: Date) => x.toLocaleDateString("en-IN", { day: "numeric", month: "short" }).toUpperCase();
    pass.innerHTML = `
      <div class="pass-main">
        <p class="pass-air">MAQDOOM'S · GROOM CLASS</p>
        <div class="pass-route"><div><b>HYD</b><span>Hyderabad</span></div><div class="pass-plane">✈</div><div><b>${c.code}</b><span>${c.city}</span></div></div>
        <div class="pass-grid">
          <div><span>Passenger</span><b>${name}</b></div>
          <div><span>Wedding</span><b>${fmt(wed)}</b></div>
          <div><span>Video fitting</span><b>Within 48 hrs</b></div>
          <div><span>Ships by</span><b>${fmt(ship)}</b></div>
          <div><span>In transit</span><b>${c.days} days</b></div>
          <div><span>Seat</span><b>1A · Dulha</b></div>
        </div>
      </div>
      <div class="pass-stub">
        <p>CONCIERGE</p><b>${STORE.phone}</b>
        <div class="pass-code" aria-hidden="true">${Array.from({ length: 34 }, (_, i) => `<i style="width:${1 + ((i * 7) % 3)}px"></i>`).join("")}</div>
        <a class="btn btn-gold" target="_blank" rel="noopener" href="https://wa.me/${STORE.wa}?text=${encodeURIComponent(`Hello Maqdoom's, I'm getting married in ${c.city} on ${fmt(wed)}. I'd like a video fitting. Name: ${name}`)}">Book video fitting</a>
      </div>`;
  };
  form.addEventListener("input", render);
  render();
}
