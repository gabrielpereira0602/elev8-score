import { empresasDemo } from "./contexto";
// Fase 1: sugestões simuladas. Na fase 2, a busca usa o Google Places Autocomplete
// e os concorrentes vêm da mesma busca no Google Maps.

export type Negocio = {
  id: string;
  nome: string;
  endereco: string;
  categoria: string;
  nota: number;
  avaliacoes: number;
};

// Protótipo: as empresas da busca são as mesmas do painel (contexto.ts), para a jornada ser coerente.
const categorias: Record<string, string> = {
  estetica: "Clínica de estética",
  odontologia: "Dentista",
  advocacia: "Advogado trabalhista",
  restaurante: "Restaurante italiano",
  academia: "Studio de pilates",
  pet: "Pet shop",
  beleza: "Barbearia",
  loja: "Loja de roupas",
  generico: "Escritório de contabilidade",
};

export const negocios: Negocio[] = empresasDemo.map((e) => ({
  id: e.segmento,
  nome: e.nome,
  endereco: `${e.endereco} · ${e.cidade}, ${e.uf}`,
  categoria: categorias[e.segmento] ?? e.buscaTermo,
  nota: 4.6,
  avaliacoes: 23,
}));

export const concorrentesSugeridos = [
  { nome: "Estética Lumière", endereco: "1,2 km · Centro", nota: 4.8, avaliacoes: 187 },
  { nome: "Clínica Aurora", endereco: "2,0 km · Jardim Paulista", nota: 4.7, avaliacoes: 112 },
  { nome: "Espaço Vitta", endereco: "2,6 km · Santa Claudina", nota: 4.5, avaliacoes: 74 },
];

export function buscarNegocios(termo: string): Negocio[] {
  const t = termo.trim().toLowerCase();
  if (t.length < 2) return [];
  return negocios.filter((n) => n.nome.toLowerCase().includes(t) || n.categoria.toLowerCase().includes(t));
}
