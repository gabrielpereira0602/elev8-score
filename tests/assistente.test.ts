import { responder, sugestoes } from "../src/lib/assistente";
import { contexto } from "../src/lib/contexto";
import { listaSegmentos } from "../src/lib/segmentos";

let falhas = 0;
const confere = (nome: string, ok: boolean, detalhe = "") => {
  if (!ok) falhas++;
  if (!ok || process.env.VERBOSE) console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
};

const fallback = "No protótipo, eu respondo";
for (const seg of listaSegmentos) {
  const ctx = contexto(seg.id);
  for (const q of sugestoes) {
    const r = responder(q, ctx);
    confere(`[${seg.id}] "${q}" tem resposta própria`, !r.texto.startsWith(fallback));
    confere(`[${seg.id}] "${q}" sem undefined`, !/undefined|NaN/.test(r.texto));
  }
  const bf = responder("Escreve um post para a Black Friday", ctx).texto;
  if (!seg.permitePreco) confere(`[${seg.id}] Black Friday respeita a regra do setor`, bf.includes("vai contra as regras") && !bf.includes("[sua condição]"));
  else confere(`[${seg.id}] Black Friday pede condição e data reais`, bf.includes("[sua condição]") && bf.includes("[data]"));
}
confere("pergunta fora do roteiro cai na resposta padrão", responder("qual a capital da França?", contexto("estetica")).texto.startsWith(fallback));
confere("variação de escrita funciona", !responder("como RESPONDO avaliação negativa", contexto("pet")).texto.startsWith(fallback));

console.log(falhas ? `\n${falhas} falha(s)` : `\nTodos os casos passaram (${listaSegmentos.length} nichos × ${sugestoes.length} perguntas)`);
if (falhas) process.exit(1);
