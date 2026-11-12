"use client";

import { useState } from "react";
import { AREAS, CONEXAO, EMPTY_FEEDBACK, INDICACAO, isEmptyFeedback, type FeedbackInput } from "@/lib/feedback";
import Sprig from "./Sprig";

export default function FeedbackForm() {
  const [data, setData] = useState<FeedbackInput>(EMPTY_FEEDBACK);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const set = <K extends keyof FeedbackInput>(k: K, v: FeedbackInput[K]) => setData((d) => ({ ...d, [k]: v }));
  const toggle = (k: "conexao" | "areas", v: string) =>
    set(k, data[k].includes(v) ? data[k].filter((x) => x !== v) : [...data[k], v]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    if (isEmptyFeedback(data)) {
      setError("Responda pelo menos uma pergunta antes de enviar.");
      return;
    }
    setError("");
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: form.get("website") }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Algo não saiu como esperado. Tente novamente.");
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Algo não saiu como esperado. Tente novamente.");
    }
  };

  if (status === "done") {
    return (
      <div className="fb-card fb-thanks" role="status">
        <Sprig className="fb-thanks__sprig" />
        <p className="script fb-thanks__hello">Obrigada!</p>
        <p className="fb-thanks__title">Sua resposta foi enviada.</p>
        <p className="body">Cada história compartilhada aqui me ajuda a cuidar melhor da jornada de outras mulheres.</p>
      </div>
    );
  }

  return (
    <form className="fb__form" onSubmit={onSubmit} noValidate>
      <fieldset className="fb-card">
        <legend className="fb-q">
          Como nos conhecemos?
          <span className="fb-hint">Marque quantas quiser.</span>
        </legend>
        <div className="fb-options fb-options--grid">
          {CONEXAO.map((o) => (
            <label key={o} className="fb-option fb-option--check">
              <input type="checkbox" checked={data.conexao.includes(o)} onChange={() => toggle("conexao", o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="fb-card">
        <legend className="fb-q">
          Em quais áreas da sua vida a nossa conexão gerou maior transformação?
          <span className="fb-hint">Marque quantas quiser.</span>
        </legend>
        <div className="fb-options fb-options--grid">
          {AREAS.map((o) => (
            <label key={o} className="fb-option fb-option--check">
              <input type="checkbox" checked={data.areas.includes(o)} onChange={() => toggle("areas", o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="fb-card">
        <label className="fb-q" htmlFor="fb-momento">
          Descreva um momento ou situação específica em que você viveu essa transformação.
        </label>
        <textarea
          id="fb-momento"
          className="fb-textarea"
          rows={5}
          placeholder="Conte do seu jeito, com calma."
          value={data.momento}
          onChange={(e) => set("momento", e.target.value)}
        />
      </div>

      <fieldset className="fb-card">
        <legend className="fb-q">Como você avalia o impacto geral dessa transformação em sua vida?</legend>
        <div className="fb-scale">
          <span className="fb-scale__end">Baixa transformação</span>
          <div className="fb-scale__dots">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="fb-scale__item">
                <input
                  type="radio"
                  name="impacto"
                  checked={data.impacto === n}
                  onChange={() => set("impacto", n)}
                  aria-label={`${n} de 5`}
                />
                <span className="fb-scale__num">{n}</span>
              </label>
            ))}
          </div>
          <span className="fb-scale__end">Transformação profunda</span>
        </div>
      </fieldset>

      <fieldset className="fb-card">
        <legend className="fb-q">Qual a probabilidade de você me indicar para outras mulheres?</legend>
        <div className="fb-options">
          {INDICACAO.map((o) => (
            <label key={o} className="fb-option">
              <input type="radio" name="indicacao" checked={data.indicacao === o} onChange={() => set("indicacao", o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="fb-card">
        <label className="fb-q" htmlFor="fb-ajuda">
          Em qual área da sua vida você se encontra perdida e acredita que eu possa te ajudar?
        </label>
        <textarea
          id="fb-ajuda"
          className="fb-textarea"
          rows={5}
          placeholder="Escreva com calma, do seu jeito."
          value={data.ajuda}
          onChange={(e) => set("ajuda", e.target.value)}
        />
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="fb-website">Não preencha</label>
        <input id="fb-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--solid btn--block" disabled={status !== "idle"}>
        <span className="btn__label">{status === "sending" ? "Enviando…" : "Enviar resposta"}</span>
        <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
        </svg>
      </button>
    </form>
  );
}
