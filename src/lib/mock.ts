// Dados simulados da fase 1. Na fase 2 este arquivo é substituído por dados reais do Supabase.

export type Status = "atras" | "media" | "frente";

export type Etapa = {
  chave: "encontrado" | "entendido" | "escolhido";
  nome: string;
  pergunta: string;
  nota: number;
  lider: number;
  status: Status;
  resumo: string;
  solucaoKit: string;
};

export type Concorrente = { nome: string; nota: number; voce?: boolean };

export type RespostaIA = {
  ia: "ChatGPT" | "Gemini";
  citou: boolean;
  posicao?: number;
  lista: string[];
};

export type Diagnostico = {
  empresa: string;
  cidade: string;
  segmento: string;
  busca: string;
  dataAnalise: string;
  nota: number;
  potencialComKit: number;
  ranking: Concorrente[];
  etapas: Etapa[];
  ia: { pergunta: string; respostas: RespostaIA[] };
  presente: { titulo: string; motivo: string; mensagem: string };
  proximaAcao: { titulo: string; motivo: string; botao: string };
  plano: { feitas: number; total: number; diasParaReavaliacao: number };
};

/** Faixas do Score Digital: o número nunca aparece sem a palavra que o explica. */
export function faixaScore(n: number): { texto: string; tom: Status } {
  if (n < 40) return { texto: "Difícil de ser escolhido", tom: "atras" };
  if (n < 70) return { texto: "Na disputa", tom: "media" };
  return { texto: "Primeira escolha", tom: "frente" };
}

export const pesos = [
  { etapa: "Encontrado", peso: 40, mede: "Posição no Google Maps, perfil completo, velocidade do site" },
  { etapa: "Entendido", peso: 30, mede: "Descrição, categorias, bio e clareza do que você oferece" },
  { etapa: "Escolhido", peso: 30, mede: "Estrelas, número de avaliações, fotos e respostas" },
];

export const diagnostico: Diagnostico = {
  empresa: "Clínica Bella Pele",
  cidade: "Vinhedo, SP",
  segmento: "Clínica de estética",
  busca: "clínica de estética em Vinhedo",
  dataAnalise: "07/11/2026",
  nota: 38,
  potencialComKit: 61,
  ranking: [
    { nome: "Estética Lumière", nota: 86 },
    { nome: "Clínica Aurora", nota: 74 },
    { nome: "Espaço Vitta", nota: 57 },
    { nome: "Você", nota: 38, voce: true },
  ],
  etapas: [
    {
      chave: "encontrado",
      nome: "Encontrado",
      pergunta: "Você aparece quando procuram?",
      nota: 25,
      lider: 92,
      status: "atras",
      resumo: "4º no Google Maps",
      solucaoKit: "Google Perfil otimizado",
    },
    {
      chave: "entendido",
      nome: "Entendido",
      pergunta: "Seu perfil explica o que você faz?",
      nota: 52,
      lider: 84,
      status: "media",
      resumo: "Perfil 60% preenchido",
      solucaoKit: "Perfil reescrito e 12 posts",
    },
    {
      chave: "escolhido",
      nome: "Escolhido",
      pergunta: "Há motivos para confiar em você?",
      nota: 41,
      lider: 80,
      status: "atras",
      resumo: "23 avaliações (líder: 187)",
      solucaoKit: "Kit de avaliações com QR code",
    },
  ],
  ia: {
    pergunta: "Qual a melhor clínica de estética em Vinhedo?",
    respostas: [
      { ia: "ChatGPT", citou: false, lista: ["Estética Lumière", "Clínica Aurora", "Espaço Vitta"] },
      { ia: "Gemini", citou: true, posicao: 3, lista: ["Estética Lumière", "Clínica Aurora", "Clínica Bella Pele"] },
    ],
  },
  presente: {
    titulo: "Peça avaliações aos seus clientes desta semana",
    motivo: "Avaliações são o que mais separa você do 1º colocado. Copie, cole no WhatsApp e envie para quem você atendeu nos últimos dias.",
    mensagem:
      "Oi, [nome]! Aqui é da Clínica Bella Pele. Foi um prazer te atender esta semana. Se puder, deixa uma avaliação rapidinha sobre sua experiência no Google? Leva menos de 1 minuto e ajuda muito outras pessoas a nos conhecerem: [link]. Obrigada!",
  },
  proximaAcao: {
    titulo: "Peça 10 avaliações esta semana",
    motivo: "É o que mais pesa no seu Score Digital. A mensagem e o QR code de avaliação, com a arte para imprimir, já estão prontos.",
    botao: "Abrir mensagem pronta",
  },
  plano: { feitas: 2, total: 12, diasParaReavaliacao: 23 },
};

export const kitItens = [
  { nome: "Kit de avaliações", detalhe: "mensagens prontas e QR code de avaliação com arte em PDF para você imprimir" },
  { nome: "WhatsApp que vende", detalhe: "do primeiro “oi” ao pós-venda" },
  { nome: "Perfil reescrito", detalhe: "3 versões de bio e como ele vai ficar" },
  { nome: "Google Perfil otimizado", detalhe: "descrição e tudo o que falta preencher" },
  { nome: "12 posts prontos", detalhe: "texto, arte e orientação de foto" },
  { nome: "Plano de 30 dias e assistente", detalhe: "uma ação por vez e dúvidas a qualquer hora" },
];
