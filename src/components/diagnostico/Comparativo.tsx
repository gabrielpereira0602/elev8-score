import { Card, Origem } from "../ui";

type Linha = { rotulo: string; valores: [string, string, string, string]; pior?: boolean; origem: string };

// Ordem das colunas: você, depois os concorrentes do 1º ao 3º.
const colunas = ["Você", "Estética Lumière", "Clínica Aurora", "Espaço Vitta"];

const linhas: Linha[] = [
  { rotulo: "Posição no Google Maps", valores: ["4º", "1º", "2º", "3º"], pior: true, origem: "Maps" },
  { rotulo: "Avaliações", valores: ["23", "187", "112", "74"], pior: true, origem: "Maps" },
  { rotulo: "Estrelas", valores: ["4,6", "4,8", "4,7", "4,5"], origem: "Maps" },
  { rotulo: "Fotos no perfil", valores: ["12", "96", "64", "41"], pior: true, origem: "Maps" },
  { rotulo: "Perfil do Google preenchido", valores: ["60%", "100%", "90%", "80%"], pior: true, origem: "Maps" },
  { rotulo: "Avaliações respondidas", valores: ["30%", "95%", "70%", "40%"], pior: true, origem: "Maps" },
  { rotulo: "Velocidade do site no celular", valores: ["41/100", "78/100", "65/100", "sem site"], origem: "PageSpeed" },
  { rotulo: "Bio explica o que faz", valores: ["Não", "Sim", "Sim", "Não"], origem: "Informado" },
];

export function Comparativo({ data }: { data: string }) {
  return (
    <Card className="p-5 md:p-7">
      <h2 className="font-display text-xl font-bold tracking-tight">Lado a lado</h2>
      <p className="mt-1 text-sm text-muted">Os mesmos dados públicos que o seu cliente vê quando compara vocês. Em vermelho, onde você está atrás de todos.</p>

      <div className="-mx-5 mt-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th scope="col" className="py-2.5 pr-3 font-medium text-muted" />
              {colunas.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`px-3 py-2.5 text-right font-semibold ${i === 0 ? "rounded-t-[8px] bg-brand-soft text-brand-ink" : "text-muted"}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.rotulo} className="border-b border-line last:border-0">
                <th scope="row" className="py-3 pr-3 text-left font-medium">
                  {l.rotulo}
                  <span className="ml-2 rounded bg-subtle px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-faint">
                    {l.origem === "Informado" ? "Informado" : "Observado"}
                  </span>
                </th>
                {l.valores.map((v, i) => (
                  <td
                    key={i}
                    className={`tabular px-3 py-3 text-right ${i === 0 ? `bg-brand-soft/60 font-semibold ${l.pior ? "text-bad" : ""}` : ""}`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Origem tipo="Observado">Google Maps e PageSpeed Insights, {data}. “Bio explica o que faz” foi avaliado a partir da bio que você informou.</Origem>
      </div>
    </Card>
  );
}
