import { descontoAtivo, precoTexto, servico, servicos } from "../src/lib/elev8";

let falhas = 0;
// A moeda usa espaço que não quebra linha (U+00A0) entre "R$" e o número; o teste compara com espaço comum.
const n = (t: string | null) => (t ?? "").replace(/\u00a0/g, " ");
const confere = (nome: string, ok: boolean, detalhe = "") => {
  if (!ok) falhas++;
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
};

// Datas em UTC (como no servidor). São Paulo = UTC-3.
const sp = (dia: number, hora: number, min = 0) => new Date(Date.UTC(2026, 10, dia, hora + 3, min));
const diag = sp(7, 10); // 07/11/2026, 10h em São Paulo

confere("dia do diagnóstico: 20%", descontoAtivo(diag, false, sp(7, 18))?.percentual === 0.2);
confere("14/11 às 23h58 em SP: ainda 20%", descontoAtivo(diag, false, sp(14, 23, 58))?.percentual === 0.2);
confere("15/11 à 0h01 em SP: acabou", descontoAtivo(diag, false, sp(15, 0, 1)) === null);
confere("diagnóstico às 22h de SP (já 01h UTC do dia seguinte) conta o dia de SP", descontoAtivo(sp(7, 22), false, sp(14, 23))?.percentual === 0.2 && descontoAtivo(sp(7, 22), false, sp(15, 0, 30)) === null);
confere("8º dia sem kit: sem desconto", descontoAtivo(diag, false, sp(15, 9)) === null);
confere("8º dia com kit: 10%", descontoAtivo(diag, true, sp(15, 9))?.percentual === 0.1);
confere("dentro da janela com kit: vale o maior (20%)", descontoAtivo(diag, true, sp(10, 12))?.percentual === 0.2);
confere("validade mostrada é 14/11", descontoAtivo(diag, false, sp(8, 12))?.motivo.includes("14/11") ?? false);

const lp = precoTexto(servico("lp-estrategica"), { percentual: 0.2, motivo: "" });
confere("projeto com 20%: R$ 997 → R$ 797,60", n(lp.final) === "R$ 797,60", `${lp.final}`);
const meta = precoTexto(servico("meta-google"), { percentual: 0.1, motivo: "" });
confere("mensal com 10% só no 1º mês", n(meta.final) === "R$ 1.347,30 no 1º mês" && n(meta.cheio) === "R$ 1.497/mês", `${meta.cheio} → ${meta.final}`);
confere("sob consulta não mostra desconto", precoTexto(servico("seo-local"), { percentual: 0.2, motivo: "" }).final === null);
confere("ids do catálogo são únicos", new Set(servicos.map((s) => s.id)).size === servicos.length);

console.log(falhas ? `\n${falhas} falha(s)` : "\nTodos os casos passaram");
if (falhas) process.exit(1);
