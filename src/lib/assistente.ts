/*
  Respostas do assistente no protótipo. Na fase 3, quem responde é a IA, com o diagnóstico, o kit e a
  ficha do nicho no contexto, e as mesmas regras: não inventar dado, não prometer resultado, respeitar o setor
  e indicar a Elev8 quando o pedido é trabalho de profissional.
*/
import type { Contexto } from "./contexto";

export type Resposta = { texto: string; linkElev8?: boolean; linkKit?: boolean };

export const sugestoes = [
  "O que eu faço primeiro esta semana?",
  "Como respondo uma avaliação ruim?",
  "Escreve um post para a Black Friday",
  "Quanto meu Score sobe com o kit?",
  "Preciso de um site novo?",
];

const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function responder(pergunta: string, ctx: Contexto): Resposta {
  const p = normalizar(pergunta);
  const { segmento: s, empresa: e, diagnostico: d, kit } = ctx;

  if (/(avaliac|comentario|review).*(ruim|negativ|1 estrela|reclam)|(ruim|negativ|reclam).*(avaliac|comentario)/.test(p)) {
    return {
      texto: `Responda em até 24 horas, sem discutir em público. Use este modelo e ajuste o nome:\n\n“${kit.respostasAvaliacao[1].texto}”\n\nDepois, resolva a conversa no particular. Quem lê a avaliação presta mais atenção na sua resposta do que na reclamação.`,
      linkKit: true,
    };
  }

  if (/(primeiro|comec|semana|prioridade|o que (eu )?faco)/.test(p)) {
    return {
      texto: `Esta semana, nesta ordem:\n\n1. Imprima a plaquinha do QR code e deixe no balcão (10 min).\n2. Peça avaliação a 10 ${s.cliente} com a mensagem pronta (15 min).\n3. Publique os 3 posts da semana 1 (20 min).\n\nAvaliações são o que mais separa você do 1º colocado, por isso vêm primeiro.`,
      linkKit: true,
    };
  }

  if (/(post|publicac|legenda).*(black|natal|dia d|data|promoc)|black friday/.test(p)) {
    if (!s.permitePreco) {
      return {
        texto: `No seu setor, post de promoção ou desconto vai contra as regras de publicidade (${s.regras[0].replace(/\.$/, "")}). Em vez disso, use a data para um post informativo:\n\n“Fim de ano chegando? Separe 5 minutos para cuidar do que importa. Se você tem alguma dúvida sobre ${e.servico.replace(/^(o|a|os|as) /, "")}, a gente explica sem compromisso. ${s.acao.charAt(0).toUpperCase() + s.acao.slice(1)} pelo WhatsApp do perfil.”`,
      };
    }
    return {
      texto: `Aqui vai um post para a Black Friday, já no padrão da sua marca:\n\nTexto da arte: “Black Friday ${e.nome}”\n\nLegenda: “Só nesta semana: [sua condição] em ${e.servico.replace(/^(o|a|os|as) /, "")}. Válido até [data]. Chama no WhatsApp para garantir o seu. ${e.diferencial}.”\n\nPreencha a condição real e a data de fim antes de publicar. Promoção sem data e sem regra clara gera reclamação.`,
    };
  }

  if (/(score|nota).*(sobe|subir|aument|melhor)|(quanto).*(sobe|subir)/.test(p)) {
    return {
      texto: `Hoje seu Score Digital é ${d.nota}. Aplicando o kit inteiro, a estimativa é chegar a ${d.potencialComKit}, pela fórmula do Score. O que mais pesa: avaliações (você tem 23, o 1º colocado tem 187), perfil do Google completo e bio clara.\n\nIsso é uma estimativa, não uma promessa. A reavaliação no dia 30 mostra o número real.`,
    };
  }

  if (/(site|landing|pagina|anuncio|trafego|google ads|meta ads|instagram ads|loja virtual)/.test(p)) {
    return {
      texto: `Pelo seu diagnóstico, sim: seu site tem nota 41/100 de velocidade no celular e não deixa claro como ${s.acao}. É a parte do Score que o kit não resolve.\n\nIsso já é trabalho de profissional. Na aba Com a Elev8 você vê as opções com preço e o desconto que vale para você.`,
      linkElev8: true,
    };
  }

  return {
    texto:
      "No protótipo, eu respondo às perguntas sugeridas acima. Na versão final, respondo qualquer dúvida sobre o seu diagnóstico, o kit e o seu plano, sempre com base nos seus dados.",
  };
}
