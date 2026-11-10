import { contexto } from "../src/lib/contexto";
import { montarAnalise, montarDadosReais, perfilPreenchido, termoDeBusca, type Respostas } from "../src/lib/real/analise";
import type { LugarGoogle } from "../src/lib/real/google";
import { clarezaDoHtml } from "../src/lib/real/site";
import { liberaKit } from "../src/lib/real/mercadopago";
import { registroParaLead } from "../src/lib/real/leads";
import { iguais, tokenAdmin } from "../src/lib/real/servidor";
import { calcularScore } from "../src/lib/score";
import { responder, TEMAS } from "../src/lib/assistente";
import { emails } from "../src/lib/emails";

let falhas = 0;
let casos = 0;
const confere = (nome: string, ok: boolean, detalhe = "") => {
  casos++;
  if (!ok) falhas++;
  if (!ok || process.env.VERBOSE) console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
};
const quebrado = /undefined|NaN|\[object|\$\{|\bnull\b/;

// Empresa no formato do Google Places (New)
const empresa: LugarGoogle = {
  id: "ChIJempresa123",
  displayName: { text: "Studio Bem Estar" },
  formattedAddress: "R. das Flores, 100 - Centro, Campinas - SP, 13010-000, Brasil",
  addressComponents: [
    { longText: "Campinas", shortText: "Campinas", types: ["administrative_area_level_2", "political"] },
    { longText: "São Paulo", shortText: "SP", types: ["administrative_area_level_1", "political"] },
  ],
  location: { latitude: -22.9, longitude: -47.06 },
  rating: 4.7,
  userRatingCount: 41,
  photos: new Array(10).fill({}),
  nationalPhoneNumber: "(19) 99999-0000",
  regularOpeningHours: {},
  primaryType: "beauty_salon",
  primaryTypeDisplayName: { text: "Clínica de estética" },
};
const c = (id: string, nome: string, av: number, fotos: number): LugarGoogle => ({ id, displayName: { text: nome }, userRatingCount: av, rating: 4.8, photos: new Array(fotos).fill({}), formattedAddress: "x", websiteUri: "https://x.com", nationalPhoneNumber: "(19) 3333-0000" });
const busca = [c("A", "Clínica Alfa", 320, 10), c("B", "Estética Beta", 150, 10), empresa, c("C", "Espaço Gama", 60, 6), c("D", "Delta", 10, 2)];
const resp: Respostas = { bio: "nao", posts: 1, respostas: "algumas" };

const a = montarAnalise(empresa, busca, { velocidade: null, clareza: null }, resp, undefined, new Date("2026-11-10T15:00:00Z"));
confere("segmento detectado pela categoria do Google", a.segmento === "estetica", a.segmento);
confere("cidade e UF lidas do Google", a.cidade === "Campinas" && a.uf === "SP", `${a.cidade}/${a.uf}`);
confere("posição na busca", a.posicao === 3, String(a.posicao));
confere("3 concorrentes, sem a própria empresa", a.ranking.length === 3 && !a.ranking.some((r) => r.nome === "Studio Bem Estar"));
confere("líder é o 1º da busca", a.lider.avaliacoes === 320);
confere("sem site: velocidade sem medida e clareza zero", a.metricas.velocidadeSite === null && a.metricas.siteClaro === 0);
confere("respostas do dono viram métricas", a.metricas.bioClara === false && a.metricas.postsPorSemana === 1 && a.metricas.respostasAvaliacoes === 50);
confere("perfil preenchido (sem site)", perfilPreenchido(empresa) === 80, String(perfilPreenchido(empresa)));
confere("concorrentes com contato guardados", (a.concorrentes ?? []).length === 3 && !!a.concorrentes?.[0].telefone);
confere("termo de busca da categoria", termoDeBusca(empresa, "estetica").termo === "clínica de estética" && termoDeBusca(empresa, "estetica").genero === "a");
confere("dentista é masculino", termoDeBusca({ ...empresa, primaryTypeDisplayName: { text: "Dentista" } }, "odontologia").genero === "o");

const fora = montarAnalise({ ...empresa, id: "Z" }, busca, { velocidade: 55, clareza: 80 }, resp);
confere("fora das 20 primeiras: posição vazia", fora.posicao === null);

// Empresa sem nenhuma avaliação e sem concorrentes: nada quebra
const vazia = montarAnalise({ ...empresa, userRatingCount: 0, rating: undefined, photos: [] }, [], { velocidade: null, clareza: null }, { bio: "sem-instagram", posts: 0, respostas: "sem-avaliacoes" });
const sv = calcularScore(vazia.metricas, vazia.lider);
confere("empresa nova sem concorrentes: score válido", Number.isFinite(sv.total) && sv.total >= 0 && sv.total <= 100, JSON.stringify(sv));

// Contexto real alimenta todas as telas sem texto quebrado
const dados = montarDadosReais("11111111-1111-4111-8111-111111111111", a, { servico: "limpeza de pele", diferencial: "Avaliação incluída", cor: "#aa3366" }, 3);
const ctx = contexto(undefined, undefined, dados);
confere("contexto real usa a empresa real", ctx.empresa.nome === "Studio Bem Estar" && ctx.diagnostico.real);
confere("contexto real sem teste das IAs inventado", ctx.diagnostico.ia === undefined);
confere("ranking real inclui você", ctx.diagnostico.ranking.some((r) => r.voce) && ctx.diagnostico.ranking.length === 4);
confere("link de avaliação real do Google", ctx.kit.linkAvaliacao.includes("writereview?placeid=ChIJempresa123"));
confere("posição no resumo", ctx.diagnostico.etapas[0].resumo === "3º no Google Maps", ctx.diagnostico.etapas[0].resumo);
confere("plano com ações do banco", ctx.diagnostico.plano.feitas === 3);
const textoTudo = JSON.stringify(ctx);
confere("contexto real sem texto quebrado", !/undefined|NaN/.test(textoTudo));
for (const t of TEMAS) {
  const r = responder(t.titulo, ctx).texto;
  confere(`consultor real: ${t.id}`, !quebrado.test(r), r.slice(0, 60));
}
for (const m of emails(ctx)) confere(`e-mail real: ${m.id}`, !quebrado.test(m.paragrafos.join(" ") + m.assunto));
const semForm = contexto(undefined, undefined, montarDadosReais("11111111-1111-4111-8111-111111111111", vazia));
confere("sem formulário do kit: placeholders e sem preço", semForm.empresa.preco === undefined && semForm.empresa.diferencial.includes("["));
confere("sem formulário: contexto sem texto quebrado", !/undefined|NaN/.test(JSON.stringify(semForm)));

// Site
confere("site claro completo = 100", clarezaDoHtml(`<title>Clínica de estética em Campinas</title><a href="https://wa.me/5519">Agende</a><form></form> Campinas`, "Campinas") === 100);
confere("site vazio = 0", clarezaDoHtml("<html><body></body></html>", "Campinas") === 0);

// Pagamento
const id = "11111111-1111-4111-8111-111111111111";
confere("pagamento aprovado libera", liberaKit({ id: 1, status: "approved", external_reference: id, transaction_amount: 97 }, id));
confere("pagamento pendente não libera", !liberaKit({ id: 1, status: "pending", external_reference: id, transaction_amount: 97 }, id));
confere("pagamento de outro diagnóstico não libera", !liberaKit({ id: 1, status: "approved", external_reference: "outro", transaction_amount: 97 }, id));
confere("pagamento com valor menor não libera", !liberaKit({ id: 1, status: "approved", external_reference: id, transaction_amount: 1 }, id));

// Admin
const lead = registroParaLead({
  id, criado_em: new Date().toISOString(), place_id: "ChIJempresa123", analise: a,
  contato: { nome: "Ana", whatsapp: "19999990000", email: "a@b.com", consentimentoEm: "" },
  origem: "anuncio", parceiro: null, convite: null, form_kit: {}, plano_feitas: ["a1"], pago: true, pago_em: null, pagamento_id: null,
  etapa: "comprou", notas: null, proposta: null, score_vivo: false,
});
confere("lead real no formato do admin", lead.empresa === "Studio Bem Estar" && lead.etapa === "aplicando" && lead.score > 0);

(async () => {
  const t1 = await tokenAdmin("senha-forte");
  confere("token do admin é estável", t1 === (await tokenAdmin("senha-forte")) && t1.length === 64);
  confere("senha errada não bate", !iguais(t1, await tokenAdmin("outra")));
  console.log(falhas ? `\n${falhas} falha(s) em ${casos} casos` : `\nTodos os casos passaram (${casos} verificações do modo real)`);
  if (falhas) process.exit(1);
})();
