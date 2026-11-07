/*
  Leads de exemplo do painel administrativo (fase 1). Na fase 2, tudo vem do Supabase.
  Datas relativas a "hoje" para a fila e os prazos de desconto ficarem realistas no protótipo.
*/
import { segmentos, type SegmentoId } from "./segmentos";

export type Etapa = "diagnostico" | "comprou" | "aplicando" | "reavaliado" | "proposta" | "cliente" | "perdido";
export type Temperatura = "quente" | "morno" | "frio";

export const etapas: { id: Etapa; nome: string }[] = [
  { id: "diagnostico", nome: "Diagnóstico grátis" },
  { id: "comprou", nome: "Comprou o kit" },
  { id: "aplicando", nome: "Aplicando o kit" },
  { id: "reavaliado", nome: "Reavaliado" },
  { id: "proposta", nome: "Pediu proposta" },
  { id: "cliente", nome: "Cliente Elev8" },
  { id: "perdido", nome: "Perdido" },
];

export type Lead = {
  id: string;
  nome: string;
  empresa: string;
  segmento: SegmentoId;
  cidade: string;
  whatsapp: string; // só dígitos, com DDD
  email: string;
  etapa: Etapa;
  comprouKit: boolean;
  score: number;
  diasDesdeDiagnostico: number;
  voltouAoPainel: boolean;
  acoesFeitas: number; // de 12 do plano
  perguntasAssistente: string[];
  servicosVistos: string[];
  proposta?: { resolver: string[]; orcamento: string; prazo: string };
  contrato?: { servico: string; valor: number };
  ultimoContatoDias?: number;
};

const L = (l: Lead) => l;

