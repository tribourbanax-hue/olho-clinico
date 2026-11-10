# Créditos e licença das imagens

Status de cada imagem usada no jogo (`img/*.webp`). **Antes de publicar em site aberto**, toda imagem precisa estar na coluna "uso livre confirmado".

## ✅ Uso livre confirmado
- **Esqueleto inteiro** (`esqueleto.webp`): "Human skeleton front - no labels" — **Domínio Público** (LadyofHats / Mariana Ruiz), Wikimedia Commons.
  https://commons.wikimedia.org/wiki/File:Human_skeleton_front_-_no_labels.svg
- **Ossos da mão** (`mao.webp`): "Scheme human hand bones - no text" — **Domínio Público** (Mariana Ruiz Villarreal / LadyofHats; retoques de Nyks, Bibi Saint-Pol, Was a bee), Wikimedia Commons. Colorida por região (carpo roxo, metacarpo laranja, falanges verde/azul/vermelho). Setas/caixa de anotação removidas por processamento; SVG-fonte em `img/_src/`. Substituiu 08/11/2026 o diagrama de apostila.
  https://commons.wikimedia.org/wiki/File:Scheme_human_hand_bones_-_no_text.svg

## ⚠️ Provável livre, mas licença NÃO comprovada (verificar origem no Wikimedia antes de publicar)
Vieram de arquivos SVG (origem típica: Wikimedia Commons), mas o SVG só tem o namespace do Creative Commons que o Inkscape insere por padrão — **sem licença nem autoria declaradas**. Precisam ser rastreados até a página-fonte no Wikimedia para confirmar a licença (PD/CC0/CC-BY) e o crédito. SVGs originais em `img/_src/`.
- `coracao.webp` — coração em corte
- `digestorio.webp` — sistema digestório (há strings "CC0" no SVG, confirmar)
- `encefalo.webp` — encéfalo em corte (SVG sem metadado de CC)
- `respiratorio.webp` — sistema respiratório
- `urinario.webp` — sistema urinário
- `repfem.webp` — reprodutor feminino (esquema)
- `repmasc.webp` — reprodutor masculino (esquema; SVG tem dc:title "Human male reproductive system")

## ❌ Fechadas — trocar por equivalente de uso livre antes de publicar
Vieram da apostila/material de estudo:
- `pe.webp` — extraído do PDF da apostila
- `coluna.webp` — extraído do PDF da apostila

Opções de uso livre já levantadas (08/11/2026), porém mais fracas que as atuais coloridas — decidir na hora de publicar:
- Pé: "202110 Dorsal view of bones of right foot.svg" (DBCLS, **CC-BY-4.0**, exige crédito) — render realista, sem cor por região.
- Coluna: "Illu vertebral column.jpg" (SEER/NCI, **domínio público**, mas com texto e vista lateral) ou "Gray 111 - Vertebral column-coloured.png" (Gray's Anatomy, domínio público, estilo gravura).
Ao trocar, recalibrar os `hot` em `src/figuras.js` (overlay de auditoria com grade de %, como foi feito na mão).
