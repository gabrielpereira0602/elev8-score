import { ArrowRight } from "lucide-react";
import { Card, Rotulo } from "./ui";

/** Versão paga: a única ação de maior impacto agora, com atalho para a peça pronta. */
export function NextAction({ acao }: { acao: { titulo: string; motivo: string; botao: string } }) {
  return (
    <Card destaque className="flex h-full flex-col gap-3 p-5 md:p-6">
      <Rotulo>Sua próxima ação</Rotulo>
      <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-balance">{acao.titulo}</h2>
      <p className="text-[15px] leading-relaxed text-muted">{acao.motivo}</p>
      <a
        href="#"
        className="mt-auto inline-flex items-center justify-center gap-2 self-stretch rounded-[var(--radius-control)] bg-brand px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:self-start"
      >
        {acao.botao}
        <ArrowRight size={18} aria-hidden />
      </a>
    </Card>
  );
}
