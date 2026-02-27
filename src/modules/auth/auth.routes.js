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
  updateMeSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router
  .route("/me")
  .get(protect, authController.getMe)
  .patch(protect, validate(updateMeSchema), authController.updateMe)
  .delete(protect, authController.deactivateMe);

router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);

router.patch("/reset-password/:token", validate(resetPasswordSchema), authController.resetPassword);

router.patch(
  "/update-password",
  protect,
  validate(updatePasswordSchema),
  authController.updatePassword,
);

export default router;
