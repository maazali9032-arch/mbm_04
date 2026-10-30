# Maqdoom's · The Groom's House

A new website design concept for Maqdoom's Big Mall, Pathergatti, Hyderabad, and its couture label MAHIB.
It's a local prototype only, independent of the live storefront, the ERP and every other repository.

- **The design plan is in [DESIGN.md](DESIGN.md):** positioning against competitors, brand system, sitemap, page-by-page copy, UX rules and roadmap.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5182`. To try it on a phone on the same Wi-Fi, open the "Network" address Vite prints.

Photos are **read in place** from `../MBM_03/public` (see `vite.config.ts`). Nothing there is copied, moved or edited.

## What to try

| Where | What |
|---|---|
| Home, top | **The Sehra:** touch or move over the pearl strands. Tap **Lift the sehra**, or scroll, to tie the veil back. |
| Home, scrolling | **The Wedding Days:** Haldi petals → Mehendi henna drawing itself → Sangeet sparkles → Nikah gold → Reception night → Pellikoduku jasmine. |
| Home and Shop | **The Rail:** drag it, or use the arrows. The hangers swing with momentum. Tap a piece and it lifts off its hook. |
| Home and Bespoke | **The Stitch Clock:** scissors and needle hands, with the four-hour arc sewn to your "ready by" time. |
| Home and Bespoke | **The Measuring Tape:** drag it, or use the arrow keys, to read your size. |
| Product page | **Three-way mirror:** drag to turn the side panels. Choosing a colour, size and way to buy builds the WhatsApp message. |
| MAHIB | **Lightbox:** move your pointer or finger; it's the spotlight. |
| Home and Worldwide | **Boarding pass:** type a name, city and wedding date. |

## Files

- `src/sehra.ts`: the pearl and jasmine veil (strand physics, drawn on canvas)
- `src/days.ts`: the wedding-days scroll journey (colour moods, particles, henna)
- `src/widgets.ts`: rail, lift, stitch clock, measuring tape, mirror, spotlight, boarding pass
- `src/pages.ts`: page layouts and copy; `src/data.ts`: sample catalogue and store details
- `src/main.ts`: header, footer, menu and routing; `src/styles.css`: the whole visual system

## To confirm with the shop

Showroom hours (11 AM–10 PM is a placeholder), delivery times, countries, exchange policy, official logo files,
and real photos per product and colour (several sample products share a photo).
