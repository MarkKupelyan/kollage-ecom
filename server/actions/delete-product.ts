"use server";

import { createSafeActionClient } from "next-safe-action";
import * as z from "zod";
import { db } from "..";
import { products, productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import algoliasearch from "algoliasearch";

const action = createSafeActionClient();

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

const algoliaIndex = client.initIndex("products");

export const deleteProduct = action(
  z.object({ id: z.number() }),
  async ({ id }) => {
    try {
      // Nejdřív získáme všechny varianty produktu
      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productID, id));

      // Smažeme varianty z Algolia
      await Promise.all(
        variants.map((variant) =>
          algoliaIndex.deleteObject(variant.id.toString())
        )
      );

      // Pak smažeme produkt z databáze (varianty se smažou automaticky díky CASCADE)
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");
      return { success: `Product ${data[0].title} has been deleted` };
    } catch (error) {
      return { error: "Failed to delete product" };
    }
  }
);
