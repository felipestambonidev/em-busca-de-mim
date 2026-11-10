import { NextResponse } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { onlyDigits, validateLead, type LeadInput } from "@/lib/lead";

/**
 * Recebe inscrições do formulário da página inicial.
 * Se INSCRICAO_WEBHOOK_URL estiver definida (Google Apps Script, Make, Zapier, n8n, RD Station…),
 * o lead é encaminhado para lá em JSON. Caso contrário, é registrado no log do servidor.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot anti-spam: humanos não veem este campo.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const input: LeadInput = {
    nome: String(body.nome ?? "").trim().slice(0, 120),
    email: String(body.email ?? "").trim().toLowerCase().slice(0, 160),
    whatsapp: onlyDigits(String(body.whatsapp ?? "")).slice(0, 11),
    consentimento: body.consentimento === true,
  };

  const errors = validateLead(input);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const utm = typeof body.utm === "object" && body.utm !== null ? (body.utm as Record<string, unknown>) : {};
  const lead = {
    ...input,
    whatsapp: `+55${input.whatsapp}`,
    utm: Object.fromEntries(
      Object.entries(utm)
        .filter(([k]) => k.startsWith("utm_"))
        .map(([k, v]) => [k, String(v).slice(0, 200)]),
    ),
    origem: "pagina-inicial",
    criadoEm: new Date().toISOString(),
  };

  if (dbConfigured()) {
    try {
      const u = lead.utm as Record<string, string>;
      await db().execute(
        `INSERT INTO inscricoes (nome, email, whatsapp, consentimento, utm_source, utm_medium, utm_campaign, utm_content, utm_term)
         VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?)`,
        [lead.nome, lead.email, lead.whatsapp, u.utm_source ?? null, u.utm_medium ?? null, u.utm_campaign ?? null, u.utm_content ?? null, u.utm_term ?? null],
      );
    } catch (err) {
      console.error("[inscricao] falha ao gravar no banco", err);
      return NextResponse.json(
        { ok: false, error: "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes." },
        { status: 502 },
      );
    }
  }

  const webhook = process.env.INSCRICAO_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`);
    } catch (err) {
      console.error("[inscricao] falha ao encaminhar lead", err);
      return NextResponse.json(
        { ok: false, error: "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes." },
        { status: 502 },
      );
    }
  } else if (!dbConfigured()) {
    console.info("[inscricao] novo lead (defina INSCRICAO_WEBHOOK_URL para encaminhar):", lead);
  }

  return NextResponse.json({ ok: true });
}
