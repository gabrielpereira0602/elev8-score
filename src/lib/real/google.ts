/*
  Google Places API (New) e PageSpeed Insights. Só roda no servidor: a chave nunca vai para o navegador.

  Custo por diagnóstico (estimativa, preços públicos de 2026): 1 Place Details + 1 Text Search, ambos com
  campos de avaliação (nível Enterprise), e o PageSpeed (gratuito). A busca enquanto a pessoa digita usa
  Autocomplete com token de sessão: fechada com o Place Details, as buscas da sessão não são cobradas.
*/

const KEY = () => process.env.GOOGLE_PLACES_API_KEY ?? "";
export const googleConfigurado = () => KEY().length > 0;

const BASE = process.env.GOOGLE_PLACES_BASE_URL ?? "https://places.googleapis.com/v1"; // trocar só em teste

export type Sugestao = { id: string; nome: string; endereco: string };

export type LugarGoogle = {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  addressComponents?: { longText: string; shortText: string; types: string[] }[];
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  photos?: unknown[];
  websiteUri?: string;
  nationalPhoneNumber?: string;
  regularOpeningHours?: unknown;
  primaryType?: string;
  primaryTypeDisplayName?: { text: string };
  googleMapsUri?: string;
  businessStatus?: string;
};

const CAMPOS_DETALHE = [
  "id",
  "displayName",
  "formattedAddress",
  "addressComponents",
  "location",
  "rating",
  "userRatingCount",
  "photos",
  "websiteUri",
  "nationalPhoneNumber",
  "regularOpeningHours",
  "primaryType",
  "primaryTypeDisplayName",
  "googleMapsUri",
  "businessStatus",
].join(",");

const CAMPOS_BUSCA = ["id", "displayName", "formattedAddress", "rating", "userRatingCount", "photos", "websiteUri", "nationalPhoneNumber", "regularOpeningHours", "primaryType"]
  .map((c) => `places.${c}`)
  .join(",");

async function chamar<T>(url: string, init: RequestInit & { campos?: string }): Promise<T> {
  const r = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY(), ...(init.campos ? { "X-Goog-FieldMask": init.campos } : {}) },
    signal: AbortSignal.timeout(12000),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Google respondeu ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json() as Promise<T>;
}

/** Sugestões enquanto a pessoa digita o nome da empresa (só Brasil). */
export async function sugerir(texto: string, sessionToken: string): Promise<Sugestao[]> {
  type R = { suggestions?: { placePrediction?: { placeId: string; structuredFormat?: { mainText?: { text: string }; secondaryText?: { text: string } }; text?: { text: string } } }[] };
  const r = await chamar<R>(`${BASE}/places:autocomplete`, {
    method: "POST",
    body: JSON.stringify({ input: texto, sessionToken, languageCode: "pt-BR", includedRegionCodes: ["br"] }),
  });
  return (r.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 6)
    .map((p) => ({
      id: p.placeId,
      nome: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
      endereco: p.structuredFormat?.secondaryText?.text ?? "",
    }));
}

// Cache curto: a confirmação da empresa e o diagnóstico usam o mesmo Place Details (paga uma vez só).
const cache = new Map<string, { em: number; lugar: LugarGoogle }>();

export async function detalhes(id: string, sessionToken?: string): Promise<LugarGoogle> {
  const c = cache.get(id);
  if (c && Date.now() - c.em < 30 * 60e3) return c.lugar;
  const q = new URLSearchParams({ languageCode: "pt-BR", regionCode: "BR" });
  if (sessionToken) q.set("sessionToken", sessionToken);
  const lugar = await chamar<LugarGoogle>(`${BASE}/places/${encodeURIComponent(id)}?${q}`, { method: "GET", campos: CAMPOS_DETALHE });
  if (cache.size > 2000) cache.clear();
  cache.set(id, { em: Date.now(), lugar });
  return lugar;
}

/** A mesma busca que um cliente faria ("dentista em Vinhedo"), perto da empresa. */
export async function buscarNaRegiao(textoBusca: string, centro?: { latitude: number; longitude: number }): Promise<LugarGoogle[]> {
  const r = await chamar<{ places?: LugarGoogle[] }>(`${BASE}/places:searchText`, {
    method: "POST",
    campos: CAMPOS_BUSCA,
    body: JSON.stringify({
      textQuery: textoBusca,
      languageCode: "pt-BR",
      regionCode: "BR",
      pageSize: 20,
      ...(centro ? { locationBias: { circle: { center: centro, radius: 8000 } } } : {}),
    }),
  });
  return r.places ?? [];
}

/** Nota de desempenho do site no celular (0 a 100) pelo PageSpeed. null quando não foi possível medir. */
export async function velocidadeSite(url: string): Promise<number | null> {
  const q = new URLSearchParams({ url, strategy: "mobile", category: "performance" });
  const chave = process.env.GOOGLE_PAGESPEED_API_KEY || KEY();
  if (chave) q.set("key", chave);
  try {
    const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, { signal: AbortSignal.timeout(40000), cache: "no-store" });
    if (!r.ok) return null;
    const j = (await r.json()) as { lighthouseResult?: { categories?: { performance?: { score?: number } } } };
    const s = j.lighthouseResult?.categories?.performance?.score;
    return typeof s === "number" ? Math.round(s * 100) : null;
  } catch {
    return null;
  }
}
