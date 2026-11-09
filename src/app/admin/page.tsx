import { AdminShell } from "@/components/admin/AdminShell";
import { Fila } from "@/components/admin/Fila";
import { ListaLeads } from "@/components/admin/ListaLeads";
import { Card } from "@/components/ui";
import { filaDeHoje, leads, numeros } from "@/lib/admin-mock";
import { formatarBRL } from "@/lib/elev8";

export const metadata = { title: "Admin · Elev8 Score" };

export default function Admin() {
  const n = numeros(leads);
  const fila = filaDeHoje(leads);
  const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

  const cartoes = [
    { rotulo: "Diagnósticos grátis", valor: String(n.diagnosticos), detalhe: "leads captados" },
    { rotulo: "Compraram o kit", valor: String(n.compras), detalhe: `${formatarBRL(n.receitaKit)} · ${pct(n.compras, n.diagnosticos)}% dos diagnósticos` },
    { rotulo: "Pediram proposta", valor: String(n.propostas), detalhe: `${pct(n.propostas, n.diagnosticos)}% dos diagnósticos` },
    { rotulo: "Viraram clientes", valor: String(n.clientes), detalhe: `${formatarBRL(n.receitaServicos)} em serviços` },
    { rotulo: "Score Vivo", valor: String(n.assinantesScoreVivo), detalhe: `${formatarBRL(n.mrrScoreVivo)}/mês recorrente` },
  ];

  const funil = [
    { etapa: "Diagnóstico grátis", qtd: n.diagnosticos },
    { etapa: "Comprou o kit", qtd: n.compras },
    { etapa: "Pediu proposta", qtd: n.propostas },
    { etapa: "Cliente Elev8", qtd: n.clientes },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Visão geral</h1>
          <p className="mt-1 text-sm text-muted">Últimos 30 dias</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {cartoes.map((c) => (
            <Card key={c.rotulo} className="p-4 md:p-5">
              <p className="text-[13px] font-medium text-muted">{c.rotulo}</p>
              <p className="tabular mt-1 font-display text-3xl font-extrabold tracking-tight">{c.valor}</p>
              <p className="mt-1 text-[12.5px] text-muted">{c.detalhe}</p>
            </Card>
          ))}
        </div>

        <Card className="p-5 md:p-6">
          <h2 className="font-display text-lg font-bold">Funil</h2>
          <p className="mt-0.5 text-sm text-muted">Quantos leads passam de uma etapa para a outra. O maior tombo é onde vale melhorar primeiro.</p>
          <ol className="mt-4 flex flex-col gap-3">
            {funil.map((f, i) => {
              const anterior = i === 0 ? f.qtd : funil[i - 1].qtd;
              return (
                <li key={f.etapa} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto] items-center gap-3 text-sm md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_7rem]">
                  <span className="font-medium">{f.etapa}</span>
                  <span className="h-6 rounded-[6px] bg-subtle">
                    <span className="flex h-6 items-center justify-end rounded-[6px] bg-brand pr-2 text-xs font-semibold text-white" style={{ width: `${Math.max(pct(f.qtd, funil[0].qtd), 6)}%` }}>
                      <span className="tabular">{f.qtd}</span>
                    </span>
                  </span>
                  <span className="tabular text-right text-[12.5px] text-muted">{i === 0 ? "100%" : `${pct(f.qtd, anterior)}% da etapa anterior`}</span>
                </li>
              );
            })}
          </ol>
        </Card>

        <Fila itens={fila} />
        <ListaLeads leads={leads} />
      </div>
    </AdminShell>
  );
}
