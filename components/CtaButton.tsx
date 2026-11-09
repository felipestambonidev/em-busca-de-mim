"use client";

import { scrollToSection } from "@/lib/gsap";

export default function CtaButton({
  children,
  variant = "solid",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "small";
  className?: string;
}) {
  return (
    <a
      href="#lista"
      className={`btn btn--${variant} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        scrollToSection("lista");
      }}
    >
      <span className="btn__label">{children}</span>
      <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
      </svg>
    </a>
  );
}
