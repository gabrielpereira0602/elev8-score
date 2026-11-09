import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { faixaScore, type Concorrente } from "@/lib/mock";
import { Card, Origem } from "./ui";

type Props = {
  empresa: string;
  nota: number;
  potencial: number;
  ranking: Concorrente[];
  itens: { nome: string; detalhe: string }[];
  bioPrevia: string;
  hrefLiberar: string;
  consultor: { pergunta: string; setor: string };
};

/** Versão grátis: a oferta só aparece depois do valor (problema, exclusivo, presente, etapas). */
export function Offer({ empresa, nota, potencial, ranking, itens, bioPrevia, hrefLiberar, consultor }: Props) {
  const faixaHoje = faixaScore(nota).texto;
  const faixaDepois = faixaScore(potencial).texto;
  // Meta próxima e com nome: o concorrente de maior nota que o potencial estimado ultrapassa.
  const ultrapassa = ranking
    .filter((r) => !r.voce && r.nota > nota && r.nota < potencial)
    .sort((a, b) => b.nota - a.nota)[0];
  const [linha1, ...resto] = bioPrevia.split("\n");

  return (
    <Card destaque className="overflow-hidden">
      <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[13px] font-semibold text-brand">Kit feito para {empresa}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight tracking-tight text-balance md:text-[28px]">
              {ultrapassa ? `Com o kit aplicado, você pode ficar à frente de ${ultrapassa.nome}` : "Tudo pronto para subir seu Score Digital"}
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

          <div className="rounded-[var(--radius-control)] border border-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Prévia · sua nova bio</p>
            <p className="mt-2 text-[15px] font-medium">{linha1}</p>
            <div className="select-none blur-[5px]" aria-hidden>
              {resto.map((l) => (
                <p key={l} className="text-[15px]">
                  {l}
                </p>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-muted">+ 2 outras versões, prontas para copiar</p>
          </div>

          {/* O consultor é o item de maior valor percebido: ganha bloco próprio, em vez de ser a última linha da lista. */}
          <div className="rounded-[var(--radius-control)] bg-night p-4 text-white md:p-5">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70">
              <Sparkles size={13} aria-hidden />
              Incluso no kit · 30 dias
            </p>
            <h3 className="mt-1 font-display text-lg font-bold">Seu consultor de marketing com IA</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/75">
              Pergunte qualquer coisa sobre o marketing de {empresa}, a qualquer hora. Ele já conhece seu diagnóstico, seus concorrentes e as regras de{" "}
              {consultor.setor}, e responde com passo a passo e texto pronto.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <p className="max-w-[90%] self-end rounded-[12px] rounded-br-[4px] bg-brand px-3 py-2 text-[13px]">{consultor.pergunta}</p>
              <p className="max-w-[90%] self-start rounded-[12px] rounded-tl-[4px] bg-white/10 px-3 py-2 text-[13px] text-white/80">
                Resposta feita para {empresa}, com o texto pronto para copiar.
              </p>
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
          <p className="-mt-2 text-[13px] text-muted">
            Tudo é entregue em formato digital, no seu painel. O QR code vem com a arte pronta para você imprimir; não enviamos
            materiais físicos.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 lg:border-l lg:border-line lg:pl-10">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-ink">Preço de lançamento</p>
            <p className="text-sm text-muted">
              De <s>R$ 197</s> por
            </p>
            <p className="font-display text-5xl font-extrabold leading-none tracking-tight">R$ 97</p>
            <p className="mt-2 text-sm text-muted">Pagamento único no Pix ou cartão. Sem mensalidade.</p>
          </div>
          <a
            href={hrefLiberar}
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-brand px-5 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Liberar kit e consultor
            <ArrowRight size={18} aria-hidden />
          </a>
          <p className="flex items-start gap-2.5 text-sm leading-snug text-muted">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-good" aria-hidden />
            <span>
              <b className="font-semibold text-ink">Garantia do Score.</b> Fez as ações do plano e seu Score Digital não subiu em 30
              dias? Devolvemos os R$ 97. Comparamos com os concorrentes como estavam no dia do diagnóstico, para contar só o que você fez.{" "}
              <a href="/termos#garantia" className="underline underline-offset-2 hover:text-ink">
                Como funciona
              </a>
            </span>
          </p>
          <p className="text-sm text-muted">Em 30 dias refazemos a análise e mostramos o antes e depois.</p>
          <p className="rounded-[var(--radius-control)] bg-brand-soft px-3.5 py-2.5 text-sm text-brand-ink">
            <b className="font-semibold">Bônus:</b> 10% de desconto em qualquer serviço da Elev8, se um dia você quiser que a gente faça por você.
          </p>
        </div>
      </div>
    </Card>
  );
}
