import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is mandatory"],
      trim: true,
      maxLength: [120, "Product name should be less than 120 Chars"],
    },
    price: {
      type: Number,
      required: [true, "Product price is mandatory"],
      maxLength: [5, "Product price should be less than 5 digits"],
    },
    description: {
      type: String,

      // use some form of editor - personal assignment
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    collectionID: {
      ref: "Collection",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
