"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, XCircle } from "lucide-react";
import { etapas, linkWhatsApp, type Etapa } from "@/lib/admin-mock";
import { formatarBRL, servicos } from "@/lib/elev8";
import { Card } from "../ui";

type Props = { whatsapp: string; mensagem: string; etapaInicial: Etapa; desconto: number; idReal?: string; notasIniciais?: string };

function salvar(id: string | undefined, patch: { etapa?: string; notas?: string }) {
  if (!id) return;
  fetch("/api/admin/lead", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) }).catch(() => {});
}

/** Ações da ficha. Protótipo: o estado fica na tela; na fase 2, cada mudança é salva no lead. */
export function AcoesLead({ whatsapp, mensagem, etapaInicial, desconto, idReal, notasIniciais = "" }: Props) {
  const [etapa, setEtapa] = useState<Etapa>(etapaInicial);
  const [texto, setTexto] = useState(mensagem);
  const [nota, setNota] = useState(notasIniciais);
  const [servicoId, setServicoId] = useState("lp-estrategica");
  const [resultado, setResultado] = useState<"ganho" | "perdido" | null>(etapaInicial === "cliente" ? "ganho" : etapaInicial === "perdido" ? "perdido" : null);
  const s = servicos.find((x) => x.id === servicoId)!;
  const valor = s.preco !== undefined ? Math.round(s.preco * (1 - desconto) * 100) / 100 : undefined;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3 p-5">
        <h2 className="font-display font-bold">Falar com o lead</h2>
        <label htmlFor="msg-whats" className="text-[13px] font-semibold text-muted">
          Mensagem (ajuste se quiser)
        </label>
        <textarea
          id="msg-whats"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={5}
          className="w-full resize-y rounded-[var(--radius-control)] border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-brand"
        />
        <a
          href={linkWhatsApp(whatsapp, texto)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-good px-4 py-3 text-sm font-semibold text-white hover:brightness-110"
        >
          <MessageCircle size={17} aria-hidden />
          Abrir no WhatsApp
        </a>
      </Card>

      <Card className="flex flex-col gap-3 p-5">
        <h2 className="font-display font-bold">Etapa e anotações</h2>
        <select
          id="lead-etapa"
          aria-label="Etapa do lead"
          value={etapa}
          onChange={(e) => {
            setEtapa(e.target.value as Etapa);
            salvar(idReal, { etapa: e.target.value });
          }}
          className="w-full min-w-0 rounded-[8px] border border-line bg-surface px-3 py-2.5 text-sm"
        >
          {etapas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>
        <textarea
          id="lead-nota"
          aria-label="Anotação"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          onBlur={() => salvar(idReal, { notas: nota })}
          rows={3}
          placeholder="Ex.: prefere falar depois das 18h; sócio decide junto."
          className="w-full resize-y rounded-[var(--radius-control)] border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
        />
      </Card>

      <Card className="flex flex-col gap-3 p-5">
        <h2 className="font-display font-bold">Resultado</h2>
        {resultado ? (
          <div className={`flex items-center gap-2 rounded-[var(--radius-control)] px-3.5 py-3 text-sm font-semibold ${resultado === "ganho" ? "bg-good-soft text-good" : "bg-subtle text-muted"}`} role="status">
            {resultado === "ganho" ? <CheckCircle2 size={18} aria-hidden /> : <XCircle size={18} aria-hidden />}
            {resultado === "ganho" ? "Virou cliente Elev8" : "Marcado como perdido"}
            <button type="button" onClick={() => setResultado(null)} className="ml-auto text-xs font-semibold underline">
              Desfazer
            </button>
          </div>
        ) : (
          <>
            <select
              id="lead-servico"
              aria-label="Serviço fechado"
              value={servicoId}
              onChange={(e) => setServicoId(e.target.value)}
              className="w-full min-w-0 rounded-[8px] border border-line bg-surface px-3 py-2.5 text-sm"
            >
              {servicos.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.nome}
                </option>
              ))}
            </select>
            <p className="text-[13px] text-muted">
              {valor !== undefined
                ? `Valor com o desconto deste lead (${Math.round(desconto * 100)}%): ${formatarBRL(valor)}${s.cobranca === "mensal" ? " no 1º mês" : ""}`
                : "Serviço sob consulta: registre o valor combinado na proposta."}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => {
                setResultado("ganho");
                salvar(idReal, { etapa: "cliente" });
              }} className="flex-1 rounded-[var(--radius-control)] bg-ink px-3 py-2.5 text-sm font-semibold text-white">
                Fechou
              </button>
              <button type="button" onClick={() => {
                setResultado("perdido");
                salvar(idReal, { etapa: "perdido" });
              }} className="flex-1 rounded-[var(--radius-control)] border border-line px-3 py-2.5 text-sm font-semibold">
                Perdido
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
