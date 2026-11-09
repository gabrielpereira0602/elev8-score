import type { Metadata } from "next";
import { EMPRESA_LEGAL as E, LegalPage, Secao } from "@/components/Legal";

export const metadata: Metadata = { title: "Política de Privacidade · Elev8 Score" };

export default function Privacidade() {
  return (
    <LegalPage titulo="Política de Privacidade">
      <p>
        Esta política explica quais dados o Elev8 Score usa, para quê, com quem compartilha e como você exerce os seus direitos, conforme a Lei Geral de
        Proteção de Dados (Lei 13.709/2018, LGPD).
      </p>

      <Secao titulo="1. Quem cuida dos seus dados">
        <p>
          {E.razao}, CNPJ {E.cnpj}, {E.endereco}, é a controladora dos dados. Contato do encarregado (DPO): {E.email}.
        </p>
      </Secao>

      <Secao titulo="2. Quais dados usamos">
        <ul>
          <li>
            <b>Dados que você informa:</b> nome, WhatsApp, e-mail e, depois da compra, informações do negócio (serviço principal, preço, diferenciais, cores
            e logo).
          </li>
          <li>
            <b>Dados públicos do negócio:</b> informações do Perfil da Empresa no Google (nome, categoria, endereço, telefone, avaliações, fotos), da bio do
            Instagram e da velocidade do site.
          </li>
          <li>
            <b>Uso do painel:</b> páginas abertas, ações do plano marcadas, perguntas feitas ao consultor e serviços da Elev8 consultados.
          </li>
          <li>
            <b>Pagamento:</b> processado pelo Mercado Pago. Não recebemos nem guardamos dados do seu cartão.
          </li>
        </ul>
      </Secao>

      <Secao titulo="3. Para que usamos e com qual base legal">
        <ul>
          <li>Fazer o diagnóstico, montar o kit e manter o seu painel (execução de contrato e procedimentos preliminares).</li>
          <li>Enviar o resultado e contatos da Elev8 por e-mail e WhatsApp sobre o diagnóstico (consentimento, que você pode retirar a qualquer momento).</li>
          <li>Melhorar o produto e a fórmula do Score com dados agregados (legítimo interesse).</li>
          <li>Cumprir obrigações fiscais e legais, como guardar registros de compra (obrigação legal).</li>
        </ul>
      </Secao>

      <Secao titulo="4. Empresas analisadas como concorrentes">
        <p>
          Cada diagnóstico compara o negócio com concorrentes da mesma busca, usando apenas dados públicos de empresas. A Elev8 pode enviar a essas empresas
          um convite para conhecer o próprio Score Digital, com base em legítimo interesse. O convite nunca diz quem fez o diagnóstico e sempre traz um link
          para não receber mais mensagens.
        </p>
      </Secao>

      <Secao titulo="5. Com quem compartilhamos">
        <p>Somente com fornecedores necessários para o serviço funcionar, que tratam os dados conforme nossas instruções:</p>
        <ul>
          <li>Hostinger (hospedagem do site) e Supabase (banco de dados e login);</li>
          <li>Google (dados públicos do Perfil da Empresa e medição de velocidade do site);</li>
          <li>Provedor de inteligência artificial, para escrever os textos do kit a partir dos dados do negócio;</li>
          <li>Mercado Pago (pagamento) e Resend (envio de e-mails).</li>
        </ul>
        <p>Não vendemos dados pessoais. Alguns fornecedores podem guardar dados fora do Brasil, com as garantias exigidas pela LGPD.</p>
      </Secao>

      <Secao titulo="6. Por quanto tempo guardamos">
        <ul>
          <li>Dados de quem fez o diagnóstico e não comprou: até 24 meses após o último contato, ou até você pedir a exclusão.</li>
          <li>Dados de compra: pelo prazo exigido pela legislação fiscal.</li>
          <li>Pedido para não receber mensagens: guardamos o seu contato numa lista de bloqueio, só para respeitar o pedido.</li>
        </ul>
      </Secao>

      <Secao titulo="7. Seus direitos">
        <p>
          Você pode pedir a qualquer momento: confirmação e acesso aos dados, correção, anonimização, portabilidade, exclusão, informação sobre
          compartilhamento e revogação do consentimento (art. 18 da LGPD). Escreva para {E.email}. Respondemos em até 15 dias. Todo e-mail da Elev8 tem um
          link para parar de receber.
        </p>
      </Secao>

      <Secao titulo="8. Segurança">
        <p>
          Usamos conexão criptografada (HTTPS), acesso restrito ao painel administrativo e fornecedores com práticas reconhecidas de segurança. Se houver um
          incidente que possa trazer risco a você, avisamos e comunicamos a ANPD, como manda a lei.
        </p>
      </Secao>

      <Secao titulo="9. Mudanças nesta política">
        <p>Se a política mudar, a data no topo é atualizada e, se a mudança for relevante, avisamos por e-mail.</p>
      </Secao>
    </LegalPage>
  );
}
