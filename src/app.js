// Olho Clínico — motor do jogo (memorização visual de anatomia)
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const app = $("#app");
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "style") el.style.cssText = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
};
const embaralha = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const P = Object.fromEntries(PARTES.map((p) => [p.id, p]));
const CORES = ["#f08a24", "#2e9be6", "#1f8a4c", "#c94fd1", "#e2433f", "#3b5bdb", "#d9480f", "#0c8599", "#7048e8", "#e8590c", "#2b8a3e", "#c2255c"];

// nomes que querem dizer a mesma coisa nunca aparecem juntos como opção
const GRUPO = { "esqueleto:carpo": "carpo", "mao:carpais": "carpo", "esqueleto:tarso": "tarso", "pe:tarso": "tarso",
  "esqueleto:falanges": "fal", "mao:proximais": "fal", "mao:medias": "fal", "mao:distais": "fal", "pe:falangespe": "fal",
  "esqueleto:coluna": "col", "coluna:cervical": "col", "coluna:toracica": "col", "coluna:lombar": "col", "coluna:sacro": "col", "coluna:coccix": "col" };
const grupo = (id) => GRUPO[id] || id;

// ---------- estado salvo ----------
const CHAVE = "olhoClinico.v1";
let E;
try { E = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { E = {}; }
E.p = E.p || {}; E.best = E.best || {}; E.rod = E.rod || 0; E.dias = E.dias || [];
const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(E)); } catch (e) {} };
const hoje = () => new Date().toISOString().slice(0, 10);
function marcaDia() { const d = hoje(); if (!E.dias.includes(d)) { E.dias.push(d); E.dias = E.dias.slice(-60); } }
function ofensiva() {
  let n = 0; const set = new Set(E.dias); const d = new Date();
  if (!set.has(hoje())) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const st = (id) => (E.p[id] = E.p[id] || { cx: 0, v: 0, e: 0, t: 0 });
function registra(id, certo) {
  const s = st(id); s.v++; s.t = E.rod;
  if (certo) s.cx = Math.min(5, s.cx + 1); else { s.e++; s.cx = Math.max(0, s.cx - 2); }
  marcaDia(); salvar();
}
const dominada = (id) => E.p[id] && E.p[id].cx >= 3;
const contaDom = (lista) => lista.filter((p) => dominada(p.id)).length;

// escolhe as partes que mais precisam de treino (repetição espaçada simples)
function escolhe(pool, n) {
  const nota = (p) => {
    const s = E.p[p.id];
    if (!s) return 4 + Math.random() * 8;                // nova
    return s.cx * 9 - Math.min(10, E.rod - s.t) + Math.random() * 6 - (s.e > s.v / 2 ? 4 : 0);
  };
  const ord = pool.map((p) => [nota(p), p]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const out = [], vistos = new Set();
  for (const p of ord) { if (out.length >= n) break; if (!vistos.has(p.id)) { out.push(p); vistos.add(p.id); } }
  return embaralha(out);
}
function opcoes(p) {
  const g = grupo(p.id), usados = new Set([g]), nomes = new Set([p.nome]);
  const ok = (x) => !usados.has(grupo(x.id)) && !nomes.has(x.nome);
  const mesma = embaralha(PARTES.filter((x) => x.reg === p.reg && ok(x)));
  const cat = embaralha(PARTES.filter((x) => x.reg !== p.reg && x.osso === p.osso && ok(x)));
  const out = [p.nome];
  for (const x of [...mesma, ...cat]) {
    if (out.length >= 4) break;
    if (!ok(x)) continue;
    out.push(x.nome); usados.add(grupo(x.id)); nomes.add(x.nome);
  }
  return embaralha(out);
}

// ---------- som ----------
let AC;
function bip(tipo) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const notas = tipo === "ok" ? [660, 880] : tipo === "fim" ? [523, 659, 784, 1047] : [220, 170];
    notas.forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * 0.09;
      o.type = tipo === "erro" ? "sawtooth" : "triangle"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g).connect(AC.destination); o.start(t); o.stop(t + 0.22);
    });
  } catch (e) {}
  if (navigator.vibrate) try { navigator.vibrate(tipo === "erro" ? [40, 40, 40] : 15); } catch (e) {}
}
function confete() {
  const c = h("canvas", { id: "confete" }); document.body.append(c);
  const x = c.getContext("2d"); c.width = innerWidth; c.height = innerHeight;
  const ps = Array.from({ length: 110 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4, r: Math.random() * 6, cor: CORES[Math.floor(Math.random() * CORES.length)], a: Math.random() * 6 }));
  let f = 0;
  (function tick() {
    x.clearRect(0, 0, c.width, c.height);
    for (const p of ps) { p.x += p.vx; p.y += p.vy; p.a += 0.15; x.fillStyle = p.cor; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillRect(-4, -2, 8 + p.r, 5); x.restore(); }
    if (++f < 150) requestAnimationFrame(tick); else c.remove();
  })();
}

