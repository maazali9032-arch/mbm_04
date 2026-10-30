// Page templates (HTML) and the behaviour each page mounts.

import { byId, CATEGORIES, CEREMONIES, inr, PRODUCTS, STORE, waLink, type Product } from "./data";
import { Sehra } from "./sehra";
import { WeddingDays } from "./days";
import { clockSvg, mountClock, mountMirror, mountPass, mountRail, mountSpotlight, mountTape } from "./widgets";

export type Page = { title: string; html: string; mount?: (root: HTMLElement, go: (p: string) => void) => (() => void) | void; dark?: boolean };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// ---------- shared pieces ----------
const hanger = `<svg class="hook" viewBox="0 0 60 34" aria-hidden="true"><path d="M30 2c4 0 6 3 6 5.5S33 12 30 13.5V18M30 18 3 31h54L30 18Z" fill="none" stroke="#7a6a52" stroke-width="2.2" stroke-linejoin="round"/></svg>`;

function railItem(p: Product) {
  return `<button class="rail-item" data-id="${p.id}" aria-label="${esc(p.name)}, ${inr(p.price)}">
    <span class="hanger">${hanger}
      <span class="garment${p.cutout ? " cutout" : ""}"><img src="${p.img}" alt="" loading="lazy"></span>
      <span class="tag"><em>${p.mahib ? "MAHIB" : "Maqdoom's"}</em><b>${inr(p.price)}</b><small>${esc(p.name)}</small></span>
    </span>
  </button>`;
}

function rail(products: Product[], title: string, sub: string) {
  return `<section class="rail" aria-label="${esc(title)}">
    <div class="wrap rail-head">
      <div><p class="eyebrow">The Rail</p><h2>${title}</h2><p class="lede">${sub}</p></div>
      <div class="rail-nav"><button class="rail-prev" aria-label="Previous pieces">←</button><button class="rail-next" aria-label="More pieces">→</button></div>
    </div>
    <div class="rail-bar" aria-hidden="true"></div>
    <div class="rail-track">${products.map(railItem).join("")}</div>
  </section>`;
}

function card(p: Product) {
  return `<a class="card" href="#/p/${p.id}">
    <span class="card-img${p.cutout ? " cutout" : ""}"><img src="${p.img}" alt="" loading="lazy">${p.mtm ? `<span class="chip">4-hr stitching</span>` : ""}${p.mahib ? `<span class="chip chip-mahib">mahib</span>` : ""}</span>
    <span class="card-name">${esc(p.name)}</span>
    <span class="card-meta">${inr(p.price)}${p.unit ? ` ${p.unit}` : ""} <span class="dots">${p.colours.map((c) => `<i style="--sw:${c.hex}" title="${c.name}"></i>`).join("")}</span></span>
  </a>`;
}

const clockBlock = (title: string) => {
  const c = clockSvg();
  return `<div class="clock-block">
    <div class="clock-face">${c.svg}</div>
    <div>
      <p class="eyebrow">Four-hour stitching</p>
      <h2>${title}</h2>
      <p class="big-ready">Order now, ready <span class="ready-by">${c.label}</span>.</p>
      <ol class="steps">
        <li><b>Choose</b> a piece, or pick your fabric from our thaan wall.</li>
        <li><b>Measure</b> with our master tailors, in the showroom or on a video call.</li>
        <li><b>Collect in four hours</b>, pressed and fitted, or we send it to you.</li>
      </ol>
    </div>
  </div>`;
};

const tape = `<div class="tape" tabindex="0" role="slider" aria-label="Chest measurement in inches" aria-valuemin="30" aria-valuemax="56">
  <div class="tape-window"><div class="tape-strip"></div><span class="tape-needle"></span></div>
  <div class="tape-read"><span class="tape-val">40″</span><span class="tape-size"></span></div>
  <p class="tape-hint">Drag the tape to your chest measurement</p>
</div>`;

