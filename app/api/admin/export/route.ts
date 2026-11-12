import { getSession } from "@/lib/auth";
import { listFeedbacks, listInscricoes } from "@/lib/admin-data";

const cell = (v: unknown) => {
  const s = v instanceof Date ? v.toISOString().replace("T", " ").slice(0, 19) : String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  if (!(await getSession())) return new Response("Não autorizado", { status: 401 });
  const tipo = new URL(request.url).searchParams.get("tipo");

  let header: string[];
  let rows: unknown[][];
  if (tipo === "feedbacks") {
    const data = await listFeedbacks();
    header = [
      "Data",
      "Como nos conhecemos",
      "Áreas transformadas",
      "Momento da transformação",
      "Impacto (1-5)",
      "Indicaria",
      "Onde se sente perdida",
    ];
    rows = data.map((f) => [f.criado_em, f.conexao, f.areas, f.momento, f.impacto, f.indicacao, f.ajuda]);
  } else {
    const data = await listInscricoes();
    header = ["Data", "Nome", "E-mail", "WhatsApp", "Origem (utm_source)", "Campanha"];
    rows = data.map((i) => [i.criado_em, i.nome, i.email, i.whatsapp, i.utm_source, i.utm_campaign]);
  }
  // ";" + BOM: abre direto no Excel em português com acentos corretos.
  const csv = "﻿" + [header, ...rows].map((r) => r.map(cell).join(";")).join("\r\n");
  const nome = tipo === "feedbacks" ? "feedbacks" : "inscricoes";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nome}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
