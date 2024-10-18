export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
}

export type SubcriptionPlanCreationPayload = Omit<SubscriptionPlan, 'id'>;

export type SubscriptionPlanUpdatePayload = Partial<SubscriptionPlan>;
