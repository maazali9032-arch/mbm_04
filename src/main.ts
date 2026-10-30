import "./styles.css";
import { STORE } from "./data";
import { bespoke, home, mahib, product, shop, visitPage, type Page } from "./pages";

const app = document.getElementById("app")!;
const header = document.getElementById("site-header")!;
let cleanup: (() => void) | void;

// The knot emblem from the shop sign (a stand-in until the official logo file is supplied).
const knot = `<svg viewBox="0 0 40 40" class="knot" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
  <path d="M20 6c5 0 7 4 7 7s-2 5-7 7c-5-2-7-4-7-7s2-7 7-7Z"/><path d="M20 34c-5 0-7-4-7-7s2-5 7-7c5 2 7 4 7 7s-2 7-7 7Z"/>
  <path d="M6 20c0-5 4-7 7-7s5 2 7 7c-2 5-4 7-7 7s-7-2-7-7Z"/><path d="M34 20c0 5-4 7-7 7s-5-2-7-7c2-5 4-7 7-7s7 2 7 7Z"/></g></svg>`;

const NAV = [
  ["#/shop", "Shop"],
  ["#/shop?ceremony=nikah", "Ceremonies"],
  ["#/mahib", "mahib"],
  ["#/bespoke", "4-Hour Stitching"],
  ["#/visit", "Worldwide & Visit"],
];

header.innerHTML = `
  <div class="wrap head-row">
    <a href="#/" class="brand" aria-label="Maqdoom's Big Mall, home">${knot}<span class="brand-text"><span class="brand-script">Maqdoom's</span><span class="brand-mall">BIG MALL</span></span></a>
    <nav class="nav" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}"${t === "mahib" ? ' class="nav-mahib"' : ""}>${t}</a>`).join("")}</nav>
    <div class="head-actions">
      <a class="wa" target="_blank" rel="noopener" href="https://wa.me/${STORE.wa}" aria-label="Chat with our concierge on WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>
        <span>Concierge</span></a>
      <button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
    </div>
  </div>
  <div class="drawer" hidden><nav aria-label="Menu">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</nav>
    <p>${STORE.name} · ${STORE.area}<br>${STORE.phone} · mahib ${STORE.mahibPhone}</p></div>`;

const menuBtn = header.querySelector<HTMLButtonElement>(".menu-btn")!;
const drawer = header.querySelector<HTMLElement>(".drawer")!;
const setMenu = (open: boolean) => {
  drawer.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  header.classList.toggle("menu-open", open);
  document.body.style.overflow = open ? "hidden" : "";
};
menuBtn.addEventListener("click", () => setMenu(drawer.hidden));
drawer.addEventListener("click", (e) => (e.target as Element).closest("a") && setMenu(false));

document.getElementById("site-footer")!.innerHTML = `
  <div class="footer-border" aria-hidden="true"></div>
  <div class="wrap foot-grid">
    <div><a href="#/" class="brand light">${knot}<span class="brand-text"><span class="brand-script">Maqdoom's</span><span class="brand-mall">BIG MALL</span></span></a>
      <p>Groom couture, ready-to-wear and made-to-measure. ${STORE.area}.</p></div>
    <div><h4>Shop</h4><a href="#/shop?c=sherwanis">Sherwanis</a><a href="#/shop?c=suits">Suits & Tuxedos</a><a href="#/shop?c=bandhgalas">Bandhgalas</a><a href="#/shop?c=kurtas">Kurta Sets</a><a href="#/shop?c=pellikoduku">Pellikoduku</a><a href="#/shop?c=fabrics">Fabrics</a></div>
    <div><h4>The house</h4><a href="#/mahib">mahib atelier</a><a href="#/bespoke">4-hour stitching</a><a href="#/visit">Worldwide</a><a href="#/visit">Visit the showroom</a></div>
    <div><h4>Talk to us</h4><a href="tel:${STORE.phone.replace(/\s/g, "")}">${STORE.phone}</a><a href="tel:${STORE.mahibPhone.replace(/\s/g, "")}">mahib ${STORE.mahibPhone}</a>
      <a target="_blank" rel="noopener" href="${STORE.instagram}">@maqdooms_bigmall</a><a target="_blank" rel="noopener" href="${STORE.mahibInstagram}">@mahib_by_moghnymaqdoom</a></div>
  </div>
  <p class="wrap fine">Design prototype · ${new Date().getFullYear()}</p>`;

// ---------- routing ----------
function route(): Page {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [path, query = ""] = raw.split("?");
  const parts = (path ?? "/").split("/").filter(Boolean);
  const params = new URLSearchParams(query);
  if (!parts.length) return home();
  if (parts[0] === "shop") return shop(params);
  if (parts[0] === "p" && parts[1]) return product(parts[1]);
  if (parts[0] === "mahib") return mahib();
  if (parts[0] === "bespoke") return bespoke();
  if (parts[0] === "visit") return visitPage();
  return home();
}

const go = (path: string) => {
  location.hash = path;
};

function render() {
  if (typeof cleanup === "function") cleanup();
  const page = route();
  document.title = page.title;
  document.body.classList.toggle("dark", !!page.dark);
  app.classList.remove("in");
  app.innerHTML = page.html;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => app.classList.add("in"));
  cleanup = page.mount?.(app, go);
  // one nav item at a time: ceremony pages light "Ceremonies", other shop pages light "Shop"
  const hash = location.hash || "#/";
  const current = hash.includes("ceremony=") ? "Ceremonies" : hash.startsWith("#/shop") || hash.startsWith("#/p/") ? "Shop" : hash.startsWith("#/mahib") ? "mahib" : hash.startsWith("#/bespoke") ? "4-Hour Stitching" : hash.startsWith("#/visit") ? "Worldwide & Visit" : "";
  header.querySelectorAll<HTMLAnchorElement>(".nav a").forEach((a) => a.classList.toggle("on", a.textContent === current));
}

window.addEventListener("hashchange", render);
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 24), { passive: true });
render();
