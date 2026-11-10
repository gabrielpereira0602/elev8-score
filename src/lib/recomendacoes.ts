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
  opcoes: string[]; // ids do catálogo (elev8.ts)
  recomendado: string; // id da opção indicada para este nicho
};

export function recomendar(m: Metricas, lider: Lider, e: EmpresaDemo, s: Segmento): Recomendacao[] {
  // Nichos que vendem produto ou cardápio pedem site/loja; nichos de serviço convertem melhor com landing page.
  const vendeProduto = s.id === "loja";
  const precisaCardapio = s.id === "restaurante";
  const publicoLocalVisual = ["restaurante", "loja", "beleza", "academia", "pet", "estetica"].includes(s.id);
  const comKit = aplicarKit(m);
  const scoreKit = calcularScore(comKit, lider).total;
  const lista: Recomendacao[] = [];

  if ((m.velocidadeSite ?? 0) < 70 || (m.siteClaro ?? 0) < 70) {
    const comSite = calcularScore({ ...comKit, velocidadeSite: 90, siteClaro: 90 }, lider).total;
    lista.push({
      id: "site",
      servico: vendeProduto ? "Loja virtual" : "Site ou landing page nova",
      identificado: m.velocidadeSite === null ? `Não encontramos um site que abra no celular. Quem procura no Google e não acha um site com o seu serviço e um botão para ${s.acao} desconfia ou vai para o concorrente.` : `Seu site tem nota ${m.velocidadeSite}/100 de velocidade no celular${(m.siteClaro ?? 0) < 70 ? ` e não deixa claro como ${s.acao}` : ""}.`,
      porQue: `É a parte do seu Score que o kit não resolve. Com o kit aplicado você chega a ${scoreKit}; com um site rápido e claro, a ${comSite} (estimativa).`,
      comoResolvemos: vendeProduto
        ? "Uma loja virtual rápida no celular, com seus produtos organizados, pagamento online e o WhatsApp sempre à vista."
        : precisaCardapio
          ? "Um site rápido no celular com cardápio, horários, localização e botão de reserva ou pedido pelo WhatsApp."
          : `Uma página rápida no celular, feita para quem procura “${e.buscaTermo}” em ${e.cidade}, com o botão do WhatsApp sempre à vista.`,
      impacto: comSite - scoreKit,
      opcoes: vendeProduto ? ["ecommerce", "site-institucional"] : ["lp-essencial", "lp-estrategica", "site-institucional"],
      recomendado: vendeProduto ? "ecommerce" : precisaCardapio ? "site-institucional" : "lp-estrategica",
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
      opcoes: ["seo-local"],
      recomendado: "seo-local",
    });
  }

  lista.push({
    id: "trafego",
    servico: "Anúncios no Google e no Instagram",
    identificado: "Hoje você depende só de quem te encontra por acaso.",
    porQue: "Avaliações e posts levam semanas para dar resultado. Anúncios colocam você na frente de quem está procurando agora.",
    comoResolvemos: `Campanhas para quem procura “${e.buscaTermo}” perto de ${e.cidade}, levando direto para o seu WhatsApp${s.id === "advocacia" ? ", dentro das regras da OAB para publicidade" : ""}.`,
    impacto: 4,
    opcoes: ["google-ads", "meta-essencial", "meta-google"],
    recomendado: publicoLocalVisual ? "meta-google" : "google-ads",
  });

  if (m.postsPorSemana !== null && m.postsPorSemana < 3) {
    lista.push({
      id: "redes",
      servico: "Gestão das redes sociais",
      identificado: `Você publica ${m.postsPorSemana} ${m.postsPorSemana === 1 ? "vez" : "vezes"} por semana; o recomendado para o seu nicho é 3.`,
      porQue: "O kit traz 12 posts prontos, mas depois do primeiro mês alguém precisa continuar.",
      comoResolvemos: "Planejamos, criamos e publicamos os posts todo mês, no padrão da sua marca.",
      impacto: 3,
      opcoes: ["redes", "criativos", "video"],
      recomendado: "redes",
    });
  }

  return lista.sort((a, b) => b.impacto - a.impacto);
}
