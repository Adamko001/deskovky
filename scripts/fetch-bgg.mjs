// Stáhne kolekci z BoardGameGeek a uloží ji do data/games.json.
// Spouští se automaticky každý den přes GitHub Actions.
// Ručně: BGG_TOKEN=... node scripts/fetch-bgg.mjs

import fs from "node:fs/promises";
import { parseXML } from "./xml.mjs";
import * as CFG from "./config.mjs";

const USER = (process.env.BGG_USER || CFG.BGG_USER).trim();
const TOKEN = (process.env.BGG_TOKEN || "").trim();
const API = process.env.BGG_API || "https://boardgamegeek.com/xmlapi2";
const OUT = "data/games.json";
const BATCH = 20; // BGG vrací nejvýš 20 her na jeden dotaz
const PAUSE = 2500; // slušná pauza mezi dotazy

const log = (...a) => console.log("•", ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const num = (x) => { const n = parseFloat(x?.value ?? x); return Number.isFinite(n) ? n : null; };

if (!TOKEN && !process.env.BGG_API) {
  console.error("✖ Chybí BGG_TOKEN. Přidej ho v GitHubu: Settings → Secrets and variables → Actions → New repository secret.");
  process.exit(1);
}

const ARRAYS = ["item", "link", "name", "poll", "results", "result", "rank"];
const parse = (xml) => parseXML(xml, ARRAYS);

async function get(url, what) {
  for (let attempt = 1; attempt <= 15; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        headers: {
          ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
          "User-Agent": "HerniPolice/1.0 (GitHub Pages; board game filter)",
        },
      });
    } catch (e) {
      log(`${what}: síťová chyba (${e.message}), zkusím znovu`);
      await sleep(5000 * attempt);
      continue;
    }
    if (res.status === 200) {
      const text = await res.text();
      if (/<error/i.test(text) && !/<items/i.test(text)) throw new Error(`BGG vrátil chybu: ${text.replace(/<[^>]+>/g, " ").trim().slice(0, 200)}`);
      return text;
    }
    if (res.status === 202) { log(`${what}: BGG kolekci připravuje, čekám…`); await sleep(Math.min(4000 * attempt, 30000)); continue; }
    if (res.status === 429 || res.status >= 500) { log(`${what}: BGG je přetížené (${res.status}), čekám…`); await sleep(Math.min(8000 * attempt, 60000)); continue; }
    if (res.status === 401 || res.status === 403) throw new Error(`BGG odmítl přístup (${res.status}). Zkontroluj, že BGG_TOKEN je platný.`);
    throw new Error(`${what}: neočekávaná odpověď ${res.status}`);
  }
  throw new Error(`${what}: BGG neodpovídá ani po opakovaných pokusech.`);
}

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", hellip: "…",
  rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", bull: "•", times: "×", eacute: "é", uuml: "ü", ouml: "ö", auml: "ä", szlig: "ß" };
function decode(s = "") {
  let out = String(s);
  for (let i = 0; i < 2; i++) {
    out = out
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
      .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);
  }
  return out;
}
function shortDesc(raw) {
  const text = decode(raw).replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();
  const paras = text.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);
  let out = "";
  for (const p of paras) {
    if (/^(—|–|-)?\s*(description from|from the publisher|publisher'?s description)/i.test(p)) continue;
    if ((out + " " + p).length > 900 && out) break;
    out = out ? out + "\n\n" + p : p;
  }
  return out.length > 1000 ? out.slice(0, 990).replace(/\s+\S*$/, "") + "…" : out;
}

function playerPoll(item, minP, maxP) {
  const poll = arr(item.poll).find((p) => p.name === "suggested_numplayers");
  const total = +(poll?.totalvotes || 0);
  if (!poll || total < 3) return { best: [], rec: [] };
  const best = [], rec = [];
  for (const r of arr(poll.results)) {
    if (!/^\d+$/.test(r.numplayers)) continue;
    const n = +r.numplayers;
    if (n < minP || n > maxP) continue;
    const v = Object.fromEntries(arr(r.result).map((x) => [x.value, +x.numvotes || 0]));
    const B = v["Best"] || 0, R = v["Recommended"] || 0, N = v["Not Recommended"] || 0;
    if (B + R + N === 0) continue;
    if (B + R > N) rec.push(n);
    if (B > 0 && B >= R && B > N) best.push(n);
  }
  return { best, rec };
}

// Barva obálky pro podklad karty (jen malý náhled, obrázek se nikam neukládá)
let sharp = null;
try { sharp = (await import("sharp")).default; } catch { log("sharp není k dispozici, barvy obálek přeskočím"); }
function toHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
async function coverColor(url) {
  if (!sharp || !url) return null;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "HerniPolice/1.0" } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const { dominant } = await sharp(buf).resize(48, 48, { fit: "cover" }).stats();
    let [h, s, l] = toHsl(dominant.r, dominant.g, dominant.b);
    s = Math.max(18, Math.min(62, s)); l = Math.max(24, Math.min(42, l));
    return `hsl(${h} ${s}% ${l}%)`;
  } catch { return null; }
}
const FALLBACK_HUES = [152, 168, 196, 214, 236, 268, 322, 352, 8, 26, 42, 86, 120, 184];

