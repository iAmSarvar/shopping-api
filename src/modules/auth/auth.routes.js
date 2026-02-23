import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { registerSchema } from "./auth.validation.js";
import authController from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

export default router;
