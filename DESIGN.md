# MAQDOOM'S · The Groom's House
### Website design plan

A new storefront concept for Maqdoom's Big Mall, Pathergatti, Hyderabad, and its couture label
**MAHIB by Moghny Maqdoom**. It's a local design prototype, separate from the live storefront and the ERP.

---

## 1. Positioning: why this beats the competition

| | Typical competitor sites (Manyavar, Neeru's, RS Brothers, JC Brothers, large marketplaces) | **Maqdoom's: The Groom's House** |
|---|---|---|
| Story | A catalogue grid: "browse thousands of SKUs" | **A groom's journey**: arrive → ceremony → the rail → couture → fit → anywhere in the world |
| Hero | Campaign banner with discount | **The Sehra curtain**: strands of pearls and flowers that part to reveal the groom |
| Browsing | Filters and pagination | **The Rail**: garments hang on a brass rail like the real showroom wall; tap one and it lifts off its hanger |
| Made-to-measure | Hidden form or "visit store" | **4-hour stitching** as the headline promise, with a live "ready by" clock |
| Fit | Size chart PDF | **Your size, then your fit**: a size finder plus free alterations to the customer's fit |
| Premium tier | A filter tag | **MAHIB atelier**: its own dark, cinematic world inside the site |
| International | Rarely addressed | **From Pathergatti to the world**: video fittings, a measurement guide, worldwide delivery for the NRI dulha |
| Ordering | Cart → payment gateway | **Concierge on WhatsApp** (the shop's real workflow), with a cart-ready structure for later |
| Ceremonies | Generic "wedding" category | **Shop by ceremony**: Haldi, Mehendi, Sangeet, Nikah/Baraat, Reception, **Pellikoduku** (Telugu groom) |

The big chains compete on reach. Maqdoom's wins on **intimacy, craft, speed and fit**: a family house that dresses
grooms, stitches in hours and alters to the body. The site should feel like being received at the showroom.
It should not feel like scrolling a marketplace.

## 2. Audience

1. **The groom (24–34)**, on his phone at night, comparing looks for five ceremonies.
2. **The family decision-makers**, father, mother and elder brother, who need trust, price clarity and the visit address.
3. **The NRI groom** in the US, UK or Gulf, short on time, who needs remote fitting and delivery.
4. **Guests and the groom's party**: brothers, cousins and kids, often matching.
5. **MAHIB clients**: high-value, design-led, buying couture rather than a size.

Phone first: every section is designed at 390 px wide, then scaled up.

## 3. Brand system

**Feeling:** Darbar ivory by day, velvet noir by night. Calm and generous space, with craft in close-up.

| Token | Value | Use |
|---|---|---|
| Ivory | `#F6F0E6` | Main background |
| Parchment | `#ECE2D0` | Bands and cards |
| Ink | `#16130F` | Text and primary buttons |
| **Maqdoom's emerald** | `#0E4D3A` | Brand colour (taken from the green knot emblem on the shop sign) |
| Emerald light | `#1D6B52` | Hovers, ceremony "Mehendi" |
| Antique gold | `#B48A4A` | Rules, numerals, details |
| Gold soft | `#D9BF8C` | Text on dark backgrounds |
| **Sindoor red** | `#B3262B` | Sparing accent (from the red script sign): "New", "Today" |
| MAHIB noir | `#0D0B09` | The MAHIB world |
| MAHIB green | `#2F8F46` | The "mahib" wordmark only |

- **Type:**
  - **Cormorant Garamond** for display. It's tall, couture and editorial, and close to wedding-card lettering.
  - **Manrope** for interface and body. It's clean and readable at small sizes.
  - Numbers for the 4-hour clock use Cormorant lining figures.
- **Logos:** the real signage marks (red script "Maqdoom's", green "BIG MALL", green knot emblem) and the green "mahib" wordmark.
  The prototype uses typographic stand-ins. **Supply the official logo files** and they drop in.
- **Photography:**
  - full-length grooms as cut-outs on stage backgrounds
  - extreme close-ups of zardozi, resham and velvet
  - the real showroom walls (white padded panels, wood floor)
- **Motion:** slow and fabric-like, 400–900 ms with ease-out. Nothing bounces except swinging price tags.
  Everything respects "reduce motion".

## 4. Sitemap

```
/                     Home: the groom's journey
/shop                 The Rail and grid (all), filters: category · ceremony · size · colour · price
/shop/:category       Sherwanis · Suits & Tuxedos · Bandhgalas & Jodhpuris · Kurta sets · Indo-western
                      · Pellikoduku (Telugu groom) · Kids & groom's party · Accessories · Fabrics
/ceremony/:name       Haldi · Mehendi · Sangeet · Nikah/Baraat · Reception · Pellikoduku
/p/:product           Product: gallery, colours, sizes, ready-made or made-to-measure, complete the look
/mahib                MAHIB atelier: collections, craft, appointment
/bespoke              4-hour stitching and alterations: how it works, live "ready by" time
/worldwide            NRI and international: video fitting, measurements, delivery
/visit                Showroom in Pathergatti, hours, directions, both phone numbers
```

The prototype implements Home, Shop, Product, MAHIB, Bespoke and Visit/Worldwide. The ceremony pages reuse the Shop page with a ceremony filter.

## 5. Home: section by section, with copy

1. **Header:**
   - wordmark on the left
   - Shop · Ceremonies · MAHIB · 4-Hour Stitching · Worldwide · Visit
   - WhatsApp concierge on the right
   - On phones: wordmark, WhatsApp, menu.
2. **Hero: the Sehra curtain.**
   - Strands of pearls, jasmine and gold beads hang across the screen. They sway with the finger or mouse, and on scroll (or a tap on *Reveal*) they part to both sides like a groom's veil.
   - Behind them, a groom on stage.
   - Headline: *"Dressed for the day you'll never forget."*
   - Subhead: *"Groom couture, ready-to-wear and made-to-measure, stitched in as little as four hours."*
   - Buttons: **Shop the Dulha Edit** and **Book a fitting**.
3. **Promise strip:** 4-hour stitching · Free alterations to your fit · Every size, every colour · Delivered worldwide.
4. **Shop by ceremony:** six tall tiles, each with its own colour mood:
   - Haldi: marigold
   - Mehendi: leaf green
   - Sangeet: jewel tones
   - Nikah & Baraat: ivory and gold
   - Reception: midnight
   - Pellikoduku: cream silk and gold
5. **The Rail:**
   - A brass rail across the screen with garments on hangers and paper price tags. Drag to walk along it; tags swing as pieces pass.
   - Tap a piece and it lifts forward, showing its name, price, colours and **View piece**.
   - Copy: *"Walk the rail. Our showroom wall, in your hand."*
6. **MAHIB, the house within the house:**
   - A dark band with a slow macro image of zardozi.
   - Copy: *"MAHIB by Moghny Maqdoom. Couture for the groom who wants to be remembered."*
   - Collections: *Latest Dulha 2026 · The Kashmiri Collection · For the NRI Dulha*.
   - Button: **Enter the atelier**.
7. **Stitched while you celebrate (4-hour stitching):**
   - A live clock: *"Order now, ready by 6:40 PM today."* The time is worked out from the current time and showroom hours; after hours it says "first thing tomorrow".
   - Three steps: choose → measure → collect in four hours.
8. **Your size, then your fit:**
   - A chest-size slider suggests the size (36–48).
   - *"Every piece is altered to you, free, in the showroom or by video."*
9. **From Pathergatti to the world:**
   - Video fittings, a measurement guide, delivery to the US, UK, UAE, Canada and more.
   - A small dotted world map with routes from Hyderabad.
10. **From the showroom:** an Instagram-style strip of reels and photos linking to @maqdooms_bigmall and @mahib_by_moghnymaqdoom.
11. **Answered with elegance:** an accordion FAQ covering 4-hour stitching, alterations, sizes, worldwide delivery, MAHIB appointments and exchanges.
12. **Visit:** address, hours, directions, both numbers.
13. **Footer:** an embroidered border motif and the two Instagram handles.

## 6. Product page

- **Gallery:** full-length, then close-ups. Swipe on phones, with thumbnails.
- **Colours** as fabric swatches, and **sizes** 36–48 with *Find my size*.
- **Two ways to buy:**
  - **Ready to wear** (alterations included)
  - **Made to measure in 4 hours** (measurements in store or by video)
- **WhatsApp concierge** button with a pre-filled message: piece, colour, size, way to buy.
- **Craft notes:** fabric, work (zardozi, resham, pearl), occasion, care.
- **Complete the look:** safa, mala, mojari, stole.
- **Delivery:** *"In Hyderabad today · India 2–4 days · Worldwide 5–9 days."* These are placeholders to confirm.

## 7. Signature interactions: wedding rituals made interactive

Each one is a **physical object or ritual from a Hyderabadi wedding**, not a generic web effect.

| # | Interaction | Where | What happens |
|---|---|---|---|
| 1 | **Sehra Reveal** | Home hero | Pearl, jasmine and gold-bead strands with real physics hang over the groom. Touch sways them; scroll or *Reveal* parts them like the groom's veil. |
| 2 | **The Wedding Days** | Home, ceremonies | As you scroll, the page lives through the five days: the light shifts Haldi marigold → Mehendi green → Sangeet jewel → Nikah ivory → Reception midnight. Marigold petals fall, henna lines draw themselves, sparkles rise. |
| 3 | **The Rail, with weight** | Home and Shop | Garments hang on a brass rail. Dragging gives the hangers momentum and they swing like pendulums; paper tags flutter. Tap one and it lifts off its hook. |
| 4 | **Three-way trial-room mirror** | Product | The outfit stands in a three-panel mirror. Drag to turn the panels and see the side reflections, like the showroom trial room. |
| 5 | **The Stitch Clock** | Home, Bespoke, Product | Scissors and needle are the clock hands. The four-hour arc is sewn in running stitch from now to your "ready by" time. |
| 6 | **The Measuring Tape** | Size finder | Pull a tailor's tape to your chest measurement and it reads off your size. |
| 7 | **MAHIB Lightbox** | MAHIB | A dark atelier where the pointer or finger is a spotlight over couture, like jewellery cases. Close-ups drift slowly. |
| 8 | **Boarding pass** | Worldwide | The NRI groom types his name, city and wedding date and gets a ticket: HYD → his city, with video fitting, delivery window and concierge number. |
| 9 | **Woven Mode** (from the MBM_03 branch) | Header toggle, later | The site turns into woven velvet. |

## 8. UX rules

- Two taps from the home page to any product, and three to a WhatsApp enquiry.
- Prices are always visible, in ₹ with a "starting from" for made-to-measure.
- Sticky WhatsApp concierge on phones, and the CTA never hides behind the keyboard.
- Images are lazy-loaded, and only the hero loads up front.
- Accessibility:
  - colour contrast AA on text
  - every interaction has a button equivalent
  - visible focus, and "reduce motion" respected
- SEO:
  - one H1 per page
  - product structured data
  - real text, never text inside images

## 9. What the prototype uses

- Photos are read in place from `MBM_03/public` (configured as this project's public folder). Nothing is copied, moved or edited.
- The catalogue is sample data shaped like the ERP's (category, ceremony, sizes, colours, price, MAHIB flag), ready to be swapped for the live catalogue.
- To confirm with the shop: hours, delivery times, worldwide countries, exchange policy, official logo files and real product photos per colour.

## 10. Roadmap

1. Approve the direction (this prototype).
2. Real assets: logo files, a photo shoot per product (front, back, close-up, per colour), showroom video.
3. Connect the live catalogue (the same Supabase catalogue the current storefront uses).
4. Port Woven Mode.
5. Payments and international shipping, when the shop wants online checkout.
