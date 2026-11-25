/* Carrega o painel: empresa real (?d=código, do banco) ou empresa de exemplo do nicho (protótipo). */
import { notFound } from "next/navigation";
import { contexto, type Contexto } from "../contexto";
import { montarDadosReais } from "./analise";
import { bancoConfigurado, obter, type Registro } from "./db";

export type BuscaPainel = { plano?: string; nicho?: string; d?: string; pagamento?: string; q?: string };

export type Painel = { ctx: Contexto; pago: boolean; nicho: string; codigo?: string; registro: Registro | null; aviso?: string };

export async function carregarPainel(sp: BuscaPainel): Promise<Painel> {
  if (sp.d) {
    if (!bancoConfigurado()) notFound();
    const reg = await obter(sp.d);
    if (!reg) notFound();
    const ctx = contexto(undefined, undefined, montarDadosReais(reg.id, reg.analise, reg.form_kit, reg.plano_feitas.length));
    return { ctx, pago: reg.pago, nicho: ctx.empresa.segmento, codigo: reg.id, registro: reg, aviso: sp.pagamento };
  }
  const ctx = contexto(sp.nicho);
  return { ctx, pago: sp.plano === "pago", nicho: ctx.empresa.segmento, registro: null };
}
