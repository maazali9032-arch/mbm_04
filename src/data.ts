// Sample catalogue shaped like the ERP's: category, ceremonies, sizes, colours, price, MAHIB flag.
// Photos are read in place from MBM_03/public. Several pieces share a photo in this prototype.

export type Ceremony = "haldi" | "mehendi" | "sangeet" | "nikah" | "reception" | "pellikoduku";
export type Colour = { name: string; hex: string };
export type Product = {
  id: string;
  name: string;
  category: string;
  ceremonies: Ceremony[];
  price: number;
  unit?: string;
  mtm: boolean; // available made-to-measure in 4 hours
  mahib?: boolean;
  img: string;
  cutout?: boolean; // transparent background, shown on a stage
  close?: string[]; // close-up photos
  colours: Colour[];
  sizes: string[];
  work: string;
  fabric: string;
  note: string;
};

export const STORE = {
  name: "Maqdoom's Big Mall",
  area: "Pathergatti, Hyderabad",
  phone: "+91 96104 15415",
  wa: "919610415415",
  mahibPhone: "+91 70452 40888",
  mahibWa: "917045240888",
  instagram: "https://www.instagram.com/maqdooms_bigmall/",
  mahibInstagram: "https://www.instagram.com/mahib_by_moghnymaqdoom/",
  open: 11, // showroom hours, to confirm with the shop
  close: 22,
};

// photo: true marks a photograph with a background (shown inside an arch), the rest are cut-outs.
export const CEREMONIES: { id: Ceremony; name: string; line: string; img: string; photo?: boolean; mood: [string, string, string] }[] = [
  { id: "haldi", name: "Haldi", line: "Sunlight, turmeric and laughter", img: "/images/section_2_kurtas.webp", photo: true, mood: ["#F2B33D", "#FBE7B5", "#5A3A06"] },
  { id: "mehendi", name: "Mehendi", line: "Leaf greens and henna evenings", img: "/images/hero_section_person_d_1.4.webp", mood: ["#2F6B3A", "#DCE8C8", "#132A17"] },
  { id: "sangeet", name: "Sangeet", line: "Jewel tones for the dance floor", img: "/images/hero_section_person_c_1.3.webp", mood: ["#5B2A86", "#E6D8F2", "#1E0E2E"] },
  { id: "nikah", name: "Nikah & Baraat", line: "Ivory, gold and the long walk", img: "/images/hero_section_person_a_1.1.webp", mood: ["#B48A4A", "#F6F0E6", "#3B2A10"] },
  { id: "reception", name: "Reception", line: "Midnight velvet, sharp tailoring", img: "/images/hero_section_person_b_1.2.webp", mood: ["#1B2340", "#C9CFE4", "#0A0E1C"] },
  { id: "pellikoduku", name: "Pellikoduku", line: "Tissue silk, pattu dhoti and pagdi", img: "/images/section_2_sherwanis.webp", photo: true, mood: ["#C9A33D", "#FFF6DC", "#4A3605"] },
];

export const CATEGORIES = [
  { id: "sherwanis", name: "Sherwanis" },
  { id: "suits", name: "Suits & Tuxedos" },
  { id: "bandhgalas", name: "Bandhgalas & Jodhpuris" },
  { id: "kurtas", name: "Kurta Sets" },
  { id: "indowestern", name: "Indo-Western" },
  { id: "pellikoduku", name: "Pellikoduku" },
  { id: "kids", name: "Kids & Groom's Party" },
  { id: "accessories", name: "Accessories" },
  { id: "fabrics", name: "Fabrics" },
];

const S = ["36", "38", "40", "42", "44", "46", "48"];
const c = (name: string, hex: string): Colour => ({ name, hex });

