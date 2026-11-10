# Em Busca de Mim — Lista de espera

Landing page de inscrição (lista de espera) da jornada **Em Busca de Mim**, com Tay Queiroz.

Feita em **Next.js 16** (App Router) + **GSAP** (ScrollTrigger, SplitText, DrawSVG, ScrollTo) com `@gsap/react`.

## Identidade visual

- **Cores:** `#b38065` (claro) e `#170c0a` (escuro). Os tons de fundo e de apoio são misturas dessas duas cores com branco (veja os tokens em `app/globals.css`).
- **Fontes:**
  - **Bebas Kai:** títulos.
  - **Brittany Signature:** assinaturas e palavras em destaque.
  - **Montserrat:** texto corrido (carregada pelo Google Fonts).

### Instalando as fontes Bebas Kai e Brittany Signature

Elas não estão no Google Fonts. Coloque os arquivos em `public/fonts/` com estes nomes. Qualquer formato serve; `.woff2` é o mais leve.

```
public/fonts/BebasKai.woff2              (ou .otf / .ttf)
public/fonts/BrittanySignature.woff2     (ou .otf / .ttf)
```

Enquanto os arquivos não estiverem lá, o site usa as substitutas Bebas Neue (do mesmo estúdio da Bebas Kai) e Mrs Saint Delafield.
**Atenção:** a Brittany Signature costuma ser gratuita apenas para uso pessoal. Para um site comercial, confirme a licença.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Onde as inscrições vão parar

O formulário envia para `POST /api/inscricao`, que valida os dados e:

- se a variável `INSCRICAO_WEBHOOK_URL` estiver definida, encaminha o lead em JSON para essa URL;
- se não estiver, apenas registra o lead no log do servidor.

Copie `.env.example` para `.env.local` e preencha. Formato enviado:

```json
{
  "nome": "Maria Clara Souza",
  "email": "maria@exemplo.com",
  "whatsapp": "+5511987654321",
  "consentimento": true,
  "utm": { "utm_source": "instagram" },
  "origem": "lista-de-espera",
  "criadoEm": "2026-11-09T18:50:45.673Z"
}
```

Parâmetros `utm_*` da URL são capturados automaticamente.

## Estrutura

A página tem 3 seções:

1. **Hero** (`components/Hero.tsx`): título, foto e o formulário de inscrição (`components/SignupForm.tsx`).
2. **A jornada** (`components/About.tsx`): "O que é", "Aqui, acreditamos que…" e "Uma jornada para mulheres que desejam".
3. **Manifesto** (`components/Closing.tsx`): frase final, botão de volta ao formulário e rodapé.

Outros arquivos:

- `app/globals.css`: sistema visual (cores, tipografia, layout)
- `lib/gsap.ts`: registro dos plugins GSAP e rolagem suave até o formulário
- `lib/lead.ts`: validação compartilhada entre o cliente e a API
- `public/fotos/`: fotos da Tay

## Acessibilidade

- Com `prefers-reduced-motion`, todas as animações de entrada e de scroll ficam desligadas.
- Com `prefers-reduced-transparency`, o cabeçalho translúcido e o card do formulário ficam sólidos.
- Com `prefers-contrast`, os textos secundários ficam mais escuros.
- O formulário valida campo a campo com mensagens ligadas via `aria-describedby`.

## Página de feedback (`/feedback`)

Formulário "Feedback de Impacto e Transformação". As respostas vão para `POST /api/feedback`, que as encaminha para `FEEDBACK_WEBHOOK_URL` (se definida) ou registra no log do servidor.

## Banco de dados e painel (`/admin`)

1. **Criar as tabelas:** no phpMyAdmin, selecione o banco, abra a aba **Importar** e envie `db/schema.sql`. O script cria `inscricoes`, `feedbacks` e `admins`, e já cadastra os admins felipe.stamboni@fitgestao.com e taynan.queiroz@fitgestao.com.
2. **Variáveis de ambiente:** preencha `DB_*` e `ADMIN_SESSION_SECRET` (veja `.env.example`) em `.env.local` e na hospedagem.
3. **Definir a senha de cada admin:**
   ```bash
   npm run admin:senha -- taynan.queiroz@fitgestao.com
   ```
4. Acesse `/admin`. O painel mostra os feedbacks com resumo e gráficos, a lista de cadastros e o botão para baixar cada planilha em CSV (abre no Excel).

Com o banco configurado, cada envio é gravado nele; os webhooks continuam opcionais.
