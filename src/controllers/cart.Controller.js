import Cart from "../models/cart.Model.js";
import Product from "../models/product.Model.js";
import { LOGIN_ADMIN_TOKEN } from "../config.js";

export const deleteItemFromCart = async (req, res) => {
  const { userId, userRoleToken } = req.userToken;
  const { id } = req.params;

  try {
    const foundProduct = await Product.findById(id);
    const foundCart = await Cart.findOne({ ownerId: userId });

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!foundCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (foundCart.ownerId !== userId && userRoleToken !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const productIndex = foundCart.products.findIndex(
      (product) => product._id.toString() === id
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    foundCart.products.splice(productIndex, 1);
    await foundCart.save();

    return res.status(200).json({ message: "Succesfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addItemToCart = async (req, res) => {
  const { userId, userRoleToken } = req.userToken;
  const { id } = req.params;

  try {
    const foundProduct = await Product.findById(id);
    const foundCart = await Cart.findOne({ ownerId: userId });

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!foundCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (foundCart.ownerId !== userId && userRoleToken !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Cart.updateOne(
      { ownerId: userId },
      { $push: { products: foundProduct } }
    );

    return res.status(200).json({ message: "Succesfully added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllProducts = async (req, res) => {
  const { userId, userRoleToken } = req.userToken;

  try {
    const userCart = await Cart.findOne({ ownerId: userId });

    if (userCart.ownerId !== userId && userRoleToken !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    userCart.products = [];
    await userCart.save();

    return res.status(200).json({ message: "Succesfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  const { userId, userRoleToken } = req.userToken;

  try {
    const userCart = await Cart.findOne({ ownerId: userId });

    if (userCart.ownerId !== userId && userRoleToken !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(userCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
