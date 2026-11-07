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

export const negocios: Negocio[] = [
  { id: "bella", nome: "Clínica Bella Pele", endereco: "Av. Independência, 1200 · Vinhedo, SP", categoria: "Clínica de estética", nota: 4.6, avaliacoes: 23 },
  { id: "bella-studio", nome: "Bella Studio Cabelos", endereco: "R. Monteiro de Barros, 340 · Vinhedo, SP", categoria: "Salão de beleza", nota: 4.8, avaliacoes: 61 },
  { id: "belo-sorriso", nome: "Belo Sorriso Odontologia", endereco: "R. Humberto Pescarini, 88 · Vinhedo, SP", categoria: "Dentista", nota: 4.7, avaliacoes: 142 },
  { id: "padaria", nome: "Padaria Vinhedo Pães", endereco: "Av. dos Imigrantes, 455 · Vinhedo, SP", categoria: "Padaria", nota: 4.4, avaliacoes: 310 },
  { id: "bellatrix", nome: "Bellatrix Contabilidade", endereco: "R. Barão de Itapura, 77 · Vinhedo, SP", categoria: "Escritório de contabilidade", nota: 4.9, avaliacoes: 18 },
];

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
