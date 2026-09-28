// Volitelný překlad popisů her a novinky do češtiny přes DeepL (zdarma do 500 000 znaků měsíčně).
// Stačí v GitHubu přidat secret DEEPL_KEY. Každý text se překládá jen jednou, výsledky se ukládají.
import fs from "node:fs/promises";
import crypto from "node:crypto";

const KEY = (process.env.DEEPL_KEY || "").trim();
const log = (...a) => console.log("•", ...a);
if (!KEY) { log("DEEPL_KEY není nastavený, popisy zůstanou anglicky."); process.exit(0); }
const API = process.env.DEEPL_API || (KEY.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate");
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 12);

async function deepl(texts) {
  const body = new URLSearchParams({ target_lang: "CS", source_lang: "EN", preserve_formatting: "1" });
  texts.forEach((t) => body.append("text", t));
  const res = await fetch(API, { method: "POST", headers: { Authorization: `DeepL-Auth-Key ${KEY}`, "Content-Type": "application/x-www-form-urlencoded" }, body });
  if (res.status === 456) throw new Error("vyčerpaný měsíční limit DeepL");
  if (res.status === 403) throw new Error("neplatný DEEPL_KEY");
  if (!res.ok) throw new Error(`DeepL odpověděl ${res.status}`);
  return (await res.json()).translations.map((t) => t.text);
}

let cache = {};
try { cache = JSON.parse(await fs.readFile("data/translations.json", "utf8")); } catch {}
const data = JSON.parse(await fs.readFile("data/games.json", "utf8"));
const todo = data.games.filter((g) => g.d && cache[g.id]?.h !== hash(g.d));
log(`Popisů k překladu: ${todo.length}`);
try {
  for (let i = 0; i < todo.length; i += 20) {
    const chunk = todo.slice(i, i + 20);
    const out = await deepl(chunk.map((g) => g.d));
    chunk.forEach((g, k) => (cache[g.id] = { h: hash(g.d), t: out[k] }));
  }
} catch (e) { log(`Překlad přerušen: ${e.message}`); }
let n = 0;
for (const g of data.games) if (g.d && cache[g.id]?.h === hash(g.d)) { g.dcz = cache[g.id].t; n++; }
await fs.writeFile("data/translations.json", JSON.stringify(cache));
await fs.writeFile("data/games.json", JSON.stringify(data));
log(`Česky: ${n} z ${data.games.length} popisů.`);

try {
  const news = JSON.parse(await fs.readFile("data/news.json", "utf8"));
  if (news.title && !news.titleCz) { news.titleCz = (await deepl([news.title]))[0]; await fs.writeFile("data/news.json", JSON.stringify(news)); log(`Novinka česky: ${news.titleCz}`); }
} catch (e) { if (e.code !== "ENOENT") log(`Novinku se nepodařilo přeložit: ${e.message}`); }