// ---------- palco: imagem real com zoom suave ----------
function Palco(regKey, altura) {
  const r = REGIOES[regKey];
  const el = h("div", { class: "palco" });
  const img = h("img", { class: "fig", src: IMG[r.img], alt: r.rotulo, draggable: "false" });
  el.append(img);
  const itens = []; // {el, hot}
  const v = { z: 1, tx: 0, ty: 0, cw: 0, ch: 0, Fw: 0, Fh: 0, foco: null, zoom: 1 };
  function medir() {
    v.Fw = el.clientWidth || Math.min(528, innerWidth - 32);
    v.Fh = typeof altura === "function" ? altura(v.Fw, r) : altura;
    el.style.height = v.Fh + "px";
    const s = Math.min(v.Fw / r.w, v.Fh / r.h);
    v.cw = r.w * s; v.ch = r.h * s;
    img.style.width = v.cw + "px"; img.style.height = v.ch + "px";
  }
  function calc() {
    if (!v.foco) { v.z = 1; v.tx = (v.Fw - v.cw) / 2; v.ty = (v.Fh - v.ch) / 2; return; }
    const z = v.zoom, px = v.foco[0] / 100 * v.cw * z, py = v.foco[1] / 100 * v.ch * z;
    const eixo = (F, C, p) => (C >= F ? Math.min(0, Math.max(F - C, F / 2 - p)) : (F - C) / 2);
    v.z = z; v.tx = eixo(v.Fw, v.cw * z, px); v.ty = eixo(v.Fh, v.ch * z, py);
  }
  const pos = (hot) => ({ x: v.tx + hot[0] / 100 * v.cw * v.z, y: v.ty + hot[1] / 100 * v.ch * v.z });
  function aplica() {
    calc();
    img.style.transform = `translate(${v.tx}px,${v.ty}px) scale(${v.z})`;
    for (const it of itens) { const p = pos(it.hot); it.el.style.left = p.x + "px"; it.el.style.top = p.y + "px"; }
  }
  const api = {
    el, r,
    add(node, hot) { el.append(node); itens.push({ el: node, hot }); if (v.Fw) { const p = pos(hot); node.style.left = p.x + "px"; node.style.top = p.y + "px"; } return node; },
    focar(hot, zoom) { v.foco = hot; v.zoom = zoom || r.zoom || 2; aplica(); },
    inteiro() { v.foco = null; aplica(); },
    semAnim(fn) { el.classList.add("sem"); img.style.transition = "none"; itens.forEach((i) => (i.el.style.transition = "none")); fn(); void el.offsetWidth; img.style.transition = ""; itens.forEach((i) => (i.el.style.transition = "")); },
    montar() { medir(); api.semAnim(aplica); },
    pos,
    // ponto clicado (coordenadas do palco) → parte mais perto entre as candidatas
    maisPerto(x, y, cands, raio = 46) {
      let best = null, bd = 1e9;
      for (const c of cands) { const p = pos(c.hot); const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = c; } }
      return bd <= raio ? best : null;
    },
  };
  palcoAtual = api;
  return api;
}
let palcoAtual = null, relogio = null;
addEventListener("resize", () => { if (palcoAtual && palcoAtual.el.isConnected) palcoAtual.montar(); });
const alturaCheia = (Fw, r) => Math.round(Math.min(innerHeight * 0.62, Math.max(260, Fw * r.h / r.w)));
const alturaZoom = () => Math.round(Math.min(330, Math.max(240, innerHeight * 0.4)));

