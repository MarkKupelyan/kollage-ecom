// app/api/product/update-stock.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server";
import { products } from "@/server/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { id, quantity } = await req.json();

    if (!id || quantity === undefined) {
      return new NextResponse(
        JSON.stringify({ message: "Product ID and quantity are required" }),
        { status: 400 }
      );
    }

    // Fetch the current product to check its existence and stock
    const product = await db.query.products.findFirst({
      where: eq(products.id, Number(id)),
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    // Ensure there is enough stock available for the purchase
    if (product.stock_quantity < Number(quantity)) {
      return new NextResponse(
        JSON.stringify({
          message: "Insufficient stock available",
        }),
        { status: 400 }
      );
    }

    // Update the stock quantity (subtracting the purchased quantity)
    await db
      .update(products)
      .set({ stock_quantity: product.stock_quantity - Number(quantity) })
      .where(eq(products.id, Number(id)));

    return new NextResponse(
      JSON.stringify({ message: "Stock quantity updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({
          message: "Failed to update stock quantity",
          error: error.message,
        }),
        { status: 500 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ message: "An unknown error occurred" }),
        { status: 500 }
      );
    }
  }
}
