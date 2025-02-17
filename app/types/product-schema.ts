import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  description: z.string().min(40, {
    message: "Description must be at least 40 characters long",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive({ message: "Price must be a positive number" }),
  stock_quantity: z.number().int().nonnegative({
    message: "Stock quantity must be a non-negative integer",
  }),
  material: z.string().min(2, {
    message: "Material must be at least 2 characters long",
  }),
  stone: z.string().optional(),
  color: z.string().min(2, {
    message: "Color must be at least 2 characters long",
  }),
  collection: z.string().optional(),
  size: z.string().optional(),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters long",
  }),
  productType: z.string().min(2, {
    message: "Product type must be at least 2 characters long",
  }),
});

export type zProductSchema = z.infer<typeof ProductSchema>;
