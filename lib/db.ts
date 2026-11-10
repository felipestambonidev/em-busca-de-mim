import "server-only";
import mysql from "mysql2/promise";

declare global {
  var __ebdmPool: mysql.Pool | undefined;
}

export function dbConfigured() {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}

/** Pool único reaproveitado entre requisições (e entre recargas em desenvolvimento). */
export function db() {
  if (!globalThis.__ebdmPool) {
    globalThis.__ebdmPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: "utf8mb4",
      timezone: "Z",
      connectionLimit: 5,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
    });
  }
  return globalThis.__ebdmPool;
}
