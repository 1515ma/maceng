import { render, screen } from "@testing-library/react";
import ModuleDetailPage from "@/app/(app)/dashboard/[slug]/page";

// Mock do cliente supabase server-side para isolar o teste da infra.
jest.mock("@/infra/database/supabase-server", () => ({
  createSupabaseServerClient: jest.fn(async () => ({} as unknown)),
}));

// Mock do provider para garantir usuário autenticado na página.
jest.mock("@/infra/services/supabase-auth-provider", () => ({
  SupabaseAuthProvider: jest.fn().mockImplementation(() => ({
    getUser: async () => ({
      id: "00000000-0000-0000-0000-000000000001",
      email: "u@e.com",
      name: "User",
      plan: "free",
      calculationsUsed: 0,
      createdAt: new Date(),
    }),
  })),
}));

describe("ModuleDetailPage (dashboard/[slug])", () => {
  // Evita: slug inválido não chamar notFound, expondo página vazia ao invés de 404
  it("calls notFound for unknown slug", async () => {
    const { notFound } = await import("next/navigation");
    const notFoundMock = notFound as unknown as jest.Mock;
    notFoundMock.mockClear();

    try {
      await ModuleDetailPage({ params: Promise.resolve({ slug: "nao-existe" }) });
    } catch {
      // noop
    }
    expect(notFoundMock).toHaveBeenCalled();
  });

  // Evita: página do módulo não renderizar o nome, deixando o usuário perdido
  it("renders module name for valid slug", async () => {
    const element = await ModuleDetailPage({
      params: Promise.resolve({ slug: "dimensionamento-resistencia" }),
    });
    render(element);
    expect(screen.getByRole("heading", { name: /Dimensionamento e Resistência/i })).toBeInTheDocument();
  });

  // Evita: lista de calculadoras sumir, quebrando visibilidade do que o módulo entrega
  it("lists the calculators available in the module", async () => {
    const element = await ModuleDetailPage({
      params: Promise.resolve({ slug: "conversor-unidades" }),
    });
    render(element);
    // 7 calculadoras + 7 badges "Em breve" = 14 itens; aqui checamos listitems.
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(7);
    expect(items.some((el) => /Polegadas fracionárias/i.test(el.textContent ?? ""))).toBe(true);
  });

  // Evita: página pública sem link de volta, forçando uso do botão do browser
  it("renders a link back to dashboard", async () => {
    const element = await ModuleDetailPage({
      params: Promise.resolve({ slug: "dimensionamento-resistencia" }),
    });
    render(element);
    const link = screen.getByRole("link", { name: /Voltar ao dashboard/i });
    expect(link).toHaveAttribute("href", "/dashboard");
  });
});
