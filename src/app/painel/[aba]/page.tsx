import { notFound } from "next/navigation";
import { AppShell, montarQs, type Aba } from "@/components/AppShell";
import { TabLocked } from "@/components/BottomStrip";
import { KitView } from "@/components/kit/KitView";
import { KitLocked } from "@/components/kit/KitLocked";
import { Simulador } from "@/components/diagnostico/Simulador";
import { Comparativo } from "@/components/diagnostico/Comparativo";
import { Plano } from "@/components/plano/Plano";
import { ComElev8 } from "@/components/elev8/ComElev8";
import { Card } from "@/components/ui";
import { liderBusca, metricasHoje } from "@/lib/mock";
import { contexto } from "@/lib/contexto";
import { recomendar } from "@/lib/recomendacoes";
import { descontoAtivo, formatarData } from "@/lib/elev8";
import { Assistente } from "@/components/assistente/Assistente";
import { ConsultorLocked } from "@/components/assistente/ConsultorLocked";
import { sugestoesPara } from "@/lib/assistente";

const validas: Aba[] = ["diagnostico", "kit", "plano", "assistente", "elev8"];
const pagas: Aba[] = ["kit", "plano", "assistente"];

type Props = { params: Promise<{ aba: string }>; searchParams: Promise<{ plano?: string; nicho?: string; q?: string }> };

export default async function AbaPage({ params, searchParams }: Props) {
  const { aba } = await params;
  if (!validas.includes(aba as Aba)) notFound();
  const sp = await searchParams;
  const pago = sp.plano === "pago";
  const ctx = contexto(sp.nicho);
  const d = ctx.diagnostico;
  const nicho = ctx.empresa.segmento;
  const qs = montarQs(pago, nicho);
  const bloqueada = pagas.includes(aba as Aba) && !pago;

  let conteudo: React.ReactNode;
  if (aba === "diagnostico")
    conteudo = (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Diagnóstico completo</h1>
          <p className="mt-1 text-sm text-muted">
            Seu Score Digital hoje é <b className="font-semibold text-ink">{d.nota}</b>. Simule o que muda e veja todos os números que entram na conta.
          </p>
        </div>
        <Simulador hoje={metricasHoje} lider={liderBusca} ranking={d.ranking} pago={pago} qs={qs} />
        <Comparativo data={d.dataAnalise} concorrentes={ctx.empresa.concorrentes} />
      </div>
    );
  else if (aba === "kit")
    conteudo = pago ? (
      <KitView empresa={ctx.empresa} segmento={ctx.segmento} kit={ctx.kit} qs={qs} />
    ) : (
      <KitLocked empresa={d.empresa} pecas={ctx.kit.pecas} qs={qs} />
    );
  else if (aba === "plano") conteudo = pago ? <Plano segmento={ctx.segmento} qs={qs} diasParaReavaliacao={d.plano.diasParaReavaliacao} /> : <TabLocked qs={qs} />;
  else if (aba === "elev8")
  {
    const desc = descontoAtivo(new Date(d.dataISO), pago);
    conteudo = (
      <ComElev8
        empresa={d.empresa}
        recomendacoes={recomendar(metricasHoje, liderBusca, ctx.empresa, ctx.segmento)}
        pago={pago}
        desconto={desc ? { percentual: desc.percentual, motivo: desc.motivo } : null}
      />
    );
  }
  else if (aba === "assistente")
    conteudo = pago ? (
      <Assistente
        ctx={ctx}
        qs={qs}
        ativoAte={formatarData(new Date(new Date(d.dataISO).getTime() + 30 * 864e5))}
        sugestoes={sugestoesPara(ctx)}
        perguntaInicial={typeof sp.q === "string" ? sp.q.slice(0, 200) : ""}
      />
    ) : (
      <ConsultorLocked ctx={ctx} qs={qs} />
    );
  else if (bloqueada) conteudo = <TabLocked qs={qs} />;
  else
    conteudo = (
      <Card className="mx-auto max-w-md p-8 text-center">
        <h1 className="font-display text-lg font-bold">Em construção</h1>
        <p className="mt-2 text-sm text-muted">Esta parte entra na próxima etapa.</p>
      </Card>
    );

  return (
    <AppShell ativa={aba as Aba} pago={pago} nicho={nicho} empresa={d.empresa} cidade={d.cidade}>
      {conteudo}
    </AppShell>
  );
}
