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

## 4. Ligar a versão real (variáveis de ambiente)

Sem chaves, o site roda como protótipo (empresas de exemplo). Com as chaves abaixo, ele busca qualquer empresa no Google, salva os leads, cobra e libera o kit sozinho. Os nomes estão em `.env.example`; os valores entram **só** na Hostinger.

| Variável | De onde vem |
|---|---|
| `ADMIN_PASSWORD` | Uma senha forte criada por você. Protege o `/admin`. |
| `GOOGLE_PLACES_API_KEY` | Google Cloud > APIs e serviços > Credenciais (com Places API (New) e PageSpeed Insights API ativadas) |
| `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project Settings > API |
| `MERCADOPAGO_ACCESS_TOKEN` | Mercado Pago Developers > Suas integrações > Credenciais de produção |
| `SITE_URL` (opcional) | O endereço final do site, sem barra no fim |

**Banco de dados (uma vez só):** no Supabase, abra **SQL Editor > New query**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.

**Mercado Pago:** o aviso automático de pagamento é configurado sozinho em cada compra (vai para `/api/webhooks/mercadopago`). Não precisa cadastrar nada no painel do Mercado Pago.

Depois de salvar as variáveis, faça um novo deploy na Hostinger para o app ler as chaves.

## 5. Domínio

Sugestão: um subdomínio, como `score.seudominio.com.br`, apontado para o Web App no hPanel. O SSL (cadeado) é gratuito e ativado pela própria Hostinger.

## Antes de receber leads de verdade

- **Login no painel administrativo.** Com o banco ligado, o `/admin` só abre com a senha de `ADMIN_PASSWORD`. Sem senha configurada, ele fica bloqueado (nunca aberto com leads reais).
- **O app "dorme" sem visitas.** Na Hostinger, o processo para depois de um tempo sem tráfego, e a primeira visita seguinte demora alguns segundos a mais. Com anúncios rodando isso quase não acontece. Se incomodar, dá para usar um monitor gratuito que acessa o site a cada poucos minutos.
- **Buscadores.** Enquanto for protótipo, nada aparece no Google (`src/app/robots.ts`). No lançamento, libera só a página de entrada; `/painel` e `/admin` continuam bloqueados (robots e cabeçalho `noindex`).

## Conferência antes de cada publicação

```bash
npm test        # nichos, fórmula do Score, descontos e consultor
npm run lint
npm run build
```