// ---------- telas ----------
function tela(...kids) {
  if (relogio) { clearInterval(relogio); relogio = null; }
  palcoAtual = null;
  app.replaceChildren(...kids);
  scrollTo(0, 0);
}
const topo = (titulo, sub, volta = inicio) => h("div", { class: "top" }, h("button", { class: "voltar", onclick: volta, "aria-label": "Voltar" }, "←"), h("div", { style: "flex:1" }, h("h2", {}, titulo), sub ? h("div", { class: "sub" }, sub) : null));

function inicio() {
  const tot = PARTES.length, dom = contaDom(PARTES);
  tela(
    h("div", { class: "hero" }, h("div", { class: "logo" }, "👁️"), h("h1", {}, "Olho Clínico"), h("p", {}, "Memorize o corpo humano olhando: veja a parte e diga o nome.")),
    h("div", { class: "stats" },
      h("div", { class: "stat" }, h("b", {}, `${dom}/${tot}`), h("span", {}, "memorizadas")),
      h("div", { class: "stat" }, h("b", {}, `${ofensiva()} 🔥`), h("span", {}, "dias seguidos")),
      h("div", { class: "stat" }, h("b", {}, `${E.best.rel || 0} ⚡`), h("span", {}, "recorde 60s"))),
    h("button", { class: "big", onclick: () => rodada(escolhe(PARTES, 10), "Treino misturado", inicio) },
      h("div", { class: "ic", style: "background:#e6efff" }, "🔍"), h("div", {}, h("b", {}, "Que parte é essa?"), h("small", {}, "10 partes de todos os sistemas, as que você mais erra primeiro"))),
    h("button", { class: "big", onclick: escolheMontar },
      h("div", { class: "ic", style: "background:#fff1d6" }, "🧩"), h("div", {}, h("b", {}, "Monte a legenda"), h("small", {}, "Arraste cada nome até o ponto certo da imagem"))),
    h("button", { class: "big", onclick: relampago },
      h("div", { class: "ic", style: "background:#ffe3e3" }, "⚡"), h("div", {}, h("b", {}, "Relâmpago 60 segundos"), h("small", {}, "Quantas partes você reconhece em 1 minuto?"))),
    h("div", { class: "sec" }, "Estudar por sistema"),
    h("div", { class: "grid" }, Object.entries(SISTEMAS).map(([k, s]) => {
      const lista = PARTES.filter((p) => p.sis === k), d = contaDom(lista);
      return h("button", { class: "sis", style: `--c:${s.cor}`, onclick: () => sistema(k) },
        h("div", { class: "em" }, s.emoji), h("b", {}, s.nome),
        h("div", { class: "barra" }, h("i", { style: `width:${(100 * d) / lista.length}%` })),
        h("small", {}, `${d} de ${lista.length} memorizadas`));
    })),
    h("div", { class: "rodape" }, "Funciona sem internet · seu progresso fica salvo neste aparelho")
  );
}

