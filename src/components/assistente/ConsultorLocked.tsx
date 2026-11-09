import Link from "next/link";
import { ArrowRight, Clock, Lock, MessageSquareText, PenLine, Scale, Sparkles, Target } from "lucide-react";
import type { Contexto } from "@/lib/contexto";
import { responder } from "@/lib/assistente";
import { Card } from "../ui";

/*
  Versão grátis da aba Consultor. Mostra uma pergunta típica do nicho e só o começo da resposta real,
  feita para esta empresa (lacuna de curiosidade). O resto da resposta não vai para a página:
  as linhas desfocadas são enfeite, então não dá para ler o conteúdo pelo código da página.
*/
export function ConsultorLocked({ ctx, qs }: { ctx: Contexto; qs: string }) {
  const pergunta = ctx.segmento.consultor.pergunta;
  const inicio = responder(pergunta, ctx).texto.split("\n\n")[0];
  const beneficios = [
    { icone: Target, titulo: "Conhece seus números", texto: `Já sabe o diagnóstico de ${ctx.empresa.nome}, seus 3 concorrentes e o seu plano.` },
    { icone: PenLine, titulo: "Escreve por você", texto: "Legendas, respostas a clientes, mensagens de WhatsApp e avaliações, prontas para copiar." },
    { icone: Scale, titulo: "Segue as regras do seu setor", texto: `Tudo dentro das regras de ${ctx.segmento.nome.toLowerCase()}.` },
    { icone: MessageSquareText, titulo: "É honesto com você", texto: "Diz o que dá para fazer sozinho e quando vale chamar um profissional." },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">
            <Sparkles size={14} aria-hidden />
            Incluso no kit
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Seu consultor de marketing</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Tire qualquer dúvida de marketing a qualquer hora, com respostas feitas para {ctx.empresa.nome}. Veja um exemplo com uma pergunta comum no seu
            setor:
          </p>
        </div>
        <Link
          href={`/painel${qs}#oferta`}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Liberar kit e consultor
          <ArrowRight size={18} aria-hidden />
        </Link>
      </div>

      <Card destaque className="flex flex-col gap-4 p-5 md:p-6">
        <div className="max-w-[85%] self-end rounded-[16px] rounded-br-[4px] bg-brand px-4 py-2.5 text-[15px] text-white">{pergunta}</div>
        <div className="flex max-w-[92%] gap-3 self-start">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
            <Sparkles size={16} aria-hidden />
          </span>
          <div className="relative overflow-hidden rounded-[16px] rounded-tl-[4px] bg-subtle px-4 py-3 text-[15px] leading-relaxed">
            <p>{inicio}</p>
            <div className="mt-3 flex select-none flex-col gap-2 blur-[5px]" aria-hidden>
              <span className="h-3 w-11/12 rounded bg-faint/50" />
              <span className="h-3 w-4/5 rounded bg-faint/50" />
              <span className="h-3 w-3/5 rounded bg-faint/50" />
              <span className="h-3 w-5/6 rounded bg-faint/50" />
              <span className="h-3 w-2/3 rounded bg-faint/50" />
            </div>
            <span className="absolute inset-x-0 bottom-3 grid place-items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                <Lock size={12} aria-hidden />
                Passo a passo e texto pronto liberados com o kit
              </span>
            </span>
          </div>
        </div>
      </Card>

      <ul className="grid gap-4 sm:grid-cols-2">
        {beneficios.map((b) => (
          <li key={b.titulo}>
            <Card className="flex h-full gap-3 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-brand-soft text-brand">
                <b.icone size={18} aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-[15px] font-bold">{b.titulo}</h2>
                <p className="mt-0.5 text-sm text-muted">{b.texto}</p>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <p className="flex items-center gap-2 text-sm text-muted">
        <Clock size={15} aria-hidden />
        30 dias de acesso a partir da compra, até 20 perguntas por dia.
      </p>
    </div>
  );
}
