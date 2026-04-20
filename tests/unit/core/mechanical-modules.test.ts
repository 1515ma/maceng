import {
  MECHANICAL_MODULES,
  findMechanicalModuleBySlug,
} from "@/core/data/mechanical-modules";

describe("Catálogo de módulos mecânicos", () => {
  // Evita: catálogo com quantidade errada de módulos, violando o requisito do produto (15)
  it("contains exactly 15 modules", () => {
    expect(MECHANICAL_MODULES).toHaveLength(15);
  });

  // Evita: slugs duplicados gerando rotas ambíguas e colisões no App Router
  it("has unique slugs across all modules", () => {
    const slugs = MECHANICAL_MODULES.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  // Evita: slugs com caracteres inválidos para URL (maiúsculas, acentos, espaços)
  it("uses url-safe kebab-case slugs", () => {
    for (const m of MECHANICAL_MODULES) {
      expect(m.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  // Evita: módulos sem calculadoras listadas, deixando a UI interna sem conteúdo
  it("each module has at least one calculator listed", () => {
    for (const m of MECHANICAL_MODULES) {
      expect(m.calculators.length).toBeGreaterThan(0);
    }
  });

  // Evita: módulos registrados em área errada, confundindo filtros futuros por engenharia
  it("all modules belong to the mechanical area", () => {
    for (const m of MECHANICAL_MODULES) {
      expect(m.area).toBe("mechanical");
    }
  });

  // Evita: módulos sem descrição, prejudicando escaneabilidade e SEO dos cards
  it("every module has a non-empty description", () => {
    for (const m of MECHANICAL_MODULES) {
      expect(m.description.length).toBeGreaterThan(0);
    }
  });

  // Evita: lookup por slug retornar undefined silenciosamente para slug existente
  it("findMechanicalModuleBySlug returns the matching module", () => {
    const first = MECHANICAL_MODULES[0];
    expect(findMechanicalModuleBySlug(first.slug)).toEqual(first);
  });

  // Evita: lookup retornar módulo errado quando slug não existe (segurança de roteamento)
  it("findMechanicalModuleBySlug returns undefined for unknown slug", () => {
    expect(findMechanicalModuleBySlug("slug-inexistente")).toBeUndefined();
  });

  // Evita: perda de módulos específicos esperados pelo produto (sanity check)
  it("contains the 15 expected product modules", () => {
    const slugs = MECHANICAL_MODULES.map((m) => m.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "dimensionamento-resistencia",
        "elementos-fixacao-roscas",
        "tolerancias-ajustes",
        "materiais-tratamentos",
        "componentes-transmissao",
        "hidraulica-pneumatica",
        "processos-fabricacao",
        "motores-redutores",
        "molas-elementos-elasticos",
        "custos-fabricacao",
        "ergonomia-seguranca",
        "vedacao-lubrificacao",
        "soldagem-simbologia",
        "conversor-unidades",
        "gestao-arquivos",
      ]),
    );
  });
});
