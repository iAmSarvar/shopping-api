import { Product } from "../product/product.model.js";

function buildFilter(query) {
  const filter = {};

  if (query.category) filter.category = query.category;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  return filter;
}

function parseSort(sort) {
  if (!sort) return { createdAt: -1 };

  return sort.split(",").reduce((acc, field) => {
    const f = field.trim();
    if (!f) return acc;
    acc[f.startsWith("-") ? f.slice(1) : f] = f.startsWith("-") ? -1 : 1;
    return acc;
  }, {});
}

function parseSelect(fields) {
  if (!fields) return null;

  return fields.split(",").reduce((acc, field) => {
    const f = field.trim();
    if (f) acc[f] = 1;
    return acc;
  }, {});
}

const createProduct = async (data) => {
  return Product.create(data);
};

const getAllProducts = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = buildFilter(query);
  const sort = parseSort(query.sort);
  const select = parseSelect(query.fields);

  const findQuery = Product.find(filter).sort(sort).skip(skip).limit(limit);
  if (select) findQuery.select(select);

  const [items, total] = await Promise.all([findQuery, Product.countDocuments(filter)]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
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
