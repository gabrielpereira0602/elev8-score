// Conteúdo simulado do kit da Clínica Bella Pele. Na fase 3, cada peça é gerada pela IA
// a partir dos dados do diagnóstico e das respostas do formulário.

export const linkAvaliacao = "https://g.page/r/bella-pele-vinhedo/review";

export type Peca = {
  id: "avaliacoes" | "whatsapp" | "perfil" | "google" | "posts";
  nome: string;
  etapa: "Encontrado" | "Entendido" | "Escolhido";
  porQue: string;
  tempo: string;
};

export const pecas: Peca[] = [
  {
    id: "avaliacoes",
    nome: "Kit de avaliações",
    etapa: "Escolhido",
    porQue: "Você tem 23 avaliações e o 1º colocado tem 187. É a diferença que mais pesa no seu Score Digital.",
    tempo: "10 min para preparar",
  },
  {
    id: "whatsapp",
    nome: "WhatsApp que vende",
    etapa: "Escolhido",
    porQue: "Quem te encontra chama no WhatsApp. Uma resposta rápida e clara decide se a pessoa agenda ou vai para o concorrente.",
    tempo: "5 min para salvar",
  },
  {
    id: "perfil",
    nome: "Perfil reescrito",
    etapa: "Entendido",
    porQue: "Sua bio atual não diz quais tratamentos você faz nem como agendar. Quem chega pela primeira vez não entende em 5 segundos.",
    tempo: "5 min para trocar",
  },
  {
    id: "google",
    nome: "Google Perfil otimizado",
    etapa: "Encontrado",
    porQue: "Seu perfil no Google está 60% preenchido; o do 1º colocado, 100%. Perfil completo ajuda a aparecer mais acima no Maps.",
    tempo: "20 min para atualizar",
  },
  {
    id: "posts",
    nome: "12 posts prontos",
    etapa: "Entendido",
    porQue: "Mostrar tratamentos, resultados e bastidores com frequência faz o cliente entender e confiar antes de chamar.",
    tempo: "3 posts por semana",
  },
];

export const mensagensAvaliacao = [
  {
    titulo: "Logo depois do atendimento",
    texto:
      "Oi, [nome]! Aqui é da Clínica Bella Pele. Foi um prazer te atender hoje. Se puder, deixa uma avaliação rapidinha sobre sua experiência no Google? Leva menos de 1 minuto e ajuda muito outras pessoas a nos conhecerem: [link]. Obrigada!",
  },
  {
    titulo: "Para clientes antigas",
    texto:
      "Oi, [nome], tudo bem? Aqui é da Bella Pele. Estamos pedindo a ajuda das nossas clientes mais queridas: você poderia contar no Google como foi sua experiência com a gente? É bem rápido: [link]. Faz toda a diferença para nós!",
  },
];

export const respostasAvaliacao = [
  {
    titulo: "Para avaliação boa",
    texto: "Que alegria ler isso, [nome]! Obrigada pela confiança. Te esperamos na próxima sessão.",
  },
  {
    titulo: "Para avaliação ruim",
    texto:
      "Olá, [nome]. Sentimos muito que sua experiência não foi como esperava. Queremos entender o que aconteceu e resolver: pode nos chamar no WhatsApp (19) 99999-0000? Obrigada por nos contar.",
  },
];

export const mensagensWhatsapp = [
  {
    titulo: "Primeira resposta",
    quando: "Quando alguém chama pela primeira vez",
    texto:
      "Oi! Que bom ter você aqui na Bella Pele. Me conta: qual tratamento você está procurando? Assim já te passo os valores e os horários disponíveis desta semana.",
  },
  {
    titulo: "Resposta para “quanto custa?”",
    quando: "Quando a pessoa pergunta o preço",
    texto:
      "A limpeza de pele profunda está R$ 180 e leva cerca de 1h10. Inclui avaliação da pele e orientação de cuidados em casa. Tenho horários na quinta às 14h ou no sábado às 10h. Qual fica melhor para você?",
  },
  {
    titulo: "Retomada de quem sumiu",
    quando: "2 dias depois de uma conversa sem resposta",
    texto:
      "Oi, [nome]! Passando para saber se ainda tem interesse na limpeza de pele. Abriu um horário no sábado às 10h. Quer que eu reserve para você?",
  },
  {
    titulo: "Pós-atendimento",
    quando: "No dia seguinte ao atendimento",
    texto:
      "Oi, [nome]! Como sua pele amanheceu hoje? Qualquer dúvida sobre os cuidados em casa, me chama aqui. E se puder, sua avaliação no Google ajuda muito: [link].",
  },
];

export const biosAtual =
  "Clínica de estética 💆‍♀️✨ Vinhedo/SP Agende já!";

