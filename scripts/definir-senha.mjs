// Define (ou redefine) a senha de um admin do painel.
// Uso:  npm run admin:senha -- taynan.queiroz@fitgestao.com
// Lê DB_* do ambiente (ex.: .env.local).
import { createInterface } from "node:readline/promises";
import { stdin, stdout, argv, exit } from "node:process";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const email = (argv[2] ?? "").trim().toLowerCase();
if (!email) {
  console.error("Informe o e-mail: npm run admin:senha -- email@exemplo.com");
  exit(1);
}

const rl = createInterface({ input: stdin, output: stdout });
const senha = await rl.question("Nova senha (mín. 10 caracteres): ");
rl.close();
if (senha.length < 10) {
  console.error("A senha precisa ter pelo menos 10 caracteres.");
  exit(1);
}

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const [res] = await conn.execute("UPDATE admins SET senha_hash = ? WHERE email = ?", [await bcrypt.hash(senha, 12), email]);
await conn.end();

if (res.affectedRows === 0) {
  console.error(`Nenhum admin com o e-mail ${email}. Cadastre-o na tabela "admins" primeiro.`);
  exit(1);
}
console.log(`Senha definida para ${email}.`);
