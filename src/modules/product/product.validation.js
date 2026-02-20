import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name too long"),
  description: z.string().trim().optional(),
  price: z.number().min(0, "Price cannot be negative"),
  category: z.string().trim().min(1, "Category is required"),
  stock: z.number().int().min(0, "Stock cannot be negative").default(0),
  images: z.array(z.string().url("Image must be a valid URL")).optional(),
  isActive: z.boolean().optional(),
});

const updateProductSchema = createProductSchema.partial();

export { createProductSchema, updateProductSchema };
