import { Router } from "express";
import { protect, restrictTo } from "../auth/auth.middleware.js";
import { validate } from "../../middlewares/validate.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { updateUserByAdminSchema } from "./user.validation.js";
import userController from "./user.controller.js";
import { listUsersQuerySchema } from "./user.query.validation.js";

const router = Router();

router.use(protect, restrictTo("admin"));

router.get("/", validateQuery(listUsersQuerySchema), userController.getUsers);
router.get("/:id", userController.getUser);
router.patch("/:id", validate(updateUserByAdminSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