export const PRODUCTS: Product[] = [
  { id: "ivory-zardozi-sherwani", name: "Ivory Zardozi Sherwani with Velvet Dupatta", category: "sherwanis", ceremonies: ["nikah"], price: 38500, mtm: true, img: "/images/hero_section_person_a_1.1.webp", cutout: true, close: ["/test_images/SHW2.webp"], colours: [c("Ivory", "#EFE3CC"), c("Champagne", "#E3CFA4"), c("Blush", "#E9CBC2")], sizes: S, work: "Hand zardozi, pearl and resham", fabric: "Raw silk with velvet dupatta", note: "The long walk deserves a quiet kind of gold." },
  { id: "maroon-three-piece", name: "Maroon Three-Piece Suit", category: "suits", ceremonies: ["reception"], price: 16900, mtm: true, img: "/images/hero_section_person_b_1.2.webp", cutout: true, colours: [c("Maroon", "#6B1C22"), c("Midnight", "#1B2340"), c("Charcoal", "#33302D")], sizes: S, work: "Hand-finished lapels", fabric: "Italian-blend wool", note: "Cut close, made to dance in." },
  { id: "noir-velvet-bandhgala", name: "Noir Velvet Bandhgala with Gold Zari", category: "bandhgalas", ceremonies: ["reception", "sangeet"], price: 24500, mtm: true, mahib: true, img: "/images/hero_section_person_c_1.3.webp", cutout: true, close: ["/test_images/SHW3.webp"], colours: [c("Noir", "#141210"), c("Bottle green", "#1E3B2E"), c("Wine", "#4A1621")], sizes: S, work: "Gold zari, hand-set buttons", fabric: "Micro velvet", note: "For the night everyone remembers the photographs." },
  { id: "emerald-brocade-set", name: "Emerald Brocade Waistcoat Set", category: "indowestern", ceremonies: ["mehendi", "sangeet"], price: 12800, mtm: true, img: "/images/hero_section_person_d_1.4.webp", cutout: true, colours: [c("Emerald", "#1E4A35"), c("Peacock", "#1E5A60"), c("Rust", "#8A4521")], sizes: S, work: "Brocade with gold motifs", fabric: "Banarasi brocade over cotton silk", note: "Green for the henna night, cut for the dance floor." },
  { id: "maroon-velvet-mahib", name: "Maroon Velvet Sherwani, MAHIB", category: "sherwanis", ceremonies: ["nikah", "reception"], price: 62000, mtm: false, mahib: true, img: "/test_images/SHW1.webp", close: ["/test_images/SHW2.webp", "/test_images/SHW3.webp"], colours: [c("Maroon", "#4A121A"), c("Noir", "#141210")], sizes: S, work: "Antique zardozi across chest and sleeves", fabric: "Silk velvet", note: "Couture from the MAHIB atelier: made once, made to be remembered." },
  { id: "champagne-safa-sherwani", name: "Champagne Sherwani with Safa", category: "sherwanis", ceremonies: ["nikah", "pellikoduku"], price: 29000, mtm: true, img: "/images/section_2_sherwanis.webp", colours: [c("Champagne", "#E3CFA4"), c("Ivory", "#EFE3CC"), c("Pista", "#DCE3C1")], sizes: S, work: "Jacquard with tonal thread work", fabric: "Silk jacquard", note: "Safa matched in the showroom, tied by our team." },
  { id: "ivory-kurta-jacket", name: "Ivory Raw-Silk Kurta Jacket", category: "kurtas", ceremonies: ["haldi", "mehendi"], price: 8900, mtm: true, img: "/images/section_2_kurtas.webp", colours: [c("Ivory", "#EFE3CC"), c("Lemon", "#F3E3A1"), c("Mint", "#D5E8D4")], sizes: S, work: "Thread embroidery", fabric: "Raw silk", note: "Light enough for an afternoon of turmeric." },
  { id: "gold-nehru-waistcoat", name: "Gold Brocade Nehru Waistcoat", category: "indowestern", ceremonies: ["sangeet", "nikah"], price: 6500, mtm: true, img: "/images/section_2_waistcoats.webp", colours: [c("Gold", "#C9A35C"), c("Silver", "#C8C6C0"), c("Copper", "#A0603C")], sizes: S, work: "Woven brocade", fabric: "Banarasi brocade", note: "Over any kurta, every ceremony." },
  { id: "chikankari-kurta", name: "Lucknowi Chikankari Kurta Set", category: "kurtas", ceremonies: ["haldi", "mehendi"], price: 5400, mtm: true, img: "/images/section_2_kurtas.webp", colours: [c("White", "#F7F4EC"), c("Sky", "#CFE0EE"), c("Lilac", "#DCCFE6")], sizes: S, work: "Hand chikankari", fabric: "Cotton mul", note: "Shadow work from Lucknow, cut in Hyderabad." },
  { id: "pellikoduku-tissue-set", name: "Tissue Kurta with Pattu Dhoti & Pagdi", category: "pellikoduku", ceremonies: ["pellikoduku"], price: 14500, mtm: true, img: "/images/section_2_sherwanis.webp", colours: [c("Cream gold", "#EBDDB0"), c("Ivory", "#EFE3CC")], sizes: S, work: "Zari border", fabric: "Tissue silk and pattu", note: "The Telugu groom, dressed the traditional way." },
  { id: "mini-sherwani", name: "Kids' Mini Sherwani", category: "kids", ceremonies: ["nikah", "sangeet"], price: 4800, mtm: true, img: "/images/section_2_sherwanis.webp", colours: [c("Champagne", "#E3CFA4"), c("Maroon", "#6B1C22")], sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"], work: "Tonal embroidery", fabric: "Silk blend", note: "So the little ones match the groom." },
  { id: "zardozi-mojari", name: "Hand-Embroidered Mojaris", category: "accessories", ceremonies: ["nikah", "sangeet", "pellikoduku"], price: 3200, mtm: false, img: "/images/section_2_accessories.webp", colours: [c("Antique gold", "#B48A4A"), c("Maroon", "#6B1C22")], sizes: ["7", "8", "9", "10", "11"], work: "Zardozi", fabric: "Leather and velvet", note: "Finished by hand to match the sherwani." },
  { id: "kimkhab-brocade", name: "Kimkhab Brocade", category: "fabrics", ceremonies: ["nikah"], price: 1850, unit: "per metre", mtm: true, img: "/images/section_2_fabrics.webp", colours: [c("Gold", "#C9A35C"), c("Maroon", "#6B1C22"), c("Emerald", "#1E4A35")], sizes: ["1 m", "2.5 m", "3.5 m", "5 m"], work: "Woven gold", fabric: "Kimkhab", note: "Choose your thaan; we stitch it in four hours." },
  { id: "velvet-dupatta", name: "Crimson Velvet Dupatta", category: "accessories", ceremonies: ["nikah", "reception"], price: 4500, mtm: false, img: "/test_images/red_velvet.webp", colours: [c("Crimson", "#8E1420"), c("Noir", "#141210")], sizes: ["One size"], work: "Zari border", fabric: "Silk velvet", note: "Thrown over the shoulder, it changes everything." },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const byId = (id: string) => PRODUCTS.find((p) => p.id === id);
export const waLink = (p: Product | null, text: string) =>
  `https://wa.me/${p?.mahib ? STORE.mahibWa : STORE.wa}?text=${encodeURIComponent(text)}`;

/** When a 4-hour order placed now would be ready, within showroom hours. */
export function readyBy(now = new Date()) {
  const h = now.getHours() + now.getMinutes() / 60;
  const fmt = (d: Date) => d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const at = new Date(now);
  if (h < STORE.open) {
    at.setHours(STORE.open + 4, 0, 0, 0);
    return { at, label: `today by ${fmt(at)}`, today: true, start: new Date(at.getTime() - 4 * 3600e3) };
  }
  if (h + 4 <= STORE.close) {
    at.setTime(now.getTime() + 4 * 3600e3);
    at.setMinutes(Math.ceil(at.getMinutes() / 10) * 10, 0, 0);
    return { at, label: `today by ${fmt(at)}`, today: true, start: now };
  }
  at.setDate(at.getDate() + 1);
  at.setHours(STORE.open + 4, 0, 0, 0);
  return { at, label: `tomorrow by ${fmt(at)}`, today: false, start: new Date(at.getTime() - 4 * 3600e3) };
}
