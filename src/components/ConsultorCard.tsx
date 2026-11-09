import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "./ui";

/** Versão paga: lembra que o consultor está ativo e deixa a próxima pergunta a um toque (a pergunta só fica escrita, não é enviada). */
export function ConsultorCard({ qs, ativoAte, perguntas }: { qs: string; ativoAte: string; perguntas: string[] }) {
  const link = (q: string) => `/painel/assistente${qs}${qs ? "&" : "?"}q=${encodeURIComponent(q)}`;
  return (
    <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6">
      <div className="flex items-start gap-3 md:min-w-0 md:flex-1">
        <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-night text-white">
          <Sparkles size={19} aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-base font-bold">Seu consultor de marketing está ativo</h2>
          <p className="text-[13px] text-muted">Até {ativoAte} · 20 perguntas por dia · respostas com o seu diagnóstico</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:justify-end">
        {perguntas.map((q) => (
          <Link
            key={q}
            href={link(q)}
            className="inline-flex items-center justify-between gap-2 rounded-full border border-line px-3.5 py-2 text-[13px] font-medium transition-colors hover:border-brand hover:text-brand"
          >
            {q}
            <ArrowRight size={14} className="shrink-0" aria-hidden />
          </Link>
        ))}
      </div>
    </Card>
  );
}
