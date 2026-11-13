"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { TreeScene } from "@/lib/tree3d";

type Module = {
  numeral: string;
  name: string;
  sub: string;
  lead: string;
  text: string;
  focus: string;
  topics: [string, string][];
};

const MODULES: Module[] = [
  {
    numeral: "I",
    name: "Raízes",
    sub: "Identidade e Cura Interior",
    lead: "O que ninguém vê, mas sustenta tudo.",
    text: "Vamos curar feridas ocultas, romper ciclos de vergonha, liberar o perdão e firmar quem você é em Deus antes de qualquer título.",
    focus:
      "Curar o que está debaixo da terra. Se a raiz está doente ou amargurada, qualquer vento derruba a mulher.",
    topics: [
      [
        "Identidade em Deus (Ser vista)",
        "Romper a carência de aprovação humana e entender quem você é diante do Criador antes de qualquer título (esposa, mãe ou profissional).",
      ],
      [
        "Despertar no Marco Zero",
        "Sair do modo automático (correndo sem direção) e reconhecer que há esperança para recomeçar.",
      ],
      ["Meu Mundo Interior", "Olhar com honestidade para o que está guardado no coração e no secreto."],
      [
        "Cura da Vergonha Silenciosa",
        "Trazer à luz culpas ocultas, medos e traumas do passado que travam o presente.",
      ],
      [
        "Autoperdão e Liberação de Perdão",
        "Limpar o solo da amargura: perdoar a si mesma pelos erros de ontem e liberar quem te feriu.",
      ],
      [
        "Quebra de Padrões Familiares",
        "Cortar heranças emocionais disfuncionais para não repetir na sua casa as dores que você viveu na infância.",
      ],
    ],
  },
  {
    numeral: "II",
    name: "Tronco",
    sub: "Autogoverno e Maturidade Emocional",
    lead: "A estrutura que te mantém de pé nas tempestades.",
    text: "Você vai aprender a governar seus pensamentos, gerenciar expectativas, abandonar a vitimização e responder com sabedoria em vez de reagir na dor.",
    focus:
      "Construir firmeza e flexibilidade. Um tronco rígido demais quebra na tempestade; um tronco fraco enverga com qualquer crise.",
    topics: [
      [
        "Governo da Mente",
        "Discernir pensamentos sabotadores e mentiras emocionais (“Cuidado: sua mente mente para você”).",
      ],
      [
        "Responder em Vez de Reagir",
        "Substituir a impulsividade e o descontrole emocional pela pausa sábia e intencional.",
      ],
      [
        "Gestão de Expectativas (Campo Minado)",
        "Desarmar cobranças irreais sobre si mesma, sobre o casamento e sobre a vida.",
      ],
      [
        "Autorresponsabilidade Extrema",
        "Abandonar o papel de vítima e assumir o leme da própria história (“Seja a mudança que você deseja”).",
      ],
      [
        "Mentalidade de Solução (Errar Certo)",
        "Entender que problemas fazem parte da vida, mas a maturidade está em corrigir rápido e resolver em vez de lamentar.",
      ],
      [
        "Sabedoria Preventiva",
        "Aprender observando os erros e escolhas alheias para não cair nas mesmas armadilhas.",
      ],
    ],
  },
  {
    numeral: "III",
    name: "Galhos",
    sub: "Casamento, Filhos e Família",
    lead: "Onde a sua vida se estende e acolhe.",
    text: "Com raízes curadas, você aprende a edificar o seu lar com leveza, blindar o casamento, dividir o peso da rotina e liderar seus filhos com firmeza e ternura.",
    focus:
      "Os galhos só crescem saudáveis e dão sombra quando recebem seiva limpa das raízes e sustentação do tronco.",
    topics: [
      [
        "Ordem de Prioridades (A Primeira Equipe)",
        "Cuidar dos de dentro antes dos de fora; a família é o primeiro ministério e a principal equipe.",
      ],
      [
        "A Mulher Sábia no Casamento",
        "Escolher não viver ofendida, abandonar o rancor diário e construir um ambiente leve e agradável no lar.",
      ],
      [
        "Intimidade e Aliança Conjugal",
        "Proteger o casamento através da conexão física e emocional, sem jamais usar o sexo como moeda de troca ou punição.",
      ],
      [
        "Perseverança na Aliança",
        "Entender que reconstruir o casamento exige trabalho e renúncia, mas gera restauração profunda.",
      ],
      [
        "Descentralização e Leveza no Lar",
        "Parar de carregar o mundo nas costas, dividir tarefas e permitir que marido e filhos cooperem.",
      ],
      [
        "Maternidade com Firmeza e Ternura",
        "Equilibrar limites claros (que geram segurança emocional) com afeto genuíno, sem perder a doçura.",
      ],
      [
        "Posicionamento e Comunicação com Filhos",
        "Manter a hierarquia saudável (filhos não são pais nem confidentes de problemas adultos), saber ouvir feedbacks sem rebater, pedir perdão quando errar e vencer o mito da rebeldia inevitável na adolescência.",
      ],
    ],
  },
  {
    numeral: "IV",
    name: "Frutos",
    sub: "Propósito, Liderança e Desfrute",
    lead: "O transbordar de uma mulher restaurada.",
    text: "É hora de liderar servindo, equilibrar fé, casa e carreira sem culpa e desfrutar com paz a história que Deus te confiou.",
    focus:
      "O fruto não existe para alimentar a própria árvore, mas para abençoar quem se aproxima e deixar legado.",
    topics: [
      [
        "Liderança Servidora",
        "Exercer autoridade no trabalho, nos negócios e na comunidade através do serviço, da postura e do exemplo (“O maior líder é o que serve”).",
      ],
      [
        "Equilíbrio entre Fé, Lar e Carreira",
        "Viver a plenitude profissional sem negociar os valores inegociáveis da família.",
      ],
      [
        "O Desfrute do Presente",
        "Quebrar o ciclo da reclamação e aprender a saborear com gratidão as conquistas e a paz dentro de casa.",
      ],
      [
        "Legado e Florescimento Contínuo",
        "Tornar-se uma mulher sábia, livre e dona da própria história, cujo testemunho inspira outras mulheres a também buscarem a própria cura.",
      ],
    ],
  },
];

