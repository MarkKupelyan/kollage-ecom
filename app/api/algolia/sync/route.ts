import { NextResponse } from "next/server";
import { syncProductsToAlgolia } from "@/lib/algolia-client";
import { db } from "@/server";

export async function POST(req: Request) {
  try {
    // Ověření API klíče pro zabezpečení
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.ALGOLIA_SYNC_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Načtení dat pro Algolii
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
