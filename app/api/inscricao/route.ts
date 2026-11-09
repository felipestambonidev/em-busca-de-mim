import { NextResponse } from "next/server";
import { INTERESTS, onlyDigits, validateLead, type LeadInput } from "@/lib/lead";

/**
 * Recebe inscrições da lista de espera.
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

  const allowed = new Set<string>(INTERESTS);
  const input: LeadInput = {
    nome: String(body.nome ?? "").trim().slice(0, 120),
    email: String(body.email ?? "").trim().toLowerCase().slice(0, 160),
    whatsapp: onlyDigits(String(body.whatsapp ?? "")).slice(0, 11),
    interesses: Array.isArray(body.interesses)
      ? body.interesses.map(String).filter((i) => allowed.has(i))
      : [],
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
    origem: "lista-de-espera",
    criadoEm: new Date().toISOString(),
  };

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
  } else {
    console.info("[inscricao] novo lead (defina INSCRICAO_WEBHOOK_URL para encaminhar):", lead);
  }

  return NextResponse.json({ ok: true });
}
