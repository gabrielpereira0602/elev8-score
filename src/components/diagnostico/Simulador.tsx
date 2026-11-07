"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Package, RotateCcw, Sparkles } from "lucide-react";
import { aplicarKit, calcularScore, type Lider, type Metricas } from "@/lib/score";
import { faixaScore, type Concorrente } from "@/lib/mock";
import { Card, Origem, StatusBadge } from "../ui";

type Props = { hoje: Metricas; lider: Lider; ranking: Concorrente[]; pago: boolean };

type Controle = {
  chave: keyof Metricas;
  rotulo: string;
  min: number;
  max: number;
  passo: number;
  sufixo?: string;
};

const doKit: Controle[] = [
  { chave: "avaliacoes", rotulo: "Avaliações no Google", min: 0, max: 250, passo: 1 },
  { chave: "fotos", rotulo: "Fotos no perfil do Google", min: 0, max: 150, passo: 1 },
  { chave: "perfilPreenchido", rotulo: "Perfil do Google preenchido", min: 0, max: 100, passo: 5, sufixo: "%" },
  { chave: "postsPorSemana", rotulo: "Posts por semana", min: 0, max: 7, passo: 1 },
  { chave: "respostasAvaliacoes", rotulo: "Avaliações respondidas", min: 0, max: 100, passo: 10, sufixo: "%" },
];

const doSite: Controle[] = [
  { chave: "velocidadeSite", rotulo: "Velocidade do site no celular", min: 0, max: 100, passo: 1, sufixo: "/100" },
  { chave: "siteClaro", rotulo: "Clareza do site", min: 0, max: 100, passo: 10, sufixo: "/100" },
];

export function Simulador({ hoje, lider, ranking, pago }: Props) {
  const [m, setM] = useState<Metricas>(hoje);
  const base = useMemo(() => calcularScore(hoje, lider), [hoje, lider]);
  const sim = calcularScore(m, lider);
  const delta = sim.total - base.total;
  const faixa = faixaScore(sim.total);

  const rivais = ranking.filter((r) => !r.voce);
  const novoRanking = [...rivais, { nome: "Você", nota: sim.total, voce: true }].sort((a, b) => b.nota - a.nota);
  const posicao = novoRanking.findIndex((r) => r.voce) + 1;
  const passou = rivais.filter((r) => r.nota < sim.total && r.nota >= base.total);
  const mexeuNoSite = m.velocidadeSite !== hoje.velocidadeSite || m.siteClaro !== hoje.siteClaro;

  const atualizar = (chave: keyof Metricas, valor: number | boolean) => setM((x) => ({ ...x, [chave]: valor }));

  return (
    <Card className="overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6 p-5 md:p-7">
          <div>
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-brand">
              <Sparkles size={15} aria-hidden />
              Simulador
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">E se você mudar isto?</h2>
            <p className="mt-1 text-sm text-muted">Mexa nos controles e veja seu Score Digital e sua posição mudarem na hora.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setM(aplicarKit(hoje))}
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              <Package size={16} aria-hidden />
              Ver com o kit aplicado
            </button>
            <button
              type="button"
              onClick={() => setM(hoje)}
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-line px-4 py-2.5 text-sm font-semibold hover:border-faint"
            >
              <RotateCcw size={15} aria-hidden />
              Voltar para hoje
            </button>
          </div>

          <Grupo
            icone={<Package size={16} aria-hidden />}
            titulo="O kit ajuda com isto"
            controles={doKit}
            m={m}
            hoje={hoje}
            atualizar={atualizar}
            extra={
              <label htmlFor="sim-bio" className="flex cursor-pointer items-center justify-between gap-3 text-sm">
                <span className="font-medium">Bio do Instagram explica o que você faz</span>
                <input
                  id="sim-bio"
                  type="checkbox"
                  checked={m.bioClara}
                  onChange={(e) => atualizar("bioClara", e.target.checked)}
                  className="size-5 cursor-pointer accent-[var(--brand)]"
                />
              </label>
            }
          />

          <Grupo
            icone={<Globe size={16} aria-hidden />}
            titulo="Isto depende de um site melhor"
            selo="Serviço Elev8"
            controles={doSite}
            m={m}
            hoje={hoje}
            atualizar={atualizar}
          />
        </div>

        <aside className="flex flex-col gap-5 border-t border-line bg-subtle/60 p-5 md:p-7 lg:border-l lg:border-t-0">
          <div className="lg:sticky lg:top-6 flex flex-col gap-5">
            <div>
              <p className="text-[13px] font-semibold text-muted">Score Digital simulado</p>
              <div className="mt-1 flex items-end gap-3">
                <span className="tabular font-display text-[56px] font-extrabold leading-none tracking-tight">{sim.total}</span>
                <span className={`tabular mb-1.5 text-lg font-bold ${delta > 0 ? "text-good" : delta < 0 ? "text-bad" : "text-faint"}`}>
                  {delta > 0 ? `+${delta}` : delta === 0 ? "±0" : delta}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={faixa.tom} texto={faixa.texto} />
                <span className="text-sm text-muted">
                  {posicao}º de {novoRanking.length} na busca
                </span>
              </div>
              {passou.length > 0 && (
                <p className="mt-2 text-sm font-medium text-good">Você passaria {passou.map((p) => p.nome).join(" e ")}.</p>
              )}
            </div>

            <ul className="flex flex-col gap-2" aria-label="Ranking simulado">
              {novoRanking.map((r) => (
                <li key={r.nome} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_1.75rem] items-center gap-2 text-[13px]">
                  <span className={`truncate ${r.voce ? "font-semibold text-brand" : ""}`}>{r.nome}</span>
                  <span className="h-2 rounded-full bg-surface">
                    <span className={`block h-2 rounded-full transition-[width] duration-300 ${r.voce ? "bg-brand" : "bg-rival"}`} style={{ width: `${r.nota}%` }} />
                  </span>
                  <span className={`tabular text-right font-semibold ${r.voce ? "text-brand" : ""}`}>{r.nota}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-3 gap-2 text-center">
              {(
                [
                  ["Encontrado", sim.encontrado, base.encontrado],
                  ["Entendido", sim.entendido, base.entendido],
                  ["Escolhido", sim.escolhido, base.escolhido],
                ] as const
              ).map(([nome, v, b]) => (
                <div key={nome} className="rounded-[10px] bg-surface px-2 py-2.5">
                  <p className="text-[11.5px] text-muted">{nome}</p>
                  <p className="tabular font-display text-xl font-extrabold">{v}</p>
                  <p className={`tabular text-[11.5px] font-semibold ${v > b ? "text-good" : "text-faint"}`}>{v > b ? `+${v - b}` : "–"}</p>
                </div>
              ))}
            </div>

            {mexeuNoSite ? (
              <Link
                href={`/painel/elev8${pago ? "?plano=pago" : ""}`}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] bg-night px-4 py-3 text-sm text-white"
              >
                <span>
                  <b className="font-semibold">Isso pede um site novo.</b> A Elev8 faz.
                </span>
                <ArrowRight size={16} className="shrink-0" aria-hidden />
              </Link>
            ) : (
              <Link
                href={pago ? "/painel/kit?plano=pago" : "/painel#oferta"}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                {pago ? "Abrir meu kit" : "Liberar meu kit por R$ 97"}
                <ArrowRight size={16} className="shrink-0" aria-hidden />
              </Link>
            )}

            <Origem tipo="Estimativa">Simulação pela fórmula do Score Digital. Os concorrentes ficam com a nota de hoje.</Origem>
          </div>
        </aside>
      </div>
    </Card>
  );
}

