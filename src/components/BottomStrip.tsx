import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { Card } from "./ui";

export function PlanProgress({ feitas, total, dias }: { feitas: number; total: number; dias: number }) {
  const pct = Math.round((feitas / total) * 100);
  return (
    <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="shrink-0">
        <h3 className="font-display text-base font-bold">Plano de 30 dias</h3>
        <p className="text-[13px] text-muted">
          {feitas} de {total} ações feitas
        </p>
      </div>
      <div className="h-2.5 flex-1 rounded-full bg-subtle" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do plano">
        <div className="h-2.5 rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <p className="shrink-0 text-sm text-muted">
        Reavaliação em <b className="font-semibold text-ink">{dias} dias</b>
      </p>
    </Card>
  );
}

export function KitPreview({ itens }: { itens: string[] }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-bold">O que vem no seu kit</h3>
        <p className="text-[13px] text-muted">Tudo montado a partir do seu diagnóstico</p>
      </div>
      <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {itens.map((i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
              <Check size={13} strokeWidth={3} aria-hidden />
            </span>
            {i}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function TabLocked() {
  return (
    <Card className="mx-auto flex max-w-md flex-col items-center gap-3 p-8 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-subtle text-muted">
        <Lock size={20} aria-hidden />
      </span>
      <h2 className="font-display text-lg font-bold">Liberado com o kit</h2>
      <p className="text-sm text-muted">Esta parte do painel abre assim que você liberar seu kit pronto.</p>
      <Link href="/painel" className="mt-1 text-sm font-semibold text-brand hover:underline">
        Voltar para a visão geral
      </Link>
    </Card>
  );
}
