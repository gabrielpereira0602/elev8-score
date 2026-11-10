import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_ADMIN, adminLogado } from "@/lib/real/servidor";

/*
  Protege o admin. Com ADMIN_PASSWORD configurada, só entra quem fez login.
  Sem senha configurada: se o banco real estiver ligado, o admin fica bloqueado (nunca aberto com leads reais);
  sem banco, é o protótipo com dados de exemplo.
*/
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  const temSenha = !!process.env["ADMIN_PASSWORD"];
  const temBanco = !!(process.env["SUPABASE_URL"] ?? process.env["NEXT_PUBLIC_SUPABASE_URL"]) && !!process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!temSenha && !temBanco) return NextResponse.next();
  if (!temSenha) return NextResponse.redirect(new URL("/admin/login?erro=config", req.url));
  if (await adminLogado(req.cookies.get(COOKIE_ADMIN)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
