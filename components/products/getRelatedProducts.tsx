import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq, and, ne } from "drizzle-orm"; // Import `and` a `ne`

export async function getRelatedProducts(productId: number) {
  // Najděte aktuální produkt, abyste získali jeho `productID`
  const product = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, productId),
    with: {
      product: true,
    },
  });

  if (!product) {
    return [];
  }

  // Najděte související produkty
  const relatedProducts = await db.query.productVariants.findMany({
    where: and(
      eq(productVariants.productID, product.product.id), // Filtrujte podle stejného `productID`
      ne(productVariants.id, productId) // Vynechte aktuální produkt
    ),
    with: {
      variantImages: true,
      product: true,
    },
    limit: 4, // Limit na 4 produkty
  });

  // Transformujte výsledky do požadovaného formátu
  return relatedProducts.map((variant) => ({
    id: variant.id,
    name: variant.product.title,
    price: variant.product.price,
    image: variant.variantImages[0]?.url || "/placeholder.jpg", // Fallback pro chybějící obrázek
  }));
}
