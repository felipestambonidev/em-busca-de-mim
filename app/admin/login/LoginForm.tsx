"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: f.get("email"), senha: f.get("senha") }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setSending(false);
      setError(json.error ?? "Não foi possível entrar.");
    }
  };

  return (
    <form className="adm-login__form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" autoComplete="current-password" required />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn--solid btn--block" disabled={sending}>
        <span className="btn__label">{sending ? "Entrando…" : "Entrar"}</span>
      </button>
    </form>
  );
}
