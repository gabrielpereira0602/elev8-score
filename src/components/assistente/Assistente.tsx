"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, Sparkles } from "lucide-react";
import type { Contexto } from "@/lib/contexto";
import { responder, sugestoes, type Resposta } from "@/lib/assistente";
import { Card } from "../ui";

type Msg = { de: "voce" | "assistente"; texto: string; extra?: Resposta };

const LIMITE_DIA = 20;

export function Assistente({ ctx, qs, ativoAte }: { ctx: Contexto; qs: string; ativoAte: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      de: "assistente",
      texto: `Oi! Eu conheço o diagnóstico de ${ctx.empresa.nome}, o seu kit e o seu plano. Pode perguntar o que quiser sobre eles, ou escolher uma das perguntas abaixo.`,
    },
  ]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const [usadas, setUsadas] = useState(0);
  const fim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, pensando]);

  function enviar(pergunta: string) {
    const q = pergunta.trim();
    if (!q || pensando || usadas >= LIMITE_DIA) return;
    setMsgs((m) => [...m, { de: "voce", texto: q }]);
    setTexto("");
    setUsadas((u) => u + 1);
    setPensando(true);
    window.setTimeout(() => {
      const r = responder(q, ctx);
      setMsgs((m) => [...m, { de: "assistente", texto: r.texto, extra: r }]);
      setPensando(false);
    }, 650);
  }

  const restantes = LIMITE_DIA - usadas;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Assistente</h1>
          <p className="mt-1 text-sm text-muted">Tire dúvidas sobre o seu diagnóstico, o kit e o plano. Ativo até {ativoAte}.</p>
        </div>
        <p className="tabular text-sm text-muted">{restantes} de {LIMITE_DIA} perguntas hoje</p>
      </div>

      <Card className="flex flex-col overflow-hidden">
        <div className="flex max-h-[60vh] min-h-[22rem] flex-col gap-4 overflow-y-auto p-5 md:p-6" aria-live="polite">
          {msgs.map((m, i) =>
            m.de === "voce" ? (
              <div key={i} className="max-w-[85%] self-end rounded-[16px] rounded-br-[4px] bg-brand px-4 py-2.5 text-[15px] text-white">
                {m.texto}
              </div>
            ) : (
              <div key={i} className="flex max-w-[92%] gap-3 self-start">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Sparkles size={16} aria-hidden />
                </span>
                <div className="flex flex-col gap-2">
                  <div className="whitespace-pre-line rounded-[16px] rounded-tl-[4px] bg-subtle px-4 py-3 text-[15px] leading-relaxed">{m.texto}</div>
                  {m.extra?.linkElev8 && (
                    <Link href={`/painel/elev8${qs}`} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand hover:underline">
                      Ver opções com a Elev8
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  )}
                  {m.extra?.linkKit && (
                    <Link href={`/painel/kit${qs}`} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand hover:underline">
                      Abrir no kit
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  )}
                </div>
              </div>
            ),
          )}
          {pensando && (
            <div className="flex items-center gap-3 self-start" role="status">
              <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand">
                <Sparkles size={16} aria-hidden />
              </span>
              <span className="flex gap-1 rounded-[16px] bg-subtle px-4 py-3.5" aria-label="Escrevendo">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 animate-bounce rounded-full bg-faint" style={{ animationDelay: `${d * 120}ms` }} />
                ))}
              </span>
            </div>
          )}
          <div ref={fim} />
        </div>

        <div className="border-t border-line p-4">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {sugestoes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => enviar(s)}
                disabled={pensando || restantes <= 0}
                className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor="assistente-pergunta" className="sr-only">
              Sua pergunta
            </label>
            <input
              id="assistente-pergunta"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={restantes > 0 ? "Escreva sua pergunta" : "Você usou as perguntas de hoje. Volte amanhã."}
              disabled={restantes <= 0}
              className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-3 text-[15px] outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={!texto.trim() || pensando || restantes <= 0}
              aria-label="Enviar pergunta"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover disabled:opacity-40"
            >
              <ArrowUp size={20} aria-hidden />
            </button>
          </form>
          <p className="mt-2 text-xs text-faint">Protótipo: respostas de exemplo montadas com os seus dados. A IA completa entra na próxima fase.</p>
        </div>
      </Card>
    </div>
  );
}
