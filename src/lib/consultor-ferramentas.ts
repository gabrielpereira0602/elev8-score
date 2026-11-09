/*
  Ferramentas do consultor: geradores de texto offline, montados com os dados do negócio e a ficha do nicho.
  Cada combinação de opções gera um texto pronto para copiar, sempre dentro das regras do setor.
*/
import type { Contexto } from "./contexto";
import { MESES, maiuscula, mesSP } from "./consultor-util";

// ───────── Resposta para avaliação

export const ASSUNTOS_AVALIACAO = [
  { id: "atendimento", nome: "Atendimento" },
  { id: "demora", nome: "Demora ou atraso" },
  { id: "preco", nome: "Preço" },
  { id: "resultado", nome: "Resultado do serviço" },
  { id: "outro", nome: "Outro assunto" },
] as const;
export type AssuntoAvaliacao = (typeof ASSUNTOS_AVALIACAO)[number]["id"];

export function respostaAvaliacao(ctx: Contexto, o: { nome: string; estrelas: number; assunto: AssuntoAvaliacao }): string {
  const { segmento: s } = ctx;
  const nome = o.nome.trim() || "[nome]";
  if (o.estrelas >= 4) {
    const elogio: Record<AssuntoAvaliacao, string> = {
      atendimento: "Ficamos muito felizes que você se sentiu bem atendido.",
      demora: "Obrigado pela paciência e pela confiança.",
      preco: "Que bom que você sentiu que valeu a pena.",
      resultado: "Ver você satisfeito com o resultado é o que mais nos alegra.",
      outro: "Ficamos muito felizes com o seu retorno.",
    };
    return `Que alegria ler isso, ${nome}! ${elogio[o.assunto]} Obrigado por contar como foi. Esperamos você de novo!`;
  }
  const pedido: Record<AssuntoAvaliacao, string> = {
    atendimento: "Não é assim que queremos que ninguém se sinta aqui.",
    demora: "Sabemos que o seu tempo é valioso, e o atraso não deveria ter acontecido.",
    preco: s.permitePreco
      ? "Queremos entender o que ficou diferente do que você esperava no valor, para explicar melhor o que está incluso."
      : "Queremos entender o que ficou diferente do que você esperava, para explicar melhor como funciona o atendimento.",
    resultado: "Queremos entender o que aconteceu e ver com você o melhor caminho.",
    outro: "Queremos entender o que aconteceu.",
  };
  if (o.estrelas === 3) {
    return `Obrigado pela sinceridade, ${nome}. ${pedido[o.assunto]} Se puder, chama a gente no WhatsApp: sua opinião ajuda a gente a melhorar.`;
  }
  return `Olá, ${nome}. Sentimos muito pela sua experiência. ${pedido[o.assunto]} Pode nos chamar no WhatsApp para resolvermos com atenção? Obrigado por nos contar.`;
}

// ───────── Mensagem de WhatsApp

export const OBJETIVOS_WHATSAPP = [
  { id: "primeira", nome: "Primeira resposta" },
  { id: "confirmar", nome: "Confirmar horário" },
  { id: "pos", nome: "Pós-atendimento" },
  { id: "avaliacao", nome: "Pedir avaliação" },
  { id: "indicacao", nome: "Pedir indicação" },
  { id: "retomar", nome: "Retomar quem sumiu" },
  { id: "reativar", nome: "Chamar quem não volta há tempo" },
] as const;
export type ObjetivoWhatsapp = (typeof OBJETIVOS_WHATSAPP)[number]["id"];

export function mensagemWhatsapp(ctx: Contexto, o: { nome: string; objetivo: ObjetivoWhatsapp }): string {
  const { empresa: e, segmento: s, kit } = ctx;
  const nome = o.nome.trim() || "[nome]";
  const textos: Record<ObjetivoWhatsapp, string> = {
    primeira: `Oi, ${nome}! Que bom falar com você. Aqui é a equipe ${e.nome}. Me conta: ${s.perguntaInicial}`,
    confirmar: `Oi, ${nome}! Aqui é da equipe ${e.nome}, confirmando seu horário amanhã às [hora]. Posso manter? Se não der, me avisa que eu passo para outra pessoa.`,
    pos: `Oi, ${nome}! Obrigado pela confiança. Ficou tudo certo? Qualquer dúvida, me chama aqui.`,
    avaliacao: `Oi, ${nome}! Foi um prazer ${s.atender}. Se fizer sentido para você, deixa uma avaliação rapidinha no Google? Leva menos de 1 minuto e ajuda outras pessoas a nos conhecerem: ${kit.linkAvaliacao}. Obrigado!`,
    indicacao: `Que bom que você gostou, ${nome}! Se você conhece alguém que também precisa, pode passar o nosso contato. A gente atende com o mesmo cuidado.`,
    retomar: `Oi, ${nome}! Aqui é da equipe ${e.nome}. Passando para saber se ficou alguma dúvida. Se quiser ${s.acao}, é só me responder por aqui.`,
    reativar: s.permitePreco
      ? `Oi, ${nome}! Aqui é da equipe ${e.nome}. Faz um tempo desde ${s.consultor.retorno} e lembrei de você. Esta semana temos horários livres. Quer que eu separe um para você?`
      : `Oi, ${nome}! Aqui é da equipe ${e.nome}. Passando para lembrar que já faz um tempo desde ${s.consultor.retorno}. Se precisar de algo, é só responder aqui.`,
  };
  return textos[o.objetivo];
}

