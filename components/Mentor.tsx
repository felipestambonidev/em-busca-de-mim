"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import SectionCta from "./SectionCta";

export default function Mentor() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(q(".mentor__text > *"), {
          y: 26,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".mentor__text"), start: "top 80%" },
        });
        gsap.fromTo(
          q(".mentor__frame"),
          { clipPath: "inset(14% 10% 14% 10% round 220px 220px 24px 24px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 220px 220px 24px 24px)",
            ease: "none",
            scrollTrigger: { trigger: q(".mentor__media"), start: "top 90%", end: "top 35%", scrub: 0.8 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="mentora" className="mentor section" aria-labelledby="mentora-title">
      <figure className="mentor__media">
        <div className="mentor__frame">
          <Image
            className="mentor__img"
            src="/fotos/tay-marfim.jpg"
            alt="Tay Queiroz de blusa marfim e braços cruzados, olhando para a câmera"
            fill
            sizes="(max-width: 900px) 82vw, 36vw"
            quality={82}
          />
        </div>
      </figure>

      <div className="mentor__text">
        <p className="eyebrow">
          <span className="eyebrow__num">04</span> Sua mentora
        </p>
        <h2 id="mentora-title" className="h2">
          Quem é <em>Tay Queiroz</em>?
        </h2>
        <p className="mentor__lede lede">
          O Em Busca de Mim não nasceu de teorias de livros, mas de uma história real de reconstrução.
        </p>
        <p className="body">
          Eu sei exatamente o peso de tentar dar conta de tudo sozinha, de carregar silêncios por dentro enquanto tenta
          manter tudo de pé por fora. E sei, acima de tudo, o poder transformador de permitir que Deus cure as nossas
          raízes.
        </p>
        <p className="body">
          Depois de viver e vencer minhas próprias batalhas emocionais, familiares e espirituais, decidi abrir esse
          caminho para outras mulheres. Minha missão nesta mentoria é caminhar ao seu lado para que você não apenas
          sobreviva aos seus dias, mas se torne uma mulher sábia, livre e dona da sua própria história.
        </p>
        <p className="mentor__sign script">Tay Queiroz</p>
        <SectionCta label="Quero caminhar com a Tay" />
      </div>
    </section>
  );
}
