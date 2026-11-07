import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { faixaScore } from "@/lib/mock";
import { Card, Origem } from "./ui";

type Props = {
  nota: number;
  potencial: number;
  itens: { nome: string; detalhe: string }[];
};

/** Versão grátis: a oferta só aparece depois do valor (problema, exclusivo, presente, etapas). */
export function Offer({ nota, potencial, itens }: Props) {
  const faixaHoje = faixaScore(nota).texto;
  const faixaDepois = faixaScore(potencial).texto;

  return (
    <Card destaque className="overflow-hidden">
      <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[13px] font-semibold text-brand">Seu kit pronto</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight tracking-tight text-balance md:text-[28px]">
              Tudo pronto para subir seu Score Digital, feito para a sua empresa
            </h2>
          </div>

          <div className="rounded-[var(--radius-control)] bg-subtle p-4">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-xs text-muted">Hoje</p>
                <p className="tabular font-display text-3xl font-extrabold leading-none">{nota}</p>
                <p className="mt-1 text-xs text-muted">{faixaHoje}</p>
              </div>
              <ArrowRight size={22} className="mb-6 text-faint" aria-hidden />
              <div>
                <p className="text-xs text-muted">Com o kit aplicado</p>
                <p className="tabular font-display text-3xl font-extrabold leading-none text-brand">até {potencial}</p>
                <p className="mt-1 text-xs text-muted">{faixaDepois}</p>
              </div>
            </div>
            <div className="mt-3">
              <Origem tipo="Estimativa">Calculado pela fórmula do Score Digital, aplicando todas as ações do kit.</Origem>
            </div>
          </div>

          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {itens.map((i) => (
              <li key={i.nome} className="flex items-start gap-3 py-2.5 text-[15px]">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                <span>
                  <b className="font-semibold">{i.nome}</b> <span className="text-muted">· {i.detalhe}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center gap-4 lg:border-l lg:border-line lg:pl-10">
          <div>
            <p className="text-sm text-muted">
              De <s>R$ 197</s> por
            </p>
            <p className="font-display text-5xl font-extrabold leading-none tracking-tight">R$ 97</p>
            <p className="mt-2 text-sm text-muted">Pagamento único no Pix ou cartão. Sem mensalidade.</p>
          </div>
          <a
            href="?plano=pago"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-brand px-5 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Liberar meu kit
            <ArrowRight size={18} aria-hidden />
          </a>
          <p className="flex items-start gap-2.5 text-sm leading-snug text-muted">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-good" aria-hidden />
            <span>
              <b className="font-semibold text-ink">Garantia do Score.</b> Aplicou o kit e seu Score Digital não subiu em 30
              dias? Devolvemos os R$ 97.
            </span>
          </p>
          <p className="text-sm text-muted">Em 30 dias refazemos a análise e mostramos o antes e depois.</p>
        </div>
      </div>
    </Card>
  );
}
