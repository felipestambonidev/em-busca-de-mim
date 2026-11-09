"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const PILLARS = ["fé", "família", "relacionamentos", "carreira", "e negócios"];

export default function Thread() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION_OK, () => {
        // Um único fio costura todas as áreas da vida — e cada uma ganha cor quando o fio a alcança.
        const words = q(".thread__word");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q(".thread__stage"), start: "top 70%", end: "bottom 55%", scrub: 0.9 },
        });
        tl.fromTo(q(".thread__path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1 }, 0);
        words.forEach((w, i) => {
          const at = (i + 0.35) / words.length - 0.08;
          tl.fromTo(
            w,
            { color: "#E3D2C6", y: 14, opacity: 0.7 },
            { color: "#B38065", y: 0, opacity: 1, duration: 0.16, ease: "power1.out" },
            Math.max(0, at),
          );
        });

        gsap.from(q(".thread__intro, .thread__eyebrow"), {
          y: 20,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.from(q(".thread__statement, .thread__body"), {
          y: 26,
          autoAlpha: 0,
          stagger: 0.14,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".thread__statement"), start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="thread section" aria-labelledby="thread-title">
      <p className="thread__eyebrow eyebrow">
        <span className="eyebrow__num">02</span> No que acreditamos
      </p>
      <h2 id="thread-title" className="thread__intro">
        Aqui, acreditamos que
      </h2>

      <div className="thread__stage">
        <svg className="thread__svg" viewBox="0 0 200 1000" preserveAspectRatio="none" aria-hidden="true">
          <path
            className="thread__path"
            d="M100 0 C 190 90, 190 170, 100 210 S 10 330, 100 410 S 190 530, 100 610 S 10 730, 100 810 S 170 930, 100 1000"
          />
        </svg>
        <ul className="thread__words">
          {PILLARS.map((p) => (
            <li key={p} className="thread__word">
              {p}
            </li>
          ))}
        </ul>
      </div>

      <p className="thread__statement">
        não precisam caminhar em <em>direções opostas.</em>
      </p>
      <p className="thread__body body">
        É possível desenvolver sua liderança, empreender, construir resultados e realizar sonhos sem perder de vista
        seus valores, sua essência e aquilo que realmente importa.
      </p>
    </section>
  );
}
