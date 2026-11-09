/* Utilidades do consultor: texto, datas no fuso de São Paulo e leitura do diagnóstico. */
import type { Etapa } from "./mock";
import type { Segmento } from "./segmentos";
import { FUSO } from "./elev8";

export const normalizar = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const semArtigo = (t: string) => t.replace(/^(o|a|os|as) /, "");
export const maiuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
export const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

export const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** Mês atual (1 a 12) no fuso de São Paulo. */
export function mesSP(hoje: Date): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: FUSO, month: "numeric" }).format(hoje));
}

/** A etapa em que o negócio mais perde para o 1º colocado. */
export function maiorPerda(etapas: Etapa[]): Etapa {
  return [...etapas].sort((a, b) => a.nota - a.lider - (b.nota - b.lider))[0];
}

export const ETAPA_FRASE: Record<Etapa["chave"], string> = {
  encontrado: "ser encontrado (aparecer quando procuram)",
  entendido: "ser entendido (o perfil explicar o que você faz)",
  escolhido: "ser escolhido (ter motivos para confiarem em você)",
};

/** "clientes" → "cliente", "tutores" → "tutor". */
export function umCliente(s: Segmento): string {
  const mapa: Record<string, string> = { clientes: "cliente", pacientes: "paciente", alunos: "aluno", tutores: "tutor" };
  return mapa[s.cliente] ?? "cliente";
}

/** Uma frase curta sobre a regra do setor, para setores que não podem falar de preço e promoção. */
export function lembreteSetor(s: Segmento): string {
  return s.permitePreco ? "" : " No seu setor: sem preço, sem promoção e sem promessa de resultado em post, anúncio ou mensagem em massa.";
}
