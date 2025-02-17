"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Slide } from "@/components/ui/slide";
import { ChevronDown, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "./ui/slider";
import { Badge } from "@/components/ui/badge";
import formatPrice from "@/lib/format-price";

interface FilterProps {
  onProductsUpdate: (products: any[]) => void;
}

export default function Filter({ onProductsUpdate }: FilterProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("newest");
  const [activeFilters, setActiveFilters] = useState({
    material: "",
    priceRange: [0, 1000] as [number, number],
    color: "",
    stone: "",
    category: "",
    size: "",
    collection: "",
  });
  const [resultsCount, setResultsCount] = useState(387);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Načtení filtrů z localStorage při inicializaci
  useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      setActiveFilters(JSON.parse(savedFilters));
    }
  }, []);

  // Uložení filtrů do localStorage při změně a volání API
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(activeFilters));
    fetchFilteredProducts();
  }, [activeFilters]);

  const fetchFilteredProducts = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();

      Object.entries(activeFilters).forEach(([key, value]) => {
        if (key === "priceRange") {
          const [min, max] = value as [number, number];
          if (min > 0) queryParams.set("minPrice", min.toString());
          if (max < 1000) queryParams.set("maxPrice", max.toString());
        } else if (value && typeof value === "string") {
          queryParams.set(key, value);
        }
      });

      const response = await fetch(
        `/api/product/filter?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch filtered products");
      }

      const data = await response.json();
      setResultsCount(data.length);
      onProductsUpdate(data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      material: "",
      priceRange: [0, 1000],
      color: "",
      stone: "",
      category: "",
      size: "",
      collection: "",
    });
  };

  const removeFilter = (key: keyof typeof activeFilters) => {
    if (key === "priceRange") {
      setActiveFilters({ ...activeFilters, [key]: [0, 1000] });
    } else {
      setActiveFilters({ ...activeFilters, [key]: "" });
    }
  };

  // Efekt pro zakázání scrollování na <body> při otevření menu
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFilterOpen]);

  const filterOptions = {
    color: [
      { name: "Gold", count: 155 },
      { name: "Silver", count: 80 },
      { name: "Rose Gold", count: 18 },
      { name: "Black", count: 25 },
      { name: "White", count: 33 },
    ],
    stone: [
      { name: "Diamond", count: 245 },
      { name: "Ruby", count: 42 },
      { name: "Sapphire", count: 38 },
      { name: "Emerald", count: 29 },
      { name: "Pearl", count: 56 },
    ],
    category: [
      { name: "Rings", count: 187 },
      { name: "Necklaces", count: 145 },
      { name: "Earrings", count: 167 },
      { name: "Bracelets", count: 98 },
      { name: "Watches", count: 45 },
    ],
    size: [
      { name: "XS", count: 45 },
      { name: "S", count: 78 },
      { name: "M", count: 156 },
      { name: "L", count: 89 },
      { name: "XL", count: 34 },
    ],
    collection: [
      { name: "Summer 2024", count: 89 },
      { name: "Classic", count: 167 },
      { name: "Modern Art", count: 78 },
      { name: "Vintage", count: 123 },
      { name: "Limited Edition", count: 45 },
    ],
  };

  // Funkce pro změnu řazení
  const handleSortChange = (value: string) => {
    setSortOption(value);
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("sort", value);
    router.push(`?${currentParams.toString()}`);
    setIsSortOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 transition-opacity"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Desktop a mobilní filter menu */}
      <div
        className={`
          fixed inset-0 bg-white z-50
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          lg:w-1/3
        `}
      >
        {/* Horní lišta */}
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white">
          <span className="text-base font-normal tracking-[0.1em]">FILTRY</span>
          <button onClick={() => setIsFilterOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Aktivní filtry */}
        {Object.entries(activeFilters).some(
          ([key, value]) =>
            (key === "priceRange" &&
              Array.isArray(value) &&
              (value[0] > 0 || value[1] < 1000)) ||
            (key !== "priceRange" && value)
        ) && (
          <div className="px-6 py-4 border-b">
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (key === "priceRange") {
                  const [min, max] = value as [number, number];
                  if (min > 0 || max < 1000) {
                    return (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {formatPrice(min)} - {formatPrice(max)}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() =>
                            removeFilter(key as keyof typeof activeFilters)
                          }
                        />
                      </Badge>
                    );
                  }
                } else if (value) {
                  return (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {value}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          removeFilter(key as keyof typeof activeFilters)
                        }
                      />
                    </Badge>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Obsah filtrů */}
        <div className="overflow-y-auto h-[calc(100vh-120px)] lg:h-[calc(100vh-180px)]">
          <div className="divide-y border-b">
            {/* Material */}
            <div className="px-6 py-4">
              <button
                onClick={() => toggleSection("material")}
                className="flex items-center justify-between w-full"
              >
                <span className="text-sm tracking-[0.1em] font-normal">
                  MATERIÁL
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSection === "material" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "material" && (
                <div className="mt-4 space-y-3">
                  {[
                    { name: "Aluminum", count: "18" },
                    { name: "Mixed Metals", count: "79" },
                    { name: "Rose Gold", count: "18" },
                    { name: "Sterling Silver", count: "80" },
                    { name: "Titanium", count: "2" },
                    { name: "White Gold", count: "33" },
                    { name: "Yellow Gold", count: "155" },
                  ].map((material) => (
                    <button
                      key={material.name}
                      onClick={() =>
                        setActiveFilters({
                          ...activeFilters,
                          material: material.name,
                        })
                      }
                      className={`block w-full text-left text-sm hover:opacity-70 ${
                        activeFilters.material === material.name
                          ? "font-semibold"
                          : ""
                      }`}
                    >
                      {material.name} ({material.count})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="px-6 py-4">
              <button
                onClick={() => toggleSection("price")}
                className="flex items-center justify-between w-full"
              >
                <span className="text-sm tracking-[0.1em] font-normal">
                  CENA
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSection === "price" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "price" && (
                <div className="mt-6 px-2">
                  <Slider
                    defaultValue={activeFilters.priceRange}
                    max={1000}
                    step={10}
                    onValueChange={(value: [number, number]) =>
                      setActiveFilters({
                        ...activeFilters,
                        priceRange: value,
                      })
                    }
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span>{formatPrice(activeFilters.priceRange[0])}</span>
                    <span>{formatPrice(activeFilters.priceRange[1])}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Color */}
            <div className="px-6 py-4">
              <button
                onClick={() => toggleSection("color")}
                className="flex items-center justify-between w-full"
              >
                <span className="text-sm tracking-[0.1em] font-normal">
                  BARVA
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSection === "color" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "color" && (
                <div className="mt-4 space-y-2">
                  {filterOptions.color.map((item) => (
                    <button
                      key={item.name}
                      onClick={() =>
                        setActiveFilters({ ...activeFilters, color: item.name })
                      }
                      className={`block w-full text-left text-sm hover:opacity-70 ${
                        activeFilters.color === item.name ? "font-semibold" : ""
                      }`}
                    >
                      {item.name} ({item.count})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stone */}
            <div className="px-6 py-4">
              <button
                onClick={() => toggleSection("stone")}
                className="flex items-center justify-between w-full"
              >
                <span className="text-sm tracking-[0.1em] font-normal">
                  KÁMEN
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSection === "stone" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "stone" && (
                <div className="mt-4 space-y-2">
                  {filterOptions.stone.map((item) => (
                    <button
                      key={item.name}
                      onClick={() =>
                        setActiveFilters({ ...activeFilters, stone: item.name })
                      }
                      className={`block w-full text-left text-sm hover:opacity-70 ${
                        activeFilters.stone === item.name ? "font-semibold" : ""
                      }`}
                    >
                      {item.name} ({item.count})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="px-6 py-4">
              <button
                onClick={() => toggleSection("category")}
                className="flex items-center justify-between w-full"
              >
                <span className="text-sm tracking-[0.1em] font-normal">
                  KATEGORIE
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSection === "category" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "category" && (
                <div className="mt-4 space-y-2">
                  {filterOptions.category.map((item) => (
                    <button
                      key={item.name}
                      onClick={() =>
                        setActiveFilters({
                          ...activeFilters,
                          category: item.name,
                        })
                      }
                      className={`block w-full text-left text-sm hover:opacity-70 ${
                        activeFilters.category === item.name
                          ? "font-semibold"
                          : ""
                      }`}
                    >
                      {item.name} ({item.count})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Collection */}
            <div className="px-6 py-4">
              <button
                onClick={() => toggleSection("collection")}
                className="flex items-center justify-between w-full"
              >
                <span className="text-sm tracking-[0.1em] font-normal">
                  KOLEKCE
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSection === "collection" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "collection" && (
                <div className="mt-4 space-y-2">
                  {filterOptions.collection.map((item) => (
                    <button
                      key={item.name}
                      onClick={() =>
                        setActiveFilters({
                          ...activeFilters,
                          collection: item.name,
                        })
                      }
                      className={`block w-full text-left text-sm hover:opacity-70 ${
                        activeFilters.collection === item.name
                          ? "font-semibold"
                          : ""
                      }`}
                    >
                      {item.name} ({item.count})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patička */}
        <div className="border-t px-6 py-4 flex justify-between items-center bg-white sticky bottom-0">
          <button
            onClick={clearAllFilters}
            className="text-sm tracking-[0.1em] font-normal border border-black px-8 py-3"
          >
            VYMAZAT VŠE
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="bg-black text-white px-8 py-3 text-sm tracking-[0.1em] font-normal"
          >
            ZOBRAZIT VÝSLEDKY ({resultsCount})
          </button>
        </div>
      </div>

      {/* Filter tlačítko pro desktop i mobil */}
      <div className="sticky top-0 border rounded-2xl overflow-hidden bg-white z-30">
        <div className="flex justify-between items-center px-6 py-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-sm tracking-[0.1em] font-normal"
          >
            FILTRY <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
