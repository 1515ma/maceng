import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/ui/logo";

describe("Logo", () => {
  beforeEach(() => {
    render(<Logo />);
  });

  // Evita: refatoração do componente Logo apagar o texto da marca ou alterar o split "Mac" + "eng"
  it("renders the brand name split as Mac + eng", () => {
    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(screen.getByText("eng")).toBeInTheDocument();
  });

  // Evita: Logo perder o link para home, deixando o usuário sem atalho para a raiz do site
  it("wraps the logo in a link pointing to home", () => {
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  // Evita: o ícone Cog ser removido do Logo, quebrando a identidade visual do produto
  it("renders the Cog icon container", () => {
    const link = screen.getByRole("link");
    expect(link.querySelector("svg")).toBeInTheDocument();
  });
});
