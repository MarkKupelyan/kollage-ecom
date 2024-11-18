"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const categories = [
  { name: "Ring", tag: "rings", subcategories: ["Enamel", "Stones"] },
  { name: "Bracelet", tag: "bracelet", subcategories: ["Enamel", "Stones"] },
  { name: "Necklace", tag: "necklaces", subcategories: ["Enamel", "Stones"] },
  { name: "Earrings", tag: "earrings", subcategories: ["Enamel", "Stones"] },
];

const CategoryLinks = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null); // Collapse if already expanded
    } else {
      setExpandedCategory(categoryName); // Expand selected category
    }
  };

  return (
    <div>
      {/* Mobile View (Dropdown functionality only for mobile screens) */}
      <div className="md:hidden">
        <ul className="space-y-4 px-4">
          {categories.map((category) => (
            <li key={category.name}>
              <div
                onClick={() => toggleCategory(category.name)}
                className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-800 p-3 rounded-lg shadow-sm hover:bg-gray-200"
              >
                <Link href={`/list?page&tag=${category.tag}`}>
                  {category.name}
                </Link>
                <ChevronDownIcon
                  className={`ml-2 w-4 transition-transform ${
                    expandedCategory === category.name ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </div>
              {expandedCategory === category.name && (
                <ul className="mt-2 ml-4 space-y-2">
                  {category.subcategories.map((subcategory, index) => (
                    <li
                      key={index}
                      className="text-xs text-gray-600 pl-2 hover:bg-gray-100 p-2 rounded-md"
                    >
                      <Link
                        href={`/list?page&tag=${
                          category.tag
                        }&subcategory=${subcategory.toLowerCase()}`}
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

      {/* Desktop View (Hover to show subcategories) */}
      <div className="hidden md:flex gap-4 md:space-x-8 px-4 md:px-14">
        {categories.map((category) => (
          <div key={category.name} className="relative group">
            <Link
              href={`/list?page&tag=${category.tag}`}
              className="text-sm font-semibold text-gray-800 p-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {category.name}
            </Link>

            {/* Subcategories Dropdown on Hover */}
            <div className="absolute left-0 mt-1 hidden group-hover:block bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-2">
                {category.subcategories.map((subcategory, index) => (
                  <li
                    key={index}
                    className="whitespace-nowrap text-sm text-gray-700 hover:bg-gray-100 px-4 py-2"
                  >
                    <Link
                      href={`/list?page&tag=${
                        category.tag
                      }&subcategory=${subcategory.toLowerCase()}`}
                    >
                      {subcategory}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryLinks;
