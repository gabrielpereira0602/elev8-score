/*
  Consultor de marketing: respostas do protótipo.

  Na fase 3 quem responde é a IA, com as instruções de consultor-prompt.ts (conhecimento sênior, método de resposta,
  regras do setor e os dados do negócio). Aqui o protótipo mostra o mesmo padrão de resposta para as perguntas mais
  comuns: resposta direta, o porquê ligado ao diagnóstico, passo a passo curto e texto pronto para copiar.
  Tudo sai da ficha do nicho e dos dados da empresa; nada é inventado.
*/
import type { Contexto } from "./contexto";
import type { Etapa } from "./mock";
import { liderBusca, metricasHoje } from "./mock";
import { FUSO } from "./elev8";

export type Resposta = { texto: string; linkElev8?: boolean; linkKit?: boolean; linkPlano?: boolean };

const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const semArtigo = (t: string) => t.replace(/^(o|a|os|as) /, "");
const maiuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** Mês atual (1 a 12) no fuso de São Paulo. */
export function mesSP(hoje: Date): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: FUSO, month: "numeric" }).format(hoje));
}

/** A etapa em que o negócio mais perde para o 1º colocado. */
export function maiorPerda(etapas: Etapa[]): Etapa {
  return [...etapas].sort((a, b) => a.nota - a.lider - (b.nota - b.lider))[0];
}

const ETAPA_FRASE: Record<Etapa["chave"], string> = {
  encontrado: "ser encontrado (aparecer quando procuram)",
  entendido: "ser entendido (o perfil explicar o que você faz)",
  escolhido: "ser escolhido (ter motivos para confiarem em você)",
};

/** Perguntas sugeridas, escritas para o nicho e para o mês. */
export function sugestoesPara(ctx: Contexto, hoje = new Date()): string[] {
  const s = ctx.segmento;
  return [
    "O que eu faço primeiro esta semana?",
    s.consultor.pergunta,
    `Como consigo mais ${s.cliente} este mês?`,
    `O que postar em ${MESES[mesSP(hoje) - 1]}?`,
    "Como respondo uma avaliação ruim?",
    "Vale a pena impulsionar post?",
    "Preciso de um site novo?",
  ];
}

export function saudacao(ctx: Contexto): string {
  const p = maiorPerda(ctx.diagnostico.etapas);
  return `Oi! Sou o seu consultor de marketing. Já estudei o diagnóstico de ${ctx.empresa.nome}. O ponto em que você mais perde hoje é ${ETAPA_FRASE[p.chave]}: ${p.nota} pontos, contra ${p.lider} do 1º colocado.\n\nPode me perguntar qualquer coisa sobre o marketing do seu negócio, ou começar por uma das perguntas abaixo.`;
}

function primeiraSemana(ctx: Contexto): Resposta {
  const { segmento: s, empresa: e, diagnostico: d } = ctx;
  const p = maiorPerda(d.etapas);
  const passos: Record<Etapa["chave"], string[]> = {
    escolhido: [
      "Imprima a plaquinha do QR code e deixe onde o cliente paga ou espera (10 min).",
      `Peça avaliação a 10 ${s.cliente} satisfeitos com a mensagem pronta do kit (15 min).`,
      "Responda todas as avaliações que você já tem, boas e ruins (15 min).",
    ],
    encontrado: [
      "Cole a descrição nova no seu Perfil da Empresa no Google e preencha o que falta (20 min).",
      "Suba 10 fotos reais: fachada, ambiente, equipe e trabalho (15 min).",
      `Peça avaliação a 10 ${s.cliente} com a mensagem pronta (15 min).`,
    ],
    entendido: [
      "Troque a bio do Instagram por uma das 3 versões do kit (5 min).",
      `Coloque o link do WhatsApp na bio, com a mensagem para ${s.acao} (5 min).`,
      "Publique os 3 posts da semana 1 e fixe o melhor no topo do perfil (20 min).",
    ],
  };
  return {
    texto: `Comece por ${ETAPA_FRASE[p.chave]}. É onde você mais perde: ${p.nota} pontos, contra ${p.lider} do 1º colocado. Quem procura ${e.buscaTermo} em ${e.cidade} sente essa diferença primeiro.\n\nEsta semana, nesta ordem:\n1. ${passos[p.chave][0]}\n2. ${passos[p.chave][1]}\n3. ${passos[p.chave][2]}\n\nSão menos de uma hora no total. Marque cada ação no plano quando terminar, para a reavaliação do dia 30 mostrar o efeito.`,
    linkPlano: true,
  };
}

