/*
  Motor de nichos do Elev8 Score.

  Cada segmento é uma ficha fixa que guia tudo o que a IA escreve: vocabulário, ação principal,
  temas de post e regras do setor. A IA nunca escreve fora da ficha, e todo negócio cai em algum
  perfil: se nenhuma palavra da categoria do Google bater, ele recebe o perfil "genérico".
  Assim o sistema não depende de a IA adivinhar o tipo de negócio, e não trava com nicho novo.
*/

export type SegmentoId =
  | "estetica"
  | "odontologia"
  | "advocacia"
  | "restaurante"
  | "academia"
  | "pet"
  | "beleza"
  | "loja"
  | "generico";

export type Segmento = {
  id: SegmentoId;
  nome: string;
  /** Palavras que aparecem na categoria do Google Maps (sem acento, minúsculas). */
  chaves: string[];
  cliente: string; // clientes, pacientes, alunos, tutores
  acao: string; // verbo da conversão principal
  atender: string; // como agradecer o atendimento: "te atender", "receber você"
  perguntaInicial: string; // pergunta da primeira resposta no WhatsApp
  /** Temas que viram posts. Escritos uma vez por nicho e completados com os dados da empresa. */
  temas: {
    dor: string; // post de identificação com o problema
    comparacao: string; // "A ou B: qual escolher?"
    mito: string;
    cuidados: string;
    primeiraVez: string; // substitui post de preço quando o setor não permite
    bastidor: string; // foto real
    equipe: string; // foto real
    espaco: string; // foto real
  };
  /** Pode falar de preço em post? Advocacia e alguns setores de saúde não. */
  permitePreco: boolean;
  /** Regras do setor que a IA segue e que o empresário vê antes de publicar. */
  regras: string[];
};

