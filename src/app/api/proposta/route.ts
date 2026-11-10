import { atualizar, bancoConfigurado, obter } from "@/lib/real/db";
import { dentroDoLimite, ipDe, json } from "@/lib/real/servidor";

/** Pedido de proposta da aba Com a Elev8: vai para o topo da fila do admin. */
export async function POST(req: Request) {
  if (!bancoConfigurado()) return json({ erro: "Indisponível." }, 503);
  if (!dentroDoLimite(`proposta:${ipDe(req)}`, 10, 3600e3)) return json({ erro: "Muitos pedidos seguidos." }, 429);
  const b = (await req.json().catch(() => ({}))) as { d?: string; resolver?: unknown; orcamento?: unknown; prazo?: unknown };
  const reg = await obter(String(b.d ?? ""));
  if (!reg) return json({ erro: "Diagnóstico não encontrado." }, 404);
  const resolver = Array.isArray(b.resolver) ? b.resolver.map((x) => String(x).slice(0, 60)).slice(0, 10) : [];
  const proposta = { resolver, orcamento: String(b.orcamento ?? "").slice(0, 60), prazo: String(b.prazo ?? "").slice(0, 60) };
  if (!resolver.length) return json({ erro: "Escolha o que você quer resolver." }, 400);
  await atualizar(reg.id, { proposta, etapa: "proposta" });
  return json({ ok: true });
}
