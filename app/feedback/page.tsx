import type { Metadata } from "next";
import Link from "next/link";
import FeedbackForm from "@/components/FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback de Impacto e Transformação | Em Busca de Mim",
  description: "Compartilhe suas experiências e como nossa jornada juntas gerou transformação em sua vida.",
};

export default function FeedbackPage() {
  return (
    <main className="fb">
      <header className="fb__top">
        <Link href="/" className="brand" aria-label="Em Busca de Mim — página inicial">
          <span className="brand__name">
            Em Busca de <span className="brand__script">Mim</span>
          </span>
          <span className="brand__by">com Tay Queiroz</span>
        </Link>
      </header>

      <div className="fb__intro">
        <h1 className="fb__title">
          Feedback de impacto e <em>Transformação</em>
        </h1>
        <p className="fb__desc">
          Compartilhe suas experiências e como nossa jornada juntas gerou transformação em sua vida.
        </p>
      </div>

      <FeedbackForm />

      <p className="fb__foot">© 2026 Em Busca de Mim · Uma jornada com Tay Queiroz</p>
    </main>
  );
}
