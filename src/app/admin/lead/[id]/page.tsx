import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { AdminShell, TempBadge } from "@/components/admin/AdminShell";
import { AcoesLead } from "@/components/admin/AcoesLead";
import { CopyButton } from "@/components/CopyButton";
import { Card, StatusBadge } from "@/components/ui";
import { etapas, filaDeHoje, leads, temperatura } from "@/lib/admin-mock";
import { descontoAtivo } from "@/lib/elev8";
import { faixaScore } from "@/lib/mock";
import { segmentos } from "@/lib/segmentos";

type Props = { params: Promise<{ id: string }> };

export default async function FichaLead({ params }: Props) {
  const { id } = await params;
  const l = leads.find((x) => x.id === id);
  if (!l) notFound();

  const s = segmentos[l.segmento];
  const faixa = faixaScore(l.score);
  const dataDiag = new Date(Date.now() - l.diasDesdeDiagnostico * 864e5);
  const desconto = descontoAtivo(dataDiag, l.comprouKit);
  const itemFila = filaDeHoje([l])[0];
  const primeiro = l.nome.split(" ")[0];
  const mensagem = itemFila?.mensagem ?? `Oi, ${primeiro}! Aqui é o Gabriel, da Elev8. Estou com o diagnóstico de ${l.empresa} aqui. Posso te ajudar com alguma coisa?`;
  const fone = l.whatsapp.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");

  return (
    <AdminShell>
      <div className="flex flex-col gap-5">
        <Link href="/admin" className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={15} aria-hidden />
          Voltar para os leads
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">{l.empresa}</h1>
              <TempBadge t={temperatura(l)} />
            </div>
            <p className="mt-1 text-sm text-muted">
              {l.nome} · {s.nome} · {l.cidade} · {etapas.find((e) => e.id === l.etapa)?.nome} · diagnóstico {l.diasDesdeDiagnostico === 0 ? "hoje" : `há ${l.diasDesdeDiagnostico} dias`}
            </p>
          </div>
          {itemFila && <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-ink">Na fila de hoje: {itemFila.motivo}</span>}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-4">
                <p className="text-[13px] text-muted">Score Digital</p>
                <p className="tabular font-display text-3xl font-extrabold">{l.score}</p>
                <StatusBadge status={faixa.tom} texto={faixa.texto} />
              </Card>
              <Card className="p-4">
                <p className="text-[13px] text-muted">Kit</p>
                <p className="tabular font-display text-3xl font-extrabold">{l.comprouKit ? `${l.acoesFeitas}/12` : "–"}</p>
                <p className="text-[13px] text-muted">{l.comprouKit ? "ações do plano feitas" : "não comprou"}</p>
              </Card>
              <Card className="p-4">
                <p className="text-[13px] text-muted">Desconto que vale hoje</p>
                <p className="tabular font-display text-3xl font-extrabold">{desconto ? `${Math.round(desconto.percentual * 100)}%` : "–"}</p>
                <p className="text-[13px] text-muted">{desconto ? desconto.motivo : "prazo dos 7 dias encerrado"}</p>
              </Card>
            </div>

            <Card className="p-5">
              <h2 className="font-display font-bold">Contato</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                <li className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><Phone size={15} className="text-muted" aria-hidden />{fone}</span>
                  <CopyButton texto={fone} />
                </li>
                <li className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2 break-all"><Mail size={15} className="shrink-0 text-muted" aria-hidden />{l.email}</span>
                  <CopyButton texto={l.email} />
                </li>
              </ul>
              <p className="mt-3 text-xs text-faint">Consentimento LGPD registrado no diagnóstico (WhatsApp e e-mail).</p>
            </Card>

            {l.proposta && (
              <Card destaque className="p-5">
                <h2 className="font-display font-bold">Pedido de proposta</h2>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                  <div><dt className="text-muted">Quer resolver</dt><dd className="mt-0.5 font-semibold">{l.proposta.resolver.join(", ")}</dd></div>
                  <div><dt className="text-muted">Orçamento</dt><dd className="mt-0.5 font-semibold">{l.proposta.orcamento}</dd></div>
                  <div><dt className="text-muted">Quando</dt><dd className="mt-0.5 font-semibold">{l.proposta.prazo}</dd></div>
                </dl>
              </Card>
            )}

            {l.contrato && (
              <Card className="p-5">
                <h2 className="font-display font-bold">Contrato</h2>
                <p className="mt-2 text-sm">{l.contrato.servico}</p>
              </Card>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <Card className="p-5">
                <h2 className="font-display font-bold">Perguntou ao assistente</h2>
                {l.perguntasAssistente.length ? (
                  <ul className="mt-3 flex flex-col gap-2 text-sm">
                    {l.perguntasAssistente.map((p) => (
                      <li key={p} className="rounded-[8px] bg-subtle px-3 py-2">“{p}”</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted">Nenhuma pergunta ainda.</p>
                )}
                <p className="mt-3 text-xs text-faint">O que a pessoa pergunta mostra o que ela quer comprar.</p>
              </Card>
              <Card className="p-5">
                <h2 className="font-display font-bold">Serviços que olhou</h2>
                {l.servicosVistos.length ? (
                  <ul className="mt-3 flex flex-col gap-2 text-sm">
                    {l.servicosVistos.map((v) => (
                      <li key={v} className="rounded-[8px] bg-subtle px-3 py-2">{v}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted">Ainda não abriu a aba Com a Elev8.</p>
                )}
              </Card>
            </div>
          </div>

          <AcoesLead whatsapp={l.whatsapp} mensagem={mensagem} etapaInicial={l.etapa} desconto={desconto?.percentual ?? 0} />
        </div>
      </div>
    </AdminShell>
  );
}
