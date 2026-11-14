"use client";

import { scrollToSection } from "@/lib/gsap";

/** Botão entre as seções: leva de volta ao formulário do topo. */
export default function SectionCta({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`section-cta ${className}`}>
      <button type="button" className="btn" onClick={() => scrollToSection("lista")}>
        <span className="btn__label">{label}</span>
        <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
        </svg>
      </button>
    </div>
  );
}
