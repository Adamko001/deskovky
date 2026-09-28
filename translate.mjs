// Překlad popisů her a novinky do češtiny.
//  • S klíčem DEEPL_KEY (zdarma do 500 000 znaků/měsíc) se přeloží všechno najednou a kvalitně.
//  • Bez klíče se použije bezplatná služba MyMemory (asi 5 000 znaků denně): každý den se přeloží
//    novinka a několik dalších popisů, takže celá sbírka bude česky postupně během pár týdnů.
// Každý text se překládá jen jednou, výsledky se ukládají do data/translations.json.
import fs from "node:fs/promises";
import crypto from "node:crypto";

const KEY = (process.env.DEEPL_KEY || "").trim();
const log = (...a) => console.log("•", ...a);
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 12);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEEPL = process.env.DEEPL_API || (KEY.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate");
const MYMEM = process.env.MYMEMORY_API || "https://api.mymemory.translated.net/get";
let budget = KEY ? Infinity : +(process.env.MYMEMORY_BUDGET || 4500);

async function deepl(texts) {
  const body = new URLSearchParams({ target_lang: "CS", source_lang: "EN", preserve_formatting: "1" });
  texts.forEach((t) => body.append("text", t));
  const res = await fetch(DEEPL, { method: "POST", headers: { Authorization: `DeepL-Auth-Key ${KEY}`, "Content-Type": "application/x-www-form-urlencoded" }, body });
  if (res.status === 456) throw new Error("vyčerpaný měsíční limit DeepL");
  if (res.status === 403) throw new Error("neplatný DEEPL_KEY");
  if (!res.ok) throw new Error(`DeepL odpověděl ${res.status}`);
  return (await res.json()).translations.map((t) => t.text);
}
// MyMemory přijímá max. 500 bajtů na dotaz → dělení po větách
function chunks(text) {
  const parts = text.split(/(?<=[.!?])\s+|\n+/).filter(Boolean), out = []; let cur = "";
  for (const p of parts) { if (Buffer.byteLength(cur + " " + p) > 450 && cur) { out.push(cur); cur = p; } else cur = cur ? cur + " " + p : p; }
  if (cur) out.push(cur);
  return out.flatMap((c) => (Buffer.byteLength(c) > 480 ? c.match(/.{1,200}(\s|$)/g) : [c]));
}
async function mymemory(text) {
  const paras = text.split(/\n\n+/), out = [];
  for (const para of paras) {
    const tr = [];
    for (const c of chunks(para)) {
      const res = await fetch(`${MYMEM}?q=${encodeURIComponent(c)}&langpair=en|cs`, { headers: { "User-Agent": "Deskovky/2.0" } });
      const j = await res.json().catch(() => ({}));
      if (j.quotaFinished || j.responseStatus === 429 || /MYMEMORY WARNING/i.test(j.responseData?.translatedText || "")) throw new Error("denní limit MyMemory vyčerpán");
      if (j.responseStatus !== 200 || !j.responseData?.translatedText) throw new Error(`MyMemory odpověděl ${j.responseStatus || res.status}`);
      tr.push(j.responseData.translatedText);
      await sleep(400);
    }
    out.push(tr.join(" "));
  }
  return out.join("\n\n");
}
async function translate(texts) {
  if (KEY) return deepl(texts);
  const out = [];
  for (const t of texts) {
    if (t.length > budget) throw new Error("dnešní limit znaků vyčerpán, pokračuje se zítra");
    out.push(await mymemory(t)); budget -= t.length;
  }
  return out;
}

let cache = {};
try { cache = JSON.parse(await fs.readFile("data/translations.json", "utf8")); } catch {}
const save = () => fs.writeFile("data/translations.json", JSON.stringify(cache));
log(KEY ? "Překládám přes DeepL." : `Překládám přes MyMemory (limit ${budget} znaků).`);

// 1) novinka týdne má přednost
try {
  const news = JSON.parse(await fs.readFile("data/news.json", "utf8"));
  const need = [];
  if (news.title && !news.titleCz) need.push("title");
  if (news.perex && !news.perexCz) need.push("perex");
  if (need.length) {
    const tr = await translate(need.map((k) => news[k]));
    need.forEach((k, i) => (news[k + "Cz"] = tr[i]));
    await fs.writeFile("data/news.json", JSON.stringify(news));
    log(`Novinka česky: ${news.titleCz}`);
  }
} catch (e) { if (e.code !== "ENOENT") log(`Novinku se nepodařilo přeložit: ${e.message}`); }

// 2) popisy her (nejdřív ty nejhranější)
const data = JSON.parse(await fs.readFile("data/games.json", "utf8"));
const todo = data.games.filter((g) => g.d && cache[g.id]?.h !== hash(g.d)).sort((a, b) => (b.pl || 0) - (a.pl || 0) || (b.r || 0) - (a.r || 0));
log(`Popisů k překladu: ${todo.length}`);
try {
  const step = KEY ? 20 : 1;
  for (let i = 0; i < todo.length; i += step) {
    const chunk = todo.slice(i, i + step);
    const out = await translate(chunk.map((g) => g.d));
    chunk.forEach((g, k) => (cache[g.id] = { h: hash(g.d), t: out[k] }));
    await save();
  }
} catch (e) { log(`Překlad pokračuje zítra: ${e.message}`); }
let n = 0;
for (const g of data.games) if (g.d && cache[g.id]?.h === hash(g.d)) { g.dcz = cache[g.id].t; n++; }
await save();
await fs.writeFile("data/games.json", JSON.stringify(data));
log(`Česky: ${n} z ${data.games.length} popisů.`);
