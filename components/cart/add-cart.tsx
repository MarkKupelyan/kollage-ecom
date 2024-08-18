"use client";

import { useCartStore } from "@/lib/client-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface AddCartProps {
  stockQuantity: number;
  productID: number;
  variantID: number;
  title: string;
  type: string;
  price: number;
  image: string;
  disabled: boolean;
}

export default function AddCart({
  stockQuantity,
  productID,
  variantID,
  title,
  type,
  price,
  image,
  disabled,
}: AddCartProps) {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log("Current Stock Quantity:", stockQuantity); // Debugging line
    if (stockQuantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    toast.success(`Added to your cart!`);
    addToCart({
      id: productID,
      variant: { variantID, quantity },
      name: `${title} ${type}`,
      price,
      image,
      stock_quantity: stockQuantity, // Use the passed stock_quantity
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
          disabled={stockQuantity <= 0} // Disable button if out of stock
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button variant={"secondary"} className="flex-1" disabled>
          Quantity: {quantity}
        </Button>
        <Button
          onClick={() => {
            if (quantity < stockQuantity) {
              setQuantity(quantity + 1);
            }
          }}
          variant={"secondary"}
          className="text-primary"
          disabled={stockQuantity <= 0} // Disable button if out of stock
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={handleAddToCart}
        disabled={disabled} // Pass the 'disabled' prop here
        className={`${disabled ? "cursor-not-allowed opacity-50" : ""}`}
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
