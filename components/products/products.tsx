"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import formatPrice from "@/lib/format-price";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

type ProductTypes = {
  variants: VariantsWithProduct[];
};

export default function Products({ variants }: ProductTypes) {
  const params = useSearchParams();
  const paramTag = params.get("tag");

  const filtered = useMemo(() => {
    if (paramTag && variants) {
      return variants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === paramTag)
      );
    }
    return variants;
  }, [paramTag]);

  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3 px-4">
      {filtered.map((variant) => (
        <Link
          className="py-0 border rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          <div className="relative w-full h-80">
            {" "}
            {/* Zvětšení výšky na h-80 */}
            <Image
              className="object-cover rounded-md"
              src={variant.variantImages[0].url}
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
      ))}
    </main>
  );
}
