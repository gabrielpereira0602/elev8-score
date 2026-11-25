import type { Metadata } from "next";
import Link from "next/link";
import { EMPRESA_LEGAL as E, LegalPage, Secao } from "@/components/Legal";
import { GARANTIA } from "@/lib/score";
import { REGRA, PRODUTO, formatarBRL } from "@/lib/elev8";

export const metadata: Metadata = { title: "Termos de Uso · Elev8 Score" };

export default function Termos() {
  return (
    <LegalPage titulo="Termos de Uso">
      <p>
        Estes termos valem para o uso do Elev8 Score, oferecido por {E.razao}, CNPJ {E.cnpj}. Ao fazer o diagnóstico ou comprar o kit, você concorda com
        eles. Como tratamos seus dados está na <Link href="/privacidade" className="font-semibold text-brand hover:underline">Política de Privacidade</Link>.
      </p>

      <Secao titulo="1. O que é o Elev8 Score">
        <p>
          Uma ferramenta que mede a presença digital de um negócio local (o Score Digital, de 0 a 100) e compara com concorrentes da mesma busca. O
          diagnóstico é gratuito. O Score é calculado por uma fórmula própria, com dados públicos, e serve para orientar decisões. Ele não é uma nota oficial
          do Google nem de qualquer outra plataforma.
        </p>
      </Secao>

      <Secao titulo="2. Kit pronto">
        <ul>
          <li>Preço: {formatarBRL(PRODUTO.preco)}, pagamento único pela Kiwify (Pix ou cartão, com opção de parcelar), sem mensalidade.</li>
          <li>Entrega 100% digital, no seu painel, logo após a confirmação do pagamento. Não enviamos materiais físicos: o QR code vem com arte para você imprimir.</li>
          <li>Os 12 posts são liberados semana a semana, junto com o plano de 30 dias. As demais peças ficam disponíveis na hora.</li>
          <li>
            Inclui o consultor de marketing do painel, sem limite de perguntas, e acesso ao painel e ao kit por {PRODUTO.acessoMeses} meses a partir da
            compra.
          </li>
          <li>Você pode usar os textos e artes do kit no seu próprio negócio. Não é permitido revender ou redistribuir o kit.</li>
        </ul>
      </Secao>

      <Secao id="garantia" titulo="3. Garantia do Score">
        <p>Se você aplicar o plano e o seu Score Digital não subir, devolvemos o valor pago. Para ser justo com os dois lados:</p>
        <ul>
          <li>
            Vale para quem marcou como feitas pelo menos {GARANTIA.acoesMinimas} das {GARANTIA.totalAcoes} ações do plano de 30 dias.
          </li>
          <li>A reavaliação é feita {GARANTIA.dias} dias após a compra, com a mesma fórmula do diagnóstico.</li>
          <li>
            Os concorrentes entram na conta como estavam no dia do diagnóstico. Assim, o resultado mede só o que você fez, e o crescimento de um concorrente
            não tira a sua garantia.
          </li>
          <li>O pedido pode ser feito pelo painel ou por e-mail até 15 dias depois da reavaliação. O reembolso é feito pelo mesmo meio de pagamento.</li>
        </ul>
      </Secao>

      <Secao titulo="4. Direito de arrependimento">
        <p>
          Como a compra é feita pela internet, você pode desistir em até 7 dias da compra e receber o valor de volta, conforme o art. 49 do Código de Defesa do
          Consumidor. Basta pedir pelo painel ou por e-mail ({E.email}).
        </p>
      </Secao>

      <Secao titulo="5. O que o Elev8 Score não promete">
        <ul>
          <li>
            Não garantimos faturamento, número de clientes, posição no Google ou aparição em respostas de inteligência artificial. Os números marcados como
            estimativa são estimativas.
          </li>
          <li>O consultor orienta o seu marketing. Ele não substitui orientação jurídica, contábil, médica ou do conselho da sua profissão.</li>
          <li>
            Você é responsável pelo que publica. O kit segue as regras de publicidade conhecidas do seu setor, mas confirme sempre com o seu conselho ou
            entidade de classe.
          </li>
        </ul>
      </Secao>

      <Secao titulo="6. Descontos em serviços da Elev8">
        <ul>
          <li>
            {Math.round(REGRA.descontoJanela * 100)}% em qualquer serviço da Elev8 para quem fechar em até {REGRA.janelaDias} dias do diagnóstico.
          </li>
          <li>{Math.round(REGRA.descontoKit * 100)}% para quem comprou o kit, depois desse prazo.</li>
          <li>{REGRA.texto}</li>
        </ul>
      </Secao>

      <Secao titulo="7. Score Vivo (opcional)">
        <p>
          Assinatura mensal de acompanhamento ({formatarBRL(PRODUTO.scoreVivoMensal)}/mês): reavaliação todo mês, avisos quando um concorrente muda, posts
          novos do mês e teste das IAs. Pode ser cancelada a qualquer momento, sem multa; o acesso continua até o fim do mês já pago.
        </p>
      </Secao>

      <Secao titulo="8. Disponibilidade e mudanças">
        <p>
          Trabalhamos para o painel ficar disponível o tempo todo, mas podem ocorrer pausas para manutenção. Estes termos podem mudar; mudanças relevantes são
          avisadas por e-mail e não afetam compras já feitas.
        </p>
      </Secao>

      <Secao titulo="9. Foro">
        <p>
          Fica eleito o foro de {E.cidadeForo}, sem prejuízo do direito do consumidor de escolher o foro do seu domicílio. Dúvidas: {E.email}.
        </p>
      </Secao>
    </LegalPage>
  );
}
