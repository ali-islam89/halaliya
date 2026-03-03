import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

// Named export for backward compatibility in API routes
export const stripe = {
  checkout: {
    sessions: {
      create: (params: any) => getStripe().checkout.sessions.create(params),
    },
  },
  webhooks: {
    constructEvent: (body: string, sig: string, secret: string) =>
      getStripe().webhooks.constructEvent(body, sig, secret),
  },
};
