import { responder, sugestoesPara } from "../src/lib/assistente";
import { promptDoConsultor } from "../src/lib/consultor-prompt";
import { contexto } from "../src/lib/contexto";
import { listaSegmentos, type SegmentoId } from "../src/lib/segmentos";

let falhas = 0;
let casos = 0;
const confere = (nome: string, ok: boolean, detalhe = "") => {
  casos++;
  if (!ok) falhas++;
  if (!ok || process.env.VERBOSE) console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
};

const fallback = "No protótipo, eu respondo";
const quebrado = /undefined|NaN|\[object|\$\{/;
// Dia 15 de cada mês, ao meio-dia em São Paulo: testa as datas do ano todo.
const meses = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2026, i, 15, 15)));

for (const seg of listaSegmentos) {
  const ctx = contexto(seg.id);
  for (const hoje of meses) {
    for (const q of sugestoesPara(ctx, hoje)) {
      const r = responder(q, ctx, hoje).texto;
      const rotulo = `[${seg.id} · mês ${hoje.getUTCMonth() + 1}] "${q}"`;
      confere(`${rotulo} tem resposta própria`, !r.startsWith(fallback));
      confere(`${rotulo} sem texto quebrado`, !quebrado.test(r));
      if (!seg.permitePreco) confere(`${rotulo} sem preço nem oferta`, !/R\$|\[sua condição\]|condição só para/.test(r), r.slice(0, 80));
    }
  }
  const bf = responder("Escreve um post para a Black Friday", ctx).texto;
  if (!seg.permitePreco) confere(`[${seg.id}] Black Friday respeita a regra do setor`, bf.includes("vai contra as regras") && !bf.includes("[sua condição]"));
  else confere(`[${seg.id}] Black Friday pede condição e data reais`, bf.includes("[sua condição]") && bf.includes("[data]"));

  const prompt = promptDoConsultor({ ctx, desconto: { percentual: 0.2, validoAte: "16/11/2026" } });
  confere(`[${seg.id}] instruções da IA sem texto quebrado`, !quebrado.test(prompt));
  confere(`[${seg.id}] instruções trazem a empresa e as regras do setor`, prompt.includes(ctx.empresa.nome) && seg.regras.every((r) => prompt.includes(r)));
  confere(`[${seg.id}] instruções respeitam preço do setor`, prompt.includes(seg.permitePreco ? "Pode falar de preço" : "Sem preço, promoção"));
}

// A pergunta típica de cada nicho cai na resposta certa.
const esperado: Record<SegmentoId, string> = {
  estetica: "Quem pergunta o preço",
  odontologia: "No seu setor, preço não aparece",
  advocacia: "Em tudo o que eu escrevo",
  restaurante: "O caminho mais rápido",
  academia: "Quem demonstrou interesse",
  pet: "Agenda cheia",
  beleza: "Agenda cheia",
  loja: "Quem só olha",
  generico: "Quando acham caro",
};
for (const seg of listaSegmentos) {
  const r = responder(seg.consultor.pergunta, contexto(seg.id)).texto;
  confere(`[${seg.id}] pergunta do nicho cai na resposta certa`, r.startsWith(esperado[seg.id]), r.slice(0, 60));
}

confere("pergunta fora do roteiro cai na resposta padrão", responder("qual a capital da França?", contexto("estetica")).texto.startsWith(fallback));
confere("variação de escrita funciona", !responder("como RESPONDO avaliação negativa", contexto("pet")).texto.startsWith(fallback));
confere("'mesmo' não é confundido com 'mês'", !responder("posso postar o mesmo post duas vezes?", contexto("loja")).texto.startsWith("Para "));
confere("sem promoção para dentista no Natal", !/R\$|\[sua condição\]/.test(responder("o que postar no natal?", contexto("odontologia")).texto));

console.log(falhas ? `\n${falhas} falha(s) em ${casos} casos` : `\nTodos os casos passaram (${casos} verificações, 9 nichos × 12 meses × 7 perguntas)`);
if (falhas) process.exit(1);
