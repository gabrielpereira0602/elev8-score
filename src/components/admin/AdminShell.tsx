import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="bg-night text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 pt-[max(14px,env(safe-area-inset-top))] md:px-8">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/elev8-symbol.png" alt="" width={20} height={29} priority />
            <span className="font-display text-[17px] font-extrabold tracking-tight">
              Elev8 <span className="font-medium text-white/60">Score</span>
            </span>
            <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold">Admin</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/65 hover:text-white">
            Ver o produto
            <ExternalLink size={14} aria-hidden />
          </Link>
        </div>
      </header>
      <div className="border-b border-warn/30 bg-warn-soft/60">
        <p className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-[12.5px] text-warn md:px-8">
          <ShieldCheck size={14} aria-hidden />
          <b className="font-bold uppercase tracking-wider">Protótipo</b> Dados de exemplo e sem login. Na versão final, só você entra, com e-mail e senha.
        </p>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}

const tons = {
  quente: "bg-bad-soft text-bad",
  morno: "bg-warn-soft text-warn",
  frio: "bg-subtle text-muted",
};

export function TempBadge({ t }: { t: "quente" | "morno" | "frio" }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tons[t]}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {t}
    </span>
  );
}
