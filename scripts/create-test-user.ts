/**
 * Cria um usuário de teste no Supabase Auth já com e-mail confirmado.
 *
 * Uso:
 *   npm run seed:test-user
 *
 * Ou com credenciais customizadas:
 *   TEST_USER_EMAIL=foo@bar.com TEST_USER_PASSWORD=SenhaForte@1 npm run seed:test-user
 *
 * Requer SUPABASE_SERVICE_ROLE_KEY no .env.local (chave server-only, NUNCA no client).
 */
import { createSupabaseAdminClient } from "../src/infra/database/supabase-admin";

const EMAIL = process.env.TEST_USER_EMAIL ?? "teste@maceng.com.br";
const PASSWORD = process.env.TEST_USER_PASSWORD ?? "Teste@2026";
const NAME = process.env.TEST_USER_NAME ?? "Usuário de Teste";

async function main() {
  const admin = createSupabaseAdminClient();

  console.log(`→ Procurando usuário existente: ${EMAIL}`);
  const { data: existing } = await admin.auth.admin.listUsers();
  const alreadyExists = existing?.users.find((u) => u.email === EMAIL);

  if (alreadyExists) {
    console.log(`✓ Usuário já existe (id: ${alreadyExists.id}). Redefinindo senha…`);
    const { error } = await admin.auth.admin.updateUserById(alreadyExists.id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { name: NAME },
    });
    if (error) throw error;
    printSuccess(alreadyExists.id);
    return;
  }

  console.log(`→ Criando usuário: ${EMAIL}`);
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { name: NAME },
  });

  if (error) throw error;
  if (!data.user) throw new Error("Usuário não retornado pela API");

  printSuccess(data.user.id);
}

function printSuccess(id: string) {
  console.log("");
  console.log("════════════════════════════════════════════");
  console.log("  Usuário de teste pronto para uso");
  console.log("════════════════════════════════════════════");
  console.log(`  ID:     ${id}`);
  console.log(`  E-mail: ${EMAIL}`);
  console.log(`  Senha:  ${PASSWORD}`);
  console.log(`  Nome:   ${NAME}`);
  console.log("════════════════════════════════════════════");
  console.log("");
  console.log("Acesse http://localhost:3000/login e entre com essas credenciais.");
}

main().catch((err) => {
  console.error("✗ Falha ao criar usuário de teste:");
  console.error(err);
  process.exit(1);
});