const faq = `<section class="faq wrap" aria-label="Questions">
  <p class="eyebrow">Answered with care</p>
  <h2>Before you visit</h2>
  ${[
    ["Can you really stitch in four hours?", "Yes. Choose a piece or a fabric, our master tailors take your measurements, and it is ready, pressed and fitted, about four hours later during showroom hours. Heavier couture from MAHIB takes longer; we will tell you the exact day."],
    ["Are alterations included?", "Every piece is altered to your fit, free of charge, in the showroom or after a video fitting if you are abroad."],
    ["Which sizes and colours do you carry?", "Most pieces come in sizes 36 to 48 and in several colours. If your size or colour is not on the rail, we make it to measure."],
    ["Do you deliver outside India?", "Yes. We dress NRI grooms in the UK, US, Canada, the Gulf, Australia and more, with a video fitting and tracked delivery timed to your wedding date."],
    ["What is MAHIB?", "MAHIB by Moghny Maqdoom is our couture house within the mall: hand-worked sherwanis and statement pieces, by appointment."],
    ["Can the whole family dress together?", "Yes. Brothers, fathers and little ones can match the groom. Tell us the ceremony and we will style the group."],
  ]
    .map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`)
    .join("")}
</section>`;

const visit = `<section class="visit" aria-label="Visit the showroom">
  <div class="wrap visit-grid">
    <div>
      <p class="eyebrow">Visit the house</p>
      <h2>${STORE.name}<br><span>${STORE.area}</span></h2>
      <p class="lede">Four floors of sherwanis, suits and fabrics, a tailoring floor that works while you wait, and the MAHIB atelier inside.</p>
      <p class="hours">Open daily · ${STORE.open}:00 AM – ${STORE.close - 12}:00 PM <small>(hours to confirm)</small></p>
      <div class="visit-actions">
        <a class="btn btn-dark" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Maqdoom's Big Mall Pathergatti Hyderabad")}">Get directions</a>
        <a class="btn btn-line" href="tel:${STORE.phone.replace(/\s/g, "")}">Call ${STORE.phone}</a>
      </div>
    </div>
    <figure class="visit-photo"><img src="/images/hero_bg.webp" alt="" loading="lazy"><figcaption>Pathergatti, in the old city of Hyderabad</figcaption></figure>
  </div>
