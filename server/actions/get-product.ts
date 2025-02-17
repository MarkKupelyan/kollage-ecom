"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { products } from "../schema";

export async function getProduct(id: number) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        productVariants: {
          where: eq(products.id, id),
        },
      },
    });
    if (!product) throw new Error("Product not found");
    return {
      success: {
        ...product,
        material: product.productVariants[0]?.material || "",
        stone: product.productVariants[0]?.stone || "",
        color: product.productVariants[0]?.color || "",
        collection: product.productVariants[0]?.collection || "",
        size: product.productVariants[0]?.size || "",
        category: product.productVariants[0]?.category || "",
        productType: product.productVariants[0]?.productType || "",
      },
    };
  } catch (error) {
    return { error: "Failed to get product" };
  }
}
