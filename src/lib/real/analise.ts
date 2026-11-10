/*
  Diagnóstico real: junta Google (perfil e concorrentes), site (velocidade e clareza) e as respostas do dono
  numa análise que o banco guarda. A partir dela, montarDadosReais() alimenta o mesmo contexto das telas.

  De onde vem cada número (mostrado nas telas como Observado ou Informado):
  - Observado (Google): avaliações, nota, fotos (o Google entrega no máximo 10 por empresa), perfil preenchido,
    posição na busca e concorrentes.
  - Observado (site): velocidade no celular (PageSpeed) e clareza (leitura da página inicial).
  - Informado (dono): bio do Instagram, posts por semana e respostas às avaliações.
*/
import type { DadosReais, EmpresaDemo } from "../contexto";
import { calcularScore, type Lider, type Metricas } from "../score";
import { detectarSegmento, segmentos, type SegmentoId } from "../segmentos";
import { buscarNaRegiao, detalhes, velocidadeSite, type LugarGoogle } from "./google";
import { clarezaSite } from "./site";

export type Respostas = {
  bio: "sim" | "nao" | "sem-instagram";
  posts: 0 | 1 | 2 | 3;
  respostas: "todas" | "algumas" | "nenhuma" | "sem-avaliacoes";
};

/** O que o dono completa depois da compra para o kit sair com os dados dele. */
export type FormKit = { servico?: string; preco?: string; diferencial?: string; cor?: string; bio?: string };

export type Analise = {
  placeId: string;
  segmento: SegmentoId;
  nome: string;
  cidade: string;
  uf: string;
  endereco: string;
  buscaTermo: string;
  genero: "o" | "a";
  metricas: Metricas;
  lider: Lider;
  liderEtapas: { encontrado: number; entendido: number; escolhido: number };
  ranking: { nome: string; nota: number }[];
  posicao: number | null;
  google: { telefone?: string; site?: string; maps?: string; categoria?: string };
  /** Concorrentes da mesma busca, com contato público (Ciclo do concorrente). */
  concorrentes?: { id: string; nome: string; posicao: number; nota: number; telefone?: string; site?: string }[];
  analisadoEm: string;
};

const GENERICOS = new Set(["point_of_interest", "establishment", "store", "service", "premise"]);

export function perfilPreenchido(l: LugarGoogle): number {
  let p = 0;
  if (l.nationalPhoneNumber) p += 20;
  if (l.websiteUri) p += 20;
  if (l.regularOpeningHours) p += 20;
  if ((l.photos?.length ?? 0) >= 5) p += 20;
  if (l.primaryType && !GENERICOS.has(l.primaryType)) p += 10;
  if (l.formattedAddress) p += 10;
  return p;
}

/** Métricas que dá para tirar só dos dados públicos (usadas para os concorrentes). */
export function metricasPublicas(l: LugarGoogle): Metricas {
  return {
    avaliacoes: l.userRatingCount ?? 0,
    fotos: l.photos?.length ?? 0,
    perfilPreenchido: perfilPreenchido(l),
    velocidadeSite: null,
    bioClara: null,
    postsPorSemana: null,
    respostasAvaliacoes: null,
    estrelas: l.userRatingCount ? (l.rating ?? null) : null,
    siteClaro: null,
  };
}

export function lerRespostas(r: Respostas): Pick<Metricas, "bioClara" | "postsPorSemana" | "respostasAvaliacoes"> {
  return {
    bioClara: r.bio === "sim",
    postsPorSemana: r.posts,
    respostasAvaliacoes: r.respostas === "todas" ? 100 : r.respostas === "algumas" ? 50 : r.respostas === "nenhuma" ? 0 : null,
  };
}

export function cidadeUf(l: LugarGoogle): { cidade: string; uf: string } {
  const c = l.addressComponents ?? [];
  const cidade = c.find((x) => x.types.includes("administrative_area_level_2"))?.longText ?? c.find((x) => x.types.includes("locality"))?.longText ?? "";
  const uf = c.find((x) => x.types.includes("administrative_area_level_1"))?.shortText ?? "";
  return { cidade, uf };
}

/** Termo que um cliente digitaria, a partir da categoria do Google. */
export function termoDeBusca(l: LugarGoogle, segmento: SegmentoId): { termo: string; genero: "o" | "a" } {
  const cat = l.primaryTypeDisplayName?.text?.trim();
  const termo = cat && !/^(estabelecimento|empresa|loja)$/i.test(cat) ? cat.charAt(0).toLowerCase() + cat.slice(1) : segmentos[segmento].nome.toLowerCase();
  const primeira = termo.split(" ")[0];
  const genero: "o" | "a" = /a$/.test(primeira) && !/ista$/.test(primeira) ? "a" : "o";
  return { termo, genero };
}

