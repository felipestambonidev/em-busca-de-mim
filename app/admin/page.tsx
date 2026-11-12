import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { count, listFeedbacks, listInscricoes } from "@/lib/admin-data";
import { AREAS, CONEXAO, INDICACAO } from "@/lib/feedback";
import AdminTabs from "./AdminTabs";

export const metadata: Metadata = { title: "Painel · Em Busca de Mim", robots: { index: false } };

const fmt = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(
    new Date(d),
  );
const phone = (w: string) => {
  const d = w.replace(/\D/g, "").replace(/^55/, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length === 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : w;
};

function Bars({ title, data, order }: { title: string; data: [string, number][]; order: string[] }) {
  const map = new Map(data);
  const max = Math.max(1, ...data.map(([, n]) => n));
  return (
    <div className="adm-card">
      <h3 className="adm-card__title">{title}</h3>
      <ul className="adm-bars">
        {order.map((k) => {
          const n = map.get(k) ?? 0;
          return (
            <li key={k}>
              <span className="adm-bars__label">{k}</span>
              <span className="adm-bars__track">
                <span className="adm-bars__fill" style={{ width: `${(n / max) * 100}%` }} />
              </span>
              <span className="adm-bars__n">{n}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [inscricoes, feedbacks] = await Promise.all([listInscricoes(), listFeedbacks()]);
  const notas = feedbacks.map((f) => f.impacto).filter((n): n is number => typeof n === "number");
  const media = notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1).replace(".", ",") : "–";
  const indicariam = feedbacks.filter((f) => f.indicacao === "Com certeza indicaria").length;
  const comIndicacao = feedbacks.filter((f) => f.indicacao).length;

  const inscricoesView = (
    <>
      <div className="adm-toolbar">
        <p>{inscricoes.length} cadastro(s)</p>
        <a className="btn btn--small" href="/api/admin/export?tipo=inscricoes">
          Baixar planilha (CSV)
        </a>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>WhatsApp</th>
              <th>Origem</th>
            </tr>
          </thead>
          <tbody>
            {inscricoes.map((i) => (
              <tr key={i.id}>
                <td>{fmt(i.criado_em)}</td>
                <td>{i.nome}</td>
                <td>
                  <a href={`mailto:${i.email}`}>{i.email}</a>
                </td>
                <td>
                  <a href={`https://wa.me/${i.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                    {phone(i.whatsapp)}
                  </a>
                </td>
                <td>{[i.utm_source, i.utm_campaign].filter(Boolean).join(" · ") || "–"}</td>
              </tr>
            ))}
            {!inscricoes.length && (
              <tr>
                <td colSpan={5} className="adm-empty">
                  Nenhum cadastro ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const feedbacksView = (
    <>
      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat__n">{feedbacks.length}</span>
          <span className="adm-stat__l">respostas</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat__n">{media}</span>
          <span className="adm-stat__l">impacto médio (1 a 5)</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat__n">{comIndicacao ? Math.round((indicariam / comIndicacao) * 100) : 0}%</span>
          <span className="adm-stat__l">com certeza indicariam</span>
        </div>
      </div>
      <div className="adm-grid">
        <Bars title="Como nos conhecemos" data={count(feedbacks, (f) => (f.conexao ? f.conexao.split("; ") : null))} order={CONEXAO} />
        <Bars
          title="Áreas com maior transformação"
          data={count(feedbacks, (f) => (f.areas ? f.areas.split("; ") : null))}
          order={AREAS}
        />
        <Bars title="Impacto da transformação" data={count(feedbacks, (f) => (f.impacto ? String(f.impacto) : null))} order={["5", "4", "3", "2", "1"]} />
        <Bars title="Indicaria para outras mulheres" data={count(feedbacks, (f) => f.indicacao)} order={INDICACAO} />
      </div>
      <div className="adm-toolbar">
        <p>Todas as respostas</p>
        <a className="btn btn--small" href="/api/admin/export?tipo=feedbacks">
          Baixar planilha (CSV)
        </a>
      </div>
      <div className="adm-answers">
        {feedbacks.map((f) => (
          <article key={f.id} className="adm-card adm-answer">
            <header>
              <span>{fmt(f.criado_em)}</span>
              {f.impacto && <span className="adm-pill">Impacto {f.impacto}/5</span>}
            </header>
            <dl>
              <dt>Como nos conhecemos</dt>
              <dd>{f.conexao ?? "–"}</dd>
              <dt>Áreas</dt>
              <dd>{f.areas ?? "–"}</dd>
              <dt>Momento</dt>
              <dd className="adm-answer__text">{f.momento ?? "–"}</dd>
              <dt>Indicaria</dt>
              <dd>{f.indicacao ?? "–"}</dd>
              <dt>Onde se sente perdida</dt>
              <dd className="adm-answer__text">{f.ajuda ?? "–"}</dd>
            </dl>
          </article>
        ))}
        {!feedbacks.length && <p className="adm-empty">Nenhuma resposta ainda.</p>}
      </div>
    </>
  );

  return (
    <>
      <header className="adm-top">
        <p className="brand__name">
          Em Busca de <span className="brand__script">Mim</span> <span className="adm-top__tag">Painel</span>
        </p>
        <form action="/api/admin/logout" method="post" className="adm-top__user">
          <span>Olá, {session.nome.split(" ")[0]}</span>
          <button type="submit" className="link-quiet adm-logout">
            Sair
          </button>
        </form>
      </header>
      <AdminTabs
        tabs={[
          { id: "feedbacks", label: `Feedbacks (${feedbacks.length})`, content: feedbacksView },
          { id: "inscricoes", label: `Cadastros (${inscricoes.length})`, content: inscricoesView },
        ]}
      />
    </>
  );
}

export default function AdminPage() {
  return (
    <main className="adm">
      <Suspense fallback={<p className="adm-empty">Carregando…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
