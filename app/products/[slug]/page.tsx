import ProductType from "@/components/products/product-type";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import ProductPick from "@/components/products/product-pick";
import ProductShowcase from "@/components/products/product-showcase";
import Reviews from "@/components/reviews/reviews";
import { getReviewAverage } from "@/lib/review-avarage";
import Stars from "@/components/reviews/stars";
import AddCart from "@/components/cart/add-cart";
import React from "react";
import RelatedProducts from "@/components/RelatedProducts";
import { getRelatedProducts } from "@/lib/getRelatedProducts";

export const revalidate = 60;

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugID;
  }
  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          reviews: true,
          productVariants: {
            with: { variantImages: true, variantTags: true },
          },
        },
      },
    },
  });

  if (!variant) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500">Product not found</h1>
      </main>
    );
  }

  const reviewAvg = getReviewAverage(
    variant?.product.reviews.map((r) => r.rating)
  );

  const isInStock = variant.product.stock_quantity > 0;

  const relatedProducts = await getRelatedProducts(variant.id);

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="flex-1">
          <ProductShowcase variants={variant.product.productVariants} />
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-2xl font-bold mb-4">{variant?.product.title}</h2>
          <div className="mb-4">
            <ProductType variants={variant.product.productVariants} />
            <Stars
              rating={reviewAvg}
              totalReviews={variant.product.reviews.length}
            />
          </div>
          <Separator className="my-4" />
          <p className="text-2xl font-medium py-2">
            {formatPrice(variant.product.price)}
          </p>
          <p
            className={`font-medium my-4 ${
              isInStock ? "text-green-500" : "text-red-500"
            }`}
          >
            {isInStock
              ? `In Stock: ${variant.product.stock_quantity} available`
              : "Product is currently out of stock"}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: variant.product.description }}
            className="mb-4"
          ></div>
          <p className="text-secondary-foreground font-medium my-4">
            Available Colors
          </p>
          <div className="flex gap-4 flex-wrap ">
            {variant.product.productVariants.map((prodVariant) => (
              <ProductPick
                key={prodVariant.id}
                productID={variant.productID}
                productType={prodVariant.productType}
                id={prodVariant.id}
                color={prodVariant.color}
                price={variant.product.price}
                title={variant.product.title}
                image={prodVariant.variantImages[0]?.url}
              />
            ))}
          </div>
          <AddCart
            stockQuantity={variant.product.stock_quantity}
            productID={variant.product.id}
            variantID={variant.id}
            title={variant.product.title}
            type={variant.product.productVariants[0]?.productType}
            price={variant.product.price}
            image={variant.product.productVariants[0]?.variantImages[0]?.url}
            disabled={!isInStock}
          />
        </div>
      </section>

      <Reviews productID={variant.productID} />
      <RelatedProducts products={relatedProducts} />
    </main>
  );
}
