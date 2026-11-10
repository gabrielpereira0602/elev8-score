import { atualizar, bancoConfigurado, ehUuid, obter } from "@/lib/real/db";
import { consultarPagamento, liberaKit, pagamentoConfigurado } from "@/lib/real/mercadopago";

/** Aviso automático do Mercado Pago. Sempre confere o pagamento na API antes de liberar. */
export async function POST(req: Request) {
  if (!bancoConfigurado() || !pagamentoConfigurado()) return new Response("ok");
  const u = new URL(req.url);
  let corpo: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    corpo = await req.json();
  } catch {}
  const tipo = corpo.type ?? u.searchParams.get("type") ?? u.searchParams.get("topic");
  const idPagamento = String(corpo.data?.id ?? u.searchParams.get("data.id") ?? u.searchParams.get("id") ?? "");
  if (tipo !== "payment" || !idPagamento) return new Response("ok");
  try {
    const p = await consultarPagamento(idPagamento);
    const ref = p?.external_reference ?? "";
    if (ehUuid(ref) && liberaKit(p, ref)) {
      const reg = await obter(ref);
      if (reg && !reg.pago) await atualizar(ref, { pago: true, pago_em: new Date().toISOString(), pagamento_id: idPagamento, etapa: "comprou" });
    }
  } catch (e) {
    console.error("[webhook mercadopago]", e);
    return new Response("erro", { status: 500 }); // o Mercado Pago tenta de novo
  }
  return new Response("ok");
}