function sistema(k) {
  const s = SISTEMAS[k], lista = PARTES.filter((p) => p.sis === k);
  tela(
    topo(`${s.emoji} ${s.nome}`, `${contaDom(lista)} de ${lista.length} partes memorizadas`),
    h("button", { class: "cta", onclick: () => rodada(escolhe(lista, Math.min(10, lista.length)), s.nome, () => sistema(k)) }, `🔍 Que parte é essa? (${Math.min(10, lista.length)})`),
    s.regs.map((rk) => cartaoRegiao(rk, () => sistema(k)))
  );
}
function cartaoRegiao(rk, volta) {
  const r = REGIOES[rk], ps = PARTES.filter((p) => p.reg === rk), b = E.best["m:" + rk];
  return h("div", { class: "reg" },
    h("div", { class: "th", style: `background-image:url(${IMG[r.img]})` }),
    h("div", { class: "info" }, h("b", {}, r.rotulo),
      h("small", {}, `${ps.length} partes · ${contaDom(ps)} memorizadas${b ? ` · recorde ${b.t}s` : ""}`),
      h("div", { class: "acts" },
        h("button", { class: "pill", onclick: () => estudar(rk, volta) }, "👀 Estudar"),
        h("button", { class: "pill alt", onclick: () => montar(rk, volta) }, "🧩 Montar"))));
}
function escolheMontar() {
  tela(topo("🧩 Monte a legenda", "Escolha a imagem"),
    Object.entries(SISTEMAS).map(([k, s]) => [h("div", { class: "sec" }, `${s.emoji} ${s.nome}`), s.regs.map((rk) => cartaoRegiao(rk, escolheMontar))]));
}

// ---------- ESTUDAR: mapa com números ----------
function estudar(rk, volta) {
  const r = REGIOES[rk], ps = PARTES.filter((p) => p.reg === rk);
  let esconder = false;
  const pal = Palco(rk, alturaCheia);
  const lis = ps.map((p, i) => h("button", { class: "li", onclick: (ev) => { if (esconder) ev.currentTarget.classList.toggle("oculto"); piscar(i); } },
    h("span", { class: "n" }, i + 1), h("div", {}, h("b", {}, p.nome), h("small", {}, p.dica))));
  const pins = ps.map((p, i) => pal.add(h("div", { class: "pin" }, i + 1), p.hot));
  function piscar(i) {
    lis.forEach((l) => l.classList.remove("ativo")); lis[i].classList.add("ativo");
    pins[i].animate([{ transform: "scale(1)" }, { transform: "scale(1.9)" }, { transform: "scale(1)" }], { duration: 600 });
  }
  pal.el.addEventListener("click", (ev) => {
    const b = pal.el.getBoundingClientRect(); const c = pal.maisPerto(ev.clientX - b.left, ev.clientY - b.top, ps, 30);
    if (c) { const i = ps.indexOf(c); piscar(i); lis[i].scrollIntoView({ behavior: "smooth", block: "nearest" }); }
  });
  const bt1 = h("button", { class: "on", onclick: () => modo(false) }, "Mostrar nomes");
  const bt2 = h("button", { onclick: () => modo(true) }, "Esconder (me testar)");
  function modo(x) { esconder = x; bt1.classList.toggle("on", !x); bt2.classList.toggle("on", x); lis.forEach((l) => l.classList.toggle("oculto", x)); }
  tela(topo(`👀 ${r.rotulo}`, "Toque num número para achar o nome", volta), pal.el,
    h("div", { class: "toggle" }, bt1, bt2), h("div", { class: "lista" }, lis),
    h("button", { class: "cta", style: "margin-top:16px", onclick: () => montar(rk, volta) }, "🧩 Agora monte a legenda"));
  pal.montar(); pal.inteiro();
}

