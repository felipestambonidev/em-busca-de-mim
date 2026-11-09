# Em Busca de Mim — Lista de espera

Landing page de inscrição (lista de espera) da jornada **Em Busca de Mim**, com Tay Queiroz.

Feita em **Next.js 16** (App Router) + **GSAP** (ScrollTrigger, SplitText, DrawSVG, ScrollTo) com `@gsap/react`.

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
  "interesses": ["Fé", "Carreira"],
  "consentimento": true,
  "utm": { "utm_source": "instagram" },
  "origem": "lista-de-espera",
  "criadoEm": "2026-11-09T18:50:45.673Z"
}
```

Parâmetros `utm_*` da URL são capturados automaticamente.

## Estrutura

- `app/page.tsx`: composição da página
- `app/globals.css`: sistema visual (cores, tipografia, layout)
- `components/`: seções (Hero, About, Thread, Journey, Manifesto, Waitlist) e o raminho botânico em SVG
- `lib/gsap.ts`: registro dos plugins GSAP e rolagem suave até o formulário
- `lib/lead.ts`: validação compartilhada entre o cliente e a API
- `public/fotos/`: fotos da Tay

## Acessibilidade

- Com `prefers-reduced-motion`, todas as animações de entrada e de scroll ficam desligadas.
- Com `prefers-reduced-transparency`, o cabeçalho translúcido e o card do formulário ficam sólidos.
- Com `prefers-contrast`, os textos secundários ficam mais escuros.
- O formulário valida campo a campo com mensagens ligadas via `aria-describedby`.
