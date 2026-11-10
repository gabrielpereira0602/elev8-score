/*
  Clareza do site (0 a 100): o site diz o que faz, onde e como contratar?
  Leitura simples do HTML da página inicial, sem IA:
  - 35 pontos: tem link de WhatsApp ou de telefone;
  - 25 pontos: tem formulário ou botão de ação (agendar, orçamento, contato, reservar, comprar);
  - 20 pontos: tem título ou cabeçalho que descreve o negócio (3 palavras ou mais);
  - 20 pontos: cita a cidade.
*/

export function clarezaDoHtml(html: string, cidade: string): number {
  const h = html.slice(0, 1_500_000);
  const texto = h
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
  const semAcento = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  let pontos = 0;
  if (/(wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/|href=["']tel:)/i.test(h)) pontos += 35;
  if (/<form[\s>]/i.test(h) || /(agend|marcar|orcament|orçament|contato|fale conosco|reserv|comprar|solicite)/i.test(texto)) pontos += 25;
  const titulo = (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/<[^>]+>/g, " ").trim();
  if (titulo.split(/\s+/).filter(Boolean).length >= 3) pontos += 20;
  if (cidade && semAcento(texto).includes(semAcento(cidade))) pontos += 20;
  return Math.min(100, pontos);
}

/** Baixa a página inicial e mede a clareza. null quando o site não abre. */
export async function clarezaSite(url: string, cidade: string): Promise<number | null> {
  try {
    const r = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Elev8Score/1.0)", Accept: "text/html" },
      cache: "no-store",
    });
    if (!r.ok) return null;
    const tipo = r.headers.get("content-type") ?? "";
    if (!tipo.includes("html")) return null;
    return clarezaDoHtml(await r.text(), cidade);
  } catch {
    return null;
  }
}
