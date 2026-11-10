/* Carrega o painel: empresa real (?d=código, do banco) ou empresa de exemplo do nicho (protótipo). */
import { notFound } from "next/navigation";
import { contexto, type Contexto } from "../contexto";
import { montarDadosReais } from "./analise";
import { atualizar, bancoConfigurado, obter, type Registro } from "./db";
import { consultarPagamento, liberaKit, pagamentoConfigurado } from "./mercadopago";

export type BuscaPainel = { plano?: string; nicho?: string; d?: string; pagamento?: string; payment_id?: string; collection_id?: string; q?: string };

export type Painel = { ctx: Contexto; pago: boolean; nicho: string; codigo?: string; registro: Registro | null; aviso?: string };

export async function carregarPainel(sp: BuscaPainel): Promise<Painel> {
  if (sp.d) {
    if (!bancoConfigurado()) notFound();
    let reg = await obter(sp.d);
    if (!reg) notFound();
    // Volta do Mercado Pago: confere o pagamento na API antes de liberar (não confia no link).
    const pid = sp.payment_id ?? sp.collection_id;
    if (!reg.pago && pid && pagamentoConfigurado()) {
      const p = await consultarPagamento(pid).catch(() => null);
      if (liberaKit(p, reg.id)) reg = (await atualizar(reg.id, { pago: true, pago_em: new Date().toISOString(), pagamento_id: pid, etapa: "comprou" })) ?? reg;
    }
    const ctx = contexto(undefined, undefined, montarDadosReais(reg.id, reg.analise, reg.form_kit, reg.plano_feitas.length));
    return { ctx, pago: reg.pago, nicho: ctx.empresa.segmento, codigo: reg.id, registro: reg, aviso: sp.pagamento };
  }
  const ctx = contexto(sp.nicho);
  return { ctx, pago: sp.plano === "pago", nicho: ctx.empresa.segmento, registro: null };
}
