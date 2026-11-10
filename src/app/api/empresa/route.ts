import { detalhes, googleConfigurado } from "@/lib/real/google";
import { cidadeUf } from "@/lib/real/analise";
import { detectarSegmento } from "@/lib/segmentos";
import { dentroDoLimite, ipDe, json } from "@/lib/real/servidor";

/** Dados básicos da empresa escolhida, para a tela de confirmação. */
export async function GET(req: Request) {
  if (!googleConfigurado()) return json({ erro: "Busca real não configurada." }, 503);
  const u = new URL(req.url);
  const id = u.searchParams.get("id") ?? "";
  if (!/^[A-Za-z0-9_-]{5,300}$/.test(id)) return json({ erro: "Empresa inválida." }, 400);
  if (!dentroDoLimite(`empresa:${ipDe(req)}`, 30, 60e3)) return json({ erro: "Muitas consultas seguidas." }, 429);
  try {
    const l = await detalhes(id, u.searchParams.get("s") ?? undefined);
    const { cidade, uf } = cidadeUf(l);
    const categoria = l.primaryTypeDisplayName?.text ?? "";
    return json({
      negocio: {
        id: l.id,
        nome: l.displayName?.text ?? "",
        endereco: [l.formattedAddress?.split(" - ")[0], cidade && uf ? `${cidade}, ${uf}` : ""].filter(Boolean).join(" · "),
        categoria,
        nota: l.rating ?? 0,
        avaliacoes: l.userRatingCount ?? 0,
      },
      segmento: detectarSegmento(categoria),
      fechada: l.businessStatus === "CLOSED_PERMANENTLY",
    });
  } catch (e) {
    console.error("[empresa]", e);
    return json({ erro: "Não foi possível abrir os dados dessa empresa agora." }, 502);
  }
}
