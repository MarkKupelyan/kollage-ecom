import algoliasearch from "algoliasearch";

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH!
);

const adminClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

const index = adminClient.initIndex("productVariants");

interface VariantImage {
  url: string;
}

interface ProductVariant {
  id: number;
  productID: number;
  product: {
    title: string;
  };
  price: number;
  material: string;
  color: string;
  stone: string | null;
  category: string;
  collection: string | null;
  size: string | null;
  productType: string;
  variantImages: VariantImage[];
}

export async function syncProductsToAlgolia(variants: ProductVariant[]) {
  try {
    const records = variants.map((variant: ProductVariant) => ({
      objectID: variant.id.toString(),
      id: variant.id,
      productID: variant.productID,
      title: variant.product.title,
      price: variant.price,
      material: variant.material,
      color: variant.color,
      stone: variant.stone,
      category: variant.category,
      collection: variant.collection,
      size: variant.size,
      productType: variant.productType,
      variantImages: variant.variantImages.map((img: VariantImage) => img.url),
      _tags: [
        variant.material,
        variant.color,
        variant.category,
        variant.collection,
      ].filter(Boolean),
    }));

    await index.replaceAllObjects(records, {
      autoGenerateObjectIDIfNotExist: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error syncing to Algolia:", error);
    return { error: "Failed to sync with Algolia" };
  }
}
