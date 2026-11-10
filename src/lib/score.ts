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
  // Os campos abaixo podem não estar medidos (null): sem site, empresa sem avaliações, pergunta não respondida.
  // Medida que falta não vira zero nem número inventado: o peso dela se divide entre as que existem.
  velocidadeSite: number | null; // 0–100 (PageSpeed no celular)
  bioClara: boolean | null; // informado pelo dono
  postsPorSemana: number | null; // informado pelo dono
  respostasAvaliacoes: number | null; // % de avaliações respondidas (informado pelo dono)
  estrelas: number | null; // 1–5
  siteClaro: number | null; // 0–100: o site diz o que faz, para quem e como contratar
};

export type Lider = { avaliacoes: number; fotos: number };

export type Resultado = { encontrado: number; entendido: number; escolhido: number; total: number };

const limitar = (n: number) => Math.max(0, Math.min(1, n));
// Sem concorrente com números na busca, compara com uma referência fixa em vez de zerar.
const REFERENCIA = { avaliacoes: 100, fotos: 50 };
const relativo = (x: number, lider: number, referencia: number) => Math.sqrt(limitar(x / (lider > 0 ? lider : referencia)));

/** Média ponderada só com as medidas que existem. */
function media(partes: [number, number | null][]): number {
  const validas = partes.filter(([, v]) => v !== null) as [number, number][];
  const peso = validas.reduce((t, [p]) => t + p, 0);
  return peso === 0 ? 0 : validas.reduce((t, [p, v]) => t + p * v, 0) / peso;
}

const ou = <T,>(v: T | null, f: (x: T) => number) => (v === null ? null : f(v));

export function calcularScore(m: Metricas, lider: Lider): Resultado {
  const r = relativo(m.avaliacoes, lider.avaliacoes, REFERENCIA.avaliacoes);
  const f = relativo(m.fotos, lider.fotos, REFERENCIA.fotos);
  const p = limitar(m.perfilPreenchido / 100);
  const v = ou(m.velocidadeSite, (x) => limitar(x / 100));
  const b = ou(m.bioClara, (x) => (x ? 1 : 0));
  const pst = ou(m.postsPorSemana, (x) => limitar(x / 3));
  const resp = ou(m.respostasAvaliacoes, (x) => limitar(x / 100));
  const est = ou(m.estrelas, (x) => limitar(x - 4)); // 4,0 → 0 · 5,0 → 1
  const site = ou(m.siteClaro, (x) => limitar(x / 100));

  const encontrado = 100 * media([[0.45, r], [0.35, p], [0.2, v]]);
  const entendido = 100 * media([[0.35, b], [0.25, p], [0.2, pst], [0.2, site]]);
  const escolhido = 100 * media([[0.4, r], [0.25, f], [0.2, est], [0.15, resp]]);
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

/*
  Reavaliação da garantia (dia 30). Os concorrentes ficam como estavam no dia do diagnóstico:
  assim o Score da garantia só muda pelo que o próprio negócio fez. Se o 1º colocado ganhar
  50 avaliações no mês, isso não tira do cliente a garantia de quem aplicou o plano.
  O painel mostra também o Score real de hoje, com os concorrentes atuais, para a pessoa ver o mercado.
*/
export const GARANTIA = { acoesMinimas: 10, totalAcoes: 12, dias: 30 };

export function reavaliarGarantia(antes: Metricas, depois: Metricas, liderNoDiagnostico: Lider, acoesFeitas: number) {
  const scoreAntes = calcularScore(antes, liderNoDiagnostico).total;
  const scoreDepois = calcularScore(depois, liderNoDiagnostico).total;
  const aplicou = acoesFeitas >= GARANTIA.acoesMinimas;
  return { scoreAntes, scoreDepois, aplicou, devolve: aplicou && scoreDepois <= scoreAntes };
}
