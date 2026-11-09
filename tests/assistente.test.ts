import { TEMAS, responder, sugestoesPara } from "../src/lib/assistente";
import { ASSUNTOS_AVALIACAO, OBJETIVOS_WHATSAPP, legenda, mensagemWhatsapp, respostaAvaliacao, temasLegenda } from "../src/lib/consultor-ferramentas";
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

const naoEncontrou = "Não encontrei";
const quebrado = /undefined|NaN|\[object|\$\{|null/;
const ofertaProibida = /R\$|\[sua condição\]|condição só para|sinal para reservar/;
// Dia 15 de cada mês, ao meio-dia em São Paulo: testa as datas do ano todo.
const meses = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2026, i, 15, 15)));

// IDs únicos e todo título cai no próprio tema (a biblioteca nunca abre a resposta errada).
confere("ids dos temas são únicos", new Set(TEMAS.map((t) => t.id)).size === TEMAS.length);
for (const t of TEMAS) {
  const r = responder(t.titulo, contexto("estetica"));
  confere(`título "${t.titulo}" abre o próprio tema`, r.temaId === t.id, `abriu ${r.temaId}`);
}

for (const seg of listaSegmentos) {
  const ctx = contexto(seg.id);

  // Toda a base, em todos os meses: sem texto quebrado e sem oferta em setor regulado.
  for (const hoje of meses) {
    for (const t of TEMAS) {
      const r = responder(t.titulo, ctx, hoje).texto;
      const rotulo = `[${seg.id} · mês ${hoje.getUTCMonth() + 1}] ${t.id}`;
      confere(`${rotulo} sem texto quebrado`, !quebrado.test(r));
      if (!seg.permitePreco) confere(`${rotulo} sem preço nem oferta`, !ofertaProibida.test(r), r.slice(0, 80));
    }
    for (const q of sugestoesPara(ctx, hoje)) {
      const r = responder(q, ctx, hoje);
      confere(`[${seg.id}] sugestão "${q}" tem resposta`, !r.texto.startsWith(naoEncontrou));
    }
  }

  const bf = responder("Escreve um post para a Black Friday", ctx).texto;
  if (!seg.permitePreco) confere(`[${seg.id}] Black Friday respeita a regra do setor`, bf.includes("vai contra as regras") && !bf.includes("[sua condição]"));
  else confere(`[${seg.id}] Black Friday pede condição e data reais`, bf.includes("[sua condição]") && bf.includes("[data]"));

  // Ferramentas: todas as combinações.
  for (const estrelas of [1, 2, 3, 4, 5])
    for (const a of ASSUNTOS_AVALIACAO) {
      const t = respostaAvaliacao(ctx, { nome: "Ana", estrelas, assunto: a.id });
      confere(`[${seg.id}] avaliação ${estrelas}★ ${a.id}`, !quebrado.test(t) && t.includes("Ana") && !/desconto/i.test(t));
    }
  for (const o of OBJETIVOS_WHATSAPP) {
    const t = mensagemWhatsapp(ctx, { nome: "", objetivo: o.id });
    confere(`[${seg.id}] WhatsApp ${o.id}`, !quebrado.test(t) && t.includes("[nome]") && (seg.permitePreco || !ofertaProibida.test(t)));
  }
  for (const hoje of meses)
    for (const tema of temasLegenda(ctx, hoje))
      for (const tom of ["proximo", "profissional"] as const) {
        const t = legenda(ctx, { temaId: tema.id, tom }, hoje);
        confere(`[${seg.id}] legenda ${tema.id} ${tom}`, !quebrado.test(t) && t.includes("#") && (seg.permitePreco || !ofertaProibida.test(t)));
      }

  const prompt = promptDoConsultor({ ctx, desconto: { percentual: 0.2, validoAte: "16/11/2026" } });
  confere(`[${seg.id}] instruções da IA sem texto quebrado`, !quebrado.test(prompt));
  confere(`[${seg.id}] instruções trazem a empresa e as regras`, prompt.includes(ctx.empresa.nome) && seg.regras.every((r) => prompt.includes(r)));
}

// A pergunta típica de cada nicho cai na resposta certa.
const esperado: Record<SegmentoId, string> = {
  estetica: "preco",
  odontologia: "preco",
  advocacia: "regras-setor",
  restaurante: "pos-venda",
  academia: "followup",
  pet: "agenda",
  beleza: "agenda",
  loja: "seguidores-clientes",
  generico: "preco",
};
for (const seg of listaSegmentos) {
  const r = responder(seg.consultor.pergunta, contexto(seg.id));
  confere(`[${seg.id}] pergunta do nicho cai no tema certo`, r.temaId === esperado[seg.id], `abriu ${r.temaId}`);
}

// Jeitos diferentes de perguntar.
const jeitos: [string, string][] = [
  ["como RESPONDO avaliação negativa", "avaliacao-ruim"],
  ["qto custa? o pessoal sempre pergunta o valor", "preco"],
  ["demoro pra responder no zap", "atendimento-whatsapp"],
  ["como arrumo a bio do insta", "bio"],
  ["alguém me deu 1 estrela", "avaliacao-ruim"],
  ["vale a pena colocar dinheiro em anúncio no instagram?", "impulsionar"],
  ["como faço pra aparecer no chat gpt", "ia"],
  ["o cliente falou que vai pensar", "vou-pensar"],
  ["como peço review pros clientes", "pedir-avaliacoes"],
  ["meus clientes faltam muito", "faltas"],
  ["o que postar no natal?", "posts-do-mes"],
  ["quero mais seguidores", "crescer-seguidores"],
];
for (const [q, id] of jeitos) {
  const r = responder(q, contexto("beleza"));
  confere(`"${q}" → ${id}`, r.temaId === id, `abriu ${r.temaId}`);
}
confere("pergunta fora do assunto não inventa resposta", responder("qual a capital da França?", contexto("estetica")).texto.startsWith(naoEncontrou));
confere("resposta traz temas relacionados", (responder("Como respondo uma avaliação ruim?", contexto("pet")).relacionados ?? []).length === 3);
confere("sem promoção para dentista no Natal", !ofertaProibida.test(responder("o que postar no natal?", contexto("odontologia")).texto));

console.log(falhas ? `\n${falhas} falha(s) em ${casos} casos` : `\nTodos os casos passaram (${casos} verificações · ${TEMAS.length} temas × 9 nichos × 12 meses, ferramentas e instruções)`);
if (falhas) process.exit(1);
