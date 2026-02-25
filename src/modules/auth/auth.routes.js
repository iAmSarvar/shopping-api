import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import authController from "./auth.controller.js";
import { protect } from "./auth.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.get("/me", protect, authController.getMe);

router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);

router.patch("/reset-password/:token", validate(resetPasswordSchema), authController.resetPassword);

router.patch(
  "/update-password",
  protect,
  validate(updatePasswordSchema),
  authController.updatePassword,
);

export default router;
