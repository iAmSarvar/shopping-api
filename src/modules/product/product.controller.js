import { catchAsync } from "../../utils/catchAsync.js";
import productService from "./product.service.js";
import { AppError } from "../../utils/AppError.js";

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    status: "success",
    data: product,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const { items, meta } = await productService.getAllProducts(req.query);

  res.status(200).json({
    status: "success",
    meta,
    results: items.length,
    data: items,
  });
});

const getProduct = catchAsync(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) return next(new AppError("Product not found!", 404));

  res.status(200).json({
    status: "success",
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const product = await productService.updateProductById(req.params.id, req.body);

  if (!product) return next(new AppError("Product not found!", 404));

  res.status(200).json({
    status: "success",
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await productService.deleteProductById(req.params.id);

  if (!product) return next(new AppError("Product not found", 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export default { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct };
