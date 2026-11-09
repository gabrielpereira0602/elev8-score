/*
  E-mails amigos do Elev8 Score.

  Substituem a API do WhatsApp na automação: tudo o que é automático sai por e-mail; o WhatsApp fica para
  quando você entra para fechar. Estilo: mensagem pessoal, curta, assinada pelo Gabriel, um único botão.
  E-mail com cara de conversa (pouca imagem, pouco HTML) costuma cair menos no spam e ser mais lido.

  Regras de envio (fase 4, via Resend):
  - Toda sequência para quando a pessoa compra, pede proposta ou clica em "parar de receber".
  - Todo e-mail tem link de descadastro (LGPD). Quem se descadastra entra numa lista de bloqueio.
  - Nenhum número é inventado: tudo vem do diagnóstico.
*/
import type { Contexto } from "./contexto";
import { PRODUTO, REGRA, descontoAtivo, formatarBRL, formatarData } from "./elev8";
import { liderBusca, metricasHoje } from "./mock";
import { ETAPA_FRASE, maiorPerda } from "./consultor-util";
import { responder } from "./assistente";

export type Publico = "lead" | "comprador" | "assinante" | "prospecto" | "interno";

export type Email = {
  id: string;
  publico: Publico;
  /** Quando sai (texto para o admin). */
  quando: string;
  /** Dia em relação ao diagnóstico (lead), à compra (comprador) ou ao mês (assinante). */
  dia?: number;
  assunto: string;
  /** Texto que aparece ao lado do assunto na caixa de entrada. */
  previa: string;
  paragrafos: string[];
  botao?: { texto: string; href: string };
  ps?: string;
};

export const SITE = "https://score.elev8.com.br"; // trocar pelo domínio final (NEXT_PUBLIC_SITE_URL)
const ASSINATURA = "Gabriel, da Elev8";

export const PUBLICOS: { id: Publico; nome: string; descricao: string }[] = [
  { id: "lead", nome: "Fez o diagnóstico e não comprou", descricao: "Para quando compra, pede proposta ou se descadastra." },
  { id: "comprador", nome: "Comprou o kit", descricao: "Acompanha os 30 dias do plano e a reavaliação." },
  { id: "assinante", nome: "Score Vivo", descricao: "Todo mês, enquanto a assinatura estiver ativa." },
  { id: "prospecto", nome: "Ciclo do concorrente", descricao: "Convite para empresas que aparecem nos diagnósticos. Um envio só." },
  { id: "interno", nome: "Avisos para o Gabriel", descricao: "Só o que pede ação sua." },
];

