import express from "express";
import productController from "./product.controller.js";

const router = express.Router();

router.route("/").get(productController.getAllProducts).post(productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
