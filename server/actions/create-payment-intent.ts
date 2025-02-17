"use server";

import { paymentIntentSchema } from "@/app/types/payment-intent-schema";
import { action } from "@/lib/safe-action";
import Stripe from "stripe";
import { auth } from "../auth";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2025-01-27.acacia",
});

type PaymentIntentInput = z.infer<typeof paymentIntentSchema>;
type PaymentIntentOutput = {
  paymentIntentID: string;
  clientSecretID: string | null;
  user: string | null;
};

export const createPaymentIntent = action(
  paymentIntentSchema,
  async (input: PaymentIntentInput) => {
    const { amount, cart, currency } = input;

    const user = await auth();
    if (!user) return { error: "Please login to continue" };
    if (!amount) return { error: "No Product to checkout" };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          cart: JSON.stringify(cart),
        },
      });

      return {
        data: {
          paymentIntentID: paymentIntent.id,
          clientSecretID: paymentIntent.client_secret,
          user: user.user.email,
        },
      };
    } catch (error) {
      console.error("Stripe Payment Intent Error:", error);
      return { error: "Payment failed. Please try again." };
    }
  }
);