export function emails(ctx: Contexto, hoje = new Date()): Email[] {
  const { empresa: e, segmento: s, diagnostico: d } = ctx;
  const painel = `${SITE}/painel`;
  const perda = maiorPerda(d.etapas);
  const lider = d.ranking[0];
  const posicao = d.ranking.findIndex((r) => r.voce) + 1;
  const desc = descontoAtivo(new Date(d.dataISO), false, hoje);
  const prazo = formatarData(new Date(new Date(d.dataISO).getTime() + REGRA.janelaDias * 864e5));
  const previaConsultor = responder(s.consultor.pergunta, ctx).texto.split("\n\n")[0];
  const concorrente = e.concorrentes[0];

  return [
    // ───────── Lead: fez o diagnóstico e não comprou
    {
      id: "lead-resultado",
      publico: "lead",
      quando: "Na hora do diagnóstico",
      dia: 0,
      assunto: `Seu Score Digital: ${d.nota} de 100`,
      previa: `Você está em ${posicao}º na busca “${d.busca}”.`,
      paragrafos: [
        `Oi! Aqui é o Gabriel, da Elev8.`,
        `O diagnóstico de ${e.nome} ficou pronto. Seu Score Digital é ${d.nota} de 100, e você aparece em ${posicao}º quando alguém procura “${d.busca}”. O 1º colocado é ${lider.nome}, com ${lider.nota}.`,
        `Onde você mais perde pontos hoje: em ${ETAPA_FRASE[perda.chave]}, com ${perda.nota} pontos contra ${perda.lider} do 1º colocado.`,
        `Deixei no painel um presente pronto para você usar hoje, sem pagar nada.`,
      ],
      botao: { texto: "Ver meu diagnóstico", href: painel },
      ps: "O link é só seu. Guarde este e-mail para voltar ao painel quando quiser.",
    },
    {
      id: "lead-presente",
      publico: "lead",
      quando: "1 dia depois",
      dia: 1,
      assunto: "Já usou a mensagem que eu deixei para você?",
      previa: "Leva 2 minutos e é o que mais pesa no seu Score.",
      paragrafos: [
        `Oi! Gabriel aqui de novo.`,
        `No seu painel tem uma mensagem pronta para pedir avaliação no Google. Avaliação é o que mais separa você do 1º colocado: você tem ${metricasHoje.avaliacoes}, ${lider.nome} tem ${liderBusca.avaliacoes}.`,
        `Mande hoje para 5 ${s.cliente} que gostaram do seu trabalho. É só copiar e colar.`,
      ],
      botao: { texto: "Copiar a mensagem", href: `${painel}#presente` },
    },
    {
      id: "lead-consultor",
      publico: "lead",
      quando: "3 dias depois",
      dia: 3,
      assunto: `“${s.consultor.pergunta}”`,
      previa: "Essa é a pergunta que mais ouvimos no seu setor.",
      paragrafos: [
        `Oi! Essa é uma das perguntas que mais ouvimos de quem tem ${s.nome.toLowerCase()}. O consultor de marketing do kit começa a resposta assim:`,
        `“${previaConsultor}”`,
        `A resposta completa traz o passo a passo e o texto pronto para copiar, feito para ${e.nome}. O consultor vem junto com o kit, sem limite de perguntas, por 12 meses.`,
      ],
      botao: { texto: "Ver o kit e o consultor", href: `${painel}#oferta` },
    },
    {
      id: "lead-desconto",
      publico: "lead",
      quando: "6 dias depois (só se ainda houver desconto)",
      dia: 6,
      assunto: `Seu desconto de ${Math.round(REGRA.descontoJanela * 100)}% acaba amanhã`,
      previa: `Vale para qualquer serviço da Elev8 até ${prazo}.`,
      paragrafos: [
        `Oi! Passando só para avisar: o desconto de ${Math.round(REGRA.descontoJanela * 100)}% em qualquer serviço da Elev8 vale até ${desc?.validoAte ? formatarData(desc.validoAte) : prazo}.`,
        `Pelo seu diagnóstico, o que mais ajudaria ${e.nome} hoje está na aba “Com a Elev8”, com preço e o desconto já aplicado.`,
        `Se quiser, peça uma proposta por lá. Eu mesmo respondo.`,
      ],
      botao: { texto: "Ver o que a Elev8 faria", href: `${painel}/elev8` },
      ps: REGRA.texto,
    },
    {
      id: "lead-ultimo",
      publico: "lead",
      quando: "10 dias depois",
      dia: 10,
      assunto: "Posso parar de te mandar e-mails?",
      previa: "Sem problema nenhum, é só me dizer.",
      paragrafos: [
        `Oi! Este é o último e-mail desta sequência.`,
        `Se agora não é o momento de cuidar do marketing de ${e.nome}, tudo bem. Seu diagnóstico continua no painel, e você pode voltar quando quiser.`,
        `Se for o momento, o kit está lá, com a garantia do Score: fez as ações do plano e o Score não subiu em 30 dias, você recebe os ${formatarBRL(PRODUTO.preco)} de volta.`,
      ],
      botao: { texto: "Voltar ao meu painel", href: painel },
    },

    // ───────── Comprador
    {
      id: "comprador-boas-vindas",
      publico: "comprador",
      quando: "Na confirmação do pagamento",
      dia: 0,
      assunto: "Seu kit está liberado. Comece por aqui",
      previa: "3 ações de menos de uma hora para esta semana.",
      paragrafos: [
        `Oi! Obrigado pela confiança. O kit de ${e.nome} está liberado no seu painel.`,
        `Comece por ${ETAPA_FRASE[perda.chave]}, onde você mais perde pontos. O plano já mostra as 3 ações desta semana, com o texto pronto de cada uma.`,
        `Ficou com dúvida? O consultor de marketing responde na hora, sem limite de perguntas.`,
      ],
      botao: { texto: "Abrir meu kit", href: `${painel}/kit` },
      ps: "Garantia do Score: fez pelo menos 10 das 12 ações do plano e o Score não subiu em 30 dias? Devolvemos o valor.",
    },
    ...[2, 3, 4].map(
      (semana): Email => ({
        id: `comprador-semana-${semana}`,
        publico: "comprador",
        quando: `${(semana - 1) * 7} dias depois da compra`,
        dia: (semana - 1) * 7,
        assunto: `Os posts da semana ${semana} chegaram`,
        previa: "3 posts prontos, com legenda e arte.",
        paragrafos: [
          `Oi! Os 3 posts da semana ${semana} já estão no seu painel, com legenda, arte e o prompt para deixar com a cara da sua marca.`,
          semana === 4
            ? `É a última semana do plano. Daqui a 7 dias refazemos a análise e você vê o antes e depois do seu Score Digital.`
            : `Publique um a cada 2 ou 3 dias e marque no plano quando fizer. Constância vale mais do que perfeição.`,
        ],
        botao: { texto: `Ver os posts da semana ${semana}`, href: `${painel}/kit` },
      }),
    ),
    {
      id: "comprador-reavaliacao",
      publico: "comprador",
      quando: "30 dias depois da compra",
      dia: 30,
      assunto: `Seu Score Digital: ${d.nota} → [novo score]`,
      previa: "A reavaliação dos 30 dias ficou pronta.",
      paragrafos: [
        `Oi! A reavaliação de ${e.nome} ficou pronta. Seu Score Digital foi de ${d.nota} para [novo score].`,
        `Para ser justo, a conta usa os concorrentes como estavam no dia do diagnóstico: assim o número mostra só o que você fez. No painel você vê também como o mercado se mexeu.`,
        `Quer continuar acompanhando? O Score Vivo refaz a análise todo mês, avisa quando um concorrente muda e mantém posts novos chegando, por ${formatarBRL(PRODUTO.scoreVivoMensal)}/mês. Cancela quando quiser.`,
      ],
      botao: { texto: "Ver meu antes e depois", href: painel },
    },

    // ───────── Score Vivo
    {
      id: "assinante-mensal",
      publico: "assinante",
      quando: "Todo dia 1º",
      assunto: `Seu Score de [mês]: [score] ([variação])`,
      previa: "O que mudou em você e nos seus concorrentes.",
      paragrafos: [
        `Oi! O Score Digital de ${e.nome} deste mês: [score] ([variação] em relação ao mês passado).`,
        `Seus concorrentes: [resumo do que mudou em ${e.concorrentes.join(", ")}].`,
        `Os posts do mês já estão no painel, junto com a ação que mais vai mexer no seu Score agora.`,
      ],
      botao: { texto: "Ver o mês no painel", href: painel },
    },
    {
      id: "assinante-alerta",
      publico: "assinante",
      quando: "Quando um concorrente muda (no máximo 1 por semana)",
      assunto: `${concorrente} ganhou [N] avaliações este mês`,
      previa: "O que isso muda para você e o que fazer.",
      paragrafos: [
        `Oi! Na busca “${d.busca}”, ${concorrente} ganhou [N] avaliações nas últimas semanas.`,
        `Isso pesa na hora de alguém escolher. O jeito mais rápido de responder é pedir avaliação para quem você atendeu este mês: a mensagem pronta está no seu painel.`,
      ],
      botao: { texto: "Ver o que fazer", href: painel },
    },

    // ───────── Ciclo do concorrente
    {
      id: "prospecto-convite",
      publico: "prospecto",
      quando: "Até 3 dias depois de aparecer num diagnóstico (um envio só)",
      assunto: `${e.buscaTermo.charAt(0).toUpperCase() + e.buscaTermo.slice(1)} em ${e.cidade}: vocês aparecem em [posição]º`,
      previa: "Fizemos a análise da busca. O Score de vocês é gratuito.",
      paragrafos: [
        `Olá, equipe [empresa]!`,
        `Aqui é o Gabriel, da Elev8, uma agência de marketing digital de Vinhedo. Analisamos a busca “${d.busca}” no Google e vocês aparecem em [posição]º.`,
        `Deixamos o Score Digital de vocês pronto, de graça: uma nota de 0 a 100 que mostra como vocês aparecem, como o perfil é entendido e por que um cliente escolheria vocês, comparando com os concorrentes da mesma busca.`,
        `Leva 1 minuto para ver. Não precisa de cartão.`,
      ],
      botao: { texto: "Ver o Score Digital de vocês", href: `${SITE}/?convite=[codigo]` },
      ps: "Usamos apenas dados públicos do Google. Se não quiser receber mais nada da Elev8, é só clicar em “parar de receber” aqui embaixo.",
    },

    // ───────── Interno
    {
      id: "interno-proposta",
      publico: "interno",
      quando: "Quando alguém pede proposta",
      assunto: `Pedido de proposta: ${e.nome}`,
      previa: `${s.nome} · ${e.cidade} · Score ${d.nota}`,
      paragrafos: [
        `${e.nome} (${s.nome}, ${e.cidade}) pediu proposta.`,
        `Score ${d.nota}. Desconto que vale hoje: ${desc ? `${Math.round(desc.percentual * 100)}% (${desc.motivo})` : "nenhum"}.`,
        `A ficha tem o que a pessoa quer resolver, o orçamento, o prazo e a mensagem de WhatsApp pronta.`,
      ],
      botao: { texto: "Abrir a ficha", href: `${SITE}/admin` },
    },
  ];
}

