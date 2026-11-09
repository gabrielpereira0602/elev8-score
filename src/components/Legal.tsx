import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

/** Dados da empresa nos documentos legais. Preencher antes do lançamento. */
export const EMPRESA_LEGAL = {
  razao: "ELEV8 Soluções Digitais",
  cnpj: "[CNPJ]",
  endereco: "[endereço completo]",
  email: "[e-mail de contato]",
  cidadeForo: "Vinhedo/SP",
  atualizado: "09/11/2026",
};

export function LegalPage({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-page">
      <header className="bg-night">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Elev8 Score, página inicial">
            <Image src="/elev8-symbol.png" alt="" width={20} height={29} />
            <span className="font-display text-[17px] font-extrabold text-white">
              Elev8 <span className="font-medium text-white/70">Score</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={15} aria-hidden />
          Voltar
        </Link>
        <p className="mt-6 rounded-[var(--radius-control)] border border-dashed border-warn/50 bg-warn-soft/40 px-4 py-3 text-[13px] text-warn">
          Minuta para revisão jurídica antes do lançamento. Os campos entre colchetes precisam ser preenchidos.
        </p>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">{titulo}</h1>
        <p className="mt-1 text-sm text-muted">Atualizado em {EMPRESA_LEGAL.atualizado}</p>
        <div className="legal mt-8 flex flex-col gap-4 text-[15px] leading-relaxed text-ink/90">{children}</div>
      </main>
    </div>
  );
}

export function Secao({ id, titulo, children }: { id?: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="mb-2 mt-4 font-display text-lg font-bold">{titulo}</h2>
      <div className="flex flex-col gap-2 [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">{children}</div>
    </section>
  );
}
