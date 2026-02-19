const listProducts = async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "list products",
  });
};

const createProduct = async (req, res) => {
  res.status(201).json({
    status: "success",
    message: "create product",
  });
};

export default { listProducts, createProduct };
