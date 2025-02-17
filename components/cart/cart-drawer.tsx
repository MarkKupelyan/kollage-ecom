"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import CartItems from "./cart-items";
import CartMessage from "./cart-message";
import Payment from "./payment";
import OrderConfirmed from "./order-confirmed";
import CartProgress from "./cart-progress";

export default function CartDrawer() {
  const { cart, checkoutProgress, setCheckoutProgress, cartOpen, setCartOpen } =
    useCartStore();
  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
        <div className="relative">
          <ShoppingBag className="w-6 h-6 text-black" />
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-2 -right-2 w-5 h-5 bg-[#4e342e] text-white text-xs font-bold rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </DrawerTrigger>
      <DrawerContent className="fixed bottom-0 left-0 right-0 h-[95vh] bg-[#fcf9f7]">
        <DrawerHeader className="relative">
          <DrawerTitle className="sr-only">Nákupní košík</DrawerTitle>
          <button
            onClick={() => setCartOpen(false)}
            className="absolute right-4 top-4 p-2 hover:bg-[#faf3e0] rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-[#4e342e]" />
          </button>
          <CartMessage />
        </DrawerHeader>
        <CartProgress />
        <div className="overflow-y-auto p-4 max-h-[calc(95vh-200px)]">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
          {checkoutProgress === "confirmation-page" && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
