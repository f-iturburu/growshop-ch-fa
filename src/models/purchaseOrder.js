import { Schema, model } from "mongoose";

const purchaseOrder = new Schema(
  {
    products: Array,
    userId: String,
    successfulPayment: Boolean,
  },
  {
    timestamps: true,
  }
);

export default model("PurchaseOrder", purchaseOrder);
