import { atualizar, bancoConfigurado, obter } from "@/lib/real/db";
import { json } from "@/lib/real/servidor";

/** Formulário do kit: serviço, preço, diferencial, cor e bio, para os textos saírem com os dados do dono. */
export async function POST(req: Request) {
  if (!bancoConfigurado()) return json({ erro: "Indisponível." }, 503);
  const b = (await req.json().catch(() => ({}))) as { d?: string; form?: Record<string, unknown> };
  const reg = await obter(String(b.d ?? ""));
  if (!reg || !reg.pago) return json({ erro: "Kit não liberado." }, 403);
  const f = b.form ?? {};
  const texto = (v: unknown, max: number) => String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);
  const form = {
    servico: texto(f.servico, 80),
    preco: texto(f.preco, 30),
    diferencial: texto(f.diferencial, 140),
    cor: /^#[0-9a-f]{6}$/i.test(String(f.cor ?? "")) ? String(f.cor) : "",
    bio: texto(f.bio, 300),
  };
  await atualizar(reg.id, { form_kit: form });
  return json({ ok: true });
}
