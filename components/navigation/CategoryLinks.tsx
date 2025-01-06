"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const categories = [
  {
    name: "Ring",
    tag: "rings",
    subcategories: [
      "Enamel",
      "Fluorite",
      "Bismuth",
      "Amethyst",
      "Quartz",
      "Malachite",
    ],
  },
  {
    name: "Bracelet",
    tag: "bracelet",
    subcategories: [
      "Enamel",
      "Fluorite",
      "Bismuth",
      "Amethyst",
      "Quartz",
      "Malachite",
    ],
  },
  {
    name: "Necklace",
    tag: "necklaces",
    subcategories: [
      "Enamel",
      "Fluorite",
      "Bismuth",
      "Amethyst",
      "Quartz",
      "Malachite",
    ],
  },
  {
    name: "Earrings",
    tag: "earrings",
    subcategories: [
      "Enamel",
      "Fluorite",
      "Bismuth",
      "Amethyst",
      "Quartz",
      "Malachite",
    ],
  },
];

const CategoryLinks = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory((prev) =>
      prev === categoryName ? null : categoryName
    );
  };

  return (
    <div className="flex gap-6">
      {/* Desktop View */}
      <nav className="hidden md:flex gap-4 px-4 md:px-14">
        {categories.map((category) => (
          <div key={category.name} className="relative group">
            <Link
              href={`/list?page&tag=${category.tag}`}
              className="text-base font-semibold text-gray-800 p-3 rounded-lg hover:bg-gray-200 transition-colors"
              prefetch={false}
            >
              {category.name}
            </Link>
            {/* Hover Dropdown */}
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border border-gray-200 rounded-md shadow-lg z-10 w-[400px]">
              <ul className="grid grid-cols-3 gap-2 p-4">
                {category.subcategories.map((subcategory, index) => (
                  <li
                    key={index}
                    className="text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                  >
                    <Link
                      href={`/list?page&tag=${
                        category.tag
                      }&subcategory=${subcategory.toLowerCase()}`}
                      prefetch={false}
                    >
                      {subcategory}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </nav>

      {/* Mobile View */}
      <div className="md:hidden">
        <ul className="space-y-4 px-4">
          {categories.map((category) => (
            <li key={category.name}>
              <button
                onClick={() => toggleCategory(category.name)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 p-3 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-expanded={expandedCategory === category.name}
              >
                <span>{category.name}</span>
                <ChevronDownIcon
                  className={`w-4 transition-transform ${
                    expandedCategory === category.name ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {expandedCategory === category.name && (
                <ul className="mt-2 grid grid-cols-2 gap-2 px-4">
                  {category.subcategories.map((subcategory, index) => (
                    <li
                      key={index}
                      className="text-xs text-gray-600 hover:bg-gray-100 p-2 rounded-md"
                    >
                      <Link
                        href={`/list?page&tag=${
                          category.tag
                        }&subcategory=${subcategory.toLowerCase()}`}
                        prefetch={false}
                      >
                        {subcategory}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryLinks;
