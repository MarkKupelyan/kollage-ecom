"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import { useState } from "react";
import Products from "./products";
import SortBy from "../SortBy";
import Filter from "../Filter";

type ClientProductsProps = {
  variants: VariantsWithProduct[];
};

export function ClientProducts({
  variants: initialVariants,
}: ClientProductsProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [variants, setVariants] =
    useState<VariantsWithProduct[]>(initialVariants);

  const handleProductsUpdate = (filteredProducts: any[]) => {
    console.log("Received filtered products:", filteredProducts);

    // Převedeme filtrované produkty na formát VariantsWithProduct
    const updatedVariants = filteredProducts.flatMap((product) => {
      console.log("Processing product:", product);
      return product.productVariants.map((variant: any) => {
        console.log("Processing variant:", variant);
        return {
          ...variant,
          product: {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            stock_quantity: product.stock_quantity,
            created: product.created,
          },
        };
      });
    });

    console.log("Updated variants:", updatedVariants);
    setVariants(updatedVariants);
  };

  return (
    <div>
      {/* FILTER AND SORT */}
      <div className="flex justify-between items-center mb-8">
        <Filter onProductsUpdate={handleProductsUpdate} />
        <SortBy setSortOrder={setSortOrder} />
      </div>

      {/* PRODUCTS */}
      <Products variants={variants} sortOrder={sortOrder} />
    </div>
  );
}
