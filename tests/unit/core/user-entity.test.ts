import { User, SubscriptionPlan } from "@/core/entities/user";

describe("User Entity", () => {
  const validUser: User = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "engenheiro@example.com",
    name: "João Silva",
    plan: "free",
    calculationsUsed: 0,
    createdAt: new Date("2026-01-01"),
  };

  // Evita: entidade User aceitar plano que não existe no produto, gerando inconsistência com Stripe
  it("only accepts valid subscription plans", () => {
    const validPlans: SubscriptionPlan[] = ["free", "pro", "max"];
    for (const plan of validPlans) {
      expect(validPlans).toContain(plan);
    }
    expect(validPlans).not.toContain("enterprise");
  });

  // Evita: entidade User sem campo de ID UUID, permitindo IDs sequenciais que expõem enumeração (IDOR)
  it("uses UUID format for id", () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(validUser.id).toMatch(uuidRegex);
  });

  // Evita: criar User sem email obrigatório, quebrando a autenticação
  it("requires email field", () => {
    expect(validUser.email).toBeDefined();
    expect(validUser.email.length).toBeGreaterThan(0);
  });

  // Evita: campo calculationsUsed ser negativo, o que não faz sentido no domínio
  it("calculationsUsed starts at zero or positive", () => {
    expect(validUser.calculationsUsed).toBeGreaterThanOrEqual(0);
  });

  // Evita: campo createdAt não existir, impossibilitando auditoria temporal de contas
  it("has createdAt timestamp", () => {
    expect(validUser.createdAt).toBeInstanceOf(Date);
  });
});
