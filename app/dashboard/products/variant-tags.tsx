import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { productVariants } from "./productVariants"; // Upravte cestu podle vaší struktury projektu

export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(),
  productVariantId: integer("productVariantId")
    .references(() => productVariants.id)
    .notNull(), // Vztah na tabulku productVariants
  tag: text("tag").notNull(), // Textové pole pro tagy
});
