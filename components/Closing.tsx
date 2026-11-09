"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import CtaButton from "./CtaButton";
import Sprig from "./Sprig";

export default function Closing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION_OK, () => {
        const quote = SplitText.create(q(".closing__quote"), { type: "words" });
        gsap.fromTo(
          quote.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: q(".closing__quote"), start: "top 80%", end: "bottom 52%", scrub: 0.6 },
          },
        );

        gsap.fromTo(
          q(".closing__sign"),
          { clipPath: "inset(-40% 100% -40% -10%)" },
          {
            clipPath: "inset(-40% -10% -40% -10%)",
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: { trigger: q(".closing__sign"), start: "top 85%" },
          },
        );

        gsap.from(q(".closing__cta"), {
          y: 24,
          autoAlpha: 0,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".closing__cta"), start: "top 92%" },
        });

        gsap.fromTo(
          q(".closing__sprig path, .closing__sprig circle"),
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            stagger: 0.05,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 70%", end: "center center", scrub: 1 },
          },
        );

        gsap.fromTo(
          q(".closing__img"),
          { yPercent: -6, scale: 1.14 },
          {
            yPercent: 6,
            scale: 1.04,
            ease: "none",
            scrollTrigger: { trigger: q(".closing__media"), start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        return () => quote.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="closing" aria-label="Manifesto">
      <Sprig className="closing__sprig closing__sprig--left" />
      <Sprig className="closing__sprig closing__sprig--right" />

      <div className="closing__inner">
        <figure className="closing__media">
          <div className="closing__glow" aria-hidden="true" />
          <div className="closing__frame">
            <Image
              className="closing__img"
              src="/fotos/tay-luz-dourada.jpg"
              alt="Tay Queiroz de vestido preto, mãos entrelaçadas, diante de um halo de luz dourada"
              fill
              sizes="(max-width: 900px) 80vw, 36vw"
              quality={82}
            />
          </div>
        </figure>

        <div className="closing__text">
          <p className="closing__sign script">Em Busca de Mim.</p>
          <blockquote className="closing__quote">
            <p>
              Porque uma mulher que reconhece seu valor, fortalece suas bases e entende seu propósito transforma não
              apenas a própria história, mas também tudo aquilo que está ao seu redor.
            </p>
          </blockquote>
          <div className="closing__cta">
            <CtaButton variant="light">Quero entrar na lista</CtaButton>
          </div>
        </div>
      </div>

      <footer className="closing__footer">
        <p className="closing__mark" aria-label="Em Busca de Mim">
          Em Busca de <span className="script">Mim</span>
        </p>
        <p>Uma jornada com Tay Queiroz · © 2026 Em Busca de Mim</p>
      </footer>
    </section>
  );
}
