import { leads } from "../src/lib/admin-mock";
import { negocioDoConvite, numerosCiclo, prospectos, slug } from "../src/lib/prospeccao";
import { COMISSAO, parceiroPorCodigo, parceiros, resultadoParceiro } from "../src/lib/parceiros";
import { detectarSegmento } from "../src/lib/segmentos";

let falhas = 0;
let casos = 0;
const confere = (nome: string, ok: boolean, detalhe = "") => {
  casos++;
  if (!ok) falhas++;
  if (!ok || process.env.VERBOSE) console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
};

const lista = prospectos();
const nomesLeads = new Set(leads.map((l) => slug(l.empresa)));
confere("há prospectos", lista.length > 0, String(lista.length));
confere("nenhum prospecto duplicado", new Set(lista.map((p) => p.codigo)).size === lista.length);
for (const p of lista) {
  confere(`${p.nome}: quem já é lead nunca recebe convite`, !nomesLeads.has(p.codigo) || p.status === "virou-lead");
  confere(`${p.nome}: sem e-mail não entra no envio automático`, p.status !== "sem-email" || !p.email);
  confere(`${p.nome}: não é a própria empresa do diagnóstico`, p.nome !== p.veioDe);
  confere(`${p.nome}: tem nome de empresa de verdade`, !/^voc[eê]$/i.test(p.nome.trim()));
  const c = negocioDoConvite(p.codigo);
  confere(`${p.nome}: link de convite abre a empresa`, !!c && c.negocio.nome === p.nome);
  confere(`${p.nome}: convite abre no nicho certo`, !!c && detectarSegmento(c.negocio.categoria) === p.segmento, c ? c.negocio.categoria : "");
}
confere("convite inválido não quebra", negocioDoConvite("nao-existe") === null);
const n = numerosCiclo();
confere("fator do ciclo é um número", Number.isFinite(n.fator) && n.fator >= 0, String(n.fator));

for (const p of parceiros) {
  const r = resultadoParceiro(p);
  confere(`${p.nome}: comissão não negativa`, r.comissao >= 0 && Number.isFinite(r.comissao));
}
confere("parceiro inválido não quebra", parceiroPorCodigo("xyz") === undefined && parceiroPorCodigo(undefined) === undefined);
confere("comissões entre 0 e 1", COMISSAO.kit > 0 && COMISSAO.kit < 1 && COMISSAO.servico > 0 && COMISSAO.servico < 1);
confere("leads de parceiro apontam para parceiro existente", leads.filter((l) => l.parceiro).every((l) => !!parceiroPorCodigo(l.parceiro)));

console.log(falhas ? `\n${falhas} falha(s) em ${casos} casos` : `\nTodos os casos passaram (${casos} verificações do ciclo e dos parceiros)`);
if (falhas) process.exit(1);
