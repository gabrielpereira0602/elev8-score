/*
  Mercado Pago (Checkout Pro). A pessoa paga na página do Mercado Pago (Pix ou cartão) e volta para o painel.
  A liberação do kit nunca confia no navegador: o servidor sempre consulta o pagamento na API do Mercado Pago
  antes de marcar como pago (no aviso automático e na volta para o painel).
*/
import { PRODUTO } from "../elev8";

const TOKEN = () => process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";
export const pagamentoConfigurado = () => TOKEN().length > 0;

async function mp<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`${process.env.MERCADOPAGO_BASE_URL ?? "https://api.mercadopago.com"}${caminho}`, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN()}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!r.ok) throw new Error(`Mercado Pago respondeu ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json() as Promise<T>;
}

export async function criarCheckout(o: { id: string; email: string; nome: string; site: string }): Promise<string> {
  const painel = `${o.site}/painel?d=${o.id}`;
  const r = await mp<{ init_point: string }>("/checkout/preferences", {
    method: "POST",
    headers: { "X-Idempotency-Key": `kit-${o.id}-${Math.floor(Date.now() / 600000)}` },
    body: JSON.stringify({
      items: [{ id: "elev8-score-kit", title: "Elev8 Score · Kit pronto + consultor de marketing", quantity: 1, unit_price: PRODUTO.preco, currency_id: "BRL" }],
      external_reference: o.id,
      payer: { email: o.email, name: o.nome },
      back_urls: { success: `${painel}&pagamento=ok`, pending: `${painel}&pagamento=pendente`, failure: `${painel}&pagamento=falhou` },
      auto_return: "approved",
      notification_url: `${o.site}/api/webhooks/mercadopago`,
      statement_descriptor: "ELEV8 SCORE",
    }),
  });
  return r.init_point;
}

export type Pagamento = { id: number; status: string; external_reference?: string; transaction_amount?: number };

export async function consultarPagamento(id: string): Promise<Pagamento | null> {
  if (!/^\d+$/.test(id)) return null;
  return mp<Pagamento>(`/v1/payments/${id}`);
}

/** O pagamento libera este diagnóstico? (aprovado, do diagnóstico certo e no valor do kit) */
export function liberaKit(p: Pagamento | null, diagnosticoId: string): boolean {
  return !!p && p.status === "approved" && p.external_reference === diagnosticoId && (p.transaction_amount ?? 0) >= PRODUTO.preco - 0.01;
}
