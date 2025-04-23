import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number().superRefine((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "number",
        received: "undefined",
        message: "Product ID is required",
        path: ["id"]
      });
    }
  }),
  title: z.string().min(1, { message: "Title is required and must be a string" }),
  description: z.string().min(1, { message: "Description is required and must be a string" }),
  price: z.number().nonnegative({ message: "Price must be a valid positive number" }),
  discountPercentage: z.number().min(0).max(100, { message: "Discount percentage must be between 0 and 100" }),
  rating: z.number().min(0).max(5, { message: "Rating must be between 0 and 5" }),
  stock: z.number().int().nonnegative({ message: "Stock must be a valid non-negative integer" }),
  brand: z.string().min(1, { message: "Brand is required and must be a string" }),
  category: z.string().min(1, { message: "Category is required and must be a string" }),
  thumbnail: z.string().url({ message: "Thumbnail must be a valid URL" }),
  images: z.array(z.string().url({ message: "Each image must be a valid URL" }))
});

export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive()
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>; 