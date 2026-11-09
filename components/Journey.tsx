"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

const DESIRES = [
  "cuidar de si",
  "fortalecer seus relacionamentos",
  "assumir o protagonismo da própria história",
  "construir uma vida com mais equilíbrio, intencionalidade e propósito",
];

const NUMERALS = ["i", "ii", "iii", "iv"];

export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION_OK, () => {
        gsap.from(q(".journey__head > *"), {
          y: 28,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".journey__head"), start: "top 82%" },
        });

        gsap.set(q(".journey__item"), { autoAlpha: 0, y: 30 });
        gsap.set(q(".journey__rule"), { scaleX: 0, transformOrigin: "left center" });
        ScrollTrigger.batch(q(".journey__item"), {
          start: "top 88%",
          once: true,
          onEnter: (items) => {
            gsap.to(items, { autoAlpha: 1, y: 0, stagger: 0.14, duration: 1.2, ease: "expo.out" });
            gsap.to(
              items.map((el) => el.querySelector(".journey__rule")),
              { scaleX: 1, stagger: 0.14, duration: 1.4, ease: "expo.inOut" },
            );
          },
        });

        gsap.fromTo(
          q(".journey__img"),
          { yPercent: -6, scale: 1.14 },
          {
            yPercent: 6,
            scale: 1.04,
            ease: "none",
            scrollTrigger: { trigger: q(".journey__media"), start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.fromTo(
          q(".journey__glow"),
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: q(".journey__media"), start: "top 85%", end: "center center", scrub: 1 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="journey section" aria-labelledby="journey-title">
      <figure className="journey__media">
        <div className="journey__glow" aria-hidden="true" />
        <div className="journey__frame">
          <Image
            className="journey__img"
            src="/fotos/tay-luz-dourada.jpg"
            alt="Tay Queiroz de vestido preto, mãos entrelaçadas, diante de um halo de luz dourada"
            fill
            sizes="(max-width: 900px) 86vw, 40vw"
            quality={82}
          />
        </div>
      </figure>

      <div className="journey__content">
        <header className="journey__head">
          <p className="eyebrow">
            <span className="eyebrow__num">03</span> Para quem é
          </p>
          <h2 id="journey-title" className="h2">
            Uma jornada para mulheres que <em>desejam</em>
          </h2>
        </header>

        <ol className="journey__list">
          {DESIRES.map((d, i) => (
            <li key={d} className="journey__item">
              <span className="journey__rule" aria-hidden="true" />
              <span className="numeral journey__num">{NUMERALS[i]}.</span>
              <span className="journey__text">{d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
