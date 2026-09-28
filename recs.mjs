// Doporučí 3 kvalitní hry, které nevlastníte a které se podobají tomu, co hrajete → data/recs.json
import fs from "node:fs/promises";
import { parseXML } from "./xml.mjs";
import * as CFG from "./config.mjs";

const TOKEN = (process.env.BGG_TOKEN || "").trim();
const API = process.env.BGG_API || "https://boardgamegeek.com/xmlapi2";
const PAUSE = +(process.env.PAUSE ?? 2500);
const log = (...a) => console.log("•", ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const num = (x) => { const n = parseFloat(x?.value ?? x); return Number.isFinite(n) ? n : null; };
const dec = (s = "") => String(s).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'");

async function get(url) {
  for (let a = 1; a <= 8; a++) {
    const res = await fetch(url, { headers: { ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), "User-Agent": "Deskovky/2.0" } }).catch(() => null);
    if (res?.status === 200) return res.text();
    await sleep(Math.min(5000 * a, 30000));
  }
  throw new Error("BGG neodpovídá");
}
const parse = (x) => parseXML(x, ["item", "link", "name", "rank"]);

const games = JSON.parse(await fs.readFile("data/games.json", "utf8")).games;
let profile = [];
try { profile = JSON.parse(await fs.readFile("data/profile.json", "utf8")); } catch {}
if (!profile.length) { log("Chybí profil sbírky, doporučení přeskočeno."); process.exit(0); }
let wish = [];
try { wish = JSON.parse(await fs.readFile("data/wishlist.json", "utf8")).items || []; } catch {}
const owned = new Set(games.map((g) => g.id));
const ownedNames = games.map((g) => g.n.toLowerCase().replace(/[:(].*$/, "").trim()).filter((n) => n.length >= 4);

// profil hráče: co hrajete a co máte rádi má větší váhu
const vec = { m: {}, c: {}, d: {} };
let wSum = 0, wW = 0;
for (const p of profile) {
  const w = Math.max(0.3, 1 + Math.log2(1 + (p.pl || 0)) + (p.my ? (p.my - 6.5) / 2 : 0));
  for (const k of ["m", "c", "d"]) for (const v of p[k] || []) vec[k][v] = (vec[k][v] || 0) + w;
  if (p.w) { wSum += p.w * w; wW += w; }
}
const avgW = wW ? wSum / wW : 2.5;
const norm = (o) => Math.sqrt(Object.values(o).reduce((s, v) => s + v * v, 0)) || 1;
const N = { m: norm(vec.m), c: norm(vec.c) };
const cos = (k, list) => { if (!list.length) return 0; let dot = 0; for (const v of list) dot += vec[k][v] || 0; return dot / (N[k] * Math.sqrt(list.length)); };

// kandidáti: stálý seznam + aktuálně populární na BGG
let cand = new Set(CFG.REC_POOL);
try { const hot = parse(await get(`${API}/hot?type=boardgame`)); for (const it of arr(hot.items?.item)) cand.add(+it.id); } catch (e) { log(`Populární hry nedostupné (${e.message})`); }
cand = [...cand].filter((id) => !owned.has(id));

// mezipaměť detailů (obnova po 7 dnech)
let cache = {};
try { cache = JSON.parse(await fs.readFile("data/candidates.json", "utf8")); } catch {}
const WEEK = 7 * 864e5;
const stale = cand.filter((id) => !cache[id] || Date.now() - cache[id].f > WEEK).slice(0, 200);
log(`Kandidátů: ${cand.length}, k načtení: ${stale.length}`);
for (let i = 0; i < stale.length; i += 20) {
  try {
    const doc = parse(await get(`${API}/thing?id=${stale.slice(i, i + 20).join(",")}&stats=1`));
    for (const it of arr(doc.items?.item)) {
      const links = arr(it.link), lv = (t) => links.filter((l) => l.type === t);
      const r = it.statistics?.ratings || {};
      const rk = arr(r.ranks?.rank).find((x) => x.name === "boardgame");
      cache[+it.id] = {
        f: Date.now(), type: it.type, n: dec(arr(it.name).find((x) => x.type === "primary")?.value || ""),
        y: num(it.yearpublished) || 0, th: it.thumbnail || "", p: [num(it.minplayers) || 0, num(it.maxplayers) || 0],
        t: [num(it.minplaytime) || 0, num(it.maxplaytime) || 0], w: num(r.averageweight) || 0, r: num(r.average) || 0,
        b: num(r.bayesaverage) || 0, v: num(r.usersrated) || 0, rk: rk && /^\d+$/.test(rk.value) ? +rk.value : null,
        m: lv("boardgamemechanic").map((l) => dec(l.value)), c: lv("boardgamecategory").map((l) => dec(l.value)),
        d: lv("boardgamedesigner").map((l) => dec(l.value)),
        impl: [...lv("boardgameimplementation"), ...lv("boardgameintegration")].map((l) => +l.id),
      };
    }
  } catch (e) { log(`Dávku kandidátů se nepodařilo načíst (${e.message})`); }
  await sleep(PAUSE);
}
await fs.writeFile("data/candidates.json", JSON.stringify(cache));

const scored = [];
for (const id of cand) {
  const g = cache[id];
  if (!g || g.type !== "boardgame" || !g.n) continue;
  if (g.v < CFG.REC_MIN_VOTES || g.b < CFG.REC_MIN_BAYES) continue;
  if (g.impl.some((x) => owned.has(x))) continue;                        // jiná verze hry, kterou už máte
  const ln = g.n.toLowerCase();
  if (ownedNames.some((o) => ln.startsWith(o + ":") || ln.startsWith(o + " ("))) continue;
  const sm = cos("m", g.m), sc = cos("c", g.c);
  const sd = g.d.some((d) => vec.d[d]) ? 1 : 0;
  const sw = 1 - Math.min(1, Math.abs(g.w - avgW) / 2.5);
  const sim = sm * 0.5 + sc * 0.2 + sd * 0.12 + sw * 0.18;
  const quality = Math.max(0, Math.min(1, (g.b - 6.8) / 1.8));
  // nejpodobnější hra z vaší sbírky
  let like = null, likeS = 0;
  for (const p of profile) {
    const s = p.m.filter((x) => g.m.includes(x)).length * 2 + p.c.filter((x) => g.c.includes(x)).length + (p.d.some((x) => g.d.includes(x)) ? 3 : 0) + Math.log2(1 + (p.pl || 0));
    if (s > likeS) { likeS = s; like = p.id; }
  }
  scored.push({ id, g, score: sim * 0.62 + quality * 0.38, sm, sd, like });
}
scored.sort((a, b) => b.score - a.score);

const nameOf = (id) => games.find((x) => x.id === id)?.n || "";
const topMech = (g) => Object.entries(vec.m).filter(([m]) => g.m.includes(m)).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([m]) => CFG.MECH_CZ[m] || m);
const out = scored.slice(0, 6).map(({ id, g, sd, like }) => {
  const why = [];
  if (like) why.push(`Podobá se hře ${nameOf(like)}, kterou máte`);
  const tm = topMech(g); if (tm.length) why.push(`Mechaniky, které hrajete: ${tm.join(", ").toLowerCase()}`);
  if (sd) why.push(`Od autora, kterého už máte: ${g.d.find((d) => vec.d[d])}`);
  if (g.rk && g.rk <= 300) why.push(`${g.rk}. místo v žebříčku BGG`);
  return { id, n: g.n, y: g.y, th: g.th, p: g.p, t: g.t, w: Math.round(g.w * 100) / 100, r: Math.round(g.r * 100) / 100, rk: g.rk, why: why.slice(0, 3), wish: wish.some((x) => x.id === id) };
});
await fs.writeFile("data/recs.json", JSON.stringify({ updated: new Date().toISOString(), items: out }));
log(`Doporučení: ${out.slice(0, 3).map((x) => x.n).join(", ")}`);