</section>`;

// ---------- Home ----------
export function home(): Page {
  const days = CEREMONIES.map(
    (c, i) => `<article class="day${i === 0 ? " on" : ""}"><p class="eyebrow">Day ${i + 1}</p><h2>${c.name}</h2><p>${c.line}</p><a class="btn btn-day" href="#/shop?ceremony=${c.id}">Dress for ${c.name}</a></article>`,
  ).join("");
  const looks = CEREMONIES.map((c, i) => `<img src="${c.img}" alt="" class="${i === 0 ? "on" : ""}${c.photo ? " photo" : ""}" loading="lazy">`).join("");
  return {
    title: "Maqdoom's · The Groom's House",
    html: `
    <section class="hero" aria-label="Maqdoom's">
      <div class="hero-stage">
        <div class="arch" aria-hidden="true"></div>
        <img class="hero-groom" src="/images/hero_section_person_a_1.1.webp" alt="A groom in an ivory zardozi sherwani with a maroon velvet dupatta">
      </div>
      <canvas class="sehra" aria-hidden="true"></canvas>
      <div class="hero-copy wrap">
        <p class="eyebrow">Groom couture · Pathergatti, Hyderabad</p>
        <h1>Dressed for the day<br>you'll never forget.</h1>
        <p class="lede">Groom couture, ready-to-wear and made-to-measure, stitched in as little as four hours.</p>
        <div class="hero-actions">
          <a class="btn btn-dark" href="#/shop">Shop the Dulha Edit</a>
          <a class="btn btn-line" href="#/bespoke">Book a fitting</a>
        </div>
      </div>
      <button class="reveal" type="button"><span>Lift the sehra</span></button>
    </section>

    <section class="promises" aria-label="Our promise">
      <div class="wrap promise-row">
        <p><b>4 hours</b><span>made-to-measure stitching</span></p>
        <p><b>Free</b><span>alterations to your fit</span></p>
        <p><b>36–48</b><span>every size, many colours</span></p>
        <p><b>Worldwide</b><span>for the NRI groom</span></p>
      </div>
    </section>

    <section class="days" aria-label="The wedding days">
      <div class="days-stage">
        <canvas class="days-fx" aria-hidden="true"></canvas>
        <svg class="days-henna" viewBox="0 0 640 260" aria-hidden="true">
          <path d="M10 210 C 90 170, 150 230, 230 190 S 360 140, 420 170"/>
          <path d="M70 196 c -6 -26 10 -40 28 -40 c -4 18 -12 32 -28 40 Z M150 214 c 2 26 -14 40 -30 40 c 2 -18 12 -32 30 -40 Z M200 196 c -6 -26 10 -40 28 -40 c -4 18 -12 32 -28 40 Z M300 166 c 2 -26 22 -36 38 -32 c -8 16 -20 28 -38 32 Z M350 158 c 0 26 -16 38 -32 36 c 4 -18 14 -30 32 -36 Z"/>
          <path d="M470 220 C 400 220, 400 110, 470 70 C 530 36, 600 70, 590 130 C 582 176, 540 196, 520 160 C 506 136, 530 118, 548 128"/>
          <path d="M478 196 C 430 190, 436 116, 486 92 C 526 74, 568 100, 562 134 C 556 160, 528 168, 520 150"/>
          <path d="M488 170 C 466 160, 470 128, 494 116 C 512 108, 534 118, 532 136"/>
          <path d="M420 170 C 444 178, 458 196, 470 220"/>
          <path d="M556 40 c 8 -8 20 -8 24 0 c 4 8 -4 18 -12 18 c -8 0 -16 -10 -12 -18 Z M568 30 v -14 M584 40 l 12 -8 M552 40 l -12 -8"/>
          <path class="dots" d="M30 230 h0 M60 236 h0 M95 240 h0 M130 244 h0 M165 242 h0 M240 214 h0 M276 206 h0 M312 196 h0 M384 190 h0 M600 160 h0 M606 120 h0 M598 82 h0 M574 54 h0"/>
        </svg>
        <div class="days-look">${looks}</div>
        <div class="days-copy wrap">${days}</div>
        <ol class="days-dots">${CEREMONIES.map((c) => `<li>${c.name}</li>`).join("")}</ol>
      </div>
    </section>

    ${rail(PRODUCTS.filter((p) => p.category !== "fabrics"), "Walk the rail.", "Our showroom wall, in your hand. Drag to walk along it, tap a piece to take it off the hook.")}

    <section class="mahib-band" aria-label="MAHIB">
      <img src="/images/section_3_bg.webp" alt="" loading="lazy">
      <div class="wrap mahib-band-copy">
        <p class="mahib-word">mahib</p>
        <p class="mahib-by">by Moghny Maqdoom</p>
        <h2>The house within the house.</h2>
        <p class="lede">Couture for the groom who wants to be remembered. Hand zardozi, pearls and velvet, made in our atelier inside Maqdoom's.</p>
        <p class="mahib-cols">Latest Dulha 2026 · The Kashmiri Collection · For the NRI Dulha</p>
        <a class="btn btn-gold" href="#/mahib">Enter the atelier</a>
      </div>
    </section>

    <section class="wrap clock-section">${clockBlock("Stitched while you celebrate.")}</section>

    <section class="fit wrap" aria-label="Find your size">
      <div><p class="eyebrow">Your size, then your fit</p><h2>Every piece, altered to you.</h2>
      <p class="lede">Find your size with a tailor's tape, then our master tailors alter it to your body: free, in the showroom or after a video fitting.</p></div>
      ${tape}
    </section>

    <section class="world" aria-label="Worldwide">
      <div class="wrap world-grid">
        <div><p class="eyebrow">From Pathergatti to the world</p><h2>Getting married abroad?</h2>
        <p class="lede">Video fitting, a measurement guide written by our tailors, and tracked delivery timed to your wedding. Your ticket is below.</p>
        <a class="btn btn-line" href="#/visit">How it works</a></div>
        <div class="pass-wrap">
          <form class="pass-form" onsubmit="return false">
            <label>Groom's name<input name="groom" placeholder="Your name" autocomplete="name"></label>
            <label>Wedding city<select name="city"></select></label>
            <label>Wedding date<input type="date" name="date"></label>
          </form>
          <div class="pass"></div>
        </div>
      </div>
    </section>

    <section class="insta wrap" aria-label="From the showroom">
      <div class="insta-head"><div><p class="eyebrow">From the showroom</p><h2>On the floor this week</h2></div>
      <a class="btn btn-line" target="_blank" rel="noopener" href="${STORE.instagram}">@maqdooms_bigmall</a></div>
      <div class="insta-row">${["/test_images/SHW3.webp", "/images/section_2_sherwanis.webp", "/test_images/SHW2.webp", "/images/section_6_tailoring_image.webp", "/images/section_2_fabrics.webp", "/images/section_2_accessories.webp"]
        .map((s) => `<a target="_blank" rel="noopener" href="${STORE.instagram}"><img src="${s}" alt="" loading="lazy"></a>`)
        .join("")}</div>
    </section>

    ${faq}
    ${visit}`,
    mount(root, go) {
      const offs: (() => void)[] = [];
      const canvas = root.querySelector<HTMLCanvasElement>(".sehra")!;
      const sehra = new Sehra(canvas);
      const hero = root.querySelector<HTMLElement>(".hero")!;
      let manual = false;
      const onScroll = () => {
        const p = Math.min(1, window.scrollY / (hero.offsetHeight * 0.45));
        if (!manual || p > sehra.parted) sehra.setPart(Math.max(manual ? 1 : 0, p));
        hero.style.setProperty("--reveal", String(Math.max(p, manual ? 1 : 0)));
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      const btn = root.querySelector<HTMLButtonElement>(".reveal")!;
      btn.addEventListener("click", () => {
        manual = !manual || sehra.parted < 0.5;
        sehra.setPart(manual ? 1 : 0);
        hero.style.setProperty("--reveal", manual ? "1" : "0");
        btn.querySelector("span")!.textContent = manual ? "Lower the sehra" : "Lift the sehra";
      });
      // first glimpse: the veil lifts a little on its own
      const t = window.setTimeout(() => {
        if (!manual && window.scrollY < 10) sehra.setPart(0.32);
      }, 1700);
      onScroll();
      offs.push(() => {
        sehra.destroy();
        window.removeEventListener("scroll", onScroll);
        window.clearTimeout(t);
      });
      const days = new WeddingDays(root.querySelector(".days")!);
      offs.push(() => days.destroy());
      const r = mountRail(root.querySelector(".rail")!, go);
      offs.push(r);
      const c = mountClock(root.querySelector(".clock-block")!);
      offs.push(c);
      mountTape(root.querySelector(".tape")!);
      mountPass(root.querySelector(".pass-wrap")!);
      return () => offs.forEach((f) => f());
    },
  };
}

// ---------- Shop ----------
export function shop(params: URLSearchParams): Page {
  const cat = params.get("c") ?? "";
  const cer = params.get("ceremony") ?? "";
  const size = params.get("size") ?? "";
  const list = PRODUCTS.filter((p) => (!cat || p.category === cat) && (!cer || p.ceremonies.includes(cer as never)) && (!size || p.sizes.includes(size)));
  const ceremony = CEREMONIES.find((c) => c.id === cer);
  const q = (k: string, v: string) => {
    const n = new URLSearchParams(params);
    if (n.get(k) === v || !v) n.delete(k);
    else n.set(k, v);
    const s = n.toString();
    return `#/shop${s ? `?${s}` : ""}`;
  };
  const title = ceremony ? `Dressed for ${ceremony.name}` : CATEGORIES.find((c) => c.id === cat)?.name ?? "The Dulha Edit";
  return {
    title: `${title} · Maqdoom's`,
    html: `
    <section class="shop-head wrap"${ceremony ? ` style="--day-a:${ceremony.mood[0]};--day-b:${ceremony.mood[1]}"` : ""}>
      <p class="eyebrow">${ceremony ? ceremony.line : "Sherwanis · suits · bandhgalas · kurtas · fabrics"}</p>
      <h1>${title}</h1>
      <div class="filters" role="navigation" aria-label="Filters">
        <div class="chips">${CATEGORIES.map((c) => `<a class="chip-f${c.id === cat ? " on" : ""}" href="${q("c", c.id)}">${c.name}</a>`).join("")}</div>
        <div class="chips">${CEREMONIES.map((c) => `<a class="chip-f day-chip${c.id === cer ? " on" : ""}" style="--d:${c.mood[0]}" href="${q("ceremony", c.id)}">${c.name}</a>`).join("")}</div>
        <div class="chips">${["36", "38", "40", "42", "44", "46", "48"].map((s) => `<a class="chip-f size${s === size ? " on" : ""}" href="${q("size", s)}">${s}</a>`).join("")}</div>
      </div>
    </section>
    ${list.length > 3 ? rail(list, "On the rail", "Drag the rail, tap a piece.") : ""}
    <section class="wrap grid">${list.length ? list.map(card).join("") : `<p class="empty">Nothing on the rail for this yet. <a href="#/bespoke">We'll make it to measure in four hours →</a></p>`}</section>`,
    mount(root, go) {
      const r = root.querySelector<HTMLElement>(".rail");
      return r ? mountRail(r, go) : undefined;
    },
  };
}

