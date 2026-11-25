import { NextResponse } from "next/server";
import { bancoConfigurado, obter } from "@/lib/real/db";
import { COOKIE_COMPRA, linkCheckout } from "@/lib/real/kiwify";
import { siteDe } from "@/lib/real/servidor";

/** Leva para o checkout da Kiwify com o código do diagnóstico. */
export async function GET(req: Request) {
  const site = siteDe(req);
  const id = new URL(req.url).searchParams.get("d") ?? "";
  if (!bancoConfigurado()) return NextResponse.redirect(new URL(`/painel?d=${id}&pagamento=indisponivel`, site), 303);
  const reg = await obter(id);
  if (!reg) return NextResponse.redirect(new URL("/", site), 303);
  if (reg.pago) return NextResponse.redirect(new URL(`/painel/kit?d=${reg.id}`, site), 303);
  const r = NextResponse.redirect(linkCheckout(reg.id), 303);
  r.cookies.set(COOKIE_COMPRA, reg.id, { httpOnly: true, sameSite: "lax", secure: site.startsWith("https"), maxAge: 60 * 60 * 24 * 30, path: "/" });
  return r;
}
