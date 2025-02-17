import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

const middleware = [
  // Zde můžete přidat middleware, pokud je potřeba
];

export const action = createSafeActionClient();

export type ActionState<I, O> = {
  data?: O;
  error?: string;
  validationError?: z.ZodError;
};

export type ActionHandler<I, O> = (input: I) => Promise<ActionState<I, O>>;
