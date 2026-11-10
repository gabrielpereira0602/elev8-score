/* Utilidades das rotas do servidor: limite de uso, IP, endereço do site e sessão do admin. */

const janelas = new Map<string, number[]>();

/** Limite simples em memória (por processo). true = pode seguir. */
export function dentroDoLimite(chave: string, maximo: number, janelaMs: number): boolean {
  const agora = Date.now();
  const lista = (janelas.get(chave) ?? []).filter((t) => agora - t < janelaMs);
  if (lista.length >= maximo) {
    janelas.set(chave, lista);
    return false;
  }
  lista.push(agora);
  janelas.set(chave, lista);
  if (janelas.size > 5000) janelas.clear();
  return true;
}

export function ipDe(req: Request): string {
  const h = req.headers;
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "desconhecido").trim();
}

/** Endereço público do site: variável NEXT_PUBLIC_SITE_URL ou o host da requisição. */
export function siteDe(req: Request): string {
  const env = (process.env["SITE_URL"] ?? process.env["NEXT_PUBLIC_SITE_URL"])?.replace(/\/$/, "");
  if (env) return env;
  const h = req.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export const json = (dados: unknown, status = 200) => Response.json(dados, { status });

// ───────── Sessão do admin (funciona no servidor e no middleware)

export const COOKIE_ADMIN = "elev8_admin";

export async function tokenAdmin(senha: string): Promise<string> {
  const chave = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const assinatura = await crypto.subtle.sign("HMAC", chave, new TextEncoder().encode("elev8-admin-v1"));
  return [...new Uint8Array(assinatura)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Comparação em tempo constante, para não vazar a senha pelo tempo de resposta. */
export function iguais(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function adminLogado(cookie: string | undefined): Promise<boolean> {
  const senha = process.env.ADMIN_PASSWORD;
  if (!senha || !cookie) return false;
  return iguais(cookie, await tokenAdmin(senha));
}
