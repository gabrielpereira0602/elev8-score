import { NextResponse } from "next/server";
import { bancoConfigurado, obter } from "@/lib/real/db";
import { criarCheckout, pagamentoConfigurado } from "@/lib/real/mercadopago";
import { siteDe } from "@/lib/real/servidor";

/** Leva para o pagamento do kit no Mercado Pago. */
export async function GET(req: Request) {
  const site = siteDe(req);
  const id = new URL(req.url).searchParams.get("d") ?? "";
  if (!bancoConfigurado() || !pagamentoConfigurado()) return NextResponse.redirect(new URL(`/painel?d=${id}&pagamento=indisponivel`, site), 303);
  const reg = await obter(id);
  if (!reg) return NextResponse.redirect(new URL("/", site), 303);
  if (reg.pago) return NextResponse.redirect(new URL(`/painel/kit?d=${reg.id}`, site), 303);
  try {
    const url = await criarCheckout({ id: reg.id, email: reg.contato.email, nome: reg.contato.nome, site });
    return NextResponse.redirect(url, 303);
  } catch (e) {
    console.error("[pagamento]", e);
    return NextResponse.redirect(new URL(`/painel?d=${reg.id}&pagamento=indisponivel`, site), 303);
  }
}
