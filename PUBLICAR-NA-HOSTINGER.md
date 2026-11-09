# Publicar o Elev8 Score na Hostinger

O Elev8 Score é um app Next.js com servidor (páginas montadas no servidor e rotas de API). Na Hostinger isso roda como **Web App Node.js**, publicado direto do GitHub. A cada atualização no GitHub, a Hostinger publica de novo sozinha.

## 1. Plano

A Elev8 usa o plano **Business**, que roda Web Apps Node.js. (Single e Premium não rodam.) Confira no hPanel: em **Websites > Criar site** precisa aparecer a opção **Web App**.

Se o build falhar por falta de memória na Hostinger, o caminho é montar o app no GitHub (GitHub Actions) e mandar para a Hostinger já pronto. Só vale fazer isso se acontecer.

## 2. GitHub

1. Crie uma conta no GitHub (se ainda não tiver).
2. Crie um repositório **privado** e vazio, por exemplo `elev8-score` (sem README, sem .gitignore).
3. Nas configurações do claude.ai, conecte a sua conta do GitHub, para o Claude conseguir enviar o código.
4. Passe o nome no formato `usuario/elev8-score`. O código é enviado daqui.

## 3. Ligar a Hostinger ao GitHub

1. hPanel > **Websites** > **Criar site** > **Web App**.
2. **Importar repositório Git** > autorize a Hostinger no GitHub > escolha `elev8-score`.
3. Confira as configurações detectadas:
   - Framework: **Next.js**
   - Node.js: **22**
   - Comando de build: `npm run build`
4. **Deploy**. Quando terminar, a Hostinger mostra uma prévia do site.

## 4. Chaves (variáveis de ambiente)

Os nomes estão no arquivo `.env.example`. Os valores entram **só** no painel da Hostinger, em Variáveis de ambiente do app. Nunca cole chave no chat, no GitHub ou em print.

Elas entram aos poucos: Supabase e Google na fase 2, IA na fase 3, Mercado Pago e Resend na fase 4.

## 5. Domínio

Sugestão: um subdomínio, como `score.seudominio.com.br`, apontado para o Web App no hPanel. O SSL (cadeado) é gratuito e ativado pela própria Hostinger.

## Antes de receber leads de verdade

- **Login no painel administrativo.** Hoje o `/admin` é protótipo com dados de exemplo e não tem senha. Ele ganha login na fase 2, antes de qualquer lead real entrar no banco.
- **O app "dorme" sem visitas.** Na Hostinger, o processo para depois de um tempo sem tráfego, e a primeira visita seguinte demora alguns segundos a mais. Com anúncios rodando isso quase não acontece. Se incomodar, dá para usar um monitor gratuito que acessa o site a cada poucos minutos.
- **Buscadores.** Enquanto for protótipo, nada aparece no Google (`src/app/robots.ts`). No lançamento, libera só a página de entrada; `/painel` e `/admin` continuam bloqueados (robots e cabeçalho `noindex`).

## Conferência antes de cada publicação

```bash
npm test        # nichos, fórmula do Score, descontos e consultor
npm run lint
npm run build
```
