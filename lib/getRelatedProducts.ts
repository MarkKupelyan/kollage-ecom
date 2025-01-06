import { db } from "@/server";
import { productVariants, products } from "@/server/schema";
import { eq, ne, sql } from "drizzle-orm";

export async function getRelatedProducts(currentVariantId: number) {
  const currentVariant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, currentVariantId),
    with: {
      product: true,
    },
  });

  if (!currentVariant) return [];

  const relatedProducts = await db.query.productVariants.findMany({
    where: ne(productVariants.id, currentVariantId),
    limit: 4,
    with: {
      product: true,
      variantImages: true,
    },
    orderBy: sql`RANDOM()`,
  });

  return relatedProducts.map((variant) => ({
    id: variant.id,
    name: variant.product.title,
    price: variant.product.price,
    image: variant.variantImages[0]?.url || "",
  }));
}