/** HTML simples e compatível com os principais leitores de e-mail (tabela, estilos na linha). */
export function emailHTML(m: Email, publico: Publico): string {
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rodape =
    publico === "interno"
      ? "Aviso interno do Elev8 Score."
      : publico === "prospecto"
        ? `Você recebeu este e-mail porque a sua empresa aparece numa busca pública do Google analisada pela Elev8. <a href="${SITE}/descadastro" style="color:#5b6478">Parar de receber</a>.`
        : `Você recebe este e-mail porque fez o diagnóstico no Elev8 Score. <a href="${SITE}/descadastro" style="color:#5b6478">Parar de receber</a> · <a href="${SITE}/privacidade" style="color:#5b6478">Privacidade</a>.`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(m.assunto)}</title></head>
<body style="margin:0;padding:0;background:#ffffff;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(m.previa)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff"><tr><td align="center" style="padding:24px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b0f19;font-size:16px;line-height:1.6">
${m.paragrafos.map((p) => `<tr><td style="padding:0 0 14px">${esc(p)}</td></tr>`).join("\n")}
${m.botao ? `<tr><td style="padding:6px 0 20px"><a href="${m.botao.href}" style="display:inline-block;background:#0066FF;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px">${esc(m.botao.texto)}</a></td></tr>` : ""}
<tr><td style="padding:0 0 14px">${esc(ASSINATURA)}</td></tr>
${m.ps ? `<tr><td style="padding:0 0 20px;color:#5b6478;font-size:14px">P.S. ${esc(m.ps)}</td></tr>` : ""}
<tr><td style="border-top:1px solid #e2e6ee;padding:14px 0 0;color:#8a93a8;font-size:12px;line-height:1.5">${rodape}</td></tr>
</table></td></tr></table></body></html>`;
}

/** Versão em texto puro (melhora a entrega e é lida por quem bloqueia HTML). */
export function emailTexto(m: Email): string {
  return [...m.paragrafos, m.botao ? `${m.botao.texto}: ${m.botao.href}` : "", ASSINATURA, m.ps ? `P.S. ${m.ps}` : "", "Parar de receber: " + `${SITE}/descadastro`]
    .filter(Boolean)
    .join("\n\n");
}
