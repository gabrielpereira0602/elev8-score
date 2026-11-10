"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import type { Negocio } from "@/lib/busca-mock";
import type { SegmentoId } from "@/lib/segmentos";

const etapasDemo = [
  "Encontrando sua empresa no Google Maps",
  "Comparando com os 3 concorrentes",
  "Testando seu site no celular",
  "Perguntando ao ChatGPT e ao Gemini",
  "Calculando seu Score Digital",
];
const etapasReais = [
  "Encontrando sua empresa no Google Maps",
  "Comparando com os concorrentes da mesma busca",
  "Testando seu site no celular",
  "Lendo seu site e as suas respostas",
  "Calculando seu Score Digital",
];

// Posições dos pontos no radar (centro = 120,120). O ponto azul é a empresa; os cinza, concorrentes.
const pontos = [
  { x: 152, y: 78, voce: false },
  { x: 84, y: 92, voce: false },
  { x: 98, y: 168, voce: false },
  { x: 186, y: 170, voce: true },
];

type Props = {
  negocio: Negocio;
  segmento: SegmentoId;
  /** Diagnóstico real: devolve o endereço do painel. Sem ele, é o protótipo. */
  pedido?: () => Promise<string>;
  onVoltar?: () => void;
};

export function Analisando({ negocio, segmento, pedido, onVoltar }: Props) {
  const router = useRouter();
  const etapas = pedido ? etapasReais : etapasDemo;
  const [feitas, setFeitas] = useState(0);
  const [destino, setDestino] = useState<string | null>(pedido ? null : segmento === "estetica" ? "/painel" : `/painel?nicho=${segmento}`);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!pedido) return;
    let vivo = true;
    setErro("");
    pedido()
      .then((url) => vivo && setDestino(url))
      .catch((e: Error) => vivo && setErro(e.message || "Não conseguimos terminar a análise agora."));
    return () => {
      vivo = false;
    };
  }, [pedido, tentativa]);

  useEffect(() => {
    // Avança uma etapa a cada ~1,3 s; a última só termina quando a análise real voltar.
    const id = window.setInterval(() => setFeitas((f) => Math.min(f + 1, destino ? etapas.length : etapas.length - 1)), 1300);
    return () => window.clearInterval(id);
  }, [destino, etapas.length]);

  useEffect(() => {
    if (feitas < etapas.length || !destino) return;
    const t = window.setTimeout(() => router.push(destino), 700);
    return () => window.clearTimeout(t);
  }, [feitas, destino, router, etapas.length]);

  if (erro)
    return (
      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] bg-night p-6 text-center text-white md:p-8" role="alert">
        <p className="font-display text-lg font-bold">Não deu para terminar agora</p>
        <p className="max-w-sm text-sm text-white/70">{erro}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setTentativa((t) => t + 1)} className="rounded-[var(--radius-control)] bg-brand px-5 py-2.5 text-sm font-semibold text-white">
            Tentar de novo
          </button>
          {onVoltar && (
            <button type="button" onClick={onVoltar} className="rounded-[var(--radius-control)] border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">
              Voltar
            </button>
          )}
        </div>
      </div>
    );

  const pontosVisiveis = Math.min(pontos.length, feitas + 1);

  return (
    <div className="flex flex-col items-center gap-6 rounded-[var(--radius-card)] bg-night p-6 text-white shadow-[0_12px_40px_-12px_rgba(5,7,13,0.45)] md:p-8" role="status" aria-live="polite">
      <svg viewBox="0 0 240 240" className="w-full max-w-[220px]" aria-hidden>
        <defs>
          <linearGradient id="varredura" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0066FF" stopOpacity="0" />
            <stop offset="1" stopColor="#0066FF" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {[110, 80, 50, 20].map((r) => (
          <circle key={r} cx="120" cy="120" r={r} fill="none" stroke="rgba(255,255,255,0.12)" />
        ))}
        <path d="M120 10V230M10 120H230" stroke="rgba(255,255,255,0.08)" />
        <g className="origin-[120px_120px] animate-[spin_3.2s_linear_infinite] motion-reduce:animate-none">
          <path d="M120 120L120 10A110 110 0 0 1 198 42Z" fill="url(#varredura)" />
        </g>
        {pontos.slice(0, pontosVisiveis).map((p) => (
          <g key={`${p.x}-${p.y}`} className="animate-[aparecer_0.5s_ease-out]" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {p.voce && <circle cx={p.x} cy={p.y} r="12" fill="#0066FF" opacity="0.25" />}
            <circle cx={p.x} cy={p.y} r={p.voce ? 6 : 4.5} fill={p.voce ? "#0066FF" : "#A9B1C2"} />
          </g>
        ))}
      </svg>

      <div className="text-center">
        <p className="text-sm text-white/60">Analisando</p>
        <p className="font-display text-xl font-bold">{negocio.nome}</p>
        <p className="mt-1 text-sm text-white/60">Leva menos de 1 minuto.</p>
      </div>

      <ol className="flex w-full max-w-sm flex-col gap-2.5">
        {etapas.map((e, i) => {
          const feita = i < feitas;
          const atual = i === feitas;
          return (
            <li key={e} className={`flex items-center gap-3 text-sm transition-colors ${feita ? "text-white" : atual ? "text-white/85" : "text-white/35"}`}>
              <span className={`grid size-5 shrink-0 place-items-center rounded-full ${feita ? "bg-brand" : "border border-white/25"}`}>
                {feita ? (
                  <Check size={12} strokeWidth={3} aria-hidden />
                ) : atual ? (
                  <Loader2 size={12} className="animate-spin" aria-hidden />
                ) : null}
              </span>
              {e}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
