/*
  Fórmula do Score Digital. Um único cálculo, usado no painel, na oferta e no simulador,
  para os números nunca se contradizerem.

  Cada etapa vai de 0 a 100. Contagens (avaliações, fotos) são comparadas com o 1º colocado
  da mesma busca e passam por raiz quadrada: as primeiras avaliações valem mais que as de número 150.
  Pesos das etapas: Encontrado 40%, Entendido 30%, Escolhido 30% (a revisar com dados reais).
*/

export type Metricas = {
  avaliacoes: number;
  fotos: number;
  perfilPreenchido: number; // 0–100
  velocidadeSite: number; // 0–100 (PageSpeed no celular)
  bioClara: boolean;
  postsPorSemana: number;
  respostasAvaliacoes: number; // % de avaliações respondidas
  estrelas: number; // 1–5
  siteClaro: number; // 0–100: o site diz o que faz, para quem e como contratar
};

export type Lider = { avaliacoes: number; fotos: number };

export type Resultado = { encontrado: number; entendido: number; escolhido: number; total: number };

const limitar = (n: number) => Math.max(0, Math.min(1, n));
// Sem concorrente com números na busca, compara com uma referência fixa em vez de zerar.
const REFERENCIA = { avaliacoes: 100, fotos: 50 };
const relativo = (x: number, lider: number, referencia: number) => Math.sqrt(limitar(x / (lider > 0 ? lider : referencia)));

export function calcularScore(m: Metricas, lider: Lider): Resultado {
  const r = relativo(m.avaliacoes, lider.avaliacoes, REFERENCIA.avaliacoes);
  const f = relativo(m.fotos, lider.fotos, REFERENCIA.fotos);
  const p = limitar(m.perfilPreenchido / 100);
  const v = limitar(m.velocidadeSite / 100);
  const b = m.bioClara ? 1 : 0;
  const pst = limitar(m.postsPorSemana / 3);
  const resp = limitar(m.respostasAvaliacoes / 100);
  const est = limitar(m.estrelas - 4); // 4,0 → 0 · 5,0 → 1
  const site = limitar(m.siteClaro / 100);

  const encontrado = 100 * (0.45 * r + 0.35 * p + 0.2 * v);
  const entendido = 100 * (0.35 * b + 0.25 * p + 0.2 * pst + 0.2 * site);
  const escolhido = 100 * (0.4 * r + 0.25 * f + 0.2 * est + 0.15 * resp);
  const total = 0.4 * encontrado + 0.3 * entendido + 0.3 * escolhido;

  return {
    encontrado: Math.round(encontrado),
    entendido: Math.round(entendido),
    escolhido: Math.round(escolhido),
    total: Math.round(total),
  };
}

/** O que o kit muda quando aplicado por inteiro. Site fica de fora: depende de um site novo. */
export function aplicarKit(m: Metricas): Metricas {
  return {
    ...m,
    avaliacoes: m.avaliacoes + 30, // ~1 por dia em 30 dias: estimativa conservadora com a plaquinha e as mensagens
    fotos: Math.max(m.fotos, 30),
    perfilPreenchido: 100,
    bioClara: true,
    postsPorSemana: 3,
    respostasAvaliacoes: 100,
  };
}
