export type EngineeringArea = "mechanical" | "civil" | "electrical" | "chemical";

export type ModuleStatus = "available" | "coming-soon";

export interface EngineeringModule {
  slug: string;
  name: string;
  description: string;
  area: EngineeringArea;
  icon: string;
  calculators: string[];
  status: ModuleStatus;
}

const KNOWN_AREAS: ReadonlySet<string> = new Set([
  "mechanical",
  "civil",
  "electrical",
  "chemical",
]);

export function isEngineeringArea(value: unknown): value is EngineeringArea {
  return typeof value === "string" && KNOWN_AREAS.has(value);
}