type GrupoProps = {
  icone: React.ReactNode;
  titulo: string;
  selo?: string;
  controles: Controle[];
  m: Metricas;
  hoje: Metricas;
  atualizar: (chave: keyof Metricas, valor: number) => void;
  extra?: React.ReactNode;
};

function Grupo({ icone, titulo, selo, controles, m, hoje, atualizar, extra }: GrupoProps) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-[var(--radius-control)] border border-line p-4">
      <legend className="flex items-center gap-2 px-1 text-sm font-semibold">
        <span className="text-brand">{icone}</span>
        {titulo}
        {selo && <span className="rounded-full bg-night px-2 py-0.5 text-[11px] font-semibold text-white">{selo}</span>}
      </legend>
      {controles.map((c) => {
        const valor = m[c.chave] as number;
        const original = hoje[c.chave] as number;
        const id = `sim-${c.chave}`;
        return (
          <div key={c.chave} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <label htmlFor={id} className="font-medium">
                {c.rotulo}
              </label>
              <span className="tabular shrink-0 text-muted">
                <b className="font-semibold text-ink">
                  {valor}
                  {c.sufixo}
                </b>
                {valor !== original && (
                  <span className="ml-1.5 text-xs">
                    hoje: {original}
                    {c.sufixo}
                  </span>
                )}
              </span>
            </div>
            <input
              id={id}
              type="range"
              min={c.min}
              max={c.max}
              step={c.passo}
              value={valor}
              onChange={(e) => atualizar(c.chave, Number(e.target.value))}
              className="w-full accent-[var(--brand)]"
            />
          </div>
        );
      })}
      {extra}
    </fieldset>
  );
}
