import { db } from "@/server";
import Image from "next/image";
import Link from "next/link";
import { Car, Heart, Search, ShoppingBag, User } from "lucide-react";

import Slider from "@/components/slider";
import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tags";
import Products from "@/components/products/products";
import ProductList from "@/components/ProductList";
import CategoryList from "@/components/CategoryList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShopByCategory from "@/components/ShopByCategory";
import Card from "@/components/card-cycle";

export const revalidate = 3600;

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  const featuredCollections = [
    {
      id: 1,
      name: "Summer Collection",
      description:
        "Discover our latest summer pieces, perfect for any occasion.",
      image: "/01.jpg",
    },
    {
      id: 2,
      name: "Luxury Line",
      description:
        "Exclusive pieces crafted with the finest materials and attention to detail.",
      image: "/02.jpg",
    },
    {
      id: 3,
      name: "Classic Collection",
      description: "Timeless pieces that never go out of style.",
      image: "/vlt.jpg",
    },
  ];
  const categories = [
    {
      name: "BRACELETS",
      image: "/01.jpg",
      womenLink: "#",
      menLink: "#",
    },
    {
      name: "NECKLACES",
      image: "/02.jpg",
      womenLink: "#",
      menLink: "#",
    },
    {
      name: "RINGS",
      image: "/05.jpg",
      womenLink: "#",
      menLink: "#",
    },
    {
      name: "EARRINGS",
      image: "/vlt.jpg",
      womenLink: "#",
      menLink: "#",
    },
    {
      name: "WATCHES",
      image: "/vlt.jpg",
      womenLink: "#",
      menLink: "#",
    },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-white font-heading">
      <main>
        {/* Hero Slider Section */}
        <section className="w-full">
          <Slider />
        </section>

        {/* Featured Collections */}
        <section className="py-6 bg-background">
          <div className="container px-0 lg:px-4">
            {" "}
            {/* Remove padding only on mobile */}
            <div className="grid gap-12">
              {featuredCollections.map((collection, index) => (
                <div
                  key={collection.id}
                  className={`grid items-center gap-8 ${
                    index % 2 === 0
                      ? "lg:grid-cols-[2fr,1fr]"
                      : "lg:grid-cols-[1fr,2fr]"
                  }`}
                >
                  <div
                    className={`w-full ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden group">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                  <div
                    className={`flex flex-col items-start px-4 lg:px-0 ${
                      index % 2 === 1 ? "lg:order-1 lg:pr-16" : "lg:pl-16"
                    }`}
                  >
                    <h3 className="text-2xl font-light mb-4">
                      {collection.name}
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      {collection.description}
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-none border-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      Explore Collection
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop By Category Section */}
        <ShopByCategory />

        {/* Product Catalog Section */}
        <section className="py-16 bg-muted/10">
          <div className="container">
            <h2 className="text-3xl font-light text-center mb-12">
              Product Catalog
            </h2>
            <ProductList />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-light text-center mb-12">
              Categories
            </h2>
            <CategoryList />
          </div>
        </section>

        {/* New Products Section */}
        <section className="py-16 bg-muted/10">
          <div className="container">
            <h2 className="text-3xl font-light text-center mb-12">
              New Arrivals
            </h2>
            <div className="mb-12">
              <ProductList />
            </div>
          </div>
        </section>

        {/* Product Tags and Listing */}

        {/* Newsletter Section */}
        <section className="py-15 bg-muted/10">
          <div className="container mt-8 max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-light mb-1">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for exclusive offers and new product
              updates.
            </p>
            <form className="flex gap-1">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-none"
              />
              <Button type="submit" className="rounded-none">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
        {/*
        <section>
          <div>
            <Card />
          </div>
        </section>*/}
      </main>
    </div>
  );
}
