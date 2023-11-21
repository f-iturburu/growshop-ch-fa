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

    const productIndex = foundCart.products.findIndex((product) =>
      product._id.equals(foundProduct._id)
    );

    if (productIndex !== -1) {
      const quantity = --foundCart.products[productIndex].quantity;
      const unitPrice = foundCart.products[productIndex].unitPrice;
      foundCart.products[productIndex].totalPrice = quantity * unitPrice;
      quantity == 0 ? foundCart.products.splice(productIndex, 1) : "";
    } else {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    foundCart.markModified("products");
    await foundCart.save();

    return res.status(200).json({ message: "Succesfully deleted", foundCart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addItemToCart = async (req, res) => {
  const { userId, userRoleToken } = req.userToken;
  const { id } = req.params;

  try {
    const foundProduct = await Product.findById(id);
    let foundCart = await Cart.findOne({ ownerId: userId });

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!foundCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (foundCart.ownerId !== userId && userRoleToken !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const productIndex = foundCart.products.findIndex((product) =>
      product._id.equals(foundProduct._id)
    );

    if (productIndex !== -1) {
      const quantity = ++foundCart.products[productIndex].quantity;
      const unitPrice = foundCart.products[productIndex].unitPrice;
      foundCart.products[productIndex].totalPrice = quantity * unitPrice;
    } else {
      foundCart.products.push({
        name: foundProduct.name,
        description: foundProduct.description,
        category: foundProduct.category,
        images: foundProduct.images,
        unitPrice: foundProduct.price,
        totalPrice: foundProduct.price,
        quantity: 1,
        _id: foundProduct._id,
      });
    }

    foundCart.markModified("products");
    await foundCart.save();

    return res.status(200).json({ message: "Succesfully added", foundCart });
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

    return res.status(200).json({ message: "Succesfully deleted", userCart });
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
