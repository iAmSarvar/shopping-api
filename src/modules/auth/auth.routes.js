import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import authController from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

export default router;
