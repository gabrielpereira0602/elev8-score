import { Handshake } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CopyButton } from "@/components/CopyButton";
import { Card } from "@/components/ui";
import { formatarBRL } from "@/lib/elev8";
import { COMISSAO, parceiros, resultadoParceiro } from "@/lib/parceiros";
import { SITE } from "@/lib/emails";

export const metadata = { title: "Parceiros · Admin · Elev8 Score" };

export default function Parceiros() {
  return (
    <AdminShell ativa="parceiros">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Parceiros</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted">
            Quem já tem pequenos negócios na carteira (contadores, fornecedores, associações) indica o Elev8 Score com um link próprio. Quem entra pelo link
            vê o nome do parceiro, e cada lead fica marcado com a origem.
          </p>
        </div>

        <Card className="flex items-start gap-3 p-5">
          <Handshake size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
          <div className="text-sm">
            <p className="font-semibold">Comissão (proposta inicial, ajuste por parceiro)</p>
            <p className="mt-1 text-muted">
              {Math.round(COMISSAO.kit * 100)}% de cada kit vendido e {Math.round(COMISSAO.servico * 100)}% do primeiro pagamento de serviços da Elev8 que
              vierem do link. O parceiro oferece um diagnóstico grátis aos clientes dele e ainda ganha por isso.
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
          {parceiros.map((p) => {
            const r = resultadoParceiro(p);
            const link = `${SITE}/?parceiro=${p.codigo}`;
            return (
              <Card key={p.codigo} className="flex flex-col gap-3 p-5">
                <div>
                  <h2 className="font-display text-base font-bold">{p.nome}</h2>
                  <p className="text-[13px] text-muted">
                    {p.tipo} · desde {p.desde}
                  </p>
                  <p className="text-[13px] text-muted">{p.contato}</p>
                </div>
                <dl className="grid grid-cols-3 gap-2 text-center">
                  {[
                    ["Leads", r.leads],
                    ["Kits", r.kits],
                    ["Clientes", r.clientes],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-[8px] bg-subtle py-2">
                      <dt className="text-xs text-muted">{k}</dt>
                      <dd className="tabular font-display text-xl font-extrabold">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-sm">
                  Comissão a pagar: <b className="font-semibold">{formatarBRL(r.comissao)}</b>
                </p>
                <div className="mt-auto flex flex-col gap-2 rounded-[8px] border border-line p-3">
                  <p className="break-all text-[13px] text-muted">{link}</p>
                  <div className="flex flex-wrap gap-2">
                    <CopyButton texto={link} rotulo="Copiar link" />
                    <a href={`/?parceiro=${p.codigo}`} target="_blank" className="inline-flex items-center rounded-[8px] border border-line px-3 py-1.5 text-[13px] font-semibold hover:border-brand hover:text-brand">
                      Ver como chega
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <p className="text-xs text-faint">Protótipo: parceiros e números de exemplo. Na fase 2, você cadastra parceiros aqui e os números vêm do banco.</p>
      </div>
    </AdminShell>
  );
}
