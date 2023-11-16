import { Router } from "express";
import { verifyUserToken } from "../helpers/verifyUserToken.js";
import {getProducts,createProduct, updateProduct, deleteProduct} from "../controllers/product.Controller.js"
const router = Router();

router.post("/product",verifyUserToken,createProduct)
router.patch("/product/:id",verifyUserToken, updateProduct)
router.delete("/product/:id",verifyUserToken, deleteProduct)
router.get("/products", getProducts)

export default router