// ---------- Product ----------
export function product(id: string): Page {
  const p = byId(id);
  if (!p) return { title: "Not found", html: `<section class="wrap empty"><h1>This piece has left the rail.</h1><a class="btn btn-dark" href="#/shop">Back to the rail</a></section>` };
  const shots = [p.img, ...(p.close ?? [])];
  const completes = PRODUCTS.filter((x) => x.category === "accessories" && x.id !== p.id).slice(0, 3);
  const c = clockSvg();
  return {
    title: `${p.name} · Maqdoom's`,
    html: `
    <section class="pdp wrap">
      <div class="pdp-media">
        <div class="mirror${p.cutout ? " cutout" : ""}" aria-label="Three-way mirror: drag to turn the side panels">
          <div class="pane left"><img src="${p.img}" alt=""></div>
          <div class="pane center"><img src="${p.img}" alt="${esc(p.name)}"></div>
          <div class="pane right"><img src="${p.img}" alt=""></div>
          <span class="mirror-hint">Drag to turn the mirror</span>
        </div>
        <div class="thumbs">${shots.map((s, i) => `<button data-src="${s}" class="${i === 0 ? "on" : ""}" aria-label="Photo ${i + 1}"><img src="${s}" alt=""></button>`).join("")}</div>
      </div>
      <div class="pdp-info">
        <a class="back" href="#/shop">← The rail</a>
        <p class="eyebrow">${p.mahib ? "mahib · couture · " : ""}${p.work}</p>
        <h1>${esc(p.name)}</h1>
        <div class="pdp-price"><span>${inr(p.price)}${p.unit ? ` <small>${p.unit}</small>` : ""}</span><span class="pdp-tag" aria-hidden="true">${p.mtm ? "4-HR" : "MAHIB"}</span></div>
        <p class="pdp-note">${p.note}</p>
        <fieldset class="opt"><legend>Colour <span class="opt-val">${p.colours[0]!.name}</span></legend>
          <div class="swatches big">${p.colours.map((c, i) => `<button type="button" data-colour="${c.name}" class="${i === 0 ? "on" : ""}" style="--sw:${c.hex}" aria-label="${c.name}"></button>`).join("")}</div>
        </fieldset>
        <fieldset class="opt"><legend>Size <span class="opt-val">Choose</span> <a href="#/bespoke" class="sizehelp">Find my size</a></legend>
          <div class="sizes">${p.sizes.map((s) => `<button type="button" data-size="${s}">${s}</button>`).join("")}</div>
        </fieldset>
        <fieldset class="opt"><legend>How would you like it?</legend>
          <div class="ways">
            <label><input type="radio" name="way" value="Ready to wear" checked><span><b>Ready to wear</b><small>Altered to your fit, free</small></span></label>
            ${p.mtm ? `<label><input type="radio" name="way" value="Made to measure (4 hours)"><span><b>Made to measure</b><small>Ready <span class="ready-by">${c.label}</span></small></span></label>` : `<label><input type="radio" name="way" value="Couture appointment"><span><b>Couture appointment</b><small>With the MAHIB atelier</small></span></label>`}
          </div>
        </fieldset>
        <a class="btn btn-dark btn-wide wa-order" target="_blank" rel="noopener" href="#">Order with our concierge on WhatsApp</a>
        <dl class="craft">
          <div><dt>Fabric</dt><dd>${p.fabric}</dd></div>
          <div><dt>Work</dt><dd>${p.work}</dd></div>
          <div><dt>For</dt><dd>${p.ceremonies.map((x) => CEREMONIES.find((c) => c.id === x)?.name).join(", ")}</dd></div>
          <div><dt>Delivery</dt><dd>Hyderabad today · India 2–4 days · Worldwide 5–9 days <small>(to confirm)</small></dd></div>
        </dl>
      </div>
    </section>
    ${completes.length ? `<section class="wrap complete"><p class="eyebrow">Complete the look</p><div class="grid small">${completes.map(card).join("")}</div></section>` : ""}`,
    mount(root) {
      const mirror = root.querySelector<HTMLElement>(".mirror")!;
      mountMirror(mirror);
      root.querySelectorAll<HTMLButtonElement>(".thumbs button").forEach((b) =>
        b.addEventListener("click", () => {
          root.querySelectorAll(".thumbs button").forEach((x) => x.classList.toggle("on", x === b));
          mirror.querySelectorAll("img").forEach((img) => (img.src = b.dataset.src!));
          mirror.classList.toggle("cutout", b.dataset.src === p.img && !!p.cutout);
        }),
      );
      const state = { colour: p.colours[0]!.name, size: "", way: "Ready to wear" };
      const order = root.querySelector<HTMLAnchorElement>(".wa-order")!;
      const update = () => {
        order.href = waLink(p, `Hello Maqdoom's, I'd like to order:\n${p.name}\nColour: ${state.colour}\nSize: ${state.size || "help me choose"}\n${state.way}`);
      };
      root.querySelectorAll<HTMLButtonElement>("[data-colour]").forEach((b) =>
        b.addEventListener("click", () => {
          state.colour = b.dataset.colour!;
          root.querySelectorAll("[data-colour]").forEach((x) => x.classList.toggle("on", x === b));
          b.closest("fieldset")!.querySelector(".opt-val")!.textContent = state.colour;
          update();
        }),
      );
      root.querySelectorAll<HTMLButtonElement>("[data-size]").forEach((b) =>
        b.addEventListener("click", () => {
          state.size = b.dataset.size!;
          root.querySelectorAll("[data-size]").forEach((x) => x.classList.toggle("on", x === b));
          b.closest("fieldset")!.querySelector(".opt-val")!.textContent = state.size;
          update();
        }),
      );
      root.querySelectorAll<HTMLInputElement>('input[name="way"]').forEach((r) =>
        r.addEventListener("change", () => {
          state.way = r.value;
          update();
        }),
      );
      update();
    },
  };
}

