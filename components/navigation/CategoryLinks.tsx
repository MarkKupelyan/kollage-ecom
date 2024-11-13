// CategoryLinks.tsx

import Link from "next/link";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const categories = [
  { name: "Ring", tag: "rings", subcategories: ["Enamel", "Stones"] },
  { name: "Bracelet", tag: "bracelet", subcategories: ["Enamel", "Stones"] },
  { name: "Necklace", tag: "necklaces", subcategories: ["Enamel", "Stones"] },
  { name: "Earrings", tag: "earrings", subcategories: ["Enamel", "Stones"] },
];

const CategoryLinks = () => {
  return (
    <ul className="flex gap-0 px-14">
      {categories.map((category) => (
        <li key={category.name} className="relative group ">
          <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="flex items-center cursor-pointer text-sm font-semibold text-gray-800 transition-colors duration-200 group-hover:bg-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md">
                <Link href={`/list?page&tag=${category.tag}`}>
                  {category.name}
                </Link>
                <ChevronDownIcon
                  className="ml-1 w-4 transition-transform duration-200 group-hover:rotate-180"
                  aria-hidden="true"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              sideOffset={0}
              className="mt-1 bg-white shadow-lg rounded-md p-4 transition-all duration-150 ease-in-out"
              aria-label={`Subcategories for ${category.name}`}
            >
              <ul className="space-y-2">
                {category.subcategories.map((subcategory, index) => (
                  <li
                    key={index}
                    className="text-xs text-gray-600 hover:bg-gray-100 transition-colors p-2 rounded-md"
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
            </HoverCardContent>
          </HoverCard>
        </li>
      ))}
    </ul>
  );
};

export default CategoryLinks;
