"use server";

import { createOrderSchema } from "@/app/types/order-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "@/server";
import { orderProduct, orders, products } from "../schema";
import { eq } from "drizzle-orm";

const action = createSafeActionClient();

export const createOrder = action(
  createOrderSchema,
  async ({ products: orderProducts, status, total, paymentIntentID }) => {
    const user = await auth();
    if (!user) return { error: "user not found" };

    // Kontrola dostupnosti zásob
    for (const item of orderProducts) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productID),
      });
      if (!product) {
        return { error: `Product with ID ${item.productID} not found` };
      }
      if (product.stock_quantity < item.quantity) {
        return {
          error: `Not enough stock for product ${product.title}. Available: ${product.stock_quantity}, requested: ${item.quantity}`,
        };
      }
    }

    // Vytvoření objednávky, ale NE aktualizace zásob
    const order = await db
      .insert(orders)
      .values({
        status,
        paymentIntentID,
        total,
        userID: user.user.id,
      })
      .returning();

    // Vytvoření položek objednávky (bez změny zásob)
    for (const item of orderProducts) {
      await db.insert(orderProduct).values({
        quantity: item.quantity,
        orderID: order[0].id,
        productID: item.productID,
        productVariantID: item.variantID,
      });
    }

    // Zde by měl proběhnout proces platby (např. přes Stripe, PayPal, atd.)
    const paymentSuccessful = true; // Toto je jen příklad. Použij skutečnou kontrolu platby.

    if (paymentSuccessful) {
      // Pokud je platba úspěšná, aktualizuj zásoby
      for (const item of orderProducts) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, item.productID),
        });

        if (!currentProduct) {
          return {
            error: `Product with ID ${item.productID} not found during update`,
          };
        }
        console.log(
          `Updating stock for ${currentProduct.title}. Current stock: ${currentProduct.stock_quantity}. Quantity to subtract: ${item.quantity}`
        );

        await db
          .update(products)
          .set({
            stock_quantity: currentProduct.stock_quantity - item.quantity,
          })
          .where(eq(products.id, item.productID));
        console.log(
          `New stock for ${currentProduct.title}: ${
            currentProduct.stock_quantity - item.quantity
          }`
        );
      }

      return { success: "Order has been added and stock updated" };
    } else {
      // Pokud platba selže, vrať chybovou zprávu
      return { error: "Payment failed, order was not processed" };
    }
  }
);
