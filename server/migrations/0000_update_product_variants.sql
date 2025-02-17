-- Přidání nových sloupců do tabulky productVariants
ALTER TABLE "productVariants" 
  DROP COLUMN IF EXISTS "productType",
  ADD COLUMN IF NOT EXISTS "material" text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "stone" text,
  ADD COLUMN IF NOT EXISTS "category" text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "collection" text,
  ADD COLUMN IF NOT EXISTS "size" text,
  ADD COLUMN IF NOT EXISTS "price" real NOT NULL DEFAULT 0;