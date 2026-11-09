import Link from "next/link";
import { ExternalLink, Mail, MessageCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui";
import { linkWhatsApp } from "@/lib/admin-mock";
import { segmentos } from "@/lib/segmentos";
import { STATUS_PROSPECTO, numerosCiclo, prospectos } from "@/lib/prospeccao";

export const metadata = { title: "Prospecção · Admin · Elev8 Score" };

const tons = {
  brand: "bg-brand-soft text-brand-ink",
  good: "bg-good-soft text-good",
  warn: "bg-warn-soft text-warn",
  muted: "bg-subtle text-muted",
};

export default function Prospeccao() {
  const lista = prospectos();
  const n = numerosCiclo();
  const fator = n.fator.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

  const cartoes = [
    { rotulo: "Empresas encontradas", valor: String(n.encontrados), detalhe: "concorrentes que apareceram nos diagnósticos" },
    { rotulo: "Convites enviados", valor: String(n.enviados), detalhe: "por e-mail, sem você precisar entrar" },
    { rotulo: "Viraram diagnóstico", valor: String(n.viraramLead), detalhe: "leads que chegaram pelo convite" },
    { rotulo: "Fator do ciclo", valor: fator, detalhe: "diagnósticos novos para cada diagnóstico. Acima de 1, o ciclo se alimenta sozinho" },
  ];

  return (
    <AdminShell ativa="prospeccao">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Ciclo do concorrente</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted">
            Cada diagnóstico analisa 3 concorrentes do mesmo nicho e cidade. Eles viram prospectos já qualificados e recebem um convite para ver o próprio
            Score Digital.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cartoes.map((c) => (
            <Card key={c.rotulo} className="p-4 md:p-5">
              <p className="text-[13px] font-medium text-muted">{c.rotulo}</p>
              <p className="tabular mt-1 font-display text-3xl font-extrabold tracking-tight">{c.valor}</p>
              <p className="mt-1 text-[12.5px] text-muted">{c.detalhe}</p>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col gap-3 p-5 md:flex-row md:gap-8">
          <div className="flex items-start gap-3 md:w-1/2">
            <RefreshCw size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
            <div className="text-sm">
              <p className="font-semibold">Como funciona sozinho</p>
              <p className="mt-1 text-muted">
                Até 3 dias depois de aparecer num diagnóstico, a empresa recebe um e-mail amigo com a posição dela na busca e um link que já abre a entrada
                com o nome dela preenchido. Até 20 convites por dia.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 md:w-1/2">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-good" aria-hidden />
            <div className="text-sm">
              <p className="font-semibold">Regras que protegem a Elev8</p>
              <p className="mt-1 text-muted">
                Um convite por empresa. Nunca para quem já é lead ou pediu para não receber. O convite nunca diz quem fez o diagnóstico. Só e-mail público
                da empresa, com link para parar de receber.
              </p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-4">
            <h2 className="font-display text-lg font-bold">Prospectos</h2>
            <Link href="/admin/emails?email=prospecto-convite" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              <Mail size={15} aria-hidden />
              Ver o e-mail de convite
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {lista.map((p) => {
              const st = STATUS_PROSPECTO[p.status];
              return (
                <li key={p.codigo} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold">{p.nome}</p>
                    <p className="text-[13px] text-muted">
                      {segmentos[p.segmento].nome} · {p.cidade} · {p.posicao}º em “{p.busca}” · Score {p.nota}
                    </p>
                    <p className="text-xs text-faint">Apareceu no diagnóstico de {p.veioDe}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tons[st.tom]}`}>{st.nome}</span>
                    <Link
                      href={`/?convite=${p.codigo}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-[8px] border border-line px-2.5 py-1.5 text-[13px] font-semibold hover:border-brand hover:text-brand"
                    >
                      Como chega
                      <ExternalLink size={13} aria-hidden />
                    </Link>
                    {p.status === "sem-email" && (
                      <a
                        href={linkWhatsApp(
                          p.telefone,
                          `Olá, equipe ${p.nome}! Aqui é o Gabriel, da Elev8. Analisamos a busca “${p.busca}” no Google e vocês aparecem em ${p.posicao}º. Deixamos o Score Digital de vocês pronto, de graça. Posso mandar o link?`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-[8px] bg-good px-2.5 py-1.5 text-[13px] font-semibold text-white hover:brightness-110"
                      >
                        <MessageCircle size={13} aria-hidden />
                        WhatsApp manual
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
        <p className="text-xs text-faint">
          Protótipo: lista e status de exemplo. Na fase 2, os concorrentes vêm da busca real no Google e os e-mails públicos, do site de cada empresa.
        </p>
      </div>
    </AdminShell>
  );
}
