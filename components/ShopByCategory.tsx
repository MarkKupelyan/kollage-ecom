import React from "react";
import Image from "next/image";
import Link from "next/link";

const ShopByCategory = () => {
  const categories = [
    {
      name: "RINGS",
      image: "/01.jpg",
      tag: "rings",
      womenLink: "/list?page&tag=rings",
      menLink: "/list?page&tag=rings",
    },
    {
      name: "BRACELETS",
      image: "/02.jpg",
      tag: "bracelet",
      womenLink: "/list?page&tag=bracelet",
      menLink: "/list?page&tag=bracelet",
    },
    {
      name: "NECKLACES",
      image: "/05.jpg",
      tag: "necklaces",
      womenLink: "/list?page&tag=necklaces",
      menLink: "/list?page&tag=necklaces",
    },
    {
      name: "AMULETS & CHARMS",
      image: "/vlt.jpg",
      tag: "pendants",
      womenLink: "/list?page&tag=pendants",
      menLink: "/list?page&tag=pendants",
    },
    {
      name: "EARRINGS",
      image: "/vlt.jpg",
      tag: "earrings",
      womenLink: "/list?page&tag=earrings",
      menLink: "/list?page&tag=earrings",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto">
        <h2 className="text-center text-2xl tracking-widest font-light mb-8">
          SHOP BY CATEGORY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1.5 w-[100%] ">
          {categories.map((category) => (
            <div key={category.name} className="group relative overflow-hidden">
              <Link href={`/list?page&tag=${category.tag}`} className="block">
                <div className="absolute top-0 left-0 right-0 z-10 p-8 bg-gradient-to-b from-[#f8f8f8] via-[#f0f0f0] to-transparent">
                  <h3 className="text-center text-base font-heading">
                    {category.name}
                  </h3>
                </div>
                <div className="relative aspect-[5/6] bg-gray-100">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                  />
                </div>
              </Link>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex justify-center gap-6">
                  <Link
                    href={category.womenLink}
                    className="text-xs tracking-widest hover:text-gray-600 transition-colors uppercase relative group"
                  >
                    <span>Shop Women&apos;s</span>
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-black"></span>
                  </Link>
                  <Link
                    href={category.menLink}
                    className="text-xs tracking-widest hover:text-gray-600 transition-colors uppercase relative group"
                  >
                    <span>Shop Men&apos;s</span>
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-black"></span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
