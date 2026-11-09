import { contexto } from "../src/lib/contexto";
import { emailHTML, emailTexto, emails } from "../src/lib/emails";
import { listaSegmentos } from "../src/lib/segmentos";

let falhas = 0;
let casos = 0;
const confere = (nome: string, ok: boolean, detalhe = "") => {
  casos++;
  if (!ok) falhas++;
  if (!ok || process.env.VERBOSE) console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
};
const quebrado = /undefined|NaN|\[object|\$\{|null/;

for (const seg of listaSegmentos) {
  const lista = emails(contexto(seg.id));
  confere(`[${seg.id}] ids únicos`, new Set(lista.map((m) => m.id)).size === lista.length);
  for (const m of lista) {
    const html = emailHTML(m, m.publico);
    const texto = emailTexto(m);
    confere(`[${seg.id}] ${m.id} sem texto quebrado`, !quebrado.test(m.assunto + m.previa + texto));
    confere(`[${seg.id}] ${m.id} assunto cabe no celular`, m.assunto.length <= 80, `${m.assunto.length} caracteres`);
    if (m.publico !== "interno") confere(`[${seg.id}] ${m.id} tem descadastro`, html.includes("/descadastro") && texto.includes("/descadastro"));
    confere(`[${seg.id}] ${m.id} HTML escapado`, !/<script/i.test(html));
  }
  const convite = lista.find((m) => m.id === "prospecto-convite")!;
  const convitePlano = emailTexto(convite);
  confere(`[${seg.id}] convite não revela quem fez o diagnóstico`, !convitePlano.includes(contexto(seg.id).empresa.nome));
}

console.log(falhas ? `\n${falhas} falha(s) em ${casos} casos` : `\nTodos os casos passaram (${casos} verificações de e-mail)`);
if (falhas) process.exit(1);
