import { z } from "zod";

const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),

  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),

  sort: z.string().trim().optional(),
  fields: z.string().trim().optional(),
});

export { listProductsQuerySchema };