export const leads: Lead[] = [
  L({ id: "l01", nome: "Ana Souza", empresa: "Clínica Bella Pele", segmento: "estetica", cidade: "Vinhedo", whatsapp: "19991230001", email: "ana@bellapele.com.br", etapa: "proposta", comprouKit: true, score: 38, diasDesdeDiagnostico: 3, voltouAoPainel: true, acoesFeitas: 4, perguntasAssistente: ["Como respondo uma avaliação ruim?", "Quanto custa um site novo?"], servicosVistos: ["Landing Page Estratégica", "Meta Ads + Google Ads"], proposta: { resolver: ["Site ou landing page nova", "Anúncios no Google e no Instagram"], orcamento: "De R$ 1.000 a R$ 3.000", prazo: "Quero começar agora" } }),
  L({ id: "l02", nome: "Ricardo Moura", empresa: "Moura Advocacia", segmento: "advocacia", cidade: "Jundiaí", whatsapp: "11981230002", email: "ricardo@mouraadv.com.br", etapa: "proposta", comprouKit: false, score: 41, diasDesdeDiagnostico: 6, voltouAoPainel: true, acoesFeitas: 7, perguntasAssistente: ["Posso fazer anúncio sendo advogado?"], servicosVistos: ["Google Ads", "SEO e SEO Local"], proposta: { resolver: ["Google Perfil e SEO local"], orcamento: "Até R$ 1.000", prazo: "No próximo mês" } }),
  L({ id: "l03", nome: "Giulia Ferri", empresa: "Cantina da Nonna", segmento: "restaurante", cidade: "Vinhedo", whatsapp: "19991230003", email: "contato@cantinadanonna.com.br", etapa: "comprou", comprouKit: true, score: 44, diasDesdeDiagnostico: 4, voltouAoPainel: false, acoesFeitas: 0, perguntasAssistente: [], servicosVistos: [] }),
  L({ id: "l04", nome: "Marcos Lima", empresa: "Studio Move", segmento: "academia", cidade: "Valinhos", whatsapp: "19991230004", email: "marcos@studiomove.com.br", etapa: "aplicando", comprouKit: true, score: 36, diasDesdeDiagnostico: 12, voltouAoPainel: true, acoesFeitas: 6, perguntasAssistente: ["Faz um post para o Dia do Professor de Educação Física"], servicosVistos: ["Gestão de Redes Sociais"] }),
  L({ id: "l05", nome: "Paula Rocha", empresa: "Pet Vinhedo", segmento: "pet", cidade: "Vinhedo", whatsapp: "19991230005", email: "paula@petvinhedo.com.br", etapa: "reavaliado", comprouKit: true, score: 63, diasDesdeDiagnostico: 31, voltouAoPainel: true, acoesFeitas: 11, perguntasAssistente: ["O que eu faço depois dos 30 dias?"], servicosVistos: ["Meta Ads Essencial"] }),
  L({ id: "l06", nome: "José Almeida", empresa: "Barbearia do Zé", segmento: "beleza", cidade: "Vinhedo", whatsapp: "19991230006", email: "ze@barbeariadoze.com.br", etapa: "diagnostico", comprouKit: false, score: 29, diasDesdeDiagnostico: 2, voltouAoPainel: true, acoesFeitas: 0, perguntasAssistente: [], servicosVistos: [] }),
  L({ id: "l07", nome: "Carla Mendes", empresa: "Ateliê Flor de Lis", segmento: "loja", cidade: "Vinhedo", whatsapp: "19991230007", email: "carla@flordelis.com.br", etapa: "cliente", comprouKit: true, score: 47, diasDesdeDiagnostico: 9, voltouAoPainel: true, acoesFeitas: 5, perguntasAssistente: ["Vale a pena ter loja virtual?"], servicosVistos: ["Loja Virtual / E-commerce"], contrato: { servico: "Site Institucional (até 5 páginas)", valor: 1680 } }),
  L({ id: "l08", nome: "Fernando Dias", empresa: "Bellatrix Contabilidade", segmento: "generico", cidade: "Vinhedo", whatsapp: "19991230008", email: "fernando@bellatrix.com.br", etapa: "diagnostico", comprouKit: false, score: 52, diasDesdeDiagnostico: 1, voltouAoPainel: false, acoesFeitas: 0, perguntasAssistente: [], servicosVistos: [] }),
  L({ id: "l09", nome: "Luciana Prado", empresa: "OdontoVita", segmento: "odontologia", cidade: "Vinhedo", whatsapp: "19991230009", email: "luciana@odontovita.com.br", etapa: "comprou", comprouKit: true, score: 48, diasDesdeDiagnostico: 2, voltouAoPainel: true, acoesFeitas: 2, perguntasAssistente: ["Posso postar antes e depois?"], servicosVistos: [] }),
  L({ id: "l10", nome: "Tiago Ramos", empresa: "Dom Barber", segmento: "beleza", cidade: "Valinhos", whatsapp: "19991230010", email: "tiago@dombarber.com.br", etapa: "diagnostico", comprouKit: false, score: 33, diasDesdeDiagnostico: 5, voltouAoPainel: true, acoesFeitas: 0, perguntasAssistente: [], servicosVistos: ["Landing Page Essencial"] }),
  L({ id: "l11", nome: "Beatriz Costa", empresa: "Espaço Vitta", segmento: "estetica", cidade: "Vinhedo", whatsapp: "19991230011", email: "bia@espacovitta.com.br", etapa: "perdido", comprouKit: false, score: 57, diasDesdeDiagnostico: 20, voltouAoPainel: false, acoesFeitas: 0, perguntasAssistente: [], servicosVistos: [], ultimoContatoDias: 10 }),
  L({ id: "l12", nome: "Renato Silva", empresa: "Mundo Pet", segmento: "pet", cidade: "Vinhedo", whatsapp: "19991230012", email: "renato@mundopet.com.br", etapa: "diagnostico", comprouKit: false, score: 61, diasDesdeDiagnostico: 9, voltouAoPainel: false, acoesFeitas: 0, perguntasAssistente: [], servicosVistos: [] }),
];