// ---------- QUE PARTE É ESSA? (zoom → revela) ----------
function rodada(lista, titulo, volta) {
  E.rod++; salvar();
  let i = 0, acertos = 0, combo = 0, melhorCombo = 0; const erros = [];
  function pergunta() {
    if (i >= lista.length) return fim();
    const p = lista[i], pal = Palco(p.reg, alturaZoom);
    const alvo = pal.add(h("div", { class: "alvo" }), p.hot);
    const etq = pal.add(h("div", { class: "etq" }, p.nome), p.hot);
    pal.el.append(h("div", { class: "cont" }, REGIOES[p.reg].rotulo));
    const ops = opcoes(p), area = h("div");
    const comboEl = h("div", { class: "combo" }, combo >= 2 ? `🔥 ${combo} seguidas!` : "");
    const btns = ops.map((o) => h("button", { class: "op", onclick: () => responde(o) }, o));
    function responde(o) {
      btns.forEach((b) => { b.disabled = true; if (b.textContent === p.nome) b.classList.add("ok"); else if (b.textContent === o) b.classList.add("bad"); });
      const certo = o === p.nome; registra(p.id, certo);
      if (certo) { acertos++; combo++; melhorCombo = Math.max(melhorCombo, combo); bip("ok"); } else { combo = 0; erros.push(p); bip("erro"); }
      comboEl.textContent = certo ? (combo >= 2 ? `🔥 ${combo} seguidas!` : "✅ Isso!") : "❌ Era " + p.nome;
      alvo.classList.add("peq"); pal.inteiro(); etq.classList.add("on");
      area.append(h("div", { class: "dica" }, h("b", {}, p.nome), p.dica),
        h("button", { class: "cta" + (certo ? " verde" : ""), style: "margin-top:12px", onclick: () => { i++; pergunta(); } }, i + 1 < lista.length ? "Continuar →" : "Ver resultado"));
    }
    tela(topo(titulo, `${i + 1} de ${lista.length}`, volta),
      h("div", { class: "prog" }, h("i", { style: `width:${(100 * i) / lista.length}%` })),
      pal.el, h("div", { class: "qtxt" }, p.osso ? "Que osso é esse?" : "Que parte é essa?"), comboEl,
      h("div", { class: "ops" }, btns), area);
    pal.montar(); pal.semAnim(() => pal.focar(p.hot));
  }
  function fim() {
    const pct = acertos / lista.length, est = pct === 1 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
    if (est >= 2) { bip("fim"); confete(); }
    tela(h("div", { class: "res" },
      h("div", { class: "estrelas" }, "⭐".repeat(est) + "☆".repeat(3 - est)),
      h("h2", {}, pct === 1 ? "Olho clínico!" : pct >= 0.7 ? "Mandou bem!" : "Bora fixar mais um pouco"),
      h("p", {}, `${acertos} de ${lista.length} certas · melhor sequência ${melhorCombo}`),
      erros.length ? h("div", { class: "errou" }, h("b", {}, "Para revisar:"), erros.map((p) => h("span", {}, p.nome))) : null,
      erros.length ? h("button", { class: "cta", onclick: () => rodada(embaralha(erros), "Revisando erros", volta) }, "🔁 Treinar só as que errei") : null,
      h("button", { class: "cta verde", onclick: () => rodada(escolhe(lista.length >= 10 ? PARTES.filter((p) => lista.some((l) => l.sis === p.sis)) : lista, lista.length), titulo, volta) }, "Jogar de novo"),
      h("button", { class: "big", style: "justify-content:center", onclick: volta }, "Voltar")));
  }
  pergunta();
}