function preco(ctx: Contexto, pergunta = ""): Resposta {
  const { segmento: s, empresa: e } = ctx;
  const acham = /caro/.test(pergunta);
  if (!s.permitePreco) {
    const encontro = s.acao.replace(/^(agendar|marcar) /, "");
    return {
      texto: `No seu setor, preço não aparece em post nem em anúncio. Na conversa individual, quando a pessoa pergunta, o caminho mais seguro é explicar que o valor depende do caso e levar para ${encontro}.\n\nModelo pronto:\n“Oi, [nome]! Obrigado por chamar. O valor depende do que você precisa, e só conseguimos te passar com segurança depois de entender o seu caso. Na primeira conversa a gente explica tudo, sem compromisso. Prefere de manhã ou à tarde?”\n\nTerminar com duas opções de horário facilita a resposta. Uma regra do setor para lembrar sempre. ${s.regras[0]} Em caso de dúvida, confirme com o seu conselho.`,
    };
  }
  const valor = e.preco ?? "[seu valor]";
  return {
    texto: `${acham ? "Quando acham caro, quase nunca o problema é o número: a pessoa ainda não viu a diferença entre você e o concorrente." : "Quem pergunta o preço quase sempre está comparando."} Se você manda só o número, a decisão vira disputa de preço. A ordem que funciona:\n\n1. Agradeça e faça uma pergunta: “${maiuscula(s.perguntaInicial)}”\n2. Mostre o que está incluso antes do valor.\n3. Diga o preço com clareza, sem rodeio.\n4. Termine com um próximo passo fácil.\n\nModelo pronto, depois que a pessoa disser o que precisa:\n“Oi, [nome]! Que bom que você chamou. ${maiuscula(semArtigo(e.servico))} sai por ${valor}, e o que faz diferença aqui é: ${e.diferencial.charAt(0).toLowerCase() + e.diferencial.slice(1)}. Quer que eu veja um horário para você esta semana?”\n\nResponda rápido: quem espera horas para ter resposta costuma fechar com quem respondeu primeiro.`,
  };
}

function maisClientes(ctx: Contexto): Resposta {
  const { segmento: s, empresa: e } = ctx;
  const mensagem = s.permitePreco
    ? `“Oi, [nome]! Aqui é da equipe ${e.nome}. Faz um tempo desde ${s.consultor.retorno} e lembrei de você. Esta semana temos horários livres. Quer que eu separe um para você?”`
    : `“Oi, [nome]! Aqui é da equipe ${e.nome}. Passando para lembrar que já faz um tempo desde ${s.consultor.retorno}. Se precisar de algo, é só responder aqui.”`;
  return {
    texto: `O caminho mais rápido não é post novo, é quem já te conhece. Três frentes, nesta ordem:\n\n1. Retome contato com quem não volta há 60 dias ou mais. Mensagem individual, com o nome da pessoa, nunca lista genérica:\n${mensagem}\n\n2. Peça indicação na hora em que o cliente agradece. É quando ele está mais disposto a indicar.\n\n3. Peça avaliação no Google. É lá que quem procura ${e.buscaTermo} em ${e.cidade} compara você com os concorrentes.\n\nComece pela 1: essas pessoas já confiam em você, então a resposta vem mais rápido.${s.permitePreco ? "" : ` No seu setor, o contato é lembrete e informação, sem promoção.`}`,
  };
}

