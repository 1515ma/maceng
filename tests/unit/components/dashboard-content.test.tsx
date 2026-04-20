import { render, screen } from "@testing-library/react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { createUser } from "@tests/factories";

describe("DashboardContent", () => {
  // Evita: dashboard não saudar o usuário, removendo a personalização pós-login (regressão de UX)
  it("renders welcome message with user name when name is present", () => {
    const user = createUser({ name: "Maria Silva" });
    render(<DashboardContent user={user} />);
    expect(screen.getByText(/Olá, Maria Silva/i)).toBeInTheDocument();
  });

  // Evita: usuário sem nome (signup via Google sem full_name) quebrar o render com "undefined"
  it("falls back to email when name is null", () => {
    const user = createUser({ name: null, email: "user@example.com" });
    render(<DashboardContent user={user} />);
    expect(screen.getByText(/Olá, user@example.com/i)).toBeInTheDocument();
  });

  // Evita: plano atual sumir da UI, impedindo o usuário de saber quanto pode calcular
  it("displays current subscription plan", () => {
    const user = createUser({ plan: "pro" });
    render(<DashboardContent user={user} />);
    expect(screen.getByText(/Plano:\s*Pro/i)).toBeInTheDocument();
  });

  // Evita: contador de cálculos restantes desaparecer, ocultando limite de uso do plano
  it("displays calculations used count", () => {
    const user = createUser({ calculationsUsed: 42 });
    render(<DashboardContent user={user} />);
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  // Evita: ausência de botão de logout, prendendo o usuário em sessão indefinida
  it("renders the sign-out button", () => {
    render(<DashboardContent user={createUser()} />);
    expect(screen.getByRole("button", { name: /Sair/i })).toBeInTheDocument();
  });
});
