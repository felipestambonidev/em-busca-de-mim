"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { formatPhone, validateField, validateLead, type FieldErrors, type LeadInput } from "@/lib/lead";
import Sprig from "./Sprig";

type Status = "idle" | "sending" | "leaving" | "done";

const EMPTY: LeadInput = { nome: "", email: "", whatsapp: "", consentimento: false };

export default function SignupForm() {
  const root = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<LeadInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LeadInput, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [firstName, setFirstName] = useState("");

  // Troca do formulário pelo agradecimento: o formulário se recolhe, o bilhete aparece e o raminho é desenhado.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = !window.matchMedia(MOTION_OK).matches;
      if (status === "leaving") {
        if (reduce) {
          setStatus("done");
          return;
        }
        gsap.to(q(".signup__form"), {
          autoAlpha: 0,
          y: -12,
          duration: 0.45,
          ease: "power2.in",
          onComplete: () => setStatus("done"),
        });
      }
      if (status === "done") {
        q<HTMLElement>(".signup__thanks")[0]?.focus({ preventScroll: true });
        if (reduce) return;
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(q(".thanks__reveal"), { y: 20, autoAlpha: 0, stagger: 0.12, duration: 1.2 }, 0.1)
          .fromTo(
            q(".thanks__sprig path, .thanks__sprig circle"),
            { drawSVG: "0%" },
            { drawSVG: "100%", stagger: 0.07, duration: 1, ease: "power1.inOut" },
            0,
          );
      }
    },
    { scope: root, dependencies: [status] },
  );

  const update = <K extends keyof LeadInput>(field: K, value: LeadInput[K]) => {
    const next = { ...data, [field]: value };
    setData(next);
    // Depois que a pessoa já passou pelo campo, a validação acompanha a digitação (e some quando fica certo).
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, next) }));
  };

  const blur = (field: keyof LeadInput) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, data) }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    setServerError("");

    const found = validateLead(data);
    setErrors(found);
    setTouched({ nome: true, email: true, whatsapp: true, consentimento: true });
    const firstInvalid = (Object.keys(found) as (keyof LeadInput)[])[0];
    if (firstInvalid) {
      document.getElementById(`f-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries([...params.entries()].filter(([k]) => k.startsWith("utm_")));

    try {
      const res = await fetch("/api/inscricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: form.get("website"), utm }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error ?? "Algo não saiu como esperado. Tente novamente.");
      }
      setFirstName(data.nome.trim().split(/\s+/)[0]);
      setStatus("leaving");
    } catch (err) {
      setStatus("idle");
      setServerError(err instanceof Error ? err.message : "Algo não saiu como esperado. Tente novamente.");
    }
  };

  const fieldProps = (field: "nome" | "email" | "whatsapp") => ({
    id: `f-${field}`,
    name: field,
    value: data[field],
    onBlur: () => blur(field),
    "aria-invalid": Boolean(errors[field]) || undefined,
    "aria-describedby": errors[field] ? `e-${field}` : undefined,
  });

  return (
    <div ref={root} id="lista" className="signup" aria-live="polite">
      {status !== "done" ? (
        <form className="signup__form" onSubmit={onSubmit} noValidate aria-labelledby="signup-title">
          <p id="signup-title" className="signup__title">
            Entre para a <em>lista de espera</em>
          </p>

          <div className={`field ${errors.nome ? "has-error" : ""}`}>
            <label htmlFor="f-nome">Seu nome</label>
            <input
              {...fieldProps("nome")}
              type="text"
              autoComplete="name"
              placeholder="Como gosta de ser chamada"
              onChange={(e) => update("nome", e.target.value)}
            />
            {errors.nome && (
              <p className="field__error" id="e-nome">
                {errors.nome}
              </p>
            )}
          </div>

          <div className="field-row">
            <div className={`field ${errors.email ? "has-error" : ""}`}>
              <label htmlFor="f-email">E-mail</label>
              <input
                {...fieldProps("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="voce@email.com"
                onChange={(e) => update("email", e.target.value)}
              />
              {errors.email && (
                <p className="field__error" id="e-email">
                  {errors.email}
                </p>
              )}
            </div>

            <div className={`field ${errors.whatsapp ? "has-error" : ""}`}>
              <label htmlFor="f-whatsapp">WhatsApp</label>
              <input
                {...fieldProps("whatsapp")}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(11) 91234-5678"
                onChange={(e) => update("whatsapp", formatPhone(e.target.value))}
              />
              {errors.whatsapp && (
                <p className="field__error" id="e-whatsapp">
                  {errors.whatsapp}
                </p>
              )}
            </div>
          </div>

          <div className={`consent ${errors.consentimento ? "has-error" : ""}`}>
            <input
              id="f-consentimento"
              type="checkbox"
              checked={data.consentimento}
              onChange={(e) => update("consentimento", e.target.checked)}
              onBlur={() => blur("consentimento")}
              aria-invalid={Boolean(errors.consentimento) || undefined}
              aria-describedby={errors.consentimento ? "e-consentimento" : undefined}
            />
            <label htmlFor="f-consentimento">
              Aceito receber novidades do Em Busca de Mim por e-mail e WhatsApp. Posso sair quando quiser.
            </label>
            {errors.consentimento && (
              <p className="field__error" id="e-consentimento">
                {errors.consentimento}
              </p>
            )}
          </div>

          {/* honeypot */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="f-website">Não preencha</label>
            <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {serverError && (
            <p className="form-error" role="alert">
              {serverError}
            </p>
          )}

          <button type="submit" className="btn btn--solid btn--block" disabled={status !== "idle"}>
            <span className="btn__label">{status !== "idle" ? "Guardando seu lugar…" : "Quero entrar na lista"}</span>
            <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
            </svg>
          </button>
          <p className="form-note">Seus dados ficam só com a gente. Nada de spam.</p>
        </form>
      ) : (
        <div className="signup__thanks" role="status" tabIndex={-1}>
          <Sprig className="thanks__sprig" />
          <p className="thanks__reveal script thanks__hello">Que alegria{firstName ? `, ${firstName}` : ""}!</p>
          <p className="thanks__reveal thanks__title">Seu nome está na lista.</p>
          <p className="thanks__reveal body">
            Assim que as inscrições do Em Busca de Mim abrirem, você será uma das primeiras a saber. Até lá, cuide de
            você.
          </p>
        </div>
      )}
    </div>
  );
}
