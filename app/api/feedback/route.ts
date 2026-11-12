import { NextResponse } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { AREAS, CONEXAO, INDICACAO, isEmptyFeedback, type FeedbackInput } from "@/lib/feedback";

/**
 * Recebe respostas do formulário "Feedback de Impacto e Transformação".
 * Se FEEDBACK_WEBHOOK_URL estiver definida, encaminha a resposta em JSON; senão, registra no log.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }
  if (typeof body.website === "string" && body.website.trim() !== "") return NextResponse.json({ ok: true });

  const pick = (v: unknown, list: string[]) => (typeof v === "string" && list.includes(v) ? v : "");
  const pickMany = (v: unknown, list: string[]) =>
    Array.isArray(v) ? [...new Set(v.filter((a): a is string => typeof a === "string" && list.includes(a)))] : [];
  const impacto = Number(body.impacto);
  const input: FeedbackInput = {
    conexao: pickMany(body.conexao, CONEXAO),
    areas: pickMany(body.areas, AREAS),
    momento: String(body.momento ?? "").trim().slice(0, 4000),
    impacto: Number.isInteger(impacto) && impacto >= 1 && impacto <= 5 ? impacto : null,
    indicacao: pick(body.indicacao, INDICACAO),
    ajuda: String(body.ajuda ?? "").trim().slice(0, 4000),
  };
  if (isEmptyFeedback(input)) {
    return NextResponse.json({ ok: false, error: "Responda pelo menos uma pergunta antes de enviar." }, { status: 422 });
  }

  const resposta = { ...input, origem: "feedback", criadoEm: new Date().toISOString() };
  if (dbConfigured()) {
    try {
      await db().execute(
        "INSERT INTO feedbacks (conexao, areas, momento, impacto, indicacao, ajuda) VALUES (?, ?, ?, ?, ?, ?)",
        [
          input.conexao.join("; ") || null,
          input.areas.join("; ") || null,
          input.momento || null,
          input.impacto,
          input.indicacao || null,
          input.ajuda || null,
        ],
      );
    } catch (err) {
      console.error("[feedback] falha ao gravar no banco", err);
      return NextResponse.json(
        { ok: false, error: "Não conseguimos enviar agora. Tente novamente em instantes." },
        { status: 502 },
      );
    }
  }

  const webhook = process.env.FEEDBACK_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resposta),
      });
      if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`);
    } catch (err) {
      console.error("[feedback] falha ao encaminhar", err);
      return NextResponse.json(
        { ok: false, error: "Não conseguimos enviar agora. Tente novamente em instantes." },
        { status: 502 },
      );
    }
  } else if (!dbConfigured()) {
    console.info("[feedback] nova resposta (defina FEEDBACK_WEBHOOK_URL para encaminhar):", resposta);
  }
  return NextResponse.json({ ok: true });
}
