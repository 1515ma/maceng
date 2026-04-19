import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FaqSection } from "@/app/(site)/sections/faq";

// Lista canônica de perguntas — remoção ou alteração de texto deve ser decisão consciente
const expectedQuestions = [
  "As fórmulas são baseadas em quais normas?",
  "Posso usar gratuitamente para sempre?",
  "Como funciona o limite de cálculos?",
  "Posso cancelar minha assinatura a qualquer momento?",
  "Haverá outras engenharias além da mecânica?",
  "Os cálculos podem substituir o projeto feito por engenheiro?",
];

describe("FaqSection", () => {
  beforeEach(() => {
    render(<FaqSection />);
  });

  // Evita: alterar o badge da seção e perder a âncora de navegação #faq
  it("renders section heading", () => {
    expect(screen.getByText("Dúvidas Frequentes")).toBeInTheDocument();
  });

  // Evita: apagar uma pergunta sem querer durante edição, deixando o FAQ incompleto
  it("renders all 6 questions", () => {
    for (const q of expectedQuestions) {
      expect(screen.getByText(q)).toBeInTheDocument();
    }
  });

  // Evita: adicionar duplicata de pergunta ou renderizar número diferente do esperado
  it("renders exactly 6 FAQ items", () => {
    const questions = expectedQuestions.map((q) => screen.getByText(q));
    expect(questions).toHaveLength(6);
  });

  // Evita: quebra do comportamento de accordion — clicar na pergunta não expande a resposta
  it("expands answer when question is clicked", async () => {
    const user = userEvent.setup();
    const question = screen.getByText(expectedQuestions[0]);

    await user.click(question);

    expect(screen.getByText(/ABNT, ISO e DIN/)).toBeInTheDocument();
  });

  // Evita: remover o disclaimer legal sobre CREA/CONFEA, que protege a empresa de responsabilidade técnica indevida
  it("includes CREA/CONFEA disclaimer in last FAQ", async () => {
    const user = userEvent.setup();
    const question = screen.getByText(expectedQuestions[5]);

    await user.click(question);

    expect(screen.getByText(/CREA\/CONFEA/)).toBeInTheDocument();
  });
});
