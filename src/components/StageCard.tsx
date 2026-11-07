import type { Etapa } from "@/lib/mock";
import { Card, StatusBadge } from "./ui";

export function StageCard({ etapa }: { etapa: Etapa }) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold">{etapa.nome}</h3>
          <p className="mt-0.5 text-[13px] leading-snug text-muted">{etapa.pergunta}</p>
        </div>
        <StatusBadge status={etapa.status} />
      </div>

      <p className="font-display leading-none">
        <span className="tabular text-[40px] font-extrabold tracking-tight">{etapa.nota}</span>
        <span className="ml-1 text-sm font-semibold text-faint">/100</span>
      </p>

      <div>
        <div className="relative h-2 rounded-full bg-subtle" role="img" aria-label={`Você ${etapa.nota}, líder ${etapa.lider}`}>
          <span className="block h-2 rounded-full bg-ink" style={{ width: `${etapa.nota}%` }} />
          <span className="absolute -top-1.5 h-5 w-[3px] rounded-full bg-brand" style={{ left: `calc(${etapa.lider}% - 1.5px)` }} />
        </div>
        <div className="mt-2 flex justify-between gap-2 text-xs text-muted">
          <span>{etapa.resumo}</span>
          <span className="shrink-0">
            <span className="mr-1 inline-block h-2.5 w-[3px] translate-y-px rounded-full bg-brand align-baseline" aria-hidden />
            líder: {etapa.lider}
          </span>
        </div>
      </div>
    </Card>
  );
}
