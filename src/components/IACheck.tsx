import { Sparkles } from "lucide-react";
import type { RespostaIA } from "@/lib/mock";
import { Card, Origem } from "./ui";

/** Exclusivo do Elev8 Score: a empresa é recomendada quando o cliente pergunta a uma IA? */
export function IACheck({ pergunta, respostas, data }: { pergunta: string; respostas: RespostaIA[]; data: string }) {
  const citadas = respostas.filter((r) => r.citou).length;

  return (
    <Card className="flex h-full flex-col gap-4 p-5 md:p-6">
      <div>
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
          <Sparkles size={15} className="text-brand" aria-hidden />
          A inteligência artificial indica você?
        </p>
        <h2 className="mt-1.5 font-display text-xl font-bold leading-tight tracking-tight text-balance">
          {citadas === 0
            ? "Nenhuma IA citou sua empresa"
            : `Você foi citado em ${citadas} de ${respostas.length} IAs`}
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Perguntamos o que o seu cliente perguntaria: <span className="text-ink">“{pergunta}”</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {respostas.map((r) => (
          <div key={r.ia} className="rounded-[var(--radius-control)] border border-line p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-[15px] font-bold">{r.ia}</span>
              <span className={`text-xs font-semibold ${r.citou ? "text-warn" : "text-bad"}`}>
                {r.citou ? `Citou em ${r.posicao}º` : "Não citou você"}
              </span>
            </div>
            <ol className="mt-2 flex flex-col gap-1 text-[13px]">
              {r.lista.map((nome, i) => (
                <li key={nome} className={`flex gap-2 ${i + 1 === r.posicao ? "font-semibold text-brand" : "text-muted"}`}>
                  <span className="tabular w-3 text-faint">{i + 1}</span>
                  <span className="truncate">{nome}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <Origem tipo="Observado">Respostas de {data}. As IAs podem variar a cada pergunta.</Origem>
      </div>
    </Card>
  );
}