function postsDoMes(ctx: Contexto, hoje: Date, pergunta: string): Resposta {
  const { segmento: s, empresa: e } = ctx;
  const mes = mesSP(hoje);
  const proximo = (mes % 12) + 1;
  const datas = s.consultor.datas.filter((d) => d.mes === mes || d.mes === proximo);
  const pedeBlack = /black/.test(pergunta);

  if (pedeBlack && !s.permitePreco) {
    return {
      texto: `No seu setor, post de promoção ou desconto vai contra as regras de publicidade. Use a data para um post informativo:\n\n“Fim de ano chegando? Separe 5 minutos para cuidar do que importa. Se você tem dúvidas sobre ${semArtigo(e.servico)}, a gente explica, sem compromisso. ${maiuscula(s.acao)} pelo WhatsApp do perfil.”`,
    };
  }
  if (pedeBlack) {
    return {
      texto: `Post para a Black Friday, já no padrão da sua marca:\n\nTexto da arte: “Black Friday ${e.nome}”\n\nLegenda: “Só nesta semana: [sua condição] em ${semArtigo(e.servico)}. Válido até [data]. Chama no WhatsApp para garantir o seu. ${e.diferencial}.”\n\nPreencha a condição real e a data de fim antes de publicar. Promoção sem data e sem regra clara gera reclamação e tira a confiança no resto do ano. Avise primeiro quem já é cliente, um dia antes do post.`,
    };
  }
  const lista = datas.length
    ? datas.map((d) => `• ${d.nome}: ${d.ideia}.`).join("\n")
    : "• Este mês não tem uma data forte para o seu setor. Use os posts do plano e capriche nas fotos reais.";
  return {
    texto: `As datas que movem o seu setor em ${MESES[mes - 1]} e ${MESES[proximo - 1]}:\n\n${lista}\n\nOs posts do seu kit já estão prontos para as 4 semanas. Na semana da data, troque um deles por esse tema e publique com uns 7 dias de antecedência: quem planeja decide antes.\n\n${s.permitePreco ? "Se fizer oferta, coloque condição e data de fim reais." : "Lembre: sem preço e sem promoção, só informação."}`,
    linkKit: true,
  };
}

function avaliacaoRuim(ctx: Contexto): Resposta {
  return {
    texto: `Responda em até 24 horas, com calma e sem discutir em público. Não ofereça desconto na resposta: isso ensina que reclamar dá desconto. Use este modelo e ajuste o nome:\n\n“${ctx.kit.respostasAvaliacao[1].texto}”\n\nDepois, resolva no particular. Quem lê a avaliação presta mais atenção na sua resposta do que na reclamação.`,
    linkKit: true,
  };
}

function impulsionar(ctx: Contexto): Resposta {
  const { segmento: s, empresa: e } = ctx;
  return {
    texto: `Vale, se três coisas estiverem prontas: um perfil que convence (bio clara, posts fixados), um post que já foi bem sem dinheiro e alguém para responder o WhatsApp rápido. Sem isso, você paga para mandar gente para um perfil que não convence.\n\nPara testar:\n1. Escolha o post com mais salvamentos e mensagens.\n2. Público: ${e.cidade} e região próxima.\n3. Objetivo: mensagens no WhatsApp, não curtidas.\n4. Um valor que você aceita usar só para aprender.\n5. Olhe o custo por conversa e quantas viraram ${s.cliente}.\n\nQuando quiser campanha de verdade, com públicos, criativos e acompanhamento semanal, é trabalho de gestor de tráfego.${s.permitePreco ? "" : " No seu setor, anúncio segue as mesmas regras dos posts: sem preço e sem promoção."}`,
    linkElev8: true,
  };
}