// ------------------------------------------------------------------
log(`Stahuji kolekci uživatele ${USER}…`);
const colUrl = `${API}/collection?username=${encodeURIComponent(USER)}&stats=1&excludesubtype=boardgameexpansion${CFG.ONLY_OWNED ? "&own=1" : ""}`;
const col = parse(await get(colUrl, "Kolekce"));
const colItems = arr(col.items?.item).filter((i) => i.subtype === "boardgame");
if (!colItems.length) throw new Error(`Kolekce ${USER} je prázdná nebo neveřejná. Zkontroluj, že máš hry označené jako „Own“.`);

const own = new Map();
for (const it of colItems) {
  const id = +it.objectid;
  const prev = own.get(id);
  const entry = {
    ci: +it.collid || 0,
    pl: +it.numplays || 0,
    my: num(it.stats?.rating?.value),
    add: String(it.status?.lastmodified || "").slice(0, 10),
    colName: decode(arr(it.name)[0]?.["#text"] || ""),
  };
  if (!prev) own.set(id, entry);
  else { prev.pl = Math.max(prev.pl, entry.pl); prev.ci = Math.min(prev.ci, entry.ci) || entry.ci; prev.my = prev.my ?? entry.my; }
}
log(`V kolekci je ${own.size} her.`);

let cache = new Map();
try {
  const old = JSON.parse(await fs.readFile(OUT, "utf8"));
  for (const g of old.games || []) if (g.col && g.img) cache.set(g.id, { col: g.col, img: g.img });
} catch {}

const ids = [...own.keys()];
const games = [];
for (let i = 0; i < ids.length; i += BATCH) {
  const chunk = ids.slice(i, i + BATCH);
  log(`Detaily her ${i + 1}–${i + chunk.length} z ${ids.length}`);
  const doc = parse(await get(`${API}/thing?id=${chunk.join(",")}&stats=1`, "Detaily"));
  for (const it of arr(doc.items?.item)) {
    const id = +it.id;
    const mine = own.get(id); if (!mine) continue;
    const names = arr(it.name);
    const primary = decode(names.find((n) => n.type === "primary")?.value || mine.colName);
    const alt = [...new Set(names.filter((n) => n.type !== "primary").map((n) => decode(n.value))
      .filter((n) => /^[\p{Script=Latin}\d\s\p{P}\p{S}]+$/u.test(n)))].slice(0, 15);
    const links = arr(it.link);
    const lv = (type) => links.filter((l) => l.type === type).map((l) => decode(l.value));
    const tags = [];
    for (const c of lv("boardgamecategory")) if (!CFG.HIDE_CATEGORIES.includes(c)) tags.push(CFG.CATEGORIES[c] || c);
    for (const m of lv("boardgamemechanic")) if (CFG.MECHANICS[m]) tags.push(CFG.MECHANICS[m]);
    const minP = num(it.minplayers) || 1, maxP = Math.max(num(it.maxplayers) || minP, minP);
    const minT = num(it.minplaytime) || num(it.playingtime) || 0;
    const maxT = Math.max(num(it.maxplaytime) || num(it.playingtime) || minT, minT);
    const ratings = it.statistics?.ratings || {};
    const rankEntry = arr(ratings.ranks?.rank).find((r) => r.name === "boardgame");
    const rank = rankEntry && /^\d+$/.test(rankEntry.value) ? +rankEntry.value : null;
    const designers = lv("boardgamedesigner"), publishers = lv("boardgamepublisher");
    const cz = CFG.CZ_EXTRA_IDS.includes(id) || designers.some((d) => CFG.CZ_DESIGNERS.includes(d)) || publishers.some((p) => CFG.CZ_PUBLISHERS.includes(p));
    const img = it.image || it.thumbnail || "";
    const cached = cache.get(id);
    let colr = cached && cached.img === img ? cached.col : await coverColor(it.thumbnail || img);
    if (!colr) colr = `hsl(${FALLBACK_HUES[id % FALLBACK_HUES.length]} 42% 32%)`;
    const { best, rec } = playerPoll(it, minP, maxP);
    games.push({
      id, n: primary, alt, y: num(it.yearpublished) || 0,
      p: [minP, maxP], t: [minT, maxT], a: num(it.minage) || 0,
      w: Math.round((num(ratings.averageweight) || 0) * 100) / 100,
      r: Math.round((num(ratings.average) || 0) * 100) / 100,
      rk: rank, c: [...new Set(tags)], img, col: colr, best, rec,
      pl: mine.pl, my: mine.my, ci: mine.ci, add: mine.add, cz, d: shortDesc(it.description),
    });
  }
  if (i + BATCH < ids.length) await sleep(PAUSE);
}

if (!games.length) throw new Error("Nepodařilo se načíst žádné detaily her.");
games.sort((a, b) => a.n.localeCompare(b.n, "cs"));
await fs.mkdir("data", { recursive: true });
await fs.writeFile(OUT, JSON.stringify({ updated: new Date().toISOString(), user: USER, count: games.length, games }));
log(`Hotovo: uloženo ${games.length} her do ${OUT}.`);