/** Parte pura: monta a análise a partir das respostas do Google e do site (testável sem internet). */
export function montarAnalise(
  lugar: LugarGoogle,
  resultadosBusca: LugarGoogle[],
  site: { velocidade: number | null; clareza: number | null },
  respostas: Respostas,
  segmentoEscolhido?: SegmentoId,
  agora = new Date(),
): Analise {
  const segmento = segmentoEscolhido ?? detectarSegmento(lugar.primaryTypeDisplayName?.text ?? "");
  const { cidade, uf } = cidadeUf(lugar);
  const { termo, genero } = termoDeBusca(lugar, segmento);
  const indice = resultadosBusca.findIndex((x) => x.id === lugar.id);
  const concorrentes = resultadosBusca.filter((x) => x.id !== lugar.id).slice(0, 3);
  const primeiro = concorrentes[0];
  const lider: Lider = primeiro ? { avaliacoes: primeiro.userRatingCount ?? 0, fotos: primeiro.photos?.length ?? 0 } : { avaliacoes: 0, fotos: 0 };

  const metricas: Metricas = {
    ...metricasPublicas(lugar),
    velocidadeSite: lugar.websiteUri ? site.velocidade : null,
    siteClaro: lugar.websiteUri ? site.clareza : 0,
    ...lerRespostas(respostas),
  };
  // Sem site: velocidade fica sem medida (não pesa), mas clareza conta como 0, porque quem procura não encontra um site.
  if (!lugar.websiteUri) metricas.velocidadeSite = null;

  const etapasLider = primeiro ? calcularScore(metricasPublicas(primeiro), lider) : { encontrado: 0, entendido: 0, escolhido: 0, total: 0 };

  return {
    placeId: lugar.id,
    segmento,
    nome: lugar.displayName?.text ?? "Sua empresa",
    cidade,
    uf,
    endereco: (lugar.formattedAddress ?? "").split(" - ")[0],
    buscaTermo: termo,
    genero,
    metricas,
    lider,
    liderEtapas: { encontrado: etapasLider.encontrado, entendido: etapasLider.entendido, escolhido: etapasLider.escolhido },
    ranking: concorrentes.map((c) => ({ nome: c.displayName?.text ?? "Concorrente", nota: calcularScore(metricasPublicas(c), lider).total })),
    posicao: indice >= 0 ? indice + 1 : null,
    google: { telefone: lugar.nationalPhoneNumber, site: lugar.websiteUri, maps: lugar.googleMapsUri, categoria: lugar.primaryTypeDisplayName?.text },
    concorrentes: concorrentes.map((c) => ({
      id: c.id,
      nome: c.displayName?.text ?? "Concorrente",
      posicao: resultadosBusca.findIndex((x) => x.id === c.id) + 1,
      nota: calcularScore(metricasPublicas(c), lider).total,
      telefone: c.nationalPhoneNumber,
      site: c.websiteUri,
    })),
    analisadoEm: agora.toISOString(),
  };
}

/** Parte com internet: consulta Google e site e devolve a análise pronta para salvar. */
export async function analisar(placeId: string, respostas: Respostas, segmento?: SegmentoId, sessionToken?: string): Promise<Analise> {
  const lugar = await detalhes(placeId, sessionToken);
  const seg = segmento ?? detectarSegmento(lugar.primaryTypeDisplayName?.text ?? "");
  const { cidade } = cidadeUf(lugar);
  const { termo } = termoDeBusca(lugar, seg);
  const [busca, velocidade, clareza] = await Promise.all([
    buscarNaRegiao(`${termo} em ${cidade}`, lugar.location).catch(() => [] as LugarGoogle[]),
    lugar.websiteUri ? velocidadeSite(lugar.websiteUri) : Promise.resolve(null),
    lugar.websiteUri ? clarezaSite(lugar.websiteUri, cidade) : Promise.resolve(null),
  ]);
  return montarAnalise(lugar, busca, { velocidade, clareza }, respostas, seg);
}

/** Junta a análise salva, o formulário do kit e o estado do plano no formato que as telas usam. */
export function montarDadosReais(id: string, a: Analise, form: FormKit = {}, feitas = 0): DadosReais {
  const s = segmentos[a.segmento] ?? segmentos.generico;
  const empresa: EmpresaDemo = {
    segmento: a.segmento,
    nome: a.nome,
    tipo: `${a.genero === "a" ? "uma" : "um"} ${a.buscaTermo}`,
    cidade: a.cidade || "sua cidade",
    uf: a.uf,
    endereco: a.endereco,
    buscaTermo: a.buscaTermo,
    genero: a.genero,
    servico: form.servico?.trim() ? form.servico.trim() : `o atendimento ${s.permitePreco ? "principal" : "inicial"}`,
    preco: s.permitePreco && form.preco?.trim() ? form.preco.trim() : undefined,
    cor: /^#[0-9a-f]{6}$/i.test(form.cor ?? "") ? form.cor! : "#0066FF",
    diferencial: form.diferencial?.trim() ? form.diferencial.trim() : "[seu diferencial]",
    bioAtual: form.bio?.trim() ? form.bio.trim() : "(bio não informada)",
    concorrentes: [a.ranking[0]?.nome ?? "1º colocado", a.ranking[1]?.nome ?? "2º colocado", a.ranking[2]?.nome ?? "3º colocado"],
  };
  return {
    id,
    empresa,
    metricas: a.metricas,
    lider: a.lider,
    liderEtapas: a.liderEtapas,
    ranking: a.ranking,
    posicao: a.posicao,
    dataISO: a.analisadoEm,
    feitas,
    linkAvaliacao: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(a.placeId)}`,
  };
}
