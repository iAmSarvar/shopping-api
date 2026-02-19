import { Product } from "../product/product.model.js";

const createProduct = async (data) => {
  return Product.create(data);
};

const getAllProducts = async () => {
  return Product.find();
};

const getProductById = async (id) => {
  return Product.findById(id);
};

const updateProductById = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteProductById = async (id) => {
  return Product.findByIdAndDelete(id);
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
