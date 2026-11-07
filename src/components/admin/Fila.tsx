"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, MessageCircle, Undo2 } from "lucide-react";
import { linkWhatsApp, temperatura, type ItemFila } from "@/lib/admin-mock";
import { segmentos } from "@/lib/segmentos";
import { Card } from "../ui";
import { TempBadge } from "./AdminShell";

export function Fila({ itens }: { itens: ItemFila[] }) {
  // Protótipo: o "enviado" fica só nesta tela. Na fase 2, é salvo no lead e some da fila de verdade.
  const [enviados, setEnviados] = useState<Set<string>>(new Set());
  const pendentes = itens.filter((i) => !enviados.has(i.lead.id)).length;

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-bold">Fila de hoje</h2>
        <p className="text-sm text-muted">
          <b className="tabular font-semibold text-ink">{pendentes}</b> {pendentes === 1 ? "contato pendente" : "contatos pendentes"} · o resto é coberto pelos e-mails automáticos
        </p>
      </div>

      <ul className="mt-4 flex flex-col divide-y divide-line">
        {itens.map(({ lead, motivo, mensagem }) => {
          const feito = enviados.has(lead.id);
          return (
            <li key={lead.id} className={`grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${feito ? "opacity-50" : ""}`}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/lead/${lead.id}`} className="font-semibold hover:text-brand hover:underline">
                    {lead.empresa}
                  </Link>
                  <TempBadge t={temperatura(lead)} />
                  <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand-ink">{motivo}</span>
                </div>
                <p className="mt-1 text-[13px] text-muted">
                  {lead.nome} · {segmentos[lead.segmento].nome} · {lead.cidade} · Score {lead.score}
                </p>
                <p className="mt-2 line-clamp-2 rounded-[8px] bg-subtle px-3 py-2 text-[13px] text-muted">{mensagem}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {feito ? (
                  <button
                    type="button"
                    onClick={() => setEnviados((s) => { const n = new Set(s); n.delete(lead.id); return n; })}
                    className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-line px-3.5 py-2 text-sm font-semibold"
                  >
                    <Undo2 size={15} aria-hidden />
                    Desfazer
                  </button>
                ) : (
                  <>
                    <a
                      href={linkWhatsApp(lead.whatsapp, mensagem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-good px-3.5 py-2 text-sm font-semibold text-white hover:brightness-110"
                    >
                      <MessageCircle size={15} aria-hidden />
                      Abrir WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setEnviados((s) => new Set(s).add(lead.id))}
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-line px-3.5 py-2 text-sm font-semibold hover:border-faint"
                    >
                      <Check size={15} aria-hidden />
                      Enviado
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
