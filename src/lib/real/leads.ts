/* Admin: leads reais (banco) no mesmo formato dos leads de exemplo, para as mesmas telas servirem aos dois. */
import { leads as leadsDemo, type Etapa, type Lead } from "../admin-mock";
import { calcularScore } from "../score";
import { bancoConfigurado, listar, type Registro } from "./db";

const ETAPA_DO_BANCO: Record<string, Etapa> = { novo: "diagnostico", negociando: "proposta" };

export function registroParaLead(r: Registro): Lead {
  const a = r.analise;
  const etapaBase = (ETAPA_DO_BANCO[r.etapa] ?? r.etapa) as Etapa;
  const etapa: Etapa = etapaBase === "comprou" && r.plano_feitas.length > 0 ? "aplicando" : etapaBase;
  return {
    id: r.id,
    nome: r.contato.nome,
    empresa: a.nome,
    segmento: a.segmento,
    cidade: [a.cidade, a.uf].filter(Boolean).join(", "),
    whatsapp: r.contato.whatsapp,
    email: r.contato.email,
    etapa,
    comprouKit: r.pago,
    score: calcularScore(a.metricas, a.lider).total,
    diasDesdeDiagnostico: Math.max(0, Math.floor((Date.now() - new Date(r.criado_em).getTime()) / 864e5)),
    voltouAoPainel: false,
    acoesFeitas: r.plano_feitas.length,
    perguntasAssistente: [],
    servicosVistos: [],
    proposta: r.proposta ?? undefined,
    origem: r.origem,
    parceiro: r.parceiro ?? undefined,
    scoreVivo: r.score_vivo,
  };
}

/** Leads reais quando o banco está ligado; senão, os de exemplo (protótipo). */
export async function carregarLeads(): Promise<{ leads: Lead[]; real: boolean; registros: Registro[] }> {
  if (!bancoConfigurado()) return { leads: leadsDemo, real: false, registros: [] };
  const registros = await listar();
  return { leads: registros.map(registroParaLead), real: true, registros };
}

/** Ciclo do concorrente com dados reais: concorrentes que apareceram nos diagnósticos e ainda não são leads. */
export function prospectosReais(registros: Registro[]) {
  const leadsIds = new Set(registros.map((r) => r.place_id));
  const vistos = new Set<string>();
  const lista: {
    codigo: string;
    nome: string;
    segmento: Registro["analise"]["segmento"];
    cidade: string;
    busca: string;
    posicao: number;
    nota: number;
    telefone?: string;
    site?: string;
    virouLead: boolean;
    veioDe: string;
  }[] = [];
  for (const r of registros) {
    for (const c of r.analise.concorrentes ?? []) {
      if (vistos.has(c.id)) continue;
      vistos.add(c.id);
      lista.push({
        codigo: c.id,
        nome: c.nome,
        segmento: r.analise.segmento,
        cidade: r.analise.cidade,
        busca: `${r.analise.buscaTermo} em ${r.analise.cidade}`,
        posicao: c.posicao,
        nota: c.nota,
        telefone: c.telefone,
        site: c.site,
        virouLead: leadsIds.has(c.id),
        veioDe: r.analise.nome,
      });
    }
  }
  return lista;
}
