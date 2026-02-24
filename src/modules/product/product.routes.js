import express from "express";
import productController from "./product.controller.js";
import { validate } from "../../middlewares/validate.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { createProductSchema, updateProductSchema } from "./product.validation.js";
import { listProductsQuerySchema } from "./product.query.validation.js";
import { protect, restrictTo } from "../auth/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateQuery(listProductsQuerySchema), productController.getAllProducts)
  .post(
    protect,
    restrictTo("admin"),
    validate(createProductSchema),
    productController.createProduct,
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    protect,
    restrictTo("admin"),
    validate(updateProductSchema),
    productController.updateProduct,
  )
  .delete(protect, restrictTo("admin"), productController.deleteProduct);

export default router;
