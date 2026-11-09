/*
  Base de conhecimento do consultor de marketing (offline).

  Cada tema é uma resposta de consultor sênior escrita uma vez e montada com os dados do negócio e a ficha do nicho.
  Nada aqui chama IA nem internet: custo zero por pergunta, resposta na hora e sempre dentro das regras do setor.
  Regra de ouro: nenhum número inventado. Os números vêm do diagnóstico; o resto é orientação.

  Para incluir um tema: escreva o título como pergunta (é o que aparece na biblioteca), os gatilhos (palavras que
  a pessoa usaria) e a resposta. O teste garante que o título de cada tema cai no próprio tema.
*/
import type { Contexto } from "./contexto";
import { liderBusca, metricasHoje } from "./mock";
import { ETAPA_FRASE, MESES, lembreteSetor, maiorPerda, maiuscula, mesSP, minuscula, semArtigo, umCliente } from "./consultor-util";
import type { Etapa } from "./mock";

export type Resposta = {
  texto: string;
  linkElev8?: boolean;
  linkKit?: boolean;
  linkPlano?: boolean;
  temaId?: string;
  relacionados?: { id: string; titulo: string }[];
};

export type Categoria = "Comece aqui" | "Google" | "Avaliações" | "Instagram" | "WhatsApp e vendas" | "Clientes que voltam" | "Anúncios e site" | "Posicionamento e regras";

export const CATEGORIAS: Categoria[] = ["Comece aqui", "Google", "Avaliações", "Instagram", "WhatsApp e vendas", "Clientes que voltam", "Anúncios e site", "Posicionamento e regras"];

export type Tema = {
  id: string;
  categoria: Categoria;
  /** Pergunta como aparece na biblioteca. */
  titulo: string;
  /** Palavras ou expressões. "!" no início = expressão forte (decide sozinha). */
  gatilhos: string[];
  /** Ordem de desempate: temas mais específicos primeiro. */
  resposta: (c: Contexto, hoje: Date, pergunta: string) => Resposta;
};

const m = metricasHoje;
const l = liderBusca;

