"use client";

import { useState } from "react";
import { Activity, Bell, CalendarDays, CheckCircle2, LineChart, Sparkles } from "lucide-react";
import { PRODUTO, formatarBRL } from "@/lib/elev8";
import { Card } from "./ui";

/*
  Score Vivo: acompanhamento mensal depois dos 30 dias.
  Aparece para quem comprou o kit, como continuação natural da reavaliação. A cobrança só começa depois
  da reavaliação: a pessoa vê o resultado antes de decidir (sem pressão e sem risco).
*/
export function ScoreVivo({ concorrente, compacto = false }: { concorrente: string; compacto?: boolean }) {
  const [quero, setQuero] = useState(false);
  const itens = [
    { icone: LineChart, texto: "Reavaliação todo mês, com a evolução do seu Score em gráfico" },
    { icone: Bell, texto: `Aviso quando um concorrente muda, como “${concorrente} ganhou 15 avaliações”` },
    { icone: CalendarDays, texto: "Posts novos todo mês, com as datas que movem o seu setor" },
    { icone: Sparkles, texto: "O teste das IAs refeito todo mês" },
  ];

  return (
    <Card className="overflow-hidden">
      <div className={`grid gap-5 p-5 ${compacto ? "" : "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:p-6"}`}>
        <div>
          <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">
            <Activity size={14} aria-hidden />
            Depois dos 30 dias
          </p>
          <h2 className="mt-1 font-display text-lg font-bold">Score Vivo: seu marketing acompanhado todo mês</h2>
          <p className="mt-1 text-sm text-muted">O seu marketing não para no dia 30, e o dos concorrentes também não.</p>
          <ul className="mt-3 flex flex-col gap-2">
            {itens.map((i) => (
              <li key={i.texto} className="flex items-start gap-2.5 text-sm">
                <i.icone size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                {i.texto}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-[var(--radius-control)] bg-subtle p-4">
          <p>
            <span className="font-display text-3xl font-extrabold">{formatarBRL(PRODUTO.scoreVivoMensal)}</span>
            <span className="text-sm text-muted">/mês</span>
          </p>
          <p className="text-[13px] text-muted">
            Só começa depois da reavaliação: você vê o resultado do kit antes de decidir. Cancela quando quiser, sem multa.
          </p>
          {quero ? (
            <p className="flex items-start gap-2 rounded-[8px] bg-good-soft px-3 py-2.5 text-sm text-good" role="status">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" aria-hidden />
              Anotado! No dia da reavaliação você recebe o resultado e o link para ativar.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setQuero(true)}
              className="rounded-[var(--radius-control)] bg-ink px-4 py-3 text-[15px] font-semibold text-white hover:bg-ink/90"
            >
              Quero continuar acompanhando
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
