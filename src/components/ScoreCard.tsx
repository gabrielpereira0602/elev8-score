"use client";

import { useEffect, useState } from "react";
import type { Concorrente } from "@/lib/mock";
import { Card, Origem, Rotulo } from "./ui";

function useContagem(alvo: number, duracao = 900) {
  // Começa no valor real: sem JavaScript, ou se a animação falhar, a nota certa continua na tela.
  const [valor, setValor] = useState(alvo);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValor(alvo);
      return;
    }
    let raf = 0;
    const inicio = performance.now();
    const passo = (t: number) => {
      const p = Math.min(1, (t - inicio) / duracao);
      setValor(Math.round(alvo * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [alvo, duracao]);
  return valor;
}

type Props = { nota: number; ranking: Concorrente[]; busca: string; data: string };

export function ScoreCard({ nota, ranking, busca, data }: Props) {
  const valor = useContagem(nota);
  const posicao = ranking.findIndex((r) => r.voce) + 1;

  return (
    <Card className="flex flex-col gap-5 p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <Rotulo>Sua Nota Radar</Rotulo>
          <p className="mt-1 font-display leading-none" aria-label={`${nota} de 100`}>
            <span className="tabular text-[64px] font-extrabold tracking-tight">{valor}</span>
            <span className="ml-1 text-xl font-semibold text-faint">/100</span>
          </p>
        </div>
        <p className="max-w-[16rem] pb-1 text-[15px] leading-snug text-muted">
          Você está em <b className="font-semibold text-ink">{posicao}º de {ranking.length}</b> na busca{" "}
          <span className="text-ink">“{busca}”</span>.
        </p>
      </div>

      <ul className="flex flex-col gap-3" aria-label="Nota Radar comparada aos concorrentes">
        {ranking.map((r) => (
          <li key={r.nome} className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_2rem] items-center gap-3 text-sm">
            <span className={`truncate ${r.voce ? "font-semibold text-brand" : "text-ink"}`}>{r.nome}</span>
            <span className="h-2.5 rounded-full bg-subtle">
              <span
                className={`block h-2.5 rounded-full transition-[width] duration-700 ease-out ${r.voce ? "bg-brand" : "bg-rival"}`}
                style={{ width: `${r.nota}%` }}
              />
            </span>
            <span className={`tabular text-right font-semibold ${r.voce ? "text-brand" : "text-ink"}`}>{r.nota}</span>
          </li>
        ))}
      </ul>

      <Origem tipo="Observado">Google Maps e PageSpeed, {data}</Origem>
    </Card>
  );
}
