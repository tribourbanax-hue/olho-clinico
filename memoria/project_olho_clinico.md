---
name: project_olho_clinico
description: "Olho Clínico = 3º jogo (memorização visual de anatomia p/ os alunos), separado do Corpo em Jogo; NO AR no GitHub Pages desde 10/11"
metadata:
  node_type: memory
  type: project
  originSessionId: 81d8ad32-9c47-43af-9341-1f4936d7a98f
  modified: 2026-11-10T11:58:28.873Z
---

**NO AR 10/11:** https://tribourbanax-hue.github.io/olho-clinico/ (repo PÚBLICO tribourbanax-hue/olho-clinico, branch master; rodapé "Feito com carinho para Pâmela e companheiros de classe"). Atualizar = node build.js + commit + push.

Pedido 10/11/2026: alunos queriam jogo mais VISUAL de memorização por sistema; referência = Wordwall "imagem com legenda" (arrastar nome até o ponto do esqueleto). Usuário frisou: **é OUTRO jogo, não sobrescrever o [[project_corpo_em_jogo]]**, e não precisa ser só ligar pontos.

- Pasta: `~/projetos/JEFFERSON/olho-clinico` (git, branch master → GitHub Pages)
- Reaproveita as 11 imagens + coordenadas do Corpo em Jogo (copiadas p/ img/); 60 partes, 6 sistemas (imuno sem imagem ficou de fora)
- Modos: Estudar (números + esconder nomes), Que parte é essa? (zoom na parte → câmera afasta revelando), Monte a legenda (arrastar ou tocar-tocar, 8 por rodada + desafio todas), Relâmpago 60s
- Esqueleto: ulna e tíbia ESPELHADAS p/ o lado esquerdo (ficavam a 4% do rádio/fíbula); + carpo, tarso, falanges
- `src/dados.js` (partes/hot/dica) → `node build.js` → index.html ~553 KB
- Testado no Chrome via localhost 10/11 (rodada, arrastar, toque-toque, estudar OK)
- 10/11 rev. 2 (commit 6c148f5): SETA no lugar do círculo (usuário achou círculo ambíguo); coordenadas herdadas do Corpo em Jogo estavam ERRADAS em várias imagens (estômago, fígado, átrios, traqueia, pulmões, fíbula em cima da tíbia...) → todas recalibradas com grade; digestório/repmasc/repfem trocados por versões livres SEM linhas-guia (Wikimedia, ver CREDITOS.md), urinário com setas apagadas (originais em img/_orig/); 62 partes. Destaque colorido por preenchimento automático NÃO funciona (esqueleto todo da mesma cor) — descartado. Bug corrigido: tela() não achatava listas → "[object HTMLDivElement]".
- pe.webp/coluna.webp ainda da apostila (mesma pendência do Corpo em Jogo; mais sensível agora que é p/ turma)
