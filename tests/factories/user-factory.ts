import type { User, SubscriptionPlan } from "@/core/entities/user";

let counter = 0;

export function createUser(overrides: Partial<User> = {}): User {
  counter++;
  return {
    id: `550e8400-e29b-41d4-a716-44665544${String(counter).padStart(4, "0")}`,
    email: `user${counter}@example.com`,
    name: `User ${counter}`,
    plan: "free" as SubscriptionPlan,
    calculationsUsed: 0,
    createdAt: new Date("2026-01-01"),
    ...overrides,
  };
}

export function resetUserCounter() {
  counter = 0;
}