export default function Method() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const treeRef = useRef<TreeScene | null>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);

  // Carrega o Three.js só quando a seção se aproxima da tela.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || treeRef.current) return;
        io.disconnect();
        try {
          const { createTreeScene } = await import("@/lib/tree3d");
          if (disposed) return;
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          treeRef.current = createTreeScene(canvas, { reduced });
          treeRef.current.setProgress(progressRef.current);
        } catch {
          setFailed(true);
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(canvas);
    return () => {
      disposed = true;
      io.disconnect();
      treeRef.current?.dispose();
      treeRef.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Cada etapa ocupa um quarto do crescimento: a árvore cresce de baixo para cima conforme a leitura.
      const cards = q<HTMLElement>(".module");      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 62%",
          // A última etapa termina antes, para a árvore completa ficar um tempo na tela.
          end: i === cards.length - 1 ? "bottom 85%" : "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
          onUpdate: (self) => {
            // Em saltos grandes de rolagem, ignora a atualização final de cards que já saíram.
            if (!self.isActive) return;
            setActive(i);
            const p = (i + self.progress) / cards.length;
            progressRef.current = p;
            treeRef.current?.setProgress(p);
          },
          onLeave: () => {
            if (i === cards.length - 1) {
              progressRef.current = 1;
              treeRef.current?.setProgress(1);
            }
          },
        });
      });

      mm.add(MOTION_OK, () => {
        gsap.from(q(".method__head > *"), {
          y: 26,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".method__head"), start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  const current = MODULES[active];

  return (
    <section ref={root} id="metodo" className="method section" aria-labelledby="metodo-title">
      <header className="method__head">
        <p className="eyebrow">
          <span className="eyebrow__num">02</span> O método
        </p>
        <h2 id="metodo-title" className="h2">
          A jornada de <em>transformação</em> para que haja <em>restauração</em>
        </h2>
        <blockquote className="method__verse">
          <p>
            “Porque há esperança para a árvore, pois, mesmo cortada, ainda se renovará, e não cessarão os seus
            rebentos. Se envelhecer na terra a sua raiz, e no chão morrer o seu tronco, ao cheiro das águas brotará e
            dará ramos como a planta nova.”
          </p>
          <cite>Jó 14:7-9</cite>
        </blockquote>
        <p className="method__intro body">
          Assim como uma árvore, a sua vida só floresce por fora quando está curada por dentro. No Em Busca de Mim,
          você não recebe fórmulas rasas: você percorre um caminho estruturado de dentro para fora, de baixo para cima.
        </p>
      </header>

      <div className="method__grid">
        <div className="method__stage" aria-hidden="true">
          <div className={`method__canvas${failed ? " is-failed" : ""}`}>
            <canvas ref={canvasRef} />
          </div>
          <p className="method__now">
            <span className="numeral">{current.numeral}.</span> {current.name}
          </p>
        </div>

        <ol className="method__list">
          {MODULES.map((m, i) => (
            <li key={m.name} className={`module${i === active ? " is-active" : ""}`}>
              <p className="module__num numeral">{m.numeral}.</p>
              <h3 className="module__title">
                {m.name}
                <span className="module__sub">{m.sub}</span>
              </h3>
              <p className="module__lead">{m.lead}</p>
              <p className="module__text body">{m.text}</p>
              <details className="module__more" onToggle={() => ScrollTrigger.refresh()}>
                <summary>
                  Ver os {m.topics.length} temas desta etapa
                  <span className="module__plus" aria-hidden="true" />
                </summary>
                <p className="module__focus">{m.focus}</p>
                <ul className="module__topics">
                  {m.topics.map(([title, desc]) => (
                    <li key={title}>
                      <strong>{title}</strong>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
