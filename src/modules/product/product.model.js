import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required!"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required!"],
      min: [0, "Price cannot be negative!"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model("Product", productSchema);
