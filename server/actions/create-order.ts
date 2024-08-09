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

    const order = await db
      .insert(orders)
      .values({
        status,
        paymentIntentID,
        total,
        userID: user.user.id,
      })
      .returning();

    // Vytvoření položek objednávky a aktualizace množství na skladě
    for (const item of orderProducts) {
      await db.insert(orderProduct).values({
        quantity: item.quantity,
        orderID: order[0].id,
        productID: item.productID,
        productVariantID: item.variantID,
      });

      // Získání aktuálního množství na skladě
      const currentProduct = await db.query.products.findFirst({
        where: eq(products.id, item.productID),
      });

      // Kontrola, zda currentProduct není undefined
      if (!currentProduct) {
        return {
          error: `Product with ID ${item.productID} not found during update`,
        };
      }

      // Aktualizace množství na skladě
      await db
        .update(products)
        .set({ stock_quantity: currentProduct.stock_quantity - item.quantity })
        .where(eq(products.id, item.productID));
    }

    return { success: "Order has been added" };
  }
);
