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

export default function CartItems() {
  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore();

  // Promo kód a stav pro validaci
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [hasTriedPromo, setHasTriedPromo] = useState(false);

  // Funkce pro ověření promo kódu
  const validatePromoCode = () => {
    setHasTriedPromo(true); // Nastaví stav, že uživatel zkusil použít promo kód
    const trimmedCode = promoCode.trim().toUpperCase(); // Ořízne mezery a převede na velká písmena
    if (trimmedCode === "SLEVA10") {
      setIsPromoValid(true);
    } else {
      setIsPromoValid(false);
    }
  };

  const totalPrice = useMemo(() => {
    const baseTotal = cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);

    // Apply 10% discount if the total is above $120
    const discountedTotal = baseTotal > 140 ? baseTotal * 0.9 : baseTotal;

    // Apply additional promo code discount if valid
    return isPromoValid ? discountedTotal * 0.9 : discountedTotal;
  }, [cart, isPromoValid]);

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter, id: createId() };
    });
  }, [totalPrice]);

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
              {cart.map((item) => (
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
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
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
      {/* Promo kód sekce */}
      <div className="promo-code-section my-4 relative flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
          className="px-4 py-2 rounded-md border border-[#4e342e]/20 focus:outline-none focus:border-[#4e342e] flex-1 transition-all"
        />
        <Button
          className="bg-[#4e342e] text-white px-6 py-2 rounded-md hover:bg-[#3e2723] transition-colors"
          onClick={validatePromoCode}
        >
          Apply
        </Button>
        {/* Zobrazení zprávy až po kliknutí na tlačítko */}
        {hasTriedPromo && (
          <div
            className="mt-2 absolute top-full left-0"
            style={{ minHeight: "20px", lineHeight: "20px" }} // Pevná výška pro rezervaci místa
          >
            {isPromoValid ? (
              <p className="text-green-600 text-xs">10% discount applied!</p>
            ) : (
              <p className="text-red-600">
                The code you have entered is not valid or has been deactivated.
              </p>
            )}
          </div>
        )}
      </div>
      {/* Celková cena */}
      <motion.div className="flex items-center justify-center relative my-4 overflow-hidden">
        <span className="text-md py-8">Total: $</span>
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
        className="w-full bg-[#4e342e] text-white py-3 rounded-lg"
        onClick={() => {
          setCheckoutProgress("payment-page");
        }}
        disabled={cart.length === 0}
      >
        Checkout
      </Button>
    </motion.div>
  );
}