export const bios = [
  {
    titulo: "Direta",
    texto: "Limpeza de pele, peeling e drenagem em Vinhedo\nAvaliação gratuita da sua pele\nAgende pelo WhatsApp 👇",
  },
  {
    titulo: "Foco em resultado",
    texto: "Pele mais limpa e saudável desde a 1ª sessão\nTratamentos faciais e corporais · Vinhedo/SP\nAgende sua avaliação 👇",
  },
  {
    titulo: "Foco em confiança",
    texto: "Estética com atendimento individual há 6 anos\nLimpeza de pele · Peeling · Drenagem\nVinhedo/SP · Agende pelo WhatsApp 👇",
  },
];

export const googleDescricao =
  "A Clínica Bella Pele é especializada em estética facial e corporal em Vinhedo, SP. Oferecemos limpeza de pele profunda, peeling, drenagem linfática e tratamentos para acne e manchas, com atendimento individual e avaliação da pele incluída. Fácil acesso pela Av. Independência, com estacionamento próximo. Agende pelo WhatsApp ou pelo telefone.";

export const googleFaltando = [
  { item: "Fotos do espaço e dos tratamentos", detalhe: "Você tem 12; o 1º colocado tem 96. Comece com 10 novas." },
  { item: "Serviços com preço", detalhe: "Cadastre os 5 tratamentos principais com valor inicial." },
  { item: "Horário de sábado", detalhe: "Seu perfil não informa se abre aos sábados." },
  { item: "Categorias secundárias", detalhe: "Adicione “Esteticista” e “Spa facial”." },
  { item: "Responder avaliações", detalhe: "8 avaliações estão sem resposta. Use os modelos do kit." },
];

export type Post = {
  semana: number;
  tipo: "Arte pronta" | "Foto sua";
  gancho: string;
  legenda: string;
  foto?: string;
};

export const posts: Post[] = [
  { semana: 1, tipo: "Arte pronta", gancho: "3 sinais de que sua pele precisa de uma limpeza profunda", legenda: "Cravos que voltam rápido, pele opaca e poros dilatados são os mais comuns. Se você se identificou, sua pele está pedindo uma limpeza profissional. Agende sua avaliação gratuita pelo link da bio." },
  { semana: 1, tipo: "Foto sua", gancho: "Conheça quem vai cuidar da sua pele", legenda: "Prazer, eu sou a [nome]! Há 6 anos ajudo mulheres de Vinhedo a terem uma pele mais saudável. Aqui o atendimento é individual, sem pressa. Me chama no WhatsApp!", foto: "Você na recepção, sorrindo, com luz natural" },
  { semana: 1, tipo: "Arte pronta", gancho: "Quanto custa uma limpeza de pele?", legenda: "Aqui na Bella Pele a limpeza profunda é R$ 180, com avaliação da pele e orientação de cuidados em casa incluídas. Sem surpresa no preço." },
  { semana: 2, tipo: "Foto sua", gancho: "Por dentro da sala de atendimento", legenda: "É aqui que a mágica acontece. Ambiente limpo, tranquilo e preparado para você relaxar enquanto cuida da pele.", foto: "A sala de atendimento arrumada, de frente" },
  { semana: 2, tipo: "Arte pronta", gancho: "Peeling ou limpeza de pele: qual escolher?", legenda: "A limpeza remove impurezas; o peeling renova a camada superficial da pele. Na avaliação a gente indica o melhor para o seu caso." },
  { semana: 2, tipo: "Arte pronta", gancho: "O que nossas clientes dizem", legenda: "Cada avaliação nos deixa felizes demais. Obrigada pela confiança! Já foi atendida aqui? Conta sua experiência no Google pelo link da bio." },
  { semana: 3, tipo: "Foto sua", gancho: "Os produtos que usamos", legenda: "Trabalhamos com dermocosméticos de marcas reconhecidas, escolhidos para cada tipo de pele.", foto: "Os produtos organizados na bancada" },
  { semana: 3, tipo: "Arte pronta", gancho: "5 cuidados depois da limpeza de pele", legenda: "Protetor solar, nada de maquiagem nas primeiras horas, hidratação... Salve este post para não esquecer!" },
  { semana: 3, tipo: "Arte pronta", gancho: "Horários desta semana", legenda: "Ainda temos horários na quinta e no sábado. Garanta o seu pelo WhatsApp." },
  { semana: 4, tipo: "Foto sua", gancho: "Um dia na Bella Pele", legenda: "Do primeiro café ao último atendimento: um pouco da nossa rotina cuidando de vocês.", foto: "Você preparando a sala, sem olhar para a câmera" },
  { semana: 4, tipo: "Arte pronta", gancho: "Mito ou verdade: limpeza de pele machuca?", legenda: "Mito! Com técnica e produtos certos, o procedimento é tranquilo. Pode haver um leve desconforto na extração, mas nada que tire o seu relaxamento." },
  { semana: 4, tipo: "Arte pronta", gancho: "Avaliação gratuita da sua pele", legenda: "Não sabe qual tratamento é o ideal para você? Agende uma avaliação gratuita e saia com um plano feito para a sua pele." },
];