export const segmentos: Record<SegmentoId, Segmento> = {
  estetica: {
    id: "estetica",
    nome: "Clínica de estética",
    chaves: ["estetica", "esteticista", "spa", "depilacao", "beauty clinic"],
    cliente: "clientes",
    acao: "agendar uma avaliação",
    atender: "te atender",
    perguntaInicial: "qual tratamento você está procurando? Assim já te passo valores e horários.",
    temas: {
      dor: "3 sinais de que sua pele precisa de uma limpeza profunda",
      comparacao: "Peeling ou limpeza de pele: qual escolher?",
      mito: "Mito ou verdade: limpeza de pele machuca?",
      cuidados: "5 cuidados depois da limpeza de pele",
      primeiraVez: "Como funciona a sua primeira avaliação",
      bastidor: "A sala de atendimento arrumada, de frente, com luz natural",
      equipe: "Você na recepção, sorrindo, com luz natural",
      espaco: "Os produtos organizados na bancada",
    },
    permitePreco: true,
    regras: ["Não prometa resultado garantido de tratamento.", "Fotos de antes e depois só com autorização por escrito da cliente."],
  },
  odontologia: {
    id: "odontologia",
    nome: "Consultório odontológico",
    chaves: ["dentista", "odonto", "ortodont", "implante dentario"],
    cliente: "pacientes",
    acao: "marcar uma consulta",
    atender: "te atender",
    perguntaInicial: "o que você está precisando? Assim te explico como funciona a primeira consulta.",
    temas: {
      dor: "3 sinais de que está na hora de voltar ao dentista",
      comparacao: "Clareamento a laser ou caseiro: qual a diferença?",
      mito: "Mito ou verdade: clareamento enfraquece os dentes?",
      cuidados: "5 hábitos que protegem seu sorriso",
      primeiraVez: "Como é a sua primeira consulta com a gente",
      bastidor: "O consultório pronto para atender, de frente",
      equipe: "A equipe reunida na recepção",
      espaco: "Os instrumentos esterilizados e organizados",
    },
    permitePreco: false,
    regras: [
      "Siga as regras de publicidade do conselho de odontologia: sem preço, sem promoção e sem promessa de resultado.",
      "Antes e depois só dentro das regras do conselho e com autorização do paciente.",
    ],
  },
  advocacia: {
    id: "advocacia",
    nome: "Escritório de advocacia",
    chaves: ["advoga", "advocacia", "advogado", "juridic"],
    cliente: "clientes",
    acao: "agendar uma conversa",
    atender: "te atender",
    perguntaInicial: "qual é a sua situação, em poucas palavras? Assim te explico como funciona o primeiro atendimento.",
    temas: {
      dor: "3 situações em que vale procurar um advogado trabalhista",
      comparacao: "Acordo ou processo: o que considerar antes de decidir",
      mito: "Mito ou verdade: quem pede demissão perde todos os direitos?",
      cuidados: "5 documentos para guardar quando você sai de um emprego",
      primeiraVez: "Como funciona o primeiro atendimento no escritório",
      bastidor: "A sala de reuniões do escritório, de frente",
      equipe: "Os advogados do escritório, em foto institucional",
      espaco: "A fachada ou a recepção do escritório",
    },
    permitePreco: false,
    regras: [
      "Conteúdo informativo, sem captação de clientela nem mercantilização (regras da OAB).",
      "Não prometa resultado de processo nem cite valores de honorários.",
    ],
  },
  restaurante: {
    id: "restaurante",
    nome: "Restaurante",
    chaves: ["restaurante", "pizzaria", "lanchonete", "hamburgueria", "cafe", "cafeteria", "padaria", "bar", "churrascaria", "sorveteria"],
    cliente: "clientes",
    acao: "reservar ou pedir",
    atender: "receber você",
    perguntaInicial: "é para hoje ou para outro dia? Me diz quantas pessoas que eu já te ajudo.",
    temas: {
      dor: "3 motivos para fugir do almoço sem graça esta semana",
      comparacao: "Massa fresca ou seca: qual a diferença no prato?",
      mito: "Mito ou verdade: comida caseira demora mais?",
      cuidados: "5 pratos para quem vem pela primeira vez",
      primeiraVez: "O que pedir na sua primeira visita",
      bastidor: "A cozinha preparando o prato mais pedido",
      equipe: "Quem cozinha para você, com o avental da casa",
      espaco: "O salão arrumado antes de abrir",
    },
    permitePreco: true,
    regras: ["Fotos de prato sempre do prato real servido na casa."],
  },
  academia: {
    id: "academia",
    nome: "Academia e estúdio",
    chaves: ["academia", "pilates", "crossfit", "studio", "yoga", "funcional", "personal"],
    cliente: "alunos",
    acao: "fazer uma aula experimental",
    atender: "ter você na aula",
    perguntaInicial: "qual é o seu objetivo? Assim te indico a melhor turma para a aula experimental.",
    temas: {
      dor: "3 sinais de que seu treino precisa mudar",
      comparacao: "Musculação ou funcional: qual combina com você?",
      mito: "Mito ou verdade: treinar todo dia acelera o resultado?",
      cuidados: "5 erros comuns de quem está começando",
      primeiraVez: "Como é a sua aula experimental",
      bastidor: "Uma aula acontecendo, sem ninguém olhar para a câmera",
      equipe: "Os professores reunidos no estúdio",
      espaco: "O espaço vazio e organizado antes da primeira aula",
    },
    permitePreco: true,
    regras: ["Não prometa perda de peso ou resultado em prazo definido."],
  },
  pet: {
    id: "pet",
    nome: "Pet shop e veterinária",
    chaves: ["pet", "veterin", "banho e tosa", "animal"],
    cliente: "tutores",
    acao: "agendar um horário",
    atender: "cuidar do seu pet",
    perguntaInicial: "qual o porte do seu pet e o que ele precisa? Assim te passo valores e horários.",
    temas: {
      dor: "3 sinais de que seu pet precisa de um banho profissional",
      comparacao: "Tosa higiênica ou completa: qual pedir?",
      mito: "Mito ou verdade: dar banho toda semana faz mal?",
      cuidados: "5 cuidados com o pet no calor",
      primeiraVez: "Como funciona a primeira visita do seu pet",
      bastidor: "Um pet tranquilo depois do banho",
      equipe: "A equipe com os pets do dia",
      espaco: "O espaço de banho limpo e organizado",
    },
    permitePreco: true,
    regras: ["Foto de pet de cliente só com autorização do tutor."],
  },
  beleza: {
    id: "beleza",
    nome: "Salão e barbearia",
    chaves: ["salao", "cabeleire", "barbearia", "barbeiro", "manicure", "unha", "maquiagem"],
    cliente: "clientes",
    acao: "agendar um horário",
    atender: "te atender",
    perguntaInicial: "qual serviço você quer fazer? Assim já te passo os horários livres.",
    temas: {
      dor: "3 sinais de que seu cabelo precisa de um corte",
      comparacao: "Hidratação ou reconstrução: qual seu cabelo pede?",
      mito: "Mito ou verdade: cortar as pontas faz o cabelo crescer?",
      cuidados: "5 cuidados para o corte durar mais",
      primeiraVez: "Como é o seu primeiro atendimento",
      bastidor: "Um atendimento acontecendo, mostrando as mãos",
      equipe: "A equipe do salão reunida",
      espaco: "As cadeiras e o espelho prontos para o dia",
    },
    permitePreco: true,
    regras: ["Foto de cliente só com autorização."],
  },
  loja: {
    id: "loja",
    nome: "Loja e comércio",
    chaves: ["loja", "boutique", "comercio", "store", "moda", "otica", "papelaria"],
    cliente: "clientes",
    acao: "visitar a loja ou pedir pelo WhatsApp",
    atender: "te atender",
    perguntaInicial: "qual produto você está procurando? Te mando fotos e o preço por aqui mesmo.",
    temas: {
      dor: "3 sinais de que você está comprando no lugar errado",
      comparacao: "Como escolher entre os nossos dois mais vendidos",
      mito: "Mito ou verdade: comprar na loja física é mais caro?",
      cuidados: "5 dicas para fazer o produto durar mais",
      primeiraVez: "Como funciona comprar pelo nosso WhatsApp",
      bastidor: "A vitrine arrumada, de frente",
      equipe: "Quem atende você na loja",
      espaco: "As novidades da semana na prateleira",
    },
    permitePreco: true,
    regras: ["Preço anunciado precisa ser o preço praticado."],
  },
  generico: {
    id: "generico",
    nome: "Outro tipo de negócio",
    chaves: [],
    cliente: "clientes",
    acao: "entrar em contato",
    atender: "te atender",
    perguntaInicial: "me conta o que você está precisando? Assim te explico como funciona.",
    temas: {
      dor: "3 sinais de que você precisa de ajuda profissional nisso",
      comparacao: "Como escolher o serviço certo para o seu caso",
      mito: "Mito ou verdade sobre o nosso trabalho",
      cuidados: "5 perguntas para fazer antes de contratar",
      primeiraVez: "Como funciona o primeiro atendimento",
      bastidor: "Seu trabalho acontecendo, mostrando as mãos",
      equipe: "Você ou a equipe, em foto com luz natural",
      espaco: "O lugar onde você atende, arrumado",
    },
    permitePreco: true,
    regras: ["Não prometa resultado que você não pode garantir."],
  },
};

function normalizar(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Traduz a categoria do Google para um nicho. Nunca falha: sem correspondência, devolve "genérico".
 * Compara palavra por palavra (a palavra precisa começar com a chave) e, se mais de um nicho casar,
 * fica com a chave mais longa, a mais específica. Assim "barbearia" vai para beleza, e não para "bar".
 */
export function detectarSegmento(categoriaGoogle: string): SegmentoId {
  const texto = normalizar(categoriaGoogle);
  const palavras = texto.split(/[^a-z0-9]+/).filter(Boolean);
  let melhor: { id: SegmentoId; tamanho: number } | null = null;

  for (const s of Object.values(segmentos)) {
    for (const chave of s.chaves) {
      // Chaves curtas ("bar", "pet", "spa") só valem como palavra inteira, para "Barão" não virar bar.
      const casa = chave.includes(" ")
        ? texto.includes(chave)
        : chave.length <= 4
          ? palavras.some((p) => p === chave || p === `${chave}s`)
          : palavras.some((p) => p.startsWith(chave));
      if (casa && (!melhor || chave.length > melhor.tamanho)) melhor = { id: s.id, tamanho: chave.length };
    }
  }
  return melhor?.id ?? "generico";
}

export const listaSegmentos = Object.values(segmentos);
