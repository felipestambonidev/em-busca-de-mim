"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

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
      <a href="https://play.embuscademim.com.br/login?callbackUrl=%2F" className="header-login">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8.5" r="3.6" />
          <path d="M4.8 19.5c1.2-3.3 4-5 7.2-5s6 1.7 7.2 5" />
        </svg>
        <span className="header-login__long">Entrar na plataforma</span>
        <span className="header-login__short">Entrar</span>
      </a>
    </header>
  );
}
