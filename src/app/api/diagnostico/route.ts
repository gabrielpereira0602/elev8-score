import { analisar, lerRespostas, type Analise, type Respostas } from "@/lib/real/analise";
import { analiseRecente, bancoConfigurado, inserir } from "@/lib/real/db";
import { googleConfigurado } from "@/lib/real/google";
import { dentroDoLimite, ipDe, json } from "@/lib/real/servidor";
import { parceiroPorCodigo } from "@/lib/parceiros";
import { segmentos, type SegmentoId } from "@/lib/segmentos";

export const maxDuration = 60;

const respostaValida = (r: unknown): r is Respostas => {
  const x = r as Respostas;
  return (
    !!x &&
    ["sim", "nao", "sem-instagram"].includes(x.bio) &&
    [0, 1, 2, 3].includes(x.posts) &&
    ["todas", "algumas", "nenhuma", "sem-avaliacoes"].includes(x.respostas)
  );
};

/** Cria o diagnóstico real: consulta Google e site, salva o lead e devolve o código do painel. */
export async function POST(req: Request) {
  if (!googleConfigurado() || !bancoConfigurado()) return json({ erro: "O diagnóstico real ainda não foi configurado." }, 503);
  if (!dentroDoLimite(`diag:${ipDe(req)}`, 6, 3600e3)) return json({ erro: "Muitos diagnósticos seguidos. Tente de novo daqui a uma hora." }, 429);

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json({ erro: "Pedido inválido." }, 400);
  }
  const placeId = String(b.placeId ?? "");
  const segmento = typeof b.segmento === "string" && b.segmento in segmentos ? (b.segmento as SegmentoId) : undefined;
  const c = (b.contato ?? {}) as Record<string, unknown>;
  const nome = String(c.nome ?? "").trim().slice(0, 80);
  const whatsapp = String(c.whatsapp ?? "").replace(/\D/g, "");
  const email = String(c.email ?? "").trim().toLowerCase().slice(0, 120);

  if (!/^[A-Za-z0-9_-]{5,300}$/.test(placeId)) return json({ erro: "Escolha a empresa na lista." }, 400);
  if (!respostaValida(b.respostas)) return json({ erro: "Responda as 3 perguntas rápidas." }, 400);
  if (nome.length < 2 || !/^\d{10,11}$/.test(whatsapp) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ erro: "Confira nome, WhatsApp e e-mail." }, 400);
  if (c.consentimento !== true) return json({ erro: "É preciso aceitar o contato para receber o diagnóstico." }, 400);

  const parceiro = typeof b.parceiro === "string" && parceiroPorCodigo(b.parceiro) ? b.parceiro : null;
  const convite = typeof b.convite === "string" ? b.convite.slice(0, 120) : null;

  try {
    const recente = await analiseRecente(placeId);
    const analise: Analise =
      recente && recente.segmento === (segmento ?? recente.segmento)
        ? { ...recente, metricas: { ...recente.metricas, ...lerRespostas(b.respostas) }, analisadoEm: new Date().toISOString() }
        : await analisar(placeId, b.respostas, segmento, typeof b.s === "string" ? b.s : undefined);
    const reg = await inserir({
      place_id: placeId,
      analise,
      contato: { nome, whatsapp, email, consentimentoEm: new Date().toISOString() },
      origem: convite ? "prospeccao" : parceiro ? "parceiro" : "anuncio",
      parceiro,
      convite,
    });
    return json({ id: reg.id });
  } catch (e) {
    console.error("[diagnostico]", e);
    return json({ erro: "Não conseguimos terminar a análise agora. Tente de novo em alguns minutos." }, 502);
  }
}
