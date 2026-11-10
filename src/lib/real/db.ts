/*
  Banco de dados (Supabase, via API REST). Só roda no servidor, com a chave service_role.
  As tabelas ficam com RLS ligado e sem nenhuma política pública: o navegador nunca lê nem grava direto.
  Esquema em supabase/schema.sql.
*/
import type { Analise, FormKit } from "./analise";

// Lido em tempo de execução (colchetes evitam que o build fixe o valor). Aceita os dois nomes.
const URL_BASE = () => (process.env["SUPABASE_URL"] ?? process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "").replace(/\/$/, "");
const CHAVE = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const bancoConfigurado = () => URL_BASE().length > 0 && CHAVE().length > 0;

export const ehUuid = (t: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t);

export type Contato = { nome: string; whatsapp: string; email: string; consentimentoEm: string };

export type Registro = {
  id: string;
  criado_em: string;
  place_id: string;
  analise: Analise;
  contato: Contato;
  origem: "anuncio" | "prospeccao" | "parceiro";
  parceiro: string | null;
  convite: string | null;
  form_kit: FormKit;
  plano_feitas: string[];
  pago: boolean;
  pago_em: string | null;
  pagamento_id: string | null;
  etapa: string;
  notas: string | null;
  proposta: { resolver: string[]; orcamento: string; prazo: string } | null;
  score_vivo: boolean;
};

async function rest<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`${URL_BASE()}/rest/v1/${caminho}`, {
    ...init,
    headers: {
      apikey: CHAVE(),
      Authorization: `Bearer ${CHAVE()}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error(`Banco respondeu ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const t = await r.text();
  return (t ? JSON.parse(t) : null) as T;
}

export async function inserir(dados: Pick<Registro, "place_id" | "analise" | "contato" | "origem" | "parceiro" | "convite">): Promise<Registro> {
  const [r] = await rest<Registro[]>("diagnosticos", { method: "POST", body: JSON.stringify(dados) });
  return r;
}

export async function obter(id: string): Promise<Registro | null> {
  if (!ehUuid(id)) return null;
  const r = await rest<Registro[]>(`diagnosticos?id=eq.${id}&limit=1`);
  return r[0] ?? null;
}

export async function atualizar(id: string, patch: Partial<Registro>): Promise<Registro | null> {
  if (!ehUuid(id)) return null;
  const r = await rest<Registro[]>(`diagnosticos?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  return r[0] ?? null;
}

export async function listar(limite = 500): Promise<Registro[]> {
  return rest<Registro[]>(`diagnosticos?order=criado_em.desc&limit=${limite}`);
}

/** Análise da mesma empresa feita nas últimas horas: reaproveita e evita pagar o Google duas vezes. */
export async function analiseRecente(placeId: string, horas = 24): Promise<Analise | null> {
  const desde = new Date(Date.now() - horas * 3600e3).toISOString();
  const r = await rest<Pick<Registro, "analise">[]>(
    `diagnosticos?select=analise&place_id=eq.${encodeURIComponent(placeId)}&criado_em=gte.${encodeURIComponent(desde)}&order=criado_em.desc&limit=1`,
  );
  return r[0]?.analise ?? null;
}

export async function descadastrar(email: string): Promise<void> {
  await rest("descadastros", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates" }, body: JSON.stringify({ email: email.trim().toLowerCase() }) });
}
