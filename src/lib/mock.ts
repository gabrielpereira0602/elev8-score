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
};

export type Concorrente = { nome: string; nota: number; voce?: boolean };

export type Diagnostico = {
  empresa: string;
  cidade: string;
  segmento: string;
  busca: string;
  dataAnalise: string;
  nota: number;
  ranking: Concorrente[];
  etapas: Etapa[];
  proximaAcao: { titulo: string; motivo: string; botao: string };
  plano: { feitas: number; total: number; diasParaReavaliacao: number };
};

export const diagnostico: Diagnostico = {
  empresa: "Clínica Bella Pele",
  cidade: "Vinhedo, SP",
  segmento: "Clínica de estética",
  busca: "clínica de estética em Vinhedo",
  dataAnalise: "07/11/2026",
  nota: 38,
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
    },
    {
      chave: "entendido",
      nome: "Entendido",
      pergunta: "Seu perfil explica o que você faz?",
      nota: 52,
      lider: 84,
      status: "media",
      resumo: "Perfil 60% preenchido",
    },
    {
      chave: "escolhido",
      nome: "Escolhido",
      pergunta: "Há motivos para confiar em você?",
      nota: 41,
      lider: 80,
      status: "atras",
      resumo: "23 avaliações (líder: 187)",
    },
  ],
  proximaAcao: {
    titulo: "Peça 10 avaliações esta semana",
    motivo: "É o que mais pesa na sua nota. A mensagem e a plaquinha com QR code já estão prontas.",
    botao: "Abrir mensagem pronta",
  },
  plano: { feitas: 2, total: 12, diasParaReavaliacao: 23 },
};

export const kitItens = [
  "Kit de avaliações com plaquinha QR",
  "Mensagens de WhatsApp que vendem",
  "Perfil reescrito (3 versões)",
  "Google Perfil otimizado",
  "12 posts prontos",
  "Plano de 30 dias + assistente",
];