// ───────── Legenda de post

export type TemaLegenda = { id: string; nome: string; tipo: "dor" | "comparacao" | "mito" | "cuidados" | "primeiraVez" | "bastidor" | "data" };

export function temasLegenda(ctx: Contexto, hoje = new Date()): TemaLegenda[] {
  const t = ctx.segmento.temas;
  const mes = mesSP(hoje);
  const proximo = (mes % 12) + 1;
  const datas = ctx.segmento.consultor.datas
    .filter((d) => d.mes === mes || d.mes === proximo)
    .map((d) => ({ id: `data-${d.mes}-${d.nome}`, nome: d.nome, tipo: "data" as const }));
  return [
    ...datas,
    { id: "dor", nome: t.dor, tipo: "dor" },
    { id: "comparacao", nome: t.comparacao, tipo: "comparacao" },
    { id: "mito", nome: t.mito, tipo: "mito" },
    { id: "cuidados", nome: t.cuidados, tipo: "cuidados" },
    { id: "primeiraVez", nome: t.primeiraVez, tipo: "primeiraVez" },
    { id: "bastidor", nome: "Bastidor do dia a dia", tipo: "bastidor" },
  ];
}

const hashtag = (t: string) =>
  "#" +
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .join("")
    .toLowerCase();

export function legenda(ctx: Contexto, o: { temaId: string; tom: "proximo" | "profissional" }, hoje = new Date()): string {
  const { empresa: e, segmento: s } = ctx;
  const tema = temasLegenda(ctx, hoje).find((t) => t.id === o.temaId) ?? temasLegenda(ctx, hoje)[0];
  const proximo = o.tom === "proximo";
  const cta = proximo ? `${maiuscula(s.acao)}? Me chama no WhatsApp, o link está na bio 💬` : `Para ${s.acao}, fale com a nossa equipe pelo WhatsApp (link na bio).`;
  const data = s.consultor.datas.find((d) => `data-${d.mes}-${d.nome}` === tema.id);

  const corpo: Record<TemaLegenda["tipo"], string> = {
    dor: `${tema.nome}.\n\n${proximo ? "Se você se identificou com algum deles, não precisa esperar piorar." : "Identificar os sinais cedo faz diferença."} Aqui, cada caso é avaliado com calma, sem pressa e sem empurrar nada.`,
    comparacao: `${tema.nome}\n\nEssa é uma das dúvidas que mais ouvimos. ${proximo ? "A resposta curta: depende do seu caso, e a gente te ajuda a escolher." : "A escolha certa depende de cada caso, e explicamos as diferenças antes de qualquer decisão."}`,
    mito: `${tema.nome}\n\n${proximo ? "Muita gente acredita nisso, mas a história não é bem assim." : "Esse é um mito comum, e vale esclarecer."} Arraste para o lado e entenda o que é verdade.`,
    cuidados: `${tema.nome}\n\n${proximo ? "Salva este post para não esquecer!" : "Guarde estas orientações."} Pequenos cuidados fazem diferença no dia a dia.`,
    primeiraVez: `${tema.nome}\n\n${proximo ? "Primeira vez dá um frio na barriga, a gente sabe." : "Muitos " + s.cliente + " chegam com dúvidas sobre o primeiro contato."} Aqui é simples: você conta o que precisa, a gente explica o caminho e você decide com calma.`,
    bastidor: `Um pouco do dia a dia da equipe ${e.nome}.\n\n${proximo ? "Por trás de cada atendimento tem gente que gosta muito do que faz." : "Cada detalhe é pensado para o seu atendimento."} ${e.diferencial}.`,
    data: data
      ? `${data.nome} está chegando! ${proximo ? "Já se organizou?" : "Vale se planejar com antecedência."}\n\n[Complete em 1 ou 2 frases. Ideia: ${data.ideia}.]${s.permitePreco ? "" : "\n\n(Seu setor: só informação, sem preço e sem promoção.)"}`
      : `${tema.nome}`,
  };
  const tags = [hashtag(e.cidade), hashtag(e.buscaTermo), hashtag(`${e.buscaTermo} ${e.cidade}`)].join(" ");
  return `${corpo[tema.tipo]}\n\n${cta}\n\n${tags}`;
}

/** Nome do mês atual, para os rótulos da tela. */
export const mesAtual = (hoje = new Date()) => MESES[mesSP(hoje) - 1];
