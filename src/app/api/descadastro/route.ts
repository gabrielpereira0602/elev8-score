import { bancoConfigurado, descadastrar } from "@/lib/real/db";
import { dentroDoLimite, ipDe, json } from "@/lib/real/servidor";

export async function POST(req: Request) {
  if (!dentroDoLimite(`descad:${ipDe(req)}`, 20, 3600e3)) return json({ erro: "Muitos pedidos." }, 429);
  const b = (await req.json().catch(() => ({}))) as { email?: string };
  const email = String(b.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ erro: "E-mail inválido." }, 400);
  if (bancoConfigurado()) await descadastrar(email);
  return json({ ok: true });
}
