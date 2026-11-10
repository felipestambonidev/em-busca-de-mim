import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

const GENERIC = "E-mail ou senha incorretos.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const senha = String(body.senha ?? "");
  if (!email || !senha) return NextResponse.json({ ok: false, error: GENERIC }, { status: 401 });

  try {
    const [rows] = await db().execute<RowDataPacket[]>(
      "SELECT id, nome, senha_hash FROM admins WHERE email = ? LIMIT 1",
      [email],
    );
    const admin = rows[0];
    // Compara mesmo sem usuário, para não revelar quais e-mails existem pelo tempo de resposta.
    const hash = admin?.senha_hash ?? "$2a$12$CwTycUXWue0Thq9StjUM0uJ8.ZGv7b8wQq1Ip6Gq2N4C1rS0eW5mK";
    const ok = await bcrypt.compare(senha, hash);
    if (!admin || !admin.senha_hash || !ok) {
      return NextResponse.json({ ok: false, error: GENERIC }, { status: 401 });
    }
    await db().execute("UPDATE admins SET ultimo_login = NOW() WHERE id = ?", [admin.id]);
    await createSession({ email, nome: admin.nome });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json({ ok: false, error: "Não foi possível entrar agora. Tente novamente." }, { status: 500 });
  }
}
