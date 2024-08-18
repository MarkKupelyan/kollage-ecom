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
      <main>
        <h1>Product not found</h1>
      </main>
    );
  }

  const reviewAvg = getReviewAverage(
    variant?.product.reviews.map((r) => r.rating)
  );

  // Check if the product is in stock (correctly accessing stock_quantity from product)
  const isInStock = variant.product.stock_quantity > 0;

  return (
    <main>
      <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="flex-1">
          <ProductShowcase variants={variant.product.productVariants} />
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-2xl font-bold">{variant?.product.title}</h2>
          <div>
            <ProductType variants={variant.product.productVariants} />
            <Stars
              rating={reviewAvg}
              totalReviews={variant.product.reviews.length}
            />
          </div>
          <Separator className="my-2" />
          <p className="text-2xl font-medium py-2">
            {formatPrice(variant.product.price)}
          </p>
          {/* Stock availability message */}
          <p
            className={`font-medium my-2 ${
              isInStock ? "text-green-500" : "text-red-500"
            }`}
          >
            {isInStock
              ? `In Stock: ${variant.product.stock_quantity} available`
              : "Product is currently out of stock"}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: variant.product.description }}
          ></div>
          <p className="text-secondary-foreground font-medium my-2">
            Available Colors
          </p>
          <div className="flex gap-4 ">
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
          {/* Add to Cart button with disabled state based on stock */}
          <AddCart
            stockQuantity={variant.product.stock_quantity} // Pass the stock quantity directly
            productID={variant.product.id} // Pass the product ID directly
            variantID={variant.id} // Pass the variant ID directly
            title={variant.product.title}
            type={variant.product.productVariants[0]?.productType} // Extract the productType from productVariants
            price={variant.product.price}
            image={variant.product.productVariants[0]?.variantImages[0]?.url} // Pass the image directly
            disabled={!isInStock} // Control whether the button is disabled
          />
        </div>
      </section>
      <Reviews productID={variant.productID} />
    </main>
  );
}
