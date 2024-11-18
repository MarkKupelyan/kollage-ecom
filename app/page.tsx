import { db } from "@/server";
import Slider from "@/components/slider";
import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tags";
import Products from "@/components/products/products";
import ProductList from "@/components/ProductList";
import CategoryList from "@/components/CategoryList";
//import ClientComponent from "./client-component"; // Importujeme klientskou komponentu

export const revalidate = 3600; // Volitelně, pokud chcete ISR

export default async function Home() {
  // Původní asynchronní načítání dat
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
      {/* <ClientComponent /> {/* Vložení klientské logiky */}
      <div className="">
        <Slider />
      </div>

      <div className="py-4 px-8">
        <h1 className="text-3xl mt-8 mx-[41%]">Product catalog</h1>
        <ProductList />
      </div>
      <div className="py-4 px-6">
        <h1 className="text-2xl mt-24 px-4 md:px-24 lg:px-16 xl:32 2xl:px-64 mb-12">
          Categories
        </h1>
        <ProductList />
      </div>
      <div className="py-4 px-8">
        <h1 className="text-3xl mt-8 mx-[41%]">New Products</h1>
        <CategoryList />
      </div>
      <ProductTags />
      <Products variants={data} />
    </main>
  );
}
