import Image from "next/image";
import Link from "next/link";
import { BarraPrototipo } from "./BarraPrototipo";
import { LayoutGrid, ScanSearch, Package, CalendarCheck, Sparkles, Handshake, Lock } from "lucide-react";

export type Aba = "visao-geral" | "diagnostico" | "kit" | "plano" | "assistente" | "elev8";

const abas: { id: Aba; nome: string; curto: string; icone: typeof LayoutGrid; pago: boolean }[] = [
  { id: "visao-geral", nome: "Visão geral", curto: "Início", icone: LayoutGrid, pago: false },
  { id: "diagnostico", nome: "Diagnóstico", curto: "Diagnóstico", icone: ScanSearch, pago: false },
  { id: "kit", nome: "Kit pronto", curto: "Kit", icone: Package, pago: true },
  { id: "plano", nome: "Plano 30 dias", curto: "Plano", icone: CalendarCheck, pago: true },
  { id: "assistente", nome: "Consultor IA", curto: "Consultor", icone: Sparkles, pago: true },
  { id: "elev8", nome: "Com a Elev8", curto: "Elev8", icone: Handshake, pago: false },
];

type Props = {
  ativa: Aba;
  pago: boolean;
  nicho: string;
  empresa: string;
  cidade: string;
  children: React.ReactNode;
};

/** Monta a query que mantém versão (grátis/paga) e nicho ao navegar entre as abas. */
export function montarQs(pago: boolean, nicho: string) {
  const p = new URLSearchParams();
  if (pago) p.set("plano", "pago");
  if (nicho && nicho !== "estetica") p.set("nicho", nicho);
  const q = p.toString();
  return q ? `?${q}` : "";
}

export function AppShell({ ativa, pago, nicho, empresa, cidade, children }: Props) {
  const sufixo = montarQs(pago, nicho);

  return (
    <div className="min-h-dvh pb-[calc(76px+env(safe-area-inset-bottom))] md:pb-0">
      <header className="bg-night text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 pt-[max(14px,env(safe-area-inset-top))] md:px-8">
          <Link href={`/painel${sufixo}`} className="flex items-center gap-2.5" aria-label="Elev8 Score, início">
            <Image src="/elev8-symbol.png" alt="" width={20} height={29} priority />
            <span className="font-display text-[17px] font-extrabold tracking-tight">
              Elev8 <span className="font-medium text-white/60">Score</span>
            </span>
          </Link>
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-semibold">{empresa}</p>
            <p className="truncate text-xs text-white/55">{cidade}</p>
          </div>
        </div>

        <nav aria-label="Seções do painel" className="hidden border-t border-white/10 md:block">
          <ul className="mx-auto flex max-w-6xl gap-1 px-6">
            {abas.map((a) => {
              const bloqueada = a.pago && !pago;
              const atual = a.id === ativa;
              return (
                <li key={a.id}>
                  <Link
                    href={`/painel${a.id === "visao-geral" ? "" : `/${a.id}`}${sufixo}`}
                    aria-current={atual ? "page" : undefined}
                    className={`relative flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
                      atual ? "text-white" : "text-white/55 hover:text-white/85"
                    }`}
                  >
                    <a.icone size={16} strokeWidth={2} aria-hidden />
                    {a.nome}
                    {bloqueada && <Lock size={12} className="text-white/40" aria-label="liberado com o kit" />}
                    {atual && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-brand" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <BarraPrototipo pago={pago} nicho={nicho} />
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</main>

      <nav
        aria-label="Seções do painel"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="grid grid-cols-6">
          {abas.map((a) => {
            const bloqueada = a.pago && !pago;
            const atual = a.id === ativa;
            return (
              <li key={a.id}>
                <Link
                  href={`/painel${a.id === "visao-geral" ? "" : `/${a.id}`}${sufixo}`}
                  aria-current={atual ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 px-1 pb-2.5 pt-2 text-[10.5px] font-medium ${
                    atual ? "text-brand" : "text-faint"
                  }`}
                >
                  <span className="relative">
                    <a.icone size={21} strokeWidth={atual ? 2.3 : 1.8} aria-hidden />
                    {bloqueada && (
                      <Lock size={10} className="absolute -right-2 -top-1 rounded-full bg-surface text-faint" aria-label="liberado com o kit" />
                    )}
                  </span>
                  {a.curto}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