function indicacao(ctx: Contexto): Resposta {
  const { segmento: s, empresa: e } = ctx;
  return {
    texto: `Peça na hora certa: logo depois que o cliente elogiar ou agradecer. Seja específico, porque um pedido vago (“indica a gente!”) quase nunca vira indicação.\n\nModelo pronto:\n“Que bom que você gostou, [nome]! Se você conhece alguém que também precisa, pode passar o nosso contato. A gente atende com o mesmo cuidado.”\n\nPara facilitar, mande junto o link do WhatsApp de ${e.nome} pronto para encaminhar. E quando a indicação vier, agradeça quem indicou. Isso faz a pessoa indicar de novo.${s.permitePreco ? "" : " No seu setor, não ofereça prêmio ou desconto por indicação."}`,
  };
}

function regrasDoSetor(ctx: Contexto): Resposta {
  const { segmento: s } = ctx;
  return {
    texto: `Em tudo o que eu escrevo para você, sigo as regras de ${s.nome.toLowerCase()}:\n${s.regras.map((r) => `• ${r}`).join("\n")}\n\nO que funciona bem dentro delas:\n• ${s.temas.mito}\n• ${s.temas.cuidados}\n• ${s.temas.primeiraVez}\n• Bastidor com foto real: ${s.temas.bastidor.charAt(0).toLowerCase() + s.temas.bastidor.slice(1)}\n\nConteúdo que ensina e mostra como você trabalha gera confiança sem esbarrar nas regras.${s.permitePreco ? "" : " Num caso específico, confirme com o seu conselho ou entidade de classe."}`,
    linkKit: true,
  };
}

function followUp(ctx: Contexto): Resposta {
  const { segmento: s, empresa: e } = ctx;
  return {
    texto: `Quem demonstrou interesse e não fechou precisa de um segundo contato. Muita venda se perde só porque ninguém voltou a falar.\n\nSequência simples:\n1. No mesmo dia: agradeça e pergunte se ficou alguma dúvida.\n2. Dois dias depois: mande algo útil (um post do seu perfil que responda a dúvida dela) e convide para ${s.acao}.\n3. Uma semana depois: última mensagem, leve, deixando a porta aberta.\n\nModelo para o passo 1:\n“Oi, [nome]! Aqui é da equipe ${e.nome}. Foi bom falar com você. Ficou alguma dúvida? Se quiser, já vejo um horário para você.”\n\nTrês contatos e pronto. Mais do que isso vira insistência.`,
  };
}

function agenda(ctx: Contexto): Resposta {
  const { segmento: s, empresa: e } = ctx;
  return {
    texto: `Agenda cheia vem de rotina, não de post. Quatro hábitos:\n\n1. Marque o próximo horário antes de o cliente ir embora: “Quer que eu já deixe reservado?”\n2. Mande lembrete perto da data ideal de retorno:\n“Oi, [nome]! Aqui é da equipe ${e.nome}. Já faz um tempo desde ${s.consultor.retorno}. Quer que eu veja um horário para esta semana?”\n3. Horários vazios: ofereça primeiro para quem já é cliente, por mensagem individual${s.permitePreco ? ", e, se quiser, com uma condição só para os dias mais parados" : ", sem promoção"}.\n4. Lista de espera: quem não conseguiu horário recebe aviso quando abrir vaga.\n\nO 1 sozinho já muda a agenda: quem sai com horário marcado volta muito mais do que quem fica de “ver depois”.`,
  };
}

function seguidores(ctx: Contexto): Resposta {
  const { segmento: s, empresa: e } = ctx;
  return {
    texto: `Quem só olha precisa de dois empurrões: um motivo para vir agora e um caminho fácil.\n\n1. Todo post termina com um pedido claro: ${s.acao} pelo WhatsApp, com o link na bio.\n2. Stories da semana com novidade real (“chegou hoje”, “horário livre amanhã”), sempre com a figurinha de link.\n3. Respondeu story ou comentou? Responda com convite direto:\n“Que bom que você gostou! Quer que eu separe para você? É só me dizer o melhor dia.”\n4. Fixe no topo do perfil os 3 posts que mais explicam por que escolher ${e.nome}.\n\nCurtida não paga conta: meça quantas conversas no WhatsApp vieram do Instagram por semana.`,
  };
}

