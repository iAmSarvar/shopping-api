import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name too long"),
  email: z.string().trim().email("Email must be valid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export { registerSchema };
