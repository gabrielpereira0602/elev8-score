/*
  Contexto de uma empresa: tudo o que o painel e o kit mostram, montado a partir da ficha do nicho
  (segmentos.ts) e dos dados da empresa. Nenhuma tela escreve texto de nicho por conta própria;
  todas leem daqui. Na fase 2, os dados vêm do Google e do formulário; na fase 3, a IA reescreve
  os textos dentro desta mesma estrutura.
*/
import { aplicarKit, calcularScore } from "./score";
import { liderBusca, metricasHoje, type Diagnostico, type Status } from "./mock";
import { segmentos, type Segmento, type SegmentoId } from "./segmentos";
import type { Empresa } from "./posts";

export type EmpresaDemo = Empresa & {
  uf: string;
  endereco: string;
  buscaTermo: string; // como o cliente procura no Google: "clínica de estética", "advogado trabalhista"
  genero: "o" | "a"; // gênero do termo de busca, para a frase sair certa: "o melhor dentista", "a melhor barbearia"
  tipo: string; // como a empresa se descreve: "uma clínica de estética", "um escritório de advocacia"
  diferencial: string; // informado no formulário pós-compra
  bioAtual: string;
  concorrentes: [string, string, string]; // do 1º ao 3º colocado na mesma busca
};

export const empresasDemo: EmpresaDemo[] = [
  { segmento: "estetica", nome: "Clínica Bella Pele", tipo: "uma clínica de estética", cidade: "Vinhedo", uf: "SP", endereco: "Av. Independência, 1200", buscaTermo: "clínica de estética", genero: "a", servico: "a limpeza de pele profunda", preco: "R$ 180", cor: "#B5476B", diferencial: "Atendimento individual e avaliação da pele incluída", bioAtual: "Clínica de estética 💆‍♀️✨ Vinhedo/SP Agende já!", concorrentes: ["Estética Lumière", "Clínica Aurora", "Espaço Vitta"] },
  { segmento: "odontologia", nome: "Belo Sorriso Odontologia", tipo: "um consultório odontológico", cidade: "Vinhedo", uf: "SP", endereco: "R. Humberto Pescarini, 88", buscaTermo: "dentista", genero: "o", servico: "o clareamento dental", preco: "R$ 900", cor: "#0E8A8A", diferencial: "Consultas com hora marcada, sem espera", bioAtual: "Odontologia 🦷 Vinhedo", concorrentes: ["OdontoVita", "Clínica Sorrir", "Dental Center Vinhedo"] },
  { segmento: "advocacia", nome: "Moura Advocacia", tipo: "um escritório de advocacia", cidade: "Jundiaí", uf: "SP", endereco: "R. Barão de Jundiaí, 410", buscaTermo: "advogado trabalhista", genero: "o", servico: "direito do trabalho", cor: "#1F2A44", diferencial: "Atendimento direto com o advogado responsável pelo caso", bioAtual: "Advocacia ⚖️ Jundiaí", concorrentes: ["Prado & Lima Advogados", "Escritório Ferraz", "Souza Advocacia"] },
  { segmento: "restaurante", nome: "Cantina da Nonna", tipo: "um restaurante italiano", cidade: "Vinhedo", uf: "SP", endereco: "Av. dos Imigrantes, 900", buscaTermo: "restaurante italiano", genero: "o", servico: "o almoço executivo", preco: "R$ 39", cor: "#C0392B", diferencial: "Massa fresca feita na casa todos os dias", bioAtual: "Cantina italiana 🍝", concorrentes: ["Trattoria Bellini", "Osteria Verde", "Casa Toscana"] },
  { segmento: "academia", nome: "Studio Move", tipo: "um estúdio de pilates", cidade: "Valinhos", uf: "SP", endereco: "R. Sete de Setembro, 150", buscaTermo: "estúdio de pilates", genero: "o", servico: "o plano mensal de pilates", preco: "R$ 290", cor: "#F2C230", diferencial: "Turmas de no máximo 4 alunos", bioAtual: "Pilates • Funcional 💪", concorrentes: ["Pilates Equilíbrio", "Core Studio", "Viva Pilates"] },
  { segmento: "pet", nome: "Pet Vinhedo", tipo: "um pet shop", cidade: "Vinhedo", uf: "SP", endereco: "R. Monteiro de Barros, 512", buscaTermo: "pet shop", genero: "o", servico: "o banho e tosa", preco: "R$ 75", cor: "#2E8B57", diferencial: "Buscamos e levamos o seu pet em casa", bioAtual: "Pet shop 🐶🐱", concorrentes: ["Mundo Pet", "PetLand Vinhedo", "Cão & Cia"] },
  { segmento: "beleza", nome: "Barbearia do Zé", tipo: "uma barbearia", cidade: "Vinhedo", uf: "SP", endereco: "Av. Benedicto Storani, 77", buscaTermo: "barbearia", genero: "a", servico: "o corte com barba", preco: "R$ 60", cor: "#8B5A2B", diferencial: "Horário marcado, sem fila", bioAtual: "Barbearia ✂️", concorrentes: ["Barbearia Vintage", "Dom Barber", "Navalha de Ouro"] },
  { segmento: "loja", nome: "Ateliê Flor de Lis", tipo: "uma loja de moda feminina", cidade: "Vinhedo", uf: "SP", endereco: "R. Dr. Ivo Bauer, 33", buscaTermo: "loja de roupas femininas", genero: "a", servico: "a nova coleção", preco: "R$ 129", cor: "#7A4E9C", diferencial: "Peças exclusivas e entrega no mesmo dia em Vinhedo", bioAtual: "Moda feminina 👗", concorrentes: ["Boutique Aurora", "Closet da Ana", "Maria Bonita Moda"] },
  { segmento: "generico", nome: "Bellatrix Contabilidade", tipo: "um escritório de contabilidade", cidade: "Vinhedo", uf: "SP", endereco: "R. Barão de Itapura, 77", buscaTermo: "contabilidade", genero: "a", servico: "a abertura de empresa", preco: "R$ 600", cor: "#5B4BDB", diferencial: "Contador dedicado que responde no mesmo dia", bioAtual: "Contabilidade 📊", concorrentes: ["Contábil Vinhedo", "Exata Contabilidade", "Prime Contadores"] },
];

const maiuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export type Peca = {
  id: "avaliacoes" | "whatsapp" | "perfil" | "google" | "posts";
  nome: string;
  etapa: "Encontrado" | "Entendido" | "Escolhido";
  porQue: string;
  tempo: string;
};

export type Texto = { titulo: string; sub?: string; texto: string };

export type Kit = {
  linkAvaliacao: string;
  pecas: Peca[];
  mensagensAvaliacao: Texto[];
  respostasAvaliacao: Texto[];
  mensagensWhatsapp: Texto[];
  bioAtual: string;
  bios: Texto[];
  googleDescricao: string;
  googleFaltando: { item: string; detalhe: string }[];
};

export type Contexto = { empresa: EmpresaDemo; segmento: Segmento; diagnostico: Diagnostico; kit: Kit };

function statusEtapa(nota: number, lider: number): Status {
  if (nota >= lider) return "frente";
  if (nota >= lider - 15) return "media";
  return "atras";
}

/** Nunca falha: nicho desconhecido ou ausente cai na clínica de estética de exemplo. */
export function contexto(nicho?: string, dataDiagnostico: Date = new Date()): Contexto {
  // Protótipo: o diagnóstico é "de hoje". Na fase 2, a data vem do banco.
  const e = empresasDemo.find((x) => x.segmento === nicho) ?? empresasDemo[0];
  const s = segmentos[e.segmento as SegmentoId];
  const hoje = calcularScore(metricasHoje, liderBusca);
  const comKit = calcularScore(aplicarKit(metricasHoje), liderBusca);
  const [c1, c2, c3] = e.concorrentes;
  const busca = `${e.buscaTermo} em ${e.cidade}`;
  const pedidoAvaliacao = `Oi, [nome]! Aqui é da equipe ${e.nome}. Foi um prazer ${s.atender}. Se fizer sentido para você, deixa uma avaliação rapidinha sobre sua experiência no Google? Leva menos de 1 minuto e ajuda outras pessoas a nos conhecerem: [link]. Obrigado!`;

  const diagnostico: Diagnostico = {
    empresa: e.nome,
    cidade: `${e.cidade}, ${e.uf}`,
    segmento: s.nome,
    busca,
    dataAnalise: dataDiagnostico.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    dataISO: dataDiagnostico.toISOString(),
    nota: hoje.total,
    potencialComKit: comKit.total,
    ranking: [
      { nome: c1, nota: 86 },
      { nome: c2, nota: 74 },
      { nome: c3, nota: 57 },
      { nome: "Você", nota: hoje.total, voce: true },
    ],
    etapas: [
      { chave: "encontrado", nome: "Encontrado", pergunta: "Você aparece quando procuram?", nota: hoje.encontrado, lider: 92, status: statusEtapa(hoje.encontrado, 92), resumo: "4º no Google Maps", solucaoKit: "Google Perfil otimizado" },
      { chave: "entendido", nome: "Entendido", pergunta: "Seu perfil explica o que você faz?", nota: hoje.entendido, lider: 84, status: statusEtapa(hoje.entendido, 84), resumo: "Bio não diz o que você faz nem como contratar", solucaoKit: "Perfil reescrito e 12 posts" },
      { chave: "escolhido", nome: "Escolhido", pergunta: "Há motivos para confiar em você?", nota: hoje.escolhido, lider: 80, status: statusEtapa(hoje.escolhido, 80), resumo: `23 avaliações (líder: 187)`, solucaoKit: "Kit de avaliações com QR code" },
    ],
    ia: {
      pergunta: `Qual ${e.genero === "a" ? "a melhor" : "o melhor"} ${e.buscaTermo} em ${e.cidade}?`,
      respostas: [
        { ia: "ChatGPT", citou: false, lista: [c1, c2, c3] },
        { ia: "Gemini", citou: true, posicao: 3, lista: [c1, c2, e.nome] },
      ],
    },
    presente: {
      titulo: `Peça avaliações aos seus ${s.cliente} desta semana`,
      motivo: `Avaliações são o que mais separa você do 1º colocado. Copie, cole no WhatsApp e envie para quem você atendeu nos últimos dias.`,
      mensagem: pedidoAvaliacao,
    },
    proximaAcao: {
      titulo: "Peça 10 avaliações esta semana",
      motivo: "É o que mais pesa no seu Score Digital. A mensagem e o QR code de avaliação, com a arte para imprimir, já estão prontos.",
      botao: "Abrir mensagem pronta",
    },
    plano: { feitas: 2, total: 12, diasParaReavaliacao: 23 },
  };

  const precoTexto =
    s.permitePreco && e.preco
      ? `${maiuscula(e.servico)} sai a partir de ${e.preco}, com tudo explicado antes. Posso te ajudar a ${s.acao}?`
      : `Os valores dependem de cada caso. No primeiro contato a gente entende o que você precisa e explica tudo, sem compromisso. Posso te ajudar a ${s.acao}?`;

  const kit: Kit = {
    linkAvaliacao: `https://g.page/r/${e.nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")}/review`,
    pecas: [
      { id: "avaliacoes", nome: "Kit de avaliações", etapa: "Escolhido", porQue: "Você tem 23 avaliações e o 1º colocado tem 187. É a diferença que mais pesa no seu Score Digital.", tempo: "10 min para preparar" },
      { id: "whatsapp", nome: "WhatsApp que vende", etapa: "Escolhido", porQue: "Quem te encontra chama no WhatsApp. Uma resposta rápida e clara decide se a pessoa fecha com você ou vai para o concorrente.", tempo: "5 min para salvar" },
      { id: "perfil", nome: "Perfil reescrito", etapa: "Entendido", porQue: `Sua bio atual não diz o que você faz nem como ${s.acao}. Quem chega pela primeira vez não entende em 5 segundos.`, tempo: "5 min para trocar" },
      { id: "google", nome: "Google Perfil otimizado", etapa: "Encontrado", porQue: "Seu perfil no Google está 60% preenchido; o do 1º colocado, 100%. Perfil completo ajuda a aparecer mais acima no Maps.", tempo: "20 min para atualizar" },
      { id: "posts", nome: "12 posts prontos", etapa: "Entendido", porQue: `Mostrar seu trabalho, bastidores e respostas às dúvidas com frequência faz o ${s.cliente === "clientes" ? "cliente" : s.cliente.replace(/s$/, "")} entender e confiar antes de chamar.`, tempo: "3 posts por semana" },
    ],
    mensagensAvaliacao: [
      { titulo: "Logo depois do atendimento", texto: pedidoAvaliacao },
      { titulo: `Para ${s.cliente} antigos`, texto: `Oi, [nome], tudo bem? Aqui é da equipe ${e.nome}. Estamos pedindo a ajuda de quem já conhece o nosso trabalho: você poderia contar no Google como foi sua experiência com a gente? É bem rápido: [link]. Faz toda a diferença!` },
    ],
    respostasAvaliacao: [
      { titulo: "Para avaliação boa", texto: `Que alegria ler isso, [nome]! Obrigado pela confiança. Conte sempre com a gente.` },
      { titulo: "Para avaliação ruim", texto: "Olá, [nome]. Sentimos muito que sua experiência não foi como esperava. Queremos entender o que aconteceu e resolver: pode nos chamar no WhatsApp? Obrigado por nos contar." },
    ],
    mensagensWhatsapp: [
      { titulo: "Primeira resposta", sub: "Quando alguém chama pela primeira vez", texto: `Oi! Que bom falar com você. Aqui é a equipe ${e.nome}. Me conta: ${s.perguntaInicial}` },
      { titulo: "Resposta para “quanto custa?”", sub: "Quando a pessoa pergunta o preço", texto: precoTexto },
      { titulo: "Retomada de quem sumiu", sub: "2 dias depois de uma conversa sem resposta", texto: `Oi, [nome]! Passando para saber se ainda posso te ajudar. Se quiser ${s.acao}, é só me responder por aqui.` },
      { titulo: "Pós-atendimento", sub: "No dia seguinte", texto: `Oi, [nome]! Obrigado pela confiança. Qualquer dúvida, me chama aqui. E se puder, sua avaliação no Google ajuda muito: [link].` },
    ],
    bioAtual: e.bioAtual,
    bios: [
      { titulo: "Direta", texto: `${maiuscula(e.buscaTermo)} em ${e.cidade}\n${e.diferencial}\n${maiuscula(s.acao)} pelo WhatsApp 👇` },
      { titulo: "Foco no diferencial", texto: `${e.diferencial}\n${maiuscula(e.servico.replace(/^(o|a|os|as) /, ""))} e mais · ${e.cidade}/${e.uf}\nFale com a gente 👇` },
      { titulo: "Foco em confiança", texto: `${e.nome} · ${e.cidade}/${e.uf}\n${maiuscula(e.buscaTermo)} com atendimento próximo\n${maiuscula(s.acao)} 👇` },
    ],
    googleDescricao: `${e.nome} é ${e.tipo} em ${e.cidade}, ${e.uf}. ${e.diferencial}. Conheça ${e.servico} e fale com a gente pelo WhatsApp ou pelo telefone. Endereço: ${e.endereco}.`,
    googleFaltando: [
      { item: "Fotos", detalhe: "Você tem 12; o 1º colocado tem 96. Comece com 10 novas, do espaço e do seu trabalho." },
      { item: "Serviços ou produtos", detalhe: s.permitePreco ? "Cadastre os 5 principais, com valor inicial." : "Cadastre as 5 áreas ou serviços principais (sem preço, pelas regras do seu setor)." },
      { item: "Horário completo", detalhe: "Informe também sábado e feriados." },
      { item: "Categorias secundárias", detalhe: "Adicione 2 categorias que descrevem o que mais você faz." },
      { item: "Responder avaliações", detalhe: "70% das suas avaliações estão sem resposta. Use os modelos do kit." },
    ],
  };

  return { empresa: e, segmento: s, diagnostico, kit };
}

/** Lista para o seletor do protótipo. */
export const nichosDemo = empresasDemo.map((e) => ({ id: e.segmento, nome: segmentos[e.segmento as SegmentoId].nome, empresa: e.nome }));
