import { NextResponse } from "next/server";
import { COOKIE_ADMIN, dentroDoLimite, iguais, ipDe, siteDe, tokenAdmin } from "@/lib/real/servidor";

export async function POST(req: Request) {
  const site = siteDe(req);
  const senhaCerta = process.env.ADMIN_PASSWORD;
  if (!senhaCerta) return NextResponse.redirect(new URL("/admin/login?erro=config", site), 303);
  if (!dentroDoLimite(`login:${ipDe(req)}`, 8, 15 * 60e3)) return NextResponse.redirect(new URL("/admin/login?erro=limite", site), 303);
  const form = await req.formData().catch(() => null);
  const senha = String(form?.get("senha") ?? "");
  if (!iguais(await tokenAdmin(senha), await tokenAdmin(senhaCerta))) return NextResponse.redirect(new URL("/admin/login?erro=senha", site), 303);
  const r = NextResponse.redirect(new URL("/admin", site), 303);
  r.cookies.set(COOKIE_ADMIN, await tokenAdmin(senhaCerta), { httpOnly: true, secure: site.startsWith("https"), sameSite: "lax", path: "/", maxAge: 30 * 86400 });
  return r;
}