// ---------- MONTE A LEGENDA (estilo arrastar e soltar) ----------
function montar(rk, volta, todos) {
  const r = REGIOES[rk], todas = PARTES.filter((p) => p.reg === rk);
  const MAX = 8, lista = todos || todas.length <= MAX ? todas : escolhe(todas, MAX);
  const pal = Palco(rk, alturaCheia);
  const cores = embaralha(CORES);
  const pontos = {}, feitos = new Set();
  lista.forEach((p) => (pontos[p.id] = pal.add(h("div", { class: "ponto" }), p.hot)));
  let erros = 0, sel = null, t0 = Date.now();
  const errosPorParte = new Set();
  const hudT = h("b", {}, "0s"), hudA = h("b", {}, `0/${lista.length}`), hudE = h("b", {}, "0");
  const chips = embaralha(lista).map((p, i) => {
    const c = h("div", { class: "chip", style: `background:${cores[i % cores.length]}` }, p.nome); c._p = p; return c;
  });
  // arrastar com o dedo (ou tocar no nome e depois no ponto)
  let arr = null, mira = null;
  const fantasma = (c) => { const g = c.cloneNode(true); g.classList.add("fantasma"); document.body.append(g); return g; };
  function miraEm(x, y) {
    const b = pal.el.getBoundingClientRect();
    const c = pal.maisPerto(x - b.left, y - b.top, lista.filter((p) => !feitos.has(p.id)));
    if (mira) pontos[mira.id].classList.remove("mira");
    mira = c; if (c) pontos[c.id].classList.add("mira");
  }
  chips.forEach((c) => {
    c.addEventListener("pointerdown", (ev) => {
      ev.preventDefault(); c.setPointerCapture(ev.pointerId);
      arr = { c, x0: ev.clientX, y0: ev.clientY, g: null };
    });
    c.addEventListener("pointermove", (ev) => {
      if (!arr || arr.c !== c) return;
      if (!arr.g && Math.hypot(ev.clientX - arr.x0, ev.clientY - arr.y0) > 8) { arr.g = fantasma(c); c.style.opacity = ".35"; }
      if (arr.g) { arr.g.style.left = ev.clientX + "px"; arr.g.style.top = ev.clientY + "px"; miraEm(ev.clientX, ev.clientY - 40); }
    });
    const solta = (ev) => {
      if (!arr || arr.c !== c) return;
      const a = arr; arr = null; c.style.opacity = "";
      if (a.g) { a.g.remove(); const m = mira; if (mira) pontos[mira.id].classList.remove("mira"); mira = null; if (m) tenta(c, m); else c.classList.add("bad"), setTimeout(() => c.classList.remove("bad"), 400); }
      else { if (sel === c) { c.classList.remove("sel"); sel = null; } else { if (sel) sel.classList.remove("sel"); sel = c; c.classList.add("sel"); } }
    };
    c.addEventListener("pointerup", solta); c.addEventListener("pointercancel", solta);
  });
  pal.el.addEventListener("click", (ev) => {
    if (!sel) return;
    const b = pal.el.getBoundingClientRect();
    const alvo = pal.maisPerto(ev.clientX - b.left, ev.clientY - b.top, lista.filter((p) => !feitos.has(p.id)));
    if (alvo) tenta(sel, alvo);
  });
  function tenta(c, alvo) {
    const p = c._p;
    if (alvo.id === p.id) {
      feitos.add(p.id); bip("ok");
      const pt = pontos[p.id]; pt.classList.add("ok");
      pal.add(h("div", { class: "tag" + (p.hot[0] > 55 ? " esq" : ""), style: `background:${c.style.background}` }, p.nome), p.hot);
      c.classList.add("fora"); c.classList.remove("sel"); if (sel === c) sel = null;
      if (!errosPorParte.has(p.id)) registra(p.id, true);
      hudA.textContent = `${feitos.size}/${lista.length}`;
      if (feitos.size === lista.length) setTimeout(fim, 700);
    } else {
      erros++; hudE.textContent = erros; bip("erro");
      if (!errosPorParte.has(p.id)) { errosPorParte.add(p.id); registra(p.id, false); }
      const pt = pontos[alvo.id]; pt.classList.add("erro"); setTimeout(() => pt.classList.remove("erro"), 450);
      c.classList.add("bad"); setTimeout(() => c.classList.remove("bad"), 400);
    }
  }
  function fim() {
    const t = Math.round((Date.now() - t0) / 1000), est = erros === 0 ? 3 : erros <= 2 ? 2 : 1;
    const k = "m:" + rk, b = E.best[k], recorde = !b || t < b.t && erros <= b.e || erros < b.e;
    if (recorde) { E.best[k] = { t, e: erros }; salvar(); }
    bip("fim"); if (est >= 2) confete();
    tela(h("div", { class: "res" },
      h("div", { class: "estrelas" }, "⭐".repeat(est) + "☆".repeat(3 - est)),
      h("h2", {}, erros === 0 ? "Legenda perfeita!" : "Legenda completa!"),
      h("p", {}, `${r.rotulo} · ${t}s · ${erros} erro${erros === 1 ? "" : "s"}${recorde ? " · 🏆 novo recorde!" : ""}`),
      errosPorParte.size ? h("div", { class: "errou" }, h("b", {}, "Você trocou:"), [...errosPorParte].map((id) => h("span", {}, P[id].nome))) : null,
      h("button", { class: "cta verde", onclick: () => montar(rk, volta) }, todas.length > MAX ? "Jogar de novo (outras partes)" : "Jogar de novo"),
      todas.length > MAX ? h("button", { class: "cta", onclick: () => montar(rk, volta, todas) }, `Desafio: todas as ${todas.length} partes`) : null,
      h("button", { class: "big", style: "justify-content:center", onclick: () => estudar(rk, volta) }, "👀 Estudar o mapa"),
      h("button", { class: "big", style: "justify-content:center", onclick: volta }, "Voltar")));
  }
  tela(topo(`🧩 ${r.rotulo}`, "Arraste o nome até o ponto (ou toque no nome e depois no ponto)", volta),
    h("div", { class: "hud" }, h("span", {}, "⏱ ", hudT), h("span", {}, "✅ ", hudA), h("span", {}, "❌ ", hudE)),
    pal.el, h("div", { class: "chips" }, chips));
  pal.montar(); pal.inteiro();
  E.rod++; salvar();
  relogio = setInterval(() => (hudT.textContent = Math.round((Date.now() - t0) / 1000) + "s"), 1000);
}

