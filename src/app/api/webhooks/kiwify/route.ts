import { atualizar, bancoConfigurado, ehUuid, obter, pendentePorEmail } from "@/lib/real/db";
import { assinaturaValida, interpretar, webhookConfigurado, type PedidoKiwify } from "@/lib/real/kiwify";

/**
 * Aviso automático da Kiwify (compra aprovada, reembolso, chargeback).
 * Cadastrar na Kiwify: Apps > Webhooks > URL https://SEU-SITE/api/webhooks/kiwify, com o mesmo token de KIWIFY_WEBHOOK_TOKEN.
 */
export async function POST(req: Request) {
  if (!bancoConfigurado() || !webhookConfigurado()) return new Response("não configurado", { status: 503 });
  const bruto = await req.text();
  if (!assinaturaValida(bruto, new URL(req.url).searchParams.get("signature"))) return new Response("assinatura inválida", { status: 401 });
  let p: PedidoKiwify;
  try {
    p = JSON.parse(bruto);
  } catch {
    return new Response("corpo inválido", { status: 400 });
  }
  const ev = interpretar(p);
  if (ev.tipo === "outro") return new Response("ok");
  try {
    // Acha o diagnóstico pelo código que foi no link; sem ele (link direto), pelo e-mail da compra.
    let reg = ehUuid(ev.sck) ? await obter(ev.sck) : null;
    if (!reg && ev.tipo === "aprovado" && ev.email) reg = await pendentePorEmail(ev.email);
    if (!reg) {
      console.warn("[webhook kiwify] pedido sem diagnóstico", ev.pedido);
      return new Response("ok");
    }
    if (ev.tipo === "aprovado" && !reg.pago) {
      await atualizar(reg.id, { pago: true, pago_em: new Date().toISOString(), pagamento_id: `kiwify:${ev.pedido}`, etapa: "comprou" });
    }
    if (ev.tipo === "estornado" && reg.pago && (!reg.pagamento_id || reg.pagamento_id === `kiwify:${ev.pedido}`)) {
      await atualizar(reg.id, { pago: false, etapa: "reembolsou" });
    }
  } catch (e) {
    console.error("[webhook kiwify]", e);
    return new Response("erro", { status: 500 }); // a Kiwify tenta de novo
  }
  return new Response("ok");
}
