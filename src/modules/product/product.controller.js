import { catchAsync } from "../../utils/catchAsync.js";

const listProducts = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "list products",
  });
});

const createProduct = catchAsync(async (req, res) => {
  res.status(201).json({
    status: "success",
    message: "create product",
  });
});

export default { listProducts, createProduct };
