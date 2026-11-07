/*
  Liga o diagnóstico aos serviços da Elev8. Cada recomendação só aparece se o dado justificar,
  e segue a ordem pedida no briefing: o que foi identificado, por que importa, como a Elev8 resolve,
  qual o próximo passo. A primeira da lista é a de maior impacto que o kit sozinho não resolve.
*/
import { aplicarKit, calcularScore, type Lider, type Metricas } from "./score";
import type { EmpresaDemo } from "./contexto";
import type { Segmento } from "./segmentos";

export type Recomendacao = {
  id: "site" | "seo" | "trafego" | "redes";
  servico: string;
  identificado: string;
  porQue: string;
  comoResolvemos: string;
  impacto: number; // pontos de Score estimados, para ordenar
};

export function recomendar(m: Metricas, lider: Lider, e: EmpresaDemo, s: Segmento): Recomendacao[] {
  const comKit = aplicarKit(m);
  const scoreKit = calcularScore(comKit, lider).total;
  const lista: Recomendacao[] = [];

  if (m.velocidadeSite < 70 || m.siteClaro < 70) {
    const comSite = calcularScore({ ...comKit, velocidadeSite: 90, siteClaro: 90 }, lider).total;
    lista.push({
      id: "site",
      servico: "Site ou landing page nova",
      identificado: `Seu site tem nota ${m.velocidadeSite}/100 de velocidade no celular e não deixa claro como ${s.acao}.`,
      porQue: `É a parte do seu Score que o kit não resolve. Com o kit aplicado você chega a ${scoreKit}; com um site rápido e claro, a ${comSite} (estimativa).`,
      comoResolvemos: `Uma página rápida no celular, feita para quem procura “${e.buscaTermo}” em ${e.cidade}, com o botão do WhatsApp sempre à vista.`,
      impacto: comSite - scoreKit,
    });
  }

  if (m.perfilPreenchido < 100 || m.avaliacoes < lider.avaliacoes) {
    lista.push({
      id: "seo",
      servico: "Google Perfil e SEO local",
      identificado: `Você aparece em 4º no Google Maps para “${e.buscaTermo} em ${e.cidade}”.`,
      porQue: "Quem está nas 3 primeiras posições do Maps recebe a maior parte das ligações e visitas. O kit ajuda, mas manter o perfil ativo toda semana dá trabalho.",
      comoResolvemos: "Cuidamos do seu perfil no Google todo mês: fotos, publicações, respostas às avaliações e categorias.",
      impacto: 6,
    });
  }

  lista.push({
    id: "trafego",
    servico: "Anúncios no Google e no Instagram",
    identificado: "Hoje você depende só de quem te encontra por acaso.",
    porQue: "Avaliações e posts levam semanas para dar resultado. Anúncios colocam você na frente de quem está procurando agora.",
    comoResolvemos: `Campanhas para quem procura “${e.buscaTermo}” perto de ${e.cidade}, levando direto para o seu WhatsApp${s.id === "advocacia" ? ", dentro das regras da OAB para publicidade" : ""}.`,
    impacto: 4,
  });

  if (m.postsPorSemana < 3) {
    lista.push({
      id: "redes",
      servico: "Gestão das redes sociais",
      identificado: `Você publica ${m.postsPorSemana} ${m.postsPorSemana === 1 ? "vez" : "vezes"} por semana; o recomendado para o seu nicho é 3.`,
      porQue: "O kit traz 12 posts prontos, mas depois do primeiro mês alguém precisa continuar.",
      comoResolvemos: "Planejamos, criamos e publicamos os posts todo mês, no padrão da sua marca.",
      impacto: 3,
    });
  }

  return lista.sort((a, b) => b.impacto - a.impacto);
}
