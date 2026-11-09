import { AppShell, montarQs } from "@/components/AppShell";
import { ScoreCard } from "@/components/ScoreCard";
import { NextAction } from "@/components/NextAction";
import { IACheck } from "@/components/IACheck";
import { GiftAction } from "@/components/GiftAction";
import { StageCard } from "@/components/StageCard";
import { Offer } from "@/components/Offer";
import { PlanProgress } from "@/components/BottomStrip";
import { StickyCTA } from "@/components/StickyCTA";
import { kitItens } from "@/lib/mock";
import { contexto } from "@/lib/contexto";
import { ConsultorCard } from "@/components/ConsultorCard";
import { acessoAte } from "@/lib/elev8";

type Props = { searchParams: Promise<{ plano?: string; nicho?: string }> };

/*
  Ordem da versão grátis (valor antes do preço):
  1. o problema (Score Digital contra concorrentes)  2. o que só o Elev8 Score mostra (teste das IAs)
  3. um presente real (primeira peça do kit)  4. onde perde pontos e o que resolve  5. só então, a oferta.
  Versão paga: como estou, o que faço agora, onde perco, estou avançando.
*/
export default async function VisaoGeral({ searchParams }: Props) {
  const sp = await searchParams;
  const pago = sp.plano === "pago";
  const ctx = contexto(sp.nicho);
  const d = ctx.diagnostico;
  const nicho = ctx.empresa.segmento;

  return (
    <AppShell ativa="visao-geral" pago={pago} nicho={nicho} empresa={d.empresa} cidade={d.cidade}>
      <div className="flex flex-col gap-4 md:gap-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">
            {pago ? "Como você está hoje" : "Seu Score Digital está pronto"}
          </h1>
          <p className="mt-1 text-sm text-muted">Análise de {d.dataAnalise} · comparação com os 3 concorrentes mais próximos</p>
        </div>

        <div className="grid gap-4 md:gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScoreCard nota={d.nota} ranking={d.ranking} busca={d.busca} data={d.dataAnalise} />
          </div>
          <div className="lg:col-span-5">
            {pago ? <NextAction acao={d.proximaAcao} /> : <IACheck pergunta={d.ia.pergunta} respostas={d.ia.respostas} data={d.dataAnalise} />}
          </div>
        </div>

        {pago && (
          <ConsultorCard
            qs={montarQs(true, nicho)}
            ativoAte={acessoAte(new Date(new Date(d.dataISO).getTime() - (30 - d.plano.diasParaReavaliacao) * 864e5))}
            perguntas={["O que eu faço primeiro esta semana?", ctx.segmento.consultor.pergunta]}
          />
        )}

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
          <div id="oferta" className="scroll-mt-4">
            <Offer
              empresa={d.empresa}
              nota={d.nota}
              potencial={d.potencialComKit}
              ranking={d.ranking}
              itens={kitItens}
              bioPrevia={ctx.kit.bios[0].texto}
              hrefLiberar={montarQs(true, nicho)}
              consultor={{ pergunta: ctx.segmento.consultor.pergunta, setor: ctx.segmento.nome.toLowerCase() }}
            />
          </div>
        )}
      </div>
      {!pago && <StickyCTA />}
    </AppShell>
  );
}