// ---------- MAHIB ----------
export function mahib(): Page {
  const pieces = PRODUCTS.filter((p) => p.mahib);
  return {
    title: "MAHIB by Moghny Maqdoom",
    dark: true,
    html: `
    <section class="lightbox" aria-label="MAHIB atelier">
      <div class="lb-images" aria-hidden="true">
        <img src="/test_images/SHW2.webp" alt=""><img src="/test_images/SHW3.webp" alt=""><img src="/test_images/SHW1.webp" alt="">
      </div>
      <div class="lb-dark" aria-hidden="true"></div>
      <div class="lb-copy wrap">
        <p class="mahib-word">mahib</p>
        <p class="mahib-by">by Moghny Maqdoom</p>
        <h1>Couture, by hand,<br>for one groom at a time.</h1>
        <p class="lede">Move your light across the work.</p>
      </div>
    </section>
    <section class="wrap mahib-cols-grid">
      ${[
        ["Latest Dulha", "Wedding season 2026", "Pastel sherwanis with floral resham and zardozi, cut long and slim.", "/test_images/SHW2.webp"],
        ["The Kashmiri Collection", "Embroidery on rich velvet", "Kashmiri-inspired colour work on midnight velvet, with matching shawls.", "/test_images/SHW3.webp"],
        ["For the NRI Dulha", "Made to travel", "Velvet sherwanis with silver work, styled with safa and pearl mala, fitted by video and delivered for the day.", "/test_images/SHW1.webp"],
      ]
        .map(([t, s, d, img]) => `<article class="mcol"><img src="${img}" alt="" loading="lazy"><p class="eyebrow">${s}</p><h2>${t}</h2><p>${d}</p></article>`)
        .join("")}
    </section>
    <section class="wrap atelier">
      <figure><img src="/images/section_6_tailoring_image.webp" alt="A master tailor cutting fabric" loading="lazy"></figure>
      <div><p class="eyebrow">The atelier</p><h2>Sketch. Embroider. Fit.</h2>
        <ol class="steps light">
          <li><b>Sketch</b> the sherwani with you: silhouette, colour, motifs.</li>
          <li><b>Embroider</b> by hand: zardozi, resham, pearl and cut-dana, panel by panel.</li>
          <li><b>Fit</b> in the atelier or by video, until it falls exactly right.</li>
        </ol>
        <a class="btn btn-gold" target="_blank" rel="noopener" href="https://wa.me/${STORE.mahibWa}?text=${encodeURIComponent("Hello MAHIB, I'd like a couture appointment.")}">Book an atelier appointment</a>
        <p class="small">MAHIB · ${STORE.mahibPhone} · <a target="_blank" rel="noopener" href="${STORE.mahibInstagram}">@mahib_by_moghnymaqdoom</a></p>
      </div>
    </section>
    ${pieces.length ? `<section class="wrap"><div class="grid">${pieces.map(card).join("")}</div></section>` : ""}`,
    mount(root) {
      return mountSpotlight(root.querySelector(".lightbox")!);
    },
  };
}

