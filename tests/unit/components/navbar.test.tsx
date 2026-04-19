import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/layout/navbar";

describe("Navbar", () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  // Evita: refatoração que apague ou renomeie o logo, quebrando a identidade visual da marca
  it("renders the Maceng brand name", () => {
    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(screen.getByText("eng")).toBeInTheDocument();
  });

  // Evita: remoção acidental de link de navegação, deixando seções inacessíveis pelo menu
  it("renders all navigation links", () => {
    expect(screen.getByText("Módulos")).toBeInTheDocument();
    expect(screen.getByText("Como Funciona")).toBeInTheDocument();
    expect(screen.getByText("Planos")).toBeInTheDocument();
    expect(screen.getByText("FAQ")).toBeInTheDocument();
  });

  // Evita: sumir com os botões de entrada/cadastro, bloqueando o funil de conversão
  it("renders login and register buttons", () => {
    const enterButtons = screen.getAllByText("Entrar");
    expect(enterButtons.length).toBeGreaterThanOrEqual(1);

    const registerButtons = screen.getAllByText("Começar grátis");
    expect(registerButtons.length).toBeGreaterThanOrEqual(1);
  });

  // Evita: quebra de acessibilidade — leitores de tela não conseguem descrever o botão de tema sem aria-label
  it("renders the theme toggle button with accessible label", () => {
    expect(screen.getByLabelText("Alternar tema")).toBeInTheDocument();
  });

  // Evita: quebra de acessibilidade — leitores de tela não conseguem descrever o menu hamburguer sem aria-label
  it("renders the mobile menu button with accessible label", () => {
    expect(screen.getByLabelText("Menu")).toBeInTheDocument();
  });

  // Evita: link de login apontando para rota errada, redirecionando usuário para página 404
  it("links login to /login", () => {
    const links = screen.getAllByText("Entrar");
    const loginLink = links[0].closest("a");
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  // Evita: link de cadastro apontando para rota errada, impedindo novos usuários de se registrarem
  it("links register to /cadastro", () => {
    const links = screen.getAllByText("Começar grátis");
    const registerLink = links[0].closest("a");
    expect(registerLink).toHaveAttribute("href", "/cadastro");
  });
});
