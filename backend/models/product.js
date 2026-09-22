import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Chairs", "Sofas", "Wardrobes", "Tables", "Doors", "Interiors"],
      default: "Chairs",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      default: "100% Solid Teak Wood",
    },
    tag: {
      type: String,
      default: "Handcrafted",
    },
    description: {
      type: String,
      default: "Handcrafted in solid teakwood with traditional mortise & tenon joinery.",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

