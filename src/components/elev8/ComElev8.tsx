"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Search, Lightbulb, Wrench, MessageCircle } from "lucide-react";
import type { Recomendacao } from "@/lib/recomendacoes";
import { Card } from "../ui";

type Props = { empresa: string; recomendacoes: Recomendacao[]; pago: boolean };

const orcamentos = ["Até R$ 1.000 por mês", "De R$ 1.000 a R$ 3.000 por mês", "Acima de R$ 3.000 por mês", "Ainda não sei"];
const prazos = ["Quero começar agora", "No próximo mês", "Só estou pesquisando"];

export function ComElev8({ empresa, recomendacoes, pago }: Props) {
  const [principal, ...outras] = recomendacoes;
  const [escolhidas, setEscolhidas] = useState<Set<string>>(new Set([principal.id]));
  const [orcamento, setOrcamento] = useState("");
  const [prazo, setPrazo] = useState("");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  function alternar(id: string) {
    setEscolhidas((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
    setErro("");
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (escolhidas.size === 0) return setErro("Escolha pelo menos um item para a proposta.");
    if (!orcamento || !prazo) return setErro("Responda as duas perguntas para a proposta vir no tamanho certo.");
    setEnviado(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Com a Elev8</h1>
        <p className="mt-1 text-sm text-muted">O que o seu diagnóstico mostra que vale a pena entregar para profissionais, em ordem de impacto.</p>
      </div>

      <Card destaque className="p-5 md:p-7">
        <p className="text-[13px] font-semibold text-brand">Recomendação principal</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{principal.servico}</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-2">
          {(
            [
              [Search, "O que identificamos", principal.identificado],
              [Lightbulb, "Por que importa", principal.porQue],
              [Wrench, "Como a Elev8 resolve", principal.comoResolvemos],
              [MessageCircle, "Próximo passo", "Peça a proposta abaixo. Respondemos pelo WhatsApp, já com o seu diagnóstico em mãos."],
            ] as const
          ).map(([Icone, titulo, texto]) => (
            <li key={titulo} className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-brand-soft text-brand">
                <Icone size={18} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold">{titulo}</p>
                <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {outras.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-lg font-bold">Também pode ajudar</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {outras.map((r) => (
              <li key={r.id}>
                <Card className="flex h-full flex-col gap-2 p-5">
                  <h3 className="font-display font-bold">{r.servico}</h3>
                  <p className="text-sm text-ink">{r.identificado}</p>
                  <p className="text-sm text-muted">{r.comoResolvemos}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Card className="p-5 md:p-7">
        {enviado ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center" role="status">
            <CheckCircle2 size={40} className="text-good" aria-hidden />
            <h2 className="font-display text-xl font-bold">Pedido recebido</h2>
            <p className="max-w-md text-[15px] text-muted">
              A equipe Elev8 vai te chamar no WhatsApp em até 1 dia útil, já com o diagnóstico de {empresa} em mãos. Você não precisa explicar nada de
              novo.
            </p>
          </div>
        ) : (
          <form onSubmit={enviar} className="flex flex-col gap-5" noValidate>
            <div>
              <h2 className="font-display text-xl font-bold">Quero uma proposta</h2>
              <p className="mt-1 text-sm text-muted">3 respostas rápidas para a proposta vir no tamanho certo. Sem compromisso.</p>
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold">O que você quer resolver?</legend>
              <div className="flex flex-wrap gap-2">
                {recomendacoes.map((r) => {
                  const ativo = escolhidas.has(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => alternar(r.id)}
                      aria-pressed={ativo}
                      className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                        ativo ? "border-brand bg-brand-soft text-brand-ink" : "border-line hover:border-faint"
                      }`}
                    >
                      {r.servico}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Opcoes legenda="Quanto você pensa em investir?" nome="orcamento" opcoes={orcamentos} valor={orcamento} onChange={(v) => { setOrcamento(v); setErro(""); }} />
            <Opcoes legenda="Quando quer começar?" nome="prazo" opcoes={prazos} valor={prazo} onChange={(v) => { setPrazo(v); setErro(""); }} />

            {erro && (
              <p role="alert" className="text-sm text-bad">
                {erro}
              </p>
            )}

            {pago && (
              <p className="rounded-[var(--radius-control)] bg-good-soft px-4 py-3 text-sm text-good">
                Os R$ 97 do seu kit viram desconto no primeiro mês de qualquer serviço contratado em até 30 dias.
              </p>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 self-start rounded-[var(--radius-control)] bg-brand px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Pedir minha proposta
              <ArrowRight size={18} aria-hidden />
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}

function Opcoes({ legenda, nome, opcoes, valor, onChange }: { legenda: string; nome: string; opcoes: string[]; valor: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{legenda}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {opcoes.map((o, i) => {
          const id = `${nome}-${i}`;
          return (
            <label
              key={o}
              htmlFor={id}
              className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-control)] border px-3.5 py-3 text-sm transition-colors ${
                valor === o ? "border-brand bg-brand-soft/50" : "border-line hover:border-faint"
              }`}
            >
              <input id={id} type="radio" name={nome} value={o} checked={valor === o} onChange={() => onChange(o)} className="size-4 accent-[var(--brand)]" />
              {o}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
