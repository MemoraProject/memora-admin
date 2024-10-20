import { TimeTracking } from "./base";

export type SubscriptionPlan = {
  id: number;
  name: string;
  price: number;
  duration: number;
  durationUnit: string;
  benefit: string;
} & TimeTracking

export type SubcriptionPlanCreationPayload = Omit<SubscriptionPlan, 'id' | keyof TimeTracking>;

export type SubscriptionPlanUpdatePayload = Partial<SubscriptionPlan>;
