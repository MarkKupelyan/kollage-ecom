//import Algolia from "@/components/products/algolia";
import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tags";
import Products from "@/components/products/products";
import { db } from "@/server";
import Slider from "@/components/slider";
import ProductList from "@/components/ProductList";
import CategoryList from "@/components/CategoryList";

export const revalidate = 60 * 60;

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  return (
    <main className="">
      <Slider />
      <Algolia />
      <div className="py-4">
        <h1 className="text-3xl mt-8 mx-[41%]">Product catalog</h1>
        <ProductList />
      </div>
      <div className="py-4">
        <h1 className="text-2xl mt-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 mb-12">
          Categories
        </h1>
        <ProductList />
      </div>
      <div className="py-4">
        <h1 className="text-3xl mt-8 mx-[41%]">New Products</h1>
        <CategoryList />
      </div>
      <ProductTags />
      <Products variants={data} />
    </main>
  );
}
