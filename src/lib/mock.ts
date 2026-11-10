// Tipos e dados de referência da fase 1. O conteúdo de cada empresa é montado em contexto.ts.
import type { Lider, Metricas } from "./score";

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
  dataISO: string; // data do diagnóstico, base da janela de 7 dias do desconto
  nota: number;
  potencialComKit: number;
  ranking: Concorrente[];
  etapas: Etapa[];
  /** Teste das IAs: só existe quando foi feito de verdade (no protótipo, exemplo). */
  ia?: { pergunta: string; respostas: RespostaIA[] };
  /** Números medidos desta empresa e do 1º colocado da mesma busca. */
  metricas: Metricas;
  lider: Lider;
  /** true quando os números vêm do Google e do site desta empresa; false no protótipo. */
  real: boolean;
  presente: { titulo: string; motivo: string; mensagem: string };
  proximaAcao: { titulo: string; motivo: string; botao: string };
  plano: { feitas: number; total: number; diasParaReavaliacao: number };
};

/** Faixas do Score Digital: o número nunca aparece sem a palavra que o explica. */
export function faixaScore(n: number): { texto: string; tom: Status } {
  if (n < 40) return { texto: "Difícil de ser escolhido", tom: "atras" };
  if (n < 70) return { texto: "Na disputa", tom: "media" };
  return { texto: "Bem posicionado", tom: "frente" };
}

export const pesos = [
  { etapa: "Encontrado", peso: 40, mede: "Avaliações, perfil do Google completo e velocidade do site" },
  { etapa: "Entendido", peso: 30, mede: "Bio clara, perfil completo, frequência de posts e clareza do site" },
  { etapa: "Escolhido", peso: 30, mede: "Avaliações, fotos, estrelas e respostas às avaliações" },
];

/** Dados observados da empresa hoje (na fase 2: Google Places, PageSpeed e formulário). */
export const metricasHoje: Metricas = {
  avaliacoes: 23,
  fotos: 12,
  perfilPreenchido: 60,
  velocidadeSite: 41,
  bioClara: false,
  postsPorSemana: 1,
  respostasAvaliacoes: 30,
  estrelas: 4.6,
  siteClaro: 30,
};

/** Números do 1º colocado da mesma busca, usados como referência. */
export const liderBusca: Lider = { avaliacoes: 187, fotos: 96 };

export const kitItens = [
  { nome: "Kit de avaliações", detalhe: "mensagens prontas e QR code de avaliação com arte em PDF para você imprimir" },
  { nome: "WhatsApp que vende", detalhe: "do primeiro “oi” ao pós-venda" },
  { nome: "Perfil reescrito", detalhe: "3 versões de bio e como ele vai ficar" },
  { nome: "Google Perfil otimizado", detalhe: "descrição e tudo o que falta preencher" },
  { nome: "12 posts prontos", detalhe: "texto, arte e orientação de foto" },
  { nome: "Plano de 30 dias", detalhe: "uma ação por vez, com reavaliação no dia 30" },
];
