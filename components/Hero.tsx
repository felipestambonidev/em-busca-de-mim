"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK, MOTION_REDUCED } from "@/lib/gsap";
import CtaButton from "./CtaButton";
import Sprig from "./Sprig";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION_REDUCED, () => {
        gsap.set(root.current, { visibility: "visible" });
      });

      mm.add(MOTION_OK, () => {
        const sub = SplitText.create(q(".hero__sub"), { type: "lines", mask: "lines" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.4 } });
        tl.set(root.current, { visibility: "visible" })
          // A moldura em arco se abre de baixo para cima, como uma cortina.
          .fromTo(
            q(".hero__frame"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9, ease: "expo.inOut" },
            0,
          )
          .fromTo(q(".hero__img"), { scale: 1.28 }, { scale: 1, duration: 2.6 }, 0)
          .fromTo(q(".hero__arch path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 2.4, ease: "power2.inOut" }, 0.7)
          .from(q(".hero__line-inner"), { yPercent: 112, stagger: 0.14, duration: 1.5 }, 0.3)
          // "Mim" é escrito da esquerda para a direita, como caneta no papel.
          .fromTo(
            q(".hero__script"),
            { clipPath: "inset(-40% 100% -40% -12%)" },
            { clipPath: "inset(-40% -12% -40% -12%)", duration: 1.8, ease: "power2.inOut" },
            0.85,
          )
          .from(sub.lines, { yPercent: 105, stagger: 0.08, duration: 1.2 }, 1.05)
          .from(q(".hero__eyebrow, .hero__actions, .hero__caption"), { y: 16, autoAlpha: 0, stagger: 0.12, duration: 1.2 }, 1.15)
          .fromTo(
            q(".hero .sprig path, .hero .sprig circle"),
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 1.1, stagger: 0.07, ease: "power1.inOut" },
            1.1,
          );

        // Profundidade suave ao rolar: a foto fica para trás, o texto sobe.
        gsap.to(q(".hero__parallax"), {
          yPercent: 9,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(q(".hero__text"), {
          yPercent: -10,
          opacity: 0.2, // opacity (não autoAlpha): o hero herda visibility:hidden até a entrada

          ease: "none",
          scrollTrigger: { trigger: root.current, start: "35% top", end: "bottom top", scrub: true },
        });

        return () => sub.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="topo" className="hero" aria-labelledby="hero-title">
      <div className="hero__text">
        <p className="hero__eyebrow eyebrow">
          <span className="dot" aria-hidden="true" />
          Lista de espera aberta
        </p>

        <h1 id="hero-title" className="hero__title">
          <span className="hero__line">
            <span className="hero__line-inner">Em Busca</span>
          </span>
          <span className="hero__line hero__line--second">
            <span className="hero__line-inner">
              <em className="hero__de">de</em>
            </span>
            <span className="hero__script">Mim</span>
          </span>
        </h1>

        <p className="hero__sub">
          Para mulheres que desejam cuidar de si, assumir o protagonismo da própria história e viver com propósito em
          todas as áreas da vida.
        </p>

        <div className="hero__actions">
          <CtaButton>Quero entrar na lista</CtaButton>
          <a href="#sobre" className="link-quiet">
            Conhecer a jornada
          </a>
        </div>
      </div>

      <div className="hero__visual">
        <svg className="hero__arch" viewBox="0 0 300 420" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 420 V150 A148 148 0 0 1 298 150 V420" />
        </svg>
        <div className="hero__frame">
          <div className="hero__parallax">
            <Image
              className="hero__img"
              src="/fotos/tay-jardim.jpg"
              alt="Tay Queiroz sentada diante de um jardim vertical, de vestido vermelho e óculos, sorrindo com serenidade"
              fill
              preload
              sizes="(max-width: 900px) 80vw, 38vw"
              quality={85}
            />
          </div>
        </div>
        <Sprig className="hero__sprig" />
        <p className="hero__caption">
          <span className="script">Tay Queiroz</span>
          <span className="hero__caption-role">Idealizadora do Em Busca de Mim</span>
        </p>
      </div>
    </section>
  );
}
