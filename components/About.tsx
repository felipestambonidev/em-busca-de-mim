"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import SectionCta from "./SectionCta";

const PILLARS = ["fé", "família", "relacionamentos", "carreira", "negócios"];
const DESIRES = [
  "cuidar de si",
  "fortalecer seus relacionamentos",
  "assumir o protagonismo da própria história",
  "construir uma vida com mais equilíbrio, intencionalidade e propósito",
];
const NUMERALS = ["i", "ii", "iii", "iv"];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION_OK, () => {
        const reveal = (targets: string, trigger: string) =>
          gsap.from(q(targets), {
            y: 26,
            autoAlpha: 0,
            stagger: 0.12,
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: q(trigger), start: "top 85%" },
          });

        reveal(".about__head > *", ".about__head");

        reveal(".about__lede, .about__body", ".about__lede");

        // Um único fio costura todas as áreas da vida; cada uma ganha cor quando o fio a alcança.
        const pillars = q(".about__pillar");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q(".about__pillars"), start: "top 80%", end: "bottom 55%", scrub: 0.8 },
        });
        tl.fromTo(q(".about__thread path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1 }, 0);
        pillars.forEach((el, i) => {
          tl.fromTo(
            el,
            { color: "#E3D2C6", y: 10 },
            { color: "#B38065", y: 0, duration: 0.2, ease: "power1.out" },
            (i / pillars.length) * 0.85,
          );
        });

        reveal(".about__belief-intro", ".about__belief");
        reveal(".about__statement, .about__belief .body", ".about__statement");
        reveal(".about__desires-title", ".about__desires");

        gsap.set(q(".desire"), { autoAlpha: 0, y: 30 });
        gsap.set(q(".desire__rule"), { scaleX: 0, transformOrigin: "left center" });
        ScrollTrigger.batch(q(".desire"), {
          start: "top 88%",
          once: true,
          onEnter: (items) => {
            gsap.to(items, { autoAlpha: 1, y: 0, stagger: 0.14, duration: 1.2, ease: "expo.out" });
            gsap.to(
              items.map((el) => el.querySelector(".desire__rule")),
              { scaleX: 1, stagger: 0.14, duration: 1.4, ease: "expo.inOut" },
            );
          },
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
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );

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
            src="/fotos/tay-palco.jpg"
            alt="Tay Queiroz de vestido preto, sorrindo enquanto fala ao microfone em um palco"
            fill
            sizes="(max-width: 900px) 86vw, 34vw"
            quality={82}
          />
        </div>
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


        <div className="about__belief">
          <p className="about__belief-intro">Aqui, acreditamos que</p>
          <div className="about__pillars">
            <p className="about__pillar-list">
              {PILLARS.map((p, i) => (
                <span key={p} className="about__pillar">
                  {i === PILLARS.length - 1 ? `e ${p}` : `${p},`}
                </span>
              ))}
            </p>
            <svg className="about__thread" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 22 C 60 2, 110 38, 170 20 S 280 4, 340 22 S 450 38, 510 18 S 580 10, 598 20" />
            </svg>
          </div>
          <p className="about__statement">
            não precisam caminhar em <em>direções opostas.</em>
          </p>
          <p className="body">
            É possível desenvolver sua liderança, empreender, construir resultados e realizar sonhos sem perder de vista
            seus valores, sua essência e aquilo que realmente importa.
          </p>
        </div>

        <div className="about__desires">
          <h3 className="about__desires-title">
            Uma jornada para mulheres que <em>desejam</em>
          </h3>
          <ol className="desires">
            {DESIRES.map((d, i) => (
              <li key={d} className="desire">
                <span className="desire__rule" aria-hidden="true" />
                <span className="numeral desire__num">{NUMERALS[i]}.</span>
                <span className="desire__text">{d}</span>
              </li>
            ))}
          </ol>
        </div>

        <SectionCta label="Quero fazer parte" />
      </div>
    </section>
  );
}
