"use client";

import { useEffect, useId, useState } from "react";
import { CircleHelp, X } from "lucide-react";
import { faixaScore, pesos, type Concorrente } from "@/lib/mock";
import { Card, Origem, StatusBadge } from "./ui";

function useContagem(alvo: number, duracao = 900) {
  // Começa no valor real: sem JavaScript, ou se a animação falhar, o número certo continua na tela.
  const [valor, setValor] = useState(alvo);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let inicio: number | null = null;
    const passo = (t: number) => {
      if (inicio === null) inicio = t;
      const p = Math.min(1, Math.max(0, (t - inicio) / duracao));
      setValor(Math.round(alvo * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    setValor(0);
    raf = requestAnimationFrame(passo);
    // Se o navegador pausar a animação (aba em segundo plano, economia de bateria), mostra o valor final.
    const seguro = window.setTimeout(() => {
      cancelAnimationFrame(raf);
      setValor(alvo);
    }, duracao + 400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(seguro);
    };
  }, [alvo, duracao]);
  return valor;
}

type Props = { nota: number; ranking: Concorrente[]; busca: string; data: string };

export function ScoreCard({ nota, ranking, busca, data }: Props) {
  const valor = useContagem(nota);
  const [ajuda, setAjuda] = useState(false);
  const painelId = useId();
  const faixa = faixaScore(nota);
  const posicao = ranking.findIndex((r) => r.voce) + 1;

  return (
    <Card className="flex h-full flex-col gap-5 p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
            Seu Score Digital
            <button
              type="button"
              onClick={() => setAjuda((v) => !v)}
              aria-expanded={ajuda}
              aria-controls={painelId}
              className="rounded-full text-faint transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
              aria-label="Como o Score Digital é calculado"
            >
              <CircleHelp size={16} aria-hidden />
            </button>
          </p>
          <p className="mt-1 font-display leading-none" aria-label={`${nota} de 100`}>
            <span className="tabular text-[64px] font-extrabold tracking-tight">{valor}</span>
            <span className="ml-1 text-xl font-semibold text-faint">de 100</span>
          </p>
        </div>
        <StatusBadge status={faixa.tom} texto={faixa.texto} />
      </div>

      <p className="-mt-2 text-[15px] leading-snug text-muted">
        O quanto é fácil um cliente <b className="font-semibold text-ink">encontrar, entender e escolher</b> sua empresa na
        internet. Na busca <span className="text-ink">“{busca}”</span>, você está em{" "}
        <b className="font-semibold text-ink">
          {posicao}º de {ranking.length}
        </b>
        .
      </p>

      {ajuda && (
        <div id={painelId} className="rounded-[var(--radius-control)] bg-subtle p-4 text-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold">Como o Score Digital é calculado</p>
            <button type="button" onClick={() => setAjuda(false)} aria-label="Fechar" className="text-faint hover:text-ink">
              <X size={16} aria-hidden />
            </button>
          </div>
          <p className="mt-1 text-muted">Cada etapa vale de 0 a 100, comparando seus dados públicos com os dos concorrentes da mesma busca.</p>
          <ul className="mt-3 flex flex-col gap-2">
            {pesos.map((p) => (
              <li key={p.etapa} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2">
                <span className="tabular font-display font-bold">{p.peso}%</span>
                <span>
                  <b className="font-semibold">{p.etapa}</b> <span className="text-muted">· {p.mede}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">0 a 39: difícil de ser escolhido · 40 a 69: na disputa · 70 a 100: primeira escolha</p>
        </div>
      )}

      <ul className="flex flex-col gap-3" aria-label="Score Digital comparado aos concorrentes">
        {ranking.map((r) => (
          <li key={r.nome} className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_2rem] items-center gap-3 text-sm">
            <span className={`truncate ${r.voce ? "font-semibold text-brand" : "text-ink"}`}>{r.nome}</span>
            <span className="h-2.5 rounded-full bg-subtle">
              <span className={`block h-2.5 rounded-full ${r.voce ? "bg-brand" : "bg-rival"}`} style={{ width: `${r.nota}%` }} />
            </span>
            <span className={`tabular text-right font-semibold ${r.voce ? "text-brand" : "text-ink"}`}>{r.nota}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Origem tipo="Observado">Google Maps e PageSpeed, {data}</Origem>
      </div>
    </Card>
  );
}
