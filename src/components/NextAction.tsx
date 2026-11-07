import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { Card, Rotulo } from "./ui";

type Props = {
  pago: boolean;
  acao: { titulo: string; motivo: string; botao: string };
};

export function NextAction({ pago, acao }: Props) {
  if (pago) {
    return (
      <Card destaque className="flex flex-col gap-3 p-5 md:p-6">
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

  return (
    <Card destaque className="flex flex-col gap-4 p-5 md:p-6">
      <Rotulo>Sua próxima ação</Rotulo>
      <div className="flex items-start gap-3 rounded-[var(--radius-control)] bg-subtle p-4">
        <Lock size={18} className="mt-0.5 shrink-0 text-muted" aria-hidden />
        <div>
          <p className="font-display text-[17px] font-bold leading-snug">Já sabemos o que você deve fazer primeiro</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            A ação de maior impacto na sua nota, com o material pronto para usar, está no seu kit.
          </p>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <s className="text-sm text-faint">R$ 197</s>
        <span className="font-display text-3xl font-extrabold tracking-tight">R$ 97</span>
        <span className="text-sm text-muted">pagamento único</span>
      </div>
      <a
        href="?plano=pago"
        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-brand px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Liberar meu kit
        <ArrowRight size={18} aria-hidden />
      </a>
      <p className="flex items-start gap-2 text-[13px] leading-snug text-muted">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-good" aria-hidden />
        Aplicou o kit e sua nota não subiu em 30 dias? Devolvemos o valor.
      </p>
    </Card>
  );
}
