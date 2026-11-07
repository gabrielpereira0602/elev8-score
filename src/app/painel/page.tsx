import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ScoreCard } from "@/components/ScoreCard";
import { NextAction } from "@/components/NextAction";
import { IACheck } from "@/components/IACheck";
import { GiftAction } from "@/components/GiftAction";
import { StageCard } from "@/components/StageCard";
import { Offer } from "@/components/Offer";
import { PlanProgress } from "@/components/BottomStrip";
import { diagnostico as d, kitItens } from "@/lib/mock";

type Props = { searchParams: Promise<{ plano?: string }> };

/*
  Ordem da versão grátis (valor antes do preço):
  1. o problema (Score Digital contra concorrentes)  2. o que só o Elev8 Score mostra (teste das IAs)
  3. um presente real (primeira peça do kit)  4. onde perde pontos e o que resolve  5. só então, a oferta.
  Versão paga: como estou, o que faço agora, onde perco, estou avançando.
*/
export default async function VisaoGeral({ searchParams }: Props) {
  const pago = (await searchParams).plano === "pago";

  return (
    <AppShell ativa="visao-geral" pago={pago} empresa={d.empresa} cidade={d.cidade}>
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">
              {pago ? "Como você está hoje" : "Seu Score Digital está pronto"}
            </h1>
            <p className="mt-1 text-sm text-muted">Análise de {d.dataAnalise} · comparação com os 3 concorrentes mais próximos</p>
          </div>
          <VerComo pago={pago} />
        </div>

        <div className="grid gap-4 md:gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScoreCard nota={d.nota} ranking={d.ranking} busca={d.busca} data={d.dataAnalise} />
          </div>
          <div className="lg:col-span-5">
            {pago ? (
              <NextAction acao={d.proximaAcao} />
            ) : (
              <IACheck pergunta={d.ia.pergunta} respostas={d.ia.respostas} data={d.dataAnalise} />
            )}
          </div>
        </div>

        {!pago && <GiftAction titulo={d.presente.titulo} motivo={d.presente.motivo} mensagem={d.presente.mensagem} />}

        <div>
          <h2 className="mb-3 mt-2 font-display text-lg font-bold">Onde você perde pontos</h2>
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {d.etapas.map((e) => (
              <StageCard key={e.chave} etapa={e} mostrarSolucao={!pago} />
            ))}
          </div>
        </div>

        {pago ? (
          <PlanProgress feitas={d.plano.feitas} total={d.plano.total} dias={d.plano.diasParaReavaliacao} />
        ) : (
          <Offer nota={d.nota} potencial={d.potencialComKit} itens={kitItens} />
        )}
      </div>
    </AppShell>
  );
}

function VerComo({ pago }: { pago: boolean }) {
  const base = "rounded-[8px] px-3 py-1.5 text-[13px] font-semibold transition-colors";
  return (
    <div className="flex items-center gap-2" aria-label="Alternar visualização do protótipo">
      <span className="text-xs font-medium uppercase tracking-wide text-faint">Protótipo</span>
      <div className="flex rounded-[10px] border border-line bg-surface p-1">
        <Link href="/painel" className={`${base} ${!pago ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
          Grátis
        </Link>
        <Link href="/painel?plano=pago" className={`${base} ${pago ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
          Pago
        </Link>
      </div>
    </div>
  );
}
