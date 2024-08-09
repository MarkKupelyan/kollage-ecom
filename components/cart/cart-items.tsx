"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { useCartStore } from "@/lib/client-store";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import formatPrice from "@/lib/format-price";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";
import Lottie from "lottie-react";
import emptyCart from "@/public/empty-box.json";
import { createId } from "@paralleldrive/cuid2";
import { Button } from "../ui/button";
import { toast } from "react-toastify"; // Import pro zobrazení zpráv
import { createOrder } from "@/server/actions/create-order"; // Správný import createOrder

// Definice typu pro CartItem
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  stock_quantity: number; // Přidání vlastnosti stock_quantity
  variant: {
    quantity: number;
    variantID: number;
  };
}

export default function CartItems() {
  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore();
  const [loading, setLoading] = useState(false); // Přidání stavu pro načítání
  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter, id: createId() };
    });
  }, [totalPrice]);

  // Funkce pro přidání produktu do košíku s kontrolou zásob
  const handleAddToCart = async (item: CartItem) => {
    if (item.stock_quantity <= 0) {
      toast.error("This product is out of stock.");
      return;
    }
    addToCart({
      ...item,
      variant: {
        quantity: 1,
        variantID: item.variant.variantID,
      },
    });
  };

  // Funkce pro zpracování objednávky
  const handleCheckout = async () => {
    setLoading(true);
    const orderData = {
      userID: "currentUserID", // replace with actual user ID
      total: totalPrice,
      status: "pending",
      receiptURL: "",
      paymentIntentID: "",
      products: cart.map((item) => ({
        productID: item.id,
        quantity: item.variant.quantity,
        variantID: item.variant.variantID,
      })),
    };

    // Kontrola skladových zásob před platbou
    const stockCheckResponse = await createOrder(orderData);
    if (stockCheckResponse.data?.error) {
      setLoading(false);
      toast.error(stockCheckResponse.data.error);
      return;
    }

    // Pokud jsou zásoby v pořádku, přesměrujeme uživatele na stránku platby
    setCheckoutProgress("payment-page");
    setLoading(false);
  };

  return (
    <motion.div className="flex flex-col items-center">
      {cart.length === 0 && (
        <div className="flex-col w-full flex items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl text-muted-foreground text-center">
              Your cart is empty
            </h2>
            <Lottie className="h-64" animationData={emptyCart} />
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="max-h-80 w-full  overflow-y-auto">
          <Table className="max-w-2xl mx-auto">
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item: CartItem) => (
                <TableRow key={(item.id + item.variant.variantID).toString()}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        width={48}
                        height={48}
                        src={item.image}
                        alt={item.name}
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between ">
                      <MinusCircle
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        size={14}
                      />
                      <p className="text-md font-bold">
                        {item.variant.quantity}
                      </p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() => handleAddToCart(item)}
                        size={14}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <motion.div className="flex items-center justify-center relative my-4 overflow-hidden">
        <span className="text-md">Total: $</span>
        <AnimatePresence mode="popLayout">
          {priceInLetters.map((letter, i) => (
            <motion.div key={letter.id}>
              <motion.span
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ delay: i * 0.1 }}
                className="text-md inline-block"
              >
                {letter.letter}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <Button
        onClick={handleCheckout} // Přidání funkce handleCheckout
        className="max-w-md w-full"
        disabled={cart.length === 0 || loading} // Zakázat tlačítko při načítání
      >
        {loading ? "Processing..." : "Checkout"}
      </Button>
    </motion.div>
  );
}
