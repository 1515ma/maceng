import { Logo } from "@/components/ui/logo";
import { CONTAINER_CLASS } from "@/lib/constants";

const footerSections = [
  {
    title: "Produto",
    links: [
      { label: "Módulos", href: "#modulos" },
      { label: "Planos", href: "#planos" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Engenharias",
    links: [
      { label: "Mecânica", href: "#modulos" },
      { label: "Civil (em breve)", href: "#" },
      { label: "Elétrica (em breve)", href: "#" },
      { label: "Química (em breve)", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de Uso", href: "/termos" },
      { label: "Privacidade", href: "/privacidade" },
      { label: "Contato", href: "/contato" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className={`${CONTAINER_CLASS} py-16`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
              Calculadoras técnicas profissionais para engenharia. Normas ABNT, ISO e DIN na palma
              da sua mão.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] hover:text-brand-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Maceng. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Feito com precisão para engenheiros.
          </p>
        </div>
      </div>
    </footer>
  );
}
