/*
  Motor do consultor de marketing (offline).

  Entende a pergunta sem IA: normaliza o texto (acentos, plural, sinônimos como "zap" = WhatsApp),
  pontua cada tema da base pelos gatilhos e responde com o tema de maior pontuação.
  Empate: vence o tema que vem primeiro na base (os mais específicos estão antes).
  Sem tema com pontuação suficiente, diz que não encontrou e sugere os temas mais próximos, em vez de inventar.
*/
import type { Contexto } from "./contexto";
import { TEMAS, type Resposta, type Tema } from "./consultor-base";
import { ETAPA_FRASE, MESES, maiorPerda, mesSP, normalizar } from "./consultor-util";

export type { Resposta } from "./consultor-base";
export { TEMAS, CATEGORIAS } from "./consultor-base";
export { maiorPerda, mesSP } from "./consultor-util";

const SINONIMOS: Record<string, string> = {
  zap: "whatsapp",
  zapzap: "whatsapp",
  whats: "whatsapp",
  wpp: "whatsapp",
  wats: "whatsapp",
  watsapp: "whatsapp",
  whatsap: "whatsapp",
  insta: "instagram",
  ig: "instagram",
  gpt: "chatgpt",
  storys: "stories",
  storie: "stories",
  review: "avaliacao",
  reviews: "avaliacao",
  comentario: "avaliacao",
  comentarios: "avaliacao",
  valores: "valor",
  vlr: "valor",
  qto: "quanto",
  qnto: "quanto",
  vc: "voce",
  pq: "porque",
  tbm: "tambem",
  promo: "promocao",
  logomarca: "logo",
  website: "site",
};

/** Plural simples: avaliações → avaliacao, regras → regra. Aplicado igual na pergunta e nos gatilhos. */
const raiz = (t: string) => (t.length > 4 ? t.replace(/(oes|aes)$/, "ao").replace(/s$/, "") : t);

function preparar(texto: string): string[] {
  return normalizar(texto)
    .split(" ")
    .filter(Boolean)
    .map((t) => raiz(SINONIMOS[t] ?? t));
}

type GatilhoPronto = { palavras: string[]; peso: number };

const BASE: { tema: Tema; gatilhos: GatilhoPronto[] }[] = TEMAS.map((tema) => ({
  tema,
  gatilhos: tema.gatilhos.map((g) => {
    const forte = g.startsWith("!");
    const palavras = preparar(forte ? g.slice(1) : g);
    return { palavras, peso: (forte ? 6 : 2) + (palavras.length - 1) * 2 };
  }),
}));

function contem(tokens: string[], palavras: string[]): boolean {
  if (palavras.length === 1) {
    const g = palavras[0];
    return tokens.some((t) => t === g || (g.length >= 6 && t.startsWith(g)));
  }
  for (let i = 0; i + palavras.length <= tokens.length; i++) {
    if (palavras.every((w, j) => tokens[i + j] === w)) return true;
  }
  return false;
}

/** Pontuação de cada tema para a pergunta, do maior para o menor (empate: ordem da base). */
export function classificar(pergunta: string): { tema: Tema; pontos: number }[] {
  const tokens = preparar(pergunta);
  return BASE.map(({ tema, gatilhos }, i) => ({
    tema,
    i,
    pontos: gatilhos.reduce((soma, g) => soma + (contem(tokens, g.palavras) ? g.peso : 0), 0),
  }))
    .sort((a, b) => b.pontos - a.pontos || a.i - b.i)
    .map(({ tema, pontos }) => ({ tema, pontos }));
}

const MINIMO = 2;
const POPULARES = ["primeira-semana", "mais-clientes", "preco"];

function relacionados(ranking: { tema: Tema; pontos: number }[], escolhido: Tema) {
  const outros = ranking.filter((r) => r.tema.id !== escolhido.id && r.pontos >= MINIMO).map((r) => r.tema);
  const mesmaCategoria = TEMAS.filter((t) => t.categoria === escolhido.categoria && t.id !== escolhido.id);
  const lista = [...outros, ...mesmaCategoria].filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i);
  return lista.slice(0, 3).map((t) => ({ id: t.id, titulo: t.titulo }));
}

export function responder(pergunta: string, ctx: Contexto, hoje = new Date()): Resposta {
  const ranking = classificar(pergunta);
  const melhor = ranking[0];
  if (!melhor || melhor.pontos < MINIMO) {
    return {
      texto: `Não encontrei uma resposta pronta para isso na minha base de marketing para ${ctx.segmento.nome.toLowerCase()}. Tente perguntar de outro jeito, com palavras como “avaliação”, “Instagram”, “preço” ou “WhatsApp”, ou abra a Biblioteca para ver todos os temas.`,
      relacionados: POPULARES.map((id) => TEMAS.find((t) => t.id === id)!).map((t) => ({ id: t.id, titulo: t.titulo })),
    };
  }
  const r = melhor.tema.resposta(ctx, hoje, normalizar(pergunta));
  return { ...r, temaId: melhor.tema.id, relacionados: relacionados(ranking, melhor.tema) };
}

/** Perguntas sugeridas, escritas para o nicho e para o mês. */
export function sugestoesPara(ctx: Contexto, hoje = new Date()): string[] {
  const s = ctx.segmento;
  return [
    "O que eu faço primeiro esta semana?",
    s.consultor.pergunta,
    `Como consigo mais ${s.cliente} este mês?`,
    `O que postar em ${MESES[mesSP(hoje) - 1]}?`,
    "Como respondo uma avaliação ruim?",
    "Vale a pena impulsionar post?",
    "Preciso de um site novo?",
  ];
}

export function saudacao(ctx: Contexto): string {
  const p = maiorPerda(ctx.diagnostico.etapas);
  return `Oi! Sou o seu consultor de marketing. Já estudei o diagnóstico de ${ctx.empresa.nome}. O ponto em que você mais perde hoje é ${ETAPA_FRASE[p.chave]}: ${p.nota} pontos, contra ${p.lider} do 1º colocado.\n\nPergunte do seu jeito, escolha uma pergunta abaixo ou abra a Biblioteca. Para textos sob medida, use as Ferramentas.`;
}
