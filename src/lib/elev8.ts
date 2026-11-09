/*
  Catálogo de serviços e regras comerciais da Elev8 Soluções Digitais.
  Fonte única: qualquer preço ou desconto mostrado no Elev8 Score sai daqui.
  Na fase 2, este arquivo vira uma tabela editável no painel administrativo.
*/

export type Cobranca = "projeto" | "mensal" | "consulta";

export type Servico = {
  id: string;
  nome: string;
  pilar: "Sites" | "Tráfego pago" | "SEO" | "Branding" | "Redes sociais" | "Criativos" | "Vídeo" | "E-commerce" | "Manutenção" | "Consultoria";
  preco?: number; // em reais; ausente = sob consulta
  cobranca: Cobranca;
  observacao?: string;
};

export const servicos: Servico[] = [
  { id: "lp-essencial", nome: "Landing Page Essencial", pilar: "Sites", preco: 597, cobranca: "projeto" },
  { id: "lp-estrategica", nome: "Landing Page Estratégica", pilar: "Sites", preco: 997, cobranca: "projeto" },
  { id: "site-institucional", nome: "Site Institucional (até 5 páginas)", pilar: "Sites", preco: 2100, cobranca: "projeto" },
  { id: "ecommerce", nome: "Loja Virtual / E-commerce", pilar: "E-commerce", cobranca: "consulta" },
  { id: "meta-essencial", nome: "Meta Ads Essencial", pilar: "Tráfego pago", preco: 797, cobranca: "mensal", observacao: "Não inclui o investimento em anúncios, pago direto às plataformas." },
  { id: "meta-performance", nome: "Meta Ads Performance", pilar: "Tráfego pago", preco: 1097, cobranca: "mensal", observacao: "Não inclui o investimento em anúncios, pago direto às plataformas." },
  { id: "google-ads", nome: "Google Ads", pilar: "Tráfego pago", preco: 997, cobranca: "mensal", observacao: "Não inclui o investimento em anúncios, pago direto às plataformas." },
  { id: "meta-google", nome: "Meta Ads + Google Ads", pilar: "Tráfego pago", preco: 1497, cobranca: "mensal", observacao: "Não inclui o investimento em anúncios, pago direto às plataformas." },
  { id: "seo-local", nome: "SEO e SEO Local (inclui Perfil da Empresa no Google)", pilar: "SEO", cobranca: "consulta" },
  { id: "branding", nome: "Branding e Identidade Visual", pilar: "Branding", cobranca: "consulta" },
  { id: "redes", nome: "Gestão de Redes Sociais", pilar: "Redes sociais", cobranca: "consulta" },
  { id: "criativos", nome: "Criativos para Anúncios", pilar: "Criativos", cobranca: "consulta" },
  { id: "video", nome: "Edição de Vídeos", pilar: "Vídeo", cobranca: "consulta" },
  { id: "manutencao", nome: "Manutenção, Hospedagem e Suporte", pilar: "Manutenção", cobranca: "consulta" },
  { id: "consultoria", nome: "Consultoria Digital", pilar: "Consultoria", cobranca: "consulta" },
];

export function servico(id: string): Servico {
  const s = servicos.find((x) => x.id === id);
  if (!s) throw new Error(`Serviço desconhecido: ${id}`);
  return s;
}

/* ---------- descontos ---------- */

export const REGRA = {
  janelaDias: 7, // fechou em até 7 dias do diagnóstico
  descontoJanela: 0.2,
  descontoKit: 0.1, // comprou o kit (vale depois da janela)
  texto:
    "Descontos não cumulativos: vale o maior. Em serviço mensal, o desconto vale na primeira mensalidade; em projeto, no valor do projeto. Não se aplica ao investimento em anúncios.",
};

/** O produto em si. Score Vivo: preço de teste (hipótese), ajustar com os primeiros números. */
export const PRODUTO = {
  preco: 97,
  precoReferencia: 197,
  acessoMeses: 12,
  scoreVivoMensal: 39,
};

export type DescontoAtivo = { percentual: number; motivo: string; validoAte?: Date };

export const FUSO = "America/Sao_Paulo";

/**
 * Fim do dia (23:59:59) em São Paulo, N dias depois da data. O servidor roda em UTC; sem isso,
 * o prazo terminaria às 20h59 de Brasília. São Paulo está em UTC-3 o ano todo desde 2019.
 */
function fimDoDiaSP(data: Date, diasDepois: number): Date {
  const [d, m, a] = data.toLocaleDateString("pt-BR", { timeZone: FUSO }).split("/").map(Number);
  return new Date(Date.UTC(a, m - 1, d + diasDepois, 23 + 3, 59, 59, 999));
}

/** Calcula o desconto que vale hoje para este lead. Sem desconto, devolve null. */
export function descontoAtivo(dataDiagnostico: Date, comprouKit: boolean, hoje: Date = new Date()): DescontoAtivo | null {
  const limite = fimDoDiaSP(dataDiagnostico, REGRA.janelaDias);
  if (hoje <= limite) return { percentual: REGRA.descontoJanela, motivo: `fechando até ${formatarData(limite)}`, validoAte: limite };
  if (comprouKit) return { percentual: REGRA.descontoKit, motivo: "por ter comprado o kit" };
  return null;
}

export const formatarBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: v % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });

export const formatarData = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: FUSO });

/** Texto de preço de um serviço, com o desconto aplicado quando houver. */
export function precoTexto(s: Servico, desconto: DescontoAtivo | null) {
  if (s.preco === undefined) return { cheio: "Sob consulta", final: null as string | null, sufixo: "" };
  const sufixo = s.cobranca === "mensal" ? "/mês" : "";
  const cheio = `${formatarBRL(s.preco)}${sufixo}`;
  if (!desconto) return { cheio, final: null, sufixo };
  const comDesconto = Math.round(s.preco * (1 - desconto.percentual) * 100) / 100;
  const final = s.cobranca === "mensal" ? `${formatarBRL(comDesconto)} no 1º mês` : formatarBRL(comDesconto);
  return { cheio, final, sufixo };
}
