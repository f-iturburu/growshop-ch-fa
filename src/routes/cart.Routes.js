import { Router } from "express";
import {getCart, addItemToCart, deleteItemFromCart, deleteAllProducts} from "../controllers/cart.Controller.js"
import { verifyUserToken } from "../helpers/verifyUserToken.js";
const router = Router();

router.post("/cart/:id",verifyUserToken, addItemToCart)
router.delete("/cart/:id",verifyUserToken, deleteItemFromCart )
router.delete("/cart",verifyUserToken, deleteAllProducts)
router.get("/cart",verifyUserToken, getCart)
export default router