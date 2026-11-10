import { googleConfigurado, sugerir } from "@/lib/real/google";
import { dentroDoLimite, ipDe, json } from "@/lib/real/servidor";

/** Sugestões de empresas enquanto a pessoa digita. */
export async function GET(req: Request) {
  if (!googleConfigurado()) return json({ demo: true, sugestoes: [] });
  const u = new URL(req.url);
  const q = (u.searchParams.get("q") ?? "").trim().slice(0, 120);
  const s = (u.searchParams.get("s") ?? "").slice(0, 80);
  if (q.length < 3) return json({ sugestoes: [] });
  if (!dentroDoLimite(`busca:${ipDe(req)}`, 90, 60e3)) return json({ erro: "Calma, muitas buscas seguidas." }, 429);
  try {
    return json({ sugestoes: await sugerir(q, s) });
  } catch (e) {
    console.error("[busca]", e);
    return json({ erro: "Não foi possível buscar agora. Tente de novo em instantes." }, 502);
  }
}
