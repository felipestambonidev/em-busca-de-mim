"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import CtaButton from "./CtaButton";

export default function SiteHeader() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Chrome translúcida só depois que o conteúdo começa a passar por baixo.
      ScrollTrigger.create({
        start: 48,
        end: "max",
        toggleClass: { targets: ref.current, className: "is-scrolled" },
      });
      // Fontes web mudam métricas → recalcula posições dos gatilhos.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      gsap.fromTo(ref.current, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 1.2, delay: 1.1, ease: "expo.out" });
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className="site-header">
      <a href="#topo" className="brand" aria-label="Em Busca de Mim — início">
        <span className="brand__name">
          Em Busca de <span className="brand__script">Mim</span>
        </span>
        <span className="brand__by">com Tay Queiroz</span>
      </a>
      <CtaButton variant="small">Entrar na lista</CtaButton>
    </header>
  );
}