/** Temperatura calculada sozinha, pelas regras do documento do produto. */
export function temperatura(l: Lead): Temperatura {
  if (l.etapa === "perdido") return "frio";
  if (l.etapa === "proposta" || (l.etapa !== "diagnostico" && l.servicosVistos.length > 0)) return "quente";
  if (l.etapa !== "diagnostico" || l.voltouAoPainel) return "morno";
  return "frio";
}

export type ItemFila = { lead: Lead; motivo: string; mensagem: string; prioridade: number };

/**
 * Fila de contato do dia: só quem pede ação manual hoje. O resto é coberto pelos e-mails automáticos.
 * Ordem: pediu proposta > desconto de 20% acabando > comprou e parou > voltou ao painel sem comprar > reavaliado.
 */
export function filaDeHoje(lista: Lead[]): ItemFila[] {
  const fila: ItemFila[] = [];
  for (const l of lista) {
    const primeiro = l.nome.split(" ")[0];
    const s = segmentos[l.segmento];
    if (l.etapa === "proposta") {
      fila.push({ lead: l, prioridade: 1, motivo: "Pediu proposta", mensagem: `Oi, ${primeiro}! Aqui é o Gabriel, da Elev8. Recebi seu pedido de proposta pelo Elev8 Score e já estou com o diagnóstico de ${l.empresa} em mãos. Posso te mandar a proposta por aqui ainda hoje?` });
    } else if (l.etapa !== "cliente" && l.etapa !== "perdido" && l.diasDesdeDiagnostico >= 5 && l.diasDesdeDiagnostico <= 7 && l.servicosVistos.length > 0) {
      fila.push({ lead: l, prioridade: 2, motivo: `Desconto de 20% acaba em ${7 - l.diasDesdeDiagnostico + 1} dia(s)`, mensagem: `Oi, ${primeiro}! Vi que você olhou ${l.servicosVistos[0]} no seu painel. Só pra lembrar: o desconto de 20% vale até o fim desta semana. Quer que eu monte uma proposta rápida?` });
    } else if (l.etapa === "comprou" && l.acoesFeitas === 0 && l.diasDesdeDiagnostico >= 3) {
      fila.push({ lead: l, prioridade: 3, motivo: "Comprou o kit e não aplicou nada", mensagem: `Oi, ${primeiro}! Tudo certo com o seu kit? A ação mais rápida é imprimir a plaquinha do QR code e pedir avaliação a 10 ${s.cliente}. Se precisar de ajuda, me chama aqui.` });
    } else if (l.etapa === "diagnostico" && l.voltouAoPainel && l.diasDesdeDiagnostico >= 2) {
      fila.push({ lead: l, prioridade: 4, motivo: "Voltou ao painel e não comprou", mensagem: `Oi, ${primeiro}! Vi que você voltou a olhar o Score Digital de ${l.empresa}. Ficou alguma dúvida sobre o resultado ou sobre o kit? Respondo por aqui mesmo.` });
    } else if (l.etapa === "reavaliado") {
      fila.push({ lead: l, prioridade: 5, motivo: `Reavaliado: score subiu para ${l.score}`, mensagem: `Oi, ${primeiro}! Parabéns, o Score Digital de ${l.empresa} subiu para ${l.score}. O próximo salto depende de anúncios e de um site mais rápido. Quer que eu te mostre como seria?` });
    }
  }
  return fila.sort((a, b) => a.prioridade - b.prioridade);
}

export function linkWhatsApp(numero: string, mensagem: string) {
  return `https://wa.me/55${numero.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;
}

/** Números do topo do admin, calculados da lista (no protótipo, os 12 leads de exemplo). */
export function numeros(lista: Lead[]) {
  const compraram = lista.filter((l) => l.comprouKit).length;
  const propostas = lista.filter((l) => l.etapa === "proposta" || l.proposta || l.contrato).length;
  const clientes = lista.filter((l) => l.etapa === "cliente");
  return {
    diagnosticos: lista.length,
    compras: compraram,
    receitaKit: compraram * 97,
    propostas,
    clientes: clientes.length,
    receitaServicos: clientes.reduce((t, l) => t + (l.contrato?.valor ?? 0), 0),
  };
}
