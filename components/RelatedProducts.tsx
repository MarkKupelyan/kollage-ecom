import Image from "next/image";
import Link from "next/link";
import formatPrice from "@/lib/format-price";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-center py-4">
        You May Also Like
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group space-y-2"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-900 group-hover:text-slate-800">
                {product.name}
              </h4>
              <p className="text-sm text-gray-700">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
