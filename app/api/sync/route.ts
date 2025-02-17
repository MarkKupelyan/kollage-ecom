import { NextResponse } from "next/server";
import { syncProductsToAlgolia } from "@/lib/algolia-client";
import { db } from "@/server";

export async function GET() {
  try {
    const variants = await db.query.productVariants.findMany({
      with: {
        product: true,
        variantImages: true,
      },
    });

    const result = await syncProductsToAlgolia(variants);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to sync with Algolia" },
      { status: 500 }
    );
  }
}
