"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import formatPrice from "@/lib/format-price";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import placeholder from "@/public/placeholder_small.jpg";

type ProductTypes = {
  variants: VariantsWithProduct[];
  sortOrder: "asc" | "desc";
};

export default function Products({ variants, sortOrder }: ProductTypes) {
  const searchParams = useSearchParams();
  const paramTag = searchParams?.get("tag") || null;

  // Přidáme kontrolu, zda jsou data k dispozici
  if (!variants) {
    return <div>Načítání...</div>;
  }

  // Filtrování produktů podle tagu
  const filtered = useMemo(() => {
    if (paramTag && variants) {
      return variants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === paramTag)
      );
    }
    return variants;
  }, [paramTag, variants]);

  // Seřazení produktů podle ceny
  const sortedProducts = useMemo(() => {
    if (!filtered.length) return [];
    return [...filtered].sort((a, b) =>
      sortOrder === "asc"
        ? a.product.price - b.product.price
        : b.product.price - a.product.price
    );
  }, [filtered, sortOrder]);

  return (
    <main>
      {/* Grid produktů */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3 px-4">
        {sortedProducts.map((variant) => {
          const variantImage =
            variant.variantImages?.[0]?.url || "/placeholder_small.jpg";
          if (!variantImage) return null;

          return (
            <Link
              className="py-0 border rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
              key={variant.id}
              href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variantImage}`}
            >
              <div className="relative w-full h-80">
                <Image
                  className="object-cover rounded-md"
                  src={variantImage}
                  layout="fill"
                  alt={variant.product.title}
                  loading="lazy"
                />
              </div>
              <div className="flex justify-between p-4">
                <div className="font-medium">
                  <h2 className="text-lg">{variant.product.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {variant.productType}
                  </p>
                </div>
                <div>
                  <Badge className="text-sm" variant={"secondary"}>
                    {formatPrice(variant.product.price)}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