// ---------- Bespoke ----------
export function bespoke(): Page {
  return {
    title: "Four-hour stitching · Maqdoom's",
    html: `
    <section class="wrap clock-section first">${clockBlock("Made to measure in four hours.")}</section>
    <section class="fit wrap" aria-label="Find your size">
      <div><p class="eyebrow">Find your size</p><h2>Pull the tape.</h2><p class="lede">Measure around the fullest part of your chest, then drag the tape to that number.</p></div>
      ${tape}
    </section>
    <section class="wrap how">
      ${[
        ["Alterations, free", "Ready-to-wear pieces are altered to you before they leave: sleeves, length, waist and shoulders."],
        ["Your fabric, our cut", "Bring a fabric or choose from our thaan wall: brocade, kimkhab, silk, velvet, linen."],
        ["Measured once, remembered", "Your measurements are kept for the next ceremony, and for the next wedding in the family."],
        ["Abroad? Video fitting", "Our tailors guide you on a call, then tailor and ship to your wedding city."],
      ]
        .map(([t, d]) => `<article><h3>${t}</h3><p>${d}</p></article>`)
        .join("")}
    </section>
    <section class="wrap cta-band"><h2>Ready when you are.</h2><a class="btn btn-dark" target="_blank" rel="noopener" href="https://wa.me/${STORE.wa}?text=${encodeURIComponent("Hello Maqdoom's, I'd like a 4-hour stitching appointment.")}">Book on WhatsApp</a></section>`,
    mount(root) {
      const off = mountClock(root.querySelector(".clock-block")!);
      mountTape(root.querySelector(".tape")!);
      return off;
    },
  };
}

// ---------- Visit & Worldwide ----------
export function visitPage(): Page {
  return {
    title: "Visit & worldwide · Maqdoom's",
    html: `${visit}
    <section class="world" aria-label="Worldwide">
      <div class="wrap world-grid">
        <div><p class="eyebrow">From Pathergatti to the world</p><h2>How it works abroad</h2>
          <ol class="steps"><li><b>Book a video fitting</b> on WhatsApp at a time that suits your time zone.</li><li><b>Measure with us</b>: our tailor guides you, step by step.</li><li><b>Choose and approve</b> pieces live on camera from the showroom floor.</li><li><b>Tracked delivery</b>, timed to arrive three weeks before the wedding.</li></ol>
        </div>
        <div class="pass-wrap">
          <form class="pass-form" onsubmit="return false">
            <label>Groom's name<input name="groom" placeholder="Your name" autocomplete="name"></label>
            <label>Wedding city<select name="city"></select></label>
            <label>Wedding date<input type="date" name="date"></label>
          </form>
          <div class="pass"></div>
        </div>
      </div>
    </section>
    ${faq}`,
    mount(root) {
      mountPass(root.querySelector(".pass-wrap")!);
    },
  };
}
