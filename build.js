// Junta tudo em um único index.html (offline) e confere os dados.
const fs = require("fs"), path = require("path");
const src = (f) => fs.readFileSync(path.join(__dirname, "src", f), "utf8");
const { SISTEMAS, REGIOES, PARTES } = require("./src/dados.js");

const IMG = {};
const imgDir = path.join(__dirname, "img");
for (const f of fs.readdirSync(imgDir)) {
  if (f.startsWith("_") || !/\.webp$/i.test(f)) continue;
  IMG[f.replace(/\.webp$/i, "")] = "data:image/webp;base64," + fs.readFileSync(path.join(imgDir, f)).toString("base64");
}

const prob = [];
for (const [k, r] of Object.entries(REGIOES)) {
  if (!IMG[r.img]) prob.push("falta imagem img/" + r.img + ".webp");
  if (!SISTEMAS[r.sis]) prob.push("sistema inválido em " + k);
  if (!SISTEMAS[r.sis].regs.includes(k)) prob.push(k + " não está na lista do sistema " + r.sis);
  for (const [pk, [nome, hot, dica]] of Object.entries(r.partes)) {
    if (!nome || !dica) prob.push("sem nome/dica: " + k + ":" + pk);
    if (!Array.isArray(hot) || hot.some((n) => n < 0 || n > 100)) prob.push("hot inválido: " + k + ":" + pk);
  }
  const ps = Object.values(r.partes);
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
    const d = Math.hypot(ps[i][1][0] - ps[j][1][0], (ps[i][1][1] - ps[j][1][1]) * r.h / r.w);
    if (d < 5) console.warn(`AVISO ${k}: "${ps[i][0]}" e "${ps[j][0]}" muito perto (${d.toFixed(1)}%)`);
  }
}
if (prob.length) { console.error("PROBLEMAS:\n- " + prob.join("\n- ")); process.exit(1); }

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#f4f1ea">
<title>Olho Clínico — Anatomia Visual</title>
<meta name="description" content="Jogo de memorização visual de anatomia: veja a parte do corpo e diga o nome.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👁️</text></svg>">
<style>${src("style.css")}</style></head>
<body><div id="app"></div>
<script>const IMG=${JSON.stringify(IMG)};
${src("dados.js")}
${src("app.js")}</script></body></html>`;
fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log(`OK: ${PARTES.length} partes em ${Object.keys(REGIOES).length} imagens · index.html ${(html.length / 1024).toFixed(0)} KB`);
