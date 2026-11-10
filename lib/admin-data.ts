import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "./db";

export type Inscricao = {
  id: number;
  nome: string;
  email: string;
  whatsapp: string;
  utm_source: string | null;
  utm_campaign: string | null;
  criado_em: Date;
};

export type Feedback = {
  id: number;
  conexao: string | null;
  areas: string | null;
  impacto: number | null;
  indicacao: string | null;
  ajuda: string | null;
  criado_em: Date;
};

export async function listInscricoes() {
  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT id, nome, email, whatsapp, utm_source, utm_campaign, criado_em FROM inscricoes ORDER BY criado_em DESC LIMIT 5000",
  );
  return rows as Inscricao[];
}

export async function listFeedbacks() {
  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT id, conexao, areas, impacto, indicacao, ajuda, criado_em FROM feedbacks ORDER BY criado_em DESC LIMIT 5000",
  );
  return rows as Feedback[];
}

export function count<T>(items: T[], key: (t: T) => string[] | string | null) {
  const map = new Map<string, number>();
  for (const it of items) {
    const v = key(it);
    for (const k of Array.isArray(v) ? v : v ? [v] : []) map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}
