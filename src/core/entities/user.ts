export type SubscriptionPlan = "free" | "pro" | "max";

export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: SubscriptionPlan;
  calculationsUsed: number;
  createdAt: Date;
}
