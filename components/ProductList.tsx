import Image from "next/image";
import Link from "next/link";

const PRODUCT_PER_PAGE = 8;

const ProductList = () => {
  return (
    <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {Array.from({ length: PRODUCT_PER_PAGE }).map((_, index) => (
        <Link
          key={index}
          href="/"
          className="w-full max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px] flex flex-col gap-4"
        >
          <div className="relative w-full h-40 sm:h-56 md:h-64 rounded-md overflow-hidden">
            <Image
              src="/almaz.png"
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
            />
            <Image
              src="/almaz2.png"
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
            />
          </div>

          <div className="flex justify-between">
            <span>Product Name</span>
            <span className="text-sm text-gray-500">Description</span>
          </div>
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
            Add to Cart
          </button>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
