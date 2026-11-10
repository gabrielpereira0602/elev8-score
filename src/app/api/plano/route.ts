import { atualizar, bancoConfigurado, obter } from "@/lib/real/db";
import { json } from "@/lib/real/servidor";

/** Marca ou desmarca uma ação do plano de 30 dias (conta para a garantia). */
export async function POST(req: Request) {
  if (!bancoConfigurado()) return json({ erro: "Indisponível." }, 503);
  const b = (await req.json().catch(() => ({}))) as { d?: string; acao?: string; feita?: boolean };
  const reg = await obter(String(b.d ?? ""));
  if (!reg || !reg.pago) return json({ erro: "Plano não liberado." }, 403);
  const acao = String(b.acao ?? "").slice(0, 40);
  if (!/^[a-z0-9-]{1,40}$/.test(acao)) return json({ erro: "Ação inválida." }, 400);
  const lista = new Set(reg.plano_feitas);
  if (b.feita) lista.add(acao);
  else lista.delete(acao);
  const r = await atualizar(reg.id, { plano_feitas: [...lista].slice(0, 30) });
  return json({ feitas: r?.plano_feitas.length ?? lista.size });
}
