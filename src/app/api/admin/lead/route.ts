import { cookies } from "next/headers";
import { atualizar, bancoConfigurado } from "@/lib/real/db";
import { COOKIE_ADMIN, adminLogado, json } from "@/lib/real/servidor";

const ETAPAS = ["novo", "diagnostico", "comprou", "aplicando", "reavaliado", "proposta", "negociando", "cliente", "perdido"];

/** Admin: muda a etapa ou as anotações de um lead real. */
export async function PATCH(req: Request) {
  if (!(await adminLogado((await cookies()).get(COOKIE_ADMIN)?.value))) return json({ erro: "Sem acesso." }, 401);
  if (!bancoConfigurado()) return json({ erro: "Banco não configurado." }, 503);
  const b = (await req.json().catch(() => ({}))) as { id?: string; etapa?: string; notas?: string };
  const patch: Record<string, unknown> = {};
  if (b.etapa && ETAPAS.includes(b.etapa)) patch.etapa = b.etapa;
  if (typeof b.notas === "string") patch.notas = b.notas.slice(0, 2000);
  const r = await atualizar(String(b.id ?? ""), patch);
  return r ? json({ ok: true }) : json({ erro: "Lead não encontrado." }, 404);
}
