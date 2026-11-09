"use client";

import { useMemo, useState } from "react";
import { MessageSquareText, PenLine, Star } from "lucide-react";
import type { Contexto } from "@/lib/contexto";
import {
  ASSUNTOS_AVALIACAO,
  OBJETIVOS_WHATSAPP,
  legenda,
  mensagemWhatsapp,
  respostaAvaliacao,
  temasLegenda,
  type AssuntoAvaliacao,
  type ObjetivoWhatsapp,
} from "@/lib/consultor-ferramentas";
import { CopyButton } from "../CopyButton";
import { Card } from "../ui";

const campo = "w-full min-w-0 rounded-[8px] border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand";

function Resultado({ texto }: { texto: string }) {
  return (
    <div className="mt-auto flex flex-col gap-2 rounded-[10px] bg-subtle p-3.5">
      <p className="whitespace-pre-line text-[14px] leading-relaxed">{texto}</p>
      <CopyButton texto={texto} rotulo="Copiar" className="self-start" />
    </div>
  );
}

/** Geradores de texto: escolhe as opções, o texto aparece na hora, sempre dentro das regras do setor. */
export function Ferramentas({ ctx }: { ctx: Contexto }) {
  const [nomeAv, setNomeAv] = useState("");
  const [estrelas, setEstrelas] = useState(5);
  const [assunto, setAssunto] = useState<AssuntoAvaliacao>("atendimento");

  const [nomeZap, setNomeZap] = useState("");
  const [objetivo, setObjetivo] = useState<ObjetivoWhatsapp>("primeira");

  const temas = useMemo(() => temasLegenda(ctx), [ctx]);
  const [temaId, setTemaId] = useState(temas[0]?.id ?? "dor");
  const [tom, setTom] = useState<"proximo" | "profissional">("proximo");

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-3">
      <Card className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-brand" aria-hidden />
          <h2 className="font-display text-base font-bold">Resposta para avaliação</h2>
        </div>
        <label className="text-[13px] font-semibold text-muted" htmlFor="fer-av-nome">
          Nome de quem avaliou
        </label>
        <input id="fer-av-nome" value={nomeAv} onChange={(e) => setNomeAv(e.target.value)} placeholder="Ex.: Ana" className={campo} maxLength={40} />
        <p className="text-[13px] font-semibold text-muted">Estrelas</p>
        <div className="flex gap-1" role="radiogroup" aria-label="Estrelas">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={estrelas === n}
              aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
              onClick={() => setEstrelas(n)}
              className="p-0.5"
            >
              <Star size={24} className={n <= estrelas ? "fill-[#F5B301] text-[#F5B301]" : "text-line"} aria-hidden />
            </button>
          ))}
        </div>
        <label className="text-[13px] font-semibold text-muted" htmlFor="fer-av-assunto">
          Sobre o quê
        </label>
        <select id="fer-av-assunto" value={assunto} onChange={(e) => setAssunto(e.target.value as AssuntoAvaliacao)} className={campo}>
          {ASSUNTOS_AVALIACAO.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>
        <Resultado texto={respostaAvaliacao(ctx, { nome: nomeAv, estrelas, assunto })} />
      </Card>

      <Card className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <MessageSquareText size={18} className="text-brand" aria-hidden />
          <h2 className="font-display text-base font-bold">Mensagem de WhatsApp</h2>
        </div>
        <label className="text-[13px] font-semibold text-muted" htmlFor="fer-zap-obj">
          Para quê
        </label>
        <select id="fer-zap-obj" value={objetivo} onChange={(e) => setObjetivo(e.target.value as ObjetivoWhatsapp)} className={campo}>
          {OBJETIVOS_WHATSAPP.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nome}
            </option>
          ))}
        </select>
        <label className="text-[13px] font-semibold text-muted" htmlFor="fer-zap-nome">
          Nome da pessoa
        </label>
        <input id="fer-zap-nome" value={nomeZap} onChange={(e) => setNomeZap(e.target.value)} placeholder="Ex.: Rafael" className={campo} maxLength={40} />
        <Resultado texto={mensagemWhatsapp(ctx, { nome: nomeZap, objetivo })} />
      </Card>

      <Card className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <PenLine size={18} className="text-brand" aria-hidden />
          <h2 className="font-display text-base font-bold">Legenda de post</h2>
        </div>
        <label className="text-[13px] font-semibold text-muted" htmlFor="fer-leg-tema">
          Tema
        </label>
        <select id="fer-leg-tema" value={temaId} onChange={(e) => setTemaId(e.target.value)} className={campo}>
          {temas.map((t) => (
            <option key={t.id} value={t.id}>
              {t.tipo === "data" ? `Data: ${t.nome}` : t.nome}
            </option>
          ))}
        </select>
        <p className="text-[13px] font-semibold text-muted">Tom</p>
        <div className="flex gap-1 rounded-[10px] bg-subtle p-1">
          {(
            [
              ["proximo", "Próximo"],
              ["profissional", "Profissional"],
            ] as const
          ).map(([id, nome]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tom === id}
              onClick={() => setTom(id)}
              className={`flex-1 rounded-[7px] py-1.5 text-[13px] font-semibold ${tom === id ? "bg-surface shadow-sm" : "text-muted"}`}
            >
              {nome}
            </button>
          ))}
        </div>
        <Resultado texto={legenda(ctx, { temaId, tom })} />
      </Card>
    </div>
  );
}
