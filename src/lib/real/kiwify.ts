/*
  Kiwify. A pessoa paga no checkout da Kiwify (Pix, cartão parcelado ou boleto) e o kit libera pelo webhook.
  - O link de pagamento leva o código do diagnóstico em "sck" (parâmetro de rastreio da Kiwify), que volta no webhook.
  - O webhook só vale com assinatura certa: HMAC-SHA1 do corpo bruto com o token do webhook, enviado em ?signature=.
  - O navegador nunca libera nada: a volta para o site só leva ao painel, quem marca como pago é o webhook.
*/
import { createHmac, timingSafeEqual } from "node:crypto";

export const LINK_PADRAO = "https://pay.kiwify.com.br/yNPKVVB";
const LINK = () => process.env["KIWIFY_CHECKOUT_URL"] || LINK_PADRAO;
const TOKEN = () => process.env["KIWIFY_WEBHOOK_TOKEN"] ?? "";
export const webhookConfigurado = () => TOKEN().length > 0;

/** Cookie que guarda qual diagnóstico foi para o pagamento (para a página de obrigado achar o painel). */
export const COOKIE_COMPRA = "elev8_compra";

export function linkCheckout(diagnosticoId: string): string {
  const u = new URL(LINK());
  u.searchParams.set("sck", diagnosticoId);
  u.searchParams.set("src", "elev8score");
  return u.toString();
}

export function assinaturaValida(corpoBruto: string, assinatura: string | null, token = TOKEN()): boolean {
  if (!token || !assinatura || !/^[0-9a-f]{40}$/i.test(assinatura)) return false;
  const esperada = createHmac("sha1", token).update(corpoBruto, "utf8").digest();
  return timingSafeEqual(esperada, Buffer.from(assinatura, "hex"));
}

export type PedidoKiwify = {
  order_id?: string;
  order_status?: string;
  webhook_event_type?: string;
  Customer?: { email?: string; full_name?: string };
  TrackingParameters?: { sck?: string | null; src?: string | null };
};

export type Evento = { tipo: "aprovado" | "estornado" | "outro"; pedido: string; sck: string; email: string };

export function interpretar(p: PedidoKiwify): Evento {
  const ev = (p.webhook_event_type ?? "").toLowerCase();
  const st = (p.order_status ?? "").toLowerCase();
  const tipo: Evento["tipo"] =
    ev === "order_approved" || st === "paid" || st === "approved"
      ? "aprovado"
      : ev === "order_refunded" || ev === "chargeback" || st === "refunded" || st === "chargedback"
        ? "estornado"
        : "outro";
  return { tipo, pedido: String(p.order_id ?? ""), sck: String(p.TrackingParameters?.sck ?? "").trim(), email: String(p.Customer?.email ?? "").trim().toLowerCase() };
}
