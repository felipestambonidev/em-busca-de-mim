import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Entrar · Painel Em Busca de Mim", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="adm-login">
      <div className="adm-login__card">
        <p className="brand__name">
          Em Busca de <span className="brand__script">Mim</span>
        </p>
        <h1 className="adm-login__title">Painel</h1>
        <LoginForm />
      </div>
    </main>
  );
}
