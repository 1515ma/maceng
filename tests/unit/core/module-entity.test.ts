import { isEngineeringArea, type EngineeringModule } from "@/core/entities/module";

describe("EngineeringModule entity", () => {
  // Evita: guard não reconhecer áreas válidas, quebrando filtros futuros de civil/elétrica/química
  it("accepts known engineering areas", () => {
    expect(isEngineeringArea("mechanical")).toBe(true);
    expect(isEngineeringArea("civil")).toBe(true);
    expect(isEngineeringArea("electrical")).toBe(true);
    expect(isEngineeringArea("chemical")).toBe(true);
  });

  // Evita: guard aceitar strings arbitrárias e permitir URLs inválidas (IDOR/roteamento quebrado)
  it("rejects unknown engineering areas", () => {
    expect(isEngineeringArea("")).toBe(false);
    expect(isEngineeringArea("bio")).toBe(false);
    expect(isEngineeringArea(undefined)).toBe(false);
  });

  // Evita: regressão no contrato público — campos obrigatórios sumindo e quebrando a UI
  it("has a type-compatible shape", () => {
    const sample: EngineeringModule = {
      slug: "dimensionamento-resistencia",
      name: "Dimensionamento e Resistência",
      description: "desc",
      area: "mechanical",
      icon: "Gauge",
      calculators: ["A", "B"],
      status: "available",
    };
    expect(sample.slug.length).toBeGreaterThan(0);
  });
});
