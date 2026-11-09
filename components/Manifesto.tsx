"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import Sprig from "./Sprig";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION_OK, () => {
        const quote = SplitText.create(q(".manifesto__quote"), { type: "words" });
        gsap.fromTo(
          quote.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: q(".manifesto__quote"), start: "top 78%", end: "bottom 50%", scrub: 0.6 },
          },
        );

        gsap.fromTo(
          q(".manifesto__sign"),
          { clipPath: "inset(-40% 100% -40% -10%)" },
          {
            clipPath: "inset(-40% -10% -40% -10%)",
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: { trigger: q(".manifesto__sign"), start: "top 85%" },
          },
        );

        gsap.fromTo(
          q(".sprig path, .sprig circle"),
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            stagger: 0.05,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 70%", end: "center center", scrub: 1 },
          },
        );

        return () => quote.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="manifesto" aria-label="Manifesto">
      <Sprig className="manifesto__sprig manifesto__sprig--left" />
      <Sprig className="manifesto__sprig manifesto__sprig--right" />
      <div className="manifesto__inner">
        <p className="manifesto__sign script">Em Busca de Mim.</p>
        <blockquote className="manifesto__quote">
          <p>
            Porque uma mulher que reconhece seu valor, fortalece suas bases e entende seu propósito transforma não
            apenas a própria história, mas também tudo aquilo que está ao seu redor.
          </p>
        </blockquote>
      </div>
    </section>
  );
}
