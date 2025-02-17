import { NextResponse } from "next/server";
import { db } from "@/server";
import { products, productVariants } from "@/server/schema";
import { eq, and, or, ilike, between } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("Search params:", Object.fromEntries(searchParams));

    // Získání všech možných filtrů z URL parametrů
    const material = searchParams.get("material");
    const color = searchParams.get("color");
    const stone = searchParams.get("stone");
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let conditions = [];

    // Přidání podmínek pro každý filtr, pokud je definován
    if (material) {
      conditions.push(eq(productVariants.material, material));
    }
    if (color) {
      conditions.push(eq(productVariants.color, color));
    }
    if (stone) {
      conditions.push(eq(productVariants.stone, stone));
    }
    if (category) {
      conditions.push(eq(productVariants.category, category));
    }
    if (collection) {
      conditions.push(eq(productVariants.collection, collection));
    }
    if (size) {
      conditions.push(eq(productVariants.size, size));
    }
    if (minPrice && maxPrice) {
      conditions.push(
        between(
          productVariants.price,
          parseFloat(minPrice),
          parseFloat(maxPrice)
        )
      );
    }

    console.log("Filter conditions:", conditions);

    const filteredProducts = await db.query.products.findMany({
      with: {
        productVariants: {
          where: conditions.length > 0 ? and(...conditions) : undefined,
          with: {
            variantImages: true,
            variantTags: true,
          },
        },
      },
    });

    console.log("Found products:", filteredProducts.length);
    console.log("First product:", filteredProducts[0]);

    // Filtrujeme produkty, které nemají žádné varianty splňující podmínky
    const productsWithVariants = filteredProducts.filter(
      (product) => product.productVariants.length > 0
    );

    console.log("Products with variants:", productsWithVariants.length);

    return NextResponse.json(productsWithVariants);
  } catch (error) {
    console.error("Error filtering products:", error);
    return NextResponse.json(
      { error: "Failed to filter products" },
      { status: 500 }
    );
  }
}
