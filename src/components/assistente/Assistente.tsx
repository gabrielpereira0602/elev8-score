"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, BookOpen, Check, MessageCircle, Sparkles, Wrench } from "lucide-react";
import type { Contexto } from "@/lib/contexto";
import { CATEGORIAS, TEMAS, responder, saudacao, type Resposta } from "@/lib/assistente";
import { CopyButton } from "../CopyButton";
import { Card } from "../ui";
import { Ferramentas } from "./Ferramentas";

type Msg = { de: "voce" | "consultor"; texto: string; extra?: Resposta };
type Modo = "perguntar" | "biblioteca" | "ferramentas";

type Props = { ctx: Contexto; qs: string; ativoAte: string; sugestoes: string[]; perguntaInicial?: string };

/** Pega o trecho entre aspas “...” mais longo da resposta: é o texto pronto que vale um botão de copiar. */
function textoPronto(t: string): string | null {
  const trechos = [...t.matchAll(/“([^”]{40,})”/g)].map((m) => m[1]);
  return trechos.sort((a, b) => b.length - a.length)[0] ?? null;
}

export function Assistente({ ctx, qs, ativoAte, sugestoes, perguntaInicial = "" }: Props) {
  const [modo, setModo] = useState<Modo>("perguntar");
  const [msgs, setMsgs] = useState<Msg[]>([{ de: "consultor", texto: saudacao(ctx) }]);
  // Pergunta vinda da visão geral: fica escrita no campo, a pessoa só confirma.
  const [texto, setTexto] = useState(perguntaInicial);
  const [pensando, setPensando] = useState(false);
  const fim = useRef<HTMLDivElement>(null);
  const primeiraVez = useRef(true);

  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    fim.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, pensando]);

  function enviar(pergunta: string) {
    const q = pergunta.trim().slice(0, 300);
    if (!q || pensando) return;
    setModo("perguntar");
    setMsgs((m) => [...m, { de: "voce", texto: q }]);
    setTexto("");
    setPensando(true);
    // Resposta é local e instantânea; a pausa curta só deixa a leitura natural.
    window.setTimeout(() => {
      const r = responder(q, ctx);
      setMsgs((m) => [...m, { de: "consultor", texto: r.texto, extra: r }]);
      setPensando(false);
    }, 450);
  }

  const abas: { id: Modo; nome: string; icone: typeof MessageCircle }[] = [
    { id: "perguntar", nome: "Perguntar", icone: MessageCircle },
    { id: "biblioteca", nome: `Biblioteca (${TEMAS.length})`, icone: BookOpen },
    { id: "ferramentas", nome: "Ferramentas", icone: Wrench },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">
          <Sparkles size={14} aria-hidden />
          Incluso no seu kit · acesso até {ativoAte}
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Seu consultor de marketing</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Pergunte o que quiser sobre o marketing de {ctx.empresa.nome}, sem limite. Ele responde na hora, com passo a passo e texto pronto para copiar.
        </p>
      </div>

      <ul className="flex flex-wrap gap-2" aria-label="O que o consultor já conhece">
        {["Seu diagnóstico", "Seus 3 concorrentes", `Regras de ${ctx.segmento.nome.toLowerCase()}`, "Seu kit e seu plano"].map((t) => (
          <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[13px] font-medium shadow-[inset_0_0_0_1px_var(--color-line)]">
            <Check size={13} strokeWidth={3} className="text-good" aria-hidden />
            {t}
          </li>
        ))}
      </ul>

      <div className="flex gap-1 rounded-[12px] bg-subtle p-1" role="tablist" aria-label="Modos do consultor">
        {abas.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={modo === a.id}
            onClick={() => setModo(a.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-[9px] px-2 py-2 text-[13px] font-semibold transition-colors sm:text-sm ${
              modo === a.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            <a.icone size={15} aria-hidden />
            {a.nome}
          </button>
        ))}
      </div>

      {modo === "perguntar" && (
        <Card className="flex flex-col overflow-hidden">
          <div className="flex max-h-[65vh] min-h-[22rem] flex-col gap-4 overflow-y-auto p-4 md:p-6" aria-live="polite">
            {msgs.map((m, i) =>
              m.de === "voce" ? (
                <div key={i} className="max-w-[85%] self-end rounded-[16px] rounded-br-[4px] bg-brand px-4 py-2.5 text-[15px] text-white">
                  {m.texto}
                </div>
              ) : (
                <div key={i} className="flex max-w-[94%] gap-3 self-start">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                    <Sparkles size={16} aria-hidden />
                  </span>
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="whitespace-pre-line rounded-[16px] rounded-tl-[4px] bg-subtle px-4 py-3 text-[15px] leading-relaxed">{m.texto}</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      {m.extra && textoPronto(m.extra.texto) && <CopyButton texto={textoPronto(m.extra.texto)!} rotulo="Copiar texto pronto" />}
                      {m.extra?.linkPlano && (
                        <Link href={`/painel/plano${qs}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                          Abrir meu plano
                          <ArrowRight size={14} aria-hidden />
                        </Link>
                      )}
                      {m.extra?.linkKit && (
                        <Link href={`/painel/kit${qs}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                          Abrir no kit
                          <ArrowRight size={14} aria-hidden />
                        </Link>
                      )}
                      {m.extra?.linkElev8 && (
                        <Link href={`/painel/elev8${qs}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                          Ver opções com a Elev8
                          <ArrowRight size={14} aria-hidden />
                        </Link>
                      )}
                    </div>
                    {i === msgs.length - 1 && m.extra?.relacionados && m.extra.relacionados.length > 0 && (
                      <div className="mt-1">
                        <p className="mb-1.5 text-xs font-semibold text-muted">Veja também</p>
                        <div className="flex flex-wrap gap-2">
                          {m.extra.relacionados.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => enviar(r.titulo)}
                              disabled={pensando}
                              className="rounded-full border border-line bg-surface px-3 py-1.5 text-left text-[13px] font-medium transition-colors hover:border-brand hover:text-brand"
                            >
                              {r.titulo}
                            </button>
                          ))}
                        </div>
                      </div>
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
                  disabled={pensando}
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
                maxLength={300}
                placeholder="Escreva sua pergunta"
                className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-3 text-[15px] outline-none focus:border-brand"
              />
              <button
                type="submit"
                disabled={!texto.trim() || pensando}
                aria-label="Enviar pergunta"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover disabled:opacity-40"
              >
                <ArrowUp size={20} aria-hidden />
              </button>
            </form>
            <p className="mt-2 text-xs text-faint">
              O consultor orienta o seu marketing com base no seu diagnóstico e não substitui a orientação de profissionais de outras áreas.
            </p>
          </div>
        </Card>
      )}

      {modo === "biblioteca" && (
        <div className="grid gap-4 md:grid-cols-2">
          {CATEGORIAS.map((cat) => (
            <Card key={cat} className="p-5">
              <h2 className="font-display text-base font-bold">{cat}</h2>
              <ul className="mt-2 flex flex-col">
                {TEMAS.filter((t) => t.categoria === cat).map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => enviar(t.titulo)}
                      className="flex w-full items-center justify-between gap-3 border-b border-line py-2.5 text-left text-[15px] transition-colors last:border-0 hover:text-brand"
                    >
                      {t.titulo}
                      <ArrowRight size={15} className="shrink-0 text-faint" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {modo === "ferramentas" && <Ferramentas ctx={ctx} />}
    </div>
  );
}
