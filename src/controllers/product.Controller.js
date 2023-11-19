import Product from "../models/product.Model.js";
import { validateProductsLength } from "../helpers/validateProductsLenght.js";
import { LOGIN_ADMIN_TOKEN } from "../config.js";


export const createProduct = async (req, res) => {
    let { userRoleToken } = req.userToken;
    let { name, description, price, category, images } = req.body;

    try {
        if (userRoleToken !== LOGIN_ADMIN_TOKEN) {
            return res.status(403).json({ message: "permission denied" });
        }

        const newProduct = await Product.create({
            name: name,
            description: description,
            email: email,
            price: price,
            category: category,
            images: images
          });

          res.status(201).json({ id: newProduct._id });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
   

};

export const updateProduct = async (req, res) => {
  let { id } = req.params;
  let { userRoleToken } = req.userToken;
  let { updateFields } = req.body;

  try {
    
    if (userRoleToken !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "permission denied" });
    }

    const result = await Product.updateOne({ _id: productId }, { $set: updateFields });
    
    if (result.nModified > 0) {
     return res.status(200).json({ success: true, message: 'Product updated successfully.' });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  let { userRole } = req.userToken;
  let { id } = req.params;

  try {
    let productFound = await Product.findById(id);

    if (!productFound) {
      return res.status(404).json({ message: "no encontrado" });
    }

    if (userRole !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "permission denied" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  const { category, name, price } = req.query;
  const priceSortQuery = price == "asc" ? 1 : -1;
  const partialMatchName = new RegExp(name, "i");

  try {
    let products;

    if (name && category && price) {
      products = await Product.find({
        name: { $regex: partialMatchName },
        category: category,
      }).sort({ price: priceSortQuery });

      return res.status(validateProductsLength(products.length)).json(products)
    }

    if (name && category) {
      products = await Product.find({
        name: { $regex: partialMatchName },
        category: category,
      });

      return res.status(validateProductsLength(products.length)).json(products)
    }

    if (name && price) {
      products = await Product.find({
        name: { $regex: partialMatchName },
      }).sort({ price: priceSortQuery });

      return res.status(validateProductsLength(products.length)).json(products)
    }

    if (category && price) {
      products = await Product.find({ category: category }).sort({
        price: priceSortQuery,
      });

      return res.status(validateProductsLength(products.length)).json(products)
    }

    if (name) {
      products = await Product.find({ name: { $regex: partialMatchName } });

      return res.status(validateProductsLength(products.length)).json(products)
    }

    if (category) {
      products = await Product.find({ category: category });

      return res.status(validateProductsLength(products.length)).json(products)
    }

    if (price) {
      products = await Product.find({}).sort({ price: priceSortQuery });

      return res.status(validateProductsLength(products.length)).json(products)
    }

  
    products = await Product.find();
    res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
