"use client";

import { useEffect, useState } from "react";
import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tags";
import Products from "@/components/products/products";
import { db } from "@/server";
import { VariantsWithProduct } from "@/lib/infer-type";

export const revalidate = 60 * 60;

export default function CatalogClient() {
  const [data, setData] = useState<VariantsWithProduct[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await db.query.productVariants.findMany({
        with: {
          variantImages: true,
          variantTags: true,
          product: true,
        },
        orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
      });
      setData(response);
    }
    fetchData();
  }, []);

  return (
    <main className="">
      <Algolia />
      <ProductTags />
      <Products variants={data} sortOrder="desc" />
    </main>
  );
}
