# Olho Clínico — Anatomia Visual · Contexto do projeto

Jogo de **memorização visual** de anatomia para a **Pâmela e a turma** do técnico de enfermagem.
É o 3º jogo da série, **separado** dos outros dois — nunca sobrescrever:
- *esquadrao-antibomba* (Microbiologia) e *corpo-em-jogo* (Anatomia, questões) continuam como estão.

- **Jogar:** https://tribourbanax-hue.github.io/olho-clinico/
- **Repositório:** tribourbanax-hue/olho-clinico (público, branch `master`, Pages na raiz)
- Responder sempre em **português do Brasil**, simplificando termos técnicos.

## Como funciona
Um único `index.html` offline, **gerado** por `node build.js` a partir de `src/` + `img/*.webp` (imagens embutidas em base64). Nunca editar o `index.html` à mão.

- `src/dados.js` — `SISTEMAS` (6) e `REGIOES` (11 imagens). Cada parte: `[nome, [x%, y%], dica]`. 62 partes.
- `src/app.js` — telas e modos; progresso no `localStorage` (`olhoClinico.v1`), repetição espaçada por caixa (`cx` 0–5, memorizada = ≥3).
- `src/style.css` — visual.
- `build.js` — valida os dados e avisa pontos muito próximos (<5%).

### Modos
- **👀 Estudar** — números na imagem + lista com dicas; "Esconder" para se testar.
- **🔍 Que parte é essa?** — zoom na parte com **SETA** vermelha (não círculo: círculo ficava ambíguo) → escolhe entre 4 → câmera afasta e mostra o nome no fim da seta.
- **🧩 Monte a legenda** — estilo Wordwall "imagem com legenda": arrastar nome até o ponto ou tocar nome → ponto. 8 por rodada + desafio com todas.
- **⚡ Relâmpago 60s** — erro tira 3 s.

## Regras aprendidas (importante)
- **Coordenadas exigem precisão** (a ponta da seta mostra qualquer erro). As herdadas do Corpo em Jogo estavam erradas em várias imagens; recalibradas 10/11 com grade de %. Ao trocar/adicionar imagem: gerar overlay com grade e conferir ponto a ponto.
- Esqueleto: rádio/ulna no antebraço onde os ossos são paralelos (ulna por dentro [74.5,39], rádio por fora [81,46]); tíbia [49.6,80] e fíbula [37.7,80] em pernas opostas para não colar.
- Opções nunca trazem sinônimos juntos (`GRUPO` em app.js: carpo/carpais, tarso, falanges, coluna/vértebras).
- Imagens com **linhas-guia** confundem com a seta → usar versões "without labels" do Wikimedia ou apagar (urinário: setas apagadas via OpenCV inpaint; originais em `img/_orig/`, fora do git).
- Destaque colorido por preenchimento automático **não funciona** (esqueleto todo da mesma cor) — descartado.

## Imagens / direitos — ver `CREDITOS.md`
Livres: esqueleto, mão (domínio público), digestório (PD), repmasc (CC BY-SA 4.0), repfem (CC BY-SA 3.0).
**Pendente:** `pe.webp` e `coluna.webp` ainda da apostila → trocar por livres.

## Publicar
```
node build.js
git add -A && git commit -m "..." && git push
```
Pages atualiza em ~1 min. Rodapé: "Feito com carinho para Pâmela e companheiros de classe".

## Ambiente
PC lento: não deixar servidor de teste ligado. `file://` é bloqueado pela extensão do Chrome → testar com `python -m http.server` + localhost; screenshot às vezes trava, `javascript_tool` funciona.
