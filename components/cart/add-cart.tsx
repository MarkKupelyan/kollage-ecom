"use client";

import { useCartStore } from "@/lib/client-store";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";

export default function AddCart() {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const params = useSearchParams();
  const [stockQuantity, setStockQuantity] = useState(0);

  useEffect(() => {
    const id = Number(params.get("id"));
    const productID = Number(params.get("productID"));
    const title = params.get("title") || ""; // Ošetření null hodnoty
    const type = params.get("type") || ""; // Ošetření null hodnoty
    const price = Number(params.get("price") || 0); // Ošetření null hodnoty
    const image = params.get("image") || ""; // Ošetření null hodnoty
    const stock_quantity = parseInt(params.get("stock_quantity") || "0", 10);

    console.log("Stock Quantity from Params:", stock_quantity);

    if (!id || !productID || !title || !type || !price || !image) {
      toast.error("Product not found");
      return redirect("/");
    }

    // Nastavíme správně stock quantity
    setStockQuantity(stock_quantity);
  }, [params]);

  const handleAddToCart = () => {
    if (stockQuantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    toast.success(`Added to your cart!`);
    addToCart({
      id: Number(params.get("productID")),
      variant: { variantID: Number(params.get("id")), quantity },
      name: (params.get("title") || "") + " " + (params.get("type") || ""),
      price: Number(params.get("price") || 0),
      image: params.get("image") || "", // Ošetření null hodnoty
      stock_quantity: stockQuantity, // Přidání stock_quantity do košíku
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
          variant={"secondary"}
          className="text-primary"
          disabled={stockQuantity <= 0} // Deaktivace tlačítka pro snížení množství, pokud je vyprodáno
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button variant={"secondary"} className="flex-1" disabled>
          Quantity: {quantity}
        </Button>
        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
          variant={"secondary"}
          className="text-primary"
          disabled={stockQuantity <= 0} // Deaktivace tlačítka pro zvýšení množství, pokud je vyprodáno
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={handleAddToCart}
        disabled={stockQuantity <= 0} // Tlačítko je deaktivováno, pokud je stock_quantity 0 nebo méně
        className={`${
          stockQuantity <= 0 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        Add to cart
      </Button>
      {stockQuantity <= 0 ? (
        <p className="text-red-500 mt-2">Product is currently out of stock</p>
      ) : (
        <p className="text-green-500 mt-2">In Stock: {stockQuantity} pieces</p>
      )}
    </>
  );
}
