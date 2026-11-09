/*
  Ciclo do concorrente.

  Cada diagnóstico já analisa 3 concorrentes do mesmo nicho na mesma cidade. Cada um deles vira um prospecto
  qualificado: a Elev8 já sabe o nicho, a posição na busca e o Score. O convite sai por e-mail, sozinho.

  Regras (valem também para a fase 2):
  - Um convite por empresa, nunca mais de um. Até 20 por dia, para proteger a entrega dos e-mails.
  - Nunca para quem já é lead, cliente ou pediu para não receber.
  - O convite nunca diz quem fez o diagnóstico. Só fala da busca pública e da posição da empresa.
  - Sem e-mail público da empresa: fica na lista para contato manual pelo WhatsApp, se você quiser.
  Métrica principal: fator do ciclo = diagnósticos vindos de convite ÷ diagnósticos de outras origens.
  Acima de 1, cada diagnóstico traz mais de um diagnóstico novo, e o ciclo se alimenta sozinho.
*/
import { leads, type Lead } from "./admin-mock";
import { contexto } from "./contexto";
import { segmentos, type SegmentoId } from "./segmentos";
import { CATEGORIAS_BUSCA, type Negocio } from "./busca-mock";

export type StatusProspecto = "na-fila" | "enviado" | "abriu" | "virou-lead" | "descadastrou" | "sem-email";

export const STATUS_PROSPECTO: Record<StatusProspecto, { nome: string; tom: "brand" | "good" | "muted" | "warn" }> = {
  "na-fila": { nome: "Na fila de envio", tom: "muted" },
  enviado: { nome: "Convite enviado", tom: "brand" },
  abriu: { nome: "Abriu o e-mail", tom: "warn" },
  "virou-lead": { nome: "Fez o diagnóstico", tom: "good" },
  descadastrou: { nome: "Pediu para não receber", tom: "muted" },
  "sem-email": { nome: "Sem e-mail público", tom: "muted" },
};

export type Prospecto = {
  codigo: string;
  nome: string;
  segmento: SegmentoId;
  cidade: string;
  busca: string;
  posicao: number;
  nota: number;
  email?: string;
  telefone: string;
  status: StatusProspecto;
  /** Diagnóstico que revelou este prospecto (só para o admin; nunca aparece no convite). */
  veioDe: string;
};

export const slug = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Protótipo: status e canais fixos por posição na lista, para a tela ficar estável. Na fase 2 vêm do banco.
const STATUS_DEMO: StatusProspecto[] = ["enviado", "abriu", "na-fila", "sem-email", "enviado", "na-fila", "descadastrou", "abriu", "na-fila"];

export function prospectos(lista: Lead[] = leads): Prospecto[] {
  const jaSaoLeads = new Set(lista.map((l) => slug(l.empresa)));
  const vistos = new Set<string>();
  const saida: Prospecto[] = [];
  let i = 0;
  for (const l of lista.filter((x) => x.origem !== "prospeccao")) {
    const ctx = contexto(l.segmento);
    ctx.diagnostico.ranking.forEach((r, pos) => {
      if (r.voce) return;
      const codigo = slug(r.nome);
      if (vistos.has(codigo)) return;
      vistos.add(codigo);
      const virou = jaSaoLeads.has(codigo);
      const status: StatusProspecto = virou ? "virou-lead" : STATUS_DEMO[i++ % STATUS_DEMO.length];
      saida.push({
        codigo,
        nome: r.nome,
        segmento: l.segmento,
        cidade: ctx.empresa.cidade,
        busca: ctx.diagnostico.busca,
        posicao: pos + 1,
        nota: r.nota,
        email: status === "sem-email" ? undefined : `contato@${codigo.replace(/-/g, "")}.com.br`,
        telefone: `19 9${String(8000 + saida.length * 37).padStart(4, "0")}-${String(1000 + saida.length * 91).slice(-4)}`,
        status,
        veioDe: l.empresa,
      });
    });
  }
  return saida;
}

/** Números do ciclo para o topo da tela de prospecção. */
export function numerosCiclo(lista: Lead[] = leads) {
  const p = prospectos(lista);
  const deConvite = lista.filter((l) => l.origem === "prospeccao").length;
  const outros = lista.length - deConvite;
  return {
    encontrados: p.length + deConvite,
    enviados: p.filter((x) => x.status !== "na-fila" && x.status !== "sem-email").length + deConvite,
    viraramLead: deConvite,
    fator: outros === 0 ? 0 : deConvite / outros,
  };
}

/** Empresa do link de convite, já pronta para a entrada pular a busca. */
export function negocioDoConvite(codigo: string): { negocio: Negocio; segmento: SegmentoId } | null {
  const p = prospectos().find((x) => x.codigo === codigo);
  if (!p) return null;
  return {
    segmento: p.segmento,
    negocio: {
      id: p.codigo,
      nome: p.nome,
      endereco: `${p.cidade}, SP`,
      categoria: CATEGORIAS_BUSCA[p.segmento] ?? segmentos[p.segmento].nome,
      nota: 4.5,
      avaliacoes: 0,
    },
  };
}
