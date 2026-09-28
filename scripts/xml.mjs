// Malý, bezzávislostní parser XML pro odpovědi BGG API.
// Vrací objekty ve tvaru: atributy jako vlastnosti, text jako "#text",
// vybrané elementy vždy jako pole.

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const unescape = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : +e.slice(1));
    return ENT[e] ?? m;
  });

export function parseXML(xml, arrayNames = []) {
  const ARR = new Set(arrayNames);
  const root = {};
  const stack = [{ name: "#root", obj: root }];
  const re = /<!\[CDATA\[([\s\S]*?)\]\]>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<(\/?)([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  const attrRe = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  const add = (parent, name, value) => {
    if (ARR.has(name)) (parent[name] ||= []).push(value);
    else if (name in parent) parent[name] = [].concat(parent[name], value);
    else parent[name] = value;
  };
  let m;
  while ((m = re.exec(xml))) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) { top.text = (top.text || "") + m[1]; continue; }
    if (m[6] !== undefined) { if (m[6].trim()) top.text = (top.text || "") + unescape(m[6]); continue; }
    if (!m[3]) continue; // komentář, deklarace
    if (m[2] === "/") {
      const done = stack.pop();
      finish(done);
      continue;
    }
    const obj = {};
    let a; attrRe.lastIndex = 0;
    while ((a = attrRe.exec(m[4] || ""))) obj[a[1]] = unescape(a[2] ?? a[3] ?? "");
    const frame = { name: m[3], obj, parent: top };
    if (m[5] === "/") finish(frame);
    else stack.push(frame);
  }
  function finish(f) {
    if (!f.parent) return;
    const text = f.text != null ? f.text.trim() : "";
    const hasKeys = Object.keys(f.obj).length > 0;
    let value;
    if (!hasKeys) value = text;
    else { value = f.obj; if (text) value["#text"] = text; }
    add(f.parent.obj, f.name, value);
  }
  return root;
}
