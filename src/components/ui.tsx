import type { Status } from "@/lib/mock";

export function Card({
  className = "",
  destaque = false,
  children,
}: {
  className?: string;
  destaque?: boolean;
  children: React.ReactNode;
}) {
  const borda = destaque ? "border-2 border-brand" : "border border-line";
  return <section className={`rounded-[var(--radius-card)] bg-surface ${borda} ${className}`}>{children}</section>;
}

export function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-medium text-muted">{children}</p>;
}

const statusInfo: Record<Status, { texto: string; classe: string }> = {
  atras: { texto: "Atrás", classe: "bg-bad-soft text-bad" },
  media: { texto: "Na média", classe: "bg-warn-soft text-warn" },
  frente: { texto: "À frente", classe: "bg-good-soft text-good" },
};

export function StatusBadge({ status, texto }: { status: Status; texto?: string }) {
  const s = statusInfo[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.classe}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {texto ?? s.texto}
    </span>
  );
}

export function Origem({ tipo, children }: { tipo: "Observado" | "Informado" | "Estimativa"; children?: React.ReactNode }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-xs text-faint">
      <span className="rounded bg-subtle px-1.5 py-0.5 font-semibold uppercase tracking-wide text-muted">{tipo}</span>
      {children}
    </p>
  );
}
