import Link from "next/link";
import { Mail } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui";
import { contexto, nichosDemo } from "@/lib/contexto";
import { PUBLICOS, emailHTML, emails } from "@/lib/emails";

type Props = { searchParams: Promise<{ nicho?: string; email?: string }> };

/** Prévia de todos os e-mails automáticos, com os dados reais de cada nicho de exemplo. */
export default async function EmailsAdmin({ searchParams }: Props) {
  const sp = await searchParams;
  const ctx = contexto(sp.nicho);
  const nicho = ctx.empresa.segmento;
  const lista = emails(ctx);
  const atual = lista.find((m) => m.id === sp.email) ?? lista[0];
  const link = (q: { nicho?: string; email?: string }) => {
    const p = new URLSearchParams();
    p.set("nicho", q.nicho ?? nicho);
    p.set("email", q.email ?? atual.id);
    return `/admin/emails?${p.toString()}`;
  };

  return (
    <AdminShell ativa="emails">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">E-mails automáticos</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              Tudo o que sai sozinho, sem você precisar entrar. Cada sequência para quando a pessoa compra, pede proposta ou clica em “parar de receber”.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5" aria-label="Ver com os dados de">
            {nichosDemo.map((n) => (
              <Link
                key={n.id}
                href={link({ nicho: n.id })}
                className={`rounded-full px-3 py-1 text-[13px] font-semibold ${n.id === nicho ? "bg-ink text-white" : "bg-subtle text-muted hover:text-ink"}`}
              >
                {n.nome}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            {PUBLICOS.map((p) => (
              <Card key={p.id} className="p-4">
                <h2 className="font-display text-[15px] font-bold">{p.nome}</h2>
                <p className="text-xs text-muted">{p.descricao}</p>
                <ul className="mt-2 flex flex-col">
                  {lista
                    .filter((m) => m.publico === p.id)
                    .map((m) => (
                      <li key={m.id}>
                        <Link
                          href={link({ email: m.id })}
                          aria-current={m.id === atual.id ? "true" : undefined}
                          className={`flex flex-col rounded-[8px] px-2.5 py-2 text-sm ${m.id === atual.id ? "bg-brand-soft" : "hover:bg-subtle"}`}
                        >
                          <span className="font-semibold">{m.assunto}</span>
                          <span className="text-xs text-muted">{m.quando}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </Card>
            ))}
          </div>

          <Card className="flex flex-col overflow-hidden lg:sticky lg:top-4 lg:self-start">
            <div className="flex flex-col gap-1 border-b border-line p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-muted">
                <Mail size={14} aria-hidden />
                De: Gabriel, da Elev8 · {atual.quando}
              </p>
              <p className="font-display text-lg font-bold">{atual.assunto}</p>
              <p className="text-sm text-muted">{atual.previa}</p>
            </div>
            <iframe title={`Prévia: ${atual.assunto}`} srcDoc={emailHTML(atual, atual.publico)} className="h-[640px] w-full bg-white" sandbox="" />
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
