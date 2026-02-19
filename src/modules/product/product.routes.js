import express from "express";
import productController from "./product.controller.js";

const router = express.Router();

router.route("/").get(productController.listProducts).post(productController.createProduct);

export default router;
