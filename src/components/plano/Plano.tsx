"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check, Flag, ShieldCheck } from "lucide-react";
import type { Peca } from "@/lib/contexto";
import type { Segmento } from "@/lib/segmentos";
import { Card } from "../ui";

type Acao = { id: string; semana: number; titulo: string; peca: Peca["id"]; tempo: string };

function montarAcoes(s: Segmento): Acao[] {
  return [
    { id: "a1", semana: 1, titulo: "Imprimir a plaquinha do QR code e colocar no balcão", peca: "avaliacoes", tempo: "10 min" },
    { id: "a2", semana: 1, titulo: `Pedir avaliação a 10 ${s.cliente} desta semana`, peca: "avaliacoes", tempo: "15 min" },
    { id: "a3", semana: 1, titulo: "Publicar os 3 posts da semana 1", peca: "posts", tempo: "20 min" },
    { id: "a4", semana: 2, titulo: "Trocar a bio do Instagram", peca: "perfil", tempo: "5 min" },
    { id: "a5", semana: 2, titulo: "Colar a nova descrição no Google Perfil", peca: "google", tempo: "10 min" },
    { id: "a6", semana: 2, titulo: "Publicar os 3 posts da semana 2", peca: "posts", tempo: "20 min" },
    { id: "a7", semana: 3, titulo: "Subir 10 fotos novas no Google Perfil", peca: "google", tempo: "15 min" },
    { id: "a8", semana: 3, titulo: "Salvar as 4 respostas rápidas no WhatsApp", peca: "whatsapp", tempo: "5 min" },
    { id: "a9", semana: 3, titulo: "Publicar os 3 posts da semana 3", peca: "posts", tempo: "20 min" },
    { id: "a10", semana: 4, titulo: "Responder todas as avaliações antigas", peca: "avaliacoes", tempo: "20 min" },
    { id: "a11", semana: 4, titulo: `Pedir avaliação a mais 10 ${s.cliente}`, peca: "avaliacoes", tempo: "15 min" },
    { id: "a12", semana: 4, titulo: "Publicar os 3 posts da semana 4", peca: "posts", tempo: "20 min" },
  ];
}

type Props = { segmento: Segmento; qs: string; diasParaReavaliacao: number; codigo?: string; feitasIniciais?: string[] };

export function Plano({ segmento, qs, diasParaReavaliacao, codigo, feitasIniciais }: Props) {
  const acoes = montarAcoes(segmento);
  // Real: estado salvo no banco (conta para a garantia). Protótipo: começa com as 2 primeiras feitas.
  const [feitas, setFeitas] = useState<Set<string>>(new Set(codigo ? (feitasIniciais ?? []) : ["a1", "a2"]));
  const total = acoes.length;
  const pct = Math.round((feitas.size / total) * 100);
  const proxima = acoes.find((a) => !feitas.has(a.id));
  const semanaAtual = proxima?.semana ?? 4;

  function alternar(id: string) {
    const feita = !feitas.has(id);
    setFeitas((f) => {
      const n = new Set(f);
      if (feita) n.add(id);
      else n.delete(id);
      return n;
    });
    if (codigo)
      fetch("/api/plano", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ d: codigo, acao: id, feita }) }).catch(() => {});
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Plano de 30 dias</h1>
        <p className="mt-1 text-sm text-muted">Uma ação de cada vez. Em média, 15 minutos por dia útil.</p>
      </div>

      <Card className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-lg font-bold">
              <span className="tabular">{feitas.size}</span> de {total} ações feitas
            </p>
            <p className="tabular text-sm font-semibold text-brand">{pct}%</p>
          </div>
          <div className="mt-2 h-3 rounded-full bg-subtle" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do plano">
            <div className="h-3 rounded-full bg-brand transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
          {proxima ? (
            <p className="mt-3 text-sm text-muted">
              Próxima: <b className="font-semibold text-ink">{proxima.titulo}</b>
            </p>
          ) : (
            <p className="mt-3 text-sm font-semibold text-good">Plano completo. Agora é esperar a reavaliação.</p>
          )}
        </div>
        <div className="flex items-center gap-3 rounded-[var(--radius-control)] bg-subtle px-4 py-3">
          <CalendarCheck size={22} className="shrink-0 text-brand" aria-hidden />
          <div>
            <p className="text-xs text-muted">Reavaliação do seu Score</p>
            <p className="font-display text-lg font-bold">em {diasParaReavaliacao} dias</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((sem) => {
          const daSemana = acoes.filter((a) => a.semana === sem);
          const feitasSemana = daSemana.filter((a) => feitas.has(a.id)).length;
          const atual = sem === semanaAtual && proxima;
          return (
            <Card key={sem} className={`p-5 ${atual ? "border-brand" : ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-base font-bold">
                  Semana {sem}
                  {atual && <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-ink">Você está aqui</span>}
                </h2>
                <span className="tabular text-sm text-muted">
                  {feitasSemana} de {daSemana.length}
                </span>
              </div>
              <ul className="mt-3 flex flex-col divide-y divide-line">
                {daSemana.map((a) => {
                  const ok = feitas.has(a.id);
                  return (
                    <li key={a.id} className="flex items-center gap-3 py-3">
                      <button
                        type="button"
                        onClick={() => alternar(a.id)}
                        aria-pressed={ok}
                        aria-label={ok ? `Desmarcar: ${a.titulo}` : `Marcar como feita: ${a.titulo}`}
                        className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                          ok ? "border-good bg-good text-white" : "border-line hover:border-brand"
                        }`}
                      >
                        {ok && <Check size={14} strokeWidth={3} aria-hidden />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[15px] ${ok ? "text-faint line-through" : "font-medium"}`}>{a.titulo}</p>
                        <p className="text-xs text-faint">{a.tempo}</p>
                      </div>
                      {!ok && (
                        <Link href={`/painel/kit${qs}`} className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand hover:underline">
                          Abrir no kit
                          <ArrowRight size={14} aria-hidden />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}

        <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-dashed border-line p-5">
          <Flag size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="font-display font-bold">Dia 30 · reavaliação</p>
            <p className="mt-0.5 text-sm text-muted">Refazemos a análise e mostramos o antes e depois do seu Score Digital, ao lado dos mesmos concorrentes.</p>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-good" aria-hidden />
              Fez pelo menos 10 das 12 ações e o Score não subiu? A garantia devolve os R$ 97.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
