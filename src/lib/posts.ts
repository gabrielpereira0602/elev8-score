/*
  Gerador do calendário de posts.

  Na fase 3, a IA escreve as legendas com os dados reais da empresa. A estrutura abaixo é fixa e
  é o que garante qualidade em qualquer nicho: 12 posts em 4 semanas, mistura de arte pronta e
  foto real, modelos de arte que se alternam e temas tirados da ficha do nicho (segmentos.ts).
*/
import { segmentos, type SegmentoId } from "./segmentos";

export type Layout = "destaque" | "carrossel" | "pergunta" | "mito" | "aviso" | "depoimento";
export type Variante = "cheia" | "clara" | "escura";

export type Empresa = {
  nome: string;
  cidade: string;
  segmento: SegmentoId;
  servico: string; // serviço principal, informado no formulário pós-compra
  preco?: string; // só usado quando o setor permite e o empresário informou
  cor: string; // cor principal da marca (do logo ou escolhida)
};

export type Post = {
  semana: number;
  tipo: "Arte pronta" | "Foto sua";
  layout?: Layout;
  variante?: Variante;
  gancho: string;
  legenda: string;
  foto?: string;
  prompt: string;
};

const maiuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export function gerarPosts(e: Empresa): Post[] {
  const s = segmentos[e.segmento];
  const cta = `Para ${s.acao}, chame no WhatsApp pelo link da bio.`;
  const podePreco = s.permitePreco && !!e.preco;

  // Ordem pensada para o feed: nunca duas artes do mesmo modelo ou da mesma cor em sequência.
  const base: Omit<Post, "prompt">[] = [
    { semana: 1, tipo: "Arte pronta", layout: "destaque", variante: "cheia", gancho: s.temas.dor, legenda: `Se você se identificou com algum desses sinais, é hora de procurar ajuda profissional. Aqui, cada caso é avaliado com calma. ${cta}` },
    { semana: 1, tipo: "Foto sua", gancho: `Conheça quem vai cuidar de você`, foto: s.temas.equipe, legenda: `Prazer! Aqui é a equipe ${e.nome}, de ${e.cidade}. Por trás de cada atendimento tem gente que gosta do que faz. Conta pra gente nos comentários: o que você quer ver por aqui?` },
    podePreco
      ? { semana: 1, tipo: "Arte pronta", layout: "pergunta", variante: "clara", gancho: `Quanto custa ${e.servico}?`, legenda: `${maiuscula(e.servico)} aqui sai a partir de ${e.preco}. Sem surpresa no valor: tudo é explicado antes de começar. ${cta}` }
      : { semana: 1, tipo: "Arte pronta", layout: "pergunta", variante: "clara", gancho: s.temas.primeiraVez, legenda: `Muitos ${s.cliente} chegam com dúvida sobre o primeiro contato. Aqui ele é simples: você conta o que precisa, a gente explica o caminho e você decide com calma. ${cta}` },
    { semana: 2, tipo: "Foto sua", gancho: `Nossos bastidores`, foto: s.temas.bastidor, legenda: `É aqui que tudo acontece. Um ambiente pensado para você se sentir à vontade desde o primeiro minuto.` },
    { semana: 2, tipo: "Arte pronta", layout: "carrossel", variante: "escura", gancho: s.temas.comparacao, legenda: `Essa é uma das dúvidas que mais ouvimos dos nossos ${s.cliente}. Arraste para o lado e entenda a diferença. Ficou alguma dúvida? Manda aqui nos comentários.` },
    { semana: 2, tipo: "Arte pronta", layout: "depoimento", variante: "cheia", gancho: `O que nossos ${s.cliente} dizem`, legenda: `Cada avaliação deixa a nossa equipe muito feliz. Obrigado pela confiança! Já foi atendido aqui? Conte sua experiência no Google pelo link da bio.` },
    { semana: 3, tipo: "Foto sua", gancho: `Os detalhes que você não vê`, foto: s.temas.espaco, legenda: `Cuidado também está nos detalhes. Tudo preparado para o seu atendimento.` },
    { semana: 3, tipo: "Arte pronta", layout: "carrossel", variante: "clara", gancho: s.temas.cuidados, legenda: `Salve este post para consultar depois e mande para quem precisa ver. ${cta}` },
    { semana: 3, tipo: "Arte pronta", layout: "aviso", variante: "escura", gancho: `Agenda desta semana`, legenda: `Ainda temos horários disponíveis nesta semana. ${cta}` },
    { semana: 4, tipo: "Foto sua", gancho: `Um dia com a nossa equipe`, foto: "Sua rotina de trabalho, sem ninguém olhar para a câmera", legenda: `Do primeiro horário ao último atendimento: um pouco da nossa rotina cuidando de quem confia na gente.` },
    { semana: 4, tipo: "Arte pronta", layout: "mito", variante: "cheia", gancho: s.temas.mito, legenda: `Mito ou verdade? Comenta o que você acha antes de ver a resposta! A gente explica tudo direitinho no atendimento. ${cta}` },
    { semana: 4, tipo: "Arte pronta", layout: "destaque", variante: "clara", gancho: `${maiuscula(s.acao)} é simples`, legenda: `Mande uma mensagem no WhatsApp, conte o que você precisa e a gente responde rapidinho. ${e.nome}, ${e.cidade}.` },
  ];

  return base.map((p) => ({ ...p, prompt: montarPrompt(p, e) }));
}

