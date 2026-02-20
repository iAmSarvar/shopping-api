import express from "express";
import productController from "./product.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createProductSchema, updateProductSchema } from "./product.validation.js";

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(validate(createProductSchema), productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(validate(updateProductSchema), productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
