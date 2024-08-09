ALTER TABLE "products" ADD COLUMN "stockQuantity" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "quantity";