const nomeCor: Record<Variante, string> = {
  cheia: "fundo na cor principal da marca e texto branco",
  clara: "fundo claro, quase branco, com título na cor principal da marca",
  escura: "fundo escuro, quase preto, com detalhes na cor principal da marca",
};

const descricaoLayout: Record<Layout, string> = {
  destaque: "título grande alinhado à esquerda, na parte de baixo da arte",
  carrossel: "capa de carrossel com o título no topo e a indicação 'arraste para o lado' no rodapé",
  pergunta: "pergunta centralizada com um grande ponto de interrogação decorativo",
  mito: "duas etiquetas, 'MITO' e 'VERDADE', acima da frase",
  aviso: "etiqueta 'AGENDA DA SEMANA', título e um botão 'Chame no WhatsApp'",
  depoimento: "aspas grandes, 5 estrelas e espaço para o texto de uma avaliação real",
};

function montarPrompt(p: Omit<Post, "prompt">, e: Empresa): string {
  const s = segmentos[e.segmento];
  const regras = s.regras.join(" ");
  if (p.tipo === "Foto sua") {
    return `Vou postar no Instagram de ${e.nome} (${s.nome.toLowerCase()} em ${e.cidade}) uma foto real: ${p.foto?.toLowerCase()}. Me dê 3 dicas simples para tirar essa foto com o celular e deixar com aparência profissional, e sugira um texto curto (até 6 palavras) para colocar sobre a foto. Regras do setor: ${regras}`;
  }
  return `Crie um post quadrado de Instagram (1080x1080) para ${e.nome}, ${s.nome.toLowerCase()} em ${e.cidade}. Texto principal: "${p.gancho}". Estilo: ${nomeCor[p.variante!]}; cor principal ${e.cor}; ${descricaoLayout[p.layout!]}; tipografia sem serifa em negrito; nome "${e.nome}" pequeno no rodapé. Visual limpo, moderno e profissional. Não use fotos de pessoas reais, imagens de antes e depois nem promessas de resultado. Regras do setor: ${regras}`;
}

/* ---------- cores ---------- */

function hexParaRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function misturar(hex: string, alvo: [number, number, number], quanto: number) {
  const [r, g, b] = hexParaRgb(hex);
  const m = (a: number, b2: number) => Math.round(a + (b2 - a) * quanto);
  return `rgb(${m(r, alvo[0])}, ${m(g, alvo[1])}, ${m(b, alvo[2])})`;
}

/** Luminância relativa (WCAG). Usada para decidir se o texto sobre a cor é branco ou escuro. */
function luminancia(hex: string) {
  const [r, g, b] = hexParaRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export type Paleta = { fundo: string; texto: string; destaque: string; suave: string };

/** Gera as 3 combinações de cor a partir da cor da marca, sempre com texto legível. */
export function paleta(cor: string, variante: Variante): Paleta {
  const corClara = luminancia(cor) > 0.45; // amarelos e tons pastel pedem texto escuro
  const escuraDaMarca = misturar(cor, [10, 12, 18], 0.82);
  if (variante === "cheia")
    return { fundo: cor, texto: corClara ? "#0b0f19" : "#ffffff", destaque: corClara ? escuraDaMarca : "#ffffff", suave: corClara ? "rgba(11,15,25,.65)" : "rgba(255,255,255,.75)" };
  if (variante === "clara")
    return { fundo: misturar(cor, [255, 255, 255], 0.9), texto: "#0b0f19", destaque: corClara ? escuraDaMarca : cor, suave: "rgba(11,15,25,.6)" };
  return { fundo: escuraDaMarca, texto: "#ffffff", destaque: corClara ? cor : misturar(cor, [255, 255, 255], 0.35), suave: "rgba(255,255,255,.7)" };
}
