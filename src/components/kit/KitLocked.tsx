import Link from "next/link";
import { ArrowRight, Clock, Lock } from "lucide-react";
import { pecas } from "@/lib/kit-mock";
import { Card } from "../ui";

/** Versão grátis da aba Kit: mostra o que vem, o porquê de cada peça e o conteúdo desfocado. */
export function KitLocked({ empresa }: { empresa: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">O kit da {empresa} está pronto</h1>
          <p className="mt-1 text-sm text-muted">5 peças feitas a partir do seu diagnóstico. Libere para ver e usar.</p>
        </div>
        <Link
          href="/painel#oferta"
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Liberar por R$ 97
          <ArrowRight size={18} aria-hidden />
        </Link>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {pecas.map((p) => (
          <li key={p.id}>
            <Card className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-brand">Melhora: {p.etapa}</p>
                  <h2 className="font-display text-lg font-bold">{p.nome}</h2>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-subtle px-2.5 py-1 text-xs font-semibold text-muted">
                  <Clock size={12} aria-hidden />
                  {p.tempo}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{p.porQue}</p>
              <div className="relative mt-auto overflow-hidden rounded-[var(--radius-control)] border border-line p-4" aria-hidden>
                <div className="flex select-none flex-col gap-2 blur-[5px]">
                  <span className="h-3 w-4/5 rounded bg-faint/50" />
                  <span className="h-3 w-3/5 rounded bg-faint/50" />
                  <span className="h-3 w-2/3 rounded bg-faint/50" />
                </div>
                <span className="absolute inset-0 grid place-items-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                    <Lock size={12} aria-hidden />
                    Pronto para você
                  </span>
                </span>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
