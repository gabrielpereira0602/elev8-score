import { aplicarKit, calcularScore } from "../src/lib/score";
import { liderBusca, metricasHoje } from "../src/lib/mock";
import { contexto } from "../src/lib/contexto";
const diagnostico = contexto("estetica").diagnostico;

let falhas = 0;
const confere = (nome: string, ok: boolean, detalhe = "") => {
  if (!ok) falhas++;
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
};

const hoje = calcularScore(metricasHoje, liderBusca);
const kit = calcularScore(aplicarKit(metricasHoje), liderBusca);
console.log("hoje:", hoje, "\ncom kit:", kit);

confere("total entre 0 e 100", hoje.total >= 0 && hoje.total <= 100);
confere("kit nunca piora o score", kit.total >= hoje.total && kit.encontrado >= hoje.encontrado && kit.entendido >= hoje.entendido && kit.escolhido >= hoje.escolhido);
confere("kit não chega a 100 (site depende da Elev8)", kit.total < 100, String(kit.total));
confere("painel usa a mesma conta", diagnostico.nota === hoje.total && diagnostico.potencialComKit === kit.total);
const zerado = calcularScore({ avaliacoes: 0, fotos: 0, perfilPreenchido: 0, velocidadeSite: 0, bioClara: false, postsPorSemana: 0, respostasAvaliacoes: 0, estrelas: 1, siteClaro: 0 }, liderBusca);
confere("empresa sem nada = 0", zerado.total === 0, String(zerado.total));
const maximo = calcularScore({ avaliacoes: 999, fotos: 999, perfilPreenchido: 100, velocidadeSite: 100, bioClara: true, postsPorSemana: 9, respostasAvaliacoes: 100, estrelas: 5, siteClaro: 100 }, liderBusca);
confere("empresa perfeita = 100", maximo.total === 100, String(maximo.total));
const semLider = calcularScore(metricasHoje, { avaliacoes: 0, fotos: 0 });
confere("sem concorrente na busca não quebra", Number.isFinite(semLider.total), String(semLider.total));

console.log(falhas ? `\n${falhas} falha(s)` : "\nTodos os casos passaram");
if (falhas) process.exit(1);