function score(ctx: Contexto): Resposta {
  const d = ctx.diagnostico;
  return {
    texto: `Hoje seu Score Digital é ${d.nota}. Aplicando o kit inteiro, a estimativa é chegar a ${d.potencialComKit}, pela fórmula do Score. O que mais pesa: avaliações (você tem ${metricasHoje.avaliacoes}, o 1º colocado tem ${liderBusca.avaliacoes}), perfil do Google completo e bio clara.\n\nIsso é uma estimativa, não uma promessa. A reavaliação no dia 30 mostra o número real.`,
  };
}

function site(ctx: Contexto): Resposta {
  return {
    texto: `Pelo seu diagnóstico, sim: seu site tem nota ${metricasHoje.velocidadeSite}/100 de velocidade no celular e não deixa claro como ${ctx.segmento.acao}. É a parte do Score que o kit não resolve.\n\nIsso já é trabalho de profissional. Na aba Com a Elev8 você vê as opções com preço e o desconto que vale para você.`,
    linkElev8: true,
  };
}

export function responder(pergunta: string, ctx: Contexto, hoje = new Date()): Resposta {
  const p = normalizar(pergunta);
  const s = ctx.segmento;

  if (/(avaliac|comentario|review).*(ruim|negativ|1 estrela|reclam)|(ruim|negativ|reclam).*(avaliac|comentario)/.test(p)) return avaliacaoRuim(ctx);
  if (/(primeiro|comec|esta semana|prioridade|o que (eu )?faco)/.test(p)) return primeiraSemana(ctx);
  if (/black friday|(post|postar|publicac|legenda|conteudo).*(\bmes\b|data|natal|maes|pais|namorados|black|promoc|janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/.test(p))
    return postsDoMes(ctx, hoje, p);
  if (/(regra|oab|conselho|permitid|posso postar|pode postar)/.test(p)) return regrasDoSetor(ctx);
  if (/(preco|valor|quanto custa|caro|orcamento)/.test(p) && !/score/.test(p)) return preco(ctx, p);
  if (/(impulsion|patrocin|turbin)/.test(p)) return impulsionar(ctx);
  if (/indica/.test(p)) return indicacao(ctx);
  if (/(score|nota).*(sobe|subir|aument|melhor)|(quanto).*(sobe|subir)/.test(p)) return score(ctx);
  if (/(site|landing|pagina|anuncio|trafego|google ads|meta ads|loja virtual)/.test(p)) return site(ctx);
  if (/(experimental|fechar o plano|nao fechou|nao respondeu|sumiu|follow)/.test(p)) return followUp(ctx);
  if (/(so olha|seguidor|segue|vir a loja|curte)/.test(p)) return seguidores(ctx);
  if (/(horarios? vazio|agenda|todo mes|recorren|encher|encho)/.test(p)) return agenda(ctx);
  if (/(mais (clientes|pacientes|alunos|tutores|vendas|pedidos)|atrair|captar|lotar|voltar|retorn)/.test(p)) return maisClientes(ctx);
  if (/(o que (posso )?postar|ideia de post|conteudo)/.test(p)) return postsDoMes(ctx, hoje, p);

  return {
    texto: `No protótipo, eu respondo às perguntas sugeridas abaixo. Na versão final, respondo qualquer pergunta sobre o marketing de ${ctx.empresa.nome}: Instagram, Google, WhatsApp, avaliações, ofertas e anúncios, sempre com base no seu diagnóstico e nas regras de ${s.nome.toLowerCase()}.`,
  };
}
