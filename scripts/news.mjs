// Vybere jednu nejdůležitější novinku ze světa deskovek za posledních 7 dní → data/news.json
import fs from "node:fs/promises";
import { parseXML } from "./xml.mjs";
import { NEWS_FEEDS } from "./config.mjs";

const log = (...a) => console.log("•", ...a);
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const txt = (x) => (x == null ? "" : typeof x === "string" ? x : x["#text"] ?? "");
const clean = (s) => txt(s).replace(/<[^>]+>/g, "").replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'").replace(/\s+/g, " ").trim();
const WEEK = 7 * 864e5, now = Date.now();

const STOP = new Set("the a an and or of to in on for with from by at is are was be as its it this that new game games board tabletop boardgame boardgames first more than into about after over how what why will your their launch launches announced announces reveals revealed returns coming now".split(" "));
const tokens = (t) => new Set(t.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length >= 4 && !STOP.has(w)));
const BOOST = /spiel des jahres|kennerspiel|as d'or|award|winner|wins |record|million|acquir|acquisition|merger|bankrupt|layoff|lays off|closes|closure|shut|tariff|essen|spiel 20|gen con|kickstarter|gamefound|backerkit|crowdfund|recall|lawsuit|sues|asmodee|hasbro|wizards of the coast|games workshop|boardgamegeek|cmon|stonemaier|z-man|fantasy flight|restructur|sold|sales/i;
const JUNK = /review|deals? (alert|of the)|best deals|daily deal|on sale|% off|discount|best .* games|how to|guide|podcast|unboxing|preview|giveaway|contest|top \d+|gift|round-?up|weekly|this week in|sponsored/i;

const items = [];
for (const f of NEWS_FEEDS) {
  try {
    const res = await fetch(f.url, { headers: { "User-Agent": "Mozilla/5.0 (Deskovky news bot; +https://github.com)" }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const doc = parseXML(await res.text(), ["item", "entry", "link"]);
    const raw = [...arr(doc.rss?.channel?.item), ...arr(doc.feed?.entry)];
    let n = 0;
    for (const it of raw) {
      let title = clean(it.title);
      const link = txt(arr(it.link).find((l) => typeof l === "string" || !l.rel || l.rel === "alternate")) || arr(it.link)[0]?.href || "";
      const date = Date.parse(txt(it.pubDate) || txt(it.published) || txt(it.updated) || txt(it["dc:date"]));
      if (!title || !link || !date || now - date > WEEK || date > now + 864e5) continue;
      let source = f.name;
      if (f.google) {
        source = clean(it.source) || source;
        const cut = title.lastIndexOf(" - ");
        if (cut > 20) { if (!clean(it.source)) source = title.slice(cut + 3); title = title.slice(0, cut); }
      }
      items.push({ title, url: typeof link === "string" ? link : link.href, source, date, weight: f.weight, feed: f.name, tok: tokens(title) });
      n++;
    }
    log(`${f.name}: ${n} zpráv za posledních 7 dní`);
  } catch (e) { log(`${f.name}: nedostupné (${e.message})`); }
}

if (!items.length) { log("Žádné novinky, ponechávám předchozí."); process.exit(0); }
for (const it of items) {
  const echo = new Set();
  for (const o of items) {
    if (o === it || o.feed === it.feed && o.source === it.source) continue;
    let shared = 0; for (const w of it.tok) if (o.tok.has(w)) shared++;
    if (shared >= 2) echo.add(o.source);
  }
  const boosts = (it.title.match(new RegExp(BOOST.source, "gi")) || []).length;
  const age = (now - it.date) / WEEK;
  it.score = echo.size * 2 + Math.min(3, boosts) * 1.2 + it.weight + (1 - age) * 0.8 - (JUNK.test(it.title) ? 4 : 0);
}
items.sort((a, b) => b.score - a.score);
const top = items[0];
log(`Novinka týdne: „${top.title}“ (${top.source}, skóre ${top.score.toFixed(1)})`);
let prev = {}; try { prev = JSON.parse(await fs.readFile("data/news.json", "utf8")); } catch {}
const out = { title: top.title, url: top.url, source: top.source, date: new Date(top.date).toISOString(), picked: new Date().toISOString() };
if (prev.url === out.url && prev.titleCz) out.titleCz = prev.titleCz;
await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/news.json", JSON.stringify(out));
