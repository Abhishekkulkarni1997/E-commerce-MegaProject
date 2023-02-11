import mongoose from "mongoose";
import Order_Status from "../utils/orderStatus";

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          productID: {
            ref: "Product",
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          count: Number,
          price: Number,
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coupon: String,
    transcationId: String,
    status: {
      type: String,
      enum: Object.values(Order_Status),
      default: Order_Status.ORDERED,
    },

    // Payment : UPI, credit card, wallet COD
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
