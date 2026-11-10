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
      umero: ["Úmero", [26, 30], "Osso longo do braço, do ombro até o cotovelo."],
      radio: ["Rádio", [16, 42], "Antebraço, do lado do polegar (lateral)."],
      ulna: ["Ulna", [80, 42], "Antebraço, do lado do dedo mínimo (medial)."],
      carpo: ["Carpo", [87, 49], "8 ossos curtos do punho."],
      falanges: ["Falanges", [11, 55], "Ossos dos dedos. O polegar tem só 2."],
      coxal: ["Osso do quadril (coxal)", [37, 44], "Forma a pelve junto com o sacro."],
      femur: ["Fêmur", [43, 57], "O osso mais longo e forte do corpo (coxa)."],
      patela: ["Patela", [44, 69], "Osso do joelho, protege a articulação."],
      tibia: ["Tíbia", [54, 80], "Perna, lado medial: a 'canela', mais grossa."],
      fibula: ["Fíbula", [41, 80], "Perna, lado lateral: fina, ao lado da tíbia."],
      tarso: ["Tarso", [56, 91], "7 ossos do tornozelo e do calcanhar."],
    },
  },
  mao: {
    img: "mao", w: 272, h: 421, sis: "oss", rotulo: "Ossos da mão", zoom: 2.2,
    partes: {
      carpais: ["Ossos do carpo", [48, 78], "8 ossos curtos do punho."],
      metacarpais: ["Metacarpais", [47, 60], "5 ossos da palma da mão."],
      proximais: ["Falanges proximais", [49, 44], "1ª fileira dos dedos, perto da palma."],
      medias: ["Falanges médias", [50, 26], "Fileira do meio. O polegar não tem."],
      distais: ["Falanges distais", [50, 11], "Pontas dos dedos."],
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
      cerebro: ["Cérebro", [30, 20], "Maior parte: pensamento, memória e movimentos voluntários."],
      cerebelo: ["Cerebelo", [82, 61], "Equilíbrio e coordenação dos movimentos."],
      tronco: ["Tronco encefálico", [53, 70], "Controla respiração e batimentos; liga à medula."],
    },
  },
  coracao: {
    img: "coracao", w: 472, h: 603, sis: "car", rotulo: "Coração (corte)", zoom: 2,
    partes: {
      aorta: ["Aorta", [57, 15], "Maior artéria: leva sangue arterial para o corpo."],
      atrioD: ["Átrio direito", [30, 34], "Recebe o sangue venoso do corpo (veias cavas)."],
      atrioE: ["Átrio esquerdo", [70, 28], "Recebe o sangue oxigenado dos pulmões."],
      ventriculoD: ["Ventrículo direito", [33, 61], "Manda o sangue para os pulmões."],
      ventriculoE: ["Ventrículo esquerdo", [62, 73], "Parede mais grossa: bombeia para o corpo todo."],
    },
  },
  digestorio: {
    img: "digestorio", w: 282, h: 437, sis: "dig", rotulo: "Sistema digestório", zoom: 2.2,
    partes: {
      esofago: ["Esôfago", [49, 30], "Tubo que leva o alimento da faringe ao estômago."],
      estomago: ["Estômago", [58, 52], "Digere com suco gástrico (ácido)."],
      figado: ["Fígado", [32, 47], "Maior glândula do corpo; produz a bile."],
      intdelgado: ["Intestino delgado", [48, 74], "Onde acontece a maior parte da absorção."],
      intgrosso: ["Intestino grosso", [71, 66], "Absorve água e forma as fezes."],
    },
  },
  respiratorio: {
    img: "respiratorio", w: 540, h: 710, sis: "res", rotulo: "Sistema respiratório", zoom: 2,
    partes: {
      nariz: ["Nariz e cavidade nasal", [38, 10], "Filtra, aquece e umidifica o ar."],
      traqueia: ["Traqueia", [45, 42], "Tubo com anéis de cartilagem que leva o ar."],
      bronquios: ["Brônquios", [46, 51], "Ramos da traqueia que entram nos pulmões."],
      pulmoes: ["Pulmões", [33, 62], "Trocas gasosas nos alvéolos."],
      diafragma: ["Diafragma", [40, 80], "Principal músculo da respiração."],
    },
  },
  urinario: {
    img: "urinario", w: 438, h: 626, sis: "res", rotulo: "Sistema urinário", zoom: 2,
    partes: {
      rins: ["Rins", [31, 33], "Filtram o sangue e produzem a urina."],
      ureteres: ["Ureteres", [37, 53], "Levam a urina dos rins até a bexiga."],
      bexiga: ["Bexiga", [48, 80], "Guarda a urina."],
      uretra: ["Uretra", [48, 92], "Leva a urina para fora do corpo."],
    },
  },
  repfem: {
    img: "repfem", w: 267, h: 202, sis: "rep", rotulo: "Reprodutor feminino", zoom: 2,
    partes: {
      utero: ["Útero", [50, 31], "Onde o bebê se desenvolve na gestação."],
      ovarios: ["Ovários", [19, 25], "Produzem os óvulos e hormônios."],
      trompas: ["Tubas uterinas (trompas)", [30, 22], "Onde geralmente ocorre a fecundação."],
      vagina: ["Vagina", [50, 78], "Canal que liga o útero ao meio externo."],
    },
  },
  repmasc: {
    img: "repmasc", w: 314, h: 262, sis: "rep", rotulo: "Reprodutor masculino", zoom: 2,
    partes: {
      penis: ["Pênis", [24, 58], "Órgão de cópula; por ele passa a uretra."],
      testiculo: ["Testículos", [27, 74], "Produzem espermatozoides e testosterona."],
      epididimo: ["Epidídimo", [32, 69], "Onde os espermatozoides amadurecem."],
      prostata: ["Próstata", [44, 47], "Produz parte do líquido do sêmen."],
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
