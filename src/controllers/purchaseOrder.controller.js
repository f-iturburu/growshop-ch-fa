import PurchaseOrder from "../models/purchaseOrder.js";
import Cart from "../models/cart.Model.js";
import { LOGIN_ADMIN_TOKEN } from "../config.js";

export const postPurchase = async (req, res) => {
  const { userId, userRoleToken } = req.userToken;
  try {
    let foundCart = await Cart.findOne({ ownerId: userId });

    if (!foundCart) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (foundCart.ownerId !== userId && userRoleToken !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newOrder = await PurchaseOrder.create({
      products: foundCart.products,
      userId: userId,
      successfulPayment: true,
    });

    foundCart.products = [];
    foundCart.totalProducts = 0;
    foundCart.totalPrice = 0;
    await foundCart.save();

    return res.status(201).json({ message: "Succesfully created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getPurchases = async (req, res) => {
  const { userId, userRoleToken } = req.userToken;

  try {
    let foundPurchaseOrder = await PurchaseOrder.find({ userId: userId });
    console.log(foundPurchaseOrder);

    if (!foundPurchaseOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      foundPurchaseOrder[0].userId !== userId &&
      userRoleToken !== LOGIN_ADMIN_TOKEN
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json(foundPurchaseOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
