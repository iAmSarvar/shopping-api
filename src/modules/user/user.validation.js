import { z } from "zod";

const updateUserByAdminSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    email: z.string().trim().email().optional(),
    role: z.enum(["user", "admin"]).optional(),
    active: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export { updateUserByAdminSchema };
