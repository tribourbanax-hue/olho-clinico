// Olho Clínico — dados das imagens e das partes.
// Imagens e coordenadas vêm do jogo Corpo em Jogo (tribourbanax-hue/corpo-em-jogo).
// hot = [x%, y%] da posição da parte dentro da imagem. dica = 1 frase pra fixar.

const SISTEMAS = {
  oss: { nome: "Ossos", emoji: "🦴", cor: "#e8a33d", regs: ["esqueleto", "mao", "pe", "coluna"] },
  ner: { nome: "Nervoso", emoji: "🧠", cor: "#8b6fd6", regs: ["encefalo"] },
  car: { nome: "Coração", emoji: "❤️", cor: "#e2525c", regs: ["coracao"] },
  dig: { nome: "Digestório", emoji: "🍽️", cor: "#3fa66b", regs: ["digestorio"] },
  res: { nome: "Respiratório e Renal", emoji: "🫁", cor: "#3b8fd9", regs: ["respiratorio", "urinario"] },
  rep: { nome: "Reprodutor", emoji: "🧬", cor: "#d45fa0", regs: ["repfem", "repmasc"] },
};

// w/h = tamanho real da imagem (para encaixar sem distorcer)
const REGIOES = {
  esqueleto: {
    img: "esqueleto", w: 520, h: 1005, sis: "oss", rotulo: "Esqueleto inteiro", zoom: 3.2,
    partes: {
      cranio: ["Crânio", [50, 6], "Protege o encéfalo. São 22 ossos: 8 do crânio e 14 da face."],
      clavicula: ["Clavícula", [42, 19], "Liga o esterno à escápula. Osso do 'colar'."],
      escapula: ["Escápula", [33, 21], "Osso plano das costas, a 'pá' do ombro."],
      esterno: ["Esterno", [50, 24], "Osso plano no meio do peito, onde as costelas se prendem."],
      costelas: ["Costelas", [37, 27], "12 pares: 7 verdadeiras, 3 falsas e 2 flutuantes."],
      coluna: ["Coluna vertebral", [50, 36], "Eixo do corpo: protege a medula espinal."],
      umero: ["Úmero", [22.0, 29.8], "Osso longo do braço, do ombro até o cotovelo."],
      radio: ["Rádio", [81, 46], "Antebraço, do lado do polegar (lateral, por fora)."],
      ulna: ["Ulna", [74.5, 39], "Antebraço, do lado do dedo mínimo (medial, por dentro)."],
      carpo: ["Carpo", [87, 49], "8 ossos curtos do punho."],
      falanges: ["Falanges", [14.7, 54.3], "Ossos dos dedos. O polegar tem só 2."],
      coxal: ["Osso do quadril (coxal)", [37, 44], "Forma a pelve junto com o sacro."],
      femur: ["Fêmur", [35.7, 57.5], "O osso mais longo e forte do corpo (coxa)."],
      patela: ["Patela", [44, 69], "Osso do joelho, protege a articulação."],
      tibia: ["Tíbia", [49.6, 80], "Perna, lado medial: a 'canela', mais grossa."],
      fibula: ["Fíbula", [37.7, 80], "Perna, lado lateral: fina, ao lado da tíbia."],
      tarso: ["Tarso", [54.8, 91.6], "7 ossos do tornozelo e do calcanhar."],
    },
  },
  mao: {
    img: "mao", w: 272, h: 421, sis: "oss", rotulo: "Ossos da mão", zoom: 2.2,
    partes: {
      carpais: ["Ossos do carpo", [48, 78], "8 ossos curtos do punho."],
      metacarpais: ["Metacarpais", [47, 60], "5 ossos da palma da mão."],
      proximais: ["Falanges proximais", [49, 36], "1ª fileira dos dedos, perto da palma."],
      medias: ["Falanges médias", [50, 19], "Fileira do meio. O polegar não tem."],
      distais: ["Falanges distais", [50, 8], "Pontas dos dedos."],
    },
  },
  pe: {
    img: "pe", w: 398, h: 878, sis: "oss", rotulo: "Ossos do pé", zoom: 2,
    partes: {
      tarso: ["Ossos do tarso", [45, 20], "7 ossos; o calcâneo é o maior (calcanhar)."],
      metatarso: ["Metatarsais", [48, 52], "5 ossos do meio do pé."],
      falangespe: ["Falanges do pé", [48, 82], "Ossos dos dedos do pé. O hálux tem 2."],
    },
  },
  coluna: {
    img: "coluna", w: 160, h: 755, sis: "oss", rotulo: "Coluna vertebral", zoom: 2.4,
    partes: {
      cervical: ["Vértebras cervicais", [55, 9], "7 vértebras do pescoço."],
      toracica: ["Vértebras torácicas", [45, 34], "12 vértebras, onde as costelas se prendem."],
      lombar: ["Vértebras lombares", [48, 58], "5 vértebras, as maiores: aguentam o peso."],
      sacro: ["Sacro", [45, 80], "5 vértebras fundidas, parte da pelve."],
      coccix: ["Cóccix", [48, 94], "Final da coluna, 'ossinho do rabo'."],
    },
  },
  encefalo: {
    img: "encefalo", w: 540, h: 596, sis: "ner", rotulo: "Encéfalo (corte)", zoom: 2,
    partes: {
      cerebro: ["Cérebro", [25, 12], "Maior parte: pensamento, memória e movimentos voluntários."],
      cerebelo: ["Cerebelo", [72, 55], "Equilíbrio e coordenação dos movimentos."],
      tronco: ["Tronco encefálico", [52, 62], "Controla respiração e batimentos; liga à medula."],
    },
  },
  coracao: {
    img: "coracao", w: 472, h: 603, sis: "car", rotulo: "Coração (corte)", zoom: 2,
    partes: {
      aorta: ["Aorta", [57, 15], "Maior artéria: leva sangue arterial para o corpo."],
      atrioD: ["Átrio direito", [18, 45], "Recebe o sangue venoso do corpo (veias cavas)."],
      atrioE: ["Átrio esquerdo", [64, 34], "Recebe o sangue oxigenado dos pulmões."],
      ventriculoD: ["Ventrículo direito", [26, 63], "Manda o sangue para os pulmões."],
      ventriculoE: ["Ventrículo esquerdo", [62, 73], "Parede mais grossa: bombeia para o corpo todo."],
    },
  },
  digestorio: {
    img: "digestorio", w: 520, h: 1189, sis: "dig", rotulo: "Sistema digestório", zoom: 2.4,
    partes: {
      esofago: ["Esôfago", [51, 43], "Tubo que leva o alimento da faringe ao estômago."],
      estomago: ["Estômago", [73, 57], "Digere com suco gástrico (ácido)."],
      figado: ["Fígado", [28, 60], "Maior glândula do corpo; produz a bile."],
      intdelgado: ["Intestino delgado", [48, 82], "Onde acontece a maior parte da absorção."],
      intgrosso: ["Intestino grosso", [84, 77], "Absorve água e forma as fezes."],
    },
  },
  respiratorio: {
    img: "respiratorio", w: 540, h: 710, sis: "res", rotulo: "Sistema respiratório", zoom: 2,
    partes: {
      nariz: ["Nariz e cavidade nasal", [27, 14], "Filtra, aquece e umidifica o ar."],
      traqueia: ["Traqueia", [37, 45], "Tubo com anéis de cartilagem que leva o ar."],
      bronquios: ["Brônquios", [43, 57], "Ramos da traqueia que entram nos pulmões."],
      pulmoes: ["Pulmões", [60, 60], "Trocas gasosas nos alvéolos."],
      diafragma: ["Diafragma", [22, 84], "Principal músculo da respiração."],
    },
  },
  urinario: {
    img: "urinario", w: 438, h: 626, sis: "res", rotulo: "Sistema urinário", zoom: 2,
    partes: {
      rins: ["Rins", [31, 33], "Filtram o sangue e produzem a urina."],
      ureteres: ["Ureteres", [34, 52], "Levam a urina dos rins até a bexiga."],
      bexiga: ["Bexiga", [48, 80], "Guarda a urina."],
      uretra: ["Uretra", [44, 92], "Leva a urina para fora do corpo."],
    },
  },
  repfem: {
    img: "repfem", w: 579, h: 400, sis: "rep", rotulo: "Reprodutor feminino (frente)", zoom: 2,
    partes: {
      utero: ["Útero", [41.7, 22.1], "Onde o bebê se desenvolve na gestação."],
      ovarios: ["Ovários", [23.3, 19.1], "Produzem os óvulos e hormônios."],
      trompas: ["Tubas uterinas (trompas)", [26.7, 10.3], "Onde geralmente ocorre a fecundação."],
      vagina: ["Vagina", [45, 66.2], "Canal que liga o útero ao meio externo."],
    },
  },
  repmasc: {
    img: "repmasc", w: 331, h: 537, sis: "rep", rotulo: "Reprodutor masculino (lateral)", zoom: 2,
    partes: {
      testiculo: ["Testículos", [67, 84], "Produzem espermatozoides e testosterona."],
      epididimo: ["Epidídimo", [60, 75], "Onde os espermatozoides amadurecem."],
      deferente: ["Ducto deferente", [70.5, 30], "Leva os espermatozoides do epidídimo até a uretra."],
      vesiculas: ["Glândulas seminais", [10, 38.5], "Produzem a maior parte do líquido do sêmen."],
      prostata: ["Próstata", [26, 50], "Produz parte do líquido do sêmen; fica abaixo da bexiga."],
      penis: ["Pênis", [74, 61.5], "Órgão de cópula; por ele passa a uretra."],
    },
  },

};

const OSSO_REGS = ["esqueleto", "mao", "pe", "coluna"];

// lista plana de partes: id = "regiao:parte"
const PARTES = [];
for (const [rk, r] of Object.entries(REGIOES))
  for (const [pk, [nome, hot, dica]] of Object.entries(r.partes))
    PARTES.push({ id: rk + ":" + pk, reg: rk, sis: r.sis, nome, hot, dica, osso: OSSO_REGS.includes(rk) });

if (typeof module !== "undefined") module.exports = { SISTEMAS, REGIOES, PARTES };