// ---------- RELÂMPAGO 60s ----------
function relampago() {
  E.rod++;
  let pontos = 0, fimEm = Date.now() + 60000, fila = embaralha(PARTES), idx = 0, travado = false;
  const placar = h("b", {}, "0"), tempo = h("b", {}, "60s"), barra = h("i", { style: "width:100%" });
  const corpo = h("div");
  function prox() {
    if (idx >= fila.length) { fila = embaralha(PARTES); idx = 0; }
    const p = fila[idx++], pal = Palco(p.reg, alturaZoom);
    pal.add(h("div", { class: "alvo" }), p.hot);
    const btns = opcoes(p).map((o) => h("button", { class: "op", onclick: () => {
      if (travado) return; travado = true;
      const certo = o === p.nome; registra(p.id, certo);
      btns.forEach((b) => { if (b.textContent === p.nome) b.classList.add("ok"); else if (b.textContent === o) b.classList.add("bad"); });
      if (certo) { pontos++; placar.textContent = pontos; bip("ok"); } else { bip("erro"); fimEm -= 3000; }
      setTimeout(() => { travado = false; if (Date.now() < fimEm) prox(); }, certo ? 350 : 1100);
    } }, o));
    corpo.replaceChildren(pal.el, h("div", { class: "qtxt" }, p.osso ? "Que osso é esse?" : "Que parte é essa?"), h("div", { class: "ops" }, btns));
    pal.montar(); pal.semAnim(() => pal.focar(p.hot));
  }
  tela(topo("⚡ Relâmpago", "Errou = perde 3 segundos"), h("div", { class: "hud" }, h("span", {}, "⏱ ", tempo), h("span", {}, "Pontos: ", placar)),
    h("div", { class: "timer" }, barra), corpo);
  prox();
  relogio = setInterval(() => {
    const rest = Math.max(0, Math.ceil((fimEm - Date.now()) / 1000));
    tempo.textContent = rest + "s"; barra.style.width = (rest / 60) * 100 + "%";
    if (rest <= 0) {
      clearInterval(relogio); relogio = null;
      const rec = pontos > (E.best.rel || 0); if (rec) E.best.rel = pontos; salvar();
      bip("fim"); if (rec && pontos > 0) confete();
      tela(h("div", { class: "res" }, h("div", { class: "estrelas" }, "⚡"), h("h2", {}, `${pontos} ponto${pontos === 1 ? "" : "s"}`),
        h("p", {}, rec ? "🏆 Novo recorde!" : `Seu recorde: ${E.best.rel}`),
        h("button", { class: "cta verde", onclick: relampago }, "Tentar de novo"),
        h("button", { class: "big", style: "justify-content:center", onclick: inicio }, "Início")));
    }
  }, 250);
}

inicio();