export const TEMAS: Tema[] = [
  // ───────── Comece aqui
  {
    id: "primeira-semana",
    categoria: "Comece aqui",
    titulo: "O que eu faço primeiro esta semana?",
    gatilhos: ["primeiro", "comecar", "comeco", "por onde", "esta semana", "!o que eu faco", "o que faco", "prioridade"],
    resposta: ({ segmento: s, empresa: e, diagnostico: d }) => {
      const p = maiorPerda(d.etapas);
      const passos: Record<Etapa["chave"], string[]> = {
        escolhido: [
          "Imprima a plaquinha do QR code e deixe onde o cliente paga ou espera (10 min).",
          `Peça avaliação a 10 ${s.cliente} com a mensagem pronta do kit (15 min).`,
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
    },
  },
  {
    id: "score",
    categoria: "Comece aqui",
    titulo: "Quanto meu Score sobe com o kit?",
    gatilhos: ["score", "sobe", "subir", "pontuacao", "pontos", "!score digital"],
    resposta: ({ diagnostico: d }) => ({
      texto: `Hoje seu Score Digital é ${d.nota}. Aplicando o kit inteiro, a estimativa é chegar a ${d.potencialComKit}, pela fórmula do Score. O que mais pesa: avaliações (você tem ${m.avaliacoes}, o 1º colocado tem ${l.avaliacoes}), perfil do Google completo e bio clara.\n\nIsso é uma estimativa, não uma promessa. A reavaliação no dia 30 mostra o número real, comparando com os concorrentes como estavam no dia do diagnóstico.`,
    }),
  },
  {
    id: "sem-tempo",
    categoria: "Comece aqui",
    titulo: "Não tenho tempo para marketing. O que é o mínimo?",
    gatilhos: ["tempo", "!sem tempo", "!nao tenho tempo", "correria", "ocupado", "rotina", "minimo"],
    resposta: ({ segmento: s }) => ({
      texto: `Marketing de negócio local não pede horas por dia, pede rotina. Uma agenda de 30 minutos por semana:\n\n• Segunda (10 min): responder avaliações novas e pedir avaliação a 3 ${s.cliente}.\n• Quarta (10 min): publicar o post da semana, que já está pronto no kit.\n• Sexta (10 min): retomar 3 conversas do WhatsApp que pararam.\n\nColoque como compromisso fixo no celular, como se fosse um ${umCliente(s)}. Os textos prontos do kit fazem esses 30 minutos renderem.\n\nSe nem isso couber na sua semana, aí vale delegar a rotina das redes.`,
      linkKit: true,
      linkElev8: true,
    }),
  },

  // ───────── Google
  {
    id: "google-perfil",
    categoria: "Google",
    titulo: "Como aparecer melhor no Google Maps?",
    gatilhos: ["google", "maps", "mapa", "!perfil da empresa", "!google maps", "aparecer no google", "busca", "pesquisa", "ranking"],
    resposta: ({ segmento: s, empresa: e }) => ({
      texto: `No Google Maps pesam três coisas: relevância (o perfil diz com clareza o que você faz), distância (essa não dá para mudar) e destaque (avaliações, fotos e um perfil ativo). Seu perfil está ${m.perfilPreenchido}% preenchido; o do 1º colocado, 100%.\n\nNesta ordem:\n1. Categoria principal exata (“${e.buscaTermo}”) e 2 secundárias.\n2. A descrição pronta do kit, que já cita cidade e serviço.\n3. Serviços cadastrados${s.permitePreco ? ", com valor inicial" : ", sem preço"}.\n4. Horário completo, inclusive feriados.\n5. 10 fotos reais agora e uma nova por semana.\n\nNão coloque palavra-chave no nome da empresa (tipo “${e.nome} ${e.buscaTermo} ${e.cidade}”): vai contra as regras do Google e pode suspender o perfil.`,
      linkKit: true,
    }),
  },
  {
    id: "google-fotos",
    categoria: "Google",
    titulo: "Que fotos devo colocar no Google?",
    gatilhos: ["foto", "fotos", "imagem", "imagens", "!que fotos"],
    resposta: ({ segmento: s }) => ({
      texto: `Foto real ganha de foto bonita de banco de imagem: quem procura quer saber como é o lugar e quem vai atender. Você tem ${m.fotos} fotos; o 1º colocado tem ${l.fotos}.\n\nO conjunto mínimo:\n• 2 da fachada (uma de longe, para a pessoa achar a porta)\n• 3 do ambiente por dentro\n• 3 do trabalho: ${minuscula(s.temas.bastidor)}\n• 2 da equipe\n\nDepois, uma foto nova por semana. Celular na horizontal, luz natural, sem filtro pesado.${s.regras.some((r) => /foto|antes e depois/i.test(r)) ? ` Atenção à regra do setor: ${minuscula(s.regras.find((r) => /foto|antes e depois/i.test(r))!)}` : ""}`,
    }),
  },
  {
    id: "ia",
    categoria: "Google",
    titulo: "Como aparecer quando perguntam ao ChatGPT?",
    gatilhos: ["!chatgpt", "!gemini", "!inteligencia artificial", "!ia", "!perplexity", "copilot", "robo"],
    resposta: ({ diagnostico: d }) => ({
      texto: `Ninguém consegue garantir isso, e desconfie de quem promete. O que se sabe: essas IAs recomendam negócios locais a partir do que está publicado sobre eles, como o perfil do Google, as avaliações, o site e menções em outros sites.\n\nO que aumenta a sua chance:\n1. Perfil do Google completo e coerente: mesmo nome, endereço e telefone em todo lugar.\n2. Avaliações que contam o serviço feito. Pode pedir: “se puder, conta qual serviço você fez”.\n3. Um site que diz com clareza o que você faz, para quem e onde.\n4. Aparecer em guias e listas da sua cidade.\n\nNo seu diagnóstico, o teste das IAs mostra quem elas citam hoje para “${d.busca}”. A reavaliação refaz o teste.`,
    }),
  },

  // ───────── Avaliações
  {
    id: "avaliacao-falsa",
    categoria: "Avaliações",
    titulo: "Recebi uma avaliação falsa. Como resolvo?",
    gatilhos: ["!avaliacao falsa", "falsa", "fake", "!nunca foi cliente", "injusta", "mentira", "denunciar", "remover avaliacao", "apagar avaliacao"],
    resposta: () => ({
      texto: `Primeiro, responda em público, com calma e sem acusar:\n“Não encontramos o seu atendimento no nosso histórico. Se você esteve aqui, chama a gente no WhatsApp para entendermos o que aconteceu.”\nQuem lê entende o recado.\n\nDepois, denuncie a avaliação no Google pelo seu Perfil da Empresa (opção de denunciar na própria avaliação). Funciona melhor quando ela fere as regras do Google: ofensa, conflito de interesse, conteúdo falso ou spam. A análise pode levar dias e nem sempre remove.\n\nNão peça para amigos avaliarem para “compensar”: também vai contra as regras e pode derrubar avaliações verdadeiras.`,
    }),
  },
  {
    id: "avaliacao-ruim",
    categoria: "Avaliações",
    titulo: "Como respondo uma avaliação ruim?",
    gatilhos: ["!avaliacao ruim", "!avaliacao negativa", "reclamacao", "reclamou", "reclamando", "!1 estrela", "!uma estrela", "critica", "nota baixa", "falou mal"],
    resposta: ({ kit }) => ({
      texto: `Responda em até 24 horas, com calma e sem discutir em público. Não ofereça desconto na resposta: isso ensina que reclamar dá desconto. Use este modelo e ajuste o nome:\n\n“${kit.respostasAvaliacao[1].texto}”\n\nDepois, resolva no particular. Quem lê a avaliação presta mais atenção na sua resposta do que na reclamação.`,
      linkKit: true,
    }),
  },
  {
    id: "avaliacao-boa",
    categoria: "Avaliações",
    titulo: "Preciso responder avaliação boa?",
    gatilhos: ["!avaliacao boa", "!avaliacao positiva", "elogio", "elogiou", "!5 estrelas", "!cinco estrelas", "agradecer"],
    resposta: ({ kit }) => ({
      texto: `Sim, todas, inclusive as de 5 estrelas sem texto. Mostra que tem gente cuidando, e quem está decidindo percebe. Você respondeu ${m.respostasAvaliacoes}% das suas avaliações.\n\nPersonalize com o nome e, se der, um detalhe do atendimento:\n“${kit.respostasAvaliacao[0].texto}”\n\nVarie o texto. A mesma resposta copiada em todas parece robô. Responder as antigas também vale.`,
      linkKit: true,
    }),
  },
  {
    id: "pedir-avaliacoes",
    categoria: "Avaliações",
    titulo: "Como consigo mais avaliações no Google?",
    gatilhos: ["!mais avaliacoes", "!pedir avaliacao", "avaliacao", "avaliacoes", "estrelas", "qr code", "plaquinha", "review"],
    resposta: ({ segmento: s }) => ({
      texto: `Pedindo para todos os ${s.cliente}, no momento certo e com o link na mão. Avaliação não vem sozinha: quem gostou esquece, quem não gostou lembra. Você tem ${m.avaliacoes}; o 1º colocado tem ${l.avaliacoes}.\n\n1. Na hora: a plaquinha do QR code onde o ${umCliente(s)} paga ou espera.\n2. No mesmo dia: a mensagem pronta do kit, com o link direto.\n3. Para quem já foi atendido: 10 pedidos por semana.\n\nDuas regras do Google: não ofereça brinde ou desconto em troca de avaliação, e peça para todos, não só para quem você acha que vai elogiar. Quebrar essas regras pode fazer o Google remover avaliações.`,
      linkKit: true,
    }),
  },

  // ───────── Instagram
  {
    id: "bio",
    categoria: "Instagram",
    titulo: "Como deve ser a minha bio do Instagram?",
    gatilhos: ["!bio", "biografia", "descricao do instagram", "perfil do instagram"],
    resposta: ({ empresa: e, kit }) => ({
      texto: `A bio tem uma função: em 3 segundos, dizer o que você faz, onde e como agir. A sua hoje é “${e.bioAtual.replace(/\n/g, " ")}”. Ela não diz o que você faz nem como dar o próximo passo.\n\nUma das versões prontas do kit:\n“${kit.bios[0].texto.replace(/\n/g, " / ")}”\n\nLinha 1: o que você é e onde. Linha 2: o seu diferencial. Linha 3: a ação, com o link do WhatsApp. Emoji só se ajudar a ler.`,
      linkKit: true,
    }),
  },
  {
    id: "posts-do-mes",
    categoria: "Instagram",
    titulo: "Quais datas comemorativas usar nos posts?",
    gatilhos: [
      "!datas", "!data comemorativa", "!black friday", "!natal", "!dia das maes", "!dia dos pais", "!dia dos namorados", "!ano novo",
      ...MESES.map((x) => `!${x}`), "post", "postar",
    ],
    resposta: ({ segmento: s, empresa: e }, hoje, p) => {
      const mes = mesSP(hoje);
      const proximo = (mes % 12) + 1;
      const pedeBlack = /black/.test(p);
      if (pedeBlack && !s.permitePreco)
        return {
          texto: `No seu setor, post de promoção ou desconto vai contra as regras de publicidade. Use a data para um post informativo:\n\n“Fim de ano chegando? Separe 5 minutos para cuidar do que importa. Se você tem dúvidas sobre ${semArtigo(e.servico)}, a gente explica, sem compromisso. ${maiuscula(s.acao)} pelo WhatsApp do perfil.”`,
        };
      if (pedeBlack)
        return {
          texto: `Post para a Black Friday, já no padrão da sua marca:\n\nTexto da arte: “Black Friday ${e.nome}”\n\nLegenda: “Só nesta semana: [sua condição] em ${semArtigo(e.servico)}. Válido até [data]. Chama no WhatsApp para garantir o seu. ${e.diferencial}.”\n\nPreencha a condição real e a data de fim antes de publicar. Promoção sem data e sem regra clara gera reclamação e tira a confiança no resto do ano. Avise primeiro quem já é cliente, um dia antes do post.`,
        };
      const datas = s.consultor.datas.filter((x) => x.mes === mes || x.mes === proximo);
      const lista = datas.length
        ? datas.map((x) => `• ${x.nome}: ${x.ideia}.`).join("\n")
        : "• Este mês não tem uma data forte para o seu setor. Use os posts do plano e capriche nas fotos reais.";
      return {
        texto: `As datas que movem o seu setor em ${MESES[mes - 1]} e ${MESES[proximo - 1]}:\n\n${lista}\n\nOs posts do seu kit já estão prontos para as 4 semanas. Na semana da data, troque um deles por esse tema e publique com uns 7 dias de antecedência: quem planeja decide antes.\n\n${s.permitePreco ? "Se fizer oferta, coloque condição e data de fim reais." : "Lembre: sem preço e sem promoção, só informação."}`,
        linkKit: true,
      };
    },
  },
  {
    id: "o-que-postar",
    categoria: "Instagram",
    titulo: "Que tipo de post funciona no meu setor?",
    gatilhos: ["o que postar", "!ideia de post", "!ideias de post", "conteudo", "!sem ideia", "assunto", "tipo de post", "post", "postar"],
    resposta: ({ segmento: s }) => ({
      texto: `Post que traz ${s.cliente} responde dúvida, mostra bastidor e prova que você é de verdade. Cinco ideias prontas para ${s.nome.toLowerCase()}:\n• ${s.temas.dor}\n• ${s.temas.comparacao}\n• ${s.temas.mito}\n• ${s.temas.cuidados}\n• ${s.temas.primeiraVez}\n\nAlterne três tipos: um que ensina, um que mostra bastidor com foto real e um que chama para ${s.acao}. Seu kit já tem 12 desses prontos, com legenda e arte.${lembreteSetor(s)}`,
      linkKit: true,
    }),
  },
  {
    id: "frequencia",
    categoria: "Instagram",
    titulo: "Quantas vezes por semana devo postar, e em que horário?",
    gatilhos: ["!quantas vezes", "frequencia", "!melhor horario", "!melhor hora", "!todo dia", "!quantos posts", "horario de postar"],
    resposta: () => ({
      texto: `Constância ganha de quantidade. Três posts por semana que você consegue manter rendem mais do que um por dia durante duas semanas e depois nada. Hoje você posta ${m.postsPorSemana} por semana.\n\nHorário: não existe hora mágica que vale para todo mundo. Nas estatísticas do Instagram (Painel profissional), veja em que horários os seus seguidores mais ficam online. Publique perto do pico e compare por 4 semanas antes de mudar.`,
    }),
  },
  {
    id: "stories",
    categoria: "Instagram",
    titulo: "Como usar os stories para vender?",
    gatilhos: ["!stories", "!story", "caixinha", "enquete"],
    resposta: ({ segmento: s }) => ({
      texto: `O feed apresenta você para quem ainda não conhece; os stories são onde quem já segue decide chamar. Uma sequência simples por dia útil, de 3 a 5 stories:\n1. Bastidor do dia: o que está acontecendo agora.\n2. Algo útil ou uma dúvida respondida.\n3. Chamada direta, com a figurinha de link do WhatsApp: “${maiuscula(s.acao)}? Me chama aqui.”\n\nUma vez por semana, use enquete ou caixinha de perguntas. Cada resposta vira conversa no direct, e conversa é o caminho até virar ${umCliente(s)}.${lembreteSetor(s)}`,
    }),
  },
  {
    id: "reels",
    categoria: "Instagram",
    titulo: "Vale a pena fazer vídeos e Reels?",
    gatilhos: ["!reels", "!reel", "video", "videos", "tiktok", "gravar", "filmar"],
    resposta: ({ segmento: s }) => ({
      texto: `Vale: é o formato que mais aparece para quem ainda não te segue. E não precisa dançar nem aparecer, se não quiser. Três formatos fáceis:\n• Preparação: 15 segundos de ${minuscula(s.temas.bastidor)}.\n• Dúvida frequente: você ou um texto na tela respondendo “${s.temas.mito}”.\n• Tour de 10 segundos pelo espaço.\n\nGrave na vertical, com luz natural, e coloque legenda na tela: muita gente assiste sem som. Um vídeo por semana já faz diferença.${lembreteSetor(s)}`,
    }),
  },
  {
    id: "seguidores-clientes",
    categoria: "Instagram",
    titulo: "Como transformar seguidor em cliente?",
    gatilhos: ["!so olha", "!vir a loja", "!seguidor em cliente", "!seguidores em clientes", "nao compra", "curte", "visualiza"],
    resposta: ({ segmento: s, empresa: e }) => ({
      texto: `Quem só olha precisa de dois empurrões: um motivo para vir agora e um caminho fácil.\n\n1. Todo post termina com um pedido claro: ${s.acao} pelo WhatsApp, com o link na bio.\n2. Stories com novidade real (“chegou hoje”, “horário livre amanhã”), sempre com a figurinha de link.\n3. Respondeu um story ou comentou? Responda com convite direto:\n“Que bom que você gostou! Quer que eu separe para você? É só me dizer o melhor dia.”\n4. Fixe no topo do perfil os 3 posts que mais explicam por que escolher ${e.nome}.\n\nCurtida não paga conta: meça quantas conversas no WhatsApp vieram do Instagram por semana.`,
    }),
  },
  {
    id: "crescer-seguidores",
    categoria: "Instagram",
    titulo: "Como ganhar mais seguidores? Vale comprar?",
    gatilhos: ["!seguidores", "!comprar seguidores", "!mais seguidores", "crescer", "engajamento", "alcance", "viralizar"],
    resposta: ({ segmento: s, empresa: e }) => ({
      texto: `Não compre seguidores. Eles não compram de você, tendem a derrubar o alcance dos seus posts (o Instagram passa a mostrar para gente que nunca interage) e quem percebe perde a confiança.\n\nPara negócio local, seguidor bom é quem mora perto:\n1. Marque a localização (${e.cidade}) em todo post.\n2. Faça um post em colaboração com um negócio vizinho que atende o mesmo público.\n3. Peça para ${s.cliente} marcarem o seu perfil nos stories e reposte.\n4. Reels com tema da cidade.\n\nMeça conversas no WhatsApp, não seguidores: 500 seguidores de ${e.cidade} valem mais do que 10 mil de qualquer lugar.`,
    }),
  },

  // ───────── WhatsApp e vendas
  {
    id: "preco",
    categoria: "WhatsApp e vendas",
    titulo: "Como respondo quem pergunta o preço?",
    gatilhos: ["!preco", "!valor", "!quanto custa", "!caro", "orcamento", "tabela", "cobrar"],
    resposta: ({ segmento: s, empresa: e }, _h, p) => {
      if (!s.permitePreco) {
        const encontro = s.acao.replace(/^(agendar|marcar) /, "");
        return {
          texto: `No seu setor, preço não aparece em post nem em anúncio. Na conversa individual, quando a pessoa pergunta, o caminho mais seguro é explicar que o valor depende do caso e levar para ${encontro}.\n\nModelo pronto:\n“Oi, [nome]! Obrigado por chamar. O valor depende do que você precisa, e só conseguimos te passar com segurança depois de entender o seu caso. Na primeira conversa a gente explica tudo, sem compromisso. Prefere de manhã ou à tarde?”\n\nTerminar com duas opções de horário facilita a resposta. Uma regra do setor para lembrar sempre. ${s.regras[0]} Em caso de dúvida, confirme com o seu conselho.`,
        };
      }
      const acham = /caro/.test(p);
      return {
        texto: `${acham ? "Quando acham caro, quase nunca o problema é o número: a pessoa ainda não viu a diferença entre você e o concorrente." : "Quem pergunta o preço quase sempre está comparando."} Se você manda só o número, a decisão vira disputa de preço. A ordem que funciona:\n\n1. Agradeça e faça uma pergunta: “${maiuscula(s.perguntaInicial)}”\n2. Mostre o que está incluso antes do valor.\n3. Diga o preço com clareza, sem rodeio.\n4. Termine com um próximo passo fácil.\n\nModelo pronto, depois que a pessoa disser o que precisa:\n“Oi, [nome]! Que bom que você chamou. ${maiuscula(semArtigo(e.servico))} sai por ${e.preco ?? "[seu valor]"}, e o que faz diferença aqui é: ${minuscula(e.diferencial)}. Quer que eu veja um horário para você esta semana?”\n\nResponda rápido: quem espera horas para ter resposta costuma fechar com quem respondeu primeiro.`,
      };
    },
  },
  {
    id: "vou-pensar",
    categoria: "WhatsApp e vendas",
    titulo: "O cliente disse “vou pensar”. E agora?",
    gatilhos: ["!vou pensar", "!vai pensar", "!depois eu vejo", "pensar", "objecao", "indeciso", "enrolando"],
    resposta: ({ segmento: s }) => ({
      texto: `“Vou pensar” quase sempre esconde uma dúvida que a pessoa não falou: valor, horário, confiança ou se precisa mesmo. Não pressione; descubra qual é:\n“Claro, [nome]! Para eu te ajudar a decidir: ficou alguma dúvida sobre como funciona, sobre o valor ou sobre o horário?”\n\nCom a resposta, responda só aquela dúvida. ${s.permitePreco ? "Se for valor, mostre o que está incluso antes de pensar em desconto." : "Se for valor, explique o que acontece no primeiro atendimento e por que o valor depende do caso."}\n\nSe a pessoa não responder, siga a sequência de retomada: três contatos e pronto.`,
    }),
  },
  {
    id: "followup",
    categoria: "WhatsApp e vendas",
    titulo: "Como retomar quem demonstrou interesse e sumiu?",
    gatilhos: ["!follow up", "!sumiu", "!nao respondeu", "!nao fechou", "!parou de responder", "!fechar o plano", "experimental", "visualizou", "retomar conversa", "sumir"],
    resposta: ({ segmento: s, empresa: e }) => ({
      texto: `Quem demonstrou interesse e não fechou precisa de um segundo contato. Muita venda se perde só porque ninguém voltou a falar.\n\nSequência simples:\n1. No mesmo dia: agradeça e pergunte se ficou alguma dúvida.\n2. Dois dias depois: mande algo útil (um post do seu perfil que responda a dúvida da pessoa) e convide para ${s.acao}.\n3. Uma semana depois: última mensagem, leve, deixando a porta aberta.\n\nModelo para o passo 1:\n“Oi, [nome]! Aqui é da equipe ${e.nome}. Foi bom falar com você. Ficou alguma dúvida? Se quiser, já vejo um horário para você.”\n\nTrês contatos e pronto. Mais do que isso vira insistência.`,
    }),
  },
  {
    id: "atendimento-whatsapp",
    categoria: "WhatsApp e vendas",
    titulo: "Como atender melhor no WhatsApp?",
    gatilhos: ["whatsapp", "atender", "atendimento", "!primeira mensagem", "!mensagem automatica", "!whatsapp business", "!respostas rapidas", "ausencia", "demoro", "responder mensagem"],
    resposta: ({ kit }) => ({
      texto: `No WhatsApp, quem responde primeiro costuma levar. Três regras:\n1. Responda em poucos minutos no horário de atendimento. Fora dele, mensagem de ausência dizendo quando você volta.\n2. Primeira resposta com pergunta, não com tabela:\n“${kit.mensagensWhatsapp[0].texto}”\n3. Termine toda conversa com um próximo passo claro: dia, horário ou link.\n\nNo WhatsApp Business, configure a saudação, a mensagem de ausência e as respostas rápidas com os textos do kit. Leva 15 minutos e resolve boa parte do trabalho repetido.`,
      linkKit: true,
    }),
  },
  {
    id: "desconto",
    categoria: "WhatsApp e vendas",
    titulo: "Devo dar desconto ou fazer promoção?",
    gatilhos: ["!desconto", "!promocao", "oferta", "cupom", "liquidacao", "baixar o preco"],
    resposta: ({ segmento: s, empresa: e }) =>
      s.permitePreco
        ? {
            texto: `Desconto é a última ferramenta, não a primeira. Ele ensina o ${umCliente(s)} a esperar a próxima promoção e come a sua margem. Antes do desconto, tente:\n1. Pacote: ${semArtigo(e.servico)} com um complemento, por um valor fechado.\n2. Facilitar o pagamento (parcelar) em vez de baixar o preço.\n3. Um bônus com data: algo a mais para quem fechar até [data].\n\nSe for dar desconto, que tenha motivo, regra e data de fim reais. E nunca como resposta a quem reclamou do preço em público.`,
          }
        : {
            texto: `No seu setor, desconto e promoção não podem aparecer em publicidade. ${s.regras[0]}\n\nO que funciona no lugar:\n1. Explicar bem o que está incluso no atendimento.\n2. No atendimento individual, quando a pessoa pergunta, falar das formas de pagamento.\n3. Conteúdo informativo que mostra a sua experiência: é ele que faz a pessoa escolher você sem precisar de oferta.`,
          },
  },

  // ───────── Clientes que voltam
  {
    id: "faltas",
    categoria: "Clientes que voltam",
    titulo: "O que fazer com cliente que marca e falta?",
    gatilhos: ["!marca e falta", "!faltou", "falta", "faltam", "!nao aparece", "desmarca", "!no show", "cancelamento", "cancela"],
    resposta: ({ segmento: s }) => ({
      texto: `Falta se resolve com lembrete e compromisso, não com bronca:\n1. Confirmação no dia anterior:\n“Oi, [nome]! Confirmando seu horário amanhã às [hora]. Posso manter? Se não der, me avisa que eu passo para outra pessoa.”\n2. Pedir uma resposta (“sim”) cria compromisso.\n3. Lista de espera para encaixar alguém quando um horário libera.\n4. Para quem falta sempre: ${s.permitePreco ? "sinal para reservar, por Pix, ou horário só com confirmação" : "horário só com confirmação no dia"}.\n\nAnote as faltas por semana. Em um mês você vê se caiu.`,
    }),
  },
  {
    id: "agenda",
    categoria: "Clientes que voltam",
    titulo: "Como encher os horários vazios da agenda?",
    gatilhos: ["!horarios vazios", "!horario vazio", "!encher a agenda", "!agenda vazia", "!todo mes", "!meio da semana", "encho", "encher", "recorrencia", "recorrente", "dias parados"],
    resposta: ({ segmento: s, empresa: e }) => ({
      texto: `Agenda cheia vem de rotina, não de post. Quatro hábitos:\n\n1. Marque o próximo horário antes de o ${umCliente(s)} ir embora: “Quer que eu já deixe reservado?”\n2. Mande lembrete perto da data ideal de retorno:\n“Oi, [nome]! Aqui é da equipe ${e.nome}. Já faz um tempo desde ${s.consultor.retorno}. Quer que eu veja um horário para esta semana?”\n3. Horários vazios: ofereça primeiro para quem já é cliente, por mensagem individual${s.permitePreco ? ", e, se quiser, com uma condição só para os dias mais parados" : ", sem promoção"}.\n4. Lista de espera: quem não conseguiu horário recebe aviso quando abrir vaga.\n\nO 1 sozinho já muda a agenda: quem sai com horário marcado volta muito mais do que quem fica de “ver depois”.`,
    }),
  },
  {
    id: "pos-venda",
    categoria: "Clientes que voltam",
    titulo: "Como fazer o cliente voltar mais vezes?",
    gatilhos: ["!voltar mais", "!pos venda", "voltar", "volte", "voltem", "fidelizar", "fidelidade", "fiel", "recompra", "retorno"],
    resposta: ({ segmento: s, kit }) => ({
      texto: `Quem já comprou é o ${umCliente(s)} mais barato de conquistar de novo. Pós-venda em três toques:\n1. No dia seguinte:\n“${kit.mensagensWhatsapp[3].texto}”\n2. Na data ideal de retorno: lembrete com o nome da pessoa.\n3. Em datas especiais: mensagem curta, sem vender nada.\n\nGuarde nome, telefone, data e o que a pessoa fez numa planilha simples. É o começo da sua lista de ${s.cliente}, e ela vale mais do que qualquer número de seguidores.${lembreteSetor(s)}`,
      linkKit: true,
    }),
  },
  {
    id: "indicacao",
    categoria: "Clientes que voltam",
    titulo: "Como peço indicação sem parecer chato?",
    gatilhos: ["!indicacao", "!indicar", "indica", "!boca a boca"],
    resposta: ({ segmento: s, empresa: e }) => ({
      texto: `Peça na hora certa: logo depois que o ${umCliente(s)} elogiar ou agradecer. E seja específico, porque um pedido vago (“indica a gente!”) quase nunca vira indicação.\n\nModelo pronto:\n“Que bom que você gostou, [nome]! Se você conhece alguém que também precisa, pode passar o nosso contato. A gente atende com o mesmo cuidado.”\n\nMande junto o link do WhatsApp de ${e.nome}, pronto para encaminhar. Quando a indicação chegar, agradeça a quem indicou: isso faz a pessoa indicar de novo.${s.permitePreco ? "" : " No seu setor, não ofereça prêmio ou desconto por indicação."}`,
    }),
  },
  {
    id: "mais-clientes",
    categoria: "Clientes que voltam",
    titulo: "Como consigo mais clientes este mês?",
    gatilhos: ["!mais clientes", "!mais pacientes", "!mais alunos", "!mais tutores", "!mais vendas", "!mais pedidos", "!vender mais", "atrair", "captar", "!clientes novos", "movimento", "fraco"],
    resposta: ({ segmento: s, empresa: e }) => {
      const mensagem = s.permitePreco
        ? `“Oi, [nome]! Aqui é da equipe ${e.nome}. Faz um tempo desde ${s.consultor.retorno} e lembrei de você. Se quiser ${s.acao} esta semana, é só me responder por aqui.”`
        : `“Oi, [nome]! Aqui é da equipe ${e.nome}. Passando para lembrar que já faz um tempo desde ${s.consultor.retorno}. Se precisar de algo, é só responder aqui.”`;
      return {
        texto: `O caminho mais rápido não é post novo, é quem já te conhece. Três frentes, nesta ordem:\n\n1. Retome contato com quem não volta há 60 dias ou mais. Mensagem individual, com o nome da pessoa, nunca lista genérica:\n${mensagem}\n\n2. Peça indicação na hora em que o ${umCliente(s)} agradece. É quando ele está mais disposto a indicar.\n\n3. Peça avaliação no Google. É lá que quem procura ${e.buscaTermo} em ${e.cidade} compara você com os concorrentes.\n\nComece pela 1: essas pessoas já confiam em você, então a resposta vem mais rápido.${s.permitePreco ? "" : " No seu setor, o contato é lembrete e informação, sem promoção."}`,
      };
    },
  },

  // ───────── Anúncios e site
  {
    id: "google-ads",
    categoria: "Anúncios e site",
    titulo: "Vale a pena anunciar no Google?",
    gatilhos: ["!google ads", "!anunciar no google", "!anuncio no google", "!links patrocinados", "adwords"],
    resposta: ({ segmento: s, diagnostico: d }) => ({
      texto: `Vale quando as pessoas já procuram o que você faz, como “${d.busca}”. O anúncio aparece para quem está decidindo agora, diferente do Instagram, onde você interrompe quem está rolando a tela.\n\nAntes de anunciar:\n1. Perfil do Google completo e com avaliações.\n2. Um destino que converte: site rápido ou WhatsApp com resposta rápida.\n3. Um valor de teste e uma meta de custo por contato.\n\nGoogle Ads mal configurado gasta rápido com cliques de outras cidades e buscas erradas. Para investir de verdade, é trabalho de gestor de tráfego.${lembreteSetor(s)}`,
      linkElev8: true,
    }),
  },
  {
    id: "impulsionar",
    categoria: "Anúncios e site",
    titulo: "Vale a pena impulsionar post?",
    gatilhos: ["!impulsionar", "!impulsionamento", "impulsiono", "patrocinar", "turbinar", "!meta ads", "!facebook ads", "!trafego pago", "anunciar", "anuncio", "anuncios"],
    resposta: ({ segmento: s, empresa: e }) => ({
      texto: `Vale, se três coisas estiverem prontas: um perfil que convence (bio clara, posts fixados), um post que já foi bem sem dinheiro e alguém para responder o WhatsApp rápido. Sem isso, você paga para mandar gente para um perfil que não convence.\n\nPara testar:\n1. Escolha o post com mais salvamentos e mensagens.\n2. Público: ${e.cidade} e região próxima.\n3. Objetivo: mensagens no WhatsApp, não curtidas.\n4. Um valor que você aceita usar só para aprender.\n5. Olhe o custo por conversa e quantas viraram ${s.cliente}.\n\nQuando quiser campanha de verdade, com públicos, criativos e acompanhamento semanal, é trabalho de gestor de tráfego.${s.permitePreco ? "" : " No seu setor, anúncio segue as mesmas regras dos posts: sem preço e sem promoção."}`,
      linkElev8: true,
    }),
  },
  {
    id: "site",
    categoria: "Anúncios e site",
    titulo: "Preciso de um site novo?",
    gatilhos: ["!site", "landing", "pagina", "!loja virtual", "ecommerce", "dominio"],
    resposta: ({ segmento: s }) => ({
      texto: `Pelo seu diagnóstico, sim: seu site tem nota ${m.velocidadeSite}/100 de velocidade no celular e não deixa claro como ${s.acao}. É a parte do Score que o kit não resolve.\n\nUm bom site de negócio local faz três coisas na primeira tela: diz o que você faz, onde, e tem um botão para ${s.acao}. Isso já é trabalho de profissional. Na aba Com a Elev8 você vê as opções com preço e o desconto que vale para você.`,
      linkElev8: true,
    }),
  },

  // ───────── Posicionamento e regras
  {
    id: "regras-setor",
    categoria: "Posicionamento e regras",
    titulo: "O que posso postar sem quebrar as regras do meu setor?",
    gatilhos: ["!regra", "!oab", "!conselho", "cfo", "permitido", "!posso postar", "!pode postar", "proibido", "etica"],
    resposta: ({ segmento: s }) => ({
      texto: `Em tudo o que eu escrevo para você, sigo as regras de ${s.nome.toLowerCase()}:\n${s.regras.map((r) => `• ${r}`).join("\n")}\n\nO que funciona bem dentro delas:\n• ${s.temas.mito}\n• ${s.temas.cuidados}\n• ${s.temas.primeiraVez}\n• Bastidor com foto real: ${minuscula(s.temas.bastidor)}\n\nConteúdo que ensina e mostra como você trabalha gera confiança sem esbarrar nas regras.${s.permitePreco ? "" : " Num caso específico, confirme com o seu conselho ou entidade de classe."}`,
      linkKit: true,
    }),
  },
  {
    id: "diferencial",
    categoria: "Posicionamento e regras",
    titulo: "Como me diferenciar dos concorrentes?",
    gatilhos: ["!diferencial", "!diferenciar", "destacar", "concorrente", "concorrentes", "concorrencia", "posicionamento"],
    resposta: ({ segmento: s, empresa: e }) => ({
      texto: `Diferencial bom é específico, verdadeiro e percebido pelo ${umCliente(s)}. “Qualidade” e “atendimento diferenciado” todo mundo diz. O seu, informado por você: “${e.diferencial}”.\n\nUse isso em tudo: bio, primeira resposta do WhatsApp, descrição do Google e um post fixado mostrando como funciona na prática.\n\nPara achar mais diferenciais: leia as avaliações de ${e.concorrentes[0]} e ${e.concorrentes[1]} e anote do que os ${s.cliente} reclamam. Cada reclamação repetida de um concorrente é uma promessa que você pode cumprir e mostrar.`,
    }),
  },
  {
    id: "marca",
    categoria: "Posicionamento e regras",
    titulo: "Preciso mudar meu logo ou minha marca?",
    gatilhos: ["!logo", "logotipo", "!identidade visual", "marca", "cores", "!nome da empresa"],
    resposta: () => ({
      texto: `Só se ela atrapalha: logo ilegível no celular, cores diferentes em cada lugar ou um visual que não combina com o que você cobra.\n\nAntes de trocar o logo, padronize: as mesmas 2 cores, a mesma fonte e a mesma foto de perfil no Instagram, no Google e no WhatsApp. Só isso já passa profissionalismo.\n\nSe a marca realmente não representa mais o negócio, identidade visual é trabalho de designer.`,
      linkElev8: true,
    }),
  },
];
