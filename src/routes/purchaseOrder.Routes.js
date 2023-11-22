import { Router } from "express";
import { verifyUserToken } from "../helpers/verifyUserToken.js";
import {
  getPurchases,
  postPurchase,
} from "../controllers/purchaseOrder.controller.js";

const router = Router();
router.post("/purchase", verifyUserToken, postPurchase);
router.get("/purchases", verifyUserToken, getPurchases);

export default router;
