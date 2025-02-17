"use server";

import { ProductSchema } from "@/app/types/product-schema";
import { action } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products, productVariants } from "../schema";
import { revalidatePath } from "next/cache";
import { syncProductsToAlgolia } from "@/lib/algolia-client";
import { z } from "zod";

type ProductInput = z.infer<typeof ProductSchema>;
type ProductOutput = {
  message: string;
};

export const createProduct = action(
  ProductSchema,
  async (input: ProductInput) => {
    try {
      //EDIT MODE
      if (input.id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, input.id),
        });
        if (!currentProduct) return { error: "Product not found" };

        const editedProduct = await db
          .update(products)
          .set({
            description: input.description,
            price: input.price,
            title: input.title,
            stock_quantity: input.stock_quantity,
          })
          .where(eq(products.id, input.id))
          .returning();

        // Aktualizace varianty produktu
        await db
          .update(productVariants)
          .set({
            material: input.material,
            stone: input.stone,
            color: input.color,
            collection: input.collection,
            size: input.size,
            category: input.category,
            productType: input.productType,
            price: input.price,
          })
          .where(eq(productVariants.productID, input.id));

        // Načtení aktualizovaných dat pro Algolii
        const variants = await db.query.productVariants.findMany({
          with: {
            product: true,
            variantImages: true,
          },
        });

        // Synchronizace s Algolií
        await syncProductsToAlgolia(variants);

        revalidatePath("/dashboard/products");
        return {
          data: {
            message: `Product ${editedProduct[0].title} has been edited`,
          },
        };
      }

      // CREATE MODE
      if (!input.id) {
        const newProduct = await db
          .insert(products)
          .values({
            description: input.description,
            price: input.price,
            title: input.title,
            stock_quantity: input.stock_quantity,
          })
          .returning();

        // Vytvoření varianty produktu
        await db.insert(productVariants).values({
          material: input.material,
          stone: input.stone,
          color: input.color,
          collection: input.collection,
          size: input.size,
          category: input.category,
          productType: input.productType,
          price: input.price,
          productID: newProduct[0].id,
        });

        // Načtení aktualizovaných dat pro Algolii
        const variants = await db.query.productVariants.findMany({
          with: {
            product: true,
            variantImages: true,
          },
        });

        // Synchronizace s Algolií
        await syncProductsToAlgolia(variants);

        revalidatePath("/dashboard/products");
        return {
          data: { message: `Product ${newProduct[0].title} has been created` },
        };
      }
    } catch (err) {
      return { error: "Failed to create product" };
    }
  }
);
