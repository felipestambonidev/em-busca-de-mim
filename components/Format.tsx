"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const ITEMS = [
  {
    title: "Aulas curtas e diretas ao ponto",
    text: "Conteúdos objetivos e aplicáveis, pensados para você assistir no seu ritmo, tomando um café ou em uma pausa do seu dia, sem enrolação.",
  },
  {
    title: "Princípios bíblicos e aplicação no dia a dia",
    text: "Mais do que teoria, você recebe direcionamentos fundamentados na Palavra e provocações práticas para aplicar dentro da sua própria casa e rotina.",
  },
  {
    title: "Encontros semanais ao vivo",
    text: "Toda semana nos reunimos em live para aprofundar a jornada, trazer clareza para os seus desafios reais e caminhar juntas de perto.",
  },
];

export default function Format() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(q(".format__head > *"), {
          y: 26,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".format__head"), start: "top 85%" },
        });
        gsap.from(q(".format__item"), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.14,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".format__list"), start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="formato" className="format" aria-labelledby="formato-title">
      <div className="format__inner">
        <header className="format__head">
          <p className="eyebrow">
            <span className="eyebrow__num">03</span> O formato
          </p>
          <h2 id="formato-title" className="h2">
            Feita para a sua <em>rotina real</em>
          </h2>
          <p className="format__intro body">
            Sabemos que a mulher moderna já carrega inúmeras responsabilidades. Por isso, a mentoria foi desenhada para
            gerar transformação profunda sem sobrecarregar a sua agenda.
          </p>
        </header>

        <ul className="format__list">
          {ITEMS.map((item, i) => (
            <li key={item.title} className="format__item">
              <span className="format__num numeral">0{i + 1}</span>
              <h3 className="format__title">{item.title}</h3>
              <p className="body">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
