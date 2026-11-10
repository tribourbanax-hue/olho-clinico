# Olho Clínico — Anatomia Visual

Jogo de **memorização visual** de anatomia (técnico de enfermagem). Irmão do *Corpo em Jogo* — jogo separado, reaproveita as imagens dele.
Offline, um arquivo só (`index.html`), feito para celular, progresso salvo no aparelho.

## Modos
- **👀 Estudar** — imagem com números + lista de nomes e dicas; "Esconder" para se testar.
- **🔍 Que parte é essa?** — a imagem abre em zoom na parte marcada; escolhe entre 4 nomes; depois a câmera afasta e mostra onde fica no todo. Repetição espaçada (as que você erra voltam mais).
- **🧩 Monte a legenda** — estilo Wordwall "imagem com legenda": arrasta o nome até o ponto (ou toca no nome e no ponto). 8 partes por rodada + desafio com todas.
- **⚡ Relâmpago 60s** — quantas partes reconhece em 1 minuto (erro = −3 s).

60 partes em 11 imagens, 6 sistemas.

## Editar
Partes, posições (`hot` em %) e dicas: `src/dados.js`. Depois: `node build.js` (gera `index.html` e confere os dados).
Imagens: ver `CREDITOS.md`.
