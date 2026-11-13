"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ScrollToPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

/** Rola suavemente até uma seção e, ao chegar, foca o primeiro campo (se houver). */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia(MOTION_REDUCED).matches;
  gsap.to(window, {
    duration: reduce ? 0 : 1.5,
    ease: "power3.inOut",
    // Desconta o header fixo para o topo do formulário não ficar escondido.
    scrollTo: { y: el, offsetY: (document.querySelector(".site-header")?.clientHeight ?? 0) + 16, autoKill: true },
    overwrite: "auto",
    onComplete: () => {
      const field = el.querySelector<HTMLInputElement>("input:not([type=hidden]):not([tabindex='-1'])");
      field?.focus({ preventScroll: true });
    },
  });
}
