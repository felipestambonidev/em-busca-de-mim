"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

const VALUES = ["Conexão", "Aprendizado", "Crescimento"];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION_OK, () => {
        // O parágrafo principal "acende" palavra por palavra conforme a leitura avança.
        const lede = SplitText.create(q(".about__lede"), { type: "words" });
        gsap.fromTo(
          lede.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: q(".about__lede"), start: "top 82%", end: "bottom 48%", scrub: 0.6 },
          },
        );

        gsap.from(q(".about__head > *"), {
          y: 28,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".about__head"), start: "top 85%" },
        });

        gsap.from(q(".about__body, .about__values li"), {
          y: 24,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".about__body"), start: "top 88%" },
        });

        gsap.fromTo(
          q(".about__frame"),
          { clipPath: "inset(18% 12% 18% 12% round 220px 220px 24px 24px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 220px 220px 24px 24px)",
            ease: "none",
            scrollTrigger: { trigger: q(".about__media"), start: "top 90%", end: "top 30%", scrub: 0.8 },
          },
        );
        gsap.fromTo(
          q(".about__img"),
          { scale: 1.2, yPercent: -4 },
          {
            scale: 1.04,
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: q(".about__media"), start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        return () => lede.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="sobre" className="about section" aria-labelledby="sobre-title">
      <figure className="about__media">
        <div className="about__frame">
          <Image
            className="about__img"
            src="/fotos/tay-marfim.jpg"
            alt="Tay Queiroz de blusa marfim e braços cruzados, com olhar confiante"
            fill
            sizes="(max-width: 900px) 86vw, 34vw"
            quality={82}
          />
        </div>
        <figcaption className="about__caption">
          <span className="numeral">i.</span> Um espaço para olhar para a sua história
        </figcaption>
      </figure>

      <div className="about__content">
        <header className="about__head">
          <p className="eyebrow">
            <span className="eyebrow__num">01</span> A jornada
          </p>
          <h2 id="sobre-title" className="h2">
            O que é o <em>Em Busca de Mim</em>?
          </h2>
        </header>

        <p className="about__lede lede">
          O Em Busca de Mim é uma jornada de desenvolvimento e transformação para mulheres que desejam fortalecer sua
          identidade, aprofundar sua fé e viver com propósito em todas as áreas da vida.
        </p>

        <p className="about__body body">
          Mais do que uma mentoria, é um espaço de conexão, aprendizado e crescimento, onde você é convidada a olhar
          para sua história, reconhecer seu potencial e descobrir novas possibilidades para sua vida pessoal, familiar
          e profissional.
        </p>

        <ul className="about__values" aria-label="O que você encontra aqui">
          {VALUES.map((v, i) => (
            <li key={v}>
              <span className="numeral">{["i", "ii", "iii"][i]}.</span>
              {v}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
